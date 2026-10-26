import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { eventId, targetSkills = [], currentUserId } = await req.json();

    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUserId || '' },
      },
      include: {
        certificates: true,
      },
      take: 20,
    });

    const candidates = users.map((u) => {
      let skills: string[] = [];
      let links: any = {};
      try {
        if (u.skills) skills = JSON.parse(u.skills);
        if (u.links) links = JSON.parse(u.links);
      } catch {}

      // Calculate skill overlap match
      let matchScore = 70; // baseline
      const lowerSkills = skills.map((s) => s.toLowerCase());

      targetSkills.forEach((ts: string) => {
        if (lowerSkills.some((s) => s.includes(ts.toLowerCase()))) {
          matchScore += 10;
        }
      });

      if (u.certificates.length > 0) matchScore += 5;
      matchScore = Math.min(matchScore, 98);

      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        headline: u.headline,
        college: u.college,
        skills,
        links,
        matchScore,
        certificatesCount: u.certificates.length,
      };
    });

    candidates.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      candidates,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
