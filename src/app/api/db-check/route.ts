// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    console.log('🔍 DB Check API called');

    // Test basic connection
    console.log('Testing basic database connection...');

    // Try to get database info
    const result =
      await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`;
    console.log('Database tables:', result);

    // Try to count products if table exists
    let productCount = 0;
    let brandCount = 0;
    let categoryCount = 0;
    let tablesExist = false;

    try {
      productCount = await prisma.product.count();
      brandCount = await prisma.brand.count();
      categoryCount = await prisma.category.count();
      tablesExist = true;
      console.log(
        `Counts - Products: ${productCount}, Brands: ${brandCount}, Categories: ${categoryCount}`,
      );
    } catch (countError) {
      console.log('Tables might not exist:', countError);
    }

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        type: 'D1',
        tables: result,
        tablesExist,
        counts: tablesExist
          ? {
              products: productCount,
              brands: brandCount,
              categories: categoryCount,
            }
          : null,
      },
      runtime: 'Edge Runtime',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ DB Check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        runtime: 'Edge Runtime',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
