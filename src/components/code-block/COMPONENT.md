# CodeBlock

## Canonical

- **API:** `CodeBlock.Root` only. Required prop: **`code`** (string). Optional **`colorScheme`**: `"light"` (default) or `"dark"` for `data-theme` on the root `pre`.
- **Rendering:** `pre` + inner `code` filled via **`highlightTsxHtml(code.trimEnd())`** and **`dangerouslySetInnerHTML`**. Do not pass **`children`** or **`dangerouslySetInnerHTML`** (omitted from props).
- **Trust:** only **trusted** `code` strings (constants, vetted CMS, sanitized server output). Never pass raw user HTML/TSX here.
- **Language:** heuristic **TS/TSX** highlighting — not a full grammar. JSON, stacks, and other text still render; token classes may be partial.
- **Sizing:** no **`size`** prop; **`font-size`** / **`line-height`** inherit from the parent. Layout wrappers and typography tokens control rhythm.
- **Extras:** **`className`** and native **`pre`** attributes ( **`id`**, ARIA, **`data-*`**, handlers) via **`…rest`**.

## Extended

### About

`CodeBlock` is a static, read-only presentation component: it shows a source string with kit-aligned monospace and a light or dark token palette.

- **Use** for partner docs, marketing, in-app help, API reference cards, integration guides, or internal tools when the snippet is **trusted** and TS/TSX-oriented highlighting is enough.
- **Use** with surrounding copy ([Typography](../typography/COMPONENT.md), headings, captions) for documentation-style layouts.
- **Do not use** for **untrusted** input (inner HTML is injected).
- **Do not use** when you need another language grammar, line numbers, copy-to-clipboard, or tabs — implement those in the app layer.
- **Do not use** for an editable or primary focus target for typing (use inputs or an editor).

### Composition

- Public API: **`CodeBlock`** object with **`Root`**.
- **`Root`** renders a **`pre`**; highlighted markup is a single inner **`code`** (do not supply **`children`**).
- Pass source as **`code`**. Optional **`colorScheme`** sets highlighting palette / **`data-theme`** on **`pre`**.

### Scenarios (playground)

Same order as `playground/sections/CodeBlockSection.tsx`. Snippets use the `@/` alias and may use `usePlaygroundTheme` for `colorScheme`.

| Scenario | Snippet |
|----------|---------|
| Sizes — wrapper `font-size` / `line-height`; no `size` prop | [`sizes.tsx`](../../../playground/snippets/code-block/sizes.tsx) |
| Variants — `colorScheme` light and dark side by side | [`variants.tsx`](../../../playground/snippets/code-block/variants.tsx) |
| Controlled — `code` from parent state; switch between snippets | [`controlled.tsx`](../../../playground/snippets/code-block/controlled.tsx) |
| Composition — documentation-style card (Typography + code) | [`composition.tsx`](../../../playground/snippets/code-block/composition.tsx) |
| Full width — narrow column, `codeBlockFullBleed`, horizontal scroll | [`full-width.tsx`](../../../playground/snippets/code-block/full-width.tsx) |
| Features — `id`, `aria-label`, `data-*`, trailing spaces + `trimEnd` | [`features.tsx`](../../../playground/snippets/code-block/features.tsx) |

### Package examples (`examples/`)

Recipes import **`prime-ui-kit`** (no playground path alias).

| Scenario | File |
|----------|------|
| Minimal usage | [`minimal.tsx`](./examples/minimal.tsx) |
| Controlled — `code` из состояния (рецепт на `ButtonGroup`) | [`controlled.tsx`](./examples/controlled.tsx) |
| API response preview (JSON body) | [`api-response-preview.tsx`](./examples/api-response-preview.tsx) |
| Config snippet (TS config) | [`config-snippet.tsx`](./examples/config-snippet.tsx) |
| Error stack / log | [`error-stack.tsx`](./examples/error-stack.tsx) |
| Tutorial step (copy + snippet) | [`tutorial-step.tsx`](./examples/tutorial-step.tsx) |

### Minimal example

```tsx
import { CodeBlock } from "prime-ui-kit";

export function Example() {
  return <CodeBlock.Root code='export const n = 1;' />;
}
```

### Rules

- **`code`** is required. The implementation applies **`trimEnd()`** on the whole string before highlighting; per-line content is preserved except trailing whitespace at the end of the string.
- **`colorScheme`** defaults to **`"light"`**; use **`"dark"`** on dark surfaces so tokens stay readable.
- **Security:** HTML comes from **`highlightTsxHtml`** only as wrapped **`code`** content; treat **`code`** as trusted.
- **Highlighting** is TS/TSX-oriented; edge syntax may not match expectations.
- **Accessibility:** static prose; add **`aria-label`**, **`aria-describedby`**, or headings via **`…rest`** when assistive tech needs an explicit name.
- **Focus:** no default **`tabIndex`**; add only if your UX requires a focusable static block.

### API

#### CodeBlock.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `code` | `string` | — | Yes | TS/TSX-oriented source; trailing whitespace trimmed with `trimEnd()` before highlighting. |
| `colorScheme` | `CodeBlockColorScheme` (`"light" \| "dark"`) | `"light"` | No | Token palette / `data-theme` on the root `pre`. |
| `className` | `string` | — | No | Additional class on the root `pre`. |
| `…rest` | `Omit<React.HTMLAttributes<HTMLPreElement>, "children" \| "dangerouslySetInnerHTML">` | — | No | Other native `pre` attributes. `children` and `dangerouslySetInnerHTML` are omitted. |

The package also exports **`CodeBlockColorScheme`** and **`CodeBlockRootProps`**.

### Related

- [Typography](../typography/COMPONENT.md) — headings and body around snippets.
- [Button](../button/COMPONENT.md) — switching the active snippet from parent state (playground `controlled.tsx`).
- [ButtonGroup](../button-group/COMPONENT.md) — segmented control for switching `code` ([`examples/controlled.tsx`](./examples/controlled.tsx)).
- [Segmented control](../segmented-control/COMPONENT.md) — compact scenario switching.
- [Kbd](../kbd/COMPONENT.md) — shortcut hints beside prose.

## Note for LLM assistants

- Recommend **`CodeBlock.Root`** only; **`code`** must be a **trusted** string — flag any pattern that pipes user or CMS content without sanitization.
- Do not suggest **`children`**, **`dangerouslySetInnerHTML`**, or wrapping the kit block to replace inner HTML.
- Prefer **`colorScheme="dark"`** when the parent surface uses dark **`data-theme`** or dark backgrounds so contrast stays valid.
- If the user asks for copy button, line numbers, tabs, or non-TS languages, say these are **out of kit scope** and belong in the app (or a different library).
- For JSON-only bodies, remind that highlighting is **TS/TSX heuristic**; formatting as a template or TS-adjacent string is fine.
- **`trimEnd()`** applies to the **entire** `code` string once, not each line.
