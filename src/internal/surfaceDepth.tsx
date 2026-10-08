import * as React from "react";

/**
 * Depth of a surface on the ladder (foundation §4): `0` the page … `4` the deepest nested layer,
 * `floating` for menus, popovers, modals and drawers, `floating-1`/`floating-2` for layers nested in
 * one, `tinted` for a host off the ladder (a tinted banner, an accent wash). A surface renders
 * `data-depth` with it; `globals.css` maps each depth to the context variables
 * (`--prime-color-layer-current`, `--prime-color-field-bg`…).
 */
export type SurfaceDepth = 0 | 1 | 2 | 3 | 4 | "floating" | "floating-1" | "floating-2" | "tinted";

const SurfaceDepthContext = React.createContext<SurfaceDepth>(0);
SurfaceDepthContext.displayName = "SurfaceDepthContext";

/**
 * The depth of a surface nested in `depth`; the deepest layer and `floating-2` repeat, a card on a
 * tinted host is a card on the page.
 */
export function nextSurfaceDepth(depth: SurfaceDepth): SurfaceDepth {
  if (typeof depth === "number") return Math.min(depth + 1, 4) as SurfaceDepth;
  if (depth === "tinted") return 1;
  return depth === "floating" ? "floating-1" : "floating-2";
}

/** Depth of the surface the caller renders: one above the nearest surface around it. */
export function useNestedSurfaceDepth(): SurfaceDepth {
  return nextSurfaceDepth(React.useContext(SurfaceDepthContext));
}

/** Surfaces inside `children` count their depth from `value`. */
export const SurfaceDepthProvider = SurfaceDepthContext.Provider;
