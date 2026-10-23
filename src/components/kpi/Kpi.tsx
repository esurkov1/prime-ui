import * as React from "react";

import { Badge } from "@/components/badge/Badge";
import { DescriptionList } from "@/components/description-list/DescriptionList";
import { ProgressCircle } from "@/components/progress-circle/ProgressCircle";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { StatusDot } from "@/components/status-dot/StatusDot";
import { Icon } from "@/icons";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { HeaderLineContent, HeaderRowContent, headerRowStyles } from "@/internal/headerRow";
import { iconBoxStyles, iconSlotClass } from "@/internal/iconBox";
import { ProgressLegend, ProgressLegendSkeleton } from "@/internal/ProgressLegend";
import { flattenChildren, isPart } from "@/internal/parts";
import { press } from "@/internal/press";
import {
  formatProgressValue,
  PROGRESS_SEGMENTS_LABELS,
  type ProgressSegment,
  resolveSegments,
} from "@/internal/progressSegments";
import { useSwapIn } from "@/internal/RegionSwap";
import rowLink from "@/internal/rowLink.module.css";
import { Slot, slotChild } from "@/internal/slot";
import {
  type ControlSize,
  cardMarkSize,
  stepDown,
  type Tone,
  tierMappings,
} from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "@/internal/surfaceFrame";
import textRole from "@/internal/textRole.module.css";

import styles from "./Kpi.module.css";

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> };
type SpanProps = React.HTMLAttributes<HTMLSpanElement> & { ref?: React.Ref<HTMLSpanElement> };

/** The four sets of parts a card holds; the kit's `xs` takes `s`. */
type KpiSize = "s" | "m" | "l" | "xl";

export type KpiTone = Extract<Tone, "neutral" | "success" | "warning" | "danger">;

/**
 * The frame of a KPI card: a step under a Card of the same size — its title labels the figure,
 * which is the headline (S xs · M s · L m · XL l).
 */
type KpiState = { size: KpiSize; frame: ControlSize; loading: boolean; titleId: string };

const KpiContext = React.createContext<KpiState>({
  size: "m",
  frame: "s",
  loading: false,
  titleId: "",
});

/** What each size holds: a part the size does not hold renders nothing. */
const HOLDS = {
  icon: ["l", "xl"],
  description: ["l", "xl"],
  actions: ["m", "l", "xl"],
  line: ["m", "l", "xl"],
  media: ["m", "l", "xl"],
  footer: ["m", "l", "xl"],
} as const satisfies Record<string, readonly KpiSize[]>;

const holds = (part: keyof typeof HOLDS, size: KpiSize) =>
  (HOLDS[part] as readonly KpiSize[]).includes(size);

/** The text role of each size: the value, the line under the value (the title is the frame's). */
const VALUE_ROLE: Record<KpiSize, string> = {
  s: textRole.headingS,
  m: textRole.headingM,
  l: textRole.headingL,
  xl: textRole.displayS,
};
const LINE_ROLE: Record<KpiSize, string> = {
  s: textRole.caption,
  m: textRole.caption,
  l: textRole.bodyS,
  xl: textRole.bodyM,
};

/**
 * A data part (value, change, period, note) while the figure loads: a Skeleton in the part's own
 * element, then the data fades in under the same element (`useSwapIn`, foundation §1 rule 7).
 */
function useLoadingPart(placeholder: React.ReactNode, children: React.ReactNode) {
  const { loading } = React.useContext(KpiContext);
  const swap = useSwapIn(loading ? "loading" : "data", children);
  const shownLoading = swap.state === "loading";
  return {
    key: swap.key,
    className: swap.className,
    "data-loading": shownLoading || undefined,
    children: shownLoading ? placeholder : swap.content,
  };
}

/**
 * The parts in their places, whatever order they are written in:
 *   head   — S: the title and the period on one line. M: the title and the actions. L/XL: the icon
 *            tile, the title over the description, the actions (the kit's header row).
 *   number — the value and its change on one line; under it (M, L, XL) the period · the note.
 *   media  — M, L, XL.   footer — M (the legend only), L, XL.
 * A part the size does not hold is dropped.
 */
