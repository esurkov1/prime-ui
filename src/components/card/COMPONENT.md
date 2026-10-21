# Card

**Category:** data-display
**Kind:** composite

> A filled surface block with structural templates for metrics, charts, lists, calls to action and covers.

## When to use
- KPI tiles on a dashboard (`mini`, `stat-trend`, `split`).
- A chart or text widget with a header and controls (`panel`).
- A settings or profile form grouped on its own surface (`panel` + `Body` + `Footer`).
- A block about one person or object — a linked account, a contact — headed by its picture (`Card.Icon` with an `Avatar.Root` in `Card.Header`).
- An activity list (`list`), a call to action (`cta`), a tile with an image on top (`cover`).
- A catalogue of records with photos — fleet units, listings: a `cover` card with a `Carousel` in `Card.Media`, its status and plate on the photos, the record's badges in the body and its term with a bar in the footer, the whole card opening the record (`Card.Link`).
- A task of a record with its assignee — a rental's return, an order's delivery: the term in `Card.Title` («Вернуть 10 дек · через 50 дн.»), the assignee picker (a `Badge.Root` with `Badge.Avatar` in a `Dropdown.Trigger`) first in `Card.Description` and the facts after it, the actions at the header's end. One secondary action is a labelled `soft` button beside the primary; two or more gather behind one `action.more` button, the destructive one last. The person is named once — never in the text and again in the picker.
- A tile that is itself the way to its details — a KPI that opens its report, a project tile (`asChild` with a link or a button).

## When not to use
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
Card.Root variant="panel"        Header(Icon?, Title, Description?, …trailing) · Body · Media · Footer
Card.Root variant="mini"         Icon · Label · Value · Meta? · Media?
Card.Root variant="stat-trend"   Label · Value · Delta · Meta?
                                 or Header(Badge or Icon, Value) · Description
Card.Root variant="stat-text"    Label · Value (a line of text) · Meta? · …action (a Button at the end)
Card.Root variant="split"        Body(cell × 2: any element, e.g. <div> with Icon · Label · Value)
Card.Root variant="cta"          Title · Description · Footer
Card.Root variant="list"         Header(Title, …trailing) · List(ListItem …)
Card.Root variant="cover"        Media · Body(Title, Description) · Footer
Card.Root … Footer(…actions, Description?, Total(Meta?, Value))
                                 a record's row: actions · note · total at the end
Card.Root … Title > Link         a stretched link (an <a>, or asChild a <button> that opens a window):
                                 the card opens from anywhere, its own buttons stay
