// biome-ignore-all lint/a11y/useSemanticElements: an ARIA grid of divs — table elements would lose their semantics under the flex layout the sticky column and the day axis need
// biome-ignore-all lint/a11y/useFocusableInteractive: grid rows and cells are not focus stops; the row headers and bars inside them are (one roving tab stop)
import { addDays, type Locale, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useEdgeOverflow } from "@/hooks/useEdgeOverflow";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { useVirtualRows } from "@/hooks/useVirtualRows";
import {
  AnchorRectProvider,
  type AnchorRectResolver,
  FloatingBoundaryProvider,
  type FloatingBoundaryResolver,
} from "@/internal/AnchorRectContext";
import { useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { createEdgeAutoScroll } from "@/internal/edgeAutoScroll";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { DRAG_THRESHOLD_PX, useLongPress } from "@/internal/longPress";
import { exitTimeoutMs } from "@/internal/motionTiming";
import { RegionSwap, useSwapIn } from "@/internal/RegionSwap";
import type { ControlSize } from "@/internal/states";
import { stickySurfaceClass } from "@/internal/sticky";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import { ToolGroup, ToolRow } from "@/internal/ToolRow";
import { isPromiseLike } from "@/internal/usePendingChanges";

import styles from "./Gantt.module.css";
import { GanttRow, type GanttRowContext, type GanttGhost as Ghost } from "./GanttRow";
import {
  applyEdit,
  assignLanes,
  barEdit,
  daysBetween,
  formatDay,
  type GanttBar,
  type GanttDates,
  type GanttEdit,
  type GanttNavItem,
  type GanttScale,
  headerTiers,
  isMilestone,
  navigate,
  resolveRange,
  SCALES,
  sameDates,
  shiftDate,
  snapHysteresis,
  stickyFloor,
  unitDays,
  unitStart,
  visibleSegment,
  weekOffset,
} from "./ganttModel";

export type { GanttBar, GanttDates, GanttScale } from "./ganttModel";

/** What opened a row: a click on its header, or Enter / Space on the focused header. */
export type GanttRowClickEvent = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;

/** System strings; `{label}`, `{start}`, `{end}`, `{date}`, `{progress}` are replaced. */
export type GanttLabels = {
  /** Heading of the first column. */
  rowsHeader: string;
  /** Accessible name of the time axis column. */
  timeline: string;
  /** Accessible name of the zoom switch. */
  scale: string;
  /** Zoom segments. */
  day: string;
  week: string;
  month: string;
  /** The button that scrolls to today, and the label on the today line. */
  today: string;
  /** Accessible name of a bar; `{start}` and `{end}` are its first and last day. */
  bar: string;
  /** Accessible name of a milestone. */
  milestone: string;
  /** Appended to a bar's name when it has `progress`. */
  progress: string;
  /** Description of an editable bar: the editing keys. */
  editHint: string;
  /** Description of a bar whose `edit` is `end`: the keys that change its end. */
  editEndHint: string;
  /** Duration of a bar in the tooltip; `{days}` is its number of days. */
  duration: string;
  /** Announced when `onBarChange` rejects and the bar returns to its dates. */
  changeFailed: string;
  /** Label of a bar being created (the ghost) and of its announcement. */
  newBar: string;
  /** Description of a row header when bars can be created: the creating key. */
  createHint: string;
  /** Announced when `onBarCreate` rejects and the new bar fades out. */
  createFailed: string;
  /** Screen-reader announcement while skeleton rows are shown. */
  loading: string;
  /** Default empty-state text (when `empty` is not set). */
  empty: string;
};

export const GANTT_LABELS: GanttLabels = {
  rowsHeader: "Название",
  timeline: "Шкала времени",
  scale: "Масштаб",
  day: "День",
  week: "Неделя",
  month: "Месяц",
  today: "Сегодня",
  bar: "{label}: {start} — {end}",
  milestone: "{label}: {date}",
  progress: "выполнено {progress}%",
  editHint:
    "Shift + стрелки сдвигают на день, Ctrl + Shift + стрелки меняют окончание на день; с Alt — на неделю или месяц масштаба",
  editEndHint:
    "Ctrl + Shift + стрелки меняют окончание на день; с Alt — на неделю или месяц масштаба",
  duration: "{days} дн.",
  changeFailed: "Сроки не изменены: {label}",
  newBar: "Новая задача",
  createHint: "N — создать задачу",
  createFailed: "Задача не создана",
  loading: "Загрузка графика…",
  empty: "Нет задач за этот период.",
};

export type GanttProps<Row, Bar extends GanttBar = GanttBar> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  ref?: React.Ref<HTMLDivElement>;
  rows: Row[];
  getRowKey: (row: Row) => React.Key;
  getRowLabel: (row: Row) => string;
  getRowBars: (row: Row) => Bar[];
  renderRow?: (row: Row) => React.ReactNode;
  renderRowAvatar?: (row: Row) => React.ReactNode;
  getRowHref?: (row: Row) => string;
  onRowClick?: (row: Row, event: GanttRowClickEvent) => void;
  renderBarTooltip?: (bar: Bar, row: Row) => React.ReactNode;
  scale?: GanttScale;
  defaultScale?: GanttScale;
  onScaleChange?: (scale: GanttScale) => void;
  range?: GanttDates;
  today?: Date;
  locale?: Locale;
  size?: ControlSize;
  readOnly?: boolean;
  loading?: boolean;
  empty?: React.ReactNode;
  toolbar?: React.ReactNode;
  scrollHeight?: number | "fill";
  onItemOpen?: (bar: Bar, row: Row) => void;
  onBarChange?: (dates: GanttDates, bar: Bar, row: Row) => void | Promise<void>;
  onBarCreate?: (dates: GanttDates, row: Row) => void | Promise<void>;
  labels?: Partial<GanttLabels>;
};

/**
 * Skeleton rows: per row one or two bars as `[offset, length]` in scale units around today — a
 * fixed pattern, so the placeholder never jumps between renders.
 */
const SKELETON_ROWS: readonly (readonly (readonly [number, number])[])[] = [
  [
    [-3, 4],
    [2, 3],
  ],
  [[-1, 6]],
  [
    [-5, 2],
    [0, 4],
  ],
  [[1, 3]],
];

/** Row geometry before the stylesheet can be read (jsdom, first render): the `m` tier. */
const FALLBACK_GEOMETRY = { padY: 8, barH: 28, laneGap: 4, border: 1 };

const ROW_PREFIX = "\u0000row:";
const rowNavId = (key: React.Key) => `${ROW_PREFIX}${String(key)}`;

type RowModel<Row, Bar> = {
  row: Row;
  key: React.Key;
  label: string;
  bars: Bar[];
  lanes: Map<string, number>;
  laneCount: number;
};

/**
 * A resource or project schedule: rows with bars on a time axis (day / week / month), a sticky
 * first column and header, weekends and a today line. Bars select, move and resize by pointer and
 * keyboard through an async `onBarChange`, and are drawn on empty space through `onBarCreate`.
 * Rows and the time axis are virtualized: thousands of rows over years stay fast.
 */
