'use client';

export const runtime = 'edge';
import { useState, useEffect } from 'react';

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

export default function FormsPage() {
  const [forms, setForms] = useState<SellYourWatchForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalForms, setTotalForms] = useState(0);

  // Component mount olduğunda forms'ları yükle
  useEffect(() => {
    loadForms();
  }, [statusFilter, currentPage]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        page: currentPage.toString(),
        limit: '20',
      });

      const response = await fetch(`/api/sell-watch-forms?${params}`);
      if (response.ok) {
        const data = (await response.json()) as SellYourWatchForm[] | any;
        setForms(data.forms);
        setTotalPages(data.pagination.pages);
        setTotalForms(data.pagination.total);
      } else {
        console.error('Failed to load forms');
        setForms([]);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFormStatus = async (
    formId: string,
    newStatus: 'PENDING' | 'APPROVED' | 'REJECTED',
    notes?: string,
  ) => {
    try {
      const response = await fetch(`/api/sell-watch-forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (response.ok) {
        // Update local state
        setForms((forms) =>
          forms.map((form) =>
            form.id === formId ? { ...form, status: newStatus } : form,
          ),
        );

        // Refresh forms
        loadForms();
      } else {
        console.error('Failed to update form status');
      }
    } catch (error) {
      console.error('Error updating form status:', error);
    }
  };

  const deleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      const response = await fetch(`/api/sell-watch-forms/${formId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setForms((forms) => forms.filter((form) => form.id !== formId));
        setTotalForms((prev) => prev - 1);
      } else {
        console.error('Failed to delete form');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
    }
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Sell Your Watch Forms
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          Review and manage incoming watch sale requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {forms.filter((f) => f.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {forms.filter((f) => f.status === 'APPROVED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">
                {forms.filter((f) => f.status === 'REJECTED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-3 lg:gap-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED',
              )
            }
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <input
            type="text"
            placeholder="Search by name, brand, or model..."
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
          />
        </div>
      </div>

      {/* Forms Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-base lg:text-lg font-semibold text-gray-900">
            All Forms
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No forms yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Forms will appear here when customers submit them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto px-4 lg:px-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Watch Details
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.map((form) => (
                  <tr key={form.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {form.firstName} {form.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{form.email}</div>
                      <div className="text-sm text-gray-500">{form.phone}</div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          {form.brand} {form.model}
                        </div>
                        <div className="text-gray-500">Year: {form.year}</div>
                        <div className="text-gray-500">
                          Gender: {form.gender}
                        </div>
                        <div className="text-gray-500">
                          Case: {form.caseSize}mm
                        </div>
                        <div className="text-gray-500">
                          Movement: {form.movement}
                        </div>
                        <div className="text-gray-500">
                          Material: {form.caseMaterial}
                        </div>
                        <div className="text-gray-500">
                          Condition: {form.condition}
                        </div>
                        <div className="text-gray-500">
                          Status: {form.newOrPreOwned}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(form.expectedPrice, form.priceCurrency)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(form.status)}`}
                      >
                        {form.status}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(form.submittedAt)}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            window.open(`/admin/forms/${form.id}`, '_blank')
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => updateFormStatus(form.id, 'APPROVED')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateFormStatus(form.id, 'REJECTED')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => deleteForm(form.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
