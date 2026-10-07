# LoginForm

**Category:** inputs

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
│  ├─ LoginForm.Logo                round tile with the product mark
│  ├─ LoginForm.Title               h1
│  └─ LoginForm.Description
└─ LoginForm.Body
   ├─ LoginForm.Social              provider buttons
   ├─ Divider                       «или»
   ├─ LoginForm.Form                <form>: Input.Root … · Button submit
   │  └─ LoginForm.Actions          primary button + ghost back action
   └─ LoginForm.Footer              «Нет аккаунта? <LinkButton>»
```
Every part is optional except `Root`, `Title` and `Form`. Fields, buttons, dividers, banners and links are the regular kit components; LoginForm owns only the layout and the rhythm.

## API

### LoginForm.Root
`forwardRef` → `<div>`. + native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of card padding, gaps and the text roles of title, description and footer. It does not reach the fields: pass the same `size` to `Input.Root` and `Button.Root`. |
| `align` | `"start" \| "center"` | `"start"` | Header layout. `start`: the Modal-header layout — a rounded accent tile on the left, title over description to its right in one row; the footer is left-aligned. `center`: round logo above a centered title and description. |
| `flat` | `boolean` | `false` | Removes the card shadow. No border in either case. |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Parts. |

`data-size`, `data-align` and `data-flat` are always set by the component. Width is capped at `--prime-modal-width-s` (27.5rem) and shrinks to the container.

### LoginForm.Header
`<header>`. + native props. Centered column: logo, title, description.

### LoginForm.Logo
`<div>`. + native props. Tile for the product mark or an icon: rounded-square `accent-soft` (40px, `radius-l`) by default, round `--prime-color-bg-sunken` with `align="center"`. An `<img>` or `<svg>` child is sized to the tier icon. Decorative: give it an `aria-label` and `role="img"` only when the mark carries meaning the title does not.

### LoginForm.Title
Heading via [Typography](../typography/COMPONENT.md). + native heading props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h1" \| "h2" \| "h3"` | `"h1"` | Heading element. Use `h2` when the page already has an `h1`. |

### LoginForm.Description
`<p>` in `body-s`/`body-m`/`body-l` by tier, `text-secondary`. + native props.

### LoginForm.Body
`<div>`. + native props. Everything under the header; its `gap` is `--prime-space-4` between social, divider and form.

### LoginForm.Social
`<div>`. + native props. Column of provider buttons: `Button.Root variant="outline" tone="neutral" fullWidth`.

### LoginForm.Form
`forwardRef` → `<form>`. + native `<form>` props (`onSubmit`, `noValidate`, `aria-label`, …). Column with field → field spacing (`--prime-space-5`; `4` on `xs`/`s`, `6` on `xl`). The submit `Button.Root type="submit" fullWidth` is the last child.

### LoginForm.Actions
`<div>`. + native props. Column of buttons with `--prime-space-3`: the primary action, then `variant="ghost" tone="neutral"`.

### LoginForm.Footer
`<p>` in `caption`–`body-m` by tier, `text-secondary`, centered. + native props. Holds a sentence and a [LinkButton](../link-button/COMPONENT.md).

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` / `s` | padding 16, gap 24, field gap 16, title-s / title-m | Inside a Modal or a narrow popover | |
| `m` | padding 24, gap 32, field gap 20, title-l | Regular sign-in page | yes |
| `l` | padding 32, gap 40, field gap 20, heading-s | Standalone sign-in screen on a wide canvas | |
| `xl` | padding 40, gap 40, field gap 24, heading-m | Marketing-grade sign-in, touch-first | |

### align
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | accent icon tile on the left, title over description to its right (one row), left-aligned footer | Product screens, sign-in over a page, inside a Modal | yes |
| `center` | round logo, centered title, description and footer | Standalone brand-first sign-in screen | |

### flat
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | card fill + raised shadow on the canvas | The form is the surface | yes |
| `true` | card fill, no shadow | Inside a Modal or any other surface | |

**Combinations**
- Recommended: one `size` on Root, the fields and the buttons; `Hint`/`error` on fields for validation; a danger [Banner](../banner/COMPONENT.md) at the top of `Form` for server errors.
- Avoid: more than one primary button; provider buttons in `solid` (they compete with the submit); a Card around LoginForm.
- Forbidden: raw hex or px in your own styles around it; a placeholder instead of a field label.

## States
LoginForm has no state of its own. Compose them:

| State | Driven by |
|---|---|
| submitting | `Button.Root loading` on the submit, `disabled` on the fields |
| field error | `Input.Root error` / `invalid`; `DigitInput.Root invalid` + `Hint.Root invalid` |
| server error | `Banner.Root tone="danger" role="alert"` as the first child of `LoginForm.Form` |

## Layout & spacing
- header → body `--prime-space-8` (gap on Root); social → divider → form `--prime-space-4`; field → field → submit `--prime-space-5`; submit → back action `--prime-space-3`; form → footer `--prime-space-6` (body gap + footer margin).
- Spacing is `gap` on parents; no margins between parts.
- The card has no border. To center it on a page, wrap it in your own flex container on the canvas.
- Fields inside take `--prime-color-field-bg-surface`, like in Card.

## Accessibility
- The title is a real heading (`h1` by default) and the form is a native `<form>`: Enter submits, no key handling needed.
- Give `LoginForm.Form` an `aria-label` (or `aria-labelledby` pointing to the title id) so the form is a landmark.
- Fields use `autoComplete` (`email`, `current-password`, `new-password`, `one-time-code`) so password managers and OTP autofill work.
- Server errors in a Banner need `role="alert"`; field errors come from `Input` (`aria-invalid`, described by the error).
- Meaning is never carried by color alone: errors have text.
- There are no `labels` keys: all text is passed as children.

## Examples
- [examples/sign-in.tsx](examples/sign-in.tsx) — `align="center"`: e-mail and password, Telegram button, divider, forgot-password link, sign-up link.
- [examples/register.tsx](examples/register.tsx) — five fields, password confirmation checked on the client.
- [examples/forgot-password.tsx](examples/forgot-password.tsx) — one field, primary action and a ghost way back (`Actions`).
- [examples/reset-password.tsx](examples/reset-password.tsx) — new password and confirmation.
- [examples/verification-code.tsx](examples/verification-code.tsx) — full-width `DigitInput` with an invalid code, resend and change address.
- [examples/submit-states.tsx](examples/submit-states.tsx) — `loading` submit, disabled fields, danger Banner after a failed request.
- [examples/sizes.tsx](examples/sizes.tsx) — `s`, `m`, `l`.
- [examples/flat.tsx](examples/flat.tsx) — no shadow, for a surface that already exists.

## Mistakes
- `<LoginForm>` → it is a namespace; use `<LoginForm.Root>`.
- `size="l"` on Root with default `m` fields → pass `size="l"` to every `Input.Root` and `Button.Root`.
- Submit button without `type="submit"` → Button defaults to `type="button"` and the form never submits.
- Hand-made «или» line → use [Divider](../divider/COMPONENT.md) between `Social` and `Form`.
- A `<Card.Root>` around the form → LoginForm is already the surface.
- «Забыли пароль?» inside the `<label>` → put a `LinkButton` under the field, aligned to its end.
- Using it for in-app settings forms → use Card `panel`.

## Related
- [Input](../input/COMPONENT.md)
- [DigitInput](../digit-input/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [LinkButton](../link-button/COMPONENT.md)
- [Divider](../divider/COMPONENT.md)
- [Banner](../banner/COMPONENT.md)
