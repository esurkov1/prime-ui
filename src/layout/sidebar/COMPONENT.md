# Sidebar

**Category:** navigation
**Kind:** layout

> App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens.

## When to use
- The main navigation of an app, inside `AppShell.Nav`.
- Navigation that users can collapse to an icon rail.
- Sections with sub-pages (a parent item with child items), grouped and collapsible.
- Router links (`asChild` + NavLink) with a current page.

### Building the navigation
The sidebar is the map of the product: people scan it, remember where things are and return to the
same place. Structure it by what people do, not by how the backend is split.

- **Top: the everyday places.** 2–4 items without a group label (Обзор, Входящие) — where people
  start and come back. Never collapsible.
- **Groups are categories of work.** Sales, Support, Finance: 3–7 items each, ordered by how often
  they are used. A group label is one short word — on the rail only its first letters show (with a
  tooltip), so start sibling labels differently («Продажи» and «Проекты» both read «Про»).
- **Fold only what is secondary.** Make a group `collapsible` when the list is long (about 12+
  items) or the group is used rarely; keep the main group open and fixed. `defaultOpen={false}`
  only for rarely used groups — a group with the current page opens by itself (on the compact rail
  it stays folded; its `…` row marks the page).
- **One level of nesting.** `Sidebar.Sub` is one section with 2–6 views of the same objects
  (Сделки → Новые · В работе · Закрытые). The parent only discloses; an overview page is the first
  child («Все сделки»). Never a sub-list inside a sub-list — split the section or use page tabs.
- **Icons.** Every top-level item and every sub-list parent has a distinct icon (on the rail the
  icon is all that is left); children of a sub-list have none.
- **Numbers and dots.** A plain `Sidebar.ItemCount` is information (12 new deals): it leaves the
  row on the rail. A coloured count asks for action (3 unanswered tickets, 2 overdue invoices): it
  becomes a dot on the rail and on any folded parent above it, so the signal is never hidden. Keep
  colour rare — red for what is blocked or overdue, blue for new or unread; never for totals.
  Several colours in one folded branch show the first one's dot.
- **Footer: the meta.** Help (external link with a trailing icon), settings, then the account last,
  with its menu (profile, account settings, sign out).
- **Remember the user's layout.** Pass `persistKey`: the rail mode and folded groups and sub-lists
  survive reloads. Give groups an `id` when their labels are translated.

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
| `persistKey` | `string` | — | Remembers the navigation across reloads in `localStorage` under this key: the mode and which collapsible groups and sub-lists are open, by their `id`, else their label text (give an `id` when labels are translated or change). The stored state wins over `defaultMode` / `defaultOpen`; controlled `mode` / `open` are not stored. Unavailable storage is ignored. |
| `labels` | `Partial<SidebarLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Sidebar.Header · Sidebar.Footer
`ref` → `HTMLDivElement`. Header: one fixed-height row for `Sidebar.Brand` and the header Toggle. Footer: items, the item Toggle and `Sidebar.Account` (set apart by air) at the bottom.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Sidebar.Brand
`forwardRef` → the rendered element. Product block: `Sidebar.BrandLogo`, the name and a muted line; an `<a>` with `href`, the single child with `asChild`, else a `<div>`. In compact mode only the logo stays, without a tooltip (it would cover the edge toggle); the faded name still names the link.

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
`ref` → `HTMLDivElement`. `<div role="group">` named by its label. With `collapsible` the heading is a disclosure button (`aria-expanded`, `aria-controls`) with a chevron at its end; the items fold away (inert). On the compact rail the heading keeps its height and layout: its text slides toward the edge, scales down and is cut by the rail with a fade, so the first letters still name the section, and it still folds and unfolds the group. An open group keeps its items on the rail; a folded one stays folded and becomes one `…` row (named by the label, `aria-haspopup="dialog"`) whose items open in a flyout, like a sub-list. A folded group with a count that needs attention inside shows its dot (after the heading, or on the `…` row).

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Group heading (`aria-labelledby`). Keep it to one short word: on the compact rail only its first letters show. |
| `collapsible` | `boolean` | `false` | The heading shows and hides the items. Needs `label`. |
| `open` | `boolean` | — | Items shown (controlled). |
| `onOpenChange` | `(open: boolean) => void` | — | Called with the new open state (click, keyboard, a current page moving inside). |
| `defaultOpen` | `boolean` | `true` | Initial state (uncontrolled). Off the compact rail a closed group opens by itself when the current page moves into it; on the rail it stays folded and its `…` row marks the page. |
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
`ref` → `HTMLSpanElement` (the number or the Badge). A count after the label: a plain muted number by default; a `Badge` (one tier down) when `color` or `variant` is set. In compact mode the number leaves the row (still read by screen readers) and a badge leaves a dot of its hue on the icon; a folded sub-list or group shows the dot of a badge inside it.

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
`ref` → `HTMLButtonElement`. A row action (create, add): a ghost icon `Button` one tier down with a tooltip, next to the item element — never inside it. It shows on hover and focus of the row, always on touch screens, while the trail (count, hint) steps aside; hidden on the compact rail.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Accessible name and tooltip («Создать задачу»). |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — (required) | The action. |
| `disabled` | `boolean` | — | Not available. |
| `children` | `ReactNode` | — | The glyph; `<Icon name="action.add" />` by default. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "onClick" \| "aria-label">` | — | `className` and the other attributes of the Button. |

