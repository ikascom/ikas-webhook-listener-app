import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { ApiResponseType } from '@/globals/types';
import { AuthTokenManager } from '@/models/auth-token/manager';
import { getIkas } from '@/lib/ikas-client';

export type GetMerchantApiResponse = {
  merchantInfo?: any; // MerchantResponse type from @ikas/api-client
};

// Extend NextApiRequest to include user property
interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    authorizedAppId: string;
    merchantId: string;
  };
}

// Simple JWT verification for demo purposes
const ensureLoggedIn = async (req: AuthenticatedRequest, res: NextApiResponse, next: () => any) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: { statusCode: 401, message: 'Authorization header required' } });
  }

  // Extract token (remove 'JWT ' prefix)
  const token = authHeader.replace('JWT ', '');
  
  // For demo purposes, we'll use the token as authorizedAppId
  // In production, you should use proper JWT verification
  req.user = {
    authorizedAppId: token,
    merchantId: 'demo-merchant-id', // This would come from JWT payload
  };
  
  return next();
};

const GetMerchantInfoApi = () => async (req: AuthenticatedRequest, res: NextApiResponse<ApiResponseType<GetMerchantApiResponse>>) => {
  try {
    if (req.user) {
      const authToken = AuthTokenManager.get(req.user.authorizedAppId);
      
      if (authToken) {
        const ikas = getIkas(authToken);
        const merchantResponse = await ikas.adminApi.queries.getMerchant({});
        const merchantData = merchantResponse.isSuccess ? merchantResponse.data : undefined;
        
        res.status(200).send({ data: { merchantInfo: merchantData } });
      } else {
        res.status(404).json({ error: { statusCode: 404, message: 'Auth Token Not Found' } });
      }
    } else {
      res.status(404).json({ error: { statusCode: 500, message: 'User not found' } });
    }
  } catch (err: any) {
    console.error('Get merchant error:', err);
    res.status(500).json({ error: { statusCode: 500, message: err.message } });
  }
};

const router = createRouter<AuthenticatedRequest, NextApiResponse<ApiResponseType<GetMerchantApiResponse>>>();

router
  .use(ensureLoggedIn)
  .get(GetMerchantInfoApi());

export default router.handler();
