# Card

**Category:** data-display
**Kind:** composite

> A filled surface block whose subject is not one figure — a form, a record, a list, a cover tile — laid out by its zones: a header with its actions, a body, a list, a cover and a footer of buttons.

## When to use
A card is a block whose subject is not one figure — a form, a record, a list, a picture. A card about one figure (a metric with its change and period) is a [Kpi](../kpi/COMPONENT.md).

- A titled block: a settings or profile form, a block of facts (`Card.Header` + `Card.Body` [+ `Card.Footer`]).
- A block about one person or object — a linked account, a session, a rental term — headed by its mark (`Card.Icon` with an `Avatar.Root`, an icon or a `ProgressCircle`) with its action in `Card.Actions`.
- A task of a record with its assignee — a rental's return, an order's delivery: the term in `Card.Title` («Вернуть 10 дек · через 50 дн.»), the assignee picker (a `Badge.Root` with `Badge.Avatar` in a `Dropdown.Trigger`) first in `Card.Description` and the facts after it, the actions in `Card.Actions`. One secondary action is a labelled `soft` button beside the primary; two or more gather behind one `action.more` button, the destructive one last. The person is named once — never in the text and again in the picker.
- Several records of one kind inside one card — the deposits of a rental, the payments of an invoice: `Card.List` of record rows (`Card.ListItem` with `Card.Title` — a state badge and the amount — one `Card.Description` line and `Card.Actions` at its end), hairlines between them; an action that needs a form (a return with a hold) folds a `Card.ListItemContent` open under its row with a `Card.Footer` of its buttons. Never a card per record in a stack.
- A record with line items and a total: the items in `Card.Body`, a `Card.Footer divider="fill"` with the action, the next task (`Card.Description`) and `Card.Total`.
- A tile with a picture on top — a campaign, a catalogue unit: `Card.Media` first (a `Carousel` of the record's photos, its status and plate as overlays), the title under it, the term at the bottom, the whole card opening the record (`Card.Link`).
- A tile that is itself the way to its details — a project, a report (`asChild` with a link or a button).

## When not to use
- One figure and what it means — a KPI tile, a record's fact in a drawer, a figure with its trend or progress → [Kpi](../kpi/COMPONENT.md), never a card laid out by hand.
- A whole page region with a title and description → [Page](../../layout/page/COMPONENT.md) sections (`Page.Section`); do not wrap every section in a card.
- Tabular data → use [DataTable](../data-table/COMPONENT.md) (it has its own fill).
- A message about the page state → [Banner](../banner/COMPONENT.md); nothing to show yet → [EmptyPage](../empty-page/COMPONENT.md).
- Content that floats over the page → [Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md) or [Drawer](../drawer/COMPONENT.md).

## Import
```tsx
import { Card } from "prime-ui-kit";
```

## Anatomy
```
Card.Root                         zones, in this order, each optional:
  Card.Media                      first: the cover picture (the zones under it draw no lines)
  Card.Header                     Card.Icon? · Card.Title · Card.Description? · Card.Actions?
  Card.Body                       fields, a chart, a DescriptionList
  Card.Media                      after the header or the body: an edge-to-edge chart
  Card.List                       Card.ListItem …
    record row                    Card.Icon? · Card.Title · Card.Description · Card.Actions?
                                  · Card.ListItemContent open (…, Card.Footer)
  Card.Footer                     buttons · Card.Description? (a note) · Card.Total?
Card.Root                         no zone: the content (a chat, a list) edge to edge
Card.Title > Card.Link            a stretched link: the card opens from anywhere, its own buttons stay
Card.Root asChild                 <a> or <button> (the only child) holding the parts
```

Buttons stand in two places only: `Card.Actions` at the end of the header (or of a record row), and `Card.Footer`, the bottom row.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Card.Root
`ref` → `HTMLDivElement` (the `asChild` element). A surface one layer up, no border, a size container. Laid out by its zones: zones under faint lines; a cover when `Card.Media` leads; no zone — the content edge to edge.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | The card's tier: its padding (`--prime-card-padding-s` 16 at `xs` · `s`, `-m` 20, `-l` 24 at `l` · `xl`) and the tier of the controls inside; the type roles stay. |
| `flat` | `boolean` | `false` | No raised shadow: a flat tile for dense grids. |
| `asChild` | `boolean` | `false` | The whole card is one link or button: pass that element as the only child with the parts inside it; it gets hover, press and the focus ring, a link draws the arrow. No interactive inside: see `Card.Link`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` + `aria-labelledby` for a landmark block, and the other div attributes. |

### Card.Header
`ref` → `HTMLDivElement`. The top zone: an optional `Card.Icon`, `Card.Title` with an optional `Card.Description` under it, `Card.Actions` at the end. Wraps below 22rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Icon
`ref` → `HTMLDivElement`. The mark leading `Card.Header` or a record row: a 40px accent tile of one icon. An `Avatar.Root` or `Thumbnail.Root` inside is the record's picture (no tile, `aria-hidden`); a `ProgressCircle` its state ring (no tile, its own name).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Title
`ref` → `HTMLHeadingElement`. The card heading (`<h3>`, title-s). A `Badge.Root` inside stands beside the text, 8 apart, centred on its line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level that fits the page outline; the look does not change. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Description
`ref` → `HTMLDivElement`. Secondary text (body-s): under the title, badges inside (a picker too) in a wrapping row; in `Card.Footer` it is the note: a `Badge.Dot` first, the text cut to one line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Actions
`ref` → `HTMLDivElement`. The end of `Card.Header` or of a record row: buttons, a switch, a period switch or a quiet caption, 8 apart, centred on the text. Below 22rem it drops under the text; icon buttons only stay beside it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Body
`ref` → `HTMLDivElement`. The padded content zone (gap 16): fields, a chart, a `DescriptionList`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `divider` | `"full"` | — | A line above the zone that runs edge to edge, in the `Divider` ink (`border-subtle`) so it reads in both themes (without it: the faint inset zone line). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Media
`ref` → `HTMLDivElement`. A picture or a chart, edge to edge: first in the card it is the 128–192px cover on top and the zones under it draw no lines; under the header or the body it is a chart. A chart SVG needs a CSS height.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.List · Card.ListItem
`ref` → `HTMLUListElement` / `HTMLLIElement`. A `<ul>` of `<li>` rows, faint hairlines between them. A row with `Card.Title` is a record row laid out like `Card.Header`: `Card.Icon`, the title over its description, `Card.Actions` at the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.ListItemContent
`ref` → `HTMLDivElement`. The zone under its `Card.ListItem` (any row) that folds open in place, rendered from anywhere inside the row; a `Card.Footer` holds its buttons at the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — (required) | Unfolds the zone (height and fade, reduced motion honoured); closed, it folds away. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Card.Footer
`ref` → `HTMLDivElement`. The bottom row of buttons: at the end, under a faint hairline after zones. A record's row: the actions, the note (`Card.Description`), `Card.Total` at the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `divider` | `"full" \| "fill"` | — | How the zone stands off the one above: `full` — a line edge to edge in the `Divider` ink; `fill` — no line, the zone on the next layer, its actions from the start (a record's footer). Without it: the faint zone line. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Total
`ref` → `HTMLDivElement`. The total of a record at the end of `Card.Footer`: the amount (title-m, tabular) with its state above it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | The total's state above the amount («к оплате 21 000 ₽», «оплачено»): body-s, muted. |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | — | The ink of the `label` by meaning (an amount due is `warning`, paid `success`). |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the amount), `className` and the other div attributes. |

### Card.Link
`ref` → `HTMLAnchorElement`. The stretched link around the title: a click anywhere on the card opens it, it is the one tab stop, the card's own buttons stay above it. The card draws the arrow: at the end of `Card.Header`, centred on it, or in the top corner.

| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | Render the single child element instead of the `<a>`: a router `Link`, or a `<button>` when the record opens in place (a window). |
| `…rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | `href`, `className` and the other attributes of the link. |

## Variants

### layout (from the zones)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| zoned | no root padding; `Header` a padded zone, `Body` / `List` under faint inset hairlines, `Media` edge to edge, `Footer` buttons at the end under a hairline | any titled block: forms, charts, facts, lists | yes, with any zone |
| cover | `Card.Media` first: a 128–192px picture on top, the zones under it a card gap apart with no lines, the footer at the bottom | a tile with a picture: a campaign, a catalogue unit | |
| bare | no zone: the content edge to edge, no padding | content that pads itself: a chat, a conversation list, a form of its own | |

### divider (Body · Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | the zone's top line runs edge to edge in the `Divider` ink (`border-subtle`), so it reads in both themes; the zone lines stay faint | a zone line wider than the card padding | |
| `fill` (Footer) | no line: the footer is a zone on the next layer of the ladder (`data-depth`, `--prime-color-layer-current`), out to the card's edges and its bottom radius, the card padding on every side, its actions from the start | the footer of a record or an invoice: its action, task and total | |

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | padding 16 (`--prime-card-padding-s`), the controls inside at the tier | dense tiles: a catalogue grid, a narrow drawer | |
| `m` | padding 20 (`--prime-card-padding-m`) | most cards | yes (or the host tier) |
| `l` · `xl` | padding 24 (`--prime-card-padding-l`) | a roomy settings or a lone summary card | |

The type roles stay at every tier: the cards of one screen share one type scale (title-s, body-s), and the tier is the card's density, not its voice. Without its own `size` and a sized host a card gives no tier to its parts, so a Badge inside keeps its standalone `m`; with one, a Badge follows the pairing rule (one step down).

### tone (Total)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| — | the `label` muted | a total with no judgement | yes |
| `neutral` | the primary ink | a state in plain words | |
| `success` | `success-text` | paid | |
| `warning` | `warning-text` | an amount due | |
| `danger` | `danger-text` | overdue | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `flat` | same fill, no shadow | dense grids of tiles | `false` |
| `asChild` | the card is the link or button it wraps: lifts on hover (raised → overlay shadow), presses, focus ring | the whole tile opens its details | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| layout | the zones in the root | `data-layout` (`zoned`, `cover`, `bare`) |
| flat | `flat` | `data-flat` |
| depth | nesting: one above the nearest surface (the page and the AppShell panel are 0) | `data-depth` (`1`–`4`, `floating-1`/`floating-2` inside a floating layer); the fill is `--prime-color-layer-current`, the shadow only at depth 1; a `divider="fill"` footer takes the next depth the same way |
| link arrow | `Card.Link` or `asChild` with a link | the kit's arrow, `aria-hidden`: the last child of `Card.Header` (at its end, centred on its height), or in the top corner of a card without a header; none on a cover |
| card width | container queries | a record footer puts its note on its own line below 30rem; `Card.Actions` drops under the text below 22rem (its buttons and links share the width, an icon-only button keeps its square; actions of icon buttons only stay beside the text) |
| hover | `asChild`, a fine pointer | the fill stays (a whole surface never changes its fill, foundation §8); the shadow lifts to `--prime-shadow-overlay` over `fast` |
| press | `asChild`, `:active` | the edges give in by `--prime-motion-press-distance` at any card size (the kit press) over `fast`; reduced motion keeps it still |
| focus | `asChild`, `:focus-visible` | the focus ring outside the card |

Without `asChild` a card is static: no hover, focus or press of its own. With it: `data-interactive` on the element.

## Layout & spacing
- Cards on a page: one `Page.Grid` with a `Page.Cell span` per card (16 on both axes, the cards of a row share one height); a grid inside one block is the block's own intrinsic `auto-fill` grid on the tile width of the layout tokens (a lone card keeps its column width), gap `--prime-space-4`.
- The zones go straight in `Card.Root`, in order: the card reads its layout from them. Radius `--prime-card-radius`, no border. The `Header` is a padded zone with a faint inset hairline below; a header with no `Body` or `List` under it (alone, or right before the `Footer`) has its bottom padding equal to its top (16).
- Padding `--prime-card-padding-m` (20); a `Body` that opens the card (no `Header` or `Media` above) has it on all four sides, and so does a `Footer` under a hairline — a zone of its own, its buttons and total in its middle; `Body` gap `--prime-card-gap` (16); fields inside `Body` 20 apart, one ladder step off the card.
- Content with no zone (a `Chat.Root`, a `ChatList.Root`) stands edge to edge and pads itself.
- Depth comes from nesting (foundation §4): on the page — the AppShell panel is the page — a card is layer 1 (white in light) with the raised whisper; inside another card it is the next layer, a flat tile. The ladder stops at layer 4.
- In a `Header` the title takes the free width; `Card.Actions` stands at the end — its buttons, a switch, a period switch or a quiet caption, 8 apart, centred on each other. A `Card.Description` stacks under the title, 4 apart; the actions stay at the end, centred on both lines.
- A `Card.Icon` in a `Header` leads the row, 12 before the title, centred on the title and the description: the accent tile, or the record's picture — an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, also from your own wrapper component, with no tile; it takes 40 px whatever size it was given — for a card about one person or object (a linked account, a contact). A `ProgressCircle` in it is the record's state ring (the term of a rental): no tile, 40 px like a picture (a ring `m`, whatever size it was given), and it keeps its name for assistive tech.
- A record's footer: `Card.Total` at the end of the row holds the amount (title-m, tabular) with its `label` above it in a `tone` («к оплате 21 000 ₽», «оплачено»), both aligned to the end; a `Card.Description` is the note between the actions and the total — a `Badge.Dot` first, the text cut to one line; below 30rem of the card's width the note takes its own line above the actions and the total. `divider="fill"` sets the footer on its own fill instead of a line. Line items with amounts above it are a `DescriptionList align="end"` in a `Card.Body`. The actions lead from the start with or without a total, so the first payment never moves them.
- The transition arrow of a card that opens stands at the end of its `Card.Header`, centred on the header's height (a two-line head with a picture or a ring included); the title keeps clear of it. Without a header it stands in the top corner, and the card hands its room to the content through `--corner-mark-room` (the title of a `Kpi` keeps clear of the arrow). A control inside a card that opens — a button, a Sparkline's plot (a slider) — stands above the stretched `Card.Link` and takes its own press. A cover draws no arrow: the picture is the cue, and in the corner the arrow would sit under the media.
- A catalogue tile (a cover): `Card.Media` holds the record's `Carousel` (its status and plate as `Carousel.Overlay` badges), `Card.Header` the title and a one-line `Card.Description`, a `Card.Body` a `Badge.Group` of the record's other badges, `Card.Footer` its term — a line of text and a thin `ProgressBar`. The footer keeps to the bottom, so in a grid row every footer lines up whether a card has badges or not.
- A narrow card (a phone): `Card.Actions` drops onto its own row under the text below 22rem and runs from the text column to the end edge: its buttons and links share the whole content width, an icon-only button keeps its square, and a Switch, a caption or a badge keeps its own size at the start. Actions of icon buttons only (an edit pencil) never drop: they stay beside the text.
- Badges under the title of a record (its state, its deposit) go straight into the header's `Card.Description` — `Badge.Root` children or a `Badge.Group`, rendered by the kit or by your own component (an owner picker): the description sees a badge in its markup (`data-badge`), so they stand in a wrapping row, 8 apart, centred with any text beside them. The description is a `<div>`, so a `Badge.Group` inside it is valid markup.
- A `Badge.Root` straight in a `Card.Title` («[У нас] 300 $») stands before or after the text on its line, centred on it, 8 apart (the gap of `Badge.Group`), at its own chip size; the text wraps in its own box. No space or wrapper of yours.
- `Card.Link` is an `<a>` with `href`; a record that opens in place (a window, a drawer) takes `asChild` with a `<button>` — it stretches over the card the same way, with the same arrow and focus ring.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | A card with `asChild` is one stop: focus lands on the whole link or button. |
| `Enter` · `Space` | Opens the link (`Enter`) or presses the button (`Enter`, `Space`) of a card with `asChild`. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- With `asChild` the card is the link or button itself; its name is the text of its parts. Nothing interactive may sit inside it — put row actions next to the card instead.
- `Card.Link` is the card's one tab stop: an `<a>` named by the title, or, through `asChild`, a `<button>` (the record opens in a window) with the same name; the arrow is `aria-hidden`.
- `Card.Root` is a plain `<div>`; give it `role="region"` + `aria-labelledby` only when it is a landmark-worthy block.
- `Card.Title` renders `<h3>`; directly under the page title pass `as="h2"`.
- Decorative icons in `Card.Icon` and cover images in `Card.Media` get `aria-hidden`; controls in `Card.Actions` need their own names.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A company settings form on a card: a header, fields on the surface fill and the submit button in the footer — `Card.Header`, `Card.Body`, `Card.Footer`. |
| [sizes.tsx](examples/sizes.tsx) | A record card at every tier: the padding steps 16 · 20 · 24 and the button inside takes the tier, the text keeps its roles — `size`. |
| [structure.tsx](examples/structure.tsx) | Which zones a card has and where its buttons go: a header with its actions, a body, a footer row of buttons, a list and a cover picture on top — `Card.Header`, `Card.Actions`, `Card.Body`, `Card.Footer`, `Card.List`, `Card.Media`. |
| [marks.tsx](examples/marks.tsx) | Cards about one object in one two-line shape: its mark leads the header — a person's avatar, an icon tile, a term ring — its name stands over one secondary line and its action sits at the end — `Card.Icon`, `Avatar.Root`, `ProgressCircle`, `Card.Actions`. |
| [actions.tsx](examples/actions.tsx) | Tasks of a rental with their assignee: the picker leads the line under the title, the actions stand at the end of the header — one secondary action as a labelled button beside the primary, or several gathered in one menu with the destructive one last — `Card.Actions`, `Card.Description`, `Badge.Avatar`, `action.more`. |
| [link.tsx](examples/link.tsx) | Cards that open: a transport card that opens its record from anywhere and keeps its own button under a full-width line, a deposit card that opens its window in place, and a project tile that is itself the link — `Card.Link`, `asChild`, `Card.Footer`, `divider`. |
| [record-totals.tsx](examples/record-totals.tsx) | A rental unit of a deal: its term ring leads the header beside the arrow, its state and deposit badges stand under the title, the line items with their amounts sit under a full-width line, and the footer on its own fill holds the action, the next task and the total with its state at the end — `Card.Icon`, `Card.Link`, `divider`, `Card.Description`, `Card.Total`, `label`, `tone`. |
| [record-rows.tsx](examples/record-rows.tsx) | The deposits of a rental in one card: a row per deposit with its state badge and amount over one line of detail, the step's action and an edit button in its actions, and a return with a hold folding open under its row — `Card.List`, `Card.ListItem`, `Card.Actions`, `Card.ListItemContent`. |
| [catalogue.tsx](examples/catalogue.tsx) | A fleet catalogue: each unit's photos are the cover, its status and plate stand on them, the model and the place sit under them, the other badges wrap, and the term with its bar keeps to the bottom of the card, which opens the unit as a whole, at the dense tier — `Card.Media`, `size`, `Card.Header`, `Card.Link`, `Card.Footer`. |
| [flat.tsx](examples/flat.tsx) | A flat tile without the raised shadow next to the default one, for dense grids — `flat`. |
| [narrow.tsx](examples/narrow.tsx) | The card is a size container: below 22rem its header actions drop under the text and share the width, below 30rem the footer's note takes its own line above the total — `Card.Actions`, `Card.Total`. |
| [screen.tsx](examples/screen.tsx) | A dashboard: the title with a line of data, the period switch and the report in the page's top bar; one grid of KPI tiles that cross-fade to the new period, a revenue trend, invoiced against paid beside two panels, and the latest payments with a link to the list — `Page.TopBar`, `Page.Grid`. |

## Mistakes
- A `<div>` with a border styled as a card → use `Card.Root`; depth comes from fill, not lines.
- Wrapping every page section in a card → use `Page.Section`.
- A KPI laid out by hand in a card (a label, a big number, a change in your own spans) → `Kpi.Root`.
- Buttons, a switch or a caption straight in `Card.Header` after the title → wrap them in `Card.Actions`.
- Buttons scattered in `Card.Body` → the card's actions live in `Card.Actions` (at the top) or `Card.Footer` (at the bottom).
- Custom padding on `Card.Root` → padding belongs to `Header` / `Body` / `Footer`.
- Zones wrapped in your own `<div>` inside the root → the zones go straight in `Card.Root`: it reads its layout from them.
- An avatar, a name and a handle hand-laid in `Card.Body` with a button beside them → `Card.Header` with `Card.Icon` (the `Avatar.Root`), `Card.Title`, `Card.Description` and `Card.Actions`.
- A chart SVG with only a `viewBox` → give it a CSS height.
- A trend with its total in a card of your own → a `Kpi` with the `Sparkline` in `Kpi.Media`; a chart with a legend and states → `ChartFrame`.
- A clickable `<div>` card with `onClick` → `asChild` with a real `<a href>` (Cmd-click, a new tab) or a `<button>`.
- Buttons or links inside an `asChild` card → nested interactive elements; use `Card.Link` instead.
- Your own bottom padding on a `Card.Header` with nothing under it → the kit pads a lone header, and one right before the `Footer`, as at its top.
- A `?modal=…` link to open a window from a card → `Card.Link asChild` with a `<button>`.
- A hand-laid grid of action, task and total in `Card.Footer` → the Button, a `Card.Description` (with a `Badge.Dot`) and a `Card.Total` straight in the footer.
- A total's state and amount in your own spans → `Card.Total label tone`.
- Badges in the header's `Card.Description` spaced by hand or wrapped in your own row → the badges straight in the description.
- A space or a flex wrapper of your own between a Badge and the text in a `Card.Title` → the Badge straight beside the text: the kit sets the gap.
- A footer painted with your own background → `Card.Footer divider="fill"`.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (`Badge.Dot` of a footer note), `Icon` (the transition arrow), `internal/rowLink` (the stretched link), `internal/mediaSlot` (a record's Avatar, Thumbnail or ProgressCircle in `Card.Icon`), `internal/Disclosure` (the folding row zone), `internal/parts` (the dot of a footer note)
- **See also:** [Kpi](../kpi/COMPONENT.md) (a card about one figure), [Page](../../layout/page/COMPONENT.md), [DescriptionList](../description-list/COMPONENT.md) (record details inside a `Card.Body`), [Fieldset](../fieldset/COMPONENT.md) (groups of fields inside a settings card), [DataTable](../data-table/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [ChartFrame](../chart-frame/COMPONENT.md) (a full chart with legend and states)
