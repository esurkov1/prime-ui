import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { readCssLengthPx } from "@/hooks/usePosition";
import { cx } from "@/internal/cx";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { MorphText } from "@/internal/MorphText";
import {
  MEDIA_PLAYER_LABELS,
  type MediaPlayerLabels,
  type MediaPlayerProps,
  MediaPlayerRoot,
  type MediaPlayerRootProps,
  PlayDisk,
  splitMediaPlayerProps,
  TranscriptButton,
  UnplayedDot,
  useMediaPlayer,
} from "@/internal/mediaPlayer";
import { defineMessagePart, useMessagePart } from "@/internal/messagePart";
import press from "@/internal/press.module.css";
import textRole from "@/internal/textRole.module.css";
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
    waveform?: readonly number[];
    rate?: VoicePlayerRate;
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
  const [mediaProps, own] = splitMediaPlayerProps(props);
  const { src, unplayed = false } = mediaProps;
  const {
    waveform,
    rate: rateProp,
    defaultRate = 1,
    onRateChange,
    labels: labelsProp,
    className,
    ...rest
  } = own;
  const labels = useLabels(VOICE_PLAYER_LABELS, labelsProp);
  const { spacer } = useMessagePart();
  const [rate, setRate] = useControllableState<VoicePlayerRate>({
    value: rateProp,
    defaultValue: defaultRate,
    onChange: onRateChange,
  });

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const waveRef = React.useRef<HTMLDivElement>(null);
  // The played layer of the bars carries the share (`--vp-progress`), written every frame on it
  // alone, so a frame restyles that layer, nothing else.
  const playedRef = React.useRef<HTMLSpanElement>(null);
  // The transfer disk takes the play disk's place while the recording is on its way, failed or
  // not fetched yet.
  const player = useMediaPlayer(audioRef, mediaProps, labels, {
    rate,
    progressRef: playedRef,
    progressProperty: "--vp-progress",
  });
  const { state, position, seeking, transcript, disabled, covered, inactive } = player;
  const [barCount, setBarCount] = React.useState(DEFAULT_BARS);

  const total = Math.max(0, player.duration ?? 0);
  const playing = state === "playing";
  const showElapsed = playing || seeking || position > 0;
  const bars = React.useMemo(() => resample(waveform, barCount), [waveform, barCount]);

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
    // A drag holds a playing message for the seek and resumes it on release.
    player.scrub(true);
    player.seek(fractionAt(event.clientX) * total);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!seeking) return;
    player.seek(fractionAt(event.clientX) * total);
  };

  const endDrag = () => player.scrub(false);

  const cycleRate = () => {
    setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length] ?? 1);
  };

  const shownTime = showElapsed ? position : total;
  const rateText = formatRate(rate);
  const open = transcript?.expanded ?? false;

  return (
    <MediaPlayerRoot
      label={labels.player}
      player={player}
      {...rest}
      className={cx(styles.root, className)}
    >
      {/* A voice message has no captions: its controls are the player, its words the transcript. */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className={styles.audio}
        {...player.mediaEvents}
      />
      <div className={styles.row}>
        {/* The shared play disk in its solid look: the transfer is drawn on it — one look in a
            bubble and outside it. */}
        <PlayDisk
          look="solid"
          state={state}
          labels={labels}
          disabled={disabled}
          covered={covered}
          transferDisk={player.transferDisk}
          onToggle={player.toggle}
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
              onKeyDown={player.seekWithKey}
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
          <div className={cx(textRole.caption, styles.meta)}>
            <span className={styles.time} aria-hidden="true">
              {formatClock(shownTime)}
            </span>
            <UnplayedDot shown={unplayed} />
            {unplayed ? <VisuallyHidden>{labels.unplayed}</VisuallyHidden> : null}
            {/* Own button: Button's smallest tier is taller than the caption row it sits in. */}
            <button
              type="button"
              className={cx(touchTargetClass, press.pressCompact, styles.rate)}
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
    </MediaPlayerRoot>
  );
}

defineMessagePart(VoicePlayer, {
  shell: "fill",
  meta: "inline",
  text: ({ transcript }: VoicePlayerProps) => transcript ?? "",
});
