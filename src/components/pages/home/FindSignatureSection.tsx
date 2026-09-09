'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/button';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function FindSignatureSection() {
  return (
    <Section className="relative min-h-[325px] py-0">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-[60%]"
        style={{ backgroundImage: "url('/images/find-your-signature-bg.png')" }}
        aria-hidden="true"
      />
      <Container>
        <motion.div
          className="relative z-10 flex flex-col justify-center h-[325px] max-w-xl pl-6 md:pl-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="text-white text-3xl md:text-4xl font-normal mb-4 drop-shadow-lg"
            variants={itemVariants}
          >
            Find your signature timepiece.
          </motion.h2>
          <motion.p
            className="text-white text-base md:text-lg mb-6 drop-shadow-lg max-w-lg"
            variants={itemVariants}
          >
            Where luxury meets individuality. Discover a curated selection of
            exquisite watches that resonate with your unique style and
            personality.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button href="/watch" variant="outline-white" className="w-fit">
              View Collection
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
