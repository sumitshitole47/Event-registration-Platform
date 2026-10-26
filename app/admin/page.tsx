'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  Layers,
  Sparkles,
  Trophy,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminPanelPage() {
  const { user, switchUser } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Host verification requests
  const [verificationRequests, setVerificationRequests] = useState<any[]>([
    {
      id: 'req_1',
      orgName: 'Bangalore Web3 Collective',
      slug: 'blr-web3',
      requestedBy: 'Vikram Mehta',
      email: 'vikram@blrweb3.org',
      appliedAt: '2 days ago',
      eventsHosted: 4,
      status: 'PENDING',
    },
    {
      id: 'req_2',
      orgName: 'IIT Bombay Coding Club',
      slug: 'iitb-coding',
      requestedBy: 'Ananya Sen',
      email: 'coding@iitb.ac.in',
      appliedAt: '3 days ago',
      eventsHosted: 8,
      status: 'PENDING',
    },
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
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

  const handleApproveHost = (id: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' } : r))
    );
    alert('Host verified! Blue checkmark granted.');
  };

  const handleRejectHost = (id: string) => {
    setVerificationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r))
    );
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Super-Admin Console
            </span>
            <span className="text-xs text-slate-400">Platform Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Sushanti Platform Trust & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Oversee event compliance, approve host verification badges, and monitor platform metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => switchUser('usr_admin')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          >
            Act as Super-Admin
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Events</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{events.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">100% Verified</span>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Registrations</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">1,480</p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Live across 7 events</span>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gross Ticket GMV</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">₹6,40,500</p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">Razorpay / UPI integrated</span>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Abuse Reports</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">0</p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">Clean queue</span>
        </div>
      </div>

      {/* Host Verification Queue */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Host Verification Queue</h2>
            <p className="text-xs text-slate-400">Community and college organizers requesting official verified checkmarks.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400">
            {verificationRequests.filter((r) => r.status === 'PENDING').length} Pending Review
          </span>
        </div>

        <div className="space-y-3">
          {verificationRequests.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{req.orgName}</h3>
                  <span className="text-xs text-slate-500">(@{req.slug})</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Requested by <strong className="text-white">{req.requestedBy}</strong> ({req.email})
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span>Applied {req.appliedAt}</span>
                  <span>•</span>
                  <span>{req.eventsHosted} events organized</span>
                </div>
              </div>

              {req.status === 'PENDING' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectHost(req.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveHost(req.id)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Verification
                  </button>
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    req.status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {req.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Platform Events Directory & Moderation */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white font-display">Active Events Moderation Roster</h2>
        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs"
            >
              <div>
                <h4 className="font-bold text-white">{evt.title}</h4>
                <p className="text-slate-500 mt-0.5">{evt.category} • Hosted by {evt.host?.organizationName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/events/${evt.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <span>Preview</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => alert(`Event "${evt.title}" featured on home banner!`)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                >
                  Feature on Hero
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
