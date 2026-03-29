import { NextRequest, NextResponse } from 'next/server';
import VercelClient from '@/lib/integrations/vercel';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-vercel-token');

  if (!token) {
    return NextResponse.json({ error: 'Missing Vercel token' }, { status: 401 });
  }

  try {
    const vercel = new VercelClient(token);
    const [user, projects] = await Promise.all([
      vercel.getUser(),
      vercel.getProjects(),
    ]);

    return NextResponse.json({
      user,
      projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Vercel data' },
      { status: error.response?.status || 500 }
    );
  }
}
