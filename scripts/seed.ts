// import { PrismaClient, Prisma, ProductType } from "@prisma/client";

// const prisma = new PrismaClient();

// /** ÜRÜN upsert (slug ile) — brand ilişkisini nested connect ile veriyoruz */
// async function ensureProduct(
//   prisma: PrismaClient,
//   slug: string,
//   data: Omit<Prisma.ProductCreateInput, "slug">,
// ) {
//   return prisma.product.upsert({
//     where: { slug },
//     update: {}, // şimdilik güncelleme yok
//     create: { slug, ...data }, // ilk kezse oluştur
//   });
// }

// /** Kategori bağlarını sıfırla ve yeniden kur (idempotent) */
// /** Kategori bağlarını sıfırla ve yeniden kur (idempotent, D1-friendly) */
// async function relinkCategories(
//   prisma: PrismaClient,
//   productId: string,
//   categoryIds: string[],
// ) {
//   // 1) Mevcut bağları sil
//   await prisma.$executeRaw`DELETE FROM "ProductCategory" WHERE "productId" = ${productId}`;

//   // 2) Yeni bağları ekle (duplicate'leri yut)
//   if (categoryIds.length) {
//     const values = categoryIds
//       .map((cid) => `('${productId}','${cid}')`)
//       .join(",");

//     // SQLite/D1: INSERT OR IGNORE → @@unique ihlallerinde hata fırlatmaz
//     await prisma.$executeRawUnsafe(
//       `INSERT OR IGNORE INTO "ProductCategory" ("productId","categoryId") VALUES ${values}`,
//     );
//   }
// }

// /** Basit slug helper */
// const createSlug = (title: string) =>
//   title
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .trim();

// /** Null check helper */
// const must = <T>(v: T | null, msg: string): T => {
//   if (!v) throw new Error(msg);
//   return v;
// };

// export async function seed(prisma: PrismaClient) {
//   console.log("🌱 Seeding database...");

//   // ---------------------------------------------------------
//   // 1) KATEGORİLER
//   // ---------------------------------------------------------
//   console.log("📅 Creating categories...");
//   const categories: { name: string; type: ProductType; description: string; slug: string }[] =
//     [
//       {
//         name: "Men's Watches",
//         type: ProductType.WATCH,
//         description: "Luxury men's timepieces",
//         slug : "",
//       },
//       {
//         name: "Women's Watches",
//         type: ProductType.WATCH,
//         description: "Elegant women's timepieces",
//         slug : "",
//       },
//       {
//         name: "Mechanical Watches",
//         type: ProductType.WATCH,
//         description: "Hand-wound mechanical movements",
//         slug : "",
//       },
//       {
//         name: "Automatic Watches",
//         type: ProductType.WATCH,
//         description: "Self-winding automatic movements",
//         slug : "",
//       },
//       {
//         name: "Vintage Watches",
//         type: ProductType.WATCH,
//         description: "Classic and vintage timepieces",
//         slug : "",
//       },
//       {
//         name: "Chronographs",
//         type: ProductType.WATCH,
//         description: "Stopwatch functionality watches",
//         slug : "",
//       },
//       {
//         name: "Diving Watches",
//         type: ProductType.WATCH,
//         description: "Water-resistant diving timepieces",
//         slug : "",
//       },
//       {
//         name: "Pilot's Watches",
//         type: ProductType.WATCH,
//         description: "Aviation-inspired timepieces",
//         slug : "",
//       },
//       {
//         name: "Military Watches",
//         type: ProductType.WATCH,
//         description: "Military-grade timepieces",
//         slug : "",
//       },
//       {
//         name: "Swiss Watches",
//         type: ProductType.WATCH,
//         description: "Swiss-made luxury timepieces",
//         slug : "",
//       },
//       {
//         name: "Affordable Watches",
//         type: ProductType.WATCH,
//         description: "Quality watches at accessible prices",
//         slug : "",
//       },
//       {
//         name: "Popular Watches",
//         type: ProductType.WATCH,
//         description: "Trending and popular models",
//         slug : "",
//       },

