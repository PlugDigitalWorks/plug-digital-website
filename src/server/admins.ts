'use server';
import { PrismaClient } from '@prisma/client';
import { unstable_cache, revalidateTag } from 'next/cache';

const prisma = new PrismaClient();

const CACHE_TAG = 'admins';

// ✅ Get all blogs (Cached)

export const activateAdmin = async (id: string) => {
  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data: { status: 'ACTIVE' },
  });
  revalidateTag(CACHE_TAG); // Revalidate list
  revalidateTag(`${CACHE_TAG}-${id}`); // Revalidate single blog
  return updatedAdmin;
};
export const deActivateAdmin = async (id: string) => {
  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data: { status: 'SUSPENDED' },
  });
  revalidateTag(CACHE_TAG); // Revalidate list
  revalidateTag(`${CACHE_TAG}-${id}`); // Revalidate single blog
  return updatedAdmin;
};

export const updateAdmin = async (id: string, data: any) => {
  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data,
  });
  revalidateTag(CACHE_TAG); // Revalidate list
  revalidateTag(`${CACHE_TAG}-${id}`); // Revalidate single admin
  return updatedAdmin;
};
