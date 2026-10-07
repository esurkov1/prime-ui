/**
 * Docs contract: every exported component ships a COMPONENT.md and examples/ that stay in sync
 * with the playground and import the kit only by its package name. Components converted to the
 * page standard (`playground/pageStandard.ts`) are also checked for kind, slots, order, the
 * example file canon and the COMPONENT.md template.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { ComponentPageConfig } from "../../playground/components/ComponentPage";
import {
  KIND_SLOTS,
  PAGE_KINDS,
  requiredSlots,
  SCENARIOS,
  SLOT_IDS,
  type SlotId,
  slotOrder,
} from "../../playground/pageStandard";
import { applyApiToDoc, type ComponentApi } from "../../scripts/docs/componentApi";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

/**
 * Pages still on the old layout. The page-standard checks skip them; Stage 1 converts them and
 * empties this list. Never add a dir here: new and converted pages follow the standard.
 */
const NOT_CONVERTED = new Set([
  "accordion",
  "app-shell",
  "avatar",
  "badge",
  "banner",
  "breadcrumb",
  "button-group",
  "card",
  "checkbox",
  "code-block",
  "color-picker",
  "color-swatches",
  "data-table",
  "datepicker",
  "digit-input",
  "divider",
  "dnd",
  "drawer",
  "empty-page",
  "example-frame",
  "file-upload",
  "kbd",
  "label",
  "link-button",
  "login-form",
  "notification",
  "page-content",
  "pagination",
  "progress-bar",
  "progress-circle",
  "radio",
  "scroll-container",
  "segmented-control",
  "sidebar",
  "slider",
  "smart-filter",
  "stepper",
  "switch",
  "tabs",
  "textarea",
  "thumbnail",
  "timeline",
  "typography",
]);

type ComponentDir = { base: "components" | "layout"; dir: string; rel: string };

