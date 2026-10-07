import type * as React from "react";

import { cx } from "@/internal/cx";

import styles from "./ExampleSurface.module.css";
import {
  PLAYGROUND_PREVIEW_SURFACES,
  type PlaygroundPreviewSurface,
} from "./PlaygroundPreviewTheme";

export type ExampleSurfaceProps = {
  className?: string;
  /** Which layer the demo imitates. Default `surface` (a card). */
  tone?: PlaygroundPreviewSurface;
  children: React.ReactNode;
};

/** A card-like container for demos: canvas, card (`surface`), floating layer (`raised`) or accent wash. */
export default function ExampleSurface({
  className,
  tone = "surface",
  children,
}: ExampleSurfaceProps) {
  return (
    <div className={cx(styles.root, className)} data-surface={tone}>
      {children}
    </div>
  );
}

export type SurfaceGalleryProps = {
  /** Rendered once per surface. A function receives the surface, e.g. to vary ids. */
  children: React.ReactNode | ((surface: PlaygroundPreviewSurface) => React.ReactNode);
  surfaces?: ReadonlyArray<PlaygroundPreviewSurface>;
  className?: string;
};

/** The same content side by side on canvas, surface, raised and accent: a quick contrast check. */
export function SurfaceGallery({
  children,
  surfaces = PLAYGROUND_PREVIEW_SURFACES.map((s) => s.value),
  className,
}: SurfaceGalleryProps) {
  return (
    <div className={cx(styles.gallery, className)}>
      {PLAYGROUND_PREVIEW_SURFACES.filter((s) => surfaces.includes(s.value)).map((s) => (
        <div key={s.value} className={styles.galleryCell}>
          <span className={styles.galleryLabel}>
            {s.label}
            <span className={styles.galleryHint}>{s.hint}</span>
          </span>
          <ExampleSurface tone={s.value}>
            {typeof children === "function" ? children(s.value) : children}
          </ExampleSurface>
        </div>
      ))}
    </div>
  );
}
