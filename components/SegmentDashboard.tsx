'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function SegmentDashboard() {
  const { tokens } = useTokenStore();
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  useEffect(() => {
    if (!tokens.segment) return;
    fetch('/api/segment', { headers: { 'x-segment-token': tokens.segment } })
      .then(r => r.json())
      .then(d => setWorkspaces(d.workspaces || []))
      .catch(() => {});
  }, [tokens.segment]);
  if (!tokens.segment) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Segment token</div>;
  return <div className="space-y-4"><h3 className="font-bold">Workspaces: {workspaces.length}</h3>{workspaces.map((w,i) => <div key={i} className="bg-white p-3 rounded text-sm"><p className="font-semibold">{w.name}</p></div>)}</div>;
}
