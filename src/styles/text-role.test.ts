/**
 * Text has one home per concern (AGENTS.md §2): a text role (size, line height, weight, tracking)
 * comes from `src/internal/textRole.module.css` (or Typography), a text tone from
 * `src/internal/textTone.module.css`. A component never reads a role's `-tracking` / `-weight`
 * token itself, and never maps `[data-tone]` to a color of its own.
 */
import { read } from "../test/contract-utils";
import { cssRules, moduleCssFiles } from "../test/css";

const HOMES = new Set([
  "src/internal/textRole.module.css",
  "src/internal/textTone.module.css",
  "src/components/typography/Typography.module.css",
]);

describe("text roles and tones", () => {
  it("roles and tones come from their shared modules", () => {
    const offenders: string[] = [];
    for (const file of moduleCssFiles()) {
      if (HOMES.has(file) || file.includes("/examples/")) continue;
      for (const m of read(file).matchAll(/var\((--prime-text-[\w-]+-(tracking|weight))\)/g)) {
        offenders.push(`${file}: reads ${m[1]}`);
      }
      for (const rule of cssRules(file)) {
        if (!/\[data-tone[=\]]/.test(rule.selector)) continue;
        if (rule.decls.some(({ prop }) => prop === "color")) {
          offenders.push(`${file}: local [data-tone] color (${rule.selector})`);
        }
      }
    }
    expect(offenders, "text-role").toEqual([]);
  });
});