Card.Root asChild                <a> or <button> (the only child) holding the parts of any template
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Card.Root
`ref` → `HTMLDivElement` (the `asChild` element). A surface one layer above the one around it, no border, and a size container; `variant` picks the template layout of its parts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | The card's tier: its padding (`--prime-card-padding-s` 16 at `xs` · `s`, `-m` 20, `-l` 24 at `l` · `xl`) and the tier of the controls inside; the type roles stay. |
| `variant` | `"panel" \| "mini" \| "stat-trend" \| "stat-text" \| "split" \| "cta" \| "list" \| "cover"` | `"panel"` | Structural template: titled block with zones (`panel`), KPI tiles (`stat-text` for a value that is a line of text, with an action at the end of the row), a call to action, a list or a cover tile. |
| `valueSize` | `"m" \| "l"` | the card width (`stat-trend`) · `"m"` (`stat-text`) | A fixed step of the KPI value, so a row of tiles keeps one size: `stat-trend` — `m` heading-m, `l` heading-l, unset it follows the card width; `stat-text` — `m` body-m medium, `l` title-m, a step above the text. |
| `flat` | `boolean` | `false` | No raised shadow: a flat tile for dense grids. |
| `loading` | `boolean` | `false` | The KPI is loading: `Card.Value`, `Card.Delta` and `Card.Meta` show a Skeleton in their own geometry and the root sets `aria-busy`; the data fades in when it arrives. Labels and titles stay. |
| `asChild` | `boolean` | `false` | The whole card is one link or button: pass that element as the only child with the parts inside it; it gets hover, press and the focus ring, a link draws the arrow. No interactive inside: see `Card.Link`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` + `aria-labelledby` for a landmark block, and the other div attributes. |

### Card.Link
`ref` → `HTMLAnchorElement`. The stretched link around the title: a click anywhere on the card opens it, it is the one tab stop, the card's own buttons stay above it. The card draws the arrow: at the end of `Card.Header`, centred on it, or in the top corner.

| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | Render the single child element instead of the `<a>`: a router `Link`, or a `<button>` when the record opens in place (a window). |
| `…rest` | `AnchorHTMLAttributes<HTMLAnchorElement>` | — | `href`, `className` and the other attributes of the link. |

### Card.Header
`ref` → `HTMLDivElement`. The top row: an optional `Card.Icon`, `Card.Title` with an optional `Card.Description` under it, anything else (controls, a caption) in one end row, 8 apart. Wraps below 22rem.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Title
`ref` → `HTMLHeadingElement`. The card heading (`<h3>`, title-s; title-m in `cta`). A `Badge.Root` inside stands beside the text, 8 apart, centred on its line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h3"` | Heading level that fits the page outline; the look does not change. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Description
`ref` → `HTMLDivElement`. Secondary text (body-s): under the title of `cta`, `cover` or the head of `stat-trend`; in `Card.Header` under the title, badges inside (a picker too) in a wrapping row; in `Card.Footer` it is the note: a `Badge.Dot` first, the text cut to one line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Body
`ref` → `HTMLDivElement`. The padded content zone (gap 16). In `split` it is the two-cell grid: each child is a cell (stacked below 22rem); in `cover` it holds the title and the description 4 apart.

