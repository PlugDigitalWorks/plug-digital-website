'use client';

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Button from '@/components/ui/button';

interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactFormsPage() {
  const [forms, setForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedForm, setSelectedForm] = useState<ContactForm | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>(
    'PENDING',
  );

  // Fetch forms
  const fetchForms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/contact-forms?${params}`);
      if (response.ok) {
        const data = (await response.json()) as ContactForm[] | any;
        setForms(data.forms);
      }
    } catch (error) {
      console.error('Error fetching contact forms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [search, statusFilter]);

  // Update form status
  const updateForm = async (
    formId: string,
    updates: { status?: string; notes?: string },
  ) => {
    try {
      const response = await fetch(`/api/contact-forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchForms();
        setShowModal(false);
        setSelectedForm(null);
      }
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  // Delete form
  const deleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this contact form?')) return;

    try {
      const response = await fetch(`/api/contact-forms/${formId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchForms();
      }
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  // Open modal
  const openModal = (form: ContactForm) => {
    setSelectedForm(form);
    setNotes(form.notes || '');
    setStatus(form.status);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedForm) return;
    updateForm(selectedForm.id, { status, notes });
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

  return (
    <div className="p-0 lg:p-6">
      <div className="flex flex-col max-lg:gap-4 lg:flex-row lg:justify-between lg:items-center mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
          Contact Forms
        </h1>
        <div className="flex flex-col max-lg:gap-3 sm:flex-row gap-4">
          <Input
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-lg sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full max-lg sm:w-auto"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {forms.map((form) => (
              <li key={form.id} className="px-4 lg:px-6 py-4 hover:bg-gray-50">
                <div className="flex flex-col max-lg:gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {form.name}
                        </h3>
                        <p className="text-sm text-gray-600">{form.email}</p>
                        <p className="text-sm text-gray-500">{form.subject}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(form.status)}`}
                      >
                        {form.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {form.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      small
                      onClick={() => openModal(form)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      small
                      onClick={() => deleteForm(form.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Form Details
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Image
                    src="/icons/close.svg"
                    alt="Close"
                    width={24}
                    height={24}
                  />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 max-lg lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedForm.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedForm.email}
                    </p>
                  </div>
                </div>

                {selectedForm.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedForm.phone}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedForm.subject}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedForm.message}
                  </p>
                </div>

                <div className="grid grid-cols-1 max-lg lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedForm.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Update Form</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
