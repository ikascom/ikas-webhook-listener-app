// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { getIronSession, sealData, unsealData } from 'iron-session';
import { config } from '@/globals/config';

export interface SessionData {
  merchantId?: string;
  authorizedAppId?: string;
  state?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  [key: string]: any;
}

const sessionOptions = {
  password: config.SESSION_SECRET,
  cookieName: config.SESSION_COOKIE_NAME,
  cookieOptions: {
    httpOnly: true,
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 60 * 60 * 24 * 1000, // 1 day
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  },
};

// For API routes
export async function getSession(req: any, res: any): Promise<SessionData> {
  return await getIronSession(req, res, sessionOptions);
}

// For App Router
export async function getSessionFromRequest(request: Request): Promise<SessionData> {
  const cookie = request.headers.get('cookie') || '';
  const sessionData = await unsealData(cookie, sessionOptions);
  return sessionData || {};
}

// For App Router response
export async function setSessionInResponse(response: Response, data: SessionData): Promise<Response> {
  const sealedData = await sealData(data, sessionOptions);
  response.headers.set('Set-Cookie', `${config.SESSION_COOKIE_NAME}=${sealedData}; Path=/; HttpOnly; SameSite=Lax`);
  return response;
}

// Legacy wrapper for backward compatibility
export const withConnectSession = (config: any) => {
  return (handler: any) => async (req: any, res: any) => {
    req.session = await getSession(req, res);
    return handler(req, res);
  };
};

export function withSession(handler: any, config: any) {
  return withConnectSession(config)(handler);
}

export const fillSession = async (req: any, res: any, config: any) => {
  req.session = await getSession(req, res);
};
