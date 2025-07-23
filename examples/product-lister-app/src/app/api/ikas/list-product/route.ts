import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { AuthTokenManager } from '../../../../models/auth-token/manager';
import { Product } from '@/lib/ikas-client/generated/graphql';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export type ListProductsApiResponse = {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
};

/**
 * Handles GET requests to list products for the authenticated user.
 * - Authenticates the user from the request.
 * - Retrieves the auth token for the user's authorized app.
 * - Fetches the list of products using the Ikas API client.
 * - Returns the list of products or an appropriate error response.
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

    // Parse query parameters for pagination
    const url = new URL(request.url);

    // Fetch the list of products from Ikas API
    const productResponse = await ikasClient.queries.listProduct();

    // Check if the API call was successful and data is present
    if (productResponse.isSuccess && productResponse.data?.listProduct) {
      // Return the list of products
      return NextResponse.json({
        data: {
          products: productResponse.data.listProduct.data,
          totalCount: productResponse.data.listProduct.data.length,
          hasMore: false,
        },
      });
    } else {
      // Failed to fetch products from Ikas API
      return NextResponse.json({ error: { statusCode: 400, message: 'Failed to list products' } }, { status: 400 });
    }
  } catch (error) {
    // Log the error for debugging
    console.error('Error listing products:', error);
    // Return a generic server error response
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to list products' } }, { status: 500 });
  }
}
