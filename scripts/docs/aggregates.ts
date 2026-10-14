/**
 * Aggregates of the docs, generated so that no list is hand-copied:
 * - README.md, between `<!-- components:start -->` and `<!-- components:end -->`: the component
 *   tables by playground category (`playground/categories.ts`) in `nav.order`;
 * - SKILL/components.md, between the same markers: the skill's component index;
 * - SKILL/api-contract.md: the `<Icon name>` list between `<!-- icons:start -->` and
 *   `<!-- icons:end -->` (from `src/icons/registry.ts`) and the triad rows of the vocabulary table
 *   (`contractLists.ts`).
 *
 * A row's text is the component's purpose: the `> ` line of its COMPONENT.md.
 */
import fs from "node:fs";
import path from "node:path";

import type { ComponentPageConfig } from "../../playground/components/ComponentPage";
import type { ComponentApi } from "./componentApi";
import { triadRows } from "./contractLists";

const REPO = "https://github.com/esurkov1/prime-ui/blob/main";

type Category = { id: string; en: string; summary: string };
type Entry = { title: string; rel: string; purpose: string; order: number };

/** Rows that are not component dirs, by category: they keep their own links. */
const EXTRA_ROWS: Record<string, { title: string; purpose: string; docs: string }[]> = {
  foundations: [
    {
      title: "Icon",
      purpose:
        "Animated glyphs: the semantic `<Icon name>` set, the full set of about 500 in `prime-ui-kit/icons`, `createIcon` for the rest; each plays a gesture when its host is hovered or pressed.",
      docs: "[api-contract.md](api-contract.md#icons) · [full list](../src/icon-set.ts)",
    },
  ],
};

/** The text of `source` with the block between `<!-- name:start -->` and `<!-- name:end -->`. */
export function replaceBlock(source: string, name: string, body: string, file: string): string {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const from = source.indexOf(start);
  const to = source.indexOf(end);
  if (from === -1 || to === -1 || to < from) throw new Error(`${file}: no ${start} … ${end}`);
  return `${source.slice(0, from + start.length)}\n${body}\n${source.slice(to)}`;
}

/** The `> ` purpose line of a COMPONENT.md. */
export function purposeOf(doc: string, file: string): string {
  const line = doc.match(/^> (.+)$/m)?.[1];
  if (!line) throw new Error(`${file}: no "> " purpose line`);
  return line;
}

async function loadPages(root: string): Promise<ComponentPageConfig[]> {
  const dir = path.join(root, "playground/sections");
  const pages: ComponentPageConfig[] = [];
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith("Section.tsx")) continue;
    const { page } = (await import(path.join(dir, file))) as { page?: ComponentPageConfig };
    if (page) pages.push(page);
  }
  return pages;
}

function entriesByCategory(root: string, pages: ComponentPageConfig[]): Map<string, Entry[]> {
  const byCategory = new Map<string, Entry[]>();
  for (const page of pages) {
    const rel = `src/${page.base ?? "components"}/${page.dir}`;
    const docFile = `${rel}/COMPONENT.md`;
    const purpose = purposeOf(fs.readFileSync(path.join(root, docFile), "utf8"), docFile);
    const entry = {
      title: page.title,
      rel,
      purpose,
      order: page.nav?.order ?? Number.POSITIVE_INFINITY,
    };
    byCategory.set(page.category, [...(byCategory.get(page.category) ?? []), entry]);
  }
  for (const entries of byCategory.values()) {
    entries.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }
  return byCategory;
}

function readmeBlock(categories: readonly Category[], byCategory: Map<string, Entry[]>): string {
  return categories
    .filter((category) => byCategory.has(category.id))
    .map((category) =>
      [
        `### ${category.en} (\`${category.id}\`)`,
        "",
        "| Component | What it is for |",
        "|---|---|",
        ...(byCategory.get(category.id) ?? []).map(
          (entry) =>
            `| [**${entry.title}**](${REPO}/${entry.rel}/COMPONENT.md) | ${entry.purpose} |`,
        ),
      ].join("\n"),
    )
    .join("\n\n");
}

function skillBlock(categories: readonly Category[], byCategory: Map<string, Entry[]>): string {
  return categories
    .filter((category) => byCategory.has(category.id) || EXTRA_ROWS[category.id])
    .map((category) =>
      [
        `## ${category.en} (\`${category.id}\`)`,
        "",
        category.summary,
        "",
        "| Component | Purpose | Docs |",
        "|---|---|---|",
        ...(byCategory.get(category.id) ?? []).map(
          (entry) =>
            `| ${entry.title} | ${entry.purpose} | [COMPONENT.md](../${entry.rel}/COMPONENT.md) · [examples](../${entry.rel}/examples/) |`,
        ),
        ...(EXTRA_ROWS[category.id] ?? []).map(
          (row) => `| ${row.title} | ${row.purpose} | ${row.docs} |`,
        ),
      ].join("\n"),
    )
    .join("\n\n");
}

/** The `<Icon name>` list: one line per prefix, names in registry order. */
export function iconList(names: string[]): string {
  const groups = new Map<string, string[]>();
  for (const name of names) {
    const dot = name.indexOf(".");
    const prefix = name.slice(0, dot);
    groups.set(prefix, [...(groups.get(prefix) ?? []), name.slice(dot + 1)]);
  }
  const lines = [...groups].map(
    ([prefix, rest], index, all) =>
      `- \`${prefix}.*\`: ${rest.map((name) => `\`${name}\``).join(", ")}${index === all.length - 1 ? "." : ";"}`,
  );
  return ['`<Icon name="…" />` names:', ...lines].join("\n");
}

function replaceRows(source: string, rows: Record<string, string>, file: string): string {
  let next = source;
  for (const [first, row] of Object.entries(rows)) {
    const pattern = new RegExp(`^\\| ${first} \\|.*$`, "m");
    if (!pattern.test(next)) throw new Error(`${file}: no "| ${first} |" row`);
    next = next.replace(pattern, () => row);
  }
  return next;
}

/** Every aggregate file with its generated parts replaced, by repository-relative path. */
export async function renderAggregates(root: string): Promise<Record<string, string>> {
  const { PLAYGROUND_NAV_CATEGORIES } = await import(path.join(root, "playground/categories.ts"));
  const categories = PLAYGROUND_NAV_CATEGORIES as readonly Category[];
  const byCategory = entriesByCategory(root, await loadPages(root));
  const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

  const readme = replaceBlock(
    read("README.md"),
    "components",
    readmeBlock(categories, byCategory),
    "README.md",
  );
  const components = replaceBlock(
    read("SKILL/components.md"),
    "components",
    skillBlock(categories, byCategory),
    "SKILL/components.md",
  );

  const { iconRegistry } = await import(path.join(root, "src/icons/registry.ts"));
  const apis: { api: ComponentApi }[] = [];
  for (const base of ["components", "layout"]) {
    for (const dir of fs.readdirSync(path.join(root, "src", base)).sort()) {
      const file = path.join(root, "src", base, dir, "api.ts");
      if (fs.existsSync(file)) apis.push(await import(file));
    }
  }
  let contract = replaceBlock(
    read("SKILL/api-contract.md"),
    "icons",
    iconList(Object.keys(iconRegistry)),
    "SKILL/api-contract.md",
  );
  contract = replaceRows(contract, triadRows(apis), "SKILL/api-contract.md");

  return {
    "README.md": readme,
    "SKILL/components.md": components,
    "SKILL/api-contract.md": contract,
  };
}
