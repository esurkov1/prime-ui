# Select

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## About

A single-select field: by default (**`native`** `false`) it is a combobox — a trigger shows the current choice or a placeholder, and a portaled listbox lets the user pick one string value from predefined options. With **`native`** `true`, **`Select.Root`** renders a native **`<select>`** with **`<option>`** / **`<optgroup>`** built from the same **`Select.Item`** (and optional **`Select.Group`**) tree.

**When to use**

- Forms, settings, and filters where exactly one option must be chosen from a closed set (role, country, theme, interval, and similar fields).
- Flows where a compact trigger is enough and the full list should open on demand with keyboard support.
- Long option lists structured with **`Select.Group`**, **`Select.GroupLabel`**, and **`Select.Separator`**.

**When not to use**

- Multi-select, inline search, or async loading of options — this primitive is single-choice only with static item children.
- Arbitrary free text — use an input-style control instead.
- Command or action menus — use [Dropdown](../dropdown/COMPONENT.md) when choices are actions, not a single form value.

## Composition

- **`Select.Root`** — owns value (controlled or uncontrolled), `size`, `hasError`, `disabled`, **`placeholder`**, and **`native`**. When **`native`** is `false`, it also owns open state and highlight. Wrap everything else.
- **`Select.Trigger`** — (non-**`native`** only) the combobox `button` (fixed chevron on the right). Put **`Select.Value`** inside; optionally **`Select.TriggerIcon`** before **`Select.Value`**. The implementation sets the trigger **`id`**; you cannot override it — associate an external [Label](../label/COMPONENT.md) with **`aria-labelledby`** pointing at the label’s **`id`**.
- **`Select.Value`** — (non-**`native`** only) displays the selected item label, otherwise falls back to the raw value or **`placeholder`** (hint styling when empty).
- **`Select.Content`** — when **`native`** is `false`: portaled **`role="listbox"`** with **`display: none`** while closed (nodes stay mounted). Place **`Select.Item`** rows (and optional groups/separators) inside. Must come after the trigger in the document for a predictable structure. When **`native`** is `true`, **`Select.Content`** is optional as a structural wrapper; only **`Select.Item`** (and groups) contribute to the DOM **`<select>`**.
- **`Select.Item`** — one option per row; optional **`Select.ItemIcon`** children are recognized by component type and rendered before the text. Use **`label`** when the trigger should show different text than the row content.
- **`Select.Group`** / **`Select.GroupLabel`** / **`Select.Separator`** — optional structure inside **`Select.Content`**.

### Canonical example

```tsx
import * as React from "react";
import { Label, Select, Typography } from "prime-ui-kit";

export function Example() {
  const labelId = React.useId();

  return (
    <div>
      <Label.Root id={labelId} size="m">
        Department
      </Label.Root>
      <Select.Root size="m" placeholder="Choose">
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

### Native `<select>` (`native`)

```tsx
import { Select } from "prime-ui-kit";

export function NativeExample() {
  return (
    <Select.Root native size="m" placeholder="Choose">
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
| `playground/snippets/select/features.tsx` | **`Group`** / **`GroupLabel`** / **`Separator`**, disabled item, long list + scroll |

### Examples next to this file

Runnable examples use **`@/`** in the workspace; published consumers import **`prime-ui-kit`**. **`pattern-*`** files mirror the playground snippets above in English (same APIs).

| File | Intent |
|------|--------|
| `examples/pattern-sizes.tsx` | **`sizes.tsx`** snippet |
| `examples/pattern-states.tsx` | **`states.tsx`** snippet |
| `examples/pattern-controlled.tsx` | **`controlled.tsx`** snippet |
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

- **`native`** — default **`false`**. **`true`**: one **`<select>`** with kit styling; **`Select.Trigger`**, **`Select.Value`**, **`Select.Content`** portal, and listbox keyboard behavior are not used (the platform handles the dropdown). Options are collected by walking **`children`** for **`Select.Item`** (and **`Select.Group`** / **`Select.GroupLabel`** → **`<optgroup>`**; **`Select.Separator`** is skipped). **`placeholder`** adds a first **`<option value="">`**; do not use **`value=""`** on an **`Select.Item`** if you rely on that placeholder. **`Select.ItemIcon`** / **`Select.TriggerIcon`** are not represented in the native control.
- **Controlled:** set **`value`** and **`onChange`** together. **Uncontrolled:** use **`defaultValue`** (or neither for an empty initial value). Values are always **`string`**; map numbers or enums to strings yourself.
- **`onChange`** runs only when the value changes to a defined string (same contract as internal controllable state).
- **`disabled`** on **`Select.Root`** prevents opening the list and selecting; the trigger is inactive.
- **`disabled`** on **`Select.Item`** skips that option for pointer selection and for arrow-key navigation among enabled options only.
- **`hasError`** on **`Select.Root`** applies error styling to the trigger; there is no separate **`variant`** prop.
- **Width:** there is no **`fullWidth`** prop on **`Select.Root`**. The combobox trigger uses **`width: 100%`** — constrain or stretch the field with the parent layout (form column, grid cell, flex item).
- **`Select.Content`** uses **`Portal`**, which attaches after the first client layout effect; until option nodes mount, **`selectedLabel`** may be unset and **`Select.Value`** can briefly show the raw **`value`** instead of an item’s **`label`**—effects on **`Select.Item`** then call **`onInitLabel`** to align the trigger text.
- **`Select.Content`** is portaled; on open the listbox receives focus, **`useOutsideClick`** and **Escape** close it. Arrow **Up**/**Down**, **Home**/**End** move highlight; **Enter** or **Space** selects the highlighted enabled item; **Escape** closes from the listbox handler as well.
- **`Select.Trigger`** is **`role="combobox"`** with **`aria-expanded`**, **`aria-haspopup="listbox"`**, and **`aria-controls`** pointing at the listbox **`id`**. Items expose **`role="option"`**, **`aria-selected`**, and **`aria-disabled`** when disabled.
- If there is no visible text label on the trigger, set **`aria-label`** on **`Select.Trigger`**. For an external [Label](../label/COMPONENT.md), give the label a stable **`id`** and set **`aria-labelledby`** on **`Select.Trigger`** to that **`id`** (the trigger’s **`id`** is generated inside the component).
- List position (e.g. flipping above/below) is resolved internally from viewport space; there are no public **`side`** / **`align`** props on **`Select.Content`**.

## API

### Select.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Token tier: trigger height, type scale, padding, icon sizes in trigger and list |
| value | `string` | — | No | Controlled selected value |
| defaultValue | `string` | — | No | Initial value when uncontrolled |
| onChange | `(value: string) => void` | — | No | Fires after a new value is selected |
| disabled | `boolean` | — | No | Disables the trigger and selection |
| placeholder | `string` | — | No | Shown in the trigger when no value is selected |
| hasError | `boolean` | `false` | No | Error styling on the trigger |
| native | `boolean` | `false` | No | **`true`**: native **`<select>`**; **`false`**: combobox + portaled listbox |
| children | `React.ReactNode` | — | Yes | Typically **`Select.Trigger`** and **`Select.Content`** (non-**`native`**); **`Select.Item`** tree (**`native`**) |

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
- [Dropdown](../dropdown/COMPONENT.md) — action menus, not single form values.
- [Modal](../modal/COMPONENT.md) / [Drawer](../drawer/COMPONENT.md) — nested focus and stacking when the select sits inside overlays.
