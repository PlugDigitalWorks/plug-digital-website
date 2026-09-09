// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    // Get counts for all tables
    const [
      productCount,
      categoryCount,
      brandCount,
      sellYourWatchFormCount,
      checkoutFormCount,
      adminCount,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.sellYourWatchForm.count(),
      prisma.checkoutForm.count(),
      prisma.admin.count(),
    ]);

    const stats = {
      products: productCount,
      categories: categoryCount,
      brands: brandCount,
      sellYourWatchForms: sellYourWatchFormCount,
      checkoutForms: checkoutFormCount,
      admins: adminCount,
    };

    // Get sample data — strict take limits for Cloudflare Worker 1102
    const SAMPLE_SIZE = 5;
    const [
      productSample,
      categorySample,
      brandSample,
      sellYourWatchFormSample,
      checkoutFormSample,
      adminSample,
    ] = await Promise.all([
      prisma.product.findMany({
        take: SAMPLE_SIZE,
        include: {
          categories: { include: { category: true } },
          brand: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        take: SAMPLE_SIZE,
        orderBy: { name: 'asc' },
      }),
      prisma.brand.findMany({
        take: SAMPLE_SIZE,
        orderBy: { name: 'asc' },
      }),
      prisma.sellYourWatchForm.findMany({
        take: SAMPLE_SIZE,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.checkoutForm.findMany({
        take: SAMPLE_SIZE,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.admin.findMany({
        take: SAMPLE_SIZE,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const tableData = [
      {
        tableName: 'products',
        count: productCount,
        sampleData: productSample,
      },
      {
        tableName: 'categories',
        count: categoryCount,
        sampleData: categorySample,
      },
      {
        tableName: 'brands',
        count: brandCount,
        sampleData: brandSample,
      },
      {
        tableName: 'sellYourWatchForms',
        count: sellYourWatchFormCount,
        sampleData: sellYourWatchFormSample,
      },
      {
        tableName: 'checkoutForms',
        count: checkoutFormCount,
        sampleData: checkoutFormSample,
      },
      {
        tableName: 'admins',
        count: adminCount,
        sampleData: adminSample,
      },
    ];

    return NextResponse.json({
      success: true,
      stats,
      tableData,
    });
  } catch (error: any) {
    console.error('Database stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch database stats',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
