import axios, { AxiosInstance } from 'axios';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
  updated_at: string;
}

export interface GitHubDeployment {
  id: number;
  ref: string;
  status: string;
  environment: string;
  created_at: string;
  updated_at: string;
}

class GitHubClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
  }

  async getUser(): Promise<GitHubUser> {
    const res = await this.client.get('/user');
    return {
      login: res.data.login,
      name: res.data.name,
      avatar_url: res.data.avatar_url,
      public_repos: res.data.public_repos,
    };
  }

  async getRepos(limit: number = 10): Promise<GitHubRepo[]> {
    const res = await this.client.get('/user/repos', {
      params: { sort: 'updated', per_page: limit },
    });
    return res.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      updated_at: repo.updated_at,
    }));
  }

  async getDeployments(owner: string, repo: string): Promise<GitHubDeployment[]> {
    try {
      const res = await this.client.get(`/repos/${owner}/${repo}/deployments`);
      return res.data.slice(0, 5).map((dep: any) => ({
        id: dep.id,
        ref: dep.ref,
        status: dep.statuses_url ? 'active' : 'pending',
        environment: dep.environment,
        created_at: dep.created_at,
        updated_at: dep.updated_at,
      }));
    } catch {
      return [];
    }
  }
}

export default GitHubClient;
