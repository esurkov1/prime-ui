# LinkButton

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A single-component link (`LinkButton.Root`) with control typography and padding, underline on hover and focus, and four size options.

## When to use it

- **In-app navigation** — moving between screens and sections when you need a **text-link** look, not a filled button.
- **Help and legal copy** — inline links in paragraphs to privacy policy, instructions, or downloadable files.
- **Dense panels and action captions** — compact links next to fields (`s` size) or prominent calls to action in cards (`l` / `xl`) without changing a visual “variant” — only scale.

## Use cases

Each example reflects a different product context and prop set.

### Basic

A typical link in the header or sidebar to the main section.

```tsx
import { LinkButton } from "prime-ui-kit";

export function AppHeaderHome() {
  return (
    <nav aria-label="Main navigation">
      <LinkButton.Root href="/app" size="m">
        Home
      </LinkButton.Root>
    </nav>
  );
}
```

### With sizes

A space-constrained area (e.g. report footer): several links with different `size` for hierarchy without swapping components.

```tsx
import { LinkButton } from "prime-ui-kit";

export function ReportFooterLinks() {
  return (
    <footer className="report-footer">
      <LinkButton.Root href="/reports/archive" size="s">
        Report archive
      </LinkButton.Root>
      <LinkButton.Root href="/reports/export" size="m">
        Export CSV
      </LinkButton.Root>
      <LinkButton.Root href="/reports/help" size="l">
        How to read the report
      </LinkButton.Root>
    </footer>
  );
}
```

### In context (card and helper text)

A link inside a settings card next to an option description — the user goes to detailed instructions.

```tsx
import { LinkButton } from "prime-ui-kit";

export function IntegrationCard() {
  return (
    <article className="settings-card">
      <h3>Webhook</h3>
      <p>
        URL for incoming events. Request signing is configured in the security section.
      </p>
      <LinkButton.Root href="/settings/security/webhooks" size="m">
        Configure signing
      </LinkButton.Root>
    </article>
  );
}
```

### External link and tab safety

Documentation or a partner site opens in a new tab; always set `rel` when using `target="_blank"`.

```tsx
import { LinkButton } from "prime-ui-kit";

export function StatusPageLink() {
  return (
    <p>
      Current incidents are published on the status page:{" "}
      <LinkButton.Root
        href="https://status.example.com"
        target="_blank"
        rel="noopener noreferrer"
        size="m"
      >
        status.example.com
      </LinkButton.Root>
    </p>
  );
}
```

## Anatomy

Flat API: the `LinkButton` object is exported with a single subcomponent **`LinkButton.Root`**.

- When **`disabled={false}`** (default), an **`<a>`** is rendered with the passed anchor attributes and **`ControlSizeProvider`** wrapping `children`.
- When **`disabled={true}`**, a **`<span role="link">`** is rendered without `href`, with `aria-disabled="true"` and `tabIndex={-1}`; `children` remain inside `ControlSizeProvider`.

## API

### LinkButton.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Height / type size from control tokens; sets size context for nested icons. |
| `disabled` | `boolean` | `false` | No | Inactive link: `span` instead of `a`, no navigation. |
| `children` | `React.ReactNode` | — | No | Link content (text, icons). |
| `className` | `string` | — | No | Extra class on the root element. |
| …rest | `React.AnchorHTMLAttributes<HTMLAnchorElement>` | — | No | Including `href`, `target`, `rel`, `download`, `onClick`, `aria-*`, `tabIndex`; on an active link they are forwarded to `<a>`. `ref` is forwarded to the root DOM node. |

## Variants

There is no separate `variant` or `mode` prop: one visual style — text color from tokens, underline on `:hover` and `:focus-visible`. Visual differences between scenarios come from the **`size`** prop and surroundings (e.g. parent typography).

## States

| State | How it is set | Behavior |
|-------|----------------|----------|
| Normal link | `disabled` omitted or `false`, meaningful `href` | Click and keyboard activation navigate; pointer cursor. |
| Hover | CSS `:hover` | Accent text color, visible underline. |
| Keyboard focus | `:focus-visible` | Focus ring and underline. |
| Disabled | `disabled={true}` | Renders `span`, `aria-disabled`, “disabled” styles via `data-disabled`; no navigation. |

There are no built-in “loading” or “error” states — for async actions without a page change, use a button.

## Accessibility (a11y)

- An active link is a native **`<a href>`**: predictable behavior for screen readers and keyboard (Enter when focused).
- In **`disabled`** mode, semantics are kept via **`role="link"`** and **`aria-disabled="true"`**; tab focus is removed by default (`tabIndex={-1}`). Do not use this mode for a link that should stay in tab order — remove the element or explain the block with copy instead.
- For an **icon-only** link, provide an accessible name: **`aria-label`** or visible text nearby.
- For opening in a new tab, besides **`target="_blank"`**, set **`rel="noopener noreferrer"`** (and warn the user in the UI if needed).

## Limitations and notes

- The component is meant for **navigation** (URL or hash change). For in-app actions without navigation, use **Button**.
- **There is no polymorphic `asChild`**: you cannot apply styles to a child router `Link` with one prop; wrap the routing component with styles manually, or use `href` if your router supports it.
- When **`disabled`**, the **`href`** prop does not reach the DOM — do not rely on it for screen readers in that mode.
- There is no **`fullWidth`**; stretch the block via **`className`** / parent layout if needed.

## Related components

- **Button** — actions, form submit, `loading` / `disabled` without link semantics; link styled as a button via your app patterns if needed.
- **Breadcrumb** — navigation trail; individual items may look like links.
- **Typography** — body text with inline links without control padding; **LinkButton** aligns and sizes like controls.
