import * as React from "react";
import { visuallyHiddenClass } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { useStateSwap } from "@/hooks/useStateSwap";
import { Icon } from "@/icons";
import { type AnchorPoint, ChartTooltip } from "@/internal/ChartTooltip";
import { cx } from "@/internal/cx";
import { HUE_CHART } from "@/internal/palette";
import type { TagRef } from "@/internal/polymorphic";
import { rovingIndex } from "@/internal/rovingFocus";
import type { PaletteColor, Tone } from "@/internal/states";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import swap from "@/internal/swapMotion.module.css";
import textRole from "@/internal/textRole.module.css";
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
};

/** A series as the plot draws it: the resolved color as a CSS value and its visibility. */
export type ChartFramePlotSeries = {
  id: string;
  label: string;
  /** `var(--prime-color-chart-*)`: a string for SVG `fill` / `stroke` or a library's series color. */
  color: string;
  /** Turned off in the legend: keep the mark mounted with `data-hidden="true"` so it fades out. */
  hidden: boolean;
};

/** What `ChartFrame.Plot` hands `renderPlot`: the measured box and every series in order. */
export type ChartFramePlotArea = {
  /** Width of the plot area in px. */
  width: number;
  /** Height of the plot area in px. */
  height: number;
  series: ChartFramePlotSeries[];
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
  /** Header of the first column of `ChartFrame.Table` (what a row is). */
  category: string;
};

export const CHART_FRAME_LABELS: ChartFrameLabels = {
  empty: "Нет данных за период",
  error: "Не удалось загрузить график",
  retry: "Повторить",
  legend: "Ряды графика",
  category: "Период",
};

const NUMBER = new Intl.NumberFormat("ru-RU");
const defaultFormat = (value: number) => NUMBER.format(value);

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
  titleId: string;
  descriptionId: string;
  setHasTitle: (has: boolean) => void;
  setHasDescription: (has: boolean) => void;
  /** The plot element: a floating `ChartFrame.Tooltip` stands at a point of it. */
  plotRef: React.RefObject<HTMLDivElement | null>;
};

const ChartFrameContext = React.createContext<ChartFrameContextValue | null>(null);

function useChartFrame(part: string): ChartFrameContextValue {
  const context = React.useContext(ChartFrameContext);
  if (!context) throw new Error(`ChartFrame.${part} must be inside ChartFrame.Root`);
  return context;
}

const EMPTY_IDS: string[] = [];

export type ChartFrameRootProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * What the chart region shows. `loading` — Skeletons in the geometry of the value, the plot and
   * the legend values; `empty` — the empty state in the plot's place; `error` — the load error with
   * a retry button (`onRetry`). Every change cross-fades. Default `ready`.
   */
  state?: ChartFrameState;
  /** The series in drawing order: the legend, tooltip rows, table columns and plot colors. */
  series?: ChartFrameSeries[];
  /** Ids of the series turned off in the legend (controlled). */
  hiddenSeries?: string[];
  /** Initially hidden series (uncontrolled). Default none. */
  defaultHiddenSeries?: string[];
  /** The legend turned a series on or off; the new list of hidden ids. */
  onHiddenSeriesChange?: (hiddenSeries: string[]) => void;
  /** Display of a value in the legend, the tooltip and the table. Default: Russian digit groups. */
  formatValue?: (value: number) => string;
  /**
   * Loads the data again from the error state; shows the retry button. May return a Promise: the
   * button waits for it.
   */
  onRetry?: () => void | Promise<void>;
  labels?: Partial<ChartFrameLabels>;
  ref?: React.Ref<HTMLElement>;
};

/**
 * A dashboard panel around any chart (Recharts, ECharts, visx, Chart.js or a hand-drawn SVG): a
 * surface of the depth ladder named by its title, with a headline value, the measured plot area, a
 * series legend that turns series on and off, a tooltip body and a table for assistive tech. The
 * state (loading / empty / error / ready) lives on the root; every part shows its own side of it.
 */
function ChartFrameRoot({
  state = "ready",
  series = [],
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
      })),
    [series, hidden],
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
    labels: { ...CHART_FRAME_LABELS, ...labelsProp },
    onRetry,
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
      className={cx(styles.root, className)}
      data-depth={depth}
      data-state={state}
    >
      <SurfaceDepthProvider value={depth}>
        <ChartFrameContext.Provider value={context}>{children}</ChartFrameContext.Provider>
      </SurfaceDepthProvider>
    </figure>
  );
}
ChartFrameRoot.displayName = "ChartFrame.Root";

export type ChartFrameHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** The top zone: the title and the description first, `ChartFrame.Actions` at the end. */
function ChartFrameHeader({ className, ...rest }: ChartFrameHeaderProps) {
  return <div {...rest} className={cx(styles.header, className)} />;
}
ChartFrameHeader.displayName = "ChartFrame.Header";

