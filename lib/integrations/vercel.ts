import axios, { AxiosInstance } from 'axios';

export interface VercelProject {
  id: string;
  name: string;
  link: {
    production?: string;
  };
  createdAt: number;
  updatedAt: number;
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  status: string;
  state: string;
  created: number;
  ready: number;
}

export interface VercelUser {
  uid: string;
  username: string;
  email: string;
}

class VercelClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.vercel.com',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUser(): Promise<VercelUser> {
    const res = await this.client.get('/v2/user');
    if (!res.data || !res.data.user) throw new Error('Failed to fetch user');
    return {
      uid: res.data.user.uid,
      username: res.data.user.username,
      email: res.data.user.email,
    };
  }

  async getProjects(limit: number = 10): Promise<VercelProject[]> {
    const res = await this.client.get('/v9/projects', {
      params: { limit },
    });
    if (!res.data || !res.data.projects) return [];
    return res.data.projects.map((project: any) => ({
      id: project.id,
      name: project.name,
      link: {
        production: project.link?.production,
      },
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }

  async getDeployments(projectId: string, limit: number = 5): Promise<VercelDeployment[]> {
    const res = await this.client.get('/v6/deployments', {
      params: { projectId, limit },
    });
    if (!res.data || !res.data.deployments) return [];
    return res.data.deployments.map((dep: any) => ({
      uid: dep.uid,
      name: dep.name,
      url: dep.url,
      status: dep.status,
      state: dep.state,
      created: dep.created,
      ready: dep.ready,
    }));
  }
}

export default VercelClient;
