import axios, { AxiosInstance } from 'axios';

export interface RedisDatabase {
  id: string;
  name: string;
  status: string;
  size: string;
}

export interface RedisMetrics {
  memory_used: number;
  memory_peak: number;
  ops_per_sec: number;
}

class RedisClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.redis.com/v1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getDatabases(): Promise<RedisDatabase[]> {
    const res = await this.client.get('/databases');
    return res.data.databases?.slice(0, 10).map((db: any) => ({
      id: db.id,
      name: db.name,
      status: db.status,
      size: db.size,
    })) || [];
  }

  async getMetrics(dbId: string): Promise<RedisMetrics> {
    const res = await this.client.get(`/databases/${dbId}/metrics`);
    return {
      memory_used: res.data.memory_used,
      memory_peak: res.data.memory_peak,
      ops_per_sec: res.data.ops_per_sec,
    };
  }
}

export default RedisClient;
