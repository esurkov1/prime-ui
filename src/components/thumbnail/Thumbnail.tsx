import * as React from "react";

import { type ImageStatus, useImageStatus } from "@/hooks/useImageStatus";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor } from "@/internal/states";

import styles from "./Thumbnail.module.css";

/** Width ÷ height. `1:1` square · `4:3` / `3:2` photo · `16:9` wide cover · `3:4` portrait. */
export type ThumbnailRatio = "1:1" | "4:3" | "3:2" | "16:9" | "3:4";

type ThumbnailContextValue = {
  imageStatus: ImageStatus;
  setImageStatus: (status: ImageStatus) => void;
};

const [ThumbnailProvider, useThumbnailContext] =
  createComponentContext<ThumbnailContextValue>("Thumbnail");

export type ThumbnailRootProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Height tier: 24 · 32 · 40 · 48 · 64; width follows `ratio`. Default `m`. */
  size?: ControlSize;
  /** Aspect ratio, width ÷ height. Default `1:1`. */
  ratio?: ThumbnailRatio;
  /** Fallback fill and icon color (`--prime-color-palette-<hue>-*`). Default `gray`. */
  color?: PaletteColor;
  /** Fallback fill: `soft` tint with a hue icon, or `solid` hue with a contrasting icon. */
  variant?: "soft" | "solid";
  /** Fills the container width (cards, galleries); the height follows `ratio`. */
  fullWidth?: boolean;
  /** A faint inner ring around the frame, for photos with a white background on a light surface. */
  ring?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/** A preview of an object (product, vehicle, file, cover) at a fixed aspect ratio. People use Avatar. */
function ThumbnailRoot({
  size = "m",
  ratio = "1:1",
  color = "gray",
  variant = "soft",
  fullWidth = false,
  ring = false,
  className,
  children,
  ...rest
}: ThumbnailRootProps) {
  const [imageStatus, setImageStatus] = React.useState<ImageStatus>("idle");
  const value = React.useMemo(() => ({ imageStatus, setImageStatus }), [imageStatus]);

  return (
    <ThumbnailProvider value={value}>
      <div
        className={cx(styles.root, className)}
        {...toDataAttributes({
          size,
          ratio,
          color,
          variant,
          "full-width": fullWidth || undefined,
          ring: ring || undefined,
        })}
        {...rest}
      >
        {children}
      </div>
    </ThumbnailProvider>
  );
}
ThumbnailRoot.displayName = "Thumbnail.Root";

export type ThumbnailImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  /** Empty (default) when the text next to the thumbnail already names the object. */
  alt?: string;
  /** `cover` (default) crops to fill; `contain` shows the whole image on the fallback fill. */
  fit?: "cover" | "contain";
  ref?: React.Ref<HTMLImageElement>;
};

function ThumbnailImageInner({
  src,
  alt = "",
  fit = "cover",
  className,
  onLoad,
  onError,
  ...rest
}: ThumbnailImageProps) {
  const { setImageStatus } = useThumbnailContext();
  const image = useImageStatus(setImageStatus, { onLoad, onError });
  return (
    <img
      src={src}
      alt={alt}
      className={cx(styles.image, className)}
      onLoad={image.onLoad}
      onError={image.onError}
      {...toDataAttributes({ status: image.status, fit })}
      {...rest}
    />
  );
}

/** The picture; while it loads or after an error the Fallback shows through. */
function ThumbnailImage(props: ThumbnailImageProps) {
  // A new source remounts the image and starts again at `loading`.
  return <ThumbnailImageInner key={props.src} {...props} />;
}
ThumbnailImage.displayName = "Thumbnail.Image";

export type ThumbnailFallbackProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** Shown without an image, while it loads and when it fails: palette fill + centered icon. */
function ThumbnailFallback({ className, ...rest }: ThumbnailFallbackProps) {
  const { imageStatus } = useThumbnailContext();
  return (
    <span
      className={cx(styles.fallback, className)}
      aria-hidden={imageStatus === "loaded" ? true : undefined}
      {...rest}
    />
  );
}
ThumbnailFallback.displayName = "Thumbnail.Fallback";

export const Thumbnail = {
  Root: ThumbnailRoot,
  Image: ThumbnailImage,
  Fallback: ThumbnailFallback,
};
