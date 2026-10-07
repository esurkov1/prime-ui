import * as React from "react";

/**
 * Region state transitions (loading → data → empty → error, foundation §7 rule 8): `true` once
 * `state` has differed from its first value. The content of every later state plays the swap-in
 * fade (`src/internal/swapMotion.module.css`); the first render stays still. Shared by Crossfade
 * and DataTable's body.
 */
export function useStateSwap(state: React.Key): boolean {
  const [initial] = React.useState(state);
  const [swapped, setSwapped] = React.useState(false);
  // Derived during render: the swapped content mounts with its fade in the same commit.
  if (!swapped && state !== initial) setSwapped(true);
  return swapped || state !== initial;
}
