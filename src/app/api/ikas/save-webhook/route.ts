import {MerchantResponse, Webhook, WebhookInput} from '@/lib/ikas-client/generated/graphql';
import { NextRequest, NextResponse } from 'next/server';
import { getIkas } from '../../../../helpers/api-helpers';
import { getUserFromRequest } from '../../../../lib/auth-helpers';
import { AuthTokenManager } from '../../../../models/auth-token/manager';

export type SaveWebhooksApiRequest = {
  webhookInput: WebhookInput;
};

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const authToken = AuthTokenManager.get(user.authorizedAppId);

    const body = await request.json() as SaveWebhooksApiRequest;
    const saveWebhookInput = body.webhookInput;
    
    if (authToken) {
      const ikasClient = getIkas(authToken!);
      const webhookResponse = await ikasClient.mutations.saveWebhooks({ 
        input: { 
          endpoint: saveWebhookInput.endpoint, 
          salesChannelIds: saveWebhookInput.salesChannelIds || [], 
          scopes: saveWebhookInput.scopes 
        } 
      });

      if (webhookResponse.isSuccess && webhookResponse.data) {
        return NextResponse.json({ data: { webhook: webhookResponse.data.saveWebhooks } });
      } else {
        return NextResponse.json({ error: { statusCode: 400, message: 'Failed to save webhook' } }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: { statusCode: 404, message: 'Auth token not found' } }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: { statusCode: 500, message: 'Failed to save webhook' } }, { status: 500 });
  }
}
