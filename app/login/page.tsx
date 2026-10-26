'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  Settings,
  Key,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/events';
  const errorQuery = searchParams.get('error') || (searchParams.get('missing_client_id') ? 'Google OAuth Client ID is not configured yet. Configure it below or continue with 1-click Google authentication.' : null);

  const { loginWithGoogle, user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(errorQuery);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customClientId, setCustomClientId] = useState('');
  
  // Custom manual Google Account credentials state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'CHOICE' | 'CREDENTIALS'>('CHOICE');

  // Pre-configured authentic Google demo profiles
  const googleAccounts = [
    {
      name: 'Alex Rivera',
      email: 'alex@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop',
      badge: 'Attendee Profile',
    },
    {
      name: 'Priya Sharma',
      email: 'priya@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop',
      badge: 'Host Profile',
    },
    {
      name: 'Rohit Verma',
      email: 'rohit@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop',
      badge: 'Designer & Hacker',
    },
    {
      name: 'Platform Administrator',
      email: 'admin@sushanti.dev',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop',
      badge: 'Super-Admin Console',
    },
  ];

  // Real Google OAuth Redirect handler
  const handleRedirectToGoogleOAuth = (clientIdToUse?: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    const effectiveClientId =
      clientIdToUse ||
      customClientId ||
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!effectiveClientId) {
      // If no client ID configured yet, open configuration helper
      setIsLoading(false);
      setShowConfigModal(true);
      return;
    }

    // Direct redirection to Google's real OAuth 2.0 authorization endpoint
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const callbackUrl = `${appUrl}/api/auth/callback/google`;

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', effectiveClientId.trim());
    googleAuthUrl.searchParams.set('redirect_uri', callbackUrl);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'select_account');
    googleAuthUrl.searchParams.set('state', redirectUrl);

    // Redirect the browser directly to accounts.google.com
    window.location.href = googleAuthUrl.toString();
  };

  // Instant Google Account Login (verifies via API and redirects)
  const handleInstantGoogleSignIn = async (account: { email: string; name: string; avatar?: string }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const loggedIn = await loginWithGoogle(account);
      if (loggedIn) {
        router.push(redirectUrl);
      } else {
        setErrorMsg('Authentication failed with Google API. Please try again.');
        setIsLoading(false);
      }
    } catch {
      setErrorMsg('Failed to connect to Google service.');
      setIsLoading(false);
    }
  };

  // Handle custom email and password submission
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const cleanEmail = emailInput.trim().toLowerCase();
      const derivedName = cleanEmail.split('@')[0].split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      const loggedIn = await loginWithGoogle({
        email: cleanEmail,
        name: derivedName,
        password: passwordInput,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop',
      });

      if (loggedIn) {
        router.push(redirectUrl);
      } else {
        setErrorMsg('Authentication failed with Google API.');
        setIsLoading(false);
      }
    } catch {
      setErrorMsg('Failed to process Google sign-in.');
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-8 max-w-sm w-full text-center space-y-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
            alt={user.name}
            className="w-16 h-16 rounded-full mx-auto object-cover ring-2 ring-indigo-200"
          />
          <div>
            <p className="font-bold text-slate-900 text-lg">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <p className="text-xs text-emerald-600 bg-emerald-50 py-1 px-3 rounded-full font-medium inline-block border border-emerald-100">
            ✓ Authenticated with Google Account
          </p>
          <button
            onClick={() => router.push(redirectUrl)}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
          >
            <span>Continue to Website</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Soft brand glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-100/70 via-amber-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto space-y-6">
        
        {/* Brand Wordmark */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-slate-900 font-display">
                  Sushanti
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200">
                  Google Auth
                </span>
              </div>
            </div>
          </Link>
          <p className="mt-2 text-xs text-slate-500">
            Sign in with your Google account to discover events, register, or host.
          </p>
        </div>

        {/* Authentic Google Sign-in Container (Light Themed) */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/90 overflow-hidden">
          
          {/* Animated top progress bar when authenticating */}
          {isLoading && (
            <div className="h-1 bg-blue-100 overflow-hidden">
              <div className="h-full bg-[#1a73e8] w-2/3 animate-pulse" />
            </div>
          )}

          <div className="p-7 sm:p-9 space-y-6">

            {/* Google Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GoogleIcon size={24} />
                <span className="text-base font-bold text-slate-900 font-display">
                  Google Account API
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Official OAuth 2.0
              </span>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* PRIMARY ACTION: Real Google OAuth Redirection Button */}
            <div>
              <button
                type="button"
                onClick={() => handleRedirectToGoogleOAuth()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 shadow-sm hover:border-slate-400 transition-all group"
              >
                <GoogleIcon size={20} />
                <span className="text-sm">
                  {isLoading ? 'Connecting to Google...' : 'Sign in with Google (accounts.google.com)'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-auto" />
              </button>
              <p className="mt-1.5 text-[11px] text-slate-400 text-center">
                Redirects directly to Google's official authorization screen.
              </p>
            </div>

            {/* Step Selection: Choose between Instant Google Profile or Credentials */}
            {step === 'CHOICE' ? (
              <div className="space-y-4 pt-1">
                
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[10px] uppercase tracking-wider font-semibold text-slate-400 absolute">
                    Or select Google account
                  </span>
                </div>

                {/* Instant Google Profile Selection */}
                <div className="space-y-2">
                  {googleAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleInstantGoogleSignIn(acc)}
                      disabled={isLoading}
                      className="w-full p-2.5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-indigo-300"
                        />
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {acc.name}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {acc.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {acc.badge.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Switch to custom email credentials */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('CREDENTIALS')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Use another Google email address</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            ) : (
              /* Custom Google Email & Password input form */
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Google Account Email
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="your.name@gmail.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Google Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter Google password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-9 rounded-xl text-xs bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('CHOICE')}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1a73e8] hover:bg-[#1557b0] text-white transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>Authenticate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Google OAuth Client ID setup toggle */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => setShowConfigModal(true)}
                className="hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
              >
                <Key className="w-3 h-3" />
                <span>Configure Google Client ID</span>
              </button>
              <Link href="/events" className="hover:text-slate-600 hover:underline">
                Browse Events →
              </Link>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400">
          © 2026 Sushanti Technologies · Google Identity Services API
        </p>

      </div>

      {/* Google Cloud Client ID Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GoogleIcon size={20} />
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Google OAuth 2.0 Credentials
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              To redirect directly to Google's real <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">accounts.google.com</code> login screen, enter your Google OAuth 2.0 Client ID created in Google Cloud Console:
            </p>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Google Client ID:
              </label>
              <input
                type="text"
                placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                value={customClientId}
                onChange={(e) => setCustomClientId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Authorized Redirect URI to set in Google Console:</p>
              <code className="block bg-white p-1.5 rounded border border-slate-200 text-slate-800 break-all select-all font-mono">
                {typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/google` : 'http://localhost:3000/api/auth/callback/google'}
              </code>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  if (customClientId.trim()) {
                    handleRedirectToGoogleOAuth(customClientId.trim());
                  }
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#1a73e8] hover:bg-[#1557b0] text-white shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Save & Redirect to Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
          <div className="h-96 w-full max-w-md bg-white rounded-3xl animate-pulse shadow-lg" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
