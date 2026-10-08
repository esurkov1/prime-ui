# Foundations — do it this way

Condensed from the kit's design contract (`docs/foundation.md` in the kit repository; section numbers
below refer to it). Use semantic tokens `--prime-*` only.

## 1. 4px grid (§1.2)

Every spacing, height, padding and gap is a multiple of 4. Spacing tokens: `--prime-space-N` = N × 4px.

| Token | px | Token | px |
|---|---|---|---|
| `--prime-space-1` | 4 | `--prime-space-6` | 24 |
| `--prime-space-2` | 8 | `--prime-space-8` | 32 |
| `--prime-space-3` | 12 | `--prime-space-10` | 40 |
| `--prime-space-4` | 16 | `--prime-space-12` | 48 |
| `--prime-space-5` | 20 | `--prime-space-16` | 64 |
|  |  | `--prime-space-20` / `-24` | 80 / 96 |

Off-grid values exist only inside the kit (1px hairline, 2px focus ring). Never in your CSS.

The only places a raw length is allowed: `@media` / `@container` conditions (tokens cannot be used
there) and props a component documents as a CSS length string, e.g. DataTable column `width: "14rem"`.

## 2. Proximity scale (§1.3)

Things that belong together sit closer than things that do not.

| Between | Gap | Token |
|---|---|---|
| label → field | 4–8 | built into fields (`label` prop) — do not add |
| field → hint/error | 4 | built into fields — do not add |
| a hand-built field (your own control + `Label.Root` + `Hint.Root`) | label 4–8, hint 4 | `--prime-control-<size>-label-gap`, `--prime-control-<size>-hint-gap` |
| group heading → its fields | 16 | `--prime-space-4` |
| field → field in a form | 20 | `--prime-space-5` |
| inline controls in a row (buttons, filters) | 8 | `--prime-space-2` |
| switch → switch in a settings list | 20 | `--prime-space-5` |
| group → group (fieldset, form section) | 32 | `--prime-space-8` |
| card → card in a grid | 16 | `--prime-space-4` |
| section → section on a page | 40–48 | `--prime-space-10` / `--prime-space-12` |

`PageContent.Body` already spaces its direct blocks (cards, tables, sections) 40 apart and `AppShell.Main`
already carries the page gutters — do not add your own outer padding.

## 3. Size axis (§1.4, §6)

`size: "xs" | "s" | "m" | "l" | "xl"`, default `m` (height 28 · 32 · 36 · 40 · 48).

- Controls of one size line up exactly: Button, Input, Select, Datepicker, SegmentedControl, Tabs.
- One row = one size. A toolbar of `s` controls is all `s`.
- Dense tables/toolbars: `s`. Normal screens: `m`. Hero / marketing CTA: `l`.
- Badges/Kbd inside a control use one step smaller (`m` control → `s` badge).
- Tables: controls inside cells (Button, Select, Input) use one tier below the table (`m` table → `s`).
  Row height is a minimum: two-line cells and avatars grow the row by themselves — never set row or
  cell heights in CSS. Column dividers and the sort icon position come from DataTable; do not restyle
  them.

## 4. Fill, not lines (§1.1, §4)

- On a bare page the canvas is light gray and cards are white. Inside `AppShell` the nav rail sits on
  the gray canvas and the content panel is the white surface — there a Card becomes a gray sunken tile
  without a shadow. Fields follow their host. The kit switches all of this automatically — just nest
  components, never set backgrounds yourself.
- Separate blocks by fill and air. Hairlines (`Divider`) only inside a block: list rows, table rows,
  between a form and its footer.
- A card inside a card becomes a sunken tile automatically — use it sparingly; usually a section heading
  inside one card is better.
- Your own bounded block takes `background: var(--prime-color-card-bg)` and
  `border-radius: var(--prime-card-radius)`; never a transparent box with a border.

## 5. Nested radius (§1.5, §7)

Inner radius = outer radius − padding. Panel 12 with padding 4 → items 8. Use `--prime-radius-*`
(`xs 4 · s 6 · m 8 · l 12 · xl 16 · full`), `--prime-card-radius`, `--prime-panel-radius`.

## 6. tone and color (§3, §10)

