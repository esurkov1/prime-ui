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

type HostTier = {
  /** The resolved tier: the root's own `size`, else the tier of its host, else `m`. */
  size: ControlSize;
  /** Wraps the root's subtree so its parts and the kit controls inside take the same tier. */
  provide: (children: React.ReactNode) => React.ReactElement;
};

/**
 * The tier of a sized root (foundation §6): it resolves like `useControlSize` and provides the
 * result to everything inside. Every root that has `size` calls it instead of defaulting to `m`,
 * so a sized host (a form, a panel, a popover) sizes the whole tree under it.
 *
 *   const tier = useHostTier(sizeProp);
 *   return tier.provide(<div data-size={tier.size}>{children}</div>);
 */
export function useHostTier(sizeProp: ControlSize | undefined): HostTier {
  const size = useControlSize(sizeProp);
  const provide = React.useCallback(
    (children: React.ReactNode) => (
      <ControlSizeContext.Provider value={size}>{children}</ControlSizeContext.Provider>
    ),
    [size],
  );
  return { size, provide };
}
