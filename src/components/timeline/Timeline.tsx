import * as React from "react";
import { Badge, type BadgeGroupProps } from "@/components/badge/Badge";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useControlSize, useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { fieldTierClass } from "@/internal/fieldClasses";
import { hasContent } from "@/internal/hasContent";
import { HeaderLineContent, useTitleFloor } from "@/internal/headerRow";
import { InteractiveElement } from "@/internal/interactiveElement";
import { listRowStyles } from "@/internal/listRow";
import palette from "@/internal/palette.module.css";
import { flattenChildren, isPart, splitParts } from "@/internal/parts";
import { slotChild } from "@/internal/slot";
import { type ControlSize, type PaletteColor, type Tone, tierMappings } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";
import { touchTargetRowClass } from "@/internal/touchTarget";

import styles from "./Timeline.module.css";

// ─── Root ─────────────────────────────────────────────────────────────────────

export type TimelineRootProps = {
  size?: ControlSize;
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

function TimelineRoot({ size: sizeProp, children, className, ...rest }: TimelineRootProps) {
  const tier = useHostTier(sizeProp);
  return tier.provide(
    <div
      {...rest}
      className={cx(fieldTierClass, listRowStyles.tier, styles.root, className)}
      {...toDataAttributes({ size: tier.size })}
    >
      {children}
    </div>,
  );
}
TimelineRoot.displayName = "Timeline.Root";

// ─── Group ────────────────────────────────────────────────────────────────────

/** The text role of a group heading per tier: one step under the rows on xs and s. */
const GROUP_LABEL_ROLE: Record<ControlSize, string> = {
  xs: textRole.caption,
  s: textRole.bodyS,
  m: textRole.titleS,
  l: textRole.titleM,
  xl: textRole.titleM,
};

export type TimelineGroupProps = {
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
  const size = useControlSize(undefined);
  const labelId = React.useId();
  const hasLabel = hasContent(label);
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
        <div id={labelId} className={cx(GROUP_LABEL_ROLE[size], styles.groupLabel)}>
          {label}
        </div>
      ) : null}
      <ol
        // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
        role="list"
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
  color?: PaletteColor;
  tone?: Tone;
  href?: string;
  asChild?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  children: React.ReactNode;
  className?: string;
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
  // A date line under the title makes the row two lines tall.
  const described = flattenChildren(
    asChild ? slotChild(children, "Timeline.Item").props.children : children,
  ).some((node) => isPart(node, TimelineItemMeta));
  const current = rest["aria-current"] === "page" || rest["aria-current"] === "true";
  const rowProps = {
    ...rest,
    ref,
    className: cx(
      palette.hue,
      listRowStyles.row,
      listRowStyles.hit,
      styles.row,
      interactive && touchTargetRowClass,
      className,
    ),
    ...toDataAttributes({
      color: tone ? undefined : color,
      tone,
      interactive: interactive || undefined,
      lines: described ? "two" : undefined,
      current: current || undefined,
      // Below 20rem the amount drops under the text (see the end of the CSS).
      wrap: true,
    }),
  };
  const dot = <span className={styles.dot} aria-hidden="true" />;
  // The title and every meta line stack in one text column, so several `ItemMeta` lines never
  // share a grid cell; the value keeps its own column.
  const content = (parts: React.ReactNode) => {
    const { parts: value, rest: text } = splitParts(parts, TimelineItemValue);
    // The badges join the title on its line.
    const nodes = flattenChildren(text) as React.ReactNode[];
    const badges = nodes.find((node) => isPart(node, TimelineItemBadges));
    const titleAt = nodes.findIndex((node) => isPart(node, TimelineItemTitle));
    const lines =
      badges && titleAt >= 0
        ? nodes.flatMap<React.ReactNode>((node, index) =>
            node === badges
              ? []
              : index === titleAt
                ? [
                    <span key="title-row" className={listRowStyles.titleRow}>
                      <BadgedTitleContext value={true}>{node}</BadgedTitleContext>
                      {badges}
                    </span>,
                  ]
                : [node],
          )
        : text;
    return (
      <>
        {dot}
        <span className={styles.text}>{lines}</span>
        {value}
      </>
    );
  };

  let row: React.ReactNode;
  if (asChild) {
    const child = slotChild(children, "Timeline.Item");
    row = (
      <InteractiveElement {...rowProps} element="slot" onClick={onClick}>
        {React.cloneElement(child, undefined, content(child.props.children))}
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
        {content(children)}
      </InteractiveElement>
    );
  } else if (onClick) {
    row = (
      <InteractiveElement {...rowProps} element="button" onClick={onClick}>
        {content(children)}
      </InteractiveElement>
    );
  } else {
    row = (
      <InteractiveElement {...rowProps} element="static">
        {content(children)}
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

/** The title shares its line with `Timeline.ItemBadges`. */
const BadgedTitleContext = React.createContext(false);

/**
 * First line: the event. Medium, primary (accent on the highlighted row), one line cut with an
 * ellipsis. Beside `Timeline.ItemBadges` it gives way first, down to its text or 8em.
 */
function TimelineItemTitle({ children, className, ref, ...rest }: TimelineItemTitleProps) {
  const badged = React.useContext(BadgedTitleContext);
  if (badged)
    return (
      <BadgedTitle {...rest} ref={ref} className={className}>
        {children}
      </BadgedTitle>
    );
  return (
    <span {...rest} ref={ref} className={cx(listRowStyles.title, className)}>
      {children}
    </span>
  );
}
TimelineItemTitle.displayName = "Timeline.ItemTitle";

function BadgedTitle({ children, className, ref, ...rest }: TimelineItemTitleProps) {
  const own = React.useRef<HTMLSpanElement>(null);
  const merged = useMergedRefs(own, ref);
  useTitleFloor(own);
  return (
    <span {...rest} ref={merged} className={cx(listRowStyles.title, className)}>
      {children}
    </span>
  );
}

export type TimelineItemBadgesProps = Omit<BadgeGroupProps, "size" | "overflow">;

/**
 * The badges after the title, on its line: one container for every badge of the event (a status,
 * a kind — the meaning is the badge's `tone` or `color`). What does not fit folds into «+N».
 */
function TimelineItemBadges({ className, ...rest }: TimelineItemBadgesProps) {
  const size = useControlSize(undefined);
  return (
    <Badge.Group
      {...rest}
      size={tierMappings.cardBadges[size]}
      overflow="count"
      className={cx(listRowStyles.badges, className)}
    />
  );
}
TimelineItemBadges.displayName = "Timeline.ItemBadges";

/** `Timeline.ItemMeta` inside `Timeline.ItemValue` is the value's second line. */
const ValueContext = React.createContext(false);

export type TimelineItemMetaProps = SpanPartProps;

/**
 * Secondary line of an event, muted, tabular numbers: under the title (date and relative time;
 * emphasize a part with `<strong>`; several lines stack under the title), or inside `Timeline.ItemValue` the value's second line
 * (category, unit), right-aligned under it.
 */
function TimelineItemMeta({ children, className, ...rest }: TimelineItemMetaProps) {
  const inValue = React.useContext(ValueContext);
  return (
    <span
      {...rest}
      className={cx(
        inValue
          ? cx(listRowStyles.meta, styles.valueMeta)
          : cx(listRowStyles.description, styles.meta),
        className,
      )}
    >
      {inValue ? children : <HeaderLineContent>{children}</HeaderLineContent>}
    </span>
  );
}
TimelineItemMeta.displayName = "Timeline.ItemMeta";

export type TimelineItemValueProps = SpanPartProps & {
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
    <span
      {...rest}
      className={cx(styles.value, textTone.tone, className)}
      {...toDataAttributes({ tone })}
    >
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
  ItemBadges: TimelineItemBadges,
  ItemMeta: TimelineItemMeta,
  ItemValue: TimelineItemValue,
  Gap: TimelineGap,
  Description: TimelineDescription,
};
