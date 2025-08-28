import { WebhookInput } from '@/lib/ikas-client/generated/graphql';
import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '@/helpers/api-helpers';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { AuthTokenManager } from '@/models/auth-token/manager';

// Type for the expected request body
export type SaveWebhooksApiRequest = {
  webhookInput: WebhookInput;
};

/**
 * Handles saving webhooks for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Saves the webhook using the Ikas API client.
 * - Returns the saved webhook data or an error response.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user from the request
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Retrieve the auth token for the user's authorized app
    const authToken = await AuthTokenManager.get(user.authorizedAppId);
    if (!authToken) {
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }

    // Parse the request body (NextApiRequest does not have .json(), so use body directly)
    // If using API routes (not app router), body is already parsed
    const body = await request.json() as SaveWebhooksApiRequest;
    if (!body || !body.webhookInput) {
      return NextResponse.json({ error: { statusCode: 400, message: 'Invalid request body' } }, { status: 400 });
    }

    const { webhookInput } = body;

    // Initialize Ikas API client with the auth token
    const ikasClient = getIkas(authToken);

    // Prepare input for saving the webhook
    const input = {
      endpoint: webhookInput.endpoint,
      salesChannelIds: webhookInput.salesChannelIds || [],
      scopes: webhookInput.scopes,
    };

    // Call the Ikas API to save the webhook
    const webhookResponse = await ikasClient.mutations.saveWebhooks({ input });

    // Handle the response from Ikas API
    if (webhookResponse.isSuccess && webhookResponse.data) {
      return NextResponse.json({ data: { webhook: webhookResponse.data.saveWebhooks } });
    } else {
      console.error('Failed to save webhook:', webhookResponse.errors);
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to save webhook' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error saving webhook:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to save webhook' } }, { status: 500 });
  }
}
