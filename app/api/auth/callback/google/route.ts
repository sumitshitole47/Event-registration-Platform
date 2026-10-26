import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '/events';
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error || !code) {
    console.error('Google OAuth error or denied:', error);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error || 'Access denied by Google')}`, req.url)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = `${appUrl}/api/auth/callback/google`;

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('Failed to exchange Google OAuth code:', errBody);
      return NextResponse.redirect(
        new URL(`/login?error=Failed+to+exchange+Google+token&redirect=${encodeURIComponent(state)}`, req.url)
      );
    }

    const tokens = await tokenRes.json();

    // 2. Fetch authenticated profile from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(
        new URL(`/login?error=Failed+to+fetch+Google+profile&redirect=${encodeURIComponent(state)}`, req.url)
      );
    }

    const googleProfile = await profileRes.json();
    const cleanEmail = googleProfile.email.toLowerCase().trim();

    // 3. Find or provision user in Prisma database
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { hostProfile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: googleProfile.name || cleanEmail.split('@')[0],
          avatar: googleProfile.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          headline: 'Google Verified Attendee',
          bio: 'Authenticated via official Google OAuth API on Sushanti.',
          college: 'Premier University',
          skills: JSON.stringify(['Google Cloud', 'AI Engineering', 'Web Development']),
          role: 'CONSUMER',
          activeMode: 'CONSUMER',
        },
        include: { hostProfile: true },
      });
    }

    // 4. Set session cookie and redirect to target event/page
    const response = NextResponse.redirect(new URL(state, req.url));
    response.cookies.set('sushanti_user_id', user.id, {
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: false, // accessible to client auth context
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    console.error('Google Callback Error:', err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || 'Authentication error')}`, req.url)
    );
  }
}
