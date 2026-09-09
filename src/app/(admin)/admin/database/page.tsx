'use client';

export const runtime = 'edge';
import { useState, useEffect } from 'react';

interface DatabaseStats {
  products: number;
  categories: number;
  brands: number;
  sellYourWatchForms: number;
  checkoutForms: number;
  admins: number;
}

interface TableData {
  tableName: string;
  count: number;
  sampleData: any[];
}

export default function DatabasePreview() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('products');
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database/stats');
      const data = (await response.json()) as DatabaseStats | any;

      if (data.success) {
        setStats(data.stats);
        setTableData(data.tableData);
      } else {
        setError(data.error || 'Failed to fetch database stats');
      }
    } catch (err) {
      setError('Error fetching database stats');
    } finally {
      setLoading(false);
    }
  };

  const getTableData = async (tableName: string) => {
    try {
      setTableLoading(true);
      const response = await fetch(`/api/database/table/${tableName}`);
      const data = (await response.json()) as TableData | any;

      if (data.success) {
        setTableData((prev) =>
          prev.map((table) =>
            table.tableName === tableName
              ? { ...table, sampleData: data.data }
              : table,
          ),
        );
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
    } finally {
      setTableLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading database preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchDatabaseStats}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">
          Database Preview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {stats &&
            Object.entries(stats).map(([key, value]) => (
              <div key={key} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  {value}
                </p>
              </div>
            ))}
        </div>

        {/* Table Selector */}
        <div className="bg-white rounded-lg shadow mb-6 lg:mb-8 overflow-hidden">
          <div className="p-4 lg:p-6 border-b">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
              Table Data
            </h2>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">
              Select a table to view sample data
            </p>
          </div>

          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mb-6">
              {tableData.map((table) => (
                <button
                  key={table.tableName}
                  onClick={() => {
                    setSelectedTable(table.tableName);
                    if (table.sampleData.length === 0) {
                      getTableData(table.tableName);
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedTable === table.tableName
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {table.tableName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {table.count} records
                  </p>
                </button>
              ))}
            </div>

            {/* Selected Table Data */}
            {selectedTable && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedTable.replace(/([A-Z])/g, ' $1').trim()} Data
                </h3>

                {(() => {
                  const table = tableData.find(
                    (t) => t.tableName === selectedTable,
                  );
                  if (!table) return null;

                  if (table.sampleData.length === 0 && tableLoading) {
                    return (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading data...</p>
                      </div>
                    );
                  }

                  if (table.sampleData.length === 0 && !tableLoading) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-gray-600">
                          No data available for this table
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto px-4 lg:px-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(table.sampleData[0] || {}).map(
                              (key) => (
                                <th
                                  key={key}
                                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {key}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {table.sampleData.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                  {typeof value === 'object'
                                    ? JSON.stringify(value, null, 2)
                                    : String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <p className="mt-4 text-sm text-gray-600 text-center">
                        Showing all {table.count} records
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
