/**
 * The physics of the media viewer, pure and frame-rate independent: the spring that settles every
 * released gesture, the iOS momentum of a pan, the rubber band past an edge, and the geometry of
 * zooming about a point. Lengths are px, times ms, velocities px/ms.
 */

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

/** A damped spring, mass 1. Stiffness in 1/s², damping in 1/s. */
export type SpringConfig = { stiffness: number; damping: number };

/** Settles a released gesture: quick, with a trace of overshoot after a fast flick. */
export const SETTLE_SPRING: SpringConfig = { stiffness: 320, damping: 34 };

/** iOS `UIScrollView.DecelerationRate.normal`: the share of velocity kept per ms. */
export const DECELERATION_RATE = 0.998;

/** The rubber band constant of iOS: how stiffly content resists past its edge. */
const RUBBER_BAND = 0.55;

/** Spring state in px and px/ms. */
export type SpringState = { value: number; velocity: number };

/** Integrator step: small enough to keep a stiff spring stable at any frame rate. */
const SUBSTEP_MS = 4;

/** Advances a spring toward `target` by `dt` ms (semi-implicit Euler in fixed substeps). */
export function stepSpring(
  state: SpringState,
  target: number,
  dt: number,
  config: SpringConfig = SETTLE_SPRING,
): SpringState {
  let { value, velocity } = state;
  // px/ms → px/s for the force terms (stiffness and damping are per second).
  let v = velocity * 1000;
  let left = Math.max(0, dt);
  while (left > 0) {
    const h = Math.min(SUBSTEP_MS, left) / 1000;
    const force = -config.stiffness * (value - target) - config.damping * v;
    v += force * h;
    value += v * h;
    left -= SUBSTEP_MS;
  }
  velocity = v / 1000;
  return { value, velocity };
}

/** The spring is at rest on its target: under a hundredth of a px and nearly still. */
export function springSettled(state: SpringState, target: number, epsilon = 0.01): boolean {
  return Math.abs(state.value - target) < epsilon && Math.abs(state.velocity) < epsilon / 10;
}

/** Velocity left after `dt` ms of momentum. */
export function decayVelocity(velocity: number, dt: number): number {
  return velocity * DECELERATION_RATE ** dt;
}

/** Where momentum from `velocity` comes to rest, measured from where it starts. */
export function projectMomentum(velocity: number): number {
  return (velocity * DECELERATION_RATE) / (1 - DECELERATION_RATE);
}

/**
 * Distance shown for `overshoot` px dragged past an edge of a `dimension`-long viewport: the iOS
 * curve, 1 : 1 at first, ever stiffer, never past the dimension.
 */
export function rubberBand(overshoot: number, dimension: number): number {
  if (dimension <= 0) return 0;
  const sign = Math.sign(overshoot);
  const distance = Math.abs(overshoot);
  return sign * (1 - 1 / ((distance * RUBBER_BAND) / dimension + 1)) * dimension;
}

/** `value` inside `[min, max]`, with the part past either bound rubber-banded over `dimension`. */
export function rubberClamp(value: number, min: number, max: number, dimension: number): number {
  if (value < min) return min + rubberBand(value - min, dimension);
  if (value > max) return max + rubberBand(value - max, dimension);
  return value;
}

/** How many pages on each side of the current one stay mounted and painted, ready to slide in. */
export const PAGE_RADIUS = 2;

/**
 * Where item `index` stands from the `current` page, in pages: negative before, positive after.
 * With `loop` (three items or more) the shorter way round counts.
 */
export function pageOffset(index: number, current: number, count: number, loop: boolean): number {
  let diff = index - current;
  if (loop && count > 2) {
    if (diff > count / 2) diff -= count;
    if (diff <= -count / 2) diff += count;
  }
  return diff;
}

