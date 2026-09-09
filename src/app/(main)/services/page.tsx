export const runtime = 'edge';

import { Metadata } from 'next';
import WatchServicingSection from '@/components/pages/services/WatchServicingSection';
import WatchServiceWarrantySection from '@/components/pages/services/WatchServiceWarrantySection';
import JewelleryCollectionSection from '@/components/pages/services/JewelleryCollectionSection';
import FindSignatureSection from '@/components/pages/home/FindSignatureSection';
import BrandsSection from '@/components/pages/home/BrandsSection';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Professional Watch Services & Repairs | Pacha London',
  description:
    'From professional watch repairs to expert valuations, explore the range of luxury services offered by the specialists at Pacha London.',
  openGraph: {
    title: 'Professional Watch Services & Repairs | Pacha London',
    description:
      'From professional watch repairs to expert valuations, explore the range of luxury services offered by the specialists at Pacha London.',
  },
  twitter: {
    title: 'Professional Watch Services & Repairs | Pacha London',
    description:
      'From professional watch repairs to expert valuations, explore the range of luxury services offered by the specialists at Pacha London.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
};

export default function ServicesPage() {
  return (
    <>
      <WatchServicingSection />
      <WatchServiceWarrantySection />
      <JewelleryCollectionSection />
      <FindSignatureSection />
      <BrandsSection />
    </>
  );
}
