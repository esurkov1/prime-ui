import type * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { iconBoxClass } from "@/internal/iconBox";
import palette from "@/internal/palette.module.css";
import type { ControlSize, PaletteColor, TextTone } from "@/internal/states";
import toneStyles from "@/internal/textTone.module.css";

import motionStyles from "./glyphMotion.module.css";
import styles from "./Icon.module.css";
import { useIconPlay } from "./iconPlay";

/** Props every kit icon takes: a named `<Icon>`, a glyph, or a `createIcon` domain icon. */
export type DomainIconProps = Omit<React.ComponentPropsWithoutRef<"svg">, "color"> & {
  /**
   * Explicit size on the icon scale (xs 14 · s 16 · m 20 · l 24 · xl 32). Without it the icon
   * follows its host: the host's `--prime-icon-size`, else the nearest control tier, else 16.
   */
  size?: ControlSize;
  /** Icon color by meaning; `default` inherits `currentColor`. */
  tone?: TextTone;
  /**
   * A palette hue for a category from data (a catalog section, a project colour), its readable
   * text step in both themes. Takes the place of `tone`.
   */
  color?: PaletteColor;
  /**
   * Makes the icon meaningful: `role="img"` named by this text instead of `aria-hidden`. Use it for
   * an icon that carries information alone (a «system» or «pinned» mark); inside a
   * `Tooltip.Trigger` it also becomes focusable.
   */
  label?: string;
  /** Stroke width on the 24-unit glyph grid. */
  strokeWidth?: number;
  /**
   * Plays the glyph's gesture once when its interactive host (button, link, tab, label) is
   * hovered or pressed on touch; outside a host, when the icon itself is hovered. `false` keeps
   * it still.
   */
  animated?: boolean;
  /**
   * A mark that follows a state instead of playing a gesture: `true` draws the glyph's stroke in
   * (its `draw` parts), `false` draws it out, both ways eased — a check that appears when a row is
   * ticked. Undefined: the usual one-shot gesture. A drawn icon plays no hover gesture.
   */
  drawn?: boolean;
  ref?: React.Ref<SVGSVGElement>;
};

/** A kit glyph component: an animated icon drawn on the 24-unit grid. */
export type Glyph = React.ComponentType<DomainIconProps> & {
  /** The Lucide glyph it is drawn from (PascalCase export name). */
  source: string;
};

/** Shared class names and attributes of every kit icon root. */
export function useIconRoot({
  className,
  size,
  tone = "default",
  color,
  label,
  animated = true,
  drawn,
  motion,
}: Pick<
  DomainIconProps,
  "className" | "size" | "tone" | "color" | "label" | "animated" | "drawn"
> & {
  /** `glyph` — parts carry their own `data-motion`; `generic` — the whole drawing pops. */
  motion: "glyph" | "generic";
}) {
  const tier = useOptionalControlSize();
  // A state-driven mark never plays the hover gesture: its stroke follows the state.
  const plays = animated && drawn === undefined;
  useIconPlay(plays);
  return {
    className: cx(
      styles.root,
      motionStyles.root,
      iconBoxClass(size, tier),
      toneStyles.tone,
      color !== undefined && palette.hue,
      className,
    ),
    "data-tone": tone === "default" || color !== undefined ? undefined : tone,
    "data-color": color,
    role: label === undefined ? undefined : "img",
    "aria-label": label,
    "aria-hidden": label === undefined ? true : undefined,
    "data-icon-motion": plays ? motion : undefined,
    "data-drawn": drawn === undefined ? undefined : String(drawn),
  } as const;
}

/**
 * Defines a kit glyph from its SVG body (paths copied from Lucide, parts annotated with
 * `data-motion`, see `glyphMotion.module.css`). Call once at module level.
 */
export function defineGlyph(source: string, body: React.ReactNode): Glyph {
  function GlyphIcon({
    className,
    size,
    tone,
    color,
    label,
    animated,
    drawn,
    strokeWidth = 1.75,
    ...rest
  }: DomainIconProps) {
    const root = useIconRoot({
      className,
      size,
      tone,
      color,
      label,
      animated,
      drawn,
      motion: "glyph",
    });
    return (
      // biome-ignore lint/a11y/noSvgWithoutTitle: `root` makes it aria-hidden, or role="img" named by `label`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...root}
        {...rest}
      >
        {body}
      </svg>
    );
  }
  GlyphIcon.displayName = `Glyph(${source})`;
  return Object.assign(GlyphIcon, { source });
}
