import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";

import { cx } from "./cx";
import { hasContent } from "./hasContent";
import { exitTimeoutMs, motionTiming, readCssDurationMs } from "./motionTiming";
import { handoffFocus } from "./overlay/focus";
import styles from "./RegionSwap.module.css";
import swapMotion from "./swapMotion.module.css";

/**
 * The key of the loading state (foundation §7 rule 8): a swap into or out of it is the Skeleton
 * handing over to the data in place — the height settles at once and the fade is short.
 */
const LOADING = "loading";

/** Whether a swap between these two state keys is a load (into or out of `"loading"`). */
const isLoad = (from: string | number | null, to: string | number) =>
  from === LOADING || to === LOADING;

/** The axis a swap glides the size along: the height (a region) or the width (a cell of a row). */
type SwapAxis = "block" | "inline";

type RegionSwapProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Key of what the region shows (`"loading"`, `"ready"`, `"empty"`, `"error"`, a record id). A new
   * value swaps the old content for the new one; the same value updates in place. `"loading"` is
   * the loading state: a swap into or out of it never glides the height.
   */
  state: string | number;
  /** The region takes its parent's height and every state fills it; the height never glides. */
  fill?: boolean;
  /**
   * `"block"` — a region: the height glides, both states hold to the top edge. `"inline"` — a cell
   * in a row (a control of a header's actions): the width glides, the states centre on the row's
   * line and hold to the `align` edge.
   */
  axis?: SwapAxis;
  /** The edge both states hold to while the size glides: the cell's alignment in its row. */
  align?: "start" | "end";
  /**
   * After a swap, once the new state is in the document (focus already handed off from a leaving
   * state): a host that moves focus or scrolls on a swap does it here.
   */
  onSwap?: (state: string | number) => void;
  /**
   * A block swap waits out `--prime-motion-swap-hold` before it moves (default). `false` for a
   * region whose state follows a person's choice directly (another month, another pane).
   */
  hold?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

type Layer = { key: string | number; children: React.ReactNode };

/** The size of `node` along `axis`. */
const sizeOf = (node: HTMLElement, axis: SwapAxis) =>
  node.getBoundingClientRect()[axis === "inline" ? "width" : "height"];

/** Sizes this close are one size: a swap between them only cross-fades (no layout motion). */
const GLIDE_TOLERANCE_PX = 2;

/** Drops a running glide or hold: the root takes its natural size in this frame. */
function settle(root: HTMLElement) {
  root.removeAttribute("data-resizing");
  root.style.removeProperty("--swap-size");
}

/** Holds `root` at `size` (the size on screen) while a swap waits out its hold. */
function hold(root: HTMLElement, size: number) {
  root.style.setProperty("--swap-size", `${size}px`);
  root.setAttribute("data-resizing", "true");
}

/**
 * Starts the size glide of `root` from `from` (the size on screen) to its natural size; returns its
 * cleanup. Content of the new state that settles later (a part portalled in, an image) moves the
 * target, and the running glide turns to it from where it is.
 */
function glide(
  root: HTMLElement,
  from: number,
  axis: SwapAxis,
  incoming: HTMLElement | undefined,
): (() => void) | undefined {
  settle(root);
  const to = sizeOf(root, axis);
  if (Math.abs(from - to) <= GLIDE_TOLERANCE_PX) return;
  hold(root, from);
  root.getBoundingClientRect(); // commit the start size before the transition target
  root.style.setProperty("--swap-size", `${to}px`);
  const property = axis === "inline" ? "width" : "height";
  let target = to;
  let base = incoming ? sizeOf(incoming, axis) : 0;
  let timeout = 0;
  const finish = () => {
    stop();
    settle(root);
  };
  const arm = () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(finish, exitTimeoutMs("base"));
  };
  const onEnd = (event: TransitionEvent) => {
    if (event.target === root && event.propertyName === property) finish();
  };
  const observer =
    incoming && typeof ResizeObserver === "function"
      ? new ResizeObserver(() => {
          const size = sizeOf(incoming, axis);
          if (Math.abs(size - base) < 1) return;
          target += size - base;
          base = size;
          root.style.setProperty("--swap-size", `${target}px`);
          arm();
        })
      : null;
  observer?.observe(incoming as HTMLElement);
  root.addEventListener("transitionend", onEnd);
  arm();
  function stop() {
    observer?.disconnect();
    root.removeEventListener("transitionend", onEnd);
    window.clearTimeout(timeout);
  }
  return stop;
}

