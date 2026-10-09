import * as React from "react";

/**
 * `true` inside a disabled `Fieldset`. A native `<fieldset disabled>` already disables the native
 * controls inside it; kit controls whose look, ARIA or keyboard come from their `disabled` prop
 * (choice rows, segments, triggers, sliders) read this context too, so the whole group renders
 * disabled the same way as a control with its own `disabled`.
 */
const DisabledContext = React.createContext(false);

export function DisabledProvider({
  disabled,
  children,
}: {
  disabled: boolean;
  children: React.ReactNode;
}) {
  const inherited = React.useContext(DisabledContext);
  return (
    <DisabledContext.Provider value={inherited || disabled}>{children}</DisabledContext.Provider>
  );
}

/** The control's own `disabled` or a disabled `Fieldset` around it. */
export function useInheritedDisabled(own?: boolean): boolean {
  return React.useContext(DisabledContext) || Boolean(own);
}
