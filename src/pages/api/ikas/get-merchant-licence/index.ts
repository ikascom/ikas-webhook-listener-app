import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ensureLoggedIn } from '@ikas-apps/common-client';
import { ApiResponseType } from '@ikas-apps/common';
import { DB, ensureDBConnect } from '@ikas-shipping-app/common';
import { AuthTokenManager, getIkas } from '@ikas-apps/common-mongodb';
import { MerchantLicence } from '@ikas/api-client';

export type GetMerchantLicenceApiResponse = {
  merchantLicence?: MerchantLicence | null;
};

const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<GetMerchantLicenceApiResponse>>>()
  .use(ensureDBConnect)
  .use(ensureLoggedIn)
  .get(async (req, res) => {
    try {
      let resMerchantLicence: MerchantLicence | null = null;
      const authToken = await AuthTokenManager.get(DB, req.user!.authorizedAppId);
      if (authToken) {
        const ikas = getIkas(DB, authToken);
        const licenceRes: any = await ikas.adminApi.queries.getMerchantLicence({});
        if (licenceRes.isSuccess && licenceRes.data) {
          resMerchantLicence = licenceRes.data;
        }
        res.status(200).send({ data: { merchantLicence: resMerchantLicence } });
      } else {
        res.status(404).json({ error: { statusCode: 404, message: 'Auth Token Not Found' } });
      }
    } catch (err: any) {
      res.status(500).json({ error: { statusCode: 500, message: err.message } });
    }
  });

export default handler;
