export const runtime = 'edge';

import Hero from '@/components/pages/home/Hero';
import WatchAppraisalSection from '@/components/pages/home/WatchAppraisalSection';
import LatestProductsSection from '@/components/pages/home/LatestProductsSection';
import WatchPromoSection from '@/components/pages/home/WatchPromoSection';
import TestimonialsSection from '@/components/pages/home/TestimonialsSection';
import BlogsSection from '@/components/pages/home/BlogsSection';
import InstagramSection from '@/components/pages/home/InstagramSection';
import FindSignatureSection from '@/components/pages/home/FindSignatureSection';
import BrandsSection from '@/components/pages/home/BrandsSection';
import { ProductWithRelations } from '@/lib/definitions';
import React from 'react';
import { Metadata } from 'next';

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
    canonical: 'https://pachaoflondon.com',
  },
};

async function getLatestProducts(): Promise<ProductWithRelations[]> {
  try {
    // Use relative URL in production (works with Cloudflare Pages)
    // Absolute URL only if BASE_URL is explicitly set
    const apiUrl = process.env.BASE_URL
      ? `${process.env.BASE_URL}/api/products?limit=6`
      : `/api/products?limit=6`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch latest products: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const data = (await response.json()) as ProductWithRelations[];
    return data;
  } catch (error) {
    console.warn('Error fetching latest products:', error);
    return [];
  }
}

export default async function Home() {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <Hero />
      <WatchAppraisalSection />
      <LatestProductsSection products={latestProducts} />
      <WatchPromoSection />
      <TestimonialsSection />
      {/* <BlogsSection /> */}
      <InstagramSection />
      <FindSignatureSection />
      <BrandsSection />
    </>
  );
}
