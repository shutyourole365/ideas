import axios, { AxiosInstance } from 'axios';

export interface DODroplet {
  id: string;
  name: string;
  status: string;
  memory: number;
  vcpus: number;
  created_at: string;
}

export interface DOApp {
  id: string;
  name: string;
  status: string;
}

export interface DODatabase {
  id: string;
  name: string;
  engine: string;
  status: string;
}

class DigitalOceanClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.digitalocean.com/v2',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getDroplets(): Promise<DODroplet[]> {
    const res = await this.client.get('/droplets');
    return res.data.droplets.slice(0, 10).map((droplet: any) => ({
      id: droplet.id,
      name: droplet.name,
      status: droplet.status,
      memory: droplet.memory,
      vcpus: droplet.vcpus,
      created_at: droplet.created_at,
    }));
  }

  async getApps(): Promise<DOApp[]> {
    const res = await this.client.get('/apps');
    return res.data.apps.slice(0, 10).map((app: any) => ({
      id: app.id,
      name: app.spec.name,
      status: app.status || 'unknown',
    }));
  }

  async getDatabases(): Promise<DODatabase[]> {
    const res = await this.client.get('/databases');
    return res.data.databases.slice(0, 10).map((db: any) => ({
      id: db.id,
      name: db.name,
      engine: db.engine,
      status: db.status,
    }));
  }
}

export default DigitalOceanClient;
