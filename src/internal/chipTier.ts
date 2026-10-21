import { useHostKind, useOptionalControlSize } from "./ControlSizeContext";
import { type ControlSize, stepDown } from "./states";

/**
 * Chip tiers (`--prime-badge-<tier>-*`: 16 · 20 · 24 · 28 · 32), shared by Badge and Kbd with the
 * `.tier` class of `chipTier.module.css`. Pairing rule (foundation §6): inside a control of tier T
 * a chip uses the tier one step down; on a surface of tier T (a card) it uses T.
 */
type ChipTier = {
  /** Nominal size exposed as `data-size`: the explicit prop, else the surrounding control size. */
  size: ControlSize;
  /** Visual tier exposed as `data-tier`; drives every dimension in CSS. */
  tier: ControlSize;
};

/**
 * Explicit `size` wins and is used as is. Without it the chip follows the nearest sized host: a
 * control one tier down (`stepDown`), a surface as is; with no host the default is `m`.
 */
export function useChipTier(sizeProp: ControlSize | undefined): ChipTier {
  const host = useOptionalControlSize();
  const kind = useHostKind();
  if (sizeProp !== undefined) return { size: sizeProp, tier: sizeProp };
  if (host !== undefined) return { size: host, tier: kind === "surface" ? host : stepDown(host) };
  return { size: "m", tier: "m" };
}
