'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function DigitalOceanDashboard() {
  const { tokens } = useTokenStore();
  const [droplets, setDroplets] = useState<any[]>([]);
  useEffect(() => {
    if (!tokens.digitalocean) return;
    fetch('/api/digitalocean', { headers: { 'x-digitalocean-token': tokens.digitalocean } })
      .then(r => r.json())
      .then(d => setDroplets(d.droplets || []))
      .catch(() => {});
  }, [tokens.digitalocean]);
  if (!tokens.digitalocean) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add DigitalOcean token</div>;
  return <div className="space-y-4"><h3 className="font-bold">Droplets: {droplets.length}</h3></div>;
}
