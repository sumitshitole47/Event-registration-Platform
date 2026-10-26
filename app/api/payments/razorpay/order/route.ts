import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRazorpayClient } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, tierId, discountPercent = 0, couponCode } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // 1. Fetch event and tier details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { ticketTiers: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let tierPrice = 0;
    let tierName = 'General Pass';

    if (tierId) {
      const selectedTier = event.ticketTiers.find((t) => t.id === tierId);
      if (selectedTier) {
        tierPrice = selectedTier.price;
        tierName = selectedTier.name;
      }
    } else if (event.ticketTiers.length > 0) {
      tierPrice = event.ticketTiers[0].price;
      tierName = event.ticketTiers[0].name;
    }

    // 2. Calculate discounted price
    let finalAmount = tierPrice;
    if (discountPercent > 0) {
      finalAmount = Math.max(0, tierPrice * (1 - discountPercent / 100));
    }

    // Free tier doesn't need Razorpay order
    if (finalAmount <= 0) {
      return NextResponse.json({
        isFree: true,
        amount: 0,
        currency: 'INR',
        eventTitle: event.title,
        tierName,
      });
    }

    // 3. Create real Razorpay Order
    const razorpay = getRazorpayClient();
    const amountInPaise = Math.round(finalAmount * 100);
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      '';

    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            eventId: event.id,
            eventTitle: event.title,
            tierName,
            couponCode: couponCode || 'NONE',
          },
        });

        return NextResponse.json({
          isFree: false,
          orderId: order.id,
          amount: order.amount, // in paise
          currency: order.currency,
          keyId: keyId,
          eventTitle: event.title,
          tierName,
          receipt: receiptId,
        });
      } catch (orderErr: any) {
        console.error('Razorpay Orders API Error:', orderErr);
        return NextResponse.json(
          {
            error:
              orderErr?.error?.description ||
              orderErr.message ||
              'Failed to create Razorpay Order. Please verify API keys in .env.local.',
          },
          { status: 502 }
        );
      }
    } else {
      // Keys not configured yet: Return a standard test order so users can test immediately
      const testOrderId = `order_test_${Date.now()}`;
      return NextResponse.json({
        isFree: false,
        isTestMock: true,
        orderId: testOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: keyId || 'rzp_test_placeholder',
        eventTitle: event.title,
        tierName,
        receipt: receiptId,
        message:
          'Razorpay keys not yet set in .env.local. Test payment mode active. Add RAZORPAY_KEY_ID to activate live gateway.',
      });
    }
  } catch (err: any) {
    console.error('Payment order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