//       {
//         name: "Bracelets",
//         type: ProductType.JEWELLERY,
//         description: "Elegant wrist jewelry",
//         slug : "",
//       },
//       {
//         name: "Earrings",
//         type: ProductType.JEWELLERY,
//         description: "Beautiful ear adornments",
//         slug : "",
//       },
//       {
//         name: "Necklaces",
//         type: ProductType.JEWELLERY,
//         description: "Stunning neck jewelry",
//         slug : "",
//       },
//       {
//         name: "Rings",
//         type: ProductType.JEWELLERY,
//         description: "Finger jewelry and engagement rings",
//         slug : "",
//       },
//       {
//         name: "Pendants",
//         type: ProductType.JEWELLERY,
//         description: "Hanging jewelry pieces",
//         slug: "",
//       },
//       {
//         name: "Chains",
//         type: ProductType.JEWELLERY,
//         description: "Necklace chains and accessories",
//         slug: "",
//       },
//       {
//         name: "Anklets",
//         type: ProductType.JEWELLERY,
//         description: "Ankle jewelry",
//         slug: "",
//       },
//       {
//         name: "Brooches",
//         type: ProductType.JEWELLERY,
//         description: "Decorative pin jewelry",
//         slug: "",
//       },
//       {
//         name: "Cufflinks",
//         type: ProductType.JEWELLERY,
//         description: "Men's formal jewelry",
//         slug: "",
//       },
//       {
//         name: "Tiaras",
//         type: ProductType.JEWELLERY,
//         description: "Royal and formal head jewelry",
//         slug: "",
//       },
//       {
//         name: "Women's Bags",
//         type: ProductType.BAG,
//         description: "Luxury women handbags",
//         slug: "",
//       },
//       {
//         name: "Men's Bags",
//         type: ProductType.BAG,
//         description: "Luxury men bags and briefcases",
//         slug: "",
//       },
//       {
//         name: "Tote Bags",
//         type: ProductType.BAG,
//         description: "Large open-top bags",
//         slug: "",
//       },
//       {
//         name: "Shoulder Bags",
//         type: ProductType.BAG,
//         description: "Bags worn over the shoulder",
//         slug: "",
//       },
//       {
//         name: "Crossbody Bags",
//         type: ProductType.BAG,
//         description: "Bags worn across the body",
//         slug: "",
//       },
//       {
//         name: "Clutch Bags",
//         type: ProductType.BAG,
//         description: "Small handheld bags",
//         slug: "",
//       },
//       {
//         name: "Backpacks",
//         type: ProductType.BAG,
//         description: "Bags worn on the back",
//         slug: "",
//       },
//       {
//         name: "Travel Bags",
//         type: ProductType.BAG,
//         description: "Luggage and travel bags",
//         slug: "",
//       },
//       {
//         name: "Evening Bags",
//         type: ProductType.BAG,
//         description: "Formal evening handbags",
//         slug: "",
//       },
//       {
//         name: "Designer Bags",
//         type: ProductType.BAG,
//         description: "Luxury designer handbags",
//         slug: "",
//       },
//     ];
//   for (const c of categories) {
//     await prisma.category.upsert({
//       where: { name: c.name },
//       update: {},
//       create: c,
//     });
//   }

//   // ---------------------------------------------------------
//   // 2) MARKALAR
//   // ---------------------------------------------------------
//   console.log("⌚ Creating watch brands...");
//   const watchBrands: {
//     name: string;
//     type: ProductType;
//     description: string;
//   }[] = [
//     {
//       name: "ROLEX",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "BVLGARI",
//       description: "Italian luxury brand",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "AUDEMARS PIGUET",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "PATEK PHILIPPE",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "CARTIER",
//       description: "French luxury watch and jewelry house",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "HUBLOT",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "CHOPARD",
//       description: "Swiss luxury watch and jewelry manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "OMEGA",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "FRANCK MULLER",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "IWC",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "BREITLING",
//       description: "Swiss luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//     {
//       name: "PANERAI",
//       description: "Italian luxury watch manufacturer",
//       type: ProductType.WATCH,
//     },
//   ];
//   for (const b of watchBrands) {
//     await prisma.brand.upsert({
//       where: { name_type: { name: b.name, type: b.type } },
//       update: {},
//       create: b,
//     });
//   }