/** The fade a layer runs now (or the value it is frozen at), and where it ends. */
const fades = new WeakMap<Element, Animation>();
const fadeTargets = new WeakMap<Element, number>();

/**
 * The opacity of a layer on screen: mid-fade the running value (a reversed swap continues from
 * it), else where its last fade ended; 1 for a layer that never faded.
 */
function opacityOf(node: HTMLElement): number {
  if (fades.get(node)?.effect) {
    const value = Number.parseFloat(getComputedStyle(node).opacity);
    if (Number.isFinite(value)) return value;
  }
  return fadeTargets.get(node) ?? 1;
}

const canAnimate = (node: HTMLElement) => typeof node.animate === "function";

/** Holds a layer at `value` (the old state shown, the new one unseen) while a swap waits. */
function freeze(node: HTMLElement, value: number) {
  fades.get(node)?.cancel();
  fadeTargets.set(node, value);
  if (!canAnimate(node)) return;
  fades.set(node, node.animate([{ opacity: value }, { opacity: value }], { fill: "forwards" }));
}

/**
 * Fades a layer to `target` from the opacity it shows now, over the part of the `clock` that the
 * distance takes: a swap that turns back mid-fade reverses in place, never restarts from 0 or 1.
 * `done` runs once the layer is there.
 */
function fadeTo(node: HTMLElement, target: 0 | 1, clock: "base" | "fast", done?: () => void) {
  const from = opacityOf(node);
  fades.get(node)?.cancel();
  fades.delete(node);
  fadeTargets.set(node, target);
  if (Math.abs(from - target) < 0.01 || !canAnimate(node)) {
    done?.();
    return;
  }
  const duration = readCssDurationMs(`--prime-motion-fade-${clock}`) * Math.abs(target - from);
  const { easing } = motionTiming("fast", target === 1 ? "enter" : "exit");
  const fade = node.animate([{ opacity: from }, { opacity: target }], {
    duration,
    ...(easing ? { easing } : {}),
    fill: "both",
  });
  fades.set(node, fade);
  fade.addEventListener("finish", () => {
    if (fades.get(node) !== fade) return;
    fades.delete(node);
    // Shown: nothing stays applied, so the layer keeps no stacking context.
    if (target === 1) fade.cancel();
    done?.();
  });
}

/**
 * The region swap of the kit (foundation §7 rule 8): a region that changes what it shows (loading /
 * data / empty / error, another record) cross-fades — the old content stays as a leaving layer over
 * the new one and fades out (`fast` · exit) while the new one fades in. Between settled states the
 * new one fades in on `base` and the region glides from the height on screen to the new one, the
 * "height glide" exception of foundation §7 rule 5; heights within `GLIDE_TOLERANCE_PX` only
 * cross-fade. A swap into or out of `"loading"` is a load: the Skeleton and the data replace each
 * other in place — the height settles in one frame (the old layer clipped to it) and the fade is
 * short (`fast`). Nothing moves on the first render. Focus in the leaving state moves into the new
 * one (`handoffFocus`). Under reduced motion the old state goes at once and the height jumps; the
 * new one still fades in (rule 12). A region with nothing to show takes no room. `Crossfade` is
 * this region, public.
 *
 * Every motion continues from where it is. The fades are the region's own (WAAPI from the opacity
 * on screen) and the height a transition, so a swap that turns back mid-motion — to a state still
 * fading out — reverses both in place: no restart from 0, no dip, no jump.
 *
 * A block swap waits out `--prime-motion-swap-hold` before it moves (`hold`): the old state stays
 * on screen and the region keeps its height while the new one, already in the document, is
 * unseen. A state that turns back within the hold is the old one again — not a frame of motion;
 * another state within it replaces the one that waited. The target height is measured once the
 * hold is over, when the new content has settled (a part portalled in on its second render), and
 * a glide follows the new content's later size changes from where it is. A swap out of
 * `"loading"` (the data arriving), a return to a state still on screen and an inline swap move at
 * once; `hold={false}` for a swap that follows a person's choice (another month, another pane).
 *
 * `axis="inline"` is the content swap of one cell in a row (`src/internal/rowCells`): the same
 * cross-fade, the width gliding instead of the height, both states held to the cell's `align`
 * edge, so whatever stands beyond that edge never moves.
 */
