import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon, type IconName } from "@/icons";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { useMediaSession } from "@/internal/mediaSession";
import { usePartPresence } from "@/internal/partPresence";
import {
  TRANSCRIPT_LABELS,
  type Transcript,
  type TranscriptLabels,
  type TranscriptProps,
  useTranscript,
} from "@/internal/transcript";
import {
  TRANSFER_LABELS,
  type TransferDirection,
  type TransferHandler,
  type TransferLabels,
  type TransferProps,
  type TransferState,
  transferCovers,
  transferDiskLabels,
} from "@/internal/transfer";
import { type TransferDiskProps, useTransferDisk } from "@/internal/transferDisk";

import styles from "./mediaPlayer.module.css";

/**
 * What every chat player shares (VoicePlayer, VideoNote), one name, type and default for each:
 * the media (`src`, `duration`, `unplayed`, `disabled`), the `playing` triad and `onEnded`, one
 * sound at a time on the page (`internal/mediaSession`), the keyboard seek, the transcript
 * (`internal/transcript`) and the transfer (`internal/transfer`, drawn by `internal/transferDisk`).
 * A player adds only what its media really has of its own (the voice waveform and rate, the
 * circle's poster); the playback itself is `useMediaPlayer`. Each prop is described in
 * `mediaPlayer.api.ts`.
 */
export type MediaPlayerProps = TranscriptProps &
  TransferProps & {
    src: string;
    duration?: number;
    unplayed?: boolean;
    playing?: boolean;
    defaultPlaying?: boolean;
    onPlayingChange?: (playing: boolean) => void;
    onEnded?: () => void;
    disabled?: boolean;
  };

/** The root of every player: a `role="group"` div with its native attributes and `ref`. */
export type MediaPlayerRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onPlay" | "onPause" | "onEnded" | "onRateChange"
> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The strings every player has, same keys and templates; the defaults name its kind of media. */
export type MediaPlayerLabels = {
  /** Name of the player group. */
  player: string;
  /** Name of the play control while it does not play. */
  play: string;
  /** Name of the play control while it plays. */
  pause: string;
  /** The position: `{current}` and `{duration}` as m:ss. */
  position: string;
  /** Read after the time while `unplayed`. */
  unplayed: string;
} & TranscriptLabels &
  TransferLabels;

/** The shared defaults that do not name the media. */
export const MEDIA_PLAYER_LABELS = {
  pause: "Пауза",
  position: "{current} из {duration}",
  ...TRANSCRIPT_LABELS,
  ...TRANSFER_LABELS,
} satisfies Partial<MediaPlayerLabels>;

/** Where a player's playback is: at the start, playing, or stopped past the start. */
export type PlaybackState = "idle" | "playing" | "paused";

/** Seconds an arrow key moves the position. */
const KEY_STEP_S = 5;

/**
 * The keyboard seek of every player (on the voice waveform, on the circle): ArrowRight / ArrowUp
 * 5 s forward, ArrowLeft / ArrowDown 5 s back (mirrored in RTL), PageUp / PageDown a tenth, Home
 * / End the edges. The next position in seconds, clamped to the media, or `null` for any other key.
 */
function seekByKey(
  event: React.KeyboardEvent<HTMLElement>,
  current: number,
  total: number,
): number | null {
  if (total <= 0) return null;
  const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
  const forward = rtl ? "ArrowLeft" : "ArrowRight";
  const back = rtl ? "ArrowRight" : "ArrowLeft";
  let next: number | null = null;
  if (event.key === forward || event.key === "ArrowUp") next = current + KEY_STEP_S;
  else if (event.key === back || event.key === "ArrowDown") next = current - KEY_STEP_S;
  else if (event.key === "PageUp") next = current + total / 10;
  else if (event.key === "PageDown") next = current - total / 10;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = total;
  return next === null ? null : Math.min(total, Math.max(0, next));
}

