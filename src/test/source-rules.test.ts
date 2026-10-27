// @vitest-environment node
/**
 * Mechanical rules of AGENTS.md over the TypeScript sources (AGENTS.md §1, §2, core decisions 5
 * and 11 of the fix plan):
 * - a size mapping (`Record<ControlSize, ControlSize>`) lives only in `src/internal/states.ts`;
 * - a sized root takes its default from the host tier, never a literal `size = "m"`;
 * - no `as unknown as` casts;
 * - a promise is recognised by `isPromiseLike` (`src/internal/usePendingChanges`), never a local
 *   `.then` check;
 * - a component imports another component only through its PascalCase module or `types.ts`
 *   (shared mechanics live in `src/internal` / `src/hooks`);
 * - every `biome-ignore lint/correctness/useExhaustiveDependencies` is a counted exception;
 * - the kit draws a glyph by importing its module (`@/icons/glyphs/<name>`), never through the
 *   name registry (`<Icon name>`, `IconName`): the registry holds every glyph and is the
 *   consumer's API, a kit module that reached it would bundle them all;
 * - `src/icons/glyphs` holds only glyph modules (`*.tsx`).
 */
import path from "node:path";

import { pascal, read, walk } from "./contract-utils";

/** Runtime sources of the kit: no tests, examples or api tables. */
const sources = walk("src", /\.tsx?$/).filter(
  (file) => !/\.test\.tsx?$|\/examples\/|\/api\.ts$|\.api\.ts$|^src\/test\/|\.d\.ts$/.test(file),
);

function matches(file: string, text: string, pattern: RegExp, rule: string): string[] {
  return [...text.matchAll(pattern)].map(() => `${file}: ${rule}`);
}

describe("source rules", () => {
  it("TypeScript sources follow the mechanical rules of AGENTS.md", () => {
    const offenders: string[] = [];
    for (const file of sources) {
      const text = read(file);
      if (file !== "src/internal/states.ts") {
        offenders.push(
          ...matches(
            file,
            text,
            /Record<ControlSize,\s*ControlSize>/g,
            "size mapping outside states.ts",
          ),
        );
      }
      if (/^src\/(components|layout)\//.test(file)) {
        offenders.push(...matches(file, text, /\bsize = "m"/g, 'root default size = "m"'));
      }
      offenders.push(...matches(file, text, /\bas unknown as\b/g, "as unknown as"));
      if (file !== "src/internal/usePendingChanges.ts") {
        offenders.push(
          ...matches(
            file,
            text,
            /\.then\s*===\s*"function"|instanceof Promise\b/g,
            "local promise check",
          ),
        );
      }
      offenders.push(
        ...matches(
          file,
          text,
          /biome-ignore lint\/correctness\/useExhaustiveDependencies/g,
          "biome-ignore useExhaustiveDependencies",
        ),
      );
      if (!file.startsWith("src/icons/") && file !== "src/index.ts") {
        const code = text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
        offenders.push(
          ...matches(file, code, /<Icon\b|\bIconName\b|\biconRegistry\b/g, "a glyph by name"),
        );
      }
      const own = file.match(/^src\/(?:components|layout)\/([\w-]+)\//)?.[1];
      if (own) {
        for (const m of text.matchAll(/^import [^;]*?from "([^"]+)";/gm)) {
          const spec = m[1];
          const target =
            spec.match(/^@\/(?:components|layout)\/([\w-]+)\/([\w.-]+)$/) ??
            spec.match(/^\.\.\/([\w-]+)\/([\w.-]+)$/) ??
            spec.match(/^\.\.\/\.\.\/(?:components|layout)\/([\w-]+)\/([\w.-]+)$/);
          if (!target || target[1] === own) continue;
          const module = target[2].replace(/\.(tsx?|module\.css)$/, "");
          if (module !== pascal(target[1]) && module !== "types") {
            offenders.push(
              `${file}: imports ${target[1]}/${module} (not its main module or types.ts)`,
            );
          }
        }
      }
    }
    expect(offenders, "source-rules").toEqual([]);
  });

  it("src/icons/glyphs holds only glyph modules", () => {
    const other = walk("src/icons/glyphs", /./).filter((file) => path.extname(file) !== ".tsx");
    expect(other).toEqual([]);
  });
});
