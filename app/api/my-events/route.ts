import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_alex';

    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            slug: true,
            title: true,
            category: true,
            mode: true,
            bannerUrl: true,
            startDate: true,
            endDate: true,
            location: true,
          },
        },
        ticketTier: true,
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ registrations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
