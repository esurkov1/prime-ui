import * as React from "react";

import { audioContextCtor, normalizePeaks, WAVEFORM_BARS } from "@/internal/audio";

/** What the record button records: a voice message, or a round video message. */
export type ComposerRecordMode = "voice" | "video";

/** A finished recording, handed to `onSendVoice` / `onSendVideoNote`. */
export type ComposerRecording = {
  /** The recorded media (`audio/webm`, `audio/mp4`… — whatever the browser records). */
  blob: Blob;
  /** Length of the recording in milliseconds. */
  durationMs: number;
  /** Loudness over the recording: `WAVEFORM_BARS` values, 0…1, to draw the message's waveform. */
  waveform: number[];
};

/** Why a recording could not start: the browser refused the device, found none, or failed. */
export type RecorderError = "denied" | "missing" | "failed";

/** `starting` — the press is answered, the device is not granted yet; `recording` — media flows. */
export type RecorderStatus = "idle" | "starting" | "recording";

/** Recordings shorter than this are dropped, like an accidental tap. */
export const MIN_RECORDING_MS = 700;
/** A round video message stops and sends itself at this length. */
export const VIDEO_MAX_MS = 60_000;
/** One level sample (one bar of the live waveform) per this many milliseconds. */
export const SAMPLE_MS = 100;

const AUDIO_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
const VIDEO_TYPES = ["video/webm;codecs=vp9,opus", "video/webm", "video/mp4"];

function hasMediaRecorder(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder === "function" &&
    typeof navigator !== "undefined" &&
    typeof navigator.mediaDevices?.getUserMedia === "function"
  );
}

/** Whether this browser can record `mode` at all (the record button hides otherwise). */
export function canRecord(mode: ComposerRecordMode): boolean {
  if (!hasMediaRecorder()) return false;
  if (mode === "voice") return true;
  // A round video message needs a camera preview: a `<video>` with a live stream.
  return typeof HTMLVideoElement !== "undefined" && "srcObject" in HTMLVideoElement.prototype;
}

function pickMimeType(mode: ComposerRecordMode): string | undefined {
  const types = mode === "voice" ? AUDIO_TYPES : VIDEO_TYPES;
  const isTypeSupported = window.MediaRecorder.isTypeSupported?.bind(window.MediaRecorder);
  if (!isTypeSupported) return undefined;
  return types.find((type) => isTypeSupported(type));
}

function errorKind(error: unknown): RecorderError {
  const name = error instanceof Error || error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "missing";
  return "failed";
}

/** Averages `samples` into `bars` buckets and scales the loudest to 1. */
export function toWaveform(samples: readonly number[], bars = WAVEFORM_BARS): number[] {
  if (samples.length === 0) return Array.from({ length: bars }, () => 0);
  const result: number[] = [];
  for (let i = 0; i < bars; i += 1) {
    const from = Math.floor((i * samples.length) / bars);
    const to = Math.max(from + 1, Math.floor(((i + 1) * samples.length) / bars));
    const slice = samples.slice(from, to);
    result.push(slice.reduce((sum, value) => sum + value, 0) / slice.length);
  }
  return normalizePeaks(result);
}

/**
 * The live side of a recording, read by the view every animation frame — never React state, so
 * the timer and the waveform cost no render.
 */
export type RecorderMeter = {
  mode: ComposerRecordMode;
  /** `performance.now()` of the press: the timer counts from here. */
  pressedAt: number;
  /** Loudness per `SAMPLE_MS`, 0…1, oldest first; empty until the device answers. */
  samples: number[];
  /** `performance.now()` of the last sample: the waveform scrolls between samples. */
  sampledAt: number;
  /** `performance.now()` of a pause in progress, or null: the timer and the waveform stand. */
  pausedAt: number | null;
  /** Milliseconds spent in finished pauses: the timer leaves them out. */
  pausedMs: number;
};

/** Milliseconds recorded by `now`: from the press, without the pauses. */
export function recordedMs(meter: RecorderMeter, now: number): number {
  const pausing = meter.pausedAt === null ? 0 : now - meter.pausedAt;
  return Math.max(0, now - meter.pressedAt - meter.pausedMs - pausing);
}

