import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { CallbackApi, withConnectSession } from '@ikas-apps/common-client';
import { config, DB, ensureDBConnect } from '@ikas-shipping-app/common';
import { AuthTokenManager, getIkas } from '@ikas-apps/common-mongodb';
import { WebhookScope } from '@ikas/api-client';

const handler = nc<NextApiRequest, NextApiResponse>()
  .use(withConnectSession(config))
  .use(ensureDBConnect)
  .get(
    CallbackApi({
      config: config,
      getIkas: getIkas,
      AuthTokenManager: AuthTokenManager,
      DB,
      webhookParameter: { scopes: [WebhookScope.ORDER_CREATED, WebhookScope.ORDER_UPDATED] },
    }),
  );

export default handler;
