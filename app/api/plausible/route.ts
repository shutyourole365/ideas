import { NextRequest, NextResponse } from 'next/server';
import PlausibleClient from '@/lib/integrations/plausible';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-plausible-token');
  if (!token) return NextResponse.json({ error: 'Missing Plausible token' }, { status: 401 });

  try {
    const plausible = new PlausibleClient(token);
    const sites = await plausible.getSites();
    return NextResponse.json({ sites });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Plausible data' },
      { status: error.response?.status || 500 }
    );
  }
}
