'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Github,
  ExternalLink,
  Upload,
  CheckCircle2,
  Send,
  Sparkles,
  Layers,
  FileCode,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth-context';

export default function AttendeePortalPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'submit' | 'status' | 'announcements'>('submit');
  const [title, setTitle] = useState('AgentFlow: Multi-Agent Distributed Reasoning Mesh');
  const [tagline, setTagline] = useState('Self-healing, multi-modal LLM agents with deterministic memory indexing');
  const [repoUrl, setRepoUrl] = useState('https://github.com/alexrivera-dev/agentflow-core');
  const [demoUrl, setDemoUrl] = useState('https://agentflow.dev');
  const [track, setTrack] = useState('Autonomous Agents');
  const [submitted, setSubmitted] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    confetti({ particleCount: 120, spread: 70 });
    alert('Project submission recorded! Good luck with judging.');
  };

  return (
    <div className="min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/events/${slug}`}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Event Page
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            Competitor Workspace & Project Submission
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit your codebase, live demo, and review judge evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Registered: Squad NeuralCraft
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'submit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Project Deliverables
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'status'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Round Status & Scores
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Organizer Announcements
        </button>
      </div>

      {/* Tab: Project Deliverables */}
      {activeTab === 'submit' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Submit MVP Deliverable</h2>
            <p className="text-xs text-slate-400 mt-1">
              Provide your public GitHub repo, deployment URL, and architectural details for the jury.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Short Tagline *</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">GitHub Repo URL *</label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Live Demo Link *</label>
                <input
                  type="url"
                  required
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Track *</label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Autonomous Agents">Track 1: Autonomous Agents</option>
                <option value="Healthcare AI">Track 2: Healthcare AI</option>
                <option value="Fintech & Risk">Track 3: Fintech & Risk</option>
                <option value="Developer Supertools">Track 4: Developer Supertools</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Update / Save Project Deliverable</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: Status & Scores */}
      {activeTab === 'status' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-display">Evaluation Status</h2>
              <p className="text-xs text-slate-400 mt-1">Official scores and feedback from jury mentors.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Shortlisted for Finale! 🚀
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-400">Total Jury Score</span>
              <span className="text-2xl font-extrabold text-amber-400">36.0 / 40.0</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-500 uppercase">Innovation</span>
                <p className="text-sm font-bold text-white mt-1">9.5 / 10</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-500 uppercase">Execution</span>
                <p className="text-sm font-bold text-white mt-1">9.0 / 10</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-500 uppercase">Design / UX</span>
                <p className="text-sm font-bold text-white mt-1">8.5 / 10</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900">
                <span className="text-[10px] text-slate-500 uppercase">Pitch</span>
                <p className="text-sm font-bold text-white mt-1">9.0 / 10</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="font-bold text-amber-400 block mb-1">Judge Feedback:</span>
              <p className="text-slate-300 leading-relaxed">
                "Outstanding technical depth, exceptional architecture modularity, and smooth CLI demo. Highly competitive for 1st place!"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Announcements */}
      {activeTab === 'announcements' && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4 shadow-2xl">
          <h2 className="text-lg font-bold text-white font-display">Organizer Broadcasts</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-[10px] font-bold text-amber-400 uppercase">Official Broadcast</span>
              <h4 className="font-bold text-white mt-1">Grand Finale Pitch Schedule Released!</h4>
              <p className="text-slate-400 mt-1">
                Top 10 shortlisted squads will present live at 4:00 PM IST on Saturday. Ensure screen share permissions are enabled.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
