// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    // Check admin authentication
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Pagination + exclude cartItems for list (Worker 503/1102 fix — cartItems JSON can be huge)
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const [forms, total] = await Promise.all([
      prisma.checkoutForm.findMany({
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          contact: true,
          city: true,
          country: true,
          total: true,
          status: true,
          submittedAt: true,
        },
      }),
      prisma.checkoutForm.count(),
    ]);

    return NextResponse.json({
      forms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching checkout forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checkout forms' },
      { status: 500 },
    );
  }
}