### Sidebar.Sub
`ref` → `HTMLDivElement`. A parent item with child items: `Sidebar.SubTrigger` + `Sidebar.SubContent` in a `<div>`. Expanded, the children unfold under the parent on a guide line; on the compact rail they open in a flyout (the kit Popover to the right, with the rows and spacing of a kit menu). A current child opens the sub-list and marks the parent as on the active path (`data-active-path`). While folded (and always on the rail) the parent shows the dot of a count inside that needs attention.

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
| `children` | `ReactNode` | — | Label (it also names the flyout) and parts as in `Sidebar.Item`: `Sidebar.ItemIcon`, `Sidebar.ItemCount`. |
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
The rail is a surface beside the page, one layer above it on the surface ladder (`data-depth`): white on the light gray page, one step lighter than the near-black page in dark; no border or card. Items are transparent rows with `text-secondary`, `fill-subtle` on hover; the current item takes the rail's fill two ladder steps off it (`fill-muted-hover`) with primary text.

### mode (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `expanded` | `--prime-layout-sidebar-width` (248) with icons and labels | Default desktop navigation | yes |
| `compact` | `--prime-layout-sidebar-collapsed-width` (56) icon rail; labels fade, tooltips on the right, coloured counts become dots, group headings keep their first letters (whole name in a tooltip), sub-lists and folded groups open as flyouts | Users want more content width | |
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
| `color` | a soft Badge of that hue; on the rail and on folded parents a dot of that hue | the count needs attention (red «7») | |
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
| `collapsible` (Group) | the heading is a button with a chevron at its end; items fold away; folded on the rail, one `…` row opens them in a flyout | long navigation with sections | off |
| `current` (Item) | surface fill + raised shadow, primary text and icon | the current page | off |
| `disabled` (Item) | `text-disabled`, no hover, `cursor: not-allowed` | an unavailable section | off |

Put `<Sidebar.Toggle variant="header" />` next to `Sidebar.Brand` in the header, or `Sidebar.Toggle` in the footer for a rail without a brand; on phones (`offCanvas="auto"`) or always (`offCanvas="always"`) pair it with `AppHeader.MenuButton` (`open` / `onOpenChange`). One current item at a time; give every top-level item an icon when the rail can go compact (child items need none).

## States
| State | Driven by | DOM |
|---|---|---|
| mode | `mode` / `defaultMode` | Root `data-mode`, `data-panel-mode` (the last visible mode while hidden); `<nav inert>` while hidden |
| off-canvas | `offCanvas="always"`, or `"auto"` + viewport < 768px | Root `data-off-canvas`, `data-state="open" \| "closed"`; `<nav inert>` while closed |
| current | `current` or a router's `aria-current` | Item `aria-current="page"`, `data-state="active"` |
| active path | a child of a Sub (or an item of a Group) is current | SubTrigger (or the `…` row of a folded Group) `data-active-path`; a closed Sub opens, a closed Group opens off the compact rail |
| group open | Group `open` / `defaultOpen` (`collapsible`) | heading `aria-expanded`; region `data-state`, `inert` while closed |
| sub open | Sub `open` / `defaultOpen` | SubTrigger `aria-expanded`; SubContent `data-state`, `inert` while closed |
| flyout | hover / click / keyboard on a SubTrigger, or on the `…` row of a folded group, in compact mode | the row `aria-haspopup="dialog"`, `aria-expanded`; a Popover `role="dialog"` |
| attention dot | a coloured `Sidebar.ItemCount` inside a folded Sub (always on the rail) or a folded Group | `Badge.Dot` with `data-attention="shown" \| "hidden"` on the parent row / heading / `…` row |
| persisted | `persistKey` on Root | the mode and the open state of collapsible groups and sub-lists are read from and written to `localStorage` |
| disabled | `disabled` | Item `disabled` / `aria-disabled`, `data-disabled` |

