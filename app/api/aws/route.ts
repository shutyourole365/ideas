import { NextRequest, NextResponse } from 'next/server';
import AWSClient from '@/lib/integrations/aws';

export async function GET(request: NextRequest) {
  const accessKey = request.headers.get('x-aws-key');
  const secretKey = request.headers.get('x-aws-secret');
  if (!accessKey || !secretKey) return NextResponse.json({ error: 'Missing AWS credentials' }, { status: 401 });

  try {
    const aws = new AWSClient(accessKey, secretKey);
    const services = await aws.getServices();
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch AWS data' },
      { status: error.response?.status || 500 }
    );
  }
}
