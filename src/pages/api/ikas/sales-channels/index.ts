import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ApiResponseType } from '@ikas-apps/common';
import { ensureLoggedIn, GetSalesChannelApiResponse, SalesChannelsApi } from '@ikas-apps/common-client';
import { AuthTokenManager, getIkas } from '@ikas-apps/common-mongodb';
import { DB, ensureDBConnect } from '@ikas-shipping-app/common';

const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<GetSalesChannelApiResponse>>>()
  .use(ensureLoggedIn)
  .use(ensureDBConnect)
  .get(SalesChannelsApi({ AuthTokenManager, getIkas, DB }));

export default handler;
