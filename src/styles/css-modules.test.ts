/**
 * CSS Modules hold no dead weight:
 * - every `styles.x` a source reads is a class of the module it imports (an unknown class is
 *   `undefined` at runtime: the element silently loses its style);
 * - every local custom property a module declares is read somewhere;
 * - no `* 1` factor in a `calc()`;
 * - no declaration a later one of the same rule overrides (a fallback pair for an older value,
 *   like `100vh` before `100dvh`, is not an override: the values differ in kind).
 *
 * In ratchet mode (`css-modules`): the offenders found when the guard landed are the baseline.
 */
import path from "node:path";

import { read, walk } from "../test/contract-utils";
import { cssRules, moduleCssFiles } from "../test/css";
import { numbered, ratchet } from "../test/ratchet";

const sources = walk("src", /\.tsx?$/).filter((file) => !/\.test\.tsx?$/.test(file));

/** The class names a module defines. */
function classesOf(file: string): Set<string> {
  const classes = new Set<string>();
  for (const rule of cssRules(file)) {
    for (const m of rule.selector.matchAll(/\.([A-Za-z_][\w-]*)/g)) classes.add(m[1]);
  }
  return classes;
}

/** A value's kind for the fallback test: its unit or function. */
const kind = (value: string) => value.match(/[a-z%]+|\w+\(/i)?.[0] ?? value;

describe("CSS Modules", () => {
  it("modules hold no dead classes, variables, factors or overrides", () => {
    const offenders: string[] = [];
    for (const file of sources) {
      const text = read(file);
      for (const m of text.matchAll(/^import (\w+) from "([^"]+\.module\.css)";/gm)) {
        const [, name, spec] = m;
        const module = spec.startsWith("@/")
          ? `src/${spec.slice(2)}`
          : path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
        const classes = classesOf(module);
        const body = text.replace(/^import .*$/gm, "");
        for (const use of body.matchAll(new RegExp(`\\b${name}\\.([A-Za-z_]\\w*)`, "g"))) {
          if (!classes.has(use[1]))
            offenders.push(`${file}: ${name}.${use[1]} is not in ${module}`);
        }
      }
    }
    const allCss = [...moduleCssFiles(), ...walk("src/styles", /\.css$/)].map(read).join("\n");
    const allCode = sources.map(read).join("\n");
    for (const file of moduleCssFiles()) {
      for (const rule of cssRules(file)) {
        const seen = new Map<string, string>();
        for (const decl of rule.decls) {
          if (
            decl.prop.startsWith("--") &&
            !decl.prop.startsWith("--prime-") &&
            !allCss.includes(`var(${decl.prop}`) &&
            !allCode.includes(`"${decl.prop}"`)
          ) {
            offenders.push(`${file}: ${decl.prop} is never read`);
          }
          if (/\*\s*1(?![\d.])|(?<![\d.])1\s*\*/.test(decl.value)) {
            offenders.push(`${file}: * 1 factor in ${decl.prop}`);
          }
          const before = seen.get(decl.prop);
          if (before !== undefined && kind(before) === kind(decl.value)) {
            offenders.push(`${file}: ${rule.selector} overrides its own ${decl.prop}`);
          }
          seen.set(decl.prop, decl.value);
        }
      }
    }
    ratchet("css-modules", numbered(offenders));
  });
});
