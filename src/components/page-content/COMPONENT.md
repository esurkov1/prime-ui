# PageContent

**Category:** layout

> Page structure inside the main column: title, description, page actions and content sections.

## When to use
- Every route rendered inside `AppShell.Main`: a page heading (`<h1>`), an intro line, page-level actions and the page body.
- A text page held to a reading measure (`PageContent.Root maxWidth="readable"`).
- A wide dashboard page capped at the content width (`maxWidth="wide"`).

## When not to use
- The app frame (navigation rail, header, scrolling main column) → use [AppShell](../../layout/app-shell/COMPONENT.md).
- A bounded block inside the page → use [Card](../card/COMPONENT.md).
- An empty / error / not-found page → use [EmptyPage](../empty-page/COMPONENT.md).
- Arbitrary headings inside content → use [Typography](../typography/COMPONENT.md).

## Import
```tsx
import { PageContent } from "prime-ui-kit";
```

## Anatomy
```
PageContent.Root | PageContent.Section     column; Root adds maxWidth, Section renders <section>
├── PageContent.Header                     heading column + actions in one wrapping row
│   ├── PageContent.Title                  <h1>, heading-m
│   ├── PageContent.Description            <p>, secondary body-m
│   └── PageContent.Actions                page buttons (moved to the end of the header row)
└── PageContent.Body                       page content, blocks 40 apart
```

## API

### PageContent.Root
`forwardRef` to `<div>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxWidth` | `"full" \| "readable" \| "wide"` | `"full"` | Max width of the column (centred with `margin-inline: auto`). |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Header, Body. |

+ native `<div>` props.

### PageContent.Section
`forwardRef` to `<section>`. Same column and rhythm as Root, without `maxWidth`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Header, Body. |

+ native `<section>` props (`HTMLAttributes<HTMLElement>`; use `aria-labelledby` pointing at the Title `id`).

### PageContent.Header
Plain function component (no ref). Children of type `PageContent.Actions` are moved after the heading column; all other children go into the heading column.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Title, Description, Actions. |

+ native `<div>` props.

### PageContent.Title
`forwardRef` to `<h1>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Page title. |

+ native `<h1>` props.

### PageContent.Description
`forwardRef` to `<p>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `measure` | `"readable" \| "full"` | `"readable"` | `readable` caps the line at the reading width; `full` uses the full width of the parent. |
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Intro text. |

+ native `<p>` props.

### PageContent.Actions
Plain function component (no ref).

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Page buttons. |

+ native `<div>` props.

### PageContent.Body
Plain function component (no ref).

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |
| `children` | `ReactNode` | — | Page content blocks. |

+ native `<div>` props.

## Variants

### maxWidth (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | Column fills the main area | App pages, tables, dashboards in a padded main | yes |
| `readable` | Column capped at `--prime-layout-reading-max-width` (~65ch), centred | Terms, articles, help pages | |
| `wide` | Column capped at `--prime-layout-content-max-width`, centred | Wide screens where content should not stretch edge to edge | |

### measure (Description)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `readable` | Intro line wraps at the reading width | Default, most pages | yes |
| `full` | Intro uses the full header width | The column is already narrow, or the intro sits next to actions | |

**Combinations** — `Root maxWidth="readable"` with the default Description measure for text pages; `Section` + `measure="full"` + `Actions` for app pages. `Description measure="full"` inside `Root maxWidth="readable"` changes nothing visible.

**Hierarchy** — one `PageContent.Title` (`<h1>`) per page; sub-sections inside Body use `title-s` / `title-m` headings (`h2`). One primary button in Actions, the rest `soft`/`ghost` neutral.

## States
Static layout. DOM: `data-max-width="readable" | "wide"` on Root (absent for `full`), `data-measure="full"` on Description (absent for `readable`), `data-has-actions="true"` on Header when it contains Actions.

## Layout & spacing
- No outer padding: edge gutters come from `AppShell.Main`.
- Header → Body `--prime-space-8` (32); blocks inside Body `--prime-space-10` (40); Title → Description `--prime-space-2` (8); buttons in Actions `--prime-space-2`.
- Header is a wrapping row (`gap: --prime-space-4` / `--prime-space-6`): actions stay to the right of the title while the heading keeps half a reading measure, otherwise wrap below it — no breakpoint needed, works from 320px.
- Title and Description wrap long words (`overflow-wrap: anywhere`).

## Accessibility
- Title is an `<h1>`; use one per page.
- Give `PageContent.Section` an `aria-labelledby` that points at the Title `id` to name the region.
- No keyboard behaviour, no `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [settings-page.tsx](examples/settings-page.tsx) | Section with title, description, actions and panel cards in Body | App pages with page-level actions |
| [readable.tsx](examples/readable.tsx) | `Root maxWidth="readable"` with reading text | Terms, articles, help pages |
| [widths.tsx](examples/widths.tsx) | `Root maxWidth` full · wide · readable side by side | Choosing the column cap |

```tsx
import { Button, PageContent } from "prime-ui-kit";

export function Example() {
  return (
    <PageContent.Section>
      <PageContent.Header>
        <PageContent.Title>Заказы</PageContent.Title>
        <PageContent.Description>Все заказы за последний месяц.</PageContent.Description>
        <PageContent.Actions>
          <Button.Root>Создать заказ</Button.Root>
        </PageContent.Actions>
      </PageContent.Header>
      <PageContent.Body>…</PageContent.Body>
    </PageContent.Section>
  );
}
```

## Mistakes
- Padding on `PageContent.Root` to imitate gutters → gutters come from `AppShell.Main`.
- Actions placed outside Header → put `PageContent.Actions` inside `PageContent.Header` so it aligns with the title and wraps.
- Several `PageContent.Title` on one page → one `<h1>`, sub-headings via Typography.
- Margins between blocks in Body → Body already sets the 40 gap.

## Related
[AppShell](../../layout/app-shell/COMPONENT.md) · [Sidebar](../../layout/sidebar/COMPONENT.md) · [Card](../card/COMPONENT.md) · [EmptyPage](../empty-page/COMPONENT.md)
