import { config } from '@/globals/config';
import type { ApiResponseType } from '@/globals/constants';
import { getIkas } from '@/helpers/api-helpers';
import { getSession, setSession } from '@/lib/session';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type CheckForReauthorizeApiResponse = {
  required: boolean;
  authorizeData?: {
    redirectUri: string;
    scope: string;
    state: string;
  };
};

/**
 * Checks if the user needs to reauthorize based on the current session and token scope.
 * If reauthorization is required, returns the necessary data for the frontend to initiate the OAuth flow.
 */
export async function GET(request: NextRequest) {
  try {
    // Retrieve the current session
    const session = await getSession();

    // Check if the session has an authorizedAppId (i.e., user is authorized)
    if (session.authorizedAppId) {
      // Retrieve the stored auth token for this app
      const authToken = AuthTokenManager.get(session.authorizedAppId);

      if (authToken) {
        // Create an ikas client with the current token
        const ikas = getIkas(authToken);

        // Fetch the authorized app details to ensure the token is still valid
        const authorizedAppRes = await ikas.queries.getAuthorizedApp();

        // If the token is valid and the app exists
        if (
          authorizedAppRes.isSuccess &&
          authorizedAppRes.data &&
          authorizedAppRes.data.getAuthorizedApp
        ) {
          // Compare the current token's scope with the required scope
          const currentScope = authToken.scope || '';
          const requiredScope = config.oauth.scope;

          if (currentScope !== requiredScope) {
            // Scopes differ, reauthorization is required

            // Generate a new state for security
            const newState = Math.random().toFixed(16);

            // Update session with the new state
            session.state = newState;
            await setSession(session);

            // Prepare response data for the frontend to start OAuth flow
            const responseData: ApiResponseType<CheckForReauthorizeApiResponse> = {
              data: {
                required: true,
                authorizeData: {
                  state: newState,
                  scope: requiredScope,
                  redirectUri: config.oauth.redirectUri,
                },
              },
            };

            // Return the reauthorization data
            return NextResponse.json(responseData);
          }
        }
      }
    }

    // If no reauthorization is needed, return required: false
    const noReauthResponse: ApiResponseType<CheckForReauthorizeApiResponse> = {
      data: { required: false },
    };
    return NextResponse.json(noReauthResponse);
  } catch (err: any) {
    // Log and return error response
    console.error('Check for reauthorize error ->', err);
    return NextResponse.json({
        error: {
          statusCode: 500,
          message: err.message || 'Internal Server Error',
        },
      }, { status: 500 });
  }
}
