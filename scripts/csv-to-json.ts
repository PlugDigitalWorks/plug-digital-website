import * as fs from 'fs';
import * as path from 'path';

// Basit CSV parser (quoted fields, commas, newlines destekler)
function parseCSV(csvContent: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;

  while (i < csvContent.length) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i += 2;
        continue;
      }
      // Toggle quote state
      insideQuotes = !insideQuotes;
      i++;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      // Field separator
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
      continue;
    }

    if ((char === '\n' || char === '\r') && !insideQuotes) {
      // Row separator
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        currentField = '';
        if (currentRow.some((field) => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
      }
      // Skip \r\n combination
      if (char === '\r' && nextChar === '\n') {
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    currentField += char;
    i++;
  }

  // Son field'ı ekle
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// CSV satırlarını objelere dönüştür
function csvToJSON(csvRows: string[][]): Record<string, any>[] {
  if (csvRows.length === 0) {
    return [];
  }

  // İlk satır header
  const headers = csvRows[0].map((h) => h.trim());
  const data: Record<string, any>[] = [];

  // Her satırı obje olarak dönüştür
  for (let i = 1; i < csvRows.length; i++) {
    const row = csvRows[i];
    const obj: Record<string, any> = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = row[j] || '';

      // Boş string'leri null yap
      obj[header] = value === '' ? null : value;
    }

    // Boş satırları atla
    if (Object.values(obj).some((v) => v !== null && v !== '')) {
      data.push(obj);
    }
  }

  return data;
}

// WordPress product formatına dönüştür
function transformToWordPressFormat(csvData: Record<string, any>[]): any[] {
  return csvData.map((row) => {
    // CSV kolonlarını WordPress product formatına map et
    // Bu mapping'i CSV'nizin kolonlarına göre özelleştirmeniz gerekebilir

    const product: any = {
      title: row.title || row.name || row.product_name || '',
      subtitle: row.subtitle || row.short_description || null,
      reference: row.reference || row.sku || row.product_id || '',
      price: parseFloat(row.price || row.price_gbp || '0') || 0,
      description: row.description || row.long_description || null,
      stock: parseInt(row.stock || row.quantity || '0') || 0,
      status: (row.status || 'ACTIVE').toUpperCase(),
      type: (row.type || row.product_type || 'WATCH').toUpperCase(),
      brand: row.brand || row.brand_name || '',
      categories: [],
      images: [],
      guarantee: [],
      basicInfo: {},
      additionalInfo: {},
    };

    // Categories - virgülle ayrılmış string veya array olabilir
    if (row.categories) {
      if (typeof row.categories === 'string') {
        product.categories = row.categories
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => c.length > 0);
      } else if (Array.isArray(row.categories)) {
        product.categories = row.categories;
      }
    }

    // Images - virgülle ayrılmış string veya array olabilir
    if (row.images || row.image_urls || row.image) {
      const imageField = row.images || row.image_urls || row.image;
      if (typeof imageField === 'string') {
        product.images = imageField
          .split(',')
          .map((img: string) => img.trim())
          .filter((img: string) => img.length > 0);
      } else if (Array.isArray(imageField)) {
        product.images = imageField;
      }
    }

    // Guarantee - virgülle ayrılmış string veya array olabilir
    if (row.guarantee || row.guarantees) {
      const guaranteeField = row.guarantee || row.guarantees;
      if (typeof guaranteeField === 'string') {
        product.guarantee = guaranteeField
          .split(',')
          .map((g: string) => g.trim())
          .filter((g: string) => g.length > 0);
      } else if (Array.isArray(guaranteeField)) {
        product.guarantee = guaranteeField;
      }
    }

    // BasicInfo - JSON string veya object olabilir
    if (row.basic_info || row.basicInfo) {
      const basicInfoField = row.basic_info || row.basicInfo;
      try {
        product.basicInfo =
          typeof basicInfoField === 'string'
            ? JSON.parse(basicInfoField)
            : basicInfoField;
      } catch {
        // JSON parse edilemezse, key-value çiftleri olarak parse et
        product.basicInfo = {};
      }
    }

    // AdditionalInfo - JSON string veya object olabilir
    if (row.additional_info || row.additionalInfo) {
      const additionalInfoField = row.additional_info || row.additionalInfo;
      try {
        product.additionalInfo =
          typeof additionalInfoField === 'string'
            ? JSON.parse(additionalInfoField)
            : additionalInfoField;
      } catch {
        product.additionalInfo = {};
      }
    }

    // Diğer tüm kolonları basicInfo veya additionalInfo'ya ekle
    // (eğer özel mapping yoksa)
    const knownFields = [
      'title',
      'subtitle',
      'reference',
      'price',
      'description',
      'stock',
      'status',
      'type',
      'brand',
      'categories',
      'images',
      'guarantee',
      'basic_info',
      'basicInfo',
      'additional_info',
      'additionalInfo',
      'name',
      'product_name',
      'sku',
      'product_id',
      'short_description',
      'long_description',
      'price_gbp',
      'quantity',
      'product_type',
      'brand_name',
      'image',
      'image_urls',
      'guarantees',
    ];

    for (const [key, value] of Object.entries(row)) {
      if (!knownFields.includes(key) && value !== null && value !== '') {
        // Eğer key basicInfo'ya ait gibi görünüyorsa oraya ekle
        if (
          key.toLowerCase().includes('year') ||
          key.toLowerCase().includes('condition') ||
          key.toLowerCase().includes('box') ||
          key.toLowerCase().includes('papers') ||
          key.toLowerCase().includes('gender') ||
          key.toLowerCase().includes('location') ||
          key.toLowerCase().includes('delivery') ||
          key.toLowerCase().includes('movement') ||
          key.toLowerCase().includes('material') ||
          key.toLowerCase().includes('ref')
        ) {
          product.basicInfo[key] = value;
        } else {
          // Diğerleri additionalInfo'ya
          product.additionalInfo[key] = value;
        }
      }
    }

    return product;
  });
}

