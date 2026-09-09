// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/adminAuth';
import { OrderStatus } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    // Check admin authentication
    const { id } = await params;
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch specific checkout form
    const form = await prisma.checkoutForm.findUnique({
      where: { id: id },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching checkout form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch checkout form' },
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
    if (
      ![
        'PENDING',
        'CONFIRMED',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ].includes(status)
    ) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update the form
    const updatedForm = await prisma.checkoutForm.update({
      where: { id: id },
      data: {
        status: status as OrderStatus,
        notes: notes || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Checkout form status updated successfully',
      form: updatedForm,
    });
  } catch (error) {
    console.error('Error updating checkout form:', error);
    return NextResponse.json(
      { error: 'Failed to update checkout form' },
      { status: 500 },
    );
  }
}
