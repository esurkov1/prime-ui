/**
 * `bun run docs:build` — renders the `## API` section and the `### Labels` subsection of every
 * COMPONENT.md that has an `api.ts` next to it. `bun run verify:docs` fails when that changes a file.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { applyApiToDoc, type ComponentApi } from "./docs/componentApi";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let written = 0;

for (const base of ["components", "layout"]) {
  const baseDir = path.join(root, "src", base);
  for (const dir of fs.readdirSync(baseDir).sort()) {
    const apiFile = path.join(baseDir, dir, "api.ts");
    if (!fs.existsSync(apiFile)) continue;
    const { api } = (await import(apiFile)) as { api: ComponentApi };
    const docFile = path.join(baseDir, dir, "COMPONENT.md");
    const doc = fs.readFileSync(docFile, "utf8");
    const next = applyApiToDoc(doc, api);
    if (next !== doc) {
      fs.writeFileSync(docFile, next);
      written += 1;
      console.log(`updated src/${base}/${dir}/COMPONENT.md`);
    }
  }
}

console.log(written === 0 ? "docs: API sections up to date" : `docs: ${written} file(s) updated`);
