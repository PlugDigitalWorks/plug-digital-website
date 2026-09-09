'use client';
import Button from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  brand: string;
  title: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  cartIcon?: boolean;
  type: 'watch' | 'jewellery' | 'bag';
}

export default function ProductCard({
  brand,
  title,
  description,
  price,
  image,
  slug,
  cartIcon,
  type,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBuy = () => {
    addToCart({
      id: slug,
      title,
      price,
      image,
      quantity: 1,
    });
    router.push('/checkout');
  };

  return (
    <div className="flex flex-row md:flex-col rounded-none shadow-none border-none overflow-hidden h-full">
      <Link
        href={`/product/${slug}`}
        className="max-md:w-[200px] w-full aspect-square flex items-center justify-center bg-[#F8F7F5] mb-4 cursor-pointer hover:bg-[#F0EFED] transition-colors"
      >
        <Image
          src={image}
          alt={title}
          width={320}
          height={320}
          className="object-cover w-full h-full p-5 max-md:p-0"
        />
      </Link>
      <div className="flex flex-col flex-1 pb-6 max-md:p-4">
        <span
          className={`uppercase text-[14px] font-semibold mb-1 text-secondary`}
        >
          {brand}
        </span>
        <h3 className="text-primary text-[20px] font-semibold mb-1 font-secondary">
          {title}
        </h3>
        <p className="text-primary text-[14px] opacity-80 mb-4 line-clamp-2">
          {description}
        </p>
        <div className="mt-auto flex justify-between items-center max-md:flex-col max-md:gap-2 max-md:items-start gap-2">
          <div className="text-primary text-[16px] font-bold">
            £ {price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="secondary"
              small
              className="!h-10 !p-1"
              onClick={handleBuy}
            >
              {cartIcon ? (
                <Image
                  src={'/icons/cart-plus.svg'}
                  alt="cart-plus"
                  width={24}
                  height={24}
                  className="w-8 h-8"
                />
              ) : (
                'Buy Now'
              )}
            </Button>
            <Link
              className="flex items-center justify-center"
              href={`/product/${slug}`}
              passHref
              legacyBehavior
            >
              <Button
                variant="outline"
                small
                className="!h-10 !p-1 flex items-center justify-center"
              >
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
