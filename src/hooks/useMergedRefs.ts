import * as React from "react";

type MaybeRef<T> = React.Ref<T> | undefined;

function assignRef<T>(ref: MaybeRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

/**
 * One stable callback ref that writes to every given ref (callback or object): an internal ref and
 * the consumer's, up to three. The identity changes only when one of the refs does, so the node is
 * not detached and reattached on every render. A single ref turns into a callback ref, which fits
 * whichever tag a part renders. The single way to merge refs in components.
 */
export function useMergedRefs<T>(
  a: MaybeRef<T>,
  b?: MaybeRef<T>,
  c?: MaybeRef<T>,
): React.RefCallback<T> {
  return React.useCallback(
    (value: T | null) => {
      assignRef(a, value);
      assignRef(b, value);
      assignRef(c, value);
    },
    [a, b, c],
  );
}
