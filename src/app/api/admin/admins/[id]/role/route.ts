// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/adminAuth';
// import { AdminRole } from '@prisma/client';

// PUT - Assign role to admin
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const admin = await getAdminUser(request);

    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (admin.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const adminId = id;
    const { role: roleString } = (await request.json()) as { role: string };
    const role = roleString as any;

    // Validate role
    if (role !== 'ADMIN' && role !== 'NOT_DEFINED') {
      return NextResponse.json(
        {
          message:
            'Geçersiz rol. Sadece ADMIN veya NOT_DEFINED rolü atanabilir.',
        },
        { status: 400 },
      );
    }

    // Check if admin exists
    const adminToUpdate = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!adminToUpdate) {
      return NextResponse.json(
        { message: 'Kullanıcı bulunamadı' },
        { status: 404 },
      );
    }

    // Prevent role change for SUPER_ADMIN
    if (adminToUpdate.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { message: 'Süper admin rolü değiştirilemez' },
        { status: 400 },
      );
    }

    // Update role
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: { role },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: 'ASSIGN_ROLE',
        details: `Rol atandı: ${adminToUpdate.email} -> ${role}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'Rol başarıyla atandı',
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        status: updatedAdmin.status,
        onlineStatus: updatedAdmin.onlineStatus,
        lastLogin: updatedAdmin.lastLogin,
        createdAt: updatedAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error('Assign role error:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
