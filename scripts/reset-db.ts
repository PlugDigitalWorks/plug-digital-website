import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🧹 Resetting product-related tables...');

    // Foreign key order: ProductCategory -> Product -> Category/Brand
    await prisma.productCategory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();

    console.log('✅ Product, category, brand and junction tables cleared.');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('✨ Reset complete.');
      process.exit(0);
    })
    .catch(() => process.exit(1));
}

export default resetDatabase;
