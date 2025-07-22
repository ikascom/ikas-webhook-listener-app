import { OAuthAPI } from '@ikas/admin-api-client';
import moment from 'moment';
import { AuthToken } from '../models/auth-token';
import { AuthTokenManager } from '../models/auth-token/manager';
import { ikasAdminGraphQLAPIClient } from '../lib/ikas-client/generated/graphql';
import { config } from '../globals/config';

/**
 * Returns a new instance of the ikasAdminGraphQLAPIClient with the provided token.
 * @param token AuthToken object containing access and refresh tokens.
 */
export function getIkas(token: AuthToken): ikasAdminGraphQLAPIClient<AuthToken> {
  return new ikasAdminGraphQLAPIClient<AuthToken>({
    graphApiUrl: config.graphApiUrl!,
    accessToken: token.accessToken,
    tokenData: token,
    onCheckToken: () => onCheckToken(token),
  });
}

/**
 * Checks if the provided token is expired and refreshes it if necessary.
 * @param token AuthToken object to check and refresh.
 * @returns An object containing the (possibly refreshed) accessToken and tokenData.
 */
export async function onCheckToken(
  token?: AuthToken
): Promise<{ accessToken: string | undefined; tokenData?: AuthToken }> {
  try {
    if (!token) {
      // No token provided, return undefined.
      return { accessToken: undefined };
    }

    const now = new Date();
    const expireDate = new Date(token.expireDate);

    // If the token is expired, attempt to refresh it.
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
        }
      );

      if (response.data) {
        // Calculate new expiration date in ISO format.
        const newExpireDate = moment()
          .add(response.data.expires_in, 'seconds')
          .toDate()
          .toISOString();

        // Update token fields with refreshed data.
        token.accessToken = response.data.access_token;
        token.refreshToken = response.data.refresh_token;
        token.tokenType = response.data.token_type;
        token.expiresIn = response.data.expires_in;
        token.expireDate = newExpireDate;

        // Persist the updated token.
        await AuthTokenManager.put(token);

        return { accessToken: token.accessToken, tokenData: token };
      }
    }

    // Token is still valid or refresh failed, return undefined accessToken.
    return { accessToken: undefined };
  } catch (error) {
    // Log the error for debugging purposes (in English).
    console.error('Failed to check or refresh token:', error);
    return { accessToken: undefined };
  }
}
