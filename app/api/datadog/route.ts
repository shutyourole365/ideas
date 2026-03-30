import { NextRequest, NextResponse } from 'next/server';
import DatadogClient from '@/lib/integrations/datadog';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-datadog-app-key');
  const apiKey = request.headers.get('x-datadog-api-key');

  if (!token || !apiKey) {
    return NextResponse.json({ error: 'Missing Datadog credentials' }, { status: 401 });
  }

  try {
    const datadog = new DatadogClient(token, apiKey);
    const [user, monitors] = await Promise.all([
      datadog.getUser(),
      datadog.getMonitors(),
    ]);

    return NextResponse.json({ user, monitors });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Datadog data' },
      { status: error.response?.status || 500 }
    );
  }
}
