import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";
import { prefersReducedMotion } from "@/hooks/usePresence";

import { cx } from "./cx";
import { hasContent } from "./hasContent";
import { exitTimeoutMs } from "./motionTiming";
import { handoffFocus } from "./overlay/focus";
import styles from "./RegionSwap.module.css";
import swapMotion from "./swapMotion.module.css";

type RegionSwapProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Key of what the region shows (`"loading"`, `"ready"`, `"empty"`, `"error"`, a record id). A new
   * value swaps the old content for the new one; the same value updates in place.
   */
  state: string | number;
  /** The region takes its parent's height and every state fills it; the height never glides. */
  fill?: boolean;
  /**
   * After a swap, once the new state is in the document (focus already handed off from a leaving
   * state): a host that moves focus or scrolls on a swap does it here.
   */
  onSwap?: (state: string | number) => void;
  ref?: React.Ref<HTMLDivElement>;
};

type Layer = { key: string | number; children: React.ReactNode };

/** Starts the height glide of `root` from `from` to its natural height; returns its cleanup. */
function glide(root: HTMLElement, from: number): (() => void) | undefined {
  root.removeAttribute("data-resizing");
  root.style.removeProperty("--swap-height");
  const to = root.getBoundingClientRect().height;
  if (Math.abs(from - to) < 1) return;
  const finish = () => {
    root.removeAttribute("data-resizing");
    root.style.removeProperty("--swap-height");
  };
  root.style.setProperty("--swap-height", `${from}px`);
  root.setAttribute("data-resizing", "true");
  root.getBoundingClientRect(); // commit the start height before the transition target
  root.style.setProperty("--swap-height", `${to}px`);
  const onEnd = (event: TransitionEvent) => {
    if (event.target === root && event.propertyName === "height") finish();
  };
  root.addEventListener("transitionend", onEnd);
  const id = window.setTimeout(finish, exitTimeoutMs("base"));
  return () => {
    root.removeEventListener("transitionend", onEnd);
    window.clearTimeout(id);
  };
}

/**
 * The region swap of the kit (foundation §7 rule 8): a region that changes what it shows (loading /
 * data / empty / error, another record) cross-fades — the old content stays as a leaving layer over
 * the new one and fades out (`swapMotion.swapOut`, `fast` · exit) while the new one fades in
 * (`swapMotion.swapIn`, `base` · enter) — and glides from the old height to the new one, the
 * "height glide" exception of foundation §7 rule 5. Nothing moves on the first render. Focus in
 * the leaving state moves into the new one (`handoffFocus`). Under reduced motion the old state
 * goes at once and the height jumps; the new one still fades in (rule 12). A region with nothing
 * to show takes no room. `Crossfade` is this region, public.
 */
export function RegionSwap({
  state,
  fill = false,
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
  const [swap, setSwap] = React.useState<{ count: number; outgoing: string | number | null }>({
    count: 0,
    outgoing: null,
  });
  const [leaving, setLeaving] = React.useState<Layer[]>([]);

  // Derived during render: the old content stays mounted (same key, same instance) as a layer.
  if (state !== current) {
    const shown = hasContent(childrenRef.current);
    setLeaving((list) => [
      ...list.filter((layer) => layer.key !== state && layer.key !== current),
      ...(shown ? [{ key: current, children: childrenRef.current }] : []),
    ]);
    setSwap((last) => ({ count: last.count + 1, outgoing: shown ? current : null }));
    setCurrent(state);
  }

  React.useLayoutEffect(() => {
    childrenRef.current = children;
  });

  const latest = React.useRef({ state, fill, onSwap });
  latest.current = { state, fill, onSwap };

  // The swap is in the document: hand focus over, then glide the height (or, under reduced
  // motion, drop the old state before it is painted).
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (swap.count === 0 || !root) return;
    const outgoing = swap.outgoing === null ? null : layerRefs.current.get(swap.outgoing);
    const incoming = layerRefs.current.get(latest.current.state);
    handoffFocus(outgoing ?? null, incoming ?? root);
    let cleanup: (() => void) | undefined;
    if (prefersReducedMotion()) {
      setLeaving([]);
    } else if (!latest.current.fill) {
      // The height on screen: mid-glide the running one, else the old content's (the leaving
      // layer, laid over at the same width), else nothing (the region had no box).
      const from = root.hasAttribute("data-resizing")
        ? root.getBoundingClientRect().height
        : (outgoing?.getBoundingClientRect().height ?? 0);
      cleanup = glide(root, from);
    }
    latest.current.onSwap?.(latest.current.state);
    return cleanup;
  }, [swap]);

  // Fallback when no `animationend` arrives (hidden tab, display: none).
  React.useEffect(() => {
    if (leaving.length === 0) return;
    const keys = new Set(leaving.map((layer) => layer.key));
    const id = window.setTimeout(
      () => setLeaving((list) => list.filter((layer) => !keys.has(layer.key))),
      exitTimeoutMs("fast"),
    );
    return () => window.clearTimeout(id);
  }, [leaving]);

  const removeLayer = (key: string | number) => (event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    setLeaving((list) => list.filter((layer) => layer.key !== key));
  };

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
        className={cx(styles.layer, styles.leaving, swapMotion.swapOut)}
        data-state="closed"
        aria-hidden="true"
        inert
        onAnimationEnd={removeLayer(layer.key)}
      >
        {layer.children}
      </div>
    )),
    // An empty state draws no layer: with no leaving layer either, the root is `:empty` and hides.
    hasContent(children) ? (
      <div
        key={`state-${String(state)}`}
        ref={layerRef(state)}
        className={cx(styles.layer, swap.count > 0 && swapMotion.swapIn)}
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
    >
      {layers}
    </div>
  );
}

type SwapIn = {
  /** Key of the swapped content: it remounts under a new state. `undefined` before the first swap. */
  key: string | undefined;
  /** The fade-in of the new state (`swapMotion.swapIn`); `undefined` before the first swap. */
  className: string | undefined;
};

/**
 * The region swap in place, for a host whose states cannot be laid over each other: a table body
 * (rows leave the table's layout when positioned) or the phrasing content of a button. The new
 * state remounts under `key` and fades in through `className`; nothing fades out and the height
 * does not glide. Nothing moves on the first render. Every other region is a `RegionSwap`.
 */
export function useSwapIn(state: string | number): SwapIn {
  const [initial] = React.useState(state);
  const [swapped, setSwapped] = React.useState(false);
  // Derived during render: the swapped content mounts with its fade in the same commit.
  if (!swapped && state !== initial) setSwapped(true);
  return swapped || state !== initial
    ? { key: String(state), className: swapMotion.swapIn }
    : { key: undefined, className: undefined };
}
