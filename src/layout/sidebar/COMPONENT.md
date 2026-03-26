# Sidebar

**Default sizing:** use **`size="m"`** for the sidebar scale unless a scenario explicitly needs another value.

## About

`Sidebar` is a vertical navigation column: **`Sidebar.Root`** owns context and layout (`expanded` | `compact` | `hidden`), **`Sidebar.NavPanel`** is the panel (`nav`) with header / body / footer regions, and **Menu** / **Group** / **NavCategory** build item structure.

**When to use**

- Persistent app navigation beside main content, including **`AppShell.Template`** nav slot with **`sidebarSlot="page-nav"`**.
- Desktop width toggle (expanded vs icon rail) with optional tooltips in **`compact`**.
- Mobile drawer behavior when **`responsive={true}`** (default): overlay, backdrop, floating open control when inline toggle is absent.

**When not to use**

- One-off filters or transient panels — prefer **Drawer** or **Modal**.
- Deep multi-level trees without routing — consider a dedicated tree or doc nav pattern before overloading **NavCategory**.

## Composition

- **`Sidebar.Root`** — required wrapper (`aside`); exposes state, **`useSidebarContext`** values, and responsive / mobile behavior.
- **`Sidebar.NavPanel`** — panel container (`nav`); wire **`ToggleButton`** and landmarks consistently.
- Typical order: **`Header`** → **`ToggleButton`** (in **`HeaderRow`**) → **`Content`** (often **`NavPanelBody`** + **`Menu`**) → optional **`Footer`**.
- In **`compact`** on non-mobile viewports, **MenuButton** / **MenuRouterLink** / **MenuLink** can show **tooltips** ( **`Tooltip`**, `side="right"`, `delayDuration={0}` ). On mobile, tooltips are suppressed.
- **`ToggleButton`** and the floating mobile opener use **`aria-controls`** pointing at the **`NavPanel`** id.

### Canonical example

