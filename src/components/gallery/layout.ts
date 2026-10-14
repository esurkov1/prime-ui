/**
 * The album layout of a gallery, from the aspect ratios of its items alone — nothing is measured,
 * so every tile has its final box before a byte loads.
 *
 * The geometry is the messenger album's: the orientation of each item (`w` wide, `n` narrow, `q`
 * about square) and the average ratio pick the shape for 2–4 items (side by side, stacked, a tall
 * one beside a column, a wide one over a row); 5–10 items are laid out in rows, the partition
 * chosen by how close the album comes to a square and how even its rows are, fewer items above
 * more and rows of like heights. Everything is computed on a box of width 1; gaps are not part of the math (the tiles are
 * inset by half a gap at every inner edge in CSS).
 */

/** A tile in fractions of the gallery's box: `x` and `w` of its width, `y` and `h` of its height. */
export type GalleryTile = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type GalleryLayout = {
  /** Width ÷ height of the whole gallery. */
  ratio: number;
  /**
   * The share of the size cap the gallery is wide: below 1 for a lone portrait (its height reaches
   * the cap instead), else 1.
   */
  widthFactor: number;
  tiles: GalleryTile[];
};

/** At most this many items are laid out. */
const GALLERY_MAX = 10;

/** The tallest an album of 2–4 is, in widths (the media cap is a square). */
const MAX_H = 1;
/** The narrowest tile of a shaped album, in widths. */
const MIN_W = 0.25;
/** A row of a larger album shorter than this (in widths) is penalised. */
const MIN_ROW = 0.2;
/** How much uneven row heights count against a partition, beside its distance from a square. */
const SPREAD_WEIGHT = 0.15;

type Rect = { x: number; y: number; w: number; h: number };

/** Width ÷ height of an item, kept between a tall portrait and a wide panorama. */
export function itemRatio(width: number | undefined, height: number | undefined, single: boolean) {
  const raw = width && height ? width / height : 4 / 3;
  const [min, max] = single ? [0.6, 1.8] : [0.5, 2];
  return Math.min(max, Math.max(min, raw));
}

const orientationOf = (ratio: number) => (ratio > 1.2 ? "w" : ratio < 0.8 ? "n" : "q");

/** Rects in a box of `width` × `height` (absolute units) → tiles in fractions of that box. */
function normalise(rects: Rect[], width: number, height: number, widthFactor = 1): GalleryLayout {
  return {
    ratio: width / height,
    widthFactor,
    tiles: rects.map((rect) => ({
      x: rect.x / width,
      y: rect.y / height,
      w: rect.w / width,
      h: rect.h / height,
    })),
  };
}

function two([a, b]: [number, number]): GalleryLayout {
  const shape = orientationOf(a) + orientationOf(b);
  const average = (a + b) / 2;
  if (shape === "ww" && average > 1.4 && Math.abs(a - b) < 0.2) {
    // Two wide ones of one shape: stacked, full width.
    const h = Math.min(1 / a, 1 / b, MAX_H / 2);
    return normalise(
      [
        { x: 0, y: 0, w: 1, h },
        { x: 0, y: h, w: 1, h },
      ],
      1,
      2 * h,
    );
  }
  if (shape === "ww" || shape === "qq") {
    // Two of one kind: halves side by side.
    const h = Math.min(0.5 / a, 0.5 / b, MAX_H);
    return normalise(
      [
        { x: 0, y: 0, w: 0.5, h },
        { x: 0.5, y: 0, w: 0.5, h },
      ],
      1,
      h,
    );
  }
  // Different shapes: side by side at one height, each as wide as its ratio asks.
  const second = Math.max(0.4, b / (a + b));
  const first = 1 - second;
  const h = Math.min(MAX_H, first / a, second / b);
  return normalise(
    [
      { x: 0, y: 0, w: first, h },
      { x: first, y: 0, w: second, h },
    ],
    1,
    h,
  );
}

function three([a, b, c]: [number, number, number]): GalleryLayout {
  if (orientationOf(a) === "n") {
    // A tall first one at the start, the other two stacked beside it.
    const third = Math.min(MAX_H * 0.5, b / (c + b));
    const second = MAX_H - third;
    const right = Math.max(MIN_W, Math.min(0.5, Math.min(third * c, second * b)));
    const left = Math.min(MAX_H * a, 1 - right);
    return normalise(
      [
        { x: 0, y: 0, w: left, h: MAX_H },
        { x: left, y: 0, w: right, h: second },
        { x: left, y: second, w: right, h: third },
      ],
      left + right,
      MAX_H,
    );
  }
  // A wide first one on top, the other two side by side under it.
  const top = Math.min(1 / a, MAX_H * 0.66);
  const bottom = Math.min(MAX_H - top, 0.5 / b, 0.5 / c);
  return normalise(
    [
      { x: 0, y: 0, w: 1, h: top },
      { x: 0, y: top, w: 0.5, h: bottom },
      { x: 0.5, y: top, w: 0.5, h: bottom },
    ],
    1,
    top + bottom,
  );
}

