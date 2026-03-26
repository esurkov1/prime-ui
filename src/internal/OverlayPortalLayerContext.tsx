import * as React from "react";

/**
 * Слой для контента, порталируемого в `document.body` (Popover, Dropdown, Select, Tooltip).
 * Страница — `page`; внутри `Drawer` / `Modal` — выше числовых уровней оболочки, см. `tokens/primitives` → `zIndex`.
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
