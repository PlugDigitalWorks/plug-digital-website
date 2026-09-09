'use client';

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';

interface SellWatchForm {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  preferredContact: string;
  brand: string;
  model: string;
  year: number | null;
  gender: string;
  dialColor: string;
  caseSize: number | null;
  caseSize2: number | null;
  movement: string;
  caseMaterial: string;
  braceletMaterial: string;
  braceletColor: string;
  box: string;
  papers: string;
  condition: string;
  newOrPreOwned: string;
  waterResistance: string | null;
  complications: string | null;
  crystal: string | null;
  bezel: string | null;
  crown: string | null;
  dialType: string | null;
  lume: string | null;
  expectedPrice: number | null;
  priceCurrency: string;
  description: string;
  urgency: string | null;
  additionalNotes: string | null;
  photos: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes: string | null;
  submittedAt: string;
}

export default function SellWatchFormsPage() {
  const [forms, setForms] = useState<SellWatchForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<SellWatchForm | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/admin/sell-watch-forms');
      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }
      const data = (await response.json()) as SellWatchForm[];
      setForms(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    formId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    notes?: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/sell-watch-forms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh forms list
      fetchForms();
      setShowModal(false);
      setSelectedForm(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col max-lg:gap-2 lg:flex-row lg:justify-between lg:items-center">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
          Sell Watch Forms
        </h1>
        <div className="text-sm text-gray-500">Total: {forms.length} forms</div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {forms.map((form) => (
            <li key={form.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex flex-col max-lg:gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center min-w-0">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {form.firstName.charAt(0)}
                          {form.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {form.firstName} {form.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {form.brand} {form.model} - {form.priceCurrency}{' '}
                        {form.expectedPrice}
                      </div>
                      <div className="text-sm text-gray-500">
                        {form.email} • {form.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:gap-4 flex-shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}
                    >
                      {form.status}
                    </span>
                    <div className="text-sm text-gray-500">
                      {formatDate(form.submittedAt)}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedForm(form);
                        setShowModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-4 lg:p-5 border w-[95%] max-w-6xl max-h-[90vh] shadow-lg rounded-md bg-white overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Watch Sale Form Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Contact Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="text-gray-900">
                          {selectedForm.firstName} {selectedForm.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Country:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.country}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">City:</span>
                        <span className="text-gray-900">
                          {selectedForm.city}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Preferred Contact:
                        </span>
                        <span className="text-gray-900 capitalize">
                          {selectedForm.preferredContact}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Watch Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Watch Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Brand:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.brand}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Model:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.model}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Year:</span>
                        <span className="text-gray-900">
                          {selectedForm.year || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Gender:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.gender}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Dial Color:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.dialColor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Case Size:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.caseSize}mm × {selectedForm.caseSize2}mm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Movement:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.movement}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Case Material:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.caseMaterial}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Bracelet Material:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.braceletMaterial}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Bracelet Color:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.braceletColor}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Original Box:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.box}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Original Papers:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.papers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Condition & Features */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Condition & Features
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Condition:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.condition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          New/Pre-owned:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.newOrPreOwned}
                        </span>
                      </div>
                      {selectedForm.waterResistance && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Water Resistance:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.waterResistance}
                          </span>
                        </div>
                      )}
                      {selectedForm.complications && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Complications:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.complications}
                          </span>
                        </div>
                      )}
                      {selectedForm.crystal && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Crystal:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.crystal}
                          </span>
                        </div>
                      )}
                      {selectedForm.bezel && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Bezel:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.bezel}
                          </span>
                        </div>
                      )}
                      {selectedForm.crown && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Crown:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.crown}
                          </span>
                        </div>
                      )}
                      {selectedForm.dialType && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Dial Type:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.dialType}
                          </span>
                        </div>
                      )}
                      {selectedForm.lume && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Lume:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.lume}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Description */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Price & Description
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Expected Price:
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {selectedForm.priceCurrency}{' '}
                          {selectedForm.expectedPrice}
                        </span>
                      </div>
                      {selectedForm.urgency && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Urgency:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.urgency}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Status:
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedForm.status)}`}
                        >
                          {selectedForm.status}
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="font-medium text-gray-600 block mb-2">
                          Description:
                        </span>
                        <p className="text-gray-900 bg-white p-3 rounded border text-sm">
                          {selectedForm.description}
                        </p>
                      </div>
                      {selectedForm.additionalNotes && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-600 block mb-2">
                            Additional Notes:
                          </span>
                          <p className="text-gray-900 bg-white p-3 rounded border text-sm">
                            {selectedForm.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Photos Section */}
              {selectedForm.photos && selectedForm.photos.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                    Photos
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedForm.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => window.open(photo, '_blank')}
                      >
                        <img
                          src={photo}
                          alt={`Watch photo ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg hover:opacity-80 transition-all duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg
                              className="w-6 h-6 text-gray-800"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Click on any photo to view in full size
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap justify-end gap-2 lg:gap-3">
                {selectedForm.status !== 'APPROVED' && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedForm.id, 'APPROVED')
                    }
                    className="px-6 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
                  >
                    Approve
                  </button>
                )}
                {selectedForm.status !== 'REJECTED' && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedForm.id, 'REJECTED')
                    }
                    className="px-6 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                )}
                {selectedForm.status !== 'PENDING' && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(selectedForm.id, 'PENDING')
                    }
                    className="px-6 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 hover:bg-yellow-50 transition-colors"
                  >
                    Reset to Pending
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
