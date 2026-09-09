export const runtime = 'edge';

import { Metadata } from 'next';
import MissionVisionSection from '@/components/pages/about/MissionVisionSection';
import InnovationSection from '@/components/pages/about/InnovationSection';
import AboutFAQSection from '@/components/pages/about/AboutFAQSection';
import FindSignatureSection from '@/components/pages/home/FindSignatureSection';
import BrandsSection from '@/components/pages/home/BrandsSection';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us: Our Passion for Luxury Timepieces | Pacha London',
  description:
    'Discover the story behind Pacha London. We are dedicated to providing the finest luxury watches and jewellery with a focus on authenticity and expertise.',
  openGraph: {
    title: 'About Us: Our Passion for Luxury Timepieces | Pacha London',
    description:
      'Discover the story behind Pacha London. We are dedicated to providing the finest luxury watches and jewellery with a focus on authenticity and expertise.',
  },
  twitter: {
    title: 'About Us: Our Passion for Luxury Timepieces | Pacha London',
    description:
      'Discover the story behind Pacha London. We are dedicated to providing the finest luxury watches and jewellery with a focus on authenticity and expertise.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <MissionVisionSection />
      {/* <InnovationSection /> */}
      <AboutFAQSection />
      <FindSignatureSection />
      <BrandsSection />
    </>
  );
}