function arrange(children: React.ReactNode, size: KpiSize, loading: boolean): React.ReactNode {
  const items = flattenChildren(children).filter(
    (child) =>
      !(
        isPart<KpiDeltaProps>(child, KpiDelta) &&
        child.props.reading &&
        !child.props.reading.changeText &&
        !loading
      ),
  );
  const pick = (type: React.ElementType) => items.filter((child) => isPart(child, type));
  const own: React.ElementType[] = [
    KpiIcon,
    KpiTitle,
    KpiDescription,
    KpiActions,
    KpiValue,
    KpiDelta,
    KpiPeriod,
    KpiMeta,
    KpiMedia,
    KpiFooter,
  ];
  const title = pick(KpiTitle);
  const icon = holds("icon", size) ? pick(KpiIcon) : [];
  const description = holds("description", size) ? pick(KpiDescription) : [];
  const actions = holds("actions", size) ? pick(KpiActions) : [];
  const value = pick(KpiValue);
  const delta = pick(KpiDelta);
  const period = pick(KpiPeriod);
  const meta = holds("line", size) ? pick(KpiMeta) : [];
  const media = holds("media", size) ? pick(KpiMedia) : [];
  const footer = holds("footer", size) ? pick(KpiFooter) : [];
  const rest = items.filter(
    (child) => !(React.isValidElement(child) && own.includes(child.type as React.ElementType)),
  );

  let head: React.ReactNode = null;
  if (size === "s") {
    if (title.length + period.length > 0) {
      head = (
        <div className={styles.head}>
          <div className={styles.titles}>{title}</div>
          {period.length > 0 ? <div className={styles.end}>{period}</div> : null}
        </div>
      );
    }
  } else if (icon.length + title.length + description.length + actions.length > 0) {
    head = (
      <div className={headerRowStyles.header} data-lines={description.length > 0 ? "two" : "one"}>
        <HeaderRowContent mark={icon} title={title} description={description} end={actions} />
      </div>
    );
  }

  const lineParts = size === "s" ? [] : [...period, ...meta];
  const line =
    lineParts.length > 0 ? (
      <div className={cx(LINE_ROLE[size], styles.line)}>
        {period.length > 0 && size !== "s" ? period : null}
        {period.length > 0 && meta.length > 0 && size !== "s" && !loading ? (
          <span aria-hidden="true" className={styles.dot}>
            {" · "}
          </span>
        ) : null}
        {meta}
      </div>
    ) : null;

  const number =
    value.length + delta.length > 0 || line ? (
      <div className={styles.figure}>
        {value.length + delta.length > 0 ? (
          <div className={styles.valueRow}>
            {value}
            {delta}
          </div>
        ) : null}
        {line}
      </div>
    ) : null;

  return (
    <>
      {head}
      {number}
      {media}
      {footer}
      {rest}
    </>
  );
}

export type KpiRootProps = DivProps & {
  size?: ControlSize;
  loading?: boolean;
  asChild?: boolean;
};

/**
 * A KPI card: one figure and what it means. A surface of the depth ladder; its size decides which
 * parts it holds (S — the title, the period, the value, the change; M adds the actions, the line
 * under the value, the media; L and XL add the icon, the description and the footer).
 */
function KpiRoot({
  size: sizeProp,
  loading = false,
  asChild = false,
  className,
  children,
  ...rest
}: KpiRootProps) {
  const tier = useHostTier(sizeProp, "surface");
  const size: KpiSize = tier.size === "xs" ? "s" : tier.size;
  const depth = useNestedSurfaceDepth();
  const titleId = React.useId();
  const frame = stepDown(size);
  const state = React.useMemo(
    () => ({ size, frame, loading, titleId }),
    [size, frame, loading, titleId],
  );
  const child = asChild ? slotChild(children, "Kpi.Root") : null;
  const content = (inner: React.ReactNode) =>
    tier.provide(
      <KpiContext.Provider value={state}>
        <SurfaceDepthProvider value={depth}>{arrange(inner, size, loading)}</SurfaceDepthProvider>
      </KpiContext.Provider>,
    );
  // A card in a grid of many is a group named by its title, so a screen reader moving through the
  // grid hears «Выручка, группа» before the figure. A link or a button card is named already.
  const titled = flattenChildren(child ? child.props.children : children).find((part) =>
    isPart(part, KpiTitle),
  );
  const titleOwnId = React.isValidElement<{ id?: string }>(titled) ? titled.props.id : undefined;
  // A `Kpi.Link` in the title stretches over the card; the controls inside stay above it.
  const linked =
    !asChild &&
    React.isValidElement<{ children?: React.ReactNode }>(titled) &&
    flattenChildren(titled.props.children).some((part) => isPart(part, KpiLink));
  const rootProps = {
    ...rest,
    className: cx(
      surfaceFrameClass,
      styles.root,
      asChild && press.press,
      linked && rowLink.host,
      className,
    ),
    "aria-busy": loading || undefined,
    "data-depth": depth,
    ...toDataAttributes({
      size,
      frame,
      interactive: asChild || undefined,
      link: linked || undefined,
    }),
  };

  if (child) {
    return (
      <Slot {...rootProps}>
        {React.cloneElement(child, undefined, content(child.props.children))}
      </Slot>
    );
  }
  const group = titled ? { role: "group", "aria-labelledby": titleOwnId ?? titleId } : {};
  return (
    <div {...group} {...rootProps}>
      {content(children)}
    </div>
  );
}
KpiRoot.displayName = "Kpi.Root";

