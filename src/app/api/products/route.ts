// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { uploadMultipleImagesToCloudinary } from '@/lib/cloudinary-edge';

export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const reference = formData.get('reference') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string);
    const status = formData.get('status') as string;
    const basicInfo = JSON.parse(formData.get('basicInfo') as string);
    const additionalInfo = JSON.parse(formData.get('additionalInfo') as string);
    const guarantee = formData.get('guarantee')
      ? JSON.parse(formData.get('guarantee') as string)
      : [];
    const selectedBrand = formData.get('selectedBrand') as string;
    const selectedCategories = formData.get('selectedCategories')
      ? JSON.parse(formData.get('selectedCategories') as string)
      : [];
    const images = formData.getAll('images') as File[];

    if (!type || !title || !reference || !price || !selectedBrand) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const imageUrls = await uploadMultipleImagesToCloudinary(images);

    // Create slug from title
    const createSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    };

    const product = await prisma.product.create({
      data: {
        slug: createSlug(title),
        type: type as 'WATCH' | 'JEWELLERY' | 'BAG',
        title,
        subtitle,
        reference,
        price,
        description,
        stock,
        status: status as 'ACTIVE' | 'INACTIVE' | 'SOLD',
        images: imageUrls as any,
        guarantee: guarantee as any,
        basicInfo,
        additionalInfo,
        brandId: selectedBrand,
      },
    });

    if (selectedCategories.length > 0) {
      await prisma.productCategory.createMany({
        data: selectedCategories.map((categoryId: string) => ({
          productId: product.id,
          categoryId,
        })),
      });
    }

    return NextResponse.json({
      message: 'Product created successfully',
      productId: product.id,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const countOnly = searchParams.get('countOnly') === 'true';
    const type = searchParams.get('type');
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search')?.trim() || searchParams.get('q')?.trim();

    const where: any = {};
    if (statusParam === 'ALL' || statusParam === '') {
      // Admin: no status filter
    } else if (statusParam) {
      where.status = statusParam;
    } else {
      where.status = 'ACTIVE'; // default when param not provided
    }
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { subtitle: { contains: search } },
        { reference: { contains: search } },
        { description: { contains: search } },
        { brand: { name: { contains: search } } },
      ];
    }

    // Return count only — avoids loading full dataset (critical for Worker limits)
    if (countOnly) {
      const count = await prisma.product.count({ where });
      return NextResponse.json({ count });
    }

    // Default limit 100; max 500 per page (Cloudflare Worker memory/CPU limits)
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 100, 500) : 100;
    const pageParam = searchParams.get('page');
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const transformedProducts = products.map((product: any) => ({
      ...product,
      categories: product.categories.map((pc: any) => pc.category),
    }));

    // Return paginated format when ?page= is explicitly set (admin pagination)
    if (pageParam !== null) {
      return NextResponse.json({
        products: transformedProducts,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }
    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
