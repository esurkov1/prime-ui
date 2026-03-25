# Kbd

## What it is

The `Kbd.Root` component is styled markup for indicating a key or a step in a keyboard shortcut in the UI (rendered as a `kbd` element).

## What it’s for

- In text editors, task trackers, and IDE-like screens, show hotkeys next to menu items and actions without repeating long wording on every line.
- In settings forms and admin cards, briefly label shortcuts for “Save”, “Cancel”, or “Submit” so users see them in the same visual language as other controls.
- In step-by-step onboarding or a product tour, highlight one or two keys in hint text so they read as UI elements, not plain paragraph text.

## Use cases

### Basic

A single key in a hint for an action (e.g. closing a dialog):

```tsx
import { Kbd } from "prime-ui-kit";

export function CloseHint() {
  return (
    <p>
      Press <Kbd.Root>Esc</Kbd.Root> to close the window.
    </p>
  );
}
```

### With variants / sizes

A shortcuts table in the “Help” section of a web analytics app: different sizes for a dense grid and for emphasis in a block heading.

```tsx
import { Kbd } from "prime-ui-kit";

export function AnalyticsShortcutsLegend() {
  return (
    <ul>
      <li>
        Refresh report: <Kbd.Root size="s">R</Kbd.Root>
      </li>
      <li>
        Export: <Kbd.Root size="l">Ctrl</Kbd.Root> + <Kbd.Root size="l">E</Kbd.Root>
      </li>
    </ul>
  );
}
```

### In context (form / modal / sidebar / …)

Footer of a confirmation modal in e-commerce: action text with a compact shortcut for power users.

```tsx
import { Button, Kbd } from "prime-ui-kit";

export function CheckoutConfirmFooter() {
  return (
    <div>
      <Button.Root type="submit" variant="primary" mode="filled" size="m">
        Pay
      </Button.Root>
      <span>
        or <Kbd.Root size="m">Enter</Kbd.Root>
      </span>
    </div>
  );
}
```

### Size inherited from context

A hint inside a search field in a parts catalog: key size matches the input without repeating `size` on every `Kbd`.

```tsx
import { Input, Kbd } from "prime-ui-kit";

export function PartsSearchField() {
  return (
    <Input.Root
      size="l"
      label="Search"
      hint={
        <>
          Quick focus: <Kbd.Root>/</Kbd.Root>
        </>
      }
    >
      <Input.Wrapper>
        <Input.Field placeholder="Part number or name" />
      </Input.Wrapper>
    </Input.Root>
  );
}
```

## Anatomy

Flat structure: the `Kbd` object exports a single subcomponent, `Root`. `Root` renders `kbd` and wraps `children` in `ControlSizeProvider` so nested icons inherit scale.

## API

### Kbd.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `size` | `"s" \| "m" \| "l" \| "xl"` | context or `"m"` | No | Nominal size; without the prop, taken from `ControlSizeProvider`, otherwise `"m"`; `xs` context maps to size `s`. |
| `className` | `string` | — | No | Extra class for `kbd`. |
| `children` | `React.ReactNode` | — | Yes | Text, icons, or mixed content. |
| `…rest` | `Omit<React.HTMLAttributes<HTMLElement>, "size">` | — | No | Including `title`, `hidden`, ARIA, and `data-*`. |

## Variants

There is no separate `variant` prop: the component has one visual style (raised-surface background, thin border, light shadow). Further styling is only via `className` and project tokens/styles.

## States

There are no built-in states like `disabled` or `loading`: the element does not perform an action by itself. Behavior and accessibility are configured with markup attributes (`title`, `hidden`, `aria-hidden`, etc.) passed to `Root`.

## Accessibility (a11y)

Semantic `kbd` helps assistive technologies distinguish key labels from normal text. For multi-key shortcuts, split into several `Kbd.Root` instances and keep short separators (`+`, “or”) outside `kbd` or with `aria-hidden` so decorative characters are not announced twice. `title` is appropriate for semantic hints about the shortcut. Do not rely on chip color as the only carrier of meaning.

## Limitations and notes

The component does not handle key events or sync with the OS—it only displays a label. It does not replace a button or link. Labels like “⌘” are platform-dependent—copy and step breakdown are product decisions. `Kbd` has no polymorphic `asChild`: the root is always `kbd`.

## Related components

Often seen nearby: **Button**, **Link button**—the action the shortcut refers to; **Input**, **Textarea**, **Select**—controls whose hints include `Kbd`; **Tooltip**—a popover with longer copy where keys can be repeated with `Kbd`; **Command menu**—command lists that show shortcuts.
