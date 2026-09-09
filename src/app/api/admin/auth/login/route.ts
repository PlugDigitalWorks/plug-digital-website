// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getPrisma from '@/lib/prisma';
import { sendOTPEmail } from '@/lib/emailService-edge';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
/* import { sendOTPEmail } from '@/lib/emailService-edge'; */
// import { AdminRole } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key',
);

export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  try {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email ve şifre gereklidir' },
        { status: 400 },
      );
    }

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { message: 'Geçersiz email veya şifre' },
        { status: 401 },
      );
    }

    // Check if admin is active
    if (admin.status !== 'ACTIVE') {
      return NextResponse.json(
        { message: 'Hesabınız aktif değil' },
        { status: 401 },
      );
    }

    // Check if admin has a valid role assigned
    if (admin.role === 'NOT_DEFINED') {
      return NextResponse.json(
        {
          message:
            'Hesabınıza henüz rol atanmamış. Lütfen yöneticinizle iletişime geçin.',
        },
        { status: 403 },
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Geçersiz email veya şifre' },
        { status: 401 },
      );
    }

    /*  // Generate 6-digit OTP
     const otp = Math.floor(100000 + Math.random() * 900000).toString();
     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
 
     // Delete any existing OTP for this email
     await prisma.adminOTP.deleteMany({
       where: { email: email.toLowerCase() },
     });
 
     // Create new OTP record
     await prisma.adminOTP.create({
       data: {
         email: email.toLowerCase(),
         otp,
         expiresAt,
       },
     });
 
     // Send OTP email
     const emailSent = await sendOTPEmail(email, otp);
 
     // Local development'ta email gönderimi başarısız olursa OTP'yi console'a yazdır
     if (!emailSent) {
       if (process.env.NODE_ENV === 'development') {
         console.log('⚠️  [DEV MODE] Email gönderilemedi, OTP:', otp);
         console.log('⚠️  [DEV MODE] Email:', email);
         // Development'ta devam et, OTP'yi console'da göster
       } else {
         // Production'da email gönderimi zorunlu
         return NextResponse.json(
           { message: 'OTP gönderilemedi. Lütfen tekrar deneyin.' },
           { status: 500 },
         );
       }
     }
 
     // Log admin activity
     await prisma.adminActivity.create({
       data: {
         adminId: admin.id,
         action: 'LOGIN_ATTEMPT',
         details: 'OTP requested for login',
         ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
         userAgent: request.headers.get('user-agent') || 'unknown',
       },
     }); */

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        onlineStatus: 'ONLINE',
      },
    });

    // Create JWT token
    const token = await new SignJWT({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    // Log successful login
    await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action: 'LOGIN_SUCCESS',
        details: 'Successfully logged in with OTP',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'Giriş başarılı',
      email: email,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
