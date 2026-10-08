import * as React from "react";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import palette from "@/internal/palette.module.css";
import { Slot } from "@/internal/slot";
import type { ControlSize, PaletteColor, Tone } from "@/internal/states";

import styles from "./Timeline.module.css";

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TimelineRootProps = {
  /** Tier of text, dots and row rhythm. Default `m` (rows 64px). */
  size?: ControlSize;
  /**
   * Who gets the highlighted look (pill, accent title and dot):
   * `current` (default) — the `current` row keeps it; interactive rows get a faint hover wash.
   * `hover` — the row under the pointer or with keyboard focus, transiently; `current` keeps only
   * its semantics (`aria-current`), no persistent highlight.
   */
  highlight?: "current" | "hover";
  /** `Timeline.Group` elements. */
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

function TimelineRoot({
  size = "m",
  highlight = "current",
  children,
  className,
  ...rest
}: TimelineRootProps) {
  return (
    <ControlSizeProvider value={size}>
      <div
        {...rest}
        className={cx(styles.root, className)}
        {...toDataAttributes({ size, highlight })}
      >
        {children}
      </div>
    </ControlSizeProvider>
  );
}
TimelineRoot.displayName = "Timeline.Root";

// ─── Group ────────────────────────────────────────────────────────────────────

export type TimelineGroupProps = {
  /** Group heading (e.g. «Недавно»); labels the list via `aria-labelledby`. */
  label?: React.ReactNode;
  /** `Timeline.Item` and `Timeline.Gap` elements. */
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLOListElement>;
} & Omit<React.OlHTMLAttributes<HTMLOListElement>, "children">;

/** One labelled `<ol>` of events. The connecting line runs from its first dot to its last. */
function TimelineGroup({ label, children, className, ...rest }: TimelineGroupProps) {
  const labelId = React.useId();
  const hasLabel = label !== undefined && label !== null && label !== false;
  return (
    <div className={styles.group}>
      {hasLabel ? (
        <div id={labelId} className={styles.groupLabel}>
          {label}
        </div>
      ) : null}
      <ol
        aria-labelledby={hasLabel ? labelId : undefined}
        {...rest}
        className={cx(styles.list, className)}
      >
        {children}
      </ol>
    </div>
  );
}
TimelineGroup.displayName = "Timeline.Group";

// ─── Item ─────────────────────────────────────────────────────────────────────

export type TimelineItemProps = {
  /** Decorative dot hue (categorization). Default `blue`, shown at reduced emphasis. */
  color?: PaletteColor;
  /** Semantic dot color (status). Wins over `color`; shown at full emphasis. */
  tone?: Tone;
  /** The current row (open detail, latest event): soft pill, accent title and dot; `data-state="active"`, `aria-current`. */
  current?: boolean;
  /** Renders the row as a link. */
  href?: string;
  /** Renders the row as the single child element (router link etc.); the dot is prepended to its children. */
  asChild?: boolean;
  /** Renders the row as a `button` (unless `href` / `asChild`). */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** `Timeline.Title`, `Timeline.Meta`, `Timeline.Value`. */
  children: React.ReactNode;
  className?: string;
  /** The row element (`a`, `button`, `div` or the `asChild` element). */
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "color" | "onClick"> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel" | "download">;

function TimelineItem({
  color = "blue",
  tone,
  current = false,
  href,
  asChild,
  onClick,
  children,
  className,
  ref,
  ...rest
}: TimelineItemProps) {
  // A callback ref fits whichever element the row renders.
  const rowRef = useMergedRefs<HTMLElement | null>(ref);
  const interactive = Boolean(asChild || href || onClick);
  const rowProps = {
    ...rest,
    ref: rowRef,
    className: cx(palette.hue, styles.row, className),
    "aria-current": current ? ("true" as const) : undefined,
    ...toDataAttributes({
      state: current ? "active" : "inactive",
      color: tone ? undefined : color,
      tone,
      interactive: interactive || undefined,
    }),
  };
  const dot = <span className={styles.dot} aria-hidden="true" />;

  let row: React.ReactNode;
  if (asChild) {
    const child = React.Children.only(children);
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      throw new Error("Timeline.Item asChild needs a single element child");
    }
    row = (
      <Slot {...rowProps} onClick={onClick}>
        {React.cloneElement(
          child,
          undefined,
          <>
            {dot}
            {child.props.children}
          </>,
        )}
      </Slot>
    );
  } else if (href) {
    row = (
      <a {...rowProps} href={href} onClick={onClick}>
        {dot}
        {children}
      </a>
    );
  } else if (onClick) {
    row = (
      <button {...rowProps} type="button" onClick={onClick}>
        {dot}
        {children}
      </button>
    );
  } else {
    row = (
      <div {...rowProps}>
        {dot}
        {children}
      </div>
    );
  }

  return <li className={styles.item}>{row}</li>;
}
TimelineItem.displayName = "Timeline.Item";

// ─── Parts ────────────────────────────────────────────────────────────────────

export type TimelineTitleProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/** First line: the event. Medium, primary (accent on the active row); wraps when narrow. */
function TimelineTitle({ children, className, ...rest }: TimelineTitleProps) {
  return (
    <span {...rest} className={cx(styles.title, className)}>
      {children}
    </span>
  );
}
TimelineTitle.displayName = "Timeline.Title";

export type TimelineMetaProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/** Second line: date and relative time, muted, tabular numbers. Emphasize a part with `Timeline.MetaPrimary` or `<strong>`. */
function TimelineMeta({ children, className, ...rest }: TimelineMetaProps) {
  return (
    <span {...rest} className={cx(styles.meta, className)}>
      {children}
    </span>
  );
}
TimelineMeta.displayName = "Timeline.Meta";

export type TimelineMetaPrimaryProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/** Emphasized part of the meta line (the date): primary, medium. */
function TimelineMetaPrimary({ children, className, ...rest }: TimelineMetaPrimaryProps) {
  return (
    <span {...rest} className={cx(styles.metaPrimary, className)}>
      {children}
    </span>
  );
}
TimelineMetaPrimary.displayName = "Timeline.MetaPrimary";

export type TimelineValueProps = {
  /** Text color. Default `neutral` (primary text). */
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/**
 * Trailing amount: right-aligned, vertically centered, tabular numbers. Add `Timeline.ValueMeta` for a
 * muted second line. Moves under the meta below 20rem.
 */
function TimelineValue({ tone = "neutral", children, className, ...rest }: TimelineValueProps) {
  return (
    <span {...rest} className={cx(styles.value, className)} {...toDataAttributes({ tone })}>
      {children}
    </span>
  );
}
TimelineValue.displayName = "Timeline.Value";

export type TimelineValueMetaProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

/** Second line inside `Timeline.Value` (category, unit): meta size, muted, right-aligned under the value. */
function TimelineValueMeta({ children, className, ...rest }: TimelineValueMetaProps) {
  return (
    <span {...rest} className={cx(styles.valueMeta, className)}>
      {children}
    </span>
  );
}
TimelineValueMeta.displayName = "Timeline.ValueMeta";

// ─── Gap ──────────────────────────────────────────────────────────────────────

export type TimelineGapMetaProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** A caption on the right of a gap (e.g. «сейчас»). */
function TimelineGapMeta({ className, ...rest }: TimelineGapMetaProps) {
  return <span className={cx(styles.gapTrailing, className)} {...rest} />;
}
TimelineGapMeta.displayName = "Timeline.GapMeta";

export type TimelineGapProps = {
  /** Caption color and hollow dot. Default `neutral` (muted); `warning` / `danger` flag a long interval. */
  tone?: Tone;
  /** Interval caption, e.g. «40 дней · 2 200 км без обслуживания», and an optional `Timeline.GapMeta`. */
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

/**
 * Interval between two events: a shorter row with a small hollow dot on a dashed segment and a
 * muted caption. Renders an `li`, so it goes inside `Timeline.Group` between items.
 */
function TimelineGap({ tone = "neutral", children, className, ...rest }: TimelineGapProps) {
  const parts = React.Children.toArray(children);
  const isMeta = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === TimelineGapMeta;
  const caption = parts.filter((child) => !isMeta(child));
  const meta = parts.filter(isMeta);
  return (
    <li className={cx(styles.item, styles.gapItem)}>
      <div {...rest} className={cx(styles.gapRow, className)} {...toDataAttributes({ tone })}>
        <span className={styles.gapDot} aria-hidden="true" />
        <span className={styles.gapCaption}>{caption}</span>
        {meta}
      </div>
    </li>
  );
}
TimelineGap.displayName = "Timeline.Gap";

export const Timeline = {
  Root: TimelineRoot,
  Group: TimelineGroup,
  Item: TimelineItem,
  Title: TimelineTitle,
  Meta: TimelineMeta,
  MetaPrimary: TimelineMetaPrimary,
  Value: TimelineValue,
  ValueMeta: TimelineValueMeta,
  Gap: TimelineGap,
  GapMeta: TimelineGapMeta,
};
