/*
 * The media queries the kit reads in TypeScript (`useMediaQuery`). The viewport widths are the
 * breakpoints of foundation §9 (640 · 768 · 1024 · 1280); the same values stand in the CSS rules,
 * each with a comment naming its constant here.
 */

/** Viewport below the first breakpoint (640): overlays become bottom sheets. */
export const COMPACT_QUERY = "(max-width: 639px)";

/** Viewport below the tablet breakpoint (768): the side navigation leaves the page, off-canvas. */
export const OFF_CANVAS_QUERY = "(max-width: 767px)";

/** A touch screen: no hover and a coarse pointer (long press instead of hover, larger targets). */
export const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

/** A pointer that can hover: hover-only affordances (a reaction bar on a long hover). */
export const HOVER_QUERY = "(hover: hover)";

/** The person asked for less motion. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
