import { NextRequest, NextResponse } from 'next/server';
import SupabaseClient, { SupabaseProject } from '@/lib/integrations/supabase';

export async function GET(request: NextRequest) {
  const url = request.headers.get('x-supabase-url');
  const key = request.headers.get('x-supabase-key');

  if (!url || !key) {
    return NextResponse.json(
      { error: 'Missing Supabase URL or API Key' },
      { status: 401 }
    );
  }

  try {
    const supabase = new SupabaseClient(url, key);
    const orgs = await supabase.getOrganizations();

    // Get projects for first org if available
    let projects: SupabaseProject[] = [];
    if (orgs.length > 0) {
      projects = await supabase.getProjects(orgs[0].id);
    }

    return NextResponse.json({
      organizations: orgs,
      projects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch Supabase data' },
      { status: error.response?.status || 500 }
    );
  }
}
