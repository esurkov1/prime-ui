import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Every scroll region of the kit is a ScrollContainer: one scrollbar, soft hidden edges, the fit
 * flag, overscroll containment, the wheel on strips. A raw `overflow: auto | scroll` in component
 * CSS fails here unless the file is listed below with the reason no ScrollContainer can be it.
 */

const root = path.resolve(process.cwd(), "src");

const ALLOWED: Record<string, string> = {
  "components/scroll-container/ScrollContainer.module.css": "the primitive itself",
  "components/textarea/Textarea.module.css":
    "a native <textarea> scrolls its own text; nothing can wrap the inside of the control",
  "components/code-block/CodeBlock.module.css":
    "a <pre> that paints its own fill (a fade would dissolve it, a shadow paints the layer fill) and admits no scroll wrapper inside",
  "components/example-frame/ExampleFrame.module.css":
    "the preview stage is one filled surface for every preview layout; only the matrix grid scrolls sideways",
};

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return cssFiles(full);
    return name.endsWith(".css") ? [full] : [];
  });
}

const RAW_SCROLL = /\boverflow(?:-x|-y|-block|-inline)?\s*:\s*[^;]*\b(?:auto|scroll|overlay)\b/;

describe("scroll regions", () => {
  it("component CSS has no raw scroller outside ScrollContainer", () => {
    const offenders: string[] = [];
    for (const file of cssFiles(root)) {
      const rel = path.relative(root, file).split(path.sep).join("/");
      if (rel in ALLOWED) continue;
      const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      css.split("\n").forEach((line, index) => {
        if (RAW_SCROLL.test(line)) offenders.push(`${rel}:${index + 1} ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("every allowed file still scrolls (no stale entries)", () => {
    for (const rel of Object.keys(ALLOWED)) {
      const css = readFileSync(path.join(root, rel), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      expect(RAW_SCROLL.test(css), rel).toBe(true);
    }
  });
});