export type KpiIconProps = DivProps;

/** The accent tile of one icon before the title (L 56 · XL 64, the frame's mark): as tall as the title with its description. */
function KpiIcon({ className, ...rest }: KpiIconProps) {
  const { frame } = React.useContext(KpiContext);
  return (
    <div
      {...rest}
      className={cx(iconBoxStyles.tile, iconSlotClass, headerRowStyles.mark, className)}
      data-tone="accent"
      data-size={cardMarkSize.header.tile[frame]}
    />
  );
}
KpiIcon.displayName = "Kpi.Icon";

export type KpiTitleProps = DivProps;

/** What the figure is: one line, cut with an ellipsis. */
function KpiTitle({ id, className, ...rest }: KpiTitleProps) {
  const { frame, titleId } = React.useContext(KpiContext);
  return (
    <div
      {...rest}
      id={id ?? titleId}
      className={cx(FRAME_TITLE[frame], headerRowStyles.title, className)}
    />
  );
}
KpiTitle.displayName = "Kpi.Title";

export type KpiLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  asChild?: boolean;
  ref?: React.Ref<HTMLAnchorElement>;
};

/**
 * Inside `Kpi.Title`: the link that opens the figure's report. It stretches over the whole card (a
 * click anywhere opens it) while a chart, a button or a menu inside stays its own — the way to make
 * a card with a Sparkline open, since a slider cannot sit inside a link (`asChild`).
 */
function KpiLink({ asChild = false, className, children, ...rest }: KpiLinkProps) {
  const props = { ...rest, className: cx(styles.link, className), "data-row-link": "" };
  if (asChild) {
    return <Slot {...props}>{slotChild(children, "Kpi.Link")}</Slot>;
  }
  return <a {...props}>{children}</a>;
}
KpiLink.displayName = "Kpi.Link";

export type KpiDescriptionProps = DivProps;

/**
 * What exactly the figure counts («Оплаченные счета»), under the title on L and XL: one line, plain
 * text; a `StatusDot` first states a state, the text after it follows a «·».
 */
function KpiDescription({ className, children, ...rest }: KpiDescriptionProps) {
  const { frame } = React.useContext(KpiContext);
  return (
    <div {...rest} className={cx(FRAME_DESCRIPTION[frame], headerRowStyles.description, className)}>
      <HeaderLineContent>{children}</HeaderLineContent>
    </div>
  );
}
KpiDescription.displayName = "Kpi.Description";

export type KpiActionsProps = DivProps;

/**
 * The right slot of the head: one badge, menu or button, at the end. The controls inside take the
 * tier of the card's frame (S 28 · M 32 · L 36 · XL 40).
 */
function KpiActions({ className, children, ...rest }: KpiActionsProps) {
  const { frame } = React.useContext(KpiContext);
  const tier = useHostTier(frame, "surface");
  return (
    <div {...rest} className={cx(headerRowStyles.end, className)}>
      {tier.provide(children)}
    </div>
  );
}
KpiActions.displayName = "Kpi.Actions";

export type KpiValueProps = SpanProps;

/** The figure: tabular, one line, the role of the card's size. */
function KpiValue({ className, children, ...rest }: KpiValueProps) {
  const { size } = React.useContext(KpiContext);
  const part = useLoadingPart(
    <Skeleton shape="block" className={styles.valueSkeleton} />,
    children,
  );
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(VALUE_ROLE[size], styles.value, part.className, className)}
      data-loading={part["data-loading"]}
    >
      {part.children}
    </span>
  );
}
KpiValue.displayName = "Kpi.Value";

