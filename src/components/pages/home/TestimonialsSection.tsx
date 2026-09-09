'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import testimonials from '@/mocks/testimonials-mock';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRef } from 'react';
import { motion } from 'framer-motion';

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

export default function TestimonialsSection({
  noHeading,
}: {
  noHeading?: boolean;
}) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <Section className="bg-white">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {!noHeading && (
            <div className="flex items-center justify-between mb-6 gap-4">
              <motion.div variants={itemVariants}>
                <div className="text-primary text-sm mb-1 font-primary tracking-wide">
                  TESTIMONIALS
                </div>
                <h2 className="text-primary text-3xl md:text-4xl font-secondary font-medium">
                  Customer Reviews
                </h2>
              </motion.div>
              <motion.div variants={itemVariants} className="flex gap-2">
                <button
                  ref={prevRef}
                  className="w-10 h-10 flex items-center justify-center"
                  aria-label="Previous"
                >
                  <img
                    src="/icons/arrow-left.svg"
                    alt="Prev"
                    className="w-8 h-8"
                  />
                </button>
                <button
                  ref={nextRef}
                  className="w-10 h-10 flex items-center justify-center"
                  aria-label="Next"
                >
                  <img
                    src="/icons/arrow-right.svg"
                    alt="Next"
                    className="w-8 h-8"
                  />
                </button>
              </motion.div>
            </div>
          )}
          <motion.div variants={itemVariants}>
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
              onInit={(swiper) => {
                // @ts-ignore
                swiper.params.navigation.prevEl = prevRef.current;
                // @ts-ignore
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              spaceBetween={24}
              slidesPerView={1}
              slidesPerGroup={1}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  slidesPerGroup: 2,
                },
              }}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="h-[340px] flex flex-col justify-stretch">
                    {t.image ? (
                      <Image
                        src={t.image}
                        alt={t.name || 'Testimonial'}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover rounded"
                        style={{ minHeight: 0, minWidth: 0 }}
                      />
                    ) : (
                      <div className="bg-primary p-12 rounded flex flex-col gap-2 h-full justify-center">
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: t.stars || 0 }).map((_, s) => (
                            <img
                              key={s}
                              src="/icons/star-gold.svg"
                              alt="star"
                              className="w-5 h-5"
                            />
                          ))}
                        </div>
                        <div className="text-white text-base mb-4">
                          {t.text}
                        </div>
                        <div className="text-white text-sm font-semibold">
                          {t.name}
                        </div>
                        <div className="text-white text-xs opacity-80">
                          {t.location}
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
