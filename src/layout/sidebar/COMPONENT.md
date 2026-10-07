# Sidebar

**Category:** layout (Раскладка)

> App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens.

## When to use
- The main navigation of an app, inside `AppShell.Nav`.
- Navigation that users can collapse to an icon rail.
- Router links (`asChild` + NavLink) with an active page.

## When not to use
- A temporary panel with a form or details → use [Drawer](../../components/drawer/COMPONENT.md).
- In-page section switching → use [Tabs](../../components/tabs/COMPONENT.md).
- A hierarchy trail → use [Breadcrumb](../../components/breadcrumb/COMPONENT.md).
- A menu of actions → use [Dropdown](../../components/dropdown/COMPONENT.md).

## Import
```tsx
import { Sidebar, useSidebar } from "prime-ui-kit";
```

## Anatomy
```
Sidebar.Root               rail wrapper; renders <nav> inside
├── Sidebar.Header         brand row
├── Sidebar.Content        scrolling middle (soft fades at both ends)
│   └── Sidebar.Group      role="group" with optional label
│       └── Sidebar.Item   <button> / <a> / asChild element
└── Sidebar.Footer         bottom items
    └── Sidebar.Toggle     item-shaped mode / panel toggle
useSidebar()               state hook for custom parts inside Root
```

## API

