'use client';

export const runtime = 'edge';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalProducts: number;
  pendingForms: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    pendingForms: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/me');
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }
        // Load dashboard stats
        loadStats();
      } catch (error) {
        router.push('/admin/login');
        return;
      }
    };

    checkAuth();
  }, [router]);

  const loadStats = async () => {
    try {
      setLoading(true);

      // Use count-only endpoint — avoids loading full product list (Worker 1102 fix)
      const productsResponse = await fetch('/api/products?countOnly=true');
      const productsData = (await productsResponse.json()) as { count?: number };
      const totalProducts = typeof productsData?.count === 'number' ? productsData.count : 0;

      // Use pagination total — avoids loading all forms
      const formsResponse = await fetch('/api/sell-watch-forms?status=PENDING&limit=1');
      const formsData = (await formsResponse.json()) as { pagination?: { total?: number } };
      const pendingForms = formsData.pagination?.total ?? 0;

      // Load users count (if you have a users API)
      const totalUsers = 0; // Placeholder for now

      setStats({
        totalProducts,
        pendingForms,
        totalUsers,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">
          Welcome to Pacha of London Admin Panel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {loading ? '...' : stats.totalProducts}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Pending Forms</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {loading ? '...' : stats.pendingForms}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">
            {loading ? '...' : stats.totalUsers}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/products/new')}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">
                  Add New Product
                </p>
                <p className="text-sm text-gray-500">
                  Create a new watch or jewellery product
                </p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/sell-watch-forms')}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
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
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">
                  Review Forms
                </p>
                <p className="text-sm text-gray-500">
                  Check and manage sell your watch forms.
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Management</h3>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/products')}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-blue-600"
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
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">
                  Manage Products
                </p>
                <p className="text-sm text-gray-500">
                  View and edit all products
                </p>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/checkout-forms')}
              className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">
                  Checkout Orders
                </p>
                <p className="text-sm text-gray-500">Manage customer orders</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