| Prop | Type | Default | Description |
|---|---|---|---|
| `divider` | `"full"` | — | A line above the zone that runs edge to edge, in any template, in the `Divider` ink (`border-subtle`) so it reads in both themes (without it: the faint inset hairline of `panel` / `list` and the full one of `cta`). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Media
`ref` → `HTMLDivElement`. A chart, an image or a gauge: edge to edge under the header or the body in `panel`, the 128–192px cover on top in `cover`, the full-width bottom slot in `mini`. A chart SVG needs a CSS height.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Footer
`ref` → `HTMLDivElement`. The bottom row of buttons: right-aligned under a faint hairline in `panel` and `list`, under a full one in `cta`. A record's row: the actions, the note (`Card.Description`), `Card.Total` at the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `divider` | `"full" \| "fill"` | — | How the zone stands off the one above: `full` — a line edge to edge in the `Divider` ink; `fill` — no line, the zone on the next layer out to the card's edges (a record's footer). Without it: the template's hairline. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Total
`ref` → `HTMLDivElement`. The total of a record at the end of `Card.Footer`: a `Card.Value` (title-m, tabular) with an optional `Card.Meta` above it, the total's state («к оплате 21 000 ₽», «оплачено») in a `tone`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Icon
`ref` → `HTMLDivElement`. The 40px accent tile of one icon, first in `Card.Header`. An `Avatar.Root` or `Thumbnail.Root` inside (also in a wrapper) is the record's picture: no tile, 40px, `aria-hidden`; a `ProgressCircle` its state ring: no tile, its own size and name.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Label
`ref` → `HTMLSpanElement`. The metric label (body-s; truncates, wraps in a `mini` tile and a `split` cell).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Value
`ref` → `HTMLSpanElement`. The metric value: tabular, sized by the template and the card width, or fixed by `valueSize`; body-m medium in `stat-text` (title-m with `valueSize="l"`); title-m in `Card.Total`. A `Badge.Root` inside stands beside the text, 8 apart.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | — | The ink by meaning (an amount due is `warning`, a payment `success`). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Delta
`ref` → `HTMLSpanElement`. The change of a metric beside its value.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Delta: color by meaning, not by sign (churn up is `danger`). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.Meta
`ref` → `HTMLSpanElement`. The reference line of a KPI («Лидов 120 · сделок 18»): body-s, muted, tabular; under the value; in `Card.Total` the total's state above it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | — | The ink by meaning (an amount due is `warning`, paid `success`); without it the line is muted. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

### Card.List · Card.ListItem
`ref` → `HTMLUListElement` / `HTMLLIElement`. The `list` template: a `<ul>` of `<li>` rows with faint hairlines between them; head it with `Card.Header`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` and the other attributes of the element. |

## Variants

### variant (structural templates)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `panel` | no root padding; `Header` with a faint hairline, padded `Body`, edge-to-edge `Media`, right-aligned `Footer` | chart widgets, settings forms, any titled block | yes |
| `mini` | 40px accent `Icon` tile beside the label and the title-l value; a `Media` child is a full-width bottom slot | a compact KPI tile, with a sparkline or a ProgressBar | |
| `stat-trend` | label, large value (adapts to the card width), delta; or a `Header` (lead left, heading-m value right) + description | the main number of a dashboard row; a KPI with a qualifier badge | |
| `stat-text` | the `stat-trend` column with the value as a body-m medium line of text; anything else in the root (a Button) sits at the end of the row, centred on the text | a summary tile whose value is a phrase («Выдать PCX 160»), not a number; a step of a record with its action («Выдан» · «Отменить») | |
| `split` | `Body` with two metric cells and a faint hairline; stacked below 22rem | two related metrics in one tile | |
| `cta` | title, body-s text, `Footer` under a hairline | a call to action | |
| `list` | `Header` with a hairline, items with faint hairlines | recent events, short lists | |
| `cover` | 128–192px `Media` on top, title and description, `Footer` | campaign, project or product tiles | |

### divider (Body · Footer)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `full` | the zone's top line runs edge to edge in any template, in the `Divider` ink (`border-subtle`), so it reads in both themes; the zone lines of `panel` / `list` / `cta` stay faint | a zone line wider than the card padding | |
| `fill` (Footer) | no line: the footer is a zone on the next layer of the ladder (`data-depth`, `--prime-color-layer-current`), out to the card's edges and its bottom radius, the card padding on every side | the footer of a record or an invoice: its action, task and total | |

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | padding 16 (`--prime-card-padding-s`), the controls inside at the tier | dense tiles: a catalogue grid, a narrow drawer | |
| `m` | padding 20 (`--prime-card-padding-m`) | most cards | yes (or the host tier) |
| `l` · `xl` | padding 24 (`--prime-card-padding-l`) | a roomy settings or a lone summary card | |

The type roles stay at every tier: the cards of one screen share one type scale (title-s, body-s), and the tier is the card's density, not its voice. Without its own `size` and a sized host a card gives no tier to its parts, so a Badge inside keeps its standalone `m`; with one, a Badge follows the pairing rule (one step down).

### valueSize (Root, `stat-trend` · `stat-text`)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| — (`stat-trend`) | the headline follows the card width: heading-m below 20rem, heading-l, display-s from 36rem | the main number of a dashboard row, one tile per column | yes (`stat-trend`) |
| `m` | `stat-trend`: the value heading-m at any width; `stat-text`: body-m medium, the size of the text | `stat-trend`: KPIs in a drawer, so a row of two and a row of four keep one size; `stat-text`: the fact tiles of a record, a phrase beside other text | yes (`stat-text`) |
| `l` | `stat-trend`: heading-l at any width; `stat-text`: title-m, a step above the text, a number and a phrase alike; the loading Skeleton takes its height | `stat-trend`: a fixed larger KPI row; `stat-text`: a row of totals a step above the text — every tile of the row with it | |

### tone (Delta · Value · Meta)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | `text-secondary` (Delta), the primary ink (Value), muted (Meta) | a change or a value with no good/bad meaning | yes (Delta) |
| `success` | `success-text` | the change is good, a payment | |
| `warning` | `warning-text` | the change needs attention | |
| `danger` | `danger-text` | the change is bad | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `flat` | same fill, no shadow | dense grids of tiles | `false` |
| `loading` | `Card.Value`, `Card.Delta` and `Card.Meta` hold a Skeleton in their own geometry (the value a bar one line of its role high); the data fades in under the same element | a KPI waits for its report | `false` |
| `asChild` | the card is the link or button it wraps: lifts on hover (raised → overlay shadow), presses, focus ring | the whole tile opens its details | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| template | `variant` | `data-variant` |
| flat | `flat` | `data-flat` |
| loading | `loading` | `aria-busy` on the root; `data-loading` on `Card.Value`, `Card.Delta`, `Card.Meta`, each holding a `Skeleton`; on `false` the data fades in (`useSwapIn`, foundation §1 rule 7) |
| depth | nesting: one above the nearest surface (the page and the AppShell panel are 0) | `data-depth` (`1`–`4`, `floating-1`/`floating-2` inside a floating layer); the fill is `--prime-color-layer-current`, the shadow only at depth 1; a `divider="fill"` footer takes the next depth the same way |
| link arrow | `Card.Link` or `asChild` with a link | the kit's arrow, `aria-hidden`: the last child of `Card.Header` (at its end, centred on its height), or in the top corner of a card without a header |
| card width | container queries | a record footer puts its note on its own line below 30rem, `split` stacks below 22rem, `Header` wraps below 22rem (a header control under its description, from the text column to the end edge), the `stat-trend` value changes at 20rem / 36rem (unless `valueSize` fixes it), a `stat-text` action drops under the text below 20rem; the dropped end row's buttons and links share the whole content width, an icon-only button keeps its square |
| hover | `asChild`, a fine pointer | the fill stays (a whole surface never changes its fill, foundation §8); the shadow lifts to `--prime-shadow-overlay` over `fast` |
| press | `asChild`, `:active` | the edges give in by `--prime-motion-press-distance` at any card size (the kit press) over `fast`; reduced motion keeps it still |
| focus | `asChild`, `:focus-visible` | the focus ring outside the card |

Without `asChild` a card is static: no hover, focus or press of its own. With it: `data-interactive` on the element.

## Layout & spacing
- Cards on a page: one `Page.Grid` with a `Page.Cell span` per card (16 on both axes, the cards of a row share one height); a grid inside one block is the block's own intrinsic `auto-fill` grid on the tile width of the layout tokens (a lone card keeps its column width), gap `--prime-space-4`.
- Radius `--prime-card-radius`, no border. In `panel` and `list` the `Header` is a padded zone with a faint inset hairline below; a header with no `Body` or `List` under it (alone, or right before the `Footer`) has its bottom padding equal to its top (16); in `stat-trend` it can pair a leading Badge or icon with a compact `Card.Value`.
- Padding `--prime-card-padding-m` (20); a `Body` that opens the card (no `Header` or `Media` above) has it on all four sides, and so does a `Footer` under a hairline (`panel`, `list`, `cta`, `divider="full"`) — a zone of its own, its buttons and total in its middle; `Body` gap `--prime-card-gap` (16); fields inside `Body` 20 apart, one ladder step off the card.
- Depth comes from nesting (foundation §4): on the page — the AppShell panel is the page — a card is layer 1 (white in light) with the raised whisper; inside another card it is the next layer, a flat tile. The ladder stops at layer 4.
- Long values wrap; labels truncate, except in a `mini` tile and a `split` cell, where a label beside the icon wraps instead; a chart SVG needs a CSS height.
- In a `Header` the title takes the free width; everything after the title and its description (buttons, a switch, a caption) goes, in order, into one end row the kit draws — 8 apart, centred on each other — so «Вернуть» and an icon-only edit button stand side by side with no wrapper of yours. A `Card.Description` in the header stacks under the title, 4 apart; the end row stays at the end, centred on both lines. A header with no title (the `stat-trend` lead row) keeps its children as they are.
- A `Card.Icon` in a `Header` leads the row, 12 before the title, centred on the title and the description: the accent tile, or the record's picture — an `Avatar.Root` or a `Thumbnail.Root` anywhere inside, also from your own wrapper component, with no tile; it takes 40 px whatever size it was given — for a card about one person or object (a linked account, a contact). A `ProgressCircle` in it is the record's state ring (the term of a rental): no tile, its own diameter (48 at `m`), and it keeps its name for assistive tech.
- A record's footer: `Card.Total` at the end of the row holds the total — a `Card.Value` (title-m, tabular, a `tone` if it is due) with an optional `Card.Meta` above it, its state («к оплате 21 000 ₽», «оплачено») in a `tone`, both aligned to the end; a `Card.Description` is the note between the actions and the total — a `Badge.Dot` first, the text cut to one line; below 30rem of the card's width the note takes its own line above the actions and the total. `divider="fill"` sets the footer on its own fill instead of a line. Line items with amounts above it are a `DescriptionList align="end"` in a `Card.Body`.
- The transition arrow of a card that opens stands at the end of its `Card.Header`, centred on the header's height (a two-line head with a picture or a ring included); the title keeps clear of it. Without a header it stands in the top corner, and the card hands its room to the content through `--corner-mark-room` (a Sparkline's head keeps its date clear of the arrow). A control inside a card that opens — a button, a Sparkline's plot (a slider) — stands above the stretched `Card.Link` and takes its own press. A `cover` card with `Card.Media` draws no arrow: the picture is the cue, and in the corner the arrow would sit under the media.
- A catalogue tile (`cover`): `Card.Media` holds the record's `Carousel` (its status and plate as `Carousel.Overlay` badges), `Card.Body` the title, a one-line `Card.Description` and a `Badge.Group` of the record's other badges, `Card.Footer` its term — a `Card.Meta` line and a thin `ProgressBar`. The body takes the free height, so in a grid row every footer keeps to the bottom whether a card has badges or not.
- `stat-text` with an action: put the Buttons straight into the root after the text parts — the tile becomes two columns, the label, value and meta in the first, the actions in one end row at their own size, 8 apart, centred on the text (no wrapper, no layout of your own in `Card.Body`).
- A narrow card (a phone): the end row drops onto its own row under the text — in a `Card.Header` with a description or an icon below 22rem, in a `stat-text` tile below 20rem — and runs from the text column to the end edge: its buttons and links share the whole content width, an icon-only button keeps its square, and a Switch, a caption or a badge keeps its own size at the start.
- Badges under the title of a record (its state, its deposit) go straight into the header's `Card.Description` — `Badge.Root` children or a `Badge.Group`: they stand in a wrapping row, 8 apart, centred with any text beside them. The description is a `<div>`, so a `Badge.Group` inside it is valid markup.
- A `Badge.Root` straight in a `Card.Title` or a `Card.Value` («[У нас] 300 $», «Клиент [300 $]») stands before or after the text on its line, centred on it, 8 apart (the gap of `Badge.Group`), at its own chip size; the text wraps in its own box. No space or wrapper of yours.
- `Card.Link` is an `<a>` with `href`; a record that opens in place (a window, a drawer) takes `asChild` with a `<button>` — it stretches over the card the same way, with the same arrow and focus ring.
- `Card.Meta` in `stat-trend` takes the bottom of the tile (`margin-top: auto`), so tiles of one row line their meta up; in `mini` and a `split` cell it sits in the text column under the value.

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
- Decorative icons in `Card.Icon` and cover images in `Card.Media` get `aria-hidden`; controls in `Card.Header` need their own names.
- A `loading` card sets `aria-busy` on its root; the Skeletons are decorative (`aria-hidden`).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A company settings form on a card: a header, fields on the surface fill and the submit button in the footer — `Card.Header`, `Card.Body`, `Card.Footer`. |
| [variants.tsx](examples/variants.tsx) | KPI templates: an icon tile with a value, a badge with a value in the header row, and a large value with its change in every tone and a reference line, and a line-of-text value at both steps — `variant`, `Card.Delta`, `tone`, `Card.Meta`, `valueSize`. |
| [sizes.tsx](examples/sizes.tsx) | A record card at every tier: the padding steps 16 · 20 · 24 and the button inside takes the tier, the text keeps its roles — `size`. |
| [kpi-media.tsx](examples/kpi-media.tsx) | A KPI with a sparkline or a fill level in the bottom slot of `mini` — `Card.Media`. |
| [panel-chart.tsx](examples/panel-chart.tsx) | A chart widget: a header with a short description and a period switch, and a Sparkline with the period total over its chart — `Card.Header`, `Card.Description`, `Card.Body`. |
| [person-header.tsx](examples/person-header.tsx) | A linked Telegram account in an employee card: the avatar leads the header, the handle stands under the name and the unlink button sits at the end — `Card.Icon`, `Avatar.Root`, `Card.Description`. |
| [interactive.tsx](examples/interactive.tsx) | Whole cards as links to their reports: one tab stop each, a lift on hover, a press and the focus ring — `asChild`. |
| [record-link.tsx](examples/record-link.tsx) | A transport card that opens its record from anywhere and keeps its own button, a full-width line above the action row, and a deposit card that opens its window in place — `Card.Link`, `asChild`, `Card.Footer`, `divider`. |
| [record-totals.tsx](examples/record-totals.tsx) | A rental unit of a deal: its term ring leads the header beside the arrow, its state and deposit badges stand under the title, the line items with their amounts sit under a full-width line, and the footer on its own fill holds the action, the next task and the total with its state at the end — `Card.Icon`, `Card.Link`, `divider`, `Card.Description`, `Card.Total`, `Card.Meta`. |
| [assignment.tsx](examples/assignment.tsx) | A rental's return with its assignee: the term in the title, the assignee picker first in the line under it, and the one secondary action as a labelled button beside the primary — `Card.Title`, `Card.Description`, `Badge.Avatar`, `Dropdown.Trigger`. |
| [assignment-menu.tsx](examples/assignment-menu.tsx) | A rental's return with its assignee and several secondary actions: the primary stays in sight, the rest gather in one menu with the destructive one last — `Card.Description`, `Badge.Avatar`, `Dropdown.Trigger`, `action.more`. |
| [drawer-kpis.tsx](examples/drawer-kpis.tsx) | A record's KPIs in a drawer-width column, two and four to a row, every value one fixed size — `stat-trend`, `valueSize`. |
| [text-values.tsx](examples/text-values.tsx) | Fact tiles whose value is a line of text in one style, a phrase and a number alike, one of them in a tone — `variant`, `stat-text`, `tone`. |
| [text-action.tsx](examples/text-action.tsx) | Summary tiles of a rental with the action of each step at the end of the row — `stat-text`, `Card.Value`, `Card.Meta`. |
| [object-cards.tsx](examples/object-cards.tsx) | Object cards in one two-line shape: the object's mark leads the header — a channel avatar, a session icon tile, a term ring — its name stands over one secondary line and its action sits at the end — `Card.Header`, `Card.Icon`, `Card.Title`, `Card.Description`. |
| [record-drawer.tsx](examples/record-drawer.tsx) | The cards of a rental unit in its drawer, one type scale across them — a semibold title over one secondary line with the actions at the end: the status with its step, the bill with its lines and the total on the footer fill, the deposit with its state badge and two actions, the check-out video with its preview — `Card.Header`, `Card.Title`, `Card.Description`, `Card.Icon`, `Card.Footer`, `divider`, `Card.Total`. |
| [content-templates.tsx](examples/content-templates.tsx) | Content templates: a call to action, an events list and a campaign tile with a cover — `Card.Footer`, `Card.List`, `Card.Media`. |
| [catalogue.tsx](examples/catalogue.tsx) | A fleet catalogue: each unit's photos are the cover, its status and plate stand on them, the model and the place sit under them, the other badges wrap, and the term with its bar keeps to the bottom of the card, which opens the unit as a whole, at the dense tier — `cover`, `size`, `Card.Media`, `Card.Link`, `Card.Footer`, `Card.Meta`. |
| [flat.tsx](examples/flat.tsx) | A flat tile without the raised shadow next to the default one, for dense grids — `flat`. |
| [states.tsx](examples/states.tsx) | A KPI tile while its report loads next to the loaded one, in the `stat-trend` and `mini` templates — `loading`. |
| [narrow.tsx](examples/narrow.tsx) | The card is a size container: the split template stacks its cells below 22rem and the trend value shrinks below 20rem — `variant`. |
| [screen.tsx](examples/screen.tsx) | A dashboard: the title with a line of data, the period switch and the report in the page's top bar; one grid of KPI tiles that cross-fade to the new period, a revenue trend, invoiced against paid beside two panels, and the latest payments with a link to the list — `Page.TopBar`, `Page.Grid`. |

## Mistakes
- A `<div>` with a border styled as a card → use `Card.Root`; depth comes from fill, not lines.
- Wrapping every page section in a card → use `Page.Section`.
- `Card.Delta tone="success"` for every «+» → choose the tone by meaning.
- Custom padding on a `panel` root → padding belongs to `Header` / `Body` / `Footer`.
- A wrapper `<div>` around the label and the value of `mini` → put `Icon`, `Label`, `Value` straight into the root (or into a `split` cell); the template lays them out.
- An avatar, a name and a handle hand-laid in `Card.Body` with a button beside them → `Card.Header` with `Card.Icon` (the `Avatar.Root`), `Card.Title`, `Card.Description` and the button.
- A chart SVG with only a `viewBox` → give it a CSS height.
- A hand-drawn trend SVG in a chart widget → `Sparkline` in the `Body` (or `Media`); a chart with a legend and states → `ChartFrame`.
- A clickable `<div>` card with `onClick` → `asChild` with a real `<a href>` (Cmd-click, a new tab) or a `<button>`.
- Buttons or links inside an `asChild` card → nested interactive elements; move them out of the card.
- A `Card.Body` with a hand-laid row of label, value and button in a `stat-text` tile → the Button straight in the root, after `Card.Meta`.
- Your own bottom padding on a `Card.Header` with nothing under it → the kit pads a lone header, and one right before the `Footer`, as at its top.
- A `?modal=…` link to open a window from a card → `Card.Link asChild` with a `<button>`.
- The reference figures written into `Card.Delta` or `Card.Label` → `Card.Meta`.
- A hand-laid grid of action, task and total in `Card.Footer` → the Button, a `Card.Description` (with a `Badge.Dot`) and a `Card.Total` straight in the footer.
- A `Typography` inside `Card.Value` of a `stat-text` tile → the default value for a fact tile, `valueSize="l"` on the root for a step larger (the Skeleton then keeps the value's height).
- Tiles of one row at different value sizes → one `valueSize` for the row.
- Badges in the header's `Card.Description` spaced by hand or wrapped in your own row → the badges straight in the description.
- A space or a flex wrapper of your own between a Badge and the text in a `Card.Title` or `Card.Value` → the Badge straight beside the text: the kit sets the gap.
- `stat-trend` KPIs in a drawer laid out in rows of one count only so their values match → `valueSize="m"` on each tile: a row of two and a row of four keep one size.
- A footer painted with your own background → `Card.Footer divider="fill"`.
- Skeletons placed by hand inside `Card.Value` → `Card.Root loading`; keep the parts mounted while loading so each holds its place.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (`Badge.Dot` of a footer note), [Skeleton](../skeleton/COMPONENT.md), `Icon` (the transition arrow), `internal/rowLink` (the stretched link), `internal/mediaSlot` (a record's Avatar, Thumbnail or ProgressCircle in `Card.Icon`), `internal/parts` (the dot of a footer note)
- **See also:** [Page](../../layout/page/COMPONENT.md), [DescriptionList](../description-list/COMPONENT.md) (record details inside a `Card.Body`), [Fieldset](../fieldset/COMPONENT.md) (groups of fields inside a settings card), [DataTable](../data-table/COMPONENT.md), [Badge](../badge/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [Sparkline](../sparkline/COMPONENT.md) (a trend with its total inside a `panel`), [ChartFrame](../chart-frame/COMPONENT.md) (a full chart with legend and states)
