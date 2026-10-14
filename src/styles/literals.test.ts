/**
 * Component CSS speaks in tokens (foundation §1 rule 2, §7 rule 3): no raw length, color,
 * duration, easing, stacking or scale literal and no primitive `--prime-ref-*` token in a
 * declaration. Breakpoint conditions of `@media` take px (custom properties cannot be used there);
 * a container query takes rem (the `@container` rem convention, foundation §9).
 */
import { cssAtRules, cssRules, moduleCssFiles } from "../test/css";

/** Component and internal stylesheets; examples are checked by the docs contract. */
const files = [
  ...moduleCssFiles().filter((file) => !file.includes("/examples/")),
  "src/styles/globals.css",
  "src/styles/controls.css",
];

const RULES: { rule: string; pattern: RegExp }[] = [
  { rule: "raw length", pattern: /(?<![\w-])-?\d*\.?\d+(px|rem|em)\b/ },
  { rule: "hex color", pattern: /#[0-9a-fA-F]{3,8}\b/ },
  { rule: "raw duration", pattern: /(?<![\w-])\d*\.?\d+m?s\b/ },
  { rule: "cubic-bezier", pattern: /cubic-bezier\(/ },
  { rule: "primitive --prime-ref token", pattern: /--prime-ref-/ },
  { rule: "raw % in color-mix", pattern: /color-mix\([^;]*?\b\d+%/ },
  { rule: "numeric scale()", pattern: /\bscale[XY]?\(\s*-?\d/ },
];

describe("CSS literals", () => {
  it("declarations use tokens, not literals", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const rule of cssRules(file)) {
        // Keyframe steps are percentages; their values follow the same rules.
        for (const decl of rule.decls) {
          for (const { rule: name, pattern } of RULES) {
            if (pattern.test(decl.value)) offenders.push(`${file}: ${name} in ${decl.prop}`);
          }
          if (decl.prop === "z-index" && /^-?\d+$/.test(decl.value.trim())) {
            offenders.push(`${file}: numeric z-index`);
          }
        }
      }
      for (const at of cssAtRules(file)) {
        if (at.name === "container" && /\d+px/.test(at.params)) {
          offenders.push(`${file}: px in @container (use rem)`);
        }
      }
    }
    expect(offenders, "literals").toEqual([]);
  });
});
