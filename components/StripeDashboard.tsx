'use client';

import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { StripeAccount, StripeCharge, StripeSubscription } from '@/lib/integrations/stripe';

export default function StripeDashboard() {
  const { tokens } = useTokenStore();
  const [account, setAccount] = useState<StripeAccount | null>(null);
  const [charges, setCharges] = useState<StripeCharge[]>([]);
  const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tokens.stripe) return;
    fetchData();
  }, [tokens.stripe]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe', {
        headers: { 'x-stripe-token': tokens.stripe },
      });

      if (!res.ok) throw new Error('Failed to fetch Stripe data');
      const data = await res.json();
      setAccount(data.account);
      setCharges(data.charges);
      setSubscriptions(data.subscriptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!tokens.stripe) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        Add your Stripe API key in settings
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
      {account && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg">{account.business_profile?.name || account.email}</h3>
          <p className="text-gray-600 text-sm">{account.id}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Recent Charges</h3>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="space-y-2">
          {charges.map((charge) => (
            <div key={charge.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    ${(charge.amount / 100).toFixed(2)} {charge.currency.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">{charge.description || 'No description'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(charge.created * 1000).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  charge.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {charge.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {subscriptions.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-4">Active Subscriptions</h3>
          <div className="space-y-2">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{sub.id}</p>
                    <p className="text-sm text-gray-600">
                      {sub.items.data[0]?.price.amount ? `$${(sub.items.data[0].price.amount / 100).toFixed(2)}/${sub.currency}` : 'Custom pricing'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
