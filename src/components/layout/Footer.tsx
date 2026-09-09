'use client';

import Container from '@/components/ui/Container';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import footerLinks from '@/mocks/footer-links';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  type?: 'WATCH' | 'JEWELLERY' | 'BAG'; // 👈 optional yaptık (API bug-proof)
}

const socials = [
  /* { icon: '/icons/socials/x.svg', href: '#' }, */
  { icon: '/icons/socials/facebook.svg', href: 'https://www.facebook.com/p/Pacha-Of-London-Jewellers-100063565797015/' },
  /* { icon: '/icons/socials/youtube.svg', href: '' }, */
  { icon: '/icons/socials/instagram.svg', href: 'https://www.instagram.com/pacha_of_london_jewellers/' },
];

export default function Footer() {
  const pages = footerLinks.find((f) => f.title === 'Pages');
  const information = footerLinks.find((f) => f.title === 'Information');

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // ✅ Fetch categories safely
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories?type=WATCH');
        const data = await res.json();

        // ✅ ensure array
        const safeData: Category[] = Array.isArray(data) ? data : [];

        setCategories(safeData);
      } catch (err) {
        console.error('Footer categories error:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ WATCH categories only (safe filter)
  const watchCategories = categories.filter(
    (c) => c && c.type === 'WATCH',
  );

  // ✅ fallback if API returns no type (optional)
  const safeCategories =
    watchCategories.length > 0 ? watchCategories : categories;

  const handleNewsletterSubmit = async () => {
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message || 'Successfully subscribed!' });
        setEmail('');
        // Clear message after 5 seconds
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Failed to subscribe. Please try again.' });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-primary text-white pt-12 pb-4">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 justify-between">
          {/* LEFT */}
          <div className="flex-1 flex flex-col gap-3 md:gap-6 max-w-xl min-w-[260px]">
            <div className="flex items-center gap-4 mb-2 max-md:mb-6">
              <Image
                src="/logo-dark.svg"
                alt="Pacha of London"
                width={312}
                height={43}
                className="max-w-[250px] md:max-w-[370px] w-full aspect-[312/43] h-auto"
              />
            </div>
            <div className="text-xl font-medium mb-1">STAY IN TOUCH.</div>
            <div className="mb-2 text-base">
              Subscribe to our newsletter and stay updated on the latest trends,
              exclusive offers & exciting releases in the world of watches.
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNewsletterSubmit();
              }}
              className="flex flex-col gap-3 max-w-lg"
            >
              <div className="flex flex-row gap-4">
                <Input
                  wrapperClassName="md:max-w-[300px] w-full"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="submit"
                  variant="tertiary"
                  className="max-md:w-fit hover:!text-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
              {submitMessage && (
                <div className={`text-sm ${submitMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                  {submitMessage.text}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex md:flex-col max-md:flex-row-reverse gap-8 mt-8 lg:mt-0">
            {/* ✅ CATEGORIES */}
            <div className="md:min-w-[250px] mb-8 md:mb-0">
              <div className="text-secondary text-lg font-medium mb-3">
                CATEGORIES
              </div>

              {loading ? (
                <div className="text-sm opacity-70">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-1">
                  {Array.from({ length: 3 }).map((_, colIdx) => (
                    <ul key={colIdx} className="flex flex-col gap-1">
                      {safeCategories
                        .filter((_, i) => i % 3 === colIdx)
                        .map((cat) => (
                          <li key={cat.id}>
                            <Link
                              href={`/watch/${cat.slug}`}
                              className="text-white text-base hover:underline"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  ))}
                </div>
              )}
            </div>

            {/* PAGES */}
            <div className="flex flex-col md:flex-row gap-8 flex-1">
              <div className="md:min-w-[160px]">
                <div className="text-secondary text-lg font-medium mb-3">
                  {pages?.title.toUpperCase()}
                </div>
                <ul className="flex flex-col gap-1">
                  {pages?.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-white text-base hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* INFORMATION */}
              <div className="md:min-w-[180px]">
                <div className="text-secondary text-lg font-medium mb-3">
                  {information?.title.toUpperCase()}
                </div>
                <ul className="flex flex-col gap-1">
                  {information?.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-white text-base hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* SOCIALS */}
        <div className="mt-12 pt-6 border-t border-[#6B4B4B] flex justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s.icon}
              href={s.href}
              className="w-12 h-12 flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={s.icon} alt="social" width={36} height={36} />
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
