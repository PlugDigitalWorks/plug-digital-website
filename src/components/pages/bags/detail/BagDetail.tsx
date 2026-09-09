'use client';
import Button from '@/components/ui/button';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Image from 'next/image';
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ProductWithRelations } from '@/lib/definitions';

export default function BagDetail({
  product,
}: {
  product: ProductWithRelations;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const router = useRouter();

  const filterInfoEntries = (info: unknown): [string, unknown][] =>
    info && typeof info === 'object'
      ? Object.entries(info as Record<string, unknown>).filter(([, v]) => {
          if (v === null || v === undefined || typeof v === 'object') return false;
          return String(v).trim() !== '';
        })
      : [];
  const basicInfoEntries = filterInfoEntries(product.basicInfo);
  const additionalInfoEntries = filterInfoEntries(product.additionalInfo);

  const handleBuy = () => {
    addToCart({
      id: product.slug,
      title: product.title,
      price: product.price,
      image: (product.images as string[])?.[0] || '/images/placeholder.png',
      quantity: 1,
    });
    router.push('/checkout');
  };

  return (
    <Section className="bg-white pb-0">
      <Container className="flex flex-col gap-12 pt-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Images */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full md:h-[500px] h-[300px] rounded-lg flex items-center justify-center mb-4">
              <Image
                src={
                  (product.images as string[])?.[selectedImageIndex] ||
                  (product.images as string[])?.[0]
                }
                alt={product.title}
                width={400}
                height={500}
                className="object-contain w-full h-full rounded-lg"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {(product.images as string[])?.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-16 rounded flex items-center justify-center border-2 transition-all duration-200 ${
                    selectedImageIndex === i
                      ? 'border-[#D4AF37] bg-[#F8F7F5]'
                      : 'border-[#EAD6C2] bg-[#F8F7F5] hover:border-[#D4AF37] hover:bg-[#F5F3F0]'
                  }`}
                >
                  <Image
                    src={img}
                    alt={product.title + ' thumb'}
                    width={60}
                    height={60}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Right: Info */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <span className="uppercase text-secondary text-sm font-semibold tracking-widest">
                {product.brand.name}
              </span>
              <h1 className="text-primary text-3xl md:text-4xl font-secondary font-medium mt-1 mb-2">
                {product.title}
              </h1>
              <div className="text-primary/80 text-lg mb-2">
                {product.subtitle}
              </div>
              <div className="text-primary/60 text-base mb-2">
                Ref: {product.reference}
              </div>
              <div className="flex items-center gap-4 bg-[#F8F7F5] rounded-lg p-4 mb-4">
                <div>
                  <div className="text-primary text-base font-semibold mb-1">
                    Pacha Of London Guarantee
                  </div>
                  <ul className="text-primary/80 text-sm list-disc pl-4">
                    {((product.guarantee as string[]) || []).map(
                      (g: string, i: number) => (
                        <li key={i}>{g}</li>
                      ),
                    )}
                  </ul>
                </div>
                <Image
                  src="/plug-digital-website.png"
                  alt="Guarantee"
                  width={120}
                  height={120}
                  className="ml-auto"
                />
              </div>
              <div className="text-2xl font-bold text-primary mb-2">
                £{' '}
                {product.price.toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="flex gap-3 mb-4">
                <Button variant="primary" className="w-fit" onClick={handleBuy}>
                  Buy This Bag
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
            {/* Basic Info + Additional Info */}
            <div>
              {basicInfoEntries.length > 0 && (
                <>
                  <div className="font-semibold text-primary mb-2 border-b border-primary pb-2">
                    Basic Info
                  </div>
                  <table className="w-full text-sm text-primary/90">
                    <tbody>
                      {basicInfoEntries.map(([k, v]) => (
                        <tr key={k} className="flex">
                          <td className="flex-1 py-1 pr-2 font-medium capitalize">
                            {k.replace(/([A-Z])/g, ' $1')}
                          </td>
                          <td className="flex-1 py-1 pl-2">{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {additionalInfoEntries.length > 0 && (
                <>
                  <div
                    className={`font-semibold text-primary mb-2 border-b border-primary pb-2 ${
                      basicInfoEntries.length > 0 ? 'mt-6' : ''
                    }`}
                  >
                    Additional Info
                  </div>
                  <table className="w-full text-sm text-primary/90">
                    <tbody>
                      {additionalInfoEntries.map(([k, v]) => (
                        <tr key={k} className="flex">
                          <td className="flex-1 py-1 pr-2 font-medium capitalize">
                            {k.replace(/([A-Z])/g, ' $1')}
                          </td>
                          <td className="flex-1 py-1 pl-2">{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            {/* Description */}
            <div>
              <div className="font-semibold text-primary mb-2 border-b border-primary pb-2">
                Description
              </div>
              <div className="text-primary/80 text-sm whitespace-pre-line">
                {product.description}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
