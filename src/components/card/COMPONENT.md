# Card

**Category:** data-display
**Kind:** composite

> A filled surface that holds one entity — a record, a plan, a setting, a listing — as a cover, a header with its mark, title, badges and actions, a body and a footer, parted by air and never by lines.

## When to use
- A record with its facts and actions — an order, a client, a contract: `Card.Header` (the mark, the title, `Card.Badges`, the state line, its actions) + `Card.Body` (label — value rows) + `Card.Footer` (`Card.Total` and the primary button).
- A catalogue tile with photos: `Card.Media` holding a `Carousel`, the status in `Card.Badges`, the price in the footer, the whole tile opening the record through `Card.Link`.
- A choice among cards — a plan, a module, an extra: `asChild` with a `<button>`, `selected`, and `Card.Indicator` at the end of the header.
- A setting: one switch is a one-line card (`Card.Icon`, `Card.Title`, a `Switch.Root` in `Card.Actions`); several are a group card with `Switch.Root fullWidth` rows in the body.
- A pane for a list that pads itself — a `List`, a `ChatList`, a `Chat` — with no zone inside: it stands edge to edge.
- A block of a form, a chart or a long list in a titled surface — the body takes it, a `ScrollContainer` holds six rows of a long list.

## When not to use
- One figure and what it means → [Kpi](../kpi/COMPONENT.md).
- A list of places to go, or records that are chosen and opened one by one with nothing else around → [List](../list/COMPONENT.md) (inside a `Card.Body` or a pane).
- A record's label — value facts alone (a drawer, a profile) → [DescriptionList](../description-list/COMPONENT.md).
- A page region with a title and description → `Page.Section` of [Page](../../layout/page/COMPONENT.md); do not wrap every section in a card.
- A card on a board that is dragged between columns → [Kanban](../kanban/COMPONENT.md) draws its own.
- Tabular data → [DataTable](../data-table/COMPONENT.md); a message about the page state → [Banner](../banner/COMPONENT.md).
- Content that floats over the page → [Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md).

## Import
```tsx
import { Card } from "prime-ui-kit";
```

## Anatomy
```
Card.Root size? selected? asChild?        the card; with no zone inside it is a pane
  Card.Media placement?                   the cover: Carousel.Root (one or more photos)
  Card.Header                             the parts take their places in any written order
    Card.Icon?                              the mark: an icon tile, Avatar.Root, Thumbnail.Root, ProgressCircle
    Card.Title (Card.Link?)                 required; one line
    Card.Badges?                            on the title's line, fold into «+N»
    Card.Description? (StatusDot?)          the line under the title
    Card.Actions? | Card.Indicator?         the end: controls, or the choice mark
  Card.Body                               label — value rows, a List, a form, switch rows, a chart
  Card.Footer
    Card.Total? | Card.Note?                the start: the amount with its state, or a note (a line, a progress bar); or an assignee picker
    Card.Actions?                           the end: up to two buttons, the accent one last
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Card.Root
`ref` → `HTMLDivElement` (the `asChild` element). A card: one entity on a surface of the depth ladder, parted by air, never by lines. Its zones (`Card.Media`, `Card.Header`, `Card.Body`, `Card.Footer`) stand a zone gap apart; with none it is a pane, content edge to edge.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Five steps of metrics: `xs` (padding 12), `s` (16), `m` (20), `l` (24), `xl` (28) with the type, the mark and the controls; in a container under 30rem (a phone) the padding is 12 · 16 · 16 · 20 · 24. |
| `selected` | `boolean` | — | The card is chosen: a 2 px accent ring, `Card.Indicator` checked. With `asChild` the element carries the state: `aria-pressed`, or `aria-checked` when it has `role="radio"` or `role="checkbox"`. |
| `asChild` | `boolean` | `false` | The whole card is one link or button (a choice card): pass that element as the only child with the parts inside it. Nothing interactive goes inside; for a card with its own controls use `Card.Link`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` + `aria-labelledby` for a landmark block, and the other div attributes. |

### Card.Media
`ref` → `HTMLDivElement`. The cover: the kit `Carousel` (one photo or several), edge to edge, in its own ratio. Only what belongs to the photo stands on it (dots, arrows, `Carousel.Overlay`); status and number go to the header.

