import { NextRequest, NextResponse } from 'next/server';
import NetlifyClient from '@/lib/integrations/netlify';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-netlify-token');

  if (!token) {
    return NextResponse.json({ error: 'Missing Netlify token' }, { status: 401 });
  }

  try {
    const netlify = new NetlifyClient(token);
    const [user, sites] = await Promise.all([
      netlify.getUser(),
      netlify.getSites(),
    ]);

    return NextResponse.json({
      user,
      sites,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Netlify data' },
      { status: error.response?.status || 500 }
    );
  }
}
