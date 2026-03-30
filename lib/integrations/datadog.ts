import axios, { AxiosInstance } from 'axios';

export interface DatadogUser {
  id: string;
  name: string;
  email: string;
}

export interface DatadogMonitor {
  id: string;
  name: string;
  status: string;
  type: string;
}

export interface DatadogAlert {
  id: string;
  status: string;
  timestamp: number;
  message: string;
}

class DatadogClient {
  private client: AxiosInstance;

  constructor(token: string, apiKey: string, site: string = 'datadoghq.com') {
    this.client = axios.create({
      baseURL: `https://api.${site}/api/v1`,
      headers: {
        'DD-API-KEY': apiKey,
        'DD-APPLICATION-KEY': token,
      },
    });
  }

  async getUser(): Promise<DatadogUser> {
    const res = await this.client.get('/user');
    return {
      id: res.data.user.id,
      name: res.data.user.name,
      email: res.data.user.email,
    };
  }

  async getMonitors(limit: number = 10): Promise<DatadogMonitor[]> {
    const res = await this.client.get('/monitor', {
      params: { page_size: limit },
    });
    return res.data.slice(0, limit).map((monitor: any) => ({
      id: monitor.id,
      name: monitor.name,
      status: monitor.status || 'unknown',
      type: monitor.type,
    }));
  }

  async getEvents(): Promise<DatadogAlert[]> {
    const res = await this.client.get('/events', {
      params: { page_size: 10 },
    });
    return res.data.events?.slice(0, 5).map((event: any) => ({
      id: event.id,
      status: event.status,
      timestamp: event.date_happened,
      message: event.title,
    })) || [];
  }
}

export default DatadogClient;
