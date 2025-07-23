import { UpdateProductInput } from '@/lib/ikas-client/generated/graphql';
import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { AuthTokenManager } from '../../../../models/auth-token/manager';

// Type for the expected request body
export type UpdateProductApiRequest = {
  productInput: UpdateProductInput;
};

/**
 * Handles updating products for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Updates the product using the Ikas API client.
 * - Returns the updated product data or an error response.
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
    const body = (await request.json()) as UpdateProductApiRequest;
    if (!body || !body.productInput) {
      return NextResponse.json({ error: { statusCode: 400, message: 'Invalid request body' } }, { status: 400 });
    }

    const { productInput } = body;

    // Validate that product ID is provided for update
    if (!productInput.id) {
      return NextResponse.json({ error: { statusCode: 400, message: 'Product ID is required for update' } }, { status: 400 });
    }

    // Initialize Ikas API client with the auth token
    const ikasClient = getIkas(authToken);

    // Prepare input for updating the product
    const input = {
      id: productInput.id,
      name: productInput.name,
      description: productInput.description,
    };

    // Call the Ikas API to update the product
    const productResponse = await ikasClient.mutations.updateProduct({ input });

    // Handle the response from Ikas API
    if (productResponse.isSuccess && productResponse.data) {
      return NextResponse.json({ data: { product: productResponse.data.updateProduct } });
    } else {
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to update product' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error updating product:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to update product' } }, { status: 500 });
  }
}
