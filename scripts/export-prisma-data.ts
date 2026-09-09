import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportAll() {
  const outDir = path.join(process.cwd(), 'exports');
  fs.mkdirSync(outDir, { recursive: true });

  /* -----------------------------
     BRAND
  ----------------------------- */
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  fs.writeFileSync(
    path.join(outDir, 'brands.json'),
    JSON.stringify(brands, null, 2),
    'utf8',
  );

  /* -----------------------------
     CATEGORY
  ----------------------------- */
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  fs.writeFileSync(
    path.join(outDir, 'categories.json'),
    JSON.stringify(categories, null, 2),
    'utf8',
  );

  /* -----------------------------
     PRODUCT
  ----------------------------- */
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  fs.writeFileSync(
    path.join(outDir, 'products.json'),
    JSON.stringify(products, null, 2),
    'utf8',
  );

  /* -----------------------------
     PRODUCT CATEGORY (JUNCTION)
  ----------------------------- */
  const productCategories = await prisma.productCategory.findMany({
    orderBy: { createdAt: 'desc' },
  });

  fs.writeFileSync(
    path.join(outDir, 'product-categories.json'),
    JSON.stringify(productCategories, null, 2),
    'utf8',
  );

  console.log('✅ Prisma export completed');
  console.log(`📁 Folder: ${outDir}`);
  console.log(`   - brands.json (${brands.length})`);
  console.log(`   - categories.json (${categories.length})`);
  console.log(`   - products.json (${products.length})`);
  console.log(`   - product-categories.json (${productCategories.length})`);

  await prisma.$disconnect();
}

/* -----------------------------
   CLI
----------------------------- */

exportAll().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
