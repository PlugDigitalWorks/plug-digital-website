// lib/prisma.ts (Next.js + Edge)
import { getRequestContext } from '@cloudflare/next-on-pages';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

export function getPrisma(): PrismaClient {
  // Local development'ta D1 binding yoksa dev.db kullan
  // Production'da Cloudflare Pages otomatik olarak D1 binding'i sağlar
  try {
    const env = (getRequestContext()?.env ?? {}) as { DB?: D1Database };
    if (env.DB) {
      // D1 database kullan (Production/Cloudflare Pages veya local D1)
      return new PrismaClient({
        adapter: new PrismaD1(env.DB),
        log: ['error'],
      });
    }
  } catch (e) {
    // Cloudflare context yok, local development
    // Bu durumda normal PrismaClient kullanılacak (dev.db)
  }

  // Local development: normal PrismaClient (dev.db kullanır)
  // Bu sadece local development'ta çalışır, production'da yukarıdaki kod çalışır
  return new PrismaClient({
    log: ['error'],
  });
}

export default getPrisma;
