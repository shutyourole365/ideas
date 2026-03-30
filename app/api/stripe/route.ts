import { NextRequest, NextResponse } from 'next/server';
import StripeClient from '@/lib/integrations/stripe';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-stripe-token');

  if (!token) {
    return NextResponse.json({ error: 'Missing Stripe token' }, { status: 401 });
  }

  try {
    const stripe = new StripeClient(token);
    const [account, charges, customers, subscriptions] = await Promise.all([
      stripe.getAccount(),
      stripe.getCharges(),
      stripe.getCustomers(),
      stripe.getSubscriptions(),
    ]);

    return NextResponse.json({
      account,
      charges,
      customers,
      subscriptions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.error?.message || 'Failed to fetch Stripe data' },
      { status: error.response?.status || 500 }
    );
  }
}
