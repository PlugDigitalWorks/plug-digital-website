// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getPrisma from '@/lib/prisma';
// import { AdminRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { name, email, password } = (await request.json()) as {
      name: string;
      email: string;
      password: string;
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

    // Check if any admin with a role exists (excluding NOT_DEFINED)
    const existingAdmins = await prisma.admin.count({
      where: {
        role: {
          not: 'NOT_DEFINED',
        },
      },
    });
    const isFirstAdmin = existingAdmins === 0;

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
    const admin = await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: isFirstAdmin ? 'SUPER_ADMIN' : 'NOT_DEFINED', // First admin gets SUPER_ADMIN, others get NOT_DEFINED
        status: 'ACTIVE',
        onlineStatus: 'OFFLINE',
      },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: 'REGISTER',
        details: `Admin kayıt oldu: ${admin.email}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json(
      {
        message: isFirstAdmin
          ? 'İlk admin olarak başarıyla kayıt oldunuz! Artık giriş yapabilirsiniz.'
          : 'Kayıt başarılı! Rol atanana kadar giriş yapamazsınız.',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isFirstAdmin,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Admin register error:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
