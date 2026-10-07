# Kbd

**Category:** data-display

> A key cap for a keyboard key or a shortcut, rendered as a native `<kbd>`.

## When to use
- Shortcut hints inside buttons, search fields and menu items ("Найти ⌘K", "/").
- Hotkey reference lists in help panels or settings.
- Keys mentioned in instructions.

## When not to use
- A status, category or counter → use [Badge](../badge/COMPONENT.md).
- A removable value → use [Tag](../tag/COMPONENT.md).
- A clickable control → use [Button](../button/COMPONENT.md).
- A block of code → use [CodeBlock](../code-block/COMPONENT.md).

## Import
```tsx
import { Kbd } from "prime-ui-kit";
```

## API

### Kbd.Root
Forwards `ref` to the `<kbd>` element. No `asChild`. Leaf component: one key per `Kbd.Root`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Key label, an icon, or icon + text. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` (`ControlSize`) | — (inherited, else `"m"`) | Badge tier. Without it the key follows the surrounding control one tier down; outside a control it is `m`. |
| `className` | `string` | — | Extra class on the `<kbd>`. |

+ native props of `<kbd>` (`HTMLAttributes<HTMLElement>` without `size`), e.g. `title`, `aria-label`. `data-size` / `data-tier` are always set by the component.

## Variants

Kbd has one look: monospace text in `text-secondary` on a translucent `fill-subtle-active` wash, no border, weight 500. No `variant`, `tone` or `color`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 16px high, padding 4, text 12, icon 12 | Inside `xs`/`s` buttons, dense menus | |
| `s` | 20px high, padding 6, text 12, icon 12 | Inside `m` controls (inherited automatically) | |
| `m` | 24px high, padding 8, text 12, icon 14 | Standalone keys in lists and text | yes (outside controls) |
| `l` | 28px high, padding 10, text 13, icon 16 | Larger help panels | |
| `xl` | 32px high, padding 12, text 14, icon 16 | Onboarding / hero hints | |

Minimum width equals the height, so single-character keys are square.

**Combinations**
- Recommended: no `size` inside controls; one `Kbd.Root` per key in a chord.
- Allowed: an explicit smaller `size` inside a control for a secondary hint (`<Kbd.Root size="xs">↵</Kbd.Root>` in an `m` button).
- Avoid: one `Kbd.Root` holding a whole chord with "+" text inside; symbols without an accessible name.

**Sizes**
Same tiers as Badge and Tag. Without `size` inside a control: `xs`/`s` → `xs`, `m` → `s`, `l` → `m`, `xl` → `l`.

## States
Kbd is static: no hover, focus, disabled or loading.

| Attribute | Driven by | Notes |
|---|---|---|
| `data-size` | `size`, else surrounding control size, else `m` | Nominal size. |
| `data-tier` | resolved tier | One step down from the control when inherited. Drives dimensions. |

Kbd also provides its tier to children through the control-size context, so a nested `Icon` matches the key.

## Layout & spacing
- Inline-flex, centered content, never shrinks, vertical-align middle.
- Keys of one chord: `gap: var(--prime-space-1)`; an optional "+" between them is `aria-hidden`.
- In a hotkey list: action text left, chord right (`justify-content: space-between`), rows `gap: var(--prime-space-3)`.
- In a field, put Kbd in `Input.InlineAffix side="end"`.

## Accessibility
- Renders a native `<kbd>`; its text is read as is.
- Symbol keys (⌘ ⌥ ⇧ ↵) need `aria-label` and preferably `title` ("Command", "Shift").
- Visual separators like "+" between keys get `aria-hidden="true"`.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | A chord in tiers xs–xl | Standalone shortcuts in text and docs |
| [in-controls.tsx](examples/in-controls.tsx) | ⌘ + K chord in Button s/m/l, explicit `xs` ↵ with `aria-label`, key in a search field | Shortcut hints inside controls |
| [modifier-keys.tsx](examples/modifier-keys.tsx) | ⌘ + ⇧ + P with `aria-label` / `title`, hidden "+" | Symbol keys |
| [shortcut-list.tsx](examples/shortcut-list.tsx) | Hotkey reference list, key with icon and text | Help panels and settings |

```tsx
import { Kbd } from "prime-ui-kit";

export function SaveHint() {
  return (
    <span>
      <Kbd.Root aria-label="Command" title="Command">
        ⌘
      </Kbd.Root>
      <Kbd.Root>S</Kbd.Root>
    </span>
  );
}
```

## Mistakes
- `<Kbd.Root>⌘ + Shift + P</Kbd.Root>` → one `Kbd.Root` per key with an `aria-hidden` "+" between.
- `<Kbd.Root>⌘</Kbd.Root>` without a name → add `aria-label="Command"`.
- `<Button.Root>Найти <Kbd.Root size="m">⌘K</Kbd.Root></Button.Root>` → drop `size` and use one key per `Kbd.Root`: `<Kbd.Root aria-label="Command">⌘</Kbd.Root><Kbd.Root>K</Kbd.Root>`; the keys follow the button one tier down.
- A `<span>` styled as a key → use `Kbd.Root`.
- `Badge` used for a key → use `Kbd.Root` (monospace, semantic `<kbd>`).

## Related
- [Badge](../badge/COMPONENT.md), [Tag](../tag/COMPONENT.md) — same tiers.
- [CommandMenu](../command-menu/COMPONENT.md) — shortcut hints in the footer.
- [Dropdown](../dropdown/COMPONENT.md) — shortcuts in menu items.
