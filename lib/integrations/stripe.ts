import axios, { AxiosInstance } from 'axios';

export interface StripeAccount {
  id: string;
  email: string;
  business_profile?: {
    name: string;
    url: string;
  };
}

export interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created: number;
  customer: string;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  created: number;
}

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  currency: string;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        unit_amount: number | null;
        currency: string;
      };
    }>;
  };
}

class StripeClient {
  private client: AxiosInstance;

  constructor(token: string) {
    const auth = Buffer.from(`${token}:`).toString('base64');
    this.client = axios.create({
      baseURL: 'https://api.stripe.com/v1',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
  }

  async getAccount(): Promise<StripeAccount> {
    const res = await this.client.get('/account');
    return {
      id: res.data.id,
      email: res.data.email,
      business_profile: res.data.business_profile,
    };
  }

  async getCharges(limit: number = 10): Promise<StripeCharge[]> {
    const res = await this.client.get('/charges', {
      params: { limit },
    });
    if (!res.data || !res.data.data) return [];
    return res.data.data.map((charge: any) => ({
      id: charge.id,
      amount: charge.amount,
      currency: charge.currency,
      status: charge.status,
      description: charge.description,
      created: charge.created,
      customer: charge.customer,
    }));
  }

  async getCustomers(limit: number = 10): Promise<StripeCustomer[]> {
    const res = await this.client.get('/customers', {
      params: { limit },
    });
    if (!res.data || !res.data.data) return [];
    return res.data.data.map((customer: any) => ({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      created: customer.created,
    }));
  }

  async getSubscriptions(limit: number = 10): Promise<StripeSubscription[]> {
    const res = await this.client.get('/subscriptions', {
      params: { limit },
    });
    if (!res.data || !res.data.data) return [];
    return res.data.data.map((sub: any) => ({
      id: sub.id,
      customer: sub.customer,
      status: sub.status,
      currency: sub.currency,
      current_period_end: sub.current_period_end,
      items: sub.items,
    }));
  }
}

export default StripeClient;
