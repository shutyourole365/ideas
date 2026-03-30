import { NextRequest, NextResponse } from 'next/server';
import Auth0Client from '@/lib/integrations/auth0';

function isValidAuth0Domain(domain: string): boolean {
  // Validate Auth0 domain format: must be auth0 subdomain
  return /^[a-z0-9-]+\.auth0\.com$/.test(domain.toLowerCase());
}

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-auth0-token');
  const domain = request.headers.get('x-auth0-domain');

  if (!token || !domain) return NextResponse.json({ error: 'Missing Auth0 credentials' }, { status: 401 });

  // Validate domain to prevent SSRF
  if (!isValidAuth0Domain(domain)) {
    return NextResponse.json(
      { error: 'Invalid Auth0 domain. Must be a valid auth0.com subdomain.' },
      { status: 400 }
    );
  }

  try {
    const auth0 = new Auth0Client(token, domain);
    const [tenant, apps] = await Promise.all([auth0.getTenant(), auth0.getApplications()]);
    return NextResponse.json({ tenant, apps });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Auth0 data' },
      { status: error.response?.status || 500 }
    );
  }
}
