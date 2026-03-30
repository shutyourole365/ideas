'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { SupabaseOrganization, SupabaseProject } from '@/lib/integrations/supabase';

export default function SupabaseDashboard() {
  const { tokens } = useTokenStore();
  const [orgs, setOrgs] = useState<SupabaseOrganization[]>([]);
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.supabase_url || !tokens.supabase_key) return;
    fetchData();
  }, [tokens.supabase_url, tokens.supabase_key]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/supabase', {
        headers: {
          'x-supabase-url': tokens.supabase_url,
          'x-supabase-key': tokens.supabase_key,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch Supabase data');
      const data = await res.json();
      setOrgs(data.organizations);
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.supabase_url || !tokens.supabase_key) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add your Supabase URL and API key in settings
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
      {orgs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-3">Organizations</h3>
          <div className="space-y-2">
            {orgs.map((org) => (
              <div key={org.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="font-semibold text-gray-900">{org.name}</p>
                <p className="text-xs text-gray-500">@{org.slug}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Projects</h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            No projects found
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{project.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{project.database.host}</p>
                    <p className="text-xs text-gray-500">PostgreSQL {project.database.version}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
