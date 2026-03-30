import { NextRequest, NextResponse } from 'next/server';
import BoltClient from '@/lib/integrations/bolt';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-bolt-token');

  if (!token) {
    return NextResponse.json({ error: 'Missing Bolt token' }, { status: 401 });
  }

  try {
    const bolt = new BoltClient(token);
    const [user, apps] = await Promise.all([
      bolt.getUser(),
      bolt.getApps(),
    ]);

    return NextResponse.json({
      user,
      apps,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Bolt data' },
      { status: error.response?.status || 500 }
    );
  }
}
