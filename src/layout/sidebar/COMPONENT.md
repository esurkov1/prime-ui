# Sidebar

**Category:** layout
**Kind:** layout

> App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens.

## When to use
- The main navigation of an app, inside `AppShell.Nav`.
- Navigation that users can collapse to an icon rail.
- Router links (`asChild` + NavLink) with a current page.

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
Sidebar.Root                  rail wrapper; renders <nav> inside; size tier for items
├─ Sidebar.Header             brand row
├─ Sidebar.Content            scrolling middle (ScrollContainer, edge fades, no scrollbar)
│  └─ Sidebar.Group           role="group" with optional label
│     └─ Sidebar.Item         <button> / <a> / asChild element
│        ├─ Sidebar.ItemIcon      leading icon
│        ├─ (label)               the remaining children
│        ├─ Sidebar.ItemCount     counter Badge; a dot in compact mode
│        └─ Sidebar.ItemShortcut  key hint; hidden in compact mode
└─ Sidebar.Footer             bottom items
   └─ Sidebar.Toggle          item-shaped mode / panel toggle
useSidebar()                  state hook for custom parts inside Root
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Sidebar.Root
`forwardRef` → `HTMLDivElement`. The rail wrapper with the `<nav>` inside; owns the mode and the off-canvas panel and passes the tier to items.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Item tier: height 28 · 32 · 36 · 40 · 48, text, icon; counters one tier down. The rail width does not change. |
| `mode` | `"expanded" \| "compact" \| "hidden"` | — | Desktop mode (controlled): full rail, icon rail with tooltips, or hidden. |
| `defaultMode` | `"expanded" \| "compact" \| "hidden"` | `"expanded"` | Initial mode (uncontrolled). |
| `onModeChange` | `(mode: SidebarMode) => void` | — | Called with the new mode (Toggle, `useSidebar().setMode`). |
| `open` | `boolean` | — | Off-canvas panel on narrow viewports (controlled). |
| `defaultOpen` | `boolean` | `false` | Initial off-canvas state (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | Off-canvas open / close: Toggle, scrim, Escape, navigation, leaving the narrow viewport. |
| `responsive` | `boolean` | `true` | Below 768px the rail leaves the layout and becomes an off-canvas panel with a scrim and a focus trap. |
| `labels` | `Partial<SidebarLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Sidebar.Header · Sidebar.Footer
No ref. Brand row at the top; items and the Toggle at the bottom.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Sidebar.Content
`forwardRef` → `HTMLElement`. The scrolling middle: a `ScrollContainer` with edge fades and no scrollbar.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (Groups, Items), `className` and the other attributes. |

### Sidebar.Group
No ref. `<div role="group">` named by its label.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading (`aria-labelledby`); fades out in compact mode and keeps its space. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "role">` | — | `children` (Items), `className` and the other div attributes. |

### Sidebar.Item
`forwardRef` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`; a tooltip with its label in compact mode.

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `boolean` | `false` | Current page: `aria-current="page"`, `data-state="active"`; surface fill and a raised shadow. |
| `disabled` | `boolean` | `false` | Not interactive: `disabled` / `aria-disabled`, `data-disabled`; a link loses its `href`. |
| `href` | `string` | — | Renders an `<a>` (with `target`, `rel`). |
| `asChild` | `boolean` | `false` | Renders the single child (e.g. a router `NavLink`) as the item; its children are the label and parts. |
| `children` | `ReactNode` | — | Label (also the compact tooltip) and parts: `Sidebar.ItemIcon`, `Sidebar.ItemCount`, `Sidebar.ItemShortcut`. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `aria-*`, `className` and the other attributes. |

### Sidebar.ItemIcon
No ref. Leading icon (`aria-hidden`); stays in place in every mode.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="nav.home" />`; takes the item tier. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Sidebar.ItemCount
No ref. Counter `Badge` after the label; in compact mode a dot on the icon, and the number stays for screen readers.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The number. |
| `className` | `string` | — | Extra class on the Badge. |

### Sidebar.ItemShortcut
No ref. Key hint at the end (`aria-hidden`); hidden in compact mode.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | A key hint, e.g. `<Kbd.Root>⌘K</Kbd.Root>`. |
| `className` | `string` | — | Extra class. |

### Sidebar.Toggle
`forwardRef` → `HTMLButtonElement`. Item-shaped toggle: expanded ↔ compact on desktop (hidden → expanded), closes the off-canvas panel; label, icon, `aria-expanded` and `aria-controls` come from state and `labels`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "aria-label" \| "aria-expanded" \| "aria-controls">` | — | `onClick` (runs first; `preventDefault()` stops the toggle), `className` and the other button attributes. |

### useSidebar()
Hook for custom parts inside `Sidebar.Root` (throws outside). Returns the fields below.

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode · setMode` | `SidebarMode · (mode: SidebarMode) => void` | — | Desktop mode. |
| `open · setOpen` | `boolean · (open: boolean) => void` | — | Off-canvas panel. |
| `toggle` | `() => void` | — | The action of `Sidebar.Toggle`. |
| `isMobile` | `boolean` | — | The sidebar is off-canvas now (responsive and under 768px). |
| `size · navId · labels` | `ControlSize · string · SidebarLabels` | — | Tier, id of the `<nav>` (for `aria-controls` on your own menu button), resolved strings. |

## Variants
The rail sits on `bg-canvas` without a border or card; items are transparent rows with `text-secondary`, `fill-subtle` on hover; the current item is lifted to `bg-surface` + `shadow-raised` with primary text.

### mode (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `expanded` | `--prime-layout-sidebar-width` (248) with icons and labels | Default desktop navigation | yes |
| `compact` | `--prime-layout-sidebar-collapsed-width` (56) icon rail; labels fade, tooltips on the right, counters become dots | Users want more content width | |
| `hidden` | Width 0, panel clipped out and inert | Focus / full-screen views | |

Only the rail width animates (`--prime-motion-duration-base`): icons never move, labels fade.

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 28, text 12/16, icon 14, counter xs | Very dense tools | |
| `s` | item 32, text 13/20, icon 16, counter xs | Dense apps | |
| `m` | item 36, text 14/20, icon 16, counter s | Most apps | yes |
| `l` | item 40, text 16/24, icon 20, counter m | Touch-friendly | |
| `xl` | item 48, text 16/24, icon 20, counter l | Large screens | |

The rail width does not depend on `size`.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `responsive` (Root) | below 768px: zero-width in layout; opens as a fixed panel over a scrim with `shadow-modal` | apps used on phones | `true` |
| `current` (Item) | surface fill + raised shadow, primary text and icon | the current page | off |
| `disabled` (Item) | `text-disabled`, no hover, `cursor: not-allowed` | an unavailable section | off |

Put `Sidebar.Toggle` in Footer for collapsible rails; on phones pair `responsive` with a menu button in `AppShell.Header` (`open` / `onOpenChange`). One current item at a time; give every item an icon when the rail can go compact.

## States
| State | Driven by | DOM |
|---|---|---|
| mode | `mode` / `defaultMode` | Root `data-mode`, `data-panel-mode` (the last visible mode while hidden); `<nav inert>` while hidden |
| off-canvas | `responsive` + viewport < 768px | Root `data-mobile`, `data-state="open" \| "closed"`; `<nav inert>` while closed |
| current | `current` or a router's `aria-current` | Item `aria-current="page"`, `data-state="active"` |
| disabled | `disabled` | Item `disabled` / `aria-disabled`, `data-disabled` |

Leaving the narrow viewport closes the off-canvas panel; navigating from an `href` / `asChild` item closes it too.

## Layout & spacing
- Panel padding: `--prime-space-3` block, `--prime-space-2` inline; regions 8 apart; groups 16 apart, items 4 apart.
- Item horizontal padding is derived from the compact width so icons sit in the same place in every mode.
- Off-canvas panel width: min(sidebar width, 100% − `--prime-space-12`).
- Inside `AppShell.Nav` the rail takes the full height.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus through the items; a disabled one is skipped. |
| `Enter` · `Space` | Opens the section or presses the item button. |
| `Escape` | Closes the off-canvas panel on a narrow screen. |

### ARIA
- The panel is a `<nav>` named by `labels.navigation`; groups are `role="group"` named by their label.
- The current item has `aria-current="page"`; in compact mode the label shows as a tooltip, so icon-only items keep a visible name.
- Off-canvas: scrim, focus trap and Escape; the scrim is a button labelled `labels.close`.
- Toggle: `aria-expanded`, `aria-controls` → nav, label from `labels`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `navigation` | `"Навигация"` | `aria-label` of the `<nav>`. |
| `collapse` | `"Свернуть панель"` | Toggle label while expanded. |
| `expand` | `"Развернуть панель"` | Toggle label while compact or hidden. |
| `close` | `"Закрыть навигацию"` | Toggle label off-canvas and the scrim label. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | App navigation on the canvas: items with icons, the current page and a collapse toggle — `Sidebar.ItemIcon`, `current`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: item height, text, icon and counter follow the tier; the rail width stays — `size`. |
| [structure.tsx](examples/structure.tsx) | Labelled groups and the optional item parts: a counter, a key hint and a disabled section — `Sidebar.Group`, `Sidebar.ItemCount`, `Sidebar.ItemShortcut`, `disabled`. |
| [router.tsx](examples/router.tsx) | A router link as the item: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the rail mode: expanded, an icon rail with tooltips, or hidden; only the width animates — `mode`, `onModeChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | Below 768px the rail becomes an off-canvas panel with a scrim, opened from a menu button; narrow the window to try it — `open`, `onOpenChange`. |

## Mistakes
- `icon={…}` / `badge={…}` props → use the `Sidebar.ItemIcon` and `Sidebar.ItemCount` parts.
- Items without an icon in a rail that can go compact → compact shows only icons.
- Wrapping a router link in `Sidebar.Item` without `asChild` → nested interactive elements; use `asChild`.
- Setting `current` and also relying on the router's `aria-current` → use one source.
- Placing the Sidebar outside `AppShell.Nav` → it will not take the rail position.

## Related
- **Built from:** [ScrollContainer](../../components/scroll-container/COMPONENT.md), [Badge](../../components/badge/COMPONENT.md), [Tooltip](../../components/tooltip/COMPONENT.md), Icon (`nav.sidebarCollapse`, `nav.sidebarExpand`)
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Drawer](../../components/drawer/COMPONENT.md), [Kbd](../../components/kbd/COMPONENT.md)
