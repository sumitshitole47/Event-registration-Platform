import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketIdentifier, eventId, checkedBy } = body;

    if (!ticketIdentifier) {
      return NextResponse.json({ error: 'Ticket identifier or QR data required' }, { status: 400 });
    }

    // Parse ticketIdentifier: could be "TKT-123456" or "SUSHANTI:TKT-123456:evt_id:usr_id"
    let cleanTicketNumber = ticketIdentifier.trim();
    if (cleanTicketNumber.includes('SUSHANTI:')) {
      const parts = cleanTicketNumber.split(':');
      if (parts.length >= 2) {
        cleanTicketNumber = parts[1];
      }
    }

    const registration = await prisma.registration.findFirst({
      where: {
        ticketNumber: cleanTicketNumber,
        ...(eventId ? { eventId } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        ticketTier: true,
        team: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        {
          success: false,
          status: 'INVALID',
          message: 'Invalid ticket. No registration found with this ticket number.',
        },
        { status: 404 }
      );
    }

    if (registration.isCheckedIn) {
      return NextResponse.json({
        success: false,
        status: 'ALREADY_CHECKED_IN',
        message: `Already checked in on ${new Date(
          registration.checkedInAt || Date.now()
        ).toLocaleTimeString()}`,
        registration,
      });
    }

    // Mark check-in
    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
        checkedInBy: checkedBy || 'Volunteer / Scanner',
      },
      include: {
        user: true,
        event: true,
        ticketTier: true,
        team: true,
      },
    });

    return NextResponse.json({
      success: true,
      status: 'VERIFIED',
      message: `Verified! Welcome, ${updated.user.name}.`,
      registration: updated,
    });
  } catch (err: any) {
    console.error('Check-in error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
