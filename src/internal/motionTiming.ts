import { TOKEN_DEFAULTS } from "./tokenDefaults";

/**
 * Motion timing for code: the motion tokens read from the document, so theme, app overrides and
 * reduced motion (which zeroes the movement clocks, foundation §7) apply to JS motion as they do
 * to CSS. WAAPI and timers cannot take `var()`; everything that times a motion in JS reads here.
 */

export type MotionDurationToken = "xfast" | "fast" | "base" | "slow";
type MotionCurve = "standard" | "enter" | "exit" | "emphasized";

/** Slack over a motion's length before its timeout fallback ends it (no `animationend` came). */
const TIMEOUT_SLACK_MS = 50;

function parseDurationMs(raw: string): number | null {
  const value = raw.trim();
  if (value === "") return null;
  const n = Number.parseFloat(value);
  if (Number.isNaN(n)) return null;
  if (value.endsWith("ms")) return n;
  if (value.endsWith("s")) return n * 1000;
  return null;
}

/** A custom property of the document root as written (`""` when the CSS cannot be read). */
export function motionToken(name: `--prime-motion-${string}`): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * A duration token in ms, read from the document (respects theme and reduced-motion overrides);
 * its token default when the CSS cannot be read.
 */
export function readCssDurationMs(name: keyof typeof TOKEN_DEFAULTS): number {
  if (typeof document === "undefined") return TOKEN_DEFAULTS[name];
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return parseDurationMs(raw) ?? TOKEN_DEFAULTS[name];
}

/**
 * A duration custom property in ms as it applies to `element` (a component clock such as
 * `--prime-message-morph-duration`, which a theme or reduced motion may set); 0 when unset.
 */
export function readElementDurationMs(element: Element, name: `--${string}`): number {
  return parseDurationMs(getComputedStyle(element).getPropertyValue(name)) ?? 0;
}

/** `--prime-motion-duration-<token>` in ms. */
export function motionDurationMs(token: MotionDurationToken): number {
  return readCssDurationMs(`--prime-motion-duration-${token}`);
}

/** When a motion of `ms` has surely ended: the timeout of a fallback that cleans up after it. */
export function afterMotionMs(ms: number): number {
  return ms + TIMEOUT_SLACK_MS;
}

/** Timeout fallback for an exit of `token` length: the token duration plus slack. */
export function exitTimeoutMs(token: MotionDurationToken): number {
  return afterMotionMs(motionDurationMs(token));
}

/** Timings read this frame: every list of a board settles in the same commit. */
const timingCache = new Map<string, KeyframeAnimationOptions>();

/**
 * WAAPI timing from the motion tokens (`--prime-motion-duration-<token>`,
 * `--prime-motion-easing-<curve>`), read at animation time. Read once per frame: a computed style
 * read of the root forces a style pass, and each list of a board would otherwise force its own
 * after the previous list's glides.
 */
export function motionTiming(
  duration: MotionDurationToken,
  curve: MotionCurve = "standard",
): KeyframeAnimationOptions {
  const key = `${duration}|${curve}`;
  const cached = timingCache.get(key);
  if (cached) return { ...cached };
  const easing = motionToken(`--prime-motion-easing-${curve}`);
  const timing = easing
    ? { duration: motionDurationMs(duration), easing }
    : { duration: motionDurationMs(duration) };
  if (typeof requestAnimationFrame === "function") {
    if (timingCache.size === 0) requestAnimationFrame(() => timingCache.clear());
    timingCache.set(key, timing);
  }
  return { ...timing };
}
