import * as React from "react";
import { visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useElementSize } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { type AnchorPoint, ChartTooltip } from "@/internal/ChartTooltip";
import { useHostTier } from "@/internal/ControlSizeContext";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatNumber } from "@/internal/formatNumber";
import { HeaderLineContent, HeaderRowContent, headerRowStyles } from "@/internal/headerRow";
import { useLabels } from "@/internal/labels";
import listRowStyles from "@/internal/listRow.module.css";
import { HUE_CHART } from "@/internal/palette";
import { flattenChildren, isPart } from "@/internal/parts";
import type { TagRef } from "@/internal/polymorphic";
import { press } from "@/internal/press";
import { RegionSwap, useSwapIn } from "@/internal/RegionSwap";
import { rovingIndex } from "@/internal/rovingFocus";
import type { ControlSize, PaletteColor, Tone } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { FRAME_DESCRIPTION, FRAME_TITLE, surfaceFrameClass } from "@/internal/surfaceFrame";
import textRole from "@/internal/textRole.module.css";
import textTone from "@/internal/textTone.module.css";
import { touchTargetClass } from "@/internal/touchTarget";
import { chartColors } from "@/theme/chartColors";

import { Crossfade } from "../crossfade/Crossfade";
import { EmptyPage } from "../empty-page/EmptyPage";
import { Skeleton } from "../skeleton/Skeleton";
import styles from "./ChartFrame.module.css";

/** What the chart region shows: the plot, its Skeleton, the empty state or the load error. */
export type ChartFrameState = "ready" | "loading" | "empty" | "error";

/** One series of the chart: its legend entry, tooltip row and table column. */
export type ChartFrameSeries = {
  /** Stable key: `hiddenSeries`, tooltip items and table values refer to it. */
  id: string;
  /** Visible name in the legend, the tooltip and the table header. */
  label: string;
  /**
   * The category's hue (its step of the chart palette, as in a ProgressBar share). Default: the
   * series' place in `series` — `chartColors.series[index]`, past the eighth `chartColors.other`.
   */
  color?: PaletteColor;
  /** Summary of the series in the legend (a total over the period). */
  value?: number;
  /** Display of this series' values; the root's `formatValue` for a series without its own. */
  formatValue?: (value: number) => string;
};

/** A series as the plot draws it: the resolved color as a CSS value and its visibility. */
export type ChartFramePlotSeries = {
  id: string;
  label: string;
  /** `var(--prime-color-chart-*)`: a string for SVG `fill` / `stroke` or a library's series color. */
  color: string;
  /** Turned off in the legend: keep the mark mounted with `data-hidden="true"` so it fades out. */
  hidden: boolean;
  /** The series' own `formatValue`, else the root's: the ticks of the axis this series stands on. */
  formatValue: (value: number) => string;
};

/** What `ChartFrame.Plot` hands `renderPlot`: the measured box and every series in order. */
export type ChartFramePlotArea = {
  /** Width of the plot area in px. */
  width: number;
  /** Height of the plot area in px. */
  height: number;
  series: ChartFramePlotSeries[];
};

/** One point of the chart's data: a row of the table the root gives assistive tech. */
export type ChartFrameRow = {
  /** The point the row stands for («Неделя 41»): the row header. */
  label: string;
  /** Values by series id; a missing value reads as «—». */
  values: Record<string, number | undefined>;
};

export type ChartFrameLabels = {
  /** Title of the empty state. */
  empty: string;
  /** Title of the error state. */
  error: string;
  /** Text of the retry button in the error state. */
  retry: string;
  /** Accessible name of the legend. */
  legend: string;
  /** Header of the first column of the data table (what a row is). */
  category: string;
};

export const CHART_FRAME_LABELS: ChartFrameLabels = {
  empty: "Нет данных за период",
  error: "Не удалось загрузить график",
  retry: "Повторить",
  legend: "Ряды графика",
  category: "Период",
};

const defaultFormat = (value: number) => formatNumber(value);

function seriesColor(series: ChartFrameSeries, index: number): string {
  if (series.color) return HUE_CHART[series.color];
  return chartColors.series[index] ?? chartColors.other;
}

type ResolvedSeries = ChartFramePlotSeries & { value?: number };

type ChartFrameContextValue = {
  state: ChartFrameState;
  series: ResolvedSeries[];
  toggle: (id: string) => void;
  formatValue: (value: number) => string;
  labels: ChartFrameLabels;
  onRetry?: () => void | Promise<void>;
  /** The surface frame: the resolved tier of the panel. */
  frame: ControlSize;
  titleId: string;
  descriptionId: string;
  setHasTitle: (has: boolean) => void;
  setHasDescription: (has: boolean) => void;
  /** The plot element: a floating `ChartFrame.Tooltip` stands at a point of it. */
  plotRef: React.RefObject<HTMLDivElement | null>;
};

