import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import getPrisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key',
);

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'NOT_DEFINED';
  status: string;
  onlineStatus: string;
  lastLogin: Date | null;
  createdAt: Date;
}

export async function getAdminUser(
  request?: NextRequest,
): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return null;
    }

    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const adminId = payload.adminId as string;
    const prisma = getPrisma();
    // Get admin data
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        onlineStatus: true,
        lastLogin: true,
        createdAt: true,
      },
    });

    if (!admin || admin.status !== 'ACTIVE') {
      return null;
    }

    return admin as AdminUser;
  } catch (error) {
    console.error('Get admin user error:', error);
    return null;
  }
}

export async function requireAdminAuth(): Promise<AdminUser> {
  const admin = await getAdminUser();

  if (!admin) {
    // Use NextResponse.redirect instead of redirect() to avoid issues
    throw new Error('UNAUTHORIZED');
  }

  return admin;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const admin = await getAdminUser();
  return admin !== null;
}
