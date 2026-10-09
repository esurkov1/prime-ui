import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Style-invalidation guard for `:has()`. Blink invalidates `:has()` by feature, not by rule: once an
 * attribute is named inside any `:has()` argument, a change of that attribute on any element sends
 * Blink up the ancestors to re-match every `:has()` anchor on the way (an app shell root included),
 * which can recalculate the whole page. Attributes that change per keystroke, per drag step or per
 * arrow key must therefore never appear inside `:has()`: React rewrites `value` on every keystroke
 * of a controlled input, the textarea mirror writes `data-value`, a slider writes its inline style
 * and `aria-valuetext`, a listbox moves `aria-activedescendant` / `data-highlighted`. Match a class
 * instead (`.select:has(> .placeholder:checked)`).
 */

const HOT_ATTRIBUTES = [
  "value",
  "style",
  "data-value",
  "aria-valuenow",
  "aria-valuetext",
  "aria-activedescendant",
  "aria-selected",
  "data-highlighted",
];

const roots = ["src", "playground", "SKILL"].map((dir) => path.resolve(process.cwd(), dir));

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (name === "node_modules") return [];
    if (statSync(full).isDirectory()) return cssFiles(full);
    return name.endsWith(".css") ? [full] : [];
  });
}

/** The argument of every `:has(...)` in a selector, balanced parentheses included. */
function hasArguments(css: string): string[] {
  const out: string[] = [];
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let from = source.indexOf(":has(");
  while (from !== -1) {
    let depth = 0;
    let end = from + ":has".length;
    for (; end < source.length; end++) {
      if (source[end] === "(") depth++;
      else if (source[end] === ")" && --depth === 0) break;
    }
    out.push(source.slice(from + ":has(".length, end));
    from = source.indexOf(":has(", end);
  }
  return out;
}

describe(":has() invalidation", () => {
  it("never names a per-keystroke or per-frame attribute inside :has()", () => {
    const pattern = new RegExp(`\\[\\s*(${HOT_ATTRIBUTES.join("|")})\\s*[\\]~|^$*=]`);
    const offenders = roots.flatMap(cssFiles).flatMap((file) =>
      hasArguments(readFileSync(file, "utf8"))
        .filter((argument) => pattern.test(argument))
        .map((argument) => `${path.relative(process.cwd(), file)}: :has(${argument})`),
    );
    expect(offenders).toEqual([]);
  });
});
