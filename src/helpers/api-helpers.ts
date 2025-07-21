import { OAuthAPI } from '@ikas/admin-api-client';
import moment from 'moment';
import { AuthToken } from '../models/auth-token';
import { AuthTokenManager } from '../models/auth-token/manager';
import { ikasAdminGraphQLAPIClient } from '../lib/ikas-client/generated/graphql';
import { config } from '../globals/config';

export function getIkas(token: AuthToken): ikasAdminGraphQLAPIClient<AuthToken> {
  const client = new ikasAdminGraphQLAPIClient<AuthToken>({
    graphApiUrl: config.graphApiUrl!,
    accessToken: token.accessToken,
    tokenData: token,
    onCheckToken: () => onCheckToken(token),
  });
  return client;
}

export async function onCheckToken(token?: AuthToken): Promise<{ accessToken: string | undefined; tokenData?: AuthToken }> {
  try {
    if (token) {
      const now = new Date();

      const expireDate = new Date(token.expireDate);

      if (now.getTime() >= expireDate.getTime()) {
        const response = await OAuthAPI.refreshToken(
          {
            refresh_token: token.refreshToken,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
            client_secret: process.env.CLIENT_SECRET!,
          },
          {
            storeName: 'api',
            storeDomain: '.myikas.com',
          },
        );
        if (response.data) {
          const expireDate = moment().add(response.data.expires_in, 'seconds').toDate().toISOString();

          token.accessToken = response.data.access_token;
          token.refreshToken = response.data.refresh_token;
          token.tokenType = response.data.token_type;
          token.expiresIn = response.data.expires_in;
          token.expireDate = expireDate;

          await AuthTokenManager.put(token);

          return { accessToken: token.accessToken, tokenData: token };
        }
      }
    }

    return { accessToken: undefined };
  } catch (e) {
    return { accessToken: undefined };
  }
}
