import * as React from "react";

type MaybeRef<T> = React.Ref<T> | undefined;

type Cleanup = (() => void) | undefined;

/** Attaches `value`; a callback ref may return its cleanup (React 19), which detaching then runs. */
function assignRef<T>(ref: MaybeRef<T>, value: T): Cleanup {
  if (typeof ref === "function") {
    const cleanup = ref(value);
    return typeof cleanup === "function" ? cleanup : undefined;
  }
  if (ref) ref.current = value;
  return undefined;
}

/**
 * Detaches `node`: a callback ref runs the cleanup it returned (as React does), else gets `null`;
 * an object ref that holds another node by now (its successor) keeps it.
 */
function releaseRef<T>(ref: MaybeRef<T>, node: T, cleanup: Cleanup) {
  if (typeof ref === "function") {
    if (cleanup) cleanup();
    else ref(null);
  } else if (ref && ref.current === node) ref.current = null;
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
      if (value === null) return;
      const cleanupA = assignRef(a, value);
      const cleanupB = assignRef(b, value);
      const cleanupC = assignRef(c, value);
      return () => {
        releaseRef(a, value, cleanupA);
        releaseRef(b, value, cleanupB);
        releaseRef(c, value, cleanupC);
      };
    },
    [a, b, c],
  );
}