type Session = RecorderMeter & {
  stream: MediaStream | null;
  recorder: MediaRecorder | null;
  source: MediaStreamAudioSourceNode | null;
  chunks: Blob[];
  /** `performance.now()` when `MediaRecorder` started: the media's own length counts from here. */
  startedAt: number | null;
  timer: number | null;
  /** Set once the session is over: a late permission answer stops its stream at once. */
  closed: boolean;
};

export type Recorder = {
  status: RecorderStatus;
  mode: ComposerRecordMode;
  /** The camera stream of a video recording, for the round preview (null until granted). */
  stream: MediaStream | null;
  error: RecorderError | null;
  /** The live meter of the current recording, or null. Read it in an animation frame. */
  meter: () => RecorderMeter | null;
  /** Starts at once (`status` → `starting`) and asks for the device in parallel. */
  start: (mode: ComposerRecordMode, pressedAt?: number) => void;
  /** Ends the recording: `send` hands it over (when long enough), otherwise it is dropped. */
  stop: (send: boolean) => void;
  /** The recording is paused (`MediaRecorder.pause()`): no media, no samples, the timer stands. */
  paused: boolean;
  /** Pauses or resumes a recording whose media flows; false when it cannot (still starting). */
  setPaused: (paused: boolean) => boolean;
  clearError: () => void;
};

/**
 * Records a voice or a video message with `MediaRecorder`. `start` switches the state at once and
 * asks for the device in parallel; the loudness is metered through one `AnalyserNode` on one
 * `AudioContext` that lives as long as the composer (suspended between recordings). On
 * `stop(true)` the blob, its length and its waveform go to `onRecorded`. Permission errors come
 * back as `error`, never thrown. Only status changes render; the meter is read per frame.
 */
