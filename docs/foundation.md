# Prime UI — Foundation (Graphite)

The design contract for every component. Tokens live in `tokens/` and are generated into
`src/styles/{tokens,theme-light,theme-dark}.css` by `bun run tokens:build`.

## 1. Principles

1. **Depth comes from fill, not from lines.** Canvas is light gray, cards are white, fields are a
   slightly darker gray inside cards and white on the canvas. Borders are hairlines (`border.subtle`)
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
| `color.bg` | canvas, surface, raised, sunken, inverse, scrim | page / card / floating layer / inset area / tooltip / modal backdrop |
| `color.fill` | subtle, subtleActive, muted, mutedHover, strong, strongHover | ghost hover & row hover (transparent wash) / neutral buttons, chips, segmented track / unchecked checkbox, switch track, slider track |
| `color.text` | primary, secondary, muted, placeholder, disabled, inverse | — |
| `color.border` | subtle, default, control | hairline separators / stroke buttons / control outline (transparent) |
| `color.accent` | default, hover, fg, soft, softHover, text | primary action, selection, links, active tab, checked controls |
| `color.danger/success/warning/info` | default, (hover), fg, soft, text, (border) | status (info is sky, distinct from the cobalt accent) |
| `color.field` | bg, bgSurface, bgFocus, bgDisabled | field fill (see §4) |
| `color.focus.ring` | — | the one focus ring |
| `color.control.thumb` | — | switch / slider thumb |
| `color.tooltip` | bg, text | — |
| `color.palette.<hue>` | soft, text, solid, solidFg | Badge/Tag/Avatar colors: gray, blue, green, orange, red, yellow, purple, sky, pink, teal |

Light and dark are full themes: in dark, layers get lighter as they go up (canvas 950 → surface 900 →
raised 875), and accent/status move to lighter steps. All text pairs pass WCAG AA (≥ 4.5:1), focus ring ≥ 3:1.

## 4. Surfaces and the field context

`--prime-color-field-bg` is white on the canvas. Every surface component sets

```css
.root { --prime-color-field-bg: var(--prime-color-field-bg-surface); }
```

so fields inside Card, Modal, Drawer, Popover, Dropdown panel, Sidebar, Datepicker panel stay
distinguishable. Fields: `background: var(--prime-color-field-bg)`, hover darkens via
`color-mix(in srgb, var(--prime-color-field-bg) 94%, var(--prime-color-text-primary))`,
focus switches to `--prime-color-field-bg-focus` plus the focus ring, error shows a
`--prime-color-danger-border` 1px inset ring (`box-shadow: inset 0 0 0 1px …`) and danger text below.

Any element that paints `bg-canvas` (preview stages, the AppShell rail) resets the context back to
`--prime-color-card-bg: var(--prime-color-bg-surface)` and `--prime-card-shadow: var(--prime-shadow-raised)`.

Cards follow the same context rule: `--prime-color-card-bg` is `bg-surface` on the canvas; every surface plane
(AppShell content, Card, Modal, Drawer, Popover) sets `--prime-color-card-bg: var(--prime-color-bg-sunken)` and
`--prime-card-shadow: none`, so a card
inside page content or inside another card becomes a sunken tile without a shadow.

**Every bounded block must be visible on its host (hard rule).** A block with edges (table, card, panel, code block,
list group, tile, empty state frame) never has a transparent fill or the same fill as the plane it sits on. It takes
`--prime-color-card-bg` (or `--prime-color-field-bg` for inputs), which resolves to a contrasting fill for the current
host. A table's head, body rows and footer all sit inside that fill, so the table's bottom edge is always visible.
Only explicitly flat/ghost variants may drop the fill, and then they must have no radius (nothing suggests a box).

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

| Tier | Height | Text | Button padX | Field padX | Gap | Icon | Radius | Label | Hint | Menu item | Checkbox |
|---|---|---|---|---|---|---|---|---|---|---|---|
| xs | 28 | 12/16 | 8 | 8 | 4 | 14 | 6 | 12/16 | 12/16 | 24 | 14 |
| s | 32 | 13/20 | 12 | 8 | 8 | 16 | 8 | 12/16 | 12/16 | 28 | 16 |
| **m** | **36** | **14/20** | **16** | **12** | **8** | **16** | **8** | **13/20** | **12/16** | **32** | **18** |
| l | 40 | 16/24 | 20 | 12 | 8 | 20 | 10 | 14/20 | 13/20 | 36 | 20 |
| xl | 48 | 16/24 | 24 | 16 | 12 | 20 | 12 | 14/20 | 13/20 | 40 | 24 |

Variables: `--prime-control-<tier>-{height,padding-x,field-padding-x,gap,icon,radius,text-size,line-height,label-size,label-line-height,hint-size,hint-line-height,label-gap,hint-gap,item-height,choice}`.