/** Every shared prop, once: the split below and the type agree by construction. */
const SHARED_KEYS: Record<keyof MediaPlayerProps, true> = {
  src: true,
  duration: true,
  unplayed: true,
  playing: true,
  defaultPlaying: true,
  onPlayingChange: true,
  onEnded: true,
  disabled: true,
  transcript: true,
  onTranscribe: true,
  transcriptExpanded: true,
  defaultTranscriptExpanded: true,
  onTranscriptExpandedChange: true,
  transfer: true,
  transferProgress: true,
  transferDirection: true,
  onCancel: true,
  onRetry: true,
  onDownload: true,
};

/** Splits a player's props: the shared player ones, and the rest (its own and the DOM's). */
export function splitMediaPlayerProps<P extends MediaPlayerProps>(
  props: P,
): [MediaPlayerProps, Omit<P, keyof MediaPlayerProps>] {
  const player: Partial<Record<keyof MediaPlayerProps, unknown>> = {};
  const rest: Record<string, unknown> = { ...props };
  for (const key of Object.keys(SHARED_KEYS) as (keyof MediaPlayerProps)[]) {
    player[key] = props[key];
    delete rest[key];
  }
  return [player as MediaPlayerProps, rest as Omit<P, keyof MediaPlayerProps>];
}

/** The transfer disk's props a player hands on (it adds its own `look` and `className`). */
type PlayerTransferDisk = Pick<
  TransferDiskProps,
  "state" | "progress" | "labels" | "onCancel" | "onRetry" | "onDownload" | "disabled"
>;

type MediaPlayerOptions = {
  /** Playback speed of the media. Default `1`. */
  rate?: number;
  /**
   * The element whose `progressProperty` carries the played share (0…1): written every frame while
   * playing and on every seek, never through a render.
   */
  progressRef?: React.RefObject<HTMLElement | SVGSVGElement | null>;
  /** The custom property the share is written to. Default `--ring-value` (a live `Ring`). */
  progressProperty?: string;
};

/** The media element's events the player listens to: spread them on the `<audio>` / `<video>`. */
type MediaEvents = {
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onLoadedMetadata: () => void;
  onDurationChange: () => void;
};