function exportedDirs(): ComponentDir[] {
  const result: ComponentDir[] = [];
  for (const base of ["components", "layout"] as const) {
    const source = read(`src/${base}/index.ts`);
    const dirs = new Set([...source.matchAll(/from "\.\/([\w-]+)\//g)].map((m) => m[1]));
    for (const dir of dirs) result.push({ base, dir, rel: `src/${base}/${dir}` });
  }
  return result;
}

function walk(relDir: string, ext: RegExp): string[] {
  const abs = path.join(root, relDir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = `${relDir}/${entry.name}`;
    if (entry.isDirectory()) return entry.name === "dist" ? [] : walk(rel, ext);
    return ext.test(entry.name) ? [rel] : [];
  });
}

const pascal = (kebab: string) =>
  kebab.replace(/(^|-)(\w)/g, (_, __: string, char: string) => char.toUpperCase());

/** Category of each component dir, derived from CATEGORY_PAGES: page → page module → its dir. */
function categoriesByDir() {
  const pages = read("playground/playgroundPages.tsx");
  const labels = new Map(
    [...pages.matchAll(/\{ id: "([\w-]+)", label: "([^"]+)" \}/g)].map((m) => [m[1], m[2]]),
  );
  const imports = new Map(
    [...pages.matchAll(/^import (\w+) from "\.\/([^"]+)";$/gm)].map((m) => [m[1], m[2]]),
  );
  const start = pages.indexOf("const CATEGORY_PAGES");
  const block = pages.slice(start, pages.indexOf("\n};\n", start));
  const byDir = new Map<string, { id: string; label: string }>();
  let category = "";
  for (const line of block.split("\n")) {
    const key = line.match(/^ {2}"?([\w-]+)"?: \[/);
    if (key) category = key[1];
    const page = line.match(/Page: (\w+),/);
    if (!page) continue;
    const moduleRel = imports.get(page[1]);
    if (!moduleRel) continue;
    const files = [`playground/${moduleRel}.tsx`];
    const moduleDir = path.posix.dirname(files[0]);
    for (const m of read(files[0]).matchAll(/from "\.\/(\w+)";/g)) {
      const local = `${moduleDir}/${m[1]}.tsx`;
      if (fs.existsSync(path.join(root, local))) files.push(local);
    }
    for (const file of files) {
      const source = read(file);
      const dirs = [
        ...[...source.matchAll(/@\/(?:components|layout)\/([\w-]+)\/examples\//g)].map((m) => m[1]),
        ...[...source.matchAll(/^ {2}dir: "([\w-]+)",$/gm)].map((m) => m[1]),
      ];
      for (const dir of dirs) byDir.set(dir, { id: category, label: labels.get(category) ?? "" });
    }
  }
  return byDir;
}

const ALLOWED_IMPORTS =
  /^(prime-ui-kit|react|react-dom|lucide-react|date-fns(\/.*)?|react-router-dom)$/;
const REQUIRED_HEADINGS = ["## When to use", "## Import", "## API", "## Examples"];
const TEMPLATE_HEADINGS = [
  "## When to use",
  "## When not to use",
  "## Import",
  "## Anatomy",
  "## API",
  "## Variants",
  "## States",
  "## Layout & spacing",
  "## Accessibility",
  "## Examples",
  "## Mistakes",
  "## Related",
];
const ACCESSIBILITY_HEADINGS = ["### Keyboard", "### ARIA", "### Labels"];
const PLACEHOLDER_TEXT = /lorem|ipsum|Пункт \d|Item \d|Элемент \d|[\u{1F300}-\u{1FAFF}]/iu;

const dirs = exportedDirs();
const categories = categoriesByDir();
const playgroundSource = walk("playground", /\.tsx?$/)
  .map(read)
  .join("\n");

const sectionModules = import.meta.glob<{ page?: ComponentPageConfig }>(
  "../../playground/sections/*Section.tsx",
);
const apiModules = import.meta.glob<{ api: ComponentApi }>("../{components,layout}/*/api.ts");

/** H2 section `## <title>` of a markdown document, without the heading line. */
function docSection(doc: string, title: string): string {
  const start = doc.indexOf(`\n${title}\n`);
  if (start === -1) return "";
  const body = doc.slice(start + title.length + 2);
  const end = body.search(/^## /m);
  return end === -1 ? body : body.slice(0, end);
}

/** The one-line JSDoc text of an example (`/** text *\/` on line 1). */
const jsdocOf = (source: string) => source.match(/^\/\*\* (.+) \*\/\n/)?.[1];

const codeTokens = (text: string) => [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]).sort();

const exampleFile = (example: ComponentPageConfig["examples"][number]) =>
  "slot" in example ? example.slot : example.scenario;

describe("docs contract", () => {
  it("finds exported component dirs", () => {
    expect(dirs.length).toBeGreaterThan(40);
  });

  it("the exclusion list names only exported dirs", () => {
    const names = new Set(dirs.map((d) => d.dir));
    for (const dir of NOT_CONVERTED) expect(names.has(dir), dir).toBe(true);
  });

  describe.each(dirs)("$rel", ({ base, dir, rel }) => {
    const docPath = `${rel}/COMPONENT.md`;
    const examples = walk(`${rel}/examples`, /\.tsx$/);
    const converted = !NOT_CONVERTED.has(dir);

    it("has COMPONENT.md and examples/", () => {
      expect(fs.existsSync(path.join(root, docPath)), docPath).toBe(true);
      expect(examples.length, `${rel}/examples`).toBeGreaterThan(0);
    });

    it("COMPONENT.md has the required sections and the playground category", () => {
      const doc = read(docPath);
      expect(doc).toMatch(/^# \S/);
      for (const heading of REQUIRED_HEADINGS) {
        expect(doc, `${docPath}: ${heading}`).toMatch(new RegExp(`^${heading}$`, "m"));
      }
      const category = categories.get(dir);
      expect(category, `${dir} is not shown by any CATEGORY_PAGES page`).toBeDefined();
      expect(doc).toMatch(new RegExp(`^\\*\\*Category:\\*\\* ${category?.id}$`, "m"));
      expect(doc).not.toMatch(/--prime-(ref|sys)-/);
    });

    it.each(examples.map((file) => path.posix.basename(file)))("examples/%s", (name) => {
      const file = `${rel}/examples/${name}`;
      const source = read(file);
      const stem = name.replace(/\.tsx$/, "");

      expect(read(docPath), `${file} is not listed in COMPONENT.md`).toContain(`examples/${name}`);
      if (!converted) {
        expect(
          playgroundSource.includes(`@/${base}/${dir}/examples/${stem}"`),
          `${file} is not imported by the playground`,
        ).toBe(true);
      }

      expect(source.startsWith("/**"), `${file}: first line must be a JSDoc`).toBe(true);
      expect(source.match(/^export default function \w+Example\(/gm)?.length).toBe(1);

      for (const m of source.matchAll(/(?:from|import) "([^"]+)"/g)) {
        const spec = m[1];
        const ok = ALLOWED_IMPORTS.test(spec) || /^\.\/[\w-]+\.module\.css$/.test(spec);
        expect(ok, `${file} imports "${spec}"`).toBe(true);
      }

      if (converted) {
        expect(jsdocOf(source), `${file}: one-line English JSDoc ending with "."`).toMatch(
          /^[^Ѐ-ӿ]+\.$/,
        );
        expect(source, `${file}: function name`).toMatch(
          new RegExp(`^export default function ${pascal(dir)}${pascal(stem)}Example\\(\\)`, "m"),
        );
        expect(source, `${file}: inline style`).not.toMatch(/style=\{\{/);
        expect(source, `${file}: placeholder text`).not.toMatch(PLACEHOLDER_TEXT);
      }
    });

    it("example styles use semantic tokens only", () => {
      for (const file of walk(`${rel}/examples`, /\.css$/)) {
        // Breakpoints in @media / @container conditions cannot use custom properties (foundation §9).
        const css = read(file)
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/^\s*@(media|container)\b.*$/gm, "");
        expect(css, file).not.toMatch(/--prime-(ref|sys)-/);
        expect(css, file).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
        expect(css, file).not.toMatch(/(?<![\w-])\d*\.?\d+(px|rem)\b/);
        // Text is styled by Typography.Root, never by example CSS.
        expect(css, file).not.toMatch(
          /^\s*(font-size|font-weight|line-height|letter-spacing|font-family)\s*:/m,
        );
      }
    });

    if (!converted) return;

    describe("page standard", () => {
      let page: ComponentPageConfig;

      beforeAll(async () => {
        const load = sectionModules[`../../playground/sections/${pascal(dir)}Section.tsx`];
        expect(load, `playground/sections/${pascal(dir)}Section.tsx`).toBeDefined();
        const module = await load();
        expect(module.page, `${pascal(dir)}Section exports no page config`).toBeDefined();
        page = module.page as ComponentPageConfig;
      });

      it("page config matches the dir and declares a kind", () => {
        expect(page.dir).toBe(dir);
        expect(page.base ?? "components").toBe(base);
        expect(PAGE_KINDS).toContain(page.kind);
        expect(read(docPath)).toMatch(new RegExp(`^\\*\\*Kind:\\*\\* ${page.kind}$`, "m"));
      });

      it("lists every example file exactly once", () => {
        const listed = page.examples.map(exampleFile);
        expect(new Set(listed).size, "duplicate example").toBe(listed.length);
        const files = examples.map((file) => path.posix.basename(file, ".tsx")).sort();
        expect([...listed].sort()).toEqual(files);
      });

      it("uses the kind's slots, in order, with every required slot", () => {
        const allowed = KIND_SLOTS[page.kind].map((entry) => entry.slot);
        const slots: SlotId[] = [];
        let previous = -1;
        for (const example of page.examples) {
          const slot = "slot" in example ? example.slot : null;
          if (slot) {
            expect(allowed, `${slot} is not a ${page.kind} slot`).toContain(slot);
            slots.push(slot);
          } else {
            const name = exampleFile(example);
            expect(allowed, `${page.kind} pages take no scenarios`).toContain(SCENARIOS);
            expect(SLOT_IDS as readonly string[], `${name} must use the slot`).not.toContain(name);
            expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/);
          }
          const order = slotOrder(page.kind, slot);
          expect(order, `${exampleFile(example)} is out of slot order`).toBeGreaterThanOrEqual(
            previous,
          );
          previous = order;
          expect(example.description, `${exampleFile(example)}: description`).toMatch(/\.$/);
        }
        const rootProps = (page.api.parts[0]?.props ?? []).map((prop) => prop.name);
        for (const slot of requiredSlots(page.kind, rootProps)) {
          expect(slots, `required slot "${slot}"`).toContain(slot);
        }
      });

      it("example descriptions name the same props as the example JSDoc", () => {
        for (const example of page.examples) {
          const file = `${rel}/examples/${exampleFile(example)}.tsx`;
          const jsdoc = jsdocOf(read(file)) ?? "";
          expect(codeTokens(example.description), file).toEqual(codeTokens(jsdoc));
        }
      });

      it("COMPONENT.md follows the template", () => {
        const doc = read(docPath);
        expect(doc.match(/^## .+$/gm)).toEqual(TEMPLATE_HEADINGS);
        const a11y = docSection(doc, "## Accessibility");
        expect(a11y.match(/^### .+$/gm)).toEqual(ACCESSIBILITY_HEADINGS);
        expect(docSection(doc, "## Related")).toMatch(/^- \*\*Built from:\*\* .+$/m);
        expect(docSection(doc, "## Related")).toMatch(/^- \*\*See also:\*\* .+$/m);
      });

      it("COMPONENT.md accessibility matches the page", () => {
        const a11y = docSection(read(docPath), "## Accessibility");
        const keyboard = a11y.slice(a11y.indexOf("### Keyboard"), a11y.indexOf("### ARIA"));
        const keys = [...keyboard.matchAll(/^\| (`.+?`(?: · `.+?`)*) \|/gm)].map((m) =>
          m[1].replaceAll("`", ""),
        );
        expect(keys).toEqual(page.accessibility.keyboard.map((row) => row.keys));
        if (page.accessibility.keyboard.length === 0) {
          expect(keyboard).toContain("No keyboard interaction.");
        }
        const labels = a11y.slice(a11y.indexOf("### Labels"));
        const keysInDoc = [...labels.matchAll(/^\| `(\w+)` \|/gm)].map((m) => m[1]);
        expect(keysInDoc).toEqual(page.api.labels.map((label) => label.key));
      });

      it("COMPONENT.md API and Labels are generated from api.ts (bun run docs:build)", async () => {
        const load = apiModules[`../${base}/${dir}/api.ts`];
        expect(load, `${rel}/api.ts`).toBeDefined();
        const { api } = await load();
        expect(page.api, `${pascal(dir)}Section must pass the api from api.ts`).toBe(api);
        const doc = read(docPath);
        expect(doc === applyApiToDoc(doc, api), `${docPath} is stale: run bun run docs:build`).toBe(
          true,
        );
      });

      it("COMPONENT.md lists the examples in page order with their JSDoc", () => {
        const section = docSection(read(docPath), "## Examples");
        expect(section).toContain("| Example | Shows |");
        const rows = [
          ...section.matchAll(/^\| \[([\w-]+)\.tsx\]\(examples\/\1\.tsx\) \| (.+) \|$/gm),
        ];
        expect(rows.map((m) => m[1])).toEqual(page.examples.map(exampleFile));
        for (const [, stem, shows] of rows) {
          expect(shows, `${stem}.tsx`).toBe(jsdocOf(read(`${rel}/examples/${stem}.tsx`)));
        }
      });
    });
  });
});
