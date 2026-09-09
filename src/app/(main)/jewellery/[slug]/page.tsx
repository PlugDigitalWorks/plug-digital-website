export const runtime = 'edge';

import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';

import BrandsSection from '@/components/pages/home/BrandsSection';
import TestimonialsSection from '@/components/pages/home/TestimonialsSection';

import { ProductWithRelations } from '@/lib/definitions';
import { BASE_URL } from '@/lib/constants';
import ProductSection from '@/components/tools/ProductSection';

interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  type: 'WATCH' | 'JEWELLERY' | 'BAG';
  seoTitle: string | null;
  seoDescription: string | null;
}

interface JewelleryResponse {
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
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const apiUrl = process.env.BASE_URL
      ? `${process.env.BASE_URL}/api/categories?slug=${slug}`
      : `/api/categories?slug=${slug}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) return null;

    const category = (await response.json()) as Category;

    if (!category || category.type !== 'JEWELLERY') return null;

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getJewelleryByCategorySlug(
  categorySlug: string,
  page: number = 1,
  search?: string,
  sort?: string,
  brand?: string,
): Promise<JewelleryResponse> {
  try {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', '12');
    params.set('category', categorySlug);

    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (brand) params.set('brand', brand);

    const apiUrl = process.env.BASE_URL
      ? `${process.env.BASE_URL}/api/products/jewelry?${params.toString()}`
      : `/api/products/jewelry?${params.toString()}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
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

    const data = (await response.json()) as JewelleryResponse;

    return {
      products: data.products || [],
      allBrands: data.allBrands || [],
      allCategories: data.allCategories || [],
      pagination: data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
    };
  } catch (error) {
    console.error('Error fetching jewellery:', error);
    return {
      products: [],
      allBrands: [],
      allCategories: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Jewellery | Pacha London',
      description: 'Discover luxury jewellery at Pacha London.',
    };
  }

  const title =
    category.seoTitle || `${category.name} Jewellery | Pacha London`;

  const description =
    category.seoDescription ||
    category.description ||
    `Discover our collection of ${category.name.toLowerCase()} jewellery at Pacha London.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/jewellery/${category.slug}`,
    },
  };
}

export default async function JewelleryCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  const page = parseInt((query.page as string) || '1');
  const search = query.search as string | undefined;
  const sort = query.sort as string | undefined;
  const brand = query.brand as string | undefined;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    redirect('/jewellery');
  }

  const {
    products: jewelleries,
    allBrands,
    allCategories,
    pagination,
  } = await getJewelleryByCategorySlug(
    category.slug!,
    page,
    search,
    sort,
    brand,
  );

  return (
    <>
      <Suspense fallback={<div>Loading jewellery...</div>}>
        <ProductSection
          type="jewellery"
          products={jewelleries}
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
