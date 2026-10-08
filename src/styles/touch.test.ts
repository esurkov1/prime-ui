import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Touch and input guards over the CSS: hover never sticks after a tap, viewport breakpoints come
 * from one scale, editable fields never trigger the iOS focus zoom, small controls get a touch
 * hit area.
 */

const root = path.resolve(process.cwd(), "src");

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return cssFiles(full);
    return name.endsWith(".css") ? [full] : [];
  });
}

const files = cssFiles(root);
const rel = (file: string) => path.relative(root, file);
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

/** Every rule prelude with the at-rule preludes around it (comments dropped). */
function rules(css: string): { prelude: string; parents: string[] }[] {
  const out: { prelude: string; parents: string[] }[] = [];
  const stack: string[] = [];
  let buffer = "";
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (char === "{") {
      const prelude = buffer.trim();
      out.push({ prelude, parents: [...stack] });
      stack.push(prelude);
      buffer = "";
    } else if (char === "}") {
      stack.pop();
      buffer = "";
    } else if (char === ";") {
      buffer = "";
    } else {
      buffer += char;
    }
  }
  return out;
}

describe("touch and input", () => {
  it("styles :hover only for devices that hover", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const { prelude, parents } of rules(readFileSync(file, "utf8"))) {
        if (!prelude.includes(":hover")) continue;
        if (parents.some((parent) => /^@media[^{]*\(hover:\s*hover\)/.test(parent))) continue;
        offenders.push(`${rel(file)} ${prelude}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("uses one viewport breakpoint scale: 640 · 768 · 1024 · 1280", () => {
    const allowed = new Set([640, 768, 1024, 1280]);
    const offenders: string[] = [];
    for (const file of files) {
      for (const m of readFileSync(file, "utf8").matchAll(/@media[^{]*/g)) {
        for (const w of m[0].matchAll(/\((min|max)-width:\s*(\d+)px\)/g)) {
          // `max-width` is the last pixel below a breakpoint: `max-width: 639px`.
          const value = Number(w[2]) + (w[1] === "max" ? 1 : 0);
          if (!allowed.has(value)) offenders.push(`${rel(file)} ${w[0]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps editable field text at 16px or more on touch and narrow screens", () => {
    const query = "@media (pointer: coarse), (max-width: 639px)";
    const tier = read("internal/fieldTier.module.css");
    expect(tier).toContain(query);
    expect(tier).toContain(
      "--field-input-text: max(var(--field-text), var(--prime-control-touch-text-size));",
    );
    // Tier-based fields set their editable text from the input variables, never the tier text.
    for (const [file, selector] of [
      ["components/input/Input.module.css", ".field {"],
      ["components/textarea/Textarea.module.css", ".textarea {"],
      ["components/native-select/NativeSelect.module.css", ".select {"],
    ]) {
      const css = read(file);
      const body = css.slice(css.indexOf(selector), css.indexOf("}", css.indexOf(selector)));
      expect(body, file).toContain("font-size: var(--field-input-text);");
    }
    // Inputs outside the field tier raise their own text under the same query. DigitInput needs no
    // rule: its smallest cell already shows 16px digits (body-l).
    expect(read("components/digit-input/DigitInput.module.css")).toContain(
      "--digit-cell-text: var(--prime-text-body-l-size);",
    );
    for (const file of [
      "internal/menu.module.css",
      "components/datepicker/Datepicker.module.css",
      "components/color-picker/ColorPicker.module.css",
    ]) {
      const css = read(file);
      expect(css, file).toContain(query);
      expect(css, file).toContain("var(--prime-control-touch-text-size)");
    }
  });

  it("grows small hit areas to the touch target on coarse pointers", () => {
    const target = read("internal/touchTarget.module.css");
    expect(target).toContain("@media (pointer: coarse)");
    expect(target).toContain("var(--prime-control-touch-target)");
    expect(read("internal/menu.module.css")).toMatch(
      /@media \(pointer: coarse\) \{\s*\.tier \{\s*--menu-item-h: max\(var\(--menu-tier-item-h\), var\(--prime-control-touch-target\)\);/,
    );
    for (const file of [
      "components/button/Button.tsx",
      "components/badge/Badge.tsx",
      "internal/ChoiceField.tsx",
    ]) {
      expect(read(file), file).toMatch(/touchTarget(Block)?Class/);
    }
  });
});
