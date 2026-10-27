import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { read as readRepo, walk } from "../test/contract-utils";
import { cssRule, cssRules, cssValue, moduleCssFiles } from "../test/css";

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

  it("sets an inset offset on the focus rule, where it outranks the global ring", () => {
    // `:where(button):focus-visible` (globals.css) has the specificity of one class and loads
    // later: an inset offset on a plain `.item` loses to it and the ring is drawn outside (clipped
    // by a scroller). A resting ring (`outline: … transparent` with the inset offset) needs the
    // offset on a `:focus-visible` / `:focus-within` rule too.
    const offenders: string[] = [];
    for (const file of files) {
      const inset = blocks(readFileSync(file, "utf8")).filter(({ body }) =>
        /outline-offset:\s*var\(--prime-focus-offset-inset\)/.test(body),
      );
      const resting = inset.some(({ body }) => /outline:[^;]*transparent/.test(body));
      if (resting && !inset.some(({ selector }) => /:focus/.test(selector))) {
        offenders.push(path.relative(root, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("draws the ring inside fields", () => {
    // The shared field surface owns the inset ring; every field box uses it (a TSX class:
    // `fieldSurfaceClass`, or `fieldTriggerClass` which includes it) or draws its own inset ring.
    expect(read("internal/fieldSurface.module.css")).toContain("--prime-focus-offset-inset");
    const fields = [
      "components/input/Input",
      "components/textarea/Textarea",
      "components/select/Select",
      "components/tag-select/TagSelect",
      "components/datepicker/Datepicker",
      "components/digit-input/DigitInput",
    ];
    const usesInsetRing = (base: string) => {
      const source = read(`${base}.tsx`) + read(`${base}.module.css`);
      return ["--prime-focus-offset-inset", "fieldSurfaceClass", "fieldTriggerClass"].some(
        (marker) => source.includes(marker),
      );
    };
    expect(fields.filter((base) => !usesInsetRing(base))).toEqual([]);
  });

  it("keeps side padding on the scrolling body of overlays", () => {
    // Modal and Drawer share header/body/footer parts.
    for (const rel of ["internal/overlay/DialogParts.module.css"]) {
      const body = blocks(read(rel)).find((b) => /(^|,)\s*\.body\s*$/.test(b.selector));
      expect(body, `${rel} .body`).toBeDefined();
      expect(body?.body, `${rel} .body padding`).toMatch(/padding(-inline)?:/);
    }
  });
});

/**
 * The focus ring switch (docs/foundation.md §7): every ring of the kit is drawn
 * `var(--prime-focus-ring-width)` wide, which globals.css keeps at 0 unless an ancestor sets
 * `data-focus-ring="visible"`. A ring drawn with the focus width itself would ignore the switch.
 */
describe("focus ring switch", () => {
  /** Marks drawn with the focus width that are no focus ring, with the reason. */
  const NOT_A_RING: Record<string, string> = {
    "src/internal/attachmentTile.module.css": "the danger ring of a failed upload",
    "src/components/thumbnail/Thumbnail.module.css": "the accent ring of a checked thumbnail",
    "src/components/composer/Composer.module.css": "the drop target ring and the quote bar",
    "src/components/media-viewer/MediaViewer.module.css": "the ring of the current thumbnail",
    "src/components/color-picker/ColorPicker.module.css": "the border of the colour thumb",
  };

  it('hides every ring by default and shows it under data-focus-ring="visible"', () => {
    const globals = "src/styles/globals.css";
    const rules = cssRules(globals);
    const rootRule = rules.find(
      (rule) =>
        rule.selector === ":root" && rule.decls.some((d) => d.prop === "--prime-focus-ring-width"),
    );
    expect(rootRule && cssValue(rootRule, "--prime-focus-ring-width")).toBe("var(--prime-space-0)");
    expect(
      cssValue(cssRule(globals, '[data-focus-ring="visible"]'), "--prime-focus-ring-width"),
    ).toBe("var(--prime-focus-width)");
    expect(cssValue(cssRule(globals, "[data-focus-quiet]"), "--prime-focus-ring-width")).toBe(
      "var(--prime-space-0)",
    );
    const base = rules.find((rule) => /\):focus-visible$/.test(rule.selector));
    expect(base && cssValue(base, "outline")).toMatch(/^var\(--prime-focus-ring-width\) solid /);
    // Equal specificity: the visible rule comes after the `:root` default, so it wins on <html>.
    const order = rules.map((rule) => (rule === rootRule ? "switch" : rule.selector));
    expect(order.indexOf('[data-focus-ring="visible"]')).toBeGreaterThan(order.indexOf("switch"));
    expect(order.indexOf("[data-focus-quiet]")).toBeGreaterThan(
      order.indexOf('[data-focus-ring="visible"]'),
    );
  });

  it("draws every ring with the switch width", () => {
    const offenders: string[] = [];
    const used = new Set<string>();
    for (const file of moduleCssFiles()) {
      for (const rule of cssRules(file)) {
        const focus = /:focus/.test([...rule.parents, rule.selector].join(" "));
        for (const { prop, value, line } of rule.decls) {
          const at = `${file}:${line} ${prop}: ${value}`;
          const ringColour = value.includes("--prime-color-focus-ring");
          if (value.includes("--prime-focus-width")) {
            if (NOT_A_RING[file] && !focus && !ringColour) used.add(file);
            else offenders.push(`${at} — draw it var(--prime-focus-ring-width) wide`);
            continue;
          }
          // An outline in a focus rule, or any outline / shadow in the ring colour, is a focus
          // ring: its width is the switch (DataTable's `--dt-ring` is set to it, checked above).
          const drawn = /^(outline|outline-width)$/.test(prop) && !/^(none|0)$/.test(value);
          const ring = (drawn && focus) || (/^(outline|box-shadow)$/.test(prop) && ringColour);
          if (ring && !/var\(--(prime-focus-ring-width|dt-ring)\)/.test(value)) offenders.push(at);
        }
      }
    }
    expect(offenders).toEqual([]);
    expect(Object.keys(NOT_A_RING).filter((file) => !used.has(file))).toEqual([]);
  });

  it("leaves the field prop out: one switch, no per-field ring", () => {
    const sources = walk("src", /\.tsx?$/).filter((file) => !/\.test\.tsx?$/.test(file));
    const offenders = sources.filter((file) =>
      /\bfocusRing\b|data-focus-ring="false"/.test(readRepo(file)),
    );
    expect(offenders).toEqual([]);
  });
});