- `tone` is meaning: `neutral · accent · success · warning · danger · info`. Destructive is `danger`.
- `color` is decoration from the palette: `gray · blue · green · orange · red · yellow · purple · sky ·
  pink · teal` — Badge, Avatar, Thumbnail, SegmentedControl dots, count badges of Tabs and
  SegmentedControl, FileUpload format badges, Timeline dots, TagSelect tags. Use one hue per meaning
  across the product (e.g. «Оплачен» is always green): keep one `Record<Status, PaletteColor>` map.
- Never convey meaning by color alone: a status badge has text.

## 7. Typography (§5)

| Role | Size/LH | Use |
|---|---|---|
| `caption` | 12/16 | meta, table head, timestamps |
| `body-s` | 13/20 | secondary text, dense UI |
| `body-m` | 14/20 | default text |
| `body-l` | 16/24 | reading text |
| `title-s` | 14/20 600 | card title, group heading inside a card or form |
| `title-m` | 16/24 600 | page section heading without a card, modal title |
| `title-l` | 18/24 600 | large block title |
| `heading-s` | 20/28 600 | page sub-heading |
| `heading-m` | 24/32 600 | page title (`PageContent.Title`) |
| `heading-l` | 30/36 600 | marketing / auth title |
| `display-*` | 36–60 | hero numbers only |
| `code` | 13/20 mono | identifiers, inline code |

`variant` is required on `Typography`. Weights only 400/500/600. Numbers in tables, prices, dates:
tabular (the kit does it in DataTable `numeric` columns and `Card.Value`; your own amounts take
`font-variant-numeric: tabular-nums`). Reading text max width `--prime-layout-reading-max-width`
(`PageContent.Root maxWidth="readable"`). Secondary text uses `tone="secondary"`/`"muted"` on
`Typography`, not a lighter custom color.

## 8. Hierarchy through air (§1.6)

Important content gets more space; secondary content is grouped tighter. Do not put everything on one
level of air: a page with uniform 16px gaps everywhere reads as a list of unrelated things.

## 9. Responsive (§9)

- Flexbox for rows/stacks, Grid for two-dimensional layouts; spacing via `gap`.
- Must work from 320px and at 400% zoom; the full rules are in [responsive.md](responsive.md).
- Viewport breakpoints 640 · 768 · 1024 · 1280 (`max-width: 639px` for "below 640"), only for the app
  frame. Components adapt to their own container — do not re-implement that.
- Touch follows input, not width: your `:hover` styles only inside `@media (hover: hover)`; nothing is
  hover-only; the kit keeps field text at 16px and gives small controls a 44px hit area on coarse
  pointers — do not wrap kit fields to change that.
- Flex children with text: `min-width: 0` + ellipsis or `overflow-wrap: anywhere`.
- Wide tables on phones: they scroll inside themselves with edge shadows; `stickyFirstColumn`, a column
  chooser through `hiddenColumns`; never let the page scroll sideways.
- Card grids: `grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(var(--prime-space-16) * 4)), 1fr))`.
- A page panel with sections, filter and search, view and the primary action is `PageToolbar`.

## 10. Focus and motion (§7)

Never remove focus rings, never set `outline: none`. Motion durations come from
`--prime-motion-duration-*`; the kit already animates overlays — add no animation of your own to them.
Kit components ship their micro-animations (press, toggle, selection glide, open/close) — never re-implement
or override them. Own custom elements follow the same rules: `--prime-motion-duration-fast|base|slow` and
`--prime-motion-easing-standard|enter|exit` only; animate `transform`/`opacity`, never `transition: all`,
never `ease-in`; press `scale(0.98)`; no movement on keyboard-driven or frequent actions; exit never slower
than enter.

## 11. State changes are continuous (§1.7)

Nothing on screen flips from one state to another. Kit controls already move into their new state.
Every region you build that changes what it shows — loading → data → empty → error, one record →
another — renders its content inside `<Crossfade state={status}>`: the old state fades out, the new
one fades in, the height glides. The loading state is a `<Skeleton>` in the data's geometry (same
rows, gaps and line heights), so the swap moves nothing; a `Spinner` only where there is no shape to
hold. Data already on screen stays during a refresh (`aria-busy`), it does not go back to a skeleton.
