import { config } from '@/globals/config';
import type { ApiResponseType } from '@/globals/constants';
import { getIkas } from '@/helpers/api-helpers';
import { getSessionFromRequest, setSessionInResponse } from '@/lib/session';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { NextRequest, NextResponse } from 'next/server';

export type CheckForReauthorizeApiResponse = {
  required: boolean;
  authorizeData?: {
    redirectUri: string;
    scope: string;
    state: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    // Extract JWT from Authorization header

    const session = await getSessionFromRequest(request);

    if (session.authorizedAppId) {
      const authToken = AuthTokenManager.get(session.authorizedAppId);
      if (authToken) {
        const ikas = getIkas(authToken);
        const meRes = await ikas.queries.getAuthorizedApp();
        if (meRes.isSuccess && meRes.data && meRes.data.getAuthorizedApp) {
          const currentScope = authToken.scope || '';
          const requiredScope = config.oauth.scope;
          if (currentScope !== requiredScope) {
            // Need to reauthorize
            const state = Math.random().toFixed(16);
            // Update session with new state
            const session = await getSessionFromRequest(request);
            session.state = state;
            const response = NextResponse.json({
              data: {
                required: true,
                authorizeData: {
                  state,
                  scope: requiredScope,
                  redirectUri: config.oauth.redirectUri,
                },
              },
            } as ApiResponseType<CheckForReauthorizeApiResponse>);
            await setSessionInResponse(response, session);
            return response;
          }
        }
      }
    }

    // No reauthorization needed
    return NextResponse.json({ data: { required: false } } as ApiResponseType<CheckForReauthorizeApiResponse>);
  } catch (err: any) {
    console.error('Check for reauthorize error ->', err);
    return NextResponse.json({ error: { statusCode: 500, message: err.message || 'Internal Server Error' } }, { status: 500 });
  }
}