type ChartFrameTitleAs = "h2" | "h3" | "h4";

export type ChartFrameTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  /** Heading level that fits the page outline; the look does not change. Default `h3`. */
  as?: ChartFrameTitleAs;
  ref?: React.Ref<HTMLHeadingElement>;
};

/** The name of the chart: heads the panel and names the figure. */
function ChartFrameTitle({ as: Tag = "h3", className, ref, ...rest }: ChartFrameTitleProps) {
  const { titleId, setHasTitle } = useChartFrame("Title");
  React.useLayoutEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);
  return (
    <Tag
      id={titleId}
      {...rest}
      ref={ref as TagRef<ChartFrameTitleAs>}
      className={cx(textRole.titleS, styles.title, className)}
    />
  );
}
ChartFrameTitle.displayName = "ChartFrame.Title";

export type ChartFrameDescriptionProps = React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
};

/** What the chart measures and over which period; describes the figure. */
function ChartFrameDescription({ className, ...rest }: ChartFrameDescriptionProps) {
  const { descriptionId, setHasDescription } = useChartFrame("Description");
  React.useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return (
    <p id={descriptionId} {...rest} className={cx(textRole.bodyS, styles.description, className)} />
  );
}
ChartFrameDescription.displayName = "ChartFrame.Description";

export type ChartFrameActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
};

/** Controls of the chart in the header (period switch, export); drops under the title when narrow. */
function ChartFrameActions({ className, ...rest }: ChartFrameActionsProps) {
  return <div {...rest} className={cx(styles.actions, className)} />;
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
  const { state } = useChartFrame("Value");
  const shown = state === "loading" || state === "error" ? state : "data";
  const swapped = useStateSwap(shown);
  const swapClass = swapped ? swap.swapIn : undefined;
  return (
    <div {...rest} className={cx(textRole.headingM, styles.value, className)}>
      {shown === "loading" ? (
        <Skeleton shape="block" className={cx(styles.valueSkeleton, swapClass)} />
      ) : shown === "error" ? (
        // The data failed to load: the number is unknown, not the last one seen.
        <span key="error" className={cx(styles.valueContent, styles.valueUnknown, swapClass)}>
          —
        </span>
      ) : (
        <span key="data" className={cx(styles.valueContent, swapClass)}>
          {children}
        </span>
      )}
    </div>
  );
}
ChartFrameValue.displayName = "ChartFrame.Value";

export type ChartFrameDeltaProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Color of the change: `success` — good, `danger` — bad, `neutral` (default). Independent of the sign. */
  tone?: Extract<Tone, "neutral" | "success" | "warning" | "danger">;
  ref?: React.Ref<HTMLSpanElement>;
};

/** The change of the headline value («+12% к сентябрю»); the sign is in the text, not only the color. */
function ChartFrameDelta({ tone = "neutral", className, ...rest }: ChartFrameDeltaProps) {
  return <span {...rest} className={cx(styles.delta, className)} data-tone={tone} />;
}
ChartFrameDelta.displayName = "ChartFrame.Delta";

export type ChartFramePlotProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /**
   * Height of the plot area in px. Default 240, 160 when the panel is narrower than 30rem. `fill` —
   * the plot takes the free height of a stretched panel (a `PageContent.Cell` with `rows`), the
   * default height at least.
   */
  height?: number | "fill";
  /**
   * Renders the chart at the measured size — for libraries that need explicit `width` and
   * `height` (Recharts without `ResponsiveContainer`, Chart.js, visx). Gets every series with its
   * resolved color and visibility. Called once the area has a size.
   */
  renderPlot?: (area: ChartFramePlotArea) => React.ReactNode;
  /** A chart that sizes itself to its container (an SVG with `width="100%"`, `ResponsiveContainer`). */
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
  const { state, series, labels, onRetry, plotRef } = useChartFrame("Plot");
  const mergedRef = useMergedRefs(plotRef, ref);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const measure = renderPlot !== undefined;

  React.useLayoutEffect(() => {
    const node = plotRef.current;
    if (!node || !measure) return;
    const update = (width: number, nextHeight: number) => {
      const next = { width: Math.round(width), height: Math.round(nextHeight) };
      setSize((prev) =>
        prev && prev.width === next.width && prev.height === next.height ? prev : next,
      );
    };
    const rect = node.getBoundingClientRect();
    update(rect.width, rect.height);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure, plotRef.current]);

  const plot =
    renderPlot !== undefined
      ? size && size.width > 0 && size.height > 0
        ? renderPlot({
            width: size.width,
            height: size.height,
            series: series.map(({ id, label, color, hidden }) => ({ id, label, color, hidden })),
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
          <div className={styles.canvas}>{plot}</div>
        )}
      </Crossfade>
    </div>
  );
}
ChartFramePlot.displayName = "ChartFrame.Plot";

