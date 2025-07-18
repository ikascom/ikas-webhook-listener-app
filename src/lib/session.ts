// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { getIronSession, sealData, unsealData } from 'iron-session';
import { config } from '@/globals/config';
import { TOKEN_COOKIE } from '@/globals/constants';

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
  password: config.cookiePassword || '',
  cookieName: TOKEN_COOKIE || '',
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
  const rawCookie = request.headers.get('cookie') || '';
  const cookiePrefix = `${sessionOptions.cookieName}=`;
  const sealed = rawCookie.split('; ').find((c) => c.startsWith(cookiePrefix))?.slice(cookiePrefix.length);
  if (!sealed) return {};

  try {
    const sessionData = await unsealData(sealed, {
      password: sessionOptions.password,
    });
    return sessionData || {};
  } catch (e) {
    console.error('Session decode error', { sealed, error: e });
    throw e;
  }
}

// For App Router response
export async function setSessionInResponse(response: Response, data: SessionData): Promise<Response> {
  const sealedData = await sealData(data, sessionOptions);
  response.headers.set('Set-Cookie', `${sessionOptions.cookieName}=${sealedData}; Path=/; HttpOnly; SameSite=Lax`);
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