```tsx
import { FileText, LayoutDashboard } from "lucide-react";
import { Sidebar } from "prime-ui-kit";

export function Example() {
  return (
    <Sidebar.Root size="m" defaultState="expanded" responsive={false} aria-label="Application">
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>Acme</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button" active>
                <Sidebar.MenuIcon>
                  <LayoutDashboard size={16} strokeWidth={1.9} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Overview</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button">
                <Sidebar.MenuIcon>
                  <FileText size={16} strokeWidth={1.9} />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Reports</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

### Extended examples

- [`./examples/01-app-shell-nav.tsx`](./examples/01-app-shell-nav.tsx) — **`AppShell.Template`** with **`sidebarSlot="page-nav"`** and a simple menu.
- [`./examples/02-collapsible-desktop.tsx`](./examples/02-collapsible-desktop.tsx) — **`responsive={false}`**: header toggle cycles **expanded** / **compact** and tooltips on icon rail.
- [`./examples/03-controlled-state.tsx`](./examples/03-controlled-state.tsx) — controlled **`state`** / **`onStateChange`** with an external control.
- [`./examples/04-router-navigation.tsx`](./examples/04-router-navigation.tsx) — **`MemoryRouter`** and **`Sidebar.MenuRouterLink`** next to **`Routes`**.
- [`./examples/05-responsive-behavior.tsx`](./examples/05-responsive-behavior.tsx) — default **`responsive`**: narrow breakpoint note and **`SIDEBAR_MEDIA_QUERY_NARROW`**.

**LLM note:** Prefer the runnable files under **`./examples/*.tsx`** for full composition and imports. **`Sidebar.MenuRouterLink`** uses React Router **`NavLink`**; wrap the app (or story) in **`BrowserRouter`**, **`HashRouter`**, or **`MemoryRouter`** — links throw without a router context. For built-in active styles from the kit, pass **`className` as a function** (e.g. `className={() => ""}`); a plain string **`className`** does not receive **`isActive`**. Additional prop tables and playground demos: `playground/sections/SidebarSection.tsx`, `playground/sections/sidebarApiRows.ts`.

## Visual contract

- **`NavPanel`** is not framed as a floating card: no full-panel border; background follows theme (light: mixed surface/border; dark: surface default). The edge toward main content uses **`border-subtle`** on the inward inline side according to **`side`**.
- Overlays (**Dropdown**, **Popover**) keep elevated surfaces distinct from the rail.

## State model

- Prefer **`state`**, **`defaultState`**, **`onStateChange`** with **`SidebarLayoutMode`**: **`"hidden"`** | **`"compact"`** | **`"expanded"`**.
- Legacy **`open`**, **`defaultOpen`**, **`onOpenChange`**, **`mode`**, **`defaultMode`**, **`onModeChange`** remain for compatibility; new code should use the **`state`** model.
- With **`responsive={true}`**, viewports matching **`SIDEBAR_MEDIA_QUERY_NARROW`** (`max-width: 47.999rem`, i.e. below **`48rem`**) treat the panel as a drawer: **`hidden`** shows overlay affordances; crossing the breakpoint resets open/closed behavior per **`SidebarRoot`** logic.
- **`ToggleButton`**: on mobile, toggles **hidden** ↔ **expanded**; on desktop, **expanded** ↔ **compact** (and from **hidden** back to **expanded**).

## Data pattern (product menus)

For dynamic menus (modes, roles, brands), keep a data layer above the JSX: e.g. **`navTag`** per mode, **`tags`** on items, optional **`switchByTag`**, and filter at render. That lets you swap categories without restructuring **Sidebar** markup.

## Rules

- Call **`useSidebarContext`** only under **`Sidebar.Root`**.
- **`sidebarSlot="page-nav"`** aligns the rail with page grid spacing when used inside **`AppShell`**.
- Export **`SIDEBAR_MEDIA_QUERY_NARROW`**, **`SIDEBAR_MEDIA_QUERY_INLINE`**, **`SIDEBAR_LAYOUT_BREAKPOINT_MAX`**, **`SIDEBAR_MEDIA_QUERY_XS_HIDDEN`** from **`prime-ui-kit`** match **`sidebarLayout.ts`** for JS/CSS alignment.

## API

### `Sidebar.Root`

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Typically **`NavPanel`** and descendants. |
| size | `SidebarSize` | `"m"` | No | Scale for controls, type, and rail width. |
| side | `"left" \| "right"` | `"left"` | No | Physical side; affects toggle icons and borders. |
| state | `SidebarLayoutMode` | — | No | Controlled layout state. |
| defaultState | `SidebarLayoutMode` | see below | No | Initial state; with **`responsive`**, narrow viewports start **hidden**. |
| onStateChange | `(state: SidebarLayoutMode) => void` | — | No | Fires on layout changes. |
| responsive | `boolean` | `true` | No | When **true**, narrow viewports use drawer + backdrop (+ floating opener if no edge toggle). |
| sidebarSlot | `"page-nav"` | — | No | Page nav embedding; sets **`data-sidebar-slot`**. |
| aria-label | `string` | `"Sidebar"` | No | Name for the **`aside`** landmark. |
| open, defaultOpen, onOpenChange | — | — | No | **Deprecated;** maps to hidden vs expanded. |
| mode, defaultMode, onModeChange | — | — | No | **Deprecated;** use **state** / **onStateChange**. |

Also accepts **`className`** and native **`aside`** attributes via **`…rest`**.

### `Sidebar.MenuButton` (in addition to native `button` props)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| active | `boolean` | — | No | Selected / current item styling. |
| asChild | `boolean` | `false` | No | Render via **`Slot`** instead of **`button`**. |
| tooltip | `React.ReactNode` | — | No | Tooltip in **compact**; fallback from **`aria-label`** or **`children`**; empty string disables. |

### `Sidebar.MenuRouterLink` (extends `NavLink` props)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| tooltip | `React.ReactNode` | — | No | Same behavior as **`MenuButton`**. |

Requires a React Router provider. Use a **function** **`className`** so the implementation can apply **`isActive`**-aware styles.
