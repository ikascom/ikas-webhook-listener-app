import { NextRequest, NextResponse } from 'next/server';
import { OAuthAPI } from '@ikas/admin-api-client';
import { config } from '@/globals/config';
import { getSessionFromRequest, setSessionInResponse } from '@/lib/session';
import { z } from 'zod';

const querySchema = z.object({
  storeName: z.string().min(1, 'storeName is required'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeName = searchParams.get('storeName');

    const result = querySchema.safeParse({
      storeName: searchParams.get('storeName'),
    });

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error.message 
      }, { status: 400 });
    }

    // Generate state for security
    const state = Math.random().toFixed(16);
    
    // Get current session and update with state
    const session = await getSessionFromRequest(request);
    session.state = state;
    
    // OAuthAPI.getOAuthUrl generates a root url for your app by using given storeName
    const oauthUrl = OAuthAPI.getOAuthUrl({ 
      storeName: storeName!, 
      storeDomain: config.IKAS_API_URL 
    });

    // Create authorize url for ikas store and redirect to it
    const authorizeUrl = `${oauthUrl}/authorize?client_id=${config.IKAS_CLIENT_ID}&redirect_uri=${config.IKAS_REDIRECT_URI}&scope=read_orders write_orders&state=${state}`;

    // Create response with session
    const response = NextResponse.redirect(authorizeUrl);
    await setSessionInResponse(response, session);

    return response;
  } catch (error) {
    console.error('Authorize error:', error);
    return NextResponse.json({ 
      error: 'Authorization failed' 
    }, { status: 500 });
  }
} 