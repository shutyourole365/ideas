import axios, { AxiosInstance } from 'axios';

export interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export interface LinearIssue {
  id: string;
  title: string;
  status: string;
  priority: number;
  assignee: string;
  createdAt: string;
}

export interface LinearProject {
  id: string;
  name: string;
  key: string;
  status: string;
}

class LinearClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.linear.app/graphql',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTeams(): Promise<LinearTeam[]> {
    const query = `query { teams { nodes { id name key } } }`;
    const res = await this.client.post('', { query });
    return res.data.data?.teams?.nodes?.map((team: any) => ({
      id: team.id,
      name: team.name,
      key: team.key,
    })) || [];
  }

  async getIssues(): Promise<LinearIssue[]> {
    const query = `query {
      issues(first: 10) {
        nodes {
          id title status { name } priority assignee { name } createdAt
        }
      }
    }`;
    const res = await this.client.post('', { query });
    return res.data.data?.issues?.nodes?.map((issue: any) => ({
      id: issue.id,
      title: issue.title,
      status: issue.status?.name || 'unknown',
      priority: issue.priority,
      assignee: issue.assignee?.name || 'unassigned',
      createdAt: issue.createdAt,
    })) || [];
  }

  async getProjects(): Promise<LinearProject[]> {
    const query = `query { projects(first: 10) { nodes { id name key status } } }`;
    const res = await this.client.post('', { query });
    return res.data.data?.projects?.nodes?.map((project: any) => ({
      id: project.id,
      name: project.name,
      key: project.key,
      status: project.status,
    })) || [];
  }
}

export default LinearClient;
