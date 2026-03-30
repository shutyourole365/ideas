'use client';

import { useEffect, useState } from 'react';
import TokenSettings from '@/components/TokenSettings';
import GitHubDashboard from '@/components/GitHubDashboard';
import VercelDashboard from '@/components/VercelDashboard';
import NetlifyDashboard from '@/components/NetlifyDashboard';
import StripeDashboard from '@/components/StripeDashboard';
import SupabaseDashboard from '@/components/SupabaseDashboard';
import { useTokenStore } from '@/lib/store';

export default function Home() {
  const { loadTokens } = useTokenStore();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Unified Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Manage all your platforms from one place</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {showSettings ? 'View Dashboard' : 'Settings'}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {showSettings ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <TokenSettings />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* GitHub */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">GitHub</h2>
              <GitHubDashboard />
            </div>

            {/* Vercel */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vercel</h2>
              <VercelDashboard />
            </div>

            {/* Netlify */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Netlify</h2>
              <NetlifyDashboard />
            </div>

            {/* Stripe */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stripe</h2>
              <StripeDashboard />
            </div>

            {/* Supabase */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Supabase</h2>
              <SupabaseDashboard />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>Add more platforms by creating new integrations in <code>lib/integrations/</code></p>
        </div>
      </footer>
    </main>
  );
}
