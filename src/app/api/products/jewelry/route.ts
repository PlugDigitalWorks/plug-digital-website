export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const prisma = getPrisma();

  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const categorySlug = searchParams.get('categorySlug');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search')?.trim();
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * limit;

    const where: any = {
      type: 'JEWELLERY',
      status: 'ACTIVE',
    };

    if (brand) {
      where.brand = { slug: brand };
    }

    if (category || categorySlug) {
      where.categories = {
        some: {
          category: categorySlug
            ? { slug: categorySlug }
            : { name: { contains: category } },
        },
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      const s = search.trim();

      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { title: { contains: s } },
            { subtitle: { contains: s } },
            { description: { contains: s } },
            { reference: { contains: s } },
            { brand: { name: { contains: s } } },
          ],
        },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };

    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { title: 'asc' };
        break;
      case 'name-desc':
        orderBy = { title: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          categories: { include: { category: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const transformedProducts = products.map((product: any) => ({
      ...product,
      categories: product.categories.map((pc: any) => pc.category),
    }));

    const allBrands = await prisma.brand.findMany({
      where: {
        products: {
          some: {
            type: 'JEWELLERY',
            status: 'ACTIVE',
          },
        },
      },
      select: {
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const categories = await prisma.category.findMany({
      where: {
        type: 'JEWELLERY',
      },
      select: {
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const allCategories = categories.map((c) => c.name);

    return NextResponse.json({
      products: transformedProducts,
      allBrands,
      allCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching jewellery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jewellery' },
      { status: 500 },
    );
  }
}
