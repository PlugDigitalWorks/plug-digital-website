'use client';

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';

interface CheckoutForm {
  id: string;
  contact: string;
  news: boolean;
  country: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  apt: string | null;
  city: string;
  state: string;
  zip: string;
  paymentMethod: string;
  cardNumber: string | null;
  cardDate: string | null;
  cardCvc: string | null;
  cardName: string | null;
  cartItems: any[];
  subtotal: number;
  shipping: number;
  discount: string | null;
  discountAmount: number | null;
  total: number;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';
  notes: string | null;
  submittedAt: string;
}

export default function CheckoutFormsPage() {
  const [forms, setForms] = useState<CheckoutForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<CheckoutForm | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);

  const fetchForms = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/checkout-forms?page=${pageNum}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }
      const data = (await response.json()) as { forms: CheckoutForm[]; pagination: { page: number; limit: number; total: number; pages: number } };
      setForms(data.forms);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(page);
  }, [page]);

  const handleStatusUpdate = async (
    formId: string,
    status:
      | 'PENDING'
      | 'CONFIRMED'
      | 'PROCESSING'
      | 'SHIPPED'
      | 'DELIVERED'
      | 'CANCELLED',
    notes?: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/checkout-forms/${formId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      fetchForms(page);
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
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
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
          Checkout Forms
        </h1>
        <div className="text-sm text-gray-500">
          Total: {pagination?.total ?? forms.length} orders
        </div>
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
                        Order #{form.id.slice(-8)} - £{form.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {form.contact} • {form.city}, {form.country}
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
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/admin/checkout-forms/${form.id}`);
                          if (res.ok) {
                            const fullForm = (await res.json()) as CheckoutForm;
                            setSelectedForm(fullForm);
                            setShowModal(true);
                          }
                        } catch {
                          setError('Failed to load order details');
                        }
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
        {pagination && pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-4 lg:p-5 border w-[95%] max-w-6xl max-h-[90vh] shadow-lg rounded-md bg-white overflow-y-auto">
            <div className="mt-3">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Order Details
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
                {/* Contact & Delivery Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Contact & Delivery
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
                          Contact:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.contact}
                        </span>
                      </div>
                      {selectedForm.company && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Company:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.company}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Address:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.address}
                          {selectedForm.apt && `, ${selectedForm.apt}`}
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
                          State:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.state}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">ZIP:</span>
                        <span className="text-gray-900">
                          {selectedForm.zip}
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
                        <span className="font-medium text-gray-600">
                          Newsletter:
                        </span>
                        <span className="text-gray-900">
                          {selectedForm.news ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Payment Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Payment Method:
                        </span>
                        <span className="text-gray-900 capitalize">
                          {selectedForm.paymentMethod}
                        </span>
                      </div>
                      {selectedForm.cardName && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Card Name:
                          </span>
                          <span className="text-gray-900">
                            {selectedForm.cardName}
                          </span>
                        </div>
                      )}
                      {selectedForm.cardNumber && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Card Number:
                          </span>
                          <span className="text-gray-900">
                            ****{selectedForm.cardNumber.slice(-4)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order & Status Information */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {selectedForm.cartItems.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white rounded border hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center space-x-4">
                              {/* Product Image */}
                              <div className="flex-shrink-0">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        '/images/placeholder-product.png';
                                    }}
                                  />
                                ) : (
                                  <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <svg
                                      className="h-8 w-8 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">
                                  {item.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </div>
                                {item.slug && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    ID: {item.slug}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Price and Link */}
                            <div className="flex flex-col items-end space-y-2">
                              <div className="text-right">
                                <div className="font-medium">
                                  £{item.price.toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  £{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>

                              {/* Product Link Button */}
                              {item.slug && (
                                <a
                                  href={`/product/${item.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                                >
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                  View Product
                                </a>
                              )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                      Order Summary
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Subtotal:
                        </span>
                        <span className="text-gray-900">
                          £{selectedForm.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Shipping:
                        </span>
                        <span className="text-gray-900">
                          £{selectedForm.shipping.toFixed(2)}
                        </span>
                      </div>
                      {selectedForm.discount && (
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Discount ({selectedForm.discount}):
                          </span>
                          <span className="text-gray-900">
                            -£
                            {selectedForm.discountAmount?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-semibold text-gray-900">
                          Total:
                        </span>
                        <span className="font-semibold text-gray-900 text-lg">
                          £{selectedForm.total.toFixed(2)}
                        </span>
                      </div>
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
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Order ID:
                        </span>
                        <span className="text-gray-900 font-mono text-xs">
                          {selectedForm.id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          Submitted:
                        </span>
                        <span className="text-gray-900">
                          {formatDate(selectedForm.submittedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap justify-end gap-2 lg:gap-3">
                {/* Reset to Pending - Available for all statuses except PENDING */}
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

                {/* Other status update buttons */}
                {selectedForm.status !== 'CANCELLED' &&
                  selectedForm.status !== 'DELIVERED' && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedForm.id, 'CANCELLED')
                        }
                        className="px-6 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                      {selectedForm.status === 'PENDING' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(selectedForm.id, 'CONFIRMED')
                          }
                          className="px-6 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          Confirm Order
                        </button>
                      )}
                      {selectedForm.status === 'CONFIRMED' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(selectedForm.id, 'PROCESSING')
                          }
                          className="px-6 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          Mark Processing
                        </button>
                      )}
                      {selectedForm.status === 'PROCESSING' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(selectedForm.id, 'SHIPPED')
                          }
                          className="px-6 py-2 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {selectedForm.status === 'SHIPPED' && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(selectedForm.id, 'DELIVERED')
                          }
                          className="px-6 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 hover:bg-green-50 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </>
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
