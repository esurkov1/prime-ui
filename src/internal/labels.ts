import * as React from "react";

import { useStableValue } from "@/hooks/useStableValue";

/**
 * The component's `labels`: its Russian defaults with the consumer's overrides on top (an
 * `undefined` override keeps the default). The result keeps its identity while the overrides keep
 * their content, so an inline `labels={{ … }}` object does not re-render what reads it.
 */
export function useLabels<L extends object>(defaults: L, labels: Partial<L> | undefined): L {
  const overrides = useStableValue(labels);
  return React.useMemo(() => mergeLabels(defaults, overrides), [defaults, overrides]);
}

/** The defaults with every defined override on top. */
function mergeLabels<L extends object>(defaults: L, labels: Partial<L> | undefined): L {
  if (!labels) return defaults;
  const merged = { ...defaults };
  for (const key of Object.keys(labels) as (keyof L)[]) {
    const value = labels[key];
    if (value !== undefined) merged[key] = value;
  }
  return merged;
}
