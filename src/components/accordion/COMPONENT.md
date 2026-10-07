# Accordion

**Category:** layout

> Collapsible sections: FAQ, settings groups, checkout steps.

## When to use
- A list of questions with answers (FAQ).
- Groups of settings where the user opens one or several at a time.
- Step-by-step forms where one step stays open (`collapsible={false}`).

## When not to use
- Switching between peer views of the same area → use [Tabs](../tabs/COMPONENT.md).
- A single show/hide toggle next to a field → a [Button](../button/COMPONENT.md) plus conditional content.
- A linear wizard with progress → use [Stepper](../stepper/COMPONENT.md).
- Floating extra content → use [Popover](../popover/COMPONENT.md).
- A static separator between groups → use [Divider](../divider/COMPONENT.md).

## Import
```tsx
import { Accordion } from "prime-ui-kit";
```

## Anatomy
```
Accordion.Root               frame (grouped) or column of cards (separate)
└── Accordion.Item           one section; data-state open/closed
    ├── Accordion.Header     <h3> wrapper of the trigger
    │   └── Accordion.Trigger    <button>; holds the label
    │       ├── Accordion.Icon   optional leading icon
    │       ├── <span>label</span>
    │       └── Accordion.Arrow  indicator at the end (chevron or icon / openIcon pair)
    └── Accordion.Content    <section> panel; clip <div> → padded body <div>
```

## API

### Accordion.Root
`forwardRef` to `<div>`. The props are a union on `type`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"single" \| "multiple"` | `"single"` | One open item at a time, or any number. |
| `value` | `string` (single) · `string[]` (multiple) | — | Open item(s), controlled. In single mode `""` means all closed. |
| `defaultValue` | `string` (single) · `string[]` (multiple) | — | Initially open item(s), uncontrolled. |
| `onValueChange` | `(value: string) => void` (single) · `(value: string[]) => void` (multiple) | — | Called on every toggle; single mode passes `""` when the item closes. |
| `collapsible` | `boolean` | `true` | Single mode only: `false` keeps the open item open when its trigger is clicked again. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Trigger height, text, icon and paddings. |
| `layout` | `"grouped" \| "separate"` | `"grouped"` | One surface with hairlines between items, or each item as its own card. |

+ native `<div>` props (except `defaultValue`, `onChange`).

### Accordion.Item
`forwardRef` to `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Item id used in `value`. |
| `disabled` | `boolean` | `false` | The trigger is disabled and the item cannot be toggled. |

+ native `<div>` props.

### Accordion.Header
`forwardRef` to `<h3>`. + native heading props.

### Accordion.Trigger
`forwardRef` to `<button>` (`type="button"` unless set). `id`, `disabled`, `aria-controls`, `aria-expanded` are set by the item. A custom `onClick` runs first; calling `event.preventDefault()` cancels the toggle. + native `<button>` props.

### Accordion.Icon
Polymorphic, no ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `"div"` | Element or icon component to render (e.g. a lucide icon). |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Icon glyph when `as` is a wrapper. |

+ props of the `as` element. Sized to the tier icon; content panel aligns with the label text when present.

