import { PrismaClient, ProductType, ProductStatus } from "@prisma/client";

/* -------------------------------------------------
   HELPERS
------------------------------------------------- */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const cleanHtml = (html?: string): string => {
  if (!html) return "";
  return html
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const hashUrl = (url: string): string => {
  // URL'den dosya adını al
  const filename = url.split("/").pop() || "";

  // Uzantıyı kaldır (son .'dan sonrasını kes)
  const lastDotIndex = filename.lastIndexOf(".");
  const nameWithoutExt =
    lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;

  // Özel karakterleri temizle, sadece alfanumerik ve tire bırak
  const cleaned = nameWithoutExt
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .substring(0, 100); // Max 100 karakter

  // Eğer çok kısa veya boşsa, URL'den hash oluştur
  if (cleaned.length < 3) {
    // URL'den SHA1 benzeri bir hash oluştur (basit)
    let hash = "";
    for (let i = 0; i < url.length && hash.length < 20; i++) {
      const char = url.charCodeAt(i);
      if ((char >= 48 && char <= 57) || (char >= 97 && char <= 122)) {
        hash += url[i].toLowerCase();
      }
    }
    return (
      hash ||
      "image-" +
        Math.abs(
          url.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
        ).toString(36)
    );
  }

  return cleaned;
};

/* -------------------------------------------------
   IMAGE HANDLING (CLOUDINARY REST API)
------------------------------------------------- */

async function uploadImageToCloudinary(
  url: string,
  env: {
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
  },
): Promise<string> {
  // Cloudinary credentials yoksa orijinal URL'i döndür
  if (
    !env.CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET
  ) {
    console.warn("⚠️ Cloudinary credentials missing, using original URL");
    return url;
  }

  const hash = hashUrl(url);
  // public_id sadece hash olmalı, folder ayrı parametre olarak gönderilecek
  const publicId = hash;
  const folder = "pacha-london/products";

  // Check if already exists (Cloudinary Admin API)
  // Cloudinary Admin API: GET /resources/image/upload/{folder}/{public_id}
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    // Signature için: public_id + timestamp + api_secret (sorted alphabetically)
    // Admin API için folder'ı public_id'ye dahil etmemiz gerekiyor
    const fullPublicId = `${folder}/${publicId}`;
    const checkParams = `public_id=${encodeURIComponent(fullPublicId)}&timestamp=${timestamp}`;
    const checkSignature = await generateCloudinarySignature(
      checkParams,
      env.CLOUDINARY_API_SECRET,
    );

    // Admin API endpoint: /resources/image/upload/{folder}/{public_id}
    const checkUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/resources/image/upload/${encodeURIComponent(fullPublicId)}?api_key=${env.CLOUDINARY_API_KEY}&timestamp=${timestamp}&signature=${checkSignature}`;

    const checkRes = await fetch(checkUrl);
    if (checkRes.ok) {
      const existing = (await checkRes.json()) as { secure_url: string };
      if (existing.secure_url) {
        console.log(
          `   ✅ Image already exists in Cloudinary: ${fullPublicId}`,
        );
        return existing.secure_url;
      }
    } else {
      // 404 means not found, will upload
      console.log(
        `   📤 Image not found in Cloudinary (${checkRes.status}), will upload: ${fullPublicId}`,
      );
    }
  } catch (e: any) {
    // Resource not found → will upload
    console.log(
      `   📤 Image check failed, will upload: ${publicId} (${e.message})`,
    );
  }

  // Upload to Cloudinary using remote URL (Cloudinary will download and upload automatically)
  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature için parametreler alfabetik sırada ve URL encode edilmiş olmalı
  // Signature'a dahil edilecek parametreler: folder, public_id, timestamp
  // file ve api_key signature'a dahil edilmez!
  // public_id sadece hash olmalı, folder ayrı parametre
  const signatureParams = [
    `folder=${encodeURIComponent(folder)}`,
    `public_id=${encodeURIComponent(publicId)}`, // Sadece hash, folder yok
    `timestamp=${timestamp}`,
  ].join("&");

  const signature = await generateCloudinarySignature(
    signatureParams,
    env.CLOUDINARY_API_SECRET,
  );

  const formData = new FormData();
  formData.append("file", url); // Remote URL string (FormData otomatik encode eder)
  formData.append("folder", folder);
  formData.append("public_id", publicId); // Sadece hash, folder yok
  formData.append("api_key", env.CLOUDINARY_API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

  try {
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error(`Cloudinary upload failed for ${url}:`, errorText);
      return url; // Hata durumunda orijinal URL'i döndür
    }

    const result = (await uploadRes.json()) as { secure_url: string };
    console.log(`   ✅ Uploaded to Cloudinary: ${result.secure_url}`);
    return result.secure_url;
  } catch (e: any) {
    console.error(`Cloudinary upload error for ${url}:`, e.message);
    return url; // Hata durumunda orijinal URL'i döndür
  }
}

// Cloudinary signature generator (SHA1)
async function generateCloudinarySignature(
  params: string,
  apiSecret: string,
): Promise<string> {
  // Cloudinary signature: SHA1(params + apiSecret)
  const message = params + apiSecret;
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function collectImageUrls(wp: any): string[] {
  const urls: string[] = [];

  if (Array.isArray(wp.images)) {
    urls.push(...wp.images);
  }

  if (typeof wp.additionalInfo?.Images === "string") {
    urls.push(
      ...wp.additionalInfo.Images.split(",")
        .map((i: string) => i.trim())
        .filter((i: string) => i.startsWith("http")),
    );
  }

  return [...new Set(urls.filter((u) => u && u.startsWith("http")))];
}

async function uploadImages(
  urls: string[],
  env: {
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
  },
): Promise<string[]> {
  const uploaded: string[] = [];
  for (const url of urls) {
    try {
      console.log(`   📤 Image check/upload: ${url}`);
      const cloudUrl = await uploadImageToCloudinary(url, env);
      uploaded.push(cloudUrl);
    } catch (e: any) {
      console.error(`   ⚠️ Image failed: ${url}`, e.message);
    }
  }
  return uploaded;
}

/* -------------------------------------------------
   BASIC INFO (UI TABLE)
------------------------------------------------- */

function buildBasicInfo(wp: any): Record<string, string> {
  const src = { ...wp.basicInfo, ...wp.additionalInfo };
  const out: Record<string, string> = {};

  const pick = (label: string, key: string) => {
    const v = src[key];
    if (v && typeof v === "string" && !v.startsWith("field_")) {
      out[label] = v;
    }
  };

  pick("Condition", "Meta: condition");
  pick("Gender", "Meta: gender");
  pick("Year", "Meta: year");
  pick("Case Size", "Meta: case_diameter");
  pick("Case Material", "Meta: case_material");
  pick("Dial", "Meta: dial");
  pick("Movement", "Meta: movement");
  pick("Bracelet", "Meta: bracelet_material");
  pick("Box", "Meta: box");
  pick("Papers", "Meta: paper");
  pick("Location", "Meta: location");

  return out;
}

/* -------------------------------------------------
   SEO + ADDITIONAL INFO
------------------------------------------------- */

function buildSeo(product: {
  brand: string;
  title: string;
  reference: string;
  description?: string;
}) {
  const baseDesc =
    product.description ||
    `Discover ${product.brand} ${product.title} available at Pacha of London.`;

  const trimmed =
    baseDesc.length > 160
      ? baseDesc.substring(0, baseDesc.lastIndexOf(" ", 155))
      : baseDesc;

  return {
    title:
      `${product.brand} ${product.title} ${product.reference} | Pacha of London`.trim(),
    description: trimmed,
  };
}

function buildAdditionalInfo(wp: any, seo: any): Record<string, any> {
  const src = { ...wp.basicInfo, ...wp.additionalInfo };

  const pick = (key: string) =>
    src[key] && typeof src[key] === "string" && !src[key].startsWith("field_")
      ? src[key]
      : null;

  return {
    movement: pick("Meta: movement"),
    caseDiameter: pick("Meta: case_diameter")
      ? Number(pick("Meta: case_diameter"))
      : null,
    glass: pick("Meta: glass"),
    dial: pick("Meta: dial"),
    braceletMaterial: pick("Meta: bracelet_material"),
    bezelMaterial: pick("Meta: material_bezel"),
    seo,
  };
}

/* -------------------------------------------------
   DB HELPERS
------------------------------------------------- */

async function ensureBrand(
  prisma: PrismaClient,
  name: string,
  type: ProductType,
) {
  const found = await prisma.brand.findFirst({ where: { name, type } });
  if (found) return found;

  return prisma.brand.create({
    data: {
      name,
      type,
      description: `${name} ${type.toLowerCase()}`,
      slug: "",
    },
  });
}

async function ensureCategory(
  prisma: PrismaClient,
  name: string,
  type: ProductType,
) {
  const found = await prisma.category.findFirst({ where: { name } });
  if (found) return found;

  return prisma.category.create({
    data: {
      name,
      type,
      description: `${name} ${type.toLowerCase()}`,
      slug: "",
    },
  });
}

async function relinkCategories(
  prisma: PrismaClient,
  productId: string,
  categoryIds: string[],
) {
  await prisma.$executeRaw`DELETE FROM "ProductCategory" WHERE "productId" = ${productId}`;

  if (categoryIds.length) {
    const values = categoryIds
      .map((cid) => `('${productId}','${cid}')`)
      .join(",");
    await prisma.$executeRawUnsafe(
      `INSERT OR IGNORE INTO "ProductCategory" ("productId","categoryId") VALUES ${values}`,
    );
  }
}

/* -------------------------------------------------
   MAIN IMPORT
------------------------------------------------- */

export async function importProducts(
  prisma: PrismaClient,
  products: any[],
  env: {
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
  },
) {
  let successCount = 0;
  let errorCount = 0;

  for (const wp of products) {
    const title =
      wp.title || wp.additionalInfo?.Name || wp.additionalInfo?.name;

    if (!title) {
      console.warn(
        `   ⚠️ Skipping product because no title found (reference=${wp.reference || wp.basicInfo?.["Meta: ref_no"]})`,
      );
      errorCount++;
      continue;
    }

    console.log(`\n🔄 Importing: ${title}`);

    try {
      const slug = slugify(title);
      const reference =
        wp.reference || wp.basicInfo?.["Meta: ref_no"] || slug.toUpperCase();
      const price = Number(
        wp.price || wp.additionalInfo?.["Regular price"] || 0,
      );
      const description = cleanHtml(
        wp.description || wp.additionalInfo?.Description,
      );
      const stock =
        wp.stock ?? (wp.additionalInfo?.["In stock?"] === "1" ? 1 : 0);

      const type: ProductType =
        wp.type ||
        (wp.additionalInfo?.Categories?.toLowerCase().includes("jewellery")
          ? ProductType.JEWELLERY
          : ProductType.WATCH);

      const brandName =
        wp.brand ||
        (wp.additionalInfo?.Categories
          ? wp.additionalInfo.Categories.split(">")
              .pop()
              ?.trim()
              .toUpperCase() || ""
          : "");

      if (!brandName) {
        console.warn(`   ⚠️ Skipping product: no brand found`);
        errorCount++;
        continue;
      }

      const brand = await ensureBrand(prisma, brandName, type);

      const imageUrls = collectImageUrls(wp);
      const images = imageUrls.length ? await uploadImages(imageUrls, env) : [];

      const seo = buildSeo({
        brand: brand.name,
        title,
        reference,
        description,
      });

      const product = await prisma.product.upsert({
        where: { slug },
        update: {
          title,
          subtitle: wp.subtitle || null,
          reference,
          price,
          description,
          stock,
          status: wp.status || ProductStatus.ACTIVE,
          images,
          guarantee: wp.guarantee || ["Authenticity Guarantee"],
          basicInfo: wp.basicInfo || buildBasicInfo(wp),
          additionalInfo: {
            ...(wp.additionalInfo || {}),
            ...buildAdditionalInfo(wp, seo),
          },
          brandId: brand.id,
        },
        create: {
          slug,
          type,
          title,
          subtitle: wp.subtitle || null,
          reference,
          price,
          description,
          stock,
          status: wp.status || ProductStatus.ACTIVE,
          images,
          guarantee: wp.guarantee || ["Authenticity Guarantee"],
          basicInfo: wp.basicInfo || buildBasicInfo(wp),
          additionalInfo: {
            ...(wp.additionalInfo || {}),
            ...buildAdditionalInfo(wp, seo),
          },
          brandId: brand.id,
        },
      });

      // Link categories
      if (
        wp.categories &&
        Array.isArray(wp.categories) &&
        wp.categories.length > 0
      ) {
        const categoryIds: string[] = [];
        for (const categoryName of wp.categories) {
          const category = await ensureCategory(prisma, categoryName, type);
          categoryIds.push(category.id);
        }
        await relinkCategories(prisma, product.id, categoryIds);
      }

      console.log(`   ✅ Imported: ${product.title}`);
      successCount++;
    } catch (e: any) {
      console.error(`   ❌ Error importing ${title}:`, e.message);
      errorCount++;
    }
  }

  return { successCount, errorCount };
}
