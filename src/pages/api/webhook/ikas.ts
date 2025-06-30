import { NextApiRequest, NextApiResponse } from 'next';
import { body, validationResult } from 'express-validator';
import nc from 'next-connect';
import { IkasWebhook, validateIkasWebhookMiddleware } from '@ikas/api-client';
import { ApiErrorData, initMiddleware, validateMiddleware } from '@ikas-apps/common';
import { WebhookManager, config, ensureDBConnect } from '@ikas-shipping-app/common';

export const logger = async (req: any, res: any, next: () => any) => {
  try {
    console.log('Received Request', req.body?.id, req.body?.scope);
  } catch {
    console.log('Received Request', req.body);
  }
  return next();
};

const validatePost = initMiddleware(
  validateMiddleware(
    [
      body('id').exists(),
      body('createdAt').exists(),
      body('scope').exists(),
      body('merchantId').exists(),
      body('signature').exists(),
      body('data').exists(),
      body('authorizedAppId').exists(),
    ],
    validationResult,
  ),
);

const handler = nc<NextApiRequest, NextApiResponse<ApiErrorData | string>>()
  .use(logger)
  .use(validateIkasWebhookMiddleware(config.oauth.clientSecret!))
  .use(ensureDBConnect)
  .post(async (req, res) => {
    try {
      console.log('Received webhook', req.body.id, req.body.scope);
      await validatePost(req, res);
      const data: IkasWebhook = req.body;

      const webhookId = await WebhookManager.handleIkasWebhook(data);

      res.status(200).send(webhookId);
    } catch (err: any) {
      console.error('webhook err', err);
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  });

export default handler;
