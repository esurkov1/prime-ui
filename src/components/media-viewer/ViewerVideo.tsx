import * as React from "react";
import { Button } from "@/components/button/Button";
import { Slider } from "@/components/slider/Slider";
import { Pause } from "@/icons/glyphs/pause";
import { Play } from "@/icons/glyphs/play";
import { Volume2 } from "@/icons/glyphs/volume-2";
import { VolumeX } from "@/icons/glyphs/volume-x";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatClock } from "@/internal/formatClock";
import { formatLabel } from "@/internal/formatLabel";
import { firstFrame } from "@/internal/mediaFrame";
import pill from "@/internal/mediaPill.module.css";
import { type PlaybackState, PlayDisk } from "@/internal/mediaPlayer";
import { useMediaSession } from "@/internal/mediaSession";
import { useLayer } from "@/internal/overlay/layerStack";
import textRole from "@/internal/textRole.module.css";

import styles from "./MediaViewer.module.css";
import type { MediaViewerItem, MediaViewerLabels } from "./types";

/** The sound of every video in one viewer: the level 0…1 and the mute. */
export type Sound = { volume: number; muted: boolean };

/** What the viewer's keys and clicks do to the video on screen. */
export type VideoControls = {
  toggle: () => void;
  /** Moves the position by `seconds` (negative: back). */
  seekBy: (seconds: number) => void;
  toggleMute: () => void;
  /** Changes the level by `delta` (0…1 scale). */
  volumeBy: (delta: number) => void;
};

type ViewerVideoProps = {
  item: MediaViewerItem;
  /** The page on screen, and the viewer is not closing: anything else pauses. */
  active: boolean;
  /** Start once the page is on screen. */
  autoPlay: boolean;
  /** Shared by the viewer's videos: a level set on one carries to the next. */
  sound: Sound;
  onSoundChange: (sound: Sound) => void;
  /** Filled while the page is on screen: the viewer's keys reach the video through it. */
  controlsRef: React.MutableRefObject<VideoControls | null>;
  /** The video on screen started or stopped: the chrome stays while it stands still. */
  onPlayingChange: (playing: boolean) => void;
  /**
   * The thumbnail the viewer opened from (a `<video>` showing its frame, or an `<img>`): drawn as
   * the still the page flies with, until the video has a frame of its own.
   */
  still: HTMLElement | null;
  labels: MediaViewerLabels;
  /** The video reported its own size: the page refits it. */
  onRatio: (ratio: number) => void;
  onError: () => void;
  /** The video box, sized and transformed by the engine. */
  zoomRef: React.Ref<HTMLDivElement>;
  boxStyle: React.CSSProperties;
  /** Caption and other parts of the bottom bar, above the controls. */
  caption: React.ReactNode;
};

/** The time beside the seek: the caption role in the muted light ink of the media shade. */
const timeClass = cx(textRole.caption, pill.inkMuted, styles.time);

/** A level the sound button brings back after a mute at zero. */
const UNMUTE_LEVEL = 0.5;
/** The level panel stays this long after the pointer leaves, so the gap to it can be crossed. */
const LEVEL_LEAVE_MS = 300;

const toggleSound = (sound: Sound): Sound =>
  sound.muted || sound.volume === 0
    ? { muted: false, volume: sound.volume === 0 ? UNMUTE_LEVEL : sound.volume }
    : { ...sound, muted: true };

/**
 * A video page: the frame in its fitted box, a play disk in the middle while it stands still, and
 * a bar at the bottom — play / pause, the time, a seek slider, the length and the sound button
 * with its level — that steps aside with the rest of the chrome. With `autoPlay` it starts once its
 * page settles (muted where the browser refuses sound); one sound at a time on the page; it pauses
 * when its page leaves the screen.
 */
