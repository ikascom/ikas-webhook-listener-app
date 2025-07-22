import { config } from '@/globals/config';
import { JwtHelpers } from '@/helpers/jwt-helpers';
import { GetTokenWithSignatureRequest, getTokenWithSignatureSchema, validateRequest } from '@/lib/validation';
import { validateAuthSignature } from '@ikas/admin-api-client';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type GetTokenWithSignatureApiRequest = GetTokenWithSignatureRequest;
export type GetTokenWithSignatureApiResponse = { token: string };

/**
 * Handles POST requests to get a token with a signature.
 * - Validates the request body against the expected schema.
 * - Validates the signature using the client secret.
 * - Creates a JWT token with the provided data.
 * - Returns the token or an appropriate error response.
 */
export async function POST(request: NextRequest) {
  try {
    // Validate shape and required fields
    const validation = validateRequest(getTokenWithSignatureSchema, await request.json());
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
