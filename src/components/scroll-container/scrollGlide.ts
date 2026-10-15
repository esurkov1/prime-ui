import { motionDurationMs } from "@/internal/motionTiming";

/** How deep under the region its snap areas are looked for (a host aligns deeper items itself). */
const SNAP_DEPTH = 4;

export type ScrollAxis = "x" | "y";

const px = (value: string) => Number.parseFloat(value) || 0;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const isRtl = (node: HTMLElement) => getComputedStyle(node).direction === "rtl";

/** Distance from the start along `axis`, whatever the direction (RTL `scrollLeft` is negative). */
export function scrollPosition(node: HTMLElement, axis: ScrollAxis): number {
  return axis === "x" ? Math.abs(node.scrollLeft) : node.scrollTop;
}

export function scrollMax(node: HTMLElement, axis: ScrollAxis): number {
  return axis === "x" ? node.scrollWidth - node.clientWidth : node.scrollHeight - node.clientHeight;
}

function setScrollPosition(node: HTMLElement, axis: ScrollAxis, at: number) {
  if (axis === "y") node.scrollTop = at;
  else node.scrollLeft = isRtl(node) ? -at : at;
}

/**
 * The positions the region comes to rest at along `axis` (distance from its start): every element
 * within `SNAP_DEPTH` levels that has a `scroll-snap-align` on that axis, clamped to the range and
 * clear of the region's `scroll-padding`.
 */
export function restPoints(node: HTMLElement, axis: ScrollAxis): number[] {
  const max = scrollMax(node, axis);
  const box = node.getBoundingClientRect();
  const style = getComputedStyle(node);
  const x = axis === "x";
  const rtl = x && isRtl(node);
  const padStart = px(x ? style.scrollPaddingInlineStart : style.scrollPaddingBlockStart);
  const padEnd = px(x ? style.scrollPaddingInlineEnd : style.scrollPaddingBlockEnd);
  const view = x ? node.clientWidth : node.clientHeight;
  const scrolled = scrollPosition(node, axis);
  const found = new Set<number>();

  const visit = (parent: Element, depth: number) => {
    for (const child of Array.from(parent.children)) {
      // `scroll-snap-align: <block> <inline>`; one value stands for both.
      const tokens = getComputedStyle(child).scrollSnapAlign.split(" ");
      const align = x ? (tokens[1] ?? tokens[0]) : tokens[0];
      if (align && align !== "none") {
        const rect = child.getBoundingClientRect();
        const start =
          (x ? (rtl ? box.right - rect.right : rect.left - box.left) : rect.top - box.top) +
          scrolled;
        const length = x ? rect.width : rect.height;
        const at =
          align === "start"
            ? start - padStart
            : align === "end"
              ? start + length - view + padEnd
              : start + length / 2 - view / 2;
        found.add(Math.round(Math.min(max, Math.max(0, at))));
      }
      if (depth < SNAP_DEPTH) visit(child, depth + 1);
    }
  };
  visit(node, 1);
  return [...found].sort((a, b) => a - b);
}

export type Glide = {
  /** Glides `axis` to `to` on the kit's frames (instant under reduced motion). */
  to: (axis: ScrollAxis, to: number) => void;
  /** Stops where it is: the person takes over. */
  stop: () => void;
  /** Where a glide on `axis` is heading; `null` when none is. */
  target: (axis: ScrollAxis) => number | null;
  /** Whether a scroll event at this moment is the glide's own. */
  owns: () => boolean;
};

/**
 * A scroll glide on animation frames, never a smooth `scrollTo`: an engine finishes that against
 * the person's input, while this stops the moment they take over. A new target retargets from where
 * the glide is.
 */
export function createGlide(node: HTMLElement): Glide {
  let frame = 0;
  const targets: Record<ScrollAxis, number | null> = { x: null, y: null };
  /** The last position the glide wrote: its scroll event arrives after it. */
  const written: Record<ScrollAxis, number | null> = { x: null, y: null };

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    targets.x = null;
    targets.y = null;
  };

  const to = (axis: ScrollAxis, target: number) => {
    cancelAnimationFrame(frame);
    const from = scrollPosition(node, axis);
    const duration = motionDurationMs("slow");
    targets[axis] = target;
    if (duration <= 0 || Math.abs(target - from) < 0.5) {
      written[axis] = target;
      setScrollPosition(node, axis, target);
      stop();
      return;
    }
    const started = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - started) / duration));
      const at = from + (target - from) * easeOut(t);
      written[axis] = at;
      setScrollPosition(node, axis, at);
      if (t < 1) frame = requestAnimationFrame(step);
      else stop();
    };
    frame = requestAnimationFrame(step);
  };

  const owns = () => {
    if (frame) return true;
    return (["x", "y"] as const).some((axis) => {
      const at = written[axis];
      written[axis] = null;
      return at !== null && Math.abs(scrollPosition(node, axis) - at) < 1;
    });
  };

  return { to, stop, target: (axis) => targets[axis], owns };
}
