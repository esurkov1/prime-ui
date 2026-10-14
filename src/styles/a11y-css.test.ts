/**
 * State that assistive tech reads is state a person sees (CLAUDE.md, never by color alone and
 * styled only from `data-*` and ARIA): a component that sets `data-pressed`, `aria-pressed` or
 * `aria-current` has a CSS selector for it (in its own stylesheets or the internal ones it uses),
 * and a list styled `list-style: none` keeps its list semantics with `role="list"` (WebKit drops
 * them otherwise).
 *
 * In ratchet mode (`a11y-css`): the gaps found when the guard landed are the baseline.
 */
import path from "node:path";

import { read, walk } from "../test/contract-utils";
import { cssRules } from "../test/css";
import { ratchet } from "../test/ratchet";

const STATES = ["data-pressed", "aria-pressed", "aria-current"];

/** States a component shows by its content instead of a selector, with the reason. */
const SHOWN_BY_CONTENT: Record<string, string> = {
  "src/components/input: aria-pressed":
    "Input.RevealButton swaps its glyph (eye ⇄ eye-off) with the state",
};

/** The stylesheets a component's sources import, internal ones included. */
function stylesheetsOf(dir: string, sources: string[]): string[] {
  const sheets = new Set(walk(dir, /\.css$/).filter((file) => !file.includes("/examples/")));
  for (const file of sources) {
    for (const m of read(file).matchAll(/from "([^"]+\.module\.css)"/g)) {
      const spec = m[1];
      const target = spec.startsWith("@/")
        ? `src/${spec.slice(2)}`
        : path.posix.normalize(path.posix.join(path.posix.dirname(file), spec));
      sheets.add(target);
    }
  }
  return [...sheets];
}

describe("a11y state in CSS", () => {
  it("ARIA and data states a component sets are styled, and bare lists keep their role", () => {
    const offenders: string[] = [];
    const shown = new Set<string>();
    const dirs = [
      ...walk("src/components", /COMPONENT\.md$/),
      ...walk("src/layout", /COMPONENT\.md$/),
    ].map((doc) => path.posix.dirname(doc));
    for (const dir of dirs) {
      const sources = walk(dir, /\.tsx$/).filter((file) => !/\.test\.tsx$|\/examples\//.test(file));
      const tsx = sources.map(read).join("\n");
      const sheets = stylesheetsOf(dir, sources);
      const selectors = sheets
        .flatMap((file) => cssRules(file).map((rule) => rule.selector))
        .join("\n");
      for (const state of STATES) {
        const sets = new RegExp(`["']?${state}["']?\\s*[=:]`).test(tsx);
        if (!sets || selectors.includes(`[${state}`)) continue;
        if (SHOWN_BY_CONTENT[`${dir}: ${state}`]) shown.add(`${dir}: ${state}`);
        else offenders.push(`${dir}: sets ${state}, no selector`);
      }
      const bareList = sheets.some((file) =>
        cssRules(file).some((rule) =>
          rule.decls.some(({ prop, value }) => prop === "list-style" && value === "none"),
        ),
      );
      if (bareList && /<(ul|ol)\b/.test(tsx) && !/role="list"/.test(tsx)) {
        offenders.push(`${dir}: list-style none without role="list"`);
      }
    }
    expect(Object.keys(SHOWN_BY_CONTENT).filter((key) => !shown.has(key))).toEqual([]);
    ratchet("a11y-css", offenders);
  });
});
