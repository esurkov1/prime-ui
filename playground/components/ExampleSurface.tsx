import type * as React from "react";

import { Typography } from "@/components/typography/Typography";
import { cx } from "@/internal/cx";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";

import styles from "./ExampleSurface.module.css";
import {
  PLAYGROUND_PREVIEW_SURFACES,
  type PlaygroundPreviewSurface,
} from "./PlaygroundPreviewTheme";

export type ExampleSurfaceProps = {
  className?: string;
  /** Which layer the demo imitates. Default `card`. */
  tone?: PlaygroundPreviewSurface;
  children: React.ReactNode;
};

/**
 * A container for demos on one layer of the ladder (foundation §4): the page or a card. It carries that layer's `data-depth`, so controls inside take the
 * layer's fills.
 */
export default function ExampleSurface({
  className,
  tone = "card",
  children,
}: ExampleSurfaceProps) {
  const depth = PLAYGROUND_PREVIEW_SURFACES.find((s) => s.value === tone)?.depth ?? 0;
  return (
    <div className={cx(styles.root, className)} data-surface={tone} data-depth={depth}>
      <SurfaceDepthProvider value={depth}>{children}</SurfaceDepthProvider>
    </div>
  );
}

export type SurfaceGalleryProps = {
  /** Rendered once per layer. A function receives the layer, e.g. to vary ids. */
  children: React.ReactNode | ((surface: PlaygroundPreviewSurface) => React.ReactNode);
  surfaces?: ReadonlyArray<PlaygroundPreviewSurface>;
  className?: string;
};

/** The same content side by side on every layer: a quick contrast check. */
export function SurfaceGallery({
  children,
  surfaces = PLAYGROUND_PREVIEW_SURFACES.map((s) => s.value),
  className,
}: SurfaceGalleryProps) {
  return (
    <div className={cx(styles.gallery, className)} data-depth={0}>
      <SurfaceDepthProvider value={0}>
        {PLAYGROUND_PREVIEW_SURFACES.filter((s) => surfaces.includes(s.value)).map((s) => (
          <div key={s.value} className={styles.galleryCell}>
            <Typography as="span" variant="caption" weight="medium">
              {s.label}
            </Typography>
            <ExampleSurface tone={s.value}>
              {typeof children === "function" ? children(s.value) : children}
            </ExampleSurface>
          </div>
        ))}
      </SurfaceDepthProvider>
    </div>
  );
}
