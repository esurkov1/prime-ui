/**
 * Composition patterns contract: every `SKILL/patterns/<name>.tsx` is one copyable screen — the
 * pattern canon (JSDoc, one `<Name>Pattern` default export, kit-only imports, no inline style,
 * CSS on semantic tokens) — and is linked from `SKILL/composition.md` and shown by the playground
 * (`playground/composition/patterns.ts`). Each pattern also renders.
 */
import fs from "node:fs";
import path from "node:path";

import { render, screen } from "@testing-library/react";
import * as React from "react";
import { COMPOSITION_PATTERNS } from "../../playground/composition/patterns";
import { NotificationProvider } from "../components/notification/NotificationStore";
import { checkLayoutCss, checkSourceCanon, pascal, read, root } from "./contract-utils";

const dir = "SKILL/patterns";

const names = fs
  .readdirSync(path.join(root, dir))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))
  .sort();

const modules = import.meta.glob<{ default: React.ComponentType }>("../../SKILL/patterns/*.tsx");

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
      checkSourceCanon(file, source, (spec) =>
        ["prime-ui-kit", "react", `./${name}.module.css`].includes(spec),
      );
      expect(
        source.match(/^export default function \w+\(/gm),
        `${file}: one default export`,
      ).toEqual([`export default function ${pascal(name)}Pattern(`]);
    });

    it("styles only the page layout, on semantic tokens", () => {
      if (!fs.existsSync(path.join(root, css))) return;
      checkLayoutCss(css, read(css), ["color", "background(-color)?"]);
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
