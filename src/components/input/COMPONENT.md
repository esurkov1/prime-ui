# Input

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite single-line input block: label and metadata on the outside, inside—a bordered row with a native `input`, optional icons, and text affixes.

## What it’s for

- **Account sign-in and settings** — email, phone, and name with format hints and an explicit `label` ↔ field association.
- **Checkout and delivery** — address, promo code, courier contact with an “optional” note and server error message.
- **Internal directories and CRM** — quick entry of customer code or name in a dense table where compact `s` size matters.
- **Catalog and search** — search field with an icon and controlled value for list filtering without a full reload.
- **Finance and pricing** — amounts with a currency symbol via `InlineAffix` and input constraints (`inputMode`, `pattern`).
- **Lead forms and landing pages** — large `xl` field with a short label for the mobile-first screen.

## Use cases

Each example is a different screen and intent; the API is combined differently.

### Basic

Sign-in form: email with a hint, no extra chrome.

```tsx
import { Input } from "prime-ui-kit";

export function LoginEmailField() {
  return (
    <Input.Root size="m" label="Email" hint="We’ll send a code to this address">
      <Input.Wrapper>
        <Input.Field type="email" name="email" autoComplete="email" placeholder="you@company.com" />
      </Input.Wrapper>
    </Input.Root>
  );
}
```

### Sizes / density

The same “product code” scenario in two UI densities: a compact row in a table and a large field on the product detail card.

```tsx
import { Input } from "prime-ui-kit";

export function SkuFieldComparison() {
  return (
    <>
      <Input.Root size="s" label="SKU (table)" hint="For grid rows">
        <Input.Wrapper>
          <Input.Field placeholder="ART-0000" />
        </Input.Wrapper>
      </Input.Root>
      <Input.Root size="xl" label="SKU (card)" hint="For detail screen">
        <Input.Wrapper>
          <Input.Field placeholder="ART-0000" />
        </Input.Wrapper>
      </Input.Root>
    </>
  );
}
```

### In context (form / modal / sidebar / …)

Subscription checkout row: site prefix and domain zone as block affixes, input in the middle.

```tsx
import { Input } from "prime-ui-kit";

export function WorkspaceUrlRow() {
  return (
    <section>
      <h3>Workspace URL</h3>
      <Input.Root size="m" label="Subdomain" hint="Latin letters and digits only">
        <Input.Wrapper>
          <Input.Affix side="start">https://</Input.Affix>
          <Input.Field placeholder="team" autoComplete="off" />
          <Input.Affix side="end">.app.example</Input.Affix>
        </Input.Wrapper>
      </Input.Root>
    </section>
  );
}
```

### Controlled mode

Ticket filter: the string value lives in parent state and is cleared with a button.

```tsx
import * as React from "react";
import { Button, Input } from "prime-ui-kit";

export function SupportTicketFilter() {
  const [q, setQ] = React.useState("");

  return (
    <>
      <Input.Root size="m" label="Search by subject" hint="Filter by entered text">
        <Input.Wrapper>
          <Input.Field
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ticket number or keywords"
            aria-label="Filter tickets"
          />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root mode="ghost" size="m" variant="neutral" onClick={() => setQ("")}>
        Clear
      </Button.Root>
    </>
  );
}
```

## Anatomy

- **`Input.Root`** — outer container (`div` with `data-size`), optional header row (`label` + `optionalLabel`), context provider and `ControlSizeProvider`, then `children` (usually `Input.Wrapper`), then meta block with **`Hint.Root`** for `hint` and `error`.
- **`Input.Wrapper`** — flex wrapper with field border and background; inside, in any order: **`Input.Field`**, **`Input.Icon`**, **`Input.Affix`**, **`Input.InlineAffix`**.
- **`Input.Field`** — native `<input>` with `id` from context, merged `aria-describedby`, and `aria-invalid` when there is an error.

The public **`Input`** object exposes **`Root`**, **`Wrapper`**, **`Field`**, **`Icon`**, **`Affix`**, **`InlineAffix`**. The **`useInputContext`** hook is also exported for custom subcomponents.

## API

