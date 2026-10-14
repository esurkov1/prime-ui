/*
 * Geometry of a Sparkline in a 0–100 box: the scale, the x of each point and the paths of the
 * line and its area. Pure functions, computed once per series (memoized by the component), so
 * scrubbing never rebuilds a path.
 */

/** `smooth`: a monotone cubic through every point. `linear`: straight segments. `step`: a level per point, changing halfway between points. */
export type SparklineCurve = "smooth" | "linear" | "step";

type Point = readonly [x: number, y: number];

/** Two decimals in a 0–100 box are below a pixel at any plot width; keeps `d` short. */
const r = (n: number) => Math.round(n * 100) / 100;

function linear(points: Point[]): string {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${r(x)},${r(y)}`).join("");
}

function step(points: Point[]): string {
  let d = `M${r(points[0][0])},${r(points[0][1])}`;
  for (let i = 1; i < points.length; i++) {
    const mid = r((points[i - 1][0] + points[i][0]) / 2);
    d += `H${mid}V${r(points[i][1])}H${r(points[i][0])}`;
  }
  return d;
}

/**
 * Monotone cubic interpolation along x (Steffen 1990, the method of d3 `curveMonotoneX`): the curve
 * passes through every point and never rises above a peak or dips below a trough between two
 * points, so a smooth line keeps the true extremes. Tangents are linear in the slopes, so the
 * shape survives the stretched viewBox (any independent x / y scaling).
 */
function smooth(points: Point[]): string {
  const n = points.length;
  if (n < 3) return linear(points);
  const tangent = new Array<number>(n);
  for (let i = 1; i < n - 1; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const h0 = x1 - x0;
    const h1 = x2 - x1;
    const s0 = (y1 - y0) / h0;
    const s1 = (y2 - y1) / h1;
    const p = (s0 * h1 + s1 * h0) / (h0 + h1);
    tangent[i] =
      (Math.sign(s0) + Math.sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p));
  }
  // The ends take the one-sided tangent that keeps the first and last pieces monotone.
  const end = (a: Point, b: Point, inner: number) =>
    ((3 * (b[1] - a[1])) / (b[0] - a[0]) - inner) / 2;
  tangent[0] = end(points[0], points[1], tangent[1]);
  tangent[n - 1] = end(points[n - 2], points[n - 1], tangent[n - 2]);

  let d = `M${r(points[0][0])},${r(points[0][1])}`;
  for (let i = 1; i < n; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const dx = (x1 - x0) / 3;
    d += `C${r(x0 + dx)},${r(y0 + dx * tangent[i - 1])},${r(x1 - dx)},${r(y1 - dx * tangent[i])},${r(x1)},${r(y1)}`;
  }
  return d;
}

const CURVES: Record<SparklineCurve, (points: Point[]) => string> = { smooth, linear, step };

export type SparklineScale = {
  /** Lower and upper end of the value axis. */
  lo: number;
  hi: number;
};

/**
 * The value axis: the data, widened to `min` / `max` (a scale shared by several sparklines), the
 * reference line and — for bars — zero. Data outside `min` / `max` widens the scale instead of
 * being cut.
 */
export function scaleOf(
  values: readonly (number | null)[],
  extra: readonly (number | undefined)[],
): SparklineScale {
  let lo = Number.POSITIVE_INFINITY;
  let hi = Number.NEGATIVE_INFINITY;
  for (const value of [...values, ...extra]) {
    if (value === null || value === undefined || !Number.isFinite(value)) continue;
    if (value < lo) lo = value;
    if (value > hi) hi = value;
  }
  return lo > hi ? { lo: 0, hi: 1 } : { lo, hi };
}

/** Share of the height from the top (0) to the bottom (1); a flat series sits in the middle. */
export function yOf({ lo, hi }: SparklineScale, value: number): number {
  return hi === lo ? 0.5 : 1 - (value - lo) / (hi - lo);
}

/** Runs of consecutive present points: a `null` value breaks the line. */
export function runsOf(values: readonly (number | null)[]): number[][] {
  const runs: number[][] = [];
  let run: number[] = [];
  values.forEach((value, i) => {
    if (value === null) {
      if (run.length) runs.push(run);
      run = [];
    } else run.push(i);
  });
  if (run.length) runs.push(run);
  return runs;
}

export type SparklinePaths = {
  /** The line: one subpath per run of two or more points. */
  line: string;
  /** The area under the line, closed down to the bottom edge. */
  area: string;
  /** Points standing alone between gaps: drawn as dots, a path would not show them. */
  lone: number[];
};

export function pathsOf(
  values: readonly (number | null)[],
  x: (i: number) => number,
  y: (value: number) => number,
  curve: SparklineCurve,
): SparklinePaths {
  let line = "";
  let area = "";
  const lone: number[] = [];
  for (const run of runsOf(values)) {
    if (run.length === 1) {
      lone.push(run[0]);
      continue;
    }
    const points = run.map((i) => [x(i) * 100, y(values[i] as number) * 100] as const);
    const d = CURVES[curve](points);
    line += d;
    area += `${d}L${r(points[points.length - 1][0])},100L${r(points[0][0])},100Z`;
  }
  return { line, area, lone };
}
