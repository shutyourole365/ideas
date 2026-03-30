import { NextRequest, NextResponse } from 'next/server';
import MongoDBClient from '@/lib/integrations/mongodb';

export async function GET(request: NextRequest) {
  const publicKey = request.headers.get('x-mongodb-public');
  const privateKey = request.headers.get('x-mongodb-private');
  if (!publicKey || !privateKey) return NextResponse.json({ error: 'Missing MongoDB credentials' }, { status: 401 });

  try {
    const mongodb = new MongoDBClient(publicKey, privateKey);
    const orgs = await mongodb.getOrgs();
    return NextResponse.json({ orgs });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch MongoDB data' },
      { status: error.response?.status || 500 }
    );
  }
}
