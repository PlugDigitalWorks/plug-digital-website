export const runtime = 'edge';

import { Metadata } from 'next';
import ContactHeroSection from '@/components/pages/contact/ContactHeroSection';
import { BASE_URL } from '@/lib/constants';
import { shouldShowWhatsAppForVisitor } from '@/lib/geo';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch with Pacha London',
  description:
    'Have a question about a timepiece or service? Contact the Pacha London team today for expert advice and personalized assistance.',
  openGraph: {
    title: 'Contact Us | Get in Touch with Pacha London',
    description:
      'Have a question about a timepiece or service? Contact the Pacha London team today for expert advice and personalized assistance.',
  },
  twitter: {
    title: 'Contact Us | Get in Touch with Pacha London',
    description:
      'Have a question about a timepiece or service? Contact the Pacha London team today for expert advice and personalized assistance.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: `${BASE_URL}/contact-us`,
  },
};

export default async function ContactUsPage() {
  const showWhatsApp = await shouldShowWhatsAppForVisitor();

  return <ContactHeroSection showWhatsApp={showWhatsApp} />;
}