export type MediaPlayer = {
  /** Where the playback is: `idle` at the start, `playing`, `paused` past the start. */
  state: PlaybackState;
  /** The position in seconds: exact at rest, the whole second while playing. */
  position: number;
  /** The length the player knows (the media's own, else `duration`), `null` while unknown. */
  duration: number | null;
  /** A drag of the seek holds the playback (`scrub`). */
  seeking: boolean;
  transcript: Transcript | null;
  /** Its own `disabled` or a disabled `Fieldset` around it. */
  disabled: boolean;
  /** The content is not there to play: in flight, failed or not fetched — it does not play. */
  covered: boolean;
  /** Nothing plays: disabled or covered. */
  inactive: boolean;
  /** The transfer disk to draw, or `null` without a transfer. */
  transferDisk: PlayerTransferDisk | null;
  /** Plays (from the start out of `idle`, on from a pause) or pauses — inside the press. */
  toggle: () => void;
  /** Moves the position to `seconds` (clamped); out of `idle` it leaves the player paused there. */
  seek: (seconds: number) => void;
  /** The keyboard seek (`seekByKey`) on the element that has it; `true` when the key moved it. */
  seekWithKey: (event: React.KeyboardEvent<HTMLElement>) => boolean;
  /** A drag of the seek starts (`true`: a playing media holds) or ends (`false`: it resumes). */
  scrub: (active: boolean) => void;
  mediaEvents: MediaEvents;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * The one playback engine of the chat players. It registers `mediaRef` with the one-sound
 * session, holds the `playing` triad and syncs the media to it, keeps the playback state
 * (`idle` → `playing` ⇄ `paused` → the end rewinds to `idle`), starts with a rewind when the media
 * stands elsewhere, applies the rate, follows the position with one animation-frame loop that
 * writes the played share to `progressRef` (a render only when the second changes), and holds a
 * playing media through a drag of the seek. The transcript and the transfer come with it. A player
 * draws its media from this and spreads `mediaEvents` on the element.
 */
export function useMediaPlayer(
  mediaRef: React.RefObject<HTMLMediaElement | null>,
  props: MediaPlayerProps,
  labels: MediaPlayerLabels,
  { rate = 1, progressRef, progressProperty = "--ring-value" }: MediaPlayerOptions = {},
): MediaPlayer {
  useMediaSession(mediaRef);
  const [wanted, setWanted] = useControllableState<boolean>({
    value: props.playing,
    defaultValue: props.defaultPlaying ?? false,
    onChange: props.onPlayingChange,
  });
  const transcript = useTranscript(props, labels);
  const disabled = useInheritedDisabled(props.disabled);
  const transferState: TransferState | undefined = props.transfer;
  const covered = transferCovers(transferState);
  const inactive = disabled || covered;
  const direction: TransferDirection = props.transferDirection ?? "upload";
  const handlers: Record<"onCancel" | "onRetry" | "onDownload", TransferHandler | undefined> = {
    onCancel: props.onCancel,
    onRetry: props.onRetry,
    onDownload: props.onDownload,
  };

  const [state, setState] = React.useState<PlaybackState>("idle");
  const [position, setPosition] = React.useState(0);
  const [mediaDuration, setMediaDuration] = React.useState<number | null>(null);
  const [seeking, setSeeking] = React.useState(false);
  const duration = mediaDuration ?? props.duration ?? null;
  const total = Math.max(0, duration ?? 0);

  // What the media does right now, for handlers and effects that must not wait for a render.
  const live = React.useRef({ state: "idle" as PlaybackState, position: 0, seeking: false });
  const resumeAfterScrub = React.useRef(false);

  const move = (next: PlaybackState) => {
    live.current.state = next;
    setState(next);
  };
  const place = (seconds: number) => {
    live.current.position = seconds;
    setPosition(seconds);
  };

  /** The played share, written on the progress element alone (no render). */
  const paint = React.useCallback(
    (seconds: number) => {
      const share = total > 0 ? clamp(seconds / total, 0, 1) : 0;
      progressRef?.current?.style.setProperty(progressProperty, String(share));
    },
    [total, progressRef, progressProperty],
  );

  const playing = state === "playing";
  React.useLayoutEffect(() => {
    if (!playing) paint(position);
  }, [playing, position, paint]);

  // While playing: the share every frame; the position (a render) only when its second changes.
  React.useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const media = mediaRef.current;
      if (media) {
        const now = media.currentTime;
        paint(now);
        live.current.position = now;
        setPosition((previous) => (Math.floor(previous) === Math.floor(now) ? previous : now));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, paint, mediaRef]);

  React.useEffect(() => {
    const media = mediaRef.current;
    if (media) media.playbackRate = rate;
  }, [rate, mediaRef]);

  /** The exact position now: the media's while it plays. */
  const current = () => {
    const media = mediaRef.current;
    return live.current.state === "playing" && media ? media.currentTime : live.current.position;
  };

  const refused = () => {
    if (live.current.state === "playing") move("paused");
    setWanted(false);
  };

  /** Plays from where the player stands (the media rewinds there first). */
  const start = () => {
    const media = mediaRef.current;
    if (!media || inactive) return;
    const at = live.current.position;
    if (Math.abs(media.currentTime - at) > 0.25) {
      try {
        media.currentTime = at;
      } catch {
        // No media loaded yet: it starts where it is.
      }
    }
    media.play()?.catch(refused);
  };

  const pause = () => mediaRef.current?.pause();

  // Turned off (or covered) while playing: the sound stops and the owner hears of it.
  React.useEffect(() => {
    if (inactive && live.current.state === "playing") mediaRef.current?.pause();
  }, [inactive, mediaRef]);

  // The triad drives the media: `playing` from the owner (or `defaultPlaying`) plays or pauses; a
  // press already did both itself. A drag of the seek holds the media and does not count.
  const sync = React.useRef({ start, pause });
  React.useLayoutEffect(() => {
    sync.current = { start, pause };
  });
  React.useEffect(() => {
    if (live.current.seeking) return;
    const isPlaying = live.current.state === "playing";
    if (wanted && !isPlaying) sync.current.start();
    else if (!wanted && isPlaying) sync.current.pause();
  }, [wanted]);

  const seek = (seconds: number) => {
    const next = clamp(seconds, 0, total);
    const media = mediaRef.current;
    if (media) {
      try {
        media.currentTime = next;
      } catch {
        // No media loaded yet: the position still moves and applies on play.
      }
    }
    place(next);
    paint(next);
    if (live.current.state === "idle") move("paused");
  };

  const readDuration = () => {
    const value = mediaRef.current?.duration;
    if (value !== undefined && Number.isFinite(value) && value > 0) setMediaDuration(value);
  };

  return {
    state,
    position,
    duration,
    seeking,
    transcript,
    disabled,
    covered,
    inactive,
    transferDisk:
      transferState === undefined
        ? null
        : {
            state: transferState,
            progress: props.transferProgress,
            labels: transferDiskLabels(labels, direction, props.transferProgress),
            disabled,
            ...handlers,
          },
    toggle: () => {
      // Played and paused right here, inside the press: browsers allow sound only from a gesture.
      if (live.current.state === "playing") pause();
      else start();
    },
    seek,
    seekWithKey: (event) => {
      if (inactive) return false;
      const next = seekByKey(event, current(), total);
      if (next === null) return false;
      event.preventDefault();
      seek(next);
      return true;
    },
    scrub: (active) => {
      if (active === live.current.seeking) return;
      live.current.seeking = active;
      setSeeking(active);
      if (active) {
        resumeAfterScrub.current = live.current.state === "playing";
        if (resumeAfterScrub.current) pause();
        return;
      }
      if (resumeAfterScrub.current) mediaRef.current?.play()?.catch(refused);
      resumeAfterScrub.current = false;
    },
    mediaEvents: {
      onPlay: () => {
        move("playing");
        setWanted(true);
      },
      onPause: () => {
        if (live.current.state !== "playing") return;
        place(mediaRef.current?.currentTime ?? live.current.position);
        move("paused");
        // A drag holds the media for the seek and resumes it: the person still listens.
        if (!live.current.seeking) setWanted(false);
      },
      // The end is a full reset: stopped, back at the start, the still state; the session was
      // released by the end of the element.
      onEnded: () => {
        if (live.current.state === "idle") return;
        const media = mediaRef.current;
        if (media) {
          try {
            media.currentTime = 0;
          } catch {
            // Nothing loaded: nothing to rewind.
          }
        }
        place(0);
        move("idle");
        setWanted(false);
        props.onEnded?.();
      },
      onLoadedMetadata: readDuration,
      onDurationChange: readDuration,
    },
  };
}

