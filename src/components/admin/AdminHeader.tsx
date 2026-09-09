'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLogoutButton } from './AdminLogoutButton';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'NOT_DEFINED';
}

interface AdminHeaderProps {
  sidebarOpen?: boolean;
  onMenuClick?: () => void;
}

export function AdminHeader({ sidebarOpen, onMenuClick }: AdminHeaderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 lg:py-4 gap-2">
            <div className="flex items-center gap-2 lg:gap-4 min-w-0">
              {onMenuClick && (
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={onMenuClick}
                  className="lg:hidden flex-shrink-0 p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                Pacha of London Admin
              </h1>
              <Link
                href="/"
                className="hidden sm:inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex-shrink-0"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ana Sayfa
              </Link>
            </div>
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              <div className="animate-pulse h-4 bg-gray-200 rounded w-24 lg:w-32" />
              <div className="animate-pulse h-6 bg-gray-200 rounded w-12 lg:w-16" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4 gap-2">
          <div className="flex items-center gap-2 lg:gap-4 min-w-0">
            {onMenuClick && (
              <button
                type="button"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                onClick={onMenuClick}
                className="lg:hidden flex-shrink-0 p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
              Pacha of London Admin
            </h1>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex-shrink-0"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ana Sayfa
            </Link>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <span className="text-sm text-gray-500 truncate max-w-[100px] sm:max-w-none" title={user?.name || 'Admin User'}>
              {user?.name || 'Admin User'}
            </span>
            <span className="hidden lg:inline text-xs text-gray-400">
              ({user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'})
            </span>
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
