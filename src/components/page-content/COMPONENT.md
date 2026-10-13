# PageContent

**Category:** page
**Kind:** layout

> Page structure inside the main column: title, description, page actions and content sections; a page as high as the panel and the list + detail layout.

## When to use
- Every route rendered inside `AppShell.Main`: a page heading (`<h1>`), an intro line, page-level actions and the page body.
- A text page held to a reading measure (`PageContent.Root maxWidth="readable"`).
- A wide dashboard page capped at the content width (`maxWidth="wide"`).
- A page whose body takes the rest of the panel's height — a log table, a board, a chat (`fill`).
- Mail, a messenger, a ticket queue: a list and the chosen record side by side, one at a time on a narrow panel (`PageContent.Split`).

## When not to use
- The app frame (navigation rail, header, scrolling main column) → use [AppShell](../../layout/app-shell/COMPONENT.md).
- A bounded block inside the page → use [Card](../card/COMPONENT.md).
- An empty / error / not-found page → use [EmptyPage](../empty-page/COMPONENT.md).
- Arbitrary headings inside content → use [Typography](../typography/COMPONENT.md).
- Details that open over the list and close again (a record from a table) → use [Drawer](../drawer/COMPONENT.md); `Split` is for a list people work through record by record.

## Import
```tsx
import { PageContent } from "prime-ui-kit";
```

## Anatomy
```
PageContent.Root | PageContent.Section     column; Root adds maxWidth and fill, Section renders <section>
├─ PageContent.Header                      heading column + actions in one wrapping row
│  ├─ PageContent.Title                    <h1>, heading-m
│  ├─ PageContent.Description              <p>, secondary body-m
│  └─ PageContent.Actions                  page buttons (moved to the end of the header row)
└─ PageContent.Body                        page content, blocks 40 apart
   └─ PageContent.Split                    list + detail; a container (prime-split)
      ├─ PageContent.List                  list pane: 16–20rem column, or the whole split while closed
      └─ PageContent.Detail                detail pane: the rest, or the whole split while open
         └─ PageContent.BackButton         back to the list, only while one pane shows
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### PageContent.Root
`ref` → `HTMLDivElement`. The page column inside `main`: header → body 32 apart, centred under its cap.

| Prop | Type | Default | Description |
|---|---|---|---|
| `maxWidth` | `"full" \| "readable" \| "wide"` | `"full"` | Cap of the column, centred: `full` — the whole main; `readable` — the reading measure `--prime-layout-reading-max-width` (42rem); `wide` — the content width `--prime-layout-content-max-width` (75rem). |
| `fill` | `boolean` | `false` | The page takes the height of main (`AppShell.Root fillViewport`) and the body takes what the header leaves: for a full-height table, board, chat or `PageContent.Split`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Header, Body), `className` and the other div attributes. |

### PageContent.Section
`ref` → `HTMLElement`. The same column as a `<section>`, without a cap; name it with `aria-labelledby` → the Title `id`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `aria-labelledby`, `className` and the other section attributes. |

### PageContent.Header
`ref` → `HTMLDivElement`. Heading column and page actions in one wrapping row; `PageContent.Actions` children move to the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Title, Description, Actions), `className` and the other div attributes. |

### PageContent.Title
`ref` → `HTMLHeadingElement`. The page `<h1>` in heading-m.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children`, `id`, `className` and the other heading attributes. |

### PageContent.Description
`ref` → `HTMLParagraphElement`. Intro `<p>` in secondary body-m.

| Prop | Type | Default | Description |
|---|---|---|---|
| `measure` | `"readable" \| "full"` | `"readable"` | `readable` — no wider than the reading measure `--prime-layout-reading-max-width` (42rem); `full` — the full width of the parent. |
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### PageContent.Actions
`ref` → `HTMLDivElement`. Page-level buttons next to the title; they wrap under the heading on narrow columns.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons), `className` and the other div attributes. |

### PageContent.Body
`ref` → `HTMLDivElement`. The page content; blocks 40 apart.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### PageContent.Split
`ref` → `HTMLDivElement`. List + detail (mail, a messenger, a ticket queue): side by side from 48rem of its own width, one pane at a time below it, focus following the pane that comes into view.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | The detail is open (a record is chosen), controlled. On a narrow split it takes the place of the list; on a wide one both panes stay. |
| `defaultOpen` | `boolean` | `false` | Initial open state, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | `PageContent.BackButton` closes the detail (`false`); clear the chosen record there. |
| `labels` | `Partial<PageContentLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`PageContent.List`, `PageContent.Detail`), `className` and the other div attributes. |

### PageContent.List
`ref` → `HTMLDivElement`. The list pane: a column whose last child takes the free height (a Card with its own ScrollContainer). Focusable from code (`tabindex=-1`, no ring): going back lands on the control that had focus, else here.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `aria-label`, `className` and the other div attributes. |

### PageContent.Detail
`ref` → `HTMLDivElement`. The detail pane, built like the list pane; focus lands here when it opens on a narrow split. Show a hint («Выберите диалог») while nothing is chosen: a wide split always shows this pane.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `aria-label`, `className` and the other div attributes. |

### PageContent.BackButton
`ref` → `HTMLButtonElement`. Back from the detail to the list: a soft neutral icon Button (`nav.chevronLeft`) named by `labels.back`, shown only while the split shows one pane. Put it first in the detail's header; `event.preventDefault()` in `onClick` keeps the detail open.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children">` | — | `onClick`, `aria-label` (replaces `labels.back`), `className` and the other button attributes. |

## Variants

