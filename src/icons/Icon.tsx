import type { LucideProps } from "lucide-react";
import * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { DividerContentContext } from "@/internal/DividerContentContext";

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

export type IconSurface = "none" | "raised";

type BaseIconProps = Omit<LucideProps, "size" | "color"> & {
  size?: IconSize;
  tone?: IconTone;
  /** Подложка под глиф в примерах и доках; внутри слотов кнопки/бейджа/поля — `none`. */
  surface?: IconSurface;
};

type IconComponent = React.ComponentType<LucideProps>;

function createIcon(IconGlyph: IconComponent) {
  const WrappedIcon = React.forwardRef<SVGSVGElement, BaseIconProps>(
    (
      {
        className,
        size: sizeProp,
        tone = "default",
        strokeWidth = 1.9,
        style,
        surface = "none",
        ...rest
      },
      ref,
    ) => {
      const controlSize = useOptionalControlSize();
      const insideDividerContent = React.useContext(DividerContentContext);
      const resolvedSize = (sizeProp ?? controlSize ?? "m") as IconResolvedSize;
      const sizeClass = insideDividerContent ? undefined : SIZE_CLASS[resolvedSize];

      const toneClassName =
        tone === "default"
          ? styles.toneDefault
          : tone === "subtle"
            ? styles.toneSubtle
            : tone === "accent"
              ? styles.toneAccent
              : styles.toneDanger;

      const glyph = (
        <IconGlyph
          ref={ref}
          className={cx(styles.root, sizeClass, toneClassName, className)}
          style={style}
          strokeWidth={strokeWidth}
          aria-hidden="true"
          {...rest}
        />
      );

      if (surface === "raised") {
        return <span className={styles.surfaceRaised}>{glyph}</span>;
      }
      return glyph;
    },
  );

  WrappedIcon.displayName = `EsIcon(${IconGlyph.displayName ?? "Glyph"})`;
  return WrappedIcon;
}

export type { BaseIconProps, IconSize, IconTone };
export { createIcon };
