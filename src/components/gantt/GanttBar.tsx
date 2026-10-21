import { addDays, type Locale } from "date-fns";
import * as React from "react";

import { Spinner } from "@/components/spinner/Spinner";
import { Tooltip } from "@/components/tooltip/Tooltip";
import { prefersReducedMotion } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import { toDataAttributes } from "@/internal/data-attributes";
import { DRAG_HOLD_MS, DRAG_THRESHOLD_PX, useLongPress } from "@/internal/longPress";
import { type MotionDurationToken, motionTiming } from "@/internal/motionTiming";
import palette from "@/internal/palette.module.css";
import { press } from "@/internal/press";
import type { PaletteColor } from "@/internal/states";
import textRole from "@/internal/textRole.module.css";
import { touchTargetBlockClass } from "@/internal/touchTarget";

import styles from "./Gantt.module.css";
import {
  applyEdit,
  DAY_STEP,
  daysBetween,
  formatSpan,
  type GanttBar,
  type GanttBarEdit,
  type GanttDates,
  type GanttEdit,
  isMilestone,
  sameDates,
  snapEdit,
  snapHysteresis,
  stickyRound,
  type TimeStep,
} from "./ganttModel";
import { type TimeScene, toPx } from "./timeCore";

const END_SHORTCUTS = [
  "Control+Shift+ArrowLeft",
  "Control+Shift+ArrowRight",
  "Control+Shift+Alt+ArrowLeft",
  "Control+Shift+Alt+ArrowRight",
];

/** The editing keys a bar announces: moving only when it may move. */
const SHORTCUTS: Record<GanttBarEdit, string | undefined> = {
  all: [
    "Shift+ArrowLeft",
    "Shift+ArrowRight",
    "Shift+Alt+ArrowLeft",
    "Shift+Alt+ArrowRight",
    ...END_SHORTCUTS,
  ].join(" "),
  end: END_SHORTCUTS.join(" "),
  none: undefined,
};

/** A part's place in its layer, px from the scene's origin. */
type Place = { left: number; width: number };

/**
 * A part that changes its dates glides to them (a drop, a key step, a refused change going back, the
 * phantom stepping a unit): from where it stood to where it stands, in place — `translate` and
 * `width`, so the press `scale` and the label are untouched. A new scene (a zoom, a re-layout) moves
 * every part by the camera, never by a glide: the layers stay one picture. `still` while the
 * pointer places the part itself.
 */
export function useDateGlide(
  ref: React.RefObject<HTMLElement | null>,
  place: Place,
  scene: TimeScene,
  still: boolean,
  dir: () => 1 | -1,
  duration: MotionDurationToken,
) {
  const last = React.useRef<{ place: Place; scene: TimeScene } | null>(null);
  const running = React.useRef<Animation | null>(null);
  React.useLayoutEffect(() => {
    const previous = last.current;
    last.current = { place, scene };
    const node = ref.current;
    if (!node || !previous) return;
    if (still || previous.scene !== scene) {
      // The pointer or the camera places it now: a glide still under way would pull it aside.
      running.current?.cancel();
      running.current = null;
      return;
    }
    const from = previous.place;
    if (from.left === place.left && from.width === place.width) return;
    if (prefersReducedMotion() || typeof node.animate !== "function") return;
    running.current?.cancel();
    running.current = node.animate(
      [
        { translate: `${(from.left - place.left) * dir()}px 0`, width: `${from.width}px` },
        { translate: "0 0", width: `${place.width}px` },
      ],
      motionTiming(duration, duration === "base" ? "emphasized" : "standard"),
    );
  });
}

