'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Download,
  Share2,
  Printer,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatDate } from '@/lib/utils';

export default function CertificateVerificationPage() {
  const params = useParams();
  const certId = params?.certId as string;
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (certId) fetchCert();
  }, [certId]);

  const fetchCert = async () => {
    try {
      const res = await fetch(`/api/certificates?id=${certId}`);
      if (res.ok) {
        const data = await res.json();
        setCert(data.certificate);

        const qr = await QRCode.toDataURL(window.location.href, {
          margin: 1,
          width: 140,
          color: { dark: '#090d16', light: '#ffffff' },
        });
        setQrUrl(qr);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 max-w-3xl mx-auto px-4">
        <div className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Certificate Not Found</h2>
        <p className="text-slate-400 text-xs mt-1">
          No verified credential found for hash #{certId}.
        </p>
        <Link href="/events" className="mt-4 inline-block px-4 py-2 rounded-xl text-xs bg-indigo-600 text-white font-semibold">
          Explore Sushanti
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Verification Ribbon */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-300 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>
            <strong>Authenticity Verified:</strong> This credential was officially issued and recorded on the Sushanti platform.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Canvas Frame */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-4 border-amber-500/30 p-8 sm:p-14 shadow-2xl overflow-hidden print:bg-white print:text-black print:border-black">
        
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400/60" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400/60" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400/60" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400/60" />

        {/* Ambient radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6">
          
          {/* Organization / Sushanti Crest */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
              Certificate of Excellence
            </h4>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">
              Sushanti Verified Credential
            </p>
          </div>

          <div className="py-4">
            <p className="text-xs text-slate-400 italic">This is proudly presented to</p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 font-display">
              {cert.recipientName}
            </h1>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              for outstanding accomplishment, technical rigor, and securing
            </p>
            <p className="text-base sm:text-xl font-bold text-amber-400">
              {cert.rank || 'Official Distinction'}
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              in <strong>{cert.eventTitle}</strong> organized by{' '}
              <span className="text-white font-semibold">
                {cert.event?.host?.organizationName || 'Tech Host'}
              </span>
            </p>
          </div>

          {/* Signatures & QR Section */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Credential ID
              </span>
              <p className="text-xs font-mono font-bold text-amber-400">
                #{cert.verificationId}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Issued on {formatDate(cert.issuedAt)}
              </p>
            </div>

            {/* QR Verification Code */}
            {qrUrl && (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl shadow-md">
                <img src={qrUrl} alt="Verify QR" className="w-16 h-16 rounded" />
                <div className="text-[10px] text-slate-800 font-mono">
                  <p className="font-bold">Scan to Verify</p>
                  <p className="text-slate-500">sushanti.dev/verify</p>
                </div>
              </div>
            )}

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Issuing Authority
              </span>
              <p className="text-xs font-bold text-white">
                Sushanti Academic & Dev Council
              </p>
              <p className="text-[11px] text-indigo-400 font-semibold mt-0.5">
                Cryptographically Sealed
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
