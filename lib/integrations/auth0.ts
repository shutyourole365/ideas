import axios, { AxiosInstance } from 'axios';

export interface Auth0Tenant {
  name: string;
  domain: string;
  region: string;
}

export interface Auth0User {
  user_id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Auth0Application {
  client_id: string;
  name: string;
  app_type: string;
  created_at: string;
}

class Auth0Client {
  private client: AxiosInstance;

  constructor(token: string, domain: string) {
    // Validate domain format to prevent SSRF
    if (!/^[a-z0-9-]+\.auth0\.com$/.test(domain.toLowerCase())) {
      throw new Error('Invalid Auth0 domain format');
    }
    this.client = axios.create({
      baseURL: `https://${domain}/api/v2`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTenant(): Promise<Auth0Tenant> {
    const res = await this.client.get('/tenants/settings');
    return {
      name: res.data.friendly_name,
      domain: res.data.domain,
      region: res.data.region,
    };
  }

  async getUsers(limit: number = 10): Promise<Auth0User[]> {
    const res = await this.client.get('/users', {
      params: { per_page: limit },
    });
    return res.data.map((user: any) => ({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    }));
  }

  async getApplications(): Promise<Auth0Application[]> {
    const res = await this.client.get('/clients');
    return res.data.slice(0, 10).map((app: any) => ({
      client_id: app.client_id,
      name: app.name,
      app_type: app.app_type,
      created_at: app.created_at,
    }));
  }
}

export default Auth0Client;
