# AppHeader

**Category:** page
**Kind:** layout

> The bar at the top of the app's content panel: where you are, global search and a few actions.

## When to use
- The top row of an app built on [AppShell](../app-shell/COMPONENT.md): the section title or the path, the ⌘K search entry, notifications, the account, one primary action.
- The phone header: the menu button that opens the off-canvas Sidebar, the title, search as an icon.

## When not to use
- The page heading, its description and page actions inside main → use [PageContent](../../components/page-content/COMPONENT.md) (`PageContent.Title` is the `<h1>`).
- Tabs, filters and search for the data on the page → use [PageToolbar](../../components/page-toolbar/COMPONENT.md).
- App navigation → use [Sidebar](../sidebar/COMPONENT.md) and, on a phone, [BottomNav](../bottom-nav/COMPONENT.md); the header holds at most the menu button.
- The search dialog itself → use [CommandMenu](../../components/command-menu/COMPONENT.md); `AppHeader.Search` only opens it.

## Import
```tsx
import { AppHeader } from "prime-ui-kit";
```

## Anatomy
```
AppHeader.Root               <header>, one sticky row as high as the Sidebar brand row
├─ AppHeader.Start           leading zone, takes the free width
│  ├─ AppHeader.MenuButton   opens the off-canvas Sidebar (below 768px by default)
│  ├─ AppHeader.Separator    short vertical line between groups (a back Button | a Breadcrumb)
│  └─ AppHeader.Title        name, truncates (or a Breadcrumb instead)
│     ├─ AppHeader.Icon      decorative glyph on a tile shaped like a soft button m
│     └─ AppHeader.Description  muted caption under the name
├─ AppHeader.Search          field-looking button that opens the CommandMenu
└─ AppHeader.Actions         trailing buttons: notifications, account, primary action
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### AppHeader.Root
`ref` → `HTMLElement`. The `<header>` bar at the top of the content panel: one row as high as the Sidebar brand row, on the panel surface with no divider, sticky with the top safe-area inset (static below 480px of viewport height); inline padding is the shell gutter, so it lines up with the page in main (16 outside a shell). Its controls are size `m`; icon buttons inside are `soft` (a light fill), not `ghost`. A container (`prime-app-header`): below 36rem the icon tile and the description go and the search folds into an icon.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<AppHeaderLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (`AppHeader.Start`, `AppHeader.Search`, `AppHeader.Actions`), `className` and the other attributes. |

### AppHeader.Start
`ref` → `HTMLDivElement`. The leading zone that takes the free width: the menu button, a back button, the title or a Breadcrumb.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### AppHeader.Title
`ref` → `HTMLDivElement`. Where you are: an optional `AppHeader.Icon`, the name (title-s, truncates) and an optional `AppHeader.Description` under it — the anatomy of the Sidebar brand. Not a heading: the page `<h1>` is PageContent.Title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the name, `AppHeader.Icon`, `AppHeader.Description` in any order), `className` and the other div attributes. |

### AppHeader.Icon
`ref` → `HTMLSpanElement`. Decorative glyph before the title (`aria-hidden`) on a tile shaped like the bar's soft buttons: control m square (36), its radius and the subtle fill.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (an `Icon`), `className` and the other span attributes. |

### AppHeader.Description
`ref` → `HTMLSpanElement`. Muted caption under the title (a workspace, a period); hidden on a narrow header.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### AppHeader.Separator
`ref` → `HTMLDivElement`. A short vertical `Divider` (20) between groups in a zone — a back button and the path — with 16 of air on each side.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<DividerProps, "orientation" \| "children">` | — | `className` and the other div attributes. |

### AppHeader.Search
`ref` → `HTMLButtonElement`. The global search entry: a `<button type="button">` drawn as a field (search icon, placeholder text, key hint) that opens your CommandMenu. Below 36rem of header width it folds into a square button named by its text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The placeholder text; also the accessible name. |
| `shortcut` | `ReactNode` | `"⌘K"` | The key hint at the end (a `Kbd`, hidden from assistive tech); `null` hides it. Bind the key yourself. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `className` and the other button attributes. |

### AppHeader.Actions
`ref` → `HTMLDivElement`. The trailing row of buttons: notifications, the account, one primary action. Never wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### AppHeader.MenuButton
`ref` → `HTMLButtonElement`. A soft neutral icon `Button` named by `labels.menu` that opens the off-canvas Sidebar; wire `onClick` and `aria-expanded`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `show` | `"narrow" \| "always"` | `"narrow"` | `narrow` — only below 768px, where a Sidebar with `offCanvas="auto"` leaves the layout; `always` — on every width (`offCanvas="always"`). |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `aria-expanded`, `aria-label` (replaces `labels.menu`), `className` and the other button attributes. |

