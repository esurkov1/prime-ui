/**
 * Timing for the carried item and for neighbours making room for it. Values come from the motion
 * tokens (read once per drag, so a theme or app override applies); WAAPI cannot take `var()`.
 */
export type DragMotion = { lift: number; shift: number; settle: number; easing: string };

const FALLBACK: DragMotion = {
  lift: 120,
  shift: 200,
  settle: 200,
  easing: "cubic-bezier(0.2, 0, 0, 1)",
};

function readMs(styles: CSSStyleDeclaration, name: string, fallback: number): number {
  const value = styles.getPropertyValue(name).trim();
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return fallback;
  return value.endsWith("ms") ? parsed : value.endsWith("s") ? parsed * 1000 : fallback;
}

export function readDragMotion(): DragMotion {
  if (typeof document === "undefined") return FALLBACK;
  const styles = getComputedStyle(document.documentElement);
  return {
    lift: readMs(styles, "--prime-motion-duration-fast", FALLBACK.lift),
    shift: readMs(styles, "--prime-motion-duration-base", FALLBACK.shift),
    settle: readMs(styles, "--prime-motion-duration-base", FALLBACK.settle),
    easing: styles.getPropertyValue("--prime-motion-easing-standard").trim() || FALLBACK.easing,
  };
}

export function motionAllowed(): boolean {
  return (
    typeof matchMedia !== "function" || !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
