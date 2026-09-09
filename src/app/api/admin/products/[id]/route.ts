// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { uploadMultipleImagesToCloudinary } from '@/lib/cloudinary-edge';
import getPrisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    // Find product by id
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        brand: true,
        categories: { include: { category: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const transformedProduct = {
      ...product,
      images: product.images as string[],
      guarantee: product.guarantee as string[],
      basicInfo: product.basicInfo as Record<string, string>,
      additionalInfo: product.additionalInfo as Record<string, string>,
      categories: product.categories.map((pc: any) => pc.category),
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;
    const formData = await request.formData();

    // Extract form data
    const body = {
      type: formData.get('type') as string,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      reference: formData.get('reference') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string),
      status: formData.get('status') as string,
      basicInfo: JSON.parse(formData.get('basicInfo') as string),
      additionalInfo: JSON.parse(formData.get('additionalInfo') as string),
      guarantee: formData.get('guarantee')
        ? JSON.parse(formData.get('guarantee') as string)
        : [],
      selectedCategories: JSON.parse(
        formData.get('selectedCategories') as string,
      ),
      selectedBrand: formData.get('selectedBrand') as string,
      existingImages: formData.getAll('existingImages') as string[],
      images: formData.getAll('images') as File[],
    };

    // Debug logs
    console.log('Selected Brand:', body.selectedBrand);
    console.log('Selected Categories:', body.selectedCategories);
    console.log('Product ID:', id);

    // Handle image uploads
    const imageUrls: string[] = [];

    // Keep existing images (these are from seed data, stored in public folder)
    imageUrls.push(...body.existingImages);

    // Upload new images to Cloudinary
    if (body.images && body.images.length > 0) {
      const newImageUrls = await uploadMultipleImagesToCloudinary(body.images);
      imageUrls.push(...newImageUrls);
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        type: body.type as 'WATCH' | 'JEWELLERY' | 'BAG',
        title: body.title,
        subtitle: body.subtitle,
        reference: body.reference,
        price: body.price,
        description: body.description,
        stock: body.stock,
        status: body.status as any,
        images: imageUrls,
        guarantee: body.guarantee || [],
        basicInfo: body.basicInfo,
        additionalInfo: body.additionalInfo,
        brandId: body.selectedBrand,
        categories: {
          deleteMany: {},
          create: body.selectedCategories.map((categoryId: string) => ({
            categoryId: categoryId,
          })),
        },
      },
      include: {
        brand: true,
        categories: { include: { category: true } },
      },
    });

    const transformedProduct = {
      ...updatedProduct,
      images: updatedProduct.images as string[],
      guarantee: updatedProduct.guarantee as string[],
      basicInfo: updatedProduct.basicInfo as Record<string, string>,
      additionalInfo: updatedProduct.additionalInfo as Record<string, string>,
      categories:
        (updatedProduct as any).categories?.map((pc: any) => pc.category) || [],
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.log(error);
    console.error('Error updating product:', error);
    return NextResponse.json(
      {
        error: 'Failed to update product',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    // Delete product
    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
