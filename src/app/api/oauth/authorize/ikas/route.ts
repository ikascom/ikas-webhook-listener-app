import { NextRequest, NextResponse } from 'next/server';
import { OAuthAPI } from '@ikas/admin-api-client';
import { config } from '@/globals/config';
import { getSessionFromRequest, setSessionInResponse } from '@/lib/session';
import { authorizeSchema, validateRequest } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate request parameters
    const validation = validateRequest(authorizeSchema, {
      storeName: searchParams.get('storeName'),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 },
      );
    }

    const { storeName } = validation.data;

    // Generate state for security
    const state = Math.random().toFixed(16);

    console.log('request', request);
    // Get current session and update with state
    const session = await getSessionFromRequest(request);
    session.state = state;

    // OAuthAPI.getOAuthUrl generates a root url for your app by using given storeName
    const oauthUrl = OAuthAPI.getOAuthUrl({
      storeName,
      storeDomain: config.storeDomain!,
    });

    console.log('oauthUrl', oauthUrl);

    // Create authorize url for ikas store and redirect to it
    const authorizeUrl = `${oauthUrl}/authorize?client_id=${config.oauth.clientId}&redirect_uri=${config.oauth.redirectUri}&scope=${config.oauth.scope}&state=${state}`;

    // Create response with session FIRST, then redirect
    const response = NextResponse.redirect(authorizeUrl);
    await setSessionInResponse(response, session);

    return response;
  } catch (error) {
    console.error('Authorize error:', error);
    return NextResponse.json(
      { error: 'Authorization failed' },
      { status: 500 },
    );
  }
}
