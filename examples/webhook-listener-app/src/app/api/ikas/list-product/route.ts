import { getIkas } from '@/helpers/api-helpers';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { NextRequest, NextResponse } from 'next/server';
import { ListProductQuery } from '@/lib/ikas-client/generated/graphql';

export type ListProductApiResponse = {
  items: Array<{
    id: string;
    name?: string;
    sku?: string;
    createdAt?: number;
    updatedAt?: number;
  }>;
  totalCount?: number;
};

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authToken = await AuthTokenManager.get(user.authorizedAppId);
    if (!authToken) {
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }

    const ikasClient = getIkas(authToken);

    const productsResponse = await ikasClient.queries.listProduct({ pagination: { limit: 20, page: 1 } });

    if (productsResponse.isSuccess && productsResponse.data) {
      const data = (productsResponse.data as Partial<ListProductQuery>).listProduct;
      const items = data?.data ?? [];
      const totalCount = data?.count ?? items.length;
      return NextResponse.json({ data: { items, totalCount } as ListProductApiResponse });
    }

    return NextResponse.json({ error: { statusCode: 400, message: 'Failed to list products' } }, { status: 400 });
  } catch (error) {
    console.error('Error listing products:', error);
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to list products' } }, { status: 500 });
  }
}


