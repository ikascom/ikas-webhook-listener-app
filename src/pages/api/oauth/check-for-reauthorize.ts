import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { ApiResponseType } from '@/globals/types';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { config } from '@/globals/config';
import { ensureLoggedIn } from '../../../lib/ensure-logged-in';
import { withConnectSession } from '../../../lib/session';

export type CheckForReauthorizeApiResponse = {
  required: boolean;
  authorizeData?: {
    redirectUri: string;
    scope: string;
    state: string;
  };
};

/**
 * This API checks if scope is different from scope granted by merchant
 */
const CheckForReauthorizeApi = () => async (req: NextApiRequest, res: NextApiResponse<ApiResponseType<CheckForReauthorizeApiResponse>>) => {
  try {
    console.log('Starting check for reauthorize...');
    if (req.user) {
      const authToken = AuthTokenManager.get(req.user.authorizedAppId);
      
      console.log('Token found:', !!authToken);
      if (authToken) {
        // Get app info from ikas
        const ikas = getIkas(authToken);
        
        const meRes = await ikas.adminApi.queries.me({});
        console.log('Is Success:', meRes.isSuccess);
        if (meRes.isSuccess && meRes.data) {
          // Compare scopes
          console.log(`meRes.data.scope= ${meRes.data.scope}, config.oauth.scope= ${config.oauth.scope}`);
          if (meRes.data.scope != config.oauth.scope) {
            const state = Math.random().toFixed(16);
            // In a real app, you would save this to session
            console.log('check for reauthorized --> state generated:', state);
            
            // Return saved state and scope to client side
            res.status(200).json({
              data: {
                required: true,
                authorizeData: {
                  state,
                  scope: config.oauth.scope,
                  redirectUri: config.oauth.redirectUri,
                },
              },
            });
            return;
          }
        }
      }
      res.status(200).json({
        data: {
          required: false,
        },
      });
    } else {
      res.status(404).json({ error: { statusCode: 500, message: 'User not found' } });
    }
  } catch (err: any) {
    console.error('Check for reauthorize error:', err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};

/**
 * This API checks if scope is different from scope granted by merchant
 */
const handler = nc<NextApiRequest, NextApiResponse<ApiResponseType<CheckForReauthorizeApiResponse>>>()
  .use(withConnectSession(config))
  .use(ensureLoggedIn)
  .get(CheckForReauthorizeApi());

export default handler;
