# CodeBlock

## About

`CodeBlock` is a static presentation component: it renders a TS or TSX source string with syntax highlighting and a light or dark token palette. The kit exposes a single part, `Root`, which outputs a `pre` whose inner `code` markup is produced by `highlightTsxHtml`.

- **When to use** — partner docs, marketing pages, or in-app help where you need a short snippet that matches the kit’s typography and theme.
- **When to use** — API reference cards, integration guides, or internal tools showing request bodies, configs, or generated output you control.
- **When to use** — pairing a snippet with surrounding copy (`Typography`, labels) where the block should stay non-interactive and read-only.
- **When not to use** — raw or untrusted user input as `code` (markup is injected via `dangerouslySetInnerHTML`).
- **When not to use** — languages other than TS/TSX or cases that need a full parser or line numbers, copy buttons, and tabs (add those in your app layer).
- **When not to use** — when you need a focusable, editable code field (use an input or a dedicated editor instead).

## Composition

- The public API is the `CodeBlock` object with one subpart: **`Root`**.
- **`Root`** renders a native **`pre`**. Highlighted content is injected as a single inner **`code`** element; do not pass `children` or `dangerouslySetInnerHTML` yourself — they are excluded from the props type.
- Pass the source as the **`code`** string prop. Optional **`colorScheme`** selects the highlighting palette (`data-theme` on `pre`).

### Minimal example

```tsx
import { CodeBlock } from "prime-ui-kit";

export function Example() {
  return <CodeBlock.Root code='export const n = 1;' />;
}
```

## Rules

- **`code`** is required. The implementation applies **`trimEnd()`** before highlighting; leading indentation in the string is preserved aside from trailing whitespace on the whole string.
- **`colorScheme`** defaults to **`"light"`**; use **`"dark"`** when the block sits on a dark surface so token colors stay readable.
- **Security:** inner HTML comes from **`highlightTsxHtml`**. Only pass **trusted** strings (constants, vetted CMS content, sanitized backend output).
- **Highlighting** uses a TS/TSX-oriented heuristic in the kit, not a full language grammar — rare syntax may not get the expected classes.
- **No built-in `size`:** font size and line height follow the parent; control rhythm with wrapper layout and typography tokens.
- **Accessibility:** treat the block as static prose context; add **`aria-label`**, **`aria-describedby`**, or nearby headings via standard **`pre`** attributes spread from **`…rest`** when screen readers need an explicit label.
- **Focus:** the component does not set **`tabIndex`**; make it focusable only if your UX requires it.

## API

### CodeBlock.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `code` | `string` | — | Yes | TS/TSX source; trailing whitespace is trimmed with `trimEnd()` before highlighting. |
| `colorScheme` | `CodeBlockColorScheme` (`"light" \| "dark"`) | `"light"` | No | Token palette / `data-theme` on the root `pre`. |
| `className` | `string` | — | No | Additional class on the root `pre`. |
| `…rest` | `Omit<React.HTMLAttributes<HTMLPreElement>, "children" \| "dangerouslySetInnerHTML">` | — | No | Other native `pre` attributes (`id`, `style`, ARIA, `data-*`, event handlers, etc.). `children` and `dangerouslySetInnerHTML` are omitted. |

The package also exports **`CodeBlockColorScheme`** and **`CodeBlockRootProps`** for typing.

## Related

- [Typography](../typography/COMPONENT.md) — headings and body copy around snippets.
- [Button](../button/COMPONENT.md) — switching multiple samples from parent state.
- [Segmented control](../segmented-control/COMPONENT.md) — compact mode or sample switching in toolbars.
- [Kbd](../kbd/COMPONENT.md) — shortcut hints next to prose, without duplicating the code block’s role.
