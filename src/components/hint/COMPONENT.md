# Hint

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

`Hint` is a compact explanatory line under an input field: neutral text, an error message, or visually muted text for an inactive field, optionally with an icon on the left.

## What it’s for

- **Onboarding and registration** — explain password rules, phone format, or name requirements before the form is submitted.
- **Corporate settings and directories** — show where a read-only value comes from or why a field is unavailable for the current role.
- **Operational screens (logistics, billing)** — show a limit, unit of measure, or integration error text next to a numeric field without a separate notification block.

## Use cases

### Basic

A hint under a single field without extra slots: only text and a size aligned with the field.

```tsx
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";

export function InviteEmailField() {
  return (
    <div>
      <Label.Root htmlFor="invite-email" size="m">
        Guest email
      </Label.Root>
      <input id="invite-email" type="email" autoComplete="email" placeholder="name@company.com" />
      <Hint.Root size="m" variant="default">
        The invitation will be valid for 7 days.
      </Hint.Root>
    </div>
  );
}
```

### Variants and sizes

Another context — a store panel: a large field (`size="l"` on the hint paired with the field) and an explicit error state for an invalid promo code; the icon reinforces field recognition.

```tsx
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";

function TagIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M21.41 11.58l-9-9A2 2 0 0 0 12 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 .59 1.42l9 9a2 2 0 0 0 2.83 0l8-8a2 2 0 0 0 0-2.84zm-7.66 7.66L5 10.5V4h6.5l8.75 8.75-7.5 7.49zM7.5 6A1.5 1.5 0 1 1 6 7.5 1.5 1.5 0 0 1 7.5 6z"
      />
    </svg>
  );
}

export function CheckoutPromoRow() {
  return (
    <div>
      <Label.Root htmlFor="promo" size="l">
        Promo code
      </Label.Root>
      <input id="promo" type="text" defaultValue="SUMR-WRONG" />
      <Hint.Root size="l" variant="error">
        <Hint.Icon>
          <TagIcon />
        </Hint.Icon>
        Code not found or expired. Check spelling.
      </Hint.Root>
    </div>
  );
}
```

### In context (settings side panel)

A fragment of a notification settings column: label, slider, and a hint clarifying scope — without a separate “error card”.

```tsx
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";

export function NotificationVolumePanel() {
  return (
    <section>
      <h3>Browser sound</h3>
      <div>
        <Label.Root htmlFor="browser-vol" size="m">
          Volume
        </Label.Root>
        <input id="browser-vol" type="range" min={0} max={100} defaultValue={35} />
        <Hint.Root size="m" variant="default">
          “Urgent” and “Security” channels always play at full volume.
        </Hint.Root>
      </div>
    </section>
  );
}
```

### Controlled mode

The parent holds validation result and switches `variant` and text after submit or while typing.

```tsx
import { useState } from "react";
import { Button, Hint, Label } from "prime-ui-kit";

export function ProjectCodeField() {
  const [code, setCode] = useState("");
  const [showError, setShowError] = useState(false);

  const variant = showError && code.trim().length < 3 ? "error" : "default";

  return (
    <div>
      <Label.Root htmlFor="proj-code" size="m">
        Project code
      </Label.Root>
      <input
        id="proj-code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          setShowError(false);
        }}
        aria-invalid={variant === "error"}
      />
      <Hint.Root size="m" variant={variant}>
        {variant === "error"
          ? "At least 3 characters, Latin letters and digits."
          : "Will be used in links and the API."}
      </Hint.Root>
      <Button.Root size="s" type="button" onClick={() => setShowError(true)}>
        Validate
      </Button.Root>
    </div>
  );
}
```

## Anatomy

Composite **`Hint`** with two nodes:

- **`Hint.Root`** — a `p` element with `data-size` and `data-variant`, inside `ControlSizeProvider` so size cascades to the icon.
- **`Hint.Icon`** — optional `span` with `aria-hidden="true"` and a fixed square for the icon; place it as the first child or next to the text inside the root.

## API

### Hint.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Nominal size paired with the field; hint type is one step smaller than the field. |
| variant | `"default" \| "error" \| "disabled"` | `"default"` | No | Text color: secondary content, danger, or disabled content. |
| className | `string` | — | No | Extra class on `p`. |
| children | `React.ReactNode` | — | No | Text; optionally `Hint.Icon` alongside. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Native paragraph attributes (`id`, `role`, `aria-*`, etc.). |

### Hint.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Usually an SVG or icon component. |
| className | `string` | — | No | Extra class on `span`. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other wrapper attributes. |

## Variants

- **`default`** — secondary text color; ordinary hints and constraints.
- **`error`** — danger color; validation messages and input failures.
- **`disabled`** — disabled content color; aligned with an inactive field and label.

Sizes **`s` | `m` | `l` | `xl`** set font, line height, and gap to the icon on the same tier as the chosen nominal field size.

## States

There are no separate `disabled` or `loading` props on the root: inactive appearance is **`variant="disabled"`**. Errors are **`variant="error"`**. The field’s visual state (e.g. `disabled` on `input`) should be aligned in meaning with the hint variant chosen by the screen.

## Accessibility (a11y)

- The root is a paragraph; hint text is read in document order.
- To associate with the field, set **`id`** on `Hint.Root` and **`aria-describedby`** on the input to that id.
- Error text can also use **`role="alert"`** or live region placement — via `…rest` on the root if that fits your flow.
- **`Hint.Icon`** is marked **`aria-hidden`** so screen readers do not repeat a decorative icon.

## Limitations and notes

- Does not replace **`Label`**: the label stays the short field name; the hint is extra explanation.
- Not wired into every control automatically: in the composite **`Input`** kit, hints may come from the field’s own props — for manual markup, use `Hint` explicitly.
- There is no polymorphic **`asChild`**: the root is always `p`.

## Related components

- **`Label`** — primary field caption and `htmlFor` / `id` linkage.
- **`Input`** — ready-made composition with optional `hint` and `error` on the root.
- **`Textarea`** — same metadata pattern under multiline input (if used in the product).
- **`Button`** — actions next to the form that trigger validation and hint `variant` changes.