export function Gantt<Row, Bar extends GanttBar = GanttBar>({
  rows,
  getRowKey,
  getRowLabel,
  getRowBars,
  renderRow,
  renderRowAvatar,
  getRowHref,
  onRowClick,
  renderBarTooltip,
  scale: scaleProp,
  defaultScale = "week",
  onScaleChange,
  range: rangeProp,
  today: todayProp,
  locale = ru,
  size: sizeProp,
  readOnly = false,
  loading = false,
  empty,
  toolbar,
  scrollHeight,
  onItemOpen,
  onBarChange,
  onBarCreate,
  labels: labelsProp,
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...rest
}: GanttProps<Row, Bar>) {
  const tier = useHostTier(sizeProp);
  const size = tier.size;
  const labels = useLabels(GANTT_LABELS, labelsProp);
  const depth = useNestedSurfaceDepth();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const mergedRootRef = useMergedRefs(rootRef, ref);
  const scrollRef = React.useRef<HTMLElement | null>(null);
  const axisRef = React.useRef<HTMLDivElement | null>(null);
  const cornerRef = React.useRef<HTMLDivElement | null>(null);
  const headRef = React.useRef<HTMLDivElement | null>(null);
  /** Rendered focusable cells by navigation id: bars and row headers. */
  const cellNodes = React.useRef(new Map<string, HTMLElement>());
  const hintId = React.useId();
  const endHintId = React.useId();
  const createHintId = React.useId();

  // Keyed by the day value: a new Date object for the same day keeps the axis.
  const todayTime = todayProp?.getTime();
  const today = React.useMemo(
    () => startOfDay(todayTime === undefined ? new Date() : new Date(todayTime)),
    [todayTime],
  );

  const [scale, setScale] = useControllableState<GanttScale>({
    value: scaleProp,
    defaultValue: defaultScale,
    onChange: onScaleChange,
  });

  // ─── Data ───
  // Internal re-renders (scrolling, hover) keep the props, so the model is computed once per data.
  const model = React.useMemo<RowModel<Row, Bar>[]>(
    () =>
      rows.map((row) => {
        const bars = getRowBars(row);
        const { lanes, count } = assignLanes(bars);
        return { row, key: getRowKey(row), label: getRowLabel(row), bars, lanes, laneCount: count };
      }),
    [rows, getRowBars, getRowKey, getRowLabel],
  );
  const barsKey = React.useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const item of model) {
      for (const bar of item.bars) {
        min = Math.min(min, bar.start.getTime());
        max = Math.max(max, bar.end.getTime());
      }
    }
    return Number.isFinite(min) ? `${min}-${max}` : "";
  }, [model]);
  const rangeStartTime = rangeProp?.start.getTime();
  const rangeEndTime = rangeProp?.end.getTime();
  const range = React.useMemo(() => {
    const [min, max] = barsKey ? barsKey.split("-").map(Number) : [];
    const extent = min === undefined ? [] : [{ start: new Date(min), end: new Date(max) }];
    return resolveRange(
      extent,
      today,
      scale,
      rangeStartTime === undefined || rangeEndTime === undefined
        ? undefined
        : { start: new Date(rangeStartTime), end: new Date(rangeEndTime) },
    );
  }, [barsKey, today, scale, rangeStartTime, rangeEndTime]);
  const totalDays = daysBetween(range.start, range.end);
  const tiers = React.useMemo(
    () => headerTiers(scale, range, today, locale),
    [scale, range, today, locale],
  );
  const todayX = daysBetween(range.start, today);
  const todayInRange = todayX >= 0 && todayX < totalDays;

  // ─── Pending changes ───
  const [pending, setPending] = React.useState<ReadonlyMap<string, GanttDates>>(new Map());
  const [announcement, setAnnouncement] = React.useState("");
  const editableAtAll = !readOnly && !loading && onBarChange !== undefined;
  const creatable = !readOnly && !loading && onBarCreate !== undefined;

  const nameFor = React.useCallback(
    (bar: Pick<GanttBar, "label" | "progress">, dates: GanttDates) => {
      const name = isMilestone(dates)
        ? formatLabel(labels.milestone, { label: bar.label, date: formatDay(dates.start, locale) })
        : formatLabel(labels.bar, {
            label: bar.label,
            start: formatDay(dates.start, locale),
            end: formatDay(addDays(dates.end, -1), locale),
          });
      if (bar.progress === undefined) return name;
      const share = Math.round(Math.min(Math.max(bar.progress, 0), 1) * 100);
      return `${name}, ${formatLabel(labels.progress, { progress: share })}`;
    },
    [labels, locale],
  );

  const commit = (bar: Bar, row: Row, dates: GanttDates, announce: boolean) => {
    if (!onBarChange || sameDates(dates, bar)) return;
    const result = onBarChange(dates, bar, row);
    if (announce) setAnnouncement(nameFor(bar, dates));
    if (!isPromiseLike(result)) return;
    setPending((prev) => new Map(prev).set(bar.id, dates));
    Promise.resolve(result)
      .catch(() => setAnnouncement(formatLabel(labels.changeFailed, { label: bar.label })))
      .finally(() =>
        setPending((prev) => {
          const next = new Map(prev);
          next.delete(bar.id);
          return next;
        }),
      );
  };

  const shownDates = (bar: GanttBar): GanttDates => pending.get(bar.id) ?? bar;
  /** The edits a bar takes now: none while the chart is still or the bar's change is pending. */
  const editOf = (bar: GanttBar) =>
    editableAtAll && !pending.has(bar.id) ? barEdit(bar, shownDates(bar)) : "none";

  // ─── Creating ───
  const [ghosts, setGhosts] = React.useState<ReadonlyMap<React.Key, Ghost>>(new Map());
  const ghostSeq = React.useRef(0);
  const setGhost = React.useCallback((rowKey: React.Key, ghost: Ghost | null) => {
    setGhosts((prev) => {
      const next = new Map(prev);
      if (ghost) next.set(rowKey, ghost);
      else next.delete(rowKey);
      return next;
    });
  }, []);

  const create = (item: RowModel<Row, Bar>, dates: GanttDates) => {
    if (!onBarCreate) return;
    const id = `ghost-${++ghostSeq.current}`;
    const result = onBarCreate(dates, item.row);
    setAnnouncement(nameFor({ label: labels.newBar }, dates));
    if (!isPromiseLike(result)) {
      setGhost(item.key, null);
      return;
    }
    setGhost(item.key, { id, dates, status: "pending" });
    const drop = () =>
      setGhosts((prev) => {
        if (prev.get(item.key)?.id !== id) return prev;
        const next = new Map(prev);
        next.delete(item.key);
        return next;
      });
    result.then(
      // The owner added the bar before resolving: it renders where the ghost stood, in its lane.
      drop,
      () => {
        setAnnouncement(labels.createFailed);
        setGhosts((prev) => {
          if (prev.get(item.key)?.id !== id) return prev;
          return new Map(prev).set(item.key, { id, dates, status: "leaving" });
        });
        window.setTimeout(drop, prefersReducedMotion() ? 0 : exitTimeoutMs("fast"));
      },
    );
  };

  // ─── Geometry ───
  /*
   * The length of a day and the direction are read once per commit (and on resize), not on every
   * scroll event: a scroll moves nothing they depend on, and a read after a write forces layout.
   */
  const geometryCache = React.useRef<{ px: number | null; dir: 1 | -1 | null }>({
    px: null,
    dir: null,
  });
  React.useLayoutEffect(() => {
    geometryCache.current = { px: null, dir: null };
  });
  const dayPx = React.useCallback(() => {
    const cache = geometryCache.current;
    if (cache.px === null) {
      const axis = axisRef.current;
      cache.px = !axis || totalDays <= 0 ? 0 : axis.getBoundingClientRect().width / totalDays;
    }
    return cache.px;
  }, [totalDays]);
  const direction = React.useCallback((): 1 | -1 => {
    const cache = geometryCache.current;
    cache.dir ??= rootRef.current && getComputedStyle(rootRef.current).direction === "rtl" ? -1 : 1;
    return cache.dir;
  }, []);
  const labelWidth = React.useCallback(
    () => cornerRef.current?.getBoundingClientRect().width ?? 0,
    [],
  );
  const scrollLeft = React.useCallback(() => scrollRef.current?.scrollLeft ?? 0, []);
  const dayPxRef = React.useRef(dayPx);
  dayPxRef.current = dayPx;
  const directionRef = React.useRef(direction);
  directionRef.current = direction;
  // A gesture on the time axis scrolls the chart sideways near its edges; the start edge is the
  // end of the pinned column. One loop for every gesture: each names what it re-reads.
  const onAutoScrolled = React.useRef<() => void>(() => {});
  const [edgeScroll] = React.useState(() =>
    createEdgeAutoScroll({
      scrollers: [],
      axes: { x: true, y: false },
      insets: () => ({ inlineStart: labelWidth() }),
      onScrolled: () => onAutoScrolled.current(),
    }),
  );
  React.useEffect(() => () => edgeScroll.stop(), [edgeScroll]);
  const autoScroll = React.useMemo(
    () => ({
      follow: (clientX: number, onScrolled: () => void) => {
        const viewport = scrollRef.current;
        if (!viewport) return;
        onAutoScrolled.current = onScrolled;
        edgeScroll.setScrollers([viewport]);
        edgeScroll.follow({ x: clientX, y: 0 });
      },
      stop: () => edgeScroll.stop(),
    }),
    [edgeScroll],
  );

  /** Row heights from the stylesheet of the tier: estimates before a row is measured. */
  const [geometry, setGeometry] = React.useState(FALLBACK_GEOMETRY);
  // The stylesheet values follow the tier (`data-size`): read once per tier.
  const geometryTier = React.useRef<ControlSize | null>(null);
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || geometryTier.current === size) return;
    geometryTier.current = size;
    const next = {
      padY: readCssLengthPx("--gantt-pad-y", FALLBACK_GEOMETRY.padY, root),
      barH: readCssLengthPx("--gantt-bar-h", FALLBACK_GEOMETRY.barH, root),
      laneGap: readCssLengthPx("--gantt-lane-gap", FALLBACK_GEOMETRY.laneGap, root),
      border: readCssLengthPx("--prime-border-width", FALLBACK_GEOMETRY.border, root),
    };
    setGeometry((prev) =>
      prev.padY === next.padY &&
      prev.barH === next.barH &&
      prev.laneGap === next.laneGap &&
      prev.border === next.border
        ? prev
        : next,
    );
  });
  const [headHeight, setHeadHeight] = React.useState(0);
  React.useLayoutEffect(() => {
    const height = headRef.current?.getBoundingClientRect().height ?? 0;
    setHeadHeight((prev) => (prev === height ? prev : height));
  });

  /** Lanes of a row with its ghost: a bar being created takes the lane it will land in. */
  const lanesOf = (item: RowModel<Row, Bar>) => {
    const ghost = ghosts.get(item.key);
    if (!ghost) return { lanes: item.lanes, count: item.laneCount, ghostLane: -1 };
    const { lanes, count } = assignLanes([
      ...item.bars,
      { id: ghost.id, label: "", ...ghost.dates },
    ]);
    return { lanes, count, ghostLane: lanes.get(ghost.id) ?? 0 };
  };

  /** Scrolls the viewport so `day` (days from the range start) sits at `align` of the visible axis. */
  const scrollToDay = React.useCallback(
    (day: number, align: number, smooth: boolean) => {
      const viewport = scrollRef.current;
      if (!viewport) return;
      const visible = Math.max(0, viewport.clientWidth - labelWidth());
      const max = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const left = Math.min(Math.max(day * dayPx() - visible * align, 0), max) * direction();
      if (smooth && !prefersReducedMotion() && typeof viewport.scrollTo === "function") {
        viewport.scrollTo({ left, behavior: "smooth" });
      } else {
        viewport.scrollLeft = left;
      }
    },
    [dayPx, direction, labelWidth],
  );

  /*
   * The moment in view: the day under the middle of the visible axis, fractional, kept across zoom
   * changes. A scroll records it, except the scroll the chart makes to restore it: when the new zoom
   * cannot put that day in the middle (the whole axis fits, an edge), the clamped view is not a new
   * moment, and the next zoom returns to the day the person chose.
   */
  const viewAnchor = React.useRef<{ day: Date; offset: number; restoredAt: number | null } | null>(
    null,
  );
  const rememberCenter = () => {
    const viewport = scrollRef.current;
    const px = dayPx();
    if (!viewport || px <= 0) return;
    const left = Math.abs(viewport.scrollLeft);
    if (viewAnchor.current?.restoredAt === left) return;
    const center = (left + (viewport.clientWidth - labelWidth()) / 2) / px;
    const whole = Math.floor(center);
    viewAnchor.current = {
      day: addDays(range.start, whole),
      offset: center - whole,
      restoredAt: null,
    };
  };

  /*
   * First view: today a third into the axis. A zoom change keeps the day in the middle. When the
   * axis grows at the start (rows arrived, a bar moved earlier) the view stays on the same days.
   */
  const shownView = React.useRef<{ scale: GanttScale; start: number } | null>(null);
  React.useLayoutEffect(() => {
    const previous = shownView.current;
    shownView.current = { scale, start: range.start.getTime() };
    if (!previous) {
      scrollToDay(todayInRange ? todayX + 0.5 : 0, 1 / 3, false);
    } else if (previous.scale !== scale) {
      const anchor = viewAnchor.current;
      const viewport = scrollRef.current;
      if (anchor && viewport) {
        scrollToDay(daysBetween(range.start, anchor.day) + anchor.offset, 1 / 2, false);
        anchor.restoredAt = Math.abs(viewport.scrollLeft);
      } else {
        scrollToDay(todayInRange ? todayX + 0.5 : 0, 1 / 3, false);
      }
    } else if (previous.start !== range.start.getTime() && scrollRef.current) {
      const grown = daysBetween(range.start, new Date(previous.start));
      scrollRef.current.scrollLeft += grown * dayPx() * direction();
    }
  }, [scale, range, todayInRange, todayX, scrollToDay, dayPx, direction]);

  // ─── Time window: header cells, lines and bars outside it are not rendered ───
  const [timeWindow, setTimeWindow] = React.useState<[number, number] | null>(null);
  const updateTimeWindow = React.useCallback(() => {
    const viewport = scrollRef.current;
    const px = dayPx();
    if (!viewport || px <= 0 || viewport.clientWidth === 0) {
      setTimeWindow(null);
      return;
    }
    const left = Math.abs(viewport.scrollLeft) / px;
    const visible = Math.max(1, (viewport.clientWidth - labelWidth()) / px);
    // A screen of overscan on both sides, moved in half-screen steps: a re-render per half screen.
    const step = Math.max(7, Math.ceil(visible / 2));
    const from = Math.floor((left - visible) / step) * step;
    const to = Math.ceil((left + 2 * visible) / step) * step;
    setTimeWindow((prev) => (prev && prev[0] === from && prev[1] === to ? prev : [from, to]));
  }, [dayPx, labelWidth]);
  // A new zoom or axis moves the window: recomputed once per axis (the length of a day follows it).
  const windowAxis = React.useRef<string | null>(null);
  React.useLayoutEffect(() => {
    const axis = `${scale}:${range.start.getTime()}:${range.end.getTime()}`;
    if (windowAxis.current === axis) return;
    windowAxis.current = axis;
    updateTimeWindow();
  });
  React.useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      geometryCache.current = { px: null, dir: null };
      updateTimeWindow();
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [updateTimeWindow]);
  const inWindow = (x: number, span: number) =>
    !timeWindow || (x + Math.max(span, 1) >= timeWindow[0] && x <= timeWindow[1]);

  // ─── Keyboard: roving focus over row headers and bars ───
  const navItems = React.useMemo(() => {
    const items: GanttNavItem[] = [];
    model.forEach((item, rowIndex) => {
      items.push({ id: rowNavId(item.key), row: rowIndex, center: -1e9, kind: "row" });
      const sorted = [...item.bars].sort(
        (a, b) =>
          a.start.getTime() - b.start.getTime() ||
          (item.lanes.get(a.id) ?? 0) - (item.lanes.get(b.id) ?? 0),
      );
      for (const bar of sorted) {
        const dates = pending.get(bar.id) ?? bar;
        const x = daysBetween(range.start, dates.start);
        items.push({
          id: bar.id,
          row: rowIndex,
          center: x + daysBetween(dates.start, dates.end) / 2,
          kind: "bar",
        });
      }
    });
    return items;
  }, [model, pending, range.start]);
  const navIndex = React.useMemo(
    () => new Map(navItems.map((item) => [item.id, item])),
    [navItems],
  );
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const tabStop =
    activeId && navIndex.has(activeId)
      ? activeId
      : (navItems.find((item) => item.kind === "bar")?.id ?? navItems[0]?.id ?? null);

  // Bars dragged right now: kept rendered wherever the chart scrolls.
  const [dragging, setDragging] = React.useState<ReadonlySet<string>>(new Set());
  const onDragChange = React.useCallback((id: string, isDragging: boolean) => {
    setDragging((prev) => {
      const next = new Set(prev);
      if (isDragging) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // ─── Rows: only the rows in view (and the pinned ones) are rendered ───
  const keyIndex = React.useMemo(
    () => new Map(model.map((item, index) => [item.key, index])),
    [model],
  );
  const pinnedRows: number[] = [];
  const pinnedBars = new Set<string>([...dragging, ...pending.keys()]);
  if (tabStop) {
    const item = navIndex.get(tabStop);
    if (item) pinnedRows.push(item.row);
    pinnedBars.add(tabStop);
  }
  for (const id of pinnedBars) {
    const item = navIndex.get(id);
    if (item) pinnedRows.push(item.row);
  }
  for (const key of ghosts.keys()) {
    const index = keyIndex.get(key);
    if (index !== undefined) pinnedRows.push(index);
  }
  const rowHeightOf = React.useCallback(
    (lanes: number) =>
      2 * geometry.padY + lanes * geometry.barH + (lanes - 1) * geometry.laneGap + geometry.border,
    [geometry],
  );
  const getKey = React.useCallback((index: number) => model[index]?.key ?? index, [model]);
  const ghostLanes = React.useMemo(() => {
    const result = new Map<React.Key, number>();
    for (const [key, ghost] of ghosts) {
      const index = keyIndex.get(key);
      if (index === undefined) continue;
      const item = model[index];
      result.set(
        key,
        assignLanes([...item.bars, { id: ghost.id, label: "", ...ghost.dates }]).count,
      );
    }
    return result;
  }, [ghosts, keyIndex, model]);
  const lanesAt = React.useCallback(
    (index: number) => {
      const item = model[index];
      return item ? (ghostLanes.get(item.key) ?? item.laneCount) : 1;
    },
    [model, ghostLanes],
  );
  const estimateSize = React.useCallback(
    (index: number) => rowHeightOf(lanesAt(index)),
    [rowHeightOf, lanesAt],
  );
  const getGroup = React.useCallback((index: number) => lanesAt(index), [lanesAt]);
  const virtual = useVirtualRows({
    count: model.length,
    scrollRef,
    getKey,
    estimateSize,
    getGroup,
    offset: headHeight,
    pinned: pinnedRows,
  });

  /** Brings a cell into view inside the chart's own scroller (never the page). */
  const revealCell = (node: HTMLElement) => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const margin = readCssLengthPx("--prime-space-4", 16);
    const view = viewport.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    const top = view.top + (headRef.current?.getBoundingClientRect().height ?? 0);
    if (node.dataset.ganttBar !== undefined) {
      const left = view.left + labelWidth();
      if (rect.left < left + margin) viewport.scrollLeft -= left + margin - rect.left;
      else if (rect.right > view.right - margin && rect.width < view.right - left) {
        viewport.scrollLeft += rect.right - (view.right - margin);
      }
    }
    if (rect.top < top) viewport.scrollTop -= top - rect.top + margin;
    else if (rect.bottom > view.bottom) viewport.scrollTop += rect.bottom - view.bottom + margin;
  };

  /*
   * Tooltips follow no scroll: any scroll of the chart (scrollbar, wheel, touch, «Сегодня») closes
   * them, and the next hover or focus opens one again. The only scroll a tooltip survives is the
   * reveal of the cell the keyboard just focused, and only while it is in view.
   */
  const openTips = React.useRef(new Map<string, () => void>());
  const revealing = React.useRef(false);
  const registerTip = React.useCallback((id: string, close: (() => void) | null) => {
    if (close) openTips.current.set(id, close);
    else openTips.current.delete(id);
  }, []);
  const closeTips = (keepFocusedInView: boolean) => {
    if (openTips.current.size === 0) return;
    const viewport = scrollRef.current;
    for (const [id, close] of openTips.current) {
      const node = cellNodes.current.get(id);
      if (keepFocusedInView && node && viewport && node === document.activeElement) {
        const view = viewport.getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        const left = view.left + labelWidth();
        const top = view.top + (headRef.current?.getBoundingClientRect().height ?? 0);
        const inView =
          rect.left >= left &&
          rect.right <= view.right &&
          rect.top >= top &&
          rect.bottom <= view.bottom;
        if (inView) continue;
      }
      close();
    }
  };

  /** A cell the keyboard moves to: rendered on the next commit if virtualized away, then focused. */
  const focusTarget = React.useRef<string | null>(null);
  const focusNow = (id: string) => {
    const node = cellNodes.current.get(id);
    if (!node) return false;
    const viewport = scrollRef.current;
    const before = viewport ? viewport.scrollLeft + viewport.scrollTop : 0;
    // Reveal first, then focus: the bar's focus tooltip opens where the bar now stands.
    revealCell(node);
    if (viewport && viewport.scrollLeft + viewport.scrollTop !== before) revealing.current = true;
    node.focus({ preventScroll: true });
    return true;
  };
  const focusCell = (id: string) => {
    setActiveId(id);
    if (!focusNow(id)) focusTarget.current = id;
  };
  React.useLayoutEffect(() => {
    const id = focusTarget.current;
    if (id && focusNow(id)) focusTarget.current = null;
  });

  const findBar = (id: string) => {
    const nav = navIndex.get(id);
    const item = nav ? model[nav.row] : undefined;
    const bar = item?.bars.find((candidate) => candidate.id === id);
    return bar && item ? { bar, item } : null;
  };

  /** A new bar of one unit: after the focused bar, or at today in a row header (else in view). */
  const createFromKeyboard = (id: string) => {
    const nav = navIndex.get(id);
    const item = nav ? model[nav.row] : undefined;
    if (!item || !nav) return;
    let start: Date;
    if (nav.kind === "bar") {
      const bar = item.bars.find((candidate) => candidate.id === id);
      if (!bar) return;
      start = unitStart(shownDates(bar).end, scale);
      if (start < shownDates(bar).end) start = shiftDate(start, 1, scale);
    } else {
      const first = timeWindow ? Math.max(0, timeWindow[0]) : 0;
      start = unitStart(todayInRange ? today : addDays(range.start, first), scale);
    }
    create(item, { start, end: shiftDate(start, 1, scale) });
  };

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const id = (event.target as HTMLElement).closest<HTMLElement>("[data-nav-id]")?.dataset.navId;
    if (!id) return;
    const rtl = direction() === -1;
    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const forward = (event.key === "ArrowRight") !== rtl;
    const ctrl = event.ctrlKey || event.metaKey;
    if (event.code === "KeyN" && !ctrl && !event.altKey && !event.shiftKey) {
      if (!creatable) return;
      event.preventDefault();
      createFromKeyboard(id);
      return;
    }
    if (event.shiftKey && horizontal) {
      const found = findBar(id);
      if (!found) return;
      event.preventDefault();
      const allowed = editOf(found.bar);
      // A day per press at every zoom; with Alt, the zoom's unit (a week, a month).
      const edit: GanttEdit = ctrl ? "end" : "move";
      if (allowed === "none" || (allowed === "end" && edit !== "end")) return;
      const unit: GanttScale = event.altKey ? scale : "day";
      const dates = applyEdit(shownDates(found.bar), edit, forward ? 1 : -1, unit);
      commit(found.bar, found.item.row, dates, true);
      return;
    }
    if (event.altKey || event.shiftKey) return;
    const key = horizontal ? (forward ? "ArrowRight" : "ArrowLeft") : event.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(key)) return;
    event.preventDefault();
    const next = navigate(navItems, id, key, ctrl);
    if (next) focusCell(next);
  };

  // ─── Pointer creating on empty space ───
  /** The scale unit under the pointer in a track: its start (days from the range start) and length. */
  const cellAt = (track: HTMLElement, clientX: number): { x: number; span: number } | null => {
    const px = dayPx();
    if (px <= 0) return null;
    const rect = track.getBoundingClientRect();
    const offset = direction() === 1 ? clientX - rect.left : rect.right - clientX;
    const day = Math.min(Math.max(Math.floor(offset / px), 0), totalDays - 1);
    const start = unitStart(addDays(range.start, day), scale);
    const end = shiftDate(start, 1, scale);
    return { x: daysBetween(range.start, start), span: daysBetween(start, end) };
  };
  const datesOf = (cell: { x: number; span: number }): GanttDates => ({
    start: addDays(range.start, cell.x),
    end: addDays(range.start, cell.x + cell.span),
  });

  const [hoverCell, setHoverCell] = React.useState<{
    row: React.Key;
    x: number;
    span: number;
  } | null>(null);
  /** The day under the pointer in a track, fractional (days from the range start). */
  const dayAt = (track: HTMLElement, clientX: number): number | null => {
    const px = dayPx();
    if (px <= 0) return null;
    const rect = track.getBoundingClientRect();
    const offset = direction() === 1 ? clientX - rect.left : rect.right - clientX;
    return Math.min(Math.max(offset / px, 0), totalDays - 0.001);
  };

  /**
   * Drawing a new bar: whole days from the day pressed to the day under the pointer (with sub-day
   * hysteresis, so a few px per day never jitter); with Alt, whole units of the zoom.
   */
  const drawing = React.useRef<{
    item: RowModel<Row, Bar>;
    track: HTMLElement;
    pointerId: number;
    x: number;
    clientX: number;
    alt: boolean;
    anchorDay: number;
    day: number | null;
    moved: boolean;
    touch: boolean;
    id: string;
  } | null>(null);
  // A finger resting on an empty cell picks it up: the press names what it starts.
  const pressStart = React.useRef<(() => void) | null>(null);
  const longPress = useLongPress({
    enabled: creatable,
    onLongPress: () => {
      const start = pressStart.current;
      pressStart.current = null;
      start?.();
    },
  });
  const cancelLongPress = () => {
    pressStart.current = null;
    longPress.cancel();
  };

  const drawTo = () => {
    const current = drawing.current;
    if (!current) return;
    const raw = dayAt(current.track, current.clientX);
    if (raw === null) return;
    let start: number;
    let end: number;
    if (current.alt && scale !== "day") {
      const anchor = cellAt(current.track, current.x);
      const cell = cellAt(current.track, current.clientX);
      if (!anchor || !cell) return;
      start = Math.min(anchor.x, cell.x);
      end = Math.max(anchor.x + anchor.span, cell.x + cell.span);
      current.day = null;
    } else {
      const day = stickyFloor(raw, current.day, snapHysteresis(dayPx()));
      current.day = day;
      start = Math.min(current.anchorDay, day);
      end = Math.max(current.anchorDay, day) + 1;
    }
    setGhost(current.item.key, {
      id: current.id,
      dates: datesOf({ x: start, span: end - start }),
      status: "drawing",
    });
  };
  const stopDrawing = (commitIt: boolean) => {
    const current = drawing.current;
    drawing.current = null;
    autoScroll.stop();
    if (!current?.moved) return;
    const ghost = ghosts.get(current.item.key);
    if (commitIt && ghost && ghost.id === current.id) create(current.item, ghost.dates);
    else setGhost(current.item.key, null);
  };
  // A touch pick-up holds the finger: the chart must not pan while it draws.
  React.useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const hold = (event: TouchEvent) => {
      if (drawing.current) event.preventDefault();
    };
    viewport.addEventListener("touchmove", hold, { passive: false });
    return () => viewport.removeEventListener("touchmove", hold);
  }, []);

  // Escape while drawing drops the ghost; the track holds no focus, so the document listens.
  const isDrawing = [...ghosts.values()].some((ghost) => ghost.status === "drawing");
  // Listens only while a ghost is being drawn; the latest `stopDrawing` is read at the key press.
  const stopDrawingRef = React.useRef(stopDrawing);
  stopDrawingRef.current = stopDrawing;
  React.useEffect(() => {
    if (!isDrawing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      stopDrawingRef.current(false);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [isDrawing]);

  const trackHandlers = (item: RowModel<Row, Bar>) =>
    creatable
      ? {
          onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
            if (event.target !== event.currentTarget || event.button !== 0) return;
            if (ghosts.get(item.key)?.status === "pending") return;
            const cell = cellAt(event.currentTarget, event.clientX);
            if (!cell) return;
            const track = event.currentTarget;
            const anchorDay = Math.floor(dayAt(track, event.clientX) ?? 0);
            const start = (touch: boolean) => ({
              item,
              track,
              pointerId: event.pointerId,
              x: event.clientX,
              clientX: event.clientX,
              alt: event.altKey,
              anchorDay,
              day: anchorDay,
              moved: touch,
              touch,
              id: `ghost-${++ghostSeq.current}`,
            });
            if (event.pointerType === "touch") {
              // A long press picks the cell up: release creates one unit, a drag draws days.
              const pointerId = event.pointerId;
              pressStart.current = () => {
                const current = start(true);
                drawing.current = current;
                track.setPointerCapture?.(pointerId);
                setGhost(item.key, { id: current.id, dates: datesOf(cell), status: "drawing" });
              };
              longPress.handlers.onPointerDown(event);
              return;
            }
            drawing.current = start(false);
            track.setPointerCapture?.(event.pointerId);
          },
          onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
            longPress.handlers.onPointerMove(event);
            const current = drawing.current;
            if (current && event.pointerId === current.pointerId) {
              current.clientX = event.clientX;
              current.alt = event.altKey;
              if (Math.abs(event.clientX - current.x) < DRAG_THRESHOLD_PX) {
                // Still on the pressed spot (a touch pick-up keeps its one-unit ghost).
                if (!current.moved || current.touch) return;
              }
              current.moved = true;
              current.touch = false;
              setHoverCell(null);
              drawTo();
              autoScroll.follow(event.clientX, drawTo);
              return;
            }
            if (event.pointerType !== "mouse" || event.target !== event.currentTarget) {
              if (hoverCell) setHoverCell(null);
              return;
            }
            const cell = cellAt(event.currentTarget, event.clientX);
            if (
              cell &&
              (hoverCell?.row !== item.key ||
                hoverCell.x !== cell.x ||
                hoverCell.span !== cell.span)
            ) {
              setHoverCell({ row: item.key, ...cell });
            }
          },
          onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => {
            cancelLongPress();
            if (drawing.current?.pointerId === event.pointerId) stopDrawing(true);
          },
          onPointerCancel: () => {
            cancelLongPress();
            stopDrawing(false);
          },
          onPointerLeave: () => {
            if (hoverCell?.row === item.key) setHoverCell(null);
          },
          onContextMenu: (event: React.MouseEvent<HTMLDivElement>) => {
            // A long-press on touch creates; the system menu would cover it.
            if (pressStart.current) event.preventDefault();
          },
          onDoubleClick: (event: React.MouseEvent<HTMLDivElement>) => {
            if (event.target !== event.currentTarget) return;
            const cell = cellAt(event.currentTarget, event.clientX);
            if (cell) create(item, datesOf(cell));
          },
        }
      : {};

  /*
   * Label widths by text: measured once per text and tier, so scrolling (bars mounting) reads no
   * layout. Reads come first and writes after, so a pass never forces a layout per bar.
   */
  // Kept per tier: a new tier changes every text width and the bar padding.
  const textCache = React.useRef<{
    tier: ControlSize;
    widths: Map<string, number>;
    pad: number | null;
  }>({ tier: size, widths: new Map(), pad: null });
  const measureBars = () => {
    if (textCache.current.tier !== size) {
      textCache.current = { tier: size, widths: new Map(), pad: null };
    }
    const cache = textCache.current;
    const bars: { node: HTMLElement; width: number }[] = [];
    for (const node of cellNodes.current.values()) {
      if (node.dataset.ganttBar === undefined) continue;
      const label = node.querySelector<HTMLElement>("[data-gantt-label]");
      if (!label) continue;
      const text = label.textContent ?? "";
      let width = cache.widths.get(text);
      if (width === undefined) {
        width = label.scrollWidth;
        if (width > 0) cache.widths.set(text, width);
      }
      if (cache.pad === null && node.dataset.milestone === undefined) {
        cache.pad = Number.parseFloat(getComputedStyle(node).paddingInlineStart) || 0;
      }
      bars.push({ node, width });
    }
    return bars;
  };

  /*
   * A label that does not fit its bar goes beside it, if the lane is free up to the next bar;
   * otherwise it hides (the tooltip and the name still carry it). Measured: the text decides.
   */
  React.useLayoutEffect(() => {
    const px = dayPx();
    const gap = readCssLengthPx("--prime-space-2", 8);
    const milestoneSize = geometry.barH;
    const bars = measureBars();
    const pad = textCache.current.pad ?? 0;
    const startPx = (node: HTMLElement) =>
      node.dataset.milestone === undefined
        ? Number(node.dataset.x) * px
        : (Number(node.dataset.x) + 0.5) * px - milestoneSize / 2;
    const endPx = (node: HTMLElement) =>
      node.dataset.milestone === undefined
        ? (Number(node.dataset.x) + Number(node.dataset.span)) * px
        : startPx(node) + milestoneSize;
    const lanes = new Map<string, HTMLElement[]>();
    for (const { node } of bars) {
      const key = `${node.parentElement?.dataset.row}:${node.dataset.lane}`;
      const lane = lanes.get(key);
      if (lane) lane.push(node);
      else lanes.set(key, [node]);
    }
    const placement = new Map<HTMLElement, string>();
    for (const { node, width } of bars) {
      if (
        node.dataset.milestone === undefined &&
        width + 2 * pad <= Number(node.dataset.span) * px
      ) {
        placement.set(node, "inside");
        continue;
      }
      const lane = lanes.get(`${node.parentElement?.dataset.row}:${node.dataset.lane}`) ?? [];
      const end = endPx(node);
      const own = startPx(node);
      let room = Number.POSITIVE_INFINITY;
      for (const other of lane) {
        const start = startPx(other);
        if (other !== node && start > own) room = Math.min(room, start - end);
      }
      placement.set(node, width + gap <= room ? "outside" : "hidden");
    }
    for (const [node, value] of placement) {
      if (node.dataset.label !== value) node.dataset.label = value;
    }
    shiftLabels(true);
  });

  /*
   * A bar that starts under the pinned column slides its label along, so the text stays readable
   * inside the bar (CSS sticky cannot: the bars are placed with a transform). Only a horizontal
   * scroll moves it.
   */
  const shiftedAt = React.useRef<number | null>(null);
  const shiftLabels = (force = false) => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const hidden = direction() === 1 ? viewport.scrollLeft : 0;
    if (!force && shiftedAt.current === hidden) return;
    shiftedAt.current = hidden;
    const px = dayPx();
    const pad = textCache.current.pad ?? 0;
    for (const node of cellNodes.current.values()) {
      if (node.dataset.ganttBar === undefined) continue;
      let shift = 0;
      if (node.dataset.label === "inside" && hidden > 0) {
        const text = node.querySelector("[data-gantt-label]")?.textContent ?? "";
        const width = textCache.current.widths.get(text) ?? 0;
        const room = Number(node.dataset.span) * px - 2 * pad - width;
        shift = Math.min(Math.max(hidden - Number(node.dataset.x) * px, 0), Math.max(room, 0));
      }
      const value = shift > 0 ? `${shift}px` : "";
      if (node.style.getPropertyValue("--label-shift") !== value) {
        if (value) node.style.setProperty("--label-shift", value);
        else node.style.removeProperty("--label-shift");
      }
    }
  };

  const edges = useEdgeOverflow(scrollRef, "horizontal");

  // ─── Region state ───
  const bodyState = model.length > 0 ? "rows" : loading ? "loading" : "empty";
  // A new zoom fades the grid in place: laid over, the old grid would show other dates at the
  // scroll offset of the new one.
  const scaleSwap = useSwapIn(scale);
  const fillHeight = scrollHeight === "fill";
  const hasAvatar = renderRowAvatar !== undefined;

  const changeScale = (next: string) => {
    if (!SCALES.includes(next as GanttScale)) return;
    rememberCenter();
    setScale(next as GanttScale);
  };
  // Stable toolbar callbacks: the toolbar does not re-render while the chart scrolls.
  const toolbarLatest = React.useRef({ changeScale, today: () => {} });
  toolbarLatest.current = {
    changeScale,
    today: () => scrollToDay(todayX + 0.5, 1 / 3, true),
  };
  const toolbarActions = React.useMemo(
    () => ({
      today: () => toolbarLatest.current.today(),
      scale: (next: string) => toolbarLatest.current.changeScale(next),
    }),
    [],
  );

  const gridStyle = {
    "--gantt-days": totalDays,
    "--gantt-week-offset": weekOffset(range),
  } as React.CSSProperties;

  // Period boundaries (and every month at the month zoom) are lines; days and weeks are a pattern.
  const lineCells = tiers.bottom.filter(
    (cell) => (scale === "month" || cell.boundary) && inWindow(cell.x, 0),
  );
  const backdrop = (
    <>
      <div className={styles.backdropWash} aria-hidden="true" />
      <div className={styles.backdropLines} aria-hidden="true">
        {lineCells.map((cell) => (
          <span
            key={`line-${cell.key}`}
            className={styles.gridLine}
            style={{ "--x": cell.x } as React.CSSProperties}
            {...toDataAttributes({ boundary: cell.boundary })}
          />
        ))}
        {todayInRange ? (
          <span
            className={styles.todayLine}
            style={{ "--x": todayX + 0.5 } as React.CSSProperties}
          />
        ) : null}
      </div>
    </>
  );

  /*
   * The timeline viewport: the scroller without the sticky header and label column. Bar tooltips
   * point at the visible part of their bar and stay inside it, never over the labels or the head.
   */
  const timelineRect = React.useCallback(() => {
    const viewport = scrollRef.current;
    if (!viewport) return null;
    const view = viewport.getBoundingClientRect();
    return {
      left: view.left + labelWidth(),
      top: view.top + (headRef.current?.getBoundingClientRect().height ?? 0),
      right: view.left + viewport.clientWidth,
      bottom: view.top + viewport.clientHeight,
    };
  }, [labelWidth]);
  const timelineRectRef = React.useRef(timelineRect);
  timelineRectRef.current = timelineRect;
  const anchorToVisible = React.useCallback<AnchorRectResolver>((_anchor, rect) => {
    const viewport = timelineRectRef.current();
    return (viewport && visibleSegment(rect, viewport)) || rect;
  }, []);
  const timelineBoundary = React.useCallback<FloatingBoundaryResolver>(
    () => timelineRectRef.current(),
    [],
  );

  /*
   * Stable callbacks for the rows (one object for the chart's life): each reads the latest render
   * through `latest`, so a memoized row never acts on stale state.
   */
  const latest = React.useRef({
    trackHandlers,
    focusCell: setActiveId as (id: string) => void,
    model,
    onItemOpen,
    onRowClick,
    commit,
    nameFor,
    labels,
  });
  latest.current = {
    trackHandlers,
    focusCell: setActiveId,
    model,
    onItemOpen,
    onRowClick,
    commit,
    nameFor,
    labels,
  };
  const cellRefs = React.useRef(new Map<string, React.RefCallback<HTMLElement>>());
  const rowContext = React.useMemo<GanttRowContext>(
    () => ({
      register: (id) => {
        let ref = cellRefs.current.get(id);
        if (!ref) {
          // A cell of a leaving body (RegionSwap) unregisters only itself, never its successor.
          ref = (node) => {
            if (!node) return;
            cellNodes.current.set(id, node);
            return () => {
              if (cellNodes.current.get(id) === node) cellNodes.current.delete(id);
            };
          };
          cellRefs.current.set(id, ref);
        }
        return ref;
      },
      focus: (id) => latest.current.focusCell(id),
      open: (barId, rowIndex) => {
        const item = latest.current.model[rowIndex];
        const bar = item?.bars.find((candidate) => candidate.id === barId);
        if (item && bar) latest.current.onItemOpen?.(bar, item.row);
      },
      openRow: (rowIndex, event) => {
        const item = latest.current.model[rowIndex];
        if (item) latest.current.onRowClick?.(item.row, event);
      },
      commit: (barId, rowIndex, dates) => {
        const item = latest.current.model[rowIndex];
        const bar = item?.bars.find((candidate) => candidate.id === barId);
        if (item && bar) latest.current.commit(bar, item.row, dates, false);
      },
      nameFor: (bar, dates) => latest.current.nameFor(bar, dates),
      formatDuration: (days) => formatLabel(latest.current.labels.duration, { days }),
      track: (event, rowIndex, native) => {
        const item = latest.current.model[rowIndex];
        if (!item) return;
        const handlers = latest.current.trackHandlers(item) as Partial<
          Record<string, (event: React.SyntheticEvent) => void>
        >;
        handlers[`on${event[0].toUpperCase()}${event.slice(1)}`]?.(native);
      },
      registerTip,
      canShowTip: (id) => {
        const node = cellNodes.current.get(id);
        const viewport = timelineRectRef.current();
        if (!node || !viewport) return false;
        const visible = visibleSegment(node.getBoundingClientRect(), viewport);
        return visible !== null && visible.width >= readCssLengthPx("--prime-space-6", 24);
      },
      onDragChange,
      dayPx: () => dayPxRef.current(),
      direction: () => directionRef.current(),
      scrollLeft,
      autoScroll,
    }),
    [registerTip, onDragChange, scrollLeft, autoScroll],
  );

  let body: React.ReactNode;
  if (bodyState === "loading") {
    const unit = unitDays(scale);
    const origin = todayInRange ? todayX : 0;
    body = SKELETON_ROWS.map((bars, index) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
      <div key={index} className={styles.row} style={{ "--lanes": 1 } as React.CSSProperties}>
        <div className={styles.rowHeader}>
          {hasAvatar ? (
            <span className={styles.rowAvatar}>
              <Skeleton shape="circle" />
            </span>
          ) : null}
          <span className={styles.rowLabel}>
            <Skeleton className={styles.skeletonLabel} />
          </span>
        </div>
        <div className={styles.track}>
          {bars.map(([offset, length]) => (
            <Skeleton
              key={offset}
              shape="block"
              className={styles.skeletonBar}
              style={
                {
                  "--x": Math.max(0, origin + offset * unit),
                  "--span": length * unit,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    ));
  } else if (bodyState === "empty") {
    body = (
      <div role="row" className={styles.emptyRow}>
        <div role="gridcell" aria-colspan={2} className={styles.emptyCell}>
          {empty == null || typeof empty === "string" ? (
            <EmptyPage.Root layout="compact" size={size} role="status">
              <EmptyPage.Description>{empty ?? labels.empty}</EmptyPage.Description>
            </EmptyPage.Root>
          ) : (
            empty
          )}
        </div>
      </div>
    );
  } else {
    body = virtual.rows.map(({ index, start }) => {
      const item = model[index];
      const { lanes, count, ghostLane } = lanesOf(item);
      const hover = hoverCell?.row === item.key ? hoverCell : null;
      return (
        <GanttRow
          key={item.key}
          ctx={rowContext}
          index={index}
          rowKey={item.key}
          navId={rowNavId(item.key)}
          label={item.label}
          bars={item.bars}
          lanes={lanes}
          laneCount={count}
          top={start}
          measureRef={virtual.measure(index)}
          row={item.row}
          renderRow={renderRow as ((row: unknown) => React.ReactNode) | undefined}
          renderRowAvatar={renderRowAvatar as ((row: unknown) => React.ReactNode) | undefined}
          renderBarTooltip={
            renderBarTooltip as ((bar: GanttBar, row: unknown) => React.ReactNode) | undefined
          }
          href={getRowHref?.(item.row)}
          clickable={onRowClick !== undefined}
          ghost={ghosts.get(item.key)}
          ghostLane={ghostLane}
          hover={hover}
          tabStop={tabStop && navIndex.get(tabStop)?.row === index ? tabStop : null}
          pending={pending}
          dragging={dragging}
          windowFrom={timeWindow ? timeWindow[0] : 1}
          windowTo={timeWindow ? timeWindow[1] : 0}
          scale={scale}
          rangeStart={range.start.getTime()}
          locale={locale}
          newBarLabel={labels.newBar}
          editableAtAll={editableAtAll}
          creatable={creatable}
          hintId={hintId}
          endHintId={endHintId}
          createHintId={createHintId}
        />
      );
    });
  }

  // Header cells outside the time window are not rendered; a period label keeps its whole span.
  const topCells = tiers.top.filter((cell) => inWindow(cell.x, cell.span));
  const bottomCells = tiers.bottom.filter((cell) => inWindow(cell.x, cell.span));

  return (
    <SurfaceDepthProvider value={depth}>
      {tier.provide(
        <div
          {...rest}
          ref={mergedRootRef}
          className={cx(fieldTierClass, styles.root, className)}
          style={style}
          data-depth={depth}
          {...toDataAttributes({
            size,
            scale,
            avatar: hasAvatar || undefined,
            loading: loading || undefined,
            "read-only": readOnly || undefined,
            "overflow-start": edges.start || undefined,
            "overflow-end": edges.end || undefined,
            "scroll-height": fillHeight ? "fill" : undefined,
          })}
        >
          <GanttToolbar
            toolbar={toolbar}
            labels={labels}
            scale={scale}
            todayInRange={todayInRange}
            onToday={toolbarActions.today}
            onScale={toolbarActions.scale}
          />

          <div className={styles.frame}>
            <ScrollContainer
              ref={scrollRef}
              axis="both"
              edges="none"
              className={styles.viewport}
              style={
                typeof scrollHeight === "number" ? { maxHeight: `${scrollHeight}px` } : undefined
              }
              onScroll={() => {
                rememberCenter();
                updateTimeWindow();
                shiftLabels();
                closeTips(revealing.current);
                revealing.current = false;
              }}
              onWheel={() => closeTips(false)}
              onTouchMove={() => closeTips(false)}
            >
              <AnchorRectProvider value={anchorToVisible}>
                <FloatingBoundaryProvider value={timelineBoundary}>
                  <Tooltip.Provider>
                    <div
                      key={scaleSwap.key}
                      role="grid"
                      aria-label={ariaLabel}
                      aria-labelledby={ariaLabelledBy}
                      aria-rowcount={bodyState === "rows" ? model.length + 1 : undefined}
                      aria-busy={loading || pending.size > 0 || undefined}
                      className={cx(styles.grid, scaleSwap.className)}
                      style={gridStyle}
                      onKeyDown={onGridKeyDown}
                    >
                      <div
                        ref={headRef}
                        role="row"
                        aria-rowindex={1}
                        className={cx(styles.head, stickySurfaceClass)}
                      >
                        <div
                          ref={cornerRef}
                          role="columnheader"
                          // With avatars a narrow chart shows no column text: the name stays.
                          aria-label={hasAvatar ? labels.rowsHeader : undefined}
                          className={styles.corner}
                        >
                          <span className={styles.cornerText}>{labels.rowsHeader}</span>
                        </div>
                        <div
                          ref={axisRef}
                          role="columnheader"
                          aria-label={labels.timeline}
                          className={styles.axis}
                        >
                          <div className={styles.tier} aria-hidden="true">
                            {topCells.map((cell) => (
                              <span
                                key={cell.key}
                                className={styles.tierCell}
                                style={
                                  { "--x": cell.x, "--span": cell.span } as React.CSSProperties
                                }
                              >
                                <span className={styles.tierText}>{cell.text}</span>
                              </span>
                            ))}
                          </div>
                          <div className={styles.tier} data-tier="bottom" aria-hidden="true">
                            {bottomCells.map((cell) => (
                              <span
                                key={cell.key}
                                className={styles.tierCell}
                                style={
                                  { "--x": cell.x, "--span": cell.span } as React.CSSProperties
                                }
                                {...toDataAttributes({
                                  weekend: cell.weekend,
                                  today: cell.today,
                                  boundary: cell.boundary,
                                })}
                              >
                                <span className={styles.tierText}>{cell.text}</span>
                              </span>
                            ))}
                          </div>
                          {todayInRange ? (
                            <span
                              className={styles.todayMark}
                              style={{ "--x": todayX + 0.5 } as React.CSSProperties}
                              aria-hidden="true"
                            >
                              <span className={styles.todayChip}>{labels.today}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <RegionSwap state={bodyState}>
                        <div
                          role="rowgroup"
                          className={styles.body}
                          data-state={bodyState}
                          aria-hidden={bodyState === "loading" || undefined}
                          style={
                            bodyState === "rows"
                              ? ({
                                  "--rows-height": `${virtual.totalSize}px`,
                                } as React.CSSProperties)
                              : undefined
                          }
                        >
                          {bodyState === "empty" ? null : backdrop}
                          {body}
                        </div>
                      </RegionSwap>
                    </div>
                  </Tooltip.Provider>
                </FloatingBoundaryProvider>
              </AnchorRectProvider>
            </ScrollContainer>
          </div>

          {editableAtAll ? (
            <>
              <VisuallyHidden id={hintId}>{labels.editHint}</VisuallyHidden>
              <VisuallyHidden id={endHintId}>{labels.editEndHint}</VisuallyHidden>
            </>
          ) : null}
          {creatable ? (
            <VisuallyHidden id={createHintId}>{labels.createHint}</VisuallyHidden>
          ) : null}
          {bodyState === "loading" ? (
            <VisuallyHidden live="polite">{labels.loading}</VisuallyHidden>
          ) : null}
          <VisuallyHidden live="polite">{announcement}</VisuallyHidden>
        </div>,
      )}
    </SurfaceDepthProvider>
  );
}

type GanttToolbarProps = {
  toolbar: React.ReactNode;
  labels: GanttLabels;
  scale: GanttScale;
  todayInRange: boolean;
  onToday: () => void;
  onScale: (scale: string) => void;
};

/**
 * The chart's toolbar: your content, «Сегодня» and the zoom on the one tool row (`ToolRow`, as the
 * DataTable `toolbar`) — your content takes the free room, the zoom fills a short line. Memoized:
 * scrolling skips it.
 */
const GanttToolbar = React.memo(function GanttToolbar({
  toolbar,
  labels,
  scale,
  todayInRange,
  onToday,
  onScale,
}: GanttToolbarProps) {
  return (
    <ToolRow className={styles.toolbar}>
      {toolbar != null && toolbar !== false ? <ToolGroup>{toolbar}</ToolGroup> : null}
      <Button.Root variant="soft" tone="neutral" disabled={!todayInRange} onClick={onToday}>
        {labels.today}
      </Button.Root>
      <SegmentedControl.Root aria-label={labels.scale} value={scale} onValueChange={onScale}>
        {SCALES.map((value) => (
          <SegmentedControl.Item key={value} value={value}>
            {labels[value]}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
    </ToolRow>
  );
});