//   console.log("💍 Creating jewellery brands...");
//   const jewelleryBrands: {
//     name: string;
//     type: ProductType;
//     description: string;
//   }[] = [
//     {
//       name: "VAN CLEEF & ARPELS",
//       description: "French luxury jewelry house",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "CARTIER",
//       description: "French luxury jewelry and watch house",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "CHATILA",
//       description: "Lebanese luxury jewelry brand",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "BVLGARI",
//       description: "Italian luxury jewelry and watch brand",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "LOUIS VUITTON",
//       description: "French luxury fashion and jewelry house",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "HUBLOT",
//       description: "Swiss luxury watch and jewelry manufacturer",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "CHOPARD",
//       description: "Swiss luxury jewelry and watch manufacturer",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "TIFFANY & CO",
//       description: "American luxury jewelry retailer",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "BOUCHERON",
//       description: "French luxury jewelry house",
//       type: ProductType.JEWELLERY,
//     },
//     {
//       name: "CHAUMET",
//       description: "French luxury jewelry house",
//       type: ProductType.JEWELLERY,
//     },
//   ];
//   for (const b of jewelleryBrands) {
//     await prisma.brand.upsert({
//       where: { name_type: { name: b.name, type: b.type } },
//       update: {},
//       create: b,
//     });
//   }

//   console.log("👜 Creating bag brands...");
//   const bagBrands: {
//     name: string;
//     type: ProductType;
//     description: string;
//   }[] = [
//     {
//       name: "HERMÈS",
//       description: "French luxury fashion house specializing in leather goods",
//       type: ProductType.BAG,
//     },
//     {
//       name: "CHANEL",
//       description: "French luxury fashion house",
//       type: ProductType.BAG,
//     },
//     {
//       name: "LOUIS VUITTON",
//       description: "French luxury fashion house",
//       type: ProductType.BAG,
//     },
//     {
//       name: "GUCCI",
//       description: "Italian luxury fashion brand",
//       type: ProductType.BAG,
//     },
//     {
//       name: "PRADA",
//       description: "Italian luxury fashion house",
//       type: ProductType.BAG,
//     },
//     {
//       name: "DIOR",
//       description: "French luxury fashion house",
//       type: ProductType.BAG,
//     },
//     {
//       name: "FENDI",
//       description: "Italian luxury fashion house",
//       type: ProductType.BAG,
//     },
//     {
//       name: "BOTTEGA VENETA",
//       description: "Italian luxury fashion house",
//       type: ProductType.BAG,
//     },
//     {
//       name: "SAINT LAURENT",
//       description: "French luxury fashion house",
//       type: ProductType.BAG,
//     },
//     {
//       name: "BALENCIAGA",
//       description: "French luxury fashion house",
//       type: ProductType.BAG,
//     },
//   ];
//   for (const b of bagBrands) {
//     await prisma.brand.upsert({
//       where: { name_type: { name: b.name, type: b.type } },
//       update: {},
//       create: b,
//     });
//   }

//   // ---------------------------------------------------------
//   // 3) ÜRÜNLER (9 adet)
//   // ---------------------------------------------------------
//   console.log("🛍️ Creating sample products...");

//   // ==== ID’LERİ AL (ilişkiler için) ====
//   const getCat = (name: string) =>
//     prisma.category.findFirst({ where: { name } });
//   const mensWatches = await getCat("Men's Watches");
//   const automaticWatches = await getCat("Automatic Watches");
//   const swissWatches = await getCat("Swiss Watches");
//   const divingWatches = await getCat("Diving Watches");
//   const chronographs = await getCat("Chronographs");
//   const rings = await getCat("Rings");
//   const necklaces = await getCat("Necklaces");
//   const bracelets = await getCat("Bracelets");
//   const pendants = await getCat("Pendants");
//   const womensBags = await getCat("Women's Bags");
//   const toteBags = await getCat("Tote Bags");
//   const shoulderBags = await getCat("Shoulder Bags");
//   const designerBags = await getCat("Designer Bags");

