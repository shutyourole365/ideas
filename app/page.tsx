'use client';

import { useEffect, useState } from 'react';
import TokenSettings from '@/components/TokenSettings';
import GitHubDashboard from '@/components/GitHubDashboard';
import VercelDashboard from '@/components/VercelDashboard';
import NetlifyDashboard from '@/components/NetlifyDashboard';
import StripeDashboard from '@/components/StripeDashboard';
import SupabaseDashboard from '@/components/SupabaseDashboard';
import BoltDashboard from '@/components/BoltDashboard';
import GoogleCloudDashboard from '@/components/GoogleCloudDashboard';
import ClaudeDashboard from '@/components/ClaudeDashboard';
import DatadogDashboard from '@/components/DatadogDashboard';
import SentryDashboard from '@/components/SentryDashboard';
import LinearDashboard from '@/components/LinearDashboard';
import Auth0Dashboard from '@/components/Auth0Dashboard';
import SlackDashboard from '@/components/SlackDashboard';
import SendGridDashboard from '@/components/SendGridDashboard';
import AWSDashboard from '@/components/AWSDashboard';
import DigitalOceanDashboard from '@/components/DigitalOceanDashboard';
import MongoDBDashboard from '@/components/MongoDBDashboard';
import RedisDashboard from '@/components/RedisDashboard';
import PlausibleDashboard from '@/components/PlausibleDashboard';
import SegmentDashboard from '@/components/SegmentDashboard';
import VaultDashboard from '@/components/VaultDashboard';
import { useTokenStore } from '@/lib/store';

const PLATFORMS = [
  { name: 'GitHub', component: GitHubDashboard },
  { name: 'Vercel', component: VercelDashboard },
  { name: 'Netlify', component: NetlifyDashboard },
  { name: 'Stripe', component: StripeDashboard },
  { name: 'Supabase', component: SupabaseDashboard },
  { name: 'Bolt', component: BoltDashboard },
  { name: 'Google Cloud', component: GoogleCloudDashboard },
  { name: 'Claude', component: ClaudeDashboard },
  { name: 'Datadog', component: DatadogDashboard },
  { name: 'Sentry', component: SentryDashboard },
  { name: 'Linear', component: LinearDashboard },
  { name: 'Auth0', component: Auth0Dashboard },
  { name: 'Slack', component: SlackDashboard },
  { name: 'SendGrid', component: SendGridDashboard },
  { name: 'AWS', component: AWSDashboard },
  { name: 'DigitalOcean', component: DigitalOceanDashboard },
  { name: 'MongoDB', component: MongoDBDashboard },
  { name: 'Redis', component: RedisDashboard },
  { name: 'Plausible', component: PlausibleDashboard },
  { name: 'Segment', component: SegmentDashboard },
  { name: 'Vault', component: VaultDashboard },
];

export default function Home() {
  const { loadTokens } = useTokenStore();
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const filteredPlatforms = PLATFORMS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Unified Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">21 Integrated Platforms</p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {showSettings ? 'View Dashboard' : 'Settings'}
            </button>
          </div>

          {!showSettings && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="🔍 Search platforms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                {filteredPlatforms.length}/{PLATFORMS.length}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {showSettings ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <TokenSettings />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlatforms.map(({ name, component: Component }) => (
              <div key={name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">{name}</h2>
                <Component />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>✨ 21 platforms integrated | Add tokens in Settings to see live data</p>
        </div>
      </footer>
    </main>
  );
}
