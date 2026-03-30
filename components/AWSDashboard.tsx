'use client';
import { useTokenStore } from '@/lib/store';
export default function AWSDashboard() {
  const { tokens } = useTokenStore();
  if (!tokens.aws_key || !tokens.aws_secret) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add AWS credentials</div>;
  return <div className="space-y-4"><h3 className="font-bold">AWS Services</h3><div className="space-y-2"><div className="bg-white p-3 rounded text-sm"><p>✓ EC2</p></div><div className="bg-white p-3 rounded text-sm"><p>✓ RDS</p></div><div className="bg-white p-3 rounded text-sm"><p>✓ S3</p></div></div></div>;
}
