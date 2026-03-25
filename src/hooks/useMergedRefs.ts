import * as React from "react";

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref && "current" in ref) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

export function useMergedRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return React.useCallback(
    (value: T) => {
      for (const ref of refs) {
        assignRef(ref, value);
      }
    },
    [refs],
  );
}
