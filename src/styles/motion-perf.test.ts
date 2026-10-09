import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Rendering-cost guards over the CSS (foundation §7: motion is `transform` / `opacity`, plus
 * color / fill / shadow for state).
 *
 * - No `transition: all`: it animates whatever changes next, layout included.
 * - No transition or keyframe on a layout property (size, inset, margin, padding, grid tracks,
 *   border width) outside the ratchet below: each frame of one runs layout for the subtree. An
 *   entry there is a documented exception (a content-driven height, a grid-rows disclosure, an
 *   indicator that cannot scale without stretching its label); a new one needs a reason, and a
 *   fixed one leaves the list.
 * - No permanent `will-change` outside the ratchet: every promoted element holds a GPU layer.
 * - No `:has()` before a class-less target (`X:has(…) *`, `X:has(…) > :not(.a)`): Blink then
 *   invalidates the whole subtree of every `:has()` anchor on the page whenever anything inside
 *   one changes — a virtualized list restyled ~10k elements per frame. Give the target a class,
 *   or let the `:has()` element set a custom property the target reads.
 */

const roots = ["src", "playground", "SKILL"].map((dir) => path.resolve(process.cwd(), dir));

function cssFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (name === "node_modules" || name === "dist") return [];
    if (statSync(full).isDirectory()) return cssFiles(full);
    return name.endsWith(".css") ? [full] : [];
  });
}

const files = roots.flatMap(cssFiles);
const rel = (file: string) => path.relative(process.cwd(), file);
const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** Splits on `separator` at parenthesis depth 0. */
function splitTop(text: string, separator: RegExp): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of text) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (depth === 0 && separator.test(char)) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter(Boolean);
}

/** Every rule as its prelude and declaration block (keyframe steps included). */
function blocks(css: string): { prelude: string; parents: string[]; body: string }[] {
  const out: { prelude: string; parents: string[]; body: string }[] = [];
  const stack: { prelude: string; body: string }[] = [];
  let buffer = "";
  for (const char of stripComments(css)) {
    if (char === "{") {
      stack.push({ prelude: buffer.trim(), body: "" });
      buffer = "";
    } else if (char === "}") {
      const top = stack.pop();
      if (top) {
        top.body += buffer;
        out.push({ ...top, parents: stack.map((entry) => entry.prelude) });
      }
      buffer = "";
    } else if (char === ";") {
      const top = stack[stack.length - 1];
      if (top) top.body += `${buffer};`;
      buffer = "";
    } else {
      buffer += char;
    }
  }
  return out;
}

function declarations(body: string): { property: string; value: string }[] {
  return body
    .split(";")
    .map((line) => line.trim())
    .filter((line) => line.includes(":"))
    .map((line) => {
      const colon = line.indexOf(":");
      return { property: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() };
    });
}

const LAYOUT_PROPERTY =
  /^(width|height|(min|max)-(width|height|inline-size|block-size)|inline-size|block-size|top|right|bottom|left|inset(-[a-z-]+)?|margin(-[a-z-]+)?|padding(-[a-z-]+)?|grid-template-(rows|columns)|border(-[a-z]+)*-width|gap|row-gap|column-gap|font-size|line-height)$/;

/**
 * Layout transitions that stay on purpose, per file. Ratchet: add only with a reason in the file,
 * remove when the transition goes.
 */
const LAYOUT_TRANSITIONS: Record<string, string[]> = {
  // The changed part of a label glides between two widths (a few letters, one element).
  "src/internal/MorphText.module.css": ["width"],
  // Grid-rows disclosures (foundation §7 height exception): the row fold and the detail panel.
  "src/components/data-table/DataTable.module.css": ["border-top-width", "grid-template-rows"],
  "src/components/accordion/Accordion.module.css": ["grid-template-rows"],
  // The shared disclosure (a part that opens in place: a transcript): grid rows on a clip that
  // contains its layout and paint.
  "src/internal/disclosure.module.css": ["grid-template-rows"],
  // A reaction chip's tail part that opens and closes in place (avatars ↔ count).
  "src/components/message/Message.module.css": ["grid-template-columns", "inline-size"],
  "src/components/message/MessageTyping.module.css": ["grid-template-rows"],
  "src/components/message/MessageReactionBar.module.css": ["grid-template-rows"],
  // Content-driven heights with no transform stand-in.
  "src/components/crossfade/Crossfade.module.css": ["height"],
  "src/components/notification/Notification.module.css": ["height"],
  "src/components/tag-select/TagSelect.module.css": ["height"],
  // The rail width and its edge cut; the nested group disclosure.
  "src/layout/sidebar/Sidebar.module.css": [
    "width",
    "inset-inline-end",
    "max-width",
    "grid-template-rows",
  ],
  // Indicators sized to their item: a scale would stretch the label or the radius.
  "src/components/segmented-control/SegmentedControl.module.css": [
    "left",
    "top",
    "width",
    "height",
  ],
  "src/components/tabs/Tabs.module.css": ["width", "height"],
  "src/layout/bottom-nav/BottomNav.module.css": ["left", "width"],
  // A refused commit glides the thumb and the fill back; a vertical slider along the block axis.
  "src/components/slider/Slider.module.css": [
    "inset-inline-start",
    "width",
    "inset-block-end",
    "height",
  ],
  "src/components/gantt/Gantt.module.css": ["width"],
  // The remove segment opening inside a chip.
  "src/components/badge/Badge.module.css": ["padding"],
};

