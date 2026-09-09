const fs = require('fs');
const path = require('path');

function addEdgeRuntimeToFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Eğer zaten edge runtime varsa skip et
    if (content.includes("export const runtime = 'edge';")) {
      return;
    }

    let newContent;

    // API route dosyaları için
    if (filePath.includes('/api/') && filePath.endsWith('/route.ts')) {
      // İlk import'tan önce ekle
      newContent = content.replace(
        /^import\s+/m,
        "export const runtime = 'edge';\n\nimport ",
      );
    }
    // Admin page dosyaları için
    else if (filePath.includes('/(admin)/') && filePath.endsWith('/page.tsx')) {
      // 'use client' sonrası ekle
      newContent = content.replace(
        /('use client';)\s*\n/,
        "$1\n\nexport const runtime = 'edge';\n",
      );
    }
    // Dynamic page dosyaları için
    else if (
      (filePath.includes('/blog/') ||
        filePath.includes('/jewellery/') ||
        filePath.includes('/watch/')) &&
      filePath.endsWith('/page.tsx')
    ) {
      // İlk import'tan önce ekle
      newContent = content.replace(
        /^import\s+/m,
        "export const runtime = 'edge';\n\nimport ",
      );
    } else {
      return; // Bu dosya tipini desteklemiyoruz
    }

    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Added edge runtime to: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (item === 'route.ts' || item === 'page.tsx')) {
      addEdgeRuntimeToFile(fullPath);
    }
  }
}

// src/app dizinini işle
processDirectory('./src/app');
console.log('🎉 Edge runtime ekleme işlemi tamamlandı!');