### maxWidth (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | Column fills the main area | App pages, tables, dashboards in a padded main | yes |
| `readable` | Column capped at `--prime-layout-reading-max-width` (42rem), centred | Terms, articles, help pages | |
| `wide` | Column capped at `--prime-layout-content-max-width` (75rem), centred | Wide screens where content should not stretch edge to edge | |

### measure (Description)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `readable` | Intro line wraps at the reading width | Default, most pages | yes |
| `full` | Intro uses the full header width | The column is already narrow | |

One `PageContent.Title` (`<h1>`) per page; sub-sections inside Body use `title-s` / `title-m` headings (`h2`). One primary button in Actions, the rest `soft` / `ghost` neutral.

### Flags
| Flag | Looks like when on | Use when | Default |
|---|---|---|---|
| `fill` (Root) | the page is as high as main; the body takes what the header leaves; main keeps gutter-high air under it | a full-height table, board, chat or `PageContent.Split` in an `AppShell.Root fillViewport` | `false` |

### Split layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| wide (from 48rem of the split's width) | list in a 16–20rem column, detail beside it, 24 apart; no back button | desktops, tablets in landscape | — |
| narrow (below 48rem) | one pane: the list, or the open detail with `PageContent.BackButton` | phones, a narrow panel next to an open Sidebar | — |

## States
| State | Driven by | DOM |
|---|---|---|
| capped column | `maxWidth` | `data-max-width="readable" \| "wide"` on Root (absent for `full`) |
| filling | `fill` | `data-fill="true"` on Root; `AppShell.Main` drops its long bottom air for it |
| full-width intro | `measure="full"` | `data-measure="full"` on Description |
| with actions | `PageContent.Actions` child | `data-has-actions="true"` on Header |
| detail open | `open` / `defaultOpen` on Split | `data-open="true"` on Split; narrow: the list is `display: none`, else the detail is |
| pane swap | `open` changes on a narrow split | the pane that comes into view enters once (`enterMotion.enterBase`: base, opacity + a 4 px rise); focus moves into the detail, or back to the list control; a wide split moves nothing |

## Layout & spacing
- No outer padding: edge gutters come from `AppShell.Main`.
- Header → Body `--prime-space-8` (32); blocks inside Body `--prime-space-10` (40); Title → Description `--prime-space-2` (8); buttons in Actions `--prime-space-2`; heading → Actions `--prime-space-6` (24) side by side, `--prime-space-4` (16) once they wrap below.
- Header is a wrapping row: actions stay to the right of the title while the heading keeps half a reading measure, otherwise they wrap below it — no breakpoint needed, works from 320px.
- Title and Description wrap long words (`overflow-wrap: anywhere`).
- `fill` needs a main with a height: `AppShell.Root fillViewport` (main scrolls inside the panel). The body passes its free height on to a filling child — DataTable `scrollHeight="fill"`, Crossfade `fill`, `PageContent.Split`.
- Split takes the free height of a filling page and lays itself out from its own width (container `prime-split`), never from the window: a split beside an open Sidebar may be narrow on a wide screen. Each pane is a column whose last child takes the free height — put a Card with its own `ScrollContainer` there, so the list and the thread scroll separately. The records of the list pane are a [List](../list/COMPONENT.md).
- The detail pane is on screen all the time on a wide split: while nothing is chosen it shows a short hint («Выберите диалог»), never an empty card.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` | On `PageContent.BackButton`: back from the detail to the list; focus returns to the list control that opened it. |

### ARIA
- Title is an `<h1>`; use one per page.
- Give `PageContent.Section` an `aria-labelledby` that points at the Title `id` to name the region.
- Name `PageContent.List` and `PageContent.Detail` with `aria-label`. On a narrow split opening the detail moves focus into it and going back returns focus to the list control; the hidden pane is `display: none`, out of Tab and the accessibility tree. The panes take focus from code only (`tabindex="-1"`, no ring).
- `PageContent.BackButton` is named by `labels.back` and is shown only while the split shows one pane.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `back` | `"Назад к списку"` | Name of `PageContent.BackButton` (on `PageContent.Split`). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A page in the main column: title, description and page actions, then the body blocks — `PageContent.Actions`. |
| [variants.tsx](examples/variants.tsx) | The same page column at three caps: the whole main, a wide dashboard column, a reading column — `maxWidth`. |
| [list-detail.tsx](examples/list-detail.tsx) | A support inbox as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one — `PageContent.Split`, `PageContent.BackButton`, `fill`. |
| [narrow.tsx](examples/narrow.tsx) | In a phone-width column the page actions wrap under the heading instead of squeezing it. |

## Mistakes
- Padding on `PageContent.Root` to imitate gutters → gutters come from `AppShell.Main`.
- Actions placed outside Header → put `PageContent.Actions` inside `PageContent.Header` so it aligns with the title and wraps.
- Several `PageContent.Title` on one page → one `<h1>`, sub-headings via Typography.
- Margins between blocks in Body → Body already sets the 40 gap.
- Computing a height from `100vh` minus the header for a full-height table or chat → `PageContent.Root fill` and a filling child.
- A list + detail built with window media queries → `PageContent.Split` follows its own width.
- Unmounting the detail content the moment the narrow split goes back → keep the last record until another is chosen (the pane leaves with it on screen).

## Related
- **Built from:** [Button](../button/COMPONENT.md) (`PageContent.BackButton`), Icon (`nav.chevronLeft`)
- **See also:** [AppShell](../../layout/app-shell/COMPONENT.md), [Sidebar](../../layout/sidebar/COMPONENT.md), [Card](../card/COMPONENT.md), [List](../list/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [Drawer](../drawer/COMPONENT.md)