| Prop | Type | Default | Description |
|---|---|---|---|
| `placement` | `"top" \| "start"` | `"top"` | `top` — over the zones, full width. `start` — from 30rem a column of 40% at the start, the card's full height; narrower it stands on top. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Header
`ref` → `HTMLDivElement`. The top zone. Its parts take their places whatever the order: `Card.Icon`, the title with `Card.Badges` and `Card.Description` under it, then `Card.Actions` or `Card.Indicator` at the end. Only the title is required.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Icon
`ref` → `HTMLDivElement`. The mark leading `Card.Header` (32 · 32 · 40 · 48 · 56): an accent icon tile, or a picture or ring, no tile. A step smaller beside a `Switch`; under a top cover, on its edge.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Title
`ref` → `HTMLHeadingElement`. What the card is about: one line, cut with an ellipsis. Beside `Card.Badges` it gives way first, down to its own text or 8em, before the badges fold into «+N». 13/16 · 13/16 · 14/20 · 16/24 · 18/24 by size.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4" \| "span"` | `"h3"` | The element: the heading level that fits the page outline, or `span` when the card is no heading. |
| `number` | `ReactNode` | — | The record's number after the name («#866»), muted and tabular: the name is cut, the number never is. |
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children`, `className` and the other heading attributes. |

### Card.Link
`ref` → `HTMLAnchorElement`. Inside `Card.Title`: the link that opens the record. It stretches over the whole card and is the one tab stop, while the card's own controls stay above it. On hover the card lifts and the title is underlined; there is no arrow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | Render the router's link element instead of an `<a>`. |
| `…rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | `href`, `children`, `className` and the other anchor attributes. |

### Card.Badges
`ref` → `HTMLDivElement`. A `Badge.Group` after the title, on its line: every badge of the record (status, role, counter). Badges are `xs` · `xs` · `s` · `m` · `m` by card size, as tall as the title's line; what does not fit folds into «+N».

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<BadgeGroupLabels>` | — | Built-in strings of the «+N» badge, see the `Badge.Group` labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the `Badge.Root`s), `className` and the other div attributes. |

### Card.Description
`ref` → `HTMLDivElement`. The line under the title: plain text with new data only, one line, cut with an ellipsis; 12/16 · 12/16 · 13/20 · 14/20 · 14/20. A `StatusDot` first states the record's state, and a «·» is put after it by itself.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Actions
`ref` → `HTMLDivElement`. The card's controls, the card's tier (xs · s · m · l · xl), as tall as its form fields. In the header: neutral actions (icon buttons, a ⋯ menu from three) and one picker; never an accent button. In the footer: up to two buttons, the accent one last.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fullWidth` | `boolean` | `false` | Footer only: the buttons share the footer's width. Use it when there is no start part. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Indicator
`ref` → `HTMLSpanElement`. The choice mark at the end of the header: a radio circle or a checkbox, checked while the card is `selected`. It is `aria-hidden`; the card's own element carries the state.

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"radio" \| "checkbox"` | — (required) | `radio` — one of several (inside a `role="radiogroup"`), `checkbox` — any of several. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Card.Body
`ref` → `HTMLDivElement`. The content zone; its rows are parted by air, never lines: label — value rows (`DescriptionList` with `align="end"`), a `List` of records, a form, `Switch.Root` rows with `fullWidth`, a chart, a `ScrollContainer` of a long list, an `EmptyPage`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Footer
`ref` → `HTMLDivElement`. The bottom zone, no line and no fill, kept to the bottom of a stretched card: one thing at the start (`Card.Total`, an assignee picker, `Card.Note`) and `Card.Actions` at the end. On a narrow card the buttons go under and share the width.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Total
`ref` → `HTMLDivElement`. At the start of the footer: the amount, tabular, with its state (`label`) above it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | The state of the amount («К оплате»), muted and coloured by `tone`. |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | — | The colour of `label` by meaning; the word says the meaning. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Note
`ref` → `HTMLDivElement`. At the start of the footer: one line of text (a `StatusDot` first states the state) and, with `progress`, the kit `ProgressBar` under it — a term, a quota, a delivery. It takes the free width beside the buttons; the bar is named by the note's text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `progress` | `number` | — | Draws the progress bar under the line: the value from 0 to `max`. Omit it for a note of text alone. |
| `max` | `number` | `100` | The top of the bar's scale; used with `progress`. |
| `progressTone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | — | The colour of the bar by meaning (an overdue term is `danger`); used with `progress`. |
| `children` | `ReactNode` | — | The line: a `StatusDot` first, then the text, cut with an ellipsis. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other div attributes. |

