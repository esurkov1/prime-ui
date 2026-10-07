# PageContent

**Category:** layout
**Kind:** layout

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
├─ PageContent.Header                      heading column + actions in one wrapping row
│  ├─ PageContent.Title                    <h1>, heading-m
│  ├─ PageContent.Description              <p>, secondary body-m
│  └─ PageContent.Actions                  page buttons (moved to the end of the header row)
└─ PageContent.Body                        page content, blocks 40 apart
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### PageContent.Root
`forwardRef` → `HTMLDivElement`. The page column inside `main`: header → body 32 apart, centred under its cap.

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxWidth` | `"full" \| "readable" \| "wide"` | `"full"` | Cap of the column: the whole main, `--prime-layout-content-max-width`, or a ~65ch reading measure. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Header, Body), `className` and the other div attributes. |

### PageContent.Section
`forwardRef` → `HTMLElement`. The same column as a `<section>`, without a cap; name it with `aria-labelledby` → the Title `id`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `aria-labelledby`, `className` and the other section attributes. |

### PageContent.Header
No ref. Heading column and page actions in one wrapping row; `PageContent.Actions` children move to the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Title, Description, Actions), `className` and the other div attributes. |

### PageContent.Title
`forwardRef` → `HTMLHeadingElement`. The page `<h1>` in heading-m.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children`, `id`, `className` and the other heading attributes. |

### PageContent.Description
`forwardRef` → `HTMLParagraphElement`. Intro `<p>` in secondary body-m.

| Prop | Type | Default | Description |
|---|---|---|---|
| `measure` | `"readable" \| "full"` | `"readable"` | `readable` — max ~65ch; `full` — the full width of the parent. |
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### PageContent.Actions
No ref. Page-level buttons next to the title; they wrap under the heading on narrow columns.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons), `className` and the other div attributes. |

### PageContent.Body
No ref. The page content; blocks 40 apart.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

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
| `full` | Intro uses the full header width | The column is already narrow | |

One `PageContent.Title` (`<h1>`) per page; sub-sections inside Body use `title-s` / `title-m` headings (`h2`). One primary button in Actions, the rest `soft` / `ghost` neutral.

## States
| State | Driven by | DOM |
|---|---|---|
| capped column | `maxWidth` | `data-max-width="readable" \| "wide"` on Root (absent for `full`) |
| full-width intro | `measure="full"` | `data-measure="full"` on Description |
| with actions | `PageContent.Actions` child | `data-has-actions="true"` on Header |

## Layout & spacing
- No outer padding: edge gutters come from `AppShell.Main`.
- Header → Body `--prime-space-8` (32); blocks inside Body `--prime-space-10` (40); Title → Description `--prime-space-2` (8); buttons in Actions `--prime-space-2`.
- Header is a wrapping row: actions stay to the right of the title while the heading keeps half a reading measure, otherwise they wrap below it — no breakpoint needed, works from 320px.
- Title and Description wrap long words (`overflow-wrap: anywhere`).

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Title is an `<h1>`; use one per page.
- Give `PageContent.Section` an `aria-labelledby` that points at the Title `id` to name the region.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A page in the main column: title, description and page actions, then the body blocks — `PageContent.Actions`. |
| [variants.tsx](examples/variants.tsx) | The same page column at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. |
| [narrow.tsx](examples/narrow.tsx) | In a phone-width column the page actions wrap under the heading instead of squeezing it. |

## Mistakes
- Padding on `PageContent.Root` to imitate gutters → gutters come from `AppShell.Main`.
- Actions placed outside Header → put `PageContent.Actions` inside `PageContent.Header` so it aligns with the title and wraps.
- Several `PageContent.Title` on one page → one `<h1>`, sub-headings via Typography.
- Margins between blocks in Body → Body already sets the 40 gap.

## Related
- **Built from:** —
- **See also:** [AppShell](../../layout/app-shell/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Card](../card/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md)