//   const rolexBrand = await prisma.brand.findFirst({ where: { name: "ROLEX" } });
//   const patekBrand = await prisma.brand.findFirst({
//     where: { name: "PATEK PHILIPPE" },
//   });
//   const audemarsBrand = await prisma.brand.findFirst({
//     where: { name: "AUDEMARS PIGUET" },
//   });
//   const cartierJewelryBrand = await prisma.brand.findFirst({
//     where: { name: "CARTIER", type: ProductType.JEWELLERY },
//   });
//   const vanCleefJewelryBrand = await prisma.brand.findFirst({
//     where: { name: "VAN CLEEF & ARPELS", type: ProductType.JEWELLERY },
//   });
//   const bvlgariJewelryBrand = await prisma.brand.findFirst({
//     where: { name: "BVLGARI", type: ProductType.JEWELLERY },
//   });
//   const hermesBrand = await prisma.brand.findFirst({
//     where: { name: "HERMÈS", type: ProductType.BAG },
//   });
//   const chanelBrand = await prisma.brand.findFirst({
//     where: { name: "CHANEL", type: ProductType.BAG },
//   });
//   const lvBrand = await prisma.brand.findFirst({
//     where: { name: "LOUIS VUITTON", type: ProductType.BAG },
//   });
//   const gucciBrand = await prisma.brand.findFirst({
//     where: { name: "GUCCI", type: ProductType.BAG },
//   });

//   // ------------------- Products -------------------
//   console.log("🛍️ Creating products...");

//   // 1. Rolex GMT-Master II
//   if (rolexBrand && mensWatches && automaticWatches && swissWatches) {
//     const title = "Rolex GMT-Master II Bruce Wayne";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "WATCH",
//       title,
//       subtitle:
//         "'Bruce Wayne', stainless steel, ceramic bezel, 40mm, new-2025, Oyster bracelet",
//       reference: "126710GRNR",
//       price: 15500,
//       description: "Rolex GMT-Master II, 40mm, steel, ceramic bezel.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/watches/${slug}.jpg`],
//       brand: { connect: { id: rolexBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "126710GRNR",
//         Type: "Watch",
//         "New or Pre-owned": "New",
//         Condition: "0 (new/unworn)",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Men's",
//         Location: "Knightsbridge, London",
//         Year: "2025",
//         "Delivery Time": "Immediately",
//         Movement: "Automatic",
//         "Bracelet Material": "Steel",
//         "Case Material": "Steel",
//       } as any,
//       additionalInfo: {
//         Movement: "Automatic",
//         "Bracelet Material": "Steel",
//         "Bracelet Color": "Steel",
//         Clasp: "Double-fold clasp",
//         "Clasp Material": "stainless steel",
//         "Case Material": "Steel",
//         "Case Diameter": "40",
//         "Material Bezel": "ceramic",
//         Glass: "Sapphire Glass",
//         Dial: "Black",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       mensWatches.id,
//       automaticWatches.id,
//       swissWatches.id,
//     ]);
//   }

//   // 2. Rolex Submariner
//   if (rolexBrand && mensWatches && divingWatches && swissWatches) {
//     const title = "Rolex Submariner Professional Diving";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "WATCH",
//       title,
//       subtitle:
//         "Professional diving watch, stainless steel, 41mm, ceramic bezel",
//       reference: "126610LN",
//       price: 12500,
//       description: "Rolex Submariner, 41mm, diving watch.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/watches/${slug}.jpg`],
//       brand: { connect: { id: rolexBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "126610LN",
//         Type: "Watch",
//         "New or Pre-owned": "New",
//         Condition: "0 (new/unworn)",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Men's",
//         Location: "Knightsbridge, London",
//         Year: "2025",
//         "Delivery Time": "Immediately",
//         Movement: "Automatic",
//         "Bracelet Material": "Steel",
//         "Case Material": "Steel",
//       } as any,
//       additionalInfo: {
//         Movement: "Automatic",
//         "Bracelet Material": "Steel",
//         "Bracelet Color": "Steel",
//         Clasp: "Oysterlock clasp",
//         "Clasp Material": "stainless steel",
//         "Case Material": "Steel",
//         "Case Diameter": "41",
//         "Material Bezel": "ceramic",
//         Glass: "Sapphire Glass",
//         Dial: "Black",
//         "Water Resistance": "300m",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       mensWatches.id,
//       divingWatches.id,
//       swissWatches.id,
//     ]);
//   }

