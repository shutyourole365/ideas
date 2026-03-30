'use client';
import { useEffect, useState } from 'react';
import { useTokenStore } from '@/lib/store';
export default function VaultDashboard() {
  const { tokens } = useTokenStore();
  const [auth, setAuth] = useState<any>(null);
  useEffect(() => {
    if (!tokens.vault) return;
    fetch('/api/vault', { headers: { 'x-vault-token': tokens.vault, 'x-vault-addr': tokens.vault_addr } })
      .then(r => r.json())
      .then(d => setAuth(d.auth))
      .catch(() => {});
  }, [tokens.vault, tokens.vault_addr]);
  if (!tokens.vault) return <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500 text-sm">Add Vault credentials</div>;
  return <div className="space-y-4"><h3 className="font-bold">Vault</h3>{auth && <div className="bg-white p-4 rounded text-sm"><p>✓ Authenticated</p><p className="text-xs text-gray-500">TTL: {auth.ttl}s</p></div>}</div>;
}
