// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import { ProductType } from '@prisma/client';

// GET - Tüm kategorileri getir (opsiyonel type filter ile) veya slug ile tek kategori
export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // WATCH veya JEWELLERY
    const slug = searchParams.get('slug'); // Slug ile kategori getir

    // Slug ile kategori getir — products NOT included (use /api/products/*?category= for paginated products)
    if (slug) {
      const category = await prisma.category.findUnique({
        where: { slug },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 },
        );
      }

      return NextResponse.json(category);
    }

    const categories = await prisma.category.findMany({
      where: type ? { type: type as ProductType } : undefined,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}

// POST - Yeni kategori oluştur
export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = (await request.json()) as {
      name: string;
      slug?: string;
      description?: string;
      type: string;
      seoTitle?: string;
      seoDescription?: string;
    };
    const { name, slug, description, type, seoTitle, seoDescription } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 },
      );
    }

    // Generate slug if not provided
    const categorySlug = slug || generateSlug(name);

    const category = await prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        description,
        type: type as 'WATCH' | 'JEWELLERY' | 'BAG',
        seoTitle,
        seoDescription,
      } as any,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Category creation error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category name or slug already exists' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 },
    );
  }
}

// PUT - Kategori güncelle
export async function PUT(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = (await request.json()) as {
      id: string;
      name: string;
      slug?: string;
      description?: string;
      type: string;
      seoTitle?: string;
      seoDescription?: string;
    };
    const { id, name, slug, description, type, seoTitle, seoDescription } =
      body;

    if (!id || !name || !type) {
      return NextResponse.json(
        { error: 'ID, name and type are required' },
        { status: 400 },
      );
    }

    // Generate slug if not provided
    const categorySlug = slug || generateSlug(name);

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: categorySlug,
        description,
        type: type as 'WATCH' | 'JEWELLERY' | 'BAG',
        seoTitle,
        seoDescription,
      } as any as {
        name: string;
        slug?: string;
        description?: string;
        type: 'WATCH' | 'JEWELLERY';
        seoTitle?: string;
        seoDescription?: string;
      },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Category update error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category name or slug already exists' },
        { status: 400 },
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 },
    );
  }
}

// DELETE - Kategori sil
export async function DELETE(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 },
      );
    }

    // Kategoriye bağlı ürün var mı kontrol et
    const productsWithCategory = await prisma.productCategory.findFirst({
      where: { categoryId: id },
    });

    if (productsWithCategory) {
      return NextResponse.json(
        { error: 'Cannot delete category with associated products' },
        { status: 400 },
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Category deletion error:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 },
    );
  }
}
