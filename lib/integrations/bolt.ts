import axios, { AxiosInstance } from 'axios';

export interface BoltUser {
  id: string;
  email: string;
  name: string;
}

export interface BoltApp {
  id: string;
  name: string;
  url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BoltDeployment {
  id: string;
  app_id: string;
  status: string;
  version: string;
  deployed_at: string;
}

class BoltClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.bolt.com/v1',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getUser(): Promise<BoltUser> {
    const res = await this.client.get('/user');
    if (!res.data) throw new Error('Failed to fetch user');
    return {
      id: res.data.id,
      email: res.data.email,
      name: res.data.name,
    };
  }

  async getApps(limit: number = 10): Promise<BoltApp[]> {
    const res = await this.client.get('/apps', {
      params: { limit },
    });
    if (!res.data || !res.data.apps) return [];
    return res.data.apps.map((app: any) => ({
      id: app.id,
      name: app.name,
      url: app.url,
      status: app.status,
      created_at: app.created_at,
      updated_at: app.updated_at,
    }));
  }

  async getDeployments(appId: string, limit: number = 5): Promise<BoltDeployment[]> {
    const res = await this.client.get(`/apps/${appId}/deployments`, {
      params: { limit },
    });
    if (!res.data || !res.data.deployments) return [];
    return res.data.deployments.map((deploy: any) => ({
      id: deploy.id,
      app_id: deploy.app_id,
      status: deploy.status,
      version: deploy.version,
      deployed_at: deploy.deployed_at,
    }));
  }
}

export default BoltClient;
