/**
 * Docs contract: every exported component ships a COMPONENT.md and examples/ that stay in sync
 * with the playground and import the kit only by its package name, and follow the page standard
 * (`playground/pageStandard.ts`): kind, slots, order, the example file canon and the COMPONENT.md
 * template.
 */
import fs from "node:fs";
import path from "node:path";

import * as lucide from "lucide-react";
import { iconRegistry } from "@/icons/registry";
import type { ComponentPageConfig } from "../../playground/components/ComponentPage";
import {
  KIND_SLOTS,
  PAGE_KINDS,
  requiredSlots,
  SCENARIOS,
  SLOT_IDS,
  type SlotId,
  slotLayout,
  slotOrder,
} from "../../playground/pageStandard";
import { applyApiToDoc, type ComponentApi } from "../../scripts/docs/componentApi";
import { checkLayoutCss, checkSourceCanon, pascal, read, root, walk } from "./contract-utils";

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

/** Every playground section (`playground/sections/<Pascal>Section.tsx`) by its component dir. */
const sectionsByDir = new Map(
  Object.entries(
    import.meta.glob<{ page?: ComponentPageConfig }>("../../playground/sections/*Section.tsx", {
      eager: true,
    }),
  ).flatMap(([file, module]) =>
    module.page ? [[module.page.dir, { file, page: module.page }]] : [],
  ),
);

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

const dirs = exportedDirs();

/**
 * Lucide glyphs examples and patterns may still import directly: domain glyphs the kit registry
 * does not carry. Every entry needs a reason; a glyph the registry has never belongs here.
 */
const DOMAIN_GLYPHS: Record<string, string> = {
  Bike: "Thumbnail examples show a motorcycle catalog and wrap the glyph with createIcon.",
};

/** Registry names per lucide glyph (aliases share one glyph). */
function registryNamesByGlyph(): Map<unknown, string[]> {
  const byGlyph = new Map<unknown, string[]>();
  for (const [name, glyph] of Object.entries(iconRegistry)) {
    byGlyph.set(glyph, [...(byGlyph.get(glyph) ?? []), name]);
  }
  return byGlyph;
}

