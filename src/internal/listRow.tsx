import * as React from "react";

import { Avatar } from "@/components/avatar/Avatar";
import { Badge } from "@/components/badge/Badge";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Thumbnail } from "@/components/thumbnail/Thumbnail";
import { ControlSizeProvider } from "./ControlSizeContext";
import { cx } from "./cx";
import { iconBoxStyles, iconSlotClass } from "./iconBox";
import styles from "./listRow.module.css";
import { isPart } from "./parts";
import { type ControlSize, listControlTier, listMarkSize, type Tone } from "./states";

/**
 * The one list row of the kit (List, Sidebar, the rows of menus, Select, CommandMenu, Timeline, the
 * file queue, legends). Its CSS module draws the row; these parts size what every host sizes the same
 * way — the mark and the controls:
 *   [mark] [title · number · badges / description] [meta · count] [controls]
 * A host gives the row its element, role and keyboard; the tier comes from the host
 * (`fieldTierClass` + `listRowStyles.tier` with `data-size`).
 */
export { styles as listRowStyles };

/** Whether a row stands beside a description (two lines) or alone (one line). */
export type ListRowLines = "line" | "two";

type ListRowMarkProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  size: ControlSize;
  lines: ListRowLines;
  tone?: Tone;
  children: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};

/**
 * The leading mark: a glyph of the tier (bare beside one line, on a neutral tile as tall as two
 * lines beside a description; `tone` colours the tile), an Avatar, a ProgressCircle or a Thumbnail
 * without its own `size` sized under the row (internal/states `listMarkSize`), a `Badge.Dot` in an
 * icon-wide box. Decorative, except a ring: it names the record's state.
 */
export function ListRowMark({ size, lines, tone, className, children, ...rest }: ListRowMarkProps) {
  const parts = React.Children.toArray(children);
  const dot = parts.some((child) => isPart(child, Badge.Dot));
  const ring = parts.some((child) => isPart(child, ProgressCircle));
  const picture =
    ring || parts.some((child) => isPart(child, Avatar.Root) || isPart(child, Thumbnail.Root));
  const marks = listMarkSize[lines];
  const sized = React.Children.map(children, (child) => {
    const kind = isPart(child, Avatar.Root)
      ? "avatar"
      : isPart(child, ProgressCircle)
        ? "ring"
        : isPart(child, Thumbnail.Root)
          ? "thumbnail"
          : null;
    if (kind === null) return child;
    const own = child as React.ReactElement<{ size?: unknown }>;
    return own.props.size === undefined
      ? React.cloneElement(own, { size: marks[kind][size] })
      : child;
  });

  if (lines === "two" && !dot && !picture) {
    return (
      <span
        {...rest}
        className={cx(iconBoxStyles.tile, iconSlotClass, styles.mark, className)}
        data-size={listMarkSize.two.tile[size]}
        data-tone={tone}
        data-kind="tile"
        aria-hidden="true"
      >
        {children}
      </span>
    );
  }
  return (
    <span
      {...rest}
      className={cx(styles.mark, !picture && !dot && iconSlotClass, className)}
      data-kind={dot ? "dot" : picture ? "picture" : "glyph"}
      aria-hidden={ring ? undefined : "true"}
    >
      {/* A dot standing for an icon takes the large dot, as the Sidebar's marks do. */}
      {dot ? <ControlSizeProvider value="l">{sized}</ControlSizeProvider> : sized}
    </span>
  );
}

/** The tier the row's own controls take (`listControlTier`), provided to them. */
export function ListRowControls({
  size,
  lines,
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  size: ControlSize;
  lines: ListRowLines;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <ControlSizeProvider value={listControlTier[lines][size]}>
      <div {...rest} className={cx(styles.actions, className)}>
        {children}
      </div>
    </ControlSizeProvider>
  );
}
