import type { LucideProps } from "lucide-react";
import type * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { iconBoxClass } from "@/internal/iconBox";
import type { ControlSize, TextTone } from "@/internal/states";
import toneStyles from "@/internal/textTone.module.css";

import styles from "./Icon.module.css";
import { type IconName, iconRegistry } from "./registry";

type Glyph = React.ComponentType<LucideProps>;

/** Props of an icon made by `createIcon`: everything `<Icon>` takes except `name`. */
export type DomainIconProps = Omit<LucideProps, "size" | "color" | "ref"> & {
  /**
   * Explicit size on the icon scale (xs 14 · s 16 · m 20 · l 24 · xl 32). Without it the icon
   * follows its host: the host's `--prime-icon-size`, else the nearest control tier, else 16.
   */
  size?: ControlSize;
  /** Icon color; `default` inherits `currentColor`. */
  tone?: TextTone;
  ref?: React.Ref<SVGSVGElement>;
};

export type IconProps = DomainIconProps & {
  name: IconName;
};

function IconSvg({
  glyph: GlyphSvg,
  className,
  size,
  tone = "default",
  strokeWidth = 1.75,
  ...rest
}: DomainIconProps & { glyph: Glyph }) {
  const tier = useOptionalControlSize();
  return (
    <GlyphSvg
      className={cx(styles.root, iconBoxClass(size, tier), toneStyles.tone, className)}
      data-tone={tone === "default" ? undefined : tone}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...rest}
    />
  );
}

/** A kit glyph by name: decorative (`aria-hidden`), sized and toned like every kit icon. */
export function Icon({ name, ...rest }: IconProps) {
  return <IconSvg glyph={iconRegistry[name]} {...rest} />;
}

/**
 * Turns a domain glyph the kit lacks (any lucide-react icon) into a kit icon with the same
 * `size`, `tone` and host sizing as `<Icon>`. Call it once at module level.
 */
export function createIcon(glyph: Glyph) {
  function DomainIcon(props: DomainIconProps) {
    return <IconSvg glyph={glyph} {...props} />;
  }
  DomainIcon.displayName = `Icon(${glyph.displayName ?? "Glyph"})`;
  return DomainIcon;
}
