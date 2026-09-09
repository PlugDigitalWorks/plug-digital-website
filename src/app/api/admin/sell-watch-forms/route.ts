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

    // Fetch all sell watch forms
    const forms = await prisma.sellYourWatchForm.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching sell watch forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 },
    );
  }
}
