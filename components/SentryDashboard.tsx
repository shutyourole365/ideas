'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { SentryOrg, SentryProject } from '@/lib/integrations/sentry';

export default function SentryDashboard() {
  const { tokens } = useTokenStore();
  const [org, setOrg] = useState<SentryOrg | null>(null);
  const [projects, setProjects] = useState<SentryProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.sentry) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/sentry', { headers: { 'x-sentry-token': tokens.sentry } });
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setOrg(data.org);
        setProjects(data.projects);
      } catch (err) {
        setError('Error loading');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tokens.sentry]);

  if (!tokens.sentry) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Sentry token</div>;

  return (
    <div className="space-y-4">
      {org && <div className="bg-white rounded-lg shadow-md p-4"><h4 className="font-semibold">{org.name}</h4></div>}
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Projects</h3>
        <button onClick={() => window.location.reload()} disabled={loading} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Refresh</button>
      </div>
      {error && <div className="bg-red-50 p-3 text-red-700 text-sm rounded">{error}</div>}
      <div className="space-y-2">
        {projects.slice(0, 5).map(p => (
          <div key={p.id} className="bg-white p-3 rounded shadow-sm text-sm">
            <p className="font-semibold">{p.name}</p>
            <p className="text-xs text-gray-500">{p.platform}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
