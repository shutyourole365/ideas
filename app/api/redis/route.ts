import { NextRequest, NextResponse } from 'next/server';
import RedisClient from '@/lib/integrations/redis';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-redis-token');
  if (!token) return NextResponse.json({ error: 'Missing Redis token' }, { status: 401 });

  try {
    const redis = new RedisClient(token);
    const databases = await redis.getDatabases();
    return NextResponse.json({ databases });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Redis data' },
      { status: error.response?.status || 500 }
    );
  }
}
