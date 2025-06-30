// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { ironSession, SessionOptions, withIronSession, applySession } from 'next-iron-session';
import { TOKEN_COOKIE } from '../globals/constants';

export const withConnectSession = (config: any) => {
  return ironSession(generateSessionOption(config));
};

export function withSession(handler: any, config: any) {
  return withIronSession(handler, generateSessionOption(config));
}

export const fillSession = async (req: any, res: any, config: any) => {
  await applySession(req, res, generateSessionOption(config));
};

const generateSessionOption = (config: any) => {
  const sessionOption: SessionOptions = {
    password: config.appKey + config.cookiePassword,
    cookieName: TOKEN_COOKIE,
    cookieOptions: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 24 * 1000,
      path: '/',
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production',
    },
  };
  return sessionOption;
};
