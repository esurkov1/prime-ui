# Select

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## About

A field for choosing from a closed set of options. By default (**`native`** `false`) it is a combobox — a trigger shows the current choice or a placeholder, and a portaled listbox lets the user pick. Set **`multiple`** to **`true`** on **`Select.Root`** for multiselect: **`value`** / **`defaultValue`** / **`onChange`** use **`string[]`**; picking toggles options; the list stays open until blur, outside click, or **Escape**; **`Select.Value`** shows selected labels joined with **`, `**; the listbox sets **`aria-multiselectable`**.

With **`native`** `true`, **`Select.Root`** renders a native **`<select>`** (single) or **`<select multiple>`** (when **`multiple`** is **`true`**) with **`<option>`** / **`<optgroup>`** built from the same **`Select.Item`** (and optional **`Select.Group`**) tree.

**When to use**

- Forms, settings, and filters where one or many options must be chosen from a predefined list (role, country, departments, themes, intervals).
- Flows where a compact trigger is enough and the full list should open on demand with keyboard support.
- Long option lists structured with **`Select.Group`**, **`Select.GroupLabel`**, and **`Select.Separator`**.
- Multiselect from the same list without chips or free-text creation — **`multiple`** on the combobox, or **`native`** + **`multiple`** for a platform **`<select multiple>`**.

**When not to use**

- Free text or ad-hoc tags with a chip row and optional “create” — prefer [Tag select](../tag-select/COMPONENT.md).
- Async search-as-you-type or virtualized remote lists — this primitive expects static **`Select.Item`** children (extend at the app layer if needed).
- Command or action menus — use [Dropdown](../dropdown/COMPONENT.md) when choices are actions, not form values.

## Composition

- **`Select.Root`** — owns **`native`**, **`multiple`**, value (string or **`string[]`** depending on **`multiple`**), **`size`**, **`hasError`**, **`disabled`**, **`placeholder`**. When **`native`** is `false`, the combobox also owns open state and highlight. Wrap everything else.
- **`Select.Trigger`** — (non-**`native`** only) the combobox **`button`**. Put **`Select.Value`** inside; optionally **`Select.TriggerIcon`** before **`Select.Value`**. The implementation sets the trigger **`id`**; associate an external [Label](../label/COMPONENT.md) with **`aria-labelledby`** pointing at the label’s **`id`**.
- **`Select.Value`** — (non-**`native`** only) displays the selected label(s): one label in single mode, or comma-separated labels in **`multiple`** mode, otherwise **`placeholder`** when empty.
- **`Select.Content`** — when **`native`** is `false`: portaled **`role="listbox"`** with **`display: none`** and **`aria-hidden`** while closed (items stay mounted so **`Select.Item`** can register labels for **`Select.Value`** — do not unmount the list when closed). Closed panel uses **`pointer-events: none`** so fixed layers in **`body`** do not block navigation. With **`multiple`**, the listbox gets **`aria-multiselectable="true"`**. When **`native`** is `true`, **`Select.Content`** is optional; items build the **`<select>`** DOM.
- **`Select.Item`** — one option per row; optional **`Select.ItemIcon`** children are split into a leading icon slot vs label text (stable marker on **`Select.ItemIcon`**, not only `===` type — duplicate module chunks in the bundle still work). Row spacing tokens are applied on the item (**`data-size`** from root). Use **`label`** when the trigger should show different text than the row content.
- **`Select.Group`** / **`Select.GroupLabel`** / **`Select.Separator`** — optional structure inside **`Select.Content`** (or under **`native`** root for optgroups).

### Canonical example (single)

```tsx
import * as React from "react";
import { Label, Select, Typography } from "prime-ui-kit";

export function Example() {
  const labelId = React.useId();

  return (
    <div>
      <Label.Root id={labelId}>
        Department
      </Label.Root>
      <Select.Root placeholder="Choose">
        <Select.Trigger aria-labelledby={labelId}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="eng">Engineering</Select.Item>
          <Select.Item value="design">Design</Select.Item>
          <Select.Item value="sales">Sales</Select.Item>
        </Select.Content>
      </Select.Root>
      <Typography.Root as="p" variant="caption" tone="muted">
        Used for routing internal requests only.
      </Typography.Root>
    </div>
  );
}
```

