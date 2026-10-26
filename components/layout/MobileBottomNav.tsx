'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Users, Calendar, Award, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { activeMode } = useAuth();
  const isHost = activeMode === 'HOST';

  if (isHost) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
        <div className="flex items-center justify-around">
          <Link
            href="/host/dashboard"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              pathname === '/host/dashboard' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Console</span>
          </Link>
          <Link
            href="/host/events/create"
            className="flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-amber-400"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center -mt-3 shadow-md shadow-amber-500/30">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span>Create</span>
          </Link>
          <Link
            href="/host/events/evt_nexus_ai_2026/scanner"
            className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
              pathname.includes('/scanner') ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">📷</div>
            <span>Scanner</span>
          </Link>
          <Link
            href="/events"
            className="flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-slate-400"
          >
            <Compass className="w-5 h-5" />
            <span>Explore</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
      <div className="flex items-center justify-around">
        <Link
          href="/events"
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            pathname === '/events' || pathname === '/' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </Link>
        <Link
          href="/teams"
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            pathname === '/teams' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Teammates</span>
        </Link>
        <Link
          href="/my-events"
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            pathname === '/my-events' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>My Events</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
            pathname === '/profile' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Award className="w-5 h-5" />
          <span>Portfolio</span>
        </Link>
      </div>
    </nav>
  );
}
