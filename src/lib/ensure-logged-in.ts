import { NextApiRequest, NextApiResponse } from 'next';
import { JwtHelpers } from '../helpers/jwt-helpers';

/**
 * This middleware extracts JWT header and verifies it with your app secret.
 * Then embeds verified token data to `req` object
 *
 * @param req NextApiRequest object
 * @param res NextApiResponse object
 * @param next next function to inform Next.js server to run next middleware or api handler
 */
export const ensureLoggedIn = async (req: NextApiRequest, res: NextApiResponse, next: () => any) => {
  const authHeader = req.headers['authorization'];
  let tokenData;
  let token;
  if (authHeader) {
    // Remove 'JWT ' prefix
    token = authHeader.replace('JWT ', '');

    // Verify extracted token string
    tokenData = JwtHelpers.verifyToken(token);

    if (tokenData) {
      // Embed the token data to req.user object
      req.user = {
        authorizedAppId: tokenData.aud as string,
        merchantId: tokenData.sub!,
      };
      return next();
    }
  }

  // if not verified or token does not exist return 401 error
  res.status(401).json({ statusCode: 401, message: `Unauthorized! authHeader: ${authHeader}, token: ${token}, tokenData: ${tokenData}` });
};
