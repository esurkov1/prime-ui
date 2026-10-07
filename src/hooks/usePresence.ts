import * as React from "react";

export type PresenceState = "open" | "closed";
export type MotionDurationToken = "fast" | "base" | "slow";

/** Token defaults (foundation §7) used when the CSS variable cannot be read. */
const DURATION_FALLBACK_MS: Record<MotionDurationToken, number> = {
  fast: 120,
  base: 200,
  slow: 300,
};

/** Slack over the token duration before the timeout fallback unmounts the layer. */
const TIMEOUT_SLACK_MS = 50;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function parseDurationMs(raw: string): number | null {
  const value = raw.trim();
  if (value === "") return null;
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) return null;
  if (value.endsWith("ms")) return n;
  if (value.endsWith("s")) return n * 1000;
  return null;
}

/** `--prime-motion-duration-<token>` in ms, read from the document (respects theme overrides). */
export function motionDurationMs(token: MotionDurationToken): number {
  if (typeof document === "undefined") return DURATION_FALLBACK_MS[token];
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    `--prime-motion-duration-${token}`,
  );
  return parseDurationMs(raw) ?? DURATION_FALLBACK_MS[token];
}

/** Timeout fallback for an exit animation of `token` length: the token duration plus slack. */
export function exitTimeoutMs(token: MotionDurationToken): number {
  return motionDurationMs(token) + TIMEOUT_SLACK_MS;
}

export type UsePresenceOptions = {
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
 * `prefers-reduced-motion: reduce`. Shared by every floating layer (foundation §7 "Overlay contract").
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
