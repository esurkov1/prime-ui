/**
 * Shared helpers of the docs contracts (docs-contract, patterns-contract, skill-docs): repository
 * paths, file walking, and the checks every copyable source (an example, a pattern) and its
 * layout CSS must pass.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect } from "vitest";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

/** `button-group` → `ButtonGroup`. */
export const pascal = (kebab: string) =>
  kebab.replace(/(^|-)(\w)/g, (_, __: string, char: string) => char.toUpperCase());

/** Repository-relative files under `relDir` whose name matches `ext` (skips `dist`). */
export function walk(relDir: string, ext: RegExp): string[] {
  const abs = path.join(root, relDir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = `${relDir}/${entry.name}`;
    if (entry.isDirectory()) return entry.name === "dist" ? [] : walk(rel, ext);
    return ext.test(entry.name) ? [rel] : [];
  });
}

/** Filler a real screen never shows: lorem, numbered placeholders, emoji. */
export const PLACEHOLDER = /lorem|ipsum|Пункт \d|Item \d|Элемент \d|[\u{1F300}-\u{1FAFF}]/iu;

/**
 * The canon of a copyable source file: a one-line English JSDoc first, imports only from
 * `allowedImport`, React as a namespace import, no inline style, no explicit default size, no
 * placeholder text.
 */
export function checkSourceCanon(
  file: string,
  source: string,
  allowedImport: (spec: string) => boolean,
) {
  expect(source, `${file}: one-line English JSDoc ending with "."`).toMatch(
    /^\/\*\* [^Ѐ-ӿ\n]+\. \*\/\n/,
  );
  for (const m of source.matchAll(/(?:from|import) "([^"]+)"/g)) {
    expect(allowedImport(m[1]), `${file} imports "${m[1]}"`).toBe(true);
  }
  expect(source, `${file}: React as \`import * as React from "react"\``).not.toMatch(
    /^import (?!\* as React from "react";).* from "react";$/m,
  );
  expect(source, `${file}: inline style`).not.toMatch(/style=\{\{/);
  expect(source, `${file}: size "m" is the default — omit it`).not.toMatch(/\bsize="m"/);
  expect(source, `${file}: placeholder text`).not.toMatch(PLACEHOLDER);
}

/**
 * Layout CSS next to a copyable source: semantic tokens only (no `--prime-ref-*`, hex or raw
 * px / rem outside breakpoints) and no text styling — text belongs to Typography. `forbidden`
 * adds properties the file must not set either.
 */
export function checkLayoutCss(file: string, css: string, forbidden: string[] = []) {
  // Breakpoints in @media / @container conditions cannot use custom properties (foundation §9).
  const sheet = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*@(media|container)\b.*$/gm, "");
  expect(sheet, file).not.toMatch(/--prime-ref-/);
  expect(sheet, file).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  expect(sheet, file).not.toMatch(/(?<![\w-])\d*\.?\d+(px|rem)\b/);
  const properties = [
    "font-size",
    "font-weight",
    "line-height",
    "letter-spacing",
    "font-family",
    ...forbidden,
  ];
  expect(sheet, file).not.toMatch(new RegExp(`^\\s*(${properties.join("|")})\\s*:`, "m"));
}