Leaving the narrow viewport closes the off-canvas panel; navigating from an `href` / `asChild` item (or the brand) closes it too. Navigating from a flyout closes the flyout.

## Layout & spacing
- Panel padding: `--prime-space-3` block, `--prime-space-2` inline; regions 8 apart; groups 16 apart, items 4 apart.
- Item horizontal padding is derived from the compact width so icons and the brand logo sit on one axis in every mode (the account avatar joins that axis on the rail).
- Header is one row of the item height + 8. The header toggle (xs, 28) sits at its end, 8 from the rail edge; in compact mode it moves half past the edge, scales to 3/4, turns round and gets a ring in the rail color. The root clips with `clip-path`, reaching past the edge by the toggle's half-width and ring beside the header only; everywhere else the panel ends exactly at the spacer edge.
- Collapsible group: heading 28 high with the chevron (14) at its end, aligned with the item trail; items start 4 below. A folded group's attention dot sits before the chevron.
- On the rail a heading keeps its 28 and its layout: the text slides 8 toward the edge, scales to 0.85 and is cut at the rail box with a 12 fade into the rail. A folded group adds one `…` row under its heading. The items and the row share one place: folding or unfolding on the rail glides the group's height one way (list ↔ row) while the two cross-fade, so the rows below never move back.
- Sub-list: a 1px `border-default` guide line on the parent icon's centre; every child branches off it with an 8 elbow and a 6 bend; child labels line up with the parent label.
- Trail (count, key hint, trailing icon) sits at the row end; a row action (one tier down) appears there on hover / focus (always on touch screens) and the trail moves aside.
- Footer: items 4 apart; the account is set 8 apart below them. It is its own card-like row: the
  avatar of the tier (xs 20, s 24, m·l 32, xl 40) sits in an even frame — the inset before it, the
  gap to the text and the air above and below are one value, the tier gap (xs 4, s·m·l 8, xl 12),
  so the row is the avatar + 2 × gap high (48 at m). On the compact rail the start inset becomes the
  one that centres the avatar on the icon axis, as part of the rail motion.
- Compact flyout: the kit Popover (flush) to the right, aligned with the parent row, with the metrics of a kit menu — rows of the tier's menu item height (32 at m), the panel padding, no title (the row names it), no guide line; current child is a `fill-subtle-active` wash.
- Motion: two layers on one clock. `Sidebar.Root` is the spacer: it reserves the rail width in the page, paints the rail and clips the panel to its own box; its width is the only layout that moves (the page column follows). The `<nav>` panel inside is positioned at the expanded width in every mode and never lays out again, so nothing re-wraps and nothing switches at the end. Every part is a plain CSS transition over `base` with the `standard` (ease-in-out) easing, started by the same mode change and ending with the rail: text fades through its fill colour (paint-only, no compositor layer per label), chevrons through their stroke, trailing boxes (a coloured count, a key hint) through `opacity`; coloured counts turn into dots; the account avatar slides onto the icon axis; the header toggle rides the edge by `translate` / `scale`. Rows stay full width: a row with a fill or a ring (current, on the active path, hovered, open, focused) draws them on a pseudo-element whose end edge travels to the icon box and clips its content there, so it always ends rail padding before the moving edge and is a rounded square around the icon at rest. Group headings keep their height and layout: their text slides toward the edge and scales down by transform while the moving cut ends it with a fade; the text box narrows only once the rail has closed (under the cut, never seen), so the dot and the chevron after it stay in place and fade. The `…` row of a folded group grows in and out on the same clock (grid track height), as do the attention dots (opacity and scale). Hidden keeps the look of the last visible mode and is clipped as one piece; the header toggle stays at its place and fades, and coming back from hidden it fades in at its final place. Collapsible groups that open for the rail and sub-lists that close for it move on the same clock (grid track height); chevrons rotate (base). All durations are tokens: under reduced motion every mode change is instant.
- Layers of a row on the rail (compact tooltips, the sub-list flyout, a `Dropdown` around `Sidebar.Account`) anchor to the visible part of the row — the icon box — not to its full-width box. The brand has no compact tooltip: the logo speaks for itself and a tooltip would cover the edge toggle.
- Off-canvas panel width: min(sidebar width, 100% − `--prime-space-12`).
- Inside `AppShell.Nav` the rail takes the full height. The root is `height: 100%` and the panel is
  positioned inside it, so the rail never hugs its items: outside AppShell give the parent a height
  (a `height: auto` parent collapses the rail to nothing).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus through the items; a disabled or folded one is skipped. |
