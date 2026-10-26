'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Trophy,
  Users,
  Compass,
  ArrowRight,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Award,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FALLBACK_EVENTS } from '@/lib/default-events';

export default function HomePage() {
  const router = useRouter();
  const { user, switchMode } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState<any[]>(FALLBACK_EVENTS);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  const handleOpenEvent = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (!user) {
      router.push(`/login?redirect=/events/${slug}`);
    } else {
      router.push(`/events/${slug}`);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setFeaturedEvents(data.events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Events', icon: '✨' },
    { id: 'HACKATHON', label: 'Hackathons', icon: '💻' },
    { id: 'CODING_CONTEST', label: 'Coding Contests', icon: '⚡' },
    { id: 'CASE_STUDY', label: 'Case Studies', icon: '📊' },
    { id: 'WORKSHOP', label: 'Workshops', icon: '🛠️' },
    { id: 'MEETUP', label: 'Meetups', icon: '☕' },
    { id: 'CULTURAL', label: 'Cultural & Fests', icon: '🎭' },
  ];

  const filteredEvents =
    activeCategory === 'ALL'
      ? featuredEvents
      : featuredEvents.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium shadow-lg shadow-indigo-500/5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Event & Competition Infrastructure</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-slate-400">v2.0</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] font-display">
              Where Bold Builders{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-amber-400">
                Compete, Discover & Host
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Experience the platform engineered to outclass Unstop and Commudle: instant QR ticketing, transparent judging rubrics, AI teammate matching, and verifiable credentials.
            </p>
          </div>

          {/* Dual-Path Choice Card: The Two Entry Ways */}
          <div className="mt-12 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Path 1: Attendee */}
            <div
              onClick={() => {
                switchMode('CONSUMER');
                router.push('/events');
              }}
              className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-indigo-500/60 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  I want to attend events
                </h3>
                <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Discover hackathons, find complementary teammates, win prize pools, and collect verifiable digital certificates.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-indigo-400">
                <span>Explore Catalog</span>
                <span className="text-slate-600">•</span>
                <span>One-Click Register</span>
              </div>
            </div>

            {/* Path 2: Host */}
            <div
              onClick={() => {
                switchMode('HOST');
                router.push('/host/events/create');
              }}
              className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/60 shadow-xl hover:shadow-amber-500/10 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  I want to host events
                </h3>
                <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Create events in minutes with our 9-step wizard, custom form builder, camera QR check-in, and judging rubrics.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-amber-400">
                <span>Launch Wizard</span>
                <span className="text-slate-600">•</span>
                <span>Host Console</span>
              </div>
            </div>

          </div>

          {/* Social Proof Stats Bar */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">50,000+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Active Builders</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">₹25,00,000+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Prizes Awarded</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Verifiable Certificates</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt; 1 Second</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">QR Check-In Speed</div>
            </div>
          </div>

        </div>
      </section>

      {/* Category Pills Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-12">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === c.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured & Trending Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <TrendingUp className="w-4 h-4" /> Trending & Recommended
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Top Competitions & Hackathons
            </h2>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View all 7+ events</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="group flex flex-col rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category & Mode Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {evt.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                        evt.mode === 'ONLINE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : evt.mode === 'HYBRID'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {evt.mode}
                    </span>
                  </div>

                  {/* Prize Tag */}
                  {evt.prizePool && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/90 text-black font-extrabold text-xs shadow-md">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>{evt.prizePool}</span>
                    </div>
                  )}

                  {/* Fee Tag */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                    {evt.isPaid ? 'Paid' : 'Free'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Host Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-medium text-slate-400 truncate">
                        By {evt.host?.organizationName || 'Organizer'}
                      </span>
                      {evt.host?.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      )}
                    </div>

                    {/* Title */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEvent(e, evt.slug)}
                      className="text-left w-full group/title"
                    >
                      <h3 className="text-base font-bold text-white group-hover/title:text-indigo-400 transition-colors line-clamp-1">
                        {evt.title}
                      </h3>
                    </button>

                    {/* Tagline */}
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.tagline}
                    </p>
                  </div>

                  {/* Metadata Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDate(evt.startDate)}</span>
                    </div>
                    {evt.location ? (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[100px]">{evt.location}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Virtual</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Action */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleOpenEvent(e, evt.slug)}
                      className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
                    >
                      View Details & Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Feature Differentiators (Why Sushanti > Unstop/Commudle) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/60 mt-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-display">
            Why Sushanti Stands Apart
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            We solved the friction points that plague legacy contest platforms. Fast, modern, transparent, and built for builders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Sub-Second Ticketing & QR Check-In</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              No slow emails or PDF printing required. Instant verifiable digital tickets with embedded QR codes that event volunteers can scan directly through any smartphone camera.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">AI Teammate Matchmaker</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Need a UI/UX designer for your hackathon squad? Our algorithm analyzes missing team skills and suggests ideal peers across colleges with matched portfolios.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Cryptographically Verifiable Credentials</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Every certificate has a unique verification ID and public URL (`/verify/[id]`). Employers, recruiters, and colleges can verify participant standing with 1 click.
            </p>
          </div>

        </div>
      </section>

      {/* Host CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/40 border border-indigo-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Host Tooling Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
              Organizing a hackathon, conference, or college fest?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use Sushanti’s automated 9-step wizard, custom drag-and-drop registration forms, live attendee tracking, and judging scoring matrix. Free for community events!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/host/events/create"
              onClick={() => switchMode('HOST')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all text-center"
            >
              Launch Your Event Now
            </Link>
            <Link
              href="/host/dashboard"
              onClick={() => switchMode('HOST')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all text-center"
            >
              Explore Host Console
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
