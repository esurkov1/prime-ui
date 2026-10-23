# Accordion

**Category:** data-display
**Kind:** navigation

> Collapsible sections: FAQ, settings groups, checkout steps.

## When to use
- A list of questions with answers (FAQ).
- Groups of settings where the user opens one or several at a time (`multiple`).
- Step-by-step forms where one step stays open (`collapsible={false}`).

## When not to use
- Switching between peer views of the same area → use [Tabs](../tabs/COMPONENT.md).
- A single show / hide toggle next to a field → a [Button](../button/COMPONENT.md) plus conditional content.
- A linear wizard with progress → use [Stepper](../stepper/COMPONENT.md).
- Floating extra content → use [Popover](../popover/COMPONENT.md).
- A static separator between groups → use [Divider](../divider/COMPONENT.md).

## Import
```tsx
import { Accordion } from "prime-ui-kit";
```

## Anatomy
```
Accordion.Root                frame (grouped) or column of cards (separate)
└─ Accordion.Item             one section; data-state open / closed
   ├─ Accordion.Header        heading around the trigger (<h3>, or the level of `as`)
   │  └─ Accordion.Trigger    <button>: a header row — mark, title, badges, description, then the chevron (Icon nav.chevronDown)
   │     ├─ Accordion.Icon    optional leading mark
   │     ├─ Accordion.Badges  badges after the title, on its line (a Badge.Group, «+N» on overflow)
   │     └─ Accordion.Description  line under the title; a StatusDot first, then «·»
   └─ Accordion.Content       <section> region (the kit fold); clip <div> → padded body <div>
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Accordion.Root
`ref` → `HTMLDivElement`. Owns which items are open; sets the size tier and the layout.

| Prop | Type | Default | Description |
|---|---|---|---|
| `multiple` | `boolean` | `false` | Any number of open items; `value` becomes a `string[]`. |
| `value` | `string \| string[]` | — | Open item (`""` — none), or the list of open items with `multiple` (controlled). |
| `defaultValue` | `string \| string[]` | — | Initially open item(s) (uncontrolled). |
| `onValueChange` | `(value: string) => void \| (value: string[]) => void` | — | Called with the new open item, or the new list with `multiple`. |
| `collapsible` | `boolean` | `true` | Without `multiple`: `false` keeps the open item open on a second click. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of trigger height, text, icon and padding. Without it the tier of its host, else `m`. |
| `layout` | `"grouped" \| "separate"` | `"grouped"` | `grouped` — one surface with hairlines between items; `separate` — every item is its own card. |
| `children` | `ReactNode` | — | `Accordion.Item`s. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" \| "onChange">` | — | `className` and the other div attributes. |

### Accordion.Item
`ref` → `HTMLDivElement`. One section; `data-state="open" | "closed"`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Item id used in `value`. |
| `disabled` | `boolean` | `false` | The item cannot be toggled; its trigger is disabled. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### Accordion.Header
`ref` → `HTMLHeadingElement`. The heading around the trigger (`<h3>` unless `as` says otherwise).

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"` | Heading level in the page outline: one below the heading of the section that holds the accordion. |
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `className` and the other heading attributes. |

### Accordion.Trigger
`ref` → `HTMLButtonElement`. The `<button>` that toggles the item, a header row: `Accordion.Icon`, the title with `Accordion.Badges`, the `Accordion.Description` under it, the chevron at the end that turns when open. Nothing wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Optional `Accordion.Icon`, `Accordion.Badges` and `Accordion.Description` (in any order); the rest is the title. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">` | — | `onClick` (runs first; `preventDefault()` stops the toggle), `className` and the other button attributes. |