/**
 * The root of every player: a `role="group"` named by `labels.player`, with the player's state on
 * it (`data-playing`, `data-seeking`, `data-disabled`, `data-transfer`).
 */
export function MediaPlayerRoot({
  label,
  player,
  className,
  children,
  ...rest
}: Omit<MediaPlayerRootProps, "children"> & {
  label: string;
  player: MediaPlayer;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a media player's controls, not a form fieldset
    <div
      role="group"
      aria-label={label}
      {...rest}
      className={className}
      {...toDataAttributes({
        playing: player.state === "playing" || undefined,
        seeking: player.seeking || undefined,
        disabled: player.disabled || undefined,
        transfer: player.covered || undefined,
      })}
    >
      {children}
    </div>
  );
}

/**
 * The accent dot of a player nobody has played yet (after the voice message's time, in the video
 * circle's duration pill): it rises in when `unplayed` turns on and closes up in place when it
 * clears. Decorative; the player reads `labels.unplayed` itself.
 */
export function UnplayedDot({ shown }: { shown: boolean }) {
  const presence = usePartPresence<HTMLSpanElement>({ present: shown, axis: "inline" });
  return shown ? (
    <span
      ref={presence.ref}
      className={cx(styles.dot, presence.className)}
      data-unplayed=""
      aria-hidden="true"
    />
  ) : null;
}

