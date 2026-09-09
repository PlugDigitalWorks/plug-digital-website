import { PrismaClient, ProductType, ProductStatus } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";
import cloudinary from "../src/lib/cloudinary";

/* -------------------------------------------------
   SETUP
------------------------------------------------- */

const prisma = new PrismaClient();

/* -------------------------------------------------
   HELPERS
------------------------------------------------- */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const cleanHtml = (html?: string): string => {
  if (!html) return "";
  return html
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const sanitizeImageUrl = (url?: string): string | null => {
  if (!url) return null;
  const t = url.trim();
  return t.startsWith("http") ? t : null;
};

const hashUrl = (url: string): string =>
  crypto.createHash("sha1").update(url).digest("hex");

/* -------------------------------------------------
   BRAND DETECTION (SAFE)
------------------------------------------------- */

function extractBrand(raw?: string): string {
  if (!raw) throw new Error("Missing Categories (brand)");
  const parts = raw
    .split(">")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts[parts.length - 1].toUpperCase();
}

/* -------------------------------------------------
   IMAGE HANDLING (CLOUDINARY SAFE)
------------------------------------------------- */

async function downloadImage(
  url: string,
): Promise<{ buffer: Buffer; mime: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed image download: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const mime = res.headers.get("content-type") || "image/jpeg";
  return { buffer, mime };
}

async function uploadImageToCloudinary(url: string): Promise<string> {
  const hash = hashUrl(url);
  const publicId = `plug-digital/products/${hash}`;

  // 🔍 Eğer daha önce upload edildiyse tekrar upload etme
  try {
    const existing = await cloudinary.api.resource(publicId);
    return existing.secure_url;
  } catch {
    // not found → upload
  }

  const { buffer, mime } = await downloadImage(url);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mime};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    public_id: publicId,
    overwrite: false,
    resource_type: "image",
  });

  return result.secure_url;
}

function collectImageUrls(wp: any): string[] {
  const urls: string[] = [];

  if (Array.isArray(wp.images)) {
    urls.push(...wp.images);
  }

  if (typeof wp.additionalInfo?.Images === "string") {
    urls.push(
      ...wp.additionalInfo.Images.split(",")
        .map((i: string) => i.trim())
        .filter((i: string) => i.startsWith("http")),
    );
  }

  return [...new Set(urls.map(sanitizeImageUrl).filter(Boolean))] as string[];
}

async function uploadImages(urls: string[]): Promise<string[]> {
  const uploaded: string[] = [];
  for (const url of urls) {
    try {
      console.log(`   📤 Image check/upload: ${url}`);
      const cloudUrl = await uploadImageToCloudinary(url);
      uploaded.push(cloudUrl);
    } catch (e) {
      console.error(`   ⚠️ Image failed: ${url}`);
    }
  }
  return uploaded;
}

/* -------------------------------------------------
   BASIC INFO (UI TABLE)
------------------------------------------------- */

function buildBasicInfo(wp: any): Record<string, string> {
  const src = { ...wp.basicInfo, ...wp.additionalInfo };
  const out: Record<string, string> = {};

  const pick = (label: string, key: string) => {
    const v = src[key];
    if (v && typeof v === "string" && !v.startsWith("field_")) {
      out[label] = v;
    }
  };

  pick("Condition", "Meta: condition");
  pick("Gender", "Meta: gender");
  pick("Year", "Meta: year");
  pick("Case Size", "Meta: case_diameter");
  pick("Case Material", "Meta: case_material");
  pick("Dial", "Meta: dial");
  pick("Movement", "Meta: movement");
  pick("Bracelet", "Meta: bracelet_material");
  pick("Box", "Meta: box");
  pick("Papers", "Meta: paper");
  pick("Location", "Meta: location");

  return out;
}

/* -------------------------------------------------
   SEO + ADDITIONAL INFO
------------------------------------------------- */

function buildSeo(product: {
  brand: string;
  title: string;
  reference: string;
  description?: string;
}) {
  const baseDesc =
    product.description ||
    `Discover ${product.brand} ${product.title} available at Pacha of London.`;

  const trimmed =
    baseDesc.length > 160
      ? baseDesc.substring(0, baseDesc.lastIndexOf(" ", 155))
      : baseDesc;

  return {
    title:
      `${product.brand} ${product.title} ${product.reference} | Pacha of London`.trim(),
    description: trimmed,
  };
}

