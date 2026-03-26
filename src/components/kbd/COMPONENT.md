# Kbd

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

`Kbd` is a single-part primitive: `Kbd.Root` renders a semantic `kbd` with kit styling so key names and shortcut fragments read as UI chrome, not body copy.

- **When to use** — show hotkeys next to menu items, toolbar actions, or command labels in dense app chrome.
- **When to use** — mark one or a few keys inside helper text, field hints, or modal footers where the shortcut is part of the instruction.
- **When to use** — pair with the same `size` tier as nearby controls so typography and nested icons stay aligned with [Input](../input/COMPONENT.md), [Button](../button/COMPONENT.md), or other sized surfaces.
- **When not to use** — as the only actionable control; shortcuts still need a real [Button](../button/COMPONENT.md), [Link button](../link-button/COMPONENT.md), or focusable target.
- **When not to use** — when you need the element to listen for or mirror actual keyboard input; this component is display-only.
- **When not to use** — for long prose or documentation pages where plain text or a code font is clearer than chip-style keys.

## Composition

- **`Kbd`** exports **`Root` only** — a flat API with no nested parts or ordering rules beyond wrapping the key label (text, icons, or mixed `ReactNode`) inside **`Kbd.Root`**.
- **`Root`** renders a native **`kbd`**, applies `data-size`, and wraps **`children`** in **`ControlSizeProvider`** so nested **`Icon`** (and similar) pick up the same control-size context.

### Minimal example

```tsx
import { Kbd } from "prime-ui-kit";

export function Example() {
  return <Kbd.Root>Esc</Kbd.Root>;
}
```

## Rules

- **Sizing:** optional **`size`** is **`"s"` \| `"m"` \| `"l"` \| `"xl"`** (`KbdSize`). If omitted, the effective size comes from the nearest ancestor **`ControlSizeProvider`** (via **`useOptionalControlSize`**), mapped with **`controlSurfaceToInputSize`** — **`"xs"`** on the control surface becomes **`"s"`** on the `kbd`. If there is no context, the fallback is **`"m"`**.
- **Presentation only:** the component does not handle key events, focus management, or OS shortcut state; it only displays a label.
- **Semantics:** there is no **`asChild`** or element polymorphism — the root is always **`kbd`**.
- **Accessibility:** semantic **`kbd`** helps assistive tech distinguish key labels from surrounding text. For chord hints, prefer several **`Kbd.Root`** instances with short separators (**`+`**, “or”) **outside** the keys, or mark decorative separators with **`aria-hidden`**, so they are not announced as part of each key. Use **`title`** (or visible copy) when the shortcut needs extra explanation; do not rely on surface color alone for meaning.
- **Platform copy:** glyphs such as **⌘** vs **Ctrl** are a product/i18n choice; the kit does not normalize platform key names.
- **Styling:** one built-in look (raised surface, border, light shadow). Further changes go through **`className`** or project styles, not a separate **`variant`** prop.

## API

### Kbd.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `KbdSize` (`"s" \| "m" \| "l" \| "xl"`) | from context or `"m"` | No | Nominal size; without the prop, taken from `ControlSizeProvider` if present, otherwise `"m"`; `xs` context maps to `s`. |
| children | `React.ReactNode` | — | Yes | Key label, icons, or mixed content. |
| className | `string` | — | No | Additional class on the `kbd`. |
| …rest | `Omit<React.HTMLAttributes<HTMLElement>, "size">` | — | No | Native attributes (`title`, `hidden`, `aria-*`, `data-*`, etc.). |

## Related

- [Button](../button/COMPONENT.md) — primary action a shortcut often refers to.
- [Link button](../link-button/COMPONENT.md) — text-style actions that may show a key hint beside the label.
- [Input](../input/COMPONENT.md) — fields whose `hint` or label area can include `Kbd`.
- [Textarea](../textarea/COMPONENT.md) — multiline fields with the same hint pattern where applicable.
- [Select](../select/COMPONENT.md) — triggers and lists that may document shortcuts.
- [Tooltip](../tooltip/COMPONENT.md) — longer explanations that can repeat keys with `Kbd`.
- [Command menu](../command-menu/COMPONENT.md) — lists that commonly show per-item shortcuts.
