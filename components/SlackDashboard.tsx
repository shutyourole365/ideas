'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function SlackDashboard() {
  const { tokens } = useTokenStore();
  const [channels, setChannels] = useState<any[]>([]);
  useEffect(() => {
    if (!tokens.slack) return;
    fetch('/api/slack', { headers: { 'x-slack-token': tokens.slack } })
      .then(r => r.json())
      .then(d => setChannels(d.channels || []))
      .catch(() => {});
  }, [tokens.slack]);
  if (!tokens.slack) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Slack token</div>;
  return <div className="space-y-4"><h3 className="font-bold">Channels: {channels.length}</h3></div>;
}