### Multiselect (combobox)

```tsx
import * as React from "react";
import { Select } from "prime-ui-kit";

export function MultiExample() {
  const [value, setValue] = React.useState<string[]>(["eng"]);

  return (
    <Select.Root multiple value={value} onChange={setValue} placeholder="Choose departments">
      <Select.Trigger aria-label="Departments">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="eng">Engineering</Select.Item>
        <Select.Item value="design">Design</Select.Item>
        <Select.Item value="sales">Sales</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
```

### Native `<select>` (`native`)

```tsx
import { Select } from "prime-ui-kit";

export function NativeExample() {
  return (
    <Select.Root native placeholder="Choose">
      <Select.Item value="a">Option A</Select.Item>
      <Select.Item value="b">Option B</Select.Item>
    </Select.Root>
  );
}
```

### Native `<select multiple>` (`native` + `multiple`)

```tsx
import * as React from "react";
import { Select } from "prime-ui-kit";

export function NativeMultiExample() {
  const [value, setValue] = React.useState<string[]>(["a"]);

  return (
    <Select.Root native multiple value={value} onChange={setValue}>
      <Select.Item value="a">Option A</Select.Item>
      <Select.Item value="b">Option B</Select.Item>
    </Select.Root>
  );
}
```

You can wrap items in **`Select.Content`** for parity with the composable tree; behavior is the same.

### Playground snippets (live demos)

These files power **`playground/sections/SelectSection.tsx`** (Russian copy in the playground UI). Order matches the section.

| File | Intent |
|------|--------|
| `playground/snippets/select/sizes.tsx` | Four **`size`** values **`s`–`xl`** in one column |
| `playground/snippets/select/states.tsx` | Placeholder only, **`defaultValue`**, root **`disabled`**, **`hasError`** |
| `playground/snippets/select/controlled.tsx` | **`value`** / **`onChange`** with caption showing parent state |
| `playground/snippets/select/composition.tsx` | **`Select.TriggerIcon`**, **`Select.ItemIcon`**, item **`label`** vs short row text |
| `playground/snippets/select/full-width.tsx` | Trigger fills a narrow shell (**`width: 100%`** from kit styles) |
| `playground/snippets/select/native.tsx` | **`Select.Root`** **`native`** with optional **`Select.Content`** wrapper |
| `playground/snippets/select/multiple.tsx` | **`Select.Root`** **`multiple`**: **`string[]`** value, list stays open on pick |
| `playground/snippets/select/features.tsx` | **`Group`** / **`GroupLabel`** / **`Separator`**, disabled item, long list + scroll |

### Examples next to this file

Runnable examples use **`@/`** in the workspace; published consumers import **`prime-ui-kit`**. **`pattern-*`** files mirror the playground snippets above in English (same APIs).

| File | Intent |
|------|--------|
| `examples/pattern-sizes.tsx` | **`sizes.tsx`** snippet |
| `examples/pattern-states.tsx` | **`states.tsx`** snippet |
| `examples/pattern-controlled.tsx` | **`controlled.tsx`** snippet |
| `examples/pattern-multiple.tsx` | **`multiple.tsx`** snippet |
| `examples/pattern-composition.tsx` | **`composition.tsx`** snippet |
| `examples/pattern-full-width.tsx` | **`full-width.tsx`** snippet |
| `examples/pattern-native.tsx` | **`native.tsx`** snippet |
| `examples/pattern-features.tsx` | **`features.tsx`** snippet |

### Additional scenarios