async function convertCSVToJSON(csvFilePath: string, outputPath?: string) {
  try {
    console.log(`📄 Reading CSV file: ${csvFilePath}`);

    // Dosya yolu kontrolü
    const fullPath = path.isAbsolute(csvFilePath)
      ? csvFilePath
      : path.join(process.cwd(), csvFilePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    // CSV dosyasını oku
    const csvContent = fs.readFileSync(fullPath, 'utf-8');
    console.log(
      `✅ CSV file read successfully (${csvContent.length} characters)`,
    );

    // CSV'yi parse et
    console.log('🔄 Parsing CSV...');
    const csvRows = parseCSV(csvContent);
    console.log(`✅ Parsed ${csvRows.length} rows (including header)`);

    if (csvRows.length < 2) {
      throw new Error(
        'CSV file must have at least a header row and one data row',
      );
    }

    // JSON'a dönüştür
    console.log('🔄 Converting to JSON...');
    const jsonData = csvToJSON(csvRows);
    console.log(`✅ Converted ${jsonData.length} rows to JSON objects`);

    // WordPress formatına dönüştür
    console.log('🔄 Transforming to WordPress product format...');
    const products = transformToWordPressFormat(jsonData);
    console.log(`✅ Transformed ${products.length} products`);

    // Output dosya yolu belirle
    const outputDir = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFileName = outputPath || `wordpress-products-${timestamp}.json`;
    const outputFilePath = path.isAbsolute(outputFileName)
      ? outputFileName
      : path.join(outputDir, outputFileName);

    // JSON dosyasına kaydet
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(products, null, 2),
      'utf-8',
    );

    console.log(`\n✅ Conversion completed!`);
    console.log(`📁 Output file: ${outputFilePath}`);
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

    // İlk product'ı örnek olarak göster
    if (products.length > 0) {
      console.log('\n📋 Sample product structure:');
      console.log(JSON.stringify(products[0], null, 2));
    }

    return outputFilePath;
  } catch (error) {
    console.error('❌ Error converting CSV to JSON:', error);
    throw error;
  }
}

// Script kullanımı
async function main() {
  const args = process.argv.slice(2);
  const csvFilePath = args[0];
  const outputPath = args[1];

  if (!csvFilePath) {
    console.error(
      '❌ Usage: tsx scripts/csv-to-json.ts <csv-file-path> [output-file-path]',
    );
    console.error('   Example: tsx scripts/csv-to-json.ts data/products.csv');
    console.error(
      '   Example: tsx scripts/csv-to-json.ts data/products.csv exports/products.json',
    );
    process.exit(1);
  }

  try {
    await convertCSVToJSON(csvFilePath, outputPath);
    console.log('\n✨ Conversion completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Conversion failed:', error);
    process.exit(1);
  }
}

main();
