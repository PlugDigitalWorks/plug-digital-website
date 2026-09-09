export const runtime = 'edge';

import getPrisma from '@/lib/prisma';
import SearchResults from '@/components/pages/search/SearchResults';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results | Pacha of London',
  description: 'Search results for luxury watches and jewellery.',
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').trim();

async function getSearchResults(query: string) {
  if (!query || query.trim().length < 2) {
    return { products: [], brands: [], categories: [] };
  }

  const prisma = getPrisma();
  const searchQuery = query.trim();

  try {
    const [products, brands, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { title: { contains: searchQuery } },
            { subtitle: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { reference: { contains: searchQuery } },
            { brand: { name: { contains: searchQuery } } },
          ],
        },
        include: {
          brand: true,
          categories: { include: { category: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.brand.findMany({
        where: { name: { contains: searchQuery } },
        take: 10,
      }),
      prisma.category.findMany({
        where: { name: { contains: searchQuery } },
        take: 10,
      }),
    ]);

    const brandResults = brands.map((b) => ({
      id: b.id,
      name: b.name,
      href: `${b.type === 'WATCH' ? '/watch' : b.type === 'BAG' ? '/bag' : '/jewellery'}?brand=${encodeURIComponent(b.slug || slugify(b.name))}`,
      type: b.type.toLowerCase(),
    }));
    const categoryResults = categories.map((c) => ({
      id: c.id,
      name: c.name,
      href: `${c.type === 'WATCH' ? '/watch' : c.type === 'BAG' ? '/bag' : '/jewellery'}?category=${encodeURIComponent(c.slug || slugify(c.name))}`,
      type: c.type.toLowerCase(),
    }));

    return { products, brands: brandResults, categories: categoryResults };
  } catch (error) {
    console.error('Search error:', error);
    return { products: [], brands: [], categories: [] };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = (params.q as string) || (params.search as string) || '';

  const { products, brands, categories } = await getSearchResults(query);

  return (
    <SearchResults
      query={query}
      results={products as any}
      brands={brands}
      categories={categories}
    />
  );
}
