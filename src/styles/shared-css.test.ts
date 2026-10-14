/**
 * Shared recipes have one home (CLAUDE.md §2):
 * - the control tier tokens of a size (`--prime-control-xs|s|l|xl-*`) are mapped once, in
 *   `src/internal/fieldTier.module.css`; everything else reads the tier variables it sets;
 * - the visually-hidden clip (`clip-path: inset(50%)`) is `src/internal/VisuallyHidden`;
 * - the dark shade over media (`--prime-color-media-shade`) is `src/internal/mediaPill`.
 *
 * In ratchet mode (`shared-css`): the copies found when the guard landed are the baseline.
 */
import { read } from "../test/contract-utils";
import { cssRules, moduleCssFiles } from "../test/css";
import { ratchet } from "../test/ratchet";

const RECIPES: { home: string; rule: string; test: (css: string) => number }[] = [
  {
    home: "src/internal/fieldTier.module.css",
    rule: "control tier tokens outside fieldTier",
    test: (css) => css.match(/--prime-control-(xs|s|l|xl)-/g)?.length ?? 0,
  },
  {
    home: "src/internal/VisuallyHidden.module.css",
    rule: "visually-hidden clip outside VisuallyHidden",
    test: (css) => css.match(/clip-path:\s*inset\(50%\)/g)?.length ?? 0,
  },
  {
    home: "src/internal/mediaPill.module.css",
    rule: "media shade outside mediaPill",
    test: (css) => css.match(/--prime-color-media-shade\b/g)?.length ?? 0,
  },
];

describe("shared CSS recipes", () => {
  it("each recipe lives in its one module", () => {
    const offenders: string[] = [];
    for (const file of moduleCssFiles()) {
      if (file.includes("/examples/")) continue;
      const css = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
      for (const { home, rule, test } of RECIPES) {
        if (file === home) continue;
        if (test(css) > 0) offenders.push(`${file}: ${rule}`);
      }
    }
    expect(cssRules("src/internal/fieldTier.module.css").length).toBeGreaterThan(0);
    ratchet("shared-css", offenders);
  });
});
