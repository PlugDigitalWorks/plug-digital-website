'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Input, Select } from '@/components/ui/input';

const initialForm = {
  brand: '',
  model: '',
  year: '',
  gender: '',
  dialColor: '',
  caseSize: '',
  caseSize2: '',
  movement: '',
  caseMaterial: '',
  braceletMaterial: '',
  braceletColor: '',
  box: '',
  papers: '',

  condition: '',
  newOrPreOwned: '',
  waterResistance: '',
  complications: '',
  crystal: '',
  bezel: '',
  crown: '',
  dialType: '',
  lume: '',

  expectedPrice: '',
  priceCurrency: 'GBP',
  description: '',

  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  city: '',

  urgency: '',
  preferredContact: 'email',
  additionalNotes: '',

  photos: [] as File[],
};

const requiredFields = [
  'brand',
  'model',
  'year',
  'gender',
  'dialColor',
  'caseSize',
  'movement',
  'caseMaterial',
  'braceletMaterial',
  'braceletColor',
  'box',
  'papers',
  'condition',
  'newOrPreOwned',
  'expectedPrice',
  'description',
  'firstName',
  'lastName',
  'email',
  'phone',
  'country',
  'city',
];

export default function SellYourWatchWizard() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [showQr, setShowQr] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedFormId, setSubmittedFormId] = useState<string>('');

  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imageUrls]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    document.body.appendChild(script);
  }, []);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // ✅ numeric fields filter (harf yazılamaz)
    const numericFields = ['year', 'caseSize', 'caseSize2', 'expectedPrice'];
    if (numericFields.includes(name)) {
      if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      const newUrls = newPhotos.map((file) => URL.createObjectURL(file));

      setForm({
        ...form,
        photos: [...form.photos, ...newPhotos],
      });
      setImageUrls([...imageUrls, ...newUrls]);
    }
  };

  const handleRemovePhoto = (idx: number) => {
    if (imageUrls[idx] && imageUrls[idx].startsWith('blob:')) {
      URL.revokeObjectURL(imageUrls[idx]);
    }

    setForm({ ...form, photos: form.photos.filter((_, i) => i !== idx) });
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  const progress = useMemo(() => {
    const filledFields = requiredFields.filter((field) => {
      const value = (form as any)[field];
      return value !== undefined && value !== null && String(value).trim() !== '';
    }).length;

    const photosCompleted = form.photos.length >= 3 ? 1 : 0;

    const totalSteps = requiredFields.length + 1; // +1 photos
    const completedSteps = filledFields + photosCompleted;

    return Math.round((completedSteps / totalSteps) * 100);
  }, [form]);

  // ✅ VALIDATION
  const validateForm = () => {
    const newErrors: { [k: string]: string } = {};

    requiredFields.forEach((field) => {
      if (!(form as any)[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (form.email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }


    if (form.year && !/^\d{4}$/.test(form.year)) {
      newErrors.year = 'Year must be a 4-digit number';
    }
    if (form.caseSize && isNaN(Number(form.caseSize))) {
      newErrors.caseSize = 'Case size must be a number';
    }
    if (form.caseSize2 && isNaN(Number(form.caseSize2))) {
      newErrors.caseSize2 = 'Case size must be a number';
    }
    if (form.expectedPrice && isNaN(Number(form.expectedPrice))) {
      newErrors.expectedPrice = 'Expected price must be a number';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'photos') {
          form.photos.forEach((photo) => {
            formData.append('photos[]', photo);
          });
        } else {
          formData.append(key, value as string);
        }
      });
      let captchaToken = '';
      try {
        captchaToken = await (window as any).grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: 'sell_watch' },
        );
      } catch (err) {
        console.error('Captcha error:', err);
      }
      formData.append('captchaToken', captchaToken);

      formData.append('submittedAt', new Date().toISOString());

      const response = await fetch('/api/sell-watch', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const result = (await response.json()) as any;

      setSubmittedFormId(result.formId);
      setShowSuccessModal(true);

      setForm(initialForm);
      setImageUrls([]);
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(
        `Submission failed: ${error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ DOCUMENT WARNING
  const showDocumentsWarning = form.box === 'Yes' || form.papers === 'Yes';

  return (
    <div className="max-w-[700px] mx-auto p-4 pb-8">
      {/* Progress Indicator */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-semibold">Sell Your Watch</h1>
          <span className="text-sm text-[#6B5B4A]">
            {progress === 100 ? 'Ready to submit' : 'Complete all sections'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#E1B989] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-[#6B5B4A] mt-1">
          <span>{progress}%</span>
          <span>100%</span>
        </div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="pt-10 pb-4">
          <div className="mb-2 text-[2rem] font-light leading-tight">
            Information About Your Watch
          </div>
          <div className="mb-8 text-base text-[#6B5B4A]">
            For greater visibility, be sure to mention the specific features of
            your watch.
          </div>

          {/* Basic Watch Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Brand *</label>
              <Input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g., Rolex"
                error={!!errors.brand}
              />
              {errors.brand && (
                <div className="text-red-500 text-xs mt-1">{errors.brand}</div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Model *</label>
              <Input
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g., Submariner"
                error={!!errors.model}
              />
              {errors.model && (
                <div className="text-red-500 text-xs mt-1">{errors.model}</div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Year *</label>
              <Input
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="e.g., 2013"
                error={!!errors.year}
              />
              {errors.year && (
                <div className="text-red-500 text-xs mt-1">{errors.year}</div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Gender *</label>
              <Select name="gender" value={form.gender} onChange={handleChange} error={!!errors.gender}>
                <option value="">Select Gender</option>
                <option value="Men's Watch">Men's Watch</option>
                <option value="Women's Watch">Women's Watch</option>
                <option value="Unisex">Unisex</option>
              </Select>
              {errors.gender && (
                <div className="text-red-500 text-xs mt-1">{errors.gender}</div>
              )}
            </div>
          </div>

          {/* Watch Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Condition *</label>
              <Select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                error={!!errors.condition}
              >
                <option value="">Select Condition</option>
                <option value="Excellent">Excellent - Like new</option>
                <option value="Very Good">Very Good - Minor wear</option>
                <option value="Good">Good - Some wear</option>
                <option value="Fair">Fair - Visible wear</option>
                <option value="Poor">Poor - Significant wear</option>
              </Select>
              {errors.condition && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.condition}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                New or Pre-owned *
              </label>
              <Select
                name="newOrPreOwned"
                value={form.newOrPreOwned}
                onChange={handleChange}
                error={!!errors.newOrPreOwned}
              >
                <option value="">Select Status</option>
                <option value="New">New - Never worn</option>
                <option value="Pre-owned">Pre-owned - Previously worn</option>
                <option value="Vintage">Vintage - Over 20 years old</option>
              </Select>
              {errors.newOrPreOwned && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.newOrPreOwned}
                </div>
              )}
            </div>
          </div>

          {/* Watch Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Dial Color *</label>
              <Input
                name="dialColor"
                value={form.dialColor}
                onChange={handleChange}
                placeholder="Black, Blue, White, etc."
                error={!!errors.dialColor}
              />
              {errors.dialColor && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.dialColor}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Case Size *</label>
              <div className="flex items-center gap-2">
                <Input
                  name="caseSize"
                  value={form.caseSize}
                  onChange={handleChange}
                  placeholder="40"
                  className="w-24"
                  error={!!errors.caseSize}
                />
                <span className="text-[#6B5B4A]">mm</span>
                <span className="mx-2 text-[#6B5B4A]">x</span>
                <Input
                  name="caseSize2"
                  value={form.caseSize2}
                  onChange={handleChange}
                  placeholder="40"
                  className="w-24"
                  error={!!errors.caseSize2}
                />
                <span className="text-[#6B5B4A]">mm</span>
              </div>
              {errors.caseSize && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.caseSize}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Movement *</label>
              <Input
                name="movement"
                value={form.movement}
                onChange={handleChange}
                placeholder="Automatic, Manual, Quartz"
                error={!!errors.movement}
              />
              {errors.movement && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.movement}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Water Resistance</label>
              <Input
                name="waterResistance"
                value={form.waterResistance}
                onChange={handleChange}
                placeholder="100m, 200m, etc."
                error={!!errors.waterResistance}
              />
            </div>
          </div>

          {/* Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Case Material *</label>
              <Input
                name="caseMaterial"
                value={form.caseMaterial}
                onChange={handleChange}
                placeholder="Stainless Steel, Gold, Titanium"
                error={!!errors.caseMaterial}
              />
              {errors.caseMaterial && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.caseMaterial}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Bracelet Material *
              </label>
              <Input
                name="braceletMaterial"
                value={form.braceletMaterial}
                onChange={handleChange}
                placeholder="Stainless Steel, Leather, Rubber"
                error={!!errors.braceletMaterial}
              />
              {errors.braceletMaterial && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.braceletMaterial}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Bracelet Color *</label>
              <Input
                name="braceletColor"
                value={form.braceletColor}
                onChange={handleChange}
                placeholder="Silver, Gold, Black, Brown"
                error={!!errors.braceletColor}
              />
              {errors.braceletColor && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.braceletColor}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Crystal</label>
              <Input
                name="crystal"
                value={form.crystal}
                onChange={handleChange}
                placeholder="Sapphire, Mineral, Acrylic"
                error={!!errors.crystal}
              />
            </div>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">Bezel</label>
              <Input
                name="bezel"
                value={form.bezel}
                onChange={handleChange}
                placeholder="Rotating, Fixed, Ceramic"
                error={!!errors.bezel}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Crown</label>
              <Input
                name="crown"
                value={form.crown}
                onChange={handleChange}
                placeholder="Screw-down, Push-pull"
                error={!!errors.crown}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Dial Type</label>
              <Input
                name="dialType"
                value={form.dialType}
                onChange={handleChange}
                placeholder="Sunburst, Matte, Glossy"
                error={!!errors.dialType}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Lume</label>
              <Input
                name="lume"
                value={form.lume}
                onChange={handleChange}
                placeholder="Yes, No, Tritium"
                error={!!errors.lume}
              />
            </div>
          </div>

          {/* Complications */}
          <div className="mb-6">
            <label className="block font-medium mb-1">Complications</label>
            <Input
              name="complications"
              value={form.complications}
              onChange={handleChange}
              placeholder="Date, Chronograph, Moon Phase, etc."
              error={!!errors.complications}
            />
          </div>

          {/* Original Items */}
          <div className="flex gap-4 mb-6">
            <div className="w-1/2">
              <label className="block font-medium mb-1">Original Box *</label>
              <Select name="box" value={form.box} onChange={handleChange} error={!!errors.box}>
                <option value="">Select</option>
                <option value="Yes">Yes - Original box</option>
                <option value="No">No - Missing box</option>
                <option value="Replacement">Replacement box</option>
              </Select>
              {errors.box && (
                <div className="text-red-500 text-xs mt-1">{errors.box}</div>
              )}
            </div>
            <div className="w-1/2">
              <label className="block font-medium mb-1">
                Original Papers *
              </label>
              <Select name="papers" value={form.papers} onChange={handleChange} error={!!errors.papers}>
                <option value="">Select</option>
                <option value="Yes">Yes - All papers</option>
                <option value="Partial">Partial papers</option>
                <option value="No">No - Missing papers</option>
              </Select>
              {errors.papers && (
                <div className="text-red-500 text-xs mt-1">{errors.papers}</div>
              )}
            </div>
          </div>
        </div>

        {/* Price & Description Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Price & Description</h3>
            <p className="text-[#6B5B4A] text-sm">
              Set your price expectations and describe your watch in detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Expected Price *</label>
              <div className="flex items-center gap-2">
                <Select
                  name="priceCurrency"
                  value={form.priceCurrency}
                  onChange={handleChange}
                >
                  <option value="GBP">£</option>
                  <option value="USD">$</option>
                  <option value="EUR">€</option>
                </Select>
                <Input
                  name="expectedPrice"
                  value={form.expectedPrice}
                  onChange={handleChange}
                  placeholder="5000"
                  type="number"
                  min="0"
                  step="100"
                  error={!!errors.expectedPrice}
                />
              </div>
              {errors.expectedPrice && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.expectedPrice}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Urgency</label>
              <Select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                error={!!errors.urgency}
              >
                <option value="">Select Urgency</option>
                <option value="No Rush">No Rush - Take your time</option>
                <option value="Moderate">Moderate - Within 2-3 weeks</option>
                <option value="Urgent">Urgent - Need to sell quickly</option>
                <option value="Very Urgent">Very Urgent - ASAP</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your watch in detail. Include any unique features, history, modifications, or special characteristics that would interest buyers..."
            />
            {errors.description && (
              <div className="text-red-500 text-xs mt-1">
                {errors.description}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-1">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={form.additionalNotes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional information you'd like to share..."
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
            <p className="text-[#6B5B4A] text-sm">
              How should we contact you about your watch?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">First Name *</label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Name *"
                error={!!errors.firstName}
              />
              {errors.firstName && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.firstName}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Last Name *</label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name *"
                error={!!errors.lastName}
              />
              {errors.lastName && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Email Address *</label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address *"
                type="email"
                error={!!errors.email}
              />
              {errors.email && (
                <div className="text-red-500 text-xs mt-1">{errors.email}</div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Phone Number *</label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number *"
                type="tel"
                error={!!errors.phone}
              />
              {errors.phone && (
                <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Country *</label>
              <Select
                name="country"
                value={form.country}
                onChange={handleChange}
                error={!!errors.country}
              >
                <option value="">Select Country</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Belgium">Belgium</option>
                <option value="Austria">Austria</option>
                <option value="Sweden">Sweden</option>
                <option value="Norway">Norway</option>
                <option value="Denmark">Denmark</option>
                <option value="Finland">Finland</option>
                <option value="Other">Other</option>
              </Select>
              {errors.country && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.country}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">City *</label>
              <Input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="London"
                error={!!errors.city}
              />
              {errors.city && (
                <div className="text-red-500 text-xs mt-1">{errors.city}</div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Preferred Contact Method
            </label>
            <Select
              name="preferredContact"
              value={form.preferredContact}
              onChange={handleChange}
              error={!!errors.preferredContact}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="both">Both</option>
            </Select>
          </div>
        </div>
        {/* Fotoğraf yükleme alanı */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="mb-4">
            <div className="text-xl font-semibold mb-2">
              Upload Photos of Your Watch
            </div>
            <div className="text-[#6B5B4A] mb-6">
              Photos help showcase your watch. Upload photos to present your
              watch in the best possible way.
            </div>
          </div>
          {/* ✅ DOCUMENT WARNING TOP */}
          {showDocumentsWarning && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded mb-4 text-sm">
              You indicated that original box or papers exist. Please upload photos
              of these documents below.
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-6 mb-4">
            {/* Upload Photos kutusu */}
            <div
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#6B5B4A] rounded-lg min-h-[180px] p-6 cursor-pointer transition hover:bg-[#f9f6f2]"
              onClick={() =>
                document.getElementById('photo-upload-input')?.click()
              }
            >
              <svg
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#6B5B4A"
                className="mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 16.5v-7m0 0l-2.5 2.5M12 9.5l2.5 2.5M21 19V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2z"
                />
              </svg>
              <div className="text-lg font-medium text-[#6B5B4A]">
                Upload Photos
              </div>
              <input
                id="photo-upload-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            {/* Sağdaki kutu */}
            {/* <div className="flex-1 bg-[#F7F5F3] rounded-lg p-6 flex flex-col justify-center">
              <div className="text-lg font-medium mb-1 text-[#3A2121]">
                Continue with smartphone?
              </div>
              <div className="text-[#6B5B4A] mb-2 text-sm">
                Simply scan the QR code to upload photos with your smartphone.
              </div>
              <button
                type="button"
                className="underline text-[#6B5B4A] text-sm w-fit"
                onClick={() => setShowQr(!showQr)}
              >
                Show QR code
              </button>
              {showQr && (
                <div className="mt-2">
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                    QR
                  </div>
                </div>
              )}
            </div> */}
          </div>
          {/* Yüklenen fotoğraflar */}
          {form.photos.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-2">
              {form.photos.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 border rounded overflow-hidden"
                >
                  {imageUrls[idx] && (
                    <img
                      src={imageUrls[idx]}
                      alt={`photo-${idx}`}
                      className="object-cover w-full h-full"
                    />
                  )}
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full px-2 py-0.5 text-xs text-red-600"
                    onClick={() => handleRemovePhoto(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.photos && (
            <div className="text-red-500 text-xs mb-2">{errors.photos}</div>
          )}
          {/* Bilgi kutusu */}
          {/* <div className="bg-[#F7F5F3] rounded-lg flex items-center gap-2 p-4 mt-4">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#6B5B4A"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01"
              />
            </svg>
            <a href="#" className="underline text-[#6B5B4A] text-base">
              Creating Great Photos
            </a>
          </div> */}
        </div>

        {/* Submit Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to Submit?</h3>
              <p className="text-[#6B5B4A] text-sm">
                Please review all information before submitting. We'll contact
                you within 24-48 hours.
              </p>
            </div>
            <button
              type="submit"
              className="bg-[#E1B989] text-[#3A2121] px-8 py-3 rounded-lg text-base font-medium hover:bg-[#D4A97A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#3A2121] mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Watch for Sale'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && submittedFormId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
            <p className="text-lg mb-4">
              Your watch submission has been received. We will contact you
              within 24-48 hours to discuss the next steps.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-[#E1B989] text-[#3A2121] px-6 py-2 rounded-lg text-base font-medium hover:bg-[#D4A97A] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
