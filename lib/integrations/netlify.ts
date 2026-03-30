import axios, { AxiosInstance } from 'axios';

export interface NetlifySite {
  id: string;
  name: string;
  url: string;
  ssl_url: string;
  deploy_url: string;
  created_at: string;
  updated_at: string;
}

export interface NetlifyDeploy {
  id: string;
  site_id: string;
  url: string;
  state: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface NetlifyUser {
  id: string;
  email: string;
  full_name: string;
}

class NetlifyClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.netlify.com/api/v1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUser(): Promise<NetlifyUser> {
    const res = await this.client.get('/user');
    return {
      id: res.data.id,
      email: res.data.email,
      full_name: res.data.full_name,
    };
  }

  async getSites(limit: number = 10): Promise<NetlifySite[]> {
    const res = await this.client.get('/sites', {
      params: { per_page: limit },
    });
    return res.data.map((site: any) => ({
      id: site.id,
      name: site.name,
      url: site.url,
      ssl_url: site.ssl_url,
      deploy_url: site.deploy_url,
      created_at: site.created_at,
      updated_at: site.updated_at,
    }));
  }

  async getDeployments(siteId: string, limit: number = 5): Promise<NetlifyDeploy[]> {
    const res = await this.client.get(`/sites/${siteId}/deploys`, {
      params: { per_page: limit },
    });
    return res.data.map((deploy: any) => ({
      id: deploy.id,
      site_id: deploy.site_id,
      url: deploy.url,
      state: deploy.state,
      created_at: deploy.created_at,
      updated_at: deploy.updated_at,
      published_at: deploy.published_at,
    }));
  }
}

export default NetlifyClient;
