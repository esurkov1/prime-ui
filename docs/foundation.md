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
2. **Everything is on the 4px grid.** Spacing, heights, paddings, gaps. The only non-grid values are
   1px hairlines, 2px focus ring, and a few typographic sizes (13px).
3. **Proximity.** Inside a group elements sit closer than between groups:
   label → field 4–8 · field → hint 4 · field → field 20 · group → group 32 · section → section 40–48.
4. **One size axis.** `xs · s · m · l · xl`. Default is always `m`. Controls of the same size line up
   perfectly in a row (Button, Input, Select, Datepicker trigger, SegmentedControl, Tabs).
5. **Nested radius = outer radius − padding.** Panel 12 with padding 4 → items 8.
6. **Air is hierarchy.** Important content gets more space; secondary content is grouped tighter.
7. **State changes are continuous.** Nothing on screen flips from one state to another. Controls move
   into their new state (§7 Motion, rule 8); a region that changes what it shows — loading → data →
   empty → error, one record → another — cross-fades and glides to its new height (`Crossfade`). A
   loading region holds the shape of what is coming (`Skeleton` with the data's geometry), so the
   swap moves nothing. This holds for every region of every screen, not only for prominent ones.

## 2. Token layers and naming

| Layer | Prefix | Example | Who may use it |
|---|---|---|---|
| Primitive | `--prime-ref-*` | `--prime-ref-color-gray-100` | only `tokens/semantic.ts` |
| Semantic | `--prime-*` | `--prime-color-text-secondary`, `--prime-space-4` | components |
| Component tier | `--prime-<component>-*` | `--prime-control-m-height`, `--prime-panel-radius` | components |

Path → variable: `control.m.labelSize` → `--prime-control-m-label-size` (camelCase → kebab-case).

Components MUST NOT use `--prime-ref-*`, raw hex/rgb, or raw `px/rem` values. Allowed literals:
`0`, `1px` hairline via `--prime-border-width`, `100%`, `auto`, unitless flex/grid numbers,
percentages for geometry (`50%` for circles), and `calc()` over tokens.
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
  thumb on a track is two steps lighter than the track.
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

**Who sets a depth.** Layers: Card, Sidebar, Accordion, DataTable, LoginForm, Datepicker.Panel,
horizontal Tabs, an outline Banner, ExampleFrame. Floating: every `FloatingPanel`
(Popover, Dropdown, Select, TagSelect…), Modal, Drawer, CommandMenu, Notification, a raised
ColorPicker.Panel. The ladder stops at layer 4: a surface nested deeper keeps layer 4's color — split
the screen with space and headings instead.

**Hosts off the ladder.** A tinted host (a soft or solid Banner, an accent wash, an image) sets
`data-depth="tinted"`: controls on it take the translucent washes (`fill.subtleActive`,
`fill.strong`), which read on any color. Translucent fills are otherwise only for states: row and
ghost hover, checkbox and switch tracks.

Fields: `background: var(--prime-color-field-bg)`, hover `--prime-color-field-bg-hover`, focus
`--prime-color-field-bg-focus` plus the focus ring, error a `--prime-color-danger-border` 1px inset ring
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
| title-s | 14/20 | 600 | 0 | card title, group heading |
| title-m | 16/24 | 600 | −0.01em | modal title, section title |
| title-l | 18/24 | 600 | −0.01em | — |
| heading-s | 20/28 | 600 | −0.01em | page sub-heading |
| heading-m | 24/32 | 600 | −0.02em | page title |
| heading-l | 30/36 | 600 | −0.02em | — |
| display-s/m/l | 36/44 · 48/56 · 60/68 | 600 | −0.02 / −0.03em | hero, metrics |
| code | 13/20 mono | 400 | 0 | code, IDs |

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
tooltips, datepicker) · `--prime-shadow-modal` (modal, drawer).
Z-index: `--prime-z-*` only. Every overlay shares `--prime-z-overlay` and portals to `<body>` when it
opens, so the open order is the stacking order; toasts sit above on `--prime-z-toast`.

Focus ring must never be clipped (hard rule):
- Fields (Input, Textarea, Select/TagSelect/Datepicker triggers, DigitInput cells, ColorPicker channels, search fields in panels)
  draw the ring INSIDE their edge: `outline: var(--prime-focus-width) solid var(--prime-color-focus-ring); outline-offset: var(--prime-focus-offset-inset);`.
