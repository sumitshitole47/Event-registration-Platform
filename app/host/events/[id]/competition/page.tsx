'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  Star,
  ExternalLink,
  Github,
  CheckCircle2,
  Sliders,
  Send,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HostCompetitionJudgingPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [submissions, setSubmissions] = useState<any[]>([
    {
      id: 'sub_agentflow_ai',
      teamName: 'NeuralCraft Syndicate',
      title: 'AgentFlow: Multi-Agent Distributed Reasoning Mesh',
      tagline: 'Self-healing, multi-modal LLM agents with deterministic memory indexing',
      repoUrl: 'https://github.com/alexrivera-dev/agentflow-core',
      demoUrl: 'https://agentflow.dev',
      track: 'Autonomous Agents',
      status: 'SHORTLISTED',
      scores: {
        innovation: 9.5,
        execution: 9.0,
        design: 8.5,
        presentation: 9.0,
        total: 36.0,
        feedback: 'Outstanding architecture, clean tool dispatch, fast response times.',
      },
    },
    {
      id: 'sub_medivision_ai',
      teamName: 'BioHealth Labs',
      title: 'MediVision: Multi-Modal Radiology Diagnostics Assistant',
      tagline: 'Edge-optimized vision-language models for instant triage in rural clinics',
      repoUrl: 'https://github.com/biohealth/medivision',
      demoUrl: 'https://medivision-demo.org',
      track: 'Healthcare AI',
      status: 'SUBMITTED',
      scores: {
        innovation: 8.5,
        execution: 8.5,
        design: 8.0,
        presentation: 8.5,
        total: 33.5,
        feedback: 'Great domain grounding, strong clinical benchmark evaluation.',
      },
    },
    {
      id: 'sub_fraudshield',
      teamName: 'AlgoGuard Squad',
      title: 'FraudShield: Sub-50ms Graph Neural Network for UPI Fraud',
      tagline: 'Graph-based anomalous account detection with real-time alerting',
      repoUrl: 'https://github.com/algoguard/fraudshield',
      demoUrl: 'https://fraudshield-preview.dev',
      track: 'Fintech & Risk',
      status: 'SUBMITTED',
      scores: {
        innovation: 8.0,
        execution: 8.0,
        design: 7.5,
        presentation: 8.0,
        total: 31.5,
        feedback: 'Solid graph models, needs slightly more accessible dashboard UI.',
      },
    },
  ]);

  // Scoring Modal
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [innovation, setInnovation] = useState<number>(9);
  const [execution, setExecution] = useState<number>(9);
  const [design, setDesign] = useState<number>(8);
  const [presentation, setPresentation] = useState<number>(9);
  const [feedback, setFeedback] = useState<string>('');

  const handleOpenScoreModal = (sub: any) => {
    setSelectedSub(sub);
    if (sub.scores) {
      setInnovation(sub.scores.innovation || 8);
      setExecution(sub.scores.execution || 8);
      setDesign(sub.scores.design || 8);
      setPresentation(sub.scores.presentation || 8);
      setFeedback(sub.scores.feedback || '');
    }
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    const total = innovation + execution + design + presentation;
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === selectedSub.id) {
          return {
            ...s,
            scores: { innovation, execution, design, presentation, total, feedback },
          };
        }
        return s;
      })
    );

    setSelectedSub(null);
    alert('Score updated successfully!');
  };

  const handleDeclareWinners = () => {
    confetti({ particleCount: 200, spread: 90 });
    alert('Leaderboard rankings finalized! Winner certificates prepared.');
  };

  // Sort by score
  const rankedSubmissions = [...submissions].sort(
    (a, b) => (b.scores?.total || 0) - (a.scores?.total || 0)
  );

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href={`/host/events/${eventId}/overview`}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Command Center
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">
            Competition Judging Portal & Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grade team deliverables across 4 scoring rubrics and publish the live leaderboard.
          </p>
        </div>

        <button
          onClick={handleDeclareWinners}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all"
        >
          <Trophy className="w-4 h-4" />
          <span>Publish Official Results</span>
        </button>
      </div>

      {/* Submissions & Scoring Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <h2 className="text-lg font-bold text-white font-display">Team Submissions ({rankedSubmissions.length})</h2>

        <div className="space-y-4">
          {rankedSubmissions.map((sub, idx) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                {/* Rank Badge */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                    idx === 0
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                      : idx === 1
                      ? 'bg-slate-300 text-black'
                      : idx === 2
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  #{idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400">{sub.teamName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                      {sub.track}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-1">{sub.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">{sub.tagline}</p>

                  {/* Links */}
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    {sub.repoUrl && (
                      <a
                        href={sub.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-slate-400 hover:text-white"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code Repository</span>
                      </a>
                    )}
                    {sub.demoUrl && (
                      <a
                        href={sub.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Score Breakdown & Action */}
              <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Total Score</span>
                  <p className="text-xl font-extrabold text-amber-400">
                    {sub.scores ? `${sub.scores.total} / 40` : 'Ungraded'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Inn: {sub.scores?.innovation} | Exec: {sub.scores?.execution}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenScoreModal(sub)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Grade / Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubric Scoring Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Judging Evaluation
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedSub.teamName}: {selectedSub.title}
              </h3>
            </div>

            <form onSubmit={handleSaveScore} className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span>Innovation & Originality (25%)</span>
                  <span className="text-amber-400 font-bold">{innovation} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={innovation}
                  onChange={(e) => setInnovation(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span>Technical Depth & Execution (25%)</span>
                  <span className="text-amber-400 font-bold">{execution} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={execution}
                  onChange={(e) => setExecution(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span>UI/UX & Product Design (25%)</span>
                  <span className="text-amber-400 font-bold">{design} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={design}
                  onChange={(e) => setDesign(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span>Presentation & Impact (25%)</span>
                  <span className="text-amber-400 font-bold">{presentation} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={presentation}
                  onChange={(e) => setPresentation(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Judge Feedback & Notes
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Specific architectural observations, remarks, or highlights..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 text-black hover:bg-amber-400"
                >
                  Save Score ({innovation + execution + design + presentation}/40)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
