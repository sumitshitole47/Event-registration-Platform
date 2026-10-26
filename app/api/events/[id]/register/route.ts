import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTicketNumber, generateJoinCode } from '@/lib/utils';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const {
      userId,
      ticketTierId,
      teamName,
      joinCode,
      customResponses,
      couponCode,
      amountPaid = 0,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { ticketTiers: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if user already registered for this event
    const existingReg = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId,
        },
      },
    });

    if (existingReg) {
      return NextResponse.json(
        { error: 'You are already registered for this event', registration: existingReg },
        { status: 409 }
      );
    }

    let teamId: string | null = null;

    // Handle Team Logic
    if (joinCode) {
      // Joining an existing team with code
      const existingTeam = await prisma.team.findFirst({
        where: { eventId: event.id, joinCode: joinCode.trim().toUpperCase() },
        include: { members: true },
      });

      if (!existingTeam) {
        return NextResponse.json({ error: 'Invalid team join code' }, { status: 400 });
      }

      if (existingTeam.members.length >= event.maxTeamSize) {
        return NextResponse.json({ error: 'This team has already reached its maximum capacity' }, { status: 400 });
      }

      teamId = existingTeam.id;

      // Add to team members
      await prisma.teamMember.create({
        data: {
          teamId: existingTeam.id,
          userId,
          role: 'MEMBER',
        },
      });
    } else if (teamName && event.maxTeamSize > 1) {
      // Creating a new team
      const newJoinCode = generateJoinCode();
      const newTeam = await prisma.team.create({
        data: {
          eventId: event.id,
          name: teamName.trim(),
          joinCode: newJoinCode,
          leaderId: userId,
          status: 'FORMING',
        },
      });

      await prisma.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId,
          role: 'LEADER',
        },
      });

      teamId = newTeam.id;
    }

    // Generate ticket
    const ticketNumber = generateTicketNumber();
    const qrPayload = `SUSHANTI:${ticketNumber}:${event.id}:${userId}`;

    const newRegistration = await prisma.registration.create({
      data: {
        ticketNumber,
        eventId: event.id,
        userId,
        ticketTierId: ticketTierId || (event.ticketTiers[0]?.id ?? null),
        teamId,
        status: 'CONFIRMED',
        paymentStatus: amountPaid > 0 ? 'COMPLETED' : 'FREE',
        amountPaid: Number(amountPaid) || 0,
        customResponses: customResponses ? JSON.stringify(customResponses) : null,
        qrCodeData: qrPayload,
      },
      include: {
        event: true,
        ticketTier: true,
        team: true,
      },
    });

    // Create confirmation notification
    await prisma.notification.create({
      data: {
        userId,
        title: `Confirmed for ${event.title}! 🎟️`,
        message: `Your ticket #${ticketNumber} is confirmed. Tap to view ticket QR & details.`,
        type: 'SUCCESS',
        link: '/my-events',
      },
    });

    return NextResponse.json({
      success: true,
      registration: newRegistration,
      message: 'Registration successful!',
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
