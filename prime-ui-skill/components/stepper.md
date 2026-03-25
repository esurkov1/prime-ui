# Stepper

## What it is

A set of components for displaying a multi-step process: a high-level `Stepper` on a semantic list and primitive `HorizontalStepper` / `VerticalStepper` with manual `state` on each step.

## What it’s for

- **Onboarding and setup wizards** — the user sees where they are in product onboarding or configuration.
- **Checkout and long forms** — short horizontal step labels (cart, delivery, payment) without cluttering the screen.
- **Document workflows and approvals** — reflecting application or contract stages with the option to highlight a problematic step (`status="error"`).
- **Editorial content** — a vertical step line with an arrow on the active stage (draft, edits, publish).
- **Notification and profile settings** — a primitive API with clickable steps and explicit `state` when logic comes from an API or store.
- **CI/CD and internal dashboards** — a full-width stage bar on a release or pipeline card.

## Use cases

Each example targets a different screen type and API slice.

### Basic

A vertical wizard with automatic step numbers and labels; the active step is set via `currentStep`.

```tsx
import { Stepper } from "prime-ui-kit";

export function OnboardingSteps() {
  const step = 1;

  return (
    <Stepper.Root currentStep={step} size="m">
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Account" description="Create or link sign-in" />
        <Stepper.Arrow />
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Team" description="Invite colleagues" />
        <Stepper.Arrow />
      </Stepper.Step>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Done" description="You can start using the product" />
      </Stepper.Step>
    </Stepper.Root>
  );
}
```

### Variants / sizes

A horizontal checkout stage rail: `orientation="horizontal"`, `SeparatorIcon` dividers, no descriptions under titles.

```tsx
import { Stepper } from "prime-ui-kit";

export function CheckoutRail() {
  return (
    <Stepper.Root orientation="horizontal" currentStep={1} size="l" className="w-full max-w-2xl">
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Cart" />
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Delivery" />
      </Stepper.Step>
      <Stepper.SeparatorIcon />
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Payment" />
      </Stepper.Step>
    </Stepper.Root>
  );
}
```

### In context (form / modal / sidebar / …)

A settings column with a primitive vertical stepper: step state is computed in the parent; click switches the active index (typical for a side panel).

```tsx
import * as React from "react";
import { VerticalStepper } from "prime-ui-kit";

const rows = [
  { id: "channels", label: "Channels", hint: "1" },
  { id: "quiet", label: "Quiet hours", hint: "2" },
  { id: "digest", label: "Digest", hint: "3" },
] as const;

export function NotificationSidebarPanel() {
  const [active, setActive] = React.useState(0);

  const stateAt = (i: number) =>
    i < active ? "completed" : i === active ? "active" : "default";

  return (
    <aside className="w-56 border-r p-4">
      <VerticalStepper.Root size="m">
        {rows.map((row, i) => (
          <VerticalStepper.Item key={row.id} state={stateAt(i)} onClick={() => setActive(i)}>
            <VerticalStepper.ItemIndicator>{row.hint}</VerticalStepper.ItemIndicator>
            {row.label}
            {stateAt(i) === "active" ? <VerticalStepper.Arrow /> : null}
          </VerticalStepper.Item>
        ))}
      </VerticalStepper.Root>
    </aside>
  );
}
```

### Controlled mode

Step index and navigation buttons live in one survey or wizard container.

```tsx
import * as React from "react";
import { Button, Stepper } from "prime-ui-kit";

export function ControlledWizard() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const max = 2;

  return (
    <div className="flex flex-col gap-4">
      <Stepper.Root currentStep={currentStep}>
        <Stepper.Step onClick={() => setCurrentStep(0)}>
          <Stepper.Indicator />
          <Stepper.Content title="Terms" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setCurrentStep(1)}>
          <Stepper.Indicator />
          <Stepper.Content title="Survey" />
          <Stepper.Arrow />
        </Stepper.Step>
        <Stepper.Step onClick={() => setCurrentStep(2)}>
          <Stepper.Indicator />
          <Stepper.Content title="Submit" />
        </Stepper.Step>
      </Stepper.Root>
      <div className="flex gap-2">
        <Button.Root
          mode="stroke"
          variant="neutral"
          disabled={currentStep <= 0}
          onClick={() => setCurrentStep((s) => s - 1)}
        >
          Back
        </Button.Root>
        <Button.Root
          mode="filled"
          variant="primary"
          disabled={currentStep >= max}
          onClick={() => setCurrentStep((s) => s + 1)}
        >
          Next
        </Button.Root>
      </div>
    </div>
  );
}
```

## Anatomy

**High-level Stepper**

- `Stepper.Root` — `<ol>` with context for orientation, `currentStep`, size, and an index counter for child steps.
- `Stepper.Step` / `Stepper.Item` — `<li>` + `<button>`; step context exposes status and index.
- `Stepper.Indicator` / `Stepper.ItemIndicator` — `span` with a number, a checkmark when `completed`, or custom `children`.
- `Stepper.Content` — title and optional description.
- `Stepper.SeparatorIcon` — `<li>` with a chevron between horizontal steps.
- `Stepper.Arrow` — arrow on a vertical step (delegates to `VerticalStepper.Arrow`).

**HorizontalStepper**

- `Root` → `SeparatorIcon` | `Item` (button) → inside, `ItemIndicator`.

**VerticalStepper**

- `Root` → `Item` → `ItemIndicator`, text, optional `Arrow`.

## API

