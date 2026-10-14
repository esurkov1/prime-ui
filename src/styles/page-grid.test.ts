import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * The page rhythm lives in PageContent: the tiles of a screen are one `PageContent.Grid` (one gap on
 * both axes), a new topic is a `PageContent.Section`. A screen example that draws its own auto-fit
 * grid of tiles or its own `<section>` + heading brings back rows 24 apart and a rhythm of its own. A
 * grid inside one block (fields, thumbnails) is listed below with the reason.
 */

const root = process.cwd();

const ALLOWED_GRIDS: Record<string, string> = {
  "src/components/drawer/examples/screen.module.css":
    "short related fields side by side inside one form",
  "src/components/page-content/examples/screen.module.css":
    "short related fields side by side inside one panel",
  "src/components/file-upload/examples/screen.module.css":
    "thumbnail tiles inside the library section, not page tiles",
};

const AUTO_GRID = /repeat\(\s*auto-(?:fit|fill)/;

/** Repository-relative `examples/screen.<ext>` of every component that has a screen. */
function screens(ext: string): string[] {
  return ["components", "layout"].flatMap((base) =>
    readdirSync(path.join(root, "src", base))
      .map((dir) => `src/${base}/${dir}/examples/screen${ext}`)
      .filter((file) => existsSync(path.join(root, file))),
  );
}

const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("page grid and sections in screens", () => {
  it("finds the screens", () => {
    expect(screens(".tsx").length).toBeGreaterThan(0);
  });

  it("no hand-written auto-fit grid of page tiles", () => {
    const offenders: string[] = [];
    for (const file of screens(".module.css")) {
      if (file in ALLOWED_GRIDS) continue;
      stripComments(read(file))
        .split("\n")
        .forEach((line, index) => {
          if (AUTO_GRID.test(line)) offenders.push(`${file}:${index + 1} ${line.trim()}`);
        });
    }
    expect(offenders).toEqual([]);
  });

  it("every allowed file still has its inner grid (no stale entries)", () => {
    for (const file of Object.keys(ALLOWED_GRIDS)) {
      expect(AUTO_GRID.test(stripComments(read(file))), file).toBe(true);
    }
  });

  it("no hand-made <section>: a topic of the page is PageContent.Section", () => {
    const offenders = screens(".tsx").filter((file) => /<section\b/.test(read(file)));
    expect(offenders).toEqual([]);
  });
});