### Sidebar.Root
`forwardRef` to the outer `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Item height, icon, text and badge tier. |
| `mode` | `"expanded" \| "compact" \| "hidden"` | — | Controlled desktop mode. |
| `defaultMode` | `"expanded" \| "compact" \| "hidden"` | `"expanded"` | Initial mode, uncontrolled. |
| `onModeChange` | `(mode: SidebarMode) => void` | — | Called by Toggle and `setMode`. |
| `open` | `boolean` | — | Controlled off-canvas panel (narrow viewports only). |
| `defaultOpen` | `boolean` | `false` | Initial off-canvas state. |
| `onOpenChange` | `(open: boolean) => void` | — | Off-canvas open / close (Toggle, scrim, Escape, navigation, leaving the narrow viewport). |
| `responsive` | `boolean` | `true` | Below 768px the rail leaves the layout and becomes an off-canvas panel. |
| `labels` | `Partial<SidebarLabels>` | see Accessibility | Built-in strings. |
| `children` | `ReactNode` | — | Header, Content, Footer. |

+ native `<div>` props.

### Sidebar.Header · Sidebar.Footer
No ref. + native `<div>` props.

### Sidebar.Content
`forwardRef` to `<div>`. Scrolls vertically without a visible scrollbar. + native `<div>` props.

### Sidebar.Group
No ref. `<div role="group">`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading (`aria-labelledby`); fades out in compact mode and keeps its space. |

+ native `<div>` props except `role`.

### Sidebar.Item
`forwardRef` to the rendered element. Renders `<button type="button">`, `<a>` with `href`, or the single child with `asChild`. In compact mode it gets a tooltip on the right with its text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | — | Leading icon; stays in place in every mode. |
| `badge` | `ReactNode` | — | Counter / status; a dot on the icon in compact mode. |
| `shortcut` | `ReactNode` | — | Key hint (e.g. Kbd); hidden in compact mode. |
| `active` | `boolean` | `false` | Current page: `aria-current="page"`, `data-state="active"`. |
| `disabled` | `boolean` | `false` | Not interactive: `disabled` / `aria-disabled`, `data-disabled`; a link loses its `href`. |
| `href` | `string` | — | Render an `<a>`. |
| `target` · `rel` | `string` | — | Link attributes with `href`. |
| `asChild` | `boolean` | `false` | Render the single child (e.g. router `NavLink`) as the item; its children become the label. |
| `children` | `ReactNode` | — | Label (also the compact tooltip text). |

+ native `<button>` props.

### Sidebar.Toggle
`forwardRef` to `<button>`. Desktop: expanded ↔ compact (hidden → expanded); off-canvas: closes the panel. Label, icon, `aria-expanded` and `aria-controls` come from state and `labels`. + native `<button>` props except `children`, `aria-label`, `aria-expanded`, `aria-controls`.

### useSidebar()
Must be called inside Sidebar.Root. Returns:

| Field | Type | Description |
|---|---|---|
| `mode` / `setMode` | `SidebarMode` / `(mode) => void` | Desktop mode. |
| `open` / `setOpen` | `boolean` / `(open) => void` | Off-canvas panel. |
| `toggle` | `() => void` | Same action as Sidebar.Toggle. |
| `isMobile` | `boolean` | The sidebar is off-canvas now (responsive and < 768px). |
| `size` | `ControlSize` | Tier from Root. |
| `navId` | `string` | Id of the `<nav>` (for `aria-controls` on your own menu button). |
| `labels` | `SidebarLabels` | Resolved strings. |

## Variants
The rail sits on `bg-canvas` without a border or card; items are transparent rows with `text-secondary`, `fill-subtle` on hover; the active item is lifted to `bg-surface` + `shadow-raised` with primary text.

### mode (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `expanded` | `--prime-layout-sidebar-width` (248) with icons and labels | Default desktop navigation | yes |
| `compact` | `--prime-layout-sidebar-collapsed-width` (56) icon rail; labels fade, tooltips on the right, badges become dots | Users want more content width | |
| `hidden` | Width 0, panel clipped out and inert | Focus / full-screen views | |

Only the rail width animates (`--prime-motion-duration-base`): icons never move, labels fade.

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 28, text 12/16, icon 14, badge xs | Very dense tools | |
| `s` | item 32, text 13/20, icon 16, badge xs | Dense apps | |
| `m` | item 36, text 14/20, icon 16, badge s | Most apps | yes |
| `l` | item 40, text 16/24, icon 20, badge m | Touch-friendly | |
| `xl` | item 48, text 16/24, icon 20, badge m | Large screens | |

The rail width does not depend on `size`.

### responsive (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `true` | Below 768px: zero-width in layout; opens as a fixed panel over a scrim with `shadow-modal` | Apps used on phones | yes |
| `false` | Always the desktop rail | Previews, embedded frames | |

### Item flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `active` | Surface fill + raised shadow, primary text and icon | Current page | `false` |
| `disabled` | `text-disabled`, no hover, `cursor: not-allowed` | Unavailable section | `false` |
| `badge` | Pill on `fill-muted` at the end; accent dot in compact | Counters | — |
| `shortcut` | Key hint at the end; hidden in compact | Keyboard power users | — |

**Combinations** — `Sidebar.Toggle` in Footer for collapsible rails; `responsive` + a menu button in `AppShell.Header` with `open` / `onOpenChange` on phones. One `active` item at a time.

## States
- Root DOM: `data-size`, `data-mode`, `data-panel-mode` (the last visible mode while hidden), `data-mobile` (off-canvas), `data-state="open" | "closed"` (off-canvas only).
- Item DOM: `data-state="active"`, `aria-current="page"`, `data-disabled`.
- Mode: `mode` / `defaultMode` / `onModeChange`. Off-canvas: `open` / `defaultOpen` / `onOpenChange`; leaving the narrow viewport closes it; navigating from an `href` / `asChild` item closes it.
- The `<nav>` is `inert` while hidden (desktop) or closed (off-canvas).

## Layout & spacing
- Panel padding: `--prime-space-3` block, `--prime-space-2` inline; regions 8 apart; groups 16 apart, items 4 apart.
- Item horizontal padding is derived from the compact width so icons sit in the same place in every mode.
- Off-canvas panel width: min(sidebar width, 100% − `--prime-space-12`).
- Inside `AppShell.Nav` the rail takes the full height.

## Accessibility
- The panel is a `<nav>` named by `labels.navigation`.
- Items are native buttons / links; focus ring is drawn inside the row (inset). Compact mode shows the label as a tooltip, so icon-only items keep a visible name on hover and focus.
- Off-canvas: scrim, focus trap and Escape; the scrim is a button labelled `labels.close`.
- Toggle: `aria-expanded`, `aria-controls` → nav, label from `labels`.
- `labels`:

| Key | Default | Used for |
|---|---|---|
| `navigation` | `"Навигация"` | `aria-label` of the `<nav>` |
| `collapse` | `"Свернуть панель"` | Toggle label while expanded |
| `expand` | `"Развернуть панель"` | Toggle label while compact or hidden |
| `close` | `"Закрыть навигацию"` | Toggle label off-canvas and the scrim label |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [modes.tsx](examples/modes.tsx) | Controlled `mode` expanded · compact · hidden | Collapsible navigation |
| [states.tsx](examples/states.tsx) | Active, badge, shortcut, disabled items in groups | Reference for items |
| [sizes.tsx](examples/sizes.tsx) | `size` xs → xl | Matching the app density |
| [router.tsx](examples/router.tsx) | `asChild` + `NavLink` with router active state | react-router apps |
| [responsive.tsx](examples/responsive.tsx) | Off-canvas panel below 768px driven by a menu button | Phones |

The full app frame with a Sidebar is in [AppShell with-sidebar.tsx](../app-shell/examples/with-sidebar.tsx).

```tsx
import { Sidebar } from "prime-ui-kit";

export function Example() {
  return (
    <Sidebar.Root>
      <Sidebar.Content>
        <Sidebar.Item active>Главная</Sidebar.Item>
        <Sidebar.Item badge={3}>Входящие</Sidebar.Item>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Toggle />
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
```

## Mistakes
- Items without `icon` in a rail that can go compact → compact shows only icons; give every item an icon.
- Wrapping a router link in `Sidebar.Item` without `asChild` → nested interactive elements; use `asChild`.
- Setting `active` and also relying on router `aria-current` → use one source.
- Placing the Sidebar outside `AppShell.Nav` → it will not take the rail position.

## Related
[AppShell](../app-shell/COMPONENT.md) · [Drawer](../../components/drawer/COMPONENT.md) · [Tooltip](../../components/tooltip/COMPONENT.md) · [Kbd](../../components/kbd/COMPONENT.md)
