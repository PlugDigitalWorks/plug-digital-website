export const runtime = 'edge';

import { Metadata } from 'next';
import React from 'react';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Pacha London',
  description:
    'Read the official terms and conditions for Pacha London. Information on website usage, purchasing policies, and user agreements.',
  openGraph: {
    title: 'Terms and Conditions | Pacha London',
    description:
      'Read the official terms and conditions for Pacha London. Information on website usage, purchasing policies, and user agreements.',
  },
  twitter: {
    title: 'Terms and Conditions | Pacha London',
    description:
      'Read the official terms and conditions for Pacha London. Information on website usage, purchasing policies, and user agreements.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: `${BASE_URL}/terms-and-conditions`,
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6 text-primary">
        Terms and Conditions
      </h1>
      <h2 className="text-xl font-bold text-[#E1B989] mb-2">Overview</h2>
      <p className="mb-4">
        Our refund and returns policy lasts 14 days. If 14 days have passed
        since your purchase, we can’t offer you a full refund or exchange.
      </p>
      <p className="mb-4">
        To be eligible for a return, your item must be unused and in the same
        condition that you received it. It must also be in the original
        packaging.
      </p>
      <p className="mb-4">
        Several types of goods are exempt from being returned. Perishable goods
        such as food, flowers, newspapers or magazines cannot be returned. We
        also do not accept products that are intimate or sanitary goods,
        hazardous materials, or flammable liquids or gases.
      </p>
      <p className="mb-4">
        The following terminology applies to these Terms and Conditions, Privacy
        Statement and Disclaimer Notice and any or all Agreements: Client, You
        and Your refers to you, the person accessing this website and accepting
        the Company's terms and conditions. The Company, Ourselves, We, Our and
        Us, refers to our Company. Party, Parties, or Us, refers to both the
        Client and ourselves, or either the Client or ourselves.
      </p>
      <p className="mb-4">
        All terms refer to the offer, acceptance and consideration of payment
        necessary to undertake the process of our assistance to the Client in
        the most appropriate manner, whether by formal meetings of a fixed
        duration, or any other means, for the express purpose of meeting the
        Client's needs in respect of provision of the Company's stated
        services/products, in accordance with and subject to, prevailing law of
        United Kingdom.
      </p>
      <p className="mb-4">
        Any use of the above terminology or other words in the singular, plural,
        capitalisation and/or he/she or they, are taken as interchangeable and
        therefore as referring to same.
      </p>
      <h3 className="text-lg font-bold text-[#E1B989] mt-8 mb-2">Cookies</h3>
      <p className="mb-4">
        We employ the use of cookies. By using Pacha of London's website you
        consent to the use of cookies in accordance with Pacha of London's
        privacy policy. Most of the modern day interactive websites use cookies
        to enable us to retrieve user details for each visit.
      </p>
      <p className="mb-4">
        Cookies are used in some areas of our site to enable the functionality
        of this area and ease of use for those people visiting. Some of our
        affiliate / advertising partners may also use cookies.
      </p>
      <h3 className="text-lg font-bold text-[#E1B989] mt-8 mb-2">License</h3>
      <p className="mb-4">
        Unless otherwise stated, Pacha of London and/or its licensors own the
        intellectual property rights for all material on Pacha of London. All
        intellectual property rights are reserved. You may view and/or print
        pages from this website for your own personal use subject to
        restrictions set in these terms and conditions.
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Republish material from pachaoflondon.com.</li>
        <li>Sell, rent or sub-license material from pachaoflondon.com.</li>
        <li>Reproduce, duplicate or copy material from pachaoflondon.com.</li>
        <li>
          Redistribute content from Pacha of London (unless content is
          specifically made for redistribution).
        </li>
      </ul>
      <h3 className="text-lg font-bold text-[#E1B989] mt-8 mb-2">Disclaimer</h3>
      <p className="mb-4">
        To the maximum extent permitted by applicable law, we exclude all
        representations, warranties and conditions relating to our website and
        the use of this website (including, without limitation, any warranties
        implied by law in respect of satisfactory quality, fitness for purpose
        and/or the use of reasonable care and skill).
      </p>
      <h4 className="font-semibold text-[#E1B989] mb-2">
        Nothing in this disclaimer will:
      </h4>
      <ul className="list-disc pl-6 mb-4">
        <li>
          Limit or exclude our or your liability for death or personal injury
          resulting from negligence.
        </li>
        <li>
          Limit or exclude our or your liability for fraud or fraudulent
          misrepresentation.
        </li>
        <li>
          Limit any of our or your liabilities in any way that is not permitted
          under applicable law.
        </li>
        <li>
          Or exclude any of our or your liabilities that may not be excluded
          under applicable law.
        </li>
      </ul>
      <p className="mb-4">
        The limitations and exclusions of liability set out in this Section and
        elsewhere in this disclaimer: are subject to the preceding paragraph;
        and govern all liabilities arising under the disclaimer or in relation
        to the subject matter of this disclaimer, including liabilities that
        arise in contract, tort (including negligence) and for breach of
        statutory duty.
      </p>
      <p className="mb-4">
        To the extent that the website and the information and services on the
        website are provided free of charge, we will not be liable for any loss
        or damage of any nature.
      </p>
    </div>
  );
}
