import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { usePresence } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import enterMotion from "@/internal/enterMotion.module.css";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { MorphText } from "@/internal/MorphText";
import {
  MEDIA_PLAYER_LABELS,
  type MediaPlayerLabels,
  type MediaPlayerProps,
  type MediaPlayerRootProps,
  PlayDisk,
  seekByKey,
  splitMediaPlayerProps,
  TranscriptButton,
  useMediaPlayer,
} from "@/internal/mediaPlayer";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import { touchTargetBlockClass, touchTargetClass } from "@/internal/touchTarget";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

import styles from "./VoicePlayer.module.css";

export { getWaveform } from "./getWaveform";

/** Playback speeds the rate chip cycles through. */
export type VoicePlayerRate = 1 | 1.5 | 2;

const RATES: readonly VoicePlayerRate[] = [1, 1.5, 2];

/** The shared player strings and the voice message's own: the slider and the rate chip. */
export type VoicePlayerLabels = MediaPlayerLabels & {
  /** Name of the waveform slider. */
  seek: string;
  /** Name of the rate chip: `{rate}` as shown on it. */
  rate: string;
};

export const VOICE_PLAYER_LABELS: VoicePlayerLabels = {
  player: "Голосовое сообщение",
  play: "Воспроизвести голосовое сообщение",
  unplayed: "Не прослушано",
  seek: "Перемотка",
  rate: "Скорость воспроизведения: {rate}",
  ...MEDIA_PLAYER_LABELS,
};

/**
 * The shared player props (`MediaPlayerProps`, the same as VideoNote's) and what only a voice
 * message has: its waveform (the seek is drawn on it) and the speed chip (a recording of speech is
 * listened to faster; a round video is watched as a face at its own pace — VideoNote has no rate).
 */
export type VoicePlayerProps = MediaPlayerRootProps &
  MediaPlayerProps & {
    /** Levels 0…1 from data, resampled to the bars that fit the width. Without it: a calm flat row. */
    waveform?: readonly number[];
    /** Playback speed (controlled). */
    rate?: VoicePlayerRate;
    /** Initial playback speed (uncontrolled). Default `1`. */
    defaultRate?: VoicePlayerRate;
    onRateChange?: (rate: VoicePlayerRate) => void;
    labels?: Partial<VoicePlayerLabels>;
  };

