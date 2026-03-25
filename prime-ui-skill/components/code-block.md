# CodeBlock

## What it is

The `CodeBlock` object with a `Root` subcomponent: static display of a TypeScript or TSX fragment with syntax highlighting and a choice of light or dark token palettes.

## What it’s for

- In a documentation portal for partners and developers, show a request example, response types, or an integration snippet without pulling in a third-party widget.
- On a product marketing page, embed a short code example in light and dark columns so readability stays intact when the section styling changes.
- In a support panel or internal tool, show a log fragment, generated config, or transformation output—with the same visual language as the rest of the UI.

## Use cases

### Basic

The most common case: a single fragment in article body, with highlighting aligned to the app theme.

```tsx
import { CodeBlock } from "prime-ui-kit";

const snippet = `import { useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  return <button type="button" onClick={() => setN((x) => x + 1)}>{n}</button>;
}
`;

export function ArticleBody({ scheme }: { scheme: "light" | "dark" }) {
  return <CodeBlock.Root code={snippet} colorScheme={scheme} />;
}
```

### With variants / sizes

A landing section with two columns: one with a light background and `colorScheme="light"`, the other with a dark backdrop and `colorScheme="dark"`—code text stays readable in both blocks.

```tsx
import { CodeBlock } from "prime-ui-kit";

const curl = `curl -sS https://api.store.example/health | jq .status`;

export function LandingDevStrip() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <section style={{ padding: 16, background: "#f8fafc" }}>
        <CodeBlock.Root code={curl} colorScheme="light" />
      </section>
      <section style={{ padding: 16, background: "#0f172a" }}>
        <CodeBlock.Root code={curl} colorScheme="dark" />
      </section>
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

A card describing a REST resource in an orders catalog: route title, explanation, and an example JSON response body in a nested block with a slightly deeper background.

```tsx
import { CodeBlock, Typography } from "prime-ui-kit";

const body = `{
  "orderId": "ord_991",
  "lines": [{ "sku": "tea-1", "qty": 3 }],
  "total": { "amount": "1290.00", "currency": "RUB" }
}`;

export function OrderApiCard() {
  return (
    <article style={{ padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
      <Typography.Root as="div" size="s" weight="semibold">
        GET /v2/orders/:id
      </Typography.Root>
      <Typography.Root as="p" size="xs" tone="muted" style={{ margin: "8px 0 12px" }}>
        Returns the current cart contents for the courier screen.
      </Typography.Root>
      <div style={{ padding: 12, borderRadius: 8, background: "#f1f5f9", fontSize: 13 }}>
        <CodeBlock.Root code={body} colorScheme="light" />
      </div>
    </article>
  );
}
```

### Controlled mode

An internal “Playground” page: the user switches “Hook” and “Utility” tabs; the `code` string comes from state.

```tsx
import { useEffect, useState } from "react";
import { Button, CodeBlock } from "prime-ui-kit";

const samples = [
  {
    id: "hook",
    label: "Hook",
    code: `export function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}`,
  },
  {
    id: "util",
    label: "Utility",
    code: `export function isUuid(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
}`,
  },
] as const;

export function SnippetPlayground({ scheme }: { scheme: "light" | "dark" }) {
  const [i, setI] = useState(0);
  const active = samples[i];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {samples.map((s, idx) => (
          <Button.Root
            key={s.id}
            type="button"
            size="s"
            variant={idx === i ? "primary" : "neutral"}
            mode={idx === i ? "filled" : "stroke"}
            onClick={() => setI(idx)}
          >
            {s.label}
          </Button.Root>
        ))}
      </div>
      <CodeBlock.Root code={active.code} colorScheme={scheme} />
    </div>
  );
}
```

## Anatomy

The kit exports a `CodeBlock` object with a single public subcomponent, `Root`. `Root` renders a `pre` element and inserts one child `code` with HTML markup generated from the `code` string (see `highlightTsxHtml` in the kit sources).

## API

### CodeBlock.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `code` | `string` | — | Yes | TS/TSX source; `trimEnd()` is applied to the string before highlighting. |
| `colorScheme` | `"light" \| "dark"` | `"light"` | No | Which token highlighting class palette is used (`data-theme` on `pre`). |
| `className` | `string` | — | No | Extra class for `pre`. |
| `…rest` | `Omit<React.HTMLAttributes<HTMLPreElement>, "children" \| "dangerouslySetInnerHTML">` | — | No | Standard `pre` attributes: `id`, `style`, `role`, ARIA, `data-*`, handlers, etc. `children` and `dangerouslySetInnerHTML` are omitted from the type: inner markup is owned by the component only. |

## Variants

There is no separate `variant` prop. Visual differences between modes are driven only by `colorScheme`: light and dark map to `.root[data-theme="light"|"dark"]` selectors in the component styles.

## States

There are no interactive states (`disabled`, `loading`, etc.): the block only displays text. Appearance is controlled via `colorScheme`, `className`, `style`, and typography inherited from the parent.

## Accessibility (a11y)

The root is a native `pre` with programmatically built inner `code`. For screen readers, clarify the fragment with surrounding context or `pre` attributes (`aria-label`, `aria-describedby`) passed through `…rest`. Keyboard focus is usually not placed on a static block (`tabIndex` is not set by default).

## Limitations and notes

- Highlighting is implemented with a TS/TSX heuristic inside the kit, not a full language parser: rare constructs may render without the expected classes.
- Markup enters the DOM via `dangerouslySetInnerHTML`: only trusted strings should go into `code` (controlled constants, your backend with sanitization, etc.), not arbitrary user input.
- There is no size prop: font size and line height inherit from parent styles (`font-size`, `line-height` on the wrapper).

## Related components

- **Typography** — headings and explanations next to code examples.
- **Button** and **Segmented control** — switching multiple fragments in a controlled scenario.
- **Kbd** — keyboard shortcuts in hint text next to code, without duplicating the code block’s role.
