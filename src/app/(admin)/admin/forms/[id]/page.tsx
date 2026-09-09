'use client';

export const runtime = 'edge';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface SellYourWatchForm {
  id: string;

  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  preferredContact: string;

  // Watch Information
  brand: string;
  model: string;
  year: string;
  gender: string;
  dialColor: string;
  caseSize: string;
  caseSize2?: string;
  movement: string;
  caseMaterial: string;
  braceletMaterial: string;
  braceletColor: string;
  box: string;
  papers: string;

  // Additional Features
  condition: string;
  newOrPreOwned: string;
  waterResistance?: string;
  complications?: string;
  crystal?: string;
  bezel?: string;
  crown?: string;
  dialType?: string;
  lume?: string;

  // Price & Description
  expectedPrice: string;
  priceCurrency: string;
  description: string;
  urgency?: string;
  additionalNotes?: string;

  // Photos
  images: string[];

  // Status & Notes
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;

  // Timestamps
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function FormDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState<SellYourWatchForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadForm(params.id as string);
    }
  }, [params.id]);

  const loadForm = async (formId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sell-watch-forms/${formId}`);
      if (response.ok) {
        const data = (await response.json()) as SellYourWatchForm;
        setForm(data);
      } else {
        console.error('Failed to load form');
        alert('Failed to load form details');
      }
    } catch (error) {
      console.error('Error loading form:', error);
      alert('Error loading form details');
    } finally {
      setLoading(false);
    }
  };

  const updateFormStatus = async (
    newStatus: 'PENDING' | 'APPROVED' | 'REJECTED',
  ) => {
    if (!form) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/sell-watch-forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: form.notes }),
      });

      if (response.ok) {
        setForm({ ...form, status: newStatus });
        alert(`Form status updated to ${newStatus}`);
      } else {
        console.error('Failed to update form status');
        alert('Failed to update form status');
      }
    } catch (error) {
      console.error('Error updating form status:', error);
      alert('Error updating form status');
    } finally {
      setUpdating(false);
    }
  };

  const updateNotes = async () => {
    if (!form) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/sell-watch-forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: form.status, notes: form.notes }),
      });

      if (response.ok) {
        alert('Notes updated successfully');
      } else {
        console.error('Failed to update notes');
        alert('Failed to update notes');
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Error updating notes');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string, currency: string) => {
    const currencySymbols: { [key: string]: string } = {
      GBP: '£',
      USD: '$',
      EUR: '€',
    };
    return `${currencySymbols[currency] || currency}${price}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading form details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Form not found</h1>
            <p className="mt-2 text-gray-600">
              The requested form could not be found.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Form Details - {form.firstName} {form.lastName}
              </h1>
              <p className="text-gray-600">
                Submitted on {formatDate(form.submittedAt)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  form.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : form.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {form.status}
              </span>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Forms
              </button>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Update Status
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => updateFormStatus('PENDING')}
              disabled={updating || form.status === 'PENDING'}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
            >
              Mark Pending
            </button>
            <button
              onClick={() => updateFormStatus('APPROVED')}
              disabled={updating || form.status === 'APPROVED'}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => updateFormStatus('REJECTED')}
              disabled={updating || form.status === 'REJECTED'}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>

        {/* Form Details */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Form Information
            </h2>
          </div>

          <div className="p-6 space-y-8">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.firstName} {form.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.country}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preferred Contact
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.preferredContact}
                  </p>
                </div>
              </div>
            </div>

            {/* Watch Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Watch Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.brand}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.model}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.year}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.gender}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dial Color
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.dialColor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Case Size
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.caseSize}mm
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Movement
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.movement}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Case Material
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.caseMaterial}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bracelet Material
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.braceletMaterial}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bracelet Color
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.braceletColor}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Box
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.box}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Papers
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.papers}</p>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Additional Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{form.condition}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New/Pre-owned
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.newOrPreOwned}
                  </p>
                </div>
                {form.waterResistance && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Water Resistance
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {form.waterResistance}
                    </p>
                  </div>
                )}
                {form.complications && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Complications
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {form.complications}
                    </p>
                  </div>
                )}
                {form.crystal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Crystal
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{form.crystal}</p>
                  </div>
                )}
                {form.bezel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bezel
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{form.bezel}</p>
                  </div>
                )}
                {form.crown && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Crown
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{form.crown}</p>
                  </div>
                )}
                {form.dialType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dial Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {form.dialType}
                    </p>
                  </div>
                )}
                {form.lume && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lume
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{form.lume}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Description */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Price & Description
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Expected Price
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatPrice(form.expectedPrice, form.priceCurrency)}
                  </p>
                </div>
                {form.urgency && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Urgency
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{form.urgency}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {form.description}
                  </p>
                </div>
                {form.additionalNotes && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {form.additionalNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {form.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Images ({form.images.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {form.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Watch image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                rows={4}
                placeholder="Add notes about this form..."
                value={form.notes || ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={updateNotes}
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