### Stepper.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| orientation | `"horizontal" \| "vertical"` | `"vertical"` | No | Direction of the step list. |
| currentStep | `number` | `0` | No | Active step index for auto statuses. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control tier and typography. |
| children | `React.ReactNode` | — | Yes | Steps and, when horizontal, `SeparatorIcon`. |
| className | `string` | — | No | Class on `<ol>`. |

### Stepper.Step (Stepper.Item)

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| index | `number` | auto | No | Explicit index for status and indicator number. |
| status | `StepStatus` | from `currentStep` | No | `pending` \| `active` \| `completed` \| `error`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Button type. |
| disabled | `boolean` | — | No | Disables the step. |
| className | `string` | — | No | Button class. |
| children | `React.ReactNode` | — | Yes | Step markup. |
| …rest | `ButtonHTMLAttributes` (without `type`) | — | No | Remaining button attributes. |

### Stepper.Indicator (Stepper.ItemIndicator)

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | number / checkmark | No | Custom indicator. |
| className | `string` | — | No | `span` class. |

### Stepper.Content

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| title | `string` | — | Yes | Title. |
| description | `string` | — | No | Subtitle. |
| className | `string` | — | No | Text block wrapper class. |

### Stepper.SeparatorIcon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class on the icon inside `li`. |

### Stepper.Arrow

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | `ElementType` | `IconChevronRight` | No | Replace icon component. |
| className | `string` | — | No | Icon class. |
| …rest | props of `as` | — | No | Forwarded to the icon. |

### HorizontalStepper.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Tier size. |
| className | `string` | — | No | `div` class. |
| children | `React.ReactNode` | — | No | Rail markup. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | No | Container attributes. |

### HorizontalStepper.SeparatorIcon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | `ElementType` | `IconChevronRight` | No | Alternate separator icon. |
| className | `string` | — | No | SVG class. |
| …rest | props of `as` | — | No | Forwarded to the icon. |

### HorizontalStepper.Item

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| state | `StepperAlignItemState` | `"default"` | No | `default` \| `active` \| `completed`. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Button type. |
| className | `string` | — | No | Button class. |
| children | `React.ReactNode` | — | No | Indicator and label. |
| …rest | `ButtonHTMLAttributes` (without `type`) | — | No | Remaining attributes. |

### HorizontalStepper.ItemIndicator

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| state | `StepperAlignItemState` | from context | No | State override. |
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | checkmark when completed | No | Circle contents. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

### VerticalStepper.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Tier size. |
| className | `string` | — | No | `div` class. |
| children | `React.ReactNode` | — | No | Vertical `Item`s. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | No | Container attributes. |

### VerticalStepper.Arrow

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| as | `ElementType` | `IconChevronRight` | No | Alternate icon. |
| className | `string` | — | No | Icon class. |
| …rest | props of `as` | — | No | Forwarded to the icon. |

### VerticalStepper.Item

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| state | `StepperAlignItemState` | `"default"` | No | Row state. |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | Button type. |
| className | `string` | — | No | Button class. |
| children | `React.ReactNode` | — | No | Indicator, text, arrow. |
| …rest | `ButtonHTMLAttributes` (without `type`) | — | No | Remaining attributes. |

### VerticalStepper.ItemIndicator

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| state | `StepperAlignItemState` | from context | No | Indicator state. |
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | checkmark when completed | No | Circle contents. |
| …rest | `HTMLAttributes<HTMLDivElement>` | — | No | `div` attributes. |

The `StepperAlignItemState` type is exported from the package for primitives; the high-level `Stepper` uses `StepStatus` for steps (`pending` instead of `default` in primitives).

## Variants

- **Two API levels:** semantic `Stepper` with `currentStep` and automatic numbering, or `HorizontalStepper` / `VerticalStepper` with explicit `state` on each `Item`.
- **Orientation:** `horizontal` — a rail with optional `SeparatorIcon`; `vertical` (default) — a column, often with `Stepper.Arrow` on the active step.
- **Size:** root `size` sets a single tier for the step and text across all subcomponents in that branch.

## States

- **Auto from `currentStep`:** steps before the index are `completed`, equal index is `active`, after are `pending`.
- **Manual `status` on `Stepper.Step`:** you can pin an error (`error`) or another status independent of index; for errors, `data-legacy-status="error"` is styled on the button and indicator.
- **Primitives:** only three visual `state` values: `default`, `active`, `completed` (no separate `error` in the type — handle errors on the high-level `Stepper` or with custom indicator content).
- **disabled:** standard button disabling.

## Accessibility (a11y)

- The high-level `Stepper` renders an **ordered list** `<ol>` / `<li>` — screen readers get step order.
- The active step sets **`aria-current="step"`** on the button.
- Indicators and separators use **`aria-hidden`** where the number is duplicated in adjacent text; with custom indicator symbols, meaning should live in the step label.
- Keyboard: focus on step buttons; transition logic is app-side (`onClick`, routing, controlled `currentStep`).

## Limitations and notes

- `SeparatorIcon` inside `Stepper` is meant for **horizontal** orientation; in vertical layout, separators between items are not inserted with the same component.
- Primitives do **not** form a semantic step list by themselves — set `role` / markup externally if needed.
- The index counter on `Stepper.Root` is **sequential** for steps without explicit `index`; mixing explicit and automatic indices requires attention to child order.
- Step transitions (validation, draft save) are **not built into** the package — only display and button clicks.

## Related components

- **Button** — “Next” / “Back” actions next to a controlled stepper.
- **Modal / Drawer** — wrappers for multi-step wizards.
- **Breadcrumb** — when you need page hierarchy, not stages of one flow.
- **Progress bar** — when completion fraction matters, not discrete steps.
- **Icon** (or exports from `prime-ui-kit/icons`) — pass into `as` on separator and arrow in primitives.
