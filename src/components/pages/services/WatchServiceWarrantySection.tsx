import React from 'react';
import Image from 'next/image';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

export default function WatchServiceWarrantySection() {
  return (
    <Section className="!py-0" id="watch-warranty">
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <Image
              src="/images/services-2.png"
              alt="Our Full Watch Service & Warranty"
              width={500}
              height={400}
              className="object-cover w-full h-auto"
            />
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-[40px] max-md:text-[30px] font-normal text-primary mb-4 leading-none">
              Our Full Watch Service & Warranty
            </h2>
            <div className="text-primary/90 text-base mb-4">
              <p className="mb-4">
                This meticulous service takes approximately two weeks and
                includes:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Lubrication of internal movements</li>
                <li>Pressure testing for water resistance</li>
                <li>Precision time regulation</li>
                <li>Individual cleaning of all internal components</li>
                <li>And much more, ensuring every detail is perfected</li>
              </ul>
              <p className="mb-4">
                To provide you with complete peace of mind, every service and
                refurbishment is backed by a 1-year warranty, offering the
                assurance that should any unforeseen issues arise, our expert
                team will be there to assist.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