- Everything else (buttons, links, tabs, chips, checkboxes, menu items use background instead) uses the outer ring with `--prime-focus-offset`.
- Every element with `overflow: auto | hidden | scroll | clip` that holds focusable content does exactly one of:
  (a) padded content — keeps at least `--prime-focus-space` between its edge and the content (Modal/Drawer body, panels, tab lists);
  (b) full-bleed content — content touches the edges and is clipped by the container's radius; every focusable inside
  uses the inset ring (tables: head cells, sort buttons, rows; full-width list rows).
  Never mix them: a rounded container never shows a gap before square full-bleed content (e.g. a table head).
  ScrollContainer has no padding of its own; the host chooses (a) or (b).
  Side padding of a scrolling body belongs to the scrolling element itself, never to an outer wrapper.
- Exception: a search input that is the permanent focus of its layer (CommandMenu search, search row inside
  Select/TagSelect/Dropdown panels) draws no ring — the caret is the indicator; the row is separated from results
  by a `border-faint` hairline. Everything else inside the layer (items, buttons) keeps the normal rules.
  Implemented via `focusRing={false}`: every field (Input, Textarea, Select, TagSelect, Datepicker, DigitInput,
  ColorPicker fields) takes `focusRing?: boolean` (default `true`); `false` sets `data-focus-ring="false"` on the
  element that draws the ring and its CSS skips the ring (`:not([data-focus-ring="false"])`). Focus, keyboard and
  ARIA are unchanged; the invalid inset ring still shows. Panel search rows and CommandMenu's search field set the
  attribute themselves. Use it only where focus is otherwise obvious (WCAG 2.4.7).
- `src/styles/focus-guard.test.ts` enforces this on the CSS.

Base declaration: `outline: var(--prime-focus-width) solid var(--prime-color-focus-ring); outline-offset: var(--prime-focus-offset);`
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
| `--prime-motion-press-scale` / `-compact` | 0.98 / 0.96 | `:active` scale; compact for icon-only and small targets |

Under `prefers-reduced-motion` durations and stagger collapse to 0 and press scales to 1 (globals.css);
JS animations must also check it.
Every component is designed with its micro-animations, not only its static states. Rules (after Emil Kowalski):

1. **Ask first: should it move at all?** By frequency: keyboard-driven or 100+/day actions (option highlight
   while arrowing, row hover, menu navigation, command palette) get no movement — color/fill change only,
   at most `fast`. Tens/day (hover, tabs, toggles): small and quick. Occasional (modals, drawers, toasts):
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
   `padding`, `top/left`. Where size must animate (accordion, progress), prefer `transform` / `scale` /
   `grid-template-rows`; never `transition: all` — list the properties.
6. **Press.** Every pressable control: `:active` → `scale(var(--prime-motion-press-scale))`
   (`-compact` for icon-only and small targets), over `fast`, `transform` only. Release returns by the same transition. Disabled and loading never scale.
7. **Never from nothing.** Entrances start from `opacity: 0` + a small offset (`--prime-space-1/2`) or
   `scale(0.96–0.98)`, never `scale(0)`. Popovers/menus grow from the trigger (`transform-origin` follows
   `data-side`; Tooltip from its arrow tip); modals stay centered. Layers anchored to a screen edge
   (Drawer, sheet, Notification stack) travel from that edge and leave toward it.
8. **State moves, it does not swap.** Checkmark draws/scales in, switch thumb slides, selection indicator
   (tabs, segmented control) glides to the new item, chevrons rotate, progress fills, counters and fills
   ease. Two states cross-fade rather than flip when they replace each other in place: a region
   swapping its content uses `Crossfade` (inside a component: `useStateSwap` + `swapMotion`), and its
   loading state is a `Skeleton` of the coming content (principle 7).
