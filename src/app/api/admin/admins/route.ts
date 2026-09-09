// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getPrisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/adminAuth';
// import { AdminRole } from '@prisma/client';

// GET - List all admins
export async function GET(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const admin = await getAdminUser(request);

    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        onlineStatus: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST - Create new admin
export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const admin = await getAdminUser(request);

    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { name, email, password, role } = (await request.json()) as {
      name: string;
      email: string;
      password: string;
      role: string;
    };

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Tüm alanlar zorunludur' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Şifre en az 6 karakter olmalı' },
        { status: 400 },
      );
    }

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kayıtlı' },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: (role as any) || 'ADMIN',
        status: 'ACTIVE',
        onlineStatus: 'OFFLINE',
      },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: 'CREATE_ADMIN',
        details: `Yeni admin oluşturuldu: ${newAdmin.email}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'Admin başarıyla oluşturuldu',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
        onlineStatus: newAdmin.onlineStatus,
        lastLogin: newAdmin.lastLogin,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
