# Tabs

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Compound tabs: a `tablist` of triggers, an animated indicator, and one visible `tabpanel` at a time. Values on `Tabs.Tab` and `Tabs.Panel` must align so the active pair matches.

- **Use** to switch sections on a single view (settings areas, product details blocks, dashboard sub-views) without route changes.
- **Use** controlled `value` / `onValueChange` when the active tab must follow URL, store, or wizard step.
- **Use** `orientation="vertical"` for a sidebar-style tab rail next to content.
- **Do not use** for primary page-to-page navigation; prefer links and routes (see [Breadcrumb](../breadcrumb/COMPONENT.md) for hierarchy).
- **Do not use** for two to four lightweight mutually exclusive options without rich panels; consider [SegmentedControl](../segmented-control/COMPONENT.md).
- **Do not use** expecting inactive panel subtrees to stay mounted; hidden panels are not rendered (see Rules).

## Composition

- **`Tabs.Root`** — context wrapper (`div` with `data-orientation`, `data-size`). Put **`Tabs.List`** and **`Tabs.Panel`** nodes as direct structure; order in the tree is list first, then panels (typical reading order).
- **`Tabs.List`** — `role="tablist"` with `aria-orientation`, keyboard handling, internal indicator, and **`ControlSizeProvider`** for descendants. Children should be **`Tabs.Tab`** triggers only.
- **`Tabs.Tab`** — `role="tab"` / `button type="button"`. Optional **`Tabs.Icon`** (before label) and **`Tabs.Label`** for text; `value` must match a **`Tabs.Panel`** `value`.
- **`Tabs.Panel`** — `role="tabpanel"`; renders **only** when its `value` equals the root’s active value.

### Minimal example

```tsx
import { Tabs } from "prime-ui-kit";

export function Example() {
  return (
    <Tabs.Root defaultValue="a">
      <Tabs.List>
        <Tabs.Tab value="a">
          <Tabs.Label>Tab</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">Panel content</Tabs.Panel>
    </Tabs.Root>
  );
}
```

## Rules

- **Uncontrolled:** omit `value`, set `defaultValue` on `Tabs.Root` (implementation default for `defaultValue` is `""` if omitted). **Controlled:** pass `value` and `onValueChange`; state follows `useControllableState` semantics.
- **Disabled tabs:** `disabled` on `Tabs.Tab` sets native `disabled`, `data-disabled`, and excludes the tab from arrow-key traversal; disabled targets are skipped.
- **Keyboard** (focus inside `Tabs.List`): **ArrowLeft** / **ArrowRight** in horizontal mode, **ArrowUp** / **ArrowDown** in vertical mode; **Home** / **End** move to first / last **enabled** tab; focus moves to the newly selected tab after arrow navigation.
- **Focus order:** the selected tab has `tabIndex={0}`; others use `tabIndex={-1}`.
- **ARIA:** `aria-controls` / `aria-labelledby` wire tab buttons to panels; list `aria-orientation` mirrors `orientation`.
- **`Tabs.Icon`** sets `aria-hidden="true"` on the wrapper span; ensure the tab still has a clear name (e.g. `Tabs.Label` or visible text).
- **Inactive panels:** `Tabs.Panel` returns `null` when inactive—avoid putting expensive trees in panels without app-level lazy loading or conditional data fetching.
- **No `asChild`:** each tab is always a `<button>`; there is no built-in URL synchronization.
- **Pairs:** for every panel `value` you expose, provide a corresponding tab (and vice versa) so the tab/panel relationship stays consistent for assistive tech.
- **Layout:** full-width or custom layout is achieved with `className` and your own flex/grid CSS on the root, list, or tabs—there is no dedicated “full width” prop.

## API

### Tabs.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | No | Active tab id (controlled) |
| defaultValue | `string` | `""` | No | Initial active tab when uncontrolled |
| onValueChange | `(value: string) => void` | — | No | Called when the active tab changes |
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | No | Tab list axis and arrow-key mapping |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Trigger and panel typography scale |
| children | `React.ReactNode` | — | Yes | `Tabs.List` and `Tabs.Panel` (and related structure) |
| className | `string` | — | No | Class on the root `div` |

### Tabs.List

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Typically `Tabs.Tab` elements |
| className | `string` | — | No | Class on the tablist container |

### Tabs.Tab

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | Yes | Id matching the associated `Tabs.Panel` |
| disabled | `boolean` | `false` | No | Non-interactive; skipped in keyboard roving |
| children | `React.ReactNode` | — | Yes | Trigger content (e.g. `Tabs.Icon`, `Tabs.Label`) |
| className | `string` | — | No | Class on the `button` |

### Tabs.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon glyph |
| className | `string` | — | No | Class on the `span` |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other span attributes |

### Tabs.Label

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Label text |
| className | `string` | — | No | Class on the `span` |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other span attributes |

### Tabs.Panel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | Yes | Must match the active `Tabs.Tab` `value` to render |
| children | `React.ReactNode` | — | Yes | Panel body |
| className | `string` | — | No | Class on the panel `div` |

## Related

- [Typography](../typography/COMPONENT.md)
- [SegmentedControl](../segmented-control/COMPONENT.md)
- [Breadcrumb](../breadcrumb/COMPONENT.md)
- **Icon** — use inside `Tabs.Icon` for glyphs sized with the tab control tokens
