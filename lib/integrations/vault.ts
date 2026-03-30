import axios, { AxiosInstance } from 'axios';

export interface VaultSecret {
  path: string;
  keys: string[];
}

export interface VaultAuth {
  auth_method: string;
  ttl: number;
}

export interface VaultLease {
  id: string;
  expire_time: string;
}

class VaultClient {
  private client: AxiosInstance;

  constructor(token: string, vaultAddr: string = 'http://127.0.0.1:8200') {
    this.client = axios.create({
      baseURL: vaultAddr + '/v1',
      headers: {
        'X-Vault-Token': token,
      },
    });
  }

  async getAuth(): Promise<VaultAuth> {
    const res = await this.client.get('/auth/token/lookup-self');
    return {
      auth_method: res.data.data?.type || 'unknown',
      ttl: res.data.data?.ttl || 0,
    };
  }

  async listSecrets(path: string = 'secret'): Promise<VaultSecret[]> {
    try {
      const res = await this.client.request({
        method: 'LIST',
        url: `/${path}`,
      });
      return [{
        path,
        keys: res.data.data?.keys || [],
      }];
    } catch {
      return [];
    }
  }

  async getLeases(): Promise<VaultLease[]> {
    try {
      const res = await this.client.request({
        method: 'LIST',
        url: '/sys/leases/lookup',
      });
      return res.data.data?.keys?.slice(0, 5).map((lease: string) => ({
        id: lease,
        expire_time: new Date().toISOString(),
      })) || [];
    } catch {
      return [];
    }
  }
}

export default VaultClient;
