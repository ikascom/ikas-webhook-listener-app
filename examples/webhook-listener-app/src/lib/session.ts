// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { config } from '@/globals/config';
import { TOKEN_COOKIE } from '@/globals/constants';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

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

export async function getSession(): Promise<SessionData> {
  const session = await getIronSession(await cookies(), { password: config.cookiePassword || '', cookieName: TOKEN_COOKIE || '' });
  return session;
}

export async function setSession(data: SessionData) {
  const session = await getSession();
  Object.assign(session, data);
  await session.save(); 
}
