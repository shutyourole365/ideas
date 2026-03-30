'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function MongoDBDashboard() {
  const { tokens } = useTokenStore();
  const [orgs, setOrgs] = useState<any[]>([]);
  useEffect(() => {
    if (!tokens.mongodb_public || !tokens.mongodb_private) return;
    fetch('/api/mongodb', { headers: { 'x-mongodb-public': tokens.mongodb_public, 'x-mongodb-private': tokens.mongodb_private } })
      .then(r => r.json())
      .then(d => setOrgs(d.orgs || []))
      .catch(() => {});
  }, [tokens.mongodb_public, tokens.mongodb_private]);
  if (!tokens.mongodb_public) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add MongoDB keys</div>;
  return <div className="space-y-4"><h3 className="font-bold">Orgs: {orgs.length}</h3></div>;
}