export function RegionSwap({
  state,
  fill = false,
  axis = "block",
  align = "start",
  hold: holdSwaps = true,
  onSwap,
  children,
  className,
  ref,
  ...rest
}: RegionSwapProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  /** Children of the current state from the last commit: what the leaving layer keeps showing. */
  const childrenRef = React.useRef(children);
  const layerRefs = React.useRef(new Map<string | number, HTMLDivElement>());
  const [current, setCurrent] = React.useState(state);
  /**
   * `from`: the state on screen when the swap began; `left`: the layer that left in it (`null`
   * when nothing was drawn); `held`: the swap waits out its hold.
   */
  const [swap, setSwap] = React.useState<{
    count: number;
    from: string | number | null;
    left: string | number | null;
    held: boolean;
  }>({ count: 0, from: null, left: null, held: false });
  const [leaving, setLeaving] = React.useState<Layer[]>([]);

  // Derived during render: the old content stays mounted (same key, same instance) as a layer, and
  // a state that comes back takes its leaving layer back.
  if (state !== current) {
    const onScreen = swap.held ? swap.from : current;
    const returning = state === onScreen || leaving.some((layer) => layer.key === state);
    const drawn = hasContent(childrenRef.current);
    setLeaving((list) => [
      ...list.filter((layer) => layer.key !== state && layer.key !== current),
      ...(drawn ? [{ key: current, children: childrenRef.current }] : []),
    ]);
    setSwap((last) => ({
      count: last.count + 1,
      from: onScreen,
      left: drawn ? current : null,
      held: holdSwaps && axis === "block" && !returning && onScreen !== LOADING,
    }));
    setCurrent(state);
  }

  React.useLayoutEffect(() => {
    childrenRef.current = children;
  });

  const latest = React.useRef({ state, fill, axis, onSwap, leaving });
  latest.current = { state, fill, axis, onSwap, leaving };
  const handedOff = React.useRef(0);

  const removeLayer = React.useCallback((key: string | number) => {
    setLeaving((list) => list.filter((layer) => layer.key !== key));
  }, []);

  // The swap is in the document: hand focus over; while it waits, hold the old state and the size
  // on screen; then fade every layer to where it belongs from where it is and glide the size
  // between settled states (a load settles it at once; under reduced motion the old state also
  // goes before the new one is painted).
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (swap.count === 0 || !root) return;
    const { state, fill, axis, leaving } = latest.current;
    const incoming = layerRefs.current.get(state);
    const left = swap.left === null ? undefined : layerRefs.current.get(swap.left);
    if (handedOff.current !== swap.count) {
      handedOff.current = swap.count;
      handoffFocus(left, incoming ?? root);
      latest.current.onSwap?.(state);
    }
    // The size on screen: mid-glide or held the root's, else the old content's (the leaving
    // layer, laid over in place), else nothing (the region had no box).
    const onScreen = () =>
      root.hasAttribute("data-resizing") ? sizeOf(root, axis) : left ? sizeOf(left, axis) : 0;
    if (swap.held) {
      hold(root, onScreen());
      if (incoming) freeze(incoming, 0);
      for (const layer of leaving) {
        const node = layerRefs.current.get(layer.key);
        if (!node) continue;
        // A state that waited and was never seen goes at once; the one on screen stands still.
        if (opacityOf(node) < 0.01) removeLayer(layer.key);
        else if (node === left) freeze(node, opacityOf(node));
      }
      return;
    }
    const load = isLoad(swap.from, state);
    if (incoming) {
      // A layer that never faded is new: it fades in from nothing.
      if (!fadeTargets.has(incoming)) fadeTargets.set(incoming, 0);
      fadeTo(incoming, 1, load ? "fast" : "base");
    }
    if (prefersReducedMotion()) {
      for (const layer of leaving) {
        const node = layerRefs.current.get(layer.key);
        if (node) fadeTargets.set(node, 0);
      }
      setLeaving([]);
      settle(root);
      return;
    }
    for (const layer of leaving) {
      const node = layerRefs.current.get(layer.key);
      if (node) fadeTo(node, 0, "fast", () => removeLayer(layer.key));
    }
    if (fill || load) {
      settle(root);
      return;
    }
    return glide(root, onScreen(), axis, incoming);
  }, [swap, removeLayer]);

  // The hold runs out: the swap moves.
  React.useEffect(() => {
    if (!swap.held) return;
    const { count } = swap;
    const id = window.setTimeout(
      () => setSwap((last) => (last.count === count ? { ...last, held: false } : last)),
      readCssDurationMs("--prime-motion-swap-hold"),
    );
    return () => window.clearTimeout(id);
  }, [swap]);

  // Fallback when no fade ends (hidden tab, display: none).
  React.useEffect(() => {
    if (leaving.length === 0 || swap.held) return;
    const keys = new Set(leaving.map((layer) => layer.key));
    const id = window.setTimeout(
      () => setLeaving((list) => list.filter((layer) => !keys.has(layer.key))),
      exitTimeoutMs("fast"),
    );
    return () => window.clearTimeout(id);
  }, [leaving, swap.held]);

  const layerRef = (key: string | number) => (node: HTMLDivElement | null) => {
    if (node) layerRefs.current.set(key, node);
    else layerRefs.current.delete(key);
  };

  // One keyed list: a layer keeps its instance when it moves between current and leaving.
  const layers = [
    ...leaving.map((layer) => (
      <div
        key={`state-${String(layer.key)}`}
        ref={layerRef(layer.key)}
        className={cx(styles.layer, styles.leaving)}
        data-state="closed"
        aria-hidden="true"
        inert
      >
        {layer.children}
      </div>
    )),
    // An empty state draws no layer: with no leaving layer either, the root is `:empty` and hides.
    hasContent(children) ? (
      <div
        key={`state-${String(state)}`}
        ref={layerRef(state)}
        className={styles.layer}
        data-state="open"
      >
        {children}
      </div>
    ) : null,
  ];

  return (
    <div
      {...rest}
      ref={mergedRef}
      className={cx(styles.root, className)}
      data-fill={fill ? "true" : undefined}
      data-axis={axis}
      data-align={align}
      data-held={swap.held ? "true" : undefined}
      data-swapping={leaving.length > 0 ? "true" : undefined}
    >
      {layers}
    </div>
  );
}

