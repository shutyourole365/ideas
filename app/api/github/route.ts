import { NextRequest, NextResponse } from 'next/server';
import GitHubClient from '@/lib/integrations/github';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-github-token');

  if (!token) {
    return NextResponse.json({ error: 'Missing GitHub token' }, { status: 401 });
  }

  try {
    const github = new GitHubClient(token);
    const [user, repos] = await Promise.all([
      github.getUser(),
      github.getRepos(),
    ]);

    return NextResponse.json({
      user,
      repos,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch GitHub data' },
      { status: error.response?.status || 500 }
    );
  }
}
