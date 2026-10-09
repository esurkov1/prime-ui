import * as React from "react";

import { Button } from "@/components/button/Button";
import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import { useInheritedDisabled } from "@/internal/disabledContext";
import { useMediaSession } from "@/internal/mediaSession";
import {
  TRANSCRIPT_LABELS,
  type Transcript,
  TranscriptGlyph,
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
 * circle's poster) and keeps its own media logic.
 */
export type MediaPlayerProps = TranscriptProps &
  TransferProps & {
    /** The media file; loaded with `preload="metadata"`. */
    src: string;
    /** Length in seconds, shown until the media reports its own. */
    duration?: number;
    /** Nobody has played it yet: an accent dot after the time. Clear it on `onPlayingChange(true)`. */
    unplayed?: boolean;
    /** Playing with sound (controlled). One sound plays at a time on the page. */
    playing?: boolean;
    /** Initial playing state (uncontrolled). Default `false`. */
    defaultPlaying?: boolean;
    /** Playback with sound started or stopped: a press, another sound taking over, the end. */
    onPlayingChange?: (playing: boolean) => void;
    /** Playback reached the end; the player is back at the start. */
    onEnded?: () => void;
    /**
     * Nothing can be played: the play control, the seek, the transcript button and the transfer
     * actions are off. A disabled `Fieldset` around the player disables it too.
     */
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
 * / End the edges. The next position in seconds, or `null` for any other key.
 */
export function seekByKey(
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

const KEYS = [
  "src",
  "duration",
  "unplayed",
  "playing",
  "defaultPlaying",
  "onPlayingChange",
  "onEnded",
  "disabled",
  "transcript",
  "onTranscribe",
  "transcriptExpanded",
  "defaultTranscriptExpanded",
  "onTranscriptExpandedChange",
  "transfer",
  "transferProgress",
  "transferDirection",
  "onCancel",
  "onRetry",
  "onDownload",
] as const satisfies readonly (keyof MediaPlayerProps)[];

/** Splits a player's props: the shared player ones, and the rest (its own and the DOM's). */
export function splitMediaPlayerProps<P extends MediaPlayerProps>(
  props: P,
): [MediaPlayerProps, Omit<P, keyof MediaPlayerProps>] {
  const player: Record<string, unknown> = {};
  const rest: Record<string, unknown> = { ...props };
  for (const key of KEYS) {
    player[key] = props[key];
    delete rest[key];
  }
  return [player as MediaPlayerProps, rest as Omit<P, keyof MediaPlayerProps>];
}

/** The transfer disk's props a player hands on (it adds its own `look` and `className`). */
export type PlayerTransferDisk = Pick<
  TransferDiskProps,
  "state" | "progress" | "labels" | "onCancel" | "onRetry" | "onDownload" | "disabled"
>;

export type MediaPlayer = {
  /** The triad: what the owner (or the player's last act) wants — it may lead the media. */
  wanted: boolean;
  setWanted: (playing: boolean) => void;
  transcript: Transcript | null;
  /** Its own `disabled` or a disabled `Fieldset` around it. */
  disabled: boolean;
  /** The content is not there to play: in flight, failed or not fetched — it does not play. */
  covered: boolean;
  /** Nothing plays: disabled or covered. */
  inactive: boolean;
  /** The transfer disk to draw, or `null` without a transfer. */
  transferDisk: PlayerTransferDisk | null;
};

/**
 * The shared half of a chat player: registers `mediaRef` with the one-sound session, holds the
 * `playing` triad, the transcript and the transfer. The player drives its media from `wanted`
 * and reports what the media does through `setWanted`.
 */
export function useMediaPlayer(
  mediaRef: React.RefObject<HTMLMediaElement | null>,
  props: MediaPlayerProps,
  labels: MediaPlayerLabels,
): MediaPlayer {
  useMediaSession(mediaRef);
  const [wanted, setWanted] = useControllableState<boolean>({
    value: props.playing,
    defaultValue: props.defaultPlaying ?? false,
    onChange: props.onPlayingChange,
  });
  const transcript = useTranscript(props, labels);
  const disabled = useInheritedDisabled(props.disabled);
  const state: TransferState | undefined = props.transfer;
  const covered = transferCovers(state);
  const direction: TransferDirection = props.transferDirection ?? "upload";
  const handlers: Record<"onCancel" | "onRetry" | "onDownload", TransferHandler | undefined> = {
    onCancel: props.onCancel,
    onRetry: props.onRetry,
    onDownload: props.onDownload,
  };

  // Turned off (or covered) while playing: the sound stops and the owner hears of it.
  React.useEffect(() => {
    const media = mediaRef.current;
    if ((disabled || covered) && media && !media.paused && !media.muted) media.pause();
  }, [disabled, covered, mediaRef]);

  return {
    wanted,
    setWanted,
    transcript,
    disabled,
    covered,
    inactive: disabled || covered,
    transferDisk:
      state === undefined
        ? null
        : {
            state,
            progress: props.transferProgress,
            labels: transferDiskLabels(labels, direction, props.transferProgress),
            disabled,
            ...handlers,
          },
  };
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
          {inTransfer ? (
            transfer.glyph
          ) : (
            <Icon name={playing ? "action.pause" : "action.play"} fill="currentColor" />
          )}
        </Button.Icon>
      </Button.Root>
      {transferDisk ? transfer.texts : null}
    </span>
  );
}

const NO_TRANSFER = { state: "done", labels: {} } as const;

/**
 * The transcript button of every player, so a voice message and a circle never drift: a soft `xs`
 * icon Button with the transcript mark («→A») that cross-fades into a chevron up while the text is
 * open, spinning (`loading`) while it is asked for. The player places it at its top end.
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
        <TranscriptGlyph expanded={transcript.expanded} />
      </Button.Icon>
    </Button.Root>
  );
}
