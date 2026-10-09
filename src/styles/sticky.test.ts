import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * A component that sticks a surface to the start edge of its scroller covers the WebKit sub-pixel
 * seam with `stickySurfaceClass` (`src/internal/sticky.module.css`), joined in TSX.
 */

const root = path.resolve(process.cwd(), "src");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return [full];
  });
}

/** Stylesheets whose sticky rules need no seam cover, with the reason. */
const EXEMPT: Record<string, string> = {
  "layout/app-shell/AppShell.module.css":
    "the nav column and the footer hold their own surfaces and stick to the window, not to a scroller edge with content under it",
  "components/chat/Chat.module.css":
    "the sticky date separator is a transparent wrapper, its pill carries the fill; the selection bar and the «к последним» button stick to the bottom and float with their own shadow",
};

describe("sticky surfaces", () => {
  const sticky = walk(root)
    .filter((file) => file.endsWith(".module.css"))
    .filter((file) => /position:\s*sticky/.test(readFileSync(file, "utf8")))
    .map((file) => path.relative(root, file));

  it("finds the sticky stylesheets", () => {
    expect(sticky.length).toBeGreaterThan(0);
  });

  for (const file of sticky) {
    it(`${file} covers the WebKit seam`, () => {
      if (EXEMPT[file]) return;
      const dir = path.join(root, path.dirname(file));
      const sources = readdirSync(dir)
        .filter((name) => name.endsWith(".tsx") && !name.endsWith(".test.tsx"))
        .map((name) => readFileSync(path.join(dir, name), "utf8"));
      expect(sources.some((source) => source.includes('from "@/internal/sticky"'))).toBe(true);
    });
  }
});
