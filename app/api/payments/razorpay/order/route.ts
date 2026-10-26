import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FALLBACK_EVENTS } from '@/lib/default-events';
import {
  getRazorpayClient,
  ORGANIZER_UPI_ID,
  ORGANIZER_PAYEE_NAME,
  generateUpiPaymentUrl,
} from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, tierId, discountPercent = 0, couponCode } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // 1. Fetch event and tier details
    let event: any = null;
    try {
      event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { ticketTiers: true },
      });
    } catch (dbErr) {
      console.warn('Database query fallback in payment order:', dbErr);
    }

    if (!event) {
      event = FALLBACK_EVENTS.find((e) => e.id === eventId || e.slug === eventId);
    }

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let tierPrice = 0;
    let tierName = 'General Pass';

    if (tierId) {
      const selectedTier = (event.ticketTiers || []).find((t: any) => t.id === tierId);
      if (selectedTier) {
        tierPrice = selectedTier.price;
        tierName = selectedTier.name;
      }
    } else if (event.ticketTiers && event.ticketTiers.length > 0) {
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
        finalAmount: 0,
        currency: 'INR',
        eventTitle: event.title,
        tierName,
        upiId: ORGANIZER_UPI_ID,
        payeeName: ORGANIZER_PAYEE_NAME,
      });
    }

    // 3. Create real Razorpay Order & UPI Deep Link
    const razorpay = getRazorpayClient();
    const amountInPaise = Math.round(finalAmount * 100);
    const receiptId = `SUSH_${Date.now().toString().slice(-8)}`;

    const upiUri = generateUpiPaymentUrl({
      upiId: ORGANIZER_UPI_ID,
      payeeName: ORGANIZER_PAYEE_NAME,
      amount: finalAmount,
      transactionRef: receiptId,
      eventTitle: event.title,
    });

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
            payeeUpi: ORGANIZER_UPI_ID,
          },
        });

        return NextResponse.json({
          isFree: false,
          orderId: order.id,
          amount: order.amount, // in paise
          finalAmount: finalAmount, // in INR
          currency: order.currency,
          keyId: keyId,
          eventTitle: event.title,
          tierName,
          receipt: receiptId,
          upiId: ORGANIZER_UPI_ID,
          payeeName: ORGANIZER_PAYEE_NAME,
          upiUri,
        });
      } catch (orderErr: any) {
        console.error('Razorpay Orders API Error:', orderErr);
        // Even if Razorpay cloud order creation fails or credentials pending, return fallback UPI order
        const fallbackOrderId = `order_${Date.now()}`;
        return NextResponse.json({
          isFree: false,
          isTestMock: true,
          orderId: fallbackOrderId,
          amount: amountInPaise,
          finalAmount: finalAmount,
          currency: 'INR',
          keyId: keyId || 'rzp_test_placeholder',
          eventTitle: event.title,
          tierName,
          receipt: receiptId,
          upiId: ORGANIZER_UPI_ID,
          payeeName: ORGANIZER_PAYEE_NAME,
          upiUri,
        });
      }
    } else {
      // Keys not configured yet: Return direct UPI portal data with Sumit's UPI ID
      const testOrderId = `order_${Date.now()}`;
      return NextResponse.json({
        isFree: false,
        isTestMock: true,
        orderId: testOrderId,
        amount: amountInPaise,
        finalAmount: finalAmount,
        currency: 'INR',
        keyId: keyId || 'rzp_test_placeholder',
        eventTitle: event.title,
        tierName,
        receipt: receiptId,
        upiId: ORGANIZER_UPI_ID,
        payeeName: ORGANIZER_PAYEE_NAME,
        upiUri,
      });
    }
  } catch (err: any) {
    console.error('Payment order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
