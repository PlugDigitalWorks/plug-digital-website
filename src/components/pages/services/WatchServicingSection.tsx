import React from 'react';
import Image from 'next/image';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/button';
import Link from 'next/link';

export default function WatchServicingSection() {
  return (
    <Section id="watch-servicing">
      <Container>
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          <div className="flex-1 w-full">
            <Image
              src="/images/services-1.webp"
              alt="Our Expertise in Watch Servicing"
              width={500}
              height={400}
              className="object-cover w-full h-auto max-h-[500px]"
            />
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-[40px] max-md:text-[30px] font-normal text-primary mb-4 leading-none">
              Our Expertise in Watch Servicing
            </h1>
            <div className="text-primary/90 text-base mb-4">
              <p className="mb-4">
                At Pacha of London, we take pride in offering a first-class
                watch service, crafted within our exclusive in-house workshop.
              </p>
              <p className="mb-4">
                Our expert team, including Swiss-trained and certified
                watchmakers, is dedicated to delivering the highest standards of
                care and precision — whether it's a comprehensive service, a
                simple battery replacement, metal strap refurbishment, or any
                other watch-related need.
              </p>
              <p className="mb-4">
                For discerning collectors, we highly recommend our Full Watch
                Service, designed to restore your timepiece to its finest
                condition.
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <Link href="/watch">
                <Button variant="secondary">View Collection</Button>
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
