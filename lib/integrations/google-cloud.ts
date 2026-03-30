import axios, { AxiosInstance } from 'axios';

export interface GCPProject {
  projectId: string;
  name: string;
  projectNumber: string;
  lifecycleState: string;
  createTime: string;
}

export interface GCPService {
  name: string;
  state: string;
  enabled_time?: string;
}

export interface GCPBilling {
  billingAccountName: string;
  displayName: string;
  open: boolean;
}

class GoogleCloudClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://cloudresourcemanager.googleapis.com/v1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getProjects(limit: number = 10): Promise<GCPProject[]> {
    const res = await this.client.get('/projects', {
      params: { pageSize: limit },
    });
    return (res.data.projects || []).map((project: any) => ({
      projectId: project.projectId,
      name: project.name,
      projectNumber: project.projectNumber,
      lifecycleState: project.lifecycleState,
      createTime: project.createTime,
    }));
  }

  async getEnabledServices(projectId: string): Promise<GCPService[]> {
    try {
      const res = await this.client.get(
        `https://serviceusage.googleapis.com/v1/projects/${projectId}/services`,
        {
          params: { filter: 'state:ENABLED', pageSize: 10 },
        }
      );
      return (res.data.services || []).map((service: any) => ({
        name: service.config?.name || service.name,
        state: service.state,
        enabled_time: service.enableTime,
      }));
    } catch {
      return [];
    }
  }
}

export default GoogleCloudClient;
