import axios, { AxiosInstance } from 'axios';

export interface SentryOrg {
  id: string;
  name: string;
  slug: string;
}

export interface SentryProject {
  id: string;
  name: string;
  slug: string;
  platform: string;
  isBookmarked: boolean;
}

export interface SentryIssue {
  id: string;
  title: string;
  status: string;
  count: number;
  userCount: number;
  lastSeen: string;
}

class SentryClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://sentry.io/api/0',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getOrg(): Promise<SentryOrg> {
    const res = await this.client.get('/organizations');
    if (!res.data || res.data.length === 0) {
      throw new Error('No organizations found');
    }
    const org = res.data[0];
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
    };
  }

  async getProjects(orgSlug: string): Promise<SentryProject[]> {
    const res = await this.client.get(`/organizations/${orgSlug}/projects`);
    return res.data.slice(0, 10).map((project: any) => ({
      id: project.id,
      name: project.name,
      slug: project.slug,
      platform: project.platform || 'unknown',
      isBookmarked: project.isBookmarked,
    }));
  }

  async getIssues(orgSlug: string, projectSlug: string): Promise<SentryIssue[]> {
    const res = await this.client.get(
      `/projects/${orgSlug}/${projectSlug}/issues`
    );
    return res.data.slice(0, 5).map((issue: any) => ({
      id: issue.id,
      title: issue.title,
      status: issue.status,
      count: issue.count,
      userCount: issue.userCount,
      lastSeen: issue.lastSeen,
    }));
  }
}

export default SentryClient;
