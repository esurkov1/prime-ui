import { describe, expect, it } from "vitest";

import { read as readRepo, walk } from "../test/contract-utils";
import { cssAtRules, cssRule, cssRules, cssValue, srcCssFiles } from "../test/css";
import { numbered, ratchet } from "../test/ratchet";

/**
 * Touch and input guards over the CSS: hover never sticks after a tap, viewport breakpoints come
 * from one scale, editable fields never trigger the iOS focus zoom, small controls get a touch
 * hit area. The ratchet below (`touch`) covers the rest of the touch rules (foundation §9, owner
 * decision on hover): a hover transform also needs `(pointer: fine)`, a hover guard honours
 * `aria-disabled`, the touch text token stays in the field tier, viewport queries stay in the app
 * shell and overlay form, media queries in TS go through `useMediaQuery`, and every switcher
 * scrolls through `SwitcherScroller`.
 */

const files = srcCssFiles();
const read = (file: string) => readRepo(`src/${file}`);

describe("touch and input", () => {
  it("styles :hover only for devices that hover", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const { selector, parents } of cssRules(file)) {
        if (!selector.includes(":hover")) continue;
        if (parents.some((parent) => /^@media[^{]*\(hover:\s*hover\)/.test(parent))) continue;
        offenders.push(`${file} ${selector}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("uses one viewport breakpoint scale: 640 · 768 · 1024 · 1280", () => {
    const allowed = new Set([640, 768, 1024, 1280]);
    const offenders: string[] = [];
    for (const file of files) {
      for (const at of cssAtRules(file)) {
        if (at.name !== "media") continue;
        for (const w of at.params.matchAll(/\((min|max)-width:\s*(\d+)px\)/g)) {
          // `max-width` is the last pixel below a breakpoint: `max-width: 639px`.
          const value = Number(w[2]) + (w[1] === "max" ? 1 : 0);
          if (!allowed.has(value)) offenders.push(`${file} ${w[0]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps editable field text at 16px or more on touch and narrow screens", () => {
    const query = "@media (pointer: coarse), (max-width: 639px)";
    const tier = "src/internal/fieldTier.module.css";
    const raised = cssRules(tier).filter((rule) => rule.parents[0] === query);
    expect(raised.length, tier).toBeGreaterThan(0);
    expect(
      raised.some((rule) =>
        rule.decls.some(
          ({ prop, value }) =>
            prop === "--field-input-text" &&
            value === "max(var(--field-text), var(--prime-control-touch-text-size))",
        ),
      ),
      tier,
    ).toBe(true);
    // Tier-based fields set their editable text from the input variables, never the tier text.
    for (const [file, selector] of [
      ["src/components/input/Input.module.css", ".field"],
      ["src/components/textarea/Textarea.module.css", ".textarea"],
      ["src/components/native-select/NativeSelect.module.css", ".select"],
    ]) {
      expect(cssValue(cssRule(file, selector), "font-size"), file).toBe("var(--field-input-text)");
    }
    // Inputs outside the field tier raise their own text under the same query. DigitInput needs no
    // rule: its smallest cell already shows 16px digits (body-l).
    expect(
      cssRules("src/components/digit-input/DigitInput.module.css").some((rule) =>
        rule.decls.some(
          ({ prop, value }) =>
            prop === "--digit-cell-text" && value === "var(--prime-text-body-l-size)",
        ),
      ),
    ).toBe(true);
    for (const file of [
      "src/internal/menu.module.css",
      "src/components/datepicker/Datepicker.module.css",
      "src/components/color-picker/ColorPicker.module.css",
    ]) {
      const touch = cssRules(file).filter((rule) => rule.parents[0] === query);
      expect(
        touch.some((rule) =>
          rule.decls.some(({ value }) => value.includes("var(--prime-control-touch-text-size)")),
        ),
        file,
      ).toBe(true);
    }
  });

  it("grows small hit areas to the touch target on coarse pointers", () => {
    const coarse = "@media (pointer: coarse)";
    const decl = (file: string, selector: string, prop: string) =>
      cssValue(cssRule(file, selector, [coarse]), prop);
    expect(
      cssRules("src/internal/touchTarget.module.css").some(
        (rule) =>
          rule.parents[0] === coarse &&
          rule.decls.some(({ value }) => value.includes("var(--prime-control-touch-target)")),
      ),
    ).toBe(true);
    expect(decl("src/internal/menu.module.css", ".tier", "--menu-item-h")).toBe(
      "max(var(--menu-tier-item-h), var(--prime-control-touch-target))",
    );
    for (const file of [
      "components/button/Button.tsx",
      "components/badge/Badge.tsx",
      "internal/ChoiceField.tsx",
      "components/segmented-control/SegmentedControl.tsx",
      "components/select/Select.tsx",
    ]) {
      expect(read(file), file).toMatch(/touchTarget(Block)?Class/);
    }
    // Dense grids grow the cell itself: an invisible hit area would cover the neighbours.
    expect(
      cssRules("src/components/datepicker/Datepicker.module.css").some((rule) =>
        rule.decls.some(
          ({ prop, value }) =>
            prop === "--dp-cell" &&
            value === "max(var(--dp-cell-tier), var(--prime-control-touch-target))",
        ),
      ),
    ).toBe(true);
    for (const file of [
      "src/components/color-picker/ColorPresets.module.css",
      "src/components/color-swatches/ColorSwatches.module.css",
    ]) {
      expect(decl(file, ".grid", "--swatch-base"), file).toMatch(/^max\(/);
    }
  });
});

/** Stylesheets whose viewport queries are the app shell or the overlay form (foundation §9). */
const VIEWPORT_QUERY_FILES = new Set([
  "src/layout/app-shell/AppShell.module.css",
  "src/layout/app-header/AppHeader.module.css",
  "src/layout/sidebar/Sidebar.module.css",
  "src/layout/bottom-nav/BottomNav.module.css",
  "src/internal/sheet.module.css",
  "src/internal/floatingSurface.module.css",
  "src/components/modal/DialogParts.module.css",
  "src/components/modal/Modal.module.css",
  "src/components/drawer/Drawer.module.css",
  "src/components/sheet/Sheet.module.css",
  "src/components/command-menu/CommandMenu.module.css",
  "src/components/media-viewer/MediaViewer.module.css",
  "src/components/notification/Notification.module.css",
  // The touch text size of editable fields and the menu rows under the same query.
  "src/internal/fieldTier.module.css",
  "src/internal/menu.module.css",
  "src/components/datepicker/Datepicker.module.css",
  "src/components/color-picker/ColorPicker.module.css",
]);

/** The touch text token: the field tier and the dense pickers that grow under the same query. */
const TOUCH_TEXT_FILES = new Set([
  "src/internal/fieldTier.module.css",
  "src/internal/menu.module.css",
  "src/components/datepicker/Datepicker.module.css",
  "src/components/color-picker/ColorPicker.module.css",
]);

/** TS that may read a media query: the hook and the reduced-motion check of presence. */
const MEDIA_QUERY_FILES = new Set(["src/hooks/useMediaQuery.ts", "src/hooks/usePresence.ts"]);

/** Switchers (foundation §9): they scroll, never wrap or truncate. */
const SWITCHERS = [
  "src/components/tabs/Tabs.tsx",
  "src/components/segmented-control/SegmentedControl.tsx",
  "src/components/button-group/ButtonGroup.tsx",
  "src/layout/bottom-nav/BottomNav.tsx",
];

describe("touch rules (ratchet)", () => {
  it("follows the touch rules of foundation §9 (touch)", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const own = file.startsWith("src/styles/") ? null : file;
      for (const rule of cssRules(file)) {
        const hover = rule.selector.includes(":hover");
        if (
          hover &&
          /:not\(:disabled\)/.test(rule.selector) &&
          !/aria-disabled/.test(rule.selector)
        ) {
          offenders.push(`${file}: hover :not(:disabled) ignores aria-disabled`);
        }
        const moves = rule.decls.some(({ prop }) =>
          /^(transform|translate|scale|rotate)$/.test(prop),
        );
        if (hover && moves && !rule.parents.some((parent) => /\(pointer:\s*fine\)/.test(parent))) {
          offenders.push(`${file}: hover transform without (pointer: fine)`);
        }
        for (const decl of rule.decls) {
          if (
            own &&
            /--prime-control-touch-text-size/.test(decl.value) &&
            !TOUCH_TEXT_FILES.has(own)
          ) {
            offenders.push(`${file}: touch text token outside the field tier`);
          }
        }
      }
      if (own && !VIEWPORT_QUERY_FILES.has(own)) {
        for (const at of cssAtRules(file)) {
          if (at.name === "media" && /\((max|min)-width:/.test(at.params)) {
            offenders.push(`${file}: viewport query ${at.params}`);
          }
        }
      }
    }
    for (const file of walk("src", /\.tsx?$/).filter(
      (item) => !/\.test\.tsx?$|\/examples\//.test(item),
    )) {
      if (MEDIA_QUERY_FILES.has(file)) continue;
      if (/\bmatchMedia\(/.test(readRepo(file)))
        offenders.push(`${file}: matchMedia outside useMediaQuery`);
    }
    for (const file of SWITCHERS) {
      if (!readRepo(file).includes("@/internal/SwitcherScroller")) {
        offenders.push(`${file}: switcher without SwitcherScroller`);
      }
    }
    ratchet("touch", numbered(offenders));
  });
});
