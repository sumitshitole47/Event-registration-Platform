import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_EVENTS } from '@/lib/default-events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    let event: any = null;
    try {
      event = await prisma.event.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
        include: {
          host: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          ticketTiers: true,
          rounds: {
            orderBy: { order: 'asc' },
          },
          coupons: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                  college: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              registrations: true,
              submissions: true,
              teams: true,
            },
          },
        },
      });
    } catch (dbErr) {
      console.warn('Database lookup fallback for event details:', dbErr);
    }

    if (!event) {
      event = FALLBACK_EVENTS.find((e) => e.id === id || e.slug === id);
    }

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Increment view count non-blockingly
    if (event.id) {
      prisma.event
        .update({
          where: { id: event.id },
          data: { viewsCount: { increment: 1 } },
        })
        .catch(() => {});
    }

    return NextResponse.json({ event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
