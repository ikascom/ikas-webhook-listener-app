import { getIkas } from '@/helpers/api-helpers';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { SalesChannel } from '@/lib/ikas-client/generated/graphql';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type ListSalesChannelApiResponse = {
  salesChannels: SalesChannel[];
};

/**
 * Handles GET requests to list salesChannels for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Fetches the list of salesChannels using the Ikas API client.
 * - Returns the list of salesChannels or an appropriate error response.
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

    // Fetch the list of salesChannels from Ikas API
    const salesChannelResponse = await ikasClient.queries.listSalesChannel();

    // Check if the API call was successful and data is present
    if (salesChannelResponse.isSuccess && salesChannelResponse.data) {
      // Return the list of salesChannels
      return NextResponse.json({ data: { salesChannels: salesChannelResponse.data.listSalesChannel } });
    } else {
      // Failed to fetch salesChannels from Ikas API
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to list salesChannels' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error listing salesChannels:', error);
    // Return a generic server error response
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to list salesChannels' } }, { status: 500 });
  }
}
