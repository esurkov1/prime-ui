import type * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { iconBoxClass } from "@/internal/iconBox";
import type { ControlSize, TextTone } from "@/internal/states";
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
  /** Icon color; `default` inherits `currentColor`. */
  tone?: TextTone;
  /** Stroke width on the 24-unit glyph grid. */
  strokeWidth?: number;
  /**
   * Plays the glyph's gesture once when its interactive host (button, link, tab, label) is
   * hovered or pressed on touch; outside a host, when the icon itself is hovered. `false` keeps
   * it still.
   */
  animated?: boolean;
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
  animated = true,
  motion,
}: Pick<DomainIconProps, "className" | "size" | "tone" | "animated"> & {
  /** `glyph` — parts carry their own `data-motion`; `generic` — the whole drawing pops. */
  motion: "glyph" | "generic";
}) {
  const tier = useOptionalControlSize();
  useIconPlay(animated);
  return {
    className: cx(
      styles.root,
      motionStyles.root,
      iconBoxClass(size, tier),
      toneStyles.tone,
      className,
    ),
    "data-tone": tone === "default" ? undefined : tone,
    "data-icon-motion": animated ? motion : undefined,
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
    animated,
    strokeWidth = 1.75,
    ...rest
  }: DomainIconProps) {
    const root = useIconRoot({ className, size, tone, animated, motion: "glyph" });
    return (
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
        aria-hidden="true"
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
