import { NextRequest, NextResponse } from 'next/server';
import GoogleCloudClient from '@/lib/integrations/google-cloud';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-google-cloud-token');

  if (!token) {
    return NextResponse.json({ error: 'Missing Google Cloud token' }, { status: 401 });
  }

  try {
    const gcp = new GoogleCloudClient(token);
    const projects = await gcp.getProjects();

    return NextResponse.json({
      projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.error?.message || 'Failed to fetch Google Cloud data' },
      { status: error.response?.status || 500 }
    );
  }
}
