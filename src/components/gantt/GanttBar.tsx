import type { Locale } from "date-fns";
import * as React from "react";

import { Spinner } from "@/components/spinner/Spinner";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import palette from "@/internal/palette.module.css";

import styles from "./Gantt.module.css";
import {
  applyEdit,
  daysBetween,
  formatSpan,
  type GanttBar,
  type GanttDates,
  type GanttEdit,
  type GanttScale,
  isMilestone,
  snapHysteresis,
  stickyRound,
  unitDays,
} from "./ganttModel";

/** Pointer travel before a press becomes a drag (a gesture threshold, not a style length). */
const DRAG_THRESHOLD_PX = 4;
/** A finger held this long on a bar picks it up for a drag; moving earlier scrolls the chart. */
const LONG_PRESS_MS = 400;

const EDIT_SHORTCUTS = [
  "Shift+ArrowLeft",
  "Shift+ArrowRight",
  "Shift+Alt+ArrowLeft",
  "Shift+Alt+ArrowRight",
  "Control+Shift+ArrowLeft",
  "Control+Shift+ArrowRight",
  "Control+Shift+Alt+ArrowLeft",
  "Control+Shift+Alt+ArrowRight",
].join(" ");

export type GanttBarViewProps = {
  bar: GanttBar;
  /** Dates on screen: the data, or the pending change while `onBarChange` runs. */
  dates: GanttDates;
  /** Days from the range start to `dates.start`. */
  x: number;
  lane: number;
  scale: GanttScale;
  locale: Locale;
  /** Accessible name for the given dates (label, spoken dates, progress). */
  nameFor: (dates: GanttDates) => string;
  /** «14 дн.» — the duration in the tooltip. */
  formatDuration: (days: number) => string;
  /** `renderBarTooltip`: extra tooltip content under the dates line. */
  renderTip?: () => React.ReactNode;
  editable: boolean;
  pending: boolean;
  /** The roving tab stop of the chart. */
  active: boolean;
  /** Id of the hidden «how to edit» hint. */
  hintId?: string;
  /** Length of one day in px, measured on the axis. */
  dayPx: () => number;
  /** −1 in a right-to-left chart: pointer travel runs against the time axis. */
  direction: () => 1 | -1;
  /** The chart's horizontal scroll position: a gesture counts the auto-scroll it caused. */
  scrollLeft: () => number;
  /** Keeps the chart scrolling while a drag holds an edge; `stop` ends it. */
  autoScroll: { follow: (clientX: number, onScrolled: () => void) => void; stop: () => void };
  onActivate: () => void;
  onFocusBar: () => void;
  /** The tooltip opened (with its closer) or closed: the chart closes open tooltips on scroll. */
  onTipChange: (id: string, close: (() => void) | null) => void;
  /** No tooltip for a bar hidden under the sticky column or the edges: nothing to point at. */
  canShowTip: (id: string) => boolean;
  onCommit: (dates: GanttDates) => void;
  /** A drag started or ended: the chart keeps a dragged bar rendered wherever it is scrolled. */
  onDragChange: (id: string, dragging: boolean) => void;
  barRef: (node: HTMLButtonElement | null) => void;
};

/**
 * A drag: the pointer's travel in days (`raw`, fractional — the bar follows it directly) and the
 * snapped result in `steps` of `unit` (a day; the zoom's unit while Alt is held).
 */
type DragState = { edit: GanttEdit; raw: number; steps: number; unit: GanttScale };

/**
 * One bar: a `<button>` placed in days, with a Tooltip (dates and duration) on hover and focus. A
 * pointer drags the body (move) or a grip (start / end): the bar follows the pointer exactly, the
 * dates snap to whole days (to the zoom's unit with Alt) with hysteresis, a guide marks the snapped
 * edge at the week and month zoom, and the tooltip shows the new dates. Release commits through
 * `onCommit`; Escape or a cancelled pointer drops it. On touch a long press picks the bar up.
 */
