'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Trophy,
  Calendar,
  MapPin,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
  Share2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Shield,
  HelpCircle,
  ExternalLink,
  Star,
  Check,
  Copy,
  Layers,
  ArrowRight,
  Lock,
  Image as ImageIcon,
} from 'lucide-react';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { FALLBACK_EVENTS } from '@/lib/default-events';

export default function EventDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, isLoadingAuth } = useAuth();

  const [event, setEvent] = useState<any>(() => FALLBACK_EVENTS.find((e) => e.slug === slug || e.id === slug) || null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'gallery' | 'timeline' | 'prizes' | 'rules' | 'faqs' | 'reviews'>('about');
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // Guard: Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isLoadingAuth && !user && slug) {
      router.push(`/login?redirect=/events/${slug}`);
    }
  }, [user, isLoadingAuth, slug, router]);

  // AI Q&A State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'Is this event open to college students?',
      a: 'Yes! Open to all undergraduate and postgraduate students, developers, and professionals. Cross-college teams are welcome.',
    },
  ]);

  // Social Share & Copy state
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (slug) fetchEventDetails();
  }, [slug]);

  const fetchEventDetails = async () => {
    try {
      const res = await fetch(`/api/events/${slug}`);
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

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim() || !event) return;

    const q = aiQuestion.trim();
    setAiQuestion('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/ask-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, question: q }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiHistory((prev) => [...prev, { q, a: data.answer }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Auth gate check
  if (!isLoadingAuth && !user) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <Lock className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">Sign In Required</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              To view full event tracks, photos, rules, and to register, please sign in with your Google account.
            </p>
          </div>
          <button
            onClick={() => router.push(`/login?redirect=/events/${slug}`)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-lg transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-16 max-w-7xl mx-auto px-4">
        <div className="h-72 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-2xl font-bold text-white">Event Not Found</h2>
        <p className="text-slate-400 mt-2 text-sm">The event you are looking for does not exist or has been removed.</p>
        <Link href="/events" className="mt-4 inline-block px-4 py-2 rounded-xl text-xs bg-indigo-600 text-white font-semibold">
          Back to Events
        </Link>
      </div>
    );
  }

  // Parse JSON fields
  let prizesList: any[] = [];
  let sponsorsList: any[] = [];
  let faqsList: any[] = [];
  let eligibilityList: any[] = [];
  let galleryList: string[] = [];
  try {
    if (event.prizes) prizesList = JSON.parse(event.prizes);
    if (event.sponsors) sponsorsList = JSON.parse(event.sponsors);
    if (event.faqs) faqsList = JSON.parse(event.faqs);
    if (event.eligibilityCriteria) eligibilityList = JSON.parse(event.eligibilityCriteria);
    if (event.gallery) galleryList = JSON.parse(event.gallery);
  } catch {}

  if (!galleryList || galleryList.length === 0) {
    galleryList = [
      event.bannerUrl,
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    ];
  }

  return (
    <div className="min-h-screen pb-24">
      
      {/* Cover Banner Header */}
      <div className="relative w-full h-72 sm:h-96 bg-slate-950 overflow-hidden">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover opacity-60 filter blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-transparent" />
        
        {/* Banner Details */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-md">
              {event.category.replace('_', ' ')}
            </span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                event.mode === 'ONLINE'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : event.mode === 'HYBRID'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {event.mode}
            </span>
            {event.location && (
              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900/80 text-slate-300 border border-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{event.location}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            {event.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl line-clamp-2">
            {event.tagline}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Tabs & Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stat Pill Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Prize Pool</span>
                <p className="text-sm sm:text-base font-extrabold text-amber-400 mt-0.5 truncate">
                  {event.prizePool || 'Certificate'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Team Size</span>
                <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  {event.minTeamSize === event.maxTeamSize
                    ? `${event.minTeamSize} member`
                    : `${event.minTeamSize} - ${event.maxTeamSize} members`}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Reg. Deadline</span>
                <p className="text-sm sm:text-base font-extrabold text-indigo-400 mt-0.5">
                  {formatDate(event.regEndDate)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Registered</span>
                <p className="text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5">
                  {event._count?.registrations || 120}+ Builders
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'about', label: 'Overview & Tracks' },
                { id: 'gallery', label: `Photos (${galleryList.length})` },
                { id: 'timeline', label: `Stages (${event.rounds?.length || 0})` },
                { id: 'prizes', label: 'Prizes & Perks' },
                { id: 'rules', label: 'Rules & Eligibility' },
                { id: 'faqs', label: 'FAQs & AI Help' },
                { id: 'reviews', label: `Reviews (${event.reviews?.length || 0})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: About & Overview */}
            {activeTab === 'about' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white font-display">About the Event</h3>
                <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>

                {/* Venue & Map Location if Offline / Hybrid */}
                {event.venueAddress && (
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>Event Venue Details</span>
                    </h4>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-white">{event.location || 'Pune Venue'}</p>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{event.venueAddress}</p>
                      </div>
                      {event.mapLink && (
                        <a
                          href={event.mapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-indigo-600/20"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Sponsors if available */}
                {sponsorsList.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-slate-800">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                      Partners & Sponsors
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {sponsorsList.map((sp: any, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3"
                        >
                          <img
                            src={sp.logo}
                            alt={sp.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{sp.name}</p>
                            <span className="text-[10px] text-amber-400">{sp.tier}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Photos & Gallery */}
            {activeTab === 'gallery' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Event Photo Gallery</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      High-resolution visual highlights of the venue, stages, atmosphere, and past editions.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                    {galleryList.length} Photos
                  </span>
                </div>

                {/* Featured / Selected Photo Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border border-slate-800 shadow-xl group">
                  <img
                    src={selectedGalleryImg || galleryList[0]}
                    alt="Event gallery preview"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-4">
                    <span className="text-xs text-white/90 font-medium">Click any photo below to inspect</span>
                    <a
                      href={selectedGalleryImg || galleryList[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 hover:bg-black/90 transition-colors flex items-center gap-1"
                    >
                      <span>Full Resolution</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryList.map((imgUrl, i) => {
                    const isSelected = (selectedGalleryImg || galleryList[0]) === imgUrl;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedGalleryImg(imgUrl)}
                        className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all group ${
                          isSelected
                            ? 'border-indigo-500 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-500/30'
                            : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Event Photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                          #{i + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Stages & Timeline */}
            {activeTab === 'timeline' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white font-display">Rounds & Timeline</h3>
                
                {event.rounds && event.rounds.length > 0 ? (
                  <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-8 my-4">
                    {event.rounds.map((round: any, idx: number) => (
                      <div key={round.id} className="relative group">
                        {/* Dot indicator */}
                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-[#090d16]" />
                        
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              Round {round.order}: {round.type}
                            </span>
                            {round.isElimination && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Elimination Round
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-white">{round.title}</h4>
                          <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                            {round.description}
                          </p>

                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Starts: {formatDateTime(round.startDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Ends: {formatDateTime(round.endDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Timeline will be announced soon.</p>
                )}
              </div>
            )}

            {/* Tab: Prizes */}
            {activeTab === 'prizes' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">Prizes & Recognitions</h3>
                    <p className="text-xs text-slate-400 mt-1">Compete for cash rewards, cloud credits, and direct interview fast-tracks.</p>
                  </div>
                  {event.prizePool && (
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold">
                      Pool: {event.prizePool}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {prizesList.map((p: any, i: number) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{p.title}</h4>
                      <p className="text-lg font-extrabold text-amber-400 mt-1">{p.amount}</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.perks}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Rules & Eligibility */}
            {activeTab === 'rules' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Eligibility Criteria</h3>
                  <ul className="mt-3 space-y-2">
                    {eligibilityList.map((crit: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-xl font-bold text-white font-display">Code of Conduct & Rules</h3>
                  <div className="mt-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {event.rules || 'Standard Sushanti event guidelines apply. All participants must abide by fair play and code of conduct.'}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: FAQs & AI Assistant */}
            {activeTab === 'faqs' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-8">
                
                {/* AI Event Q&A Assistant Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-950 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white">Ask Sushanti AI About This Event</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Have questions about team limits, deadlines, submission formats, or prizes? Ask our AI assistant grounded in this event’s rules.
                  </p>

                  {/* Chat History */}
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2">
                    {aiHistory.map((item, i) => (
                      <div key={i} className="space-y-1.5 text-xs">
                        <div className="font-semibold text-indigo-300">Q: {item.q}</div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed">
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleAskAI} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Can we submit after the deadline? Are meals provided?"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <span>Thinking...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Ask AI</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Standard FAQs Accordion */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-4">Frequently Asked Questions</h4>
                  <div className="space-y-3">
                    {faqsList.map((faq: any, i: number) => {
                      const isOpen = openFaqIndex === i;
                      return (
                        <div
                          key={i}
                          className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                            className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-indigo-400 transition-colors"
                          >
                            <span>{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="p-4 pt-0 text-xs text-slate-400 border-t border-slate-900 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white font-display">Attendee Reviews & Ratings</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9 / 5.0 Rating</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {event.reviews && event.reviews.length > 0 ? (
                    event.reviews.map((rev: any) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt={rev.user.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{rev.user.name}</p>
                              <span className="text-[10px] text-slate-500">{rev.user.college || 'Verified Attendee'}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-amber-400 text-xs">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No reviews yet for this edition.</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Registration & Host Card */}
          <div className="space-y-6">
            
            {/* Sticky Card */}
            <div className="sticky top-24 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-6">
              
              {/* Pricing Display */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Registration Pass
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-white">
                    {event.isPaid ? 'From ₹199' : 'Free Entry'}
                  </span>
                  {event.isPaid && (
                    <span className="text-xs text-slate-400 line-through">₹499</span>
                  )}
                </div>
              </div>

              {/* Deadlines & Format Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Registration Closes:</span>
                  <span className="font-semibold text-white">{formatDate(event.regEndDate)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Event Starts:</span>
                  <span className="font-semibold text-white">{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Format:</span>
                  <span className="font-semibold text-emerald-400 capitalize">{event.mode}</span>
                </div>
                {event.venueAddress && (
                  <div className="pt-2 border-t border-slate-900 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Venue</span>
                    <p className="text-xs text-slate-300 leading-snug">{event.venueAddress}</p>
                    {event.mapLink && (
                      <a
                        href={event.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline pt-0.5"
                      >
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>View on Google Maps</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Primary Register CTA */}
              <Link
                href={`/events/${event.slug}/register`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/30 transition-all group"
              >
                <span>Register for Event</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Find Teammates Shortcut */}
              {event.maxTeamSize > 1 && (
                <Link
                  href={`/teams?eventId=${event.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 transition-all"
                >
                  <Users className="w-4 h-4" />
                  <span>Looking for Teammates?</span>
                </Link>
              )}

              {/* Share & Copy Link */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Share Link</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=Check out ${encodeURIComponent(event.title)} on Sushanti!`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Share to WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

            {/* Organizer Profile Card */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Organized By
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={event.host?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                  alt={event.host?.organizationName}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">
                      {event.host?.organizationName || 'Tech Host'}
                    </h4>
                    {event.host?.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {event.host?.followersCount || 14200}+ community followers
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {event.host?.bio || 'Leading tech organizer on Sushanti hosting hackathons and developer summits.'}
              </p>
              <button className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-white hover:bg-slate-800 transition-colors">
                Follow Host
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