export type KpiUnitProps = SpanProps;

/** The unit after the figure (₽, %, ч, «млн ₽»): smaller and quieter, and it never grows the line. */
function KpiUnit({ className, ...rest }: KpiUnitProps) {
  return <span {...rest} className={cx(styles.unit, className)} />;
}
KpiUnit.displayName = "Kpi.Unit";

/**
 * The change a series reading gives (`useSparkline` returns it): its signed value, its text and
 * its tone. Any object of this shape fits; the card does not depend on the chart.
 */
export type KpiDeltaReading = {
  change: number | null;
  changeText: string;
  changeTone: KpiTone;
};

export type KpiDeltaProps = SpanProps & {
  value?: number | null;
  tone?: KpiTone;
  reading?: KpiDeltaReading;
};

/**
 * The change: the kit's Badge beside the value, on its line. The arrow turns by the sign of
 * `value` (half a turn between up and down); the color is `tone` — the meaning, not the sign.
 */
function KpiDelta({ reading, className, children, ...props }: KpiDeltaProps) {
  const { value: ownValue, tone: ownTone = "neutral", ...rest } = props;
  const value = reading ? reading.change : ownValue;
  const tone = reading ? reading.changeTone : ownTone;
  const text = reading ? reading.changeText : children;
  const { size, loading } = React.useContext(KpiContext);
  const part = useLoadingPart(<Skeleton size="s" className={styles.deltaSkeleton} />, text);
  const loaded = part["data-loading"] === undefined;
  const moved = typeof value === "number" && value !== 0;
  const down = typeof value === "number" && value < 0;
  if (reading && !reading.changeText && !loading) return null;
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(styles.delta, part.className, className)}
      data-loading={part["data-loading"]}
    >
      {loaded ? (
        <Badge.Root size={tierMappings.kpiDelta[size]} tone={tone}>
          {moved ? (
            <Badge.Icon className={styles.trend} data-down={down || undefined}>
              <Icon name="status.trendUp" />
            </Badge.Icon>
          ) : null}
          {part.children}
        </Badge.Root>
      ) : (
        part.children
      )}
    </span>
  );
}
KpiDelta.displayName = "Kpi.Delta";

export type KpiPeriodProps = SpanProps;

/**
 * The time the figure stands for: an interval («1–22 окт»), a month, a quarter or a moment («на 22
 * окт, 09:40»). On S it stands at the end of the head; on M, L and XL it opens the line under the value.
 */
function KpiPeriod({ className, children, ...rest }: KpiPeriodProps) {
  const { size } = React.useContext(KpiContext);
  const part = useLoadingPart(<Skeleton size="s" className={styles.periodSkeleton} />, children);
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(size === "s" && textRole.caption, styles.period, part.className, className)}
      data-loading={part["data-loading"]}
    >
      {part.children}
    </span>
  );
}
KpiPeriod.displayName = "Kpi.Period";

export type KpiMetaProps = SpanProps;

/** The note after the period: new data only — a plan, a threshold, what the figure is made of. */
function KpiMeta({ className, children, ...rest }: KpiMetaProps) {
  const part = useLoadingPart(<Skeleton size="s" className={styles.metaSkeleton} />, children);
  return (
    <span
      key={part.key}
      {...rest}
      className={cx(styles.meta, part.className, className)}
      data-loading={part["data-loading"]}
    >
      {part.children}
    </span>
  );
}
KpiMeta.displayName = "Kpi.Meta";

export type KpiMediaProps = DivProps;

/**
 * One picture under the value: a Sparkline, a ProgressBar. The full width, kept to the bottom; the
 * kit controls inside take the size two steps under the card (M xs · L s · XL m; S has no media):
 * a bar or a chart stays light, below the card's own controls. The rule is the card's tier two steps down, not the frame's metrics.
 */
function KpiMedia({ className, children, ...rest }: KpiMediaProps) {
  const { size } = React.useContext(KpiContext);
  const tier = useHostTier(stepDown(size, 2), "surface");
  return (
    <div {...rest} className={cx(styles.media, className)}>
      {tier.provide(children)}
    </div>
  );
}
KpiMedia.displayName = "Kpi.Media";

export type KpiFooterProps = DivProps;

/** How many total columns each size holds. */
const TOTALS: Record<KpiSize, number> = { s: 0, m: 0, l: 2, xl: 4 };

