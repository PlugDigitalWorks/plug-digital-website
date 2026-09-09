// Local development'ta nodejs runtime kullan (Prisma Client için gerekli)
// Production'da edge runtime kullan (Cloudflare Pages)
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import getPrisma from '@/lib/prisma';

// GET - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedProduct = {
      ...product,
      categories: product.categories.map((pc: any) => pc.category),
    };

    return NextResponse.json(transformedProduct);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

// PUT - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;
    const formData = await request.formData();

    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const reference = formData.get('reference') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string);
    const status = formData.get('status') as 'ACTIVE' | 'INACTIVE' | 'SOLD';
    const basicInfo = JSON.parse(formData.get('basicInfo') as string);
    const additionalInfo = JSON.parse(formData.get('additionalInfo') as string);
    const selectedCategories = JSON.parse(
      formData.get('selectedCategories') as string,
    );
    const selectedBrands = JSON.parse(formData.get('selectedBrands') as string);

    if (!title || !price) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 },
      );
    }

    // Handle images
    const existingImages = formData.getAll('existingImages') as string[];
    const newImages = formData.getAll('images') as File[];

    let finalImages: string[] = [...existingImages];

    // Upload new images to Cloudinary if any
    if (newImages.length > 0) {
      const { uploadMultipleImagesToCloudinary } =
        await import('@/lib/cloudinary-edge');
      const uploadedImages = await uploadMultipleImagesToCloudinary(newImages);
      finalImages = [...existingImages, ...uploadedImages];
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title,
        subtitle,
        reference,
        price,
        description,
        stock,
        status,
        images: finalImages,
        basicInfo,
        additionalInfo,
        brandId: selectedBrands,
      },
    });

    // Update categories
    await prisma.productCategory.deleteMany({
      where: { productId: id },
    });

    if (selectedCategories.length > 0) {
      await prisma.productCategory.createMany({
        data: selectedCategories.map((categoryId: string) => ({
          productId: id,
          categoryId,
        })),
      });
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 },
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = getPrisma();
  try {
    const { id } = await params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete related records first
    await prisma.productCategory.deleteMany({
      where: { productId: id },
    });

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
