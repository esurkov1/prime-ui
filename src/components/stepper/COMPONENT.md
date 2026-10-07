# Stepper

**Category:** navigation

> Steps of a multi-step process with pending, active, completed and error statuses.

## When to use
- Checkout, onboarding and setup wizards where the user moves through ordered steps.
- Showing which steps are done, which is current and which failed.
- A vertical step list next to the step form (`orientation="vertical"`, the default).

## When not to use
- Switching between independent sections → use [Tabs](../tabs/COMPONENT.md).
- Paging through a list → use [Pagination](../pagination/COMPONENT.md).
- A chronological history of events → use [Timeline](../timeline/COMPONENT.md).
- Progress as a number or bar without step names → use [ProgressBar](../progress-bar/COMPONENT.md) (`value` or `segments`).

## Import
```tsx
import { Stepper } from "prime-ui-kit";
```

## Anatomy
- `Stepper.Root` — `<ol>`; holds the current step index; in horizontal mode inserts chevron separators between steps.
  - `Stepper.Step` — `<li>` with a `<button>`; must be a direct child of Root (index = order).
    - `Stepper.Indicator` — circle with the step number, a check when completed, or custom content.
    - `Stepper.Content` — text column.
      - `Stepper.Title` — step name.
      - `Stepper.Description` — muted support text.
    - `Stepper.Arrow` — trailing chevron for vertical rows that open a page or panel.

## API

### Stepper.Root
Does not forward a ref. + native `<ol>` props (except `children`, `defaultValue`, `onChange`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Layout. A horizontal stepper stacks vertically when its container is narrower than 30rem. |
| `value` | `number` | — | Current step (0-based), controlled. |
| `defaultValue` | `number` | `0` | Initial step, uncontrolled. |
| `onValueChange` | `(index: number) => void` | — | Called with the step index when a step is clicked. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Indicator size, text and spacing. |
| `children` | `ReactNode` | — (required) | `Stepper.Step` elements as direct children (an array from `map` is fine). |
| `className` | `string` | — | Extra class on the `<ol>`. |

### Stepper.Step
`forwardRef` → `HTMLButtonElement`. + native `<button>` props except `type`, `children` (`className` goes on the button).

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `"pending" \| "active" \| "completed" \| "error"` | derived | Overrides the status derived from Root `value` (before → `completed`, equal → `active`, after → `pending`). |
| `disabled` | `boolean` | — | Native disabled; the step cannot be selected. |
| `onClick` | `(event) => void` | — | Runs before selection; `event.preventDefault()` cancels selecting the step. |
| `children` | `ReactNode` | — (required) | Indicator, Content, Arrow. |

### Stepper.Indicator
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | step number / check | Replaces the default content (e.g. `!` for an error). |
| `className` | `string` | — | Extra class. |

### Stepper.Content, Stepper.Title, Stepper.Description
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Content. |
| `className` | `string` | — | Extra class. |

### Stepper.Arrow
| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |

## Variants

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `vertical` | full-width rows (indicator · text · optional arrow); hover `fill-subtle`, active row on `fill-subtle`, error row on `danger-soft` | side columns of wizards, step lists with descriptions | yes |
| `horizontal` | steps in a row with placeholder-colored chevrons between them; hover → primary text; below 30rem container width the steps stack one per row and chevrons hide | checkout headers with short step names | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | indicator 20, 12/16 text, check 14 | dense panels | |
| `s` | indicator 24, 13/20 text, check 14 | compact cards | |
| `m` | indicator 28, 14/20 text, check 16 | default | yes |
| `l` | indicator 32, 16/24 text, check 16 | large forms | |
| `xl` | indicator 36, 16/24 text, check 20 | hero onboarding | |

Title uses the control text of the tier, Description the hint text of the tier.

### status
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `pending` | `fill-muted` circle with secondary number, secondary text | steps after the current one | derived |
| `active` | accent circle with a `space-1` `accent-soft` halo, primary text | the current step | derived |
| `completed` | `accent-soft` circle with an accent check, primary text | finished steps | derived |
| `error` | horizontal: `danger-soft` circle; vertical: solid danger circle on a `danger-soft` row; danger text | a step that needs attention | |

**Combinations**
- Recommended: derive statuses from `value`; set `status="error"` only on the failing step with `<Stepper.Indicator>!</Stepper.Indicator>`; disable steps the user cannot reach yet.
- Avoid: `Stepper.Arrow` in horizontal mode (the root adds chevrons); `Stepper.Description` in horizontal mode with long text; several `active` steps.

## States
| State | Driven by | DOM |
|---|---|---|
| status | `value` or `status` | `data-status` on the button and the indicator; `aria-current="step"` on the active step |
| disabled | `disabled` | native `disabled`, `data-disabled="true"`, `text-disabled`, muted indicator without halo |
| hover / active | pointer | vertical `fill-subtle` / `fill-subtle-active`; horizontal text → primary |
| focus-visible | keyboard | outer focus ring |

Root attributes: `data-orientation`, `data-size`. Controlled: `value` + `onValueChange`; uncontrolled: `defaultValue` (clicks still select steps).

## Layout & spacing
- The root is a size container (`inline-size: 100%`): give it a definite width, a shrink-wrapped parent collapses it.
- Wizard: stepper column and form side by side with `gap: var(--prime-space-8)`, stacking on narrow widths (`grid-template-columns: repeat(auto-fit, minmax(…, 1fr))`).
- Vertical rows are separated by `var(--prime-space-1)` (`var(--prime-space-2)` at `size="xl"`); the same value is the row gap of a wrapping horizontal stepper.

## Accessibility
- Semantic `<ol>`; each step is a `<button>` inside an `<li>`; the active one has `aria-current="step"`.
- Separators, indicator and arrow are `aria-hidden`; the step name comes from Title (and Description).
- Give the `<ol>` an `aria-label` when there are several steppers on a page.
- Keyboard: Tab between steps, Enter/Space selects. No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [wizard.tsx](examples/wizard.tsx) | Vertical stepper + step form + Back / Next | setup and onboarding wizards |
| [orientation.tsx](examples/orientation.tsx) | Horizontal and vertical (with Description and Arrow), one `value` | choosing a layout |
| [states.tsx](examples/states.tsx) | Explicit completed / error / active / pending + disabled | server-driven statuses |
| [sizes.tsx](examples/sizes.tsx) | Five size tiers | matching the form size |
| [narrow.tsx](examples/narrow.tsx) | Horizontal stepper at 320px stacks | phones |

```tsx
import { Stepper } from "prime-ui-kit";

export function CheckoutSteps() {
  return (
    <Stepper.Root orientation="horizontal" defaultValue={1}>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content>
          <Stepper.Title>Корзина</Stepper.Title>
        </Stepper.Content>
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content>
          <Stepper.Title>Оплата</Stepper.Title>
        </Stepper.Content>
      </Stepper.Step>
    </Stepper.Root>
  );
}
```

## Mistakes
- Wrapping `Stepper.Step` in another component or element → it must be a direct child of Root (it throws otherwise).
- 1-based `value` → steps are 0-based.
- Adding separators by hand in horizontal mode → the root inserts them.
- `status="error"` without changing the indicator → pass `<Stepper.Indicator>!</Stepper.Indicator>` so the error does not read as a number only.

## Related
- [Tabs](../tabs/COMPONENT.md)
- [Pagination](../pagination/COMPONENT.md)
- [Timeline](../timeline/COMPONENT.md)