## Variants

### show (MenuButton)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `narrow` | The menu button shows only below 768px | Sidebar with `offCanvas="auto"` | yes |
| `always` | The menu button on every width | Sidebar with `offCanvas="always"`, or you decide visibility yourself | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `AppHeader.Title` | Icon, name and a caption under it, like the Sidebar brand | A top-level section | |
| Breadcrumb in Start | A soft back button, `AppHeader.Separator` and the path | A nested record page | |
| with `AppHeader.Search` | A field-looking button with a key hint between Start and Actions | The app has a CommandMenu | |
| with `AppHeader.Actions` | A row of buttons at the end | Notifications, account, one primary action | |

## States
| State | Driven by | DOM |
|---|---|---|
| narrow header | header width below 36rem (container `prime-app-header`) | the icon tile and the description hide; the search folds into a square button, its text stays as the name |
| menu button hidden | `show="narrow"` and viewport from 768px | `data-show="narrow"` on MenuButton |
| short viewport | viewport below 480px high (a phone on its side) | Root stops sticking |

## Layout & spacing
- Row min height = control m + `--prime-space-2` (44), padding-block `--prime-space-3` (the top grows to the safe-area inset): 68 in all, the height of the Sidebar header, so the brand and the title share one line.
- Inline padding: the shell gutters (16 → 24 → 32, the same as `AppShell.Main`) in the shell's panel, so the header lines up with the page; `--prime-space-4` elsewhere.
- Icon buttons are `soft` neutral (MenuButton is), never `ghost`: the search folds into a filled square too, so every button on the bar has a shape.
- Gaps: `--prime-space-3` between zones, `--prime-space-2` inside Start and Actions; `AppHeader.Separator` adds `--prime-space-2` on each side (16 in all) and is 20 high.
- `AppHeader.Icon` is a 36 tile with the radius and fill of a soft neutral button m, so it lines up with the buttons on the bar.
- On the panel surface with no divider or shadow (depth from fill); `z-index: --prime-z-sticky`.
- Search: up to 288 wide, shrinks first; field tier m and the surface field fill. Controls inside are size `m`.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves through the menu button, the path links, the search and the actions in reading order. |
| `Enter` · `Space` | Presses the focused button: opens the menu, the search or runs the action. |

### ARIA
- Root is a `<header>`: the banner landmark when it sits at the top level of the page.
- Search is a button named by its text; the key hint is `aria-hidden`, and the app binds the shortcut.
- MenuButton is named by `labels.menu`; pass `aria-expanded` (whether the Sidebar is open).
- Title is not a heading: the page `<h1>` stays with PageContent.Title.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `menu` | `"Открыть меню"` | Name of `AppHeader.MenuButton`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The top bar of a screen: where you are, global search, notifications and the primary action — `AppHeader.Title`, `AppHeader.Search`, `AppHeader.Actions`. |
| [breadcrumbs.tsx](examples/breadcrumbs.tsx) | A nested page: a back button, a separator and the path instead of a title, actions on the record at the end — `AppHeader.Separator`, `AppHeader.Actions`. |
| [in-app-shell.tsx](examples/in-app-shell.tsx) | The header in the app frame: one row with the Sidebar brand across the two planes, sticky over main — `AppShell`, `Sidebar.Brand`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone: the menu button opens the navigation, the description goes and the search folds into an icon — `AppHeader.MenuButton`, `show`. |

## Mistakes
- A border or shadow under the header → it sits on the panel surface; the fill is the boundary.
- `AppHeader.Title` as the page `<h1>` → the heading belongs to PageContent.Title in main.
- A real text input for global search → `AppHeader.Search` opens the CommandMenu, where typing happens.
- More than three actions → keep one primary action; the rest go into the page or a Dropdown.
- A hand-made menu button with a media query → `AppHeader.MenuButton` follows the Sidebar breakpoint.
- `ghost` icon buttons in the header → `variant="soft" tone="neutral"`: a light fill gives each button a shape on the bar.

## Related
- **Built from:** [Button](../../components/button/COMPONENT.md), [Kbd](../../components/kbd/COMPONENT.md), [Divider](../../components/divider/COMPONENT.md), Icon (`action.search`, `nav.menu`)
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [PageContent](../../components/page-content/COMPONENT.md), [PageToolbar](../../components/page-toolbar/COMPONENT.md), [CommandMenu](../../components/command-menu/COMPONENT.md), [Breadcrumb](../../components/breadcrumb/COMPONENT.md)
