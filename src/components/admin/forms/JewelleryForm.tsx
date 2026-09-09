'use client';

import React, { useState, useEffect } from 'react';

function pruneEmptyStringRecord(input: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(input).filter(([, v]) => (v ?? '').toString().trim().length > 0),
  );
}


interface Category {
  id: string;
  name: string;
  type: 'JEWELLERY' | 'BAG';
}

interface Brand {
  id: string;
  name: string;
  type: 'JEWELLERY' | 'BAG';
}

interface JewelleryFormData {
  title: string;
  subtitle: string;
  reference: string;
  price: string;
  description: string;
  stock: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SOLD';
  existingImages: string[];
  newImages: File[];
  guarantee: string[]; // Array of guarantee strings
  seo: {
    title?: string;
    description?: string;
  };
  basicInfo: Record<string, string>; // Dynamic key-value pairs
  additionalInfo: Record<string, string>; // Dynamic key-value pairs (excluding seo)
  selectedBrand: string;
  selectedCategories: string[];
}

interface JewelleryFormProps {
  onSubmit: (data: JewelleryFormData) => void;
  loading?: boolean;
  productType?: 'JEWELLERY' | 'BAG'; // Add productType prop
  initialData?: {
    title?: string;
    subtitle?: string;
    reference?: string;
    price?: string;
    description?: string;
    stock?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'SOLD';
    images?: string[]; // This comes from the API as existing images
    guarantee?: string[];
    basicInfo?: any;
    additionalInfo?: any;
    selectedBrand?: string;
    selectedCategories?: string[];
  };
}