type SwapIn = {
  /** Key of the swapped content: it remounts under a new state. `undefined` before the first swap. */
  key: string | undefined;
  /**
   * The fade-in of the new state: `swapMotion.settleIn` into or out of `"loading"`, else
   * `swapMotion.swapIn`; `undefined` before the first swap.
   */
  className: string | undefined;
  /** The state on screen: the old one while a swap waits out its hold. */
  state: string | number;
  /** What to render: the content of the state on screen (the old content while a swap waits). */
  content: React.ReactNode;
};

/**
 * The region swap in place, for a host whose states cannot be laid over each other: a part of a
 * header, a KPI value, the phrasing content of a button. The host renders the state `state` (the
 * one on screen) under `key` with `className`, and for a data state its `content` (the data it
 * passed, held from the state on screen): the new state remounts and fades in (short into or out
 * of `"loading"`); nothing fades out and the height does not glide. A swap out of a settled state
 * waits out `--prime-motion-swap-hold` with the old state and content on screen, so a quiet
 * refetch (data → loading → data within it) never shows its Skeleton; the data arriving out of
 * `"loading"` shows at once. `hold = false` for a host whose other parts follow the state at once. Nothing moves on the
 * first render. Every other region is a `RegionSwap`.
 */
export function useSwapIn(state: string | number, content?: React.ReactNode, hold = true): SwapIn {
  const [shown, setShown] = React.useState<{
    state: string | number;
    from: string | number | null;
  }>({ state, from: null });
  /** The content of the state on screen from the last commit: what a waiting swap keeps showing. */
  const shownContent = React.useRef(content);
  const latestState = React.useRef(state);
  latestState.current = state;
  const waiting = hold && state !== shown.state && shown.state !== LOADING;
  // Derived during render: the swapped content mounts with its fade in the same commit.
  const now = state === shown.state || waiting ? shown : { state, from: shown.state };
  if (now !== shown) setShown(now);

  React.useLayoutEffect(() => {
    if (!waiting) shownContent.current = content;
  });

  React.useEffect(() => {
    if (!waiting) return;
    const id = window.setTimeout(
      () =>
        setShown((last) =>
          latestState.current === last.state
            ? last
            : { state: latestState.current, from: last.state },
        ),
      readCssDurationMs("--prime-motion-swap-hold"),
    );
    return () => window.clearTimeout(id);
  }, [waiting]);

  const visible = waiting ? shownContent.current : content;
  if (now.from === null) {
    return { key: undefined, className: undefined, state: now.state, content: visible };
  }
  return {
    key: String(now.state),
    className: isLoad(now.from, now.state) ? swapMotion.settleIn : swapMotion.swapIn,
    state: now.state,
    content: visible,
  };
}
