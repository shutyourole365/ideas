'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { ClaudeAccount, ClaudeModel } from '@/lib/integrations/claude';

export default function ClaudeDashboard() {
  const { tokens } = useTokenStore();
  const [account, setAccount] = useState<ClaudeAccount | null>(null);
  const [models, setModels] = useState<ClaudeModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.claude) return;
    fetchData();
  }, [tokens.claude]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/claude', {
        headers: { 'x-claude-token': tokens.claude },
      });

      if (!res.ok) throw new Error('Failed to fetch Claude data');
      const data = await res.json();
      setAccount(data.account);
      setModels(data.models);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.claude) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add your Claude API key in settings
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
      {account && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg">{account.name}</h3>
          <p className="text-gray-600 text-sm">{account.email}</p>
          <p className="text-xs text-green-700 mt-2">
            ✓ {account.subscription_status}
          </p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Available Models</h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{model.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Context: {model.context_window.toLocaleString()} tokens
                  </p>
                  <p className="text-xs text-gray-500">ID: {model.id}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  model.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {model.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
