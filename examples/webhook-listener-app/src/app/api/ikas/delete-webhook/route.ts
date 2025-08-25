import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '@/helpers/api-helpers';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { AuthTokenManager } from '@/models/auth-token/manager';

// Type for the expected request body
export type DeleteWebhookApiRequest = {
  scopes: string;
};

/**
 * Handles deleting webhooks for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Deletes the webhook using the Ikas API client.
 * - Returns the deletion result or an error response.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user from the request
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the auth token for the user's authorized app
    const authToken = AuthTokenManager.get(user.authorizedAppId);
    if (!authToken) {
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }

    // Parse the request body
    const body = await request.json() as DeleteWebhookApiRequest;
    if (!body || !body.scopes) {
      return NextResponse.json({ error: { statusCode: 400, message: 'Invalid request body - scopes required' } }, { status: 400 });
    }

    const { scopes } = body;

    // Initialize Ikas API client with the auth token
    const ikasClient = getIkas(authToken);

    // Call the Ikas API to delete the webhook
    const webhookResponse = await ikasClient.mutations.deleteWebhook({ scopes });

    // Handle the response from Ikas API
    if (webhookResponse.isSuccess && webhookResponse.data) {
      return NextResponse.json({ data: { success: webhookResponse.data.deleteWebhook } });
    } else {
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to delete webhook' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error deleting webhook:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to delete webhook' } }, { status: 500 });
  }
}
