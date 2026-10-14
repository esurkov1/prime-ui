import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * The page rhythm lives in PageContent: the tiles of a screen are one `PageContent.Grid` (one gap on
 * both axes), a new topic is a `PageContent.Section`. A pattern that draws its own auto-fit grid of
 * tiles or its own `<section>` + heading brings back rows 24 apart and a rhythm of its own. A grid
 * inside one block (fields, thumbnails) is listed below with the reason.
 */

const patterns = path.resolve(process.cwd(), "SKILL/patterns");

const ALLOWED_GRIDS: Record<string, string> = {
  "form-drawer.module.css": "short related fields side by side inside one form",
  "settings-page.module.css": "short related fields side by side inside one panel",
  "media-library.module.css": "thumbnail tiles inside the library section, not page tiles",
};

const AUTO_GRID = /repeat\(\s*auto-(?:fit|fill)/;

function files(ext: string): string[] {
  return readdirSync(patterns).filter((name) => name.endsWith(ext));
}

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

describe("page grid and sections in patterns", () => {
  it("no hand-written auto-fit grid of page tiles", () => {
    const offenders: string[] = [];
    for (const name of files(".module.css")) {
      if (name in ALLOWED_GRIDS) continue;
      const css = stripComments(readFileSync(path.join(patterns, name), "utf8"));
      css.split("\n").forEach((line, index) => {
        if (AUTO_GRID.test(line)) offenders.push(`${name}:${index + 1} ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("every allowed file still has its inner grid (no stale entries)", () => {
    for (const name of Object.keys(ALLOWED_GRIDS)) {
      const css = stripComments(readFileSync(path.join(patterns, name), "utf8"));
      expect(AUTO_GRID.test(css), name).toBe(true);
    }
  });

  it("no hand-made <section>: a topic of the page is PageContent.Section", () => {
    const offenders = files(".tsx").filter((name) =>
      /<section\b/.test(readFileSync(path.join(patterns, name), "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
