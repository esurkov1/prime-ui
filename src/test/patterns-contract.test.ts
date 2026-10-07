/**
 * Composition patterns contract: every `SKILL/patterns/<name>.tsx` is one copyable screen — the
 * pattern canon (JSDoc, one `<Name>Pattern` default export, kit-only imports, no inline style,
 * CSS on semantic tokens) — and is linked from `SKILL/composition.md` and shown by the playground
 * (`playground/composition/patterns.ts`). Each pattern also renders.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { render, screen } from "@testing-library/react";
import * as React from "react";
import { COMPOSITION_PATTERNS } from "../../playground/composition/patterns";
import { NotificationProvider } from "../components/notification/NotificationStore";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dir = "SKILL/patterns";
const read = (rel: string) => fs.readFileSync(path.join(root, rel), "utf8");

const names = fs
  .readdirSync(path.join(root, dir))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort();

const pascal = (kebab: string) =>
  kebab.replace(/(^|-)(\w)/g, (_, __: string, char: string) => char.toUpperCase());

const modules = import.meta.glob<{ default: React.ComponentType }>("../../SKILL/patterns/*.tsx");

const PLACEHOLDER_TEXT = /lorem|ipsum|Пункт \d|Item \d|Элемент \d|[\u{1F300}-\u{1FAFF}]/iu;

describe("composition patterns", () => {
  it("has patterns, each shown by the playground and nothing else", () => {
    expect(names.length).toBeGreaterThan(0);
    expect(COMPOSITION_PATTERNS.map((pattern) => pattern.file).sort()).toEqual(names);
  });

  describe.each(names)("%s", (name) => {
    const file = `${dir}/${name}.tsx`;
    const css = `${dir}/${name}.module.css`;

    it("follows the pattern canon", () => {
      const source = read(file);
      expect(source, `${file}: one-line English JSDoc ending with "."`).toMatch(
        /^\/\*\* [^Ѐ-ӿ\n]+\. \*\/\n/,
      );
      expect(
        source.match(/^export default function \w+\(/gm),
        `${file}: one default export`,
      ).toEqual([`export default function ${pascal(name)}Pattern(`]);
      for (const m of source.matchAll(/(?:from|import) "([^"]+)"/g)) {
        const ok = ["prime-ui-kit", "react", `./${name}.module.css`].includes(m[1]);
        expect(ok, `${file} imports "${m[1]}"`).toBe(true);
      }
      expect(source, `${file}: React as \`import * as React from "react"\``).not.toMatch(
        /^import (?!\* as React from "react";).* from "react";$/m,
      );
      expect(source, `${file}: inline style`).not.toMatch(/style=\{\{/);
      expect(source, `${file}: size "m" is the default — omit it`).not.toMatch(/\bsize="m"/);
      expect(source, `${file}: placeholder text`).not.toMatch(PLACEHOLDER_TEXT);
    });

    it("styles only the page layout, on semantic tokens", () => {
      if (!fs.existsSync(path.join(root, css))) return;
      const sheet = read(css)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*@(media|container)\b.*$/gm, "");
      expect(sheet, css).not.toMatch(/--prime-(ref|sys)-/);
      expect(sheet, css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
      expect(sheet, css).not.toMatch(/(?<![\w-])\d*\.?\d+(px|rem)\b/);
      expect(sheet, css).not.toMatch(
        /^\s*(font-size|font-weight|line-height|letter-spacing|font-family|color|background(-color)?)\s*:/m,
      );
    });

    it("is linked from SKILL/composition.md", () => {
      expect(read("SKILL/composition.md")).toContain(`(patterns/${name}.tsx)`);
    });

    it("renders a page with one h1", async () => {
      const load = modules[`../../SKILL/patterns/${name}.tsx`];
      const { default: Pattern } = await load();
      render(React.createElement(NotificationProvider, null, React.createElement(Pattern)));
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });
  });
});
