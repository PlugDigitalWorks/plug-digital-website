import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportToWordPressJson() {
  console.log('📦 Exporting data from dev.db...');

  // Tüm verileri al
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const productCategories = await prisma.productCategory.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Tek bir JSON objesi oluştur
  const exportData = {
    brands,
    categories,
    products,
    productCategories,
  };

  // Export klasörü oluştur
  const outDir = path.join(process.cwd(), 'exports');
  fs.mkdirSync(outDir, { recursive: true });

  // JSON dosyasına kaydet
  const outputPath = path.join(outDir, 'wordpress-products.json');
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf8');

  console.log('✅ Export completed!');
  console.log(`📁 File: ${outputPath}`);
  console.log(`   - Brands: ${brands.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - ProductCategories: ${productCategories.length}`);

  await prisma.$disconnect();
}

exportToWordPressJson().catch((err) => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
