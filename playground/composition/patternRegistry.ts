import type * as React from "react";

import { createSourceRegistry, type SourceEntry } from "../sourceRegistry";

/**
 * Composition patterns live in `SKILL/patterns/` — one file is both the skill's reference screen
 * and the playground preview + code.
 */
const loadPattern = createSourceRegistry(
  import.meta.glob<{ default: React.ComponentType }>("../../SKILL/patterns/*.tsx"),
  import.meta.glob<string>("../../SKILL/patterns/*.tsx", { query: "?raw", import: "default" }),
  (key) => key.slice(6),
);

/** The pattern `SKILL/patterns/<file>.tsx`; throws when the file does not exist. */
export function getPattern(file: string): Promise<SourceEntry> {
  return loadPattern(`../../SKILL/patterns/${file}.tsx`);
}
