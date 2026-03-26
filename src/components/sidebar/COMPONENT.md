# Sidebar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Compound side navigation: `Sidebar.Root` provides context and an `aside` shell; optional `Sidebar.ContextBar` for a second column in `variant="double"`; `Sidebar.NavPanel` holds header, scrollable content, and optional footer with menus, groups, doc-style blocks, and `PanelSwitch` keyed by `activeSection`.

**When to use**

- App shells with persistent vertical navigation: product areas, settings, admin, support tools.
- Two-level IA: icon or compact rail (`ContextBar`) plus a detail panel (`NavPanel`) driven by `activeSection` and `PanelSwitch`.
- Responsive layouts where the panel collapses to an overlay below `64rem` with a floating reopen control.
- SPA routes: combine `MenuRouterLink` with `useSidebarNavTo` to prefix panel paths by the active section in `double` mode.

**When not to use**

- Primary navigation that fits a single horizontal bar without a persistent column — consider top nav or a drawer.
- Deep trees that need virtualized lists or drag-and-drop reordering — compose with dedicated tree or data components.
- When React Router is unavailable and you need `MenuRouterLink` — use `MenuLink` / `MenuButton` instead.

## Composition

- **`Sidebar.Root`** — required wrapper: `aside`, `aria-label`, `data-*` for `size`, `variant`, `open`, `responsive`, optional `panelWidth` / `sidebarSlot`. Renders a focusable backdrop and optional floating toggle when `responsive` and the panel is closed on a narrow viewport.
- **`Sidebar.ContextBar`** — optional; meaningful for **`variant="double"`**. With **`items`**, builds a `nav` with tooltips and optional `logo` / `footer` slots; without **`items`**, **`children`** fill the `nav`. When **`items`** is non-empty and no section is active yet, the first item is auto-selected.
- **`Sidebar.NavPanel`** — main column (`nav`); forwards **`onMouseLeave`** and calls context **`onNavPanelMouseLeave`** (closes edge-hover overlay when applicable).
- Typical **`NavPanel`** order: **`Header`** → **`HeaderRow`** → **`HeaderMain`** (title, identity, or `NavPanelHeading`) and **`ToggleButton`** → **`Content`** ( **`PanelSwitch`**, **`NavCategory`**, **`Group`** + **`Menu`** ) → optional **`Footer`** with **`IdentityButton`** or similar.
- **`PanelSwitch`** — renders one branch from **`sections`** or **`renderSection(activeSection)`** based on context **`activeSection`** (falls back to the first key in **`sections`** when the current key is missing).
- **`Menu`** is a **`ul`**; each row is **`MenuItem`** wrapping **`MenuButton`**, **`MenuLink`**, or **`MenuRouterLink`**; optional **`MenuIcon`**, **`MenuLabel`**, **`MenuTrailing`**, compact **`MenuAction`**.

### Minimal example

```tsx
import { Sidebar } from "prime-ui-kit";

export function Example() {
  return (
    <Sidebar.Root aria-label="Application" defaultOpen>
      <Sidebar.NavPanel>
        <Sidebar.Header>
          <Sidebar.HeaderRow>
            <Sidebar.HeaderMain>
              <Sidebar.Text>App</Sidebar.Text>
            </Sidebar.HeaderMain>
            <Sidebar.ToggleButton />
          </Sidebar.HeaderRow>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton type="button">
                <Sidebar.MenuLabel>Home</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Content>
      </Sidebar.NavPanel>
    </Sidebar.Root>
  );
}
```

## Rules

- **`variant`**: controlled via **`variant`** / **`onVariantChange`** or uncontrolled via **`defaultVariant`** (`"double"` by default). **`simple`** hides the context rail styling context (`data-collapsed` on root).
- **`activeSection`**: string or uncontrolled **`defaultActiveSection`**; updates notify **`onActiveSectionChange` only when the new value is non-null** — clearing to `null` internally does not call the callback.
- **`open`**: controlled or uncontrolled; **`defaultOpen`** defaults to **`true`**, but on the first render with **`responsive={true}`** and a viewport already under **`max-width: 64rem`**, the initial open state is **`false`** until the media query effect runs; crossing the breakpoint toggles open to match desktop vs overlay behavior.
- When **`responsive={true}`** and the overlay is open, the backdrop is focusable with a fixed Russian **`aria-label`** (“Закрыть сайдбар”); **`ToggleButton`** and the floating control use Russian default open/closed labels (overridable via **`openLabel`** / **`closedLabel`** on **`ToggleButton`** only for that component).
- **`edgeHoverOpen`** (default **`true`**): on narrow + responsive + closed panel, if the device matches **`(hover: hover) and (pointer: fine)`**, moving the pointer within **`12px`** of the left viewport edge opens the panel; leaving **`NavPanel`** then closes it. With controlled **`open`**, wire **`onOpenChange`** so the parent stays in sync.
- **`useSidebarContext`** must run under **`Sidebar.Root`**; use **`toggleOpen`** / **`setOpen`** from **`ToggleButton`** or custom controls consistently with controlled **`open`**.
- **`MenuRouterLink`** requires a React Router provider; it forwards **`NavLink`** props (`to`, `end`, `className` as function or string, etc.).
- **`useSidebarNavTo(pathWithinSection)`** trims slashes; with **`variant="double"`** and a non-empty **`activeSection`**, returns `/${activeSection}` or `/${activeSection}/${inner}`; otherwise `/${inner}` or **`"/"`** for empty paths.
- **`ContextItemButton`** / **`MenuButton`** with **`asChild`**: pass a single child element; **`disabled`** sets **`aria-disabled`** on the slotted element and blocks clicks.
- Put meaningful text or **`aria-label`** on **`IdentityButton`** and context items; with **`items`**, each entry uses **`ariaLabel ?? label`** on the button. Prefer **`aria-hidden`** on purely decorative **`MenuIcon`** / **`MenuTrailing`** when **`MenuLabel`** carries the name.
- Responsive width uses **`window.matchMedia("(max-width: 64rem)")`**, not container width.

