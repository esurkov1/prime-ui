# Tabs

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## About

Compound tabs: a `tablist` of triggers, an animated indicator, and one visible `tabpanel` at a time. Values on `Tabs.Tab` and `Tabs.Panel` must align so the active pair matches.

**When to use**

- Switching sections on one view (settings areas, product detail blocks, dashboard sub-views) without a full route change.
- Controlled `value` / `onValueChange` when the active tab must follow the URL, client store, or a wizard step.
- `orientation="vertical"` for a sidebar-style rail next to the main panel (see settings layout recipes in the kit).

**When not to use**

- Primary navigation between top-level pages — prefer links and routes (see [Breadcrumb](../breadcrumb/COMPONENT.md) for hierarchy).
- Two to four lightweight mutually exclusive options without rich panels — consider [SegmentedControl](../segmented-control/COMPONENT.md).
- Expecting inactive panel subtrees to stay mounted — hidden panels are not rendered (see Rules).

## Composition

- **`Tabs.Root`** — context wrapper (`div` with `data-orientation`, `data-size`). Place **`Tabs.List`** and **`Tabs.Panel`** in tree order (list first, then panels) for a typical reading order; panels may sit inside a layout wrapper as long as they remain under the same root.
- **`Tabs.List`** — `role="tablist"` with `aria-orientation`, keyboard handling, indicator, and **`ControlSizeProvider`**. Children should be **`Tabs.Tab`** triggers only.
- **`Tabs.Tab`** — `role="tab"` / `button type="button"`. Optional **`Tabs.Icon`** and **`Tabs.Label`**; `value` must match a **`Tabs.Panel`** `value`.
- **`Tabs.Panel`** — `role="tabpanel"`; renders **only** when its `value` equals the root’s active value.

### Canonical example

```tsx
import { Tabs, Typography } from "prime-ui-kit";

export function Example() {
  return (
    <Tabs.Root defaultValue="general" size="m">
      <Tabs.List>
        <Tabs.Tab value="general">
          <Tabs.Label>General</Tabs.Label>
        </Tabs.Tab>
        <Tabs.Tab value="privacy">
          <Tabs.Label>Privacy</Tabs.Label>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="general">
        <Typography.Root as="p" variant="body-default" tone="muted">
          Workspace name, locale, and default landing behavior.
        </Typography.Root>
      </Tabs.Panel>
      <Tabs.Panel value="privacy">
        <Typography.Root as="p" variant="body-default" tone="muted">
          Data retention, export, and who can see activity in this project.
        </Typography.Root>
      </Tabs.Panel>
    </Tabs.Root>
  );
}
```

### Scenarios (playground + `examples/`)

Live demos use **`playground/snippets/tabs/*.tsx`** (see **`playground/sections/TabsSection.tsx`**). The same scenarios have package-oriented copies under **`examples/`** (aligned with those snippets).

| Scenario | Notes | Example |
|----------|--------|---------|
| Sizes | Four rows: `size` **`s`** / **`m`** / **`l`** / **`xl`**. First tab: **`Tabs.Icon`** + **`Tabs.Label`**; others **`Tabs.Label`** only. | [`./examples/06-sizes-s-m-l-xl.tsx`](./examples/06-sizes-s-m-l-xl.tsx) |
| States | One **`Tabs.Tab`** with **`disabled`** — no click, skipped in arrow-key cycle. | [`./examples/07-horizontal-disabled.tsx`](./examples/07-horizontal-disabled.tsx) |
| Orientation | **`orientation="vertical"`** — list beside panels; vertical arrow keys. | [`./examples/01-settings-vertical-rail.tsx`](./examples/01-settings-vertical-rail.tsx) |
| Controlled | **`value`** + **`onValueChange`** on **`Tabs.Root`** (URL, store, wizard step). | [`./examples/05-controlled-active-tab.tsx`](./examples/05-controlled-active-tab.tsx) |
| Composition | Several **`Tabs.Icon`** slots per trigger (left/right of **`Tabs.Label`**) and two icons in one tab. | [`./examples/03-tab-triggers-with-icons.tsx`](./examples/03-tab-triggers-with-icons.tsx) |
| Full width | No **`fullWidth`** prop: **`className`** on root / **`Tabs.List`** / **`Tabs.Tab`** (`w-full`, **`flex-1`**, **`min-w-0`**) so triggers share width. | [`./examples/02-dashboard-subviews.tsx`](./examples/02-dashboard-subviews.tsx) |
| Long labels | Narrow container; **`Tabs.Label`** truncates with ellipsis without wrapping the whole tab row. | [`./examples/04-long-labels-narrow.tsx`](./examples/04-long-labels-narrow.tsx) |

**LLM note:** Prefer reading `./examples/*.tsx` for runnable scenarios; this page keeps rules + API tables authoritative.

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
- **Layout:** full-width or custom layout uses `className` and your own flex/grid CSS on the root, list, or tabs—there is no dedicated `fullWidth` prop on `Tabs`.

## API

### Tabs.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | No | Active tab in controlled mode; must match **`value`** on one **`Tabs.Tab`**. |
| defaultValue | `string` | `""` | No | Initial tab when uncontrolled (omit **`value`**). |
| onValueChange | `(value: string) => void` | — | No | Fired when the user or keyboard changes the tab. |
| orientation | `"horizontal" \| "vertical"` | `"horizontal"` | No | Tab list axis and arrow-key direction (**Left/Right** vs **Up/Down**). |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Trigger height, type scale, padding, and icon size from one control token tier. |
| children | `React.ReactNode` | — | Yes | **`Tabs.List`**, **`Tabs.Tab`**, **`Tabs.Panel`**, and layout wrappers under the same root. |
| className | `string` | — | No | Extra class on the root wrapper (e.g. **`w-full`** on a card). |

### Tabs.List

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | **`Tabs.Tab`** triggers; the active indicator is rendered inside the list. |
| className | `string` | — | No | Class on **`role="tablist"`** (e.g. stretch to full width). |

### Tabs.Tab

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | Yes | Unique id; must match the associated **`Tabs.Panel`** **`value`**. |
| disabled | `boolean` | `false` | No | Not selectable; omitted from arrow-key focus order. |
| children | `React.ReactNode` | — | Yes | Button contents: **`Tabs.Icon`**, **`Tabs.Label`**, or custom markup. |
| className | `string` | — | No | Class on the trigger (e.g. **`flex-1`**, **`min-w-0`** for full-width rows). |

### Tabs.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon (e.g. kit **`Icon`**); wrapper uses **`aria-hidden`**. |
| className | `string` | — | No | Class on the `span` |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other span attributes |

### Tabs.Label

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Tab label text; can ellipsis when space is tight. |
| className | `string` | — | No | Class on the `span` |
| …rest | `Omit<React.HTMLAttributes<HTMLSpanElement>, "children">` | — | No | Other span attributes |

### Tabs.Panel

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string` | — | Yes | Must match the active **`Tabs.Tab`**; otherwise the panel is not rendered (**`null`**). |
| children | `React.ReactNode` | — | Yes | **`role="tabpanel"`** body below (or beside) the list. |
| className | `string` | — | No | Class on the panel `div` |

## Related

- [Typography](../typography/COMPONENT.md)
- [SegmentedControl](../segmented-control/COMPONENT.md)
- [Breadcrumb](../breadcrumb/COMPONENT.md)
- **Icon** — use inside `Tabs.Icon` for glyphs sized with the tab control tokens
