# Sidebar

**Category:** layout
**Kind:** layout

> App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens.

## When to use
- The main navigation of an app, inside `AppShell.Nav`.
- Navigation that users can collapse to an icon rail.
- Sections with sub-pages (a parent item with child items), grouped and collapsible.
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
Sidebar.Root                       rail wrapper; renders <nav> inside; size tier for items
├─ Sidebar.Header                  one fixed-height row
│  ├─ Sidebar.Brand                logo + name + muted line (link / div / asChild)
│  │  └─ Sidebar.BrandLogo         the mark, on the icon axis
│  └─ Sidebar.Toggle variant="header"  «‹‹» at the header end → round button on the rail edge
├─ Sidebar.Content                 scrolling middle (ScrollContainer, edge fades, no scrollbar)
│  └─ Sidebar.Group                role="group"; optional label, `collapsible` heading
│     ├─ Sidebar.Item              <button> / <a> / asChild element
│     │  ├─ Sidebar.ItemIcon           leading icon (before the label)
│     │  ├─ (label)                    the remaining children
│     │  ├─ Sidebar.ItemCount          plain number, or a Badge with color / variant
│     │  ├─ Sidebar.ItemShortcut       key hint
│     │  ├─ Sidebar.ItemIcon           trailing icon (after the label)
│     │  └─ Sidebar.ItemAction         row action button beside the item element
│     └─ Sidebar.Sub               parent item with child items
│        ├─ Sidebar.SubTrigger     disclosure row, chevron at the end
│        └─ Sidebar.SubContent     child Items on a guide line (a flyout on the compact rail)
└─ Sidebar.Footer                  bottom items, the item Toggle, the account
   └─ Sidebar.Account              avatar + name + muted line; a Dropdown.Trigger child