## Variants

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | padding 12, radius 12, zone gap 8; the title 13/16, the line 12/16, the mark 32, buttons `xs`, badges `xs` | a very dense grid, a narrow side panel | |
| `s` | padding 16, radius 12, zone gap 12; the title 13/16, the line 12/16, the mark 32, buttons `s`, badges `xs` | a dense grid, a side panel, a card in a drawer | |
| `m` | padding 20, radius 16, zone gap 16; the title 14/20, the line 13/20, the mark 40, buttons `m`, badges `s` | the default card of a page | the host tier, else `m` |
| `l` | padding 24, radius 16, zone gap 20; the title 16/24, the line 14/20, the mark 48, buttons `l`, badges `m` | a lead card of a screen, a roomy plan or listing | |
| `xl` | padding 28, radius 16, zone gap 24; the title 18/24, the line 14/20, the mark 56, buttons `xl`, badges `m` | a hero card, a card on a wide screen | |

The width comes from the grid, not from the size; one size per row.

### placement (Media)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `top` | the cover over the zones, full width, in the carousel's `ratio`; the zones follow a padding below it | a catalogue tile, a listing | yes |
| `start` | from 30rem of the card a column of 40% (a tile wide at most) at the start, the card's full height, the photo cropped about its middle; narrower it stands on top | a wide card with a long body, a list of listings | |