Pairing rules:
- A field of tier T uses label/hint values of tier T. Hint/error is always smaller than the field text.
- A menu/listbox opened from a trigger of tier T uses `item-height` of tier T and the same text size.
- Badges/Tags/Kbd inside a control of tier T use the badge tier one step down (`m` control → `s` badge).
- An icon-only button is square: width = height.
- Fields (Input, Textarea, Select, TagSelect, Datepicker trigger, ColorPicker fields): an icon (leading or trailing,
  incl. chevrons and clear buttons) sits centered between the edge and the text — edge→icon = icon→text = the tier's
  `field-padding-x` (xs/s 8 · m/l 12 · xl 16). No optical shrink in fields.
- Buttons: icon + label are one centered group; the icon side gets optical compensation (padding = padX − 4px, never below 8px) and
  the icon→label gap is the tier `gap`. Icon-only buttons are square.

Badge tiers (`--prime-badge-<tier>-{height,padding-x,text-size,icon,gap,radius}`): 16 · 20 · 24 · 28 · 32.
Switch (`--prime-switch-<tier>-{width,height,thumb}`), Avatar (`--prime-avatar-<tier>`).

## 7. Geometry, elevation, layers

Radius: `--prime-radius-{xs 4, s 6, m 8, l 12, xl 16, 2xl 20, full}`. Controls use their tier radius;
cards `--prime-card-radius` (12); floating panels `--prime-panel-radius` (12) with
`--prime-panel-padding` (4) and `--prime-panel-item-radius` (8); modal `--prime-modal-radius` (16).

Elevation: `--prime-shadow-raised` (cards, barely there) · `--prime-shadow-overlay` (menus, popovers,
tooltips, datepicker; z popover/dropdown/tooltip) · `--prime-shadow-modal` (modal, drawer; z modal/drawer).
Z-index: `--prime-z-*` only.

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
  ARIA are unchanged; the invalid inset ring still shows. Panel search rows and CommandMenu's `InputRow` set the
  attribute themselves. Use it only where focus is otherwise obvious (WCAG 2.4.7).
- `src/styles/focus-guard.test.ts` enforces this on the CSS.

Base declaration: `outline: var(--prime-focus-width) solid var(--prime-color-focus-ring); outline-offset: var(--prime-focus-offset);`
on `:focus-visible`. Fields draw it on the wrapper with `:focus-within` / `:has(:focus-visible)`.
Error fields use `--prime-color-danger-border` as ring color.

Motion: `--prime-motion-duration-{fast 120, base 200, slow 300}`, `--prime-motion-easing-{standard,enter,exit}`.
Durations collapse to 0 under `prefers-reduced-motion` globally; JS animations must also check it.

## 8. Components: states recipe

| State | Recipe |
|---|---|
| hover | filled: `-hover` token; ghost/stroke/rows: `--prime-color-fill-subtle` |
| active | filled: same as hover + `transform: scale(0.98)` for buttons only; ghost: `fill-subtle-active` |
| focus-visible | the focus ring (§7) |
| selected | `accent-soft` bg + `accent-text`, or check icon in `accent-text` |
| disabled | `fill-muted`/`field-bg-disabled` bg, `text-disabled` color, no shadow, `cursor: not-allowed` |
| loading | spinner replaces leading icon, label stays, width does not change, `aria-busy` |
| error | `danger-border` inset ring + `danger-text` message; layout does not shift (support row reserves height when the component asks for it) |
| empty | centered muted text in `body-s`, optional action |

### Overlay contract

Every floating layer — Modal, Drawer, CommandMenu, Popover (and Datepicker / ColorPicker popovers built on it),
Dropdown, Select panel, TagSelect panel, Tooltip — behaves the same way, so "click empty space closes what is open"
holds across the kit.

- **Dismiss.** A layer closes on (a) a pointerdown outside the layer and its trigger — for Modal / Drawer /
  CommandMenu that is the scrim — and (b) Escape. Tooltip closes on pointer-leave / blur / Escape.
  Opt out with `closeOnOutsideClick={false}` (Modal keeps it for destructive confirms); the layer still blocks
  the layers below it.
- **Topmost only.** Open layers form a stack (`useOutsideClick`, `useEscapeKey`, `useFocusTrap` in `src/hooks`).
  Only the topmost layer reacts: one click or one Escape closes one layer. A click inside a nested child layer
  (a Select open inside a Modal, a manage Popover inside a TagSelect panel) never closes the parent, even though
  the child is portaled outside the parent's DOM.
- **Focus depends on how the layer was dismissed.**
  - **Escape** (and Tab / picking an option where the component closes on it) returns focus to the trigger
    (focus trap restore, or an explicit focus for non-trapping panels).
  - **A press outside a floating layer** (Popover, Dropdown, Select, TagSelect, Datepicker, ColorPicker /
    ColorPresets) does **not** restore focus: focus follows the pointer. A press on another control focuses that
    control; a press on empty space leaves nothing focused, so a focused field blurs (TagSelect collapses) in the
    same click — one click leaves the field. `useOutsideClick` marks the press (`isPointerDismiss()`), and
    `useFocusTrap` skips its restore while it is set.
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
| Popover, Dropdown, Select, TagSelect, Datepicker, Tooltip | fade + 4px (`--prime-space-1`) from the anchor along the resolved `data-side` · fast · enter | fast · exit |

