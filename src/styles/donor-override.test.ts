/**
 * A host never overrides a donor's internals (core decision 3 of the fix plan): it configures a
 * donor through its public API and the allowlisted public custom properties below. A missing mode
 * is added to the donor.
 * - No doubled-class selector (`.a.a`): a specificity hack to win over a donor.
 * - No custom property a stylesheet sets for another module to read (a donor's private variable),
 *   outside the public hooks.
 * - `:global(html …)` only in Dnd (the drag cursor).
 *
 * In ratchet mode (`donor-override`): the overrides found when the guard landed are the baseline.
 */
import path from "node:path";

import { read } from "../test/contract-utils";
import { cssRules, moduleCssFiles } from "../test/css";
import { numbered, ratchet } from "../test/ratchet";

/** Public hooks a host may set on a donor. */
const PUBLIC_HOOKS = [
  /^--prime-icon-size$/,
  /^--ring-fill$/,
  /^--sticky-bg$/,
  /^--dnd-gap-[\w-]+$/,
  /^--dnd-sortable-gap$/,
  /^--divider-bleed$/,
  /^--disclosure-[\w-]+$/,
  /^--enter-[\w-]+$/,
  /^--swatch-inline-size$/,
  /^--hairline-inset$/,
  /^--floating-width$/,
  /^--scroll-fade-depth$/,
  // Avatar's ground on a host that is not a layer of the ladder (Avatar COMPONENT.md).
  /^--avatar-ring$/,
];

const GLOBAL_HTML = new Set(["src/components/dnd/Dnd.module.css"]);

/**
 * Tables that publish variables for hosts to read (CLAUDE.md §2: hosts read the tier variables of
 * fieldTier): what they set is their output, not a donor's private variable.
 */
const PUBLISHERS = new Set(["src/internal/fieldTier.module.css"]);

const files = moduleCssFiles().filter((file) => !file.includes("/examples/"));

describe("donor overrides", () => {
  it("hosts configure donors only through their public API", () => {
    const readers = new Map<string, Set<string>>();
    for (const file of files) {
      for (const m of read(file).matchAll(/var\((--[\w-]+)/g)) {
        readers.set(m[1], new Set([...(readers.get(m[1]) ?? []), file]));
      }
    }
    const offenders: string[] = [];
    for (const file of files) {
      const dir = path.posix.dirname(file);
      if (/:global\(\s*html\b/.test(read(file)) && !GLOBAL_HTML.has(file)) {
        offenders.push(`${file}: :global(html)`);
      }
      for (const rule of cssRules(file)) {
        // Arguments of :not() / :is() / :has() are other elements' conditions, not this compound.
        const bare = rule.selector.replace(/\((?:[^()]|\([^()]*\))*\)/g, "()");
        for (const selector of bare.split(",")) {
          for (const compound of selector.trim().split(/\s+|>|\+|~/)) {
            const classes = [...compound.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
            if (new Set(classes).size < classes.length) {
              offenders.push(`${file}: doubled class in ${compound}`);
            }
          }
        }
        for (const decl of rule.decls) {
          if (!decl.prop.startsWith("--") || decl.prop.startsWith("--prime-")) continue;
          if (PUBLIC_HOOKS.some((hook) => hook.test(decl.prop))) continue;
          if (PUBLISHERS.has(file)) continue;
          const users = [...(readers.get(decl.prop) ?? [])];
          if (users.length === 0) continue; // unread: css-modules.test.ts
          if (users.every((user) => path.posix.dirname(user) !== dir)) {
            offenders.push(`${file}: sets ${decl.prop}, private to ${users[0]}`);
          }
        }
      }
    }
    ratchet("donor-override", numbered(offenders));
  });
});
