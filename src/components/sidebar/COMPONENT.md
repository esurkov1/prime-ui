# Sidebar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

Composite side navigation: a root with state context, an optional narrow section column, and a main panel with item groups, headings, and a footer.

## What it’s for

- **Workspaces and product switching** — CRM, billing, and support icons on the left; a list of entities for the selected product on the right without changing the whole layout.
- **Documentation portals** — collapsible TOC categories, page trees, and long chapter lists with a compact panel and a separate content slot.
- **Logistics and ops dashboards** — a narrow “Fleet / Warehouse” column and detailed menus for routes, vehicles, and tickets with row counters.
- **Settings and wizard forms** — one column for settings sections; panel open state and simple/double mode can be driven from the parent together with routing.
- **Storefronts and catalogs** — sidebar in the page navigation slot full height next to filters and product grids (`sidebarSlot`, compact panel width).
- **Routed apps** — items on `NavLink` and the `useSidebarNavTo` hook so you don’t repeat the section prefix in every `to`.

## Use cases

Import from the `prime-ui-kit` package. Below are scenarios from different domains; API combinations do not repeat the same task.

### Basic

One panel for an internal team tool: header, item group, footer with profile.

```tsx
import { Avatar, Sidebar } from "prime-ui-kit";

export function TeamToolNav() {
  return (
    <Sidebar.Root size="m" variant="simple" defaultOpen aria-label="Tool navigation">
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.IdentityButton
                leading={<span aria-hidden="true">Δ</span>}
                title="Delta Ops"
                subtitle="Internal"
                type="button"
              />
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Services</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button" active>
                  <Sidebar.MenuLabel>Incidents</Sidebar.MenuLabel>
                  <Sidebar.MenuTrailing>4</Sidebar.MenuTrailing>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton type="button">
                  <Sidebar.MenuLabel>Shifts</Sidebar.MenuLabel>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.IdentityButton
            leading={
              <Avatar.Root size="s">
                <Avatar.Fallback>IP</Avatar.Fallback>
              </Avatar.Root>
            }
            title="Ivan Petrov"
            subtitle="On call"
            type="button"
          />
        </Sidebar.Footer>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### Variants and sizes

Learning portal: large size, compact panel width, and a collapsible TOC block.

```tsx
import { Sidebar } from "prime-ui-kit";
import { useState } from "react";

