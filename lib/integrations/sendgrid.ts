import axios, { AxiosInstance } from 'axios';

export interface SendGridAccount {
  type: string;
  reputation: number;
}

export interface SendGridStats {
  date: string;
  stats: {
    delivered: number;
    bounces: number;
    opens: number;
    clicks: number;
  };
}

export interface SendGridSender {
  id: number;
  from: {
    email: string;
    name: string;
  };
  verified: boolean;
}

class SendGridClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.sendgrid.com/v3',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAccount(): Promise<SendGridAccount> {
    const res = await this.client.get('/user/account');
    return {
      type: res.data.type,
      reputation: res.data.reputation,
    };
  }

  async getStats(days: number = 7): Promise<SendGridStats[]> {
    const res = await this.client.get('/stats', {
      params: { limit: days, start_date: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    });
    return res.data.map((stat: any) => ({
      date: stat.date,
      stats: stat.stats[0],
    }));
  }

  async getSenders(): Promise<SendGridSender[]> {
    const res = await this.client.get('/senders');
    return res.data.slice(0, 10).map((sender: any) => ({
      id: sender.id,
      from: sender.from,
      verified: sender.verified,
    }));
  }
}

export default SendGridClient;
