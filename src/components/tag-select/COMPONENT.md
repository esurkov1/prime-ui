# Tag select

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## About

A multi-select field: selected values appear as removable chips (styled like [Tag](../tag/COMPONENT.md)); typing in the embedded input filters the dropdown list. Options are passed as **`options`** (value, label, optional **`Badge`** **`filled`** color). With **`creatable`**, the user can add a string that is not in the list; **`onCreated`** fires only when a new value is committed via Create / Enter (not when picking from **`options`**).

**When to use**

- Forms and filters where several labels from a known set are needed (channels, skills, topics) with optional ad-hoc values.
- Flows that combine chip display, inline filtering, and keyboard navigation in one control.

**When not to use**

- Exactly one choice from a closed set — prefer [Select](../select/COMPONENT.md).
- Free text without structured chips — prefer [Input](../input/COMPONENT.md) or [Textarea](../textarea/COMPONENT.md).
- Read-only tags without editing — prefer [Tag](../tag/COMPONENT.md) alone.

## Composition

- **`TagSelect.Root`** — owns **`options`**, **`value`** / **`defaultValue`**, **`onValueChange`**, **`creatable`**, **`onCreated`**, **`optionManagement`** (опционально: меню «⋯» у строки — переименование, палитра цветов, удаление из справочника), **`placeholder`**, **`hint`**, **`size`** (same [`Select`](../select) size axis as **`Select.Root`**), **`disabled`**, **`hasError`**, **`aria-label`** / **`aria-labelledby`**. Renders the chip row + input, a portaled listbox when open, and optional **`ScrollContainer`** for the option list.

### Canonical example

```tsx
import * as React from "react";
import { TagSelect } from "prime-ui-kit";

export function Example() {
  const [value, setValue] = React.useState<string[]>(["eng"]);

  return (
    <TagSelect.Root
      options={[
        { value: "eng", label: "Engineering", color: "blue" },
        { value: "design", label: "Design", color: "purple" },
        { value: "sales", label: "Sales", color: "green" },
      ]}
      value={value}
      onValueChange={setValue}
      placeholder="Add team…"
      aria-label="Teams"
    />
  );
}
```

### Scenarios (`examples/`)

| File | Intent |
|------|--------|
| [`examples/pattern-canonical.tsx`](./examples/pattern-canonical.tsx) | Controlled multi-select from **`options`** (`prime-ui-kit` import). |
| [`examples/pattern-features.tsx`](./examples/pattern-features.tsx) | **`creatable`** + filter; mirrors [`playground/snippets/tag-select/features.tsx`](../../../playground/snippets/tag-select/features.tsx). |

### Playground

Live demo: **`playground/sections/TagSelectSection.tsx`** — snippet **`playground/snippets/tag-select/features.tsx`**.

**LLM note:** Prefer runnable files under **`./examples/*.tsx`** for prop combinations; this page keeps the contract (rules + API) authoritative.

## Rules

- **`size`** follows the same **`Select`** control tier as **`Select.Root`**; nested **`Badge`** chips inherit size via **`ControlSizeProvider`**.
- **`onCreated`** is only invoked when a **new** value is added through creatable flow (Create row or Enter), not when selecting an existing **`options`** row.
- **`hasPanelContent`** gates the dropdown: if there are no list rows and no create row, the panel closes.
- Removing the last chip with empty input: **Backspace** removes the last selected value.
- Name the control with **`aria-label`** or **`aria-labelledby`** when there is no visible [Label](../label/COMPONENT.md).

## API

### TagSelect.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| options | `TagSelectOption[]` | — | Yes | Options: **`value`**, **`label`**, optional **`color`**, **`disabled`** |
| value | `string[]` | — | No | Controlled selected values |
| defaultValue | `string[]` | `[]` | No | Uncontrolled initial selected values |
| onValueChange | `(next: string[]) => void` | — | No | Called when selection changes |
| creatable | `boolean` | `false` | No | Allow creating a value not in **`options`** |
| onCreated | `(value: string) => void` | — | No | When **`creatable`**: fired for newly created values only |
| defaultTagColor | `BadgeColor` | `"gray"` | No | Chip color for values not in **`options`** |
| hint | `React.ReactNode` | `"Select an option or create one"` | No | Text above the list |
| createActionLabel | `string` | `"Create"` | No | Label for the create row |
| disabled | `boolean` | `false` | No | Disables the field |
| placeholder | `string` | `""` | No | Input placeholder |
| hasError | `boolean` | `false` | No | Error styling |
| size | `SelectSize` | `"m"` | No | Same size axis as **`Select.Root`** |
| optionManagement | `TagSelectOptionManagement` | — | No | Меню редактирования опции в списке (⋯): **`onUpdate`**, **`onDelete`**, опционально подписи |
| id | `string` | — | No | Root id (listbox and input ids are derived) |
| className | `string` | — | No | Extra class on the root |
| aria-label | `string` | — | No | Accessible name |
| aria-labelledby | `string` | — | No | References label ids |

### TagSelectOption

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| value | `string` | Yes | Stored in **`value[]`** |
| label | `string` | Yes | Chip and list row text |
| color | `BadgeColor` | No | **`Badge`** **`filled`** color in the list |
| disabled | `boolean` | No | Option not selectable |

### TagSelectOptionManagement

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| onUpdate | `(value: string, updates: { label?: string; color?: BadgeColor }) => void` | Yes | Обновить подпись и/или цвет; **`value`** опции не меняется |
| onDelete | `(value: string) => void` | Yes | Удалить опцию из справочника; выбранные значения с этим **`value`** снимаются |
| colorsSectionLabel | `string` | No | Заголовок блока цветов (по умолчанию «Colors») |
| deleteLabel | `string` | No | Подпись кнопки удаления (по умолчанию «Delete») |
| editMenuAriaLabelPrefix | `string` | No | Префикс **`aria-label`** кнопки ⋯ (по умолчанию «Edit tag») |

## Related

- [Select](../select/COMPONENT.md)
- [Tag](../tag/COMPONENT.md)
- [Badge](../badge/COMPONENT.md)
- [ScrollContainer](../scroll-container/ScrollContainer.tsx) (internal list)
