# Textarea

## What it is

A composite multiline input: the text field, an optional character counter in the footer, hint and error slots with automatic linkage via `aria-describedby`.

## When to use it

- **Logistics and delivery** — clarify an address, time preferences, or a note for the courier on the order card without a separate screen.
- **Education and assignments** — collect a free-text answer from a learner with guidance on length or grading criteria.
- **Support and feedback** — describe an issue with a length limit, counter, and explicit error when the field is empty.

## Use cases

Each example targets a different screen type and prop set.

### Basic

A delivery-service ticket: short hint, no external state.

```tsx
import { Textarea } from "prime-ui-kit";

export function DeliveryNoteField() {
  return (
    <Textarea.Root size="m" placeholder="Order comment (optional)">
      <Textarea.Hint>Do not enter passwords or intercom codes in this field.</Textarea.Hint>
    </Textarea.Root>
  );
}
```

### Variants / sizes

A medical form: large field for symptom timeline and explicit validation error.

```tsx
import * as React from "react";
import { Textarea } from "prime-ui-kit";

export function SymptomTimelineField() {
  const [variant, setVariant] = React.useState<"default" | "error">("error");

  return (
    <Textarea.Root
      size="l"
      variant={variant}
      placeholder="Describe when symptoms started and how they changed"
      onChange={() => setVariant("default")}
    >
      <Textarea.Error>Fill in this field so the doctor can review history before the visit.</Textarea.Error>
    </Textarea.Root>
  );
}
```

### In context (form / modal / sidebar / …)

Editorial workflow: block title and character-limited field for the lead paragraph.

```tsx
import * as React from "react";
import { Textarea } from "prime-ui-kit";
import { Typography } from "prime-ui-kit";

const LEAD_MAX = 320;

export function ArticleLeadBlock() {
  const [lead, setLead] = React.useState("");

  return (
    <section style={{ maxWidth: "36rem" }}>
      <Typography.Root size="s" weight="semibold" as="h3">
        Lead paragraph
      </Typography.Root>
      <Textarea.Root
        size="m"
        value={lead}
        maxLength={LEAD_MAX}
        onChange={(e) => setLead(e.target.value)}
        placeholder="Two or three sentences for article lists and social previews"
      >
        <Textarea.CharCounter current={lead.length} max={LEAD_MAX} />
        <Textarea.Hint>The {LEAD_MAX}-character limit matches the textarea maxLength.</Textarea.Hint>
      </Textarea.Root>
    </section>
  );
}
```

### Controlled mode

Internal incident report: text and metadata live in the parent; height grows with input (`autoResize` by default).

```tsx
import * as React from "react";
import { Textarea } from "prime-ui-kit";

export function IncidentReportBody() {
  const [body, setBody] = React.useState("");

  return (
    <Textarea.Root
      size="m"
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder="What happened, who is affected, what actions were already taken"
    >
      <Textarea.Hint>Characters typed: {body.length}. The draft can be serialized with the form.</Textarea.Hint>
    </Textarea.Root>
  );
}
```

## Anatomy

`Textarea` is an object with subcomponents:

- **`Textarea.Root`** — outer `div.field` with context; inside, `label.control` with `textarea` (and with `autoResize`, a wrapper with `data-value`), optional footer for `Textarea.CharCounter`; after `label`, `Textarea.Hint` and `Textarea.Error` render.
- **`Textarea.CharCounter`** — must be a direct child of `Root`; rendered in the footer.
- **`Textarea.Hint`** / **`Textarea.Error`** — direct children of `Root`, rendered as `Hint.Root` with the correct `id` linked to the field.

## API

### Textarea.Root

| Prop | Type | Default | Required | Description |
|------|-----|--------------|--------------|----------|
| variant | `"default" \| "error"` | `"default"` | No | Visual role and baseline invalid state unless `aria-invalid` overrides. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Size scale for the field (text, padding, minimum height). |
| autoResize | `boolean` | `true` | No | Height follows content via markup and `data-value`; when `false`, native resize remains. |
| id | `string` | from `useId()` | No | No `htmlFor` anchor needed — the root is the `label`; id is used for stable `aria-describedby`. |
| className | `string` | — | No | Class on the bordered wrapper (`label`). |
| disabled | `boolean` | — | No | Native disabled; Hint switches to a disabled appearance. |
| readOnly | `boolean` | — | No | Read-only; Hint behaves like disabled. |
| value | `string` | — | No | Controlled value. |
| defaultValue | `string` | — | No | Uncontrolled initial text. |
| onInput | `React.FormEventHandler<HTMLTextAreaElement>` | — | No | Internally extended to update `data-value` when `autoResize` is on. |
| aria-describedby | `string` | — | No | Appended with hint and error ids when present. |
| aria-invalid | `Booleanish` | from variant / Error | No | Explicit invalidity on top of heuristics. |
| children | `React.ReactNode` | — | No | `CharCounter` in the footer; `Hint` and `Error` outside `label`. |
| …rest | `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">` | — | No | All standard textarea attributes: `placeholder`, `rows`, `maxLength`, `required`, `onChange`, `name`, etc. |

### Textarea.CharCounter

| Prop | Type | Default | Required | Description |
|------|-----|--------------|--------------|----------|
| current | `number` | — | Yes | Current character count. |
| max | `number` | — | Yes | Displayed limit; when `current > max`, `data-overflow="true"` is set. |

### Textarea.Hint

| Prop | Type | Default | Required | Description |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Yes | Hint text. |
| className | `string` | — | No | Extra class. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | No | `p` attributes; `id` comes from context. |

### Textarea.Error

| Prop | Type | Default | Required | Description |
|------|-----|--------------|--------------|----------|
| children | `React.ReactNode` | — | Yes | Error text. |
| className | `string` | — | No | Extra class. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | No | `p` attributes; `id` comes from context. |

## Variants

- **`default`** — normal field with a neutral border.
- **`error`** — error emphasis; together with `Textarea.Error` and automatic `aria-invalid`, accessibility stays consistent.

Separately from `variant`, the counter can show logical overflow (`current > max`) without blocking input — that is not `variant` but the visual `data-overflow` flag on the counter.

## States

- **Default** — focus on border click (`label` with `cursor: text`), styles from size `data` attributes.
- **disabled / readOnly** — native textarea attributes; hint uses a muted style.
- **Error** — `variant="error"` and/or mounted `Textarea.Error`; field is invalid for assistive tech.
- **Required** — native `required` on the textarea for browser hints and form validation.

## Accessibility (a11y)

- Field inside `label` — clickable area includes the border.
- `Textarea.Hint` and `Textarea.Error` get stable `id`s and are merged into textarea `aria-describedby`.
- `aria-invalid` derives from `variant`, presence of `Error`, or an explicit prop.
- Counter announces changes politely (`aria-live="polite"`) without disrupting typing.

## Limitations and notes

- **`Textarea.CharCounter`** must be a **direct** child of `Root` (split by `child.type`); Hint and Error live in the same tree but not in the footer.
- Textarea has no polymorphic `asChild` — the root is fixed as a wrapper with `label` and `textarea`.
- There is no horizontal/vertical orientation — it is a single-column block.
- Character limit: either native `maxLength` or display-only via the counter; counter overflow does not block input by itself.

## Related components

- **Input** — single-line input in the same visual field family.
- **Hint** (via `Textarea.Hint`) — shared hint primitive.
- **Label** — external title above the field when text must sit **above** the border (align `htmlFor` with `id` passed to `Textarea.Root` and avoid nested `label`s).
- **Typography** — headings and supporting copy next to the field in form layouts.
