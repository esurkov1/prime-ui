import * as React from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { useControllableState } from "@/hooks/useControllableState";
import { useImageStatus } from "@/hooks/useImageStatus";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { formatClock } from "@/internal/formatClock";
import {
  createImageSlot,
  type ImageSlotFallbackProps,
  type ImageSlotImageProps,
} from "@/internal/imageSlot";
import { MediaPlayMark } from "@/internal/mediaDisk";
import { firstFrame } from "@/internal/mediaFrame";
import pill from "@/internal/mediaPill.module.css";
import { useMediaSession } from "@/internal/mediaSession";
import { useMediaSlotSize } from "@/internal/mediaSlot";
import palette from "@/internal/palette.module.css";
import { press } from "@/internal/press";
import { Slot } from "@/internal/slot";
import { type ControlSize, compactTier, type PaletteColor } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";

import styles from "./Thumbnail.module.css";

/** Width ÷ height. `1:1` square · `4:3` / `3:2` photo · `16:9` wide cover · `3:4` portrait. */
export type ThumbnailRatio = "1:1" | "4:3" | "3:2" | "16:9" | "3:4";

const slot = createImageSlot("Thumbnail", { image: styles.image, fallback: styles.fallback });

/** The frame's props; each is described in `api.ts`. */
export type ThumbnailRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color" | "defaultChecked" | "onChange"
> & {
  size?: ControlSize;
  ratio?: ThumbnailRatio;
  color?: PaletteColor;
  variant?: "soft" | "solid";
  fullWidth?: boolean;
  ring?: boolean;
  asChild?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * A preview of an object (product, vehicle, file, cover) at a fixed aspect ratio. People use Avatar.
 * With `asChild` it is a link or a button that opens the object; with the checked triad a
 * selectable tile of a media library.
 */
function ThumbnailRoot({
  size: sizeProp,
  ratio = "1:1",
  color = "gray",
  variant = "soft",
  fullWidth = false,
  ring = false,
  asChild = false,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  className,
  children,
  ref,
  ...rest
}: ThumbnailRootProps) {
  // In a media slot (a dialog or card mark) the picture takes the slot's size.
  const { size, provide } = useHostTier(useMediaSlotSize("thumbnail") ?? sizeProp);
  const selectable =
    checkedProp !== undefined || defaultChecked !== undefined || onCheckedChange !== undefined;
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked ?? false,
    onChange: onCheckedChange,
  });
  const interactive = asChild || selectable;
  const frame = {
    className: cx(styles.root, palette.hue, interactive && press.press, className),
    ...toDataAttributes({
      size,
      ratio,
      color,
      variant,
      "full-width": fullWidth || undefined,
      ring: ring || undefined,
      interactive: interactive || undefined,
      checked: selectable ? checked : undefined,
    }),
  };

  if (selectable) {
    const { onClick } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return provide(
      <slot.ImageSlotProvider>
        {/* biome-ignore lint/a11y/useSemanticElements: a picture tile cannot be an <input>; the button carries the checkbox role and its state */}
        <button
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          role="checkbox"
          aria-checked={checked}
          {...frame}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            onClick?.(event);
            if (!event.defaultPrevented) setChecked(!checked);
          }}
        >
          {children}
          <span className={cx(styles.check, pill.choice)} aria-hidden="true">
            <Checkbox.Indicator checked={checked} size={fullWidth ? "s" : compactTier(size)} />
          </span>
        </button>
      </slot.ImageSlotProvider>,
    );
  }

  if (asChild) {
    return provide(
      <slot.ImageSlotProvider>
        <Slot {...rest} {...frame} ref={ref}>
          {children}
        </Slot>
      </slot.ImageSlotProvider>,
    );
  }

  return provide(
    <slot.ImageSlotProvider>
      <div ref={ref} {...frame} {...rest}>
        {children}
      </div>
    </slot.ImageSlotProvider>,
  );
}
ThumbnailRoot.displayName = "Thumbnail.Root";

export type ThumbnailImageProps = ImageSlotImageProps & {
  fit?: "cover" | "contain";
};

