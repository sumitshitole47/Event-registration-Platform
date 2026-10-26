'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Trophy,
  Github,
  Linkedin,
  Twitter,
  Globe,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?userId=${user?.id || 'usr_alex'}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data.user);
        setCertificates(data.certificates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 max-w-4xl mx-auto px-4">
        <div className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
      </div>
    );
  }

  const u = profileData || user;
  let skills: string[] = [];
  let links: any = {};
  try {
    if (Array.isArray(u?.skills)) skills = u.skills;
    else if (typeof u?.skills === 'string') skills = JSON.parse(u.skills);
    if (typeof u?.links === 'object') links = u.links;
    else if (typeof u?.links === 'string') links = JSON.parse(u.links);
  } catch {}

  return (
    <div className="min-h-screen py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={u?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={u?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {u?.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Verified Builder
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{u?.headline}</p>
              <p className="text-xs text-slate-500 mt-0.5">{u?.college}</p>
            </div>
          </div>

          <button
            onClick={copyShareLink}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Portfolio'}</span>
          </button>
        </div>

        {/* Bio */}
        {u?.bio && (
          <p className="mt-6 text-xs text-slate-300 max-w-2xl leading-relaxed">
            {u.bio}
          </p>
        )}

        {/* Social Links */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {links.linkedin && (
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          )}
          {links.twitter && (
            <a
              href={links.twitter}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Twitter</span>
            </a>
          )}
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> Core Skills & Technologies
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Verifiable Credentials & Certificates */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Verifiable Achievements & Certificates
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically backed credentials verified on Sushanti with public URLs.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400">
            {certificates.length} Verified
          </span>
        </div>

        {certificates.length === 0 ? (
          <p className="text-xs text-slate-500">No certificates issued yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {cert.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      #{cert.verificationId}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{cert.eventTitle}</h4>
                  {cert.rank && (
                    <p className="text-xs font-semibold text-emerald-400 mt-1">{cert.rank}</p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-2">
                    Awarded on {formatDate(cert.issuedAt)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <Link
                    href={`/verify/${cert.verificationId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <span>View Public Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
