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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';

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

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  
  // Processing & Success
  const [submitting, setSubmitting] = useState(false);
  const [registeredTicket, setRegisteredTicket] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

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
    } finally {
      setLoading(false);
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please select or log in to a demo account first');
      return;
    }

    setSubmitting(true);

    try {
      const selectedTier = event.ticketTiers.find((t: any) => t.id === selectedTierId) || event.ticketTiers[0];
      const basePrice = selectedTier?.price || 0;
      const finalAmount = Math.max(0, basePrice * (1 - discountPercent / 100));

      const payload = {
        userId: user.id,
        ticketTierId: selectedTierId,
        teamName: registrationMode === 'CREATE_TEAM' ? teamName : undefined,
        joinCode: registrationMode === 'JOIN_TEAM' ? joinCode : undefined,
        customResponses: formResponses,
        couponCode: couponApplied ? couponCode : undefined,
        amountPaid: finalAmount,
      };

      const res = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegisteredTicket(data.registration);

        // Generate QR Code data URL
        const qr = await QRCode.toDataURL(data.registration.qrCodeData, {
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
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        alert(data.error || 'Failed to complete registration');
      }
    } catch (err: any) {
      console.error(err);
      alert('An error occurred during registration');
    } finally {
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
              Registration Confirmed
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-1 font-display">
              You are in for {event.title}!
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your official ticket & QR code have been minted and saved to your account.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Attendee</span>
                <p className="text-sm font-bold text-white">{user?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Ticket ID</span>
                <p className="text-xs font-mono font-bold text-amber-400">{registeredTicket.ticketNumber}</p>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center py-3 bg-white rounded-xl p-4">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Ticket QR Code"
                  className="w-48 h-48 rounded"
                />
              )}
              <span className="text-[11px] text-slate-700 font-mono font-semibold mt-2">
                Scan for On-Site Check-In
              </span>
            </div>

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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href={`/events/${event.slug}`}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back to {event.title}
        </Link>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Event Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            Register for {event.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fill out your details to secure your verifiable ticket pass.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          
          {/* Step 1: Attendee / Team Mode */}
          {event.maxTeamSize > 1 ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Participation Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRegistrationMode('SOLO')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    registrationMode === 'SOLO'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">Solo / Individual</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Participate by yourself</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegistrationMode('CREATE_TEAM')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    registrationMode === 'CREATE_TEAM'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">Create a Team</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Lead a new squad</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegistrationMode('JOIN_TEAM')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    registrationMode === 'JOIN_TEAM'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold">Join Existing Team</p>
                  <p className="text-[10px] opacity-75 mt-0.5">Use an invite code</p>
                </button>
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

                    {fld.type === 'select' ? (
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
                    ) : (
                      <input
                        type="text"
                        required={fld.required}
                        placeholder={fld.label}
                        value={formResponses[fld.id] || ''}
                        onChange={(e) =>
                          setFormResponses({ ...formResponses, [fld.id]: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Coupon Code */}
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

          {/* Price Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
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
                {finalPrice === 0 ? 'Free' : `₹${finalPrice}`}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <span>Confirming Ticket...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Get QR Ticket</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}