### type (Indicator)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `radio` | a radio circle at the end of the header, checked while the card is `selected` | one of several cards (inside a `role="radiogroup"`) | |
| `checkbox` | a checkbox, checked while the card is `selected` | any of several cards (extras, modules) | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` (Actions) | in the footer the buttons share the footer's width; ignored in the header | the footer has no start part | `false` |
| `asChild` (Root) | the card is the `<button>` or link it wraps: it lifts on hover and presses; with `selected` it carries `aria-pressed` / `aria-checked` | a choice card, a tile that is one link with nothing inside it | `false` |
| `asChild` (Link) | the router's link element instead of an `<a>` | `Card.Link` over a router `Link` | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| size | `size`, the host tier | `data-size` and `data-frame` on the card (the same tier) |
| selected | `selected` | `data-selected` and a 2 px accent ring inside the edge, over the cover too; `Card.Indicator` is checked; on an `asChild` element `aria-pressed`, or `aria-checked` with `role="radio"` / `role="checkbox"` |
| pane | no `Card.Media`, `Card.Header`, `Card.Body` or `Card.Footer` straight inside | `data-bare`: padding 0, the content edge to edge and clipped to the corners |
| cover | `Card.Media` | `data-cover="top" \| "start"` on the card, `data-placement` on the cover |
| opens | a `Card.Link` in the title, or `asChild` | `data-link` / `data-interactive`: the card lifts on hover (`(hover: hover)` only), the title is underlined, the focus ring is drawn on the card |
| one-line header | no `Card.Description` | `data-lines="one"` on the header: the controls share the title's centre line; a header with a description holds them at its top edge |
| row mark | a one-line header with a `Switch.Root` in `Card.Actions` | `data-mark="row"`: the mark is a step smaller (24 · 24 · 32 · 40 · 48) |
| edge mark | a `Card.Icon` in a header under a top cover | `data-edge`: the owner's avatar on the cover's edge, ringed with the card's fill |
| folded badges | `Card.Badges` that do not fit once the title has given way | the rest fold into one «+N» badge |
| narrow footer | the card is 20rem wide or less | the buttons of `Card.Actions` go under the start part and share the width |
| note | `Card.Note` | one line with a `StatusDot` first; with `progress` a `ProgressBar` under it, named by the line's text, `progressTone` colours it |
| surface | nesting | `data-depth` from the surfaces around; a card inside a card is a flat step |

## Layout & spacing
Five steps of metrics, the kit's surface frame (`internal/surfaceFrame`; the header row is `internal/headerRow`):

| | `xs` | `s` | `m` | `l` | `xl` |
|---|---|---|---|---|---|
| padding | 12 | 16 | 20 | 24 | 28 |
| radius | 12 | 12 | 16 | 16 | 16 |
| zone gap (header · body) | 8 | 12 | 16 | 20 | 24 |
| title | 13/16 | 13/16 | 14/20 | 16/24 | 18/24 |
| description | 12/16 | 12/16 | 13/20 | 14/20 | 14/20 |
| mark | 32 | 32 | 40 | 48 | 56 |
| badges | `xs` 16 | `xs` 16 | `s` 20 | `m` 24 | `m` 24 |
| controls | `xs` 28 | `s` 32 | `m` 36 | `l` 40 | `xl` 48 |
| padding, compact | 12 | 16 | 16 | 20 | 24 |

- Compact: in a container under 30rem — a page on a phone, a card it stands in — the padding steps down a tier and never below 16; the radius, the gaps, the type and the controls keep their step. The page gutter, the gap between blocks and the padding of an `m` card are then one number, 16, and the content of every card stands 32 from the screen edge. The query reads the nearest container around the card (`Page.Root`, `Page.Grid`), never the card itself.
- The card is a surface of the depth ladder: no border, no lines inside; zones are parted by air. It fills its grid cell and, in a row, cards stretch to one height while the footer keeps to the bottom.
- Nothing wraps. Every header line and every body row is one line cut with an ellipsis.
- The header gives way in this order: the title shrinks down to its floor (its own text or 8em) and the badges fold into «+N»; the title never goes below the floor. When the mark, the floor and the controls no longer fit one row, the controls drop under the title onto a line of their own, and wrap only if that line is narrower than they are. The kit does not shrink a picker or move buttons into «Ещё» by itself; a card has no `Fields` row, so its header holds one picker at the controls' tier, and a card with two pickers moves the second into `Card.Footer` (which stacks on a narrow card) or the body.
- The footer has no line and no fill; it stands off the content by the card padding (more than the zone gap). One thing at the start, up to two buttons at the end with the accent one last; `fullWidth` only when nothing stands at the start.
- A header with a description holds its controls at the top; a one-line header, or a card that is only its header, centres them on the title line.
- In `Card.Body` a `List` stands on the content edge: the body sets the public hook `--list-bleed` and the rows reach past the list's edges by their own padding, so their text lines up with the rest of the body. A list that opens or closes the body bleeds its first and last row the same way along the block axis, so the text of those rows stands on the card's padding.
- A `StatusDot` in `Card.Description` may come from your own component: the line finds it by its `data-status-dot` when it is the first element, and puts the «·» after it.
- The cover is the kit `Carousel`, edge to edge; the card's corners shape it. On the photo stand only the photo's things — dots, arrows, a video's length, a count of photos (`Carousel.Overlay`). The status and the price go to the header.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | A card with `Card.Link` is one stop on the link; a card with `asChild` is one stop on its element; otherwise the stops are the controls in `Card.Actions`. |
| `Enter` | Opens the card's link, or presses its button (`asChild`). |
| `Space` | Presses the button of a card with `asChild` (a choice card). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `Card.Title` is a heading (`h3` by default, `as` picks the level); with `Card.Link` the link inside it names the card.
- `Card.Link` stretches over the card with a pseudo-element, so the card is one link for a pointer and one tab stop for the keyboard; its focus ring is drawn on the card.
- A choice card is `Card.Root` with `asChild` and `selected` around a `<button>`: it gets `aria-pressed`, or `aria-checked` with `role="radio"` (inside a `role="radiogroup"`) or `role="checkbox"`. The `selected` ring never carries the meaning alone.
- `Card.Indicator` is `aria-hidden`: it repeats the state the element carries. A picture in `Card.Icon` is `aria-hidden` (it repeats the title), a `ProgressCircle` keeps its name.
- The «·» after a `StatusDot` in `Card.Description` is `aria-hidden`; the state is the dot's word.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Card.Badges

| Key | Default | Used for |
|---|---|---|
| `more` | `"+{count}"` | Visible text of the «+N» badge for the badges that did not fit; `{count}` — how many. |
| `moreCount` | `"Ещё {count}"` | What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A record card: the mark, the title with its badges, a status line, two icon buttons, label — value rows and the total with one accent button — `Card.Icon`, `Card.Badges`, `Card.Description`, `StatusDot`, `Card.Actions`, `Card.Total`. |
| [sizes.tsx](examples/sizes.tsx) | The same record card on the five steps: padding, radius, mark, text and the controls step together — `size`. |
| [structure.tsx](examples/structure.tsx) | The zones a card has: a header alone, a header and a body, all three with a footer, and a pane with no zone where a list stands edge to edge — `Card.Header`, `Card.Body`, `Card.Footer`. |
| [header.tsx](examples/header.tsx) | What a header holds: four marks, a record's number after its name, badges that fold into a count on a narrow card, and controls by their count — two icon buttons, a more menu from three actions, a value picker — `Card.Icon`, `number`, `Card.Badges`, `StatusDot`, `Card.Actions`, `Select.Root`. |
| [link.tsx](examples/link.tsx) | Cards that open: a link in the title stretches over the card while its own button stays its own, and a whole card is one link when nothing inside is a control — `Card.Link`, `asChild`. |
| [body.tsx](examples/body.tsx) | What the body holds: label — value rows, a list of records that open, a form on kit fields and an empty state — `DescriptionList`, `List`, `Input.Root`, `EmptyPage`. |
| [long-list.tsx](examples/long-list.tsx) | A long list in a card: the scroller shows six rows, loads the next batch near its end and holds the place of the new rows with skeleton lines — `ScrollContainer`, `onReachEnd`, `Skeleton`. |
| [footer.tsx](examples/footer.tsx) | What the footer holds: the total and two buttons with the accent one last, an assignee picker as tall as the button beside it, a note with a term's progress, and buttons that share the width with nothing at the start — `Card.Total`, `Select.Root`, `Card.Note`, `progress`, `fullWidth`. |
| [cover.tsx](examples/cover.tsx) | A cover is the kit's carousel: on top with the owner's avatar on its edge, a column at the start, and a cover that is still loading — `Card.Media`, `placement`, `ratio`, `dots`, `loading`. |
| [choice.tsx](examples/choice.tsx) | Cards that are a choice: one tariff of three in a group of pressed buttons, and any number of extras, each card a button with its mark at the end — `Card.Indicator`, `selected`, `asChild`. |
| [switch.tsx](examples/switch.tsx) | A switch in a card: one setting is a one-line card with the switch at its end, several settings are a group card with two icon buttons in the header and a switch per row — `Switch.Root`, `fullWidth`, `Card.Actions`. |
| [narrow.tsx](examples/narrow.tsx) | On a narrow card nothing wraps: the title gives way and the badges fold into a count, the footer buttons go under the total and share the width — `Card.Title`, `Card.Badges`, `Card.Footer`, `Card.Actions`. |
| [screen.tsx](examples/screen.tsx) | An orders page of cards: the title with its line of data, the status filter and the new-order button in the top bar, one grid of record cards that cross-fades when the filter changes and loads as skeleton cards of the same geometry — `Page.TopBar`, `Crossfade`, `Skeleton`, `Card.Link`. |

## Mistakes
- A badge beside a button in the header, or an accent button in the header → the header holds `Card.Badges` after the title and neutral controls; the accent button stands last in the footer.
- Badges under the title or at the right of the card → `Card.Badges`, on the title's line.
- Lines between the zones, a divider in the footer, a filled footer → air only; the zones are parted by the zone gap and the footer by the card padding.
- A hand-made photo (an `<img>`, a gradient box) as the cover → `Card.Media` with a `Carousel`, even for one photo.
- A status or a price on the photo → the status in `Card.Badges`, the price in the header or `Card.Total`; the photo carries only dots, arrows, a video's length, a count of photos.
- A pencil or buttons on a record row of a list → the row opens as a whole, its value stands at the end; edit in the opened record.
- A state badge inside the description (`Badge.Dot` beside the text) → a `StatusDot` first in `Card.Description`.
- A list drawn from ghost buttons or a stack of cards per record → a `List` in `Card.Body`.
- A switch beside the header's actions in one row, in a header with a description, or in the footer → one switch is a one-line card with the switch in `Card.Actions`; several are a group card with `Switch.Root fullWidth` rows.
- A choice card whose inside holds buttons → the card is the `<button>` (`asChild`, `selected`) with `Card.Indicator`; controls go beside it.
- A KPI laid out by hand in a card → [Kpi](../kpi/COMPONENT.md).
- A hand-made term with a bar in the footer (an own wrapper around text and `ProgressBar`) → `Card.Note` with `progress`.
- A wrapped title, description or row → shorten the text; the card keeps one line and cuts it.
- Different sizes of cards in one row → one size per row.
- Skeletons of an unlike shape while a grid loads → skeleton cards of the same geometry, cross-faded with the data (`Crossfade`).

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (`Card.Badges` is a `Badge.Group`), [Checkbox](../checkbox/COMPONENT.md) and [Radio](../radio/COMPONENT.md) (the marks of `Card.Indicator`), [StatusDot](../status-dot/COMPONENT.md) (the state in the description and in `Card.Note`), [ProgressBar](../progress-bar/COMPONENT.md) (the bar of `Card.Note`), [Switch](../switch/COMPONENT.md) (its presence in `Card.Actions` shrinks the mark), `internal/iconBox` (the icon tile), `internal/mediaSlot` (the picture or ring in `Card.Icon`), `internal/surfaceDepth` (the surface), `internal/surfaceFrame` (the metrics per step, title and description roles), `internal/headerRow` (the header row: mark, title with badges, description, controls), `internal/press` (the card that is one element), `internal/rowLink` (the stretched `Card.Link`), `internal/textRole`, `internal/textTone`
- **See also:** [Kpi](../kpi/COMPONENT.md), [Carousel](../carousel/COMPONENT.md) (the cover), [List](../list/COMPONENT.md), [DescriptionList](../description-list/COMPONENT.md), [Page](../../layout/page/COMPONENT.md) (`Page.Section`, `Page.Grid` for a row of cards), [Kanban](../kanban/COMPONENT.md)
