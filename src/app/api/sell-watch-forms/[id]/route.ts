// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
// import { FormStatus } from '@prisma/client';
import getPrisma from '@/lib/prisma';

// GET - Get single form details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    const form = await prisma.sellYourWatchForm.findUnique({
      where: { id },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 },
    );
  }
}

// PUT - Update form status and notes
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;
    const body = (await request.json()) as {
      status: string;
      notes?: string;
    };

    const { status, notes } = body;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedForm = await prisma.sellYourWatchForm.update({
      where: { id },
      data: {
        status: status as any,
        notes: notes || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Form updated successfully',
      form: updatedForm,
    });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 },
    );
  }
}

// DELETE - Delete form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    await prisma.sellYourWatchForm.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Form deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 },
    );
  }
}
