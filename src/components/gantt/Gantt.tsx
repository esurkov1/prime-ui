// biome-ignore-all lint/a11y/useSemanticElements: an ARIA grid of divs — table elements would lose their semantics under the flex layout the time layers need
// biome-ignore-all lint/a11y/useFocusableInteractive: grid rows and cells are not focus stops; the row headers and bars inside them are (one roving tab stop)
import { addDays, format, type Locale, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import * as React from "react";
import { flushSync } from "react-dom";

import { Badge } from "@/components/badge/Badge";
import { Button } from "@/components/button/Button";
import { EmptyPage } from "@/components/empty-page/EmptyPage";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { Select } from "@/components/select/Select";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { VisuallyHidden } from "@/components/visually-hidden/VisuallyHidden";
import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { useVirtualRows } from "@/hooks/useVirtualRows";
import { Icon } from "@/icons";
import {
  AnchorRectProvider,
  type AnchorRectResolver,
  FloatingBoundaryProvider,
  type FloatingBoundaryResolver,
} from "@/internal/AnchorRectContext";
import { useControlSize, useHostTier } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { createEdgeAutoScroll } from "@/internal/edgeAutoScroll";
import enterMotion from "@/internal/enterMotion.module.css";
import { fieldTierClass } from "@/internal/fieldClasses";
import { formatLabel } from "@/internal/formatLabel";
import { useLabels } from "@/internal/labels";
import { type ListPresence, useListItemPresence, useListPresence } from "@/internal/listPresence";
import { DRAG_THRESHOLD_PX, useLongPress } from "@/internal/longPress";
import { exitTimeoutMs, type MotionDurationToken, motionDurationMs } from "@/internal/motionTiming";
import { focusFromKeyboard } from "@/internal/overlay/focus";
import { usePartPresence } from "@/internal/partPresence";
import { RegionSwap } from "@/internal/RegionSwap";
import { type ControlSize, stepDown } from "@/internal/states";
import { stickySurfaceClass } from "@/internal/sticky";
import { SurfaceDepthProvider, useNestedSurfaceDepth } from "@/internal/surfaceDepth";
import swapMotion from "@/internal/swapMotion.module.css";
import { ToolGroup, ToolRow } from "@/internal/ToolRow";
import { isPromiseLike } from "@/internal/usePendingChanges";

import styles from "./Gantt.module.css";
import { GanttRow, type GanttRowContext, type GanttGhost as Ghost } from "./GanttRow";
import {
  applyEdit,
  assignLanes,
  barEdit,
  DAY_STEP,
  daysBetween,
  formatDay,
  type GanttBar,
  type GanttCategory,
  type GanttDates,
  type GanttEdit,
  type GanttNavItem,
  type GanttZoom,
  type GanttZoomPreset,
  isMilestone,
  navigate,
  resolveRange,
  sameDates,
  snapHysteresis,
  stepDays,
  stepShift,
  stepStart,
  stickyFloor,
  type TimeStep,
  visibleSegment,
} from "./ganttModel";
import {
  clampView,
  clampZoom,
  glideView,
  leavesScene,
  panBy,
  panTo,
  presetNear,
  type SceneKind,
  sceneFor,
  snapStart,
  type TimeBounds,
  type TimeScene,
  type TimeView,
  toPx,
  zoomAt,
  zoomTo,
} from "./timeCore";
import { KEY_ZOOM_STEP, type TimeSurface, useTimeGestures } from "./timeGesture";
import {
  type HeadLabel,
  type HeadPlaced,
  type HeadStep,
  type HeadStepId,
  headLabels,
  headStep,
  headStepOf,
  type MeasureText,
  occlusion,
  placeLabels,
  stepSamples,
  stickyBoundary,
  todayPill,
} from "./timeHead";
import { type GridLine, gridLines, gridStep, weekendBands, weekendsShown } from "./timeLadder";
import { createTimeSlide } from "./timeSlide";

export type {
  GanttBar,
  GanttCategory,
  GanttDates,
  GanttZoom,
  GanttZoomPreset,
} from "./ganttModel";

const PRESETS: readonly GanttZoomPreset[] = ["day", "week", "month"];

/** What opened a row: a click on its header, or Enter / Space on the focused header. */
export type GanttRowClickEvent = React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;

/** System strings; `{label}`, `{start}`, `{end}`, `{date}`, `{progress}` are replaced. */
export type GanttLabels = {
  /** Accessible name of the first column (the zoom selector stands in its head). */
  rowsHeader: string;
  /** Accessible name of the time axis column. */
  timeline: string;
  /** Accessible name of the zoom selector. */
  zoom: string;
  /** Zoom presets. */
  day: string;
  week: string;
  month: string;
  /** The selector's text for a zoom between the presets (a pinch, the wheel, a key). */
  customZoom: string;
  /** Announced when a gesture or a key changes the zoom; `{zoom}` is the selector's text. */
  zoomChanged: string;
  /** Text of the button that brings today back into view. */
  today: string;
  /** Accessible name of that button. */
  toToday: string;
  /** Description of the time axis: today's date, spoken; `{date}` is replaced. */
  todayIs: string;
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
  /** Accessible name of the legend of `categories`. */
  legend: string;
};

export const GANTT_LABELS: GanttLabels = {
  rowsHeader: "Название",
  timeline: "Шкала времени",
  zoom: "Масштаб",
  day: "День",
  week: "Неделя",
  month: "Месяц",
  customZoom: "Свой",
  zoomChanged: "Масштаб: {zoom}",
  today: "Сегодня",
  toToday: "К сегодня",
  todayIs: "Сегодня, {date}",
  bar: "{label}: {start} — {end}",
  milestone: "{label}: {date}",
  progress: "выполнено {progress}%",
  editHint:
    "Shift + стрелки сдвигают на день, Ctrl + Shift + стрелки меняют окончание на день; с Alt — по линиям сетки",
  editEndHint: "Ctrl + Shift + стрелки меняют окончание на день; с Alt — по линиям сетки",
  duration: "{days} дн.",
  changeFailed: "Сроки не изменены: {label}",
  newBar: "Новая задача",
  createHint: "N — создать задачу",
  createFailed: "Задача не создана",
  loading: "Загрузка графика…",
  empty: "Нет задач за этот период.",
  legend: "Обозначения",
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
  categories?: readonly GanttCategory[];
  hiddenCategories?: readonly string[];
  zoom?: GanttZoom;
  defaultZoom?: GanttZoom;
  onZoomChange?: (zoom: GanttZoom) => void;
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
const FALLBACK_GEOMETRY = { padY: 8, barH: 28, laneGap: 4, border: 1, labelGap: 8, step: 4 };
/** The zoom's presets and its top stop, px a day, before the stylesheet can be read: the `m` tier. */
const FALLBACK_STEPS: ZoomSteps = { day: 40, week: 16, month: 4, max: 96 };
/** The head's label size at the `m` tier, px: the ladder's label room is measured against it. */
const M_LABEL_PX = 13;
/** A slide this still has come to rest: it is moved onto a whole device pixel. */
const PAN_REST_MS = 120;

type ZoomSteps = Readonly<Record<GanttZoomPreset | "max", number>>;

const NO_IDS: readonly string[] = [];

const ROW_PREFIX = "\u0000row:";
const PHANTOM_ID = "\u0000phantom";
const rowNavId = (key: React.Key) => `${ROW_PREFIX}${String(key)}`;

const devicePixelRatio = () =>
  typeof window === "undefined" ? 1 : Math.max(1, window.devicePixelRatio || 1);

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase() + text.slice(1);

/**
 * Today's date on its pill in the head, as much as the labels around it leave unsaid: the day's
 * number among the numbers of the day steps («21», the month is named at the start edge); «21 окт»
 * among the names of months; the year too only from the quarter step on with years in view.
 */
function formatTodayPill(today: Date, locale: Locale, step: HeadStep, years: boolean): string {
  if (step.family === "day") return format(today, "d");
  const month = format(today, "LLLL", { locale }).slice(0, 3).toLocaleLowerCase();
  const withYear = years && !(step.family === "month" && step.every === 1);
  return `${format(today, "d")} ${month}${withYear ? ` ${format(today, "yyyy")}` : ""}`;
}

/** The eased progress of a glide: decelerating, as every settle of the kit. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

type RowModel<Row, Bar> = {
  row: Row;
  key: React.Key;
  label: string;
  /** The bars drawn: those of a hidden category left out. */
  bars: Bar[];
  /** Every bar of the row: the time axis spans them all, so hiding a category never moves it. */
  allBars: Bar[];
  lanes: Map<string, number>;
  laneCount: number;
};

/**
 * A resource or project schedule: rows with bars on a time axis, under one head row — the zoom
 * selector, then the dates. Zoom and pan run on one time camera (`timeCore`): the dates, the grid
 * and the bars are laid out from it and slid together by one transform. Bars select, move and
 * resize by pointer and keyboard through an async `onBarChange`, and are drawn on empty space
 * through `onBarCreate`. Rows and time are virtualized: thousands of rows over years stay fast.
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
  categories,
  hiddenCategories = NO_IDS,
  zoom: zoomProp,
  defaultZoom = "week",
  onZoomChange,
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
  const todayId = React.useId();

  // Keyed by the day value: a new Date object for the same day keeps the axis.
  const todayTime = todayProp?.getTime();
  const today = React.useMemo(
    () => startOfDay(todayTime === undefined ? new Date() : new Date(todayTime)),
    [todayTime],
  );

  const [zoomValue, setZoom] = useControllableState<GanttZoom>({
    value: zoomProp,
    defaultValue: defaultZoom,
    onChange: onZoomChange,
  });

  // ─── Data ───
  // Keyed by content: a new array with the same ids keeps the model.
  const hiddenKey = hiddenCategories.join("\u0000");
  // Internal re-renders (a zoom, hover) keep the props, so the model is computed once per data.
  const model = React.useMemo<RowModel<Row, Bar>[]>(() => {
    const hidden = new Set(hiddenKey ? hiddenKey.split("\u0000") : []);
    return rows.map((row) => {
      const allBars = getRowBars(row);
      const bars =
        hidden.size === 0
          ? allBars
          : allBars.filter((bar) => bar.category === undefined || !hidden.has(bar.category));
      const { lanes, count } = assignLanes(bars);
      return {
        row,
        key: getRowKey(row),
        label: getRowLabel(row),
        bars,
        allBars,
        lanes,
        laneCount: count,
      };
    });
  }, [rows, getRowBars, getRowKey, getRowLabel, hiddenKey]);
  const categoryColors = React.useMemo(
    () => new Map((categories ?? []).map((category) => [category.id, category.color])),
    [categories],
  );
  const legendCategories = React.useMemo(() => {
    if (!categories) return null;
    const hidden = new Set(hiddenKey ? hiddenKey.split("\u0000") : []);
    return categories.filter((category) => !hidden.has(category.id));
  }, [categories, hiddenKey]);
  const barsKey = React.useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const item of model) {
      for (const bar of item.allBars) {
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
      rangeStartTime === undefined || rangeEndTime === undefined
        ? undefined
        : { start: new Date(rangeStartTime), end: new Date(rangeEndTime) },
    );
  }, [barsKey, today, rangeStartTime, rangeEndTime]);
  const totalDays = daysBetween(range.start, range.end);
  const todayX = daysBetween(range.start, today);
  const todayInRange = todayX >= 0 && todayX < totalDays;

  // ─── The stylesheet's numbers: the tier's presets, row geometry, the head's text size ───
  const [steps, setSteps] = React.useState<ZoomSteps>(FALLBACK_STEPS);
  const [geometry, setGeometry] = React.useState(FALLBACK_GEOMETRY);
  const [labelScale, setLabelScale] = React.useState(1);
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
      labelGap: readCssLengthPx("--prime-space-2", FALLBACK_GEOMETRY.labelGap, root),
      step: readCssLengthPx("--prime-space-1", FALLBACK_GEOMETRY.step, root),
    };
    setGeometry((prev) =>
      prev.padY === next.padY &&
      prev.barH === next.barH &&
      prev.laneGap === next.laneGap &&
      prev.border === next.border &&
      prev.labelGap === next.labelGap &&
      prev.step === next.step
        ? prev
        : next,
    );
    const zoomSteps: ZoomSteps = {
      day: readCssLengthPx("--gantt-day-day", FALLBACK_STEPS.day, root),
      week: readCssLengthPx("--gantt-day-week", FALLBACK_STEPS.week, root),
      month: readCssLengthPx("--gantt-day-month", FALLBACK_STEPS.month, root),
      max: readCssLengthPx("--gantt-day-max", FALLBACK_STEPS.max, root),
    };
    setSteps((prev) =>
      PRESETS.every((name) => prev[name] === zoomSteps[name]) && prev.max === zoomSteps.max
        ? prev
        : zoomSteps,
    );
    const font = Number.parseFloat(
      axisRef.current ? getComputedStyle(axisRef.current).fontSize : "",
    );
    const scale = font > 0 ? font / M_LABEL_PX : 1;
    setLabelScale((prev) => (prev === scale ? prev : scale));
  });

  // ─── Measurement: the visible axis and the scroller's height ───
  const [axisWidth, setAxisWidth] = React.useState(0);
  const [viewHeight, setViewHeight] = React.useState(0);
  const [compactCorner, setCompactCorner] = React.useState(false);
  const labelWidth = React.useCallback(
    () => cornerRef.current?.getBoundingClientRect().width ?? 0,
    [],
  );
  const [headHeight, setHeadHeight] = React.useState(0);
  /**
   * The direction: −1 in a right-to-left chart. Read once and again with every measurement, never
   * per frame: a style read in a zoom frame would force a style pass of the page.
   */
  const dirCache = React.useRef<1 | -1 | null>(null);
  // Read on mount, on a new tier and on a resize — never in a render or a zoom frame, where a layout
  // read forces a layout of the page.
  const measure = React.useCallback(() => {
    dirCache.current = null;
    const viewport = scrollRef.current;
    const width = viewport ? Math.max(0, viewport.clientWidth - labelWidth()) : 0;
    setAxisWidth((prev) => (prev === width ? prev : width));
    const height = viewport?.clientHeight ?? 0;
    setViewHeight((prev) => (prev === height ? prev : height));
    const head = headRef.current?.getBoundingClientRect().height ?? 0;
    setHeadHeight((prev) => (prev === head ? prev : head));
    // A column of avatars only has no room for the selector's text: its glyph stands for it.
    const compact = labelWidth() > 0 && labelWidth() < readCssLengthPx("--prime-space-24", 96);
    setCompactCorner((prev) => (prev === compact ? prev : compact));
  }, [labelWidth]);
  // Measured again on a new tier: it changes the head and the column.
  React.useLayoutEffect(() => {
    if (size) measure();
  }, [measure, size]);
  React.useEffect(() => {
    const viewport = scrollRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [measure]);
  const direction = React.useCallback((): 1 | -1 => {
    dirCache.current ??=
      rootRef.current && getComputedStyle(rootRef.current).direction === "rtl" ? -1 : 1;
    return dirCache.current;
  }, []);

  // ─── The camera (`timeCore`): the one source of truth of where the chart looks ───
  const bounds: TimeBounds = { days: totalDays, widthPx: axisWidth, maxDayPx: steps.max };
  const boundsRef = React.useRef(bounds);
  boundsRef.current = bounds;
  /** The zoom asked for, px a day: a preset of the tier or a number a gesture left. */
  const zoomTarget = typeof zoomValue === "number" ? zoomValue : steps[zoomValue];
  const zoomTargetRef = React.useRef(zoomTarget);
  zoomTargetRef.current = zoomTarget;
  const zoomValueRef = React.useRef(zoomValue);
  zoomValueRef.current = zoomValue;
  /** What the hand, a key or the owner asked for; drawn through the stops (`clampView`). */
  const intent = React.useRef<TimeView | null>(null);
  const shown = React.useCallback(
    (): TimeView =>
      clampView(intent.current ?? { dayPx: zoomTargetRef.current, start: 0 }, boundsRef.current),
    [],
  );
  const [scene, setScene] = React.useState<TimeScene>(() =>
    sceneFor({ dayPx: clampZoom(zoomTarget, bounds), start: 0 }, 0, "wide", totalDays, 1),
  );
  /** The scene on screen: what every pointer reading and the slide are measured against. */
  const sceneRef = React.useRef(scene);

  // What follows the view without a render: today's button, the edge cues, cut bar labels.
  const [todayEdge, setTodayEdge] = React.useState<"start" | "end" | null>(null);
  const followLatest = React.useRef((_start: number, _scene: TimeScene) => {});
  const [slide] = React.useState(() =>
    createTimeSlide((start, laid) => followLatest.current(start, laid)),
  );

  /** Lays the scene out again around the view as it stands: in this frame when `sync`. */
  const layout = (kind: SceneKind, sync: boolean) => {
    const { widthPx, days } = boundsRef.current;
    const next = sceneFor(shown(), widthPx, kind, days, devicePixelRatio());
    if (sync) flushSync(() => setScene(next));
    else setScene(next);
  };

  const panRest = React.useRef(0);
  /**
   * The camera moved: a pan is the slide's write alone; a new zoom, or a view near the edge of what
   * is laid out, lays the scene out again — in the same frame when `sync` (a gesture, a glide).
   * `rest`: the motion is over — the wide scene, around the view as it stands.
   */
  const moveTo = (next: TimeView, sync: boolean, rest = false) => {
    intent.current = next;
    const view = shown();
    const laid = sceneRef.current;
    if (view.dayPx !== laid.dayPx || (rest && laid.kind !== "wide")) {
      layout(rest ? "wide" : "window", sync);
    } else if (leavesScene(view.start, laid, boundsRef.current.widthPx)) {
      layout("wide", sync);
    } else {
      slide.move(view.start);
    }
    closeTips(false);
    window.clearTimeout(panRest.current);
    // At rest the view stands on a whole device pixel: the layers are drawn crisp.
    panRest.current = window.setTimeout(() => {
      const current = intent.current;
      if (!current || current !== next) return;
      const at = shown();
      if (at.start !== current.start) return;
      intent.current = { ...current, start: snapStart(at.start, sceneRef.current) };
      slide.move(shown().start);
    }, PAN_REST_MS);
  };
  React.useEffect(() => () => window.clearTimeout(panRest.current), []);

  // The scene React has just laid out reaches the screen with its slide, before paint.
  React.useLayoutEffect(() => {
    sceneRef.current = scene;
    slide.reframe(scene, shown().start, direction());
  }, [scene, slide, shown, direction]);

  // ─── Glides: a preset, a key, «Сегодня», a zoom coming to rest on a preset ───
  const glideRef = React.useRef<{ frame: number; final: TimeView } | null>(null);
  const stopGlide = () => {
    if (glideRef.current) cancelAnimationFrame(glideRef.current.frame);
    glideRef.current = null;
  };
  React.useEffect(
    () => () => {
      if (glideRef.current) cancelAnimationFrame(glideRef.current.frame);
    },
    [],
  );
  /**
   * Glides the camera to `final` (an intent: the stops apply as it is read) around the day
   * `anchorPx` from the start edge; at once under reduced motion. `sync`: the caller may lay out in
   * this frame (an event or a frame callback, never an effect).
   */
  const glideTo = (
    final: TimeView,
    anchorPx: number,
    token: MotionDurationToken,
    sync: boolean,
    done?: () => void,
  ) => {
    stopGlide();
    const from = shown();
    const to = clampView(final, boundsRef.current);
    const duration = prefersReducedMotion() ? 0 : motionDurationMs(token);
    if (duration <= 0 || typeof requestAnimationFrame !== "function") {
      moveTo(final, sync, true);
      done?.();
      return;
    }
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - started) / duration));
      if (t >= 1) {
        glideRef.current = null;
        moveTo(final, true, true);
        done?.();
        return;
      }
      moveTo(glideView(from, to, anchorPx, easeOut(t)), true);
      if (glideRef.current) glideRef.current.frame = requestAnimationFrame(step);
    };
    glideRef.current = { frame: requestAnimationFrame(step), final };
  };

  // ─── The first view, a new width or axis: the scene is laid out around the intent ───
  const placed = React.useRef(false);
  const laidRange = React.useRef(range.start.getTime());
  /** The width and the axis the scene stands on: a new one lays it out again. */
  const axisKey = `${axisWidth}:${totalDays}:${steps.max}:${range.start.getTime()}`;
  // The latest render's values, read when the axis changes (an effect event).
  const placeLatest = React.useRef(() => {});
  placeLatest.current = () => {
    const startTime = range.start.getTime();
    if (!placed.current) {
      // The first view: today a third into the axis. A chart with no width yet (a hidden tab, a
      // lazy panel) takes it when it gets one.
      const dayPx = clampZoom(zoomTarget, boundsRef.current);
      const anchor = todayInRange ? todayX + 0.5 : 0;
      intent.current = {
        dayPx: zoomTarget,
        start: axisWidth > 0 ? anchor - axisWidth / 3 / dayPx : 0,
      };
      placed.current = axisWidth > 0;
    } else if (laidRange.current !== startTime && intent.current) {
      // The axis grew at the start (rows arrived, a bar moved earlier): the view keeps its days.
      const grown = daysBetween(range.start, new Date(laidRange.current));
      intent.current = { ...intent.current, start: intent.current.start + grown };
    }
    laidRange.current = startTime;
    layout("wide", false);
  };
  React.useLayoutEffect(() => {
    if (axisKey) placeLatest.current();
  }, [axisKey]);

  // ─── The zoom asked for changed (a preset, a key, the owner): glide to it about the middle ───
  const zoomGesture = React.useRef<{ anchorPx: number } | null>(null);
  const zoomLatest = React.useRef((_target: number) => {});
  zoomLatest.current = (target: number) => {
    const zoomTarget = target;
    const current = intent.current;
    if (!current || zoomGesture.current) return;
    if (!placed.current) {
      intent.current = { ...current, dayPx: zoomTarget };
      layout("wide", false);
      return;
    }
    if (Math.abs(clampZoom(zoomTarget, boundsRef.current) - shown().dayPx) < 1e-9) return;
    // About the middle of the intent: a view the stops held (the whole axis fits) comes back to
    // the day the person chose once the zoom lets it.
    const middle = boundsRef.current.widthPx / 2;
    const base = glideRef.current?.final ?? current;
    glideTo(zoomTo(base, zoomTarget, middle), middle, "base", false);
  };
  React.useLayoutEffect(() => {
    zoomLatest.current(zoomTarget);
  }, [zoomTarget]);

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

  // ─── The ladder (`timeLadder`) and the head (`timeHead`) at the zoom on screen ───
  /** The head's texts as drawn, measured once per text and weight (`GanttHead`). */
  const headWidths = React.useRef(new Map<string, number>());
  const [, setWidthsMeasured] = React.useState(0);
  const onHeadMeasured = React.useCallback(() => setWidthsMeasured((count) => count + 1), []);
  const headFont = M_LABEL_PX * labelScale;
  /**
   * A label's room after its tick: the pill's own start padding, read from it, so today's text
   * stands where its plain label does and nothing moves when the pill takes it.
   */
  const [measuredPad, setHeadPad] = React.useState<number | null>(null);
  const headPad = measuredPad ?? geometry.step;
  const measureHead: MeasureText = (text, strong) =>
    headWidths.current.get(`${strong ? 1 : 0}${text}`) ??
    // A year not sampled: the figures are tabular, any year is as wide as the sampled one.
    (/^\d{4}$/.test(text) ? headWidths.current.get("12027") : undefined) ??
    text.length * headFont * (strong ? 0.62 : 0.56);
  const [headSteps, setHeadSteps] = React.useState<{
    current: HeadStepId;
    leaving: HeadStepId | null;
    swaps: number;
    /** The first frame is on screen: from now on a step change is a zoom's, and it fades. */
    painted: boolean;
  }>({ current: "7days", leaving: null, swaps: 0, painted: false });
  const headRoom = headPad + geometry.labelGap;
  const step = headStep(
    scene.dayPx,
    headSteps.painted ? headSteps.current : null,
    measureHead,
    headRoom,
    locale,
  );
  /** The grid's step: a day once days read as columns, else the head's step — the same ticks. */
  const lineStep = gridStep(scene.dayPx, step);
  /** Alt's coarse step: the head's own ticks, as the grid draws them. */
  const snap: TimeStep = step;
  /** The phantom of a new bar: one cell of the grid (a day whenever days are drawn). */
  const phantomUnit = lineStep;
  if (step.id !== headSteps.current) {
    // A step change cross-fades the labels; before the first frame, or under reduced motion, the
    // old ones go at once.
    const fade = headSteps.painted && !prefersReducedMotion();
    setHeadSteps((prev) => ({
      ...prev,
      current: step.id,
      leaving: fade ? prev.current : prev.leaving,
      swaps: fade ? prev.swaps + 1 : prev.swaps,
    }));
  }
  React.useEffect(() => {
    if (axisWidth <= 0 || typeof requestAnimationFrame !== "function") return;
    const frame = requestAnimationFrame(() =>
      setHeadSteps((prev) => (prev.painted ? prev : { ...prev, painted: true })),
    );
    return () => cancelAnimationFrame(frame);
  }, [axisWidth]);
  React.useEffect(() => {
    if (!headSteps.leaving) return;
    const id = window.setTimeout(
      () => setHeadSteps((prev) => ({ ...prev, leaving: null })),
      exitTimeoutMs("fast"),
    );
    return () => window.clearTimeout(id);
  }, [headSteps.leaving]);
  const leaveStep = React.useCallback(
    (id: HeadStepId) =>
      setHeadSteps((prev) => (prev.leaving === id ? { ...prev, leaving: null } : prev)),
    [],
  );
  /** The labels the current layer laid out, for the sticky boundary of every slide. */
  const headLaid = React.useRef<HeadLaid | null>(null);
  const stuck = React.useRef<HTMLElement | null>(null);
  /** The labels the stuck boundary has faded: given back their own fade once it moves on. */
  const faded = React.useRef(new Set<HTMLElement>());
  /** Today's pill on the head, and its width once measured. */
  const todayPillRef = React.useRef<HTMLSpanElement | null>(null);
  const todayPillWidth = React.useRef(0);
  /** The room «Сегодня» takes at the start edge, gliding as it comes and goes. */
  const headInset = React.useRef({ now: 0, frame: 0 });
  const insetLatest = React.useRef((_px: number) => {});
  insetLatest.current = (target: number) => {
    const state = headInset.current;
    if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(state.frame);
    const from = state.now;
    const write = () => followLatest.current(shown().start, sceneRef.current);
    const duration = prefersReducedMotion() ? 0 : motionDurationMs("fast");
    if (duration <= 0 || typeof requestAnimationFrame !== "function" || from === target) {
      state.now = target;
      write();
      return;
    }
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - started) / duration));
      state.now = from + (target - from) * easeOut(t);
      write();
      if (t < 1) state.frame = requestAnimationFrame(step);
    };
    state.frame = requestAnimationFrame(step);
  };
  /** «Сегодня» came or went at the start edge: the stickies glide to stand after it. */
  const setJumpInset = React.useCallback((px: number) => insetLatest.current(px), []);
  /**
   * Written with every slide: the boundary of the period at the start edge sticks there
   * (`stickyBoundary`), on the head's fill, pushed out by the next one; today's pill stands on the
   * today line, kept whole inside the axis (`todayPill`); the labels under either give way to them
   * by the room left (`occlusion`) — the pill over every label, the stuck boundary over the
   * ordinary ones — and take back their own fade once they move on.
   */
  const writeHead = (windowPx: number, laid: TimeScene, dir: 1 | -1) => {
    const head = headLaid.current;
    const gap = headPad;
    // The fade's room: two steps, so a quick zoom thins a label over a few frames.
    const fade = geometry.labelGap * 2;
    const inset = headInset.current.now;
    // Today's pill: one transform from its place on the line, kept inside the axis.
    const pill = todayPillRef.current;
    let pillBox: { x: number; width: number } | null = null;
    if (pill) {
      const line = toPx(todayX, laid);
      const width = todayPillWidth.current;
      const view = boundsRef.current.widthPx || laid.widthPx;
      const at = todayInRange ? todayPill(line, width, windowPx, view, inset, gap) : null;
      const transform = at ? `translate3d(${(at.x - line) * dir}px, 0, 0)` : "";
      if (pill.style.transform !== transform) pill.style.transform = transform;
      const shown = at ? "" : "0";
      if (pill.style.opacity !== shown) pill.style.opacity = shown;
      if (at) pillBox = { x: at.x, width };
    }
    const sticky = head
      ? stickyBoundary(head.labels, head.placed, windowPx + inset + gap, gap)
      : null;
    const node = sticky && head ? head.nodes.get(head.labels[sticky.index].key) : undefined;
    if (stuck.current && stuck.current !== node) {
      stuck.current.style.transform = "";
      delete stuck.current.dataset.stuck;
    }
    stuck.current = node ?? null;
    let stuckBox: { x: number; width: number } | null = null;
    if (node && sticky && head) {
      const transform = `translate3d(${(sticky.x - head.placed[sticky.index].x) * dir}px, 0, 0)`;
      if (node.style.transform !== transform) node.style.transform = transform;
      node.dataset.stuck = "";
      // Its number steps aside while stuck: it covers its name, and the edge before it.
      const name = head.labels[sticky.index].parts
        .filter((part) => part.role === "name")
        .reduce(
          (sum, part, at) => sum + measureHead(capitalize(part.text), part.strong) + (at ? gap : 0),
          0,
        );
      stuckBox = { x: windowPx, width: sticky.x + name - windowPx };
    }
    const near = new Set<HTMLElement>();
    head?.labels.forEach((label, index) => {
      const box = head.placed[index];
      const target = head.nodes.get(label.key);
      if (!target || target === node) return;
      // The pill takes today's label and only a neighbour it truly reaches: whole half a step clear.
      const shown = Math.min(
        pillBox ? occlusion(box, [pillBox], 0, gap / 2) : 1,
        stuckBox && !label.boundary ? occlusion(box, [stuckBox], gap, fade) : 1,
      );
      if (shown >= 1) return;
      const value = String(Math.round(box.opacity * shown * 1000) / 1000);
      if (target.style.opacity !== value) target.style.opacity = value;
      near.add(target);
    });
    // The stuck boundary gives way to the pill too.
    if (node && pillBox && stuckBox) {
      const shown = occlusion({ x: stuckBox.x, width: stuckBox.width }, [pillBox], gap, fade);
      const value = shown >= 1 ? "" : String(Math.round(shown * 1000) / 1000);
      if (node.style.opacity !== value) node.style.opacity = value;
    } else if (node && node.style.opacity !== "") node.style.opacity = "";
    for (const target of faded.current) {
      if (near.has(target)) continue;
      const index = head?.labels.findIndex((label) => head.nodes.get(label.key) === target) ?? -1;
      const base = index >= 0 && head ? head.placed[index].opacity : 1;
      target.style.opacity = base === 1 ? "" : String(base);
    }
    faded.current = near;
  };
  const lines = React.useMemo(
    () => gridLines(lineStep, scene.from, scene.to, range.start, totalDays),
    [lineStep, scene, range.start, totalDays],
  );
  const washing = weekendsShown(scene.dayPx);
  const weekends = React.useMemo(
    () => (washing ? weekendBands(scene.from, scene.to, range.start, totalDays) : []),
    [washing, scene, range.start, totalDays],
  );

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

  // ─── Pointer readings: the day under a pointer, as the scene on screen draws it ───
  /** The day under `clientX` in a track (days from the range start, fractional, unclamped). */
  const dayUnder = (track: HTMLElement, clientX: number) => {
    const rect = track.getBoundingClientRect();
    const offset = direction() === 1 ? clientX - rect.left : rect.right - clientX;
    const laid = sceneRef.current;
    return laid.origin + (offset - slide.shift()) / laid.dayPx;
  };
  /** The distance of `clientX` into the visible axis, px from its start edge. */
  const axisOffset = (clientX: number) => {
    const axis = axisRef.current;
    if (!axis) return 0;
    const rect = axis.getBoundingClientRect();
    return direction() === 1 ? clientX - rect.left : rect.right - clientX;
  };

  // A gesture on the time axis slides the chart near its edges; the start edge is the end of the
  // pinned column. One loop for every gesture: each names what it re-reads.
  const onAutoScrolled = React.useRef<() => void>(() => {});
  const panLatest = React.useRef<(dx: number) => boolean>(() => false);
  panLatest.current = (dx: number) => {
    if (!intent.current) return false;
    const before = shown().start;
    stopGlide();
    moveTo(panBy(shown(), dx * direction(), boundsRef.current), true);
    return shown().start !== before;
  };
  const [edgeScroll] = React.useState(() =>
    createEdgeAutoScroll({
      scrollers: [],
      axes: { x: true, y: false },
      insets: () => ({ inlineStart: labelWidth() }),
      panX: (dx) => panLatest.current(dx),
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

  /** Lanes of a row with its ghost: a bar being created takes the lane it will land in. */
  const lanesOf = (item: RowModel<Row, Bar>, ghost: Ghost | undefined) => {
    if (!ghost) return { lanes: item.lanes, count: item.laneCount, ghostLane: -1 };
    const { lanes, count } = assignLanes([
      ...item.bars,
      { id: ghost.id, label: "", ...ghost.dates },
    ]);
    return { lanes, count, ghostLane: lanes.get(ghost.id) ?? 0 };
  };

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

  // Bars dragged right now: kept rendered wherever the chart is slid.
  const [dragging, setDragging] = React.useState<ReadonlySet<string>>(new Set());
  const onDragChange = React.useCallback((id: string, isDragging: boolean) => {
    setDragging((prev) => {
      const next = new Set(prev);
      if (isDragging) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);
  /** Touch pointers a bar or a drawing holds: the chart does not slide under them. */
  const claimed = React.useRef(new Set<number>());
  const claimPointer = React.useCallback((pointerId: number, held: boolean) => {
    if (held) claimed.current.add(pointerId);
    else claimed.current.delete(pointerId);
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

  /** Brings a cell into view: rows by the chart's own scroller, time by the camera. */
  const revealCell = (node: HTMLElement) => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const margin = readCssLengthPx("--prime-space-4", 16);
    const view = viewport.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    const top = view.top + (headRef.current?.getBoundingClientRect().height ?? 0);
    if (node.dataset.ganttBar !== undefined && intent.current) {
      const left = view.left + labelWidth();
      const right = view.left + viewport.clientWidth;
      let dx = 0;
      if (rect.left < left + margin) dx = rect.left - (left + margin);
      else if (rect.right > right - margin && rect.width < right - left) {
        dx = rect.right - (right - margin);
      }
      if (dx !== 0) {
        stopGlide();
        moveTo(panBy(shown(), dx * direction(), boundsRef.current), false);
      }
    }
    if (rect.top < top) viewport.scrollTop -= top - rect.top + margin;
    else if (rect.bottom > view.bottom) viewport.scrollTop += rect.bottom - view.bottom + margin;
  };

  /*
   * Tooltips follow no scroll: any move of the chart (a slide, a zoom, the scrollbar, «Сегодня»)
   * closes them, and the next hover or focus opens one again. The only move a tooltip survives is
   * the reveal of the cell the keyboard just focused, and only while it is in view.
   */
  const openTips = React.useRef(new Map<string, () => void>());
  const revealing = React.useRef(false);
  const registerTip = React.useCallback((id: string, close: (() => void) | null) => {
    if (close) openTips.current.set(id, close);
    else openTips.current.delete(id);
  }, []);
  function closeTips(keepFocusedInView: boolean) {
    if (openTips.current.size === 0) return;
    const viewport = scrollRef.current;
    for (const [id, close] of openTips.current) {
      const node = cellNodes.current.get(id);
      if ((keepFocusedInView || revealing.current) && node && viewport) {
        if (node === document.activeElement) {
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
      }
      close();
    }
  }

  /** A cell the keyboard moves to: rendered on the next commit if virtualized away, then focused. */
  const focusTarget = React.useRef<string | null>(null);
  const focusNow = (id: string) => {
    const node = cellNodes.current.get(id);
    if (!node) return false;
    const viewport = scrollRef.current;
    const before = viewport ? viewport.scrollTop : 0;
    // Reveal first, then focus: the bar's focus tooltip opens where the bar now stands.
    revealing.current = true;
    revealCell(node);
    revealing.current = false;
    if (viewport && viewport.scrollTop !== before) revealing.current = true;
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

  /**
   * The one unit `N` creates — the phantom's, the finest the grid draws: after the focused bar, or
   * at today in a row header (else in view).
   */
  const keyboardSlot = (id: string) => {
    const nav = navIndex.get(id);
    const item = nav ? model[nav.row] : undefined;
    if (!item || !nav) return null;
    let start: Date;
    if (nav.kind === "bar") {
      const bar = item.bars.find((candidate) => candidate.id === id);
      if (!bar) return null;
      start = stepStart(shownDates(bar).end, phantomUnit);
      if (start < shownDates(bar).end) start = stepShift(start, 1, phantomUnit);
    } else {
      const first = Math.max(0, Math.ceil(shown().start));
      start = stepStart(todayInRange ? today : addDays(range.start, first), phantomUnit);
    }
    return { item, dates: { start, end: stepShift(start, 1, phantomUnit) } };
  };
  const createFromKeyboard = (id: string) => {
    const slot = keyboardSlot(id);
    if (slot) create(slot.item, slot.dates);
  };
  /** The row whose header has keyboard focus: its phantom shows where `N` creates. */
  const [keyboardRow, setKeyboardRow] = React.useState<string | null>(null);
  const onGridFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const id = target.closest<HTMLElement>("[data-nav-id]")?.dataset.navId;
    const header = creatable && id?.startsWith(ROW_PREFIX) && focusFromKeyboard(target);
    setKeyboardRow(header && id ? id : null);
  };

  /** A key zooms around the middle of the view: the zoom asked for, a step a press. */
  const zoomByKey = (factor: number) => {
    const target = clampZoom(zoomTargetRef.current * factor, boundsRef.current);
    const preset = presetNear(target, { day: steps.day, week: steps.week, month: steps.month });
    const next: GanttZoom = preset ?? target;
    if (Object.is(next, zoomValueRef.current)) return;
    setZoom(next);
    const text = typeof next === "string" ? labels[next] : labels.customZoom;
    setAnnouncement(formatLabel(labels.zoomChanged, { zoom: text }));
  };

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const id = (event.target as HTMLElement).closest<HTMLElement>("[data-nav-id]")?.dataset.navId;
    if (!id) return;
    const rtl = direction() === -1;
    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const forward = (event.key === "ArrowRight") !== rtl;
    const ctrl = event.ctrlKey || event.metaKey;
    // + and − zoom around the middle of the view, a step a press.
    if ((event.key === "+" || event.key === "=" || event.key === "-") && !ctrl && !event.altKey) {
      event.preventDefault();
      zoomByKey(event.key === "-" ? 1 / KEY_ZOOM_STEP : KEY_ZOOM_STEP);
      return;
    }
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
      // A day per press at every zoom; with Alt, a tick of the head's step (1, 8, 15… a month),
      // as a pointer with Alt lands on it.
      const edit: GanttEdit = ctrl ? "end" : "move";
      if (allowed === "none" || (allowed === "end" && edit !== "end")) return;
      const unit: TimeStep = event.altKey ? snap : DAY_STEP;
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
  /**
   * The cell of `unit` under the pointer in a track — by default the phantom's, one cell of the
   * grid (a day whenever days are drawn) — as its start (days from the range start) and length,
   * inside the axis.
   */
  const cellAt = (
    track: HTMLElement,
    clientX: number,
    unit: TimeStep = phantomUnit,
  ): { x: number; span: number } | null => {
    if (sceneRef.current.dayPx <= 0) return null;
    const day = Math.min(Math.max(Math.floor(dayUnder(track, clientX)), 0), totalDays - 1);
    const from = stepStart(addDays(range.start, day), unit);
    const start = Math.max(daysBetween(range.start, from), 0);
    const end = Math.min(daysBetween(range.start, stepShift(from, 1, unit)), totalDays);
    return { x: start, span: end - start };
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
  /** The day under the pointer in a track, fractional, inside the axis. */
  const dayAt = (track: HTMLElement, clientX: number): number | null => {
    if (sceneRef.current.dayPx <= 0) return null;
    return Math.min(Math.max(dayUnder(track, clientX), 0), totalDays - 0.001);
  };

  /**
   * Drawing a new bar, in whole days at every zoom: from the day pressed to the day under the
   * pointer, either way (held with sub-day hysteresis, so a few px a day never jitter). A press let
   * go where it began creates nothing. With Alt, whole cells of the grid's coarse step.
   */
  const drawing = React.useRef<{
    item: RowModel<Row, Bar>;
    track: HTMLElement;
    pointerId: number;
    x: number;
    clientX: number;
    alt: boolean;
    /** The day pressed. */
    anchor: number;
    /** The day the pointer stands on, held by the hysteresis. */
    edge: number | null;
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
    if (current.alt && !(snap.family === "day" && snap.every === 1)) {
      // Alt: whole cells of the grid's coarse step, from the pressed cell to the pointer's.
      const anchor = cellAt(current.track, current.x, snap);
      const cell = cellAt(current.track, current.clientX, snap);
      if (!anchor || !cell) return;
      start = Math.min(anchor.x, cell.x);
      end = Math.max(anchor.x + anchor.span, cell.x + cell.span);
      current.edge = null;
    } else {
      // Whole days from the pressed day to the pointer's, either way, held by the hysteresis.
      const day = stickyFloor(raw, current.edge, snapHysteresis(sceneRef.current.dayPx));
      current.edge = day;
      start = Math.min(current.anchor, day);
      end = Math.max(current.anchor, day) + 1;
    }
    setGhost(current.item.key, {
      id: current.id,
      dates: datesOf({ x: start, span: end - start }),
      status: "drawing",
    });
  };
  /** A ghost that leaves: it fades out (at once under reduced motion), then is gone. */
  const dropGhost = (key: React.Key, ghost: Ghost) => {
    setGhost(key, { ...ghost, status: "leaving" });
    window.setTimeout(
      () =>
        setGhosts((prev) => {
          if (prev.get(key)?.id !== ghost.id) return prev;
          const next = new Map(prev);
          next.delete(key);
          return next;
        }),
      prefersReducedMotion() ? 0 : exitTimeoutMs("fast"),
    );
  };
  const stopDrawing = (commitIt: boolean) => {
    const current = drawing.current;
    drawing.current = null;
    autoScroll.stop();
    if (current) claimPointer(current.pointerId, false);
    if (!current?.moved) return;
    const ghost = ghosts.get(current.item.key);
    if (!ghost || ghost.id !== current.id) return;
    // Escape or a cancelled pointer: nothing is created, the drawn bar fades out.
    if (commitIt) create(current.item, ghost.dates);
    else dropGhost(current.item.key, ghost);
  };

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

  /** Empty space of a track: the track itself or its time layer, never a bar or the ghost. */
  const onEmpty = (event: React.SyntheticEvent<HTMLElement>) =>
    event.target === event.currentTarget ||
    (event.target as HTMLElement).dataset?.ganttLayer !== undefined;

  const trackHandlers = (item: RowModel<Row, Bar>) =>
    creatable
      ? {
          onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
            if (!onEmpty(event) || event.button !== 0) return;
            if (ghosts.get(item.key)?.status === "pending") return;
            const cell = cellAt(event.currentTarget, event.clientX);
            if (!cell) return;
            const track = event.currentTarget;
            const anchor = Math.floor(dayAt(track, event.clientX) ?? 0);
            const start = (touch: boolean) => ({
              item,
              track,
              pointerId: event.pointerId,
              x: event.clientX,
              clientX: event.clientX,
              alt: event.altKey,
              anchor,
              edge: anchor,
              moved: touch,
              touch,
              id: `ghost-${++ghostSeq.current}`,
            });
            if (event.pointerType === "touch") {
              // A long press picks the cell up as the phantom: release creates it, a drag draws
              // days as a real bar.
              const pointerId = event.pointerId;
              pressStart.current = () => {
                const current = start(true);
                drawing.current = current;
                claimPointer(pointerId, true);
                track.setPointerCapture?.(pointerId);
                setGhost(item.key, { id: current.id, dates: datesOf(cell), status: "phantom" });
              };
              longPress.handlers.onPointerDown(event);
              return;
            }
            // A drawing is a gesture: no selection starts under it, nor beyond the track.
            event.preventDefault();
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
            if (event.pointerType !== "mouse" || !onEmpty(event)) {
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
            if (!onEmpty(event)) return;
            const cell = cellAt(event.currentTarget, event.clientX);
            if (cell) create(item, datesOf(cell));
          },
        }
      : {};

  /*
   * Label widths by text: measured once per text and tier, so a slide (bars mounting) reads no
   * layout. Reads come first and writes after, so a pass never forces a layout per bar.
   */
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
      // The label's margins are the bar's padding (`--gantt-bar-pad-x`): read once per tier.
      if (cache.pad === null) cache.pad = readCssLengthPx("--gantt-bar-pad-x", 8, node);
      bars.push({ node, width });
    }
    return bars;
  };

  /*
   * A label that does not fit its bar goes beside it, if the lane is free up to the next bar;
   * otherwise it stays inside, start-aligned as ever, and is cut at the bar's end under a short
   * fade (a milestone's hides). The tooltip and the name carry it whole. Measured: the text decides.
   */
  React.useLayoutEffect(() => {
    const gap = geometry.labelGap;
    const bars = measureBars();
    const pad = textCache.current.pad ?? 0;
    const edges = (node: HTMLElement) => ({
      left: Number(node.dataset.left),
      right: Number(node.dataset.right),
    });
    const lanes = new Map<string, HTMLElement[]>();
    for (const { node } of bars) {
      const key = `${node.closest<HTMLElement>("[data-row]")?.dataset.row}:${node.dataset.lane}`;
      const lane = lanes.get(key);
      if (lane) lane.push(node);
      else lanes.set(key, [node]);
    }
    const placement = new Map<HTMLElement, string>();
    // While a zoom moves, a bar keeps where its label stands (one already placed): the label is
    // chosen again at rest, so it never flips frame by frame.
    const moving = sceneRef.current.kind === "window";
    for (const { node, width } of bars) {
      if (moving && node.dataset.label) continue;
      const own = edges(node);
      const milestone = node.dataset.milestone !== undefined;
      if (!milestone && width + 2 * pad <= own.right - own.left) {
        placement.set(node, "inside");
        continue;
      }
      const key = `${node.closest<HTMLElement>("[data-row]")?.dataset.row}:${node.dataset.lane}`;
      let room = Number.POSITIVE_INFINITY;
      for (const other of lanes.get(key) ?? []) {
        const start = edges(other).left;
        if (other !== node && start > own.left) room = Math.min(room, start - own.right);
      }
      // Beside it only where the lane is free up to the next bar; else inside, cut at its end.
      const beside = width + gap <= room;
      placement.set(node, beside ? "outside" : milestone ? "hidden" : "clipped");
    }
    for (const [node, value] of placement) {
      if (node.dataset.label !== value) node.dataset.label = value;
    }
    followLatest.current(shown().start, sceneRef.current);
  });

  /*
   * What follows the view without a render, written with every slide: the label of a bar whose
   * start went under the pinned column slides along so the text stays readable inside the bar;
   * the edge cues; «Сегодня» at the edge where today went.
   */
  followLatest.current = (start: number, laid: TimeScene) => {
    const root = rootRef.current;
    const { widthPx, days } = boundsRef.current;
    const visible = widthPx > 0 ? widthPx / laid.dayPx : Number.POSITIVE_INFINITY;
    if (root) {
      const startCut = widthPx > 0 && start > 1e-6;
      const endCut = widthPx > 0 && start + visible < days - 1e-6;
      if ((root.dataset.overflowStart === "true") !== startCut) {
        if (startCut) root.dataset.overflowStart = "true";
        else delete root.dataset.overflowStart;
      }
      if ((root.dataset.overflowEnd === "true") !== endCut) {
        if (endCut) root.dataset.overflowEnd = "true";
        else delete root.dataset.overflowEnd;
      }
    }
    const at = todayX;
    const edge =
      !todayInRange || widthPx <= 0
        ? null
        : at < start
          ? "start"
          : at > start + visible
            ? "end"
            : null;
    setTodayEdge((prev) => (prev === edge ? prev : edge));
    // The start edge in the layers' px: a label slides only within its own bar.
    const window = (start - laid.origin) * laid.dayPx;
    const pad = textCache.current.pad ?? 0;
    const dir = direction();
    writeHead(window, laid, dir);
    for (const node of cellNodes.current.values()) {
      if (node.dataset.ganttBar === undefined) continue;
      let shift = 0;
      if (node.dataset.label === "inside" && widthPx > 0) {
        const left = Number(node.dataset.left);
        const text = node.querySelector("[data-gantt-label]")?.textContent ?? "";
        const width = textCache.current.widths.get(text) ?? 0;
        const room = Number(node.dataset.right) - left - 2 * pad - width;
        shift = Math.min(Math.max(window - left, 0), Math.max(room, 0));
      }
      const value = shift > 0 ? `${shift * dir}px` : "";
      if (node.style.getPropertyValue("--label-shift") !== value) {
        if (value) node.style.setProperty("--label-shift", value);
        else node.style.removeProperty("--label-shift");
      }
    }
  };

  // ─── Gestures (`timeGesture`) → the camera ───
  /** A zoom gesture came to rest: a preset within 8 % glides onto it; then it is committed. */
  const endZoom = () => {
    const gesture = zoomGesture.current;
    if (!gesture) return;
    const view = shown();
    const preset = presetNear(view.dayPx, { day: steps.day, week: steps.week, month: steps.month });
    const finish = () => {
      zoomGesture.current = null;
      const next: GanttZoom = preset ?? shown().dayPx;
      if (!Object.is(next, zoomValueRef.current)) {
        setZoom(next);
        const text = typeof next === "string" ? labels[next] : labels.customZoom;
        setAnnouncement(formatLabel(labels.zoomChanged, { zoom: text }));
      }
    };
    const target = preset ? clampZoom(steps[preset], boundsRef.current) : view.dayPx;
    if (target === view.dayPx) {
      moveTo(view, true, true);
      finish();
      return;
    }
    glideTo(zoomTo(view, target, gesture.anchorPx), gesture.anchorPx, "fast", true, finish);
  };
  const surface: TimeSurface = {
    zoom: (factor, clientX) => {
      if (!intent.current || shown().dayPx <= 0) return;
      stopGlide();
      const anchorPx = axisOffset(clientX);
      zoomGesture.current = { anchorPx };
      moveTo(zoomAt(shown(), factor, anchorPx, boundsRef.current), true);
    },
    pan: (deltaPx) => {
      if (!intent.current) return;
      stopGlide();
      moveTo(panBy(shown(), deltaPx, boundsRef.current), true);
    },
    settle: endZoom,
    claimed: (pointerId) =>
      claimed.current.has(pointerId) || drawing.current?.pointerId === pointerId,
    dir: direction,
  };
  useTimeGestures(scrollRef, surface, "[data-gantt-head]");

  // ─── Region state ───
  const bodyState = model.length > 0 ? "rows" : loading ? "loading" : "empty";
  const fillHeight = scrollHeight === "fill";
  const hasAvatar = renderRowAvatar !== undefined;

  /** A preset from the selector: the day in the middle of the view stays in the middle. */
  const choosePreset = (next: string) => {
    if (!PRESETS.includes(next as GanttZoomPreset) || zoomGesture.current) return;
    setZoom(next as GanttZoomPreset);
  };
  const jumpToToday = () => {
    if (!intent.current) return;
    const target = panTo(shown(), todayX + 0.5, 1 / 3, boundsRef.current);
    glideTo(target, 0, "base", true);
  };
  // Stable for the memoized head parts: the latest render's handlers, read at the press.
  const headLatest = React.useRef({ choosePreset, jumpToToday });
  headLatest.current = { choosePreset, jumpToToday };
  const choosePresetStable = React.useCallback(
    (next: string) => headLatest.current.choosePreset(next),
    [],
  );
  const jumpToTodayStable = React.useCallback(() => headLatest.current.jumpToToday(), []);

  const layerWidth = { width: `${scene.widthPx}px` };
  const backdrop = (
    <div className={styles.backdrop} aria-hidden="true">
      {/* The scene it is laid out in, readable: its origin day and the length of a day. */}
      <div
        ref={slide.layer}
        className={styles.layer}
        style={layerWidth}
        data-origin={scene.origin}
        data-day-px={scene.dayPx}
      >
        {weekends.length > 0 ? (
          <span className={styles.weekends}>
            {weekends.map((band) => {
              const left = toPx(band.day, scene);
              return (
                <span
                  key={band.key}
                  className={styles.weekend}
                  style={{
                    insetInlineStart: `${left}px`,
                    width: `${toPx(band.day + band.span, scene) - left}px`,
                  }}
                />
              );
            })}
          </span>
        ) : null}
        {lines.map((line) => (
          <span
            key={line.key}
            className={styles.gridLine}
            data-day={line.day}
            style={{ insetInlineStart: `${toPx(line.day, scene)}px` }}
          />
        ))}
      </div>
    </div>
  );
  // Today's line over the rows: their dividers and fills stand under it, never across it. Its own
  // layer in the backdrop's box, on the same slide.
  const overlay = todayInRange ? (
    <div className={cx(styles.backdrop, styles.overlay)} aria-hidden="true">
      <div ref={slide.layer} className={styles.layer} style={layerWidth}>
        <span
          className={styles.todayLine}
          style={{ insetInlineStart: `${toPx(todayX, scene)}px` }}
        />
      </div>
    </div>
  ) : null;

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
    categoryColors,
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
    categoryColors,
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
      layer: slide.layer,
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
      categoryColor: (bar) =>
        bar.category === undefined ? undefined : latest.current.categoryColors.get(bar.category),
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
      direction,
      viewStart: () => shown().start,
      claimPointer,
      autoScroll,
    }),
    [registerTip, onDragChange, direction, shown, claimPointer, autoScroll, slide],
  );

  /**
   * The phantom of a row: the bar a press would create, one unit of the zoom under the mouse, or
   * where `N` creates while the row header has keyboard focus. It is the ghost a drawing grows from.
   */
  const phantomOf = (item: RowModel<Row, Bar>): Ghost | undefined => {
    let dates: GanttDates | undefined;
    if (hoverCell?.row === item.key) dates = datesOf(hoverCell);
    else if (keyboardRow === rowNavId(item.key)) dates = keyboardSlot(keyboardRow)?.dates;
    return dates ? { id: PHANTOM_ID, dates, status: "phantom" } : undefined;
  };

  let body: React.ReactNode;
  if (bodyState === "loading") {
    const unit = stepDays(step);
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
          <div ref={slide.layer} className={styles.layer} style={layerWidth}>
            {bars.map(([offset, length]) => {
              const from = Math.max(0, origin + offset * unit);
              const left = toPx(from, scene);
              return (
                <Skeleton
                  key={offset}
                  shape="block"
                  className={styles.skeletonBar}
                  style={{
                    insetInlineStart: `${left}px`,
                    width: `${toPx(from + length * unit, scene) - left}px`,
                  }}
                />
              );
            })}
          </div>
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
      const drawn = ghosts.get(item.key);
      let ghost = drawn ?? phantomOf(item);
      let { lanes, count, ghostLane } = lanesOf(item, ghost);
      // A phantom never grows its row: where the unit has no free lane, it does not show.
      if (!drawn && ghost && count > item.laneCount) {
        ghost = undefined;
        ({ lanes, count, ghostLane } = lanesOf(item, undefined));
      }
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
          ghost={ghost}
          ghostLane={ghostLane}
          tabStop={tabStop && navIndex.get(tabStop)?.row === index ? tabStop : null}
          pending={pending}
          dragging={dragging}
          scene={scene}
          barH={geometry.barH}
          snap={snap}
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

  // Today's pill: the date, the year too when the view spans years.
  const viewNow = shown();
  const viewYears = new Set(
    [viewNow.start, viewNow.start + (axisWidth || scene.widthPx) / viewNow.dayPx].map((at) =>
      addDays(range.start, Math.floor(Math.min(Math.max(at, 0), totalDays - 1))).getFullYear(),
    ),
  );
  const todayText = formatTodayPill(today, locale, step, viewYears.size > 1);

  // The head: the current step, and while a step change cross-fades, the one it leaves.
  const headLayers = [
    ...(headSteps.leaving ? [{ step: headStepOf(headSteps.leaving), state: "out" as const }] : []),
    { step, state: headSteps.swaps > 0 ? ("in" as const) : ("still" as const) },
  ];

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
            step: step.id,
            avatar: hasAvatar || undefined,
            loading: loading || undefined,
            "read-only": readOnly || undefined,
            "scroll-height": fillHeight ? "fill" : undefined,
          })}
        >
          {(toolbar != null && toolbar !== false) || legendCategories ? (
            <GanttToolbar toolbar={toolbar} legend={legendCategories} labels={labels} />
          ) : null}

          {/* The chart always spans its host: hosts that size blocks by content stretch it. */}
          <div className={styles.frame} data-full-width="true">
            <ScrollContainer
              ref={scrollRef}
              edges="none"
              className={styles.viewport}
              style={
                typeof scrollHeight === "number" ? { maxHeight: `${scrollHeight}px` } : undefined
              }
              onScroll={() => {
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
                      role="grid"
                      aria-label={ariaLabel}
                      aria-labelledby={ariaLabelledBy}
                      aria-rowcount={bodyState === "rows" ? model.length + 1 : undefined}
                      aria-busy={loading || pending.size > 0 || undefined}
                      className={styles.grid}
                      onKeyDown={onGridKeyDown}
                      onFocus={onGridFocus}
                      onBlur={() => setKeyboardRow(null)}
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
                          aria-label={labels.rowsHeader}
                          className={styles.corner}
                        >
                          <GanttZoomSelect
                            zoom={zoomValue}
                            compact={compactCorner}
                            labels={labels}
                            onChoose={choosePresetStable}
                          />
                        </div>
                        <div
                          ref={axisRef}
                          role="columnheader"
                          aria-label={labels.timeline}
                          aria-describedby={todayInRange ? todayId : undefined}
                          className={styles.axis}
                          data-gantt-head=""
                        >
                          <GanttHead
                            steps={headLayers}
                            lines={lines}
                            scene={scene}
                            rangeStart={range.start}
                            days={totalDays}
                            locale={locale}
                            measure={measureHead}
                            pad={headPad}
                            onPad={setHeadPad}
                            gap={geometry.labelGap}
                            fade={geometry.labelGap * 2}
                            todayDay={todayInRange ? todayX : null}
                            todayText={todayText}
                            pill={todayPillRef}
                            pillWidth={todayPillWidth}
                            layer={slide.layer}
                            laid={headLaid}
                            widths={headWidths.current}
                            onMeasured={onHeadMeasured}
                            onLeft={leaveStep}
                          />
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
                                  "--gantt-view-h": `${Math.max(0, viewHeight - headHeight)}px`,
                                } as React.CSSProperties)
                              : undefined
                          }
                        >
                          {bodyState === "empty" ? null : backdrop}
                          {bodyState === "empty" ? null : overlay}
                          {body}
                        </div>
                      </RegionSwap>
                    </div>
                  </Tooltip.Provider>
                </FloatingBoundaryProvider>
              </AnchorRectProvider>
            </ScrollContainer>
            {todayEdge ? (
              <TodayJump
                key={todayEdge}
                edge={todayEdge}
                rtl={direction() === -1}
                labels={labels}
                onJump={jumpToTodayStable}
                onWidth={setJumpInset}
              />
            ) : null}
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
          {todayInRange ? (
            <VisuallyHidden id={todayId}>
              {formatLabel(labels.todayIs, { date: formatDay(today, locale) })}
            </VisuallyHidden>
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

/** What the current label layer laid out: the sticky boundary of every slide is chosen from it. */
type HeadLaid = {
  labels: readonly HeadLabel[];
  placed: readonly HeadPlaced[];
  nodes: Map<number, HTMLElement>;
};

/** Every text a step or a boundary may show: measured once, before a step is chosen by it. */
function headSamples(locale: Locale): { text: string; strong: boolean }[] {
  const out: { text: string; strong: boolean }[] = [];
  // Every day's number; the year's figures stand for every year (tabular).
  for (let date = 1; date <= 31; date++) out.push({ text: String(date), strong: false });
  out.push({ text: "2027", strong: true });
  for (const text of stepSamples(headStepOf("month"), locale)) {
    // A month in the month steps, the sticky month, the month of a «1 ноя».
    out.push({ text, strong: false }, { text, strong: true });
    out.push({ text: text.toLocaleLowerCase(), strong: true });
  }
  return out;
}

/**
 * The head's time layer (`timeHead`): a ruler of ticks — the grid's lines, at the grid's
 * strengths, taller for a coarser unit — and the labels of ONE step on them, placed by `toPx` and
 * faded where an ordinary label meets a boundary; while the step changes, the old labels fade out
 * over the new ones (`swapMotion`), both on the live camera. The boundary at the start edge is
 * stuck by the chart with every slide (`stickyBoundary`). It measures each text once.
 */
const GanttHead = React.memo(function GanttHead({
  steps,
  lines,
  scene,
  rangeStart,
  days,
  locale,
  measure,
  pad,
  gap,
  fade,
  layer,
  laid,
  widths,
  onMeasured,
  onPad,
  onLeft,
  todayDay,
  todayText,
  pill,
  pillWidth,
}: {
  /** The current step, and the one it leaves while they cross-fade. */
  steps: readonly { step: HeadStep; state: "in" | "out" | "still" }[];
  lines: readonly GridLine[];
  scene: TimeScene;
  rangeStart: Date;
  days: number;
  locale: Locale;
  measure: MeasureText;
  pad: number;
  gap: number;
  fade: number;
  layer: (node: HTMLElement | null) => (() => void) | undefined;
  laid: React.RefObject<HeadLaid | null>;
  widths: Map<string, number>;
  onMeasured: () => void;
  /** The pill's start padding, px: the room every label leaves after its tick. */
  onPad: (px: number) => void;
  onLeft: (id: HeadStepId) => void;
  /** Today in days from the axis start; `null` when the axis does not hold it. */
  todayDay: number | null;
  /** Today's date on its pill: «21 окт». */
  todayText: string;
  pill: React.RefObject<HTMLSpanElement | null>;
  pillWidth: React.RefObject<number>;
}) {
  const sampler = React.useRef<HTMLSpanElement | null>(null);
  const samples = React.useMemo(() => headSamples(locale), [locale]);
  // A child's layout effect: the widths are known before the chart chooses a step by them.
  React.useLayoutEffect(() => {
    const node = sampler.current;
    if (!node || samples.length === 0) return;
    let added = false;
    for (const text of node.querySelectorAll<HTMLElement>("[data-sample]")) {
      const key = `${text.dataset.strong ? 1 : 0}${text.dataset.sample}`;
      if (widths.has(key)) continue;
      const width = text.getBoundingClientRect().width;
      if (width > 0) {
        widths.set(key, width);
        added = true;
      }
    }
    if (added) onMeasured();
    // Today's pill: its width, read once per text, keeps it whole inside the axis.
    if (pill.current) {
      pillWidth.current = todayText ? pill.current.getBoundingClientRect().width : 0;
      const badge = pill.current.firstElementChild;
      const start = badge ? Number.parseFloat(getComputedStyle(badge).paddingInlineStart) : 0;
      if (start > 0 && start !== pad) onPad(start);
    }
  }, [samples, todayText, widths, onMeasured, pill, pillWidth, pad, onPad]);
  return (
    <div
      ref={layer}
      className={styles.labels}
      style={{ width: `${scene.widthPx}px` }}
      aria-hidden="true"
    >
      <span ref={sampler} className={styles.sampler}>
        {samples.map((sample) => (
          <span
            key={`${sample.strong}${sample.text}`}
            data-sample={sample.text}
            data-strong={sample.strong || undefined}
          >
            {sample.text}
          </span>
        ))}
      </span>
      {lines.map((line) => (
        <span
          key={line.key}
          className={styles.tick}
          data-day={line.day}
          style={{ insetInlineStart: `${toPx(line.day, scene)}px` }}
        />
      ))}
      {steps.map(({ step, state }) => (
        <GanttHeadStep
          key={step.id}
          step={step}
          state={state}
          scene={scene}
          rangeStart={rangeStart}
          days={days}
          locale={locale}
          measure={measure}
          pad={pad}
          gap={gap}
          fade={fade}
          laid={state === "out" ? null : laid}
          onLeft={onLeft}
        />
      ))}
      {todayDay === null ? null : (
        <>
          {/* The today line through the head, the chart's own line continued. */}
          <span
            className={styles.todayLine}
            style={{ insetInlineStart: `${toPx(todayDay, scene)}px` }}
          />
          <span
            ref={pill}
            className={styles.todayPill}
            style={{ insetInlineStart: `${toPx(todayDay, scene)}px` }}
          >
            {/* A flag on the line, not a Badge chip: it hangs from the today line in the line's own
                colour, square where it meets the line and rounded at its free end. */}
            <span className={styles.todayFlag}>{todayText}</span>
          </span>
        </>
      )}
    </div>
  );
});

/** The labels of one step: each after its tick, an ordinary one faded by a boundary near it. */
function GanttHeadStep({
  step,
  state,
  scene,
  rangeStart,
  days,
  locale,
  measure,
  pad,
  gap,
  fade,
  laid,
  onLeft,
}: {
  step: HeadStep;
  state: "in" | "out" | "still";
  scene: TimeScene;
  rangeStart: Date;
  days: number;
  locale: Locale;
  measure: MeasureText;
  pad: number;
  gap: number;
  fade: number;
  laid: React.RefObject<HeadLaid | null> | null;
  onLeft: (id: HeadStepId) => void;
}) {
  const labels = React.useMemo(
    () => headLabels(step, scene.from, scene.to, rangeStart, days, locale),
    [step, scene.from, scene.to, rangeStart, days, locale],
  );
  const placed = placeLabels(labels, {
    px: (day) => toPx(day, scene),
    measure,
    pad,
    gap,
    fade,
    space: pad,
  });
  const nodes = React.useRef(new Map<number, HTMLElement>());
  React.useLayoutEffect(() => {
    if (laid) laid.current = { labels, placed, nodes: nodes.current };
  });
  const hold = (key: number) => (node: HTMLElement | null) => {
    if (node) nodes.current.set(key, node);
    else nodes.current.delete(key);
  };
  return (
    <span
      className={cx(
        styles.headStep,
        state === "in" && swapMotion.swapIn,
        state === "out" && swapMotion.swapOut,
      )}
      data-step={step.id}
      data-state={state === "out" ? "closed" : undefined}
      onAnimationEnd={(event) => {
        if (state === "out" && event.target === event.currentTarget) onLeft(step.id);
      }}
    >
      {labels.map((label, index) => (
        <span
          key={label.key}
          ref={hold(label.key)}
          className={styles.headLabel}
          data-day={label.day}
          data-boundary={label.boundary || undefined}
          style={{
            insetInlineStart: `${placed[index].x}px`,
            opacity: placed[index].opacity === 1 ? undefined : placed[index].opacity,
          }}
        >
          {label.parts.map((part) => (
            <span
              key={`${part.role}${part.text}`}
              className={styles.headText}
              data-role={part.role}
              data-strong={part.strong || undefined}
            >
              {part.text}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

type GanttToolbarProps = {
  toolbar: React.ReactNode;
  /** The shown categories, in order; null without `categories`. */
  legend: readonly GanttCategory[] | null;
  labels: GanttLabels;
};

/**
 * The row above the chart, only when there is something to put on it: your content and the legend
 * on the one tool row (`ToolRow`, as the DataTable `toolbar`). Memoized: a zoom skips it.
 */
const GanttToolbar = React.memo(function GanttToolbar({
  toolbar,
  legend,
  labels,
}: GanttToolbarProps) {
  return (
    <ToolRow className={styles.toolbar}>
      <ToolGroup>
        {toolbar}
        {legend ? <GanttLegend categories={legend} label={labels.legend} /> : null}
      </ToolGroup>
    </ToolRow>
  );
});

/**
 * The zoom selector in the head of the first column: the presets, or «Свой» for a zoom a gesture
 * left between them. Memoized: a zoom frame skips it.
 */
const GanttZoomSelect = React.memo(function GanttZoomSelect({
  zoom,
  compact,
  labels,
  onChoose,
}: {
  zoom: GanttZoom;
  /** A column too narrow for the text (avatars only): an icon-only trigger. */
  compact: boolean;
  labels: GanttLabels;
  onChoose: (preset: string) => void;
}) {
  const size = stepDown(useControlSize(undefined));
  return (
    <Select.Root
      size={size}
      value={typeof zoom === "string" ? zoom : ""}
      placeholder={labels.customZoom}
      onValueChange={onChoose}
      className={styles.zoomSelect}
    >
      {/* Named as a Select segment is: the name, then the value it shows. */}
      <Select.Trigger
        aria-label={`${labels.zoom}: ${typeof zoom === "string" ? labels[zoom] : labels.customZoom}`}
      >
        {compact ? (
          <Select.TriggerIcon>
            <Icon name="action.zoomIn" />
          </Select.TriggerIcon>
        ) : (
          <Select.Value />
        )}
      </Select.Trigger>
      <Select.Content>
        {PRESETS.map((preset) => (
          <Select.Item key={preset} value={preset}>
            {labels[preset]}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
});

/**
 * «Сегодня» at the edge of the head where today went off screen, pointing at it: it glides today
 * back into view and leaves once today is in view again (the accent cell and the line show it).
 */
function TodayJump({
  edge,
  rtl,
  labels,
  onJump,
  onWidth,
}: {
  edge: "start" | "end";
  rtl: boolean;
  labels: GanttLabels;
  onJump: () => void;
  /** The room it takes at the start edge, px (0 when it leaves): the head's stickies stand after it. */
  onWidth: (px: number) => void;
}) {
  const presence = usePartPresence<HTMLSpanElement>({ axis: "inline" });
  const own = React.useRef<HTMLSpanElement | null>(null);
  const ref = useMergedRefs(presence.ref, own);
  React.useLayoutEffect(() => {
    if (edge !== "start") return;
    onWidth(own.current?.offsetWidth ?? 0);
    return () => onWidth(0);
  }, [edge, onWidth]);
  const size = stepDown(useControlSize(undefined));
  const pointsLeft = (edge === "start") !== rtl;
  // `Button.Icon` swaps the glyph itself when today crosses to the other edge.
  const glyph = pointsLeft ? "nav.chevronLeft" : "nav.chevronRight";
  const icon = (
    <Button.Icon>
      <Icon name={glyph} />
    </Button.Icon>
  );
  return (
    // On the head's own fill: the dates pass under it, never through it.
    <span ref={ref} className={cx(styles.todayJump, presence.className)} data-edge={edge}>
      <Button.Root
        variant="soft"
        tone="neutral"
        size={size}
        aria-label={labels.toToday}
        onClick={onJump}
      >
        {edge === "start" ? icon : null}
        {labels.today}
        {edge === "end" ? icon : null}
      </Button.Root>
    </span>
  );
}

/**
 * The legend of `categories`: a Badge with the dot of each shown category, in order. A category
 * hidden or shown again (`hiddenCategories`) closes up or rises in, the rest glide.
 */
function GanttLegend({
  categories,
  label,
}: {
  categories: readonly GanttCategory[];
  label: string;
}) {
  const presence = useListPresence(categories.map((category) => category.id));
  return (
    <Badge.Group aria-label={label}>
      {categories.map((category) => (
        <GanttLegendEntry key={category.id} category={category} presence={presence} />
      ))}
    </Badge.Group>
  );
}

function GanttLegendEntry({
  category,
  presence,
}: {
  category: GanttCategory;
  presence: ListPresence;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const entered = useListItemPresence(presence, category.id, ref, "inline");
  return (
    <Badge.Root
      ref={ref}
      className={cx(entered && enterMotion.enter)}
      color={category.color ?? "blue"}
    >
      <Badge.Dot />
      {category.label}
    </Badge.Root>
  );
}
