/**
 * Docs contract: every exported component ships a COMPONENT.md and examples/ that stay in sync
 * with the playground (the single source of scenarios) and import the kit only by its package name.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

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

/** Category of each component dir, derived from CATEGORY_PAGES: page → page module → example imports. */
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
      for (const m of read(file).matchAll(/@\/(?:components|layout)\/([\w-]+)\/examples\//g)) {
        byDir.set(m[1], { id: category, label: labels.get(category) ?? "" });
      }
    }
  }
  return byDir;
}

const ALLOWED_IMPORTS =
  /^(prime-ui-kit|react|react-dom|lucide-react|date-fns(\/.*)?|react-router-dom)$/;
const REQUIRED_HEADINGS = ["## When to use", "## Import", "## API", "## Examples"];

const dirs = exportedDirs();
const categories = categoriesByDir();
const playgroundSource = walk("playground", /\.tsx?$/)
  .map(read)
  .join("\n");

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
      const category = categories.get(dir);
      expect(category, `${dir} is not shown by any CATEGORY_PAGES page`).toBeDefined();
      expect(doc).toContain(`**Category:** ${category?.id} (${category?.label})`);
      expect(doc).not.toMatch(/--prime-(ref|sys)-/);
    });

    it.each(examples.map((file) => path.posix.basename(file)))("examples/%s", (name) => {
      const file = `${rel}/examples/${name}`;
      const source = read(file);
      const stem = name.replace(/\.tsx$/, "");

      expect(read(docPath), `${file} is not listed in COMPONENT.md`).toContain(`examples/${name}`);
      expect(
        playgroundSource.includes(`@/${base}/${dir}/examples/${stem}"`),
        `${file} is not imported by the playground`,
      ).toBe(true);

      expect(source.startsWith("/**"), `${file}: first line must be a JSDoc`).toBe(true);
      expect(source.match(/^export default function \w+Example\(/gm)?.length).toBe(1);

      for (const m of source.matchAll(/(?:from|import) "([^"]+)"/g)) {
        const spec = m[1];
        const ok = ALLOWED_IMPORTS.test(spec) || /^\.\/[\w-]+\.module\.css$/.test(spec);
        expect(ok, `${file} imports "${spec}"`).toBe(true);
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
  });
});