| File | Intent |
|------|--------|
| [`./examples/01-country.tsx`](./examples/01-country.tsx) | Visible **`Label.Root`** + **`aria-labelledby`** on **`Select.Trigger`** and helper copy |
| [`./examples/02-controlled.tsx`](./examples/02-controlled.tsx) | Controlled **`value`** / **`onChange`** with **`Label.Root`** (same tier options as **`pattern-controlled.tsx`**) |
| [`./examples/03-groups.tsx`](./examples/03-groups.tsx) | Time zones with **`Select.Group`**, **`Select.GroupLabel`**, **`Select.Separator`** |
| [`./examples/04-full-width-form.tsx`](./examples/04-full-width-form.tsx) | Multi-field form column; triggers span the track |

**LLM note:** Prefer **`pattern-*`** and `playground/snippets/select/*.tsx` for parity with live demos; use **`01`–`04`** for labeled forms and richer scenarios. This page keeps the contract (rules + API tables) authoritative.

## Rules

- **`native`** — default **`false`**. **`true`**: **`<select>`** (or **`<select multiple>`** when **`multiple`** is **`true`**) with kit styling; combobox trigger, portaled listbox, and listbox keyboard model are not used for the single-select native path. Options are collected by walking **`children`** for **`Select.Item`** (and **`Select.Group`** / **`Select.GroupLabel`** → **`<optgroup>`**; **`Select.Separator`** is skipped). **`placeholder`** adds a first **`<option value="">`** for single native select; do not use **`value=""`** on an **`Select.Item`** if you rely on that placeholder. **`Select.ItemIcon`** / **`Select.TriggerIcon`** are not represented in the native control.
- **`multiple`** — default **`false`**. **`true`**: use **`string[]`** for **`value`**, **`defaultValue`**, and **`onChange`**. Combobox: toggling an option does not close the list; **`Select.Value`** joins labels in selection order. Native: platform rules for **`<select multiple>`** (e.g. modifier keys for multi-select on desktop).
- **Controlled:** set **`value`** and **`onChange`** together (types follow **`multiple`**). **Uncontrolled:** use **`defaultValue`** or neither; initial empty selection is **`undefined`** / **`[]`** as appropriate.
- **`onChange`** fires when the controlled value changes (string or **`string[]`**).
- **`disabled`** on **`Select.Root`** prevents opening the list and selecting; the trigger is inactive (combobox) or the **`<select>`** is disabled (native).
- **`disabled`** on **`Select.Item`** skips that option for pointer selection and for arrow-key navigation among enabled options only.
- **`hasError`** on **`Select.Root`** applies error styling to the trigger (combobox) or native select.
- **Width:** there is no **`fullWidth`** prop on **`Select.Root`**. The combobox trigger uses **`width: 100%`** — constrain with the parent layout.
- **`Select.Content`** uses **`Portal`**; **`Select.Item`** effects call **`onInitLabel`** so **`Select.Value`** stays aligned with item labels. While open, the listbox **repositions** like **Dropdown** / **Popover**: **`resize`** on **`window`** and **`visualViewport`**, **`scroll`** on the trigger’s scroll ancestors, and **`ResizeObserver`** on the panel when the runtime supports it — the panel stays anchored to the trigger when the page or a scroll container moves.
- **`Select.Content`** (combobox): on open the listbox receives focus; **Escape** and outside click close. **Enter** / **Space** on a highlighted option applies selection (toggle in **`multiple`** mode). With **`multiple`**, the listbox is **`aria-multiselectable`**.
- **`Select.Trigger`** is **`role="combobox"`** with **`aria-expanded`**, **`aria-haspopup="listbox"`**, **`aria-controls`**. Items use **`role="option"`**, **`aria-selected`**, **`aria-disabled`** when disabled.
- If there is no visible label on the trigger, set **`aria-label`** on **`Select.Trigger`**, or **`aria-labelledby`** with an external [Label](../label/COMPONENT.md).
- List position is resolved internally; there are no public **`side`** / **`align`** props on **`Select.Content`**.

## API

### Select.Root

Discriminated by **`multiple`** and **`native`**:

