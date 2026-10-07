import * as React from "react";

/** The box a floating layer is placed against (viewport px). */
export type AnchorRect = Pick<
  DOMRectReadOnly,
  "top" | "left" | "right" | "bottom" | "width" | "height"
>;

/**
 * Maps an anchor's border box to the part of it that is actually visible. A layout whose rows are
 * wider than what it shows (the compact Sidebar rail keeps full-width rows and clips them to the
 * icon box) provides one, so tooltips, flyouts and menus of those rows anchor to what the user sees.
 */
export type AnchorRectResolver = (anchor: HTMLElement, rect: AnchorRect) => AnchorRect;

const AnchorRectContext = React.createContext<AnchorRectResolver | null>(null);

export const AnchorRectProvider = AnchorRectContext.Provider;

/** The resolver of the nearest layout that narrows its anchors, or `null`. Read by `usePosition`. */
export function useAnchorRectResolver(): AnchorRectResolver | null {
  return React.useContext(AnchorRectContext);
}
