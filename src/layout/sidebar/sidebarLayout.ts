/**
 * Единая точка для JS/CSS: mobile < 768px, desktop/tablet >= 768px.
 */

export type SidebarLayoutMode = "hidden" | "compact" | "expanded";

/** @deprecated use `SidebarLayoutMode` */
export type LegacySidebarLayoutMode = "hidden" | "compact" | "expand";

export const SIDEBAR_LAYOUT_BREAKPOINT_MAX = "47.999rem";

export const SIDEBAR_MEDIA_QUERY_NARROW = `(max-width: ${SIDEBAR_LAYOUT_BREAKPOINT_MAX})`;

export const SIDEBAR_MEDIA_QUERY_INLINE = "(min-width: 48rem)";

export const SIDEBAR_MEDIA_QUERY_XS_HIDDEN = "(max-width: 29.999rem)";

export function normalizeSidebarMode(
  mode: SidebarLayoutMode | LegacySidebarLayoutMode,
): SidebarLayoutMode {
  return mode === "expand" ? "expanded" : mode;
}
