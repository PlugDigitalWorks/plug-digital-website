import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import '../globals.scss';
import { Toast } from '@/components/ui/Toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { CartProvider } from '@/context/CartContext';
import { BASE_URL } from '@/lib/constants';
import { shouldShowWhatsAppForVisitor } from '@/lib/geo';
import AnalyticsHead from '@/components/tools/analytics/analyticsHead';
import AnalyticsBody from '@/components/tools/analytics/analyticsBody';

const primaryFont = Open_Sans({
  variable: '--font-primary',
  preload: true,
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});
/* 
const secondaryFont = Raleway({
  variable: '--font-secondary',
  preload: true,
  display: 'swap',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
}); */

export const metadata: Metadata = {
  title: 'Pacha of London - Luxury Watches & Jewelry | Knightsbridge',
  description:
    'Discover exquisite luxury watches and jewelry at Pacha of London. Premium Rolex, Patek Philippe, Audemars Piguet watches and designer jewelry in Knightsbridge, London.',
  keywords:
    'luxury watches, jewelry, Rolex, Patek Philippe, Audemars Piguet, Knightsbridge, London, luxury timepieces, designer jewelry',
  openGraph: {
    title: 'Pacha of London - Luxury Watches & Jewelry',
    description:
      'Discover exquisite luxury watches and jewelry at Pacha of London. Premium timepieces and designer jewelry in Knightsbridge, London.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Pacha of London',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pacha of London - Luxury Watches & Jewelry',
    description:
      'Discover exquisite luxury watches and jewelry at Pacha of London.',
  },
  alternates: {
    canonical: `${BASE_URL}`,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const IS_LOCAL = process.env.NEXT_LOCAL || false;
  const showWhatsApp = await shouldShowWhatsAppForVisitor();
  return (
    <html lang="en">
      <head>{!IS_LOCAL && <AnalyticsHead />}</head>

      <body className={`${primaryFont.variable} antialiased`}>
        <CartProvider>
          <Header />
          <>{children}</>
          <Footer />
          <Toast />
          {showWhatsApp && (
            <WhatsAppButton
              phoneNumber="447999993330"
              message="Hello! I'm interested in your luxury watches and jewelry. Can you help me?"
            />
          )}
          <div id="modal-root" />
        </CartProvider>
        {!IS_LOCAL && <AnalyticsBody />}
      </body>
    </html>
  );
}