function four([a, b, c, d]: [number, number, number, number]): GalleryLayout {
  if (orientationOf(a) === "w") {
    // A wide first one on top, three in a row under it.
    const top = Math.min(1 / a, MAX_H * 0.66);
    const bottom = Math.min(MAX_H - top, 1 / (b + c + d));
    const w1 = Math.max(MIN_W, bottom * b);
    const w2 = Math.max(MIN_W, bottom * c);
    const w3 = Math.max(MIN_W, 1 - w1 - w2);
    const width = w1 + w2 + w3;
    return normalise(
      [
        { x: 0, y: 0, w: width, h: top },
        { x: 0, y: top, w: w1, h: bottom },
        { x: w1, y: top, w: w2, h: bottom },
        { x: w1 + w2, y: top, w: w3, h: bottom },
      ],
      width,
      top + bottom,
    );
  }
  // A tall first one at the start, three stacked beside it.
  const right = Math.max(MIN_W, Math.min(0.5, MAX_H / (1 / b + 1 / c + 1 / d)));
  const left = Math.min(MAX_H * a, 1 - right);
  const raw = [right / b, right / c, right / d];
  const sum = raw[0] + raw[1] + raw[2];
  const [h1, h2, h3] = raw.map((h) => (h * MAX_H) / sum) as [number, number, number];
  return normalise(
    [
      { x: 0, y: 0, w: left, h: MAX_H },
      { x: left, y: 0, w: right, h: h1 },
      { x: left, y: h1, w: right, h: h2 },
      { x: left, y: h1 + h2, w: right, h: h3 },
    ],
    left + right,
    MAX_H,
  );
}

/** Every way to split `count` items into 1–4 rows of 1–4 items, top to bottom. */
function partitions(count: number): number[][] {
  const out: number[][] = [];
  const walk = (left: number, rows: number[]) => {
    if (left === 0) {
      out.push(rows);
      return;
    }
    if (rows.length === 4) return;
    for (let size = 1; size <= Math.min(4, left); size++) walk(left - size, [...rows, size]);
  };
  walk(count, []);
  return out;
}

/** 5–10 items (or any number the shapes do not cover): the best partition into rows. */
function rows(ratios: readonly number[]): GalleryLayout {
  const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length;
  // Cropped toward the album's own shape, so one odd item does not tear its row apart.
  const cropped = ratios.map((ratio) => (average > 1.1 ? Math.max(1, ratio) : Math.min(1, ratio)));
  let best: { score: number; counts: number[]; heights: number[] } | null = null;
  for (const counts of partitions(cropped.length)) {
    let next = 0;
    const heights = counts.map((count) => {
      const row = cropped.slice(next, next + count);
      next += count;
      return 1 / row.reduce((sum, ratio) => sum + ratio, 0);
    });
    const total = heights.reduce((sum, h) => sum + h, 0);
    // Close to a square, and rows of like heights: one tall row over a strip of slivers loses.
    const spread = Math.max(...heights) / Math.min(...heights) - 1;
    let score = Math.abs(total - MAX_H) + SPREAD_WEIGHT * spread;
    if (Math.min(...heights) < MIN_ROW) score *= 1.5;
    if (counts.some((count, index) => index > 0 && (counts[index - 1] as number) > count)) {
      score *= 1.5;
    }
    if (best === null || score < best.score) best = { score, counts, heights };
  }
  const chosen = best as { counts: number[]; heights: number[] };
  const rects: Rect[] = [];
  let y = 0;
  let next = 0;
  chosen.counts.forEach((count, row) => {
    const h = chosen.heights[row] as number;
    let x = 0;
    for (let i = 0; i < count; i++) {
      const w = (cropped[next + i] as number) * h;
      rects.push({ x, y, w, h });
      x += w;
    }
    // The last tile of a row closes it exactly (no sliver from rounding).
    const last = rects[rects.length - 1] as Rect;
    last.w = 1 - last.x;
    next += count;
    y += h;
  });
  return normalise(rects, 1, y);
}

/**
 * The layout of `ratios` (width ÷ height of each item, in order): the only place the album is
 * capped — items past `GALLERY_MAX` get no tile.
 */
export function layoutGallery(ratios: readonly number[]): GalleryLayout {
  const laid = ratios.slice(0, GALLERY_MAX);
  switch (laid.length) {
    case 0:
      return { ratio: 1, widthFactor: 1, tiles: [] };
    case 1: {
      const ratio = laid[0] as number;
      return {
        ratio,
        widthFactor: Math.min(1, ratio),
        tiles: [{ x: 0, y: 0, w: 1, h: 1 }],
      };
    }
    case 2:
      return two(laid as [number, number]);
    case 3:
      return three(laid as [number, number, number]);
    case 4:
      return four(laid as [number, number, number, number]);
    default:
      return rows(laid);
  }
}
