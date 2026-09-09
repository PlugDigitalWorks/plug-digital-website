export const runtime = 'edge';

import BrandsSection from '@/components/pages/home/BrandsSection';
import TestimonialsSection from '@/components/pages/home/TestimonialsSection';
import BagsHero from '@/components/pages/bags/BagsHero';
import { ProductWithRelations } from '@/lib/definitions';
import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductSection from '@/components/tools/ProductSection';

export const metadata: Metadata = {
  title: 'Luxury Bags | Designer Handbags & Accessories | Pacha of London',
  description:
    'Discover our collection of luxury bags including designer handbags and accessories.',
  alternates: {
    canonical: 'https://pachaoflondon.com/bag',
  },
};

async function getBags(
  page: number = 1,
  search?: string,
  sort?: string,
  brand?: string,
  category?: string,
): Promise<{
  products: ProductWithRelations[];
  allBrands: {
    name: string;
    slug: string;
  }[];
  allCategories: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  try {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '12');
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (brand) params.set('brand', brand);
    if (category) params.set('category', category);

    const apiUrl = process.env.BASE_URL
      ? `${process.env.BASE_URL}/api/products/bags?${params.toString()}`
      : `/api/products/bags?${params.toString()}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 0 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return {
        products: [],
        allBrands: [],
        allCategories: [],
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
      };
    }

    const data = (await response.json()) as {
      products: ProductWithRelations[];
      allBrands: {
        name: string;
        slug: string;
      }[];
      allCategories: string[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };

    return {
      products: data.products || [],
      allBrands: data.allBrands || [],
      allCategories: data.allCategories || [],
      pagination: data.pagination,
    };
  } catch (error) {
    console.error('Error fetching bags:', error);
    return {
      products: [],
      allBrands: [],
      allCategories: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}

export default async function BagsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = parseInt((params.page as string) || '1');
  const search = params.search as string | undefined;
  const sort = params.sort as string | undefined;
  const brand = params.brand as string | undefined;
  const category = params.category as string | undefined;

  const {
    products: bags,
    allBrands,
    allCategories,
    pagination,
  } = await getBags(page, search, sort, brand, category);

  return (
    <>
      <BagsHero />

      <Suspense fallback={<div>Loading bags...</div>}>
        <ProductSection
          type="bag"
          products={bags}
          allBrands={allBrands}
          allCategories={allCategories}
          pagination={pagination}
        />
      </Suspense>

      <TestimonialsSection noHeading />
      <BrandsSection />
    </>
  );
}