### Accordion.Arrow
No ref; renders a `<span>` at the end of the trigger.

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ElementType<{ className?; strokeWidth? }>` | `ChevronDown` | Glyph; rotates 180° when the item opens. |
| `openIcon` | `ElementType<{ className?; strokeWidth? }>` | — | Glyph shown instead of `icon` while open (e.g. `Plus` → `Minus`); disables the rotation. |

+ native `<span>` props.

### Accordion.Content
`forwardRef` to the outer `<section>`. `className` goes to the inner padded block; `style` and other props go to the `<section>`. + native `<div>` props.

## Variants

### layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `grouped` | One `card-bg` surface with card radius, `border-subtle` hairlines between items, no shadow of its own | FAQ, short settings lists | yes |
| `separate` | Each item is a separate card (`card-bg`, card radius, `card-shadow`) with `--prime-space-2` between them | Heavier sections, checkout steps | |

### type
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `single` | Opening one item closes the other | FAQ, step-by-step forms | yes |
| `multiple` | Items open independently | Settings the user compares side by side | |

### collapsible (single only)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `true` | Clicking the open item closes it | Most lists | yes |
| `false` | One item always stays open | Checkout / step forms | |

### Arrow
| Value | Looks like | Use when | Default |
|---|---|---|---|
| default chevron | Muted chevron rotating 180° on open | Most accordions | yes |
| `icon` + `openIcon` | Two glyphs swapped on open, no rotation | «+ / −» style | |

### Leading icon
| Value | Looks like | Use when | Default |
|---|---|---|---|
| no `Accordion.Icon` | Label starts at the padding edge | Text-only lists | yes |
| with `Accordion.Icon` | Secondary-colored tier icon before the label; panel text indents to the label | Settings groups with category icons | |

**Combinations** — `layout="separate"` + `collapsible={false}` for checkouts; `type="multiple"` + leading icons for settings. `collapsible` exists only on the single variant: passing it with `type="multiple"` is a type error.

**Sizes** — trigger min height = control height + 8 (xs 36, s 40) or + 16 (**m 52**, l 56, xl 64); trigger text = the control text of the tier; panel text: xs caption 12/16, s body-s 13/20, m body-m 14/20, l body-m 14/20, xl body-l 16/24. Horizontal padding: xs/s 12, m 16, l 20, xl 24.

**Hierarchy** — one accordion per content block; do not nest accordions inside accordion panels.

## States
- Open/closed: driven by `value` / `defaultValue` + `onValueChange`. `data-state="open" | "closed"` on Item, Trigger and Content; `aria-expanded` on Trigger; `aria-hidden` and `inert` on a closed Content (its fields leave the tab order).
- Disabled item: `disabled` on Item → `data-disabled` on Item and Trigger, native `disabled` on the button, text in `text-disabled`, `cursor: not-allowed`.
- Hover: trigger gets `fill-subtle`; active `fill-subtle-active`; focus-visible: inset focus ring inside the trigger.
- Root: `data-size`, `data-layout`.
- Open/close: the panel height transitions through `grid-template-rows: 0fr → 1fr` (no JS measuring, follows content that resizes while open) and the body fades in while settling by `--prime-space-1`; open uses `base` + `enter`, close `fast` + `exit`. The chevron rotates over `base`. Instant under `prefers-reduced-motion`.

## Layout & spacing
- Takes the full width of its parent (`width: 100%`); the parent sets the measure.
- Panel content is a flex column with `--prime-space-3` gap; it reserves `--prime-focus-space` at the top so focus rings of fields inside are not clipped.
- Fields inside panels get the surface field fill automatically.
- Stack several accordions or an accordion and other blocks with the page gap (`--prime-space-8` between groups).

## Accessibility
- The trigger is a native `<button>` inside an `<h3>`: Tab moves between triggers, Enter / Space toggles. No arrow-key navigation.
- `aria-expanded` and `aria-controls` on the trigger; the panel is a `<section>` with `aria-labelledby` pointing at the trigger.
- Arrow icons are `aria-hidden`.
- No `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [layouts.tsx](examples/layouts.tsx) | FAQ in `grouped` and `separate` | Choosing the frame |
| [sizes.tsx](examples/sizes.tsx) | `size` xs → xl | Matching the density of the screen |
| [states.tsx](examples/states.tsx) | Leading icons, «+ / −» arrow, controlled `type="multiple"`, disabled item | Settings groups |
| [checkout.tsx](examples/checkout.tsx) | `separate` + `collapsible={false}` with form fields | Step-by-step forms |

```tsx
import { Accordion } from "prime-ui-kit";

export function Example() {
  return (
    <Accordion.Root defaultValue="delivery">
      <Accordion.Item value="delivery">
        <Accordion.Header>
          <Accordion.Trigger>
            <span>Сколько идёт доставка?</span>
            <Accordion.Arrow />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>По Москве — 1–2 дня.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

## Mistakes
- Trigger without `Accordion.Header` → wrap it so the section has a heading.
- `value={["a"]}` without `type="multiple"` → arrays only in multiple mode.
- Expecting `className` on Content to style the `<section>` → it styles the inner padded block.
- Accordion used for tab-like switching → use Tabs.

## Related
[Tabs](../tabs/COMPONENT.md) · [Card](../card/COMPONENT.md) · [Stepper](../stepper/COMPONENT.md) · [Divider](../divider/COMPONENT.md)
