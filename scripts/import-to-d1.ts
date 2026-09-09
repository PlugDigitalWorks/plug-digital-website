import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// D1 database'e import etmek için Worker environment'ı simüle et
// Bu script'i wrangler d1 execute ile çalıştıracağız

interface ImportData {
  brands: any[];
  categories: any[];
  products: any[];
  productCategories: any[];
}

async function importToD1(jsonFilePath: string) {
  // JSON dosyasını oku
  const fullPath = path.isAbsolute(jsonFilePath)
    ? jsonFilePath
    : path.join(process.cwd(), jsonFilePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const data: ImportData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  console.log('📦 Importing data to D1...');
  console.log(`   - Brands: ${data.brands.length}`);
  console.log(`   - Categories: ${data.categories.length}`);
  console.log(`   - Products: ${data.products.length}`);
  console.log(`   - ProductCategories: ${data.productCategories.length}`);

  // Bu script'i wrangler d1 execute ile çalıştıracağız
  // Bu yüzden SQL komutları oluşturuyoruz
  const sqlCommands: string[] = [];

  // 1. Clear existing data
  sqlCommands.push('DELETE FROM ProductCategory;');
  sqlCommands.push('DELETE FROM Product;');
  sqlCommands.push('DELETE FROM Category;');
  sqlCommands.push('DELETE FROM Brand;');

  // Helper function to escape SQL strings
  const escapeSql = (str: string): string => {
    return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
  };

  // 2. Insert Brands
  for (const brand of data.brands) {
    const values = [
      `'${escapeSql(brand.id)}'`,
      `'${escapeSql(brand.name)}'`,
      `'${escapeSql(brand.type)}'`,
      brand.description ? `'${escapeSql(brand.description)}'` : 'NULL',
      brand.createdAt ? `'${escapeSql(brand.createdAt)}'` : 'NULL',
      brand.updatedAt ? `'${escapeSql(brand.updatedAt)}'` : 'NULL',
    ];
    sqlCommands.push(
      `INSERT INTO Brand (id, name, type, description, createdAt, updatedAt) VALUES (${values.join(', ')});`,
    );
  }

  // 3. Insert Categories
  for (const category of data.categories) {
    const values = [
      `'${escapeSql(category.id)}'`,
      `'${escapeSql(category.name)}'`,
      `'${escapeSql(category.type)}'`,
      category.description ? `'${escapeSql(category.description)}'` : 'NULL',
      category.createdAt ? `'${escapeSql(category.createdAt)}'` : 'NULL',
      category.updatedAt ? `'${escapeSql(category.updatedAt)}'` : 'NULL',
    ];
    sqlCommands.push(
      `INSERT INTO Category (id, name, type, description, createdAt, updatedAt) VALUES (${values.join(', ')});`,
    );
  }

  // 4. Insert Products
  for (const product of data.products) {
    const imagesJson = JSON.stringify(product.images || []);
    const guaranteeJson = JSON.stringify(product.guarantee || []);
    const basicInfoJson = JSON.stringify(product.basicInfo || {});
    const additionalInfoJson = JSON.stringify(product.additionalInfo || {});

    const values = [
      `'${escapeSql(product.id)}'`,
      `'${escapeSql(product.slug)}'`,
      `'${escapeSql(product.type)}'`,
      `'${escapeSql(product.title)}'`,
      product.subtitle ? `'${escapeSql(product.subtitle)}'` : 'NULL',
      product.reference ? `'${escapeSql(product.reference)}'` : 'NULL',
      product.price?.toString() || '0',
      product.description ? `'${escapeSql(product.description)}'` : 'NULL',
      product.stock?.toString() || '0',
      `'${escapeSql(product.status)}'`,
      `'${escapeSql(imagesJson)}'`,
      `'${escapeSql(guaranteeJson)}'`,
      `'${escapeSql(basicInfoJson)}'`,
      `'${escapeSql(additionalInfoJson)}'`,
      `'${escapeSql(product.brandId)}'`,
      product.createdAt ? `'${escapeSql(product.createdAt)}'` : 'NULL',
      product.updatedAt ? `'${escapeSql(product.updatedAt)}'` : 'NULL',
    ];
    sqlCommands.push(
      `INSERT INTO Product (id, slug, type, title, subtitle, reference, price, description, stock, status, images, guarantee, basicInfo, additionalInfo, brandId, createdAt, updatedAt) VALUES (${values.join(', ')});`,
    );
  }

  // 5. Insert ProductCategories
  for (const pc of data.productCategories) {
    sqlCommands.push(
      `INSERT INTO ProductCategory (productId, categoryId, createdAt, updatedAt) VALUES ('${pc.productId}', '${pc.categoryId}', '${pc.createdAt || new Date().toISOString()}', '${pc.updatedAt || new Date().toISOString()}');`,
    );
  }

  // SQL dosyasına kaydet
  const sqlPath = path.join(process.cwd(), 'exports', 'import-to-d1.sql');
  fs.writeFileSync(sqlPath, sqlCommands.join('\n'), 'utf8');

  console.log(`✅ SQL file created: ${sqlPath}`);
  console.log(`📝 Total SQL commands: ${sqlCommands.length}`);
  console.log('\n📋 Next steps:');
  console.log('   1. Review the SQL file: exports/import-to-d1.sql');
  console.log('   2. Run: npx wrangler d1 execute DB --file exports/import-to-d1.sql --remote');
}

const [, , jsonFile] = process.argv;

if (!jsonFile) {
  console.error('Usage: tsx scripts/import-to-d1.ts <json-file>');
  console.error('Example: tsx scripts/import-to-d1.ts exports/wordpress-products.json');
  process.exit(1);
}

importToD1(jsonFile).catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
