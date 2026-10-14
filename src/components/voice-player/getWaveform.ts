import { audioContextCtor, normalizePeaks, WAVEFORM_BARS } from "@/internal/audio";

/** The loudest sample of every channel in `[from, to)`. */
function peakOf(channels: readonly Float32Array[], from: number, to: number): number {
  let peak = 0;
  for (const data of channels) {
    for (let i = from; i < to; i += 1) {
      const level = Math.abs(data[i] ?? 0);
      if (level > peak) peak = level;
    }
  }
  return peak;
}

/**
 * The waveform of a recorded voice message that has no stored levels: decodes the audio (a `Blob`
 * or a URL) with the Web Audio API, takes the peak of each of `bars` slices and scales the loudest
 * to 1 — the same 0…1 array `Composer` hands to `onSendVoice`, ready for `VoicePlayer waveform`.
 * Rejects when the audio cannot be fetched or decoded, or the browser has no Web Audio.
 */
export async function getWaveform(
  source: Blob | string,
  bars: number = WAVEFORM_BARS,
): Promise<number[]> {
  const Ctor = audioContextCtor();
  if (!Ctor) throw new Error("Web Audio is not available");
  const count = Math.max(1, Math.floor(bars));
  const data =
    typeof source === "string"
      ? await fetch(source).then((response) => {
          if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
          return response.arrayBuffer();
        })
      : await source.arrayBuffer();
  const context = new Ctor();
  try {
    const buffer = await context.decodeAudioData(data);
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) =>
      buffer.getChannelData(index),
    );
    const length = buffer.length;
    const levels = Array.from({ length: count }, (_, i) => {
      const from = Math.floor((i * length) / count);
      const to = Math.max(from + 1, Math.floor(((i + 1) * length) / count));
      return peakOf(channels, from, Math.min(to, length));
    });
    return normalizePeaks(levels);
  } finally {
    context.close().catch(() => {});
  }
}