useSidebar()                       state hook for custom parts inside Root
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Sidebar.Root
`forwardRef` → `HTMLDivElement`. The rail wrapper with the `<nav>` inside; owns the mode and the off-canvas panel and passes the tier to items.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Item tier: height 28 · 32 · 36 · 40 · 48, text, icon; counters and row actions one tier down. The rail width does not change. |
| `mode` | `"expanded" \| "compact" \| "hidden"` | — | Desktop mode (controlled): full rail, icon rail with tooltips and flyouts, or hidden. |
| `defaultMode` | `"expanded" \| "compact" \| "hidden"` | `"expanded"` | Initial mode (uncontrolled). |
| `onModeChange` | `(mode: SidebarMode) => void` | — | Called with the new mode (Toggle, `useSidebar().setMode`). |
| `open` | `boolean` | — | Off-canvas panel on narrow viewports (controlled). |
| `defaultOpen` | `boolean` | `false` | Initial off-canvas state (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | Off-canvas open / close: Toggle, scrim, Escape, navigation, leaving the narrow viewport. |
| `offCanvas` | `"auto" \| "always" \| "never"` | `"auto"` | When the rail leaves the layout and becomes an off-canvas panel with a scrim and a focus trap, opened by `open`: `auto` — below 768px (viewport); `always` — at any width (navigation behind a menu button); `never` — always a rail. |
| `labels` | `Partial<SidebarLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Sidebar.Header · Sidebar.Footer
`ref` → `HTMLDivElement`. Header: one fixed-height row for `Sidebar.Brand` and the header Toggle. Footer: items, the item Toggle and `Sidebar.Account` (set apart by air) at the bottom.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Sidebar.Brand
`forwardRef` → the rendered element. Product block: `Sidebar.BrandLogo`, the name and a muted line; an `<a>` with `href`, the single child with `asChild`, else a `<div>`. In compact mode only the logo stays (a link shows its name as a tooltip).

| Prop | Type | Default | Description |
|---|---|---|---|
| `description` | `ReactNode` | — | Muted second line under the name (workspace, plan). |
| `href` | `string` | — | Renders an `<a>` (usually home); navigating closes the off-canvas panel. |
| `asChild` | `boolean` | `false` | Renders the single child (e.g. a router `Link`) as the brand; its children are the logo and the name. |
| `children` | `ReactNode` | — | `Sidebar.BrandLogo` and the product name. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `onClick`, `aria-*`, `className` and the other attributes. |

### Sidebar.BrandLogo
`ref` → `HTMLSpanElement`. The product mark (`aria-hidden`): a square of the item height − 8 (at most 32) on the icon axis in every mode; its child fills it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The mark: `<img>`, `<svg>` or a styled element. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Sidebar.Content
`forwardRef` → `HTMLElement`. The scrolling middle: a `ScrollContainer` with edge fades and no scrollbar; rows scrolled into view stop clear of the fades.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (Groups, Items, Subs), `className` and the other attributes. |

### Sidebar.Group
`ref` → `HTMLDivElement`. `<div role="group">` named by its label. With `collapsible` the heading is a disclosure button (`aria-expanded`, `aria-controls`) with a chevron at its end; the items fold away (inert). On the compact rail headings fold and the items always show.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading (`aria-labelledby`); folds away in compact mode. |
| `collapsible` | `boolean` | `false` | The heading shows and hides the items. Needs `label`. |
| `open` | `boolean` | — | Items shown (controlled). |
| `onOpenChange` | `(open: boolean) => void` | — | Called with the new open state (click, keyboard, a current page moving inside). |
| `defaultOpen` | `boolean` | `true` | Initial state (uncontrolled). A closed group opens by itself when the current page moves into it. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "role">` | — | `children` (Items, Subs), `className` and the other div attributes. |

### Sidebar.Item
`forwardRef` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`; a tooltip with its label in compact mode. With `Sidebar.ItemAction` the element and the action sit side by side in a row `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `boolean` | `false` | Current page: `aria-current="page"`, `data-state="active"`; surface fill and a raised shadow (a deeper wash in a flyout). |
| `disabled` | `boolean` | `false` | Not interactive: `disabled` / `aria-disabled`, `data-disabled`; a link loses its `href`. |
| `href` | `string` | — | Renders an `<a>` (with `target`, `rel`). |
| `asChild` | `boolean` | `false` | Renders the single child (e.g. a router `NavLink`) as the item; its children are the label and parts. |
| `children` | `ReactNode` | — | Label (also the compact tooltip) and parts: `Sidebar.ItemIcon` (before the label — leading, after it — trailing), `Sidebar.ItemCount`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `aria-*`, `className` and the other attributes. |

### Sidebar.ItemIcon
`ref` → `HTMLSpanElement`. An icon (`aria-hidden`). Before the label it leads and stays on the icon axis in every mode; after the label it is a quiet trailing glyph (`data-edge="end"`, 14, muted), e.g. ↗ for an external link, hidden in compact mode.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="nav.home" />`; takes the item tier. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Sidebar.ItemCount
`ref` → `HTMLSpanElement` (the number or the Badge). A count after the label: a plain muted number by default; a `Badge` (one tier down) when `color` or `variant` is set. In compact mode the number leaves the row (still read by screen readers) and a badge leaves a dot of its hue on the icon.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The number (or a short status such as «!»). |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | — | Badge hue: the count needs attention. |
| `variant` | `"solid" \| "soft" \| "outline"` | — | Badge treatment; `soft` once `color` is set. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children" \| "color">` | — | `className` and the other attributes of the number or the Badge. |

### Sidebar.ItemShortcut
`ref` → `HTMLSpanElement`. Key hint at the end (`aria-hidden`); hidden in compact mode.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | A key hint, e.g. `<Kbd>⌘K</Kbd>`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Sidebar.ItemAction
`ref` → `HTMLButtonElement`. A row action (create, add): a ghost icon `Button` one tier down with a tooltip, next to the item element — never inside it. It shows on hover and focus of the row while the trail (count, hint) steps aside; hidden on the compact rail.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Accessible name and tooltip («Создать задачу»). |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — (required) | The action. |
| `disabled` | `boolean` | — | Not available. |
| `children` | `ReactNode` | — | The glyph; `<Icon name="action.add" />` by default. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "onClick" \| "aria-label">` | — | `className` and the other attributes of the Button. |

### Sidebar.Sub
`ref` → `HTMLDivElement`. A parent item with child items: `Sidebar.SubTrigger` + `Sidebar.SubContent` in a `<div>`. Expanded, the children unfold under the parent on a guide line; on the compact rail they open in a flyout (the kit Popover, to the right). A current child opens the sub-list and marks the parent as on the active path (`data-active-path`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Children shown (controlled). |
| `onOpenChange` | `(open: boolean) => void` | — | Called with the new open state (click, keyboard, a current page moving inside). |
| `defaultOpen` | `boolean` | `false` | Initial state (uncontrolled). Opens by itself when a child becomes the current page. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Sidebar.SubTrigger
`forwardRef` → `HTMLButtonElement`. The parent row: a disclosure `<button>` (`aria-expanded`, `aria-controls`) with a chevron at the end of the row. Expanded: click, `→` / `←` open and close. Compact: hover (after a short intent delay), click, `Enter` · `Space` · `→` open the flyout (`aria-haspopup="dialog"`); on the active path it takes the current lift.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Label (also the flyout title) and parts as in `Sidebar.Item`: `Sidebar.ItemIcon`, `Sidebar.ItemCount`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-expanded" \| "aria-controls">` | — | `onClick` (runs first; `preventDefault()` stops the toggle), `disabled`, `className` and the other button attributes. |

### Sidebar.SubContent
`ref` → `HTMLDivElement`. `<div role="group">` named by the trigger: the child `Sidebar.Item`s on a faint guide line under the parent icon, labels aligned with the parent label. Height animates; closed content is inert. On the compact rail the same children render in the flyout.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "role">` | — | `children` (Items), `className` (on the list) and the other div attributes. |

### Sidebar.Account
`forwardRef` → `HTMLButtonElement`. The signed-in person at the bottom of `Sidebar.Footer`: avatar, name, a muted line and a ↕ chevron. A button, so it is a `Dropdown.Trigger` child; in compact mode only the avatar stays, with the name as a tooltip.

| Prop | Type | Default | Description |
|---|---|---|---|
| `description` | `ReactNode` | — | Muted second line under the name (email, role). |
| `children` | `ReactNode` | — | An `Avatar.Root` (sized to the tier by the slot, hidden from screen readers) and the person's name. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">` | — | `onClick`, `aria-*`, `className` and the other button attributes. |

### Sidebar.Toggle
`forwardRef` → `HTMLButtonElement`. Toggle: expanded ↔ compact on desktop (hidden → expanded), closes the off-canvas panel; label, icon, `aria-expanded` and `aria-controls` come from state and `labels`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"item" \| "header"` | `"item"` | `item` — a row in the rail. `header` — an icon button «‹‹» at the end of `Sidebar.Header`; in compact mode the same button moves onto the rail's outer edge, shrinks and turns round, and its chevrons turn to point out. Off-canvas it stays in the header and closes the panel. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "aria-label" \| "aria-expanded" \| "aria-controls">` | — | `onClick` (runs first; `preventDefault()` stops the toggle), `className` and the other button attributes. |

### useSidebar()
Hook for custom parts inside `Sidebar.Root` (throws outside). Returns the fields below.

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode · setMode` | `SidebarMode · (mode: SidebarMode) => void` | — | Desktop mode. |
| `open · setOpen` | `boolean · (open: boolean) => void` | — | Off-canvas panel. |
| `toggle` | `() => void` | — | The action of `Sidebar.Toggle`. |
| `offCanvas` | `boolean` | — | The sidebar is an off-canvas panel now (`offCanvas="always"`, or `"auto"` under 768px). |
| `size · navId · labels` | `ControlSize · string · SidebarLabels` | — | Tier, id of the `<nav>` (for `aria-controls` on your own menu button), resolved strings. |

## Variants
The rail sits on `bg-canvas` without a border or card; items are transparent rows with `text-secondary`, `fill-subtle` on hover; the current item is lifted to `bg-surface` + `shadow-raised` with primary text.

### mode (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `expanded` | `--prime-layout-sidebar-width` (248) with icons and labels | Default desktop navigation | yes |
| `compact` | `--prime-layout-sidebar-collapsed-width` (56) icon rail; labels fade, tooltips on the right, coloured counts become dots, sub-lists open as flyouts | Users want more content width | |
| `hidden` | Width 0, panel clipped out and inert | Focus / full-screen views | |

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 28, text 12/16, icon 14, counter xs | Very dense tools | |
| `s` | item 32, text 13/20, icon 16, counter xs | Dense apps | |
| `m` | item 36, text 14/20, icon 16, counter s | Most apps | yes |
| `l` | item 40, text 16/24, icon 20, counter m | Touch-friendly | |
| `xl` | item 48, text 16/24, icon 20, counter l | Large screens | |

The rail width does not depend on `size`.

### variant (Toggle)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `item` | an item row with a panel icon and the label | a toggle in `Sidebar.Footer` | yes |
| `header` | a ghost «‹‹» icon button at the end of the header; on the compact rail a small round soft button across the outer edge, chevrons pointing out | a brand header (`Sidebar.Brand`) | |

### ItemCount
| Value | Looks like | Use when | Default |
|---|---|---|---|
| no `color` / `variant` | a plain muted number | quantities (24 tasks) | yes |
| `color` | a soft Badge of that hue | the count needs attention (red «7») | |
| `variant` | a Badge of that treatment (gray unless `color`) | a stronger or outlined count | |

### offCanvas
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `auto` | a rail; below 768px (viewport) zero-width in layout, opens as a fixed panel over a scrim with `shadow-modal` | apps used on phones | yes |
| `always` | zero-width in layout at any width; the panel opens over a scrim from a menu button (`open`) | full-screen tools and editors where navigation stays behind a button | |
| `never` | always a rail, whatever the viewport | a fixed frame, previews, desktop-only tools | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `collapsible` (Group) | the heading is a button with a chevron at its end; items fold away | long navigation with sections | off |
| `current` (Item) | surface fill + raised shadow, primary text and icon | the current page | off |
| `disabled` (Item) | `text-disabled`, no hover, `cursor: not-allowed` | an unavailable section | off |

Put `<Sidebar.Toggle variant="header" />` next to `Sidebar.Brand` in the header, or `Sidebar.Toggle` in the footer for a rail without a brand; on phones (`offCanvas="auto"`) or always (`offCanvas="always"`) pair it with a menu button in `AppShell.Header` (`open` / `onOpenChange`). One current item at a time; give every top-level item an icon when the rail can go compact (child items need none).

## States
| State | Driven by | DOM |
|---|---|---|
| mode | `mode` / `defaultMode` | Root `data-mode`, `data-panel-mode` (the last visible mode while hidden); `<nav inert>` while hidden |
| off-canvas | `offCanvas="always"`, or `"auto"` + viewport < 768px | Root `data-off-canvas`, `data-state="open" \| "closed"`; `<nav inert>` while closed |
| current | `current` or a router's `aria-current` | Item `aria-current="page"`, `data-state="active"` |
| active path | a child of a Sub (or an item of a Group) is current | SubTrigger `data-active-path`; a closed Sub / Group opens |
| group open | Group `open` / `defaultOpen` (`collapsible`) | heading `aria-expanded`; region `data-state`, `inert` while closed |
| sub open | Sub `open` / `defaultOpen` | SubTrigger `aria-expanded`; SubContent `data-state`, `inert` while closed |
| flyout | hover / click / keyboard on a SubTrigger in compact mode | SubTrigger `aria-haspopup="dialog"`, `aria-expanded`; a Popover `role="dialog"` |
| disabled | `disabled` | Item `disabled` / `aria-disabled`, `data-disabled` |

Leaving the narrow viewport closes the off-canvas panel; navigating from an `href` / `asChild` item (or the brand) closes it too. Navigating from a flyout closes the flyout.

## Layout & spacing
- Panel padding: `--prime-space-3` block, `--prime-space-2` inline; regions 8 apart; groups 16 apart, items 4 apart.
- Item horizontal padding is derived from the compact width so icons, the brand logo and the account avatar sit on one axis in every mode.
- Header is one row of the item height + 8. The header toggle (xs, 28) sits at its end, 8 from the rail edge; in compact mode it moves half past the edge, scales to 3/4, turns round and gets a canvas ring. The root clips with `clip-path`, reaching past the edge by the toggle's half-width.
- Collapsible group: heading 28 high with the chevron (14) at its end, aligned with the item trail; items start 4 below.
- Sub-list: a 1px `border-default` guide line on the parent icon's centre; every child branches off it with an 8 elbow and a 6 bend; child labels line up with the parent label.
- Trail (count, key hint, trailing icon) sits at the row end; a row action (one tier down) appears there on hover / focus and the trail moves aside.
- Footer: items 4 apart; the account (item height + 12) is set 8 apart below them. Its avatar is one
  step above the item icon (xs·s 20, m·l 24, xl 32), centred on the icon axis, and the name starts
  exactly where item labels start.
- Compact flyout: the kit Popover (flush) to the right, aligned with the parent row; the parent's name heads it on the same line, the children follow on the guide line; current child is a `fill-subtle-active` wash.
- Motion: on collapse labels fade out fast before the rail narrows; on expand they fade in after a short delay, once the rail is wide. Group headings fold to zero height in compact mode. Disclosures animate height through a grid track (open base · enter, close fast · exit), chevrons rotate (base), the header toggle moves and scales with the rail (base); all durations are tokens and collapse under reduced motion.
- Off-canvas panel width: min(sidebar width, 100% − `--prime-space-12`).
- Inside `AppShell.Nav` the rail takes the full height.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus through the items; a disabled or folded one is skipped. |
| `Enter` · `Space` | Opens the section, presses the item, opens or closes a group or a sub-list; on the compact rail opens the flyout and focuses the first child. |
| `ArrowRight` · `ArrowLeft` | On a parent item opens / closes the sub-list; on the compact rail → opens the flyout, ← in it returns focus to the parent. |
| `ArrowDown` · `ArrowUp` · `Home` · `End` | Move focus between the items of a compact flyout. |
| `Escape` | Closes the flyout (focus returns to the parent) and the off-canvas panel on a narrow screen. |

### ARIA
- The panel is a `<nav>` named by `labels.navigation`; groups are `role="group"` named by their label.
- The current item has `aria-current="page"`; in compact mode the label shows as a tooltip, so icon-only items keep a visible name.
- A collapsible group heading and a SubTrigger are buttons with `aria-expanded` and `aria-controls`; folded content is `inert`.
- On the compact rail a SubTrigger has `aria-haspopup="dialog"`; the flyout is a non-modal dialog named by the parent.
- A row action is its own button next to the item (never nested), named by `label` with a tooltip.
- The account avatar is hidden from screen readers; the name and the muted line name the button.
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
| [overview.tsx](examples/overview.tsx) | App navigation on the canvas: a brand header with the collapse toggle, items with icons and the current page — `Sidebar.Brand`, `Sidebar.Toggle`, `Sidebar.ItemIcon`, `current`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: item height, text, icon and counter follow the tier; the rail width stays — `size`. |
| [structure.tsx](examples/structure.tsx) | Labelled groups and the optional item parts: a plain count, a coloured badge, a key hint, a trailing icon, a row action and a disabled section — `Sidebar.Group`, `Sidebar.ItemCount`, `color`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`, `disabled`. |
| [brand-header.tsx](examples/brand-header.tsx) | A brand block with the collapse toggle at the end of the header; in compact mode the logo stays and the toggle moves onto the rail edge — `Sidebar.Brand`, `Sidebar.BrandLogo`, `description`, `variant`. |
| [collapsible-groups.tsx](examples/collapsible-groups.tsx) | Group headings that fold their items away, with a chevron at the end of the heading; in compact mode the items always show — `collapsible`, `defaultOpen`. |
| [nested-items.tsx](examples/nested-items.tsx) | A parent item with child items on a guide line: a current child opens it and marks the parent; on the compact rail the children open in a flyout — `Sidebar.Sub`, `Sidebar.SubTrigger`, `Sidebar.SubContent`. |
| [account.tsx](examples/account.tsx) | Footer items above the signed-in person: avatar, name and email open the account menu; in compact mode only the avatar stays — `Sidebar.Footer`, `Sidebar.Account`, `description`. |
| [router.tsx](examples/router.tsx) | A router link as the item: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the rail mode: expanded, an icon rail with tooltips, or hidden; only the width animates — `mode`, `onModeChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | Navigation behind a menu button at any width: the parent opens the off-canvas panel, the scrim, Escape, the header toggle or a navigation closes it — `offCanvas`, `open`, `onOpenChange`. |

## Mistakes
- `icon={…}` / `badge={…}` props → use the `Sidebar.ItemIcon` and `Sidebar.ItemCount` parts.
- A Badge for every count → plain numbers by default; `color` only when the count needs attention.
- A `<button>` placed inside an item for a row action → use `Sidebar.ItemAction` (it sits beside the item).
- Hand-made brand markup with its own compact CSS → use `Sidebar.Brand` + `Sidebar.BrandLogo`.
- A parent that is also a link → a `Sidebar.SubTrigger` only discloses; put the overview page in the children.
- Items without an icon in a rail that can go compact → compact shows only icons.
- Wrapping a router link in `Sidebar.Item` without `asChild` → nested interactive elements; use `asChild`.
- Setting `current` and also relying on the router's `aria-current` → use one source.
- Placing the Sidebar outside `AppShell.Nav` → it will not take the rail position.

## Related
- **Built from:** [ScrollContainer](../../components/scroll-container/COMPONENT.md), [Badge](../../components/badge/COMPONENT.md), [Tooltip](../../components/tooltip/COMPONENT.md), [Popover](../../components/popover/COMPONENT.md) (compact flyout), [Button](../../components/button/COMPONENT.md) (header toggle, row action), [Avatar](../../components/avatar/COMPONENT.md) slot, Icon (`nav.sidebarCollapse`, `nav.sidebarExpand`, `nav.chevronsLeft`, `nav.chevronDown`, `nav.chevronsUpDown`, `action.add`)
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Dropdown](../../components/dropdown/COMPONENT.md) (account menu), [Drawer](../../components/drawer/COMPONENT.md), [Kbd](../../components/kbd/COMPONENT.md)
