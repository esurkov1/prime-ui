import { describe, expect, it } from "vitest";

import { read as readRepo, walk } from "../test/contract-utils";
import { cssAtRules, cssRule, cssRules, cssValue, srcCssFiles } from "../test/css";

/**
 * Touch and input guards over the CSS: hover never sticks after a tap, viewport breakpoints come
 * from one scale, a control's text is its tier's on touch, small controls get a touch
 * hit area. The guard below (`touch`) covers the rest of the touch rules (foundation §9, owner
 * decision on hover): a hover transform also needs `(pointer: fine)`, a hover guard honours
 * `aria-disabled`, viewport queries stay in the app
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

  it("sets no text floor for touch: a control's text is its tier's, one size per tier", () => {
    const tier = "src/internal/fieldTier.module.css";
    for (const [file, selector] of [
      ["src/components/input/Input.module.css", ".field"],
      ["src/components/textarea/Textarea.module.css", ".textarea"],
      [tier, ".controlText"],
    ]) {
      expect(cssValue(cssRule(file, selector), "font-size"), file).toBe("var(--field-text)");
    }
    for (const host of [
      "components/native-select/NativeSelect.tsx",
      "components/datepicker/DatepickerPanel.tsx",
      "components/command-menu/CommandMenu.tsx",
      "components/color-picker/ColorPicker.tsx",
      "components/dropdown/Dropdown.tsx",
    ]) {
      expect(read(host), host).toMatch(/fieldTextClass/);
    }
    // No stylesheet raises or lowers a control's text under a touch query.
    const offenders: string[] = [];
    for (const file of files) {
      for (const rule of cssRules(file)) {
        if (!rule.parents.some((parent) => /^@media[^{]*(pointer:\s*coarse)/.test(parent)))
          continue;
        for (const { prop, value } of rule.decls) {
          if (
            /^(--field-text|--field-lh)$/.test(prop) ||
            (/^(font-size|line-height|font)$/.test(prop) &&
              /-text-size|--field-(text|lh)/.test(value))
          ) {
            offenders.push(`${file} ${rule.selector} ${prop}`);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
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
      "max(var(--field-item-h), var(--prime-control-touch-target))",
    );
    // Every small control of the kit that carries the hit area: dropping it from one fails here.
    for (const file of [
      "components/button/Button.tsx",
      "components/badge/Badge.tsx",
      "internal/ChoiceField.tsx",
      "internal/FieldAction.tsx",
      "components/segmented-control/SegmentedControl.tsx",
      "components/select/Select.tsx",
      "components/stepper/Stepper.tsx",
      "components/chart-frame/ChartFrame.tsx",
      "components/chat/ChatPinned.tsx",
      "components/message/MessageReactionBar.tsx",
      "components/voice-player/VoicePlayer.tsx",
    ]) {
      expect(read(file), file).toMatch(/touchTarget(Block)?Class/);
    }
    // Dense grids grow the cell itself: an invisible hit area would cover the neighbours. A
    // Datepicker day is the menu row (`menu.tier` on the panel), which grows on touch (above).
    expect(
      cssValue(cssRule("src/components/datepicker/Datepicker.module.css", ".panel"), "--dp-cell"),
    ).toBe("var(--menu-item-h)");
    // The swatch donor grows every swatch grid (ColorSwatches, ColorPresets) on both bases.
    for (const selector of [".tier", '.tier[data-base="item"]']) {
      expect(decl("src/internal/swatch.module.css", selector, "--swatch-base"), selector).toMatch(
        /^max\(/,
      );
    }
  });
});

/** Stylesheets whose viewport queries are the app shell or the overlay form (foundation §9). */
const VIEWPORT_QUERY_FILES = new Set([
  "src/layout/app-shell/AppShell.module.css",
  "src/layout/sidebar/Sidebar.module.css",
  "src/layout/bottom-nav/BottomNav.module.css",
  "src/internal/sheet.module.css",
  "src/internal/floatingSurface.module.css",
  "src/internal/overlay/DialogParts.module.css",
  "src/components/drawer/Drawer.module.css",
  "src/components/sheet/Sheet.module.css",
  "src/components/command-menu/CommandMenu.module.css",
  "src/components/media-viewer/MediaViewer.module.css",
  "src/components/notification/Notification.module.css",
  "src/components/datepicker/Datepicker.module.css",
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

describe("touch rules", () => {
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
    expect(offenders, "touch").toEqual([]);
  });
});
