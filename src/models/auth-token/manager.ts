import { AuthToken } from './index';
import fs from 'fs/promises';
import path from 'path';

const dummyTokens = require('./dummy-tokens.json');

export class AuthTokenManager {
  static get(authorizedAppId: string): AuthToken | undefined {
    return dummyTokens.find((o: any) => o.authorizedAppId === authorizedAppId);
  }

  static async put(token: AuthToken): Promise<AuthToken> {
    let tokens: AuthToken[] = [];
    const tokensPath = path.resolve(process.cwd(), 'src/models/auth-token/dummy-tokens.json');
    try {
      const data = await fs.readFile(tokensPath, 'utf-8');
      tokens = JSON.parse(data);
    } catch (e) {
      // If there is no file, start with an empty array
      tokens = [];
    }

    const existing = tokens.find(t => t.authorizedAppId === token.authorizedAppId);
    if (!existing) {
      tokens.push(token);
      await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
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
