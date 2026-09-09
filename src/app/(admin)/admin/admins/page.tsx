'use client';

export const runtime = 'edge';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Toast } from '@/components/ui/Toast';
import Button from '@/components/ui/button';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'NOT_DEFINED';
  onlineStatus: 'ONLINE' | 'OFFLINE';
  createdAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Role assignment
  const [assigningRole, setAssigningRole] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchAdmins();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      if (response.ok) {
        const userData = (await response.json()) as Admin;
        setUser(userData);

        // Check if user is SUPER_ADMIN
        if (userData.role !== 'SUPER_ADMIN') {
          router.push('/admin');
          return;
        }
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/admins');
      if (response.ok) {
        const data = (await response.json()) as Admin[];
        setAdmins(data);
      } else {
        setError('Admin listesi yüklenemedi');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('Admin listesi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (adminId: string, role: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/admins/${adminId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      const data = (await response.json()) as any;

      if (response.ok) {
        setSuccess('Role assigned successfully');
        fetchAdmins(); // Refresh the list
      } else {
        setError(data.message || 'Failed to assign role');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      setError('Failed to assign role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRole = async (adminId: string) => {
    if (
      !confirm(
        "Are you sure you want to remove this admin's role? They will no longer be able to log in.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/admins/${adminId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'NOT_DEFINED' }),
      });

      const data = (await response.json()) as any;

      if (response.ok) {
        setSuccess('Role removed successfully');
        fetchAdmins(); // Refresh the list
      } else {
        setError(data.message || 'Failed to remove role');
      }
    } catch (error) {
      console.error('Error removing role:', error);
      setError('Failed to remove role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Admin deleted successfully');
        fetchAdmins(); // Refresh the list
      } else {
        const data = (await response.json()) as any;
        setError(data.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      setError('Failed to delete admin');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Admin Management
        </h1>
        <p className="mt-2 text-gray-600 text-sm lg:text-base">
          Manage roles of registered users
        </p>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg lg:text-xl font-semibold">Admin List</h2>
        </div>
        <div className="overflow-x-auto px-4 lg:px-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {admin.name}
                      </div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    {admin.role === 'NOT_DEFINED' ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        No Role Assigned
                      </span>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.onlineStatus === 'ONLINE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {admin.onlineStatus === 'ONLINE' ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-wrap gap-2">
                      {admin.role === 'NOT_DEFINED' && (
                        <button
                          onClick={() => handleAssignRole(admin.id, 'ADMIN')}
                          disabled={isLoading}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          Make Admin
                        </button>
                      )}
                      {admin.role === 'ADMIN' && admin.id !== user.id && (
                        <button
                          onClick={() => handleRemoveRole(admin.id)}
                          disabled={isLoading}
                          className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                        >
                          Remove Role
                        </button>
                      )}
                      {admin.id !== user.id && (
                        <button
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Toast />
    </div>
  );
}
