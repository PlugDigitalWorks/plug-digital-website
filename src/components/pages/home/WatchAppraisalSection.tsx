'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Image from 'next/image';
import { motion } from 'framer-motion';

const items = [
  {
    label: 'Our Expertise in Watch Servicing',
    href: '/services#watch-servicing',
  },
  {
    label: 'Our Full Watch Service & Warranty',
    href: '/services#watch-warranty',
  },
  {
    label: 'Luxury Jewellery Collection',
    href: '/jewellery',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as const,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function WatchAppraisalSection() {
  return (
    <Section className="bg-primary">
      <Container>
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left: Texts */}
          <motion.div
            className="flex-1 justify-between flex flex-col items-start gap-6 order-2 lg:order-1 lg:max-w-[520px] lg:h-[520px]"
            variants={itemVariants}
          >
            <motion.div
              className="flex flex-col lg:gap-4 gap-2"
              variants={itemVariants}
            >
              <h2 className="text-white text-[30px] md:text-[36px] font-secondary font-normal">
                Luxury Watch Appraisal
              </h2>
              <p className="font-primary text-white text-[16px] md:text-[20px] mb-4">
                Whether you're seeking a statement piece for a special occasion
                or an everyday watch that reflects your unique personality, our
                styling sessions offer tailored guidance and recommendations.
              </p>
            </motion.div>
            <motion.ul
              className="w-full flex flex-col gap-2 mt-2"
              variants={itemVariants}
            >
              {items.map((item, idx) => (
                <motion.li
                  key={item.label}
                  className="w-full"
                  variants={listItemVariants}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-1 md:gap-2 text-secondary border-b border-secondary py-3 text-[14px] md:text-base group hover:underline"
                    style={{ textDecorationThickness: 2 }}
                  >
                    <span className="text-secondary text-[14px] font-primary min-w-[2em]">
                      {`0${idx + 1}.`}
                    </span>
                    <span className="text-secondary font-secondary text-[18px] md:text-[22px] group-hover:underline group-hover:decoration-secondary group-hover:underline-offset-2 transition">
                      {item.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          {/* Right: Image */}
          <motion.div
            className="flex-1 flex justify-center items-center order-1 lg:order-2 w-full max-w-[520px]"
            variants={imageVariants}
          >
            <Image
              src="/images/watch-appraisal.webp"
              alt="Luxury Watch Appraisal"
              width={600}
              height={600}
              className="rounded-sm object-cover aspect-square w-full h-full"
            />
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
