import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportProducts() {
  try {
    console.log('📦 Exporting products from database...');

    // Tüm products'ları ilişkileriyle birlikte al
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ Found ${products.length} products`);

    // Products'ları dönüştür (categories array olarak)
    const transformedProducts = products.map((product) => ({
      ...product,
      categories: product.categories.map((pc) => pc.category),
    }));

    // Export klasörü oluştur
    const exportDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // JSON dosyasına kaydet
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `products-export-${timestamp}.json`;
    const filepath = path.join(exportDir, filename);

    fs.writeFileSync(
      filepath,
      JSON.stringify(transformedProducts, null, 2),
      'utf-8',
    );

    console.log(`✅ Products exported successfully to: ${filepath}`);
    console.log(`📊 Total products: ${products.length}`);

    // Özet bilgi
    const watchCount = products.filter((p) => p.type === 'WATCH').length;
    const jewelleryCount = products.filter(
      (p) => p.type === 'JEWELLERY',
    ).length;
    const activeCount = products.filter((p) => p.status === 'ACTIVE').length;

    console.log('\n📈 Summary:');
    console.log(`   - Watches: ${watchCount}`);
    console.log(`   - Jewellery: ${jewelleryCount}`);
    console.log(`   - Active: ${activeCount}`);
    console.log(`   - Inactive: ${products.length - activeCount}`);

    return filepath;
  } catch (error) {
    console.error('❌ Error exporting products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
exportProducts()
  .then(() => {
    console.log('\n✨ Export completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Export failed:', error);
    process.exit(1);
  });