export function ViewerVideo({
  item,
  active,
  autoPlay,
  sound,
  onSoundChange,
  controlsRef,
  onPlayingChange,
  still,
  labels,
  onRatio,
  onError,
  zoomRef,
  boxStyle,
  caption,
}: ViewerVideoProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  useMediaSession(videoRef);
  const [playing, setPlaying] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const stillRef = React.useRef<HTMLCanvasElement>(null);
  // The video has drawn a frame of its own: the borrowed still goes.
  const [framed, setFramed] = React.useState(false);

  // The frame the person pressed, copied before the first paint: the page flies with exactly it.
  React.useLayoutEffect(() => {
    const canvas = stillRef.current;
    if (!canvas || !still) return;
    const source = still as HTMLVideoElement | HTMLImageElement;
    const width = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
    const height = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
    if (!width || !height) return;
    canvas.width = width;
    canvas.height = height;
    try {
      canvas.getContext("2d")?.drawImage(source, 0, 0, width, height);
    } catch {
      // A source that cannot be drawn leaves the poster or the video's own first frame.
    }
  }, [still]);

  // The element follows the shared sound.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = sound.volume;
    video.muted = sound.muted;
  }, [sound]);

  const latest = React.useRef({ sound, onSoundChange, onPlayingChange });
  latest.current = { sound, onSoundChange, onPlayingChange };

  // On screen: start (with `autoPlay`); off screen or closing: pause.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!active) {
      video.pause();
      return;
    }
    if (!autoPlay) return;
    video.play().catch((error: unknown) => {
      // The browser refuses sound without a press: start muted, the sound button brings it back.
      if (!(error instanceof DOMException) || error.name !== "NotAllowedError") return;
      video.muted = true;
      latest.current.onSoundChange({ ...latest.current.sound, muted: true });
      video.play().catch(() => setPlaying(false));
    });
  }, [active, autoPlay]);

  // The viewer hears whether the video on screen plays (its chrome stays while it stands still).
  React.useEffect(() => {
    if (active) latest.current.onPlayingChange(playing);
  }, [active, playing]);

  // The position follows the frame while it plays: smoother than `timeupdate` (four times a second).
  React.useEffect(() => {
    if (!playing) return;
    let frame = requestAnimationFrame(function follow() {
      const video = videoRef.current;
      if (video) setTime(video.currentTime);
      frame = requestAnimationFrame(follow);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const toggle = React.useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // A rejected play (no source yet, a policy) leaves the disk on play.
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, []);

  // The viewer's keys reach this video while its page is on screen.
  React.useEffect(() => {
    if (!active) return;
    const controls: VideoControls = {
      toggle,
      seekBy: (seconds) => {
        const video = videoRef.current;
        if (!video || !Number.isFinite(video.duration)) return;
        video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + seconds));
        setTime(video.currentTime);
      },
      toggleMute: () => latest.current.onSoundChange(toggleSound(latest.current.sound)),
      volumeBy: (delta) => {
        const { sound: now } = latest.current;
        const volume = Math.min(1, Math.max(0, (now.muted ? 0 : now.volume) + delta));
        latest.current.onSoundChange({ volume, muted: volume === 0 });
      },
    };
    controlsRef.current = controls;
    return () => {
      if (controlsRef.current === controls) controlsRef.current = null;
    };
  }, [active, toggle, controlsRef]);

  const state: PlaybackState = playing ? "playing" : time > 0 ? "paused" : "idle";
  // One glyph slot: `Button.Icon` cross-fades the change in place.
  const PlayGlyph = playing ? Pause : Play;
  const position = formatLabel(labels.position, {
    current: formatClock(time),
    duration: formatClock(duration),
  });

  return (
    <>
      <div ref={zoomRef} className={styles.zoom} style={boxStyle} data-viewer-media="">
        {/* biome-ignore lint/a11y/useMediaCaption: an item brings no captions track */}
        <video
          ref={videoRef}
          className={styles.media}
          src={firstFrame(item.src)}
          poster={item.poster}
          preload="metadata"
          playsInline
          aria-label={item.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={onError}
          onLoadedData={() => setFramed(true)}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget;
            if (Number.isFinite(video.duration)) setDuration(video.duration);
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              onRatio(video.videoWidth / video.videoHeight);
            }
          }}
          onTimeUpdate={(event) => {
            if (!playing) setTime(event.currentTarget.currentTime);
          }}
        />
        {still && !framed ? <canvas ref={stillRef} className={styles.media} /> : null}
      </div>
      <div className={styles.center} data-hidden={playing || undefined}>
        <PlayDisk
          look="shade"
          state={state}
          labels={labels}
          disabled={false}
          covered={false}
          transferDisk={null}
          onToggle={toggle}
        />
      </div>
      <div className={styles.bottom} data-viewer-chrome="">
        {caption}
        <div className={cx(pill.shade, styles.controls)}>
          <Button.Root
            variant="ghost"
            tone="neutral"
            shape="circle"
            size="s"
            aria-label={playing ? labels.pause : labels.play}
            onClick={toggle}
          >
            <Button.Icon>
              <PlayGlyph fill="currentColor" />
            </Button.Icon>
          </Button.Root>
          <span className={timeClass} aria-hidden="true">
            {formatClock(time)}
          </span>
          <Slider
            className={styles.seek}
            size="s"
            tone="neutral"
            min={0}
            max={duration > 0 ? duration : 1}
            step={0.1}
            value={Math.min(time, duration || 0)}
            disabled={duration <= 0}
            aria-label={labels.seek}
            formatValue={() => position}
            onValueChange={(next) => {
              const video = videoRef.current;
              if (video) video.currentTime = next;
              setTime(next);
            }}
          />
          <span className={timeClass} aria-hidden="true">
            {formatClock(duration)}
          </span>
          <SoundControl sound={sound} onSoundChange={onSoundChange} labels={labels} />
        </div>
      </div>
    </>
  );
}

