import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BlogCardProps {
  category: string;
  title: string;
  author: string;
  image: string;
  slug: string;
}

export default function BlogCard({
  category,
  title,
  author,
  image,
  slug,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="flex flex-col rounded-none shadow-none border-none overflow-hidden h-full hover:opacity-90 transition-opacity"
    >
      <div className="w-full aspect-[4/3] flex items-center justify-center bg-[#F8F7F5] mb-4">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col flex-1 pb-6 px-2">
        <span className="text-[#7C6F5F] text-[14px] font-medium mb-1">
          {category}
        </span>
        <h3 className="text-[#3A2121] text-[20px] font-semibold mb-1 font-secondary line-clamp-2">
          {title}
        </h3>
        <div className="text-[#7C6F5F] text-[14px] mt-2">
          Written by: {author}
        </div>
      </div>
    </Link>
  );
}
