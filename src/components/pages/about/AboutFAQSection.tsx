'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

const faqs = [
  // {
  //   question: 'Are all your watches authentic?',
  //   answer: '',
  // },
  {
    question: 'Do you offer watch servicing and repairs?',
    answer:
      'Yes. Our in-house Swiss-trained watchmakers provide comprehensive servicing, repairs, and refurbishments for luxury watches. Whether you need a full service, battery replacement, or strap refurbishment, we ensure your timepiece is handled with care and expertise.',
  },
  // {
  //   question: 'Can I trade in my current watch for another model?',
  //   answer: '',
  // },
  // {
  //   question: 'How do I sell my watch to Pacha of London?',
  //   answer: '',
  // },
  // {
  //   question: 'Do you ship internationally?',
  //   answer: '',
  // },
];

export default function AboutFAQSection() {
  const [open, setOpen] = useState([0, 1]); // ilk iki açık

  const toggle = (idx: number) => {
    setOpen((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Görsel */}
          <div className="flex-1 w-full">
            <Image
              src="/images/about-4.png"
              alt="FAQ Watch"
              width={420}
              height={420}
              className="object-cover w-full h-auto"
            />
          </div>
          {/* FAQ */}
          <div className="flex-1 w-full">
            <div className="divide-y divide-[#EAD6C2] border-t border-b border-[#EAD6C2]">
              {faqs.map((faq, idx) => (
                <div key={faq.question}>
                  <button
                    className="w-full flex items-center justify-between py-5 text-left text-primary text-lg font-normal focus:outline-none"
                    onClick={() => toggle(idx)}
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`ml-2 transition-transform ${open.includes(idx) ? 'rotate-180' : ''}`}
                    >
                      <Image
                        src="/icons/arrow-down.svg"
                        alt="arrow-down"
                        width={24}
                        height={24}
                      />
                    </span>
                  </button>
                  {open.includes(idx) && faq.answer && (
                    <div className="text-primary/80 text-base pb-5 pl-1 pr-2 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
