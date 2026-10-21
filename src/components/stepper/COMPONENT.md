# Stepper

**Category:** navigation
**Kind:** navigation

> Steps of a multi-step process with pending, current, completed and danger statuses.

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
Stepper.Root                 <ol>; current step; chevrons between horizontal items, at the end of vertical rows with `arrows`
└─ Stepper.Item              <li> with a <button>; a direct child of Root (index = order)
   ├─ Stepper.Indicator      circle: number, check when completed, danger mark, or custom content
   └─ Stepper.Content        text column
      ├─ Stepper.Title       step name
      └─ Stepper.Description muted support text
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Stepper.Root
`ref` → `HTMLOListElement`. `<ol>` of items; owns the current step, numbers the items and draws the chevrons between horizontal ones and, with `arrows`, at the end of vertical rows.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Current step, 0-based (controlled). |
| `defaultValue` | `number` | `0` | Initial step (uncontrolled). |
| `onValueChange` | `(index: number) => void` | — | Called with the index of the clicked item. |
| `orientation` | `"horizontal" \| "vertical"` | `"vertical"` | Column of rows, or one row with chevrons (steps shrink and wrap their titles) that stacks below a 480px container. |
| `arrows` | `boolean` | `false` | Every vertical row ends with a chevron: each step opens a page or panel. Horizontal steps already have their chevrons. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Indicator 20 · 24 · 28 · 32 · 36, title in the control text of the tier. Without it the tier of its host, else `m`. |
| `labels` | `Partial<StepperLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `Stepper.Item`s as direct children (an array from `map` is fine). |
| `…rest` | `Omit<OlHTMLAttributes<HTMLOListElement>, "defaultValue" \| "onChange">` | — | `aria-label`, `className` and the other list attributes. |

### Stepper.Item
`ref` → `HTMLButtonElement`. One step: an `<li>` with a `<button>` (and, between horizontal steps, the decorative chevron in front of it); `aria-current="step"` on the current one; a completed or danger step adds its status to its name.

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `"pending" \| "current" \| "completed" \| "danger"` | — | Overrides the status derived from `value` (before → `completed`, equal → `current`, after → `pending`). |
| `disabled` | `boolean` | — | The item cannot be selected. |
| `children` | `ReactNode` | — | `Stepper.Indicator` and `Stepper.Content`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">` | — | `onClick` (runs first; `preventDefault()` stops the selection), `className` and the other button attributes. |

### Stepper.Indicator
`ref` → `HTMLSpanElement`. The circle (`aria-hidden`): the item number, a check when completed, the danger mark on a danger step; a status change cross-fades the glyph.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Replaces the default content, e.g. `<Icon name="status.info" />`. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### Stepper.Content
`ref` → `HTMLSpanElement`. Text column for the title and the description.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### Stepper.Title · Stepper.Description
`ref` → `HTMLSpanElement`. Step title in the control text; muted secondary line in the hint text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

## Variants

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `vertical` | full-width rows (indicator · text · the chevron with `arrows`); hover `fill-subtle`, the current row on `fill-subtle`, danger row on `danger-soft` | side columns of wizards, step lists with descriptions | yes |
| `horizontal` | one row of items with placeholder-colored chevrons between them; a cramped step wraps its title, the row never wraps; hover → primary text; below a 30rem container the items stack one per row and chevrons hide | checkout headers with short step names | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `arrows` | every vertical row ends with a placeholder-colored chevron (`aria-hidden`); horizontal steps keep their separators only | each vertical step opens a page or panel | off |

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
| `current` | accent circle with a `space-1` `accent-soft` halo, primary text | the current step | derived |
| `completed` | `accent-soft` circle with an accent check (`Icon action.check`), primary text; `labels.completed` added to the name | finished steps | derived |
| `danger` | the danger mark (`Icon status.danger`) — horizontal: on a `danger-soft` circle; vertical: on a solid danger circle in a `danger-soft` row; danger text; `labels.danger` added to the name | a step that needs attention | |

