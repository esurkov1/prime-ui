import type * as React from "react";

import { readCssLengthPx } from "@/hooks/usePosition";

import styles from "./selectionIndicator.module.css";
import { TOKEN_DEFAULTS } from "./tokenDefaults";

/**
 * The sliding indicator of a switcher (`selectionIndicator.module.css`): join it on the element
 * the host draws as its folder, thumb or capsule, first in the row so it paints under the items.
 */
export const selectionIndicatorClass = styles.indicator;

/**
 * Writes a boolean `data-*` flag only when it changes: a layout pass that runs on every frame of
 * a container resize must not restyle the row when nothing changed.
 */
export function setFlag(element: HTMLElement, name: `data-${string}`, on: boolean): void {
  if (on === element.hasAttribute(name)) return;
  if (on) element.setAttribute(name, "true");
  else element.removeAttribute(name);
}

/**
 * Places the indicator over `target` — its offset box in the parent they share — straight in the
 * DOM, so a resize or a font swap never re-renders the host. With `animate` (a person's choice) a
 * move of a visible indicator glides, and an indicator that appears or leaves fades
 * (`data-fade`); every other placement snaps, and its first one shows it at once: a fade on mount
 * would leave the selected item without its fill while the host opens (a Drawer sliding in), and
 * an opacity transition makes the indicator a composited layer that browsers paint over the
 * item's text inside the row's edge-fade mask until it ends.
 */
export function placeIndicator(
  indicator: HTMLElement,
  target: HTMLElement | null,
  animate: boolean,
): void {
  const visible = indicator.hasAttribute("data-visible");
  if (!target) {
    setFlag(indicator, "data-fade", animate && visible);
    setFlag(indicator, "data-animate", false);
    setFlag(indicator, "data-visible", false);
    return;
  }
  const left = `${target.offsetLeft}px`;
  const top = `${target.offsetTop}px`;
  const width = `${target.offsetWidth}px`;
  const height = `${target.offsetHeight}px`;
  const { style } = indicator;
  if (
    style.left !== left ||
    style.top !== top ||
    style.width !== width ||
    style.height !== height
  ) {
    setFlag(indicator, "data-animate", animate && visible);
    style.left = left;
    style.top = top;
    style.width = width;
    style.height = height;
  }
  if (!visible) setFlag(indicator, "data-fade", animate);
  else if (!animate) setFlag(indicator, "data-fade", false);
  setFlag(indicator, "data-visible", true);
}

/**
 * `onTransitionEnd` of the indicator: the glide or the fade is over, so the next layout change
 * snaps.
 */
export function endIndicatorGlide(
  event: Pick<React.TransitionEvent<HTMLElement>, "target" | "currentTarget" | "propertyName">,
): void {
  if (event.target !== event.currentTarget) return;
  if (["left", "top", "width", "height"].includes(event.propertyName)) {
    setFlag(event.currentTarget, "data-animate", false);
  }
  if (event.propertyName === "opacity") setFlag(event.currentTarget, "data-fade", false);
}

/** Where `item` starts inside `scroller`'s content (a positioned scroller is its offset parent). */
function offsetIn(scroller: HTMLElement, item: HTMLElement): number {
  let offset = 0;
  for (
    let node: HTMLElement | null = item;
    node && node !== scroller;
    node = node.offsetParent as HTMLElement | null
  ) {
    offset += node.offsetLeft;
  }
  return offset;
}

/**
 * Scrolls a sideways scroller (never the page: `scrollIntoView` would scroll it too) so `item` is
 * in view and clear of the edge fade (`--scroll-fade-depth` on the scroller); near an end it
 * scrolls all the way, where the fade melts to nothing. Smooth only after a person's choice.
 * Returns the offset the scroller goes to, or `null` when the item is already in view.
 */
export function revealInScroller(
  scroller: HTMLElement,
  item: HTMLElement,
  smooth: boolean,
): number | null {
  const max = scroller.scrollWidth - scroller.clientWidth;
  if (max <= 0 || typeof scroller.scrollTo !== "function") return null;
  const margin = readCssLengthPx(
    "--scroll-fade-depth",
    TOKEN_DEFAULTS["--prime-space-8"],
    scroller,
  );
  const view = scroller.scrollLeft;
  const start = offsetIn(scroller, item) - margin;
  const end = offsetIn(scroller, item) + item.offsetWidth + margin;
  const target =
    start < view ? start : end > view + scroller.clientWidth ? end - scroller.clientWidth : null;
  if (target === null) return null;
  const left = Math.min(max, Math.max(0, target));
  if (Math.abs(left - view) < 1) return null;
  scroller.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  return left;
}
