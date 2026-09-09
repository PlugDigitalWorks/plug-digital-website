export const runtime = 'edge';

import { Metadata } from 'next';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import BlogCard from '@/components/pages/home/BlogCard';
import blogs from '@/mocks/blogs-mock';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Luxury Watch Blog: News, Guides & Insights | Pacha London',
  description:
    'Stay updated with the Pacha London blog. Your go-to source for luxury watch news, expert buying guides, maintenance tips, and industry insights.',
  openGraph: {
    title: 'Luxury Watch Blog: News, Guides & Insights | Pacha London',
    description:
      'Stay updated with the Pacha London blog. Your go-to source for luxury watch news, expert buying guides, maintenance tips, and industry insights.',
  },
  twitter: {
    title: 'Luxury Watch Blog: News, Guides & Insights | Pacha London',
    description:
      'Stay updated with the Pacha London blog. Your go-to source for luxury watch news, expert buying guides, maintenance tips, and industry insights.',
    card: 'summary_large_image',
  },
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
};

export default function BlogPage() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="py-12">
          <div className="mb-8">
            <div className="text-[#3A2121] text-sm mb-1 font-primary tracking-wide">
              BLOGS
            </div>
            <h1 className="text-[#3A2121] text-3xl md:text-4xl font-secondary font-medium">
              News & Articles
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
