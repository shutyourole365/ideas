'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { BoltUser, BoltApp } from '@/lib/integrations/bolt';

export default function BoltDashboard() {
  const { tokens } = useTokenStore();
  const [user, setUser] = useState<BoltUser | null>(null);
  const [apps, setApps] = useState<BoltApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.bolt) return;
    fetchData();
  }, [tokens.bolt]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bolt', {
        headers: { 'x-bolt-token': tokens.bolt },
      });

      if (!res.ok) throw new Error('Failed to fetch Bolt data');
      const data = await res.json();
      setUser(data.user);
      setApps(data.apps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.bolt) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add your Bolt token in settings
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-6">
        <p className="text-red-700 font-semibold mb-2">Error</p>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg">{user.name}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Apps</h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-2">
          {apps.map((app) => (
            <a
              key={app.id}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-600 hover:underline">
                    {app.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{app.url}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Updated {new Date(app.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  app.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {app.status}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
