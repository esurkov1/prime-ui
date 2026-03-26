# Stepper

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Multi-step progress UI: a high-level **`Stepper`** on a semantic ordered list (`<ol>` / `<li>`), plus primitive **`HorizontalStepper`** and **`VerticalStepper`** layouts where each row owns an explicit visual **`state`**.

- **Use** for wizards, checkout or form stages, and any flow where discrete steps should read clearly in order.
- **Use** **`Stepper`** when **`currentStep`** (and optional per-step **`status`**) should drive numbering and completed/active/pending visuals.
- **Use** **`HorizontalStepper`** / **`VerticalStepper`** when step logic lives in the app (store, API) and you set **`state`** on each **`Item`** yourself.
- **Do not use** as a page hierarchy control; prefer breadcrumbs for site structure.
- **Do not use** when a single continuous fraction matters more than discrete steps; consider a progress bar.
- **Do not use** primitive rails alone when you need a native **ordered list** semantics for steps—wrap with appropriate roles/markup or use **`Stepper.Root`**.

## Composition

- **`Stepper.Root`** — `<ol>`; provides **`orientation`**, **`currentStep`**, **`size`**, and a per-render counter for automatic step indices. Children: **`Stepper.Step`** (alias **`Stepper.Item`**) and, in horizontal flows, **`Stepper.SeparatorIcon`** between steps.
- **`Stepper.Step` / `Stepper.Item`** — `<li>` wrapping a **`<button>`**; supplies step context (**`status`**, **`index`**) to **`Indicator`** and **`Content`**. Optional **`Stepper.Arrow`** after content is common in **vertical** orientation.
- **`Stepper.Indicator` / `Stepper.ItemIndicator`** — **`span`**; default shows **1-based index** or a checkmark when completed; **`aria-hidden`**. Maps high-level **`error`** to **`data-legacy-status="error"`** for styling.
- **`Stepper.Content`** — title and optional description beside the indicator.
- **`Stepper.SeparatorIcon`** — `<li>` with a chevron between horizontal steps (delegates to **`HorizontalStepper.SeparatorIcon`**).
- **`Stepper.Arrow`** — vertical arrow icon (delegates to **`VerticalStepper.Arrow`**).
- **`HorizontalStepper.Root`** — non-semantic **`div`** rail; children: **`SeparatorIcon`** and **`Item`** buttons, each with **`ItemIndicator`** inside.
- **`VerticalStepper.Root`** — non-semantic **`div`** column; children: **`Item`** rows with **`ItemIndicator`**, label text, and optional **`Arrow`**.

### Minimal example

```tsx
import { Stepper } from "prime-ui-kit";

export function Example() {
  return (
    <Stepper.Root>
      <Stepper.Step>
        <Stepper.Indicator />
        <Stepper.Content title="Step one" />
      </Stepper.Step>
    </Stepper.Root>
  );
}
```

## Rules

- **`Stepper.Root`**: **`currentStep`** defaults to **`0`**; indices before it are **`completed`**, equal index is **`active`**, after are **`pending`**. Override any step with **`status`** on **`Stepper.Step`** (e.g. **`error`**).
- **`Stepper.Step`** without **`index`** consumes the next auto index in child order; mixing explicit **`index`** and auto indices requires careful ordering.
- **`SeparatorIcon`** is intended for **`orientation="horizontal"`**; it is not the vertical connector pattern.
- Primitives use **`StepperAlignItemState`**: **`default`** \| **`active`** \| **`completed`** only—no built-in **`error`**; use **`Stepper`** for **`error`** or custom indicator content.
- Active step sets **`aria-current="step"`** on the **`Stepper`** step button; indicators and separators use **`aria-hidden`** where the label carries meaning—keep titles/descriptions meaningful for assistive tech.
- **`HorizontalStepper`** / **`VerticalStepper`** do not emit **`<ol>`** / **`<li>`**; add list semantics externally if required.
- Step transitions, validation, and routing are **app-owned**; the kit handles presentation and button interactions only.

## API

Exported types include **`StepStatus`**, **`StepperOrientation`**, **`StepperSize`**, and **`StepperAlignItemState`** (for primitives).

