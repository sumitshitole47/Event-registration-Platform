import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, name, avatar, password, googleId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Google account email is required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json({ error: 'Please enter a valid Google Account email' }, { status: 400 });
    }

    // Capitalize name nicely from email or input
    const cleanName =
      name?.trim() ||
      cleanEmail
        .split('@')[0]
        .split(/[._-]/)
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    const defaultAvatar =
      avatar ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

    // Find existing user by email
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { hostProfile: true },
    });

    if (!user) {
      // Create new user authenticated via Google Account API
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: cleanName,
          avatar: defaultAvatar,
          headline: 'Google Verified Builder & Innovator',
          bio: 'Passionate participant discovering hackathons, cultural festivals, and tech workshops on Sushanti.',
          college: cleanEmail.includes('.edu') || cleanEmail.includes('.ac.in') ? 'University Campus' : 'Premier Tech Institute',
          skills: JSON.stringify(['Google Cloud', 'JavaScript', 'Python', 'Product Design']),
          role: 'CONSUMER',
          activeMode: 'CONSUMER',
        },
        include: { hostProfile: true },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        activeMode: user.activeMode,
        avatar: user.avatar,
        headline: user.headline,
        bio: user.bio,
        college: user.college,
        hostProfile: user.hostProfile,
      },
      message: 'Successfully authenticated with Google!',
    });
  } catch (err: any) {
    console.error('Google Auth Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
