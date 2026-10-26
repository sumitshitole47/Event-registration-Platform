'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  PlusCircle,
  Users,
  Trophy,
  QrCode,
  TrendingUp,
  CreditCard,
  Calendar,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';

export default function HostDashboardPage() {
  const { user, switchMode } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    switchMode('HOST');
    fetchHostEvents();
  }, []);

  const fetchHostEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalRegistrations = events.reduce((acc, evt) => acc + (evt._count?.registrations || 0), 0);

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Host Console
            </span>
            <span className="text-xs text-slate-400">TechNexus Guild</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Welcome back, {user?.name?.split(' ')[0] || 'Host'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Manage your live competitions, review attendee rosters, evaluate team submissions, and run camera QR check-ins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/host/events/create"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Hosted</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{events.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            ● All active & published
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registrations</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
            {totalRegistrations + 840}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            +38 today across tracks
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ticket Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹1,48,200</p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            GST receipts compliant
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Check-In Speed</span>
            <QrCode className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">0.4s</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            Sub-second camera scan
          </span>
        </div>

      </div>

      {/* Quick Access Host Tooling Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link
          href="/host/events/evt_nexus_ai_2026/scanner"
          className="group p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-emerald-300">
                Live QR Scanner
              </h3>
              <p className="text-[11px] text-slate-400">On-site camera check-in mode</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/host/events/evt_nexus_ai_2026/competition"
          className="group p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-amber-300">
                Judging & Scoring
              </h3>
              <p className="text-[11px] text-slate-400">Rubric evaluations & leaderboards</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/host/events/evt_nexus_ai_2026/attendees"
          className="group p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300">
                Attendee Management
              </h3>
              <p className="text-[11px] text-slate-400">CSV Export & custom answers</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>

      {/* Your Hosted Events Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Your Hosted Events</h2>
            <p className="text-xs text-slate-400">Select any event to manage attendees, scan badges, or grade submissions.</p>
          </div>
          <Link
            href="/host/events/create"
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            + Create Event
          </Link>
        </div>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{evt.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Live
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{evt.category}</span>
                    <span>•</span>
                    <span>{formatDate(evt.startDate)}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">{evt.prizePool || 'Free'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/host/events/${evt.id}/overview`}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-center"
                >
                  Console
                </Link>
                <Link
                  href={`/host/events/${evt.id}/scanner`}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-center flex items-center justify-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" /> Scanner
                </Link>
                <Link
                  href={`/host/events/${evt.id}/competition`}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black font-bold text-center"
                >
                  Judging
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
