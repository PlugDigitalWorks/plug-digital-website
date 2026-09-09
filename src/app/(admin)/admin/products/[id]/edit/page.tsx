'use client';

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import WatchForm from '@/components/admin/forms/WatchForm';
import JewelleryForm from '@/components/admin/forms/JewelleryForm';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  type: 'WATCH' | 'JEWELLERY' | 'BAG';
  title: string;
  subtitle?: string;
  reference?: string;
  price: number;
  description?: string;
  stock?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD';
  images: string[];
  basicInfo: any;
  additionalInfo: any;
  brand: {
    id: string;
    name: string;
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
  guarantee: string[];
}

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<
    'WATCH' | 'JEWELLERY' | 'BAG'
  >('WATCH');
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${productId}`);
        if (response.ok) {
          const data = (await response.json()) as Product;
          setProduct(data);
          setSelectedType(data.type as 'WATCH' | 'JEWELLERY' | 'BAG');
        } else {
          toast.error('Product not found');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error fetching product');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId && mounted) {
      fetchProduct();
    }
  }, [productId, router, mounted]);

  // Transform product data to form format - MUST be called before any early returns
  const formData = React.useMemo(() => {
    if (!product) {
      return {
        title: '',
        subtitle: '',
        reference: '',
        price: '0',
        description: '',
        stock: '1',
        status: 'ACTIVE' as const,
        images: [],
        guarantee: [],
        basicInfo: {},
        additionalInfo: {},
        selectedBrand: '',
        selectedCategories: [],
        existingImages: [],
        newImages: [],
      };
    }

    return {
      title: product.title || '',
      subtitle: product.subtitle || '',
      reference: product.reference || '',
      price: product.price?.toString() || '0',
      description: product.description || '',
      stock: product.stock?.toString() || '1',
      status: product.status || 'ACTIVE',
      images: Array.isArray(product.images) ? product.images : [],
      guarantee: Array.isArray(product.guarantee)
        ? product.guarantee
        : product.guarantee
          ? [product.guarantee]
          : [],
      basicInfo: product.basicInfo || {},
      additionalInfo: product.additionalInfo || {},
      selectedBrand: product.brand?.id || '',
      selectedCategories: product.categories?.map((cat) => cat.id) || [],
      existingImages: Array.isArray(product.images) ? product.images : [],
      newImages: [],
    };
  }, [product]);

  const handleWatchSubmit = async (data: any) => {
    try {
      setSaving(true);
      console.log('Watch submit data:', data);
      console.log('Selected categories:', data.selectedCategories);
      console.log('Existing images:', data.existingImages);
      console.log('New images:', data.newImages);

      // Ensure all required fields have safe defaults
      const safeData = {
        ...data,
        selectedCategories: data.selectedCategories || [],
        existingImages: data.existingImages || [],
        newImages: data.newImages || [],
        guarantee: data.guarantee || [],
        basicInfo: data.basicInfo || {},
        additionalInfo: data.additionalInfo || {},
      };

      const formData = new FormData();
      formData.append('type', selectedType);
      formData.append('title', safeData.title);
      formData.append('subtitle', safeData.subtitle);
      formData.append('reference', safeData.reference);
      formData.append('price', safeData.price);
      formData.append('description', safeData.description);
      formData.append('stock', safeData.stock);
      formData.append('status', safeData.status);
      formData.append('basicInfo', JSON.stringify(safeData.basicInfo));
      formData.append(
        'additionalInfo',
        JSON.stringify(safeData.additionalInfo),
      );
      formData.append('guarantee', JSON.stringify(safeData.guarantee || []));
      formData.append(
        'selectedCategories',
        JSON.stringify(safeData.selectedCategories),
      );
      formData.append('selectedBrand', safeData.selectedBrand);

      // Handle images - keep existing ones and add new ones
      safeData.existingImages.forEach((image: string) => {
        formData.append('existingImages', image);
      });

      safeData.newImages.forEach((image: File) => {
        formData.append('images', image);
      });

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast.success('Watch product updated successfully!');
        router.push('/admin/products');
      } else {
        try {
          const error = (await response.json()) as any;
          toast.error(`Error: ${error.error || 'Unknown error'}`);
        } catch (jsonError) {
          toast.error(`Error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error updating watch product:', error);
      toast.error('Error updating product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleJewellerySubmit = async (data: any) => {
    try {
      setSaving(true);
      console.log('Jewellery submit data:', data);
      console.log('Selected categories:', data.selectedCategories);
      console.log('Existing images:', data.existingImages);
      console.log('New images:', data.newImages);

      // Ensure all required fields have safe defaults
      const safeData = {
        ...data,
        selectedCategories: data.selectedCategories || [],
        existingImages: data.existingImages || [],
        newImages: data.newImages || [],
        guarantee: data.guarantee || [],
        basicInfo: data.basicInfo || {},
        additionalInfo: data.additionalInfo || {},
      };

      const formData = new FormData();
      formData.append('type', selectedType);
      formData.append('title', safeData.title);
      formData.append('subtitle', safeData.subtitle);
      formData.append('reference', safeData.reference);
      formData.append('price', safeData.price);
      formData.append('description', safeData.description);
      formData.append('stock', safeData.stock);
      formData.append('status', safeData.status);
      formData.append('basicInfo', JSON.stringify(safeData.basicInfo));
      formData.append(
        'additionalInfo',
        JSON.stringify(safeData.additionalInfo),
      );
      formData.append('guarantee', JSON.stringify(safeData.guarantee || []));
      formData.append(
        'selectedCategories',
        JSON.stringify(safeData.selectedCategories),
      );
      formData.append('selectedBrand', safeData.selectedBrand);

      // Handle images - keep existing ones and add new ones
      safeData.existingImages.forEach((image: string) => {
        formData.append('existingImages', image);
      });

      safeData.newImages.forEach((image: File) => {
        formData.append('images', image);
      });

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast.success(
          `${selectedType === 'BAG' ? 'Bag' : 'Jewellery'} product updated successfully!`,
        );
        router.push('/admin/products');
      } else {
        try {
          const error = (await response.json()) as any;
          toast.error(`Error: ${error.error || 'Unknown error'}`);
        } catch (jsonError) {
          toast.error(`Error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error updating jewellery product:', error);
      toast.error('Error updating product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h1>
            <button
              onClick={() => router.push('/admin/products')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/products')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            ← Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit {product.type === 'WATCH' ? 'Watch' : 'Jewellery'}:{' '}
            {product.title}
          </h1>
          <p className="text-gray-600 mt-2">
            Update the details for your {product.type.toLowerCase()} product
          </p>
        </div>

        {saving && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800">Updating product...</span>
            </div>
          </div>
        )}

        {/* Product Type Selector */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Type *
          </label>
          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value as 'WATCH' | 'JEWELLERY' | 'BAG')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="WATCH">Watch</option>
            <option value="JEWELLERY">Jewellery</option>
            <option value="BAG">Bag</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Current type: {product.type}. Changing this will update the product
            type in the database.
          </p>
        </div>

        {selectedType === 'WATCH' ? (
          <WatchForm
            onSubmit={handleWatchSubmit}
            loading={saving}
            initialData={formData}
          />
        ) : (
          <JewelleryForm
            onSubmit={handleJewellerySubmit}
            loading={saving}
            productType={selectedType === 'BAG' ? 'BAG' : 'JEWELLERY'}
            initialData={formData}
          />
        )}
      </div>
    </div>
  );
}
