import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * A row that holds controls keeps its text readable and its label aligned: a DescriptionList row
 * whose value is a control centres its label on it; a List row's controls leave the row's text a
 * floor and drop to a line of their own instead of crushing it.
 */

const read = (file: string) =>
  readFileSync(path.resolve(process.cwd(), "src/components", file), "utf8");

describe("rows with controls", () => {
  it("centres a DescriptionList label on a control value", () => {
    const css = read("description-list/DescriptionList.module.css");
    expect(css).toMatch(
      /\.item:has\(> \.value > \.text :is\([^{]*combobox[^{]*\)\s*\{\s*align-items: center;/,
    );
  });

  it("gives a list row's text a floor and lets its controls drop below", () => {
    const css = readFileSync(
      path.resolve(process.cwd(), "src/internal/listRow.module.css"),
      "utf8",
    );
    expect(css).toMatch(/\.row \{[^}]*flex-wrap: wrap;/);
    expect(css).toMatch(/\.row > \.hit \{\s*flex: 1 1 var\(--prime-space-24\);/);
  });
});
