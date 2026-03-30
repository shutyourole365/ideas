import axios, { AxiosInstance } from 'axios';

export interface SegmentWorkspace {
  id: string;
  name: string;
  slug: string;
}

export interface SegmentSource {
  id: string;
  name: string;
  slug: string;
  enabled: boolean;
}

export interface SegmentDestination {
  id: string;
  name: string;
  enabled: boolean;
}

class SegmentClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.segmentapis.com/v1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getWorkspaces(): Promise<SegmentWorkspace[]> {
    const res = await this.client.get('/workspaces');
    if (!res.data || !res.data.workspaces) return [];
    return res.data.workspaces.slice(0, 5).map((ws: any) => ({
      id: ws.id,
      name: ws.name,
      slug: ws.slug,
    }));
  }

  async getSources(workspaceId: string): Promise<SegmentSource[]> {
    const res = await this.client.get(`/workspaces/${workspaceId}/sources`);
    if (!res.data || !res.data.sources) return [];
    return res.data.sources.slice(0, 10).map((source: any) => ({
      id: source.id,
      name: source.name,
      slug: source.slug,
      enabled: source.enabled,
    }));
  }

  async getDestinations(workspaceId: string): Promise<SegmentDestination[]> {
    const res = await this.client.get(`/workspaces/${workspaceId}/destinations`);
    if (!res.data || !res.data.destinations) return [];
    return res.data.destinations.slice(0, 10).map((dest: any) => ({
      id: dest.id,
      name: dest.name,
      enabled: dest.enabled,
    }));
  }
}

export default SegmentClient;
