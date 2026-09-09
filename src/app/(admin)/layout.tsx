import '../globals.scss';
import type { Metadata } from 'next';
import { Open_Sans, Raleway } from 'next/font/google';

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

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${primaryFont.variable} ${secondaryFont.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