### Accordion.Icon
`ref` → `HTMLSpanElement`. Decorative leading icon (`aria-hidden`) of the trigger; the content then lines up with the label.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="field.calendar" />`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Accordion.Badges
`ref` → `HTMLDivElement`. A `Badge.Group` after the title, on its line: every badge of the section, the meaning in its `tone` or `color`. The title gives way first; what does not fit folds into «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | The `Badge.Root`s of the section (a status, a count). |
| `labels` | `Partial<BadgeGroupLabels>` | — | Built-in strings of the «+N» badge, see the `Badge.Group` labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other `div` attributes. |

### Accordion.Description
`ref` → `HTMLSpanElement`. The line under the title: plain text with new data only, one line cut with an ellipsis; 12/16 · 13/20 · 14/20 by size. A `StatusDot` first states the section's state, and a «·» is put after it by itself.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | The text, with an optional `StatusDot` first. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### Accordion.Content
`ref` → `HTMLElement`. The `<section>` region; closed content is out of the tab order and the accessibility tree but found by find in page, which opens its item. `className` goes to the padded inner block.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Panel content. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | Attributes of the `<section>`. |

## Variants

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `grouped` | One surface — a layer of the ladder (`layer-current`) — with card radius, `border-subtle` hairlines between items, no shadow of its own | FAQ, short settings lists | yes |
| `separate` | Each item is a separate card (`layer-current`, card radius, the raised whisper on the page) with `--prime-space-2` between them | Heavier sections, checkout steps | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | trigger min height 36, control text xs, panel caption 12/16, padding-x 12 | dense side panels | |
| `s` | 40, control text s, panel body-s 13/20, padding-x 12 | compact settings | |
| `m` | 52, control text m, panel body-m 14/20, padding-x 16 | default | yes |
| `l` | 56, control text l, panel body-m, padding-x 20 | spacious pages | |
| `xl` | 64, control text xl, panel body-l 16/24, padding-x 24 | landing-like FAQ | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `multiple` | items open independently; `value` is a list | settings the user compares side by side | off |
| `collapsible={false}` | without `multiple`: one item always stays open | checkout / step forms | `true` |
| with `Accordion.Icon` | secondary-colored tier icon before the label; panel text indents to the label | settings groups with category icons | — |

`collapsible` exists only without `multiple`: passing both is a type error. Do not nest accordions inside accordion panels.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `value` / `defaultValue` + `onValueChange` | `data-state="open" \| "closed"` on Item, Trigger and Content; `aria-expanded` on Trigger; `inert` on a Content while it closes, then `hidden="until-found"` on its inner clip |
| found in page | find in page matches text in a closed Content (`beforematch`) | the item opens at once (no fold motion in that frame), the browser scrolls to and marks the match |
| disabled | `disabled` on Item | `data-disabled` on Item and Trigger, native `disabled`, `text-disabled`, `cursor: not-allowed` |
| hover / active | pointer | trigger `fill-muted-hover` (two ladder steps off the accordion's layer, so it never lands on the host's color at the edges) / `fill-strong` |
| focus-visible | keyboard | inset focus ring inside the trigger |

Root: `data-size`, `data-layout`. The panel is the kit fold (`Disclosure`): its height glides (no JS measuring, follows content that resizes while open) and the body fades in while settling by one space step; open uses `base` + `enter`, close `fast` + `exit`. The chevron rotates over `base`. Instant under `prefers-reduced-motion`.

## Layout & spacing
- Takes the full width of its parent (`width: 100%`); the parent sets the measure.
- Panel content is a flex column with `--prime-space-3` gap; its padding (`--acc-pad-y` above and below, `--acc-pad-x` at the sides) keeps it clear of the trigger's hover fill and leaves room for the focus rings of fields inside.
- The root is a layer of the surface ladder (`data-depth`): fields inside panels take that layer's fill automatically.
- Stack several accordions or an accordion and other blocks with the page gap between groups.
- On a coarse pointer a trigger is at least the touch target high.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus between triggers; a disabled one is skipped. |
| `Enter` · `Space` | Opens or closes the section. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The trigger is a native `<button>` inside a heading (`<h3>`, or the level of `as`) with `aria-expanded` and `aria-controls`.
- The panel is a `<section>` with `aria-labelledby`; closed content is `inert` while it closes, then `hidden="until-found"`: out of the tab order and the accessibility tree, yet find in page reaches it and opens the item at once.
- The chevron and `Accordion.Icon` are `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Accordion.Badges

| Key | Default | Used for |
|---|---|---|
| `more` | `"+{count}"` | Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many. |
| `moreCount` | `"Ещё {count}"` | What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A FAQ where one answer is open at a time and every question heads its section — `defaultValue`, `as`. |
| [variants.tsx](examples/variants.tsx) | One surface with hairlines between items, or every item as its own card — `layout`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: trigger height, text, icon and padding grow together — `size`. |
| [states.tsx](examples/states.tsx) | A disabled section that cannot be opened, next to regular ones — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A header row per section: the mark, the title with its badge, the state and a note under it, the chevron at the end; the content lines up with the title — `Accordion.Icon`, `Accordion.Badges`, `Accordion.Description`. |
| [multiple.tsx](examples/multiple.tsx) | Several sections stay open at once; the value is a list — `multiple`. |
| [collapsible.tsx](examples/collapsible.tsx) | Checkout steps where one step always stays open — `collapsible`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the open sections and opens or closes all of them at once — `value`, `onValueChange`. |

## Mistakes
- Trigger without `Accordion.Header` → wrap it so the section has a heading.
- A heading level that skips the outline (an `<h3>` under a page `<h1>`) → set `as` one level below the heading above the accordion.
- `value={["a"]}` without `multiple` → arrays only with `multiple`.
- Adding a chevron icon to the trigger → the trigger draws one itself.
- Expecting `className` on Content to style the `<section>` → it styles the inner padded block.
- Accordion used for tab-like switching → use Tabs.

## Related
- **Built from:** `Icon` (`nav.chevronDown`), [Badge](../badge/COMPONENT.md) (`Accordion.Badges`), [StatusDot](../status-dot/COMPONENT.md) (the state first in `Accordion.Description`)
- **See also:** [Tabs](../tabs/COMPONENT.md), [Card](../card/COMPONENT.md), [Stepper](../stepper/COMPONENT.md), [Divider](../divider/COMPONENT.md)
