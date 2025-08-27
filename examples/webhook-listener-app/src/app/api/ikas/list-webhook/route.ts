import { getIkas } from '@/helpers/api-helpers';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { Webhook } from '@/lib/ikas-client/generated/graphql';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type ListWebhookApiResponse = {
  webhooks: Webhook[];
};

/**
 * Handles GET requests to list webhooks for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Fetches the list of webhooks using the Ikas API client.
 * - Returns the list of webhooks or an appropriate error response.
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
    const authToken = await AuthTokenManager.get(user.authorizedAppId);
    if (!authToken) {
      // Auth token not found for the user
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }

    // Initialize Ikas API client with the auth token
    const ikasClient = getIkas(authToken);

    // Fetch the list of webhooks from Ikas API
    const webhookResponse = await ikasClient.queries.listWebhook();

    // Check if the API call was successful and data is present
    if (webhookResponse.isSuccess && webhookResponse.data) {
      // Return the list of webhooks
      return NextResponse.json({ data: { webhooks: webhookResponse.data.listWebhook } });
    } else {
      // Failed to fetch webhooks from Ikas API
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to list webhooks' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error listing webhooks:', error);
    // Return a generic server error response
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to list webhooks' } }, { status: 500 });
  }
}
