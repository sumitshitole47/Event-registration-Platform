'use client';

import React, { useEffect, useState } from 'react';
import { playClickSound, isMuted, toggleMute } from '@/lib/sound-effects';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundEffectsProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());

    const handleSoundChange = (e: any) => {
      setMutedState(e.detail?.muted ?? isMuted());
    };

    window.addEventListener('sushanti_sound_change', handleSoundChange);

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Play soft click sound on interactive targets
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input[type="checkbox"]') ||
        target.closest('input[type="radio"]') ||
        target.closest('[role="button"]') ||
        target.closest('[role="tab"]')
      ) {
        playClickSound(0.09);
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });

    return () => {
      window.removeEventListener('sushanti_sound_change', handleSoundChange);
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);

  return <>{children}</>;
}

/**
 * Modern floating sound toggle button for the bottom/top bar
 */
export function SoundToggleButton({ className = '' }: { className?: string }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
    const handler = (e: any) => setMutedState(e.detail?.muted ?? isMuted());
    window.addEventListener('sushanti_sound_change', handler);
    return () => window.removeEventListener('sushanti_sound_change', handler);
  }, []);

  const handleToggle = () => {
    const next = toggleMute();
    setMutedState(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
        muted
          ? 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20'
      } ${className}`}
      title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
    >
      {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse" />}
      <span className="hidden sm:inline text-[11px]">{muted ? 'Muted' : 'Audio ON'}</span>
    </button>
  );
}
