import React from 'react';
import Image from 'next/image';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/button';
import Link from 'next/link';

export default function MissionVisionSection() {
  return (
    <Section>
      <Container>
        <h1 className="text-[40px] max-md:text-[30px] font-normal text-primary mb-12 leading-none text-center md:text-left">
          About Us
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          {/* Mission (sol) */}
          <div className="flex-1 w-full flex flex-col justify-center">
            <h2 className="text-[40px] max-md:text-[30px] font-normal text-primary mb-4 leading-none">
              Our Mission
            </h2>
            <p className="text-primary/90 text-base mb-4">
              Our mission is to redefine the way people perceive and experience
              timekeeping. We are committed to offering an unparalleled
              selection of exquisite timepieces that not only tell time but also
              tell stories.
            </p>
            <Link href="/contact-us">
              <Button variant="secondary" className="w-fit">
                Contact Us
              </Button>
            </Link>
          </div>
          {/* Mission görseli (sağ) */}
          <div className="flex-1 w-full">
            <Image
              src="/images/about-1.png"
              alt="Our Mission"
              width={500}
              height={350}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse items-center gap-8">
          {/* Vision (sağ) */}
          <div className="flex-1 w-full flex flex-col justify-center">
            <h2 className="text-[40px] max-md:text-[30px] font-normal text-primary mb-4 leading-none">
              Our Vision
            </h2>
            <p className="text-primary/90 text-base mb-4">
              Our vision is to inspire passion, creativity, and self-expression
              through the world of horology, enriching the lives of our
              customers one watch at a time.
              <br />
              We envision a future where every individual can find their perfect
              watch, regardless of style or budget, and where the experience of
              shopping for a timepiece is as memorable as wearing it.
            </p>
            <Link href="/watch">
              <Button variant="secondary" className="w-fit">
                View Collection
              </Button>
            </Link>
          </div>
          {/* Vision görseli (sol) */}
          <div className="flex-1 w-full">
            <Image
              src="/images/about-2.png"
              alt="Our Vision"
              width={500}
              height={350}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
