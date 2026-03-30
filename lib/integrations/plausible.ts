import axios, { AxiosInstance } from 'axios';

export interface PlausibleSite {
  domain: string;
  createdAt: string;
  ownerEmail: string;
}

export interface PlausibleStats {
  date: string;
  pageviews: number;
  visitors: number;
  bounce_rate: number;
}

export interface PlausibleTopPage {
  page: string;
  visitors: number;
  pageviews: number;
}

class PlausibleClient {
  private client: AxiosInstance;

  constructor(token: string) {
    this.client = axios.create({
      baseURL: 'https://plausible.io/api/v1',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getSites(): Promise<PlausibleSite[]> {
    const res = await this.client.get('/sites');
    if (!Array.isArray(res.data)) return [];
    return res.data.slice(0, 10).map((site: any) => ({
      domain: site.domain,
      createdAt: site.createdAt,
      ownerEmail: site.ownerEmail,
    }));
  }

  async getStats(domain: string): Promise<PlausibleStats[]> {
    const res = await this.client.get(`/stats/timeseries`, {
      params: { site_id: domain, period: '7d' },
    });
    return res.data.results?.slice(0, 7).map((stat: any) => ({
      date: stat.date,
      pageviews: stat.pageviews,
      visitors: stat.visitors,
      bounce_rate: stat.bounce_rate,
    })) || [];
  }

  async getTopPages(domain: string): Promise<PlausibleTopPage[]> {
    const res = await this.client.get(`/stats/breakdown`, {
      params: { site_id: domain, property: 'event:page' },
    });
    return res.data.results?.slice(0, 5).map((page: any) => ({
      page: page.page,
      visitors: page.visitors,
      pageviews: page.pageviews,
    })) || [];
  }
}

export default PlausibleClient;