Components carry no motion code of their own for these layers.

## 9. Layout and responsiveness

- Flexbox for one-dimensional rows/stacks, Grid for two-dimensional layouts. Spacing between siblings
  via `gap`, never margins on children.
- Text that can overflow: `min-width: 0` on flex children + `text-overflow: ellipsis` (single line) or
  `overflow-wrap: anywhere` (multi-line). Truncated text gets a `title` or Tooltip when it matters.
- Composite components adapt with container queries (`container-type: inline-size`) where their own
  width matters (Card, DataTable toolbar, Modal footer, Datepicker months), media queries for the page
  shell. Must work from 320px.
- Breakpoints (for media queries; CSS vars cannot be used there): 640 · 768 · 1024 · 1280.
- Field affixes (units like `%`, `°`, `₽`, prefixes like `https://`) are flex items in the field row next to the value,
  separated by the tier `gap`; never absolutely positioned, never sized with a fixed width. A numeric value with a unit
  is one group: value (tabular-nums) + unit, aligned the same way in every field of a row. Field widths come from the
  layout (grid columns / flex), not from per-field fixed widths, so nothing clips at any size tier.
- Modal footer: actions right-aligned with `gap: 8`; below 480px they stack full width, primary last.
- Overlays near the viewport edge flip/shift, keep `--prime-space-2` from the edge.

## 10. API contract (v1)

No backward compatibility, no aliases, no `@deprecated` props, no legacy types. One name per concept.

| Concept | API | Notes |
|---|---|---|
| Size | `size?: "xs" \| "s" \| "m" \| "l" \| "xl"`, default `"m"` | Type `ControlSize` from `src/internal/states.ts`. Overlays that size by width (Modal, Drawer) use the subset they need. Avatar adds `"2xl"`. |
| Treatment | `variant` | Shared vocabulary: `solid` · `soft` · `outline` · `ghost`. Component-specific structural variants (FileUpload `dashed \| solid`, Card templates). Tabs has no variant: navigation tabs are always underline; choosing a value is SegmentedControl are allowed and documented. |
| Semantic color | `tone?: "neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | Components use the subset that makes sense (Button: `accent \| neutral \| danger`, default `accent`). Destructive = `danger`, never `error`. |
| Decorative color | `color?: "gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | Badge, Tag, Avatar, and the parts that host a palette hue: field badges (`Input.Badge`, `Select.Badge`, `Datepicker.Badge`), `Select.ItemMedia`, `SegmentedControl.Item` (dot + tinted thumb). |
| Validation | `invalid?: boolean`; fields with a support row also take `hint?: ReactNode` and `error?: ReactNode` | A non-empty `error` implies `invalid`. Sets `aria-invalid`, `data-invalid`. |
| Value | `value` / `defaultValue` / `onValueChange(value)` | Select, TagSelect, Tabs, SegmentedControl, Slider, Datepicker, Accordion, RadioGroup, DigitInput, Pagination (`page` → `value`). Native text inputs (Input, Textarea) keep native `value`/`onChange` and add `onValueChange(string)`. |
| Checked | `checked` / `defaultChecked` / `onCheckedChange(checked)` | Checkbox, Switch. |
| Open | `open` / `defaultOpen` / `onOpenChange(open)` | Every overlay and disclosure. |
| Dismiss | `closeOnOutsideClick?: boolean` (default `true`), `closeOnEscape?: boolean` (default `true`, dialogs) | One name everywhere: Modal, Drawer, CommandMenu.Dialog, Popover, Dropdown. Turn it off for destructive confirms. No `closeOnOverlayClick`. See §8 Overlay contract. |
| Flags | `disabled`, `readOnly`, `required`, `loading`, `fullWidth` | Same names everywhere. |
| Focus ring | `focusRing?: boolean`, default `true` | Fields only. `false` hides the visual ring (`data-focus-ring="false"`), never focus or the error ring; see §7. |
| Built-in strings | `labels?: Partial<XLabels>` | Every system string (aria labels, default texts, counters) lives in one `labels` object with Russian defaults. Visible content goes through children/slots, not labels. |
| Structure | Compound `X.Root` + `X.Part` when a component has parts; a single export for leaf components without parts. | |
| DOM state | `data-size`, `data-variant`, `data-tone`, `data-color`, `data-invalid`, `data-disabled`, `data-loading`, `data-state` (`open \| closed \| checked \| unchecked \| indeterminate \| active \| inactive`) | CSS styles only from these and ARIA. |

Forms: `label`, `hint`, `error`, `required`, `optional` work the same in every field.
Required = red `*` after the label text (`aria-hidden`) + native `required`. Optional = muted
«необязательно» right after the label text (from `labels.optional`). Placeholder never replaces the label.
