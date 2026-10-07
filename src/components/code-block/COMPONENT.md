# CodeBlock

**Category:** data-display

> A static TypeScript / TSX snippet with syntax highlighting, on a sunken panel or bare inside a host.

## When to use
- Code samples in docs, settings ("API key usage") and onboarding.
- Shell commands and config fragments (long lines scroll inside).
- An API response sample next to its description.

## When not to use
- A keyboard key or shortcut → use [Kbd](../kbd/COMPONENT.md).
- Editable code or text → use [Textarea](../textarea/COMPONENT.md).
- An inline identifier inside a sentence → use a plain `<code>` element in text ([Typography](../typography/COMPONENT.md)).
- A live preview with a code tab → use [ExampleFrame](../example-frame/COMPONENT.md).

## Import
```tsx
import { CodeBlock } from "prime-ui-kit";
```
Exported types: `CodeBlockRootProps`, `CodeBlockVariant`, `CodeBlockColorScheme`.

## API

### CodeBlock.Root
Renders `<pre><code>…</code></pre>`. Forwards `ref` to the `<pre>`. No `asChild`. Leaf component.

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | — (required) | TS/TSX source; trailing whitespace is trimmed, then highlighted (the source is escaped). |
| `variant` | `"soft" \| "ghost"` (`CodeBlockVariant`) | `"soft"` | Treatment. |
| `colorScheme` | `"light" \| "dark"` (`CodeBlockColorScheme`) | — (follows the page theme) | Forces a theme for this block only (`data-theme` on the `<pre>`). |
| `tabIndex` | `number` | `0` for `soft`, none for `ghost` | Keeps a scrolling soft block reachable from the keyboard; pass `-1` when it never overflows. |
| `className` | `string` | — | Extra class on the `<pre>`. |

+ native `<pre>` props except `children` and `dangerouslySetInnerHTML` (the markup is produced by the component).

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | `fill-muted` panel, radius 8, padding 12 × 16, `code` text role (13/20 mono), horizontal scroll, Tab stop | Standalone snippets anywhere | yes |
| `ghost` | Bare `pre`: no padding, transparent, font size and line height inherited from the host | Inside a host that draws its own panel (a tinted callout, a custom card) | |

### colorScheme
| Value | Looks like | Use when | Default |
|---|---|---|---|
| unset | Token colors and fill follow the page theme | Normal case | yes |
| `light` | Light palette for the block; soft fill switches to `bg-raised` of that scheme | A light code sample inside a dark page | |
| `dark` | Dark palette for the block; soft fill switches to `bg-raised` of that scheme | A dark "terminal" sample inside a light page | |

Syntax tokens: keywords purple (weight 500), strings teal, numbers orange, JSX tags blue, comments muted italic — all from palette text tokens, so they pass contrast in both themes.

**Combinations**
- Recommended: `soft` with no `colorScheme`; `aria-label` on blocks that are the only content of a region.
- Allowed but rare: `soft` + `colorScheme="dark"` for a terminal look; `ghost` inside a custom panel.
- Avoid: `ghost` on a bare page (no box, no padding, nothing separates the code); several forced schemes on one screen.

**Sizes**
CodeBlock has no `size`: `soft` uses the `code` text role, `ghost` inherits the host's type.

## States
| State / attribute | Driven by | Notes |
|---|---|---|
| `data-variant` | `variant` | Always set (default `soft`). |
| `data-theme="light" \| "dark"` | `colorScheme` | Re-scopes the palette for the block. |
| focus-visible | keyboard focus on a `soft` block | Inset focus ring. |

No interactive state; `code` is the only content and can come from state (re-highlighted on change).

## Layout & spacing
- `max-width: 100%`; the block takes the column width and long lines scroll horizontally (`white-space: pre`, tab size 2).
- Heading / text → code block: `--prime-space-2` to `--prime-space-4`.
- Width comes from the layout; constrain the column (`max-width: var(--prime-layout-reading-max-width)` for docs), not the block.

## Accessibility
- Native `<pre>` / `<code>`; screen readers read the text.
- A `soft` block is focusable (`tabIndex=0`) so overflowing content can be scrolled with arrow keys; pass `tabIndex={-1}` when it never overflows.
- Give standalone blocks an `aria-label` ("Команда установки").
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [variants.tsx](examples/variants.tsx) | `soft` vs `ghost` inside a host panel | Choosing the treatment |
| [color-scheme.tsx](examples/color-scheme.tsx) | `colorScheme="light"` and `"dark"` | A fixed-scheme sample |
| [surfaces.tsx](examples/surfaces.tsx) | One-line command on canvas, card and floating layer | Checking contrast on any surface |
| [controlled.tsx](examples/controlled.tsx) | `code` from state switched by a ButtonGroup | Alternative snippets |
| [long-lines.tsx](examples/long-lines.tsx) | Long shell command scrolling inside a narrow column | Commands and configs |
| [api-docs.tsx](examples/api-docs.tsx) | Heading, description and response sample | Docs and integration guides |

```tsx
import { CodeBlock } from "prime-ui-kit";

export function InstallCommand() {
  return <CodeBlock.Root code="bun add prime-ui-kit" aria-label="Команда установки" />;
}
```

## Mistakes
- Passing JSX children → pass the source string to `code`.
- `<pre style={{ background: … }}>` for code → use `CodeBlock.Root`.
- `variant="ghost"` directly on the page → use `soft`, or wrap `ghost` in a panel.
- Wrapping a soft block in another bordered box → the block is already a filled panel.
## Related
- [Kbd](../kbd/COMPONENT.md) — keys and shortcuts.
- [ExampleFrame](../example-frame/COMPONENT.md) — live preview with source.
- [Typography](../typography/COMPONENT.md) — headings and text around code.
