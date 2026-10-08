# LoginForm

**Category:** composition
**Kind:** composite

> A sign-in card with a logo, title, provider buttons and a form; covers sign-in, sign-up, password reset and code confirmation.

## When to use
- A standalone sign-in, sign-up, password-reset or one-time-code screen of a product.
- The same flow inside a [Modal](../modal/COMPONENT.md) (`flat`) when sign-in is opened over a page.
- Any short authentication step where one card holds a header, optional provider buttons, 1–5 fields and one primary action.

## When not to use
- A settings or profile form on an app page → use [Card](../card/COMPONENT.md) `panel` with [Input](../input/COMPONENT.md) fields.
- A long multi-step wizard → use [Stepper](../stepper/COMPONENT.md) around regular forms.
- The app frame (sidebar, header) → [AppShell](../../layout/app-shell/COMPONENT.md); a sign-in screen has none.

## Import
```tsx
import { LoginForm } from "prime-ui-kit";
```

## Anatomy
```
LoginForm.Root                      surface: card fill, radius, shadow
├─ LoginForm.Header
│  ├─ LoginForm.Logo                tile with the product mark
│  ├─ LoginForm.Title               h1
│  └─ LoginForm.Description
└─ LoginForm.Body
   ├─ LoginForm.Actions             provider buttons
   ├─ Divider.Root                  «или»
   ├─ LoginForm.Form                <form>: Input.Root … · Button submit
   │  └─ LoginForm.Actions          primary button + ghost back action
   └─ LoginForm.Footer              «Нет аккаунта? <LinkButton>»
```
Every part is optional except `Root`, `Title` and `Form`. Fields, buttons, dividers, banners and links are the regular kit components; LoginForm owns only the layout and the rhythm.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### LoginForm.Root
`ref` → `HTMLDivElement`. The sign-in card: card fill, radius and shadow, the tier rhythm; provides its size to the parts. Native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of padding, gaps and text roles; every field and button inside without its own `size` takes it. |
| `align` | `"start" \| "center"` | `"start"` | `start` — the Modal header layout (rounded accent tile left, title over description right); `center` — a round logo above centered text. |
| `flat` | `boolean` | `false` | Removes the card shadow (inside a Modal or on a plain page). No border either way. |
| `className` | `string` | — | Class on the card. |

### LoginForm.Header
`ref` → `HTMLElement`. `<header>` with the logo, title and description, laid out by Root `align`. Native props.

### LoginForm.Logo
`ref` → `HTMLDivElement`. A tile for the product mark or an icon (accent tile with `start`, round with `center`); decorative unless it has an `aria-label`. Native `<div>` props.

### LoginForm.Title
`ref` → `HTMLHeadingElement`. The heading (kit Typography, text role by the tier).

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h1" \| "h2" \| "h3"` | `"h1"` | Heading level; `h2` when the page already has an `h1`. |

### LoginForm.Description
`ref` → `HTMLParagraphElement`. The secondary line under the title (kit Typography, secondary tone). Native `<p>` props.

### LoginForm.Body
`ref` → `HTMLDivElement`. Everything under the header: provider buttons, divider, form, footer. Native `<div>` props.

### LoginForm.Form
`ref` → `HTMLFormElement`. The `<form>`: fields, then the submit button, with the field → field gap of the tier. Native form props.

### LoginForm.Actions
`ref` → `HTMLDivElement`. A column of full-width buttons: provider buttons above the form, or the primary action with a `ghost` back action. Native `<div>` props.

