/*
 * The time core of the Gantt (Lumen's show board, on calendar days).
 * CAMERA, the one source of truth: `{ dayPx, start }` — the length of a day (continuous) and the
 * day at the start edge of the visible axis. The chart keeps what was asked (`intent`) and draws
 * `clampView(intent, bounds)`: stops apply on the read, never on the write. Every zoom is `zoomAt` /
 * `zoomTo` around an anchor that stays exactly put; every pan is `panBy` / `panTo`.
 * SCENE: what is laid out — bars, grid lines, bands, head labels — from `origin` over a few screens
 * (`wide` 5, two behind, while the view slides; `window` 1.5 while a zoom moves: a zoom lays out
 * every frame and pays for the area). Nothing outside it renders. ONE placement, `toPx(day, scene)`,
 * px from the origin on a whole device pixel: a bar's edge and its grid line are the same pixel.
 * LAYERS: the head labels, the backdrop (lines, weekends, today) and every row's track are laid
 * out from the origin; `timeSlide` writes ONE transform, `shiftPx(start, scene)`, onto all of them
 * in the same call. A pan is that write only: no render, no native scroll, no inherited custom
 * property. The scene is laid out again in one React commit (the slide re-written in its layout
 * effect, before paint) when the view nears its edge, the zoom moves, or the width changes; a pan
 * at rest snaps `start` to a device pixel (`snapStart`).
 * HEAD (`timeHead`): ONE label step (1 · 2 · 7 days counted from each month's 1st, 1 · 3 · 6
 * months, 1 · 2 · 5 · 10 years), the finest whose measured labels fit, 15 % hysteresis, a change
 * cross-fades; labels start after their tick, today's flag is today's own label. GRID
 * (`timeLadder`): one family, one weight — a line every day from 6 px a day, else the head's
 * ticks. Editing lands on whole days; Alt — on the head's ticks.
 * GESTURES (`timeGesture`): Ctrl / ⌘ + wheel, a trackpad or two-finger pinch, a drag along the head
 * → zoom, gathered once a frame and laid out in it (`flushSync`); a sideways wheel, Shift + wheel,
 * one finger → pan, written from the event itself; + / −, a preset, «Сегодня» glide the camera.
 * Vertical stays native (rows virtualized by `useVirtualRows`). A zoom at rest 180 ms settles: a
 * preset within 8 % glides onto it, `onZoomChange`, the wide scene. Bars move only by their dates
 * (a WAAPI glide in the bar), never by a scene change, so nothing floats.
 */

export type TimeView = {
  /** The length of a day, px. */
  dayPx: number;
  /** The day at the start edge of the visible axis: days from the axis start, fractional. */
  start: number;
};

export type TimeBounds = {
  /** Days on the axis. */
  days: number;
  /** The visible axis, px; 0 until measured (then only the top stop holds). */
  widthPx: number;
  /** Zoomed all the way in: the longest a day gets. */
  maxDayPx: number;
};

/** The whole axis across the view; `null` before it is measured. */
function fitDayPx(bounds: TimeBounds): number | null {
  if (bounds.days <= 0 || bounds.widthPx <= 0) return null;
  return bounds.widthPx / bounds.days;
}

/** The zoom as it can be drawn: never past the whole axis in view, never past the top stop. */
export function clampZoom(dayPx: number, bounds: TimeBounds): number {
  return Math.min(Math.max(dayPx, fitDayPx(bounds) ?? 0), bounds.maxDayPx);
}

function clampStart(start: number, dayPx: number, bounds: TimeBounds): number {
  const lower = Math.max(start, 0);
  if (bounds.widthPx <= 0) return lower;
  return Math.min(lower, Math.max(bounds.days - bounds.widthPx / dayPx, 0));
}

function settled(view: TimeView, dayPx: number, start: number): TimeView {
  return view.dayPx === dayPx && view.start === start ? view : { dayPx, start };
}

/** The view as it can be drawn inside these stops. */
export function clampView(view: TimeView, bounds: TimeBounds): TimeView {
  const dayPx = clampZoom(view.dayPx, bounds);
  return settled(view, dayPx, clampStart(view.start, dayPx, bounds));
}

/**
 * The view at `dayPx` while the day `anchorPx` from the start edge stays exactly where it is. With
 * `bounds` the zoom and the start stop at the stops (the anchor is held for as much as was taken);
 * without, it is the intent — the stops apply when it is read.
 */
export function zoomTo(
  view: TimeView,
  dayPx: number,
  anchorPx: number,
  bounds?: TimeBounds,
): TimeView {
  if (!(dayPx > 0) || !Number.isFinite(dayPx)) {
    throw new Error(`the length of a day must be a positive number, got ${dayPx}`);
  }
  const next = bounds ? clampZoom(dayPx, bounds) : dayPx;
  if (next === view.dayPx) return view;
  const anchorDay = view.start + anchorPx / view.dayPx;
  const start = anchorDay - anchorPx / next;
  return settled(view, next, bounds ? clampStart(start, next, bounds) : start);
}

/** Zooms by `factor` (above one is closer) around the day `anchorPx` from the start edge. */
export function zoomAt(
  view: TimeView,
  factor: number,
  anchorPx: number,
  bounds: TimeBounds,
): TimeView {
  if (!(factor > 0) || !Number.isFinite(factor)) {
    throw new Error(`zoom factor must be a positive number, got ${factor}`);
  }
  return zoomTo(view, view.dayPx * factor, anchorPx, bounds);
}

