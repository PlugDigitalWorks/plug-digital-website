# Cloudflare Worker Error 1102 — Root Cause Analysis

## STEP 1 — Risky Patterns Found

| File | Pattern | Severity |
|------|---------|----------|
| `src/app/api/products/route.ts` | GET loads **all** products (no default limit) | **CRITICAL** |
| `src/app/(admin)/admin/page.tsx` | Fetches `/api/products` to get count — loads all products into memory | **CRITICAL** |
| `src/app/(admin)/admin/products/page.tsx` | Fetches `/api/products` — loads all products | **CRITICAL** |
| `src/app/api/admin/checkout-forms/route.ts` | `findMany()` with no limit — loads all checkout forms | **HIGH** |
| `src/app/api/database/stats/route.ts` | 6× `findMany()` with **no take** — loads full tables as "sample" | **CRITICAL** |
| `src/app/api/categories/route.ts` | Slug fetch includes ALL products in category (unbounded) | **HIGH** |
| `src/lib/cloudinary-edge.ts` | `fileToBase64` — char-by-char sync loop on large files | **MEDIUM** |
| `src/app/(main)/watch/page.tsx`, `bag/page.tsx`, etc. | Server fetch to `BASE_URL` = worker calling itself | **MEDIUM** |
| `src/components/layout/Header.tsx` | 4 parallel fetches on every header render (client) | **LOW** |

---

## STEP 2 — Why Each Triggers Error 1102

### 1. `/api/products` GET (no limit)
- **Why:** With hundreds of products, `findMany` returns all rows. JSON serialization + response size blows memory. Worker CPU limit (~10ms) exceeded during Prisma query + transform.
- **When:** Admin dashboard load, products page, any caller of `/api/products`.

### 2. Admin dashboard `loadStats()`
- **Why:** Fetches all products just to get `length`. Doubles impact: full products array in Worker A, then JSON parse in Worker B (if RSC). With 500+ products this easily exceeds 128MB memory.

### 3. `/api/admin/checkout-forms` (no pagination)
- **Why:** `findMany` loads all orders. Each has `cartItems` JSON. Memory spikes; CPU spent serializing.

### 4. `/api/database/stats`
- **Why:** 6 parallel `findMany()` with no `take`. Products, categories, brands, forms, admins — all full tables. E.g. 1000 products × 6 tables = massive payload.

### 5. Categories by slug (includes products)
- **Why:** `include: { products: { include: { product: { include: { brand } } } } }` — loads every product in category. A category with 200 watches = 200 full product objects.

### 6. `fileToBase64` char-by-char loop
- **Why:** Sync loop `for (let j = 0; j < chunk.length; j++)` blocks event loop. Large images = long CPU burst → Worker CPU limit.

### 7. SSR fetch to `BASE_URL`
- **Why:** During SSR, `fetch(BASE_URL/api/...)` hits the same Worker. Doubles CPU/memory for that request. On cold start + heavy page, triggers 1102.

### 8. Header 4× fetch
- **Why:** Client-side, so less critical. But 4 concurrent requests can stress connection limits; if cached poorly, amplifies load.

---

## STEP 3 — Exact Code Fixes (Applied)

| File | Fix |
|------|-----|
| `src/app/api/products/route.ts` | Default `limit=100`, max 500; `?countOnly=true` returns `{ count }`; `?page=N` enables pagination with `{ products, pagination }` |
| `src/app/(admin)/admin/page.tsx` | Dashboard uses `?countOnly=true` for product count; sell-watch-forms uses `?limit=1` and `pagination.total` |
| `src/app/(admin)/admin/products/page.tsx` | Fetches `?page=N&limit=50`; handles `{ products, pagination }`; Previous/Next pagination UI |
| `src/app/api/database/stats/route.ts` | All sample `findMany` use `take: 5` |
| `src/app/api/admin/checkout-forms/route.ts` | Pagination with `page`, `limit` (default 30); returns `{ forms, pagination }` |
| `src/app/(admin)/admin/checkout-forms/page.tsx` | Fetches paginated; Previous/Next UI |
| `src/app/api/categories/route.ts` | Category by slug: removed unbounded `include: { products }` — use `/api/products/*?category=` for products |

---

## STEP 4 — Cloudflare Workers–Specific Improvements

1. **Default limits everywhere**  
   All `findMany()` should have `take` (e.g. 50–100) unless paginated.

2. **Use `count()` for stats**  
   Never load full collections to compute `length`. Use `prisma.x.count()`.

3. **Avoid self-fetch in SSR**  
   For `/watch`, `/bag`, etc.: call Prisma (or a shared data layer) directly instead of `fetch(BASE_URL/api/...)`. Keeps work in one Worker invocation.

4. **Limit includes**  
   For category-by-slug: don’t include all products. Use a separate paginated products API.

5. **Stream large responses**  
   For large lists, prefer streaming (`ReadableStream`) over one big JSON blob.

6. **Concurrency caps**  
   Limit parallel `Promise.all` size (e.g. max 3–4 concurrent DB/network calls).

7. **`select` instead of full objects**  
   Use `select: { id: true, name: true }` when you only need a few fields.
