import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { AuthTokenManager } from '../../../../models/auth-token/manager';
import { Webhook } from '@/lib/ikas-client/generated/graphql';

export type ListWebhookApiResponse = {
  webhooks: Webhook[];
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
      const webhookResponse = await ikasClient.queries.listWebhook();

      if (webhookResponse.isSuccess && webhookResponse.data) {
        return NextResponse.json({ data: { webhooks: webhookResponse.data.listWebhook } });
      } else {
        return NextResponse.json({ error: { statusCode: 400, message: 'Failed to list webhooks' } }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to list webhooks' } }, { status: 500 });
  }
}