/**
 * The sound button with its level: an upright Slider in a small panel above the button. A hovering
 * pointer opens it by resting on the button, a finger by a tap, the keyboard by moving focus in;
 * a mouse click on the button mutes and unmutes. Open, it is a layer above the viewer's
 * (`useLayer`): Escape or a press elsewhere closes the level, not the viewer.
 */
function SoundControl({
  sound,
  onSoundChange,
  labels,
}: {
  sound: Sound;
  onSoundChange: (sound: Sound) => void;
  labels: MediaViewerLabels;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const pointerType = React.useRef("mouse");
  const leaveTimer = React.useRef(0);
  const [open, setOpen] = React.useState(false);
  const silent = sound.muted || sound.volume === 0;
  const MuteGlyph = silent ? VolumeX : Volume2;

  useLayer(open, {
    refs: [rootRef],
    dismiss: "pointerdown",
    onDismiss: (reason) => {
      // The focus goes back to the button first: its focus would open the level again.
      if (reason === "escape") buttonRef.current?.focus();
      setOpen(false);
    },
  });

  const show = () => {
    window.clearTimeout(leaveTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => {
      if (!rootRef.current?.contains(document.activeElement)) setOpen(false);
    }, LEVEL_LEAVE_MS);
  };

  React.useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover and focus of the button and its level together; the controls inside are the button and the slider
    <div
      ref={rootRef}
      className={styles.sound}
      data-open={open || undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") show();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") hideSoon();
      }}
      onFocus={show}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Button.Root
        ref={buttonRef}
        variant="ghost"
        tone="neutral"
        shape="circle"
        size="s"
        aria-label={silent ? labels.unmute : labels.mute}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType;
        }}
        onClick={() => {
          // A finger has no hover: its first tap opens the level, the next one mutes.
          if (pointerType.current !== "mouse" && !open) {
            show();
            return;
          }
          onSoundChange(toggleSound(sound));
        }}
      >
        <Button.Icon>
          <MuteGlyph />
        </Button.Icon>
      </Button.Root>
      <div className={cx(pill.shade, fieldTierClass, styles.level)} data-size="s">
        <Slider
          orientation="vertical"
          size="xs"
          tone="neutral"
          min={0}
          max={1}
          step={0.05}
          value={silent ? 0 : sound.volume}
          aria-label={labels.volume}
          formatValue={(value) =>
            formatLabel(labels.volumeValue, { value: Math.round(value * 100) })
          }
          onValueChange={(next) => onSoundChange({ volume: next, muted: next === 0 })}
        />
      </div>
    </div>
  );
}
