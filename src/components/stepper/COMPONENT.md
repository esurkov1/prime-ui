# Stepper

**Category:** navigation
**Kind:** navigation

> Steps of a multi-step process with pending, active, completed and danger statuses.

## When to use
- Checkout, onboarding and setup wizards where the user moves through ordered steps.
- Showing which steps are done, which is current and which failed.
- A vertical step list next to the step form (`orientation="vertical"`, the default).

## When not to use
- Switching between independent sections → use [Tabs](../tabs/COMPONENT.md).
- Paging through a list → use [Pagination](../pagination/COMPONENT.md).
- A chronological history of events → use [Timeline](../timeline/COMPONENT.md).
- Progress as a number or bar without step names → use [ProgressBar](../progress-bar/COMPONENT.md).

## Import
```tsx
import { Stepper } from "prime-ui-kit";
```

## Anatomy
```
Stepper.Root                 <ol>; current step; chevrons between horizontal items
└─ Stepper.Item              <li> with a <button>; a direct child of Root (index = order)
   ├─ Stepper.Indicator      circle: number, check when completed, or custom content
   ├─ Stepper.Content        text column
   │  ├─ Stepper.Title       step name
   │  └─ Stepper.Description muted support text
   └─ Stepper.Arrow          trailing chevron for vertical rows that open a page or panel
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Stepper.Root
No ref. `<ol>` of items; owns the current step, numbers the items and adds chevrons between horizontal ones.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Current step, 0-based (controlled). |
| `defaultValue` | `number` | `0` | Initial step (uncontrolled). |
| `onValueChange` | `(index: number) => void` | — | Called with the index of the clicked item. |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Column of rows, or a row with chevrons that stacks below a 480px container. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Indicator 20 · 24 · 28 · 32 · 36, title in the control text of the tier. |
| `children` | `ReactNode` | — | `Stepper.Item`s as direct children (an array from `map` is fine). |
| `…rest` | `Omit<OlHTMLAttributes<HTMLOListElement>, "defaultValue" \| "onChange">` | — | `aria-label`, `className` and the other list attributes. |

### Stepper.Item
`forwardRef` → `HTMLButtonElement`. One step: an `<li>` with a `<button>`; `aria-current="step"` when active.

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `"pending" \| "active" \| "completed" \| "danger"` | — | Overrides the status derived from `value` (before → `completed`, equal → `active`, after → `pending`). |
| `disabled` | `boolean` | — | The item cannot be selected. |
| `children` | `ReactNode` | — | `Stepper.Indicator`, `Stepper.Content`, optional `Stepper.Arrow`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">` | — | `onClick` (runs first; `preventDefault()` stops the selection), `className` and the other button attributes. |

### Stepper.Indicator
No ref. The circle (`aria-hidden`): the item number, or a check when completed.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Replaces the default content, e.g. `<Icon name="status.danger" />`. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### Stepper.Content
No ref. Text column for the title and the description.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### Stepper.Title · Stepper.Description
No ref. Step title in the control text; muted secondary line in the hint text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### Stepper.Arrow
No ref. Trailing chevron (`aria-hidden`) for vertical items that open a page or panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |

## Variants

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `vertical` | full-width rows (indicator · text · optional arrow); hover `fill-subtle`, active row on `fill-subtle`, danger row on `danger-soft` | side columns of wizards, step lists with descriptions | yes |
| `horizontal` | items in a row with placeholder-colored chevrons between them; hover → primary text; below a 30rem container the items stack one per row and chevrons hide | checkout headers with short step names | |

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
| `completed` | `accent-soft` circle with an accent check (`Icon action.check`), primary text | finished steps | derived |
| `danger` | horizontal: `danger-soft` circle; vertical: solid danger circle on a `danger-soft` row; danger text | a step that needs attention | |

Derive statuses from `value`; set `status="danger"` only on the failing step with an indicator that is not a number (`<Icon name="status.danger" />`); disable steps the user cannot reach yet. Avoid `Stepper.Arrow` in horizontal mode (the root adds chevrons) and several `active` steps.

## States
| State | Driven by | DOM |
|---|---|---|
| status | `value` or `status` | `data-status` on the button and the indicator; `aria-current="step"` on the active item |
| disabled | `disabled` | native `disabled`, `data-disabled="true"`, `text-disabled`, muted indicator without halo |
| hover / active | pointer | vertical `fill-subtle` / `fill-subtle-active`; horizontal text → primary; press scale |
| focus-visible | keyboard | outer focus ring |

Root attributes: `data-orientation`, `data-size`. Uncontrolled (`defaultValue`) clicks still select items.

## Layout & spacing
- The root is a size container (`inline-size: 100%`): give it a definite width, a shrink-wrapped parent collapses it.
- Wizard: stepper column and form side by side with `gap: var(--prime-space-8)`, stacking on narrow widths.
- Vertical rows are separated by `var(--prime-space-1)` (`var(--prime-space-2)` at `size="xl"`); the same value is the row gap of a wrapping horizontal stepper.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus between items; a disabled one is skipped. |
| `Enter` · `Space` | Selects the item. |

### ARIA
- Semantic `<ol>`; each item is a `<button>` inside an `<li>`; the active one has `aria-current="step"`.
- Separators, indicator and arrow are `aria-hidden`; the name comes from Title (and Description).
- Give the `<ol>` an `aria-label` when there are several steppers on a page.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Steps of a process: done ones get a check, the current one is highlighted — `defaultValue`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: indicator 20 to 36 px, title in the control text of the tier — `size`. |
| [states.tsx](examples/states.tsx) | Statuses that come from the server, a failed step with its own indicator and a locked step — `status`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | Vertical rows that open a page or panel end with a chevron — `Stepper.Arrow`. |
| [orientation.tsx](examples/orientation.tsx) | A row of steps with chevrons between them above the content, and a column for a side panel — `orientation`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the current step: Back and Next move it, far steps stay locked until reached — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | A horizontal stepper in a phone-width container stacks one step per row and hides the chevrons. |

## Mistakes
- Wrapping `Stepper.Item` in another component or element → it must be a direct child of Root (it throws otherwise).
- 1-based `value` → steps are 0-based.
- Adding separators by hand in horizontal mode → the root inserts them.
- `status="error"` → the status is `danger`; give it an indicator that is not a number so it does not read by color only.

## Related
- **Built from:** Icon (`action.check`, `nav.chevronRight`)
- **See also:** [Tabs](../tabs/COMPONENT.md), [Pagination](../pagination/COMPONENT.md), [Timeline](../timeline/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md)