export function GanttBarView({
  bar,
  dates,
  x,
  lane,
  scale,
  locale,
  nameFor,
  formatDuration,
  renderTip,
  editable,
  pending,
  active,
  hintId,
  dayPx,
  direction,
  scrollLeft,
  autoScroll,
  onActivate,
  onFocusBar,
  onTipChange,
  canShowTip,
  onCommit,
  onDragChange,
  barRef,
}: GanttBarViewProps) {
  const [tipOpen, setTipOpen] = React.useState(false);
  React.useEffect(() => {
    if (!tipOpen) return;
    onTipChange(bar.id, () => setTipOpen(false));
    return () => onTipChange(bar.id, null);
  }, [tipOpen, bar.id, onTipChange]);
  const [drag, setDrag] = React.useState<DragState | null>(null);
  // The floating layer mounts with the first opening: a scrolled-in bar costs no tooltip machinery.
  const [tipMounted, setTipMounted] = React.useState(false);
  if (!tipMounted && (tipOpen || drag !== null)) setTipMounted(true);
  const gesture = React.useRef<{
    x: number;
    scroll: number;
    clientX: number;
    alt: boolean;
    edit: GanttEdit;
    pointerId: number;
    moved: boolean;
    steps: number;
    unit: GanttScale;
    /** Touch on the body: the long press has not picked the bar up yet. */
    waiting: number | null;
  } | null>(null);
  /** A drag ends with the browser's click on the same button: that click is not a selection. */
  const swallowClick = React.useRef(false);

  const shown = drag ? applyEdit(dates, drag.edit, drag.steps, drag.unit) : dates;
  const milestone = isMilestone(shown);
  // Geometry: the snapped dates at rest; while dragging, the pointer itself (clamped to one day).
  const baseSpan = isMilestone(dates) ? 0 : daysBetween(dates.start, dates.end);
  let shownX = x;
  let span = milestone ? 0 : baseSpan;
  if (drag && (drag.edit === "move" || isMilestone(dates))) {
    shownX = x + drag.raw;
  } else if (drag?.edit === "start") {
    const shift = Math.min(drag.raw, baseSpan - 1);
    shownX = x + shift;
    span = baseSpan - shift;
  } else if (drag?.edit === "end") {
    span = Math.max(1, baseSpan + drag.raw);
  }
  // Where the moving edge lands: a faint day guide at the week and month zoom.
  const guide =
    drag && scale !== "day"
      ? x + daysBetween(dates.start, drag.edit === "end" ? shown.end : shown.start)
      : null;
  const progress =
    bar.progress === undefined
      ? undefined
      : Math.round(Math.min(Math.max(bar.progress, 0), 1) * 100);

  const cancel = () => {
    if (gesture.current?.waiting) window.clearTimeout(gesture.current.waiting);
    if (gesture.current?.moved) onDragChange(bar.id, false);
    gesture.current = null;
    autoScroll.stop();
    setDrag(null);
  };

  /** The drag from the pointer and the scroll it caused: raw days, snapped steps. */
  const track = () => {
    const current = gesture.current;
    if (!current || current.waiting) return;
    const dx = (current.clientX - current.x + scrollLeft() - current.scroll) * direction();
    if (!current.moved && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
    const px = dayPx();
    const raw = px > 0 ? dx / px : 0;
    let unit: GanttScale = "day";
    let steps: number;
    if (current.alt && scale !== "day") {
      unit = scale;
      steps = Math.round(raw / unitDays(scale));
    } else {
      const from = current.unit === "day" ? current.steps : Math.round(raw);
      steps = stickyRound(raw, from, snapHysteresis(px));
    }
    if (!current.moved) onDragChange(bar.id, true);
    current.moved = true;
    current.steps = steps;
    current.unit = unit;
    setDrag({ edit: current.edit, raw, steps, unit });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    swallowClick.current = false;
    if (!editable || pending || event.button !== 0) return;
    const handle = (event.target as HTMLElement).closest<HTMLElement>("[data-handle]")?.dataset
      .handle as GanttEdit | undefined;
    const node = event.currentTarget;
    const pointerId = event.pointerId;
    // On touch the body of a bar scrolls the chart until a long press picks the bar up.
    const waitForPress = event.pointerType === "touch" && !handle;
    gesture.current = {
      x: event.clientX,
      scroll: scrollLeft(),
      clientX: event.clientX,
      alt: event.altKey,
      edit: handle ?? "move",
      pointerId,
      moved: false,
      steps: 0,
      unit: "day",
      waiting: waitForPress
        ? window.setTimeout(() => {
            const current = gesture.current;
            if (!current || current.pointerId !== pointerId) return;
            current.waiting = null;
            node.setPointerCapture?.(pointerId);
          }, LONG_PRESS_MS)
        : null,
    };
    if (!waitForPress) node.setPointerCapture?.(pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = gesture.current;
    if (!current || event.pointerId !== current.pointerId) return;
    if (current.waiting) {
      // Moving before the long press: the finger scrolls the chart, the bar stays.
      if (Math.abs(event.clientX - current.x) > DRAG_THRESHOLD_PX) cancel();
      return;
    }
    current.clientX = event.clientX;
    current.alt = event.altKey;
    track();
    if (current.moved) autoScroll.follow(event.clientX, track);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = gesture.current;
    if (!current || event.pointerId !== current.pointerId) return;
    if (current.waiting) window.clearTimeout(current.waiting);
    gesture.current = null;
    autoScroll.stop();
    if (!current.moved) return;
    onDragChange(bar.id, false);
    swallowClick.current = true;
    setDrag(null);
    if (current.steps !== 0) onCommit(applyEdit(dates, current.edit, current.steps, current.unit));
  };

  // A picked-up bar keeps the finger: the page must not pan under it (a passive React listener
  // cannot prevent that, so the bar listens itself).
  const nodeRef = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const hold = (event: TouchEvent) => {
      const current = gesture.current;
      if (current && !current.waiting) event.preventDefault();
    };
    node.addEventListener("touchmove", hold, { passive: false });
    return () => node.removeEventListener("touchmove", hold);
  }, []);
  const setNode = React.useCallback(
    (node: HTMLButtonElement | null) => {
      nodeRef.current = node;
      barRef(node);
    },
    [barRef],
  );

  return (
    <>
      {guide !== null ? (
        <span
          className={styles.dayGuide}
          style={{ "--x": guide } as React.CSSProperties}
          aria-hidden="true"
        />
      ) : null}
      <Tooltip.Root
        open={tipOpen || drag !== null}
        onOpenChange={(open) => setTipOpen(open && canShowTip(bar.id))}
      >
        <Tooltip.Trigger>
          <button
            ref={setNode}
            type="button"
            tabIndex={active ? 0 : -1}
            className={cx(palette.hue, styles.bar)}
            style={
              {
                "--x": shownX,
                "--span": span,
                "--lane": lane,
                "--progress": progress === undefined ? undefined : `${progress}%`,
              } as React.CSSProperties
            }
            aria-label={nameFor(shown)}
            aria-describedby={editable ? hintId : undefined}
            aria-keyshortcuts={editable ? EDIT_SHORTCUTS : undefined}
            aria-busy={pending || undefined}
            data-gantt-bar=""
            data-nav-id={bar.id}
            data-bar-id={bar.id}
            data-x={shownX}
            data-span={span}
            data-lane={lane}
            {...toDataAttributes({
              color: bar.tone ? undefined : (bar.color ?? "blue"),
              tone: bar.tone,
              milestone: milestone || undefined,
              editable: editable || undefined,
              pending: pending || undefined,
              dragging: drag ? drag.edit : undefined,
              progress: progress === undefined ? undefined : true,
            })}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={cancel}
            onLostPointerCapture={(event) => {
              if (gesture.current?.pointerId === event.pointerId && !gesture.current.moved) {
                gesture.current = null;
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape" && gesture.current) {
                event.stopPropagation();
                swallowClick.current = true;
                cancel();
              }
            }}
            onFocus={onFocusBar}
            onClick={() => {
              if (swallowClick.current) {
                swallowClick.current = false;
                return;
              }
              onActivate();
            }}
          >
            {milestone ? <span className={styles.diamond} aria-hidden="true" /> : null}
            {pending ? <Spinner size="xs" className={styles.spinner} aria-hidden="true" /> : null}
            <span className={styles.label} data-gantt-label="" aria-hidden="true">
              {bar.label}
            </span>
            {editable && !milestone ? (
              <>
                <span className={styles.handle} data-handle="start" aria-hidden="true" />
                <span className={styles.handle} data-handle="end" aria-hidden="true" />
              </>
            ) : null}
          </button>
        </Tooltip.Trigger>
        {tipMounted ? (
          <Tooltip.Content>
            <span className={styles.tipTitle}>{bar.label}</span>
            <span className={styles.tipMeta}>
              {formatSpan(shown, locale)}
              {milestone ? null : ` · ${formatDuration(daysBetween(shown.start, shown.end))}`}
              {progress === undefined ? null : ` · ${progress}%`}
            </span>
            {renderTip ? <div className={styles.tipExtra}>{renderTip()}</div> : null}
          </Tooltip.Content>
        ) : null}
      </Tooltip.Root>
    </>
  );
}