//   // 3. Patek Nautilus
//   if (patekBrand && mensWatches && automaticWatches && swissWatches) {
//     const title = "Patek Philippe Nautilus Steel";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "WATCH",
//       title,
//       subtitle: "Stainless steel, 40mm, integrated bracelet, sports luxury",
//       reference: "5711/1A-010",
//       price: 85000,
//       description: "Iconic Patek Philippe Nautilus in steel.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/watches/${slug}.jpg`],
//       brand: { connect: { id: patekBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "5711/1A-010",
//         Type: "Watch",
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Excellent",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Men's",
//         Location: "Knightsbridge, London",
//         Year: "2023",
//         "Delivery Time": "Immediately",
//         Movement: "Automatic",
//         "Bracelet Material": "Steel",
//         "Case Material": "Steel",
//       } as any,
//       additionalInfo: {
//         Movement: "Caliber 26-330 S C",
//         "Bracelet Material": "Steel",
//         "Bracelet Color": "Steel",
//         Clasp: "Folding clasp",
//         "Clasp Material": "stainless steel",
//         "Case Material": "Steel",
//         "Case Diameter": "40",
//         "Material Bezel": "Steel",
//         Glass: "Sapphire Glass",
//         Dial: "Blue",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       mensWatches.id,
//       automaticWatches.id,
//       swissWatches.id,
//     ]);
//   }

//   // 4. Patek Calatrava
//   if (patekBrand && mensWatches && automaticWatches && swissWatches) {
//     const title = "Patek Philippe Calatrava White Gold";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "WATCH",
//       title,
//       subtitle: "White gold, 39mm, dress watch, elegant simplicity",
//       reference: "5196P-001",
//       price: 45000,
//       description: "Elegant Patek Philippe Calatrava in white gold.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/watches/${slug}.jpg`],
//       brand: { connect: { id: patekBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "5196P-001",
//         Type: "Watch",
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Very Good",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Men's",
//         Location: "Knightsbridge, London",
//         Year: "2022",
//         "Delivery Time": "Immediately",
//         Movement: "Manual",
//         "Bracelet Material": "Leather",
//         "Case Material": "White Gold",
//       } as any,
//       additionalInfo: {
//         Movement: "Caliber 215 PS",
//         "Bracelet Material": "Alligator Leather",
//         "Bracelet Color": "Black",
//         Clasp: "Tang buckle",
//         "Clasp Material": "white gold",
//         "Case Material": "White Gold",
//         "Case Diameter": "39",
//         "Material Bezel": "White Gold",
//         Glass: "Sapphire Glass",
//         Dial: "White",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       mensWatches.id,
//       automaticWatches.id,
//       swissWatches.id,
//     ]);
//   }

//   // 5. AP Royal Oak
//   if (audemarsBrand && mensWatches && automaticWatches && swissWatches) {
//     const title = "Audemars Piguet Royal Oak Steel";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "WATCH",
//       title,
//       subtitle: "Stainless steel, 41mm, octagonal bezel, integrated bracelet",
//       reference: "15500ST.OO.1220ST.01",
//       price: 65000,
//       description: "AP Royal Oak in stainless steel.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/watches/${slug}.jpg`],
//       brand: { connect: { id: audemarsBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "15500ST.OO.1220ST.01",
//         Type: "Watch",
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Excellent",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Men's",
//         Location: "Knightsbridge, London",
//         Year: "2023",
//         "Delivery Time": "Immediately",
//         Movement: "Automatic",
//         "Bracelet Material": "Steel",
//         "Case Material": "Steel",
//       } as any,
//       additionalInfo: {
//         Movement: "Caliber 4302",
//         "Bracelet Material": "Steel",
//         "Bracelet Color": "Steel",
//         Clasp: "Folding clasp",
//         "Clasp Material": "stainless steel",
//         "Case Material": "Steel",
//         "Case Diameter": "41",
//         "Material Bezel": "Steel",
//         Glass: "Sapphire Glass",
//         Dial: "Blue",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       mensWatches.id,
//       automaticWatches.id,
//       swissWatches.id,
//     ]);
//   }

//   // 6. AP Royal Oak Offshore
//   if (audemarsBrand && mensWatches && chronographs && swissWatches) {
//     const title = "Audemars Piguet Royal Oak Offshore Chronograph";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "WATCH",
//       title,
//       subtitle: "Stainless steel, 42mm, chronograph, sporty design",
//       reference: "26470ST.OO.A002CA.01",
//       price: 55000,
//       description: "Bold AP Royal Oak Offshore chronograph.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/watches/${slug}.jpg`],
//       brand: { connect: { id: audemarsBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "26470ST.OO.A002CA.01",
//         Type: "Watch",
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Very Good",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Men's",
//         Location: "Knightsbridge, London",
//         Year: "2022",
//         "Delivery Time": "Immediately",
//         Movement: "Automatic",
//         "Bracelet Material": "Steel",
//         "Case Material": "Steel",
//       } as any,
//       additionalInfo: {
//         Movement: "Caliber 3126/3840",
//         "Bracelet Material": "Steel",
//         "Bracelet Color": "Steel",
//         Clasp: "Folding clasp",
//         "Clasp Material": "stainless steel",
//         "Case Material": "Steel",
//         "Case Diameter": "42",
//         "Material Bezel": "Steel",
//         Glass: "Sapphire Glass",
//         Dial: "Black",
//         Complications: "Chronograph",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       mensWatches.id,
//       chronographs.id,
//       swissWatches.id,
//     ]);
//   }

