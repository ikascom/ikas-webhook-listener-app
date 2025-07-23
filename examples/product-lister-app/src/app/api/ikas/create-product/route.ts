import { CreateProductInput } from '@/lib/ikas-client/generated/graphql';
import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { AuthTokenManager } from '../../../../models/auth-token/manager';

// Type for the expected request body
export type CreateProductApiRequest = {
  productInput: CreateProductInput;
};

/**
 * Handles creating products for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Creates the product using the Ikas API client.
 * - Returns the created product data or an error response.
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
    const body = await request.json() as CreateProductApiRequest;
    if (!body || !body.productInput) {
      return NextResponse.json({ error: { statusCode: 400, message: 'Invalid request body' } }, { status: 400 });
    }

    const { productInput } = body;

    // Initialize Ikas API client with the auth token
    const ikasClient = getIkas(authToken);

    // Prepare input for creating the product
    const input = {
      name: productInput.name,
      description: productInput.description,
      type: productInput.type,
    };

    // Call the Ikas API to create the product
    const productResponse = await ikasClient.mutations.createProduct({ input });

    // Handle the response from Ikas API
    if (productResponse.isSuccess && productResponse.data) {
      return NextResponse.json({ data: { product: productResponse.data.createProduct } });
    } else {
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to create product' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error creating product:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to create product' } }, { status: 500 });
  }
} 