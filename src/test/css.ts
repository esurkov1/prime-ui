/**
 * CSS for tests and guards, parsed with postcss: a component test asserts a rule by its selector
 * (`cssRule`), never by a regex over the stylesheet text, and a guard walks every rule with its
 * at-rule context (`cssRules`). A selector that is not in the file throws, so an assertion can
 * never pass on a rule that does not exist.
 */
import fs from "node:fs";
import path from "node:path";

import postcss, { type AtRule, type Declaration, type Root, type Rule } from "postcss";

import { root, walk } from "./contract-utils";

const cache = new Map<string, Root>();

/** The parsed stylesheet at the repository-relative path `file`. */
export function parseCss(file: string): Root {
  let parsed = cache.get(file);
  if (!parsed) {
    parsed = postcss.parse(fs.readFileSync(path.join(root, file), "utf8"), { from: file });
    cache.set(file, parsed);
  }
  return parsed;
}

export type CssRule = {
  file: string;
  /** The selector as written, whitespace collapsed. */
  selector: string;
  /** Preludes of the at-rules around the rule, outermost first (`@media (hover: hover)`). */
  parents: string[];
  /** Declarations in order (a property may repeat). */
  decls: { prop: string; value: string; line: number }[];
  line: number;
  node: Rule;
};

const collapse = (text: string) => text.replace(/\s+/g, " ").trim();

function atPrelude(node: AtRule): string {
  return collapse(`@${node.name} ${node.params}`);
}

const rulesCache = new Map<string, CssRule[]>();

/** Every style rule of `file` with its at-rule context and declarations. */
export function cssRules(file: string): CssRule[] {
  const cached = rulesCache.get(file);
  if (cached) return cached;
  const rules: CssRule[] = [];
  parseCss(file).walkRules((node) => {
    const parents: string[] = [];
    for (let parent = node.parent; parent && parent.type !== "root"; parent = parent.parent) {
      if (parent.type === "atrule") parents.unshift(atPrelude(parent as AtRule));
      else if (parent.type === "rule") parents.unshift(collapse((parent as Rule).selector));
    }
    const decls = (node.nodes ?? [])
      .filter((child): child is Declaration => child.type === "decl")
      .map((decl) => ({ prop: decl.prop, value: decl.value, line: decl.source?.start?.line ?? 0 }));
    rules.push({
      file,
      selector: collapse(node.selector),
      parents,
      decls,
      line: node.source?.start?.line ?? 0,
      node,
    });
  });
  rulesCache.set(file, rules);
  return rules;
}

/** Every at-rule of `file` (`@media`, `@container`, `@keyframes`…) with its line. */
export function cssAtRules(file: string): { name: string; params: string; line: number }[] {
  const out: { name: string; params: string; line: number }[] = [];
  parseCss(file).walkAtRules((node) => {
    out.push({
      name: node.name,
      params: collapse(node.params),
      line: node.source?.start?.line ?? 0,
    });
  });
  return out;
}

/**
 * The rule of `file` whose selector is exactly `selector` (inside `parents` when given, matched
 * as prefixes of the at-rule preludes). Throws when there is none: an assertion on a missing
 * rule must fail, not pass vacuously.
 */
export function cssRule(file: string, selector: string, parents: string[] = []): CssRule {
  const wanted = collapse(selector);
  const found = cssRules(file).find(
    (rule) =>
      rule.selector === wanted &&
      rule.parents.length === parents.length &&
      parents.every((parent, index) => rule.parents[index].startsWith(collapse(parent))),
  );
  if (!found) {
    throw new Error(
      `${file}: no rule "${wanted}"${parents.length ? ` inside ${parents.join(" › ")}` : ""}`,
    );
  }
  return found;
}

/** The value of the last `prop` declaration of a rule; throws when the rule does not set it. */
export function cssValue(rule: CssRule, prop: string): string {
  const decl = rule.decls.filter((item) => item.prop === prop).at(-1);
  if (!decl) throw new Error(`${rule.file}: "${rule.selector}" sets no ${prop}`);
  return decl.value;
}

/** Repository-relative paths of every stylesheet under `src/` (generated token sheets included). */
export const srcCssFiles = () => walk("src", /\.css$/);

/** Repository-relative paths of the component and internal stylesheets: no generated sheets. */
export const moduleCssFiles = () => walk("src", /\.module\.css$/);
