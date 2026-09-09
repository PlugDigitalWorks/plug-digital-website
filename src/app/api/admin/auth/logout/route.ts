// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import getPrisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key',
);

export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (token) {
      try {
        // Verify token to get admin info
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const adminId = payload.adminId as string;

        // Update admin status to offline
        await prisma.admin.update({
          where: { id: adminId },
          data: { onlineStatus: 'OFFLINE' },
        });

        // Log logout activity
        await prisma.adminActivity.create({
          data: {
            adminId,
            action: 'LOGOUT',
            details: 'Admin logged out',
            ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
          },
        });
      } catch (error) {
        // Token is invalid, but we still want to clear the cookie
        console.log('Invalid token during logout:', error);
      }
    }

    // Clear the cookie
    cookieStore.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return NextResponse.json({
      message: 'Çıkış başarılı',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
