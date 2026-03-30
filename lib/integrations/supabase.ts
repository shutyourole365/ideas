import axios, { AxiosInstance } from 'axios';

export interface SupabaseProject {
  id: string;
  name: string;
  organization_id: string;
  status: string;
  database: {
    host: string;
    version: string;
  };
  inserted_at: string;
}

export interface SupabaseOrganization {
  id: string;
  name: string;
  slug: string;
}

export interface SupabaseDatabase {
  name: string;
  version: string;
  max_db_size?: string;
}

class SupabaseClient {
  private client: AxiosInstance;
  private projectRef: string;
  private projectApiKey: string;

  constructor(projectUrl: string, apiKey: string) {
    // Extract project ref from URL (e.g., https://[ref].supabase.co)
    this.projectRef = projectUrl.split('.')[0].split('//')[1] || '';
    this.projectApiKey = apiKey;

    this.client = axios.create({
      baseURL: `https://api.supabase.com/v1`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async getOrganizations(): Promise<SupabaseOrganization[]> {
    const res = await this.client.get('/organizations');
    return res.data.map((org: any) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
    }));
  }

  async getProjects(orgId: string): Promise<SupabaseProject[]> {
    const res = await this.client.get(`/organizations/${orgId}/projects`);
    return res.data.map((project: any) => ({
      id: project.id,
      name: project.name,
      organization_id: project.organization_id,
      status: project.status,
      database: {
        host: project.database?.host || '',
        version: project.database?.version || '',
      },
      inserted_at: project.inserted_at,
    }));
  }

  async getDatabaseInfo(projectRef: string): Promise<SupabaseDatabase | null> {
    const res = await this.client.get(`/projects/${projectRef}/database`);
    return {
      name: res.data.name,
      version: res.data.version,
      max_db_size: res.data.max_db_size,
    };
  }
}

export default SupabaseClient;
