# AppShell

**Category:** layout

> The app frame: a navigation rail on the canvas and a content panel on the surface.

## When to use
- The root layout of an application: navigation column, optional sticky header, scrolling main column.
- Any page that needs the kit's responsive gutters and the surface context for cards and fields.

## When not to use
- The navigation itself → use [Sidebar](../sidebar/COMPONENT.md) inside `AppShell.Nav`.
- Page heading, actions and sections inside main → use [PageContent](../../components/page-content/COMPONENT.md).
- A temporary side panel over the page → use [Drawer](../../components/drawer/COMPONENT.md).
- A scroll region inside a page → use [ScrollContainer](../../components/scroll-container/COMPONENT.md).

## Import
```tsx
import { AppShell } from "prime-ui-kit";
```

## Anatomy
```
AppShell.Root                grid: nav column | content panel (bg-surface)
├── AppShell.Nav             navigation column on the canvas (usually Sidebar.Root)
├── AppShell.Header          sticky top bar of the panel
└── AppShell.Main            <main>, scrolls, carries the gutters
AppShell.Template            Root + Nav + Header + Main in one component
```
Every child of Root that is not `AppShell.Nav` is placed into the content panel.

## API

### AppShell.Root
`forwardRef` to `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fillViewport` | `boolean` | `false` | Shell is exactly the viewport height and only `AppShell.Main` scrolls; otherwise the document scrolls and the nav is sticky. |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | `AppShell.Nav`, `AppShell.Header`, `AppShell.Main`. |

+ native `<div>` props.

### AppShell.Nav
No ref. A `<div>` grid slot (not a landmark; Sidebar renders the `<nav>`). + native `<div>` props.

### AppShell.Header
`forwardRef` to `<header>`. A flex row (gap 12) for breadcrumbs, search and actions. + native `HTMLAttributes<HTMLElement>`.

### AppShell.Main
`forwardRef` to `<main>` (a vertical ScrollContainer with `overscroll-behavior: contain`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `contentWidth` | `"contained" \| "full"` | `"full"` | `full`: whole panel with gutters; `contained`: centred column up to `--prime-layout-content-max-width`. |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Page content. |

+ native `HTMLAttributes<HTMLElement>`.

### AppShell.Template
`forwardRef` to the `<main>` element. Renders Root, Nav (when `nav` is set), Header (when `header` is set) and Main. Inside a react-router tree it scrolls main to the top on every route change.

| Prop | Type | Default | Description |
|---|---|---|---|
| `nav` | `ReactNode` | — | Navigation column content; without it the panel takes the full width. |
| `header` | `ReactNode` | — | Header content; no header row when omitted. |
| `mainProps` | `Omit<AppShellMainProps, "children">` | — | Props for Main (e.g. `contentWidth`). |
| `fillViewport` | `boolean` | `false` | Passed to Root. |
| `children` | `ReactNode` | — | Page content inside Main. |

+ other Root props (native `<div>` props on Root).

## Variants

### fillViewport (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Shell at least viewport high; the document scrolls; nav sticks to the top | Content sites, simple apps | yes |
| `true` | Shell exactly viewport high; only Main scrolls; header and nav stay put | Dense apps with a fixed frame | |

### contentWidth (Main)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | Content spans the panel with responsive gutters | Tables, dashboards | yes |
| `contained` | Centred column up to the content max width | Long-read pages | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| with `AppShell.Nav` | Two columns: canvas rail + surface panel | Apps with navigation | |
| without Nav | Panel takes the full width | Single-page tools, auth screens | |
| with `AppShell.Header` | Sticky bar at the top of the panel | Breadcrumbs, page actions, mobile menu button | |

**Combinations** — `AppShell.Template` with `nav={<Sidebar.Root …/>}` and `PageContent` inside is the standard app. `contentWidth="contained"` + `PageContent.Root maxWidth="readable"` for docs/articles.

## States
Static layout. DOM: `data-fill-viewport="true"` on Root (only when set), `data-content-width` on Main.

## Layout & spacing
- Two full-height planes edge to edge: no inset, radius, shadow or border — the boundary is the fill change (canvas → surface).
- Gutters in Main and Header: `--prime-layout-gutter-s` (16) → `-m` (24) from 640px → `-l` (32) from 1024px. Main top padding `--prime-space-6` (24) → `--prime-space-10` (40) from 1024px; bottom `--prime-space-16`.
- Header: min height = control m + 2 × `--prime-space-3`, padding-block `--prime-space-3`, `z-index: --prime-z-sticky`.
- The panel is a surface context: fields use the surface field fill, Cards inside become sunken tiles without shadow.

## Accessibility
- Main is the `<main>` landmark and Header is `<header>`; the navigation landmark comes from Sidebar (`<nav>`).
- Give the page one `<h1>` (PageContent.Title).
- No keyboard behaviour, no `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [with-sidebar.tsx](examples/with-sidebar.tsx) | Sidebar in Nav, breadcrumbs in Header, page with action and metric card in Main, `fillViewport` | Root layout of an app |
| [contained.tsx](examples/contained.tsx) | No Nav, `Main contentWidth="contained"` with a readable page | Docs, articles, long-read pages |

```tsx
import { AppShell, PageContent, Sidebar } from "prime-ui-kit";

export function Example() {
  return (
    <AppShell.Template
      fillViewport
      nav={
        <Sidebar.Root>
          <Sidebar.Content>
            <Sidebar.Item active>Обзор</Sidebar.Item>
          </Sidebar.Content>
        </Sidebar.Root>
      }
    >
      <PageContent.Section>
        <PageContent.Header>
          <PageContent.Title>Обзор</PageContent.Title>
        </PageContent.Header>
      </PageContent.Section>
    </AppShell.Template>
  );
}
```

## Mistakes
- Adding padding around the page content → Main already has the gutters.
- Wrapping Main content in another scroll container → Main scrolls (with `fillViewport`) or the document does.
- A border or shadow between nav and panel → the fill change is the boundary.
- Putting the Sidebar directly in Root without `AppShell.Nav` → it lands inside the content panel.

## Related
[Sidebar](../sidebar/COMPONENT.md) · [PageContent](../../components/page-content/COMPONENT.md) · [ScrollContainer](../../components/scroll-container/COMPONENT.md) · [Breadcrumb](../../components/breadcrumb/COMPONENT.md)
