import * as React from "react";

import { exitTimeoutMs, type MotionDurationToken } from "@/internal/motionTiming";
import { REDUCED_MOTION_QUERY } from "./breakpoints";

export type PresenceState = "open" | "closed";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

type UsePresenceOptions = {
  /** Longest exit duration of the layer — the timeout fallback when no `animationend` arrives. */
  exitDuration?: MotionDurationToken;
};

export type Presence = {
  /** Render the layer while this is true (open, or playing its exit animation). */
  mounted: boolean;
  /** Value for `data-state` on the layer: CSS animates both directions from it. */
  state: PresenceState;
  /**
   * Attach as `onAnimationEnd` (and/or `onTransitionEnd`) to the outermost animated element of the
   * layer. Events bubbling from descendants are ignored.
   */
  onExitEnd: (event: React.SyntheticEvent<Element>) => void;
};

/**
 * Keeps an overlay mounted until its exit animation ends. Open → mounted at once with
 * `state="open"`; close → `state="closed"` stays mounted until `animationend` / `transitionend`
 * on the layer element, or the token-duration timeout; unmounts immediately under
 * `prefers-reduced-motion: reduce`. Shared by every floating layer (foundation §8 "Overlay contract").
 */
export function usePresence(open: boolean, options: UsePresenceOptions = {}): Presence {
  const { exitDuration = "base" } = options;
  const [mounted, setMounted] = React.useState(open);

  // Derived state updates during render (no extra commit): mount on open, skip the exit
  // animation entirely under reduced motion.
  if (open && !mounted) setMounted(true);
  if (!open && mounted && prefersReducedMotion()) setMounted(false);

  const openRef = React.useRef(open);
  openRef.current = open;

  React.useEffect(() => {
    if (open || !mounted) return;
    const id = window.setTimeout(() => setMounted(false), exitTimeoutMs(exitDuration));
    return () => window.clearTimeout(id);
  }, [open, mounted, exitDuration]);

  const onExitEnd = React.useCallback((event: React.SyntheticEvent<Element>) => {
    if (event.target !== event.currentTarget) return;
    if (!openRef.current) setMounted(false);
  }, []);

  return { mounted: open || mounted, state: open ? "open" : "closed", onExitEnd };
}
