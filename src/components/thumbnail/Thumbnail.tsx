import type * as React from "react";

import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import {
  createImageSlot,
  type ImageSlotFallbackProps,
  type ImageSlotImageProps,
} from "@/internal/imageSlot";
import palette from "@/internal/palette.module.css";
import type { ControlSize, PaletteColor } from "@/internal/states";

import styles from "./Thumbnail.module.css";

/** Width ÷ height. `1:1` square · `4:3` / `3:2` photo · `16:9` wide cover · `3:4` portrait. */
export type ThumbnailRatio = "1:1" | "4:3" | "3:2" | "16:9" | "3:4";

const slot = createImageSlot("Thumbnail", { image: styles.image, fallback: styles.fallback });

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
  return (
    <slot.ImageSlotProvider>
      <div
        className={cx(styles.root, palette.hue, className)}
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
    </slot.ImageSlotProvider>
  );
}
ThumbnailRoot.displayName = "Thumbnail.Root";

export type ThumbnailImageProps = ImageSlotImageProps & {
  /** `cover` (default) crops to fill; `contain` shows the whole image on the fallback fill. */
  fit?: "cover" | "contain";
};

/** The picture; while it loads or after an error the Fallback shows through. */
function ThumbnailImage({ fit = "cover", ...rest }: ThumbnailImageProps) {
  return <slot.Image {...rest} data-fit={fit} />;
}
ThumbnailImage.displayName = "Thumbnail.Image";

export type ThumbnailFallbackProps = ImageSlotFallbackProps;

/** Shown without an image, while it loads and when it fails: palette fill + centered icon. */
const ThumbnailFallback = slot.Fallback;

export const Thumbnail = {
  Root: ThumbnailRoot,
  Image: ThumbnailImage,
  Fallback: ThumbnailFallback,
};
