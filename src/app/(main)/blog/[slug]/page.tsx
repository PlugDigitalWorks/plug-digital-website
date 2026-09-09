export const runtime = 'edge';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/button';
import blogs from '@/mocks/blogs-mock';
import { BASE_URL } from '@/lib/constants';

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: 'Blog Not Found | Pacha London',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = blog.seoTitle || `${blog.title} | Pacha London`;
  const description =
    blog.seoDescription || `Read about ${blog.title} on Pacha London's blog.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Find blog by slug
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return notFound();
  }

  return (
    <>
      <Section className="bg-white">
        <Container>
          <div className="py-12">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-8"
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to Articles
            </Link>

            {/* Article Header */}
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <span className="text-[#7C6F5F] text-sm font-medium px-3 py-1 bg-[#F8F7F5] rounded-full">
                  {blog.category}
                </span>
              </div>

              <h1 className="text-[#3A2121] text-3xl md:text-4xl lg:text-5xl font-secondary font-medium mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex items-center gap-4 text-[#7C6F5F] text-sm mb-8">
                <span>Written by: {blog.author}</span>
                <span>•</span>
                <span>
                  {new Date().toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Featured Image */}
              <div className="w-full h-[400px] md:h-[500px] bg-[#F8F7F5] rounded-lg mb-8 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-[#3A2121] text-lg leading-relaxed space-y-6">
                  <p>
                    Welcome to our comprehensive guide on{' '}
                    {blog.category.toLowerCase()} in the world of luxury
                    timepieces. This article will provide you with valuable
                    insights and expert knowledge that every watch enthusiast
                    should know.
                  </p>

                  <p>
                    In today's fast-paced world, understanding the intricate
                    details of watch craftsmanship and care has become more
                    important than ever. Whether you're a seasoned collector or
                    just beginning your journey into the world of horology, this
                    guide will offer practical advice and expert tips.
                  </p>

                  <h2 className="text-2xl font-semibold text-[#3A2121] mt-8 mb-4">
                    Key Insights and Expert Tips
                  </h2>

                  <p>
                    Our team of experts has compiled years of experience and
                    knowledge to bring you the most comprehensive information
                    available. From maintenance techniques to investment
                    strategies, we cover all aspects that matter to watch
                    enthusiasts.
                  </p>

                  <p>
                    Remember, proper care and understanding of your timepiece
                    not only preserves its value but also ensures it continues
                    to function beautifully for generations to come. The art of
                    watchmaking is a timeless craft that deserves our respect
                    and attention.
                  </p>

                  <h2 className="text-2xl font-semibold text-[#3A2121] mt-8 mb-4">
                    Conclusion
                  </h2>

                  <p>
                    We hope this article has provided you with valuable insights
                    and practical knowledge. For more expert advice and the
                    latest updates in the world of luxury watches, stay tuned to
                    our blog and explore our curated collection of timepieces.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 p-6 bg-[#F8F7F5] rounded-lg">
                <h3 className="text-xl font-semibold text-[#3A2121] mb-4">
                  Explore Our Collection
                </h3>
                <p className="text-[#3A2121]/80 mb-6">
                  Discover our curated selection of luxury watches and
                  jewellery, each piece carefully selected for its quality and
                  craftsmanship.
                </p>
                <div className="flex gap-4">
                  <Link href="/watch">
                    <Button variant="primary">View Watches</Button>
                  </Link>
                  <Link href="/jewellery">
                    <Button variant="outline">View Jewellery</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