/** Slides the view by `deltaPx` at its own zoom; positive goes later. */
export function panBy(view: TimeView, deltaPx: number, bounds: TimeBounds): TimeView {
  return settled(
    view,
    view.dayPx,
    clampStart(view.start + deltaPx / view.dayPx, view.dayPx, bounds),
  );
}

/** Puts `day` at `align` of the visible axis (0 the start edge, 1/2 the middle). */
export function panTo(view: TimeView, day: number, align: number, bounds: TimeBounds): TimeView {
  const start = day - (bounds.widthPx * align) / view.dayPx;
  return settled(view, view.dayPx, clampStart(start, view.dayPx, bounds));
}

/** How near a preset a zoom must come to rest on it, as a ratio (8 %). */
const PRESET_MAGNET_RATIO = 1.08;

/** The preset a zoom of `dayPx` comes to rest on (within 8 %), or `null`. */
export function presetNear<P extends string>(
  dayPx: number,
  presets: Readonly<Record<P, number>>,
): P | null {
  for (const name of Object.keys(presets) as P[]) {
    if (Math.abs(Math.log(dayPx / presets[name])) <= Math.log(PRESET_MAGNET_RATIO)) return name;
  }
  return null;
}

/**
 * A glide between two views, `t` in `0…1` of its eased progress: the zoom moves in log space (a
 * doubling takes as long either way) and the anchor day `anchorPx` from the start edge moves
 * linearly from where it stood in `from` to where it stands in `to`, so a zoom glide around a
 * fixed anchor keeps it fixed and a pan glide is a straight slide.
 */
export function glideView(from: TimeView, to: TimeView, anchorPx: number, t: number): TimeView {
  if (t >= 1) return to;
  if (t <= 0) return from;
  const dayPx = from.dayPx * (to.dayPx / from.dayPx) ** t;
  const fromAnchor = from.start + anchorPx / from.dayPx;
  const toAnchor = to.start + anchorPx / to.dayPx;
  return { dayPx, start: fromAnchor + (toAnchor - fromAnchor) * t - anchorPx / dayPx };
}

// ─── Scene ───

/** What is laid out around the view: wide while it slides, the window alone while a zoom moves. */
export type SceneKind = "wide" | "window";

const SCENES: Record<SceneKind, { screens: number; behind: number }> = {
  wide: { screens: 5, behind: 2 },
  window: { screens: 1.5, behind: 0.25 },
};

/**
 * How close the view may come to an edge of what is laid out before it is laid out again, in
 * screens: the layout lands a frame after it is asked for, and a flick must not bare the edge.
 */
const GUARD_SCREENS = 0.5;

export type TimeScene = {
  kind: SceneKind;
  /** The day the layers are laid out from: their px 0. */
  origin: number;
  dayPx: number;
  /** The days laid out, `[from, to)`; the whole axis before the chart is measured. */
  from: number;
  to: number;
  /** The width of a layer, px. */
  widthPx: number;
  /** Device pixels per CSS px: every position lands on a whole device pixel. */
  dpr: number;
};

/**
 * The scene for a view: `kind` screens from the screens behind it. The origin stands a whole number
 * of device pixels behind the start, so the slide of a fresh layout is a whole pixel. Unmeasured
 * (`viewportPx` 0) it is the whole axis from day 0.
 */
export function sceneFor(
  view: TimeView,
  viewportPx: number,
  kind: SceneKind,
  days: number,
  dpr: number,
): TimeScene {
  const { dayPx } = view;
  if (viewportPx <= 0) {
    return { kind, origin: 0, dayPx, from: 0, to: days, widthPx: days * dayPx, dpr };
  }
  const { screens, behind } = SCENES[kind];
  const behindPx = Math.round(viewportPx * behind * dpr) / dpr;
  const origin = view.start - behindPx / dayPx;
  const widthPx = Math.ceil(viewportPx * screens);
  return { kind, origin, dayPx, from: origin, to: origin + widthPx / dayPx, widthPx, dpr };
}

/** Whether a view at `start` has come so near an edge of `scene` that it must be laid out again. */
export function leavesScene(start: number, scene: TimeScene, viewportPx: number): boolean {
  if (viewportPx <= 0) return false;
  const window = viewportPx / scene.dayPx;
  const guard = window * GUARD_SCREENS;
  return start < scene.from + guard || start + window > scene.to - guard;
}

/** THE placement: `day` in a layer's px, on a whole device pixel. */
export function toPx(day: number, scene: TimeScene): number {
  return Math.round((day - scene.origin) * scene.dayPx * scene.dpr) / scene.dpr;
}

/**
 * The slide of every layer for a view at `start`: exact, so the day under the hand stays under it
 * within half a device pixel while the view moves. A view at rest stands on a whole device pixel
 * (`snapStart`), so the layers are drawn crisp.
 */
export function shiftPx(start: number, scene: TimeScene): number {
  const px = -(start - scene.origin) * scene.dayPx;
  return px === 0 ? 0 : px;
}

/** `start` moved by under half a device pixel, so the slide of `scene` is a whole device pixel. */
export function snapStart(start: number, scene: TimeScene): number {
  const units = scene.dayPx * scene.dpr;
  return scene.origin + Math.round((start - scene.origin) * units) / units;
}

/** The day `offsetPx` from the start edge of the visible axis, for a view at `view`. */
export function dayAtOffset(view: TimeView, offsetPx: number): number {
  return view.start + offsetPx / view.dayPx;
}
