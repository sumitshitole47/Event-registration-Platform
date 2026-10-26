'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  Trophy,
  Calendar,
  MapPin,
  CheckCircle2,
  Zap,
  ArrowUpDown,
  X,
  Compass,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { FALLBACK_EVENTS } from '@/lib/default-events';

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialQuery = searchParams.get('q') || '';

  const [events, setEvents] = useState<any[]>(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedFee, setSelectedFee] = useState('ALL');
  const [sortBy, setSortBy] = useState('popular');

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
  }, [searchQuery, selectedCategory, selectedMode, selectedFee, sortBy]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (selectedMode !== 'ALL') params.set('mode', selectedMode);
      if (selectedFee !== 'ALL') params.set('fee', selectedFee);
      params.set('sort', sortBy);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'HACKATHON', label: 'Hackathons' },
    { id: 'CODING_CONTEST', label: 'Coding Contests' },
    { id: 'CASE_STUDY', label: 'Case Studies' },
    { id: 'WORKSHOP', label: 'Workshops' },
    { id: 'MEETUP', label: 'Meetups' },
    { id: 'CULTURAL', label: 'Cultural Fests' },
    { id: 'CONFERENCE', label: 'Conferences' },
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedMode('ALL');
    setSelectedFee('ALL');
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
          <Compass className="w-4 h-4" /> Discover Experiences
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Explore All Events & Competitions
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Find hackathons, coding challenges, tech workshops, and college summits across India and online.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, topic, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Mode Selector */}
          <div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Modes (Online/Offline)</option>
              <option value="ONLINE">Online (Virtual)</option>
              <option value="OFFLINE">Offline (In-Person)</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Fee Selector */}
          <div>
            <select
              value={selectedFee}
              onChange={(e) => setSelectedFee(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Pricing</option>
              <option value="free">Free Events Only</option>
              <option value="paid">Paid Ticket Events</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="popular">Most Popular</option>
              <option value="date">Event Date (Soonest)</option>
              <option value="closing">Registration Deadline</option>
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-slate-800 no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}

          {(selectedCategory !== 'ALL' || selectedMode !== 'ALL' || selectedFee !== 'ALL' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 ml-auto whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Events Results Count */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold text-slate-400">
          Showing <span className="text-white font-bold">{events.length}</span> verified events
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No matching events found</h3>
          <p className="mt-1 text-xs text-slate-400">
            Try adjusting your search query, selecting "All Categories", or removing filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
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

                {/* Prize Pool */}
                {evt.prizePool && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/90 text-black font-extrabold text-xs shadow-md">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{evt.prizePool}</span>
                  </div>
                )}

                {/* Fee */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                  {evt.isPaid ? 'Paid' : 'Free'}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-medium text-slate-400 truncate">
                      By {evt.host?.organizationName || 'Organizer'}
                    </span>
                    {evt.host?.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleOpenEvent(e, evt.slug)}
                    className="text-left w-full group/title"
                  >
                    <h3 className="text-base font-bold text-white group-hover/title:text-indigo-400 transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                  </button>

                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {evt.tagline}
                  </p>
                </div>

                {/* Details Footer */}
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

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={(e) => handleOpenEvent(e, evt.slug)}
                    className="w-full text-center py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    View Details & Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EventsExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-16 max-w-7xl mx-auto px-4"><div className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" /></div>}>
      <EventsContent />
    </Suspense>
  );
}
