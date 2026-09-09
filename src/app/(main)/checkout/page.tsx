'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartModal from '@/components/modals/CartModal';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [discount, setDiscount] = useState('');
  const [contact, setContact] = useState('');
  const [news, setNews] = useState(false);
  const [country, setCountry] = useState('United Kingdom');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [apt, setApt] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  // ✅ errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal;

  useEffect(() => {
    if (cart.length === 0) router.push('/');
  }, [cart.length, router]);

  const clearError = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ✅ FRONTEND VALIDATION
  const validateFrontend = () => {
    const newErrors: Record<string, string> = {};

    if (!contact) newErrors.contact = 'Contact is required';
    if (!country) newErrors.country = 'Country is required';
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!address) newErrors.address = 'Address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!zip) newErrors.zip = 'ZIP code is required';

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      router.push('/');
      return;
    }

    const frontendErrors = validateFrontend();

    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);

      const firstErrorField = Object.keys(frontendErrors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          news,
          country,
          firstName,
          lastName,
          company,
          address,
          apt,
          city,
          state,
          zip,
          paymentMethod,
          cartItems: cart,
          subtotal,
          shipping,
          discount,
          discountAmount: 0,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        if (errorData.errors) {
          setErrors(errorData.errors);
          setIsSubmitting(false);
          return;
        }
        throw new Error(errorData.error || 'Failed to submit order');
      }

      await response.json();
      setShowSuccessModal(true);

      // reset form
      setContact('');
      setNews(false);
      setCountry('United Kingdom');
      setFirstName('');
      setLastName('');
      setCompany('');
      setAddress('');
      setApt('');
      setCity('');
      setState('');
      setZip('');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(
        `Error submitting order: ${error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF6F2] min-h-screen py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">

        {/* LEFT FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-white rounded-2xl p-8 flex flex-col gap-8 min-w-[320px]"
        >
          {/* CONTACT */}
          <div>
            <h2 className="text-2xl font-secondary text-primary mb-2">
              Contact
            </h2>

            <label className="text-sm font-medium text-primary mb-1 block">
              Email or Phone <span className="text-red-500">*</span>
            </label>

            <Input
              name="contact"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                clearError('contact');
              }}
              error={!!errors.contact}
            />
            {errors.contact && (
              <div className="text-red-500 text-xs mt-1">
                {errors.contact}
              </div>
            )}

            <label className="flex items-center gap-2 text-primary/80 text-sm mt-2">
              <input
                type="checkbox"
                checked={news}
                onChange={(e) => setNews(e.target.checked)}
              />
              Email me with news and offers
            </label>
          </div>

          {/* DELIVERY */}
          <div>
            <h2 className="text-2xl font-secondary text-primary mb-1">
              Delivery
            </h2>
            <div className="text-primary/60 text-sm mb-4">
              This will also be used as your billing address.
            </div>

            <label className="text-sm font-medium text-primary mb-1 block">
              Country <span className="text-red-500">*</span>
            </label>

            <select
              name="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                clearError('country');
              }}
              className={`w-full rounded-md bg-[#FAF6F2] px-4 py-2 focus:outline-none focus:ring-2 ${errors.country
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-[#EAD6C2] focus:ring-[#E1B989]'
                }`}
            >
              <option>United Kingdom</option>
              <option>United States</option>
              <option>Germany</option>
              <option>France</option>
              <option>Turkey</option>
              <option>Other</option>
            </select>

            {errors.country && (
              <div className="text-red-500 text-xs mt-1">
                {errors.country}
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-primary mb-1 block">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="firstName"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError('firstName');
                  }}
                  error={!!errors.firstName}
                />
                {errors.firstName && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-primary mb-1 block">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="lastName"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError('lastName');
                  }}
                  error={!!errors.lastName}
                />
                {errors.lastName && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>

            <label className="text-sm font-medium text-primary mt-2 block">
              Company (optional)
            </label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <label className="text-sm font-medium text-primary mt-2 block">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              name="address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                clearError('address');
              }}
              error={!!errors.address}
            />
            {errors.address && (
              <div className="text-red-500 text-xs mt-1">
                {errors.address}
              </div>
            )}

            <label className="text-sm font-medium text-primary mt-2 block">
              Apartment, suite, etc. (optional)
            </label>
            <Input
              value={apt}
              onChange={(e) => setApt(e.target.value)}
            />

            <div className="flex gap-2 mt-2">
              <div className="flex-1">
                <label className="text-sm font-medium text-primary mb-1 block">
                  City <span className="text-red-500">*</span>
                </label>
                <Input
                  name="city"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    clearError('city');
                  }}
                  error={!!errors.city}
                />
                {errors.city && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.city}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-primary mb-1 block">
                  State <span className="text-red-500">*</span>
                </label>
                <Input
                  name="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    clearError('state');
                  }}
                  error={!!errors.state}
                />
                {errors.state && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.state}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-primary mb-1 block">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <Input
                  name="zip"
                  value={zip}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setZip(e.target.value);
                      clearError('zip');
                    }
                  }}
                  error={!!errors.zip}
                />
                {errors.zip && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.zip}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            variant="secondary"
            className="w-full mt-4 py-3 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order'}
          </Button>
        </form>

        {/* RIGHT CART */}
        <div className="w-full md:w-[350px] flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 mb-4">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={60}
                  height={60}
                  className="rounded bg-[#F8F7F5] object-contain"
                />
                <div className="flex-1">
                  <div className="text-base text-primary font-medium mb-1">
                    {item.title}
                  </div>
                  <div className="text-lg text-primary font-bold mb-1">
                    £{' '}
                    {item.price.toLocaleString('en-GB', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setShowCartModal(true)}
                  className="text-primary/60 hover:text-secondary text-sm underline"
                  type="button"
                >
                  Edit
                </button>
              </div>
            ))}

            <Input
              placeholder="Discount Code"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />

            <Button type="button" variant="primary" className="w-full my-3">
              Apply
            </Button>

            <div className="flex justify-between text-primary/80 mb-1">
              <span>Subtotal</span>
              <span>
                £{' '}
                {subtotal.toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between text-primary/80 mb-1">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between text-primary font-bold text-lg mt-2">
              <span>Total</span>
              <span>
                £{' '}
                {total.toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-96 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
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

            <h3 className="text-lg font-medium text-gray-900 mt-4">
              Order Submitted Successfully!
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Thank you for your order. We will contact you shortly.
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                clearCart();
                router.push('/');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <CartModal show={showCartModal} onClose={() => setShowCartModal(false)} />
    </div>
  );
}
