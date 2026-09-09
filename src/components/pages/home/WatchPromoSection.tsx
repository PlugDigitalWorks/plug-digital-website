'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function WatchPromoSection() {
  const promos = [
    {
      image: '/images/section-watch-1.webp',
      label: 'LUXURY WATCH',
      title: 'Where Style Meets Substance.',
      button: 'Explore Collection',
      href: '/watch',
    },
    {
      image: '/images/section-watch-2.webp',
      label: 'WEAR PROFESSIONAL',
      title: 'Fashion Meets Function In Every Tick.',
      button: 'Shop Watches',
      href: '/watch',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <Section className="bg-white">
      <Container>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-7 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {promos.map((promo, i) => (
            <motion.div
              key={i}
              className={`relative h-[340px] md:h-[400px] rounded-lg overflow-hidden group ${
                i === 0 ? 'md:col-span-3' : 'md:col-span-4'
              }`}
              variants={itemVariants}
            >
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover w-full h-full"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-black/30 z-10" />
              <div className="absolute z-20 top-0 left-0 w-full h-full flex flex-col justify-between p-6">
                <div>
                  <div className="text-white text-xs font-medium tracking-widest mb-2 drop-shadow-lg">
                    {promo.label}
                  </div>
                  <div className="text-white text-2xl md:text-3xl font-secondary font-normal mb-4 drop-shadow-lg max-w-xs">
                    {promo.title}
                  </div>
                </div>
                <a
                  href={promo.href}
                  className="flex items-center gap-2 text-white px-2 py-2 text-base font-normal w-fit"
                  style={{ borderColor: 'white', color: 'white' }}
                >
                  {promo.button}
                  <img
                    src="/icons/arrow-right-2.svg"
                    alt="arrow"
                    className="w-5 h-5 ml-1"
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
