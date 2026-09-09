'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'NOT_DEFINED';
}

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (response.ok) {
        const userData = (await response.json()) as AdminUser;
        setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const navContent = loading ? (
    <div className="px-4 space-y-2">
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
      </div>
    </div>
  ) : (
    <div className="px-4 space-y-2">
      <Link
            href="/admin"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
            </svg>
            Dashboard
          </Link>

      <Link
            href="/admin/products"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin/products' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Products
          </Link>

      <Link
            href="/admin/categories"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin/categories' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Categories
          </Link>

      <Link
            href="/admin/brands"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin/brands' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Brands
          </Link>

      <Link
            href="/admin/sell-watch-forms"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin/sell-watch-forms' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
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
            Sell Your Watch Forms
          </Link>

      <Link
            href="/admin/checkout-forms"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin/checkout-forms' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            Checkout Forms
          </Link>

      <Link
            href="/admin/contact-forms"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin/contact-forms' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Forms
          </Link>

      <Link
            href="/admin/database"
            onClick={onClose}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              pathname === '/admin/database' ? 'bg-gray-100' : ''
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
            Database Preview
          </Link>

          {/* Only show Admin Management for SUPER_ADMIN */}
      {user?.role === 'SUPER_ADMIN' && (
            <Link
              href="/admin/admins"
              onClick={onClose}
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                pathname === '/admin/admins' ? 'bg-gray-100' : ''
              }`}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Admin Management
            </Link>
      )}
    </div>
  );

  return (
    <>
      {/* Overlay: max-lg only, when sidebar open */}
      {onClose && (
        <div
          aria-hidden="true"
          className={`fixed inset-0 z-30 bg-black/20 transition-opacity lg:hidden ${
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
      )}
      <aside
        className={`
          w-64 bg-white shadow-sm min-h-screen flex-shrink-0
          max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:transition-transform max-lg:duration-200 max-lg:ease-out
          ${open ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
        `}
      >
        <nav className="mt-8">
          {loading ? navContent : (
            <>
              {onClose && (
                <div className="lg:hidden flex justify-end px-4 pb-2">
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={onClose}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {navContent}
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
