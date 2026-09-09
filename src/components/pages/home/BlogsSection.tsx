'use client';

import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import BlogCard from './BlogCard';
import Button from '@/components/ui/button';
import Link from 'next/link';
import blogs from '@/mocks/blogs-mock';
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

export default function BlogsSection() {
  return (
    <Section className="bg-white">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="flex flex-row md:items-center justify-between mb-8 gap-4 max-md:gap-2 ">
            <motion.div variants={itemVariants}>
              <div className="text-[#3A2121] text-sm mb-1 font-primary tracking-wide">
                BLOGS
              </div>
              <h2 className="text-[#3A2121] text-3xl md:text-4xl font-secondary font-medium">
                News & Articles
              </h2>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="w-fit md:w-auto self-end md:self-auto max-md:whitespace-nowrap"
                >
                  View All
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants}>
                <BlogCard {...blog} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
