import { NextRequest, NextResponse } from 'next/server';
import LinearClient from '@/lib/integrations/linear';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-linear-token');
  if (!token) return NextResponse.json({ error: 'Missing Linear token' }, { status: 401 });

  try {
    const linear = new LinearClient(token);
    const [teams, issues] = await Promise.all([linear.getTeams(), linear.getIssues()]);
    return NextResponse.json({ teams, issues });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Linear data' },
      { status: error.response?.status || 500 }
    );
  }
}
