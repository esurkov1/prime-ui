/**
 * `bun run skill:build` — the installable agent skill in `dist-skill/prime-ui-kit/`.
 *
 * `SKILL/` links the component docs where they live in the repository (`../src/components/<dir>/`).
 * An installed skill is a folder on its own, so the build copies `SKILL/` together with every
 * `COMPONENT.md` and `examples/` into `reference/components/<dir>/` and `reference/layout/<dir>/`
 * (the same tree, so the docs' own cross-links keep working) and rewrites `../src/` to
 * `reference/`, with `src/icon-set.ts` (the names of the full glyph set) next to them. It fails when
 * any relative link in the built skill points at nothing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "dist-skill", "prime-ui-kit");

fs.rmSync(path.dirname(out), { recursive: true, force: true });
fs.cpSync(path.join(root, "SKILL"), out, {
  recursive: true,
  filter: (src) => path.basename(src) !== ".DS_Store",
});

for (const base of ["components", "layout"]) {
  const baseDir = path.join(root, "src", base);
  for (const dir of fs.readdirSync(baseDir).sort()) {
    const doc = path.join(baseDir, dir, "COMPONENT.md");
    if (!fs.existsSync(doc)) continue;
    const target = path.join(out, "reference", base, dir);
    fs.mkdirSync(target, { recursive: true });
    fs.copyFileSync(doc, path.join(target, "COMPONENT.md"));
    const examples = path.join(baseDir, dir, "examples");
    if (fs.existsSync(examples)) {
      fs.cpSync(examples, path.join(target, "examples"), { recursive: true });
    }
  }
}

// The full animated glyph set: its export list is the name catalogue the skill links to.
fs.copyFileSync(path.join(root, "src", "icon-set.ts"), path.join(out, "reference", "icon-set.ts"));

/** Every markdown file of the built skill, recursively. */
function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

// The skill's own files point into the repository; in the built skill that tree is `reference/`.
for (const file of fs.readdirSync(out).filter((name) => name.endsWith(".md"))) {
  const full = path.join(out, file);
  const text = fs.readFileSync(full, "utf8");
  fs.writeFileSync(full, text.replaceAll("](../src/", "](reference/"));
}

const broken: string[] = [];
for (const file of markdownFiles(out)) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), target))) {
      broken.push(`${path.relative(out, file)} → ${match[1]}`);
    }
  }
}

if (broken.length > 0) {
  console.error(`skill: ${broken.length} broken link(s) in the built skill:\n${broken.join("\n")}`);
  process.exit(1);
}

const files = fs.readdirSync(out, { recursive: true }).length;
console.log(`skill: built ${path.relative(root, out)} (${files} entries), every link resolves`);
