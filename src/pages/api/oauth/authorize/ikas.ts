import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { AuthorizeApi, withConnectSession } from '@ikas-apps/common-client';
import { config } from '@ikas-shipping-app/common';

const handler = nc<NextApiRequest, NextApiResponse>().use(withConnectSession(config)).get(AuthorizeApi(config));

export default handler;
