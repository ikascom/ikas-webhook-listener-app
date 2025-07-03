import { config } from '@/globals/config';
import { JwtHelpers } from '@/helpers/jwt-helpers';
import { getTokenWithSignatureSchema, validateRequest } from '@/lib/validation';
import { validateAuthSignature } from '@ikas/admin-api-client';
import { NextRequest, NextResponse } from 'next/server';

export type GetTokenWithSignatureApiRequest = {
  authorizedAppId: string;
  merchantId: string;
  signature: string;
  storeName: string;
  timestamp: string;
};

export type GetTokenWithSignatureApiResponse = { token: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate shape and required fields
    const validation = validateRequest(getTokenWithSignatureSchema, body);
    if (!validation.success) {
      return NextResponse.json({ error: { statusCode: 400, message: validation.error } }, { status: 400 });
    }
    const data = validation.data;
    // Validate signature
    const isValid = validateAuthSignature(data, config.oauth.clientSecret!);
    if (!isValid) {
      return NextResponse.json({ error: { statusCode: 401, message: 'Invalid signature' } }, { status: 401 });
    }
    return NextResponse.json({ data: { token: JwtHelpers.createToken(data.storeName, data.merchantId, data.authorizedAppId) } });
  } catch (err: any) {
    return NextResponse.json({ error: { statusCode: 500, message: err.message || 'Internal Server Error' } }, { status: 500 });
  }
}