//   // 7. Cartier Love Ring
//   if (cartierJewelryBrand && rings && bracelets) {
//     const title = "Cartier Love Ring Rose Gold";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "JEWELLERY",
//       title,
//       subtitle: "18k rose gold, iconic screw design, unisex",
//       reference: "B4084600",
//       price: 4750,
//       description: "Iconic Cartier Love ring in 18k rose gold.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/jewelry/${slug}.jpg`],
//       brand: { connect: { id: cartierJewelryBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "New or Pre-owned": "New",
//         Condition: "0 (new/unworn)",
//         Gender: "Unisex",
//         Location: "Knightsbridge, London",
//         "Delivery Time": "Immediately",
//         Papers: "Yes",
//         Box: "Yes",
//         Material: "Rose Gold",
//         Carat: "18K",
//         Colour: "Rose",
//         Clarity: "N/A",
//       } as any,
//       additionalInfo: {
//         Size: "7.5",
//         Style: "Classic",
//         Collection: "Love Collection",
//         "Limited Edition": "No",
//         Design: "Screw motif",
//         Finish: "Polished",
//       },
//     });
//     await relinkCategories(prisma, p.id, [rings.id, bracelets.id]);
//   }

//   // 8. Van Cleef Alhambra Necklace
//   if (vanCleefJewelryBrand && necklaces && pendants) {
//     const title = "Van Cleef & Arpels Alhambra Necklace Gold";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "JEWELLERY",
//       title,
//       subtitle: "18k yellow gold, lucky clover motif, 16 inches",
//       reference: "VCARNM00",
//       price: 8900,
//       description: "Van Cleef Alhambra necklace in yellow gold.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/jewelry/${slug}.jpg`],
//       brand: { connect: { id: vanCleefJewelryBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "New or Pre-owned": "New",
//         Condition: "0 (new/unworn)",
//         Gender: "Women",
//         Location: "Knightsbridge, London",
//         "Delivery Time": "Immediately",
//         Papers: "Yes",
//         Box: "Yes",
//         Material: "Yellow Gold",
//         Carat: "18K",
//         Colour: "Yellow",
//         Clarity: "N/A",
//       } as any,
//       additionalInfo: {
//         Length: "16 inches",
//         Style: "Classic",
//         Collection: "Alhambra Collection",
//         "Limited Edition": "No",
//         Motif: "Lucky Clover",
//         Finish: "Polished",
//       },
//     });
//     await relinkCategories(prisma, p.id, [necklaces.id, pendants.id]);
//   }

//   // 9. Bvlgari Bzero1 Ring
//   if (bvlgariJewelryBrand && rings && bracelets) {
//     const title = "Bvlgari Bzero1 Ring Ceramic Diamond";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "JEWELLERY",
//       title,
//       subtitle: "Black ceramic with rose gold and diamonds, size 52",
//       reference: "RRPE4830",
//       price: 3600,
//       description: "Bvlgari Bzero1 ring in ceramic and rose gold.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/jewelry/${slug}.jpg`],
//       brand: { connect: { id: bvlgariJewelryBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Excellent",
//         Gender: "Unisex",
//         Location: "Knightsbridge, London",
//         "Delivery Time": "Immediately",
//         Papers: "Yes",
//         Box: "Yes",
//         Material: "Black ceramic, rose gold, diamonds",
//         Carat: "18K",
//         Colour: "Mixed",
//         Clarity: "VS",
//       } as any,
//       additionalInfo: {
//         Size: "52",
//         Style: "Contemporary",
//         Collection: "Bzero1 Collection",
//         "Limited Edition": "No",
//         Design: "Tubular",
//         Finish: "Polished ceramic, brushed gold",
//       },
//     });
//     await relinkCategories(prisma, p.id, [rings.id, bracelets.id]);
//   }