export type GanttBarViewProps = {
  bar: GanttBar;
  /** The hue of its category, when the bar has none of its own. */
  categoryColor?: PaletteColor;
  /** Dates on screen: the data, or the pending change while `onBarChange` runs. */
  dates: GanttDates;
  /** Days from the range start to `dates.start`. */
  x: number;
  lane: number;
  /** Its top in the row, px: its lane's, centred in a taller lane. */
  top: number;
  /** The scene the bar is laid out in (`timeCore`): `toPx` places it. */
  scene: TimeScene;
  /** A milestone's box, px: the bar height. */
  barH: number;
  /** The grid's coarse step: what a drag with Alt lands on (without, whole days). */
  snap: TimeStep;
  locale: Locale;
  /** Accessible name for the given dates (label, spoken dates, progress). */
  nameFor: (dates: GanttDates) => string;
  /** «14 дн.» — the duration in the tooltip. */
  formatDuration: (days: number) => string;
  /** `renderBarTooltip`: extra tooltip content under the dates line. */
  renderTip?: () => React.ReactNode;
  /** The edits the bar takes now (`none` while the chart is still or the change is pending). */
  edit: GanttBarEdit;
  pending: boolean;
  /** The roving tab stop of the chart. */
  active: boolean;
  /** Id of the hidden «how to edit» hint for `edit`. */
  hintId?: string;
  /** −1 in a right-to-left chart: pointer travel runs against the time axis. */
  direction: () => 1 | -1;
  /** The day at the start of the view now: a drag counts the slide it caused. */
  viewStart: () => number;
  /** A touch pointer the bar has picked up: the chart does not slide under it. */
  claimPointer: (pointerId: number, held: boolean) => void;
  /** Keeps the chart sliding while a drag holds an edge; `stop` ends it. */
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
 * dates it lands on (`landed`: whole days; with Alt, the grid's coarse step).
 */
type DragState = { edit: GanttEdit; raw: number; landed: GanttDates; snapped: boolean };

/**
 * One bar: a `<button>` placed by the time core (`toPx` of its dates in the scene), with a Tooltip
 * (dates and duration) on hover and focus. A pointer drags the body (move) or a grip (start / end):
 * the bar follows the pointer exactly and its dates land on whole days at every zoom (held with
 * hysteresis, so a few px a day never jitter) — the tooltip shows the exact dates and the days;
 * with Alt they land on the nearest line of the grid's coarse step, a guide marking it. Release
 * commits through `onCommit` and the bar glides onto its dates; Escape or a cancelled pointer drops
 * it. On touch a long press picks the bar up. A bar whose `edit` is `end` has only the end grip.
 */
export function GanttBarView({
  bar,
  categoryColor,
  dates,
  x,
  lane,
  top,
  scene,
  barH,
  snap,
  locale,
  nameFor,
  formatDuration,
  renderTip,
  edit,
  pending,
  active,
  hintId,
  direction,
  viewStart,
  claimPointer,
  autoScroll,
  onActivate,
  onFocusBar,
  onTipChange,
  canShowTip,
  onCommit,
  onDragChange,
  barRef,
}: GanttBarViewProps) {
  const editable = edit !== "none";
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
    view: number;
    clientX: number;
    alt: boolean;
    edit: GanttEdit;
    pointerId: number;
    moved: boolean;
    /** Whole days of the last day-snapped drag: the hysteresis holds them. */
    steps: number;
    landed: GanttDates;
    /** Touch on the body: the long press has not picked the bar up yet. */
    waiting: boolean;
  } | null>(null);
  /** A drag ends with the browser's click on the same button: that click is not a selection. */
  const swallowClick = React.useRef(false);

  const shown = drag ? drag.landed : dates;
  const milestone = isMilestone(shown);
  const height = bar.height ?? "m";
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
  // The one placement: the edges are the scene's px of the dates, the pixel the grid draws them on.
  const left = milestone ? toPx(shownX + 0.5, scene) - barH / 2 : toPx(shownX, scene);
  const width = milestone ? barH : toPx(shownX + span, scene) - left;
  // Where the moving edge lands on the grid with Alt: a faint accent guide.
  const guide = drag?.snapped
    ? toPx(x + daysBetween(dates.start, drag.edit === "end" ? shown.end : shown.start), scene)
    : null;
  const progress =
    bar.progress === undefined
      ? undefined
      : Math.round(Math.min(Math.max(bar.progress, 0), 1) * 100);

  const nodeRef = React.useRef<HTMLButtonElement | null>(null);
  useDateGlide(nodeRef, { left, width }, scene, drag !== null, direction, "base");

  // On touch the body of a bar slides the chart until a finger held on it picks the bar up.
  const hold = useLongPress({
    delay: DRAG_HOLD_MS,
    onLongPress: () => {
      const current = gesture.current;
      if (!current?.waiting) return;
      current.waiting = false;
      claimPointer(current.pointerId, true);
      nodeRef.current?.setPointerCapture?.(current.pointerId);
    },
  });

  const release = () => {
    const current = gesture.current;
    if (current) claimPointer(current.pointerId, false);
  };

  const cancel = () => {
    hold.cancel();
    if (gesture.current?.moved) onDragChange(bar.id, false);
    release();
    gesture.current = null;
    autoScroll.stop();
    setDrag(null);
  };

  /** The drag from the pointer and the slide it caused: raw days, snapped steps. */
  const track = () => {
    const current = gesture.current;
    if (!current || current.waiting) return;
    const px = scene.dayPx;
    const raw =
      px > 0 ? ((current.clientX - current.x) * direction()) / px + viewStart() - current.view : 0;
    if (!current.moved && Math.abs(raw * px) < DRAG_THRESHOLD_PX) return;
    // Whole days at every zoom; with Alt, the nearest line of the grid's coarse step.
    let landed: GanttDates;
    const snapped = current.alt && !(snap.family === "day" && snap.every === 1);
    if (snapped) {
      landed = snapEdit(dates, current.edit, raw, snap, addDays(dates.start, -x));
    } else {
      current.steps = stickyRound(raw, current.steps, snapHysteresis(px));
      landed = applyEdit(dates, current.edit, current.steps, DAY_STEP);
    }
    if (!current.moved) onDragChange(bar.id, true);
    current.moved = true;
    current.landed = landed;
    setDrag({ edit: current.edit, raw, landed, snapped });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    swallowClick.current = false;
    if (!editable || pending || event.button !== 0) return;
    const handle = (event.target as HTMLElement).closest<HTMLElement>("[data-handle]")?.dataset
      .handle as GanttEdit | undefined;
    // Only the end grip of a bar that may not move: its body stays (and selects on click).
    if (edit === "end" && handle !== "end") return;
    const node = event.currentTarget;
    const pointerId = event.pointerId;
    const waitForPress = event.pointerType === "touch" && !handle;
    gesture.current = {
      x: event.clientX,
      view: viewStart(),
      clientX: event.clientX,
      alt: event.altKey,
      edit: handle ?? "move",
      pointerId,
      moved: false,
      steps: 0,
      landed: dates,
      waiting: waitForPress,
    };
    if (waitForPress) {
      hold.handlers.onPointerDown(event);
    } else {
      if (event.pointerType === "touch") claimPointer(pointerId, true);
      node.setPointerCapture?.(pointerId);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const current = gesture.current;
    if (!current || event.pointerId !== current.pointerId) return;
    if (current.waiting) {
      // Moving before the hold ends: the finger slides the chart, the bar stays.
      hold.handlers.onPointerMove(event);
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
    hold.cancel();
    release();
    gesture.current = null;
    autoScroll.stop();
    if (!current.moved) return;
    onDragChange(bar.id, false);
    swallowClick.current = true;
    setDrag(null);
    if (!sameDates(current.landed, dates)) onCommit(current.landed);
  };

  // A picked-up bar keeps the finger: the page must not pan under it (a passive React listener
  // cannot prevent that, so the bar listens itself).
  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const keep = (event: TouchEvent) => {
      const current = gesture.current;
      if (current && !current.waiting) event.preventDefault();
    };
    node.addEventListener("touchmove", keep, { passive: false });
    return () => node.removeEventListener("touchmove", keep);
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
          style={{ insetInlineStart: `${guide}px` }}
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
            className={cx(
              palette.hue,
              press.press,
              // A short bar keeps a finger-sized hit area on touch, grown in height only.
              height === "s" && touchTargetBlockClass,
              styles.bar,
            )}
            style={
              {
                insetInlineStart: `${left}px`,
                width: `${width}px`,
                insetBlockStart: `${top}px`,
                "--progress": progress === undefined ? undefined : `${progress}%`,
              } as React.CSSProperties
            }
            aria-label={nameFor(shown)}
            aria-describedby={editable ? hintId : undefined}
            aria-keyshortcuts={SHORTCUTS[edit]}
            aria-busy={pending || undefined}
            data-gantt-bar=""
            data-nav-id={bar.id}
            data-bar-id={bar.id}
            data-x={shownX}
            data-span={span}
            data-left={left}
            data-right={left + width}
            data-lane={lane}
            data-height={height}
            {...toDataAttributes({
              color: bar.tone ? undefined : (bar.color ?? categoryColor ?? "blue"),
              tone: bar.tone,
              milestone: milestone || undefined,
              editable: editable ? edit : undefined,
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
                release();
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
            <span
              className={cx(styles.label, height === "s" && textRole.caption)}
              data-gantt-label=""
              aria-hidden="true"
            >
              {height === "l" ? (
                <>
                  <span className={styles.labelLine}>{bar.label}</span>
                  {bar.description ? (
                    <span className={cx(textRole.caption, styles.labelLine)}>
                      {bar.description}
                    </span>
                  ) : null}
                </>
              ) : (
                bar.label
              )}
            </span>
            {editable && !milestone ? (
              <>
                {edit === "all" ? (
                  <span className={styles.handle} data-handle="start" aria-hidden="true" />
                ) : null}
                <span className={styles.handle} data-handle="end" aria-hidden="true" />
              </>
            ) : null}
          </button>
        </Tooltip.Trigger>
        {tipMounted ? (
          <Tooltip.Content>
            <span className={styles.tipTitle}>{bar.label}</span>
            {bar.description ? <span className={styles.tipMeta}>{bar.description}</span> : null}
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