/** Bars before the width is known (and in environments without layout). */
const DEFAULT_BARS = 40;
const MIN_BARS = 8;
/** Level of every bar without waveform data. */
const FLAT_LEVEL = 0.12;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Bars that fit `width`: a bar is `--prime-space-1 × 0.75` wide with a `--prime-space-1 / 2` gap
 * (the CSS of the bars and the Composer's live wave). Plain arithmetic on the observed width.
 */
function barsFor(width: number): number {
  const unit = readCssLengthPx("--prime-space-1", 4);
  const bar = unit * 0.75;
  const gap = unit / 2;
  return Math.max(MIN_BARS, Math.floor((width + gap) / (bar + gap)));
}

/** `1×`, `1,5×`, `2×` — Russian decimal comma. */
function formatRate(rate: number): string {
  return `${String(rate).replace(".", ",")}×`;
}

/** Levels resampled to `count` bars: each bar is the peak of its slice (or the nearest level). */
function resample(levels: readonly number[] | undefined, count: number): number[] {
  if (!levels || levels.length === 0) return Array.from({ length: count }, () => FLAT_LEVEL);
  return Array.from({ length: count }, (_, i) => {
    const start = Math.floor((i * levels.length) / count);
    const end = Math.max(start + 1, Math.floor(((i + 1) * levels.length) / count));
    let peak = 0;
    for (let j = start; j < end; j += 1) peak = Math.max(peak, levels[j] ?? 0);
    return clamp(Number.isFinite(peak) ? peak : 0, 0, 1);
  });
}

/** One row of bars; the played layer is the same row clipped by `--vp-progress`. */
function Bars({
  levels,
  className,
  ref,
}: {
  levels: number[];
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <span ref={ref} className={cx(styles.bars, className)} aria-hidden="true">
      {levels.map((level, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: bars are positions on the time axis
          key={i}
          className={styles.bar}
          style={{ "--vp-level": level } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

/**
 * A voice message: a round play disk, a waveform that is the seek slider, and the time with the
 * playback speed. Plays one at a time on the page. With `transcript` or `onTranscribe` a button at
 * the waveform's end opens the text under the player. As the last part of a chat message it keeps
 * the meta's room at the end of its time row, or of the transcript while that is open.
 */
export function VoicePlayer(props: VoicePlayerProps) {
  const [player, own] = splitMediaPlayerProps(props);
  const { src, duration: durationProp, unplayed = false } = player;
  const {
    waveform,
    rate: rateProp,
    defaultRate = 1,
    onRateChange,
    labels: labelsProp,
    className,
    ref,
    ...rest
  } = own;
  const labels = useLabels(VOICE_PLAYER_LABELS, labelsProp);
  const { spacer } = useMessagePart();
  const [rate, setRate] = useControllableState<VoicePlayerRate>({
    value: rateProp,
    defaultValue: defaultRate,
    onChange: onRateChange,
  });

  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const waveRef = React.useRef<HTMLDivElement>(null);
  const playedRef = React.useRef<HTMLSpanElement>(null);
  /** Playback paused for a drag, resumed on release. */
  const resumeAfterDrag = React.useRef(false);
  const seekingRef = React.useRef(false);

  /** What the media does now; `wanted` is the triad, which may lead it (a play still starting). */
  const [playing, setMediaPlaying] = React.useState(false);
  // The transfer disk takes the play disk's place while the recording is on its way, failed or
  // not fetched yet.
  const { wanted, setWanted, transcript, disabled, covered, inactive, transferDisk } =
    useMediaPlayer(audioRef, player, labels);
  const [seeking, setSeeking] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [mediaDuration, setMediaDuration] = React.useState<number | null>(null);
  const [barCount, setBarCount] = React.useState(DEFAULT_BARS);

  const total = mediaDuration ?? Math.max(0, durationProp ?? 0);
  const showElapsed = playing || seeking || position > 0;
  const bars = React.useMemo(() => resample(waveform, barCount), [waveform, barCount]);
  const dot = usePresence(unplayed, { exitDuration: "fast" });

  /**
   * Played share of the waveform, painted without a render (every frame while playing): one CSS
   * variable on the played layer alone, so a frame restyles that layer, nothing else.
   */
  const paint = React.useCallback(
    (seconds: number) => {
      playedRef.current?.style.setProperty(
        "--vp-progress",
        String(total > 0 ? clamp(seconds / total, 0, 1) : 0),
      );
    },
    [total],
  );

  React.useLayoutEffect(() => {
    if (!playing) paint(position);
  }, [playing, position, paint]);

  // While playing: the bars every frame; the clock (a render) only when its second changes.
  React.useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        const now = audio.currentTime;
        paint(now);
        setPosition((prev) => (Math.floor(prev) === Math.floor(now) ? prev : now));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, paint]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = rate;
  }, [rate]);

  // Bars of a fixed width and gap fill the waveform: their count follows its observed width.
  React.useEffect(() => {
    const wave = waveRef.current;
    if (!wave || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      if (width > 0) setBarCount(barsFor(width));
    });
    observer.observe(wave);
    return () => observer.disconnect();
  }, []);

  // The triad drives the media: a `playing` from the owner (or `defaultPlaying`) plays or pauses.
  // biome-ignore lint/correctness/useExhaustiveDependencies: follows the wanted state only
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seekingRef.current) return;
    if (wanted && audio.paused && !inactive) {
      audio.play()?.catch(() => setWanted(false));
    } else if (!wanted && !audio.paused) {
      audio.pause();
    }
  }, [wanted]);

  const seek = (seconds: number) => {
    const next = clamp(seconds, 0, total);
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.currentTime = next;
      } catch {
        // No media loaded yet: the position still moves and applies on play.
      }
    }
    setPosition(next);
    paint(next);
  };

  const refused = () => {
    setMediaPlaying(false);
    setWanted(false);
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || inactive) return;
    // Played and paused right here, inside the press: browsers allow sound only from a gesture.
    if (audio.paused) {
      if (Math.abs(audio.currentTime - position) > 0.25) audio.currentTime = position;
      audio.play()?.catch(refused);
    } else {
      audio.pause();
    }
  };

  const handleMediaPlay = () => {
    setMediaPlaying(true);
    setWanted(true);
  };

  const handleMediaPause = () => {
    setMediaPlaying(false);
    // A drag pauses for the seek and resumes: the person still listens.
    if (!seekingRef.current) setWanted(false);
  };

  // The end is a full reset: stopped, back at the start (the bars glide empty), the total time and
  // the play glyph again; the session was released by the pause / end of the element.
  const handleMediaEnded = () => {
    setMediaPlaying(false);
    setWanted(false);
    seek(0);
    player.onEnded?.();
  };

  const handleMetadata = () => {
    const value = audioRef.current?.duration;
    if (value !== undefined && Number.isFinite(value) && value > 0) setMediaDuration(value);
  };

  const fractionAt = (clientX: number) => {
    const wave = waveRef.current;
    if (!wave) return 0;
    const rect = wave.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const share = clamp((clientX - rect.left) / rect.width, 0, 1);
    return getComputedStyle(wave).direction === "rtl" ? 1 - share : share;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (inactive || total <= 0 || event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const audio = audioRef.current;
    resumeAfterDrag.current = Boolean(audio && !audio.paused);
    seekingRef.current = true;
    if (resumeAfterDrag.current) audio?.pause();
    setSeeking(true);
    seek(fractionAt(event.clientX) * total);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!seeking) return;
    seek(fractionAt(event.clientX) * total);
  };

  const endDrag = () => {
    if (!seeking) return;
    setSeeking(false);
    seekingRef.current = false;
    if (resumeAfterDrag.current) audioRef.current?.play()?.catch(refused);
    resumeAfterDrag.current = false;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (inactive) return;
    const current =
      audioRef.current && !audioRef.current.paused ? audioRef.current.currentTime : position;
    const next = seekByKey(event, current, total);
    if (next === null) return;
    event.preventDefault();
    seek(next);
  };

  const cycleRate = () => {
    setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length] ?? 1);
  };

  const shownTime = showElapsed ? position : total;
  const rateText = formatRate(rate);
  const open = transcript?.expanded ?? false;

  return (
    // biome-ignore lint/a11y/useSemanticElements: a media player's controls, not a form fieldset
    <div
      role="group"
      aria-label={labels.player}
      {...rest}
      ref={mergedRef}
      className={cx(styles.root, className)}
      {...toDataAttributes({
        playing: playing || undefined,
        seeking: seeking || undefined,
        disabled: disabled || undefined,
        transfer: covered || undefined,
      })}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: a voice message has no captions; its controls are the player */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className={styles.audio}
        onPlay={handleMediaPlay}
        onPause={handleMediaPause}
        onEnded={handleMediaEnded}
        onLoadedMetadata={handleMetadata}
        onDurationChange={handleMetadata}
      />
      <div className={styles.row}>
        {/* The shared play disk in its solid look: the transfer is drawn on it — one look in a
            bubble and outside it. */}
        <PlayDisk
          look="solid"
          state={playing ? "playing" : position > 0 ? "paused" : "idle"}
          labels={labels}
          disabled={disabled}
          covered={covered}
          transferDisk={transferDisk}
          onToggle={toggle}
        />
        <div className={styles.body}>
          <div className={styles.waveLine}>
            <div
              ref={waveRef}
              role="slider"
              tabIndex={inactive ? -1 : 0}
              aria-label={labels.seek}
              aria-valuemin={0}
              aria-valuemax={Math.round(total)}
              aria-valuenow={Math.round(position)}
              aria-valuetext={formatLabel(labels.position, {
                current: formatClock(position),
                duration: formatClock(total),
              })}
              aria-disabled={inactive || undefined}
              className={cx(touchTargetBlockClass, styles.wave)}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onKeyDown={handleKeyDown}
            >
              <Bars levels={bars} />
              <Bars ref={playedRef} levels={bars} className={styles.played} />
            </div>
            {transcript ? (
              <TranscriptButton
                transcript={transcript}
                disabled={disabled}
                className={styles.transcribe}
              />
            ) : null}
          </div>
          <div className={styles.meta}>
            <span className={styles.time} aria-hidden="true">
              {formatClock(shownTime)}
            </span>
            {dot.mounted ? (
              <span
                className={cx(styles.dot, enterMotion.enter)}
                data-state={dot.state}
                onAnimationEnd={dot.onExitEnd}
                aria-hidden="true"
              />
            ) : null}
            {unplayed ? <VisuallyHidden>{labels.unplayed}</VisuallyHidden> : null}
            {/* Own button: Button's smallest tier is taller than the caption row it sits in. */}
            <button
              type="button"
              className={cx(touchTargetClass, styles.rate)}
              aria-label={formatLabel(labels.rate, { rate: rateText })}
              disabled={inactive}
              onClick={cycleRate}
            >
              <MorphText>{rateText}</MorphText>
            </button>
            {open ? null : spacer}
          </div>
        </div>
      </div>
      {transcript?.region({ spacer: open ? spacer : null })}
    </div>
  );
}

defineMessagePart(VoicePlayer, {
  shell: "fill",
  meta: "inline",
  text: ({ transcript }: VoicePlayerProps) => transcript ?? "",
});
