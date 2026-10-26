import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const verificationId = searchParams.get('id');

    if (!verificationId) {
      return NextResponse.json({ error: 'Certificate ID required' }, { status: 400 });
    }

    const cert = await prisma.certificate.findUnique({
      where: { verificationId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            category: true,
            bannerUrl: true,
            host: {
              select: {
                organizationName: true,
                logo: true,
                isVerified: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            college: true,
          },
        },
      },
    });

    if (!cert) {
      return NextResponse.json({ error: 'Certificate not found or invalid' }, { status: 404 });
    }

    return NextResponse.json({ certificate: cert });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, recipients, certType = 'PARTICIPANT' } = body;

    if (!eventId || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json({ error: 'eventId and recipients array required' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const issuedCertificates = [];

    for (const r of recipients) {
      const codeSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const verificationId = `SUSH-2026-${codeSuffix}`;

      const cert = await prisma.certificate.create({
        data: {
          verificationId,
          eventId: event.id,
          userId: r.userId,
          recipientName: r.name,
          eventTitle: event.title,
          type: r.type || certType,
          rank: r.rank || null,
        },
      });

      // Notify recipient
      await prisma.notification.create({
        data: {
          userId: r.userId,
          title: `Certificate Issued: ${event.title} 🎓`,
          message: `Your verifiable certificate #${verificationId} is now live and downloadable!`,
          type: 'SUCCESS',
          link: `/verify/${verificationId}`,
        },
      });

      issuedCertificates.push(cert);
    }

    return NextResponse.json({
      success: true,
      count: issuedCertificates.length,
      certificates: issuedCertificates,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
