// @vitest-environment node
/**
 * Each kind of state continuity has one engine (core decision 4 of the fix plan): a glyph that
 * changes in place cross-fades through its GlyphSwap host (`Button.Icon`, ProgressCircle children,
 * `src/internal/glyphSwap`), never a ternary of two icons that flips; a region keyed to remount
 * (`key={swapped …}`) is a local copy of the region swap (`src/internal/RegionSwap`).
 */
import { read, walk } from "./contract-utils";

const sources = walk("src", /\.tsx?$/).filter(
  (file) => !/\.test\.tsx?$|\/examples\/|^src\/test\//.test(file),
);

/** The engines themselves. */
const ENGINES = new Set([
  "src/internal/glyphSwap.tsx",
  "src/internal/RegionSwap.tsx",
  "src/components/crossfade/Crossfade.tsx",
]);

describe("glyph and region swaps", () => {
  it("swaps go through their engine", () => {
    const offenders: string[] = [];
    for (const file of sources) {
      if (ENGINES.has(file)) continue;
      const text = read(file);
      /* The kit's glyphs in this file: what it imports from `@/icons/glyphs/`. */
      const glyphs = [...text.matchAll(/^import \{ (\w+) \} from "@\/icons\/glyphs\/[\w-]+";/gm)]
        .map((m) => m[1])
        .join("|");
      const rules: [RegExp, string][] = [[/key=\{swapped\b/g, "key={swapped"]];
      if (glyphs) {
        rules.push([
          new RegExp(
            `\\?\\s*\\(?\\s*<(${glyphs})\\b[^>]*\\/>\\s*\\)?\\s*:\\s*\\(?\\s*<(${glyphs})\\b`,
            "g",
          ),
          "glyph ternary",
        ]);
      }
      for (const [pattern, rule] of rules) {
        for (const _ of text.matchAll(pattern)) offenders.push(`${file}: ${rule}`);
      }
    }
    expect(offenders, "glyph-swap").toEqual([]);
  });
});
