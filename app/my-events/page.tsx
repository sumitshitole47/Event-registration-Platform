'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  QrCode,
  Trophy,
  Users,
  Download,
  ExternalLink,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '@/lib/auth-context';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function MyEventsPage() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  
  // QR Modal
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (user?.id) fetchMyEvents();
  }, [user?.id]);

  const fetchMyEvents = async () => {
    try {
      const res = await fetch(`/api/my-events?userId=${user?.id || 'usr_alex'}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQR = async (reg: any) => {
    setSelectedTicket(reg);
    try {
      const url = await QRCode.toDataURL(reg.qrCodeData || `SUSHANTI:${reg.ticketNumber}`, {
        margin: 1,
        width: 256,
        color: { dark: '#090d16', light: '#ffffff' },
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Calendar className="w-4 h-4" /> Attendee Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            My Registered Events & Tickets
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            View tickets, scan codes for on-site check-in, submit project deliverables, and track results.
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Discover More Events</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('UPCOMING')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'UPCOMING'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Upcoming & Ongoing
        </button>
        <button
          onClick={() => setActiveTab('PAST')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'PAST'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Past Participations & Certificates
        </button>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No registered events yet</h3>
          <p className="mt-1 text-xs text-slate-400">
            You haven't registered for any events yet. Explore upcoming hackathons and coding sprints!
          </p>
          <Link
            href="/events"
            className="mt-4 inline-block px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {reg.event.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {reg.isCheckedIn ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Checked In
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Confirmed Pass
                      </span>
                    )}
                  </div>
                </div>

                <Link href={`/events/${reg.event.slug}`}>
                  <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                    {reg.event.title}
                  </h3>
                </Link>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(reg.event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span className="capitalize">{reg.event.mode}</span>
                  </div>
                </div>

                {/* Team Details if registered with a team */}
                {reg.team && (
                  <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Your Squad</span>
                      <p className="font-bold text-white">{reg.team.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Join Code</span>
                      <p className="font-mono font-bold text-amber-400">{reg.team.joinCode}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => handleOpenQR(reg)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View QR Ticket</span>
                </button>

                <Link
                  href={`/events/${reg.event.slug}/portal`}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Competition Portal</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View QR Code Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-5 text-center relative shadow-2xl">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Official Entry Pass
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {selectedTicket.event.title}
              </h3>
              <p className="text-xs font-mono font-semibold text-amber-400 mt-0.5">
                #{selectedTicket.ticketNumber}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center">
              {qrUrl && <img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded" />}
              <span className="text-[10px] text-slate-800 font-mono font-bold mt-2">
                Present at registration desk
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <p>Attendee: <span className="text-white font-semibold">{user?.name}</span></p>
              <p>Status: <span className="text-emerald-400 font-semibold">{selectedTicket.status}</span></p>
            </div>

            <button
              onClick={() => setSelectedTicket(null)}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
