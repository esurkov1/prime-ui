// @vitest-environment node
/**
 * Sticky cells stand over the columns scrolled under them, so every solid fill the table paints
 * must be opaque in both themes. A state tint that is translucent in a theme (the selection's
 * hover in dark) rides as a background-image layer over the cell's opaque base, never as the fill
 * itself. The guard resolves every `background` / `background-color` / `--sticky-bg` colour of the
 * stylesheet through the token files and fails on any alternative that can be translucent.
 */
import { cssRules, parseCss } from "@/test/css";

const MODULE = "src/components/data-table/DataTable.module.css";
const SHARED = ["src/styles/tokens.css", "src/styles/globals.css", MODULE];
const THEMES = { light: "src/styles/theme-light.css", dark: "src/styles/theme-dark.css" };

type Defs = Map<string, string[]>;

/** The table is a surface of its own (`useNestedSurfaceDepth`): a `tinted` host's context never
 * reaches its cells, the table stands one step above it. */
const NOT_A_TABLE_DEPTH = '[data-depth="tinted"]';

function collect(files: string[]): Defs {
  const defs: Defs = new Map();
  for (const file of files) {
    parseCss(file).walkDecls(/^--/, (decl) => {
      if (
        decl.parent?.type === "rule" &&
        (decl.parent as { selector: string }).selector === NOT_A_TABLE_DEPTH
      ) {
        return;
      }
      defs.set(decl.prop, [...(defs.get(decl.prop) ?? []), decl.value]);
    });
  }
  return defs;
}

/** Every value a colour can take in a theme, its `var()` chains followed to the end. */
function resolve(value: string, theme: Defs, shared: Defs, seen = new Set<string>()): string[] {
  const ref = value.trim().match(/^var\((--[\w-]+)\)$/);
  if (!ref) return [value.trim()];
  const name = ref[1] as string;
  if (seen.has(name)) return [];
  const values = theme.get(name) ?? shared.get(name);
  if (!values) throw new Error(`${name} is not defined`);
  return values.flatMap((item) => resolve(item, theme, shared, new Set([...seen, name])));
}

function opaque(color: string): boolean {
  if (/^#([\da-f]{3}|[\da-f]{6})$/i.test(color)) return true;
  if (/^#[\da-f]{3}f$/i.test(color)) return true;
  if (/^#[\da-f]{6}ff$/i.test(color)) return true;
  return false;
}

/** The solid fills of the stylesheet: every background colour that is not an image or `none`. */
const FILLS = cssRules(MODULE).flatMap((rule) =>
  rule.decls
    .filter(
      ({ prop }) => prop === "background" || prop === "background-color" || prop === "--sticky-bg",
    )
    .filter(({ value }) => !/gradient\(|^none$/.test(value))
    .map(({ prop, value }) => ({ where: `${rule.selector} { ${prop} }`, value })),
);

describe("DataTable paint", () => {
  it("finds the fills, the cell's base among them", () => {
    expect(FILLS).toContainEqual({
      where: ".cell { background-color }",
      value: "var(--dt-surface)",
    });
  });

  const shared = collect(SHARED);
  for (const [name, file] of Object.entries(THEMES)) {
    it(`paints every fill opaque in the ${name} theme`, () => {
      const theme = collect([file]);
      const offenders = FILLS.flatMap(({ where, value }) =>
        resolve(value, theme, shared)
          .filter((color) => !opaque(color))
          .map((color) => `${where}: ${color}`),
      );
      expect(offenders).toEqual([]);
    });
  }
});
