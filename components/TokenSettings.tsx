'use client';

import { useState } from 'react';
import { useTokenStore } from '@/lib/store';

const PLATFORMS = [
  { key: 'github', label: 'GitHub', docs: 'https://github.com/settings/tokens' },
  { key: 'vercel', label: 'Vercel', docs: 'https://vercel.com/account/tokens' },
];

export default function TokenSettings() {
  const { tokens, setToken } = useTokenStore();
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const handleTokenChange = (platform: string, value: string) => {
    setToken(platform, value);
  };

  const toggleVisibility = (platform: string) => {
    setVisible((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">API Tokens</h2>
      <p className="text-gray-600 text-sm mb-6">
        Add your API tokens to connect with platforms. Tokens are stored securely in your browser.
      </p>

      <div className="space-y-4">
        {PLATFORMS.map((platform) => (
          <div key={platform.key} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-gray-700">{platform.label} Token</label>
              <a
                href={platform.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm underline"
              >
                Get token →
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type={visible[platform.key] ? 'text' : 'password'}
                value={tokens[platform.key] || ''}
                onChange={(e) => handleTokenChange(platform.key, e.target.value)}
                placeholder={`Enter your ${platform.label} token`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => toggleVisibility(platform.key)}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                {visible[platform.key] ? '👁️' : '🔒'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
