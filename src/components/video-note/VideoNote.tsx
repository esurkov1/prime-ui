import * as React from "react";

import { Skeleton } from "@/components/skeleton/Skeleton";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { usePresence } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { firstFrame } from "@/internal/mediaFrame";
import pill from "@/internal/mediaPill.module.css";
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
import { defineMessagePart, useInMessage, useMessagePart } from "@/internal/messagePart";
import { press } from "@/internal/press";
import { Ring } from "@/internal/ring";
import { nextSurfaceDepth, useSurfaceDepth } from "@/internal/surfaceDepth";
import textRole from "@/internal/textRole.module.css";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";

import styles from "./VideoNote.module.css";

/**
 * The shared player strings and the circle's own: the description of its disk before playback
 * (the voice message says the same through its slider's value).
 */
export type VideoNoteLabels = MediaPlayerLabels & {
  /** The disk's description before playback: `{duration}`. */
  duration: string;
};

export const VIDEO_NOTE_LABELS: VideoNoteLabels = {
  player: "Видеосообщение",
  play: "Воспроизвести видеосообщение",
  unplayed: "Не просмотрено",
  duration: "Длительность {duration}",
  ...MEDIA_PLAYER_LABELS,
};

/**
 * The shared player props (`MediaPlayerProps`, the same as VoicePlayer's) and what only a video
 * has: a poster. No waveform (it shows a face, not levels) and no rate (a face is watched at its
 * own pace; a voice recording is the one listened to faster).
 */
export type VideoNoteProps = MediaPlayerRootProps &
  MediaPlayerProps & {
    poster?: string;
    labels?: Partial<VideoNoteLabels>;
  };

function VideoNoteInner(props: VideoNoteProps) {
  const [mediaProps, own] = splitMediaPlayerProps(props);
  const { src, unplayed = false } = mediaProps;
  const { poster, labels: labelsProp, className, ...rest } = own;
  const labels = useLabels(VIDEO_NOTE_LABELS, labelsProp);
  const { overlay } = useMessagePart();
  // The text block under the circle wears the message's own fill (`--message-fill`); standalone it
  // is a surface on the one around it.
  const around = useSurfaceDepth();
  const blockDepth = useInMessage() ? undefined : nextSurfaceDepth(around);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  // The ring of a playback carries the share (`--ring-value`), written on the ring alone every
  // frame, so a frame restyles the arc only — never the circle, its clip or the video under it.
  const ringRef = React.useRef<SVGSVGElement | null>(null);
  const descriptionId = React.useId();

  const [frame, setFrame] = React.useState<"loading" | "loaded" | "error">("loading");
  // The skeleton stays under the first frame while the frame fades in over it (`base`), then goes:
  // the circle never shows a blank between the two.
  const placeholder = usePresence(frame === "loading", { exitDuration: "base" });
  // `idle` — the still first frame at the start; `playing` / `paused` — a playback; the end
  // rewinds to the still frame.
  const player = useMediaPlayer(videoRef, mediaProps, labels, { progressRef: ringRef });
  const { state, duration, transcript, disabled, covered, inactive } = player;
  const current = Math.floor(player.position);

  const remaining = duration !== null ? Math.max(0, duration - current) : null;
  const shown = state === "idle" ? duration : remaining;
  const description = [
    duration === null
      ? null
      : state === "idle"
        ? formatLabel(labels.duration, { duration: formatClock(duration) })
        : formatLabel(labels.position, {
            current: formatClock(current),
            duration: formatClock(duration),
          }),
    unplayed ? labels.unplayed : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <MediaPlayerRoot
      label={labels.player}
      player={player}
      {...rest}
      className={cx(styles.root, className)}
    >
      {/* A press anywhere on the circle (its hit area or its disk) gives the whole circle. */}
      <div
        className={cx(press.press, styles.circle)}
        data-state={state}
        data-frame={frame}
        data-covered={covered || undefined}
        data-disabled={inactive || undefined}
      >
        {/* The clip: one stable, always-composited round layer; nothing on it changes per frame. */}
        <span className={styles.media} aria-hidden="true">
          {placeholder.mounted ? <Skeleton shape="block" className={styles.fill} /> : null}
          {/* Own `<video>`, not `Thumbnail.Video`: the circle is its own play control and ring. A
              face-to-camera message has no captions; its words are the transcript. */}
          <video
            ref={videoRef}
            className={styles.video}
            src={poster ? src : firstFrame(src)}
            poster={poster}
            preload={mediaProps.transfer === "remote" ? "none" : "metadata"}
            playsInline
            tabIndex={-1}
            {...player.mediaEvents}
            onLoadedData={() => setFrame("loaded")}
            onError={() => setFrame("error")}
          />
        </span>
        <Ring ref={ringRef} value={0} live track="none" weight="band" className={styles.ring} />
        {/* The whole circle takes a press (a pointer aid only: the disk below is the control that
            focus, keys and assistive tech reach). */}
        <span
          className={styles.hit}
          data-disabled={inactive || undefined}
          aria-hidden="true"
          onClick={inactive ? undefined : player.toggle}
        />
        {/* The play disk of every player in its shade look, centred: at rest and on a pause; it
            fades while the note plays and comes back on focus. It seeks from the keyboard too. */}
        <span className={styles.play} data-badge="play" data-shown={state !== "playing"}>
          <PlayDisk
            look="shade"
            state={state}
            labels={labels}
            disabled={disabled}
            covered={covered}
            transferDisk={player.transferDisk}
            onToggle={player.toggle}
            onKeyDown={player.seekWithKey}
            describedBy={description ? descriptionId : undefined}
          />
        </span>
        {description ? <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden> : null}
        {/* The duration on the bottom-start corner; the message's meta pill takes the bottom end. */}
        {shown !== null ? (
          <span
            className={cx(textRole.caption, pill.pill, styles.duration)}
            data-badge="duration"
            aria-hidden="true"
          >
            {formatClock(shown)}
            <UnplayedDot shown={unplayed} />
          </span>
        ) : null}
        {/* The transcript button at the top end of the circle's box, outside its edge — where the
            voice message has it, at the end of its top row. */}
        {transcript ? (
          <TranscriptButton
            transcript={transcript}
            disabled={disabled}
            className={styles.transcribe}
          />
        ) : null}
        {overlay}
      </div>
      {transcript?.region({ className: styles.transcript, depth: blockDepth })}
    </MediaPlayerRoot>
  );
}

/**
 * A round video message: at rest its first frame (or `poster`) stands still with the play disk
 * and the duration — nothing plays or loops before a press. Activation plays it with sound with a
 * progress ring around the circle; at the end it rewinds to the still frame. With `transcript` or
 * `onTranscribe` a button at the top end of its box opens the text in a block under the circle. A
 * transfer dims the circle under the transfer disk in its middle.
 */
export function VideoNote(props: VideoNoteProps) {
  // A new source starts again at `loading`.
  return <VideoNoteInner key={props.src} {...props} />;
}

defineMessagePart(VideoNote, {
  shell: "round",
  meta: "overlay",
  sized: true,
  // The circle's diameter at the default root size.
  estimate: () => TOKEN_DEFAULTS["--prime-message-video-note-box"],
  text: ({ transcript }: VideoNoteProps) => transcript ?? "",
});
