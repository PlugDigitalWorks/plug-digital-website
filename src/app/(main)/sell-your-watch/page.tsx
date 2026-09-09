export const runtime = 'edge';

import { Metadata } from 'next';
import React from 'react';
import SellYourWatchWizard from '@/components/pages/sell-your-watch/SellYourWatchWizard';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Sell Your Luxury Watch: Get a Free Valuation | Pacha London',
  description:
    'Want to sell your luxury watch? Get a competitive and fair market valuation at Pacha London. Secure, professional, and transparent selling process.',
  openGraph: {
    title: 'Sell Your Luxury Watch: Get a Free Valuation | Pacha London',
    description:
      'Want to sell your luxury watch? Get a competitive and fair market valuation at Pacha London. Secure, professional, and transparent selling process.',
  },
  twitter: {
    title: 'Sell Your Luxury Watch: Get a Free Valuation | Pacha London',
    description:
      'Want to sell your luxury watch? Get a competitive and fair market valuation at Pacha London. Secure, professional, and transparent selling process.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: `${BASE_URL}/sell-your-watch`,
  },
};

export default function SellYourWatchPage() {
  return <SellYourWatchWizard />;
}
