import { NextRequest, NextResponse } from 'next/server';
import VaultClient from '@/lib/integrations/vault';

// Build allowed hosts list, parsing VAULT_ADDR if it's a URL
const ALLOWED_VAULT_HOSTS = [
  'localhost:8200',
  '127.0.0.1:8200',
  ...(process.env.VAULT_ADDR ? (() => {
    try {
      // If VAULT_ADDR is a full URL, extract its host (includes port)
      return [new URL(process.env.VAULT_ADDR!).host];
    } catch {
      // If it's not a valid URL, use as-is (assume host:port format)
      return [process.env.VAULT_ADDR!];
    }
  })() : []),
];

function isValidVaultAddr(addr: string): boolean {
  try {
    const url = new URL(addr.startsWith('http') ? addr : `http://${addr}`);
    // Only compare full host (including port) - no hostname-only fallback
    return ALLOWED_VAULT_HOSTS.some(allowed => {
      try {
        const allowedUrl = new URL(allowed.startsWith('http') ? allowed : `http://${allowed}`);
        return url.host === allowedUrl.host;
      } catch {
        return false;
      }
    });
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
