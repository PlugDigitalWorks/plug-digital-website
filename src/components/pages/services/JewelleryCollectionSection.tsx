import React from 'react';
import Image from 'next/image';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/button';
import Link from 'next/link';

export default function JewelleryCollectionSection() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-1 w-full">
            <Image
              src="/images/services-3.png"
              alt="Luxury Jewellery Collection"
              width={500}
              height={400}
              className="object-cover w-full h-auto"
            />
          </div>
          <div className="flex-1 w-full">
            <h3 className="text-[40px] max-md:text-[30px] font-normal text-primary mb-4 leading-none">
              Luxury Jewellery Collection
            </h3>
            <div className="text-primary/90 text-base mb-4">
              <p className="mb-4">
                At Pacha of London, we offer an exclusive collection of luxury
                jewellery pieces, crafted to elevate every occasion. From
                timeless classics to rare and exceptional designs, each piece is
                carefully selected to reflect uncompromising quality and
                elegance.
              </p>
              <p className="mb-4">
                Based in London's iconic Knightsbridge, we take pride in
                offering jewellery that meets the highest standards of
                authenticity and craftsmanship — because true luxury is in the
                details.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Link href="/jewellery">
                <Button variant="secondary">Shop Jewellery</Button>
              </Link>
              <Link href="/contact-us">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
