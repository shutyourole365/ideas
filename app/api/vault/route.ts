import { NextRequest, NextResponse } from 'next/server';
import VaultClient from '@/lib/integrations/vault';

const ALLOWED_VAULT_HOSTS = [
  'localhost:8200',
  '127.0.0.1:8200',
  process.env.VAULT_ADDR,
].filter(Boolean);

function isValidVaultAddr(addr: string): boolean {
  try {
    const url = new URL(addr.startsWith('http') ? addr : `http://${addr}`);
    return ALLOWED_VAULT_HOSTS.some(host => url.host === host || url.hostname === new URL(`http://${host}`).hostname);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-vault-token');
  const addr = request.headers.get('x-vault-addr') || process.env.VAULT_ADDR || 'http://127.0.0.1:8200';

  if (!token) return NextResponse.json({ error: 'Missing Vault token' }, { status: 401 });

  // Validate Vault address to prevent SSRF
  if (!isValidVaultAddr(addr)) {
    return NextResponse.json(
      { error: 'Invalid Vault address. Use environment variable VAULT_ADDR or allowed localhost addresses.' },
      { status: 400 }
    );
  }

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
