import * as fs from 'fs';
import * as path from 'path';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

const collectCategories = (value?: string): string[] =>
  value
    ? value
        .split('>')
        .map((segment) => segment.trim())
        .filter(Boolean)
    : [];

const determineType = (value?: string): 'WATCH' | 'JEWELLERY' => {
  if (!value) return 'WATCH';
  const lower = value.toLowerCase();
  if (lower.includes('jewellery') || lower.includes('jewelry')) return 'JEWELLERY';
  return 'WATCH';
};

const parseImages = (value?: string): string[] => {
  if (!value) return [];
  const images = value
    .split(',')
    .map((segment) => segment.trim())
    .filter((segment) => segment.startsWith('http'));
  // Remove duplicates while preserving order
  return [...new Set(images)];
};

function transformProduct(wp: any) {
  const additional = wp.additionalInfo || {};
  const basic = wp.basicInfo || {};

  const title = additional.Name;
  if (!title) {
    throw new Error('Missing product title');
  }

  const categoriesString = additional.Categories;
  const categories = collectCategories(categoriesString);
  const brand = categories.length ? categories[categories.length - 1].toUpperCase() : '';

  return {
    slug: slugify(title),
    type: determineType(categoriesString),
    title,
    subtitle: additional['Meta: watch_subtitle'] ?? null,
    reference: basic['Meta: ref_no'] ?? '',
    price: Number(additional['Regular price'] ?? 0),
    description: additional.Description ?? '',
    stock:
      additional['In stock?'] === '1'
        ? 1
        : Number(additional.Stock ?? 0) || 0,
    status:
      additional['Visibility in catalogue'] === 'visible' ? 'ACTIVE' : 'INACTIVE',
    images: parseImages(additional.Images),
    guarantee: [],
    brand,
    categories:
      categories.length > 1 ? categories.slice(0, categories.length - 1) : categories,
    basicInfo: basic,
    additionalInfo: additional,
  };
}

async function run(inputFile: string, outputFile: string) {
  const inputPath = path.resolve(inputFile);
  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  if (!Array.isArray(raw)) {
    throw new Error('Input JSON must be an array');
  }

  const transformed = raw.map(transformProduct);

  fs.writeFileSync(
    path.resolve(outputFile),
    JSON.stringify(transformed, null, 2),
    'utf8',
  );

  console.log(`✅ Transformed ${transformed.length} products`);
}

const [, , input, output] = process.argv;

if (!input || !output) {
  console.error('Usage: tsx transform-wordpress-products.ts <input.json> <output.json>');
  process.exit(1);
}

run(input, output);
