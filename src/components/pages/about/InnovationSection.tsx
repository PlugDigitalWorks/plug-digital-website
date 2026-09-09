import React from 'react';
import Image from 'next/image';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';

const features = [
  {
    title: 'Smartwatch Integration',
    desc: 'One of the most exciting areas of innovation is the integration of smartwatch technology into traditional timepieces. By incorporating features such as fitness tracking.',
  },
  {
    title: 'Sustainable Materials',
    desc: 'From eco-friendly materials to ethical sourcing practices, we strive to minimize our environmental footprint while creating watches that stand the test of time.',
  },
  {
    title: 'Customization Options',
    desc: 'Discussing innovative customization options, such as interchangeable straps & personalized engravings, that allow customers to create unique timepieces.',
  },
  {
    title: 'Advanced Movement Technology',
    desc: 'Advancements in movement technology, such as high-frequency movements and innovative escapements, that enhance accuracy and performance in watches.',
  },
];

export default function InnovationSection() {
  return (
    <Section className="bg-[#3A2121] md:!py-0">
      <Container>
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Özellikler */}
            <div className="flex-1 flex gap-8 md:gap-4 text-white max-md:flex-col">
              <div className="flex-1 flex flex-col md:justify-between gap-8 md:py-20 max-md:order-2">
                <div className="flex-1">
                  <div className="text-secondary text-sm font-semibold mb-4">
                    <span className="block mb-2">01.</span>
                    <h4 className="text-[22px] font-normal font-primary text-white">
                      {features[0].title}
                    </h4>
                  </div>
                  <div className="text-white/90 text-base">
                    {features[0].desc}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-secondary text-sm font-semibold mb-4">
                    <span className="block mb-2">02.</span>
                    <h4 className="text-[22px] font-normal font-primary text-white">
                      {features[1].title}
                    </h4>
                  </div>
                  <div className="text-white/90 text-base">
                    {features[1].desc}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 flex justify-center items-center w-full md:w-auto max-md:order-1">
                <Image
                  src="/images/about-3.png"
                  alt="Innovation Watch"
                  width={400}
                  height={400}
                  className="object-contain scale-105 max-md:w-80"
                />
              </div>
              <div className="flex flex-1 flex-col md:justify-between gap-8 md:py-20 max-md:order-3">
                <div className="flex-1 mb-8 md:mb-0">
                  <div className="text-secondary text-sm font-semibold mb-4">
                    <span className="block mb-2">03.</span>
                    <h4 className="text-[22px] font-normal font-primary text-white">
                      {features[2].title}
                    </h4>
                  </div>
                  <div className="text-white/90 text-base">
                    {features[2].desc}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-secondary text-sm font-semibold mb-4">
                    <span className="block mb-2">04.</span>
                    <h4 className="text-[22px] font-normal font-primary text-white">
                      {features[3].title}
                    </h4>
                  </div>
                  <div className="text-white/90 text-base">
                    {features[3].desc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
