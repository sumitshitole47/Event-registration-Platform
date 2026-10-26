'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  QrCode,
  Trophy,
  CreditCard,
  TrendingUp,
  Share2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function HostEventOverviewPage() {
  const params = useParams();
  const eventId = params?.id as string;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data.event);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 max-w-7xl mx-auto px-4">
        <div className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/host/dashboard" className="hover:text-white">Host Console</Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{event.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Event Command Center
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/events/${event.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <span>Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/host/events/${event.id}/scanner`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Check-In</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Registrations</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {event._count?.registrations || 120}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            ● 85% of target capacity
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Verified Teams</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
            {event._count?.teams || 34}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Average squad size: 3.4
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Page Views</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
            {event.viewsCount || 4280}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            +14% conversion rate
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Submissions In</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {event._count?.submissions || 18}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Ready for grading
          </span>
        </div>

      </div>

      {/* Navigation Sub-hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link
          href={`/host/events/${event.id}/scanner`}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">QR Code Check-In Scanner</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scan attendee digital tickets with camera or manual ID for instantaneous entry verification.
          </p>
        </Link>

        <Link
          href={`/host/events/${event.id}/competition`}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Judging Portal & Rubrics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Grade team MVP submissions against 4 criteria and publish the official live leaderboard.
          </p>
        </Link>

        <Link
          href={`/host/events/${event.id}/attendees`}
          className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Attendee Roster & Export</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Search registrant profiles, custom form responses, and export complete data to CSV.
          </p>
        </Link>

      </div>

    </div>
  );
}
