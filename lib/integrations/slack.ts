import axios, { AxiosInstance } from 'axios';

export interface SlackTeam {
  id: string;
  name: string;
  domain: string;
}

export interface SlackChannel {
  id: string;
  name: string;
  is_private: boolean;
  members_count: number;
}

export interface SlackUser {
  id: string;
  name: string;
  real_name: string;
}

class SlackClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://slack.com/api',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTeam(): Promise<SlackTeam> {
    const res = await this.client.get('/team.info');
    if (!res.data.ok || !res.data.team) throw new Error('Failed to fetch team info');
    return {
      id: res.data.team.id,
      name: res.data.team.name,
      domain: res.data.team.domain,
    };
  }

  async getChannels(): Promise<SlackChannel[]> {
    const res = await this.client.get('/conversations.list', {
      params: { limit: 10 },
    });
    if (!res.data.ok || !res.data.channels) return [];
    return res.data.channels.slice(0, 10).map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      is_private: channel.is_private,
      members_count: channel.num_members,
    }));
  }

  async getUsers(): Promise<SlackUser[]> {
    const res = await this.client.get('/users.list');
    if (!res.data.ok || !res.data.members) return [];
    return res.data.members.slice(0, 10).map((user: any) => ({
      id: user.id,
      name: user.name,
      real_name: user.real_name,
    }));
  }
}

export default SlackClient;
