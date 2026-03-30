'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function Auth0Dashboard() {
  const { tokens } = useTokenStore();
  if (!tokens.auth0 || !tokens.auth0_domain) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Auth0 credentials</div>;
  return <div className="space-y-4"><h3 className="font-bold">Auth0</h3><div className="bg-white p-4 rounded text-sm"><p>Domain: {tokens.auth0_domain}</p><p>Connected</p></div></div>;
}
