import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/globals/config';
import { getSessionFromRequest, setSessionInResponse } from '@/lib/session';
import { authTokenManager } from '@/lib/auth/token-manager';

export async function GET(request: NextRequest) {
  try {
    // URL parametrelerini al
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    // Session'dan state'i kontrol et
    const session = await getSessionFromRequest(request);
    if (session.state !== state) {
      return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
    }

    // İkas OAuth callback işlemi
    // Gerçek implementasyonda CallbackApi fonksiyonu kullanılacak
    // Şimdilik dummy token oluşturuyoruz
    
    const dummyMerchantId = `merchant_${Date.now()}`;
    const dummyAccessToken = `access_token_${Date.now()}`;
    const dummyRefreshToken = `refresh_token_${Date.now()}`;
    
    // Token'ı database'e kaydet
    await authTokenManager.createToken({
      merchantId: dummyMerchantId,
      accessToken: dummyAccessToken,
      refreshToken: dummyRefreshToken,
      expiresIn: 3600, // 1 saat
    });

    // Session'ı güncelle
    session.merchantId = dummyMerchantId;
    session.accessToken = dummyAccessToken;
    session.refreshToken = dummyRefreshToken;
    session.expiresAt = new Date(Date.now() + 3600 * 1000);
    delete session.state; // State'i temizle
    
    // Response oluştur ve session'ı set et
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    await setSessionInResponse(response, session);

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
} 