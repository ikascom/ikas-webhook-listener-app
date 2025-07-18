import { config } from '@/globals/config';
import { getSessionFromRequest, setSessionInResponse } from '@/lib/session';
import { callbackSchema, validateRequest } from '@/lib/validation';
import { OAuthAPI } from '@ikas/admin-api-client';
import moment from 'moment';
import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '../../../../../helpers/api-helpers';
import { JwtHelpers } from '../../../../../helpers/jwt-helpers';
import { AuthToken } from '../../../../../models/auth-token';
import { AuthTokenManager } from '../../../../../models/auth-token/manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate request parameters
    const validation = validateRequest(callbackSchema, {
      code: searchParams.get('code'),
      state: searchParams.get('state'),
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { code, state } = validation.data;

    // Session'dan state'i kontrol et
    const session = await getSessionFromRequest(request);
    if (session.state !== state) {
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    const responseAuthorizationCode = await OAuthAPI.getTokenWithAuthorizationCode(
      {
        code: code as string,
        client_id: config.oauth.clientId!,
        client_secret: config.oauth.clientSecret!,
        redirect_uri: config.oauth.redirectUri,
      },
      {
        storeName: (session.storeName || 'api') as string,
        storeDomain: config.storeDomain as string,
      },
    );

    if (responseAuthorizationCode.data) {
      let tokenTemp = {
        accessToken: responseAuthorizationCode.data!.access_token,
        refreshToken: responseAuthorizationCode.data!.refresh_token,
        tokenType: responseAuthorizationCode.data!.token_type,
        expiresIn: responseAuthorizationCode.data!.expires_in,
        expireDate: '',
        scope: responseAuthorizationCode.data!.scope,
        salesChannelId: null,
      };

      const ikas = getIkas(tokenTemp as AuthToken);
      const merchantResponse = await ikas.queries.getMerchant();

      const getAuthorizedAppResponse = await ikas.queries.getAuthorizedApp();
      let token: AuthToken;
      if (merchantResponse.isSuccess && merchantResponse.data && getAuthorizedAppResponse.isSuccess && getAuthorizedAppResponse.data) {
        const expireDate = moment().add(responseAuthorizationCode.data!.expires_in, 'seconds').toDate().toISOString();
        const authorizedAppId = getAuthorizedAppResponse.data.getAuthorizedApp?.id!;
        const merchantId = merchantResponse.data.getMerchant?.id!;

        token = {
          ...tokenTemp,
          id: authorizedAppId,
          _id: authorizedAppId,
          authorizedAppId: authorizedAppId,
          merchantId: merchantId,
          expireDate: expireDate,
          salesChannelId: getAuthorizedAppResponse.data?.getAuthorizedApp?.salesChannelId || null,
        };
        await AuthTokenManager.put(token);

        // update session
        session.expiresAt = new Date(Date.now() + 3600 * 1000);
        session.merchantId = merchantId;
        session.authorizedAppId = authorizedAppId;
        delete session.state; // clear state

        // create response and set session
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        await setSessionInResponse(response, session);

        const jwtToken = JwtHelpers.createToken(
          merchantResponse.data.getMerchant?.storeName!,
          merchantResponse.data.getMerchant?.id!,
          authorizedAppId,
        );
        const redirectUrl = `${config.adminUrl!.replace(
          '{storeName}',
          merchantResponse.data.getMerchant?.storeName as string,
        )}/authorized-app/${authorizedAppId}`;

        // Create response with session FIRST, then redirect
        const callbackUrl = new URL('/callback', request.url); // request.url burada base olarak kullanılır
        callbackUrl.searchParams.set('token', jwtToken);
        callbackUrl.searchParams.set('redirectUrl', redirectUrl);
        callbackUrl.searchParams.set('authorizedAppId', authorizedAppId);

        // Create response with session FIRST, then redirect
        const responseCallbackUrl = NextResponse.redirect(callbackUrl);

        await setSessionInResponse(responseCallbackUrl, session);

        return responseCallbackUrl;
      } else {
        return NextResponse.json({ error: { statusCode: 403, message: 'unable to retrieve merchant' } }, { status: 403 });
      }
    }
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Callback failed' } }, { status: 500 });
  }
}