/**
 * The last part, the card padding below the rest, no line: one kind of new data — `Kpi.Legend`, `Kpi.Note`, `Kpi.Total`
 * columns or a `DescriptionList` breakdown. M holds only the legend; L the legend, a note and two
 * totals; XL everything.
 */
function KpiFooter({ className, children, ...rest }: KpiFooterProps) {
  const { size } = React.useContext(KpiContext);
  let totals = 0;
  const kept = flattenChildren(children).filter((child) => {
    if (isPart(child, KpiLegend)) return true;
    if (size === "m") return false;
    if (isPart(child, KpiTotal)) {
      totals += 1;
      return totals <= TOTALS[size];
    }
    if (isPart(child, DescriptionList.Root)) return size === "xl";
    return true;
  });
  if (kept.length === 0) return null;
  const columns = kept.every((child) => isPart(child, KpiTotal));
  return (
    <div {...rest} className={cx(styles.footer, columns && styles.totals, className)}>
      {kept}
    </div>
  );
}
KpiFooter.displayName = "Kpi.Footer";

export type KpiNoteProps = DivProps & { tone?: KpiTone };

/** One phrase about what needs attention, after a dot of its tone (`StatusDot`). Cut, never wrapped. */
function KpiNote({ tone = "warning", className, children, ...rest }: KpiNoteProps) {
  return (
    <div {...rest} className={cx(textRole.bodyS, styles.note, className)} data-tone={tone}>
      <StatusDot tone={tone} className={styles.noteStatus}>
        <span className={styles.noteText}>{children}</span>
      </StatusDot>
    </div>
  );
}
KpiNote.displayName = "Kpi.Note";

export type KpiTotalProps = DivProps & { label: string };

/** A secondary figure of the footer: its label over its value, one column of a row of up to four. */
function KpiTotal({ label, className, children, ...rest }: KpiTotalProps) {
  const { size } = React.useContext(KpiContext);
  return (
    <div {...rest} className={cx(styles.total, className)}>
      <span className={cx(textRole.bodyS, styles.totalLabel)}>{label}</span>
      <span className={cx(size === "xl" ? textRole.titleM : textRole.titleS, styles.totalValue)}>
        {children}
      </span>
    </div>
  );
}
KpiTotal.displayName = "Kpi.Total";

export type KpiLegendProps = Omit<DivProps, "children" | "color"> & {
  segments: ProgressSegment[];
  max?: number;
  formatValue?: (value: number) => string;
  ring?: boolean;
};

/**
 * The legend of the parts in the footer: one row per part — its color, name, value and share. With
 * `ring` on XL the 2xl ProgressCircle stands left of the rows (the ring's own legend); elsewhere
 * the rows stand alone and the parts are drawn in `Kpi.Media` (a ProgressBar of ticks).
 */
function KpiLegend({
  segments,
  max,
  formatValue = formatProgressValue,
  ring = false,
  className,
  ...rest
}: KpiLegendProps) {
  const { size, loading } = React.useContext(KpiContext);
  const legendSize = tierMappings.kpiLegend[size];
  if (ring && size === "xl") {
    return (
      <ProgressCircle
        {...rest}
        size="2xl"
        segments={segments}
        max={max}
        formatValue={formatValue}
        loading={loading}
        legend
        className={cx(styles.ring, className)}
      />
    );
  }
  const { scale } = resolveSegments(segments, max, PROGRESS_SEGMENTS_LABELS);
  return (
    <div {...rest} className={cx(styles.legend, className)}>
      {loading ? (
        <ProgressLegendSkeleton rows={segments.length || 3} size={legendSize} />
      ) : (
        <ProgressLegend
          segments={segments}
          scale={scale}
          formatValue={formatValue}
          size={legendSize}
        />
      )}
    </div>
  );
}
KpiLegend.displayName = "Kpi.Legend";

export const Kpi = {
  Root: KpiRoot,
  Icon: KpiIcon,
  Title: KpiTitle,
  Link: KpiLink,
  Description: KpiDescription,
  Actions: KpiActions,
  Value: KpiValue,
  Unit: KpiUnit,
  Delta: KpiDelta,
  Period: KpiPeriod,
  Meta: KpiMeta,
  Media: KpiMedia,
  Footer: KpiFooter,
  Note: KpiNote,
  Total: KpiTotal,
  Legend: KpiLegend,
};
