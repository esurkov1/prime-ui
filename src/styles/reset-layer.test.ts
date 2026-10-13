import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const read = (file: string) =>
  readFileSync(join(__dirname, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * The resets of browser styles have the specificity of the kit's shared zero-specificity rules
 * (`:where(.trigger)`, `:where(.surface)`): outside a cascade layer the one emitted later wins, and
 * `:where(button) { padding: 0; background: none }` strips every field trigger. In `prime-reset`
 * every unlayered component rule wins whatever the order.
 */
describe("browser style resets", () => {
  it.each(["controls.css", "reset.css"])("%s is one `@layer prime-reset` block", (file) => {
    const css = read(file).trim();
    expect(css.startsWith("@layer prime-reset {")).toBe(true);
    expect(css.endsWith("}")).toBe(true);
    // Nothing after the layer block closes: count braces to its end.
    let depth = 0;
    let closedAt = -1;
    for (let i = css.indexOf("{"); i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) {
        closedAt = i;
        break;
      }
    }
    expect(closedAt).toBe(css.length - 1);
  });
});