| Mode | `value` / `defaultValue` | `onChange` |
|------|--------------------------|------------|
| Default (combobox, single) | `string` | `(value: string) => void` |
| Combobox **`multiple`** | `string[]` | `(value: string[]) => void` |
| **`native`** (single) | `string` | `(value: string) => void` |
| **`native`** + **`multiple`** | `string[]` | `(value: string[]) => void` |

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Token tier: trigger height, type scale, padding, icon sizes |
| multiple | `boolean` | `false` | No | **`true`**: multiselect; value types are **`string[]`** |
| value | `string` or `string[]` | — | No | Controlled selected value(s) |
| defaultValue | `string` or `string[]` | — | No | Initial value when uncontrolled |
| onChange | `(value: string) => void` or `(value: string[]) => void` | — | No | Fires after selection changes |
| disabled | `boolean` | — | No | Disables the control |
| placeholder | `string` | — | No | Shown in the trigger when empty (combobox); native single: empty **`<option>`** |
| hasError | `boolean` | `false` | No | Error styling |
| native | `boolean` | `false` | No | **`true`**: native **`<select>`** (single or **`multiple`**) |
| children | `React.ReactNode` | — | Yes | **`Select.Trigger`** + **`Select.Content`** (combobox) or **`Select.Item`** tree (**`native`**) |

### Select.Trigger

`forwardRef` to the underlying **`button`**. Props omit **`id`**, **`type`**, and **`role`** (set by the implementation).

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | No | Usually **`Select.Value`** and optionally **`Select.TriggerIcon`** |
| className | `string` | — | No | Additional class on the button |
| disabled | `boolean` | — | No | Native disabled; final state also respects **`Select.Root`** **`disabled`** |
| ref | `React.Ref<HTMLButtonElement>` | — | No | Ref to the button element |
| …rest | `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "id" \| "type" \| "role">` | — | No | e.g. **`aria-label`**, **`aria-labelledby`**, event handlers |

### Select.Value

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the value / placeholder span |

### Select.TriggerIcon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | No | Icon or other content to the left of the value |
| className | `string` | — | No | Wrapper class |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other **`span`** attributes |

### Select.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the portaled listbox container |
| children | `React.ReactNode` | — | Yes | Items, groups, and separators (listbox portal stays mounted; hidden while closed) |

### Select.Item

`forwardRef` to the option root **`div`**.

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | Yes | Submitted / controlled string value |
| label | `string` | — | No | Text shown in the trigger; otherwise derived from non-icon children or **`value`** |
| disabled | `boolean` | — | No | Option not selectable |
| className | `string` | — | No | Class on the option row |
| children | `React.ReactNode` | — | Yes | Label content and optional **`Select.ItemIcon`** |
| ref | `React.Ref<HTMLDivElement>` | — | No | Ref on the option root |

### Select.ItemIcon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | No | Icon before the item text |
| className | `string` | — | No | Wrapper class |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other **`span`** attributes |

### Select.Group

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the **`role="group"`** container |
| children | `React.ReactNode` | — | No | Group label and items |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other **`div`** attributes |

### Select.GroupLabel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the label |
| children | `React.ReactNode` | — | No | Group heading text |
| …rest | `React.HTMLAttributes<HTMLDivElement>` | — | No | Other **`div`** attributes |

### Select.Separator

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the **`hr`** |
| …rest | `React.HTMLAttributes<HTMLHRElement>` | — | No | Other **`hr`** attributes |

## Related

- [Label](../label/COMPONENT.md) — visible field label; pair with **`aria-labelledby`** on **`Select.Trigger`** when needed.
- [Hint](../hint/COMPONENT.md) — helper or error text below the field.
- [Input](../input/COMPONENT.md) — free-form text when a fixed list is not appropriate.
- [Tag select](../tag-select/COMPONENT.md) — chips, filter input, optional creatable values.
- [Dropdown](../dropdown/COMPONENT.md) — action menus, not single form values.
- [Modal](../modal/COMPONENT.md) / [Drawer](../drawer/COMPONENT.md) — nested focus and stacking when the select sits inside overlays.