/** Glyph names imported from `lucide-react` (`X as Y` counts as `X`). */
const lucideImports = (source: string) =>
  [...source.matchAll(/import\s*\{([^}]*)\}\s*from\s*"lucide-react"/g)].flatMap((m) =>
    m[1]
      .split(",")
      .map(
        (part) =>
          part
            .trim()
            .replace(/^type\s+/, "")
            .split(/\s+as\s+/)[0],
      )
      .filter(Boolean),
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

  describe.each(dirs)("$rel", ({ base, dir, rel }) => {
    const docPath = `${rel}/COMPONENT.md`;
    const examples = walk(`${rel}/examples`, /\.tsx$/);

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
      const category = sectionsByDir.get(dir)?.page.category;
      expect(category, `${dir} has no playground section with a category`).toBeDefined();
      expect(doc).toMatch(new RegExp(`^\\*\\*Category:\\*\\* ${category}$`, "m"));
      expect(doc).not.toMatch(/--prime-ref-/);
    });

    it.each(examples.map((file) => path.posix.basename(file)))("examples/%s", (name) => {
      const file = `${rel}/examples/${name}`;
      const source = read(file);
      const stem = name.replace(/\.tsx$/, "");

      expect(read(docPath), `${file} is not listed in COMPONENT.md`).toContain(`examples/${name}`);
      checkSourceCanon(
        file,
        source,
        (spec) => ALLOWED_IMPORTS.test(spec) || spec === "./examples.module.css",
      );
      expect(source.match(/^export default function \w+Example\(/gm)?.length).toBe(1);
      expect(source, `${file}: function name`).toMatch(
        new RegExp(`^export default function ${pascal(dir)}${pascal(stem)}Example\\(\\)`, "m"),
      );
    });

    it("example styles use semantic tokens only", () => {
      for (const file of walk(`${rel}/examples`, /\.css$/)) checkLayoutCss(file, read(file));
    });

    describe("page standard", () => {
      let page: ComponentPageConfig;

      beforeAll(() => {
        const section = sectionsByDir.get(dir);
        expect(
          section,
          `playground/sections/${pascal(dir)}Section.tsx exports no page`,
        ).toBeDefined();
        expect(section?.file).toBe(`../../playground/sections/${pascal(dir)}Section.tsx`);
        page = section?.page as ComponentPageConfig;
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
        for (const { slot, by } of requiredSlots(page.kind, rootProps)) {
          const reason = by === "kind" ? `the ${page.kind} kind` : `the root prop \`${by}\``;
          expect(slots, `required slot "${slot}" (by ${reason})`).toContain(slot);
        }
      });

      it("the kind allows every slot the root API requires", () => {
        const allowed = KIND_SLOTS[page.kind].map((entry) => entry.slot);
        const rootProps = (page.api.parts[0]?.props ?? []).map((prop) => prop.name);
        const conflicts = requiredSlots(page.kind, rootProps)
          .filter(({ slot }) => !allowed.includes(slot))
          .map(({ slot, by }) => `\`${by}\` requires "${slot}"`);
        expect(
          conflicts,
          `PROP_SLOTS require slots a ${page.kind} page does not allow — add them to KIND_SLOTS.${page.kind} in playground/pageStandard.ts or pick another kind`,
        ).toEqual([]);
      });

      it("matrix examples bring no CSS: the preview layout lines the cells up", () => {
        for (const example of page.examples) {
          const slot = "slot" in example ? example.slot : null;
          if (slotLayout(page.kind, slot) !== "matrix") continue;
          const file = `${rel}/examples/${exampleFile(example)}.tsx`;
          expect(read(file), `${file}: matrix example imports CSS`).not.toContain(
            "examples.module.css",
          );
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

describe("kit icons first", () => {
  const byGlyph = registryNamesByGlyph();
  const glyphs = lucide as unknown as Record<string, unknown>;
  /** Examples, composition patterns and the code in SKILL docs: everything a consumer copies. */
  const sources = [
    ...dirs.flatMap(({ rel }) => walk(`${rel}/examples`, /\.tsx$/)),
    ...walk("SKILL", /\.(tsx|md)$/),
  ];

  it("reads the registry", () => {
    expect(byGlyph.size).toBeGreaterThan(40);
  });

  /** Code of a source: the whole file, or the ```tsx blocks of a markdown doc. */
  const code = (file: string) =>
    file.endsWith(".md")
      ? [...read(file).matchAll(/^```tsx[^\n]*\n([\s\S]*?)^```$/gm)].map((m) => m[1]).join("\n")
      : read(file);

  it.each(sources)("%s takes glyphs from the kit registry", (file) => {
    for (const name of lucideImports(code(file))) {
      const glyph = glyphs[name];
      expect(glyph, `${file}: "${name}" is not a lucide-react export`).toBeDefined();
      const registered = byGlyph.get(glyph);
      expect(
        registered,
        `${file}: use <Icon name="${registered?.[0]}" /> instead of lucide "${name}"`,
      ).toBeUndefined();
      expect(
        DOMAIN_GLYPHS[name],
        `${file}: lucide "${name}" — add it to the registry (src/icons) or, for a domain glyph, to DOMAIN_GLYPHS with a reason`,
      ).toBeDefined();
    }
  });

  it("allows only domain glyphs that are still used and absent from the registry", () => {
    const used = new Set(sources.flatMap((file) => lucideImports(code(file))));
    for (const name of Object.keys(DOMAIN_GLYPHS)) {
      expect(used.has(name), `DOMAIN_GLYPHS.${name} is unused — remove it`).toBe(true);
      expect(byGlyph.has(glyphs[name]), `DOMAIN_GLYPHS.${name} is in the registry`).toBe(false);
    }
  });
});
