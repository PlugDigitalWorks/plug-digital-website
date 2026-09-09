'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { name: `Men's`, href: '/watch?category=men%27s-watches' },
  { name: `Women's`, href: '/watch?category=women%27s-watches' },
  // { name: 'Skeleton', href: '/watch?category=skeleton-watches' },
  { name: 'Jewellery', href: '/jewellery' },
  { name: 'Bags', href: '/bag' },
];

const watchImages = [
  '/images/hero-watch.png',
  // '/images/about-3.png',
  '/images/watch-2.png',
  '/images/watch-3.png',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const imageVariants = {
  enter: { scale: 0.8, opacity: 0, rotate: 0 },
  center: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 0.8, opacity: 0, rotate: 0 },
};

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % watchImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section className="relative bg-gradient-to-br from-[#F8F6F3] via-white to-[#F5F0EA] overflow-hidden !py-0">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E3B685]/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#E3B685]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#3A2121]/5 to-transparent blur-2xl pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          className="min-h-[calc(100vh-120px)] py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start gap-8 max-w-2xl">
            <motion.div
              className="flex items-center gap-3"
              variants={itemVariants}
            >
              <span className="w-12 h-[2px] bg-[#E3B685]" />
              <span className="text-[#E3B685] text-sm font-medium tracking-[0.2em] uppercase">
                Luxury Collection
              </span>
            </motion.div>

            <motion.h1
              className="text-[#3A2121] text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] text-center lg:text-left font-secondary"
              variants={itemVariants}
            >
              High-End{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Luxury</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#E3B685]/20 -z-0" />
              </span>
              <br />
              Timepieces &amp; Jewellery
            </motion.h1>

            <motion.p
              className="text-[#3A2121]/70 text-lg md:text-xl max-w-xl text-center lg:text-left leading-relaxed"
              variants={itemVariants}
            >
              Elevate your style with our curated collection of exquisite
              watches and jewellery. Each piece tells a story of craftsmanship,
              elegance, and timeless sophistication.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4"
              variants={itemVariants}
            >
              <Link
                href="/watch"
                className="group relative overflow-hidden bg-[#3A2121] text-white rounded-full px-10 py-4 text-base font-medium transition-all duration-300 hover:shadow-xl hover:shadow-[#3A2121]/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collection
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                href="/jewellery"
                className="group border-2 border-[#3A2121]/20 text-[#3A2121] rounded-full px-10 py-4 text-base font-medium transition-all duration-300 hover:border-[#3A2121] hover:bg-[#3A2121]/5"
              >
                View Jewellery
              </Link>
            </motion.div>

            {/* Categories */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4"
              variants={itemVariants}
            >
              {categories.map((cat, index) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group relative px-5 py-2 text-sm text-[#3A2121]/70 transition-all duration-300 hover:text-[#3A2121]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="relative z-10">{cat.name}</span>
                  <span className="absolute inset-0 rounded-full border border-[#3A2121]/10 group-hover:border-[#E3B685] group-hover:bg-[#E3B685]/5 transition-all duration-300" />
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right - Watch Display */}
          <motion.div
            className="flex-1 flex items-center justify-center relative"
            variants={itemVariants}
          >
            <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#E3B685]/30 animate-spin-slow" />

              {/* Inner ring */}
              <div className="absolute inset-4 md:inset-6 rounded-full border border-[#E3B685]/40" />

              {/* Gold accent circle */}
              <div className="absolute inset-8 md:inset-12 rounded-full bg-gradient-to-br from-[#E3B685]/10 via-transparent to-[#E3B685]/5" />

              {/* Watch image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative"
                  >
                    <Image
                      src={watchImages[currentImage]}
                      alt={`Luxury Watch ${currentImage + 1}`}
                      width={400}
                      height={400}
                      priority
                      className="object-contain w-[250px] h-[250px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] drop-shadow-2xl"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide indicators */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {watchImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? 'w-8 bg-[#E3B685]'
                        : 'bg-[#3A2121]/20 hover:bg-[#3A2121]/40'
                    }`}
                    aria-label={`View watch ${index + 1}`}
                  />
                ))}
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute top-8 -right-4 md:top-12 md:right-0 bg-white rounded-2xl shadow-xl p-4 border border-[#E3B685]/20"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E3B685] to-[#D4A574] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-[#3A2121]/50">Certified</p>
                    <p className="text-sm font-semibold text-[#3A2121]">
                      Authentic
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating price badge */}
              {/* <motion.div
                className="absolute bottom-16 -left-4 md:bottom-20 md:left-0 bg-[#3A2121] text-white rounded-2xl shadow-xl px-5 py-3"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <p className="text-xs text-white/60">Truly</p>
                <p className="text-lg font-semibold">Iconic</p>
              </motion.div> */}
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
