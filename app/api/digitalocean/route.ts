import { NextRequest, NextResponse } from 'next/server';
import DigitalOceanClient from '@/lib/integrations/digitalocean';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-digitalocean-token');
  if (!token) return NextResponse.json({ error: 'Missing DigitalOcean token' }, { status: 401 });

  try {
    const do_client = new DigitalOceanClient(token);
    const [droplets, apps] = await Promise.all([do_client.getDroplets(), do_client.getApps()]);
    return NextResponse.json({ droplets, apps });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch DigitalOcean data' },
      { status: error.response?.status || 500 }
    );
  }
}
