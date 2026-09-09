'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import brands from '@/mocks/brands-mock';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

export default function BrandsSection() {
  const extendedBrands = [...brands, ...brands];

  return (
    <Section className="bg-white !py-0 overflow-hidden">
      <Container className="!py-0 !px-0 !max-w-none">
        <Marquee speed={40} gradient={false}>
          {extendedBrands.map((img, i) => (
            <div
              key={`brand-${i}`}
              className="shrink-0 flex gap- items-center justify-center bg-white rounded-lg h-24 px-4 lg:px-8 transition hover:opacity-80"
            >
              <Image
                src={img}
                alt={`Brand ${(i % brands.length) + 1}`}
                width={150}
                height={60}
                className="object-contain max-h-24 h-auto w-[90px] px-1 max-sm:w-[80px]"
              />
            </div>
          ))}
        </Marquee>
      </Container>
    </Section>
  );
}
