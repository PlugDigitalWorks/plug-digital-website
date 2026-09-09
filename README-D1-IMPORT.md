ÖNEMLİ:
npm run dev → Normal Next.js dev server, local dev.db kullanır
Production (Cloudflare Pages) → D1 kullanılır
Prisma client otomatik olarak context'i kontrol eder ve doğru database'i seçer
Nasıl çalışır:
Local development (npm run dev): Cloudflare context yok → dev.db kullanılır
Production (Cloudflare Pages): Cloudflare context var → D1 kullanılır

# D1 Database Import Guide

Bu dokümantasyon, WordPress'ten export edilen ürün verilerini Cloudflare D1 database'ine import etme sürecini açıklar.

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Gereksinimler](#gereksinimler)
3. [Veri Akışı](#veri-akışı)
4. [Adım Adım İşlem](#adım-adım-işlem)
5. [Sorun Giderme](#sorun-giderme)

---

## 🎯 Genel Bakış

Bu proje, WordPress'ten export edilen ürün verilerini Cloudflare D1 (SQLite) database'ine import eder. İşlem iki ana aşamadan oluşur:

1. **Export**: Local `dev.db` (SQLite) dosyasındaki mevcut verileri JSON formatına export etme
2. **Import**: Export edilen JSON verilerini Cloudflare D1 database'ine import etme

### Veri Yapısı

Proje şu tablolardan oluşur:

- **Brand**: Marka bilgileri
- **Category**: Kategori bilgileri
- **Product**: Ürün bilgileri
- **ProductCategory**: Ürün-Kategori ilişki tablosu (many-to-many)

---

## 🔧 Gereksinimler

- Node.js 20+
- Cloudflare Wrangler CLI (`npm install -g wrangler`)
- Cloudflare hesabı ve D1 database erişimi
- Local Prisma database (`dev.db`) - opsiyonel

## 🖥️ Local Development

### Default Dev Server (`npm run dev`)

**Varsayılan olarak `npm run dev` komutu local `dev.db` dosyasını kullanır:**

```bash
npm run dev
```

Bu komut normal Next.js dev server'ı çalıştırır (`next dev`) ve local `dev.db` dosyasını kullanır. Cloudflare D1'e bağlanmaz.

**Nasıl Çalışır?**

- Prisma client otomatik olarak Cloudflare context'i kontrol eder
- Local development'ta Cloudflare context yok, bu yüzden `dev.db` kullanılır
- Production'da (Cloudflare Pages) Cloudflare context var, bu yüzden D1 kullanılır

**Not**: Production'da her zaman D1 kullanılır. Local development için `dev.db` kullanılır. Bu sayede local ve production ortamları otomatik olarak doğru database'i kullanır.

---

## 📊 Veri Akışı

```
WordPress Export (output.json)
    ↓
Transform Script (transform-wordpress-json.ts)
    ↓
Transformed JSON (transformed-products.json)
    ↓
Import Script (import-wordpress-products.ts)
    ↓
Local dev.db (SQLite)
    ↓
Export Script (export-to-wordpress-json.ts)
    ↓
WordPress Products JSON (wordpress-products.json)
    ↓
Import to D1 Script (import-to-d1.ts)
    ↓
SQL File (import-to-d1.sql)
    ↓
Cloudflare D1 Database
```

---

## 🚀 Adım Adım İşlem

### Senaryo 1: WordPress'ten Yeni Veri Import Etme

Eğer WordPress'ten yeni export edilmiş veriler varsa:

#### 1. WordPress JSON'unu Transform Et

WordPress export dosyasını (`exports/output.json`) Prisma schema'ya uygun formata dönüştür:

```bash
npm run transform-wordpress-json exports/output.json exports/transformed-products.json
```

Bu komut:

- `additionalInfo.Name` alanından ürün başlığını alır
- Kategorilerden marka ve kategori bilgilerini parse eder
- Duplicate image URL'lerini temizler
- `basicInfo` ve `additionalInfo` object'lerini korur

#### 2. Transform Edilmiş Verileri Local Database'e Import Et

```bash
npm run import-wordpress-products
```

**Not**: Bu komut local `dev.db` dosyasına yazar. Cloudflare D1'e yazmaz.

---

### Senaryo 2: Local Database'den D1'e Import Etme

Eğer local `dev.db` dosyasında doğru veriler varsa ve bunları D1'e aktarmak istiyorsanız:

#### 1. Local Database'den Verileri Export Et

```bash
npm run export-to-wordpress-json
```

Bu komut `exports/wordpress-products.json` dosyasını oluşturur. Bu dosya şu yapıda olur:

```json
{
  "brands": [...],
  "categories": [...],
  "products": [...],
  "productCategories": [...]
}
```

#### 2. SQL Import Dosyası Oluştur

```bash
npm run import-to-d1 exports/wordpress-products.json
```

Bu komut `exports/import-to-d1.sql` dosyasını oluşturur. Bu SQL dosyası:

- Mevcut verileri temizler (DELETE komutları)
- Tüm verileri INSERT komutlarıyla ekler
- SQL injection'dan korunmak için string'leri escape eder

#### 3. SQL Dosyasını İncele (Opsiyonel)

```bash
cat exports/import-to-d1.sql | head -50
```

SQL dosyasını kontrol ederek doğru oluşturulduğundan emin olun.

#### 4. D1 Database'ine Import Et

```bash
npx wrangler d1 execute DB --file exports/import-to-d1.sql --remote
```

**Önemli**: `--remote` flag'i production D1 database'ine yazar. Test için `--remote` olmadan çalıştırabilirsiniz (local D1'e yazar).

#### 5. Import'u Kontrol Et

```bash
# Toplam ürün sayısı
npx wrangler d1 execute DB --command "SELECT COUNT(*) as total FROM Product;" --remote

# Toplam marka sayısı
npx wrangler d1 execute DB --command "SELECT COUNT(*) as total FROM Brand;" --remote

# Toplam kategori sayısı
npx wrangler d1 execute DB --command "SELECT COUNT(*) as total FROM Category;" --remote

# Örnek ürünler
npx wrangler d1 execute DB --command "SELECT slug, title, json_array_length(images) as image_count FROM Product LIMIT 5;" --remote
```

---

## 🔄 Tam İşlem Akışı (Sıfırdan)

Eğer her şeyi baştan yapmak istiyorsanız:

### 1. Database'i Temizle (D1)

```bash
npx wrangler d1 execute DB --command "DELETE FROM ProductCategory;" --remote
npx wrangler d1 execute DB --command "DELETE FROM Product;" --remote
npx wrangler d1 execute DB --command "DELETE FROM Category;" --remote
npx wrangler d1 execute DB --command "DELETE FROM Brand;" --remote
```

### 2. WordPress Verilerini Transform Et

```bash
npm run transform-wordpress-json exports/output.json exports/transformed-products.json
```

### 3. Local Database'e Import Et

```bash
npm run import-wordpress-products
```

### 4. Local Database'den Export Et

```bash
npm run export-to-wordpress-json
```

### 5. D1'e Import Et

Öncesinde istersen farklı bir terminalde loglamak için

```bash
npx wrangler tail pacha-london-import --format pretty
```

```bash
npm run import-to-d1 exports/wordpress-products.json
npx wrangler d1 execute DB --file exports/import-to-d1.sql --remote
```

### 6. Kontrol Et

```bash
npx wrangler d1 execute DB --command "SELECT COUNT(*) FROM Product;" --remote
```

---

## 📁 Dosya Yapısı

```
exports/
├── output.json                    # WordPress'ten export edilen ham veri
├── transformed-products.json      # Transform edilmiş ürün verileri
├── wordpress-products.json        # Local DB'den export edilen tüm veriler
└── import-to-d1.sql              # D1'e import için SQL dosyası

scripts/
├── transform-wordpress-json.ts   # WordPress JSON'unu transform eder
├── import-wordpress-products.ts   # Local DB'ye import eder
├── export-to-wordpress-json.ts   # Local DB'den export eder
└── import-to-d1.ts               # SQL dosyası oluşturur
```

---

## 💡 Örnek İşlemler

### Admin Tablolarını Sıfırlama

Admin, AdminActivity ve AdminOTP tablolarını temizlemek için:

```bash
# AdminOTP tablosunu temizle
npx wrangler d1 execute DB --command "DELETE FROM AdminOTP;" --remote

# AdminActivity tablosunu temizle
npx wrangler d1 execute DB --command "DELETE FROM AdminActivity;" --remote

# Admin tablosunu temizle
npx wrangler d1 execute DB --command "DELETE FROM Admin;" --remote

# Kontrol et
npx wrangler d1 execute DB --command "SELECT COUNT(*) as admin_count FROM Admin; SELECT COUNT(*) as activity_count FROM AdminActivity; SELECT COUNT(*) as otp_count FROM AdminOTP;" --remote
```

**Not**: Foreign key constraint'leri varsa, önce child tabloları (AdminOTP, AdminActivity) sonra parent tabloyu (Admin) temizleyin.

### Belirli Bir Tabloyu Temizleme

Herhangi bir tabloyu temizlemek için:

```bash
# Tablo adını değiştirin
npx wrangler d1 execute DB --command "DELETE FROM TableName;" --remote

# Kontrol et
npx wrangler d1 execute DB --command "SELECT COUNT(*) FROM TableName;" --remote
```

### Tüm Ürün Verilerini Sıfırlama

Product, Brand, Category ve ProductCategory tablolarını temizlemek için:

```bash
# Önce junction table'ı temizle (foreign key constraint için)
npx wrangler d1 execute DB --command "DELETE FROM ProductCategory;" --remote

# Sonra product'ları temizle
npx wrangler d1 execute DB --command "DELETE FROM Product;" --remote

# Category ve Brand'i temizle
npx wrangler d1 execute DB --command "DELETE FROM Category;" --remote
npx wrangler d1 execute DB --command "DELETE FROM Brand;" --remote

# Kontrol et
npx wrangler d1 execute DB --command "SELECT COUNT(*) as products FROM Product; SELECT COUNT(*) as brands FROM Brand; SELECT COUNT(*) as categories FROM Category;" --remote
```

---

## 🐛 Sorun Giderme

### Problem: "Invalid Signature" Hatası (Cloudinary)

**Çözüm**: Bu hata Cloudinary image upload sırasında oluşur. Eğer sadece D1 import yapıyorsanız, bu hatayı görmezsiniz çünkü image upload işlemi yapılmaz.

### Problem: "Objects are not valid as a React child"

**Çözüm**: Bu hata product detail sayfasında `basicInfo` veya `additionalInfo` içindeki nested object'lerden kaynaklanır. `WatchDetail.tsx` ve `JewelleryDetail.tsx` dosyalarında düzeltilmiştir - nested object'ler otomatik olarak filtrelenir.

### Problem: "Permission denied" Hatası

**Çözüm**: Dosya izinleri sorunlu olabilir. `sudo` ile çalıştırmayı deneyin:

```bash
sudo npm run transform-wordpress-json exports/output.json exports/transformed-products.json
```

### Problem: SQL Dosyası Çok Büyük

**Çözüm**: SQL dosyası büyükse, `wrangler d1 execute` komutu timeout verebilir. Bu durumda:

1. SQL dosyasını küçük parçalara bölün
2. Her parçayı ayrı ayrı çalıştırın
3. Veya `--batch-size` parametresi kullanın (eğer destekleniyorsa)

### Problem: Duplicate Image URL'leri

**Çözüm**: `transform-wordpress-json.ts` script'i otomatik olarak duplicate'leri temizler. Eğer hala duplicate varsa, script'i tekrar çalıştırın.

---

## 📝 Önemli Notlar

1. **Local vs Remote**:
   - `dev.db` = Local SQLite database (development)
   - D1 = Cloudflare'ın remote SQLite database'i (production)

2. **Image URL'leri**:
   - Export edilen JSON'da image URL'leri WordPress URL'leri olarak kalır
   - Cloudinary'e upload işlemi ayrı bir süreçtir (şu an kullanılmıyor)

3. **Veri Bütünlüğü**:
   - Import öncesi mutlaka backup alın
   - Production'a import etmeden önce test edin

4. **SQL Injection Koruması**:
   - `import-to-d1.ts` script'i tüm string'leri escape eder
   - Yine de SQL dosyasını kontrol etmek önerilir

---

## 🔗 İlgili Komutlar

### Package.json Scripts

```json
{
  "transform-wordpress-json": "tsx scripts/transform-wordpress-json.ts",
  "import-wordpress-products": "tsx scripts/import-wordpress-products.ts",
  "export-to-wordpress-json": "tsx scripts/export-to-wordpress-json.ts",
  "import-to-d1": "tsx scripts/import-to-d1.ts"
}
```

### Wrangler Komutları

```bash
# D1 database listesi
npx wrangler d1 list

# SQL komutu çalıştır
npx wrangler d1 execute DB --command "SELECT * FROM Product LIMIT 5;" --remote

# SQL dosyası çalıştır
npx wrangler d1 execute DB --file exports/import-to-d1.sql --remote

# Database bilgileri
npx wrangler d1 info DB
```

---

## 📞 Yardım

Sorun yaşarsanız:

1. Log'ları kontrol edin: `npm run` komutlarının çıktısını inceleyin
2. SQL dosyasını kontrol edin: `exports/import-to-d1.sql`
3. D1 database'i kontrol edin: `npx wrangler d1 execute DB --command "SELECT COUNT(*) FROM Product;" --remote`

---

## ✅ Checklist

Import işlemi öncesi kontrol listesi:

- [ ] Local `dev.db` dosyasında doğru veriler var mı?
- [ ] `exports/wordpress-products.json` dosyası oluşturuldu mu?
- [ ] `exports/import-to-d1.sql` dosyası oluşturuldu mu?
- [ ] SQL dosyası doğru görünüyor mu? (ilk birkaç satırı kontrol edin)
- [ ] D1 database backup'ı alındı mı?
- [ ] Test ortamında denendi mi?

Import işlemi sonrası kontrol listesi:

- [ ] Ürün sayısı doğru mu?
- [ ] Marka sayısı doğru mu?
- [ ] Kategori sayısı doğru mu?
- [ ] Ürün detay sayfaları açılıyor mu?
- [ ] Image URL'leri görünüyor mu?

---

**Son Güncelleme**: 2025-01-XX
**Versiyon**: 1.0
