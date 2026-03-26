# Button

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A compound action control: root button (`Button.Root`), optional icon (`Button.Icon`), and loading indicator (`Button.Spinner`), aligned in size through context.

## What it’s for

- **Internal tools and panels** — confirm saving a draft, open a modal, run a bulk operation on table rows.
- **Checkout or subscription flows** — proceed to payment, retry after a network error, cancel checkout without mixing in plain text links.
- **Onboarding and empty states** — one prominent “Get started” or “Create your first project” button when the screen has little other UI.

## Use cases

### Basic

A typical primary button in a screen header or action block.

```tsx
import { Button } from "prime-ui-kit";

export function SaveToolbar() {
  return (
    <Button.Root variant="primary" mode="filled" size="m" type="button">
      Save
    </Button.Root>
  );
}
```

### Variants and sizes

Media library card: main action is larger; secondary actions are neutral and outlined.

```tsx
import { Button } from "prime-ui-kit";

export function AssetCardActions() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <Button.Root variant="primary" mode="filled" size="l">
        Download original
      </Button.Root>
      <Button.Root variant="neutral" mode="stroke" size="m">
        Share
      </Button.Root>
      <Button.Root variant="neutral" mode="ghost" size="s">
        Details
      </Button.Root>
    </div>
  );
}
```

### In context (form)

Search bar: submit and reset via native button types, full-width column layout.

```tsx
import { Button } from "prime-ui-kit";

export function CatalogSearchForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      style={{ display: "grid", gap: "0.75rem", maxWidth: 320 }}
    >
      <input name="q" placeholder="Name or SKU" />
      <Button.Root type="submit" variant="primary" mode="filled" size="m" fullWidth>
        Search
      </Button.Root>
      <Button.Root type="reset" variant="neutral" mode="stroke" size="m" fullWidth>
        Reset filters
      </Button.Root>
    </form>
  );
}
```

### Controlled loading

Long-running request: parent holds `loading`; the button is blocked and shows a spinner.

```tsx
import { useState } from "react";
import { Button } from "prime-ui-kit";

export function PublishDraftButton() {
  const [loading, setLoading] = useState(false);

  async function handlePublish() {
    setLoading(true);
    try {
      await fetch("/api/publish", { method: "POST" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="m"
      loading={loading}
      onClick={handlePublish}
      type="button"
    >
      <Button.Spinner />
      {loading ? "Publishing…" : "Publish"}
    </Button.Root>
  );
}
```

## Anatomy

- **`Button.Root`** — a `<button>` element or a single child when `asChild` (via slot); wraps children in `ControlSizeProvider` (except in `asChild` mode, where size is set on the slot).
- **`Button.Icon`** — `<span aria-hidden>` for the icon; visual size from control size tokens.
- **`Button.Spinner`** — indicator in the markup; shown only when `loading === true` on the nearest `Button.Root` (context).

## API

### Button.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| variant | `"primary" \| "neutral" \| "error"` | `"primary"` | No | Color semantics. |
| mode | `"filled" \| "stroke" \| "lighter" \| "ghost" \| "fancy"` | `"filled"` | No | Fill, stroke, or accent **fancy**. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Unified height, radius, text, and icon scale. |
| fullWidth | `boolean` | — | No | Button spans container width (`data-full-width`). |
| loading | `boolean` | `false` | No | Blocks click, sets `aria-busy`, context for `Button.Spinner`. |
| asChild | `boolean` | `false` | No | Merge props with the only child instead of rendering `<button>`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | For native button; with `asChild`, not forwarded to the child. |
| disabled | `boolean` | — | No | Inactive state; with `loading`, clicks are blocked. |
| className | `string` | — | No | Extra class on the root. |
| children | `React.ReactNode` | — | No | Text, `Button.Icon`, `Button.Spinner`, etc. |
| …rest | `React.ButtonHTMLAttributes<HTMLButtonElement>` (without `size`) | — | No | `onClick`, `aria-*`, `data-*`, and other button attributes. |

### Button.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon node. |
| className | `string` | — | No | Extra class on `span`. |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other `span` attributes (root has `aria-hidden`). |

### Button.Spinner

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Extra class on the indicator. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | If root `loading` is false, nothing is rendered. |

## Variants

- **primary** — main positive action.
- **neutral** — secondary or neutral (cancel, “back”, filters).
- **error** — destructive or error-related (delete, cancel subscription).

**filled**, **stroke**, **lighter**, and **ghost** set visual weight; **fancy** is a separate accent style on the same API.

## States

- **Default** — interactive, without `disabled` or `loading`.
- **disabled** — native disabled button (`disabled` on `<button>`); clicks do not fire.
- **loading** — behaves like disabled for interaction, sets `aria-busy`; `Button.Spinner` in the tree shows when present.
- **asChild + disabled/loading** — native `disabled` is not set on links; `aria-disabled`, `onClick` blocking, and styles handle the state.

## Accessibility (a11y)

- Root is a native button with Tab focus; for `type="submit"` / `reset`, respect form hierarchy and one clear submit per step where appropriate.
- Icon-only: set a meaningful `aria-label` (or a linked visible label) on `Button.Root`; `Button.Icon` is hidden from assistive tech (`aria-hidden`).
- While loading, keep a clear name (text or `aria-label`) so the button is not unnamed.
- With `asChild`, the child must accept `className`, ARIA, and handlers; a link remains focusable as a link.

## Limitations and notes

- Not a toggle or tab-like control; for toggles see `Switch`, `Checkbox`, `SegmentedControl`, etc.
- `Button.Spinner` does not replace a textual description of progress — combine it with a label or `aria-busy` plus visible status.
- `asChild` allows exactly one child; `type` is not forwarded in that mode.

## Related components

- **LinkButton** — when you need link styling, not a button.
- **ButtonGroup** — group several buttons with shared size and dividers.
- **Modal**, **Drawer** — open triggers are often `Button.Root` or `asChild` on a custom anchor.
- **Input**, **Label**, **Hint** — in forms, submit and reset sit next to inputs.
