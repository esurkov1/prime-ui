import * as React from "react";

export type FieldDescriptions = {
  hintId: string;
  errorId: string;
  /** An error part is mounted. */
  hasError: boolean;
  /** `aria-describedby` for the control: caller ids + mounted hint + mounted error. */
  describedBy: string | undefined;
  /** Call from a mounted hint part's layout effect; returns the cleanup. */
  registerHint: () => () => void;
  /** Call from a mounted error part's layout effect; returns the cleanup. */
  registerError: () => () => void;
};

/**
 * Ids and `aria-describedby` for compound fields whose hint/error are separate parts
 * (Checkbox, Radio, Switch): parts register themselves while mounted.
 */
export function useFieldDescriptions(inputId: string, ariaDescribedBy?: string): FieldDescriptions {
  const [hasHint, setHasHint] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy =
    [ariaDescribedBy, hasHint ? hintId : undefined, hasError ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const registerHint = React.useCallback(() => {
    setHasHint(true);
    return () => setHasHint(false);
  }, []);
  const registerError = React.useCallback(() => {
    setHasError(true);
    return () => setHasError(false);
  }, []);

  return React.useMemo(
    () => ({ hintId, errorId, hasError, describedBy, registerHint, registerError }),
    [hintId, errorId, hasError, describedBy, registerHint, registerError],
  );
}
