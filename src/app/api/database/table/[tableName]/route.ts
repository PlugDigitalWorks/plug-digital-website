// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> },
) {
  const prisma = getPrisma();
  try {
    const { tableName } = await params;
    let data: any[] = [];

    switch (tableName) {
      case 'products':
        data = await prisma.product.findMany({
          take: 10,
          include: {
            categories: true,
            brand: true,
          },
        });
        break;

      case 'categories':
        data = await prisma.category.findMany({
          take: 10,
        });
        break;

      case 'brands':
        data = await prisma.brand.findMany({
          take: 10,
        });
        break;

      case 'sellYourWatchForms':
        data = await prisma.sellYourWatchForm.findMany({
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;

      case 'checkoutForms':
        data = await prisma.checkoutForm.findMany({
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;

      case 'admins':
        data = await prisma.admin.findMany({
          take: 10,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            // Don't include password
          },
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid table name',
          },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Table data error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch table data',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
