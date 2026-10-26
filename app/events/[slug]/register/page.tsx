'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Users,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Tag,
  CreditCard,
  QrCode,
  Calendar,
  Download,
  Check,
  AlertCircle,
  Sparkles,
  Lock,
  ExternalLink,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { loadRazorpayScript } from '@/lib/razorpay-client';
import { FALLBACK_EVENTS } from '@/lib/default-events';

export default function EventRegisterPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, isLoadingAuth } = useAuth();

  useEffect(() => {
    if (!isLoadingAuth && !user && slug) {
      router.push(`/login?redirect=/events/${slug}/register`);
    }
  }, [user, isLoadingAuth, slug, router]);

  const [event, setEvent] = useState<any>(() => FALLBACK_EVENTS.find((e) => e.slug === slug || e.id === slug) || null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [registrationMode, setRegistrationMode] = useState<'SOLO' | 'CREATE_TEAM' | 'JOIN_TEAM'>('SOLO');
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  
  // Custom form field answers
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  
  // Razorpay Gateway & Verification States
  const [submitting, setSubmitting] = useState(false);
  const [registeredTicket, setRegisteredTicket] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showMockModal, setShowMockModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<any>(null);

  useEffect(() => {
    if (slug) fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
        if (data.event.ticketTiers && data.event.ticketTiers.length > 0) {
          setSelectedTierId(data.event.ticketTiers[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode.trim()) return;

    if (couponCode.toUpperCase() === 'EARLYBIRD50') {
      setDiscountPercent(50);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === 'STUDENT100') {
      setDiscountPercent(100);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  // Complete payment verification and ticket minting
  const handlePaymentVerification = async ({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    finalAmount,
    isFree = false,
  }: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    finalAmount: number;
    isFree?: boolean;
  }) => {
    try {
      const payload = {
        eventId: event.id,
        tierId: selectedTierId,
        userId: user?.id,
        userEmail: user?.email,
        registrationMode,
        teamName: registrationMode === 'CREATE_TEAM' ? teamName : undefined,
        joinCode: registrationMode === 'JOIN_TEAM' ? joinCode : undefined,
        customResponses: formResponses,
        amountPaid: finalAmount,
        isFree,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      };

      const res = await fetch('/api/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegisteredTicket(data.ticket);

        // Generate QR Code data URL
        const qr = await QRCode.toDataURL(data.ticket.qrCodeData, {
          margin: 1,
          width: 256,
          color: {
            dark: '#090d16',
            light: '#ffffff',
          },
        });
        setQrDataUrl(qr);

        // Confetti celebration!
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        alert(data.error || 'Failed to verify transaction. Please contact support.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Verification error: ' + (err?.message || 'Network failure'));
    } finally {
      setSubmitting(false);
      setShowMockModal(false);
    }
  };

  // Main Registration & Razorpay Payment trigger
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/events/${slug}/register`);
      return;
    }

    setSubmitting(true);

    try {
      const selectedTier = event.ticketTiers?.find((t: any) => t.id === selectedTierId) || event.ticketTiers?.[0];
      const basePrice = selectedTier?.price || 0;
      const finalAmount = Math.max(0, basePrice * (1 - discountPercent / 100));

      // CASE 1: Free Registration
      if (finalAmount === 0) {
        await handlePaymentVerification({
          finalAmount: 0,
          isFree: true,
        });
        return;
      }

      // CASE 2: Paid Registration via Razorpay
      const orderRes = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          tierId: selectedTierId,
          discountPercent,
          couponCode: couponApplied ? couponCode : undefined,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        alert(orderData.error || 'Could not initiate Razorpay order. Please try again.');
        setSubmitting(false);
        return;
      }

      // Load official Razorpay Checkout SDK
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && (window as any).Razorpay && !orderData.isTestMock) {
        // REAL RAZORPAY CHECKOUT MODAL
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Sushanti Events',
          description: `${event.title} — ${orderData.tierName}`,
          image: event.host?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100',
          order_id: orderData.orderId,
          handler: async function (response: any) {
            // Payment success callback from Razorpay
            await handlePaymentVerification({
              razorpayOrderId: response.razorpay_order_id || orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              finalAmount,
            });
          },
          prefill: {
            name: user.name || 'Attendee',
            email: user.email || 'attendee@sushanti.dev',
          },
          theme: {
            color: '#4f46e5', // Brand Indigo
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert('Payment Failed: ' + (resp.error?.description || 'Transaction declined'));
          setSubmitting(false);
        });
        rzp.open();
      } else {
        // Fallback / Test Mode when RAZORPAY_KEY_ID is not configured yet in .env.local
        setPendingOrderData({ ...orderData, finalAmount });
        setShowMockModal(true);
        setSubmitting(false);
      }
    } catch (err: any) {
      console.error(err);
      alert('Payment processing error: ' + (err?.message || 'Please try again'));
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 max-w-3xl mx-auto px-4">
        <div className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
      </div>
    );
  }

  if (!event) return null;

  // Success Ticket Modal / View
  if (registeredTicket) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Registration & Payment Confirmed
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1 font-display">
              You are in for {event.title}!
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your official ticket & QR code have been minted and saved to your account.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Attendee</span>
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <span className="text-[10px] text-slate-400">{user?.email}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Ticket ID</span>
                <p className="text-xs font-mono font-bold text-amber-400">{registeredTicket.ticketNumber}</p>
                <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {registeredTicket.paymentStatus === 'COMPLETED' ? 'PAID VIA RAZORPAY' : 'FREE ENTRY'}
                </span>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center py-4 bg-white rounded-2xl p-4 shadow-sm">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Ticket QR Code"
                  className="w-48 h-48 rounded"
                />
              )}
              <span className="text-[11px] text-slate-800 font-mono font-semibold mt-2">
                Scan for On-Site Check-In
              </span>
            </div>

            {/* Payment Transaction Details if Paid */}
            {registeredTicket.amountPaid > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Payment Gateway</span>
                  <span className="font-semibold text-white">Razorpay Standard</span>
                </div>
                {registeredTicket.razorpayPaymentId && (
                  <div className="flex justify-between text-slate-400">
                    <span>Payment ID</span>
                    <span className="font-mono text-emerald-400 text-[11px]">
                      {registeredTicket.razorpayPaymentId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-1.5">
                  <span>Amount Paid</span>
                  <span className="font-bold text-white">₹{registeredTicket.amountPaid}</span>
                </div>
              </div>
            )}

            {registeredTicket.team && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase">Squad</span>
                  <p className="font-bold text-white">{registeredTicket.team.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-indigo-400 font-semibold uppercase">Team Join Code</span>
                  <p className="font-mono font-extrabold text-amber-400">{registeredTicket.team.joinCode}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/my-events"
              className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Go to My Events & Tickets
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="py-3 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Event Page
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Parse custom fields
  let customFieldsList: any[] = [];
  try {
    if (event.customFields) customFieldsList = JSON.parse(event.customFields);
  } catch {}

  const selectedTier = event.ticketTiers?.find((t: any) => t.id === selectedTierId) || event.ticketTiers?.[0];
  const basePrice = selectedTier?.price || 0;
  const discountAmount = (basePrice * discountPercent) / 100;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <Link
            href={`/events/${event.slug}`}
            className="text-xs text-indigo-400 hover:underline mb-2 inline-block"
          >
            ← Back to {event.title}
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white font-display">
              Register for Event
            </h1>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {event.mode}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete the form below to confirm your registration and receive your verifiable QR ticket.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          
          {/* Step 1: Solo vs Team Registration */}
          {event.maxTeamSize > 1 ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Registration Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'SOLO', label: 'Solo Attendee', icon: Users },
                  { id: 'CREATE_TEAM', label: 'Create Team', icon: Trophy },
                  { id: 'JOIN_TEAM', label: 'Join Team', icon: Users },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setRegistrationMode(m.id as any)}
                    className={`py-3 px-3 rounded-2xl text-xs font-semibold border text-center transition-all ${
                      registrationMode === m.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Conditional Team Inputs */}
              {registrationMode === 'CREATE_TEAM' && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Team Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NeuralCraft Syndicate"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    A unique join code will be generated for your squad once registered.
                  </p>
                </div>
              )}

              {registrationMode === 'JOIN_TEAM' && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Team Join Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUSH-9A2B"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    Ask your team leader for their squad invite code.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Step 2: Ticket Tier Selection */}
          {event.ticketTiers && event.ticketTiers.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Ticket Tier
              </label>
              <div className="space-y-2">
                {event.ticketTiers.map((tier: any) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      selectedTierId === tier.id
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{tier.name}</span>
                        {tier.price === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                            Free
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400">
                            ₹{tier.price}
                          </span>
                        )}
                      </div>
                      {tier.description && (
                        <p className="text-[11px] text-slate-400 mt-1">{tier.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-white">
                        {tier.price === 0 ? 'Free' : `₹${tier.price}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Custom Form Fields Set by Host */}
          {customFieldsList.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Host Questions
              </label>
              <div className="space-y-3">
                {customFieldsList.map((fld: any) => (
                  <div key={fld.id} className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      {fld.label} {fld.required && <span className="text-rose-400">*</span>}
                    </label>

                    {fld.type === 'text' && (
                      <input
                        type="text"
                        required={fld.required}
                        value={formResponses[fld.id] || ''}
                        onChange={(e) =>
                          setFormResponses({ ...formResponses, [fld.id]: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    )}

                    {fld.type === 'select' && (
                      <select
                        required={fld.required}
                        value={formResponses[fld.id] || ''}
                        onChange={(e) =>
                          setFormResponses({ ...formResponses, [fld.id]: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">Select an option</option>
                        {fld.options?.map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          {event.isPaid && (
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Discount Coupon
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. EARLYBIRD50 or STUDENT100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {discountPercent}% discount applied successfully!
                </p>
              )}
              {couponError && <p className="text-xs text-rose-400">{couponError}</p>}
            </div>
          )}

          {/* Price Summary & Payment Gateway Notice */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Ticket Tier</span>
              <span className="font-semibold text-white">{selectedTier?.name || 'Standard'}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({discountPercent}%)</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-emerald-400">
                {finalPrice === 0 ? 'Free Entry' : `₹${finalPrice}`}
              </span>
            </div>

            {/* Razorpay Integration Badge for Paid Passes */}
            {finalPrice > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Payment Gateway:</span>
                  </span>
                  <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Razorpay
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Supported methods:</span>
                  <span className="font-semibold text-slate-300">
                    UPI · Cards · NetBanking · Wallets
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Connecting to Razorpay...</span>
            ) : finalPrice > 0 ? (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{finalPrice} via Razorpay</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Free Registration</span>
              </>
            )}
          </button>

        </form>

      </div>

      {/* Razorpay Test Modal (when keys not yet added to .env.local) */}
      {showMockModal && pendingOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-indigo-500/40 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Razorpay Checkout
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMockModal(false)}
                className="text-slate-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Order ID:</span>
                <span className="font-mono text-white">{pendingOrderData.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Event:</span>
                <span className="font-semibold text-white truncate max-w-[180px]">{pendingOrderData.eventTitle}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800/80 pt-2 font-bold text-sm">
                <span>Amount:</span>
                <span className="text-emerald-400">₹{pendingOrderData.finalAmount}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Razorpay API keys can be set in <code className="text-amber-300">.env.local</code> (<code className="text-xs">RAZORPAY_KEY_ID</code> & <code className="text-xs">RAZORPAY_KEY_SECRET</code>). Click below to authorize transaction:
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePaymentVerification({
                    razorpayOrderId: pendingOrderData.orderId,
                    razorpayPaymentId: `pay_test_${Date.now()}`,
                    razorpaySignature: `mock_sig_${Date.now()}`,
                    finalAmount: pendingOrderData.finalAmount,
                  })
                }
                className="flex-1 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Authorize Razorpay Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
