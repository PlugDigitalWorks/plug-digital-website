// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { FormStatus } from '@prisma/client';

// GET - Tek contact form getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    const form = await prisma.contactForm.findUnique({
      where: { id },
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Contact form not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Contact form fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact form' },
      { status: 500 },
    );
  }
}

// PUT - Contact form güncelle
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

    const form = await prisma.contactForm.update({
      where: { id },
      data: {
        status: (status as FormStatus) || undefined,
        notes: notes || undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Contact form update error:', error);
    return NextResponse.json(
      { error: 'Failed to update contact form' },
      { status: 500 },
    );
  }
}

// DELETE - Contact form sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    await prisma.contactForm.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Contact form deleted successfully' });
  } catch (error) {
    console.error('Contact form deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact form' },
      { status: 500 },
    );
  }
}
