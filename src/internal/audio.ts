/**
 * The audio helpers a recording and its playback share (Composer's recorder, VoicePlayer's
 * `getWaveform`): the Web Audio constructor, the length of a voice message's waveform and the
 * scaling of its levels.
 */

/** Bars in a voice message's `waveform`: what the recorder hands over and `getWaveform` returns. */
export const WAVEFORM_BARS = 48;

type AudioContextCtor = typeof AudioContext;

/** The browser's `AudioContext` (or Safari's prefixed one), `undefined` without Web Audio. */
export function audioContextCtor(): AudioContextCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const prefixed = window as Window & { webkitAudioContext?: AudioContextCtor };
  return window.AudioContext ?? prefixed.webkitAudioContext;
}

/** Levels scaled so the loudest is 1, rounded to hundredths; all-silent levels stay as they are. */
export function normalizePeaks(levels: readonly number[]): number[] {
  const loudest = Math.max(0, ...levels);
  return loudest > 0
    ? levels.map((level) => Math.round((level / loudest) * 100) / 100)
    : [...levels];
}