/** Permanent `will-change`, per file. Ratchet as above. */
const WILL_CHANGE: Record<string, string> = {
  // The round clip of a video note holds its own composited layer (WebKit leaks the radius).
  "src/components/video-note/VideoNote.module.css": "the round clip of a playing video in WebKit",
  // Mounted only while the reaction bar shows.
  "src/components/message/MessageReactionBar.module.css": "mounted only while shown",
  // The drag clone: `display: none` while empty, so it holds a layer only during a drag.
  "src/components/dnd/Dnd.module.css": "the drag clone, hidden while empty",
};

/** The compound after the last top-level combinator of a complex selector. */
function lastCompound(selector: string): string {
  const parts = splitTop(selector.replace(/\s*([>+~])\s*/g, " "), /\s/);
  return parts[parts.length - 1] ?? "";
}

/** Whether the compound names a class, id or attribute Blink can invalidate by. */
function featured(compound: string): boolean {
  const own = compound.replace(/::?[a-z-]+\((?:[^()]|\([^()]*\))*\)|::[a-z-]+/g, (match) =>
    match.startsWith(":is(") || match.startsWith(":where(") ? match : "",
  );
  if (/[.#[]/.test(own.replace(/:(is|where)\((?:[^()]|\([^()]*\))*\)/g, ""))) return true;
  const groups = [...own.matchAll(/:(?:is|where)\(((?:[^()]|\([^()]*\))*)\)/g)];
  return (
    groups.length > 0 &&
    groups.every((group) =>
      splitTop(group[1] ?? "", /,/).every((arg) => featured(lastCompound(arg))),
    )
  );
}

describe("motion and rendering cost", () => {
  it("never transitions `all`", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const { prelude, body } of blocks(readFileSync(file, "utf8"))) {
        for (const { property, value } of declarations(body)) {
          if (!/^transition(-property)?$/.test(property)) continue;
          if (splitTop(value, /,/).some((item) => /^all\b/.test(item))) {
            offenders.push(`${rel(file)} ${prelude}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("transitions and keyframes stay off layout properties outside the documented exceptions", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const allowed = LAYOUT_TRANSITIONS[rel(file)] ?? [];
      for (const { prelude, parents, body } of blocks(readFileSync(file, "utf8"))) {
        const inKeyframes = parents.some((parent) => parent.startsWith("@keyframes"));
        for (const { property, value } of declarations(body)) {
          if (inKeyframes && LAYOUT_PROPERTY.test(property) && !allowed.includes(property)) {
            offenders.push(`${rel(file)} @keyframes ${property}`);
          }
          if (!/^transition(-property)?$/.test(property)) continue;
          for (const item of splitTop(value, /,/)) {
            const name = item.split(/\s+/)[0] ?? "";
            if (LAYOUT_PROPERTY.test(name) && !allowed.includes(name)) {
              offenders.push(`${rel(file)} ${prelude} → ${name}`);
            }
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps `will-change` off permanently styled elements", () => {
    const offenders: string[] = [];
    for (const file of files) {
      if (WILL_CHANGE[rel(file)]) continue;
      for (const { prelude, body } of blocks(readFileSync(file, "utf8"))) {
        if (declarations(body).some(({ property }) => property === "will-change")) {
          offenders.push(`${rel(file)} ${prelude}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("never follows a `:has()` with a class-less target", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const { prelude, parents } of blocks(readFileSync(file, "utf8"))) {
        if (parents.some((parent) => parent.startsWith("@keyframes"))) continue;
        if (!prelude.includes(":has(")) continue;
        for (const selector of splitTop(prelude, /,/)) {
          const last = lastCompound(selector);
          const before = selector.slice(0, selector.length - last.length);
          if (before.includes(":has(") && !featured(last)) {
            offenders.push(`${rel(file)} ${selector}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("flags the shapes it guards against", () => {
    expect(featured(lastCompound(".a:has(.b) :is(.c, .c *)"))).toBe(false);
    expect(featured(lastCompound(".a:has(> .b) > :not(.c, .d)"))).toBe(false);
    expect(featured(lastCompound(".a:where(:has(> .b)) > :where(:not(.b))"))).toBe(false);
    expect(featured(lastCompound(".a:has(> .b) > .c"))).toBe(true);
    expect(featured(lastCompound(".a:has(.b) :is(.c, .d:not([data-x]))"))).toBe(true);
    expect(featured(lastCompound(".a:has(+ .b)::after"))).toBe(true);
  });
});
