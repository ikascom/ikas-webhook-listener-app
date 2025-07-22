import { config } from '@/globals/config';
import { getSession, setSession } from '@/lib/session';
import { callbackSchema, validateRequest } from '@/lib/validation';
import { OAuthAPI } from '@ikas/admin-api-client';
import moment from 'moment';
import { getIkas } from '../../../../../helpers/api-helpers';
import { JwtHelpers } from '../../../../../helpers/jwt-helpers';
import { AuthToken } from '../../../../../models/auth-token';
import { AuthTokenManager } from '../../../../../models/auth-token/manager';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles the OAuth callback for Ikas.
 * Exchanges the authorization code for tokens, validates state, updates session, and redirects.
 */
export async function GET(request: NextRequest) {
  try {
    // Parse the request URL to extract query parameters
    const url = new URL(request.url as string, `http://${request.headers.get('host')}`);
    const { searchParams } = url;

    // Validate the incoming request parameters (code, state)
    const validation = validateRequest(callbackSchema, {
      code: searchParams.get('code'),
      state: searchParams.get('state'),
    });

    if (!validation.success) {
      // Invalid parameters
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { code, state } = validation.data;

    // Retrieve session and check state for CSRF protection
    const session = await getSession();
    if (session.state !== state) {
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    // Exchange authorization code for access/refresh tokens
    const tokenResponse = await OAuthAPI.getTokenWithAuthorizationCode(
      {
        code: code as string,
        client_id: config.oauth.clientId!,
        client_secret: config.oauth.clientSecret!,
        redirect_uri: config.oauth.redirectUri,
      },
      {
        storeName: (session.storeName || 'api') as string,
      },
    );

    if (!tokenResponse.data) {
      // Failed to get token
      return NextResponse.json({ error: { statusCode: 500, message: 'Failed to retrieve token' } }, { status: 500 });
    }

    // Prepare a temporary token object
    const tokenTemp: Partial<AuthToken> = {
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      tokenType: tokenResponse.data.token_type,
      expiresIn: tokenResponse.data.expires_in,
      expireDate: '',
      scope: tokenResponse.data.scope,
      salesChannelId: null,
    };

    // Create an Ikas client with the new token
    const ikas = getIkas(tokenTemp as AuthToken);

    // Fetch merchant and authorized app details
    const [merchantResponse, authorizedAppResponse] = await Promise.all([
      ikas.queries.getMerchant(),
      ikas.queries.getAuthorizedApp(),
    ]);

    // Validate responses
    if (
      !merchantResponse.isSuccess ||
      !merchantResponse.data ||
      !authorizedAppResponse.isSuccess ||
      !authorizedAppResponse.data ||
      !authorizedAppResponse.data.getAuthorizedApp ||
      !merchantResponse.data.getMerchant
    ) {
      return NextResponse.json({
        error: { statusCode: 403, message: 'Unable to retrieve merchant or authorized app' },
      }, { status: 403 });
    }

    // Extract necessary IDs and calculate token expiration date
    const authorizedAppId = authorizedAppResponse.data.getAuthorizedApp.id!;
    const merchantId = merchantResponse.data.getMerchant.id!;
    const expireDate = moment()
      .add(tokenResponse.data.expires_in, 'seconds')
      .toDate()
      .toISOString();

    // Build the final AuthToken object
    const token: AuthToken = {
      ...tokenTemp,
      id: authorizedAppId,
      authorizedAppId,
      merchantId,
      expireDate,
      salesChannelId: authorizedAppResponse.data.getAuthorizedApp.salesChannelId || null,
    } as AuthToken;

    // Store the token for future use
    await AuthTokenManager.put(token);

    // Update session with new merchant and app IDs, clear state, and set expiration
    session.expiresAt = new Date(Date.now() + 3600 * 1000);
    session.merchantId = merchantId;
    session.authorizedAppId = authorizedAppId;
    delete session.state;

    // Save updated session
    await setSession(session);

    // Create a JWT for the merchant and authorized app
    const jwtToken = JwtHelpers.createToken(
      merchantResponse.data.getMerchant.storeName!,
      merchantId,
      authorizedAppId,
    );

    // Build the redirect URL for the admin panel
    const redirectUrl = `${config.adminUrl!.replace(
      '{storeName}',
      merchantResponse.data.getMerchant.storeName as string,
    )}/authorized-app/${authorizedAppId}`;

    // Build the callback URL with token and redirect info
    const callbackUrl = new URL('/callback', url.origin);
    callbackUrl.searchParams.set('token', jwtToken);
    callbackUrl.searchParams.set('redirectUrl', redirectUrl);
    callbackUrl.searchParams.set('authorizedAppId', authorizedAppId);

    // Redirect the user to the callback URL
    return NextResponse.redirect(callbackUrl.toString());
  } catch (error) {
    // Log and return error response
    console.error('Callback error:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Callback failed' } }, { status: 500 });
  }
}
