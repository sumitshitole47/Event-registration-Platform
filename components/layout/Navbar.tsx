'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Trophy,
  Users,
  Calendar,
  Sparkles,
  PlusCircle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Layers,
  Search,
  Shield,
  Menu,
  X,
  QrCode,
  Award,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeMode, switchMode, switchUser, availableUsers, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      title: 'Registration Confirmed! 🎟️',
      desc: 'Nexus AI Hackathon 2026 ticket is ready.',
      time: '10m ago',
      unread: true,
      link: '/my-events',
    },
    {
      id: '2',
      title: 'Teammate Joined 🤝',
      desc: 'Rohit joined your team NeuralCraft Syndicate.',
      time: '1h ago',
      unread: true,
      link: '/teams',
    },
    {
      id: '3',
      title: 'Hackathon Starts in 3 Days ⏳',
      desc: 'Get your development environment ready.',
      time: '1d ago',
      unread: false,
      link: '/events/nexus-ai-hackathon-2026',
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isHost = activeMode === 'HOST';

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090d16]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-[#090d16]/70 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-primary-500 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-white font-display">
                    Sushanti
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Pro
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 -mt-1 block font-medium">
                  Discover • Compete • Host
                </span>
              </div>
            </Link>

            {/* Quick Mode Indicator Switcher */}
            <div className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-full border border-slate-800 text-xs shadow-inner">
              <button
                onClick={() => {
                  switchMode('CONSUMER');
                  if (pathname.startsWith('/host')) router.push('/events');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                  !isHost
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Attend</span>
              </button>
              <button
                onClick={() => {
                  switchMode('HOST');
                  if (!pathname.startsWith('/host')) router.push('/host/dashboard');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                  isHost
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Host Mode</span>
              </button>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {!isHost ? (
              <>
                <Link
                  href="/events"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/events' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Explore Events
                </Link>
                <Link
                  href="/events?category=HACKATHON"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  Hackathons
                </Link>
                <Link
                  href="/teams"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/teams' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Find Teammates</span>
                </Link>
                <Link
                  href="/my-events"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/my-events' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>My Events</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/host/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/host/dashboard' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Console Overview
                </Link>
                <Link
                  href="/host/events/evt_nexus_ai_2026/overview"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  Nexus AI Manage
                </Link>
                <Link
                  href="/host/events/evt_nexus_ai_2026/scanner"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  <QrCode className="w-4 h-4 text-emerald-400" />
                  <span>QR Scanner</span>
                </Link>
                <Link
                  href="/host/events/evt_nexus_ai_2026/competition"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Judging</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:relative xl:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events, tracks, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:w-72 transition-all"
                />
              </div>
            </form>

            {/* Host Primary CTA Button */}
            {isHost ? (
              <Link
                href="/host/events/create"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:opacity-95 shadow-md shadow-amber-500/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  switchMode('HOST');
                  router.push('/host/events/create');
                }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-amber-300 border border-amber-500/30 hover:bg-slate-700/80 transition-all"
              >
                <span>Host an Event</span>
              </button>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-[#090d16]" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
                    <span className="font-semibold text-sm text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" /> Notifications
                    </span>
                    <button
                      onClick={() => {
                        setNotifications(notifications.map((n) => ({ ...n, unread: false })));
                      }}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => setNotifDropdownOpen(false)}
                        className={`block p-2.5 rounded-xl transition-colors ${
                          n.unread ? 'bg-indigo-950/40 border border-indigo-500/20' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs font-semibold text-white">{n.title}</p>
                          <span className="text-[10px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{n.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Google Sign-In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left"
                >
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10"
                  />
                  <div className="hidden md:block">
                    <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                      <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="text-[10px] text-indigo-400 capitalize">
                      {isHost ? 'Host Mode' : 'Attendee'}
                    </div>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50">
                    <div className="px-3 py-2 border-b border-slate-800 mb-2">
                      <p className="text-xs font-semibold text-white">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
                        Active: {activeMode} Mode
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Award className="w-4 h-4 text-amber-400" /> My Portfolio & Certificates
                      </Link>
                      <Link
                        href="/my-events"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Calendar className="w-4 h-4 text-indigo-400" /> My Tickets & Registrations
                      </Link>
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Shield className="w-4 h-4 text-rose-400" /> Super-Admin Moderation
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Switch / Add Google Account
                      </Link>
                    </div>

                    {/* Switch Persona Fast */}
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
                        Switch Persona:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 mb-2">
                        {availableUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={async () => {
                              await switchUser(u.id);
                              setUserDropdownOpen(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                              user?.id === u.id
                                ? 'bg-indigo-600 text-white font-medium'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <div className="truncate font-medium">{u.name.split(' ')[0]}</div>
                            <div className="text-[10px] opacity-75">{u.role}</div>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          router.push('/login');
                        }}
                        className="w-full mt-1 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 text-center font-medium"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-sm transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Platform Mode:</span>
            <div className="flex bg-slate-900 p-1 rounded-full border border-slate-800">
              <button
                onClick={() => {
                  switchMode('CONSUMER');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  !isHost ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Attend
              </button>
              <button
                onClick={() => {
                  switchMode('HOST');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isHost ? 'bg-amber-500 text-black font-semibold' : 'text-slate-400'
                }`}
              >
                Host
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Browse All Events
            </Link>
            <Link
              href="/teams"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Find Teammates
            </Link>
            <Link
              href="/my-events"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              My Tickets & Calendar
            </Link>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              My Portfolio
            </Link>
            <Link
              href="/host/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-300 hover:bg-slate-900"
            >
              Host Console
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-rose-300 hover:bg-slate-900"
            >
              Super-Admin
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 mt-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{user ? 'Manage Google Account' : 'Sign in with Google'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