//   // 10. Hermès Birkin Bag
//   if (hermesBrand && womensBags && designerBags) {
//     const title = "Hermès Birkin 35 Togo Leather";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "BAG",
//       title,
//       subtitle: "Togo leather, 35cm, gold hardware, iconic design",
//       reference: "BIRKIN-35-TOGO",
//       price: 125000,
//       description: "Iconic Hermès Birkin bag in Togo leather with gold hardware.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/bags/${slug}.jpg`],
//       brand: { connect: { id: hermesBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "BIRKIN-35-TOGO",
//         Type: "Bag",
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Excellent",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Women",
//         Location: "Knightsbridge, London",
//         Year: "2023",
//         "Delivery Time": "Immediately",
//         Material: "Togo Leather",
//         Hardware: "Gold",
//       } as any,
//       additionalInfo: {
//         Size: "35cm",
//         Style: "Classic",
//         Collection: "Birkin Collection",
//         "Limited Edition": "No",
//         Design: "Top handle, flap closure",
//         Finish: "Togo leather",
//         Color: "Black",
//         "Interior Lining": "Leather",
//       },
//     });
//     await relinkCategories(prisma, p.id, [womensBags.id, designerBags.id]);
//   }

//   // 11. Chanel Classic Flap Bag
//   if (chanelBrand && womensBags && shoulderBags && designerBags) {
//     const title = "Chanel Classic Flap Bag Medium";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "BAG",
//       title,
//       subtitle: "Quilted caviar leather, medium size, gold chain",
//       reference: "CHANEL-CF-MEDIUM",
//       price: 8500,
//       description: "Timeless Chanel Classic Flap bag in caviar leather.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/bags/${slug}.jpg`],
//       brand: { connect: { id: chanelBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "CHANEL-CF-MEDIUM",
//         Type: "Bag",
//         "New or Pre-owned": "New",
//         Condition: "0 (new/unworn)",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Women",
//         Location: "Knightsbridge, London",
//         Year: "2025",
//         "Delivery Time": "Immediately",
//         Material: "Caviar Leather",
//         Hardware: "Gold",
//       } as any,
//       additionalInfo: {
//         Size: "Medium (25.5cm)",
//         Style: "Classic",
//         Collection: "Classic Flap Collection",
//         "Limited Edition": "No",
//         Design: "Quilted, double flap, chain strap",
//         Finish: "Caviar leather",
//         Color: "Black",
//         "Interior Lining": "Leather",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       womensBags.id,
//       shoulderBags.id,
//       designerBags.id,
//     ]);
//   }

//   // 12. Louis Vuitton Neverfull MM
//   if (lvBrand && womensBags && toteBags && designerBags) {
//     const title = "Louis Vuitton Neverfull MM Monogram";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "BAG",
//       title,
//       subtitle: "Monogram canvas, MM size, iconic tote bag",
//       reference: "LV-NEVERFULL-MM",
//       price: 1850,
//       description: "Iconic Louis Vuitton Neverfull tote in monogram canvas.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/bags/${slug}.jpg`],
//       brand: { connect: { id: lvBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "LV-NEVERFULL-MM",
//         Type: "Bag",
//         "New or Pre-owned": "New",
//         Condition: "0 (new/unworn)",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Women",
//         Location: "Knightsbridge, London",
//         Year: "2025",
//         "Delivery Time": "Immediately",
//         Material: "Monogram Canvas",
//         Hardware: "Brass",
//       } as any,
//       additionalInfo: {
//         Size: "MM (32cm x 29cm x 17cm)",
//         Style: "Classic",
//         Collection: "Neverfull Collection",
//         "Limited Edition": "No",
//         Design: "Open top, adjustable straps",
//         Finish: "Monogram canvas",
//         Color: "Brown",
//         "Interior Lining": "Red microfiber",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       womensBags.id,
//       toteBags.id,
//       designerBags.id,
//     ]);
//   }

