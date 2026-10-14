import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { TOKEN_DEFAULTS } from "./tokenDefaults";

const styles = path.resolve(import.meta.dirname, "../styles");

function declarations(file: string): Map<string, string> {
  const css = fs.readFileSync(path.join(styles, file), "utf8");
  return new Map([...css.matchAll(/^\s+(--prime-[\w-]+):\s*([^;]+);/gm)].map((m) => [m[1], m[2]]));
}

const tokens = new Map([...declarations("tokens.css"), ...declarations("theme-light.css")]);
const dark = declarations("theme-dark.css");

/** The literal behind a token, following `var()` to the primitive. */
function literal(name: string): string {
  let value = tokens.get(name);
  for (let hops = 0; value?.startsWith("var("); hops++) {
    if (hops > 8) throw new Error(`${name}: var() chain too deep`);
    value = tokens.get(value.slice(4, -1).trim());
  }
  if (value === undefined) throw new Error(`${name}: not declared`);
  return value.trim();
}

/** `230ms` → 230, `0.5rem` → 8 (at a 16px root), `24px` → 24. */
function toNumber(value: string): number {
  const match = value.match(/^(-?[\d.]+)(ms|px|rem)$/);
  if (!match) throw new Error(`${value} is neither a duration nor a length`);
  const number = Number(match[1]);
  return match[2] === "rem" ? number * 16 : number;
}

describe("TOKEN_DEFAULTS", () => {
  it.each(Object.entries(TOKEN_DEFAULTS))("%s agrees with the CSS", (name, value) => {
    expect(toNumber(literal(name))).toBe(value);
  });

  it.each(Object.keys(TOKEN_DEFAULTS))("%s is the same in both themes", (name) => {
    expect(dark.has(name)).toBe(false);
  });
});