export type ChartFrameLegendProps = React.HTMLAttributes<HTMLUListElement> & {
  /** Entries only name the series; they do not turn them on and off. */
  readOnly?: boolean;
  ref?: React.Ref<HTMLUListElement>;
};

/**
 * The series of the root as entries: swatch, name and the optional summary value. Each entry is a
 * toggle button (`aria-pressed` = shown); the arrows move between entries, Enter / Space toggle. A
 * hidden series keeps its place and color: its swatch turns hollow and its name quiet.
 */
function ChartFrameLegend({ readOnly = false, className, ...rest }: ChartFrameLegendProps) {
  const { state, series, toggle, formatValue, labels } = useChartFrame("Legend");
  const [focusIndex, setFocusIndex] = React.useState(0);
  const buttons = React.useRef<Array<HTMLButtonElement | null>>([]);
  const loading = state === "loading";
  const swapped = useStateSwap(loading ? "loading" : "data");
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
      aria-label={labels.legend}
      {...rest}
      className={cx(styles.legend, className)}
      data-read-only={readOnly || undefined}
    >
      {series.map((item, index) => {
        const content = (
          <>
            <span
              className={styles.swatch}
              aria-hidden="true"
              style={{ "--chart-frame-swatch": item.color } as React.CSSProperties}
            />
            <span className={styles.legendLabel}>{item.label}</span>
            {item.value !== undefined ? (
              loading ? (
                <Skeleton
                  shape="text"
                  size="xs"
                  className={cx(styles.legendValueSkeleton, swapped && swap.swapIn)}
                />
              ) : (
                <span className={cx(styles.legendValue, swapped && swap.swapIn)}>
                  {formatValue(item.value)}
                </span>
              )
            ) : null}
          </>
        );
        return (
          <li key={item.id} className={styles.legendItem}>
            {readOnly ? (
              <span className={styles.entry}>{content}</span>
            ) : (
              // A legend entry names a series and toggles it; Button's command look (filled label,
              // tier padding) would read as an action, so the entry draws its own quiet chip.
              <button
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                className={cx(styles.entry, styles.toggle, touchTargetClass)}
                aria-pressed={!item.hidden}
                tabIndex={index === active ? 0 : -1}
                data-hidden={item.hidden || undefined}
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
  /** The point the rows belong to («Неделя 41», «8 окт»). */
  label?: string;
  /** One row per series at that point; rows of hidden series are left out. */
  items: ChartFrameTooltipItem[];
  /**
   * A point of the plot in the coordinates `renderPlot` draws in (the pointer, or the point the
   * arrow keys reached): the tooltip floats beside it like every kit layer — right of it, on the
   * left only where the right has no room; `null` hides it. Without `point` the body renders in
   * place for a chart library's tooltip hook, which positions it.
   */
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
  const { series, formatValue, plotRef } = useChartFrame("Tooltip");
  const rows = items.flatMap((item) => {
    const entry = series.find((candidate) => candidate.id === item.id);
    if (entry?.hidden) return [];
    return [
      {
        id: item.id,
        label: entry?.label ?? item.id,
        color: entry?.color ?? chartColors.other,
        value: item.value,
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
        <ul className={styles.tooltipRows}>
          {rows.map((row) => (
            <li key={row.id} className={styles.tooltipRow}>
              <span
                className={styles.swatch}
                aria-hidden="true"
                style={{ "--chart-frame-swatch": row.color } as React.CSSProperties}
              />
              <span className={styles.tooltipName}>{row.label}</span>
              <span className={styles.tooltipValue}>{formatValue(row.value)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </ChartTooltip>
  );
}
ChartFrameTooltip.displayName = "ChartFrame.Tooltip";

export type ChartFrameTableRow = {
  /** The point the row stands for («Неделя 41»): the row header. */
  label: string;
  /** Values by series id; a missing value reads as «—». */
  values: Record<string, number | undefined>;
};

export type ChartFrameTableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  /** The chart's data, one row per point. */
  rows: ChartFrameTableRow[];
  ref?: React.Ref<HTMLTableElement>;
};

/**
 * The chart's data as a table for screen readers (visually hidden): a row per point, a column per
 * shown series, named by the chart title. Present only while the data is ready. A visible table is
 * a `DataTable`.
 */
function ChartFrameTable({ rows, className, ...rest }: ChartFrameTableProps) {
  const { state, series, formatValue, labels, titleId } = useChartFrame("Table");
  if (state !== "ready") return null;
  const columns = series.filter((item) => !item.hidden);
  return (
    <table aria-labelledby={titleId} {...rest} className={cx(visuallyHiddenClass, className)}>
      <thead>
        <tr>
          <th scope="col">{labels.category}</th>
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
              return <td key={column.id}>{value === undefined ? "—" : formatValue(value)}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
ChartFrameTable.displayName = "ChartFrame.Table";

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
  Table: ChartFrameTable,
};
