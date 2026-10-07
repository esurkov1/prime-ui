import * as React from "react";

import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import type { ControlSize, PaletteColor } from "@/internal/states";

import styles from "./Thumbnail.module.css";

/** Width ÷ height. `1:1` square · `4:3` / `3:2` photo · `16:9` wide cover · `3:4` portrait. */
export type ThumbnailRatio = "1:1" | "4:3" | "3:2" | "16:9" | "3:4";

export type ThumbnailImageStatus = "idle" | "loading" | "loaded" | "error";

type ThumbnailContextValue = {
  setImageStatus: React.Dispatch<React.SetStateAction<ThumbnailImageStatus>>;
  imageStatus: ThumbnailImageStatus;
};

const [ThumbnailProvider, useThumbnailContext] =
  createComponentContext<ThumbnailContextValue>("Thumbnail");

export type ThumbnailRootProps = {
  /** Height tier: 24 · 32 · 40 · 48 · 64; width follows `ratio`. Ignored for width with `fullWidth`. */
  size?: ControlSize;
  /** Aspect ratio, width ÷ height. */
  ratio?: ThumbnailRatio;
  /** Fallback fill and icon color (`--prime-color-palette-<hue>-*`). */
  color?: PaletteColor;
  /** Fallback fill: `soft` tint with a hue icon, or `solid` hue with a contrasting icon. */
  variant?: "soft" | "solid";
  /** Fills the container width (cards, galleries); the height follows `ratio`. */
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A preview of an object (product, vehicle, file, cover) at a fixed aspect ratio. People use Avatar.
 */
const ThumbnailRoot = React.forwardRef<HTMLDivElement, ThumbnailRootProps>(
  (
    {
      size = "m",
      ratio = "1:1",
      color = "gray",
      variant = "soft",
      fullWidth,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [imageStatus, setImageStatus] = React.useState<ThumbnailImageStatus>("idle");
    const value = React.useMemo(() => ({ imageStatus, setImageStatus }), [imageStatus]);

    return (
      <ThumbnailProvider value={value}>
        <div
          ref={ref}
          className={cx(styles.root, className)}
          {...toDataAttributes({
            size,
            ratio,
            color,
            variant,
            "full-width": fullWidth || undefined,
          })}
          {...rest}
        >
          {children}
        </div>
      </ThumbnailProvider>
    );
  },
);
ThumbnailRoot.displayName = "Thumbnail.Root";

export type ThumbnailImageProps = {
  src: string;
  /** Empty (default) when the text next to the thumbnail already names the object. */
  alt?: string;
  /** `cover` (default) crops to fill; `contain` shows the whole image on the fallback fill. */
  fit?: "cover" | "contain";
  className?: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;

type ThumbnailImageInnerProps = ThumbnailImageProps & {
  setImageStatus: React.Dispatch<React.SetStateAction<ThumbnailImageStatus>>;
};

const ThumbnailImageInner = React.forwardRef<HTMLImageElement, ThumbnailImageInnerProps>(
  ({ setImageStatus, src, alt = "", fit = "cover", className, onLoad, onError, ...rest }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">("loading");

    React.useLayoutEffect(() => {
      setImageStatus("loading");
      return () => setImageStatus("idle");
    }, [setImageStatus]);

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cx(styles.image, className)}
        onLoad={(event) => {
          setStatus("loaded");
          setImageStatus("loaded");
          onLoad?.(event);
        }}
        onError={(event) => {
          setStatus("error");
          setImageStatus("error");
          onError?.(event);
        }}
        {...toDataAttributes({ status, fit })}
        {...rest}
      />
    );
  },
);
ThumbnailImageInner.displayName = "ThumbnailImageInner";

/** The picture; while it loads or after an error the Fallback shows through. */
const ThumbnailImage = React.forwardRef<HTMLImageElement, ThumbnailImageProps>((props, ref) => {
  const { setImageStatus } = useThumbnailContext();
  return (
    <ThumbnailImageInner key={props.src} ref={ref} setImageStatus={setImageStatus} {...props} />
  );
});
ThumbnailImage.displayName = "Thumbnail.Image";

export type ThumbnailFallbackProps = {
  /** An icon (sized to the tier) or a short label. */
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

/** Shown without an image, while it loads and when it fails: palette fill + centered icon. */
function ThumbnailFallback({ children, className, ...rest }: ThumbnailFallbackProps) {
  const { imageStatus } = useThumbnailContext();
  return (
    <span
      className={cx(styles.fallback, className)}
      aria-hidden={imageStatus === "loaded" ? true : undefined}
      {...rest}
    >
      {children}
    </span>
  );
}
ThumbnailFallback.displayName = "Thumbnail.Fallback";

export const Thumbnail = {
  Root: ThumbnailRoot,
  Image: ThumbnailImage,
  Fallback: ThumbnailFallback,
};
