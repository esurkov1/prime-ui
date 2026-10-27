# Prime UI — Foundation (Graphite)

The design contract for every component. Tokens live in `tokens/` and are generated into
`src/styles/{tokens,theme-light,theme-dark}.css` by `bun run tokens:build`.

## 1. Principles

1. **Depth comes from fill, not from lines.** Surfaces stand on one ladder (§4): the page, a card one
   step off it, a block in the card one step off the card; a control is always one step off the layer
   it sits on, so nothing merges with its host. Borders are hairlines (`border.subtle`)
   used only where a separator is truly needed (table rows, list dividers). Controls have no visible
   outline: `--prime-color-border-control` is `transparent` and becomes visible only under
   `prefers-contrast: more`.
2. **Everything is on the 4px grid.** Spacing, heights, paddings, gaps. Off the grid by their kind:
   the typographic sizes and line heights (13px; §5), the radii (the s and l radius 6 · 10; rule 5),
   the blurs (the 2px `--prime-motion-blur`, the BottomNav glass blur `0.875rem`) and the `rem`
   thresholds of `@container` conditions (§9). The off-grid lengths are a closed list, generated
   from `tokens/offGrid.ts` by `bun run tokens:build`; `src/styles/tokens.test.ts` allows exactly
   these:
   <!-- off-grid:start -->
   - `--prime-border-width` 1px — the hairline
   - `--prime-focus-width` 2px — the focus ring
   - `--prime-focus-offset` 2px — the gap between a control and its ring
   - `--prime-focus-offset-inset` -2px — the ring drawn inside a field's edge
   - `--prime-icon-xs` 14px — the icon scale meets the type scale at its smallest step
   - `--prime-control-xs-icon` 14px — the glyph of the xs tier
   - `--prime-control-xs-choice` 14px — the checkbox of the xs tier, paired with its 12px text
   - `--prime-control-m-choice` 18px — the optical checkbox size next to 14px text
   - `--prime-control-s-track` 5px — a line between the xs and m tracks
   - `--prime-control-m-track` 6px — the m track line
   - `--prime-control-l-track` 7px — a line between the m and xl tracks
   - `--prime-control-s-thumb` 15px — three tracks: the slider thumb stands in proportion to its line
   - `--prime-control-m-thumb` 18px — three tracks: the slider thumb stands in proportion to its line
   - `--prime-control-l-thumb` 21px — three tracks: the slider thumb stands in proportion to its line
   - `--prime-badge-s-padding-x` 6px — the optical side air of a 20px chip with 12px text
   - `--prime-badge-m-icon` 14px — the glyph of an m chip
   - `--prime-badge-l-padding-x` 10px — the optical side air of a 28px chip with 13px text
   - `--prime-bottom-nav-floating-height` 46px — the iOS 26 tab bar at three quarters
   - `--prime-bottom-nav-floating-icon-size` 18px — the glyph in the floating capsule
   - `--prime-bottom-nav-floating-item-gap` 2px — the air between the glyph and the 9px label
   - `--prime-gallery-gap` 2px — a seam between the tiles of an album
   - `--prime-tooltip-xs-padding-x` 6px — the side air of a 24px chip with 12px text
   - `--prime-tooltip-s-padding-y` 6px — the block air that makes the s chip 28px
   - `--prime-tooltip-m-padding-x` 10px — the side air of a 32px chip with 13px text
   - `--prime-tooltip-m-padding-y` 6px — the block air that makes the m chip 32px
   - `--prime-tooltip-arrow-width` 10px — the arrow base
   - `--prime-tooltip-arrow-height` 5px — the arrow depth
   <!-- off-grid:end -->
3. **Proximity.** Inside a group elements sit closer than between groups:
   label → field 4–8 · field → hint 4 · tile → tile 16 · field → field 20 · block → block 24 ·
   group → group 32 · section → section 40–48. Tiles of one screen are one board (one gap on both
   axes); only a new topic with its own heading gets the large air.
4. **One size axis.** `xs · s · m · l · xl`. Default is always `m`. Controls of the same size line up
   perfectly in a row (Button, Input, Select, Datepicker trigger, SegmentedControl, Tabs).
5. **Nested radius = outer radius − padding.** Panel 12 with padding 4 → items 8.
6. **Air is hierarchy.** Important content gets more space; secondary content is grouped tighter.
7. **State changes are continuous; loading never unfolds.** Nothing on screen flips from one state to
   another. Controls move into their new state (§7 Motion, rule 8). Whatever loads is a `Skeleton` in
   the data's geometry from the first paint — never nothing, never a region that grows from zero —
   and the data then replaces it in place: no height glide, no reveal, no slide, at most a short
   cross-fade, the layout settled in one frame. A region swapping between settled states — data →
   empty → error, one record → another — cross-fades the same way (`Crossfade`): opacity only, the
   new height taken at once, nothing unfolding or clipped. A region that mounts in its state shows it still. This holds for every region of every screen, not
   only for prominent ones.

## 2. Token layers and naming

| Layer | Prefix | Example | Who may use it |
|---|---|---|---|
| Primitive | `--prime-ref-*` | `--prime-ref-color-gray-100` | only `tokens/semantic.ts` |
| Semantic | `--prime-*` | `--prime-color-text-secondary`, `--prime-space-4` | components |
| Component tier | `--prime-<component>-*` | `--prime-control-m-height`, `--prime-panel-radius` | components |

Path → variable: `control.m.labelSize` → `--prime-control-m-label-size` (camelCase → kebab-case).

Components MUST NOT use `--prime-ref-*`, raw hex/rgb, or raw `px/rem` values. Allowed literals:
`0`, `1px` hairline via `--prime-border-width`, `100%`, `auto`, unitless flex/grid numbers,
percentages for geometry (`50%` for circles), `calc()` over tokens, and `rem` thresholds in
`@container` conditions (custom properties cannot be used there; §9).
A component may define private custom properties (`--btn-h`) that are assigned from tokens.

## 3. Color roles

| Group | Tokens | Use |
|---|---|---|
| `color.layer.<n>` | `0`…`4`, `floating`, `floating1`, `floating2` × bg, fill, fillHover, selected | the surface ladder (§4), computed by `tokens/layers.ts`; components read it through the depth context variables, not directly |
| `color.bg` | inverse, scrim, edgeShadow, glass, glassEdge | tooltip / modal backdrop / shade over a scrolled edge / BottomNav glass |
| `color.fill` | subtle, subtleActive, faint, strong, strongHover | translucent state washes that sit on any background: ghost hover & row hover / tab hover in the Tabs strip / unchecked checkbox, switch track, slider track |
| `color.text` | primary, secondary, muted, placeholder, disabled, inverse | — |
| `color.border` | subtle, default, control | hairline separators / stroke buttons / control outline (transparent) |
| `color.accent` | default, hover, fg, soft, softHover, text | primary action, selection, links, active tab, checked controls |
| `color.danger/success/warning/info` | default, (hover), fg, soft, text, (border) | status (info is sky, distinct from the cobalt accent) |
| `color.field` | bgDisabled | a disabled field; the resting, hover and focus fill come from the ladder (§4) |
| `color.focus.ring` | — | the one focus ring |
| `color.control.thumb` | — | switch / slider thumb |
| `color.tooltip` | bg, text | — |
| `color.palette.<hue>` | soft, text, solid, solidFg | Badge/Avatar colors: gray, blue, green, orange, red, yellow, purple, sky, pink, teal |

