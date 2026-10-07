import * as React from "react";

/**
 * Layer of content portaled into `document.body` (Popover, Dropdown, Select, Tooltip).
 * The page is `page`; inside a `Drawer` / `Modal` the layer sits above the shell's numeric levels,
 * see `tokens/primitives` → `zIndex`.
 */
export type OverlayPortalLayer = "page" | "drawer" | "modal" | "drawerInModal";

const OverlayPortalLayerContext = React.createContext<OverlayPortalLayer>("page");

export type OverlayPortalLayerProviderProps = {
  value: OverlayPortalLayer;
  children: React.ReactNode;
};

export function OverlayPortalLayerProvider({ value, children }: OverlayPortalLayerProviderProps) {
  return (
    <OverlayPortalLayerContext.Provider value={value}>
      {children}
    </OverlayPortalLayerContext.Provider>
  );
}

export function useOverlayPortalLayer(): OverlayPortalLayer {
  return React.useContext(OverlayPortalLayerContext);
}

/**
 * True inside a dropdown-level panel (Dropdown menu, Select or TagSelect list). Those panels sit
 * above popovers of the same portal layer, so a Popover opened from inside one (a tag's manage
 * panel in a TagSelect list) raises itself above it instead of opening underneath.
 */
export const DropdownLayerContext = React.createContext(false);
