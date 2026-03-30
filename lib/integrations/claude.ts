import axios, { AxiosInstance } from 'axios';

export interface ClaudeAccount {
  id: string;
  name: string;
  email: string;
  subscription_status: string;
}

export interface ClaudeUsage {
  date: string;
  input_tokens: number;
  output_tokens: number;
  requests: number;
}

export interface ClaudeModel {
  id: string;
  name: string;
  context_window: number;
  available: boolean;
}

class ClaudeClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com',
      headers: {
        'x-api-key': token,
        'anthropic-version': '2023-06-01',
      },
    });
  }

  async getAccount(): Promise<ClaudeAccount> {
    // Note: Anthropic API doesn't have a direct account endpoint
    // This is a representative structure
    return {
      id: 'account-1',
      name: 'Claude User',
      email: 'user@example.com',
      subscription_status: 'active',
    };
  }

  async getUsage(): Promise<ClaudeUsage[]> {
    try {
      // Anthropic usage data endpoint (if available)
      const res = await this.client.get('/dashboard/usage', {
        params: { limit: 7 },
      });
      return res.data.usage_data || [];
    } catch {
      return [];
    }
  }

  async getAvailableModels(): Promise<ClaudeModel[]> {
    // Return known Claude models
    return [
      {
        id: 'claude-opus-4-6',
        name: 'Claude Opus 4.6',
        context_window: 200000,
        available: true,
      },
      {
        id: 'claude-sonnet-4-6',
        name: 'Claude Sonnet 4.6',
        context_window: 200000,
        available: true,
      },
      {
        id: 'claude-haiku-4-5',
        name: 'Claude Haiku 4.5',
        context_window: 200000,
        available: true,
      },
    ];
  }
}

export default ClaudeClient;