/**
 * The play disk of every player: one `Button shape="circle"` (control `l`) for every state — play
 * ⇄ pause, and while the media is on its way, failed or not fetched, the transfer's ×, retry or
 * download arrow (`useTransferDisk`), the share as the Button's `progress` ring along its inner
 * edge. Glyphs cross-fade in place (`Button.Icon`); done, the ring fades and play comes back.
 * `solid` is the accent disk of a voice message (an outgoing bubble recolours it); `shade` the
 * media shade with a blur over a video circle.
 */
export function PlayDisk({
  look,
  state,
  labels,
  disabled,
  covered,
  transferDisk,
  onToggle,
  onKeyDown,
  describedBy,
  className,
}: {
  look: "solid" | "shade";
  /** `idle` — at the start; `playing`; `paused` — stopped past the start. On the disk as `data-state`. */
  state: PlaybackState;
  labels: Pick<MediaPlayerLabels, "play" | "pause">;
  disabled: boolean;
  covered: boolean;
  transferDisk: PlayerTransferDisk | null;
  onToggle: () => void;
  /** Keys on the disk (the circle seeks from it: it has no slider of its own). */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  /** The id of the text that describes the disk (a circle's duration or position). */
  describedBy?: string;
  className?: string;
}) {
  const playing = state === "playing";
  const transfer = useTransferDisk(transferDisk ?? NO_TRANSFER);
  const inTransfer = transferDisk !== null && covered;
  // A transfer state whose handler was not given only shows itself: the disk takes no press.
  const still = inTransfer && !transfer.pressable;
  const glyph: IconName = playing ? "action.pause" : "action.play";
  return (
    <span className={cx(styles.slot, className)}>
      <Button.Root
        shape="circle"
        size="l"
        variant={look}
        tone={inTransfer && transfer.failed ? "danger" : "accent"}
        data-state={state}
        data-covered={covered || undefined}
        aria-label={(inTransfer ? transfer.name : playing ? labels.pause : labels.play) ?? ""}
        aria-describedby={inTransfer ? transfer.describedBy : describedBy}
        aria-busy={(inTransfer && transfer.busy) || undefined}
        aria-disabled={(inTransfer && transfer.busy) || still || undefined}
        disabled={disabled}
        progress={inTransfer ? transfer.progress : undefined}
        onClick={inTransfer ? transfer.run : onToggle}
        onKeyDown={inTransfer ? undefined : onKeyDown}
      >
        <Button.Icon>
          {inTransfer ? transfer.glyph : <Icon name={glyph} fill="currentColor" />}
        </Button.Icon>
      </Button.Root>
      {transferDisk ? transfer.texts : null}
    </span>
  );
}

const NO_TRANSFER = { state: "done", labels: {} } as const;

/**
 * The transcript button of every player, so a voice message and a circle never drift: a soft `xs`
 * icon Button with the transcript mark («→A») that cross-fades (`Button.Icon`) into a chevron up
 * while the text is open, spinning (`loading`) while it is asked for. The player places it at its
 * top end.
 */
export function TranscriptButton({
  transcript,
  disabled = false,
  className,
}: {
  transcript: Transcript;
  disabled?: boolean;
  className?: string;
}) {
  const glyph: IconName = transcript.expanded ? "nav.chevronUp" : "action.transcribe";
  return (
    <Button.Root
      variant="soft"
      size="xs"
      className={className}
      disabled={disabled}
      loading={transcript.pending}
      onClick={transcript.toggle}
      {...transcript.buttonProps}
    >
      <Button.Icon>
        <Icon name={glyph} />
      </Button.Icon>
    </Button.Root>
  );
}