9. **Interruptible.** Toggled state uses CSS transitions (retarget mid-flight), not keyframes. Keyframes only
   for one-shot enter/exit (overlay presence, spinner, skeleton) and one-shot gestures (icons, rule 13;
   a field's error shake, rule 14).
10. **Hover is for pointers.** Hover transforms/lifts only inside `@media (hover: hover) and (pointer: fine)`;
    plain color hover is fine. No hover movement on dense rows and cells, except the icon gesture (rule 13).
11. **Lists.** Items entering/leaving fade + shift; stagger only for first-render of short groups
    (`--prime-motion-stagger` steps, ≤ 6 items) and never blocks interaction.
12. **Reduced motion** is already global through the tokens. Anything not tokenized (JS, `animation-delay`) must
    be gated by `prefers-reduced-motion`. Movement may go; opacity/color feedback should stay.
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

Component checklist for motion: press · hover/focus fill · selection/toggle · open/close · enter/exit of
parts (items, messages, badges, icons) · loading/progress · reduced motion. Skip what the rules above say
should stay still, and say so in a CSS comment only when the omission is non-obvious.

## 8. Components: states recipe

| State | Recipe |
|---|---|
| hover | filled: `-hover` token (`fill-muted-hover`, `field-bg-hover`: one more ladder step away from the host); ghost, stroke and rows inside a padded container: `--prime-color-fill-subtle`; a surface or a row that reaches its surface's edge: see "Hover on a surface" below |
| active | filled: same as hover + `transform: scale(var(--prime-motion-press-scale))`; ghost: `fill-subtle-active` (+ the same press scale on pressable controls, see Motion) |
| focus-visible | the focus ring (§7) |
| selected | `accent-soft` bg + `accent-text`, or check icon in `accent-text` |
| disabled | `fill-muted`/`field-bg-disabled` bg, `text-disabled` color, no shadow, `cursor: not-allowed` |
| loading (control) | spinner replaces leading icon, label stays, width does not change, `aria-busy` |
| loading (region) | `Skeleton` in the data's geometry inside `Crossfade`, `aria-busy` on the region; data already shown stays during a refresh |
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

Every floating layer — Modal, Drawer, CommandMenu, Popover (and Datepicker / ColorPicker popovers built on it),
Dropdown, Select panel, TagSelect panel, Tooltip — behaves the same way, so "click empty space closes what is open"
holds across the kit.

- **Dismiss.** A layer closes on (a) a pointerdown outside the layer and its trigger — for Modal / Drawer /
  CommandMenu that is the scrim — and (b) Escape. Tooltip closes on pointer-leave / blur / Escape.
  Opt out with `closeOnOutsideClick={false}` (Modal keeps it for destructive confirms); the layer still blocks
  the layers below it.
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
  - **A scrim click of Modal / Drawer / CommandMenu** returns focus to the opener: the page behind was inert, the
    click landed on the scrim, not on a control, so the opener is the only sensible place to continue from (the
    keyboard user's position is kept).
- **Presence.** `usePresence(open)` keeps the layer mounted with `data-state="closed"` until its exit animation
  ends (`animationend`, fallback timeout = token duration), and unmounts at once under `prefers-reduced-motion`.
  A closing layer takes no pointer events.
- **Motion** (`src/internal/overlayMotion.module.css`, tokens only, both directions from `data-state`):

| Layer | Enter | Exit |
|---|---|---|
| scrim | fade · base · enter | fade · base · exit |
| Modal, CommandMenu | fade + scale 0.98 → 1 · base · enter | fast · exit |
| Modal bottom sheet (< 640px) | slide up · slow · enter | slide down · base · exit |
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
- Composite components adapt with container queries (`container-type: inline-size`) where their own
  width matters (Card, PageToolbar, DataTable toolbar, Modal footer, Datepicker months), media queries
  only for the app shell and the overlay form (bottom sheets below 640).
- Breakpoints (for media queries; CSS vars cannot be used there): 640 · 768 · 1024 · 1280; "below a
  breakpoint" is `max-width: <bp − 1>px`.
- Input decides interaction, not width: `:hover` styles only inside `@media (hover: hover)`; whatever
  hover reveals is also shown on focus and under `(hover: none)`. Under `(pointer: coarse)` small
  controls get a 44px hit area (`--prime-control-touch-target`, `src/internal/touchTarget`) and menu
  rows are at least 44px; editable field text is at least 16px under `(pointer: coarse), (max-width:
  639px)` (`--prime-control-touch-text-size`) so iOS never zooms.
- Switchers never wrap: they scroll inside themselves, stretched items tend to equal width and never
  shrink below their label, the selection indicator moves only after a person's choice.
- Scroll overflow is always visible: a cut-off item, an edge fade or an edge shadow (`useEdgeOverflow`).
- Sticky headers stop sticking on screens lower than 480px; overlays respect safe-area insets.
- The page panel is `PageToolbar`: one row from a 56rem container, exactly two rows below it, the
  primary action always at the end of the top row.
- Field affixes (units like `%`, `°`, `₽`, prefixes like `https://`) are flex items in the field row next to the value,
  separated by the tier `gap`; never absolutely positioned, never sized with a fixed width. A numeric value with a unit
  is one group: value (tabular-nums) + unit, aligned the same way in every field of a row. Field widths come from the
  layout (grid columns / flex), not from per-field fixed widths, so nothing clips at any size tier.
- Modal footer: actions right-aligned with `gap: 8`; on phones (below 640) and in a dialog narrower than
  360px they stack full width, primary last.
- Overlays near the viewport edge flip/shift, keep `--prime-space-2` from the edge.

## 10. API contract (v1)

No backward compatibility, no aliases, no `@deprecated` props, no legacy types. One name per concept.

| Concept | API | Notes |
|---|---|---|
| Size | `size?: "xs" \| "s" \| "m" \| "l" \| "xl"`, default `"m"` | Type `ControlSize` from `src/internal/states.ts`. Overlays that size by width (Modal, Drawer) use the subset they need. Avatar adds `"2xl"`. |
| Treatment | `variant` | Shared vocabulary: `solid` · `soft` · `outline` · `ghost`. Component-specific structural variants (FileUpload `dashed \| solid`, Card templates). Tabs has no variant: navigation tabs are always a folder (horizontal) or pills (vertical); choosing a value is SegmentedControl are allowed and documented. |
| Semantic color | `tone?: "neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | Components use the subset that makes sense (Button: `accent \| neutral \| danger`, default `accent`). Destructive = `danger`, never `error`. Button also takes `inherit` (with `ghost \| soft \| outline`) for an action on a colored host: color, fills and focus ring derive from the host's `currentColor`; a host never recolors a Button with a CSS override. |
| Decorative color | `color?: "gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | Badge, Avatar, Thumbnail, and the parts that host a palette hue: `SegmentedControl.Item` (dot + tinted thumb), count badges (`Tabs.Count`, `SegmentedControl.Count`, `Sidebar.ItemCount`), `FileUpload.FormatBadge`, `Timeline.Item` (dot), TagSelect options (tag hue). |
| Validation | `invalid?: boolean`; fields with a support row also take `hint?: ReactNode` and `error?: ReactNode` | A non-empty `error` implies `invalid`. Sets `aria-invalid`, `data-invalid`. |
| Value | `value` / `defaultValue` / `onValueChange(value)` | Select, TagSelect, Tabs, SegmentedControl, Slider, Datepicker, Accordion, RadioGroup, DigitInput, Pagination (`page` → `value`). Native text inputs (Input, Textarea) keep native `value`/`onChange` and add `onValueChange(string)`. |
| Checked | `checked` / `defaultChecked` / `onCheckedChange(checked)` | Checkbox, Switch. |
| Open | `open` / `defaultOpen` / `onOpenChange(open)` | Every overlay and disclosure. |
| Dismiss | `closeOnOutsideClick?: boolean` (default `true`), `closeOnEscape?: boolean` (default `true`) | One name everywhere: Modal, Drawer, CommandMenu, Popover, Dropdown. Turn it off for destructive confirms. No `closeOnOverlayClick`. See §8 Overlay contract. |
| Flags | `disabled`, `readOnly`, `required`, `loading`, `fullWidth` | Same names everywhere. |
| Focus ring | `focusRing?: boolean`, default `true` | Fields only. `false` hides the visual ring (`data-focus-ring="false"`), never focus or the error ring; see §7. |
| Built-in strings | `labels?: Partial<XLabels>` | Every system string (aria labels, default texts, counters) lives in one `labels` object with Russian defaults. Visible content goes through children/slots, not labels. |
| Structure | Compound `X.Root` + `X.Part` when a component has parts; a single export for leaf components without parts. | |
| DOM state | `data-size`, `data-variant`, `data-tone`, `data-color`, `data-invalid`, `data-disabled`, `data-loading`, `data-state` (`open \| closed \| checked \| unchecked \| indeterminate \| active \| inactive`) | CSS styles only from these and ARIA. |

Forms: `label`, `hint`, `error`, `required`, `optional` work the same in every field.
Required = red `*` after the label text (`aria-hidden`) + native `required`. Optional = muted
«необязательно» right after the label text (from `labels.optional`). Placeholder never replaces the label.
