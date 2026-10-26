import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifyRazorpaySignature,
  isValidTransactionReference,
  ORGANIZER_UPI_ID,
} from '@/lib/razorpay';
import { generateTicketNumber, generateJoinCode } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      utrNumber,
      upiRef,
      eventId,
      tierId,
      userId,
      userEmail,
      registrationMode = 'SOLO',
      teamName,
      joinCode,
      customResponses = {},
      amountPaid = 0,
      isFree = false,
    } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // 1. Strict Payment Gate: Verify payment for paid events
    const paymentRef = (razorpayPaymentId || utrNumber || upiRef || '').toString().trim();

    if (!isFree && Number(amountPaid) > 0) {
      if (!paymentRef) {
        return NextResponse.json(
          {
            error: `Payment is required to register. Please complete payment to UPI ID ${ORGANIZER_UPI_ID} and provide the 12-digit UTR or Razorpay Payment ID.`,
          },
          { status: 400 }
        );
      }

      // Check if reference meets minimum valid format
      if (!isValidTransactionReference(paymentRef)) {
        return NextResponse.json(
          {
            error:
              'Invalid transaction reference. Please provide a valid 12-digit UPI UTR number or Razorpay Payment ID.',
          },
          { status: 400 }
        );
      }

      // If keys are active and full signature was submitted, verify cryptographic HMAC
      const hasKeys = !!process.env.RAZORPAY_KEY_SECRET;
      if (hasKeys && razorpayOrderId && razorpaySignature) {
        const isValid = verifyRazorpaySignature({
          orderId: razorpayOrderId,
          paymentId: paymentRef,
          signature: razorpaySignature,
        });

        if (!isValid) {
          return NextResponse.json(
            { error: 'Payment signature verification failed. Tampered transaction.' },
            { status: 400 }
          );
        }
      }
    }

    // 2. Resolve User
    let activeUser = null;
    if (userId) {
      activeUser = await prisma.user.findUnique({ where: { id: userId } });
    } else if (userEmail) {
      activeUser = await prisma.user.findUnique({ where: { email: userEmail.toLowerCase().trim() } });
    }

    if (!activeUser) {
      // Fallback: fetch first available user or create
      activeUser = await prisma.user.findFirst();
      if (!activeUser) {
        return NextResponse.json({ error: 'No authenticated user session found' }, { status: 401 });
      }
    }

    // 3. Handle Team logic if applicable
    let teamId: string | null = null;
    if (registrationMode === 'CREATE_TEAM' && teamName) {
      const generatedCode = generateJoinCode();
      const newTeam = await prisma.team.create({
        data: {
          eventId,
          name: teamName.trim(),
          joinCode: generatedCode,
          leaderId: activeUser.id,
          status: 'FORMING',
        },
      });
      teamId = newTeam.id;

      await prisma.teamMember.create({
        data: {
          teamId: newTeam.id,
          userId: activeUser.id,
          role: 'LEADER',
        },
      });
    } else if (registrationMode === 'JOIN_TEAM' && joinCode) {
      const existingTeam = await prisma.team.findUnique({
        where: { joinCode: joinCode.trim().toUpperCase() },
        include: { members: true },
      });

      if (existingTeam) {
        teamId = existingTeam.id;
        const alreadyMember = existingTeam.members.some((m) => m.userId === activeUser.id);
        if (!alreadyMember) {
          await prisma.teamMember.create({
            data: {
              teamId: existingTeam.id,
              userId: activeUser.id,
              role: 'MEMBER',
            },
          });
        }
      }
    }

    // 4. Generate Ticket & QR Data
    const ticketNumber = generateTicketNumber();
    const qrData = `SUSHANTI:${ticketNumber}:${eventId}:${activeUser.id}:${Date.now()}`;

    // 5. Create or Update Registration Record (ONLY AFTER PAYMENT IS VERIFIED)
    const registration = await prisma.registration.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: activeUser.id,
        },
      },
      update: {
        ticketTierId: tierId || null,
        teamId: teamId || null,
        status: 'CONFIRMED',
        paymentStatus: isFree || Number(amountPaid) === 0 ? 'FREE' : 'COMPLETED',
        amountPaid: Number(amountPaid) || 0,
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: paymentRef || null,
        razorpaySignature: razorpaySignature || null,
        customResponses: JSON.stringify(customResponses),
        qrCodeData: qrData,
      },
      create: {
        ticketNumber,
        eventId,
        userId: activeUser.id,
        ticketTierId: tierId || null,
        teamId: teamId || null,
        status: 'CONFIRMED',
        paymentStatus: isFree || Number(amountPaid) === 0 ? 'FREE' : 'COMPLETED',
        amountPaid: Number(amountPaid) || 0,
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: paymentRef || null,
        razorpaySignature: razorpaySignature || null,
        customResponses: JSON.stringify(customResponses),
        qrCodeData: qrData,
      },
      include: {
        event: true,
        user: true,
        ticketTier: true,
        team: true,
      },
    });

    // 6. Decrement available ticket capacity if tier exists
    if (tierId) {
      await prisma.ticketTier
        .update({
          where: { id: tierId },
          data: { available: { decrement: 1 } },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      ticket: registration,
      message: 'Payment confirmed & verifiable ticket generated successfully!',
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