### Input.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Control size from `--prime-sys-size-control-*` tokens. |
| hasError | `boolean` | `false` | no | Error state: border and `aria-invalid` on the field; if `error` is passed, becomes `true` automatically. |
| label | `React.ReactNode` | — | no | Label; rendered as `<label htmlFor={inputId}>`. |
| optionalLabel | `React.ReactNode` | — | no | Secondary text in the header row. |
| hint | `React.ReactNode` | — | no | Hint below the field. |
| error | `React.ReactNode` | — | no | Error text; sets `hasError` and id for `aria-describedby`. |
| id | `string` | — | no | Explicit input id; otherwise generated in `useFieldIds`. |
| children | `React.ReactNode` | — | yes | Field body (typically `Input.Wrapper` with content). |
| className | `string` | — | no | Class on the root `div`. |

### Input.Wrapper

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Content inside the field border. |
| className | `string` | — | no | Class on the wrapper; `data-size` and `data-has-error` come from context. |

### Input.Field

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | no | Class on the `input`. |
| aria-describedby | `string` | — | no | Appends to the id list from context (hint/error). |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">` | — | no | All standard `input` attributes except `size` (reserved for the design system). |

### Input.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| side | `"start" \| "end"` | — | yes | Icon position. |
| children | `React.ReactNode` | — | yes | Usually an icon from prime-ui-kit. |
| className | `string` | — | no | Class on the `span` with `aria-hidden`. |

### Input.Affix

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| side | `"start" \| "end"` | — | yes | Side of the block affix. |
| children | `React.ReactNode` | — | yes | Segment text (URL prefix, etc.). |
| className | `string` | — | no | Class on the container; `aria-hidden`. |

### Input.InlineAffix

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| side | `"start" \| "end"` | — | yes | Side of the inline affix. |
| children | `React.ReactNode` | — | yes | Short text (currency symbol, etc.). |
| className | `string` | — | no | Class on the `span`; `aria-hidden`. |

### useInputContext()

Returns `{ size, hasError, inputId, describedBy }` for extensions aligned with the same context as `Input.Field`.

## Variants

There is no separate `variant` prop on Input: one visual treatment for border and typography. Behavioral “modes” come from the native **`type`** attribute (`email`, `password`, `tel`, `number`, `search`, …) and related attributes (`autoComplete`, `inputMode`, `pattern`, `maxLength`, etc.) on **`Input.Field`**.

## States

- **Default** — focus highlights the border via `:focus-visible` on the input.
- **Hover** — the wrapper changes background and border while the field is not focused and not `disabled`.
- **`disabled`** — muted colors, `cursor: not-allowed`, no hover effect.
- **`readOnly`** — looks like a normal field; edit lock is native.
- **Error** — `error` or `hasError` on Root: red border, separate focus shadow, `aria-invalid` on the input.
- **`required`** — set on `Input.Field`; add a visual asterisk in the layout manually in `label` if needed.

## Accessibility (a11y)

- **`label`** on Root is tied to the field via **`htmlFor` / `id`** (id is generated or set with the `id` prop on Root).
- **`hint`** and **`error`** get stable ids and participate in **`aria-describedby`** on the input; extend with `aria-describedby` on `Input.Field` if needed.
- **`Input.Icon`** and affixes use **`aria-hidden`**; meaning should be in the label, placeholder, or **`aria-label`** on the field.
- For a field without a visible label, set **`aria-label`** or **`aria-labelledby`** on **`Input.Field`**.

## Limitations and notes

- Multiline input and auto-growing height are not this component; use **Textarea**.
- Input masks, masked formatting, and fixed-cell inputs — see **DigitInput** or app-level logic.
- `Input.Field` does not forward the `size` prop: use **`Input.Root`** (`size`) for sizing.
- Custom inner elements should live inside **`Input.Wrapper`** and read context via **`useInputContext`** when needed.

## Related components

- **Label** — when the label must be separate from the built-in `label` on Root (non-standard layout).
- **Hint** — used inside Root for `hint`/`error`; can be combined with other fields consistently.
- **Textarea** — multiline input.
- **Button** — submit next to the field.
- **DigitInput** — multi-cell code entry.
