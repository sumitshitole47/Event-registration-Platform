import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Organizer merchant UPI configuration
 */
export const ORGANIZER_UPI_ID = 'sumitshitole447-1@okhdfcbank';
export const ORGANIZER_PAYEE_NAME = 'Sumit Shitole (Sushanti Events)';

/**
 * Generates a standardized UPI deep link for Google Pay, PhonePe, Paytm, and all UPI apps.
 */
export function generateUpiPaymentUrl({
  upiId = ORGANIZER_UPI_ID,
  payeeName = ORGANIZER_PAYEE_NAME,
  amount,
  transactionRef,
  eventTitle,
}: {
  upiId?: string;
  payeeName?: string;
  amount: number;
  transactionRef: string;
  eventTitle: string;
}): string {
  const sanitizedTitle = (eventTitle || 'Event Pass')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .slice(0, 24);

  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: Number(amount).toFixed(2),
    cu: 'INR',
    tn: `Pass:${sanitizedTitle}`,
    tr: transactionRef,
  });

  return `upi://pay?${params.toString()}`;
}

/**
 * Validates a UPI UTR / Transaction Reference Number or Razorpay Payment ID.
 * Standard Indian banking UTRs are 12 digits, while Razorpay payment IDs start with 'pay_'.
 */
export function isValidTransactionReference(ref: string): boolean {
  if (!ref || typeof ref !== 'string') return false;
  const cleaned = ref.trim();
  // Accept standard 12-digit UTR, alphanumeric reference (8-30 chars), or razorpay payment id
  const isUtr = /^\d{12}$/.test(cleaned);
  const isRazorpayId = /^pay_[a-zA-Z0-9_]{6,30}$/.test(cleaned);
  const isAlphanumericRef = /^[a-zA-Z0-9_\-\.]{8,35}$/.test(cleaned);
  return isUtr || isRazorpayId || isAlphanumericRef;
}

/**
 * Returns a configured Razorpay client instance, or null if API keys are not yet configured.
 */
export function getRazorpayClient() {
  const key_id =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Verifies Razorpay payment signature using HMAC SHA256.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    // If running in local test mode without secret, accept if test pattern matches
    if (orderId && paymentId && signature.startsWith('mock_sig_')) {
      return true;
    }
    return false;
  }

  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