//   // 13. Gucci Dionysus Shoulder Bag
//   if (gucciBrand && womensBags && shoulderBags && designerBags) {
//     const title = "Gucci Dionysus Small Shoulder Bag";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "BAG",
//       title,
//       subtitle: "GG Supreme canvas, small size, tiger head closure",
//       reference: "GUCCI-DIONYSUS-SMALL",
//       price: 2450,
//       description: "Gucci Dionysus shoulder bag with iconic tiger head closure.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/bags/${slug}.jpg`],
//       brand: { connect: { id: gucciBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "GUCCI-DIONYSUS-SMALL",
//         Type: "Bag",
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Very Good",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Women",
//         Location: "Knightsbridge, London",
//         Year: "2023",
//         "Delivery Time": "Immediately",
//         Material: "GG Supreme Canvas",
//         Hardware: "Gold",
//       } as any,
//       additionalInfo: {
//         Size: "Small (28cm x 19cm x 7cm)",
//         Style: "Contemporary",
//         Collection: "Dionysus Collection",
//         "Limited Edition": "No",
//         Design: "Flap closure with tiger head",
//         Finish: "GG Supreme canvas",
//         Color: "Brown",
//         "Interior Lining": "Leather",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       womensBags.id,
//       shoulderBags.id,
//       designerBags.id,
//     ]);
//   }

//   // 14. Hermès Kelly Bag
//   if (hermesBrand && womensBags && designerBags) {
//     const title = "Hermès Kelly 28 Epsom Leather";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "BAG",
//       title,
//       subtitle: "Epsom leather, 28cm, gold hardware, structured design",
//       reference: "KELLY-28-EPSOM",
//       price: 95000,
//       description: "Elegant Hermès Kelly bag in Epsom leather.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/bags/${slug}.jpg`],
//       brand: { connect: { id: hermesBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "KELLY-28-EPSOM",
//         Type: "Bag",
//         "New or Pre-owned": "Pre-owned",
//         Condition: "Excellent",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Women",
//         Location: "Knightsbridge, London",
//         Year: "2022",
//         "Delivery Time": "Immediately",
//         Material: "Epsom Leather",
//         Hardware: "Gold",
//       } as any,
//       additionalInfo: {
//         Size: "28cm",
//         Style: "Classic",
//         Collection: "Kelly Collection",
//         "Limited Edition": "No",
//         Design: "Top handle, turn-lock closure",
//         Finish: "Epsom leather",
//         Color: "Black",
//         "Interior Lining": "Leather",
//       },
//     });
//     await relinkCategories(prisma, p.id, [womensBags.id, designerBags.id]);
//   }

//   // 15. Chanel Boy Bag
//   if (chanelBrand && womensBags && shoulderBags && designerBags) {
//     const title = "Chanel Boy Bag Medium";
//     const slug = createSlug(title);
//     const p = await ensureProduct(prisma, slug, {
//       type: "BAG",
//       title,
//       subtitle: "Quilted lambskin, medium size, aged gold hardware",
//       reference: "CHANEL-BOY-MEDIUM",
//       price: 7200,
//       description: "Modern Chanel Boy bag in quilted lambskin.",
//       stock: 1,
//       status: "ACTIVE",
//       images: [`/images/bags/${slug}.jpg`],
//       brand: { connect: { id: chanelBrand.id } },
//       guarantee: [
//         "Authenticity Guarantee",
//         "Free Overnight Shipping",
//         "2-Year Warranty",
//       ],
//       basicInfo: {
//         "Ref. No.": "CHANEL-BOY-MEDIUM",
//         Type: "Bag",
//         "New or Pre-owned": "New",
//         Condition: "0 (new/unworn)",
//         Box: "Yes",
//         Papers: "Yes",
//         Gender: "Women",
//         Location: "Knightsbridge, London",
//         Year: "2025",
//         "Delivery Time": "Immediately",
//         Material: "Lambskin Leather",
//         Hardware: "Aged Gold",
//       } as any,
//       additionalInfo: {
//         Size: "Medium (25cm x 20cm x 9cm)",
//         Style: "Contemporary",
//         Collection: "Boy Collection",
//         "Limited Edition": "No",
//         Design: "Quilted, double C closure, chain strap",
//         Finish: "Quilted lambskin",
//         Color: "Black",
//         "Interior Lining": "Leather",
//       },
//     });
//     await relinkCategories(prisma, p.id, [
//       womensBags.id,
//       shoulderBags.id,
//       designerBags.id,
//     ]);
//   }

//   console.log("✅ Database seeded successfully!");
// }

// // Script standalone çalıştırma
// seed(prisma)
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
