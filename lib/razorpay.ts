import Razorpay from 'razorpay';
import crypto from 'crypto';

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
