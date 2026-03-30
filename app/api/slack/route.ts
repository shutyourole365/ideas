import { NextRequest, NextResponse } from 'next/server';
import SlackClient from '@/lib/integrations/slack';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-slack-token');
  if (!token) return NextResponse.json({ error: 'Missing Slack token' }, { status: 401 });

  try {
    const slack = new SlackClient(token);
    const [team, channels] = await Promise.all([slack.getTeam(), slack.getChannels()]);
    return NextResponse.json({ team, channels });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Slack data' },
      { status: error.response?.status || 500 }
    );
  }
}