function buildAdditionalInfo(wp: any, seo: any): Record<string, any> {
  const src = { ...wp.basicInfo, ...wp.additionalInfo };

  const pick = (key: string) =>
    src[key] && typeof src[key] === "string" && !src[key].startsWith("field_")
      ? src[key]
      : null;

  return {
    movement: pick("Meta: movement"),
    caseDiameter: pick("Meta: case_diameter")
      ? Number(pick("Meta: case_diameter"))
      : null,
    glass: pick("Meta: glass"),
    dial: pick("Meta: dial"),
    braceletMaterial: pick("Meta: bracelet_material"),
    bezelMaterial: pick("Meta: material_bezel"),
    seo,
  };
}

/* -------------------------------------------------
   DB HELPERS
------------------------------------------------- */

async function ensureBrand(name: string, type: ProductType) {
  const found = await prisma.brand.findFirst({ where: { name, type } });
  if (found) return found;

  return prisma.brand.create({
    data: {
      name,
      type,
      description: `${name} ${type.toLowerCase()}`,
      slug: "",
    },
  });
}

/* -------------------------------------------------
   MAIN IMPORT
------------------------------------------------- */

async function importProducts(filePath: string) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const wp of raw) {
    console.log(
      `\n🔄 Importing: ${wp.additionalInfo?.Name ?? wp.additionalInfo?.name ?? "untitled"}`,
    );

    const title =
      wp.additionalInfo?.Name ||
      wp.additionalInfo?.name ||
      wp.additionalInfo?.["Meta: watch_subtitle"] ||
      wp.additionalInfo?.["Meta: type"] ||
      wp.additionalInfo?.["Meta: _yoast_wpseo_primary_product_brand"];

    if (!title) {
      console.warn(
        `   ⚠️ Skipping product because no title-like field was found (ID=${wp.additionalInfo?.ID} reference=${wp.basicInfo?.["Meta: ref_no"]})`,
      );
      continue;
    }

    const slug = slugify(title);
    const reference = wp.basicInfo?.["Meta: ref_no"] || slug.toUpperCase();

    const price = Number(wp.additionalInfo?.["Regular price"] || 0);
    const description = cleanHtml(wp.additionalInfo?.Description);
    const stock = wp.additionalInfo?.["In stock?"] === "1" ? 1 : 0;

    const type: ProductType =
      wp.additionalInfo?.Categories?.toLowerCase().includes("jewellery")
        ? ProductType.JEWELLERY
        : ProductType.WATCH;

    const brandName = extractBrand(wp.additionalInfo?.Categories);
    const brand = await ensureBrand(brandName, type);

    const imageUrls = collectImageUrls(wp);
    const images = imageUrls.length ? await uploadImages(imageUrls) : [];

    const seo = buildSeo({
      brand: brand.name,
      title,
      reference,
      description,
    });

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        title,
        reference,
        price,
        description,
        stock,
        status: ProductStatus.ACTIVE,
        images,
        basicInfo: buildBasicInfo(wp),
        additionalInfo: buildAdditionalInfo(wp, seo),
        brandId: brand.id,
      },
      create: {
        slug,
        type,
        title,
        reference,
        price,
        description,
        stock,
        status: ProductStatus.ACTIVE,
        images,
        guarantee: ["Authenticity Guarantee"],
        basicInfo: buildBasicInfo(wp),
        additionalInfo: buildAdditionalInfo(wp, seo),
        brandId: brand.id,
      },
    });

    console.log(`   ✅ Imported: ${product.title}`);
  }

  await prisma.$disconnect();
}

/* -------------------------------------------------
   CLI
------------------------------------------------- */

const [, , input] = process.argv;
if (!input) {
  console.error("Usage: tsx import-wordpress-products.ts <products.json>");
  process.exit(1);
}

importProducts(path.resolve(input))
  .then(() => {
    console.log("\n✨ Import completed");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
