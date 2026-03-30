import { NextRequest, NextResponse } from 'next/server';
import SegmentClient from '@/lib/integrations/segment';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-segment-token');
  if (!token) return NextResponse.json({ error: 'Missing Segment token' }, { status: 401 });

  try {
    const segment = new SegmentClient(token);
    const workspaces = await segment.getWorkspaces();
    return NextResponse.json({ workspaces });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Segment data' },
      { status: error.response?.status || 500 }
    );
  }
}
