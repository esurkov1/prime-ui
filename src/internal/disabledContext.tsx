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

/**
 * `true` around the trigger of a tooltip: a kit control there that is disabled stays reachable
 * itself — a tab stop that takes hover, `aria-disabled` instead of the native `disabled`, presses
 * blocked — so the trigger never has to move it into a focusable host (which would remount it and
 * drop its state: a running label morph, focus).
 */
const ReachableDisabledContext = React.createContext(false);

export function ReachableDisabledProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReachableDisabledContext.Provider value={true}>{children}</ReachableDisabledContext.Provider>
  );
}

/** Whether a disabled control here stays reachable (`ReachableDisabledProvider`). */
export function useReachableDisabled(): boolean {
  return React.useContext(ReachableDisabledContext);
}

type DisabledControl = {
  /** Disabled and kept reachable: the control blocks its own activation. */
  reachable: boolean;
  /** The native `disabled` of the control's own element. */
  native: boolean;
  /** `aria-disabled` of the control's own element while it is reachable. */
  ariaDisabled: true | undefined;
};

/**
 * How a disabled control's own native element (a button, an input, a select) is disabled:
 * natively — or, under a tooltip's trigger (`ReachableDisabledProvider`), reachable: a tab stop that
 * takes hover and says `aria-disabled`, so the trigger never re-parents it as `disabled` flips. A
 * reachable control blocks its own activation, and a field gives up its `name` and `required`: the
 * form neither submits nor validates it, as it skips a disabled one.
 */
export function useDisabledControl(disabled: boolean): DisabledControl {
  const reachable = useReachableDisabled() && disabled;
  return { reachable, native: disabled && !reachable, ariaDisabled: reachable || undefined };
}

/**
 * `useDisabledControl` of a control's own `disabled` or a disabled `Fieldset` around it, for a
 * kit control that renders its own native element; `disabled` is the state it resolved.
 */
export function useInheritedDisabledControl(
  own?: boolean,
): DisabledControl & { disabled: boolean } {
  const disabled = useInheritedDisabled(own);
  return { ...useDisabledControl(disabled), disabled };
}

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * The plain `<button>` of a kit part (a fold header, a dot, a legend entry): disabled by its own
 * `disabled` or a disabled `Fieldset` around it, and under a tooltip's trigger kept reachable
 * (`useDisabledControl`: `aria-disabled`, the press stops here). It reads the context where it is
 * rendered, so a part may wrap it in a tooltip. `type` defaults to `button`.
 */
export function NativeButton({
  disabled,
  onClick,
  onKeyDown,
  onKeyUp,
  onMouseDown,
  type = "button",
  ref,
  ...rest
}: NativeButtonProps) {
  const off = useInheritedDisabledControl(disabled);
  // Reachable, it keeps the hover and focus a tooltip needs and drops what would act: the press
  // and the keys a part opens or moves by.
  const acts = !off.reachable;
  return (
    <button
      type={type}
      {...rest}
      ref={ref}
      disabled={off.native}
      aria-disabled={off.ariaDisabled ?? rest["aria-disabled"]}
      data-reachable-disabled={off.reachable || undefined}
      onClick={acts ? onClick : (event) => event.preventDefault()}
      onKeyDown={acts ? onKeyDown : undefined}
      onKeyUp={acts ? onKeyUp : undefined}
      onMouseDown={acts ? onMouseDown : undefined}
    />
  );
}
