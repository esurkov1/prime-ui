import type { LucideProps } from "lucide-react";
import type * as React from "react";

import { type DomainIconProps, useIconRoot } from "./glyph";
import { type IconName, iconRegistry } from "./registry";

export type { DomainIconProps } from "./glyph";

export type IconProps = DomainIconProps & {
  name: IconName;
};

/**
 * A kit glyph by name: decorative (`aria-hidden`), sized and toned like every kit icon, and
 * animated — its gesture plays once when the host it sits in is hovered or pressed.
 */
export function Icon({ name, ...rest }: IconProps) {
  const Glyph = iconRegistry[name];
  return <Glyph {...rest} />;
}

/**
 * Turns a domain glyph the kit lacks (any lucide-react icon) into a kit icon with the same
 * `size`, `tone`, host sizing and play trigger as `<Icon>`; its gesture is a soft pop of the
 * whole drawing. Call it once at module level.
 */
export function createIcon(glyph: React.ComponentType<LucideProps>) {
  const LucideGlyph = glyph;
  function DomainIcon({
    className,
    size,
    tone,
    animated,
    strokeWidth = 1.75,
    ...rest
  }: DomainIconProps) {
    const root = useIconRoot({ className, size, tone, animated, motion: "generic" });
    return (
      <LucideGlyph
        strokeWidth={strokeWidth}
        aria-hidden="true"
        {...root}
        {...(rest as LucideProps)}
      />
    );
  }
  DomainIcon.displayName = `Icon(${glyph.displayName ?? "Glyph"})`;
  return DomainIcon;
}
