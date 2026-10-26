import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const redirectTarget = searchParams.get('redirect') || '/events';
  const customClientId = searchParams.get('client_id');

  const clientId =
    customClientId ||
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const callbackUrl = `${appUrl}/api/auth/callback/google`;

  if (!clientId) {
    // If no client ID configured yet, return error query so login page can prompt
    return NextResponse.redirect(
      new URL(`/login?missing_client_id=1&redirect=${encodeURIComponent(redirectTarget)}`, req.url)
    );
  }

  // Construct real Google OAuth 2.0 authorization URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', callbackUrl);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');
  googleAuthUrl.searchParams.set('state', redirectTarget);

  return NextResponse.redirect(googleAuthUrl.toString());
}
