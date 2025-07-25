import { CreateStorefrontJSScriptInput, StorefrontJSScriptContentTypeEnum } from '@/lib/ikas-client/generated/graphql';
import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { AuthTokenManager } from '../../../../models/auth-token/manager';

// Type for the expected request body
export type CreateStorefrontJsScriptApiRequest = {
  scriptInput: CreateStorefrontJSScriptInput;
};

export type CreateStorefrontJsScriptApiResponse = {
  storefrontJSScript: {
    id: string;
    name: string;
    scriptContent: string;
    storefrontId: string;
    contentType: StorefrontJSScriptContentTypeEnum;
    createdAt: string;
    updatedAt: string;
  };
};

/**
 * Handles creating storefront js scripts for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Creates the storefront js script using the Ikas API client.
 * - Returns the created storefront js script data or an error response.
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

    // Parse the request body (NextApiRequest does not have .json(), so use body directly)
    // If using API routes (not app router), body is already parsed
    const body = (await request.json()) as CreateStorefrontJSScriptInput;
    if (!body) {
      return NextResponse.json({ error: { statusCode: 400, message: 'Invalid request body' } }, { status: 400 });
    }


    // Initialize Ikas API client with the auth token
    const ikasClient = getIkas(authToken);

    const script = `<script src="" async></script>`;
    // Prepare input for creating the storefront JS Script
    const input = { name: 'DENEME', scriptContent: script, storefrontId: body.storefrontId, contentType: StorefrontJSScriptContentTypeEnum.SCRIPT };

    // Call the Ikas API to create the storefront JS Script
    const createStorefrontJSScriptResponse = await ikasClient.mutations.createStorefrontJSScript({ input });

    // Handle the response from Ikas API
    if (createStorefrontJSScriptResponse.isSuccess && createStorefrontJSScriptResponse.data) {
      return NextResponse.json({ data: { storefrontJSScript: createStorefrontJSScriptResponse.data.createStorefrontJSScript } });
    } else {
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to create createStorefrontJSScriptResponse' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error creating storefront JS Script:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to create storefront JS Script' } }, { status: 500 });
  }
}
