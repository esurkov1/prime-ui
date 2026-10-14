/**
 * Shared helpers of the contracts (docs-contract, skill-docs, part-refs, refs and the source
 * guards): repository paths, file walking, the component dirs, markdown sections and links, and
 * the checks every copyable source (an example, a screen) and its layout CSS must pass.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect } from "vitest";

import type { ApiText, ComponentApi } from "../../scripts/docs/componentApi";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

export const exists = (rel: string) => fs.existsSync(path.join(root, rel));

/** `button-group` → `ButtonGroup`. */
export const pascal = (kebab: string) =>
  kebab.replace(/(^|-)(\w)/g, (_, __: string, char: string) => char.toUpperCase());

/** Repository-relative files under `relDir` whose name matches `ext` (skips `dist`). */
export function walk(relDir: string, ext: RegExp): string[] {
  const abs = path.join(root, relDir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = `${relDir}/${entry.name}`;
    if (entry.isDirectory()) {
      return entry.name === "dist" || entry.name === "node_modules" ? [] : walk(rel, ext);
    }
    return ext.test(entry.name) ? [rel] : [];
  });
}

export type ComponentDir = { base: "components" | "layout"; dir: string; rel: string };

/**
 * Every component dir, from the filesystem: `src/components/*` and `src/layout/*`. The one list
 * the docs contract, part-refs, the catalogue checks and the screen tests share.
 */
export function componentDirs(): ComponentDir[] {
  return (["components", "layout"] as const).flatMap((base) =>
    fs
      .readdirSync(path.join(root, "src", base), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
      .map((dir) => ({ base, dir, rel: `src/${base}/${dir}` })),
  );
}

/** Filler a real screen never shows: lorem, numbered placeholders, emoji. */
export const PLACEHOLDER = /lorem|ipsum|Пункт \d|Item \d|Элемент \d|[\u{1F300}-\u{1FAFF}]/iu;

/**
 * The source without reaction data: the string value of an `emoji:` field (a `Message.Reactions`
 * item) is the one place an emoji is user content, not decoration. Everything else stays checked.
 */
export function withoutReactionData(source: string): string {
  return source.replace(/\bemoji:\s*"[^"\n]*"/g, 'emoji: ""');
}

/** The backticked code tokens of a text, sorted: `` `size` `` → `size`. */
export const codeTokens = (text: string) =>
  [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]).sort();

/** The one-line JSDoc text of a copyable source (`/** text *\/` on line 1). */
export const jsdocOf = (source: string) => source.match(/^\/\*\* (.+) \*\/\n/)?.[1];

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
  expect(withoutReactionData(source), `${file}: placeholder text`).not.toMatch(PLACEHOLDER);
}

/**
 * The rest of the copyable-source canon, as offender ids (`file: rule`) for the `example-canon`
 * ratchet: the JSDoc ends with the props it shows (` — \`a\`, \`b\`.`), no `biome-ignore`, no
 * `toISOString().slice(` (Datepicker formats dates), no raw `<dl>` (DescriptionList) and no
 * hand-written arrow-key handler (the kit's roving focus).
 */
export function sourceCanonOffenders(file: string, source: string): string[] {
  const offenders: string[] = [];
  const jsdoc = jsdocOf(source) ?? "";
  if (!/ — `[^`]+`(, `[^`]+`)*\.$/.test(jsdoc)) offenders.push(`${file}: JSDoc tail`);
  if (/biome-ignore/.test(source)) offenders.push(`${file}: biome-ignore`);
  if (/toISOString\(\)\.slice\(/.test(source)) offenders.push(`${file}: toISOString().slice`);
  if (/<d[ldt][\s>]/.test(source)) offenders.push(`${file}: raw <dl>`);
  if (/onKeyDown/.test(source) && /["'`]Arrow(Up|Down|Left|Right)["'`]/.test(source)) {
    offenders.push(`${file}: arrow-key onKeyDown`);
  }
  return offenders;
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

/**
 * What example CSS may not do, beyond `checkLayoutCss`: paint a surface (a bounded block is
 * `Card.Root`), style text (Typography), or reach into a component's tier tokens. Offender ids
 * are `file: property` (numbered when repeated) for the `example-css` ratchet.
 */
export const EXAMPLE_CSS_BANS = [
  /^background(-\w+)?$/,
  /^box-shadow$/,
  /^border(-[\w-]+)?$/,
  /^outline(-\w+)?$/,
  /^font(-[\w-]+)?$/,
  /^letter-spacing$/,
  /^text-transform$/,
  /^text-align$/,
  /^white-space$/,
  /^list-style(-\w+)?$/,
];
/** Component-tier tokens an example never sets or reads. */
export const EXAMPLE_TOKEN_BANS = /--prime-(card-padding|modal|drawer)-/;

export function layoutCssOffenders(file: string, css: string): string[] {
  const offenders: string[] = [];
  const lines = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));
  lines.split("\n").forEach((line) => {
    const m = line.match(/^\s*([a-z-]+)\s*:/);
    if (m && EXAMPLE_CSS_BANS.some((ban) => ban.test(m[1]))) {
      offenders.push(`${file}: ${m[1]}`);
    }
    if (EXAMPLE_TOKEN_BANS.test(line)) offenders.push(`${file}: component token`);
  });
  return offenders;
}

