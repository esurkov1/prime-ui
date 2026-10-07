import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Guards the "focus ring is never clipped" rule (docs/foundation.md §7).
 * Fields draw the ring inside their edge; everything else uses the token offset;
 * scrolling bodies of overlays own their side padding.
 */

const root = path.resolve(process.cwd(), "src");

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name === "examples" ? [] : cssFiles(full);
    return name.endsWith(".module.css") ? [full] : [];
  });
}

const files = [...cssFiles(path.join(root, "components")), ...cssFiles(path.join(root, "layout"))];
const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");

/** CSS blocks `selector { body }` (flat; nested at-rule bodies are scanned as their own blocks). */
function blocks(css: string): { selector: string; body: string }[] {
  const out: { selector: string; body: string }[] = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(re)) {
    out.push({ selector: m[1].trim(), body: m[2] });
  }
  return out;
}

describe("focus ring guard", () => {
  it("uses only focus tokens for outline-offset", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const { selector, body } of blocks(readFileSync(file, "utf8"))) {
        for (const m of body.matchAll(/outline-offset:\s*([^;]+);/g)) {
          const value = m[1].trim();
          if (!/^(0|var\(--prime-focus-offset(-inset)?\))$/.test(value)) {
            offenders.push(`${path.relative(root, file)} ${selector} → ${value}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("draws the ring inside fields", () => {
    const fieldStyles = [
      "components/input/Input.module.css",
      "components/textarea/Textarea.module.css",
      "components/select/Select.module.css",
      "components/tag-select/TagSelect.module.css",
      "components/datepicker/Datepicker.module.css",
      "components/digit-input/DigitInput.module.css",
    ];
    const missing = fieldStyles.filter((rel) => !read(rel).includes("--prime-focus-offset-inset"));
    expect(missing).toEqual([]);
  });

  it("keeps side padding on the scrolling body of overlays", () => {
    // Modal and Drawer share header/body/footer parts.
    for (const rel of ["components/modal/DialogParts.module.css"]) {
      const body = blocks(read(rel)).find((b) => /(^|,)\s*\.body\s*$/.test(b.selector));
      expect(body, `${rel} .body`).toBeDefined();
      expect(body?.body, `${rel} .body padding`).toMatch(/padding(-inline)?:/);
    }
  });
});
