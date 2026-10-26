/**
 * Web Audio API Sound Effects Engine for Sushanti
 * Mathematically synthesized zero-latency UI audio (no external mp3/wav files required)
 */

let audioCtx: AudioContext | null = null;
let isSoundMuted = false;

// Initialize AudioContext lazily on user gesture
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isMuted(): boolean {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sushanti_sound_muted');
    if (saved !== null) {
      isSoundMuted = saved === 'true';
    }
  }
  return isSoundMuted;
}

export function setMuted(muted: boolean): void {
  isSoundMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('sushanti_sound_muted', String(muted));
    window.dispatchEvent(new CustomEvent('sushanti_sound_change', { detail: { muted } }));
  }
}

export function toggleMute(): boolean {
  const next = !isMuted();
  setMuted(next);
  if (!next) {
    // Play a friendly confirmation chirp
    playClickSound();
  }
  return next;
}

/**
 * Modern soft tactile UI click / pop sound
 */
export function playClickSound(volume = 0.15): void {
  if (isMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    // Pitch sweep: 850Hz down to 220Hz in 45ms (modern Apple/Linear pop)
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

    // Gain envelope
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  } catch (err) {
    // Audio contexts may be blocked prior to first interaction
  }
}

/**
 * Gentle acoustic swoosh for tab switches & navigation
 */
export function playTabSound(volume = 0.12): void {
  if (isMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch (err) {}
}

/**
 * Uplifting melodic chime / arpeggio for confirmations, ticket minting, and celebration
 */
export function playSuccessSound(): void {
  if (isMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major arpeggio)
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * 0.07;
      const duration = 0.22;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.14, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {}
}

/**
 * High-tech crisp toggle sound
 */
export function playToggleSound(volume = 0.12): void {
  if (isMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.035);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch (err) {}
}

/**
 * Ambient soft pop when opening a modal or drawer
 */
export function playModalSound(volume = 0.14): void {
  if (isMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;

    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (err) {}
}
