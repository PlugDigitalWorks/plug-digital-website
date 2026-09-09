// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

// GET - Tüm contact formlarını getir
export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { subject: { contains: search } },
        { message: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [forms, total] = await Promise.all([
      prisma.contactForm.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactForm.count({ where }),
    ]);

    return NextResponse.json({
      forms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Contact forms fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact forms' },
      { status: 500 },
    );
  }
}

// POST - Yeni contact form oluştur
export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const body = (await request.json()) as any;
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const form = await prisma.contactForm.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'PENDING',
      },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Contact form creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create contact form' },
      { status: 500 },
    );
  }
}