### LoginForm.Footer
`ref` → `HTMLParagraphElement`. The secondary line with a `LinkButton` («Нет аккаунта? Зарегистрироваться»); follows Root `align`. Native `<p>` props.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` / `s` | padding 16, gap 24, field gap 16, title-s / title-m | inside a Modal or a narrow popover | |
| `m` | padding 24, gap 32, field gap 20, title-l | a regular sign-in page | yes |
| `l` | padding 32, gap 40, field gap 20, heading-s | a standalone sign-in screen on a wide canvas | |
| `xl` | padding 40, gap 40, field gap 24, heading-m | marketing-grade sign-in, touch-first | |

**Sizes:** every field and button inside (Input, DigitInput, Checkbox, Button, LinkButton…) takes the Root `size` unless it sets its own.

### align
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | accent icon tile on the left, title over description to its right, left-aligned footer | product screens, sign-in over a page, inside a Modal | yes |
| `center` | round logo, centered title, description and footer | a standalone brand-first sign-in screen | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `flat` | card fill, no shadow | inside a Modal or any other surface | `false` |

**Combinations**
- Recommended: one `size` on Root only (fields and buttons follow it); `hint` / `error` on fields for validation; a danger [Banner](../banner/COMPONENT.md) at the top of `Form` for server errors.
- Avoid: more than one primary button; provider buttons in `solid` (they compete with the submit); a Card around LoginForm.

## States
LoginForm has no state of its own. Compose them:

| State | Driven by | DOM |
|---|---|---|
| submitting | `loading` on the submit Button, `disabled` on the fields | `aria-busy` on the button |
| field error | `error` / `invalid` on `Input.Root`, `error` on `DigitInput` | `aria-invalid`, the error under the field |
| server error | `Banner.Root tone="danger" role="alert"` as the first child of `LoginForm.Form` | `role="alert"` |

Root carries `data-size`, `data-align` and `data-flat`.

## Layout & spacing
- header → body `--prime-space-8` (gap on Root); provider buttons → divider → form `--prime-space-4`; field → field → submit `--prime-space-5`; submit → back action `--prime-space-3`; form → footer `--prime-space-6`.
- Spacing is `gap` on parents; no margins between parts.
- The card has no border and is capped at the small modal width. To center it on a page, wrap it in your own flex container on the canvas.
- Fields inside take `--prime-color-field-bg-surface`, like in Card.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- The title is a real heading (`h1` by default) and the form is a native `<form>`: Enter submits.
- Give `LoginForm.Form` an `aria-label` (or `aria-labelledby` pointing to the title id) so the form is a landmark.
- Fields use `autoComplete` (`email`, `current-password`, `new-password`, `one-time-code`) so password managers and OTP autofill work.
- Server errors in a Banner need `role="alert"`; field errors come from the fields (`aria-invalid`, described by the error).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Sign in with a provider button, e-mail and password, a «forgot password» link and a sign-up link under a centered header — `align`, `LoginForm.Actions`, `LoginForm.Form`, `LoginForm.Footer`. |
| [sizes.tsx](examples/sizes.tsx) | Padding, gaps and text roles of the card follow the tier; the fields and buttons take the same one — `size`. |
| [structure.tsx](examples/structure.tsx) | The minimal form: no logo, description or footer, and no shadow for a host that already is a surface — `flat`. |
| [register.tsx](examples/register.tsx) | Sign-up: five fields in one column, a password mismatch shown as the field error — `error`, `LoginForm.Form`. |
| [forgot-password.tsx](examples/forgot-password.tsx) | Password reset request: one field, the primary action and a quiet way back — `LoginForm.Actions`. |
| [reset-password.tsx](examples/reset-password.tsx) | A new password after the e-mail link: two fields and a mismatch error under the second one — `error`. |
| [verification-code.tsx](examples/verification-code.tsx) | The second step with a one-time code: a rejected code shows its error under the cells, resend is a quiet action — `DigitInput`, `LoginForm.Actions`. |
| [states.tsx](examples/states.tsx) | The submit cycle: the button is busy while the request runs, a failed request shows a danger Banner and marks the password — `loading`, `invalid`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone-width screen the card keeps its padding, the header wraps and the buttons stay full width. |

## Mistakes
- `LoginForm.Social` → removed; provider buttons go in `LoginForm.Actions`.
- A placeholder instead of a field label → pass `label` to the field.
- A Card around LoginForm → the root already is the card; use `flat` inside another surface.
- Repeating the card `size` on every field and button → set it once on Root; fields and buttons follow it.

## Related
- **Built from:** [Typography](../typography/COMPONENT.md) (`Title`, `Description`, `Footer`)
- **See also:** [Input](../input/COMPONENT.md), [Button](../button/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md), [Divider](../divider/COMPONENT.md), [DigitInput](../digit-input/COMPONENT.md), [Banner](../banner/COMPONENT.md), [Modal](../modal/COMPONENT.md)
