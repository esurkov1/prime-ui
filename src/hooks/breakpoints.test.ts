import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { COMPACT_QUERY, OFF_CANVAS_QUERY } from "./breakpoints";

const root = path.resolve(import.meta.dirname, "../..");

/** The breakpoints of foundation §9 ("640 · 768 · 1024 · 1280"). */
function foundationBreakpoints(): number[] {
  const text = fs.readFileSync(path.join(root, "docs/foundation.md"), "utf8");
  const line = text.match(/Breakpoints[^:]*:\s*([\d ·]+);/)?.[1] ?? "";
  return line.split("·").map((value) => Number(value.trim()));
}

const width = (query: string) => Number(query.match(/^\(max-width: (\d+)px\)$/)?.[1]);

describe("breakpoints", () => {
  it("reads the breakpoints from foundation §9", () => {
    expect(foundationBreakpoints()).toEqual([640, 768, 1024, 1280]);
  });

  it("puts each width query one pixel below a foundation breakpoint", () => {
    const below = foundationBreakpoints().map((bp) => bp - 1);
    expect(width(COMPACT_QUERY)).toBe(below[0]);
    expect(width(OFF_CANVAS_QUERY)).toBe(below[1]);
  });
});
