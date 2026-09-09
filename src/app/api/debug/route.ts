// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function GET() {
  const prisma = getPrisma();
  try {
    console.log('🔍 Debug API called');
    console.log(
      '🌐 Runtime check:',
      typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis
        ? 'Edge Runtime'
        : 'Node.js',
    );

    // Test D1 binding
    let d1Available = false;
    try {
      const { getRequestContext } = require('@cloudflare/next-on-pages');
      const ctx = getRequestContext();
      console.log('CF ctx has env?', !!ctx?.env, Object.keys(ctx?.env ?? {}));
      const env = ctx?.env as { DB?: D1Database } | undefined;
      d1Available = !!env?.DB;
      console.log(
        '🗄️ D1 database binding:',
        d1Available ? 'Available' : 'Not found',
      );
    } catch (d1Error) {
      console.log('⚠️ D1 binding check failed:', d1Error);
    }

    // Test database connection
    console.log('🔍 Testing database connection...');
    const productCount = await prisma.product.count();
    const brandCount = await prisma.brand.count();
    console.log(
      `✅ Database connected - Products: ${productCount}, Brands: ${brandCount}`,
    );

    return NextResponse.json({
      success: true,
      runtime:
        typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis
          ? 'Edge Runtime'
          : 'Node.js',
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      d1Binding: d1Available,
      database: {
        productCount,
        brandCount,
        connected: true,
        type: d1Available ? 'D1' : 'SQLite/Other',
      },
      cloudflare: {
        region: process.env.CF_REGION || 'Unknown',
        colo: process.env.CF_COLO || 'Unknown',
      },
    });
  } catch (error) {
    console.error('❌ Debug API error:', error);
    return NextResponse.json(
      {
        success: false,
        runtime:
          typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis
            ? 'Edge Runtime'
            : 'Node.js',
        environment: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
