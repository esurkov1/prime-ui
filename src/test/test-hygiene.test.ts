// @vitest-environment node
/**
 * Tests that can pass vacuously: a regex over a stylesheet's text passes when the rule moved, a
 * `[class*=…]` query passes on the wrong element, `getComputedStyle` in jsdom never sees CSS
 * Module rules. A component test asserts CSS through `src/test/css.ts` (`cssRule` throws on a
 * missing selector) and behaviour through roles and data attributes.
 */
import { read, walk } from "./contract-utils";

/** The shared contracts and CSS guards read stylesheets on purpose. */
const GUARDS = /^src\/(test|styles)\//;

const RULES: { rule: string; pattern: RegExp }[] = [
  {
    rule: "reads a .module.css as text",
    pattern:
      /\.module\.css\?raw|readFileSync\([^)]*module\.css|["'`][\w./-]*\.module\.css["'`]\s*\)\s*,\s*["']utf/,
  },
  { rule: "queries [class*=", pattern: /\[class\*=/ },
  { rule: "getComputedStyle", pattern: /\bgetComputedStyle\(/ },
];

describe("test hygiene", () => {
  it("component tests assert CSS through css.ts, never by its text or computed styles", () => {
    const offenders: string[] = [];
    for (const file of walk("src", /\.test\.tsx?$/).filter((item) => !GUARDS.test(item))) {
      const source = read(file);
      for (const { rule, pattern } of RULES) {
        if (pattern.test(source)) offenders.push(`${file}: ${rule}`);
      }
    }
    expect(offenders, "test-hygiene").toEqual([]);
  });
});
