import surface from "./fieldSurface.module.css";
import tier from "./fieldTier.module.css";
import trigger from "./fieldTrigger.module.css";

/** Fill, hover, focus fill + ring, invalid and disabled of a field box (`fieldSurface.module.css`). */
export const fieldSurfaceClass = surface.surface;

/** `--field-*` tier variables, resolved from `data-size` on the same element (`fieldTier.module.css`). */
export const fieldTierClass = tier.tier;

/**
 * Tier + surface + trigger layout of a button-shaped field (`fieldTrigger.module.css`). Classes are
 * joined here, in TSX, never by a cross-file CSS `composes` (the bundler cannot order those).
 */
export const fieldTriggerClass = `${tier.tier} ${surface.surface} ${trigger.trigger}`;
