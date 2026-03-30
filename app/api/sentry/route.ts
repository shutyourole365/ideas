import { NextRequest, NextResponse } from 'next/server';
import SentryClient from '@/lib/integrations/sentry';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-sentry-token');
  if (!token) return NextResponse.json({ error: 'Missing Sentry token' }, { status: 401 });

  try {
    const sentry = new SentryClient(token);
    const org = await sentry.getOrg();
    const projects = await sentry.getProjects(org.slug);
    return NextResponse.json({ org, projects });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Sentry data' },
      { status: error.response?.status || 500 }
    );
  }
}
