import * as React from "react";

type UseFieldIdsResult = {
  inputId: string;
  hintId: string;
  errorId: string;
  describedBy: string | undefined;
};

/**
 * Generates stable IDs for form field elements and builds aria-describedby.
 * Shared by Input, Select, Checkbox, Radio, Switch, Textarea.
 */
export function useFieldIds(
  explicitId?: string,
  options: { hasHint?: boolean; hasError?: boolean; extraDescribedBy?: string } = {},
): UseFieldIdsResult {
  const generated = React.useId();
  const inputId = explicitId ?? generated;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const parts = [
    options.extraDescribedBy,
    options.hasHint ? hintId : undefined,
    options.hasError ? errorId : undefined,
  ].filter(Boolean);

  const describedBy = parts.length > 0 ? parts.join(" ") : undefined;

  return { inputId, hintId, errorId, describedBy };
}