const [ChartFrameProvider, useChartFrame] =
  createComponentContext<ChartFrameContextValue>("ChartFrame");

const EMPTY_IDS: string[] = [];

export type ChartFrameRootProps = React.HTMLAttributes<HTMLElement> & {
  state?: ChartFrameState;
  series?: ChartFrameSeries[];
  rows: ChartFrameRow[];
  hiddenSeries?: string[];
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
  formatValue?: (value: number) => string;
  onRetry?: () => void | Promise<void>;
  labels?: Partial<ChartFrameLabels>;
  ref?: React.Ref<HTMLElement>;
};

/**
 * A dashboard panel around any chart (Recharts, ECharts, visx, Chart.js or a hand-drawn SVG): a
 * surface of the depth ladder named by its title, with a headline value, the measured plot area, a
 * series legend that turns series on and off and a tooltip body. The root renders the data
 * (`rows`) as a visually hidden table for assistive tech. The state (loading / empty / error /
 * ready) lives on the root; every part shows its own side of it.
 */
function ChartFrameRoot({
  state = "ready",
  series = [],
  rows,
  hiddenSeries: hiddenProp,
  defaultHiddenSeries = EMPTY_IDS,
  onHiddenSeriesChange,
  formatValue = defaultFormat,
  onRetry,
  labels: labelsProp,
  className,
  children,
  ...rest
}: ChartFrameRootProps) {
  const depth = useNestedSurfaceDepth();
  const frame = useHostTier(undefined, "surface").size;
  const labels = useLabels(CHART_FRAME_LABELS, labelsProp);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const plotRef = React.useRef<HTMLDivElement | null>(null);
  const [hasTitle, setHasTitle] = React.useState(false);
  const [hasDescription, setHasDescription] = React.useState(false);
  const [hidden, setHidden] = useControllableState({
    value: hiddenProp,
    defaultValue: defaultHiddenSeries,
    onChange: onHiddenSeriesChange,
  });

  const resolved = React.useMemo(
    () =>
      series.map((item, index) => ({
        id: item.id,
        label: item.label,
        color: seriesColor(item, index),
        hidden: hidden.includes(item.id),
        value: item.value,
        formatValue: item.formatValue ?? formatValue,
      })),
    [series, hidden, formatValue],
  );

  const toggle = React.useCallback(
    (id: string) =>
      setHidden((prev) => (prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id])),
    [setHidden],
  );

  const context: ChartFrameContextValue = {
    state,
    series: resolved,
    toggle,
    formatValue,
    labels,
    onRetry,
    frame,
    titleId,
    descriptionId,
    setHasTitle,
    setHasDescription,
    plotRef,
  };

  return (
    <figure
      aria-labelledby={hasTitle ? titleId : undefined}
      aria-describedby={hasDescription ? descriptionId : undefined}
      aria-busy={state === "loading" || undefined}
      {...rest}
      className={cx(surfaceFrameClass, styles.root, className)}
      data-depth={depth}
      data-frame={frame}
      data-state={state}
    >
      <SurfaceDepthProvider value={depth}>
        <ChartFrameProvider value={context}>{children}</ChartFrameProvider>
      </SurfaceDepthProvider>
      {state === "ready" ? (
        <HiddenTable
          rows={rows}
          series={resolved}
          category={context.labels.category}
          titleId={hasTitle ? titleId : undefined}
        />
      ) : null}
    </figure>
  );
}
ChartFrameRoot.displayName = "ChartFrame.Root";

export type ChartFrameHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The top zone, the kit's header row (internal/headerRow): the title and the description under it,
 * `ChartFrame.Actions` at the end — whatever order they are written in. Without a description the
 * controls share the title's line.
 */
function ChartFrameHeader({ className, children, ...rest }: ChartFrameHeaderProps) {
  const items = flattenChildren(children);
  const pick = (type: React.ElementType) => items.filter((part) => isPart(part, type));
  const description = pick(ChartFrameDescription);
  const own: React.ElementType[] = [ChartFrameTitle, ChartFrameDescription, ChartFrameActions];
  return (
    <div
      {...rest}
      className={cx(headerRowStyles.header, className)}
      data-lines={description.length === 0 ? "one" : "two"}
    >
      <HeaderRowContent
        title={pick(ChartFrameTitle)}
        description={description}
        end={pick(ChartFrameActions)}
      >
        {items.filter(
          (part) => !(React.isValidElement(part) && own.includes(part.type as React.ElementType)),
        )}
      </HeaderRowContent>
    </div>
  );
}
ChartFrameHeader.displayName = "ChartFrame.Header";

