'use server';

import { cookies } from 'next/headers';
import { verifyToken } from './authToken';

// ✅ Set JWT Token in HTTP-Only Cookie
export const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'admin_session',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
};

// ✅ Get Admin from JWT Token stored in Cookies
export const getAdminFromSession = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) return null;
  const admin = await verifyToken(session.value);
  console.log(admin);

  if (admin) {
    return admin;
  } else {
    return null;
  }
};
