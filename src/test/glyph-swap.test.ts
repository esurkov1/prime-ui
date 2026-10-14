// @vitest-environment node
/**
 * Each kind of state continuity has one engine (core decision 4 of the fix plan): a glyph that
 * changes in place cross-fades through its GlyphSwap host (`Button.Icon`, ProgressCircle children,
 * `src/internal/glyphSwap`), never a ternary of two icons that flips; a region keyed to remount
 * (`key={swapped …}`) and `useStateSwap` outside its engine are local copies of the region swap.
 *
 * In ratchet mode (`glyph-swap`): the offenders found when the check landed are the baseline.
 */
import { read, walk } from "./contract-utils";
import { numbered, ratchet } from "./ratchet";

const sources = walk("src", /\.tsx?$/).filter(
  (file) => !/\.test\.tsx?$|\/examples\/|^src\/test\//.test(file),
);

/** The engines themselves. */
const ENGINES = new Set([
  "src/internal/glyphSwap.tsx",
  "src/hooks/useStateSwap.ts",
  "src/components/crossfade/Crossfade.tsx",
]);

describe("glyph and region swaps", () => {
  it("swaps go through their engine", () => {
    const offenders: string[] = [];
    for (const file of sources) {
      if (ENGINES.has(file)) continue;
      const text = read(file);
      const rules: [RegExp, string][] = [
        [/\?\s*\(?\s*<Icon\b[^>]*\/>\s*\)?\s*:\s*\(?\s*<Icon\b/g, "glyph ternary"],
        [/<Icon\s+name=\{[^}]*\?\s*"[\w.]+"\s*:\s*"[\w.]+"/g, "glyph name ternary"],
        [/key=\{swapped\b/g, "key={swapped"],
        [/\buseStateSwap\(/g, "useStateSwap outside the engine"],
      ];
      for (const [pattern, rule] of rules) {
        for (const _ of text.matchAll(pattern)) offenders.push(`${file}: ${rule}`);
      }
    }
    ratchet("glyph-swap", numbered(offenders));
  });
});
