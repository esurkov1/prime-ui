import * as React from "react";

import type { InputSize } from "@/internal/states";

/** Размер «контрольной поверхности» (поля, кнопки, селект и т.д.) для каскада в дочерние `Icon`. */
export type ControlSurfaceSize = "xs" | InputSize;

/** Для Badge / Tag / Kbd: в ярусе только s–xl, `xs` с контекста маппится в `s`. */
export function controlSurfaceToInputSize(surface: ControlSurfaceSize): InputSize {
  return surface === "xs" ? "s" : surface;
}

const ControlSizeContext = React.createContext<ControlSurfaceSize | null>(null);
ControlSizeContext.displayName = "ControlSizeContext";

export type ControlSizeProviderProps = {
  value: ControlSurfaceSize;
  children: React.ReactNode;
};

export function ControlSizeProvider({ value, children }: ControlSizeProviderProps) {
  return <ControlSizeContext.Provider value={value}>{children}</ControlSizeContext.Provider>;
}

ControlSizeProvider.displayName = "ControlSizeProvider";

/** Для `Icon`: если `size` не передан явно, берётся из ближайшего контрола. */
export function useOptionalControlSize(): ControlSurfaceSize | undefined {
  return React.useContext(ControlSizeContext) ?? undefined;
}
