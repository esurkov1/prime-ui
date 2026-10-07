# Kbd

**Category:** data-display
**Kind:** primitive

> A key cap for a keyboard key or a shortcut, rendered as a native `<kbd>`.

## When to use
- Shortcut hints inside buttons, search fields and menu items («Найти ⌘K», «/»).
- Hotkey reference lists in help panels or settings.
- Keys mentioned in instructions.

## When not to use
- A status, category or counter → use [Badge](../badge/COMPONENT.md).
- A clickable control → use [Button](../button/COMPONENT.md).
- A block of code → use [CodeBlock](../code-block/COMPONENT.md).

## Import
```tsx
import { Kbd } from "prime-ui-kit";
```

## Anatomy
```
Kbd              <kbd>; one key, its badge tier, children (text, Icon or both)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Kbd
`ref` → `HTMLElement`. A native `<kbd>`: one key per `Kbd`; passes its tier to a nested `Icon`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | — | Badge tier, 16 · 20 · 24 · 28 · 32 px high. Without it the key follows the surrounding control one tier down (m → s); outside a control it is `m`. |
| `children` | `ReactNode` | — | Key label, an `Icon`, or an icon and text. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "size">` | — | `className`, `title`, `aria-label` and the other `<kbd>` attributes. |

## Variants
Kbd has one look: monospace text in `text-secondary` on a translucent `fill-subtle-active` wash, no border, weight 500. No `variant`, `tone` or `color`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 16px high, text 12, icon 12 | inside `xs` / `s` controls, dense menus | |
| `s` | 20px high, text 12, icon 12 | inside `m` controls (inherited automatically) | |
| `m` | 24px high, text 12, icon 14 | standalone keys in lists and text | yes (outside controls) |
| `l` | 28px high, text 13, icon 16 | larger help panels | |
| `xl` | 32px high, text 14, icon 16 | onboarding hints | |
| — (omitted) | one tier below the surrounding control: `xs`/`s` → `xs`, `m` → `s`, `l` → `m`, `xl` → `l` | inside Button, Input, menu items | yes (inside controls) |

Minimum width equals the height, so single-character keys are square.

## States
| State | Driven by | DOM |
|---|---|---|
| static | — | no hover, focus, disabled or loading |
| size | `size`, else the surrounding control, else `m` | `data-size` (nominal), `data-tier` (visual tier, drives every dimension) |

## Layout & spacing
- Inline-flex, centered content, never shrinks, `vertical-align: middle`.
- Keys of one chord: `gap: var(--prime-space-1)`; an optional «+» between them is `aria-hidden`.
- In a hotkey list: action left, keys right (`justify-content: space-between`), rows `gap: var(--prime-space-3)`.
- In a field, put the key in `Input.InlineAffix side="end"`.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Renders a native `<kbd>`; its text is read as is.
- Symbol keys (⌘ ⌥ ⇧ ↵) need `aria-label` and `title` («Command», «Shift»).
- A visual «+» between keys gets `aria-hidden="true"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A shortcut as one key per `Kbd`; symbol keys get a name — `aria-label`, `title`. |
| [sizes.tsx](examples/sizes.tsx) | Every badge tier, 16 to 32 px high — `size`. |
| [in-controls.tsx](examples/in-controls.tsx) | Inside a button or a field the key takes the tier one step down; an explicit `size` overrides it. |
| [shortcut-list.tsx](examples/shortcut-list.tsx) | A hotkey reference: action on the left, its keys on the right, an icon inside a key. |

## Mistakes
- `<Kbd>⌘ + Shift + P</Kbd>` → one `Kbd` per key with an `aria-hidden` «+» between.
- `<Kbd>⌘</Kbd>` without a name → add `aria-label="Command"`.
- An explicit `size="m"` inside an `m` button → drop `size`; the key follows the button one tier down.
- A `<span>` styled as a key, or a `Badge` used for a key → use `Kbd`.

## Related
- **Built from:** —
- **See also:** [Badge](../badge/COMPONENT.md) (same tiers), [CommandMenu](../command-menu/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md)
