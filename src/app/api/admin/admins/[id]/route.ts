// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/adminAuth';

// DELETE - Delete admin
export async function DELETE(
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

    // Check if admin exists
    const adminToDelete = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!adminToDelete) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    // Prevent self-deletion
    if (adminToDelete.id === admin.id) {
      return NextResponse.json(
        { message: 'You cannot delete your own account' },
        { status: 400 },
      );
    }

    // Delete admin activities first
    await prisma.adminActivity.deleteMany({
      where: { adminId: adminId },
    });

    // Delete admin OTP records
    await prisma.adminOTP.deleteMany({
      where: { email: adminToDelete.email },
    });

    // Delete admin
    await prisma.admin.delete({
      where: { id: adminId },
    });

    // Log admin activity
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: 'DELETE_ADMIN',
        details: `Admin silindi: ${adminToDelete.email}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