## API

### Sidebar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Scale for controls and column widths. |
| variant | `"simple" \| "double"` | — | No | Controlled column mode. |
| defaultVariant | `"simple" \| "double"` | `"double"` | No | Initial variant when uncontrolled. |
| onVariantChange | `(variant: "simple" \| "double") => void` | — | No | Variant change callback. |
| activeSection | `string` | — | No | Controlled top-level section id. |
| defaultActiveSection | `string` | — | No | Initial section when uncontrolled. |
| onActiveSectionChange | `(section: string) => void` | — | No | Fired only when the section changes to a **non-null** value. |
| open | `boolean` | — | No | Controlled panel open state. |
| defaultOpen | `boolean` | `true` | No | Initial open when uncontrolled (see Rules for narrow first paint). |
| onOpenChange | `(open: boolean) => void` | — | No | Open state callback. |
| responsive | `boolean` | `true` | No | Overlay + floating toggle below `64rem` when `true`. |
| edgeHoverOpen | `boolean` | `true` | No | Edge hover reveal on narrow responsive viewports (fine pointer + hover). |
| panelWidth | `"compact"` | — | No | Narrow nav panel (`data-panel-width`). |
| sidebarSlot | `"page-nav"` | — | No | Layout slot for page shell column (`data-sidebar-slot`). |
| aria-label | `string` | `"Sidebar"` | No | Accessible name on the `aside`. |
| className | `string` | — | No | Root class. |
| children | `React.ReactNode` | — | Yes | `ContextBar`, `NavPanel`, and other parts. |
| …rest | `Omit<React.ComponentPropsWithoutRef<"aside">, "children" \| "aria-label">` | — | No | Native `aside` attributes. |

### Sidebar.ContextBar

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| items | `SidebarContextItem[]` | — | No | `id`, `label`, `icon`; optional `tooltip`, `ariaLabel`, `disabled`. |
| activeSection | `string \| null` | from context | No | Highlights the matching item. |
| onSelectSection | `(sectionId: string) => void` | context setter | No | Section selection handler. |
| logo | `React.ReactNode` | — | No | Slot above the item list. |
| footer | `React.ReactNode` | — | No | Slot below the list. |
| className | `string` | — | No | Class on the inner `nav`. |
| children | `React.ReactNode` | — | No | Custom content when `items` is omitted. |
| …rest | `React.ComponentPropsWithoutRef<"nav">` (minus the above) | — | No | Passed to `nav`; implementation sets **`aria-label="Context navigation"`** after `rest` (not overridable via props). |

### Sidebar.ContextItemButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| active | `boolean` | — | No | Sets `data-active`. |
| asChild | `boolean` | `false` | No | Merge props into the child element via `Slot`. |
| type | `React.ButtonHTMLAttributes<"button">["type"]` | `"button"` | No | Ignored when `asChild` is `true`. |
| disabled | `boolean` | — | No | Disables the button or blocks slotted clicks. |
| className | `string` | — | No | Button class. |
| children | `React.ReactNode` | — | No | Typically an icon. |
| …rest | `React.ComponentPropsWithoutRef<"button">` (minus the above) | — | No | Other button attributes. |

### Sidebar.PanelSwitch

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| sections | `Record<string, React.ReactNode>` | — | No | Map of section id → panel body; first key used if `activeSection` missing. |
| renderSection | `(activeSection: string \| null) => React.ReactNode` | — | No | If set, overrides `sections`. |
| fallback | `React.ReactNode` | `null` | No | Shown when nothing resolves. |
| className | `string` | — | No | Wrapper class. |
| children | `React.ReactNode` | — | No | Not used for switching; prefer `sections` / `renderSection`. |
| …rest | `React.ComponentPropsWithoutRef<"div">` | — | No | Wrapper `div` attributes. |