export function CourseOutlineNav() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(true);

  return (
    <Sidebar.Root
      size="l"
      variant="simple"
      panelWidth="compact"
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Course outline"
    >
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.NavPanelHeading>Module 3</Sidebar.NavPanelHeading>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.NavCategory>
            <Sidebar.NavCategoryTrigger
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              <Sidebar.NavCategoryLabel>Lectures</Sidebar.NavCategoryLabel>
              <Sidebar.NavCategoryCount>6</Sidebar.NavCategoryCount>
            </Sidebar.NavCategoryTrigger>
            {expanded ? (
              <Sidebar.NavCategoryPanel>
                <Sidebar.NavDocTree>
                  <Sidebar.Text>Introduction</Sidebar.Text>
                  <Sidebar.Text>Practice</Sidebar.Text>
                </Sidebar.NavDocTree>
              </Sidebar.NavCategoryPanel>
            ) : null}
          </Sidebar.NavCategory>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### In context (page layout)

Storefront: sidebar in the navigation slot next to the content area, without a responsive overlay in this frame. The page shell (for example `PageShell`) places the nav slot and `<main>` in a row; here only the sidebar markup is shown.

```tsx
import { Sidebar } from "prime-ui-kit";

export function StorefrontShell() {
  return (
    <Sidebar.Root
      size="m"
      variant="simple"
      sidebarSlot="page-nav"
      defaultOpen
      responsive={false}
      aria-label="Storefront categories"
    >
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Catalog</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button" active>
                <Sidebar.MenuLabel>New arrivals</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuLink href="/sale" active={false}>
                Sale
              </Sidebar.MenuLink>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### Controlled mode

Admin: parent owns open state and column mode to sync with a user “compact navigation” preference.

```tsx
import { Sidebar } from "prime-ui-kit";
import { useState } from "react";

export function AdminNavControlled() {
  const [open, setOpen] = useState(true);
  const [variant, setVariant] = useState<"simple" | "double">("double");
  const [section, setSection] = useState("users");

  return (
    <Sidebar.Root
      size="m"
      variant={variant}
      onVariantChange={setVariant}
      activeSection={section}
      onActiveSectionChange={setSection}
      open={open}
      onOpenChange={setOpen}
      responsive={false}
      aria-label="Administration"
    >
      {variant === "double" ? (
        <Sidebar.ContextBar
          items={[
            { id: "users", label: "Users", icon: <span aria-hidden>👤</span> },
            { id: "billing", label: "Billing", icon: <span aria-hidden>💳</span> },
          ]}
        />
      ) : null}
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Panel</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.PanelSwitch
            sections={{
              users: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton type="button" active>
                        <Sidebar.MenuLabel>User accounts</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.NavPanelBody>
              ),
              billing: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton type="button" active>
                        <Sidebar.MenuLabel>Invoices</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.NavPanelBody>
              ),
            }}
          />
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### Routes and `useSidebarNavTo`

SPA with React Router: two-level navigation and short paths inside a section.

```tsx
import { Sidebar, useSidebarNavTo } from "prime-ui-kit";

function PanelRoutes() {
  const toList = useSidebarNavTo("list");
  const toNew = useSidebarNavTo("new");

  return (
    <Sidebar.NavPanelBody>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuRouterLink to={toList} end>
            <Sidebar.MenuLabel>All tickets</Sidebar.MenuLabel>
          </Sidebar.MenuRouterLink>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuRouterLink to={toNew}>
            <Sidebar.MenuLabel>New</Sidebar.MenuLabel>
          </Sidebar.MenuRouterLink>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.NavPanelBody>
  );
}

export function TicketsSidebar() {
  return (
    <Sidebar.Root variant="double" defaultActiveSection="desk" aria-label="Tickets">
      <Sidebar.ContextBar
        items={[
          { id: "desk", label: "Desk", icon: <span aria-hidden>📋</span> },
          { id: "archive", label: "Archive", icon: <span aria-hidden>🗄</span> },
        ]}
      />
      <Sidebar.NavPanel>
        <Sidebar.Content>
          <Sidebar.PanelSwitch
            sections={{
              desk: <PanelRoutes />,
              archive: (
                <Sidebar.NavPanelBody>
                  <Sidebar.Text>Archived requests</Sidebar.Text>
                </Sidebar.NavPanelBody>
              ),
            }}
          />
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

## Anatomy

```
Sidebar.Root (context + aside)
├── Sidebar.ContextBar? (optional when variant="double")
│   ├── [logo] ContextBarHeader
│   ├── ContextBarBody → list of ContextItemButton (+ kit Tooltip when using items)
│   └── [footer] ContextBarFooter
└── Sidebar.NavPanel
    ├── Sidebar.Header
    │   └── Sidebar.HeaderRow → Sidebar.HeaderMain | Sidebar.ToggleButton
    ├── Sidebar.Content
    │   ├── Sidebar.PanelSwitch? (content by activeSection)
    │   ├── Sidebar.NavCategory → Trigger, Label, Count, Panel, NavDocTree
    │   └── Sidebar.Group → GroupLabel, Menu → MenuItem → MenuButton | MenuLink | MenuRouterLink, MenuAction, MenuIcon, MenuLabel, MenuTrailing
    └── Sidebar.Footer → IdentityButton, etc.
```

The floating open button and backdrop render on `Sidebar.Root` when the panel is closed in responsive mode.

## API

### Sidebar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Scale for controls and column widths. |
| variant | `"simple" \| "double"` | from defaultVariant | No | One or two columns. |
| defaultVariant | `"simple" \| "double"` | `"double"` | No | Initial variant. |
| onVariantChange | `(v) => void` | — | No | Variant change callback. |
| activeSection | `string` | — | No | Active top-level section. |
| defaultActiveSection | `string` | — | No | Initial section. |
| onActiveSectionChange | `(section: string) => void` | — | No | Section selection notification. |
| open | `boolean` | — | No | Controlled panel open state. |
| defaultOpen | `boolean` | `true` (on wide viewport when responsive) | No | Initial open. |
| onOpenChange | `(open: boolean) => void` | — | No | Open state change. |
| responsive | `boolean` | `true` | No | Behavior at max-width 64rem. |
| panelWidth | `"compact"` | — | No | Narrow panel. |
| sidebarSlot | `"page-nav"` | — | No | Slot mode next to page content. |
| aria-label | `string` | `"Sidebar"` | No | Aside label. |
| className | `string` | — | No | Extra class. |
| children | `ReactNode` | — | Yes | Markup inside the root. |

### Sidebar.ContextBar

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| items | `SidebarContextItem[]` | — | No | id, label, icon; optional tooltip, ariaLabel, disabled. |
| activeSection | `string \| null` | from context | No | Item highlight. |
| onSelectSection | `(id: string) => void` | context | No | Section selection. |
| logo | `ReactNode` | — | No | Top of the context column. |
| footer | `ReactNode` | — | No | Bottom of the column. |
| className, children, … | — | — | No | Without `items` — arbitrary markup in `nav`. |

### Sidebar.ContextItemButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| active | `boolean` | — | No | data-active. |
| asChild | `boolean` | `false` | No | Slot instead of button. |
| type | `"button" \| …` | `"button"` | No | Button type. |
| disabled | `boolean` | — | No | Disabled state. |

Other props match `button` (or the child element when `asChild`).

### Sidebar.PanelSwitch

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| sections | `Record<string, ReactNode>` | — | No | Map of section → content. |
| renderSection | `(activeSection) => ReactNode` | — | No | Takes precedence over sections. |
| fallback | `ReactNode` | `null` | No | If key is missing. |

### Sidebar.Footer

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"plain" \| "inset"` | `"plain"` | No | Spacing variant. |

### Sidebar.IdentityButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| leading | `ReactNode` | — | No | Left side. |
| title | `ReactNode` | — | Yes | Primary line. |
| subtitle | `ReactNode` | — | No | Secondary line. |
| trailing | `ReactNode` | icon | No | Right side. |

`children` is unused; the rest are `button` attributes.

### Sidebar.ToggleButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| openLabel | `string` | “Hide sidebar” | No | aria-label when open. |
| closedLabel | `string` | “Show sidebar” | No | aria-label when closed. |

Calls `toggleOpen` from context after `onClick` unless `preventDefault`.

### Sidebar.MenuButton / MenuLink / MenuRouterLink

- **MenuButton** — `active`, `asChild`, `type`, `disabled`, and `button` props.
- **MenuLink** — `active` and `a` props.
- **MenuRouterLink** — props from react-router-dom `NavLink` (`to`, `className`, `end`, …); menu item styles are layered on top.

### Sidebar.MenuAction

Compact button in a `MenuItem` row; `button` props.

### Other wrappers

`ContextBarHeader`, `ContextBarBody`, `ContextBarFooter`, `NavPanel`, `NavPanelBody`, `NavDocTree`, `NavPanelHeading`, `NavCategory`, `NavCategoryTrigger`, `NavCategoryLabel`, `NavCategoryCount`, `NavCategoryPanel`, `Header`, `HeaderRow`, `HeaderMain`, `Content`, `Group`, `GroupLabel`, `Menu`, `MenuItem`, `MenuIcon`, `MenuLabel`, `MenuTrailing`, `Text` — semantic containers with `className`, `children`, and standard HTML attributes for the corresponding element.

### useSidebarContext()

Returns: `size`, `variant`, `setVariant`, `activeSection`, `setActiveSection`, `open`, `setOpen`, `toggleOpen`. Must be used under `Sidebar.Root`.

### useSidebarNavTo(pathWithinSection: string)

Returns a path string: when `variant === "double"` and a section is selected — `/{activeSection}/{path}` (slashes in the argument are normalized); otherwise path from the root.

## Variants

- **variant `simple`** — only `NavPanel`; context column hidden (`data-collapsed` on root for styling).
- **variant `double`** — `ContextBar` + `NavPanel`, gap between them from tokens.
- **panelWidth `compact`** — narrower main panel.
- **sidebarSlot `page-nav`** — padding and height for the column in the shared page layout.
- **Footer `inset`** — visually “inset” footer.

## States

- **open** — panel expanded; with `responsive` and a narrow window — overlay and focusable “Close sidebar” backdrop.
- **disabled** on context and menu items — reduced opacity, click blocked; with `asChild`, `aria-disabled` is forwarded.
- **active** on `MenuButton` / `MenuLink` or `aria-current` on `NavLink` — current item highlight.
- Floating button on root when panel is closed in the responsive scenario.

## Accessibility (a11y)

- Root `aside` with configurable `aria-label`.
- Close backdrop on overlay gets an accessible name and focus only when visible.
- `ToggleButton` and floating button change `aria-label` based on `open`.
- `ContextBar` with `items` wraps items in `Tooltip` for labels; set `ariaLabel` on the item when the label differs from the icon.
- `MenuIcon`, `MenuTrailing` with `aria-hidden` where `MenuLabel` or the button `aria-label` carries the role.

## Limitations and notes

- Responsive threshold is tied to **window width** (`matchMedia("(max-width: 64rem)")`), not the preview container width.
- `useSidebarNavTo` is mainly meaningful with `variant="double"` and a non-empty `activeSection`.
- `MenuRouterLink` requires a React Router provider above in the tree.
- `onActiveSectionChange` is not fired when the active section is reset to `null` inside controlled state.

## Related components

- **Tooltip** — labels for narrow icons in `ContextBar` when using `items`.
- **Dropdown** — often wraps `IdentityButton` for user menu or theme.
- **Avatar** — in `IdentityButton.leading`.
- **Button** — actions outside the sidebar or in the app header.
- **PageShell** — typical consumer of `sidebarSlot="page-nav"`.
