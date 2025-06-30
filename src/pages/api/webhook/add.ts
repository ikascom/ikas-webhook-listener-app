import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ensureDBConnect, ShippingAppSettings, ShippingAppSettingsManager } from '@ikas-shipping-app/common';
import { ApiResponseType } from '@ikas-apps/common';

const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<any>>>()
  .use(ensureDBConnect)
  .post(async (req, res) => {
    try {
      const basicAuth = req.headers['authorization'];
      console.log(`shipping app add webhook called`);
      if (basicAuth) {
        const auth = basicAuth.split(' ')[1];
        const [userName, password] = Buffer.from(auth, 'base64').toString().split(':');
        if (userName === 'dev-test-team' && password === '6Ig-Vi#7z1335Wl|') {
          const authorizedAppId = req.body.authorizedAppId;
          console.log(`${authorizedAppId} shipping app webhook added process`);
          const shippingAppSettings: ShippingAppSettings | null = await ShippingAppSettingsManager.get(authorizedAppId);
          if (shippingAppSettings) {
            if (!shippingAppSettings.watchWebhook) {
              shippingAppSettings.watchWebhook = true;
              await ShippingAppSettingsManager.put(shippingAppSettings);
              res.status(200).json({ data: { isSuccess: true } });
              return;
            } else {
              res.status(404).json({ error: { statusCode: 404, message: 'Shipping app settings webhook already added !' } });
              return;
            }
          } else {
            res.status(404).json({ error: { statusCode: 404, message: 'Shipping app settings not found!' } });
            return;
          }
        }
      } else {
        res.status(404).json({ error: { statusCode: 404, message: 'Basic auth not found!' } });
      }
    } catch (err: any) {
      console.log(`ikas-catch error: ${err.message}`);
      res.status(500).json({ error: { statusCode: 500, message: `ikas-catch error: ${err.message}` } });
    }
  });

export default handler;
