import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';
import { importProducts } from './import-products';

interface Env {
  DB: D1Database;
  IMPORT_TOKEN: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

// Polyfill (Workers'ta setImmediate yok)
(globalThis as any).setImmediate ??= (fn: any, ...args: any[]) =>
  setTimeout(fn, 0, ...args);

export default {
  async fetch(req: Request, env: Env) {
    try {
      const url = new URL(req.url);
      
      // Token kontrolü
      if (url.searchParams.get('token') !== env.IMPORT_TOKEN) {
        return new Response('unauthorized', { status: 403 });
      }

      // JSON'u request body'den al
      let products: any[];
      if (req.method === 'POST') {
        products = await req.json();
      } else {
        // GET ise query param'dan JSON string al
        const jsonStr = url.searchParams.get('json');
        if (!jsonStr) {
          return new Response('Missing JSON data. Send POST with JSON body or GET with ?json=...', { status: 400 });
        }
        products = JSON.parse(jsonStr);
      }

      if (!Array.isArray(products)) {
        return new Response('Invalid JSON: expected array', { status: 400 });
      }

      const prisma = new PrismaClient({ adapter: new PrismaD1(env.DB) });

      try {
        const result = await importProducts(prisma, products, {
          CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME,
          CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
          CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,
        });

        return new Response(
          JSON.stringify({
            success: true,
            imported: result.successCount,
            errors: result.errorCount,
            total: products.length,
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
      } finally {
        await prisma.$disconnect();
      }
    } catch (e: any) {
      const msg = e?.stack || e?.message || String(e);
      console.error(msg);
      return new Response(`Import error: ${msg}`, { status: 500 });
    }
  },
};