/** Longest part description in `api.ts` (`en` and `ru`): the element line and a short summary. */
export const API_PART_MAX = 280;
/** Longest prop description in `api.ts` (`en` and `ru`): one or two sentences. */
export const API_PROP_MAX = 220;

/**
 * Descriptions of `api` over the limits, as `Part.prop en: 312 > 220`. Details beyond a short
 * summary belong in the hand-written COMPONENT.md sections (Variants, States, Layout & spacing,
 * Accessibility, Mistakes), not in the API tables.
 */
export function overlongApiDescriptions(api: ComponentApi): string[] {
  const over: string[] = [];
  const check = (where: string, text: string | undefined, max: number) => {
    if (text && text.length > max) over.push(`${where}: ${text.length} > ${max}`);
  };
  for (const part of api.parts) {
    check(`${part.name} en`, part.en, API_PART_MAX);
    check(`${part.name} ru`, part.ru, API_PART_MAX);
    for (const prop of part.props) {
      check(`${part.name}.${prop.name} en`, prop.en, API_PROP_MAX);
      check(`${part.name}.${prop.name} ru`, prop.ru, API_PROP_MAX);
    }
  }
  return over;
}

/** The part's `en` without its leading ref line (`` `ref` → `X`. ``), which has no `ru` twin. */
export const withoutRefLine = (en: string) =>
  en.replace(/^(?:Generic [^;]+; )?`(?:forward)?[Rr]ef` → [^.]*(?:\.(?!\w)|$)\s*/, "");

/** Every bilingual text of an `api.ts`, by where it sits: `Part`, `Part.prop`, `labels.key`… */
export function apiTexts(api: ComponentApi): { where: string; text: ApiText }[] {
  const texts: { where: string; text: ApiText }[] = [];
  for (const part of api.parts) {
    texts.push({ where: part.name, text: { en: withoutRefLine(part.en), ru: part.ru } });
    for (const prop of part.props) {
      texts.push({ where: `${part.name}.${prop.name}`, text: prop });
      if (prop.defaultNote) {
        texts.push({ where: `${part.name}.${prop.name} default`, text: prop.defaultNote });
      }
    }
  }
  for (const type of api.types ?? []) {
    texts.push({ where: type.name, text: type });
    for (const field of type.fields)
      texts.push({ where: `${type.name}.${field.name}`, text: field });
  }
  for (const fn of api.functions ?? []) texts.push({ where: fn.name, text: fn });
  for (const label of api.labels) texts.push({ where: `labels.${label.key}`, text: label });
  api.accessibility.keyboard.forEach((row) => {
    texts.push({ where: `keyboard ${row.keys}`, text: row });
  });
  api.accessibility.aria.forEach((row, index) => {
    texts.push({ where: `aria ${index + 1}`, text: row });
  });
  return texts;
}

/** H2 section `## <title>` of a markdown document, without the heading line. */
export function docSection(doc: string, title: string): string {
  const start = doc.indexOf(`\n${title}\n`);
  if (start === -1) return "";
  const body = doc.slice(start + title.length + 2);
  const level = title.match(/^#+/)?.[0].length ?? 2;
  const end = body.search(new RegExp(`^#{1,${level}} `, "m"));
  return end === -1 ? body : body.slice(0, end);
}

/** The heading anchor GitHub gives `heading`: lower case, punctuation dropped, spaces → `-`. */
export function githubSlug(heading: string): string {
  return heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");
}

/** Every heading anchor of a markdown document (repeated headings get `-1`, `-2`…). */
export function headingSlugs(markdown: string): Set<string> {
  const slugs = new Set<string>();
  const counts = new Map<string, number>();
  const body = markdown.replace(/^```[\s\S]*?^```$/gm, "");
  for (const m of body.matchAll(/^#{1,6} (.+)$/gm)) {
    const slug = githubSlug(m[1].replace(/`/g, ""));
    const count = counts.get(slug) ?? 0;
    slugs.add(count === 0 ? slug : `${slug}-${count}`);
    counts.set(slug, count + 1);
  }
  return slugs;
}

/** Markdown link targets `[text](target)` of a text; external and mail links are skipped. */
export function linkTargets(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1])
    .filter((target) => target !== "" && !/^(mailto:|https?:)/.test(target));
}

/**
 * Why a relative link of the markdown file `from` (repository-relative) does not resolve, or
 * `null`: the file must exist and an `#anchor` into a markdown file must name one of its headings.
 */
export function brokenLink(from: string, target: string): string | null {
  const [file, anchor] = target.split("#");
  const rel =
    file === "" ? from : path.posix.normalize(path.posix.join(path.posix.dirname(from), file));
  if (!exists(rel)) return `${target}: no file ${rel}`;
  if (anchor && rel.endsWith(".md") && !headingSlugs(read(rel)).has(anchor)) {
    return `${target}: no heading #${anchor} in ${rel}`;
  }
  return null;
}