Light and dark are full themes, not inversions: the surface ladder rises from a near-black page in
dark (§4), and accent/status move to lighter steps. All text pairs pass WCAG AA (≥ 4.5:1), focus
ring ≥ 3:1 — including `text.muted` on every layer and on every control fill of it.

### Chart palette

Categories wear the chart colors; a judgement (good, attention, a problem) wears a tone (`danger`, `success`…); a stage or another identity without a judgement wears a palette `color`.

| Token | Use |
|---|---|
| `color.chart.1` … `8` | categorical series in one fixed order: blue, orange, teal, yellow, pink, green, purple, red. Assign in order, never cycle; a ninth series folds into `other` |
| `color.chart.other` | the «Прочее» share |
| `color.chart.grid` / `axis` | gridlines / the axis line and ticks (axis labels wear text tokens) |
| `color.chart.scale.1` … `5`, `scaleFg` | sequential magnitude (heatmap cells) in one hue from near the ground to full; `scaleFg` is the text on steps 4–5 |

Every series step keeps ≥ 3:1 against every layer ground (layers 0–4 and the floating layers) in both
themes; `src/theme/chartColors.test.ts` checks it. Palette hues (`color` props) map onto the same steps
through `--hue-chart` (`src/internal/palette.module.css`), so a category keeps its color in a chart and
in a ProgressBar share.

## 4. Surfaces: the ladder and the depth context

**The ladder.** Surfaces are the page (layer 0) and four nested layers. Neighbouring layers differ by
one lightness step, ΔL 0.03 in OKLab. `tokens/layers.ts` computes every color at build time:

- A nested layer is one step lighter than its parent.
- **Reflect:** with less than half a step of room before the edge of the lightness window, the step
  goes the other way. **Snap:** if less than half a step would be left after a move, the color lands
  on the edge.
- Light theme: window 0.06–1.0, page `gray.50` (`#f3f4f6`). The card snaps to pure white, deeper layers
  alternate with the page tone (white → `#f4f5f7` → white → `#f4f5f7`), as Carbon's layers do.
- Dark theme: window 0.06–0.95, page `gray.950` (`#0d0f13`). Every layer is one step lighter
  (`#14161a` → `#1a1c21` → `#212428` → `#292b2f`); nothing ever sinks towards black.