/** The items mounted around `current`: the page itself and `PAGE_RADIUS` on each side. */
export function pageWindow(current: number, count: number, loop: boolean): number[] {
  const out = new Set<number>();
  for (let step = -PAGE_RADIUS; step <= PAGE_RADIUS; step++) {
    let at = current + step;
    if (loop && count > 2) at = ((at % count) + count) % count;
    if (at >= 0 && at < count) out.add(at);
  }
  return [...out];
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** The largest box of `ratio` (width ÷ height) that fits inside `area` (`object-fit: contain`). */
export function fitBox(ratio: number, area: Size): Size {
  if (area.width <= 0 || area.height <= 0 || !(ratio > 0)) return { width: 0, height: 0 };
  return area.width / area.height > ratio
    ? { width: area.height * ratio, height: area.height }
    : { width: area.width, height: area.width / ratio };
}

/**
 * How far the centre of a `box` scaled by `scale` may move from the centre of `area`, per axis:
 * none while it is smaller than the area, else until its edge meets the area's edge.
 */
export function panLimit(box: Size, scale: number, area: Size): Point {
  return {
    x: Math.max(0, (box.width * scale - area.width) / 2),
    y: Math.max(0, (box.height * scale - area.height) / 2),
  };
}

/** A translation kept within `panLimit`. */
export function clampPan(pan: Point, box: Size, scale: number, area: Size): Point {
  const limit = panLimit(box, scale, area);
  return { x: clamp(pan.x, -limit.x, limit.x), y: clamp(pan.y, -limit.y, limit.y) };
}

/**
 * The translation that keeps `focus` (a point relative to the area's centre) over the same spot
 * of the content while the scale goes from `from` to `to`.
 */
export function zoomAbout(pan: Point, from: number, to: number, focus: Point): Point {
  const k = to / from;
  return { x: focus.x - (focus.x - pan.x) * k, y: focus.y - (focus.y - pan.y) * k };
}

/** A scale past `[min, max]` softened like a rubber band: a pinch resists beyond its range. */
export function softScale(scale: number, min: number, max: number): number {
  if (scale < min) return min * (scale / min) ** 0.5;
  if (scale > max) return max * (scale / max) ** 0.5;
  return scale;
}

/** The scale at which the box covers the area: a portrait on a wide screen fills it edge to edge. */
export function coverScale(box: Size, area: Size): number {
  if (box.width <= 0 || box.height <= 0) return 1;
  return Math.max(area.width / box.width, area.height / box.height);
}

/** `cubic-bezier(x1, y1, x2, y2)` as a function of time 0…1 (Newton, then bisection). */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1;
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1;
  const c = (p1: number) => 3 * p1;
  const at = (t: number, p1: number, p2: number) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t: number, p1: number, p2: number) =>
    3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (at(t, x1, x2) - x) / s;
    }
    if (t < 0 || t > 1 || Math.abs(at(t, x1, x2) - x) > 1e-4) {
      let lo = 0;
      let hi = 1;
      t = x;
      for (let i = 0; i < 24; i++) {
        if (at(t, x1, x2) < x) lo = t;
        else hi = t;
        t = (lo + hi) / 2;
      }
    }
    return at(t, y1, y2);
  };
}

/** `--prime-motion-easing-emphasized` (the iOS sheet curve): open and close glide on it. */
export const emphasized = cubicBezier(0.32, 0.72, 0, 1);

/** Velocity over the last stretch of a drag from timestamped samples, px/ms per axis. */
export type Sample = { t: number; x: number; y: number };

/** The window a release velocity is read over: the flick, not the whole drag. */
const VELOCITY_WINDOW_MS = 100;

export function releaseVelocity(samples: readonly Sample[], now: number): Point {
  const recent = samples.filter((sample) => now - sample.t <= VELOCITY_WINDOW_MS);
  const first = recent[0];
  const last = recent[recent.length - 1];
  if (!first || !last || last.t - first.t <= 0) return { x: 0, y: 0 };
  // A finger that stopped before lifting carries no momentum.
  if (now - last.t > 50) return { x: 0, y: 0 };
  const dt = last.t - first.t;
  return { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt };
}
