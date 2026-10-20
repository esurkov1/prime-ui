import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * A panel that meets a screen edge steps its content in by the safe-area inset of that edge
 * (`--prime-safe-area-*`, set once by the app: the notch, the home indicator, a Telegram Mini App's
 * buttons in full screen) while its fill runs on to the edge. Each entry: the stylesheet, the rule
 * (selector exactly as written) and the insets it reads.
 */
const PANELS: { file: string; selector: string; insets: string[] }[] = [
  { file: "components/drawer/Drawer.module.css", selector: ".panel", insets: ["top", "bottom"] },
  {
    file: "components/drawer/Drawer.module.css",
    selector: '.panel[data-side="right"]',
    insets: ["right"],
  },
  {
    file: "components/drawer/Drawer.module.css",
    selector: '.panel[data-side="left"]',
    insets: ["left"],
  },
  {
    file: "internal/overlay/ModalDialog.module.css",
    selector: ".content:not([data-sheet])",
    insets: ["top", "right", "bottom", "left"],
  },
  {
    file: "internal/overlay/ModalDialog.module.css",
    selector: '.content[data-placement="top"]',
    insets: ["top"],
  },
  { file: "internal/sheet.module.css", selector: ".surface", insets: ["top", "bottom"] },
  {
    file: "layout/sidebar/Sidebar.module.css",
    selector: ".root[data-off-canvas]",
    insets: ["top"],
  },
  {
    file: "layout/sidebar/Sidebar.module.css",
    selector: ".root[data-off-canvas] .panel",
    insets: ["bottom", "left"],
  },
];

function ruleBody(css: string, selector: string): string {
  const start = css.indexOf(`\n${selector} {`);
  if (start === -1) return "";
  const open = css.indexOf("{", start);
  return css.slice(open + 1, css.indexOf("\n}", open));
}

describe("safe-area insets of edge panels", () => {
  for (const { file, selector, insets } of PANELS) {
    it(`${file} ${selector} reads ${insets.join(", ")}`, () => {
      const css = readFileSync(path.resolve(process.cwd(), "src", file), "utf8");
      const body = ruleBody(css, selector);
      expect(body, "rule not found").not.toBe("");
      for (const side of insets) {
        expect(body, side).toContain(`var(--prime-safe-area-${side})`);
      }
    });
  }
});
