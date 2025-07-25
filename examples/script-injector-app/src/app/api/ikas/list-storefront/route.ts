import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { Storefront } from '../../../../lib/ikas-client/generated/graphql';
import { AuthTokenManager } from '../../../../models/auth-token/manager';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type ListStorefrontApiResponse = {
  storefronts: Storefront[];
};

/**
 * Handles GET requests to list storefronts for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Fetches the list of storefronts using the Ikas API client.
 * - Returns the list of storefronts or an appropriate error response.
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user from the request
    const user = getUserFromRequest(request);
    if (!user) {
      // User is not authenticated
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the auth token for the user's authorized app
    const authToken = AuthTokenManager.get(user.authorizedAppId);
    if (!authToken) {
      // Auth token not found for the user
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }

    // Initialize Ikas API client with the auth token
    const ikasClient = getIkas(authToken);

    // Fetch the list of storefronts from Ikas API
    const storefrontResponse = await ikasClient.queries.listStorefront();

    // Check if the API call was successful and data is present
    if (storefrontResponse.isSuccess && storefrontResponse.data) {
      // Return the list of storefronts
      return NextResponse.json({ data: { storefronts: storefrontResponse.data.listStorefront } });
    } else {
      // Failed to fetch storefronts from Ikas API
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to list storefronts' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error listing storefronts:', error);
    // Return a generic server error response
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to list storefronts' } }, { status: 500 });
  }
}
