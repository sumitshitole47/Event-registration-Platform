'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Trophy,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth-context';

export default function EventCreateWizardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<any>({
    title: '',
    tagline: '',
    category: 'HACKATHON',
    mode: 'HYBRID',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    description: '',
    startDate: '',
    endDate: '',
    regStartDate: '',
    regEndDate: '',
    location: 'Bengaluru, India',
    venueAddress: '',
    minTeamSize: 1,
    maxTeamSize: 4,
    eligibilityCriteria: [
      'Open to college students & working professionals',
      'Teams can consist of 1 to 4 members',
    ],
    isPaid: false,
    ticketTiers: [
      { name: 'Standard Pass', price: 0, capacity: 500, perks: ['Full Hackathon Access', 'Mentorship Sessions'] },
    ],
    customFields: [
      { id: 'fld_github', label: 'GitHub Repository or Profile URL', type: 'text', required: true },
      { id: 'fld_discord', label: 'Discord Username', type: 'text', required: true },
    ],
    rounds: [
      { title: 'Round 1: Idea Pitch & Architecture', type: 'SUBMISSION', isElimination: false },
      { title: 'Round 2: Working MVP & Code Submission', type: 'SUBMISSION', isElimination: true },
      { title: 'Round 3: Grand Finale & Live Pitch', type: 'PRESENTATION', isElimination: false },
    ],
    prizePool: '₹3,00,000',
    prizes: [
      { title: '1st Place Winner', amount: '₹1,50,000', perks: 'Fast-track interview + Trophy' },
      { title: '2nd Place Runner Up', amount: '₹1,00,000', perks: 'Tech Gadgets Pack' },
      { title: '3rd Place Runner Up', amount: '₹50,000', perks: 'Certificate + Goodies' },
    ],
  });

  const steps = [
    'Basics',
    'Description & AI',
    'Dates & Logistics',
    'Eligibility & Team',
    'Ticketing',
    'Form Builder',
    'Rounds & Stages',
    'Prizes',
    'Review & Publish',
  ];

  // AI Description Assistant Trigger
  const handleGenerateAIDescription = async () => {
    if (!formData.title) {
      alert('Please enter an event title in Step 1 first!');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          ...formData,
          description: data.description,
          tagline: data.tagline || formData.tagline,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate || new Date(Date.now() + 7 * 86400000).toISOString(),
        endDate: formData.endDate || new Date(Date.now() + 9 * 86400000).toISOString(),
        regStartDate: formData.regStartDate || new Date().toISOString(),
        regEndDate: formData.regEndDate || new Date(Date.now() + 6 * 86400000).toISOString(),
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        confetti({ particleCount: 150, spread: 80 });
        router.push(`/events/${data.event.slug}`);
      } else {
        alert(data.error || 'Failed to publish event');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error creating event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Step Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/host/dashboard"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Host Console
          </Link>
          <span className="text-xs font-mono font-bold text-amber-400">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-amber-500 to-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
        
        {/* Step 1: Basics */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Event Basics</h2>
              <p className="text-xs text-slate-400 mt-1">Set the event title, category, and visual identity.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Genesis AI Hackathon 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Catchy Tagline *</label>
                <input
                  type="text"
                  placeholder="e.g. 36 Hours to Build the Next Generation of AI Systems"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="HACKATHON">Hackathon</option>
                    <option value="CODING_CONTEST">Coding Contest</option>
                    <option value="CASE_STUDY">Case Study</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="MEETUP">Meetup</option>
                    <option value="CULTURAL">Cultural Fest</option>
                    <option value="CONFERENCE">Conference</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Mode *</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="ONLINE">Online (Virtual)</option>
                    <option value="OFFLINE">Offline (In-Person)</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Banner Media Image URL</label>
                <input
                  type="text"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Description & AI */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Overview & Description</h2>
                <p className="text-xs text-slate-400 mt-1">Write your problem statement, tracks, and instructions.</p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAIDescription}
                disabled={aiGenerating}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-indigo-600 text-white hover:opacity-90 shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{aiGenerating ? 'AI Crafting...' : 'AI Auto-Generate'}</span>
              </button>
            </div>

            <div>
              <textarea
                rows={10}
                placeholder="Describe your event format, tracks, rules, and what builders will gain..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs font-mono leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Step 3: Dates & Logistics */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Dates & Venue</h2>
              <p className="text-xs text-slate-400 mt-1">Configure registration window and event duration.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Physical Venue / Address</label>
                <input
                  type="text"
                  placeholder="e.g. BIEC Hall 4, Bengaluru"
                  value={formData.venueAddress}
                  onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Eligibility & Team */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Eligibility & Team Limits</h2>
              <p className="text-xs text-slate-400 mt-1">Specify team size constraints and eligibility rules.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Minimum Team Size</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.minTeamSize}
                  onChange={(e) => setFormData({ ...formData, minTeamSize: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Maximum Team Size</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.maxTeamSize}
                  onChange={(e) => setFormData({ ...formData, maxTeamSize: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Ticketing */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Ticketing & Pricing</h2>
              <p className="text-xs text-slate-400 mt-1">Configure Free passes or Paid ticket tiers.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPaid: false })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  !formData.isPaid ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
                }`}
              >
                100% Free Event
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPaid: true })}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  formData.isPaid ? 'bg-amber-500 text-black' : 'bg-slate-950 text-slate-400'
                }`}
              >
                Paid Tickets
              </button>
            </div>

            {formData.isPaid && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <label className="block font-semibold text-slate-300">Standard Ticket Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 499"
                  onChange={(e) => {
                    const price = Number(e.target.value);
                    setFormData({
                      ...formData,
                      ticketTiers: [{ name: 'Standard Pass', price, capacity: 500 }],
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 6: Form Builder */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Registration Form Builder</h2>
              <p className="text-xs text-slate-400 mt-1">Add custom questions for attendees when they register.</p>
            </div>

            <div className="space-y-3">
              {formData.customFields.map((fld: any, i: number) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white">{fld.label}</span>
                    <span className="text-[10px] text-slate-500 ml-2">Type: {fld.type}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                    {fld.required ? 'Required' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Rounds */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Competition Stages & Rounds</h2>
              <p className="text-xs text-slate-400 mt-1">Structure elimination and demo day stages.</p>
            </div>

            <div className="space-y-3">
              {formData.rounds.map((r: any, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Round {i + 1}</span>
                    <h4 className="font-bold text-white mt-0.5">{r.title}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                    {r.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Prizes */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Prizes & Recognition</h2>
              <p className="text-xs text-slate-400 mt-1">Attract top talent with rewards and perks.</p>
            </div>

            <div className="text-xs space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Total Prize Pool Display</label>
                <input
                  type="text"
                  value={formData.prizePool}
                  onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-3">
                {formData.prizes.map((p: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{p.title}</span>
                      <span className="text-amber-400 font-extrabold">{p.amount}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{p.perks}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Review & Publish */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Review & Publish Event</h2>
              <p className="text-xs text-slate-400 mt-1">Confirm your event parameters before taking it live.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Title:</span>
                <span className="font-bold text-white">{formData.title || 'Untitled Event'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Category & Mode:</span>
                <span className="font-semibold text-indigo-400">{formData.category} ({formData.mode})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Prize Pool:</span>
                <span className="font-bold text-amber-400">{formData.prizePool}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Stages:</span>
                <span className="font-semibold text-white">{formData.rounds.length} Rounds</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20"
            >
              <span>Next: {steps[currentStep]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-xl shadow-emerald-500/20 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Event Live Now'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
