# CodeBlock

**Category:** data-display
**Kind:** primitive

> A static TypeScript / TSX snippet with syntax highlighting, on a sunken panel or bare inside a host.

## When to use
- Code samples in docs, settings («API key usage») and onboarding.
- Shell commands and config fragments (long lines scroll inside).
- An API response sample next to its description.

## When not to use
- A keyboard key or shortcut → use [Kbd](../kbd/COMPONENT.md).
- Editable code or text → use [Textarea](../textarea/COMPONENT.md).
- An inline identifier inside a sentence → [Typography](../typography/COMPONENT.md) `variant="code"`.
- A live preview with a code tab → use [ExampleFrame](../example-frame/COMPONENT.md).

## Import
```tsx
import { CodeBlock } from "prime-ui-kit";
```

## Anatomy
```
CodeBlock        <pre>; variant, colorScheme (data-theme)
└─ code          <code> with highlighted tokens from the `code` string
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### CodeBlock
`ref` → `HTMLPreElement`. Renders `<pre><code>`; the markup comes from the escaped, highlighted `code`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | — (required) | TS / TSX source; trailing whitespace is trimmed, then highlighted. |
| `variant` | `"soft" \| "ghost"` | `"soft"` | `soft` — sunken panel with padding and the `code` text role; `ghost` — bare `pre` that inherits type and background from its host. |
| `colorScheme` | `"light" \| "dark"` | — | Fixes the theme for this block only (`data-theme`). Omit to follow the page theme. |
| `tabIndex` | `number` | — | Default `0` for `soft` (a scrolling block stays reachable from the keyboard), none for `ghost`; pass `-1` when it never overflows. |
| `…rest` | `Omit<HTMLAttributes<HTMLPreElement>, "children" \| "dangerouslySetInnerHTML">` | — | `className`, `aria-label` and the other `<pre>` attributes. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | `fill-muted` panel, radius 8, padding 12 × 16, `code` text role, horizontal scroll, Tab stop | standalone snippets anywhere | yes |
| `ghost` | bare `pre`: no padding, transparent, type inherited from the host | inside a host that draws its own panel | |

### colorScheme
| Value | Looks like | Use when | Default |
|---|---|---|---|
| — (omitted) | token colors and fill follow the page theme | normal case | yes |
| `light` | light palette; the soft fill becomes that scheme's `bg-raised` | a light sample inside a dark page | |
| `dark` | dark palette; the soft fill becomes that scheme's `bg-raised` | a terminal-like sample inside a light page | |

Syntax tokens: keywords purple (weight 500), strings teal, numbers orange, JSX tags blue, comments muted italic — palette text tokens, readable in both themes.

## States
| State | Driven by | DOM |
|---|---|---|
| treatment | `variant` | `data-variant` (always set) |
| fixed scheme | `colorScheme` | `data-theme` re-scopes the palette for the block |
| focus-visible | keyboard focus on a `soft` block | inset focus ring |

## Layout & spacing
- `max-width: 100%`; the block takes the column width and long lines scroll horizontally (`white-space: pre`, tab size 2).
- Heading / text → code block: `--prime-space-2` to `--prime-space-4`.
- Constrain the column (`--prime-layout-reading-max-width` for docs), not the block.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focuses a `soft` block so overflowing code can be scrolled. |
| `←` · `→` | Scroll a focused block horizontally. |

### ARIA
- Native `<pre>` / `<code>`; screen readers read the text.
- A `soft` block is a Tab stop (`tabIndex=0`); pass `tabIndex={-1}` when it never overflows.
- Give standalone blocks an `aria-label` («Команда установки»).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An API response sample on a sunken panel, named for screen readers — `code`, `aria-label`. |
| [variants.tsx](examples/variants.tsx) | A sunken panel and a bare block that takes type and background from its host — `variant`. |
| [color-scheme.tsx](examples/color-scheme.tsx) | A block fixed to one scheme looks the same in both page themes — `colorScheme`. |
| [narrow.tsx](examples/narrow.tsx) | In a narrow column a long line scrolls inside the block and never wraps; Tab, then arrow keys. |

## Mistakes
- Passing JSX children → pass the source string to `code`.
- A hand-styled `<pre>` for code → use `CodeBlock`.
- `variant="ghost"` directly on the page → use `soft`, or put `ghost` inside a panel.
- Wrapping a soft block in another box → the block is already a filled panel.

## Related
- **Built from:** —
- **See also:** [Kbd](../kbd/COMPONENT.md), [ExampleFrame](../example-frame/COMPONENT.md), [Typography](../typography/COMPONENT.md)
