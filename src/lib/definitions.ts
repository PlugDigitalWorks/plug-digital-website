import {
  Product,
  Brand,
  Category,
  ProductType,
  ProductStatus,
} from '@prisma/client';

export type AdminType = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

export type FilterCategoryType = {
  id: string;
  title: string;
};

// API Response types based on Prisma models with relations
export type ProductWithRelations = Product & {
  brand: Brand;
  categories: Category[];
};

export type ProductsApiResponse = {
  products: ProductWithRelations[];
  total: number;
  page: number;
  totalPages: number;
};

// Re-export Prisma types for convenience
export { ProductType, ProductStatus } from '@prisma/client';
export type { Product, Brand, Category } from '@prisma/client';
