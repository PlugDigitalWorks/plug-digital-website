'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ✅ Password validation function
const validatePassword = async (password: string): Promise<string[]> => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Şifre en az bir büyük harf içermelidir.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Şifre en az bir küçük harf içermelidir.');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir.');
  }

  return errors;
};

// ✅ Get Admin from Session Cookie
export const getAdminFromSession = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie?.value) return null;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: sessionCookie.value },
    });

    if (!admin || admin.status !== 'ACTIVE') return null;

    return admin;
  } catch (error) {
    console.error('Error getting admin from session:', error);
    return null;
  }
};

// ✅ Login Admin (Creates Session & Updates Status)
export const loginAdmin = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return { error: 'Geçersiz e-posta veya şifre.' };

  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) return { error: 'Geçersiz e-posta veya şifre.' };

  if (admin.status !== 'ACTIVE') {
    return {
      error: 'Hesabınız aktif değil. Lütfen yönetici ile iletişime geçin.',
    };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('admin_session', admin.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  const onlineStatus = cookieStore.get('admin_online_status');
  if (!onlineStatus) {
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        onlineStatus: 'ONLINE',
      },
    });
  } else if (onlineStatus.value === 'AWAY') {
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        onlineStatus: onlineStatus.value,
      },
    });
  }

  await prisma.adminActivity.create({
    data: {
      adminId: admin.id,
      action: 'LOGIN',
      details: `Yönetici ${admin.name} giriş yaptı.`,
    },
  });

  return { success: true, admin };
};

// ✅ Register Admin (Creates Admin & Stores Session)
export const registerAdmin = async (
  email: string,
  password: string,
  name: string,
) => {
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) return { error: 'Bu e-posta adresi zaten kayıtlı.' };

  const passwordErrors = await validatePassword(password);
  if (passwordErrors.length > 0) return { error: passwordErrors.join(' ') };

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: { email, password: hashedPassword, name, role: 'ADMIN' },
  });
  await prisma.adminActivity.create({
    data: {
      adminId: admin.id,
      action: 'REGISTER',
      details: `Yönetici ${admin.name} kayıt oldu.`,
    },
  });

  return { success: true, admin };
};

// ✅ Logout Admin (Correctly Clears Session Cookie)
export const logoutAdmin = async () => {
  const admin = await getAdminFromSession();

  const cookieStore = await cookies();
  cookieStore.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // Expire immediately
  });
  if (admin) {
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        onlineStatus: 'OFFLINE',
      },
    });
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: 'LOGOUT',
        details: `Yönetici ${admin.name} çıkış yaptı.`,
      },
    });
  }

  redirect('/auth/login'); // ✅ Redirect after clearing session
};