type ChartFrameTitleAs = "h2" | "h3" | "h4";

export type ChartFrameTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: ChartFrameTitleAs;
  ref?: React.Ref<HTMLHeadingElement>;
};

/** The name of the chart: heads the panel and names the figure. */
function ChartFrameTitle({ as: Tag = "h3", className, ref, ...rest }: ChartFrameTitleProps) {
  const { titleId, setHasTitle, frame } = useChartFrame("ChartFrame.Title");
  React.useLayoutEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);
  return (
    <Tag
      id={titleId}
      {...rest}
      ref={ref as TagRef<ChartFrameTitleAs>}
      className={cx(FRAME_TITLE[frame], headerRowStyles.title, className)}
    />
  );
}
ChartFrameTitle.displayName = "ChartFrame.Title";

export type ChartFrameDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

/** What the chart measures and over which period; describes the figure. */
function ChartFrameDescription({ className, children, ...rest }: ChartFrameDescriptionProps) {
  const { descriptionId, setHasDescription, frame } = useChartFrame("ChartFrame.Description");
  React.useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return (
    <p
      id={descriptionId}
      {...rest}
      className={cx(FRAME_DESCRIPTION[frame], headerRowStyles.description, className)}
    >
      <HeaderLineContent>{children}</HeaderLineContent>
    </p>
  );
}
ChartFrameDescription.displayName = "ChartFrame.Description";

export type ChartFrameActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Controls of the chart at the end of the header (period switch, export), at the tier of the
 * panel's frame; they never wrap — the title gives way.
 */
function ChartFrameActions({ className, children, ...rest }: ChartFrameActionsProps) {
  const { frame } = useChartFrame("ChartFrame.Actions");
  const tier = useHostTier(frame, "surface");
  return (
    <div {...rest} className={cx(headerRowStyles.end, className)}>
      {tier.provide(children)}
    </div>
  );
}
ChartFrameActions.displayName = "ChartFrame.Actions";

export type ChartFrameValueProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The headline number of the chart («8,4 млн ₽»), with an optional `ChartFrame.Delta` inside.
 * While loading it is a Skeleton of its own geometry; after a load error it is a dash.
 */
function ChartFrameValue({ className, children, ...rest }: ChartFrameValueProps) {
  const { state } = useChartFrame("ChartFrame.Value");
  const shown = state === "loading" || state === "error" ? state : "data";
  return (
    <div {...rest} className={cx(textRole.headingM, styles.value, className)}>
      <RegionSwap state={shown}>
        {shown === "loading" ? (
          <Skeleton shape="block" className={styles.valueSkeleton} />
        ) : shown === "error" ? (
          // The data failed to load: the number is unknown, not the last one seen.
          <span className={cx(styles.valueContent, styles.valueUnknown)}>—</span>
        ) : (
          <span className={styles.valueContent}>{children}</span>
        )}
      </RegionSwap>
    </div>
  );
}
ChartFrameValue.displayName = "ChartFrame.Value";

export type ChartFrameDeltaProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: Extract<Tone, "neutral" | "success" | "warning" | "danger">;
  ref?: React.Ref<HTMLSpanElement>;
};

/** The change of the headline value («+12% к сентябрю»); the sign is in the text, not only the color. */
function ChartFrameDelta({ tone = "neutral", className, ...rest }: ChartFrameDeltaProps) {
  // The body-s role and the shared text tone; `neutral` keeps the secondary ink of `.delta`.
  return (
    <span
      {...rest}
      className={cx(textRole.bodyS, styles.delta, textTone.tone, className)}
      data-tone={tone}
    />
  );
}
ChartFrameDelta.displayName = "ChartFrame.Delta";

export type ChartFramePlotProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  height?: number | "fill";
  renderPlot?: (area: ChartFramePlotArea) => React.ReactNode;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The plot area: a box of a fixed height that measures itself (ResizeObserver) and hands the size
 * to `renderPlot`. Loading, empty and error cross-fade in its place, so the panel never jumps. SVG
 * text inside takes the caption type in the muted color; a mark with `data-hidden="true"` fades out.
 */
