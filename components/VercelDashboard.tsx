'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { VercelUser, VercelProject } from '@/lib/integrations/vercel';

export default function VercelDashboard() {
  const { tokens } = useTokenStore();
  const [user, setUser] = useState<VercelUser | null>(null);
  const [projects, setProjects] = useState<VercelProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.vercel) return;

    fetchData();
  }, [tokens.vercel]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/vercel', {
        headers: { 'x-vercel-token': tokens.vercel },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch Vercel data');
      }

      const data = await res.json();
      setUser(data.user);
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.vercel) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add your Vercel token in settings to view your data
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
          <h3 className="font-bold text-lg mb-2">{user.username}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
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

        <div className="space-y-2">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.link.production || `https://vercel.com/${project.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-600 hover:underline">
                    {project.name}
                  </h4>
                  {project.link.production && (
                    <p className="text-xs text-gray-500 mt-1">{project.link.production}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
