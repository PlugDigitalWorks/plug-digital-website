// import { PrismaD1 } from '@prisma/adapter-d1';
// import { PrismaClient } from '@prisma/client';
// import { seed } from './seed';

// interface Env {
//   DB: D1Database;
//   SEED_TOKEN: string;
// }

// // Polyfill (Workers'ta setImmediate yok)
// (globalThis as any).setImmediate ??= (fn: any, ...args: any[]) =>
//   setTimeout(fn, 0, ...args);

// export default {
//   async fetch(req: Request, env: Env) {
//     try {
//       const url = new URL(req.url);
//       if (url.searchParams.get('token') !== env.SEED_TOKEN) {
//         return new Response('unauthorized', { status: 403 });
//       }

//       const prisma = new PrismaClient({ adapter: new PrismaD1(env.DB) });

//       try {
//         await seed(prisma); // senin seed(prisma) fonksiyonun
//         return new Response('ok');
//       } finally {
//         await prisma.$disconnect();
//       }
//     } catch (e: any) {
//       // 1101 yerine düz hata döndür
//       const msg = e?.stack || e?.message || String(e);
//       console.error(msg);
//       return new Response(`seed error: ${msg}`, { status: 500 });
//     }
//   },
// };
