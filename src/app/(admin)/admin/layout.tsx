import '../../globals.scss';
import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Open_Sans, Raleway } from 'next/font/google';
import { Toast } from '@/components/ui/Toast';
import { AdminShell } from '@/components/admin/AdminShell';
import { headers } from 'next/headers';

const primaryFont = Open_Sans({
  variable: '--font-primary',
  preload: true,
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const secondaryFont = Raleway({
  variable: '--font-secondary',
  preload: true,
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Pacha of London Admin',
  description: 'Admin panel for Pacha of London',
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Auth sayfalarında sidebar ve header gizle
  const isAuthPage =
    pathname.includes('/admin/login') ||
    pathname.includes('/admin/register') ||
    pathname.includes('/admin/verify-otp');

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
        <Toast />
        <div id="modal-root" />
      </div>
    );
  }

  return (
    <>
      <AdminShell>{children}</AdminShell>
      <Toast />
      <div id="modal-root" />
    </>
  );
}
