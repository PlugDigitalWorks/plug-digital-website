import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key',
);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);

  const countryCode =
    request.headers.get('cf-ipcountry') ||
    request.headers.get('CF-IPCountry');
  if (countryCode) {
    response.headers.set('x-country', countryCode.toUpperCase());
  }

  // Skip middleware if JWT_SECRET is not properly configured
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET not configured, skipping middleware');
    return response;
  }

  // Admin routes that require authentication
  if (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    pathname !== '/admin/register' &&
    pathname !== '/admin/verify-otp'
  ) {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      const redirectResponse = NextResponse.redirect(
        new URL('/admin/login', request.url),
      );
      redirectResponse.headers.set('x-pathname', pathname);
      return redirectResponse;
    }

    // Verify token
    try {
      jwtVerify(token, JWT_SECRET);
    } catch (error) {
      // Token is invalid, redirect to login
      const redirectResponse = NextResponse.redirect(
        new URL('/admin/login', request.url),
      );
      redirectResponse.cookies.delete('admin-token');
      redirectResponse.headers.set('x-pathname', pathname);
      return redirectResponse;
    }
  }

  // Redirect from admin login/verify-otp if already authenticated
  if (pathname === '/admin/login' || pathname === '/admin/verify-otp') {
    const token = request.cookies.get('admin-token')?.value;

    if (token) {
      try {
        jwtVerify(token, JWT_SECRET);
        // Token is valid, redirect to admin dashboard
        const redirectResponse = NextResponse.redirect(
          new URL('/admin', request.url),
        );
        redirectResponse.headers.set('x-pathname', pathname);
        return redirectResponse;
      } catch (error) {
        // Token is invalid, allow access to login page
      }
    }
  }

  // For register page, check if any admin exists
  if (pathname === '/admin/register') {
    // We'll let the register page handle the logic for first admin
    // No redirect needed here
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
