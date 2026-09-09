import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

function updateRuntimeInFiles() {
  // Tüm route.ts dosyalarını bul (grep kullan)
  const result = execSync(
    "grep -r \"export const runtime = 'edge'\" src/app/api --include='*.ts' -l",
    { encoding: 'utf8' },
  );

  const files = result.trim().split('\n').filter(Boolean);
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Eğer zaten dinamik runtime varsa atla
    if (content.includes("process.env.NODE_ENV === 'production'")) {
      continue;
    }

    // 'edge' runtime'ı dinamik hale getir
    const oldPattern = /export const runtime = ['"]edge['"];?/g;
    if (oldPattern.test(content)) {
      content = content.replace(
        oldPattern,
        "// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)\n// Production'da edge runtime kullan (Cloudflare Pages)\nexport const runtime = process.env.NODE_ENV === 'production' ? 'edge' : 'nodejs';",
      );

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${file}`);
      updatedCount++;
    }
  }

  console.log(`\n✅ Total files updated: ${updatedCount}`);
}

try {
  updateRuntimeInFiles();
} catch (err) {
  console.error('❌ Error:', err);
  process.exit(1);
}
