'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  Sparkles,
  Search,
  PlusCircle,
  CheckCircle2,
  Trophy,
  Filter,
  MessageSquare,
  Award,
  Send,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function TeamsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [posts, setPosts] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');
  
  // Post modal / form
  const [showPostModal, setShowPostModal] = useState(false);
  const [roleInput, setRoleInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [postSubmitting, setPostSubmitting] = useState(false);

  useEffect(() => {
    fetchTeammateData();
  }, [selectedSkill]);

  const fetchTeammateData = async () => {
    setLoading(true);
    try {
      // 1. Fetch AI Matchmaker recommendations
      const aiRes = await fetch('/api/ai/match-teammates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetSkills: selectedSkill === 'ALL' ? ['Frontend', 'AI/ML', 'Design'] : [selectedSkill],
          currentUserId: user?.id,
        }),
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        setCandidates(aiData.candidates || []);
      }

      // 2. Sample squad looking posts
      setPosts([
        {
          id: 'post_1',
          author: 'Alex Rivera',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          college: 'IIT Delhi',
          eventTitle: 'Nexus AI Hackathon 2026',
          rolesLookingFor: 'UI/UX Designer, Framer Motion Specialist',
          message: 'Building AgentFlow (autonomous multi-agent system). We have strong backend & ML pipelines; looking for a designer with high aesthetic taste to co-pitch!',
          skills: ['TypeScript', 'Python', 'Next.js'],
          teamName: 'NeuralCraft Syndicate',
        },
        {
          id: 'post_2',
          author: 'Rohit Verma',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          college: 'NID / DTU',
          eventTitle: 'DesignCraft UI/UX Sprint',
          rolesLookingFor: 'Frontend React / Next.js Engineer',
          message: 'Hey folks! I have designed 4 high-fidelity prototype flows in Figma for mobile banking. Looking for a fast frontend dev to implement interactive micro-interactions.',
          skills: ['Figma', 'UI/UX', 'Design Systems'],
          teamName: 'PixelForge',
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleInput.trim() || !messageInput.trim()) return;

    const newPost = {
      id: `post_${Date.now()}`,
      author: user?.name || 'You',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      college: user?.college || 'Engineering Institute',
      eventTitle: 'Nexus AI Hackathon 2026',
      rolesLookingFor: roleInput,
      message: messageInput,
      skills: user?.skills || ['Next.js', 'React'],
      teamName: 'Squad Open',
    };

    setPosts([newPost, ...posts]);
    setShowPostModal(false);
    setRoleInput('');
    setMessageInput('');
    alert('Teammate post published to board!');
  };

  const skillsFilters = ['ALL', 'Frontend', 'AI/ML', 'UI/UX', 'Python', 'Cloud'];

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Users className="w-4 h-4" /> Teammate Matchmaker & Squads
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Find Your Hackathon Teammates
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Connect with engineers, designers, and domain specialists to assemble winning teams.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Looking for Teammates</span>
        </button>
      </div>

      {/* AI Smart Matchmaker Showcase Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/40 border border-indigo-500/30 p-6 sm:p-8 space-y-4 shadow-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          <h2 className="text-lg font-bold text-white">AI Candidate Recommendations</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Smart Complementary Match
          </span>
        </div>
        <p className="text-xs text-slate-300">
          Our algorithm finds peers with skills that complement your profile for active competitions.
        </p>

        {/* Skill Filter Pills */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
          {skillsFilters.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSkill(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedSkill === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Candidate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
          {candidates.slice(0, 3).map((cand) => (
            <div
              key={cand.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={cand.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={cand.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{cand.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{cand.college}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-400 block">
                      {cand.matchScore}% Match
                    </span>
                    <span className="text-[9px] text-slate-500">AI Score</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {cand.skills?.slice(0, 3).map((sk: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => alert(`Invite sent to ${cand.name}!`)}
                className="w-full py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors"
              >
                Send Squad Invite
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Community "Looking for Team" Board */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-display">
          Active Squad Recruitment Posts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{post.author}</h4>
                    <p className="text-xs text-slate-400">{post.college}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {post.eventTitle}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-amber-400 font-semibold uppercase">Looking For:</span>
                <p className="text-xs font-bold text-white mt-0.5">{post.rolesLookingFor}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                "{post.message}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400">
                  Team: <strong className="text-white">{post.teamName}</strong>
                </span>
                <button
                  onClick={() => alert(`Request to join ${post.teamName} submitted!`)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Request to Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Post to Teammate Finder</h3>
            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Roles You Need *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UI/UX Designer, Python ML Engineer"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Brief Pitch / Message *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your project concept, tracks, or what skills you bring to the squad..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 text-black hover:bg-amber-400"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-16 max-w-7xl mx-auto px-4"><div className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" /></div>}>
      <TeamsContent />
    </Suspense>
  );
}
