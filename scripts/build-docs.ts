/**
 * `bun run docs:build` — renders the generated parts of the docs from their sources:
 * - every COMPONENT.md: `## API`, `### Keyboard`, `### ARIA` and `### Labels` from its `api.ts`;
 * - the aggregates (`scripts/docs/aggregates.ts`): the README components table and counts, the
 *   `SKILL/components.md` index, the icon list and the triad rows of `SKILL/api-contract.md`;
 * - `src/test/part-refs.generated.ts` from the ref line of every `api.ts` part.
 *
 * The docs contract test (`src/test/docs-contract.test.ts`, "generated from api.ts") and the
 * aggregate checks in `src/test/skill-docs.test.ts` fail when a file differs from what this
 * script writes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderAggregates } from "./docs/aggregates";
import { applyApiToDoc, type ComponentApi } from "./docs/componentApi";
import { renderPartRefs } from "./docs/partRefs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let written = 0;

function write(rel: string, next: string) {
  const file = path.join(root, rel);
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === next) return;
  fs.writeFileSync(file, next);
  written += 1;
  console.log(`updated ${rel}`);
}

const apis: { base: string; dir: string; api: ComponentApi }[] = [];
for (const base of ["components", "layout"]) {
  const baseDir = path.join(root, "src", base);
  for (const dir of fs.readdirSync(baseDir).sort()) {
    const apiFile = path.join(baseDir, dir, "api.ts");
    if (!fs.existsSync(apiFile)) continue;
    const { api } = (await import(apiFile)) as { api: ComponentApi };
    apis.push({ base, dir, api });
    const docRel = `src/${base}/${dir}/COMPONENT.md`;
    const doc = fs.readFileSync(path.join(root, docRel), "utf8");
    write(docRel, applyApiToDoc(doc, api));
  }
}

for (const [rel, next] of Object.entries(await renderAggregates(root))) write(rel, next);
write("src/test/part-refs.generated.ts", renderPartRefs(apis));

console.log(
  written === 0 ? "docs: generated sections up to date" : `docs: ${written} file(s) updated`,
);
