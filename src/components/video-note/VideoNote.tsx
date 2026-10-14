import * as React from "react";

import { Skeleton } from "@/components/skeleton/Skeleton";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { usePresence } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { firstFrame } from "@/internal/mediaFrame";
import pill from "@/internal/mediaPill.module.css";
import {
  MEDIA_PLAYER_LABELS,
  type MediaPlayerLabels,
  type MediaPlayerProps,
  type MediaPlayerRootProps,
  type PlaybackState,
  PlayDisk,
  seekByKey,
  splitMediaPlayerProps,
  TranscriptButton,
  useMediaPlayer,
} from "@/internal/mediaPlayer";
import { defineMessagePart, useInMessage, useMessagePart } from "@/internal/messagePart";
import { Ring } from "@/internal/ring";
import { nextSurfaceDepth, useSurfaceDepth } from "@/internal/surfaceDepth";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";
import { VisuallyHidden } from "@/internal/VisuallyHidden";

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
    /** A still to show before the video draws its first frame. */
    poster?: string;
    labels?: Partial<VideoNoteLabels>;
  };

function VideoNoteInner(props: VideoNoteProps) {
  const [player, own] = splitMediaPlayerProps(props);
  const { src, duration: durationProp, unplayed = false } = player;
  const { poster, labels: labelsProp, className, ref, ...rest } = own;
  const labels = { ...VIDEO_NOTE_LABELS, ...labelsProp };
  const { overlay } = useMessagePart();
  // The text block under the circle wears the message's own fill (`--message-fill`); standalone it
  // is a surface on the one around it.
  const around = useSurfaceDepth();
  const blockDepth = useInMessage() ? undefined : nextSurfaceDepth(around);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const ringRef = React.useRef<SVGSVGElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const descriptionId = React.useId();

  // `idle` — the still first frame at the start; `playing` / `paused` — a playback.
  const [state, setState] = React.useState<PlaybackState>("idle");
  const [frame, setFrame] = React.useState<"loading" | "loaded" | "error">("loading");
  // The skeleton stays under the first frame while the frame fades in over it (`base`), then goes:
  // the circle never shows a blank between the two.
  const placeholder = usePresence(frame === "loading", { exitDuration: "base" });
  const [metaDuration, setMetaDuration] = React.useState<number | null>(null);
  const [current, setCurrent] = React.useState(0);
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const { wanted, setWanted, transcript, disabled, covered, inactive, transferDisk } =
    useMediaPlayer(videoRef, player, labels);
  const inactiveRef = React.useRef(inactive);
  inactiveRef.current = inactive;

  const duration = metaDuration ?? durationProp ?? null;

  // The ring of a playback: written on the ring alone every frame, so a frame restyles the arc
  // only — never the circle, its clip or the video under it. Back at the start it is empty.
  React.useEffect(() => {
    const video = videoRef.current;
    const ring = ringRef.current;
    if (!video || !ring) return;
    if (state === "idle") {
      ring.style.setProperty("--ring-value", "0");
      setCurrent(0);
      return;
    }
    const tick = () => {
      const total = Number.isFinite(video.duration) ? video.duration : (duration ?? 0);
      ring.style.setProperty(
        "--ring-value",
        String(total > 0 ? Math.min(1, video.currentTime / total) : 0),
      );
      setCurrent(Math.floor(video.currentTime));
    };
    tick();
    if (state !== "playing") return;
    let frameId = requestAnimationFrame(function loop() {
      tick();
      frameId = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(frameId);
  }, [state, duration]);

  /** Plays: from the start out of the still frame, or on from a pause. */
  const start = () => {
    const video = videoRef.current;
    if (!video || inactiveRef.current) return;
    if (stateRef.current === "idle") video.currentTime = 0;
    stateRef.current = "playing";
    setState("playing");
    setWanted(true);
    // A refused playback (autoplay policy, a failed source) stops at pause.
    video.play()?.catch(() => {
      setState((previous) => (previous === "playing" ? "paused" : previous));
      setWanted(false);
    });
  };

  const toggle = () => {
    if (stateRef.current === "playing") videoRef.current?.pause();
    else start();
  };

  // The triad from the owner plays or pauses (a press already did both itself).
  // biome-ignore lint/correctness/useExhaustiveDependencies: follows the wanted state only
  React.useEffect(() => {
    if (wanted && stateRef.current !== "playing") start();
    else if (!wanted && stateRef.current === "playing") videoRef.current?.pause();
  }, [wanted]);

  const handlePause = () => {
    if (stateRef.current !== "playing") return;
    stateRef.current = "paused";
    setState("paused");
    setWanted(false);
  };

  /** A seek from the keyboard on the disk; from the still frame it leaves the note paused there. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const video = videoRef.current;
    if (!video || inactive) return;
    const total = Number.isFinite(video.duration) ? video.duration : (duration ?? 0);
    const next = seekByKey(event, video.currentTime, total);
    if (next === null) return;
    event.preventDefault();
    video.currentTime = next;
    if (stateRef.current === "idle") {
      stateRef.current = "paused";
      setState("paused");
    }
    setCurrent(Math.floor(next));
    ringRef.current?.style.setProperty(
      "--ring-value",
      String(total > 0 ? Math.min(1, next / total) : 0),
    );
  };

  // The end: rewound, the ring empty, the still first frame; the session is released by the end.
  const handleEnded = () => {
    if (stateRef.current === "idle") return;
    const video = videoRef.current;
    if (video) video.currentTime = 0;
    stateRef.current = "idle";
    setState("idle");
    setWanted(false);
    player.onEnded?.();
  };

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
    // biome-ignore lint/a11y/useSemanticElements: a media player's controls, not a form fieldset
    <div
      role="group"
      aria-label={labels.player}
      {...rest}
      ref={mergedRef}
      className={cx(styles.root, className)}
      {...toDataAttributes({
        playing: state === "playing" || undefined,
        disabled: disabled || undefined,
        transfer: covered || undefined,
      })}
    >
      <div
        className={styles.circle}
        data-message-outline=""
        data-state={state}
        data-frame={frame}
        data-covered={covered || undefined}
      >
        {/* The clip: one stable, always-composited round layer; nothing on it changes per frame. */}
        <span className={styles.media} aria-hidden="true">
          {placeholder.mounted ? <Skeleton shape="block" className={styles.fill} /> : null}
          {/* Own `<video>`, not `Thumbnail.Video`: the circle is its own play control and ring. */}
          {/* biome-ignore lint/a11y/useMediaCaption: a face-to-camera message; its words are the transcript */}
          <video
            ref={videoRef}
            className={styles.video}
            src={poster ? src : firstFrame(src)}
            poster={poster}
            preload={player.transfer === "remote" ? "none" : "metadata"}
            playsInline
            tabIndex={-1}
            onLoadedData={() => setFrame("loaded")}
            onError={() => setFrame("error")}
            onLoadedMetadata={(event) => {
              const seconds = event.currentTarget.duration;
              if (Number.isFinite(seconds)) setMetaDuration(seconds);
            }}
            onPause={handlePause}
            onEnded={handleEnded}
          />
        </span>
        <Ring ref={ringRef} value={0} live track={false} className={styles.ring} />
        {/* The whole circle takes a press (a pointer aid only: the disk below is the control that
            focus, keys and assistive tech reach). */}
        <span
          className={styles.hit}
          data-disabled={inactive || undefined}
          aria-hidden="true"
          onClick={inactive ? undefined : toggle}
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
            transferDisk={transferDisk}
            onToggle={toggle}
            onKeyDown={handleKeyDown}
            describedBy={description ? descriptionId : undefined}
          />
        </span>
        {description ? <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden> : null}
        {/* The duration on the bottom-start corner; the message's meta pill takes the bottom end. */}
        {shown !== null ? (
          <span className={cx(pill.pill, styles.duration)} data-badge="duration" aria-hidden="true">
            {formatClock(shown)}
            {unplayed ? <span className={styles.dot} /> : null}
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
    </div>
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