const JewelleryForm: React.FC<JewelleryFormProps> = ({
  onSubmit,
  loading = false,
  productType = 'JEWELLERY', // Default to JEWELLERY
  initialData,
}) => {

  const defaultBasicKeys = new Set(
    productType === 'BAG'
      ? ['Model', 'Size', 'Material', 'Colour', 'Hardware']
      : ['Condition', 'Metal', 'Main Stone', 'Size / Length'],
  );
  const defaultAdditionalKeys = new Set(
    productType === 'BAG'
      ? ['Year', 'Box & Papers', 'Location']
      : ['Box & Papers', 'Location'],
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<JewelleryFormData>({
    title: '',
    subtitle: '',
    reference: '',
    price: '',
    description: '',
    stock: '1',
    status: 'ACTIVE',
    existingImages: [],
    newImages: [],
    guarantee: [],
    seo: {
      title: '',
      description: '',
    },
    basicInfo: {},
    additionalInfo: {},
    selectedBrand: '',
    selectedCategories: [],
  });

  // State for managing dynamic fields
  const [newBasicInfoKey, setNewBasicInfoKey] = useState('');
  const [newAdditionalInfoKey, setNewAdditionalInfoKey] = useState('');
  const [newGuarantee, setNewGuarantee] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    // Fetch categories and brands based on productType
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch(`/api/categories?type=${productType}`),
          fetch(`/api/brands?type=${productType}`),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = (await categoriesRes.json()) as Category[];
          setCategories(categoriesData);
        }

        if (brandsRes.ok) {
          const brandsData = (await brandsRes.json()) as Brand[];
          setBrands(brandsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [productType]); // Re-fetch when productType changes

  // Handle initial data if provided
  useEffect(() => {
    if (initialData) {
      // Handle existing images - they come as URLs, not Files
      const existingImageUrls = initialData.images || [];

      // Extract SEO from additionalInfo if it exists
      const additionalInfo = { ...(initialData.additionalInfo || {}) };
      const seo = additionalInfo.seo || {};
      delete additionalInfo.seo; // Remove seo from additionalInfo

      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        reference: initialData.reference || '',
        price: initialData.price || '',
        description: initialData.description || '',
        stock: initialData.stock || '1',
        status:
          (initialData.status as 'ACTIVE' | 'INACTIVE' | 'SOLD') || 'ACTIVE',
        existingImages: existingImageUrls,
        newImages: [],
        guarantee: Array.isArray(initialData.guarantee)
          ? initialData.guarantee
          : initialData.guarantee
            ? [initialData.guarantee]
            : [],
        seo:
          typeof seo === 'object' && seo !== null && !Array.isArray(seo)
            ? { title: seo.title || '', description: seo.description || '' }
            : { title: '', description: '' },
        basicInfo: initialData.basicInfo || {},
        additionalInfo: additionalInfo,
        selectedBrand: initialData.selectedBrand || '',
        selectedCategories: initialData.selectedCategories || [],
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBasicInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value },
    }));
  };

  const handleAdditionalInfoChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalInfo: { ...prev.additionalInfo, [field]: value },
    }));
  };

  const addBasicInfoField = () => {
    if (newBasicInfoKey.trim()) {
      setFormData((prev) => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, [newBasicInfoKey.trim()]: '' },
      }));
      setNewBasicInfoKey('');
    }
  };

  const removeBasicInfoField = (key: string) => {
    setFormData((prev) => {
      const newBasicInfo = { ...prev.basicInfo };
      delete newBasicInfo[key];
      return { ...prev, basicInfo: newBasicInfo };
    });
  };

  const addAdditionalInfoField = () => {
    if (newAdditionalInfoKey.trim()) {
      setFormData((prev) => ({
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          [newAdditionalInfoKey.trim()]: '',
        },
      }));
      setNewAdditionalInfoKey('');
    }
  };

  const removeAdditionalInfoField = (key: string) => {
    setFormData((prev) => {
      const newAdditionalInfo = { ...prev.additionalInfo };
      delete newAdditionalInfo[key];
      return { ...prev, additionalInfo: newAdditionalInfo };
    });
  };

  const addGuarantee = () => {
    if (newGuarantee.trim()) {
      setFormData((prev) => ({
        ...prev,
        guarantee: [...prev.guarantee, newGuarantee.trim()],
      }));
      setNewGuarantee('');
    }
  };

  const removeGuarantee = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      guarantee: prev.guarantee.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);

      setFormData((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...newImages],
      }));
    }
  };

  const removeImage = (index: number) => {
    // Determine if this is an existing image or new image
    const isExistingImage = index < formData.existingImages.length;

    if (isExistingImage) {
      // Remove from existing images
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index),
      }));
    } else {
      // Remove from new images
      const newImageIndex = index - formData.existingImages.length;
      setFormData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== newImageIndex),
      }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter((id) => id !== categoryId)
        : [...prev.selectedCategories, categoryId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.reference ||
      !formData.price ||
      !formData.selectedBrand
    ) {
      alert('Please fill in all required fields and select a brand.');
      return;
    }

    // Only include filled fields in JSON (avoid empty keys)
    const prunedBasicInfo = pruneEmptyStringRecord(formData.basicInfo);
    const prunedAdditionalInfo = pruneEmptyStringRecord(formData.additionalInfo);

    // Merge SEO back into additionalInfo before submitting
    const submitData = {
      ...formData,
      basicInfo: prunedBasicInfo,
      additionalInfo: {
        ...prunedAdditionalInfo,
        seo: formData.seo,
      },
    };

    onSubmit(submitData as unknown as JewelleryFormData);
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        existingImages: [...prev.existingImages, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference *
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Brand and Categories */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Brand & Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <select
              value={formData.selectedBrand}
              onChange={(e) =>
                handleInputChange('selectedBrand', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Info - Dynamic */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {productType === 'BAG' ? 'Bag' : 'Jewellery'} Basic Information
        </h3>

        {/* Default fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {productType === 'BAG' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input type="text" value={formData.basicInfo['Model'] || ''} onChange={(e) => handleBasicInfoChange('Model', e.target.value)} placeholder="e.g. Birkin 25" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <input type="text" value={formData.basicInfo['Size'] || ''} onChange={(e) => handleBasicInfoChange('Size', e.target.value)} placeholder="e.g. 25cm" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                <input type="text" value={formData.basicInfo['Material'] || ''} onChange={(e) => handleBasicInfoChange('Material', e.target.value)} placeholder="e.g. Togo Leather" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colour</label>
                <input type="text" value={formData.basicInfo['Colour'] || ''} onChange={(e) => handleBasicInfoChange('Colour', e.target.value)} placeholder="e.g. Black" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hardware</label>
                <input type="text" value={formData.basicInfo['Hardware'] || ''} onChange={(e) => handleBasicInfoChange('Hardware', e.target.value)} placeholder="e.g. Gold" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <input type="text" value={formData.basicInfo['Condition'] || ''} onChange={(e) => handleBasicInfoChange('Condition', e.target.value)} placeholder="e.g. Excellent" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metal</label>
                <input type="text" value={formData.basicInfo['Metal'] || ''} onChange={(e) => handleBasicInfoChange('Metal', e.target.value)} placeholder="e.g. 18K Gold" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Stone</label>
                <input type="text" value={formData.basicInfo['Main Stone'] || ''} onChange={(e) => handleBasicInfoChange('Main Stone', e.target.value)} placeholder="e.g. Diamond" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size / Length</label>
                <input type="text" value={formData.basicInfo['Size / Length'] || ''} onChange={(e) => handleBasicInfoChange('Size / Length', e.target.value)} placeholder="e.g. 18 inches" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
        </div>

        {/* Existing Basic Info Fields */}
        {Object.entries(formData.basicInfo).filter(([k]) => !defaultBasicKeys.has(k))
          .length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(formData.basicInfo)
              .filter(([key]) => !defaultBasicKeys.has(key))
              .map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleBasicInfoChange(key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeBasicInfoField(key)}
                  className="mt-6 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              ))}
          </div>
        )}

        {/* Add New Basic Info Field */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Field
            </label>
            <input
              type="text"
              value={newBasicInfoKey}
              onChange={(e) => setNewBasicInfoKey(e.target.value)}
              placeholder="Field name (e.g., Material, Carat)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBasicInfoField();
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={addBasicInfoField}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Field
          </button>
        </div>
      </div>

      {/* Additional Info - Dynamic */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>

        {/* Default additional fields (quick select + free typing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {productType === 'BAG' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input type="text" value={formData.additionalInfo['Year'] || ''} onChange={(e) => handleAdditionalInfoChange('Year', e.target.value)} placeholder="e.g. 2022" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Box & Papers</label>
            <input type="text" value={formData.additionalInfo['Box & Papers'] || ''} onChange={(e) => handleAdditionalInfoChange('Box & Papers', e.target.value)} placeholder="e.g. Yes" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input type="text" value={formData.additionalInfo['Location'] || ''} onChange={(e) => handleAdditionalInfoChange('Location', e.target.value)} placeholder="e.g. Knightsbridge, London" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Existing Additional Info Fields */}
        {Object.entries(formData.additionalInfo).filter(
          ([k]) => k !== 'seo' && !defaultAdditionalKeys.has(k),
        ).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(formData.additionalInfo)
              .filter(([key]) => key !== 'seo' && !defaultAdditionalKeys.has(key))
              .map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) =>
                      handleAdditionalInfoChange(key, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAdditionalInfoField(key)}
                  className="mt-6 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              ))}
          </div>
        )}

        {/* Add New Additional Info Field */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Field
            </label>
            <input
              type="text"
              value={newAdditionalInfoKey}
              onChange={(e) => setNewAdditionalInfoKey(e.target.value)}
              placeholder="Field name (e.g., Size, Style)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAdditionalInfoField();
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={addAdditionalInfoField}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Field
          </button>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          SEO (Search Engine Optimization)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seo.title || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, title: e.target.value },
                }))
              }
              placeholder="SEO title for search engines"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Description
            </label>
            <textarea
              value={formData.seo.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, description: e.target.value },
                }))
              }
              placeholder="SEO description for search engines"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Guarantee */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Guarantee</h3>

        {/* Existing Guarantees */}
        {formData.guarantee.length > 0 && (
          <div className="mb-4 space-y-2">
            {formData.guarantee.map((guarantee, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={guarantee}
                  onChange={(e) => {
                    const newGuarantees = [...formData.guarantee];
                    newGuarantees[index] = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      guarantee: newGuarantees,
                    }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeGuarantee(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Guarantee */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Guarantee
            </label>
            <input
              type="text"
              value={newGuarantee}
              onChange={(e) => setNewGuarantee(e.target.value)}
              placeholder="Guarantee text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGuarantee();
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={addGuarantee}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Guarantee
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Images</h3>

        {/* Add Image by URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Image by URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addImageUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add URL
            </button>
          </div>
        </div>

        {/* Upload Images */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {formData.existingImages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Selected Images:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formData.existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-auto object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {formData.newImages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              New Images:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {formData.newImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-auto object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index + formData.existingImages.length)
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center ${
            loading
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default JewelleryForm;
