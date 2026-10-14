import type * as React from "react";

import { type DomainIconProps, useIconRoot } from "./glyph";
import { type IconName, iconRegistry } from "./registry";

export type { DomainIconProps } from "./glyph";

export type IconProps = DomainIconProps & {
  name: IconName;
};

/** Any SVG icon component — a lucide-react glyph, an SVGR import, your own `<svg>` component. */
export type SvgGlyph = React.ComponentType<React.SVGAttributes<SVGSVGElement>>;

/**
 * A kit glyph by name: decorative (`aria-hidden`) unless it has a `label`, sized and toned like every kit icon, and
 * animated — its gesture plays once when the host it sits in is hovered or pressed.
 */
export function Icon({ name, ...rest }: IconProps) {
  const Glyph = iconRegistry[name];
  return <Glyph {...rest} />;
}

/**
 * Turns a domain glyph the kit lacks (any SVG icon component: lucide-react, SVGR) into a kit icon with the same
 * `size`, `tone`, host sizing and play trigger as `<Icon>`; its gesture is a soft pop of the
 * whole drawing. Call it once at module level.
 */
export function createIcon(glyph: SvgGlyph) {
  const SvgIcon = glyph;
  function DomainIcon({
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
      motion: "generic",
    });
    return <SvgIcon strokeWidth={strokeWidth} {...root} {...rest} />;
  }
  DomainIcon.displayName = `Icon(${glyph.displayName ?? "Glyph"})`;
  return DomainIcon;
}
