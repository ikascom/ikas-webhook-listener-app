import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ApiResponseType } from '@ikas-apps/common';
import { ensureLoggedIn, ListStockLocationApi, ListStockLocationApiResponse } from '@ikas-apps/common-client';
import { AuthTokenManager, getIkas } from '@ikas-apps/common-mongodb';
import { DB, ensureDBConnect } from '@ikas-shipping-app/common';

const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<ListStockLocationApiResponse>>>()
  .use(ensureLoggedIn)
  .use(ensureDBConnect)
  .get(ListStockLocationApi({ AuthTokenManager, getIkas, DB }));

export default handler;
