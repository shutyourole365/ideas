import { NextRequest, NextResponse } from 'next/server';
import VaultClient from '@/lib/integrations/vault';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-vault-token');
  const addr = request.headers.get('x-vault-addr') || 'http://127.0.0.1:8200';
  if (!token) return NextResponse.json({ error: 'Missing Vault token' }, { status: 401 });

  try {
    const vault = new VaultClient(token, addr);
    const auth = await vault.getAuth();
    return NextResponse.json({ auth });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Vault data' },
      { status: error.response?.status || 500 }
    );
  }
}
