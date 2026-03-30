'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function RedisDashboard() {
  const { tokens } = useTokenStore();
  const [databases, setDatabases] = useState<any[]>([]);
  useEffect(() => {
    if (!tokens.redis) return;
    fetch('/api/redis', { headers: { 'x-redis-token': tokens.redis } })
      .then(r => r.json())
      .then(d => setDatabases(d.databases || []))
      .catch(() => {});
  }, [tokens.redis]);
  if (!tokens.redis) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Redis token</div>;
  return <div className="space-y-4"><h3 className="font-bold">Databases: {databases.length}</h3></div>;
}
