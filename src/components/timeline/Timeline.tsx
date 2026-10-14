import * as React from "react";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { InteractiveElement } from "@/internal/interactiveElement";
import palette from "@/internal/palette.module.css";
import { isPart } from "@/internal/parts";
import press from "@/internal/press.module.css";
import { slotChild } from "@/internal/slot";
import type { ControlSize, PaletteColor, Tone } from "@/internal/states";
import { touchTargetRowClass } from "@/internal/touchTarget";

import styles from "./Timeline.module.css";

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TimelineRootProps = {
  /** Tier of text, dots and row rhythm. Default `m` (rows 64px). */
  size?: ControlSize;
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

function TimelineRoot({ size = "m", children, className, ...rest }: TimelineRootProps) {
  return (
    <ControlSizeProvider value={size}>
      <div {...rest} className={cx(styles.root, className)} {...toDataAttributes({ size })}>
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
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLOListElement>;
} & Omit<React.OlHTMLAttributes<HTMLOListElement>, "children">;

type EdgeValue = { first: boolean; last: boolean; beforeGap?: boolean };

/**
 * Where an event sits in its group. The group tells each event, so the line stops at the first
 * and the last dot from `data-first` / `data-last` — `:first-child` / `:last-child` are not
 * re-evaluated by every engine when an event is added next to a kept one.
 */
const EdgeContext = React.createContext<EdgeValue>({ first: false, last: false });

const isGap = (child: React.ReactNode) => React.isValidElement(child) && child.type === TimelineGap;

/** One labelled `<ol>` of events. The connecting line runs from its first dot to its last. */
function TimelineGroup({ label, children, className, ...rest }: TimelineGroupProps) {
  const labelId = React.useId();
  const hasLabel = label !== undefined && label !== null && label !== false;
  const events = React.Children.toArray(children);
  const items = events.map((child, index) => (
    <EdgeContext.Provider
      key={React.isValidElement(child) ? child.key : index}
      value={{
        first: index === 0,
        last: index === events.length - 1,
        // The line under an event that a gap follows turns dashed (no `:has(+ …)` in CSS).
        beforeGap: isGap(events[index + 1]),
      }}
    >
      {child}
    </EdgeContext.Provider>
  ));
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
        {items}
      </ol>
    </div>
  );
}
TimelineGroup.displayName = "Timeline.Group";

function edgeAttributes({ first, last, beforeGap }: EdgeValue) {
  return {
    first: first || undefined,
    last: last || undefined,
    "before-gap": beforeGap || undefined,
  };
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export type TimelineItemProps = {
  /** Decorative dot hue (categorization). Default `blue`, shown at reduced emphasis. */
  color?: PaletteColor;
  /** Semantic dot color (status). Wins over `color`; shown at full emphasis. */
  tone?: Tone;
  /** Renders the row as a link. */
  href?: string;
  /** Renders the row as the single child element (router link etc.); the dot is prepended to its children. */
  asChild?: boolean;
  /** Renders the row as a `button` (unless `href` / `asChild`). */
  onClick?: React.MouseEventHandler<HTMLElement>;
  children: React.ReactNode;
  className?: string;
  /** The row element (`a`, `button`, `div` or the `asChild` element). */
  ref?: React.Ref<HTMLElement>;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "color" | "onClick"> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel" | "download">;

function TimelineItem({
  color = "blue",
  tone,
  href,
  asChild,
  onClick,
  children,
  className,
  ref,
  target,
  rel,
  download,
  ...rest
}: TimelineItemProps) {
  const edge = React.useContext(EdgeContext);
  const interactive = Boolean(asChild || href || onClick);
  const rowProps = {
    ...rest,
    ref,
    className: cx(
      palette.hue,
      styles.row,
      interactive && touchTargetRowClass,
      interactive && press.press,
      className,
    ),
    ...toDataAttributes({
      color: tone ? undefined : color,
      tone,
      interactive: interactive || undefined,
    }),
  };
  const dot = <span className={styles.dot} aria-hidden="true" />;

  let row: React.ReactNode;
  if (asChild) {
    const child = slotChild(children, "Timeline.Item");
    row = (
      <InteractiveElement {...rowProps} element="slot" onClick={onClick}>
        {React.cloneElement(
          child,
          undefined,
          <>
            {dot}
            {child.props.children}
          </>,
        )}
      </InteractiveElement>
    );
  } else if (href) {
    row = (
      <InteractiveElement
        {...rowProps}
        element="link"
        href={href}
        target={target}
        rel={rel}
        download={download}
        onClick={onClick}
      >
        {dot}
        {children}
      </InteractiveElement>
    );
  } else if (onClick) {
    row = (
      <InteractiveElement {...rowProps} element="button" onClick={onClick}>
        {dot}
        {children}
      </InteractiveElement>
    );
  } else {
    row = (
      <InteractiveElement {...rowProps} element="static">
        {dot}
        {children}
      </InteractiveElement>
    );
  }

  return (
    <li className={styles.item} {...toDataAttributes(edgeAttributes(edge))}>
      {row}
    </li>
  );
}
TimelineItem.displayName = "Timeline.Item";

// ─── Parts ────────────────────────────────────────────────────────────────────

type SpanPartProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
} & Omit<React.HTMLAttributes<HTMLSpanElement>, "children">;

export type TimelineItemTitleProps = SpanPartProps;

/** First line: the event. Medium, primary (accent on the highlighted row); wraps when narrow. */
function TimelineItemTitle({ children, className, ...rest }: TimelineItemTitleProps) {
  return (
    <span {...rest} className={cx(styles.title, className)}>
      {children}
    </span>
  );
}
TimelineItemTitle.displayName = "Timeline.ItemTitle";

/** `Timeline.ItemMeta` inside `Timeline.ItemValue` is the value's second line. */
const ValueContext = React.createContext(false);

export type TimelineItemMetaProps = SpanPartProps;

/**
 * Secondary line of an event, muted, tabular numbers: under the title (date and relative time;
 * emphasize a part with `<strong>`), or inside `Timeline.ItemValue` the value's second line
 * (category, unit), right-aligned under it.
 */
function TimelineItemMeta({ children, className, ...rest }: TimelineItemMetaProps) {
  const inValue = React.useContext(ValueContext);
  return (
    <span {...rest} className={cx(inValue ? styles.valueMeta : styles.meta, className)}>
      {children}
    </span>
  );
}
TimelineItemMeta.displayName = "Timeline.ItemMeta";

export type TimelineItemValueProps = SpanPartProps & {
  /** Text color. Default `neutral` (primary text). */
  tone?: Tone;
};

/**
 * Trailing amount: right-aligned, vertically centered, tabular numbers; a `Timeline.ItemMeta`
 * inside is its muted second line. Moves under the meta below 20rem.
 */
function TimelineItemValue({
  tone = "neutral",
  children,
  className,
  ...rest
}: TimelineItemValueProps) {
  return (
    <span {...rest} className={cx(styles.value, className)} {...toDataAttributes({ tone })}>
      <ValueContext.Provider value={true}>{children}</ValueContext.Provider>
    </span>
  );
}
TimelineItemValue.displayName = "Timeline.ItemValue";

// ─── Gap ──────────────────────────────────────────────────────────────────────

export type TimelineDescriptionProps = React.HTMLAttributes<HTMLSpanElement> & {
  ref?: React.Ref<HTMLSpanElement>;
};

/** The secondary caption of a gap, at its end (e.g. «сейчас»). */
function TimelineDescription({ className, ...rest }: TimelineDescriptionProps) {
  return <span className={cx(styles.gapTrailing, className)} {...rest} />;
}
TimelineDescription.displayName = "Timeline.Description";

export type TimelineGapProps = {
  /** Caption color and hollow dot. Default `neutral` (muted); `warning` / `danger` flag a long interval. */
  tone?: Tone;
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
  const isDescription = (child: React.ReactNode) => isPart(child, TimelineDescription);
  const caption = parts.filter((child) => !isDescription(child));
  const description = parts.filter(isDescription);
  const edge = React.useContext(EdgeContext);
  return (
    <li className={cx(styles.item, styles.gapItem)} {...toDataAttributes(edgeAttributes(edge))}>
      <div {...rest} className={cx(styles.gapRow, className)} {...toDataAttributes({ tone })}>
        <span className={styles.gapDot} aria-hidden="true" />
        <span className={styles.gapCaption}>{caption}</span>
        {description}
      </div>
    </li>
  );
}
TimelineGap.displayName = "Timeline.Gap";

export const Timeline = {
  Root: TimelineRoot,
  Group: TimelineGroup,
  Item: TimelineItem,
  ItemTitle: TimelineItemTitle,
  ItemMeta: TimelineItemMeta,
  ItemValue: TimelineItemValue,
  Gap: TimelineGap,
  Description: TimelineDescription,
};
