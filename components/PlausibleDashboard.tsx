'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function PlausibleDashboard() {
  const { tokens } = useTokenStore();
  const [sites, setSites] = useState<any[]>([]);
  useEffect(() => {
    if (!tokens.plausible) return;
    fetch('/api/plausible', { headers: { 'x-plausible-token': tokens.plausible } })
      .then(r => r.json())
      .then(d => setSites(d.sites || []))
      .catch(() => {});
  }, [tokens.plausible]);
  if (!tokens.plausible) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Plausible token</div>;
  return <div className="space-y-4"><h3 className="font-bold">Sites: {sites.length}</h3>{sites.slice(0,3).map((s,i) => <div key={i} className="bg-white p-3 rounded text-sm"><p>{s.domain}</p></div>)}</div>;
}
