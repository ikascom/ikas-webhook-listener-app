import { MerchantResponse } from '@/lib/ikas-client/generated/graphql';
import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { AuthTokenManager } from '../../../../models/auth-token/manager';

export type GetMerchantApiResponse = {
  merchantInfo?: MerchantResponse;
};

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const authToken = AuthTokenManager.get(user.authorizedAppId);

    if (authToken) {
      const ikasClient = getIkas(authToken!);
      const merchantResponse = await ikasClient.queries.getMerchant();

      if (merchantResponse.isSuccess && merchantResponse.data && merchantResponse.data.getMerchant) {
        return NextResponse.json({ data: { merchantInfo: merchantResponse.data.getMerchant } });
      } else {
        return NextResponse.json({ error: { statusCode: 403, message: 'Merchant not found' } }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to fetch merchant' } }, { status: 500 });
  }
}
