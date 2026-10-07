import * as React from "react";

import type { ControlSize } from "@/internal/states";

const ControlSizeContext = React.createContext<ControlSize | null>(null);
ControlSizeContext.displayName = "ControlSizeContext";

export type ControlSizeProviderProps = {
  value: ControlSize;
  children: React.ReactNode;
};

export function ControlSizeProvider({ value, children }: ControlSizeProviderProps) {
  return <ControlSizeContext.Provider value={value}>{children}</ControlSizeContext.Provider>;
}

ControlSizeProvider.displayName = "ControlSizeProvider";

/** The tier of the nearest control, for parts and leaves whose `size` is not set explicitly. */
export function useOptionalControlSize(): ControlSize | undefined {
  return React.useContext(ControlSizeContext) ?? undefined;
}

/**
 * Tier of a field or control: its own `size`, else the tier of its host (a form, a panel, a
 * popover, a table), else `m`.
 */
export function useControlSize(sizeProp: ControlSize | undefined): ControlSize {
  const host = React.useContext(ControlSizeContext);
  return sizeProp ?? host ?? "m";
}
