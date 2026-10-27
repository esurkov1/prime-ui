/**
 * The touch step (foundation §5): the type, then the marks of the controls. Under `@media (pointer: coarse)` — a phone or a
 * tablet, held closer and read at arm's length in motion — the text roles and the text of the
 * control tiers move one step along the scale (12 · 13 · 14 · 15 · 16 · 17 · 18 · 20), as the
 * platforms' own type sits a step over a desktop's. One map for every size the kit reads:
 *
 *   13/20 → 14/20 (body-s, code) · 14/20 → 15/20 (body-m, title-s) · 13/16 → 14/20 (title-xs) ·
 *   12 → 13 and 13 → 14 and 14 → 15 for the text of Badge / Kbd tiers `s` … `xl` ·
 *   10 → 11 for the BottomNav label, 9 → 10 for the floating capsule's label
 *
 * A size that is already as large as its step (caption, body-l, title-m, title-l, the `xs` tier, the
 * `l` / `xl` tier text) stays; a line height grows only where the new size needs it (title-xs
 * 13/16 → 14/20). Every control height stays its tier's (`control.<tier>.height` is not here), so a
 * field, a button and a list row keep their box and only their text grows inside it. Badge / Kbd
 * boxes and the BottomNav keep their height and line height; the `xs` badge stays. Headings, display roles and
 * tooltip text stay. Editable text keeps its own 16px rule (`control.touchTextSize`).
 *
 * A phone's controls also draw their marks the platform's size, so they read as native: the Switch
 * takes the iOS proportions (w/h ≈ 1.65, thumb = height − 4: s 36×22, m 44×26, l 48×28, xl 51×31),
 * the Checkbox / Radio box grows by 2 up to 24 (`control.<tier>.choice`: xs 16 · s 18 · m 20 · l 22),
 * and the Slider thumb grows to a hand's size (`control.<tier>.thumb`: 20 · 24 · 28 · 32 · 36). The
 * glyphs step with the text: `control.<tier>.icon` 16 · 18 · 18 · 22 · 22 (over 14 · 16 · 16 · 20 · 20),
 * `badge.<tier>.icon` s 14, m 16, xl 18 (`xs` and `l` stay). The Slider track, every control and
 * badge height stay.
 *
 * Every key overrides a semantic token of `semantic.ts` (the build checks it); the values are rem
 * like the rest of the scale, so the step follows the person's own browser text size.
 */
export const touchTextOverrides = {
  text: {
    bodyS: { size: "{font.size.14}" },
    bodyM: { size: "{font.size.15}" },
    titleXs: { size: "{font.size.14}", lineHeight: "{font.lineHeight.20}" },
    titleS: { size: "{font.size.15}" },
    code: { size: "{font.size.14}" },
  },
  control: {
    xs: { icon: "1rem", choice: "1rem", thumb: "1.25rem" },
    s: {
      textSize: "{font.size.14}",
      labelSize: "{font.size.13}",
      icon: "1.125rem",
      choice: "1.125rem",
      thumb: "1.5rem",
    },
    m: {
      textSize: "{font.size.15}",
      labelSize: "{font.size.14}",
      icon: "1.125rem",
      choice: "1.25rem",
      thumb: "1.75rem",
    },
    l: {
      labelSize: "{font.size.15}",
      hintSize: "{font.size.14}",
      icon: "1.375rem",
      choice: "1.375rem",
      thumb: "2rem",
    },
    xl: {
      labelSize: "{font.size.15}",
      hintSize: "{font.size.14}",
      icon: "1.375rem",
      thumb: "2.25rem",
    },
  },
  switch: {
    s: { width: "2.25rem", height: "1.375rem", thumb: "1.125rem" },
    m: { width: "2.75rem", height: "1.625rem", thumb: "1.375rem" },
    l: { width: "3rem", height: "1.75rem", thumb: "1.5rem" },
    xl: { width: "3.1875rem", height: "1.9375rem", thumb: "1.6875rem" },
  },
  bottomNav: {
    labelSize: "{font.size.11}",
    floatingLabelSize: "{font.size.10}",
  },
  badge: {
    s: { textSize: "{font.size.13}", icon: "0.875rem" },
    m: { textSize: "{font.size.13}", icon: "1rem" },
    l: { textSize: "{font.size.14}" },
    xl: { textSize: "{font.size.15}", icon: "1.125rem" },
  },
} as const;
