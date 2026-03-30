'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { DatadogUser, DatadogMonitor } from '@/lib/integrations/datadog';

export default function DatadogDashboard() {
  const { tokens } = useTokenStore();
  const [user, setUser] = useState<DatadogUser | null>(null);
  const [monitors, setMonitors] = useState<DatadogMonitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.datadog || !tokens.datadog_app_key) return;
    fetchData();
  }, [tokens.datadog, tokens.datadog_app_key]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/datadog', {
        headers: { 'x-datadog-api-key': tokens.datadog, 'x-datadog-app-key': tokens.datadog_app_key },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUser(data.user);
      setMonitors(data.monitors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.datadog || !tokens.datadog_app_key) {
    return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Datadog tokens</div>;
  }

  return (
    <div className="space-y-4">
      {user && <div className="bg-white rounded-lg shadow-md p-4"><h4 className="font-semibold">{user.name}</h4></div>}
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Monitors</h3>
        <button onClick={fetchData} disabled={loading} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      {error && <div className="bg-red-50 p-3 text-red-700 text-sm rounded">{error}</div>}
      <div className="space-y-2">
        {monitors.slice(0, 5).map(m => (
          <div key={m.id} className="bg-white p-3 rounded shadow-sm text-sm">
            <p className="font-semibold">{m.name}</p>
            <p className="text-xs text-gray-500">{m.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
