import { useOptionalControlSize } from "@/internal/ControlSizeContext";
import type { ControlSize } from "@/internal/states";

/**
 * Badge tiers (`--prime-badge-<tier>-*`): 16 · 20 · 24 · 28 · 32. Shared by Badge, Tag and Kbd.
 * Pairing rule (foundation §6): inside a control of tier T a badge uses the tier one step down.
 */
const STEP_DOWN: Record<ControlSize, ControlSize> = {
  xs: "xs",
  s: "xs",
  m: "s",
  l: "m",
  xl: "l",
};

export type ResolvedBadgeTier = {
  /** Nominal size exposed as `data-size`: the explicit prop, else the surrounding control size. */
  size: ControlSize;
  /** Visual tier exposed as `data-tier`; drives every dimension in CSS. */
  tier: ControlSize;
};

/**
 * Explicit `size` wins and is used as is. Without it the chip follows the nearest
 * `ControlSizeProvider` one tier down; with no provider the default is `m`.
 */
export function useBadgeTier(sizeProp: ControlSize | undefined): ResolvedBadgeTier {
  const surface = useOptionalControlSize();
  if (sizeProp !== undefined) return { size: sizeProp, tier: sizeProp };
  if (surface !== undefined) return { size: surface, tier: STEP_DOWN[surface] };
  return { size: "m", tier: "m" };
}