| `Enter` · `Space` | Opens the section, presses the item, opens or closes a group or a sub-list; on the compact rail opens the flyout (of a sub-list or a folded group) and focuses the first child. |
| `ArrowRight` · `ArrowLeft` | On a parent item opens / closes the sub-list; on the compact rail → opens the flyout, ← in it returns focus to the parent. |
| `ArrowDown` · `ArrowUp` · `Home` · `End` | Move focus between the items of a compact flyout. |
| `Escape` | Closes the flyout (focus returns to the parent) and the off-canvas panel on a narrow screen. |

### ARIA
- The panel is a `<nav>` named by `labels.navigation`; groups are `role="group"` named by their label.
- The current item has `aria-current="page"`; in compact mode the label shows as a tooltip, so icon-only items keep a visible name.
- A collapsible group heading and a SubTrigger are buttons with `aria-expanded` and `aria-controls`; folded content is `inert`.
- On the compact rail a SubTrigger and the `…` row of a folded group have `aria-haspopup="dialog"`; the flyout is a non-modal dialog named by the parent (the `…` row by the group label).
- On the rail a collapsible group heading stays the same disclosure button (folding it there brings the `…` row); hovering it shows the whole name in a tooltip.
- An attention dot is decorative: the count it stands for is read inside.
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
| [overview.tsx](examples/overview.tsx) | Everything the app navigation holds: brand and collapse toggle, groups that fold, a nested list, counts, the footer and the account — `Sidebar.Brand`, `Sidebar.Group`, `Sidebar.Sub`, `Sidebar.ItemCount`, `Sidebar.Account`, `Sidebar.Toggle`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: item height, text, icon and counter follow the tier; the rail width stays — `size`. |
| [structure.tsx](examples/structure.tsx) | Labelled groups and the optional item parts: a plain count, a coloured badge, a key hint, a trailing icon, a row action and a disabled section — `Sidebar.Group`, `Sidebar.ItemCount`, `color`, `Sidebar.ItemShortcut`, `Sidebar.ItemAction`, `disabled`. |
| [brand-header.tsx](examples/brand-header.tsx) | A brand block with the collapse toggle at the end of the header; in compact mode the logo stays and the toggle moves onto the rail edge — `Sidebar.Brand`, `Sidebar.BrandLogo`, `description`, `variant`. |
| [collapsible-groups.tsx](examples/collapsible-groups.tsx) | Group headings that fold their items away, with a chevron at the end of the heading; on the compact rail a folded group becomes one row whose items open in a flyout — `collapsible`, `defaultOpen`. |
| [nested-items.tsx](examples/nested-items.tsx) | A parent item with child items on a guide line: a current child opens it and marks the parent; on the compact rail the children open in a flyout — `Sidebar.Sub`, `Sidebar.SubTrigger`, `Sidebar.SubContent`. |
| [account.tsx](examples/account.tsx) | Footer items above the signed-in person: avatar, name and email open the account menu; collapse the rail and only the avatar stays, on the icon axis — `Sidebar.Footer`, `Sidebar.Account`, `description`, `Sidebar.Toggle`. |
| [router.tsx](examples/router.tsx) | A router link as the item: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the rail mode: expanded, an icon rail with tooltips, or hidden; every switch is one synchronous movement — `mode`, `onModeChange`. |
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
- Every group `collapsible` and folded by default → people hunt for pages; fold only long or rarely used groups.
- A sub-list inside a sub-list → one level only; split the section or use tabs on the page.
- Coloured counts on every item → colour only what needs action; the rest are plain numbers.
- Long group labels («Управление продажами и клиентами») → on the rail only the first letters show; one short word.
- Your own `localStorage` code for the rail mode → `persistKey` keeps the mode and the folded groups.

## Related
- **Built from:** [ScrollContainer](../../components/scroll-container/COMPONENT.md), [Badge](../../components/badge/COMPONENT.md), [Tooltip](../../components/tooltip/COMPONENT.md), [Popover](../../components/popover/COMPONENT.md) (compact flyout), [Button](../../components/button/COMPONENT.md) (header toggle, row action), [Avatar](../../components/avatar/COMPONENT.md) slot, Icon (`nav.sidebarCollapse`, `nav.sidebarExpand`, `nav.chevronsLeft`, `nav.chevronDown`, `nav.chevronsUpDown`, `action.add`)
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Dropdown](../../components/dropdown/COMPONENT.md) (account menu), [Drawer](../../components/drawer/COMPONENT.md), [Kbd](../../components/kbd/COMPONENT.md)
