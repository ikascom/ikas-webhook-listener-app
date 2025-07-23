import { AuthToken } from './index';
import fs from 'fs/promises';
import path from 'path';

// Load dummy tokens from local JSON file (for development/testing purposes)
const dummyTokens: AuthToken[] = require('./dummy-tokens.json');

/**
 * AuthTokenManager provides methods to manage AuthTokens.
 * This implementation uses a local JSON file for storage (for development only).
 */
export class AuthTokenManager {
  /**
   * Retrieve an AuthToken by its authorizedAppId.
   * @param authorizedAppId - The ID of the authorized app.
   * @returns The AuthToken if found, otherwise undefined.
   */
  static get(authorizedAppId: string): AuthToken | undefined {
    return dummyTokens.find((token: AuthToken) => token.authorizedAppId === authorizedAppId);
  }

  /**
   * Store a new AuthToken if it does not already exist.
   * @param token - The AuthToken to store.
   * @returns The stored AuthToken.
   */
  static async put(token: AuthToken): Promise<AuthToken> {
    let tokens: AuthToken[] = [];
    const tokensPath = path.join(process.cwd(), 'src', 'models', 'auth-token', 'dummy-tokens.json');

    try {
      // Read existing tokens from file
      const data = await fs.readFile(tokensPath, 'utf-8');
      tokens = JSON.parse(data);
    } catch (e) {
      // If file does not exist, start with an empty array
      tokens = [];
    }

    // Check if token already exists
    const existing = tokens.find(t => t.authorizedAppId === token.authorizedAppId);
    if (!existing) {
      tokens.push(token);
      // Write updated tokens array to file
      await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
    }
    return token;
  }

  /**
   * Mark an AuthToken as deleted by setting its 'deleted' property to true.
   * @param authorizedAppId - The ID of the authorized app.
   * @throws Error if the token is not found.
   */
  static async delete(authorizedAppId: string): Promise<void> {
    const tokensPath = path.resolve(__dirname, 'dummy-tokens.json');
    let tokens: AuthToken[] = [];
    try {
      // Read existing tokens from file
      const data = await fs.readFile(tokensPath, 'utf-8');
      tokens = JSON.parse(data);
    } catch (e) {
      // If file does not exist, throw error
      throw new Error('Token not found');
    }

    const tokenIndex = tokens.findIndex(t => t.authorizedAppId === authorizedAppId);
    if (tokenIndex !== -1) {
      tokens[tokenIndex].deleted = true;
      // Write updated tokens array to file
      await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
    } else {
      throw new Error('Token not found');
    }
  }

  /**
   * List all AuthTokens.
   * @returns Array of AuthTokens.
   */
  static list(): AuthToken[] {
    return dummyTokens;
  }
}
