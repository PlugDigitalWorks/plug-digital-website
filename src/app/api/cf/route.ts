// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 CF API called');

    const ctx = getRequestContext();
    const hasEnv = !!ctx?.env;
    const keys = ctx?.env
      ? Object.keys(ctx.env as Record<string, unknown>)
      : [];
    const hasDB = !!(ctx?.env as any)?.DB;
    console.log('env keys:', Object.keys(ctx?.env ?? {}));
    console.log('has DB?', !!(ctx?.env as any)?.DB);
    console.log('CF Context:', { hasEnv, keys, hasDB });

    return NextResponse.json({
      success: true,
      hasEnv,
      keys,
      hasDB,
      context: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
      },
      note: 'If hasDB=false, dev platform or wrangler config is not wiring the D1 binding.',
    });
  } catch (error) {
    console.error('CF API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get Cloudflare context',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