function ChartFramePlot({
  height,
  renderPlot,
  children,
  className,
  style,
  ref,
  ...rest
}: ChartFramePlotProps) {
  const { state, series, labels, onRetry, plotRef } = useChartFrame("ChartFrame.Plot");
  const mergedRef = useMergedRefs(plotRef, ref);
  const size = useElementSize(plotRef, { enabled: renderPlot !== undefined });

  const plot =
    renderPlot !== undefined
      ? size && size.width > 0 && size.height > 0
        ? renderPlot({
            width: size.width,
            height: size.height,
            series: series.map(({ id, label, color, hidden, formatValue }) => ({
              id,
              label,
              color,
              hidden,
              formatValue,
            })),
          })
        : null
      : children;

  return (
    <div
      {...rest}
      ref={mergedRef}
      className={cx(styles.plot, className)}
      data-height={height === "fill" ? "fill" : undefined}
      style={
        typeof height === "number"
          ? ({ ...style, "--chart-frame-plot-height": `${height}px` } as React.CSSProperties)
          : style
      }
    >
      <Crossfade state={state} fill>
        {state === "loading" ? (
          <Skeleton shape="block" className={styles.plotSkeleton} />
        ) : state === "empty" ? (
          <div className={styles.stateBox}>
            <EmptyPage.Root layout="compact" role="status">
              <EmptyPage.Icon>
                <Icon name="object.chart" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="p">{labels.empty}</EmptyPage.Title>
            </EmptyPage.Root>
          </div>
        ) : state === "error" ? (
          <div className={styles.stateBox}>
            <EmptyPage.Root layout="compact" tone="danger" labels={{ retry: labels.retry }}>
              <EmptyPage.Icon>
                <Icon name="status.failed" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="p">{labels.error}</EmptyPage.Title>
              {onRetry ? (
                <EmptyPage.Actions>
                  <EmptyPage.RetryButton onRetry={onRetry} />
                </EmptyPage.Actions>
              ) : null}
            </EmptyPage.Root>
          </div>
        ) : (
          // Caption type for the chart's text (axis labels inherit the role's tracking).
          <div className={cx(textRole.caption, styles.canvas)}>{plot}</div>
        )}
      </Crossfade>
    </div>
  );
}
ChartFramePlot.displayName = "ChartFrame.Plot";

/** A legend entry is the list row at tier `xs`, plain: no hover, no padding of its own. */
const ENTRY_TIER: ControlSize = "xs";

export type ChartFrameLegendProps = React.HTMLAttributes<HTMLUListElement> & {
  readOnly?: boolean;
  ref?: React.Ref<HTMLUListElement>;
};

/**
 * The series of the root as entries: swatch, name and the optional summary value. Each entry is a
 * toggle button (`aria-pressed` = shown); the arrows move between entries, Enter / Space toggle. A
 * hidden series keeps its place and color: its swatch turns hollow and its name quiet.
 */