### Sidebar.Footer

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"plain" \| "inset"` | `"plain"` | No | `inset` sets `data-variant="inset"`. |
| className | `string` | — | No | Footer class. |
| children | `React.ReactNode` | — | No | Footer content. |
| …rest | `React.ComponentPropsWithoutRef<"div">` | — | No | Other `div` attributes. |

### Sidebar.IdentityButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| leading | `React.ReactNode` | — | No | Start slot (`aria-hidden` wrapper). |
| title | `React.ReactNode` | — | Yes | Primary line. |
| subtitle | `React.ReactNode` | — | No | Secondary line. |
| trailing | `React.ReactNode` | chevron icon | No | End slot; default `ChevronsUpDown` icon. |
| type | `React.ButtonHTMLAttributes<"button">["type"]` | `"button"` | No | Button type. |
| className | `string` | — | No | Button class. |
| disabled | `boolean` | — | No | Disables the button. |
| …rest | `Omit<React.ComponentPropsWithoutRef<"button">, "children">` (minus the above) | — | No | Other button props; `children` is not used. |

### Sidebar.ToggleButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| openLabel | `string` | `"Скрыть сайдбар"` | No | `aria-label` when open. |
| closedLabel | `string` | `"Открыть сайдбар"` | No | `aria-label` when closed. |
| type | `React.ButtonHTMLAttributes<"button">["type"]` | `"button"` | No | Button type. |
| className | `string` | — | No | Button class. |
| onClick | `React.MouseEventHandler<HTMLButtonElement>` | — | No | Runs before `toggleOpen` unless `defaultPrevented`. |
| …rest | `React.ComponentPropsWithoutRef<"button">` (minus the above) | — | No | Other button attributes. |

### Sidebar.MenuButton

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| active | `boolean` | — | No | `data-active` on the menu control. |
| asChild | `boolean` | `false` | No | Slot into a child element. |
| type | `React.ButtonHTMLAttributes<"button">["type"]` | `"button"` | No | Native button type when not `asChild`. |
| disabled | `boolean` | — | No | Disables the button or slotted control. |
| className | `string` | — | No | Control class. |
| children | `React.ReactNode` | — | No | Label and adornments. |
| …rest | `React.ComponentPropsWithoutRef<"button">` (minus the above) | — | No | Other button props. |

### Sidebar.MenuLink

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| active | `boolean` | — | No | Passed through `MenuButton asChild`. |
| className | `string` | — | No | Anchor class. |
| children | `React.ReactNode` | — | No | Link content. |
| …rest | `React.ComponentPropsWithoutRef<"a">` (minus `className` where merged) | — | No | Native anchor attributes. |

### Sidebar.MenuRouterLink

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | Same as React Router `NavLink` `className` | — | No | Composed with kit `menuButton` styles via `cx`. |
| …rest | `React.ComponentPropsWithoutRef<typeof NavLink>` | — | No | e.g. `to`, `end`, `replace`, `viewTransition`. |

### Sidebar.MenuAction

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `React.ButtonHTMLAttributes<"button">["type"]` | `"button"` | No | Compact row action button. |
| className | `string` | — | No | Button class. |
| children | `React.ReactNode` | — | No | Icon or text. |
| …rest | `React.ComponentPropsWithoutRef<"button">` | — | No | Other button attributes. |

### Layout and text primitives

`Sidebar.ContextBarHeader`, `ContextBarBody`, `ContextBarFooter`, `NavPanel`, `NavPanelBody`, `NavDocTree`, `NavPanelHeading`, `NavCategory`, `NavCategoryTrigger`, `NavCategoryLabel`, `NavCategoryCount`, `NavCategoryPanel`, `Header`, `HeaderRow`, `HeaderMain`, `Content`, `Group`, `GroupLabel`, `Menu`, `MenuItem`, `MenuIcon`, `MenuLabel`, `MenuTrailing`, `Text` — thin wrappers around the native element (`div`, `nav`, `h2`, `ul`, `li`, `span`, `button` where applicable) with kit classes; accept **`className`**, **`children`**, and **`…rest`** matching that element’s props (`NavPanel` also wires **`onMouseLeave`** as described above). **`MenuIcon`**, **`MenuTrailing`**, and **`IdentityButton`** leading use **`aria-hidden`** where implemented.

### useSidebarContext()

Returns **`{ size, variant, setVariant, activeSection, setActiveSection, open, setOpen, toggleOpen, onNavPanelMouseLeave }`**. Throws if used outside **`Sidebar.Root`**.

### useSidebarNavTo(pathWithinSection: string)

Returns a **`string`** path for panel links; see Rules.

## Related

- [Tooltip](../tooltip/COMPONENT.md) — used around `ContextBar` items for labels.
- [Dropdown](../dropdown/COMPONENT.md) — often wraps `IdentityButton` for account menus.
- [Avatar](../avatar/COMPONENT.md) — typical `IdentityButton.leading` content.
- [Button](../button/COMPONENT.md) — actions outside the sidebar or in the app chrome.
