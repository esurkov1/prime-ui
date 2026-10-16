import type * as React from "react";

import { cx } from "@/internal/cx";
import { RegionSwap } from "@/internal/RegionSwap";

import styles from "./Crossfade.module.css";

export type CrossfadeProps = React.HTMLAttributes<HTMLDivElement> & {
  state: string | number;
  fill?: boolean;
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Cross-fades a region between its states (loading → data → empty → error): the data replaces the
 * `"loading"` skeleton in place, settled states glide the height, so the page below does not jump:
 * the kit's region swap (`src/internal/RegionSwap`), public. The region spans its parent's inline
 * size, also inside a centring grid.
 */
export function Crossfade({ className, ...props }: CrossfadeProps) {
  return <RegionSwap {...props} className={cx(styles.root, className)} />;
}
