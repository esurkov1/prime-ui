import * as React from "react";

import { mergeRefs } from "@/internal/mergeRefs";

/**
 * One stable callback ref that writes to every given ref (callback or object). The identity changes
 * only when one of the refs does, so the node is not detached and reattached on every render. The
 * single way to merge refs in components; the number of refs at a call site must not change.
 */
export function useMergedRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  // biome-ignore lint/correctness/useExhaustiveDependencies: the refs themselves are the dependencies
  return React.useMemo(() => mergeRefs(...refs), refs);
}