### Stepper.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| orientation | `"horizontal" \| "vertical"` | `"vertical"` | No | Layout of the step list |
| currentStep | `number` | `0` | No | Active step index for default statuses |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control tier for the subtree |
| children | `React.ReactNode` | — | Yes | Steps and optional **`SeparatorIcon`** |
| className | `string` | — | No | Class on **`<ol>`** |

### Stepper.Step (Stepper.Item)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| index | `number` | auto | No | Step index for status and indicator |
| status | `StepStatus` | from **`currentStep`** | No | **`pending`** \| **`active`** \| **`completed`** \| **`error`** |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | **`button`** **`type`** |
| disabled | `boolean` | — | No | Disables the step button |
| className | `string` | — | No | Class on **`<button>`** |
| children | `React.ReactNode` | — | Yes | Indicator, content, optional arrow |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">` | — | No | Other button attributes (**`ref`** supported) |

### Stepper.Indicator (Stepper.ItemIndicator)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | index / checkmark | No | Custom indicator content |
| className | `string` | — | No | Class on **`span`** |

### Stepper.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| title | `string` | — | Yes | Primary label |
| description | `string` | — | No | Secondary text |
| className | `string` | — | No | Wrapper class |

### Stepper.SeparatorIcon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the inner icon |

### Stepper.Arrow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `React.ElementType` | `IconChevronRight` | No | Icon component |
| className | `string` | — | No | Class on the icon |
| …rest | props of **`as`** | — | No | Forwarded to the icon |

### HorizontalStepper.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control tier |
| className | `string` | — | No | Class on **`div`** |
| children | `React.ReactNode` | — | No | Rail content |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Container attributes |

### HorizontalStepper.SeparatorIcon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `React.ElementType` | `IconChevronRight` | No | Separator icon component |
| className | `string` | — | No | Class on the SVG |
| …rest | `Omit<React.ComponentPropsWithoutRef<T>, "as" \| "className">` | — | No | Forwarded to **`as`** |

### HorizontalStepper.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| state | `StepperAlignItemState` | `"default"` | No | **`default`** \| **`active`** \| **`completed`** |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | **`button`** **`type`** |
| className | `string` | — | No | Class on **`<button>`** |
| children | `React.ReactNode` | — | No | Indicator and label |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">` | — | No | Other button attributes (**`ref`** supported) |

### HorizontalStepper.ItemIndicator

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| state | `StepperAlignItemState` | from context | No | Visual override |
| className | `string` | — | No | Class on **`div`** |
| children | `React.ReactNode` | checkmark when completed | No | Circle contents when not completed |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | **`div`** attributes |

### VerticalStepper.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Control tier |
| className | `string` | — | No | Class on **`div`** |
| children | `React.ReactNode` | — | No | Vertical items |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Container attributes |

### VerticalStepper.Arrow

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| as | `React.ElementType` | `IconChevronRight` | No | Icon component |
| className | `string` | — | No | Class on the icon |
| …rest | `Omit<React.ComponentPropsWithoutRef<T>, "as" \| "className">` | — | No | Forwarded to **`as`** |

### VerticalStepper.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| state | `StepperAlignItemState` | `"default"` | No | Row state |
| type | `"button" \| "submit" \| "reset"` | `"button"` | No | **`button`** **`type`** |
| className | `string` | — | No | Class on **`<button>`** |
| children | `React.ReactNode` | — | No | Indicator, text, optional arrow |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">` | — | No | Other button attributes (**`ref`** supported) |

### VerticalStepper.ItemIndicator

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| state | `StepperAlignItemState` | from context | No | Indicator state |
| className | `string` | — | No | Class on **`div`** |
| children | `React.ReactNode` | checkmark when completed | No | Circle contents when not completed |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | **`div`** attributes |

## Related

- [Button](../button/COMPONENT.md) — next/back actions next to a controlled stepper
- [Modal](../modal/COMPONENT.md) and [Drawer](../drawer/COMPONENT.md) — wizard shells
- [Breadcrumb](../breadcrumb/COMPONENT.md) — hierarchy, not linear stages
- [Progress bar](../progress-bar/COMPONENT.md) — continuous progress instead of discrete steps
