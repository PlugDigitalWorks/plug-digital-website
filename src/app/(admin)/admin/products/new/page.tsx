'use client';

export const runtime = 'edge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WatchForm from '@/components/admin/forms/WatchForm';
import JewelleryForm from '@/components/admin/forms/JewelleryForm';
import { toast } from 'react-toastify';

export default function NewProductPage() {
  const [productType, setProductType] = useState<
    'WATCH' | 'JEWELLERY' | 'BAG' | null
  >(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleWatchSubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log('Watch submit data:', data);

      // Ensure all required fields have safe defaults
      const safeData = {
        ...data,
        selectedCategories: data.selectedCategories || [],
        newImages: data.newImages || [],
        basicInfo: data.basicInfo || {},
        additionalInfo: data.additionalInfo || {},
      };

      const formData = new FormData();
      formData.append('type', 'WATCH');
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

      safeData.newImages.forEach((image: File) => {
        formData.append('images', image);
      });

      console.log('Sending request to /api/products');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = (await response.json()) as any;
        console.log('Success response:', result);
        toast.success('Watch product created successfully!');
        router.push('/admin/products');
      } else {
        const error = (await response.json()) as any;
        console.error('Error response:', error);
        toast.error(`Error: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating watch product:', error);
      toast.error('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJewellerySubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log('Jewellery submit data:', data);

      // Ensure all required fields have safe defaults
      const safeData = {
        ...data,
        selectedCategories: data.selectedCategories || [],
        newImages: data.newImages || [],
        basicInfo: data.basicInfo || {},
        additionalInfo: data.additionalInfo || {},
      };

      const formData = new FormData();
      formData.append('type', 'JEWELLERY');
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

      safeData.newImages.forEach((image: File) => {
        formData.append('images', image);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Jewellery product created successfully!');
        router.push('/admin/products');
      } else {
        const error = (await response.json()) as any;
        toast.error(`Error: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating jewellery product:', error);
      toast.error('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBagSubmit = async (data: any) => {
    try {
      setLoading(true);
      const safeData = {
        ...data,
        selectedCategories: data.selectedCategories || [],
        newImages: data.newImages || [],
        basicInfo: data.basicInfo || {},
        additionalInfo: data.additionalInfo || {},
      };

      const formData = new FormData();
      formData.append('type', 'BAG');
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

      safeData.newImages.forEach((image: File) => {
        formData.append('images', image);
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Bag product created successfully!');
        router.push('/admin/products');
      } else {
        const error = (await response.json()) as any;
        toast.error(`Error: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating bag product:', error);
      toast.error('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!productType) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 lg:mb-8">
            <button
              onClick={() => router.push('/admin/products')}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center text-sm lg:text-base"
            >
              ← Back to Products
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-base">
              Choose the type of product you want to add
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div
              onClick={() => setProductType('WATCH')}
              className="bg-white p-6 lg:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">⌚</div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  Watch
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Add a new watch product with detailed specifications,
                  categories, and brands
                </p>
              </div>
            </div>

            <div
              onClick={() => setProductType('JEWELLERY')}
              className="bg-white p-6 lg:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">💍</div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  Jewellery
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Add a new jewellery product with detailed specifications,
                  categories, and brands
                </p>
              </div>
            </div>

            <div
              onClick={() => setProductType('BAG')}
              className="bg-white p-6 lg:p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">👜</div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                  Bags
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Add a new bag product with detailed specifications,
                  categories, and brands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <button
            onClick={() => setProductType(null)}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center text-sm lg:text-base"
          >
            ← Back to Product Type Selection
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Add New{' '}
            {productType === 'WATCH'
              ? 'Watch'
              : productType === 'BAG'
                ? 'Bag'
                : 'Jewellery'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">
            Fill in the details for your new{' '}
            {productType === 'BAG' ? 'bag' : productType.toLowerCase()} product
          </p>
        </div>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800">Creating product...</span>
            </div>
          </div>
        )}

        {productType === 'WATCH' ? (
          <WatchForm onSubmit={handleWatchSubmit} loading={loading} />
        ) : productType === 'BAG' ? (
          <JewelleryForm
            onSubmit={handleBagSubmit}
            loading={loading}
            productType="BAG"
          />
        ) : (
          <JewelleryForm onSubmit={handleJewellerySubmit} loading={loading} />
        )}
      </div>
    </div>
  );
}