function ChartFrameLegend({ readOnly = false, className, ...rest }: ChartFrameLegendProps) {
  const { state, series, toggle, labels } = useChartFrame("ChartFrame.Legend");
  const [focusIndex, setFocusIndex] = React.useState(0);
  const buttons = React.useRef<Array<HTMLButtonElement | null>>([]);
  const loading = state === "loading";
  // A legend value sits in a button (phrasing content only): it fades in place.
  const valueSwap = useSwapIn(loading ? "loading" : "data");
  const valueLoading = valueSwap.state === "loading";
  const active = Math.min(focusIndex, Math.max(series.length - 1, 0));

  if (series.length === 0) return null;

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = rovingIndex(event.key, index, series.length, "both");
    if (next === null) return;
    event.preventDefault();
    setFocusIndex(next);
    buttons.current[next]?.focus();
  };

  return (
    <ul
      // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
      role="list"
      aria-label={labels.legend}
      {...rest}
      className={cx(fieldTierClass, listRowStyles.tier, styles.legend, className)}
      data-size={ENTRY_TIER}
      data-read-only={readOnly || undefined}
    >
      {series.map((item, index) => {
        const content = (
          <>
            <span className={listRowStyles.mark} data-kind="dot" aria-hidden="true">
              <span
                className={styles.swatch}
                style={{ "--chart-frame-swatch": item.color } as React.CSSProperties}
              />
            </span>
            <span className={listRowStyles.title}>{item.label}</span>
            {item.value !== undefined ? (
              valueLoading ? (
                <Skeleton
                  key={valueSwap.key}
                  shape="text"
                  size="xs"
                  className={cx(styles.legendValueSkeleton, valueSwap.className)}
                />
              ) : (
                <span key={valueSwap.key} className={cx(listRowStyles.meta, valueSwap.className)}>
                  {item.formatValue(item.value)}
                </span>
              )
            ) : null}
          </>
        );
        return (
          <li key={item.id} className={styles.legendItem}>
            {readOnly ? (
              <span
                className={cx(listRowStyles.row, listRowStyles.hit, styles.entry)}
                data-plain=""
              >
                {content}
              </span>
            ) : (
              // A legend entry names a series and toggles it; Button's command look would read as
              // an action, so the entry is the plain list row on a button.
              <button
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                className={cx(
                  listRowStyles.row,
                  listRowStyles.hit,
                  styles.entry,
                  styles.toggle,
                  press.press,
                  touchTargetClass,
                )}
                data-plain=""
                aria-pressed={!item.hidden}
                tabIndex={index === active ? 0 : -1}
                onClick={() => {
                  setFocusIndex(index);
                  toggle(item.id);
                }}
                onFocus={() => setFocusIndex(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                {content}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
ChartFrameLegend.displayName = "ChartFrame.Legend";

export type ChartFrameTooltipItem = {
  /** Id of a series of the root: its name and color come from there. */
  id: string;
  value: number;
};

export type ChartFrameTooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
  items: ChartFrameTooltipItem[];
  point?: AnchorPoint | null;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * The kit's chart tooltip: the point's label and rows of swatch · series name · value. With
 * `point` it floats beside that point of the plot (a hand-drawn SVG chart); without it it is the
 * body for a chart library's custom tooltip hook (Recharts `content`, visx `TooltipWithBounds`).
 * It must render inside `ChartFrame.Root`.
 */
function ChartFrameTooltip({ label, items, point, className, ...rest }: ChartFrameTooltipProps) {
  const { series, formatValue, plotRef } = useChartFrame("ChartFrame.Tooltip");
  const rows = items.flatMap((item) => {
    const entry = series.find((candidate) => candidate.id === item.id);
    if (entry?.hidden) return [];
    return [
      {
        id: item.id,
        label: entry?.label ?? item.id,
        color: entry?.color ?? chartColors.other,
        value: (entry?.formatValue ?? formatValue)(item.value),
      },
    ];
  });
  return (
    <ChartTooltip
      {...rest}
      className={cx(styles.tooltip, className)}
      label={label || undefined}
      anchorRef={point === undefined ? undefined : plotRef}
      point={point}
    >
      {rows.length > 0 ? (
        <ul
          // biome-ignore lint/a11y/noRedundantRoles: `list-style: none` drops the list semantics in WebKit; the role keeps them
          role="list"
          className={styles.tooltipRows}
        >
          {rows.map((row) => (
            <li key={row.id} className={styles.tooltipRow}>
              <span
                className={styles.swatch}
                aria-hidden="true"
                style={{ "--chart-frame-swatch": row.color } as React.CSSProperties}
              />
              <span className={styles.tooltipName}>{row.label}</span>
              <span className={styles.tooltipValue}>{row.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </ChartTooltip>
  );
}
ChartFrameTooltip.displayName = "ChartFrame.Tooltip";

type HiddenTableProps = {
  rows: ChartFrameRow[];
  series: ResolvedSeries[];
  category: string;
  titleId: string | undefined;
};

/**
 * The chart's data as a table for screen readers (visually hidden): a row per point, a column per
 * shown series, named by the chart title. Present only while the data is ready. A visible table is
 * a `DataTable`.
 */
function HiddenTable({ rows, series, category, titleId }: HiddenTableProps) {
  const columns = series.filter((item) => !item.hidden);
  // The hidden box is a block around the table: a table ignores `overflow` and a 1px width, so
  // the recipe on the `<table>` itself would keep its natural width and stretch the page.
  return (
    <div className={visuallyHiddenClass}>
      <table aria-labelledby={titleId}>
        <thead>
          <tr>
            <th scope="col">{category}</th>
            {columns.map((column) => (
              <th key={column.id} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {columns.map((column) => {
                const value = row.values[column.id];
                return (
                  <td key={column.id}>{value === undefined ? "—" : column.formatValue(value)}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const ChartFrame = {
  Root: ChartFrameRoot,
  Header: ChartFrameHeader,
  Title: ChartFrameTitle,
  Description: ChartFrameDescription,
  Actions: ChartFrameActions,
  Value: ChartFrameValue,
  Delta: ChartFrameDelta,
  Plot: ChartFramePlot,
  Legend: ChartFrameLegend,
  Tooltip: ChartFrameTooltip,
};
