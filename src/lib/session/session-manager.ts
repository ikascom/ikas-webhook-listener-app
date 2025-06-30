import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/globals/config';

export interface SessionData {
  merchantId?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  state?: string;
  [key: string]: any;
}

// Dummy session storage - gelecekte Redis veya database ile değiştirilecek
class DummySessionStorage {
  private sessions: Map<string, SessionData> = new Map();

  async get(sessionId: string): Promise<SessionData | null> {
    return this.sessions.get(sessionId) || null;
  }

  async set(sessionId: string, data: SessionData): Promise<void> {
    this.sessions.set(sessionId, data);
  }

  async delete(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }
}

// Session manager class
export class SessionManager {
  private storage: DummySessionStorage;

  constructor() {
    this.storage = new DummySessionStorage();
  }

  private getSessionId(request: NextRequest): string | null {
    const cookie = request.cookies.get(config.SESSION_COOKIE_NAME);
    return cookie?.value || null;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getSession(request: NextRequest): Promise<SessionData | null> {
    const sessionId = this.getSessionId(request);
    if (!sessionId) return null;

    return this.storage.get(sessionId);
  }

  async setSession(request: NextRequest, data: SessionData): Promise<string> {
    const sessionId = this.getSessionId(request) || this.generateSessionId();
    await this.storage.set(sessionId, data);
    return sessionId;
  }

  async deleteSession(request: NextRequest): Promise<void> {
    const sessionId = this.getSessionId(request);
    if (sessionId) {
      await this.storage.delete(sessionId);
    }
  }

  // Response helper to set session cookie
  setSessionCookie(response: NextResponse, sessionId: string): NextResponse {
    response.cookies.set(config.SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  // Response helper to clear session cookie
  clearSessionCookie(response: NextResponse): NextResponse {
    response.cookies.delete(config.SESSION_COOKIE_NAME);
    return response;
  }
}

// Export singleton instance
export const sessionManager = new SessionManager(); 