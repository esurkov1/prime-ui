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
   ├─ Accordion.Header        <h3> around the trigger
   │  └─ Accordion.Trigger    <button>: children, then the chevron (Icon nav.chevronDown)
   │     └─ Accordion.Icon    optional leading icon
   └─ Accordion.Content       <section> region; clip <div> → padded body <div>
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
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of trigger height, text, icon and padding. |
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
`ref` → `HTMLHeadingElement`. The `<h3>` around the trigger.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `className` and the other heading attributes. |

### Accordion.Trigger
`ref` → `HTMLButtonElement`. The `<button>` that toggles the item; draws a chevron after its children that turns when open.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Optional `Accordion.Icon`, then the label. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">` | — | `onClick` (runs first; `preventDefault()` stops the toggle), `className` and the other button attributes. |

### Accordion.Icon
`ref` → `HTMLSpanElement`. Decorative leading icon (`aria-hidden`) of the trigger; the content then lines up with the label.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="field.calendar" />`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Accordion.Content
`ref` → `HTMLElement`. The `<section>` region; closed content is `inert` (out of the tab order and the accessibility tree). `className` goes to the padded inner block.

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
| open / closed | `value` / `defaultValue` + `onValueChange` | `data-state="open" \| "closed"` on Item, Trigger and Content; `aria-expanded` on Trigger; `inert` on a closed Content |
| disabled | `disabled` on Item | `data-disabled` on Item and Trigger, native `disabled`, `text-disabled`, `cursor: not-allowed` |
| hover / active | pointer | trigger `fill-muted-hover` (two ladder steps off the accordion's layer, so it never lands on the host's color at the edges) / `fill-strong` |
| focus-visible | keyboard | inset focus ring inside the trigger |

Root: `data-size`, `data-layout`. The panel height transitions through `grid-template-rows: 0fr → 1fr` (no JS measuring, follows content that resizes while open) and the body fades in while settling by `--prime-space-1`; open uses `base` + `enter`, close `fast` + `exit`. The chevron rotates over `base`. Instant under `prefers-reduced-motion`.

## Layout & spacing
- Takes the full width of its parent (`width: 100%`); the parent sets the measure.
- Panel content is a flex column with `--prime-space-3` gap; it reserves `--prime-focus-space` at the top so focus rings of fields inside are not clipped.
- The root is a layer of the surface ladder (`data-depth`): fields inside panels take that layer's fill automatically.
- Stack several accordions or an accordion and other blocks with the page gap (`--prime-space-8` between groups).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus between triggers; a disabled one is skipped. |
| `Enter` · `Space` | Opens or closes the section. |

### ARIA
- The trigger is a native `<button>` inside an `<h3>` with `aria-expanded` and `aria-controls`.
- The panel is a `<section>` with `aria-labelledby`; closed content is `inert`, so it leaves the tab order and the accessibility tree.
- The chevron and `Accordion.Icon` are `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A FAQ where one answer is open at a time — `defaultValue`. |
| [variants.tsx](examples/variants.tsx) | One surface with hairlines between items, or every item as its own card — `layout`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: trigger height, text, icon and padding grow together — `size`. |
| [states.tsx](examples/states.tsx) | A disabled section that cannot be opened, next to regular ones — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading icon per section; the content lines up with the label after it — `Accordion.Icon`. |
| [multiple.tsx](examples/multiple.tsx) | Several sections stay open at once; the value is a list — `multiple`. |
| [collapsible.tsx](examples/collapsible.tsx) | Checkout steps where one step always stays open — `collapsible`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the open sections and opens or closes all of them at once — `value`, `onValueChange`. |

## Mistakes
- Trigger without `Accordion.Header` → wrap it so the section has a heading.
- `value={["a"]}` without `multiple` → arrays only with `multiple`.
- Adding a chevron icon to the trigger → the trigger draws one itself.
- Expecting `className` on Content to style the `<section>` → it styles the inner padded block.
- Accordion used for tab-like switching → use Tabs.

## Related
- **Built from:** Icon (`nav.chevronDown`)
- **See also:** [Tabs](../tabs/COMPONENT.md), [Card](../card/COMPONENT.md), [Stepper](../stepper/COMPONENT.md), [Divider](../divider/COMPONENT.md)
