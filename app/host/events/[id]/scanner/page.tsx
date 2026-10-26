'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Camera,
  Search,
  ShieldCheck,
  Users,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { LiveQRCameraScanner } from '@/components/host/LiveQRCameraScanner';

export default function QRScannerPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([
    {
      id: '1',
      name: 'Rohit Verma',
      ticket: 'TKT-829105',
      time: 'Just now',
      status: 'VERIFIED',
    },
  ]);

  const handleVerify = async (identifier: string) => {
    if (!identifier.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketIdentifier: identifier.trim(),
          eventId,
          checkedBy: 'Volunteer Gate 1',
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.success && data.registration) {
        setScanHistory((prev) => [
          {
            id: Date.now().toString(),
            name: data.registration.user.name,
            ticket: data.registration.ticketNumber,
            time: 'Just now',
            status: 'VERIFIED',
          },
          ...prev,
        ]);
        setTicketInput('');
      }
    } catch (err) {
      console.error(err);
      setResult({
        success: false,
        status: 'ERROR',
        message: 'Network error verifying ticket',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/host/events/${eventId}/overview`}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Command Center
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            On-Site QR Check-In Scanner
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fast sub-second attendance verification for event entry desks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Scanner Ready</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Scanner & Verification Console */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Live Camera Scanner */}
          <LiveQRCameraScanner onScan={handleVerify} isProcessing={loading} />

          {/* Manual Input or Fast Barcode Reader */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(ticketInput);
            }}
            className="space-y-3"
          >
            <label className="block text-xs font-semibold text-slate-300">
              Or Enter Ticket ID Manually:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. TKT-829104"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono text-xs uppercase focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>Verify</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Tip: You can try typing the seeded demo ticket: <code className="text-amber-400 font-bold">TKT-829104</code>
            </p>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-2">
              Quick Test Codes:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setTicketInput('TKT-829104');
                  handleVerify('TKT-829104');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-indigo-300 hover:border-indigo-500"
              >
                TKT-829104 (Alex)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTicketInput('TKT-INVALID');
                  handleVerify('TKT-INVALID');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-rose-300 hover:border-rose-500"
              >
                TKT-INVALID
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Verification Result & Check-in Feed */}
        <div className="space-y-6">
          
          {/* Active Result Card */}
          {result && (
            <div
              className={`p-6 rounded-3xl border shadow-xl transition-all ${
                result.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : result.status === 'ALREADY_CHECKED_IN'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {result.success ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-base font-bold text-white">
                    {result.status === 'VERIFIED'
                      ? 'Ticket Verified — Access Granted! 🎉'
                      : result.status === 'ALREADY_CHECKED_IN'
                      ? 'Warning: Already Checked In'
                      : 'Invalid Entry Ticket'}
                  </h3>
                  <p className="text-xs opacity-90">{result.message}</p>
                </div>
              </div>

              {result.registration && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5 text-xs">
                  <p>
                    <strong className="text-white">Attendee:</strong>{' '}
                    {result.registration.user.name} ({result.registration.user.email})
                  </p>
                  <p>
                    <strong className="text-white">Ticket ID:</strong>{' '}
                    {result.registration.ticketNumber}
                  </p>
                  {result.registration.team && (
                    <p>
                      <strong className="text-white">Team:</strong>{' '}
                      {result.registration.team.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Recent Check-Ins Roster */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Recent Desk Check-Ins
            </h3>

            <div className="space-y-2">
              {scanHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{h.name}</p>
                    <span className="text-[10px] font-mono text-slate-500">#{h.ticket}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                      {h.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
