import React from 'react';
import Link from 'next/link';
import { Sparkles, Github, Twitter, Linkedin, Heart, Shield, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070a12] text-slate-400 py-14 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-primary-500 to-amber-500 p-0.5">
                <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Sushanti
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The next-generation event discovery, registration, and hosting platform. Elevating hackathons, coding contests, case challenges, and conferences with AI-driven host tooling and delightful attendee experiences.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Explore Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/events?category=HACKATHON" className="hover:text-indigo-400 transition-colors">
                  Hackathons & Sprints
                </Link>
              </li>
              <li>
                <Link href="/events?category=CODING_CONTEST" className="hover:text-indigo-400 transition-colors">
                  Competitive Coding
                </Link>
              </li>
              <li>
                <Link href="/events?category=CASE_STUDY" className="hover:text-indigo-400 transition-colors">
                  Business Case Studies
                </Link>
              </li>
              <li>
                <Link href="/events?category=WORKSHOP" className="hover:text-indigo-400 transition-colors">
                  Workshops & Bootcamps
                </Link>
              </li>
              <li>
                <Link href="/events?category=MEETUP" className="hover:text-indigo-400 transition-colors">
                  Developer Meetups
                </Link>
              </li>
              <li>
                <Link href="/events?category=CULTURAL" className="hover:text-indigo-400 transition-colors">
                  College Cultural Fests
                </Link>
              </li>
            </ul>
          </div>

          {/* Host Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Host Tooling
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/host/events/create" className="hover:text-amber-400 transition-colors">
                  Create an Event
                </Link>
              </li>
              <li>
                <Link href="/host/dashboard" className="hover:text-amber-400 transition-colors">
                  Host Console & Analytics
                </Link>
              </li>
              <li>
                <Link href="/host/events/evt_nexus_ai_2026/scanner" className="hover:text-amber-400 transition-colors">
                  QR Scanner & Check-in
                </Link>
              </li>
              <li>
                <Link href="/host/events/evt_nexus_ai_2026/competition" className="hover:text-amber-400 transition-colors">
                  Judging Rubric Matrix
                </Link>
              </li>
              <li>
                <Link href="/verify/SUSH-2025-V792B" className="hover:text-amber-400 transition-colors">
                  Certificate Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/admin" className="hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Super Admin
                </Link>
              </li>
              <li>
                <a href="#terms" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy & Security</a>
              </li>
              <li>
                <a href="#brand" className="hover:text-indigo-400 transition-colors">Brand Assets</a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Sushanti Technologies Inc. Built with craftsmanship for India & Global Builders.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for builders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
