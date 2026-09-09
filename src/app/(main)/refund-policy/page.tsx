export const runtime = 'edge';

import { Metadata } from 'next';
import React from 'react';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | Pacha London',
  description:
    'Review our refund and return policy. Learn about your rights, timelines, and the process for returns at Pacha London to shop with total confidence.',
  openGraph: {
    title: 'Refund & Return Policy | Pacha London',
    description:
      'Review our refund and return policy. Learn about your rights, timelines, and the process for returns at Pacha London to shop with total confidence.',
  },
  twitter: {
    title: 'Refund & Return Policy | Pacha London',
    description:
      'Review our refund and return policy. Learn about your rights, timelines, and the process for returns at Pacha London to shop with total confidence.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: `${BASE_URL}/refund-policy`,
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6 text-primary">
        Refund and Returns Policy
      </h1>

      <h2 className="text-xl font-bold text-[#E1B989] mb-2">Overview</h2>
      <p className="mb-4">
        All sales are final. <br /> We do not offer exchanges or refunds on
        watches or jewellery for change of mind, preference, size, or gifts.{' '}
        <br /> This policy does not affect your statutory rights under the
        Consumer Rights Act 2015. Items that are faulty or not as described will
        be handled in accordance with UK consumer law. <br /> For hygiene and
        security reasons, returns are not accepted on earrings, personalised
        pieces, or items that have been worn, altered, or resized. <br /> By
        completing a purchase, you confirm acceptance of this policy.
      </p>
      {/* <p className="mb-4">
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

      <h3 className="text-lg font-bold text-[#E1B989] mt-8 mb-2">
        Additional non-returnable items:
      </h3>
      <ul className="list-disc pl-6 mb-4">
        <li>Gift cards</li>
      </ul> */}

      {/* <p className="mb-4">
        To complete your return, we require a receipt or proof of purchase.
      </p>
      <p className="mb-4">
        Please do not send your purchase back to the manufacturer.
      </p>

      <h2 className="text-xl font-bold text-[#E1B989] mb-2 mt-8">Refunds</h2>
      <p className="mb-4">
        Once your return is received and inspected, we will send you an email to
        notify you that we have received your returned item. We will also notify
        you of the approval or rejection of your refund.
      </p>
      <p className="mb-4">
        If you are approved, then your refund will be processed, and a credit
        will automatically be applied to your credit card or original method of
        payment, within a certain amount of days.
      </p>

      <h3 className="text-lg font-bold text-[#E1B989] mt-8 mb-2">
        Late or missing refunds
      </h3>
      <p className="mb-4">
        If you haven't received a refund yet, first check your bank account
        again. Then contact your credit card company, it may take some time
        before your refund is officially posted.
      </p>
      <p className="mb-4">
        Next contact your bank. There is often some processing time before a
        refund is posted. If you've done all of this and you still have not
        received your refund yet, please contact us at info@pachaoflondon.com.
      </p> */}
      {/* 
      <h3 className="text-lg font-bold text-[#E1B989] mt-8 mb-2">Sale items</h3>
      <p className="mb-4">
        Only regular priced items may be refunded, unfortunately sale items
        cannot be refunded.
      </p>

      <h2 className="text-xl font-bold text-[#E1B989] mb-2 mt-8">Exchanges</h2>
      <p className="mb-4">
        We only replace items if they are defective or damaged. If you need to
        exchange it for the same item, send us an email at
        info@pachaoflondon.com and send your item to {`{shop address}`}.
      </p>

      <h2 className="text-xl font-bold text-[#E1B989] mb-2 mt-8">Gifts</h2>
      <p className="mb-4">
        If the item was marked as a gift when purchased and shipped directly to
        you, you'll receive a gift credit for the value of your return. Once the
        returned item is received, a gift certificate will be mailed to you.
      </p>
      <p className="mb-4">
        If the item wasn't marked as a gift when purchased, or the gift giver
        had the order shipped to themselves to give to you later, we will send a
        refund to the gift giver and he will find out about your return.
      </p> */}

      {/* <h2 className="text-xl font-bold text-[#E1B989] mb-2 mt-8">
        Shipping returns
      </h2>
      <p className="mb-4">
        To return your product, you should mail your product to{' '}
        {`{shop address}`}.
      </p>
      <p className="mb-4">
        You will be responsible for paying for your own shipping costs for
        returning your item. Shipping costs are non-refundable. If you receive a
        refund, the cost of return shipping will be deducted from your refund.
      </p>
      <p className="mb-4">
        Depending on where you live, the time it may take for your exchanged
        product to reach you, may vary.
      </p>
      <p className="mb-4">
        If you are shipping an item over $75, you should consider using a
        trackable shipping service or purchasing shipping insurance. We don't
        guarantee that we will receive your returned item.
      </p> */}

      {/* <h2 className="text-xl font-bold text-[#E1B989] mb-2 mt-8">Need help?</h2>
      <p className="mb-4">
        If you have any questions on how to return your item to us, contact us
        at info@pachaoflondon.com.
      </p> */}
    </div>
  );
}
