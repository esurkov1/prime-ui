import surface from "./fieldSurface.module.css";
import tier from "./fieldTier.module.css";

/** Fill, hover, focus fill + ring, invalid and disabled of a field box (`fieldSurface.module.css`). */
export const fieldSurfaceClass = surface.surface;

/** `--field-*` tier variables, resolved from `data-size` on the same element (`fieldTier.module.css`). */
export const fieldTierClass = tier.tier;
