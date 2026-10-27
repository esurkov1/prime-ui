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
};

function files(dir: string, test: (name: string) => boolean): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return files(full, test);
    return test(name) ? [full] : [];
  });
}

const cssFiles = (dir: string) => files(dir, (name) => name.endsWith(".css"));
const sourceFiles = (dir: string) =>
  files(dir, (name) => /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name));
const relative = (file: string) => path.relative(root, file).split(path.sep).join("/");
const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, "");

const RAW_SCROLL = /\boverflow(?:-x|-y|-block|-inline)?\s*:\s*[^;]*\b(?:auto|scroll|overlay)\b/;

describe("scroll regions", () => {
  it("component CSS has no raw scroller outside ScrollContainer", () => {
    const offenders: string[] = [];
    for (const file of cssFiles(root)) {
      const rel = relative(file);
      if (rel in ALLOWED) continue;
      const css = stripComments(readFileSync(file, "utf8"));
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

/**
 * Scroll chaining (ScrollContainer `overscrollBehavior`): at its end a region hands the wheel and
 * the trackpad on to the page, and a region that does not scroll never holds them. Only an open
 * layer keeps the page behind it still — each one is listed with its reason. Sideways containment
 * (`overscroll-behavior-inline` / `-x`) is free: a page never scrolls sideways.
 */
const CONTAIN_CSS: Record<string, string> = {
  "styles/globals.css":
    "the document under the viewport frame (`data-prime-frame`): it never scrolls, bounces nor pulls to refresh",
  "components/media-viewer/MediaViewer.module.css":
    "a full-screen layer: paging sideways must not swipe back nor bounce the page under it",
};

const CONTAIN_PROP: Record<string, string> = {
  "layout/app-shell/AppShell.tsx":
    "main in the viewport frame: the page's one scroller, nothing around it may scroll",
  "internal/overlay/DialogParts.tsx": "the body of Modal, Drawer and Sheet — an open layer",
  "internal/overlay/FloatingPanel.tsx":
    "the panel of Popover, Dropdown, Select… — an open layer (touch; the wheel: useContainScroll)",
  "components/command-menu/CommandMenu.tsx": "the list of a dialog — an open layer",
  "components/scroll-container/examples/overscroll.tsx": "the example of the prop itself",
};

/** A wheel listener that may cancel the scroll (`passive: false`, or not passive at all). */
const CANCELLING_WHEEL: Record<string, string> = {
  "components/scroll-container/useScrollMotion.ts":
    "a vertical wheel over a sideways strip: cancels only while the strip moves (unit-tested at the edge)",
  "internal/overlay/useContainScroll.ts": "an open floating layer keeps the page under it still",
  "components/media-viewer/MediaViewer.tsx": "the filmstrip of a full-screen layer",
  "components/media-viewer/viewerEngine.ts": "zoom and pan of a full-screen layer",
  "components/gantt/timeGesture.ts":
    "the chart's time camera: a zoom wheel, and a sideways swipe decided at its first event; a vertical wheel scrolls",
};

const BLOCK_CONTAIN_CSS = /\boverscroll-behavior(?:-block|-y)?\s*:\s*[^;]*\b(?:contain|none)\b/;
const CONTAIN_VALUE = /overscrollBehavior\s*[=:]\s*\{?\s*["'](?:contain|none)["']/;
const WHEEL_LISTENER =
  /addEventListener\(\s*["']wheel["']\s*,\s*[\w.]+\s*(?:\)|,\s*\{[^}]*passive:\s*(?:false|!))/;

function offenders(
  list: string[],
  allowed: Record<string, string>,
  pattern: RegExp,
  strip: (text: string) => string,
): string[] {
  return list
    .map(relative)
    .filter((rel) => !(rel in allowed))
    .filter((rel) => pattern.test(strip(readFileSync(path.join(root, rel), "utf8"))));
}

describe("scroll chaining", () => {
  it("no CSS holds the page's scroll outside an open layer", () => {
    expect(offenders(cssFiles(root), CONTAIN_CSS, BLOCK_CONTAIN_CSS, stripComments)).toEqual([]);
  });

  it("only an open layer sets overscrollBehavior contain or none", () => {
    expect(offenders(sourceFiles(root), CONTAIN_PROP, CONTAIN_VALUE, (text) => text)).toEqual([]);
  });

  it("only the listed wheel listeners may cancel a scroll", () => {
    expect(offenders(sourceFiles(root), CANCELLING_WHEEL, WHEEL_LISTENER, (text) => text)).toEqual(
      [],
    );
  });

  it("every listed exception still applies (no stale entries)", () => {
    const read = (rel: string) => readFileSync(path.join(root, rel), "utf8");
    for (const rel of Object.keys(CONTAIN_CSS)) {
      expect(BLOCK_CONTAIN_CSS.test(stripComments(read(rel))), rel).toBe(true);
    }
    for (const rel of Object.keys(CONTAIN_PROP))
      expect(CONTAIN_VALUE.test(read(rel)), rel).toBe(true);
    for (const rel of Object.keys(CANCELLING_WHEEL)) {
      expect(WHEEL_LISTENER.test(read(rel)), rel).toBe(true);
    }
  });
});
