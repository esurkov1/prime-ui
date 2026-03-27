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

### Canonical composition (reference)

For a **single file** that combines **controlled mode**, **`SegmentedControl.Icon` + text**, **icon-only segments with visually hidden labels**, and layout notes (remember **`Root` does not forward `aria-label`**), see **`examples/canonical-composition.tsx`**. Imports use **`"prime-ui-kit"`** so the same patterns work in an app after installing the package.

The **playground** (`playground/sections/SegmentedControlSection.tsx`) renders the same scenarios as **`playground/snippets/segmented/*.tsx`** (internal `@/` imports). The **`examples/`** files below mirror those snippets with **`"prime-ui-kit"`** imports.

### Example files in `examples/`

| File | Scenario (aligned with `playground/snippets/segmented/`) |
|------|----------|
| `sizes.tsx` | All four **`size`** values `s`–`xl` with identical segment labels |
| `states.tsx` | Default group; **`disabled`** on one **`Item`**; **`disabled`** on **`Root`** |
| `controlled.tsx` | **`value`** + **`onValueChange`** (no **`defaultValue`**) |
| `composition.tsx` | **`Icon`** + label text; icon-only rows with visually hidden text in **`Item`** |
| `full-width.tsx` | Narrow container; **`className`** overrides root **`width: fit-content`** so segments share width |
| `features.tsx` | Two, three, and four segments; keyboard (**ArrowLeft** / **ArrowRight** on the group) |

Additional English product-style recipes:

| File | Scenario |
|------|----------|
| `canonical-composition.tsx` | Combined: icons, controlled period, icon-only (superset demo) |
| `view-mode.tsx` | Catalog view: List / Grid / Table |
| `pricing-toggle.tsx` | Billing: Monthly / Annual |
| `catalog-filters.tsx` | Compact availability filter; **`size="s"`** |

### Note for LLMs

- **Imports:** `SegmentedControl`, `Icon`, and `Typography` from **`"prime-ui-kit"`** in **`examples/`**; paths are relative to `src/components/segmented-control/examples/`. Playground snippets use **`@/…`** but should stay behavior-identical to these files.
- **Values are strings:** map `onValueChange` to app enums with a type guard or narrow union; **`Item` does not accept `aria-label`**—accessible names come from **visible** `children` and/or **visually hidden** text inside **`Item`**.
- **`SegmentedControl.Icon`** is **`aria-hidden`**; always pair with visible text or a visually hidden span inside the same **`Item`**.
- **`Root`** does **not** forward **`aria-label`**, **`aria-labelledby`**, or **`style`**: use a **wrapper** and visible copy, or **`aria-labelledby`** on a wrapper that references visible page text—not on **`Root`**.
- **Keyboard:** **ArrowLeft** / **ArrowRight** move among **enabled** items; **`disabled`** on **`Item`** is skipped; **`defaultValue=""`** leaves no selection and **`Root`** is focusable until the user picks a segment.
- **Many options or vertical layout:** prefer [Select](../select/COMPONENT.md); **tabbed panels** → [Tabs](../tabs/COMPONENT.md).

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
| className | `string` | — | No | Extra class on the container (e.g. full-width override when the default **`width: fit-content`** is too narrow—see **`examples/full-width.tsx`**) |

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
