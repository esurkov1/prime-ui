import type * as React from "react";

/**
 * Composes refs (callback or object) into one callback. Internal helper of `useMergedRefs` and
 * `Slot`; components call `useMergedRefs`, which keeps the callback stable between renders.
 */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (ref == null) continue;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.RefObject<T | null>).current = value;
      }
    }
  };
}
