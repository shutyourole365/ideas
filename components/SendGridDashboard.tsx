'use client';
import { useTokenStore } from '@/lib/store';
export default function SendGridDashboard() {
  const { tokens } = useTokenStore();
  if (!tokens.sendgrid) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add SendGrid token</div>;
  return <div className="space-y-4"><h3 className="font-bold">SendGrid</h3><div className="bg-white p-4 rounded text-sm">Connected</div></div>;
}
