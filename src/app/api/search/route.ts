// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();

function getBrandHref(brand: { name: string; slug?: string | null }, type: string) {
  const slug = brand.slug || slugify(brand.name);
  const base = type === 'WATCH' ? '/watch' : type === 'BAG' ? '/bag' : '/jewellery';
  return `${base}?brand=${encodeURIComponent(slug)}`;
}

function getCategoryHref(cat: { name: string; slug?: string | null }, type: string) {
  const slug = cat.slug || slugify(cat.name);
  const base = type === 'WATCH' ? '/watch' : type === 'BAG' ? '/bag' : '/jewellery';
  return `${base}?category=${encodeURIComponent(slug)}`;
}

export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const brandLimit = 5;
    const categoryLimit = 5;

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [], brands: [], categories: [] });
    }

    const searchQuery = query.trim();

    // Search products, brands, categories — select only needed fields (Worker payload optimization)
    const [products, brands, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { title: { contains: searchQuery } },
            { subtitle: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { reference: { contains: searchQuery } },
            { brand: { name: { contains: searchQuery } } },
          ],
        },
        select: {
          id: true,
          slug: true,
          title: true,
          subtitle: true,
          price: true,
          images: true,
          type: true,
          reference: true,
          brand: { select: { name: true } },
        },
        take: Math.min(limit, 20),
        orderBy: { createdAt: 'desc' },
      }),
      // Brands (WATCH, JEWELLERY, BAG)
      prisma.brand.findMany({
        where: { name: { contains: searchQuery } },
        take: brandLimit,
      }),
      // Categories (WATCH, JEWELLERY, BAG)
      prisma.category.findMany({
        where: { name: { contains: searchQuery } },
        take: categoryLimit,
      }),
    ]);

    const productResults = products.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      price: p.price,
      image: Array.isArray(p.images) ? (p.images[0] ?? '/images/placeholder.png') : '/images/placeholder.png',
      brand: p.brand?.name ?? '',
      type: p.type.toLowerCase(),
      reference: p.reference,
    }));

    const brandResults = brands.map((b: any) => ({
      id: b.id,
      name: b.name,
      href: getBrandHref(b, b.type),
      type: b.type.toLowerCase(),
    }));

    const categoryResults = categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      href: getCategoryHref(c, c.type),
      type: c.type.toLowerCase(),
    }));

    return NextResponse.json({
      results: productResults,
      brands: brandResults,
      categories: categoryResults,
      total: productResults.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 },
    );
  }
}
