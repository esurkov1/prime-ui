# SegmentedControl

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A single-choice control: a horizontal `radiogroup` whose options are segment buttons, with a floating pill indicator under the active segment.

- **Use** when there are few mutually exclusive options that should stay visible (period toggles, layout mode, compact filters).
- **Use** with **`SegmentedControl.Icon`** plus visible or visually hidden text when a segment is icon-led.
- **Do not use** for long lists or many options—prefer [Select](../select/COMPONENT.md) or a dropdown.
- **Do not use** when each choice should show its own panel and tab keyboard model—prefer [Tabs](../tabs/COMPONENT.md).
- **Do not use** for independent or multi-select actions—prefer [Button group](../button-group/COMPONENT.md) or other patterns.
- **Do not use** expecting a vertical stack or orientation prop; layout is horizontal only.

## Composition

- **`SegmentedControl.Root`** — outer `div` with **`role="radiogroup"`**, **`data-size`**, focus and arrow-key handling, **`ControlSizeProvider`** for descendants, and a decorative indicator layer (`aria-hidden`).
- **`SegmentedControl.Item`** — direct children of **`Root`** (and only in that role for correct behavior). Each item is a **`button`** with **`role="radio"`**; order in the tree is the visual order of segments.
- **`SegmentedControl.Icon`** — optional **`span`** with **`aria-hidden="true"`** inside an **`Item`**; pair with visible label text or an accessible name in **`Item`** **`children`**.

### Minimal example

```tsx
import { SegmentedControl } from "prime-ui-kit";

export function Example() {
  return (
    <SegmentedControl.Root defaultValue="a">
      <SegmentedControl.Item value="a">A</SegmentedControl.Item>
      <SegmentedControl.Item value="b">B</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

## Rules

- **Controlled:** pass **`value`** and handle changes with **`onValueChange`**. **Uncontrolled:** use **`defaultValue`** (defaults to **`""`**).
- **`defaultValue=""`** (and no controlled **`value`**) means **no** segment is selected; **`Root`** gets **`tabIndex={0}`** so the group can be focused until a segment is chosen.
- Values are **strings**; mapping to app enums or unions is the consumer’s responsibility.
- **`disabled`** on **`Root`** sets **`aria-disabled`** on the group and **`data-disabled`**; all segments are inactive.
- **`disabled`** on an **`Item`** skips that segment for **Left/Right** arrow navigation among enabled radios.
- **Roving tabindex:** **Tab** focuses the group (when nothing is selected) or the checked segment; **ArrowLeft** / **ArrowRight** move selection and focus across enabled items.
- **`SegmentedControl.Icon`** is **`aria-hidden`**; the segment’s accessible name must come from **`Item`** **`children`** (visible text and/or visually hidden text). **`Item`** does not forward extra attributes—there is no **`…rest`**—so you cannot set **`aria-label`** on the segment via props.
- **No `asChild`** and no merging **`Root`** with an arbitrary element.
- **`Root`** does **not** forward arbitrary HTML attributes (**`aria-label`**, **`style`**, etc.); wrap **`Root`** in another element when you need extra semantics or layout hooks.
- The indicator position follows the active segment’s layout; updates use **`ResizeObserver`** and **`MutationObserver`** on the root—avoid unpredictable segment size changes without expecting a reflow/recalc.

## API

### SegmentedControl.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | No | Selected value in controlled mode |
| defaultValue | `string` | `""` | No | Initial value when uncontrolled; empty string means no segment selected |
| onValueChange | `(value: string) => void` | — | No | Called when the selected value changes |
| disabled | `boolean` | `false` | No | Disables the entire group |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Segment dimensions and typography |
| children | `React.ReactNode` | — | Yes | `Item` nodes (and their content) |
| className | `string` | — | No | Extra class on the container |

### SegmentedControl.Item

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | Yes | Segment identifier |
| disabled | `boolean` | `false` | No | Disables this segment |
| children | `React.ReactNode` | — | Yes | Label and/or `SegmentedControl.Icon` |
| className | `string` | — | No | Extra class on the button |

### SegmentedControl.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon node |
| className | `string` | — | No | Extra class on the `span` |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other `span` attributes |

## Related

- [Tabs](../tabs/COMPONENT.md) — separate panels and tab keyboard model.
- [Button group](../button-group/COMPONENT.md) — grouped actions, not a single required choice.
- [Radio](../radio/COMPONENT.md) — standalone radio field primitive.
- [Select](../select/COMPONENT.md) — many options or list in a dropdown.
