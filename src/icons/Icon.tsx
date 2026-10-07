import type { LucideProps } from "lucide-react";
import * as React from "react";

import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { DividerContentContext } from "@/internal/DividerContentContext";
import type { ControlSize, TextTone } from "@/internal/states";

import styles from "./Icon.module.css";

/** Explicit sizes map to `--prime-icon-*`: xs 14 · s 16 · m 20 · l 24 · xl 32. */
const SIZE_CLASS: Record<ControlSize, string> = {
  xs: styles.sizeXs,
  s: styles.sizeS,
  m: styles.sizeM,
  l: styles.sizeL,
  xl: styles.sizeXl,
};

type BaseIconProps = Omit<LucideProps, "size" | "color"> & {
  size?: ControlSize;
  /** Icon color; `default` inherits `currentColor`. */
  tone?: TextTone;
};

type IconComponent = React.ComponentType<LucideProps>;

function createIcon(IconGlyph: IconComponent) {
  const WrappedIcon = React.forwardRef<SVGSVGElement, BaseIconProps>(
    ({ className, size: sizeProp, tone = "default", strokeWidth = 1.75, style, ...rest }, ref) => {
      const controlSize = useOptionalControlSize();
      const insideDividerContent = React.useContext(DividerContentContext);
      /*
       * Explicit `size` → `--prime-icon-<size>`.
       * Otherwise the icon follows its host: the host's `--prime-icon-size` if it sets one
       * (Button, Badge, Kbd…), else `--prime-control-<tier>-icon` of the nearest
       * `ControlSizeProvider`, else the `m` control icon (16px).
       * Inside `Divider` content the divider sizes the svg itself.
       */
      const resolvedSize: ControlSize = sizeProp ?? controlSize ?? "m";
      const sizeClass = insideDividerContent
        ? undefined
        : cx(SIZE_CLASS[resolvedSize], sizeProp === undefined && styles.inherit);

      return (
        <IconGlyph
          ref={ref}
          className={cx(styles.root, sizeClass, className)}
          data-tone={tone === "default" ? undefined : tone}
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

export type { BaseIconProps };
export { createIcon };
