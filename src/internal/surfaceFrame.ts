/**
 * The frame of a surface that holds one entity: the metrics of each tier of the kit's one size axis
 * (padding, radius, zone gap, mark, title and description roles, the controls' tier) shared by
 * Card, Kpi and every surface built like them, so the surfaces of one screen line up and stay under
 * the page's own titles (surfaceFrame.module.css).
 */
import type { ControlSize } from "./states";
import styles from "./surfaceFrame.module.css";
import textRole from "./textRole.module.css";

/** Joined on the surface with `data-frame` (its tier): the metrics as `--frame-*` variables. */
export const surfaceFrameClass = styles.frame;

/**
 * The title of the surface's header, one text role per step, under the page's section title
 * (title-m 16): title-xs 13/16 · title-xs 13/16 · title-s 14/20 · title-m 16/24 · title-l 18/24.
 */
export const FRAME_TITLE: Record<ControlSize, string> = {
  xs: textRole.titleXs,
  s: textRole.titleXs,
  m: textRole.titleS,
  l: textRole.titleM,
  xl: textRole.titleL,
};

/** The line under the title: 12/16 · 12/16 · 13/20 · 14/20 · 14/20. */
export const FRAME_DESCRIPTION: Record<ControlSize, string> = {
  xs: textRole.caption,
  s: textRole.caption,
  m: textRole.bodyS,
  l: textRole.bodyM,
  xl: textRole.bodyM,
};