export function useRecorder(
  onRecorded: (mode: ComposerRecordMode, recording: ComposerRecording) => void,
): Recorder {
  const [status, setStatus] = React.useState<RecorderStatus>("idle");
  const [mode, setMode] = React.useState<ComposerRecordMode>("voice");
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [error, setError] = React.useState<RecorderError | null>(null);
  const [paused, setPausedState] = React.useState(false);
  const session = React.useRef<Session | null>(null);
  const audio = React.useRef<{ context: AudioContext; analyser: AnalyserNode } | null>(null);
  const onRecordedRef = React.useRef(onRecorded);
  onRecordedRef.current = onRecorded;

  /** The shared context, created (or resumed) inside the press so autoplay rules let it run. */
  const wakeAudio = React.useCallback(() => {
    if (!audio.current) {
      const Ctor = audioContextCtor();
      if (!Ctor) return null;
      try {
        const context = new Ctor();
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        audio.current = { context, analyser };
      } catch {
        return null;
      }
    }
    if (audio.current.context.state === "suspended") {
      void audio.current.context.resume?.().catch(() => {});
    }
    return audio.current;
  }, []);

  const teardown = React.useCallback((current: Session) => {
    current.closed = true;
    if (current.timer !== null) window.clearInterval(current.timer);
    try {
      current.source?.disconnect();
    } catch {
      // Already disconnected.
    }
    for (const track of current.stream?.getTracks() ?? []) track.stop();
    if (session.current === current) session.current = null;
    if (!session.current) void audio.current?.context.suspend?.().catch(() => {});
    setStatus("idle");
    setStream(null);
    setPausedState(false);
  }, []);

  const stop = React.useCallback(
    (send: boolean) => {
      const current = session.current;
      if (!current) return;
      const recorder = current.recorder;
      const now = performance.now();
      const durationMs =
        current.startedAt === null
          ? 0
          : recordedMs(current, now) - (current.startedAt - current.pressedAt);
      if (!recorder || recorder.state === "inactive") {
        teardown(current);
        return;
      }
      const keep = send && durationMs >= MIN_RECORDING_MS;
      recorder.addEventListener(
        "stop",
        () => {
          if (!keep) return;
          const type = recorder.mimeType || current.chunks[0]?.type || "";
          const blob = new Blob(current.chunks, type ? { type } : undefined);
          onRecordedRef.current(current.mode, {
            blob,
            durationMs: Math.round(durationMs),
            waveform: toWaveform(current.samples),
          });
        },
        { once: true },
      );
      recorder.stop();
      teardown(current);
    },
    [teardown],
  );

  const start = React.useCallback(
    (nextMode: ComposerRecordMode, pressedAt = performance.now()) => {
      if (session.current || !canRecord(nextMode)) return;
      const current: Session = {
        mode: nextMode,
        pressedAt,
        samples: [],
        sampledAt: pressedAt,
        stream: null,
        recorder: null,
        source: null,
        chunks: [],
        startedAt: null,
        pausedAt: null,
        pausedMs: 0,
        timer: null,
        closed: false,
      };
      session.current = current;
      setMode(nextMode);
      setError(null);
      setStatus("starting");
      const shared = wakeAudio();
      navigator.mediaDevices
        .getUserMedia(
          nextMode === "voice"
            ? { audio: true }
            : { audio: true, video: { facingMode: "user", aspectRatio: 1 } },
        )
        .then((media) => {
          if (current.closed) {
            for (const track of media.getTracks()) track.stop();
            return;
          }
          current.stream = media;
          const mimeType = pickMimeType(nextMode);
          const recorder = new MediaRecorder(media, mimeType ? { mimeType } : undefined);
          current.recorder = recorder;
          recorder.addEventListener("dataavailable", (event: BlobEvent) => {
            if (event.data.size > 0) current.chunks.push(event.data);
          });
          let analyser: AnalyserNode | null = null;
          if (shared) {
            try {
              current.source = shared.context.createMediaStreamSource(media);
              current.source.connect(shared.analyser);
              analyser = shared.analyser;
            } catch {
              analyser = null;
            }
          }
          const buffer = analyser ? new Float32Array(analyser.fftSize) : null;
          recorder.start();
          current.startedAt = performance.now();
          current.timer = window.setInterval(() => {
            // A paused recording takes no samples: the waveform stands where it stopped.
            if (current.pausedAt !== null) return;
            let value = 0;
            if (analyser && buffer) {
              analyser.getFloatTimeDomainData(buffer);
              let sum = 0;
              for (const sample of buffer) sum += sample * sample;
              // RMS, lifted so ordinary speech fills most of the height.
              value = Math.min(1, Math.sqrt(sum / buffer.length) * 4);
            }
            const now = performance.now();
            current.samples.push(value);
            current.sampledAt = now;
            if (current.mode === "video" && recordedMs(current, now) >= VIDEO_MAX_MS) stop(true);
          }, SAMPLE_MS);
          setStream(nextMode === "video" ? media : null);
          setStatus("recording");
        })
        .catch((reason: unknown) => {
          if (current.closed) return;
          teardown(current);
          setError(errorKind(reason));
        });
    },
    [teardown, stop, wakeAudio],
  );

  // Leaving the page mid-recording releases the microphone, the camera and the audio context.
  React.useEffect(
    () => () => {
      if (session.current) teardown(session.current);
      void audio.current?.context.close?.().catch(() => {});
      audio.current = null;
    },
    [teardown],
  );

  const meter = React.useCallback(() => session.current, []);
  const clearError = React.useCallback(() => setError(null), []);

  const setPaused = React.useCallback((next: boolean) => {
    const current = session.current;
    const recorder = current?.recorder;
    if (!current || !recorder || recorder.state === "inactive") return false;
    const now = performance.now();
    try {
      if (next && recorder.state === "recording") {
        recorder.pause();
        current.pausedAt = now;
      } else if (!next && recorder.state === "paused") {
        recorder.resume();
        if (current.pausedAt !== null) current.pausedMs += now - current.pausedAt;
        current.pausedAt = null;
        // The waveform scrolls on from here, not from the sample before the pause.
        current.sampledAt = now;
      } else {
        return false;
      }
    } catch {
      return false;
    }
    setPausedState(next);
    return true;
  }, []);

  return { status, mode, stream, error, meter, start, stop, paused, setPaused, clearError };
}
