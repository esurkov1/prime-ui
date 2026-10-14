import type * as React from "react";

import { RegionSwap } from "@/internal/RegionSwap";

export type CrossfadeProps = React.HTMLAttributes<HTMLDivElement> & {
  state: string | number;
  fill?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Cross-fades a region between its states (loading → data → empty → error) and glides its height,
 * so the page below does not jump: the kit's region swap (`src/internal/RegionSwap`), public.
 */
export function Crossfade(props: CrossfadeProps) {
  return <RegionSwap {...props} />;
}