/** The picture; while it loads or after an error the Fallback shows through. */
function ThumbnailImage({ fit = "cover", ...rest }: ThumbnailImageProps) {
  return <slot.Image {...rest} data-fit={fit} />;
}
ThumbnailImage.displayName = "Thumbnail.Image";

export type ThumbnailVideoProps = Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  "src" | "poster" | "controls" | "autoPlay" | "muted" | "loop" | "children"
> & {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  fit?: "cover" | "contain";
  formatDuration?: (seconds: number) => string;
  ref?: React.Ref<HTMLVideoElement>;
};

function ThumbnailVideoInner({
  src,
  poster,
  controls = false,
  autoPlay = false,
  fit = "cover",
  formatDuration = formatClock,
  className,
  onLoadedData,
  onError,
  onLoadedMetadata,
  onPlay,
  onPause,
  ref,
  ...rest
}: ThumbnailVideoProps) {
  const report = slot.useReportStatus();
  // React writes no `muted` attribute: the property is set on the node, before it can play.
  const mute = React.useCallback(
    (node: HTMLVideoElement | null) => {
      if (node) node.muted = autoPlay && !controls;
    },
    [autoPlay, controls],
  );
  const sessionRef = React.useRef<HTMLVideoElement | null>(null);
  // A video played with sound is the one sound of the page (`internal/mediaSession`).
  useMediaSession(sessionRef);
  const videoRef = useMergedRefs<HTMLVideoElement | null>(mute, sessionRef, ref);
  const media = useImageStatus<HTMLVideoElement>(report, { onError });
  const [duration, setDuration] = React.useState<number | null>(null);
  const [playing, setPlaying] = React.useState(false);
  // Read once: a clip that starts moving later, when the setting changes, would be a surprise.
  const [still] = React.useState(prefersReducedMotion);
  const loops = autoPlay && !still && !controls;
  return (
    <>
      <video
        {...rest}
        ref={videoRef}
        src={poster ? src : firstFrame(src)}
        poster={poster}
        controls={controls}
        preload="metadata"
        playsInline
        {...(loops ? { autoPlay: true, loop: true } : {})}
        className={cx(styles.image, styles.video, className)}
        data-fit={fit}
        data-status={media.status}
        // Without a poster the first frame is the picture: loaded once it is drawn. With a poster
        // the poster is the picture, and `preload="metadata"` may never draw a frame: loaded once
        // the metadata is in.
        onLoadedData={(event) => {
          if (!poster) media.onLoad(event);
          onLoadedData?.(event);
        }}
        onError={media.onError}
        onLoadedMetadata={(event) => {
          const seconds = event.currentTarget.duration;
          if (Number.isFinite(seconds)) setDuration(seconds);
          if (poster) media.onLoad(event);
          onLoadedMetadata?.(event);
        }}
        onPlay={(event) => {
          setPlaying(true);
          onPlay?.(event);
        }}
        onPause={(event) => {
          setPlaying(false);
          onPause?.(event);
        }}
      />
      {/* A still frame says it is a video; the native controls (or a clip that loops) say it
          themselves. The mark fades out while the video plays and back on a pause. */}
      {!controls && !loops ? <MediaPlayMark shown={!playing} className={styles.play} /> : null}
      {!controls && duration !== null ? (
        <span className={cx(textRole.caption, pill.pill, styles.duration)}>
          {formatDuration(duration)}
        </span>
      ) : null}
    </>
  );
}

/**
 * A video in the frame: the first frame (or `poster`) while still, a play mark and the duration;
 * `controls` to watch in place, `autoPlay` for a muted looping clip. Reports its load like an
 * image, so the Fallback shows until the first frame is there.
 */
function ThumbnailVideo(props: ThumbnailVideoProps) {
  // A new source starts again at `loading`.
  return <ThumbnailVideoInner key={props.src} {...props} />;
}
ThumbnailVideo.displayName = "Thumbnail.Video";

export type ThumbnailFallbackProps = ImageSlotFallbackProps;

/** Shown without an image, while it loads and when it fails: palette fill + centered icon. */
const ThumbnailFallback = slot.Fallback;

export const Thumbnail = {
  Root: ThumbnailRoot,
  Image: ThumbnailImage,
  Video: ThumbnailVideo,
  Fallback: ThumbnailFallback,
};
