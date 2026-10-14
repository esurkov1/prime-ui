import surface from "./fieldSurface.module.css";
import tier from "./fieldTier.module.css";
import trigger from "./fieldTrigger.module.css";
import press from "./press.module.css";
import { touchTargetBlockClass } from "./touchTarget";

/** Fill, hover, focus fill + ring, invalid and disabled of a field box (`fieldSurface.module.css`). */
export const fieldSurfaceClass = surface.surface;

/** `--field-*` tier variables, resolved from `data-size` on the same element (`fieldTier.module.css`). */
export const fieldTierClass = tier.tier;

/** Field label text of the tier (Label); joined next to `fieldTierClass`. */
export const fieldLabelTextClass = tier.labelText;

/** Support row text of the tier (Hint, the character counter); joined next to `fieldTierClass`. */
export const fieldHintTextClass = tier.hintText;

/**
 * An editable value of the tier: at least 16px on touch screens and narrow viewports (iOS zooms
 * into smaller text). Inside an element with `fieldTierClass`.
 */
export const fieldInputTextClass = tier.inputText;

/**
 * Tier + surface + trigger layout of a button-shaped field (`fieldTrigger.module.css`), its press
 * (the shared press feedback) and the touch hit area grown in height: a trigger fills its row, and xs and
 * s are under 44px. Classes are joined here, in TSX, never by a cross-file CSS `composes` (the
 * bundler cannot order those).
 */
export const fieldTriggerClass = [
  tier.tier,
  surface.surface,
  trigger.trigger,
  press.press,
  touchTargetBlockClass,
].join(" ");
