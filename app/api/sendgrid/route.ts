import { NextRequest, NextResponse } from 'next/server';
import SendGridClient from '@/lib/integrations/sendgrid';

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-sendgrid-token');
  if (!token) return NextResponse.json({ error: 'Missing SendGrid token' }, { status: 401 });

  try {
    const sendgrid = new SendGridClient(token);
    const [account, senders] = await Promise.all([sendgrid.getAccount(), sendgrid.getSenders()]);
    return NextResponse.json({ account, senders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch SendGrid data' },
      { status: error.response?.status || 500 }
    );
  }
}
