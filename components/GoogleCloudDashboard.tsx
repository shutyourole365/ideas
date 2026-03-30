'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { GCPProject } from '@/lib/integrations/google-cloud';

export default function GoogleCloudDashboard() {
  const { tokens } = useTokenStore();
  const [projects, setProjects] = useState<GCPProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.google_cloud) return;
    fetchData();
  }, [tokens.google_cloud]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/google-cloud', {
        headers: { 'x-google-cloud-token': tokens.google_cloud },
      });

      if (!res.ok) throw new Error('Failed to fetch GCP data');
      const data = await res.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.google_cloud) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add your Google Cloud token in settings
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">GCP Projects</h3>
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
              key={project.projectId}
              href={`https://console.cloud.google.com/welcome?project=${project.projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-600 hover:underline">
                    {project.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{project.projectId}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created {new Date(project.createTime).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  project.lifecycleState === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.lifecycleState}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