Derive statuses from `value`; set `status="danger"` only on the failing step; disable steps the user cannot reach yet. Never mark several steps `current`.

## States
| State | Driven by | DOM |
|---|---|---|
| status | `value` or `status` | `data-status` on the button and the indicator; `aria-current="step"` on the current item; a visually hidden status after the name of a completed or danger step |
| disabled | `disabled` | native `disabled`, `data-disabled="true"`, `text-disabled`, muted indicator without halo |
| hover / press | pointer | vertical `fill-subtle` / `fill-subtle-active`; horizontal text → primary; press scale |
| focus-visible | keyboard | outer focus ring |

Root attributes: `data-orientation`, `data-size`. Uncontrolled (`defaultValue`) clicks still select items.

Motion: a status change fades the indicator's fill, color and halo over `base` and cross-fades its glyph (number ⇄ check ⇄ danger mark); the row fill and text color change over `fast`; press gives the step in by `--prime-motion-press-distance` (the kit press). Under reduced motion the press does not scale and the glyph only fades.

## Layout & spacing
- The root is a size container (`inline-size: 100%`): give it a definite width, a shrink-wrapped parent collapses it.
- Wizard: stepper column and form side by side with the page gap between groups, stacking on narrow widths.
- Vertical rows are separated by `var(--prime-space-1)` (`var(--prime-space-2)` at `size="xl"`); the same value is the row gap of a horizontal stepper stacked in a narrow container.
- On a coarse pointer a step is at least the touch target high.
- Horizontal steps and their chevrons sit 8 · 12 · 16 · 20 · 24 apart (xs → xl); below a 30rem (480px) container each step takes its own full-width row with the vertical row padding.
- Indicator → text gap 8 (xs, s) · 12 (m, l) · 16 (xl); titles are medium weight and wrap long words.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus between items; a disabled one is skipped. |
| `Enter` · `Space` | Selects the item. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Semantic `<ol>`; each item is a `<button>` inside an `<li>`; the current one has `aria-current="step"`.
- Separators, indicator and arrows are `aria-hidden`; the name comes from Title and Description, and a completed or danger step adds `labels.completed` or `labels.danger` to it.
- Give the `<ol>` an `aria-label` when there are several steppers on a page.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `completed` | `"пройден"` | Spoken after the name of a completed step; the check is only seen. |
| `danger` | `"требует внимания"` | Spoken after the name of a step that needs attention; its colour and glyph are only seen. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Steps of a process: done ones get a check, the current one is highlighted — `defaultValue`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: indicator 20 to 36 px, title in the control text of the tier — `size`. |
| [states.tsx](examples/states.tsx) | Statuses that come from the server, a failed step marked by a glyph and a locked step — `status`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | Vertical rows that open a page or panel end with a chevron — `arrows`. |
| [orientation.tsx](examples/orientation.tsx) | A row of steps with chevrons between them above the content, and a column for a side panel — `orientation`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the current step: Back and Next move it, far steps stay locked until reached — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | A horizontal stepper in a phone-width container stacks one step per row and hides the chevrons — `orientation`. |

## Mistakes
- Wrapping `Stepper.Item` in another component or element → it must be a direct child of Root (it throws otherwise).
- 1-based `value` → steps are 0-based.
- Adding separators by hand in horizontal mode → every step already draws its chevron.
- `status="error"` → the status is `danger`; its indicator shows the danger mark and its name says it, so it never reads by color only.
- A chevron added by hand at the end of a vertical row → set `arrows` on the root.
- `status="active"` → the step a person is on is `current`.

## Related
- **Built from:** Icon (`action.check`, `status.danger`, `nav.chevronRight`), `internal/glyphSwap` (the indicator glyph), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Tabs](../tabs/COMPONENT.md), [Pagination](../pagination/COMPONENT.md), [Timeline](../timeline/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md)
