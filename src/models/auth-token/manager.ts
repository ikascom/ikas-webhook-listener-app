import { AuthToken } from './index';
import { dummyTokens } from './dummy-tokens';

export class AuthTokenManager {
  static get(authorizedAppId: string): AuthToken | undefined {
    return dummyTokens.find((o) => o.authorizedAppId === authorizedAppId);
  }

  static put(token: AuthToken): AuthToken {
    const existingToken = this.get(token.authorizedAppId);
    if (existingToken) {
      return existingToken;
    } else {
      dummyTokens.push(token);
    }
    return token;
  }

  static async delete(authorizedAppId: string) {
    const existingToken = this.get(authorizedAppId);
    if (existingToken) {
      existingToken.deleted = true;
    } else {
      throw new Error('Token not found');
    }
  }

  static list(): AuthToken[] {
    return dummyTokens;
  }
}