- Every color keeps the hue and chroma of the page, so the cool Graphite bias is on every layer.
- Controls on a layer (field, chip, neutral button, segmented track, the Tabs strip's tone) step from
  it: darker in light, lighter in dark, with the same reflect. `fillHover` is two steps. The selected
  thumb on a track is lighter than the track: two steps in light, four in dark, where only
  lightness sets it apart.
- Floating layers (menus, popovers, modals, drawers, notifications) sit one step above a card and never
  reflect: white in light (their shadow carries the depth), a step lighter in dark. Two layers can
  nest inside one (`floating1`, `floating2`).

Each row is `color.layer.<n>.{bg, fill, fillHover, selected}` → `--prime-color-layer-<n>-*`.

**The depth context.** A surface sets `data-depth` (`0`–`4`, `floating`, `floating-1`, `floating-2`,
`tinted`) one above the surface around it; `src/internal/surfaceDepth.tsx` carries the depth through
React context (portals included). `globals.css` points the context variables at the row of that depth:

| Variable | Meaning |
|---|---|
| `--prime-color-layer-current` | the surface's own fill |
| `--prime-color-layer-nested` | a surface placed on it (an inset tile, a cover) |
| `--prime-color-field-bg` / `-hover` / `-focus` | a field at rest (one step), on hover (two), in focus (the layer itself + the ring) |
| `--prime-color-fill-muted` / `-hover` | neutral buttons, chips, segmented tracks, the Tabs strip |
| `--prime-color-control-selected` | the selected segment on a track, the active FileUpload icon |
| `--prime-layer-shadow` | the raised whisper — only on a card that sits on the page (depth 1) |

`:root` and every `[data-theme]` element are layer 0. A component never knows where it lies: it writes
`background: var(--prime-color-field-bg)` and the depth decides.

**The app frame.** The AppShell content panel is the page itself (layer 0): gray in light, near black
in dark, so cards on it are layer 1 — white in light. The Sidebar rail beside it is a surface one
layer above the page (white in light, a step lighter in dark), so the rail and the content never
merge; its current item is the rail's fill two steps off it.

**Who sets a depth.** Layers: Card, Sidebar, Accordion, DataTable, LoginForm, an outline Banner,
ExampleFrame. Floating: every `FloatingPanel` (Popover, Dropdown, Select, TagSelect…), Modal, Drawer,
Sheet, CommandMenu, Notification, a raised ColorPicker.Panel. Host content sets none: Tabs (a bar —
the active tab is the host's own surface) and `Datepicker.Panel` (a calendar in the host's padding)
read the depth of the surface they stand on. The ladder stops at layer 4: a surface nested deeper keeps layer 4's color — split
the screen with space and headings instead.

**Hosts off the ladder.** A tinted host (a soft or solid Banner, an accent wash, an image) sets
`data-depth="tinted"`: controls on it take the translucent washes (`fill.subtleActive`,
`fill.strong`), which read on any color. Translucent fills are otherwise only for states: row and
ghost hover, checkbox and switch tracks.

Fields: `background: var(--prime-color-field-bg)`, hover `--prime-color-field-bg-hover`, focus while typing
`--prime-color-field-bg-focus` plus the focus ring (a picker trigger keeps its fill), error a `--prime-color-danger-border` 1px inset ring
(`box-shadow: inset 0 0 0 1px …`) and danger text below.

**Every bounded block must be visible on its host (hard rule).** A block with edges (table, card, panel, code block,
list group, tile, empty state frame) never has a transparent fill or the same fill as the plane it sits on. It is a
layer (Card, or `data-depth` in a kit component) or takes `--prime-color-layer-nested`. A table's head, body rows
and footer all sit inside that fill, so the table's bottom edge is always visible. A strip on a block's outer edge
(the Tabs strip) is two steps off the block: one step off a white card is the light page tone itself. Only
explicitly flat/ghost variants may drop the fill, and then they must have no radius (nothing suggests a box).

## 5. Typography

Font: Golos Text (400/500/600), mono: JetBrains Mono. Roles (`--prime-text-<role>-{size,line-height,weight,tracking}`):

| Role | Size/LH | Weight | Tracking | Use |
|---|---|---|---|---|
| caption | 12/16 | 400 | +0.01em | hints, meta, table head |
| body-s | 13/20 | 400 | 0 | secondary text, dense UI |
| body-m | 14/20 | 400 | 0 | default UI text |
| body-l | 16/24 | 400 | 0 | reading text |
| title-xs | 13/16 | 600 | 0 | title of an xs surface (a dense tile) |
| title-s | 14/20 | 600 | 0 | card title, group heading |
| title-m | 16/24 | 600 | −0.01em | modal title, section title |
| title-l | 18/24 | 600 | −0.01em | — |
| heading-s | 20/28 | 600 | −0.01em | page sub-heading |
| heading-m | 24/32 | 600 | −0.02em | page title |
| heading-l | 30/36 | 600 | −0.02em | — |
| display-s/m/l | 36/44 · 48/56 · 60/68 | 600 | −0.02 / −0.03em | hero, metrics |
| code | 13/20 mono | 400 | 0 | code, IDs |

Touch step: under `@media (pointer: coarse)` the type moves one step along the scale
(12 · 13 · 14 · 15 · 16 · 17 · 18 · 20): 13/20 → 14/20 (body-s, code) · 14/20 → 15/20 (body-m,
title-s) · title-xs 13/16 → 14/20. Caption, body-l, title-m and title-l stay. It covers the text
roles and the text, label and hint of the control tiers (`s` text 14 and label 13, `m` text 16/24 and label 14, `l` / `xl` text 17/24, label 15 and hint 14; the `xs` tier stays), and the text of Badge / Kbd
tiers `s` … `xl` (13 · 13 · 14 · 15) so a badge keeps its ratio to the text beside it, and the BottomNav label (10 → 11, the floating capsule's 9 → 10). Heading and
display roles, tooltip text, the `xs` badge and every control, badge and BottomNav height stay. The marks
of the controls take the platform's size too, so they read as native: the Switch the iOS proportions
(w/h ≈ 1.65, thumb = height − 4: `s` 36×22, `m` 44×26, `l` 48×28, `xl` 51×31; `xs` stays), the
Checkbox / Radio box +2 up to 24 (`choice`: 16 · 18 · 20 · 22, `xl` stays), the Slider thumb a hand's
size (`thumb`: 20 · 24 · 28 · 32 · 36 over the desktop 12 · 15 · 18 · 21 · 24) while its track stays. The glyphs step with the text: the control icon (`control.<tier>.icon`) 16 · 18 · 18 · 22 · 22 over 14 · 16 · 16 · 20 · 20, the Badge icon `s` 14, `m` 16, `xl` 18 (`xs` and `l` stay). One
source, `tokens/touch.ts`, emitted by `tokens:build`; rem, so the person's browser text size still applies.

Numbers in tables, dates, counters, prices: `font-variant-numeric: tabular-nums`. Reading text max width:
`--prime-layout-reading-max-width` (≈ 65ch). Weights only 400/500/600.

## 6. Size tiers

| Tier | Height | Text | Button padX | Field padX | Gap | Icon | Radius | Label | Hint | Menu item | Checkbox | Track |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| xs | 28 | 12/16 | 8 | 8 | 4 | 14 | 6 | 12/16 | 12/16 | 24 | 14 | 4 |
| s | 32 | 13/20 | 12 | 8 | 8 | 16 | 8 | 12/16 | 12/16 | 28 | 16 | 5 |
| **m** | **36** | **14/20** | **16** | **12** | **8** | **16** | **8** | **13/20** | **12/16** | **32** | **18** | **6** |
| l | 40 | 16/24 | 20 | 12 | 8 | 20 | 10 | 14/20 | 13/20 | 36 | 20 | 7 |
| xl | 48 | 16/24 | 24 | 16 | 12 | 20 | 12 | 14/20 | 13/20 | 40 | 24 | 8 |

On a coarse pointer the Text / Label / Hint columns take the touch step of §5; Height does not change. Control text is one size per tier on every family — buttons, fields, menu and list rows, tabs, segments — with no floor of its own for editable text: `m` 16/24, `l` and `xl` 17/24, `s` 14, `xs` 12. `m` (the default) and up are 16px or more, so iOS does not zoom into a focused field; `xs` and `s` are dense tiers whose fields iOS zooms — use `m` for a form on a phone.

Variables: `--prime-control-<tier>-{height,padding-x,field-padding-x,gap,icon,radius,text-size,line-height,label-size,label-line-height,hint-size,hint-line-height,label-gap,hint-gap,item-height,choice,track}`.

Pairing rules:
- A field of tier T uses label/hint values of tier T. Hint/error is always smaller than the field text.
- A menu/listbox opened from a trigger of tier T uses `item-height` of tier T and the same text size.
- Badges/Kbd inside a control of tier T use the badge tier one step down (`m` control → `s` badge).
- An icon-only button is square: width = height.
- Fields (Input, Textarea, Select, TagSelect, Datepicker trigger, ColorPicker fields): an icon (leading or trailing,
  incl. chevrons and clear buttons) sits centered between the edge and the text — edge→icon = icon→text = the tier's
  `field-padding-x` (xs/s 8 · m/l 12 · xl 16). No optical shrink in fields.
- Tables: the row height of a tier is a minimum, never a fixed height. Cells pad vertically by
  (row height − control one tier down) / 2, so one text line or a one-tier-down control keeps the tier
  height and taller content (avatar + two lines) grows the row with equal padding. Content columns are
  separated by hairlines by default. A sortable column has one quiet sort icon (`text-disabled`,
  sorted `text-secondary`, never accent) at the end edge of its head cell, whatever the column's
  alignment.
- Buttons: icon + label are one centered group; the icon side gets optical compensation (padding = padX − 4px, never below 8px) and
  the icon→label gap is the tier `gap`. Icon-only buttons are square.

Badge tiers (`--prime-badge-<tier>-{height,padding-x,text-size,icon,gap,radius}`): 16 · 20 · 24 · 28 · 32.
Switch (`--prime-switch-<tier>-{width,height,thumb}`), Avatar (`--prime-avatar-<tier>`).

## 7. Geometry, elevation, layers

Radius: `--prime-radius-{xs 4, s 6, m 8, l 12, xl 16, full}`. Controls use their tier radius;
cards `--prime-card-radius` (12); floating panels `--prime-panel-radius` (12) with
`--prime-panel-padding` (4) and `--prime-panel-item-radius` (8); modal `--prime-modal-radius` (16).

Elevation: `--prime-shadow-raised` (a card on the page, barely there; `--prime-layer-shadow`) · `--prime-shadow-overlay` (menus, popovers,
tooltips, datepicker) · `--prime-shadow-modal` (modal, drawer, sheet).
Z-index: `--prime-z-*` only, never a number. Two groups:
- Page level: a sticky surface (Page.TopBar, a DataTable head, the Gantt head) on `--prime-z-sticky`;
  every overlay shares `--prime-z-overlay` and portals to `<body>` when it opens, so the open order is
  the stacking order; toasts sit above on `--prime-z-toast`.
- Local steps, for stacking parts inside one component that makes its own stacking context:
  `--prime-z-below` · `--prime-z-base` · `--prime-z-raised` · `--prime-z-above` · `--prime-z-top`
  (a folder tab over its strip, a thumb over its track, a badge over an avatar, controls over media).
  They never compete with the page-level group.

The focus ring switch — one parameter for the whole kit: every ring is drawn
`var(--prime-focus-ring-width)` wide, and the base CSS keeps that width at zero, so by default no
ring shows. An app shows the rings by setting `data-focus-ring="visible"` on `<html>` (or on any
wrapper, for one part of a page). It is a width, not a colour: nested `data-theme` wrappers and a
host that recolours its ring keep working. Focus itself, `:focus-visible`, the tab order and roving
focus never change. The switch covers controls that take no typing: a field a person types into
(its input or textarea has focus) takes the surface's own colour as its focus fill, so its ring is
its edge and always shows; the danger ring of an invalid field always shows too. `data-focus-quiet` (focus given back to a
control a pointer used) sets the width to zero until the next key. No component takes a ring prop of
its own. The docs site turns the rings on.

Focus ring must never be clipped (hard rule):
- Fields (Input, Textarea, Select/TagSelect/Datepicker triggers, DigitInput cells, ColorPicker channels, search fields in panels)
  draw the ring INSIDE their edge: `outline: var(--prime-focus-ring-width) solid var(--prime-color-focus-ring); outline-offset: var(--prime-focus-offset-inset);`.
- Switcher items draw the ring inside too, because their track or strip clips: a Tabs tab draws it
  inset in the folder's own shape (an inset `box-shadow` on the tab's shape layer), a SegmentedControl
  item uses `--prime-focus-offset-inset`. The tab panel keeps the outer ring.
- Everything else (buttons, links, chips, checkboxes, menu items use background instead) uses the outer ring with `--prime-focus-offset`.
- Every element with `overflow: auto | hidden | scroll | clip` that holds focusable content does exactly one of:
  (a) padded content — keeps at least `--prime-focus-space` between its edge and the content (Modal/Drawer/Sheet body, panels, tab lists);
  (b) full-bleed content — content touches the edges and is clipped by the container's radius; every focusable inside
  uses the inset ring (tables: head cells, sort buttons, rows; full-width list rows).
  Never mix them: a rounded container never shows a gap before square full-bleed content (e.g. a table head).
  ScrollContainer has no padding of its own; the host chooses (a) or (b).
  Side padding of a scrolling body belongs to the scrolling element itself, never to an outer wrapper.
- Exception: a search input that is the permanent focus of its layer (CommandMenu search, search row inside
  Select/TagSelect/Dropdown panels) draws no ring — the caret is the indicator; the row is separated from results
  by a `border-faint` hairline. Everything else inside the layer (items, buttons) keeps the normal rules.
  The Composer field (the caret again) and the DigitInput cells (the row's one gliding ring stands in) set
  `--prime-focus-ring-width` to zero on their own box.
- `src/styles/focus-guard.test.ts` enforces this on the CSS.

Base declaration: `outline: var(--prime-focus-ring-width) solid var(--prime-color-focus-ring); outline-offset: var(--prime-focus-offset);`
on `:focus-visible`. Fields draw it on the wrapper with `:focus-within` / `:has(:focus-visible)`.
Error fields use `--prime-color-danger-border` as ring color.

### Motion and micro-animation

Motion tokens:

| Token | Value | Use |
|---|---|---|
| `--prime-motion-duration-xfast` | 150 ms | hover fill on dense rows, cells, options |
| `--prime-motion-duration-fast` | 230 ms | press, hover, small panels, exits |
| `--prime-motion-duration-base` | 380 ms | dialogs, toggles, content swaps |
| `--prime-motion-duration-slow` | 570 ms | drawers, sheets |
| `--prime-motion-easing-enter` | strong ease-out | appearing, responding |
| `--prime-motion-easing-exit` | strong ease-out | leaving (shorter duration than enter) |
| `--prime-motion-easing-standard` | ease-in-out | moving on screen, color/fill |
| `--prime-motion-easing-emphasized` | decisive start, long soft landing, no overshoot | state gliding into place: thumbs, indicators, checkmarks; with `base` |
| `--prime-motion-stagger` | 80 ms | step of a staggered first render |
| `--prime-motion-press-distance` / `-compact` | 2px / 1px | how far a pressable's edges give in on any size (compact for icon-only and small targets) |
| `--prime-motion-press-scale` / `-compact` | 0.98 / 0.96 | fallback for a press that wasn't measured |
| `--prime-motion-loop` | 570 ms | period unit of a loading loop (Spinner: one turn in 3 units, 6 under reduced motion) |
| `--prime-motion-blur` | 2px | hides a change of shape while two states swap in place (icon → check, letters) |
| `--prime-motion-fade-xfast` | 150 ms | opacity and color feedback on dense rows, cells, options |
| `--prime-motion-fade-fast` | 230 ms | opacity and color feedback of press, hover, small panels, exits |
| `--prime-motion-fade-base` | 380 ms | opacity and color feedback of dialogs, toggles, content swaps |
| `--prime-motion-fade-slow` | 570 ms | opacity and color feedback of drawers, sheets |
| `--prime-motion-hold-confirm` | 1200 ms | length of a hold-to-confirm press (Button `holdToConfirm`); a gesture time, not motion |
| `--prime-motion-swap-hold` | 120 ms | how long a region swap waits before it moves: a state that turns back within it is never shown; a settle window, not motion |
| `--prime-motion-instant` | 0 ms | a stopped clock: the value of the zeroed clocks |
| `--prime-motion-never` | 600000 s | a clock that never runs out in a session: the browser's autofill paint of a field is pushed out of reach; never zeroed |
| `--prime-motion-scale-mark` | 0.6 | start of a glyph or a dot drawn in place (a check, a swapped icon, a radio dot) |
| `--prime-motion-scale-pop` | 0.8 | start of a small part that pops in (a reaction, a button that appears in a row) |
| `--prime-motion-scale-settle` | 0.9 | start of a tile part or a disk that settles into place |
| `--prime-motion-scale-enter` | 0.96 | start of a block entering in place (a bar, a bubble; rule 7) |
| `--prime-motion-scale-lift` | 1.02 | a picked-up item (a drag source) |
| `--prime-motion-scale-hover` | 1.1 | a small target under a fine pointer (a swatch, a slider thumb) |
| `--prime-motion-scale-emphasis` | 1.2 | a glyph a pointer or focus singles out (a reaction) |
| `--prime-motion-scale-grab` | 1.25 | a thumb held by the pointer |
| `--prime-motion-scale-burst` | 1.4 | the peak of a one-shot pick (a reaction chosen) |
| `--prime-motion-scale-pulse` | 2 | a ring that spreads out of a live mark and fades |

Under `prefers-reduced-motion` `globals.css` sets the movement clocks — `xfast`, `fast`, `base`,
`slow`, `stagger` and the message-morph duration — to `--prime-motion-instant` and both press distances
to 0; JS animations must also check it. Two kinds of motion are information and keep a clock that
reduced motion does not zero: opacity and color feedback (a fade, a fill or color change of state)
reads the `--prime-motion-fade-*` group, so a state still eases in instead of flipping; a loading
loop reads `--prime-motion-loop` and only slows down. A gesture time (`--prime-motion-hold-confirm`)
is not motion and keeps its length.
Every component is designed with its micro-animations, not only its static states. Rules (after Emil Kowalski):

1. **Ask first: should it move at all?** By frequency: keyboard-driven or 100+/day actions (option highlight
   while arrowing, row hover, menu navigation, command palette) get no movement — color/fill change only,
   at most `xfast`. Tens/day (hover, tabs, toggles): small and quick. Occasional (modals, drawers, toasts):
   standard overlay motion. Rare (empty states, success, onboarding): may carry delight.
2. **Every motion has a purpose:** feedback (press), state change (check, toggle, selection moving),
   spatial continuity (a panel grows out of its trigger, an indicator slides between tabs), or preventing a
   jarring jump (items appearing/disappearing, height changes). "Looks cool" on a frequent element is not one.
3. **Tokens only.** Durations and easings come from `--prime-motion-*`; never a raw `ms` or `cubic-bezier`
   in a component (so reduced motion, theme switching and retuning stay global). Nothing above `slow`.
4. **Easing.** Entering / appearing / responding → `enter`; exiting → `exit`; things moving or morphing on
   screen and color/fill changes → `standard`; a selection or thumb gliding into place → `emphasized` + `base`. Nothing overshoots its
   target: no bounce, no springs past the end value.
   Never `ease-in` for UI. Exit is never slower than enter.
5. **Animate `transform` and `opacity`** (plus color/fill/shadow for state). Not `width`, `height`, `margin`,
   `padding`, `top/left`; never `transition: all` — list the properties. Where size must animate, prefer
   `transform` / `scale` (progress fills). The exceptions are a closed list, each with one engine,
   and `src/styles/motion-perf.test.ts` allows nothing else:
   - **height glide** — the Notification stack glides from the height on screen to the new one,
     never through a smaller or an old height; an interrupted glide turns to the new target from
     where it is. A region swap never glides (rule 8);
   - **cell width** — a cell of a row whose control is replaced by another glides its width from
     the old control's to the new one's (`RegionSwap axis="inline"`, `src/internal/rowCells`);
   - **row fold** — a part that folds open or closed animates `grid-template-rows` 0fr ↔ 1fr
     (`Disclosure`: Accordion, DataTable expanded rows);
   - **text width** — a label that morphs into another text glides its `width` (`MorphText`).
6. **Press.** Every pressable control gives in by the same distance whatever its size: `:active` →
   `scale(var(--press-scale))`, where `src/internal/press` measures the pressed box and sets
   `1 − 2 · --prime-motion-press-distance / its longer side` (`-compact` for icon-only and small
   targets), over `fast`, `transform` only. Release returns by the same transition. Disabled and loading never scale.
7. **Never from nothing.** Entrances start from `opacity: 0` + a small offset (`--prime-space-1/2`) or
   `scale(0.96–0.98)`, never `scale(0)`. Popovers/menus grow from the trigger (`transform-origin` follows
   `data-side`; Tooltip from its arrow tip); modals stay centered. Layers anchored to a screen edge
   (Drawer, Sheet, a Modal as a phone sheet, Notification stack) travel from that edge and leave toward it.
8. **State moves, it does not swap.** Checkmark draws/scales in, switch thumb slides, selection indicator
   (tabs, segmented control) glides to the new item, chevrons rotate, progress fills, counters and fills
   ease. Two states cross-fade rather than flip when they replace each other in place: a region
   swapping its content uses `Crossfade` (inside a component: `RegionSwap`). Its loading state is
   the state `"loading"`: a `Skeleton` of the coming content, drawn from the first paint, which the
   data replaces in place on a `fast` fade; a swap between settled states fades on `base`
   (principle 7). A region swap is opacity only: the region takes the new state's height in one
   frame, the new state fades in in flow and is never clipped (a row's wash bleeding into the
   host's padding, a focus ring stand from the first frame), the old one lies over it from the top
   edge and fades out, cut a little past the region's edges so a taller old state never paints over
   what follows. Nothing moves on the first render of a region. A region swap waits out `--prime-motion-swap-hold` before anything
   moves (the data arriving out of loading does not wait): a state that turns back within it (a
   quiet refetch, a record gone for a moment) is the old one again without a frame of motion; while it waits the old state stays in flow. A
   swap that turns back to a state still fading out reverses in place: both fades continue from
   where they are. A change inside one state (a row
   added, removed or edited) is no region swap: only that row moves (`useListPresence`,
   `Disclosure`).
9. **Interruptible.** Toggled state uses CSS transitions (retarget mid-flight), not keyframes. Keyframes only
   for one-shot enter/exit (overlay presence, spinner, skeleton) and one-shot gestures (icons, rule 13;
   a field's error shake, rule 14).
10. **Hover is for pointers.** Every `:hover` rule, a color or fill change included, sits inside
    `@media (hover: hover)`; a hover transform or lift also needs `(pointer: fine)`:
    `@media (hover: hover) and (pointer: fine)`. `src/styles/touch.test.ts` enforces both. No hover
    movement on dense rows and cells, except the icon gesture (rule 13).
11. **Lists.** Items entering/leaving fade + shift; stagger only for first-render of short groups
    (`--prime-motion-stagger` steps, ≤ 6 items) and never blocks interaction.
12. **Reduced motion** is already global through the tokens. Anything not tokenized (JS, `animation-delay`) must
    be gated by `prefers-reduced-motion`. Movement goes; opacity and color feedback stays, on the
    feedback durations that reduced motion does not zero (see the token notes above).
13. **Icon gestures.** Every kit glyph carries one small gesture about its meaning (an arrow steps its way,
    a gear turns, a bell swings, a check draws) from one vocabulary (`src/icons/glyphMotion.module.css`). It
    plays once, to completion, when a pointer enters the icon's host (button, link, tab, label) or a finger
    presses it — menu items, options and table rows are hosts too, and an icon belongs to the nearest
    host; never on keyboard focus (arrowing through a list stays calm), never under reduced motion. One
    amplitude for all glyphs, large enough to read at 16 px. Gestures start and end at rest, move parts
    of the glyph and never the svg, so a host turning or flipping the icon composes with them; `animated={false}` keeps an icon still.
14. **Errors shake.** A field that turns invalid, or whose error message changes, shakes its control once,
    sharply left and right and decaying to rest (`--prime-space-2` → `--prime-space-1`, `base`), built into
    the shared field frame (`src/internal/FieldFrame`): every field, the Radio group and a Checkbox / Switch
    row. Only the control moves — the label stays, the message drops in on its own. Never for an error the
    field mounts with; reduced motion keeps it still and the red ring and message still say it.
15. **Motion is owned by what knows the change.** A part moves only because its owner's state
    says what changed, through one of four mechanisms: presence of a part (it appears or goes),
    a content swap in one stable place (cross-fade, the size gliding from the place's alignment
    edge), a region swap (rule 8) and a layer's open / close (only its panel and scrim). A
    container that holds the consumer's children never invents motion for them from their element
    type — each child keeps its place, a new control in it is a content swap, a child that
    comes and goes is presence. Nothing inside a layer replays its opening, and a copy of a node
    (a drag copy, an exit copy) never carries motion of its own.

Component checklist for motion: press · hover/focus fill · selection/toggle · open/close · enter/exit of
parts (items, messages, badges, icons) · loading/progress · reduced motion. Skip what the rules above say
should stay still, and say so in a CSS comment only when the omission is non-obvious.

## 8. Components: states recipe

| State | Recipe |
|---|---|
| hover | filled: `-hover` token (`fill-muted-hover`, `field-bg-hover`: one more ladder step away from the host); ghost, stroke and rows inside a padded container: `--prime-color-fill-subtle`; a surface or a row that reaches its surface's edge: see "Hover on a surface" below |
| active | filled: same as hover + the press (`scale(var(--press-scale))`, see Motion); ghost: `fill-subtle-active` (+ the same press scale on pressable controls, see Motion) |
| focus-visible | the focus ring (§7) |
| selected | `accent-soft` bg + `accent-text`, or check icon in `accent-text` |
| disabled | `fill-muted`/`field-bg-disabled` bg, `text-disabled` color, no shadow, `cursor: not-allowed` |
| loading (control) | spinner replaces leading icon, label stays, width does not change, `aria-busy` |
| loading (region) | `Skeleton` in the data's geometry from the first paint, as the `"loading"` state of `Crossfade` (the data replaces it in place, no height glide), `aria-busy` on the region; data already shown stays during a refresh |
| error | `danger-border` inset ring + `danger-text` message; layout does not shift (support row reserves height when the component asks for it) |
| empty | centered muted text in `body-s`, optional action; reached through `Crossfade` like every region state |

### Hover on a surface (hard rule)

`fill-subtle` (a 4% ink wash) is one ladder step of lightness (ΔL ≈ 3). Laid over an opaque surface, a
one-step change lands exactly on a neighbour's color — the host around the surface, the column a card
lies in, a zebra row — and the hovered thing merges with it. So:

- **A whole surface** (a card, a Kanban card, a clickable tile) does not change its fill on hover. It
  lifts: `--prime-shadow-raised` → `--prime-shadow-overlay`.
- **A part that reaches its surface's edge** (an Accordion trigger, a full-bleed list row) takes two
  steps off its own layer: `--prime-color-fill-muted-hover`. Two steps never land on a neighbour.
- **Rows that sit next to stepped rows** (a table with zebra rows or a stepped head) take
  `fill-subtle-active`: stronger than one step, so a hovered row never looks like a zebra row.
- `fill-subtle` stays for elements whose rest is transparent and that are padded away from their
  surface's edges: ghost buttons, menu items, Sidebar rows, list rows inside a padded panel.
- Never hard-code a layer color on something that can lie on different hosts (`layer-floating-bg` on
  a card in a column): take the context (`fill-muted` for a well, `control-selected` for the card on
  it, `layer-nested` for a tile), so it is always a step off whatever it lies on.

Check every hover on both themes and on both preview layers (page and card): rest, hover and the
neighbour must be three different colors.

### Overlay contract

Every layer on the layer stack — Modal, ConfirmDialog, Drawer, Sheet, CommandMenu, MediaViewer, Popover,
Dropdown, the Select, TagSelect, Datepicker and ColorPresets panels, the Sidebar off-canvas and the
reaction picker of `Message.Reactions` — behaves the same way, so "click empty space closes what is
open" holds across the kit. Tooltip and Notification are the two layers outside this contract (below).

- **Dismiss.** A layer closes on (a) a pointerdown outside the layer and its trigger — for Modal / Drawer /
  Sheet / CommandMenu / MediaViewer / the Sidebar off-canvas that is the scrim — and (b) Escape. Every
  layer of the set takes `closeOnOutsideClick` and `closeOnEscape` (both default `true`, §10); the
  stack hooks (`useFloatingLayer`, `useModalLayer`) take both as required options, so no layer can
  skip them. ConfirmDialog takes both with `closeOnOutsideClick` default `false`. With outside click
  off, the layer still blocks the layers below it. A form inside a Modal / Drawer / Sheet holds
  closing with `X.Guard` (`busy` while it saves, `dirty` to ask before unsaved changes are lost).
- **Exempt.** Tooltip closes on pointer-leave / blur / Escape and takes neither prop (Escape cannot be
  turned off, WCAG 1.4.13). Notification is a non-modal live region outside the stack and takes
  neither.
- **Topmost only.** Open layers form one stack (`src/internal/overlay/layerStack.ts`).
  Only the topmost layer reacts: one click or one Escape closes one layer. A click inside a nested child layer
  (a Select open inside a Modal, a manage Popover inside a TagSelect panel) never closes the parent, even though
  the child is portaled outside the parent's DOM.
- **Focus depends on how the layer was dismissed.**
  - **Escape** (and Tab / picking an option where the component closes on it) returns focus to the trigger
    (`useFloatingLayer`, `useModalLayer`).
  - **A press outside a floating layer** (Popover, Dropdown, Select, TagSelect, Datepicker, ColorPicker /
    ColorPresets) does **not** restore focus: focus follows the pointer. A press on another control focuses that
    control; a press on empty space leaves nothing focused, so a focused field blurs (TagSelect collapses) in the
    same click — one click leaves the field. The stack passes the reason (`outside`) to the layer, which
    skips its restore.
  - **A scrim click of Modal / Drawer / Sheet / CommandMenu** returns focus to the opener: the page behind was inert, the
    click landed on the scrim, not on a control, so the opener is the only sensible place to continue from (the
    keyboard user's position is kept).
- **Placement.** Every anchored panel (Popover, Dropdown, Select, TagSelect, Datepicker, ColorPresets) opens
  below its trigger, lined up with the trigger edge that has more room beyond it (`side="bottom"`,
  `align="auto"` — `DEFAULT_SIDE` / `DEFAULT_ALIGN` in `usePosition`): a trigger near the end of the
  screen lines up its end edge and the panel grows toward the start. It flips to the top only when it
  does not fit. Explicit `align` is for a panel that must line up with one edge of a block.
  Tooltip centres on its trigger.
  The first frame already shows the final place: size limits (`--float-min-w` and the rest) are
  written before the panel is measured, the panel is measured again until its size settles, a late
  size change is placed in the ResizeObserver callback (before paint, never a frame later), and an
  anchored panel stays invisible until it has its first place (`data-float-pending`).
- **Sheets.** Every bottom sheet (Sheet, a Modal or ConfirmDialog on a phone, a floating layer as a
  sheet) stands on one frame: `--prime-sheet-padding` on the sides and below, 16 between blocks, its
  height by content up to the top gap, the last zone's 24 plus the bottom safe-area inset under it.
  Its grab strip is a touch target (44) tall with a small bar; above a header it is the bar's own 20
  and the header is the rest of the grab area; above any other zone it is that zone's top air. A drag
  starts on the strip or the header.
- **Gestures.** Only a sheet swipes: Sheet, and a Modal or a floating layer shown as a bottom sheet below
  640, close with a swipe down from the grab handle or the header (`useSwipeDismiss`), as an extra way out
  next to Escape and the scrim, following `closeOnOutsideClick`. A Drawer has no touch gestures: it closes
  by its buttons, Escape and the scrim.
- **Presence.** `usePresence(open)` keeps the layer mounted with `data-state="closed"` until its exit animation
  ends (`animationend`, fallback timeout = token duration), and unmounts at once under `prefers-reduced-motion`.
  A closing layer takes no pointer events.
- **Motion** (`src/internal/overlayMotion.module.css`, tokens only, both directions from `data-state`):

| Layer | Enter | Exit |
|---|---|---|
| scrim | fade · base · enter | fade · base · exit |
| Modal, CommandMenu | fade + scale 0.98 → 1 · base · enter | fast · exit |
| Sheet; Modal and floating layers as a bottom sheet (< 640px) | slide up · slow · enter | slide down · base · exit |
| Drawer | slide from its side · slow · enter | base · exit |
| Popover, Dropdown, Select, TagSelect, Datepicker, Tooltip | fade + 4px (`--prime-space-1`) + scale 0.98 from the anchor edge along the resolved `data-side` · fast · enter | fast · exit |

Components carry no motion code of their own for these layers.

## 9. Layout and responsiveness

- Flexbox for one-dimensional rows/stacks, Grid for two-dimensional layouts. Spacing between siblings
  via `gap`, never margins on children.
- Text that can overflow: `min-width: 0` on flex children + `text-overflow: ellipsis` (single line) or
  `overflow-wrap: anywhere` (multi-line). Truncated text gets a `title` or Tooltip when it matters.
- Every screen works from 320 to 2560px and at 400% zoom without losing a function: narrow first,
  break by content, rearrange instead of hiding, fluid by default.
- Components adapt with container queries (`container-type: inline-size`) where their own width
  matters (Card, DataTable toolbar, Modal footer, Datepicker months, Tabs, Stepper,
  ChatList, FieldList, the field frame). Container thresholds are written in `rem`
  (`@container (max-width: 30rem)`) — the one place a raw length is allowed (§2).
- Viewport width queries (`@media (max-width | min-width)`) are allowed for exactly four things:
  - the app shell (AppShell);
  - the overlay form below 640: Modal and its dialog parts, Drawer, Popover actions, Datepicker
    months, the Notification zone, `overlayMotion`;
  - menu rows at the touch height (`src/internal/menu.module.css`).
  Input queries (`hover`, `pointer`) and preference queries (`prefers-*`) are not width queries and
  go wherever input decides interaction. The one height query is the sticky stop below.
- Breakpoints (for media queries; CSS vars cannot be used there): 640 · 768 · 1024 · 1280; "below a
  breakpoint" is `max-width: <bp − 1>px`.
- Input decides interaction, not width: `:hover` styles only inside `@media (hover: hover)`; whatever
  hover reveals is also shown on focus and under `(hover: none)`. Under `(pointer: coarse)` small
  controls get a 44px hit area (`--prime-control-touch-target`, `src/internal/touchTarget`) and menu
  rows are at least 44px; the type takes its touch step (§5).
- Switchers — Tabs, SegmentedControl, a horizontal ButtonGroup and BottomNav — all scroll through
  one shared scroller. They never wrap: they scroll inside themselves,
  stretched items tend to equal width and never shrink below their label, the selection indicator
  moves only after a person's choice. Host duty: a switcher's host gives it a bounded width — a flex
  or grid child that holds a switcher sets `min-width: 0` (each tool of Page.Tools does), otherwise
  the switcher grows the row instead of scrolling.
- Scroll overflow is always visible: a cut-off item, an edge fade or an edge shadow (`useEdgeOverflow`).
- Sticky headers (Page.TopBar, the DataTable head, the Gantt head) stop sticking on screens lower than
  480px: `@media (max-height: 479px)`, the one height query, lives in `src/internal/sticky`. Overlays
  respect safe-area insets.
- The page's top bar (`Page.TopBar`) holds four groups — Page.Heading (the path ending in the
  title), Page.Tools, Page.Actions (every button of the page), Page.Chips — and lays them out by one
  plan chosen from their natural widths (`src/internal/barPlan`), in five steps: one line while
  everything fits; then the tools on a line of their own that they fill (a search grows first) while
  the actions stay beside the heading; then Buttons with an icon show only it, the secondary first,
  then the primary; then the secondary Buttons fold into «⋯» and the primary stays; only then does the
  heading truncate, the path before the title. Nothing overflows; the chips are a line of their own
  under everything. The heading keeps its natural width — the title has no size prop.
- Field affixes (units like `%`, `°`, `₽`, prefixes like `https://`) are flex items in the field row next to the value,
  separated by the tier `gap`; never absolutely positioned, never sized with a fixed width. A numeric value with a unit
  is one group: value (tabular-nums) + unit, aligned the same way in every field of a row. Field widths come from the
  layout (grid columns / flex), not from per-field fixed widths, so nothing clips at any size tier.
- Dialog footer (`X.Footer` of Modal, Drawer, Sheet) has two layouts:
  - `fill` — equal-width actions across the footer, gap `--prime-space-3`; the default for Modal
    `xs`–`m`;
  - `end` — actions at the end edge, gap `--prime-space-2`; the default for Modal `l`–`xl`, Drawer
    and Sheet.
  On phones (below 640) and in a dialog narrower than 360px (a container query) both stack full
  width with gap `--prime-space-2`, primary last.
- Overlays near the viewport edge flip/shift, keep `--prime-space-2` from the edge.
- An app's frame owns the viewport: the top-level `AppShell.Root` (`fillViewport`, on by default) is
  fixed to the layout viewport (`position: fixed; inset: 0`), the document under it is still
  (`<html data-prime-frame>`: `overflow: hidden`, `overscroll-behavior: none`; a touch guard where
  iOS ignores them), and `AppShell.Main` is the page's one scroller, holding its own overscroll. No
  pull-to-refresh, no rubber band and no document shift in an app. Nested scrollers hand their
  scroll to Main, never to the document. Edge parts (BottomNav, Fab, the top bar) take their place
  from the frame's edges plus `--prime-safe-area-*`, the same on every page. Main reserves the
  floating capsule's room after its last line. The on-screen keyboard overlays the frame (the tab
  bar stays behind it).
- The on-screen keyboard: a panel fixed to the viewport (a sheet, a drawer, a centred dialog) stands
  on what the keyboard leaves — the visual viewport (`useKeyboardInset`: `--visual-inset-top` /
  `-bottom`, `data-keyboard`). With the keyboard up the bottom safe-area inset gives way, and the
  panel's own scroller brings the focused field into view.
- Compact rhythm: a compact container (under 30rem of its own width, a phone page) breathes at one
  number, 16: the page gutter, header → body, block → block, tile → tile and the padding of a surface
  frame (12 · 16 · 16 · 20 · 24); a titled section stands 32 off. `Page.Root` is the size container; a
  surface reads the nearest container around it, never itself.

## 10. API contract (v1)

No backward compatibility, no aliases, no `@deprecated` props, no legacy types. One name per concept.

| Concept | API | Notes |
|---|---|---|
| Size | `size?: "xs" \| "s" \| "m" \| "l" \| "xl"`, default `"m"` | Type `ControlSize` from `src/internal/states.ts`. `size` lives on the root; the one exception is an overlay's `Content`, which takes `size` for its width: Popover, Dropdown, Tooltip, CommandMenu and Modal take the full `ControlSize`, Drawer drops `"xs"`. The width is the Content's own — Dropdown Content does not inherit the trigger's size. Avatar adds `"2xl"`. |
| Treatment | `variant` | Shared vocabulary: `solid` · `soft` · `outline` · `ghost`. Button also takes `shade` — the media shade with a blur, for a button over media (a picture, a video, a video circle). Component-specific structural variants (FileUpload `dashed \| solid`, Kanban `plain \| line \| well`, Sparkline `area \| line \| dashed \| dotted \| bars`, ProgressBar / ProgressCircle `line \| steps \| ticks`, Thumbnail `soft \| solid`, CodeBlock `soft \| ghost`) are allowed and documented. Tabs has no variant: navigation tabs are always a folder, in both orientations; choosing a value is SegmentedControl. Card has no variant either: its zones lay it out (a header, a body, a list, a cover, a footer); a card about one figure is a Kpi. |
| Semantic color | `tone?: "neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | Components use the subset that makes sense (Button: `accent \| neutral \| success \| danger`, default `accent`). Destructive = `danger`, never `error`. Button also takes `inherit` (with `ghost \| soft \| outline`) for an action on a colored host: color, fills and focus ring derive from the host's `currentColor`; a host never recolors a Button with a CSS override. LinkButton takes `accent \| neutral \| muted` — `muted` is the quiet link of a trail (muted text, primary on hover, no underline) — and the `inline` flag for a link inside running text. Badge takes a status `tone`: `neutral \| success \| warning \| danger \| info`. |
| Decorative color | `color?: "gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | Badge, Avatar, Thumbnail, Icon (a category hue from data), and the parts that host a palette hue: `SegmentedControl.Item` (dot + tinted thumb), count badges (`Tabs.Count`, `SegmentedControl.Count`, `Sidebar.ItemCount`, `BottomNav.ItemCount`), `FileUpload.FormatBadge`, `Timeline.Item` (dot), `Message.Author` / `Message.Reply` (the author's hue, `hueOf(id)`), a contact's avatar in a message, Gantt bars, Kanban columns, ChartFrame series, TagSelect options (tag hue), ProgressBar / ProgressCircle segments (a category share in its chart color, `--hue-chart`), ProgressCircle value mode (the arc and, with `track="tinted"`, its track). Where a component takes both `tone` and `color` (Badge, ProgressBar / ProgressCircle segments), they are mutually exclusive: a status or a category, never both. |
| Validation | `invalid?: boolean`; fields with a support row also take `hint?: ReactNode` and `error?: ReactNode` | A non-empty `error` implies `invalid`. Sets `aria-invalid`, `data-invalid`. |
| Value | `value` / `defaultValue` / `onValueChange(value)` | Select, NativeSelect, TagSelect, Tabs, SegmentedControl, Slider, Datepicker, Accordion, Stepper, `Radio.Group`, DigitInput, Pagination, ColorPicker, ColorPresets, ColorField, ColorSwatches, FileUpload, FieldList, Kanban, SmartFilter, Composer, ChatList, `Chat.Pinned`. Native text inputs (Input, Textarea) keep native `value`/`onChange` and add `onValueChange(string)`. |
| Checked | `checked` / `defaultChecked` / `onCheckedChange(checked)` | Checkbox, Switch, a selectable Thumbnail, Dropdown checkbox items. |
| Pressed | `pressed` / `defaultPressed` / `onPressedChange(pressed)` | A toggle button: Button.Root and Badge.Root. Sets `aria-pressed` and `data-pressed`; the on state takes the selected look. A pressable badge has no separate press callback. |
| Other state | `x` / `defaultX` / `onXChange(x)` | The same triad for every other stateful aspect: DataTable `sort`, `page`, `selected`, `expanded`, `hiddenColumns`, `collapsedGroups`; `search` of Select, CommandMenu, SmartFilter, Chat, ChatList; Chat `selected`; MediaViewer and Gallery `index`; ChartFrame `hiddenSeries`; Gantt `scale`; Kanban `columnOrder`; Sidebar `mode`; VoicePlayer `rate`; ExampleFrame `colorScheme` and `viewport`; Composer `recordMode`. The new value is always the first argument. |
| Open | `open` / `defaultOpen` / `onOpenChange(open)` | Every overlay and disclosure. |
| Dismiss | `closeOnOutsideClick?: boolean` (default `true`), `closeOnEscape?: boolean` (default `true`) | One name on every layer-stack overlay: Modal, ConfirmDialog, Drawer, Sheet, CommandMenu, MediaViewer, Popover, Dropdown, Select, TagSelect, Datepicker, ColorPresets, the Sidebar off-canvas, `Message.Reactions`. ConfirmDialog takes both with `closeOnOutsideClick` default `false`; a form holds closing with `X.Guard`. Tooltip and Notification take neither. No `closeOnOverlayClick`. See §8 Overlay contract. |
| Flags | `disabled`, `readOnly`, `required`, `loading`, `fullWidth` | Same names everywhere. |
| Focus ring | no prop: the app's `data-focus-ring="visible"` | Rings are hidden by default and shown for the whole app (or a wrapper) by the one switch; no component takes a ring prop; see §7. |
| Built-in strings | `labels?: Partial<XLabels>` | Every system string (aria labels, default texts, counters) lives in one `labels` object with Russian defaults. Visible content goes through children/slots, not labels. |
| Structure | Compound `X.Root` + `X.Part` when a component has parts; a single export for leaf components without parts. | |
| DOM state | `data-size`, `data-variant`, `data-tone`, `data-color`, `data-invalid`, `data-disabled`, `data-loading`, `data-state` (`open \| closed \| checked \| unchecked \| indeterminate \| active \| inactive`) | CSS styles only from these and ARIA. |

Forms: `label`, `hint`, `error`, `required`, `optional` work the same in every field, in `Radio.Group`
and in a Checkbox / Switch row (the shared `src/internal/ChoiceField`).
Required = red `*` after the label text (`aria-hidden`) + native `required`. Optional = muted
«необязательно» right after the label text (from `labels.optional`). Placeholder never replaces the label.
