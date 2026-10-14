/**
 * The deliberate exceptions to the 4px grid (foundation §1 rule 2), each with its reason: the one
 * source of the list. `bun run tokens:build` fails on a length named here that lands on the grid
 * or on one off the grid missing from here, and writes the list into foundation §1 rule 2;
 * `src/styles/tokens.test.ts` allows exactly the lengths foundation lists.
 */
export const OFF_GRID: Record<string, string> = {
  "border.width": "the hairline",
  "focus.width": "the focus ring",
  "focus.offset": "the gap between a control and its ring",
  "focus.offsetInset": "the ring drawn inside a field's edge",
  "icon.xs": "the icon scale meets the type scale at its smallest step",
  "control.xs.icon": "the glyph of the xs tier",
  "control.xs.choice": "the checkbox of the xs tier, paired with its 12px text",
  "control.m.choice": "the optical checkbox size next to 14px text",
  "control.s.track": "a line between the xs and m tracks",
  "control.m.track": "the m track line",
  "control.l.track": "a line between the m and xl tracks",
  "badge.s.paddingX": "the optical side air of a 20px chip with 12px text",
  "badge.m.icon": "the glyph of an m chip",
  "badge.l.paddingX": "the optical side air of a 28px chip with 13px text",
  "bottomNav.floatingHeight": "the iOS 26 tab bar at three quarters",
  "bottomNav.floatingIconSize": "the glyph in the floating capsule",
  "bottomNav.floatingItemGap": "the air between the glyph and the 9px label",
  "gallery.gap": "a seam between the tiles of an album",
  "tooltip.xs.paddingX": "the side air of a 24px chip with 12px text",
  "tooltip.s.paddingY": "the block air that makes the s chip 28px",
  "tooltip.m.paddingX": "the side air of a 32px chip with 13px text",
  "tooltip.m.paddingY": "the block air that makes the m chip 32px",
  "tooltip.arrowWidth": "the arrow base",
  "tooltip.arrowHeight": "the arrow depth",
};
