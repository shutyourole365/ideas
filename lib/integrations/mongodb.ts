import axios, { AxiosInstance } from 'axios';

export interface MongoDBOrg {
  id: string;
  name: string;
}

export interface MongoDBProject {
  id: string;
  name: string;
  orgId: string;
}

export interface MongoDBCluster {
  id: string;
  name: string;
  state: string;
  mongoVersion: string;
  created: string;
}

class MongoDBClient {
  private client: AxiosInstance;

  constructor(publicKey: string, privateKey: string) {
    this.client = axios.create({
      baseURL: 'https://cloud.mongodb.com/api/atlas/v2',
      auth: {
        username: publicKey,
        password: privateKey,
      },
    });
  }

  async getOrgs(): Promise<MongoDBOrg[]> {
    const res = await this.client.get('/orgs');
    if (!res.data || !res.data.results) return [];
    return res.data.results.slice(0, 10).map((org: any) => ({
      id: org.id,
      name: org.name,
    }));
  }

  async getProjects(orgId: string): Promise<MongoDBProject[]> {
    const res = await this.client.get(`/orgs/${orgId}/projects`);
    if (!res.data || !res.data.results) return [];
    return res.data.results.slice(0, 10).map((project: any) => ({
      id: project.id,
      name: project.name,
      orgId: project.orgId,
    }));
  }

  async getClusters(groupId: string): Promise<MongoDBCluster[]> {
    const res = await this.client.get(`/groups/${groupId}/clusters`);
    if (!res.data || !res.data.results) return [];
    return res.data.results.slice(0, 10).map((cluster: any) => ({
      id: cluster.id,
      name: cluster.name,
      state: cluster.state,
      mongoVersion: cluster.mongoVersion,
      created: cluster.created,
    }));
  }
}

export default MongoDBClient;
