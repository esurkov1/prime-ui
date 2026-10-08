import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";
import { exitTimeoutMs, prefersReducedMotion } from "@/hooks/usePresence";
import { useStateSwap } from "@/hooks/useStateSwap";
import { cx } from "@/internal/cx";
import swapMotion from "@/internal/swapMotion.module.css";

import styles from "./Crossfade.module.css";

export type CrossfadeProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Key of what the region shows: `"loading"`, `"error"`, `"empty"`, `"ready"`, a record id.
   * A new value cross-fades the old content into the new one; the same value updates in place.
   */
  state: string | number;
  ref?: React.Ref<HTMLDivElement>;
};

type Layer = { key: string | number; children: React.ReactNode };

/**
 * Cross-fades a region between its states (loading → data → empty → error) and glides its height,
 * so the page below does not jump. Nothing moves on the first render.
 */
export function Crossfade({ state, children, className, ref, ...rest }: CrossfadeProps) {
  const swapped = useStateSwap(state);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  /** Root border-box height when the state changed: the start of the height glide. */
  const heightRef = React.useRef<number | null>(null);
  /** Children of the current state from the last commit: what the outgoing layer keeps showing. */
  const childrenRef = React.useRef(children);
  const [current, setCurrent] = React.useState(state);
  const [leaving, setLeaving] = React.useState<Layer[]>([]);

  // Derived during render: the old content stays mounted (same key, same instance) as a layer.
  if (state !== current) {
    // The DOM still shows the old state: its height is where the glide starts.
    heightRef.current = rootRef.current?.getBoundingClientRect().height ?? null;
    const outgoing: Layer = { key: current, children: childrenRef.current };
    setLeaving((list) =>
      prefersReducedMotion()
        ? []
        : [...list.filter((layer) => layer.key !== state && layer.key !== current), outgoing],
    );
    setCurrent(state);
  }

  React.useLayoutEffect(() => {
    childrenRef.current = children;
  });

  // Height glide: from the old laid-out height to the new natural one, then back to `auto`.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per state change
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !swapped) return;
    root.style.height = "";
    root.removeAttribute("data-resizing");
    const from = heightRef.current;
    const to = root.getBoundingClientRect().height;
    if (from === null || Math.abs(from - to) < 1 || prefersReducedMotion()) return;

    const finish = () => {
      root.style.height = "";
      root.removeAttribute("data-resizing");
    };
    root.setAttribute("data-resizing", "true");
    root.style.height = `${from}px`;
    root.getBoundingClientRect(); // commit the start height before the transition target
    root.style.height = `${to}px`;

    const onEnd = (event: TransitionEvent) => {
      if (event.target === root && event.propertyName === "height") finish();
    };
    root.addEventListener("transitionend", onEnd);
    const id = window.setTimeout(finish, exitTimeoutMs("base"));
    return () => {
      root.removeEventListener("transitionend", onEnd);
      window.clearTimeout(id);
    };
  }, [current]);

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

  // One keyed list: a layer keeps its instance when it moves between current and leaving.
  const layers = [
    ...leaving.map((layer) => (
      <div
        key={`state-${String(layer.key)}`}
        className={cx(styles.layer, styles.leaving, swapMotion.swapOut)}
        data-state="closed"
        aria-hidden="true"
        inert
        onAnimationEnd={removeLayer(layer.key)}
      >
        {layer.children}
      </div>
    )),
    <div
      key={`state-${String(state)}`}
      className={cx(styles.layer, swapped && swapMotion.swapIn)}
      data-state="open"
    >
      {children}
    </div>,
  ];

  return (
    <div {...rest} ref={mergedRef} className={cx(styles.root, className)}>
      {layers}
    </div>
  );
}
