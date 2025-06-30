import { Session } from 'next-iron-session';
import { User } from '../models/user';

declare module 'http' {
  export interface IncomingMessage {
    session: Session;
    user?: User;
  }
}
