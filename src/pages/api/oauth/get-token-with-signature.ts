import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { config } from '@ikas-shipping-app/common';
import { GetTokenWithSignatureApi, GetTokenWithSignatureApiResponse } from '@ikas-apps/common-client';
import { ApiResponseType } from '@ikas-apps/common';

/**
 * This API is implemented for external apps but can also be used by iframe apps.
 * Since external apps do not have access to AppBridge they require a different mechanism to identify stores.
 * When the merchant clicks your app from the ikas dashboard it adds some query variables to your app URL, and you should validate these variables with your app secret.
 */
const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<GetTokenWithSignatureApiResponse>>>().post(
  GetTokenWithSignatureApi({ clientSecret: config.oauth.clientSecret! }),
);

export default handler;
