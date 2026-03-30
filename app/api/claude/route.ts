import { NextRequest, NextResponse } from 'next/server';
import ClaudeClient from '@/lib/integrations/claude';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-claude-token');

  if (!token) {
    return NextResponse.json({ error: 'Missing Claude token' }, { status: 401 });
  }

  try {
    const claude = new ClaudeClient(token);
    const [account, models] = await Promise.all([
      claude.getAccount(),
      claude.getAvailableModels(),
    ]);

    return NextResponse.json({
      account,
      models,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.error?.message || 'Failed to fetch Claude data' },
      { status: error.response?.status || 500 }
    );
  }
}
