import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Order } from '@ikas/api-client';
import { DB, ensureDBConnect } from '@ikas-shipping-app/common';
import { ensureLoggedIn } from '@ikas-apps/common-client';
import { ApiResponseType } from '@ikas-apps/common';
import { AuthTokenManager, getIkas } from '@ikas-apps/common-mongodb';

export type GetIkasOrdersApiRequest = {
  idList: string[];
};

export type GetIkasOrdersApiResponse = {
  orders?: Order[];
};

const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<GetIkasOrdersApiResponse>>>()
  .use(ensureLoggedIn)
  .use(ensureDBConnect)
  .post(async (req, res) => {
    try {
      const reqBody = req.body as GetIkasOrdersApiRequest;
      console.log('get-orders-idList', reqBody.idList);

      const authToken = await AuthTokenManager.get(DB, req.user!.authorizedAppId);
      let orders: Order[] | undefined = undefined;
      if (authToken) {
        const ikas = getIkas(DB, authToken);
        const response = await ikas.adminApi.queries.listOrder({
          variables: { pagination: { page: 1, limit: reqBody.idList.length }, id: { in: reqBody.idList } },
        });
        console.log('get-orders-response', { response });

        if (response.isSuccess && response.data && response.data.data && response.data.data.length) {
          orders = response.data.data;
        }

        res.status(200).send({ data: { orders: orders } });
      } else {
        res.status(404).json({ error: { statusCode: 404, message: 'Auth Token Not Found' } });
      }
    } catch (err: any) {
      res.status(500).json({ error: { statusCode: 500, message: err.message } });
    }
  });

export default handler;
