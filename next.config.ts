import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    BASE_URL: process.env.BASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
  },
};

export default async function nextConfig() {
  // Local development'ta D1 binding'i DEVRE DIŞI
  // Bu sayede Prisma client dev.db kullanır
  // Production'da Cloudflare Pages otomatik olarak D1 binding'i sağlar
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '[next-on-pages] Local development - D1 binding disabled, using dev.db',
    );
  }
  return baseConfig;
}
