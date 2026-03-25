import type { LucideProps } from "lucide-react";
import * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";

import styles from "./Icon.module.css";

type IconTone = "default" | "subtle" | "accent" | "danger";
type IconSize = "s" | "m" | "l" | "xl";
type IconResolvedSize = "xs" | IconSize;

const SIZE_CLASS: Record<IconResolvedSize, string> = {
  xs: styles.sizeXs,
  s: styles.sizeS,
  m: styles.sizeM,
  l: styles.sizeL,
  xl: styles.sizeXl,
};

type BaseIconProps = Omit<LucideProps, "size" | "color"> & {
  size?: IconSize;
  tone?: IconTone;
};

type IconComponent = React.ComponentType<LucideProps>;

function createIcon(IconGlyph: IconComponent) {
  const WrappedIcon = React.forwardRef<SVGSVGElement, BaseIconProps>(
    ({ className, size: sizeProp, tone = "default", strokeWidth = 1.9, style, ...rest }, ref) => {
      const controlSize = useOptionalControlSize();
      const size = (sizeProp ?? controlSize ?? "m") as IconResolvedSize;

      const toneClassName =
        tone === "default"
          ? styles.toneDefault
          : tone === "subtle"
            ? styles.toneSubtle
            : tone === "accent"
              ? styles.toneAccent
              : styles.toneDanger;

      return (
        <IconGlyph
          ref={ref}
          className={cx(styles.root, SIZE_CLASS[size], toneClassName, className)}
          style={style}
          strokeWidth={strokeWidth}
          aria-hidden="true"
          {...rest}
        />
      );
    },
  );

  WrappedIcon.displayName = `EsIcon(${IconGlyph.displayName ?? "Glyph"})`;
  return WrappedIcon;
}

export type { BaseIconProps, IconSize, IconTone };
export { createIcon };
