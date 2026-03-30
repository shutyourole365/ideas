'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { NetlifyUser, NetlifySite } from '@/lib/integrations/netlify';

export default function NetlifyDashboard() {
  const { tokens } = useTokenStore();
  const [user, setUser] = useState<NetlifyUser | null>(null);
  const [sites, setSites] = useState<NetlifySite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.netlify) return;
    fetchData();
  }, [tokens.netlify]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/netlify', {
        headers: { 'x-netlify-token': tokens.netlify },
      });

      if (!res.ok) throw new Error('Failed to fetch Netlify data');
      const data = await res.json();
      setUser(data.user);
      setSites(data.sites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.netlify) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add your Netlify token in settings
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-6">
        <p className="text-red-700 font-semibold mb-2">Error</p>
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg">{user.full_name}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Sites</h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-2">
          {sites.map((site) => (
            <a
              key={site.id}
              href={site.ssl_url || site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <h4 className="font-semibold text-blue-600 hover:underline">{site.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{site.url}</p>
              <p className="text-xs text-gray-500 mt-1">
                Updated {new Date(site.updated_at).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
