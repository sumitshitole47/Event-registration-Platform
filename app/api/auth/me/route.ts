import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_alex';

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        hostProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let skills: string[] = [];
    let links: Record<string, string> = {};
    try {
      if (user.skills) skills = JSON.parse(user.skills);
      if (user.links) links = JSON.parse(user.links);
    } catch {}

    return NextResponse.json({
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
        skills,
        links,
        hostProfile: user.hostProfile,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
