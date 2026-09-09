export const runtime = 'edge';

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import TestimonialsSection from '@/components/pages/home/TestimonialsSection';
import BrandsSection from '@/components/pages/home/BrandsSection';
import InstagramSection from '@/components/pages/home/InstagramSection';
import JewelleryDetail from '@/components/pages/jewellery/detail/JewelleryDetail';
import WatchDetail from '@/components/pages/watches/detail/WatchDetail';
import BagDetail from '@/components/pages/bags/detail/BagDetail';
import { ProductWithRelations } from '@/lib/definitions';
import { BASE_URL } from '@/lib/constants';

async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  try {
    const apiUrl = process.env.BASE_URL
      ? `${process.env.BASE_URL}/api/products/${slug}`
      : `/api/products/${slug}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch product: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = (await response.json()) as ProductWithRelations;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  // Extract SEO data from additionalInfo
  const additionalInfo = product.additionalInfo as Record<string, any>;
  const seo = additionalInfo?.seo as
    | { title?: string; description?: string }
    | undefined;

  // Use SEO data if available, otherwise fallback to product data
  const title = seo?.title || `${product.title} | Pacha London`;
  const description =
    seo?.description ||
    product.description ||
    `Discover ${product.title} at Pacha London. ${product.subtitle || ''}`.trim();

  // Get first image for Open Graph
  const images = (product.images as string[]) || [];
  const imageUrl = images[0] || '/images/placeholder.png';

  const canonicalUrl = `${BASE_URL}/product/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  // Generate JSON-LD structured data for SEO
  const images = (product.images as string[]) || [];
  const imageUrl = images[0] || '/images/placeholder.png';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.subtitle || '',
    image: images.length > 0 ? images : [imageUrl],
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || '',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'GBP',
      availability:
        product.status === 'ACTIVE'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/product/${product.slug}`,
    },
    sku: product.reference || '',
    mpn: product.reference || '',
    category:
      (product.categories || []).map((cat) => cat.name).join(', ') || '',
  };

  // Render appropriate component based on product type
  let ProductDetailComponent;
  switch (product.type) {
    case 'JEWELLERY':
      ProductDetailComponent = JewelleryDetail;
      break;
    case 'BAG':
      ProductDetailComponent = BagDetail;
      break;
    case 'WATCH':
    default:
      ProductDetailComponent = WatchDetail;
      break;
  }

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailComponent product={product} />
      <TestimonialsSection noHeading />
      <InstagramSection />
      <BrandsSection />
    </>
  );
}
