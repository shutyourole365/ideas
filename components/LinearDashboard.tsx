'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
import { LinearTeam } from '@/lib/integrations/linear';

export default function LinearDashboard() {
  const { tokens } = useTokenStore();
  const [teams, setTeams] = useState<LinearTeam[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokens.linear) return;
    setLoading(true);
    fetch('/api/linear', { headers: { 'x-linear-token': tokens.linear } })
      .then(r => r.json())
      .then(d => setTeams(d.teams))
      .finally(() => setLoading(false));
  }, [tokens.linear]);

  if (!tokens.linear) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Linear token</div>;
  
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Teams: {teams.length}</h3>
      {teams.slice(0, 5).map(t => (
        <div key={t.id} className="bg-white p-3 rounded shadow-sm text-sm">
          <p className="font-semibold">{t.name}</p>
          <p className="text-xs text-gray-500">{t.key}</p>
        </div>
      ))}
    </div>
  );
}
