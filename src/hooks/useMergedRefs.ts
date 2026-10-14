import * as React from "react";

type MaybeRef<T> = React.Ref<T> | undefined;

function assignRef<T>(ref: MaybeRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

/** Detaches `node`: an object ref that holds another node by now (its successor) keeps it. */
function releaseRef<T>(ref: MaybeRef<T>, node: T) {
  if (typeof ref === "function") ref(null);
  else if (ref && ref.current === node) ref.current = null;
}

/**
 * One stable callback ref that writes to every given ref (callback or object): an internal ref and
 * the consumer's, up to three. The identity changes only when one of the refs does, so the node is
 * not detached and reattached on every render. A single ref turns into a callback ref, which fits
 * whichever tag a part renders. The single way to merge refs in components.
 *
 * A node that unmounts after its successor mounted (the leaving layer of a `RegionSwap`) does not
 * clear an object ref that holds the successor.
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
      if (value === null) return;
      return () => {
        releaseRef(a, value);
        releaseRef(b, value);
        releaseRef(c, value);
      };
    },
    [a, b, c],
  );
}
