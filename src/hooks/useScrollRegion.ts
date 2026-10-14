import * as React from "react";

/**
 * What a ScrollContainer lets its content ask for (`useScrollRegion`): a chat list asks to go to
 * the end after its own message, to bring a message into view, and follows whether the reader is
 * at the end. The region scrolls only itself.
 */
export type ScrollRegion = {
  /** The scrolling element: the root of an IntersectionObserver or a measure inside it. */
  element: () => HTMLElement | null;
  /** The reader is at the end (`anchor="end"`, within 4 px). */
  atEnd: () => boolean;
  /** Follows `atEnd`; returns the unsubscribe. */
  subscribe: (listener: () => void) => () => void;
  /** Scrolls to the end; `smooth` glides there (instant under reduced motion). */
  scrollToEnd: (behavior?: ScrollBehavior) => void;
  /** Scrolls the region (only) so `element` stands in its middle. */
  scrollToElement: (element: Element, behavior?: ScrollBehavior) => void;
  /**
   * Content is about to change size in place on the motion clock `clock` (a duration custom
   * property, read on the region: `--prime-message-morph-duration`): until that motion has played,
   * what the reader sees stays still — even at the end of `anchor="end"`, so the change grows past
   * the edge instead of pushing everything up. Call it right before the change.
   */
  hold: (clock: `--${string}`) => void;
};

export const ScrollRegionContext = React.createContext<ScrollRegion | null>(null);

/** The ScrollContainer around this component, or `null` outside one. */
export function useScrollRegion(): ScrollRegion | null {
  return React.useContext(ScrollRegionContext);
}
