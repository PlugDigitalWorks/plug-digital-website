'use client';

import Link from 'next/link';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import ProductCard from '@/components/tools/ProductCard';
import { ProductWithRelations } from '@/lib/definitions';

interface BrandResult {
  id: string;
  name: string;
  href: string;
  type: string;
}

interface CategoryResult {
  id: string;
  name: string;
  href: string;
  type: string;
}

interface SearchResultsProps {
  query: string;
  results: ProductWithRelations[];
  brands?: BrandResult[];
  categories?: CategoryResult[];
}

export default function SearchResults({
  query,
  results,
  brands = [],
  categories = [],
}: SearchResultsProps) {
  const totalCount = results.length + brands.length + categories.length;

  return (
    <Section className="bg-white min-h-[60vh]">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-secondary text-[#3A2121] mb-2">
            Search Results
          </h1>
          <p className="text-[#3A2121]/60">
            Found {totalCount} results for &quot;
            <span className="font-semibold text-[#3A2121]">{query}</span>&quot;
          </p>
        </div>

        {/* Brands */}
        {brands.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-[#E3B685] uppercase tracking-widest mb-4">
              Brands
            </h2>
            <div className="flex flex-wrap gap-3">
              {brands.map((b) => (
                <Link
                  key={b.id}
                  href={b.href}
                  className="px-4 py-2 bg-[#FAF9F6] border border-[#E3B685]/20 rounded-full text-[#3A2121] hover:border-[#E3B685] hover:text-[#E3B685] transition-colors text-sm font-medium"
                >
                  {b.name}
                  <span className="ml-2 text-[10px] text-[#3A2121]/50 uppercase">
                    {b.type}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-[#E3B685] uppercase tracking-widest mb-4">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  className="px-4 py-2 bg-[#FAF9F6] border border-[#E3B685]/20 rounded-full text-[#3A2121] hover:border-[#E3B685] hover:text-[#E3B685] transition-colors text-sm font-medium"
                >
                  {c.name}
                  <span className="ml-2 text-[10px] text-[#3A2121]/50 uppercase">
                    {c.type}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                type={product.type.toLowerCase() as any}
                brand={product.brand.name}
                title={product.title}
                description={product.subtitle || ''}
                price={product.price}
                image={
                  (product.images as string[])?.[0] || '/images/placeholder.png'
                }
                slug={product.slug}
                cartIcon
              />
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl text-[#3A2121]/40 mb-4 font-secondary">
              No results found matching your search.
            </p>
            <p className="text-[#3A2121]/40">
              Try checking your spelling or using different keywords.
            </p>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
