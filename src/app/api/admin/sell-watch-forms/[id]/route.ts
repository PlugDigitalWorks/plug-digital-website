// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/adminAuth';
import { FormStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    // Check admin authentication
    const admin = await getAdminUser(request);
    const { id } = await params;
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch specific sell watch form
    const form = await prisma.sellYourWatchForm.findUnique({
      where: { id: id },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching sell watch form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    // Check admin authentication
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as {
      status: string;
      notes?: string;
    };
    const { status, notes } = body;

    // Validate status
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the form
    const updatedForm = await prisma.sellYourWatchForm.update({
      where: { id: id },
      data: {
        status: status as FormStatus,
        notes: notes || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Form status updated successfully',
      form: updatedForm,
    });
  } catch (error) {
    console.error('Error updating sell watch form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 },
    );
  }
}
