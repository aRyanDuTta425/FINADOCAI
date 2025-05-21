import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/db-test');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error testing database:', err);
      let msg = 'Unknown error';
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === 'object' && err && 'message' in err) {
        // @ts-ignore
        msg = err.message;
      }
      setError('Failed to test database: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">System Diagnostics</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Database Connection Test</h2>
        <button 
          onClick={testDatabase}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded text-red-700">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <div className={`p-4 ${result.message.includes('successful') ? 'bg-green-50 border border-green-300 text-green-700' : 'bg-red-50 border border-red-300 text-red-700'} rounded`}>
              <p className="font-semibold">{result.message}</p>
              <p className="text-sm mt-1">Timestamp: {result.timestamp}</p>
            </div>
            
            {result.users && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Sample Users ({result.users.length})</h3>
                {result.users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {result.users.map((user: any) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id.substring(0, 8)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No user records found.</p>
                )}
              </div>
            )}
            
            {result.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Error Details</h3>
                <p><span className="font-semibold">Type:</span> {result.error.name}</p>
                <p><span className="font-semibold">Message:</span> {result.error.message}</p>
                {result.error.stack && (
                  <div className="mt-2">
                    <p className="font-semibold">Stack Trace:</p>
                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {result.error.stack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-300 rounded">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">System Information</h2>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><span className="font-semibold">Node.js Version:</span> {process.version}</li>
          <li><span className="font-semibold">Next.js Environment:</span> {process.env.NODE_ENV}</li>
          <li><span className="font-semibold">Database:</span> PostgreSQL (Neon)</li>
          <li><span className="font-semibold">Authentication:</span> JWT via HTTP-only cookies</li>
        </ul>
      </div>
    </div>
  );
}

TestPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
