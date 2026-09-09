// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { ProductType } from '@prisma/client';
import { generateSlug } from '@/lib/utils';

// GET - Tüm markaları getir (opsiyonel type filter ile)
export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // WATCH, JEWELLERY veya BAG

    const brands = await prisma.brand.findMany({
      where: type ? { type: type as ProductType } : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Brands fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 },
    );
  }
}

// POST - Yeni marka oluştur
export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = (await request.json()) as {
      name: string;
      description?: string;
      type: string;
      slug?: string;
    };
    const { name, description, type, slug } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 },
      );
    }

    // Generate slug if not provided
    const brandSlug = slug || generateSlug(name);

    const brand = await prisma.brand.create({
      data: {
        name,
        description,
        type: type as ProductType,
        slug: brandSlug,
      } as any,
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error: any) {
    console.error('Brand creation error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Brand name or slug already exists' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 },
    );
  }
}

// PUT - Marka güncelle
export async function PUT(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = (await request.json()) as {
      id: string;
      name: string;
      description?: string;
      type: string;
      slug?: string;
    };
    const { id, name, description, type, slug } = body;

    if (!id || !name || !type) {
      return NextResponse.json(
        { error: 'ID, name and type are required' },
        { status: 400 },
      );
    }

    // Generate slug if not provided
    const brandSlug = slug || generateSlug(name);

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        description,
        type: type as ProductType,
        slug: brandSlug,
      } as any,
    });

    return NextResponse.json(brand);
  } catch (error: any) {
    console.error('Brand update error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Brand name or slug already exists' },
        { status: 400 },
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 },
    );
  }
}

// DELETE - Marka sil
export async function DELETE(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Brand ID is required' },
        { status: 400 },
      );
    }

    // Markaya bağlı ürün var mı kontrol et
    const productsWithBrand = await prisma.product.findFirst({
      where: { brandId: id },
    });

    if (productsWithBrand) {
      return NextResponse.json(
        { error: 'Cannot delete brand with associated products' },
        { status: 400 },
      );
    }

    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error: any) {
    console.error('Brand deletion error:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 },
    );
  }
}
