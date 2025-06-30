import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { authTokenManager } from '@/lib/auth/token-manager';
import { AuthCheckResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);
    
    if (!session || !session.merchantId) {
      return NextResponse.json<AuthCheckResponse>({
        success: false,
        message: 'Not authenticated',
        data: {
          isAuthenticated: false,
        },
      });
    }

    // Check if token is still valid
    const token = await authTokenManager.getTokenByMerchantId(session.merchantId);
    
    if (!token) {
      return NextResponse.json<AuthCheckResponse>({
        success: false,
        message: 'Token expired or invalid',
        data: {
          isAuthenticated: false,
        },
      });
    }

    return NextResponse.json<AuthCheckResponse>({
      success: true,
      data: {
        isAuthenticated: true,
        merchantId: session.merchantId,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json<AuthCheckResponse>({
      success: false,
      error: 'Internal server error',
      data: {
        isAuthenticated: false,
      },
    }, { status: 500 });
  }
} 