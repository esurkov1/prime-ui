# Foundations — do it this way

Condensed from the kit's design contract, [foundation.md](../docs/foundation.md). Use semantic
tokens `--prime-*` only.

## 1. 4px grid

Every spacing, height, padding and gap is a multiple of 4. Spacing tokens: `--prime-space-N` = N × 4px.

| Token | px | Token | px |
|---|---|---|---|
| `--prime-space-1` | 4 | `--prime-space-7` | 28 |
| `--prime-space-2` | 8 | `--prime-space-8` | 32 |
| `--prime-space-3` | 12 | `--prime-space-10` | 40 |
| `--prime-space-4` | 16 | `--prime-space-12` | 48 |
| `--prime-space-5` | 20 | `--prime-space-14` / `-16` | 56 / 64 |
| `--prime-space-6` | 24 | `--prime-space-20` / `-24` | 80 / 96 |

Off-grid values exist only inside the kit (1px hairline, 2px focus ring). Never in your CSS.

The only places a raw length is allowed: `@media` / `@container` conditions (tokens cannot be used
there) and props a component documents as a CSS length string, e.g. DataTable column `width: "14rem"`.

## 2. Proximity scale

Things that belong together sit closer than things that do not.

| Between | Gap | Token |
|---|---|---|
| label → field | 4–8 | built into fields (`label` prop) — do not add |
| field → hint/error | 4 | built into fields — do not add |
| a hand-built field (your own control + `Label.Root` + `Hint.Root`) | label 4–8, hint 4 | [the recipe](api-contract.md#your-own-control-without-a-frame) |
| group heading → its fields | 16 | `--prime-space-4` |
| field → field in a form | 20 | `--prime-space-5` |
| inline controls in a row (buttons, filters) | 8 | `--prime-space-2` |
| switch → switch in a settings list | 20 | `--prime-space-5` |
| group → group (fieldset, form section) | 32 | `--prime-space-8` |
| tile → tile, both axes (KPI cards, charts, panels) | 16 | `--prime-space-4` — `Page.Grid` already does it |
| block → block on a page (page header → body too) | 24 | `--prime-space-6` — `Page` already does it |
| section → section on a page (a new topic with an `h2`) | 40 | `Page.Section` already does it |

`Page.Body` already spaces its direct blocks 24 apart, a `Page.Section` 40 from its
neighbours, `Page.Grid` its tiles 16 on both axes, and `AppShell.Main` already hands the page its
gutters — do not add your own outer padding.

## 3. Size axis

`size: "xs" | "s" | "m" | "l" | "xl"`, default `m` (height 28 · 32 · 36 · 40 · 48).

- Controls of one size line up exactly: Button, Input, Select, Datepicker, SegmentedControl, Tabs.
- One row = one size. A toolbar of `s` controls is all `s`.
- Dense tables/toolbars: `s`. Normal screens: `m`. Hero / marketing CTA: `l`.
- Badges/Kbd inside a control use one step smaller (`m` control → `s` badge).
- Tables: controls inside cells (Button, Select, Input) use one tier below the table (`m` table → `s`).
  Row height is a minimum: two-line cells and avatars grow the row by themselves — never set row or
  cell heights in CSS. Column dividers and the sort icon position come from DataTable; do not restyle
  them.

### Chips beside fields

Chips (a `Badge`, a status `Select`) and controls (fields, buttons) have two height scales:

| Size | xs | s | m | l | xl |
|---|---|---|---|---|---|
| Chip (`Badge`, `Select variant="status"`) | 16 | 20 | 24 | 28 | 32 |
| Control (Input, Select, Datepicker, Button) | 28 | 32 | 36 | 40 | 48 |

Which chip size a place takes:

| Where the chip stands | Chip size |
|---|---|
| Inside a control (a count in a Button, a tag in an Input) | none — the kit takes one step down |
| Alone as a mark: a status in a table cell, a tag in a list, the badges under a card's title | none — `m` (24), or the host's tier on a sized card |
| A row of chips only: `X.Badges` of a dialog header, a record's labels | one size for the whole row (the kit's `m` in `X.Badges`) |
| In one row with `xs` controls (a record line: state, person, date) | `l` — 28, as tall as the `xs` field |
| In one row with `s` controls | `xl` — 32, as tall as the `s` field |
| In one row with `m` or larger controls | no chip that tall: every item of the row is a field (a `Select` with `Avatar.Root` items for a person, a `Select` whose items have `color` for a status) |

A chip that picks (`Badge.Root` in `Dropdown.Trigger`, `Select variant="status"`) takes the same size
as a chip that only shows: set it on the chip, two steps above the controls of its row.

```tsx good
// good — a record line of xs controls: the chips are l (28), as tall as the xs fields
<>
  <Select.Root variant="status" size="l" aria-label="Состояние" defaultValue="ready">
    <Select.Trigger>
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="ready" color="green">Можно сдавать</Select.Item>
      <Select.Item value="repair" color="red">В ремонте</Select.Item>
    </Select.Content>
  </Select.Root>
  <Dropdown.Root>
    <Dropdown.Trigger>
      <Badge.Root size="l" aria-label="Исполнитель: Евгений Сурков">Евгений Сурков</Badge.Root>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item selected>Евгений Сурков</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
  <Button.Root size="xs" variant="soft" tone="neutral">23 окт</Button.Root>
</>
```

Bad: a `Select size="xs"` beside a `Badge` of the default size — 28 and 24 in one line, the row jumps.

## 4. Fill, not lines

- Surfaces stand on one ladder: the page (layer 0) and four nested layers, each one lightness step
  from its parent. Light: gray page, white card, deeper layers alternate gray / white. Dark: a
  near-black page, every nested layer a step lighter. Floating layers (menus, popovers, modals,
  drawers) sit a step above a card, with a shadow.
- Inside `AppShell` the content panel is the page (gray in light) and a Card on it is layer 1 — white,
  with the raised whisper; the Sidebar rail beside it is its own layer 1 surface, so it never merges
  with the content. Fields, chips, neutral buttons and segmented tracks are
  always one step off the layer they sit on. The kit sets every depth itself (`data-depth`) — just
  nest components, never set backgrounds yourself.
- Separate blocks by fill and air. Hairlines (`Divider`) only inside a block: list rows, table rows,
  between a form and its footer.

### Card in a card

Allowed — a card inside a card becomes the next layer by itself — but avoided by default: a section
heading inside one card usually reads better. Never a card around a `DataTable` (it already is a
filled block), a single field or a whole page. The ladder stops at layer 4.

### Your own bounded block

A `Card` (it takes the right layer wherever it lands). The one background you may set yourself: a
plain tile with no controls inside on `background: var(--prime-color-layer-nested)` with
`border-radius: var(--prime-card-radius)`. Never a transparent box with a border, never a
hard-coded `--prime-color-layer-<n>-*`.

## 5. Nested radius

Inner radius = outer radius − padding. Panel 12 with padding 4 → items 8. Use `--prime-radius-*`
(`xs 4 · s 6 · m 8 · l 12 · xl 16 · full`), `--prime-card-radius`, `--prime-panel-radius`.

## 6. tone and color

Colour means, it never decorates: every hue on a screen answers «what is this» or «what state is it
in». A hue that answers neither goes.

- `tone` is a judgement: `neutral · accent · success · warning · danger · info`. Destructive is
  `danger`.
- `color` is an identity from the palette (`PaletteColor`): `gray · blue · green · orange · red ·
  yellow · purple · sky · pink · teal` — Badge, Avatar, Thumbnail, SegmentedControl dots, count
  badges of Tabs, SegmentedControl, Sidebar and BottomNav, FileUpload format badges, Timeline dots,
  TagSelect tags, Kanban column counts, Gantt bars, ProgressBar / ProgressCircle segments, the author
  hue of a chat (`Message.Author`).
- Never convey meaning by color alone: a badge has text, a dot or a bar has a label or a legend.

### tone or color

Ask what the state says about the record:

| The state is | Wear | Examples |
|---|---|---|
| a judgement — good, needs attention, a problem, nothing going on | `tone` | «Оплачен» `success`, «Ожидает оплаты» `warning`, «Ошибка синхронизации» `danger` |
| an identity with no judgement — a lifecycle stage, a phase, a category, a tag, a person, a channel | `color` | deal stages, project phases, lead sources, a client's tags, a chat author |

Several identities never collapse into one tone. «Новая», «Бронь» and «В аренде» are all neutral
news, and as `tone="info"` they become one sky badge three times; as hues (sky, yellow, blue) a
person tells them apart at a glance.

```tsx partial
// bad — three stages, one colour; and each screen picks its hue inline
<Badge.Root tone="info">Новая</Badge.Root>
<Badge.Root tone="info">Бронь</Badge.Root>
<Badge.Root tone="info">В аренде</Badge.Root>
<Kanban.Root columns={[{ id: "rented", title: "В аренде", color: "purple" }]} />
```

### One status map

Every status of an entity has one entry, `status → { label, tone | color }`, written once in a
module of the app; every screen reads it. A badge, a ProgressBar or ProgressCircle segment, a
Timeline dot, a Kanban column, a Gantt bar and a chart series of the same status take their label
and colour from the same entry, so the badge in a list and its share in the bar always match.

```tsx
// entities/deal/stage.ts — the product's one map of deal stages
import { Badge, type PaletteColor, ProgressBar } from "prime-ui-kit";

export type DealStage = "new" | "booked" | "rented" | "ending" | "overdue" | "returned" | "cancelled";

export const DEAL_STAGE = {
  new: { label: "Новая", color: "sky" },
  booked: { label: "Бронь", color: "yellow" },
  rented: { label: "В аренде", color: "blue" },
  ending: { label: "Скоро возврат", color: "orange" },
  overdue: { label: "Просрочена", color: "red" },
  returned: { label: "Возвращена", color: "green" },
  cancelled: { label: "Отменена", color: "gray" },
} as const satisfies Record<DealStage, { label: string; color: PaletteColor }>;

const STAGES = Object.keys(DEAL_STAGE) as DealStage[];

export function DealStageBadge({ stage }: { stage: DealStage }) {
  return <Badge.Root color={DEAL_STAGE[stage].color}>{DEAL_STAGE[stage].label}</Badge.Root>;
}

export function DealStageShare({ counts }: { counts: Record<DealStage, number> }) {
  return (
    <ProgressBar
      label="Сделки по этапам"
      legend
      segments={STAGES.map((stage) => ({
        value: counts[stage],
        label: DEAL_STAGE[stage].label,
        color: DEAL_STAGE[stage].color,
      }))}
    />
  );
}
```

A status that is a judgement keeps the same shape with `tone` in place of `color`
(`satisfies Record<InvoiceStatus, { label: string; tone: "success" | "warning" | "danger" }>`).

### Hue meanings

The kit suggests a generic meaning per hue; the product writes its own map on top, and a hue keeps
its meaning across every map of that product:

| Hue | Generic meaning |
|---|---|
| green | done, success |
| red | a problem, overdue, an error |
| orange | attention, soon |
| yellow | reserved, scheduled, waiting for a date |
| blue | in progress, active |
| sky | new, incoming |
| gray | inactive, archived, a draft, cancelled, no data |
| purple, pink, teal | the product's own identities |

- A derived state refines the story of its base hue: active blue → ending soon orange → overdue red.
- An event in a history (a Timeline item, an audit row) takes the colour of the state it led to.
  Kinds of events (calls, payments, edits) are a filter, not a colour.

### Categories

Categories (sources, regions, teams, tags) are a separate axis from statuses: their hues only tell
the members of one set apart, unique within that set. A category keeps one hue across the product
through one `Record<Category, PaletteColor>` map; members with no map of their own (people, ad-hoc
tags) get `hueOf(id)`, stable per id. Inside one view a category never borrows a status hue: next
to a red «Просрочена» badge no source is red.

### Colours people choose

A colour a person picks (a role, a tag, a pipeline) is stored as a palette name, never a hex: the
theme then draws it right in light and dark. A stored value that is no palette name renders `gray`.

```tsx good
// declare: const tag: { name: string; color: string }
<Badge.Root color={paletteColors.find((hue) => hue === tag.color) ?? "gray"}>{tag.name}</Badge.Root>
```

### Marks, not surfaces

Colour lives on marks — a badge, a dot, a bar, a ring, a chart series — never on a large surface:
no tinted panel, card or table row for a status, no coloured border or stripe. Groups are told apart
by fill and type ([card in a card](#card-in-a-card)). A soft badge is the kit's mark and is fine.

```css
/* bad — the overdue row or card is painted red */
.overdue { background: var(--prime-color-danger-soft); border-inline-start: 2px solid var(--prime-color-danger-default); }
```

```tsx good
// declare: const DEAL_STAGE: Record<"overdue", { label: string; color: "red" }>
// good — the row keeps the table's fill; its stage cell carries the mark and the word
<Badge.Root color={DEAL_STAGE.overdue.color}>{DEAL_STAGE.overdue.label}</Badge.Root>
```

### Charts and categorical colors

A chart color does one job, and the job picks the colors:

| Job | Use | Never |
|---|---|---|
| identity — which category or series (platforms, sources, regions, teams) | the categorical palette `--prime-color-chart-1…8` (blue, orange, teal, yellow, pink, green, purple, red), `chart-other` for «Прочее»; in kit parts `color` (a ProgressBar / ProgressCircle share, a legend swatch) | `tone`: success / danger read as good / bad |
| meaning — good, at risk, failed (a status share, a target met) | `tone` | a chart hue |
| magnitude — how much (heatmap cells) | `--prime-color-chart-scale-1…5` (one hue, near the ground → full); text on steps 4–5 `--prime-color-chart-scale-fg`, on 1–3 `text-primary` | a rainbow |

- Assign series in the palette order and never cycle; a ninth series folds into «Прочее»
  (`chart-other`). Color follows the entity, not its rank: a filter that hides a series does not
  repaint the others.
- One category keeps one hue everywhere: a palette `color` maps to its chart step (`blue` →
  `chart-1`, `orange` → `chart-2`, `teal` → `chart-3`, `yellow` → `chart-4`, `pink` → `chart-5`,
  `green` → `chart-6`, `purple` → `chart-7`, `red` → `chart-8`, `gray` → `chart-other`), so a
  ProgressBar share and a line in a chart library match. `sky` has no chart step (it sits too close to
  blue).
- The tokens and their contrast guarantee are in
  [foundation.md → Chart palette](../docs/foundation.md#chart-palette). In scatter-like charts, where
  any two marks can meet, keep to the first three series or facet.
- A chart library takes the colors as strings: `chartColors.series[i]`, `chartColors.grid`,
  `chartColors.axis`, `chartColors.scale[i]` (each a `var(--prime-color-chart-*)`, so the theme
  switches without a re-render). Gridlines are `chart-grid`, the axis line `chart-axis`, axis labels
  `text-muted`; values and legends wear text tokens, never the series color.
- Every chart with two or more series has a legend (ProgressBar / ProgressCircle `legend`,
  `ChartFrame.Legend`) or direct labels; one series needs none — its title names it. One y-axis per chart: two measures of
  different scale are two charts.
- The kit ships no chart library: Sparkline for a trend in a tile, ProgressBar / ProgressCircle for
  shares and rankings, and for axes and several series a library of your choice (or your own SVG)
  inside ChartFrame: it brings the panel, the axis-label type, the legend, the tooltip body, the
  loading / empty / error states and a data table for screen readers, and hands the plot its size
  and the series colors.

## 7. Typography

| Role | Size/LH | Use |
|---|---|---|
| `caption` | 12/16 | meta, table head, timestamps |
| `body-s` | 13/20 | secondary text, dense UI |
| `body-m` | 14/20 | default text |
| `body-l` | 16/24 | reading text |
| `title-s` | 14/20 600 | card title, group heading inside a card or form |
| `title-m` | 16/24 600 | page section heading (`Page.Section` draws it), modal title |
| `title-l` | 18/24 600 | large block title |
| `heading-s` | 20/28 600 | page sub-heading |
| `heading-m` | 24/32 600 | the page title in the flow (`Page.Title` of a document page); in `Page.TopBar` the same `Page.Title` is `title-m` |
| `heading-l` | 30/36 600 | marketing / auth title |
| `display-*` | 36–60 | hero numbers only |
| `code` | 13/20 mono | identifiers, inline code |

`variant` is required on `Typography`. Weights only 400/500/600. Numbers in tables, prices, dates:
tabular (the kit does it in DataTable `numeric` columns, `Kpi.Value` and `Card.Total`; your own amounts take
`font-variant-numeric: tabular-nums`). Reading text max width `--prime-layout-reading-max-width`
(`Page.Root maxWidth="readable"`).

### Text colour

Text takes its colour from `Typography tone` (`secondary`, `muted`, `accent`, `success`, `warning`,
`danger`) or from the kit part it sits in — never `color` in your CSS. A `--prime-color-*` token in
your CSS colours only what is not text: a fill, a tile, a line.

## 8. Hierarchy through air

Important content gets more space; secondary content is grouped tighter. Do not put everything on one
level of air: a page with uniform 16px gaps everywhere reads as a list of unrelated things.

## 9. Responsive

- Flexbox for rows/stacks, Grid for two-dimensional layouts; spacing via `gap`.
- Every screen works from 320px and at 400% zoom: [responsive.md](responsive.md) holds the rules —
  the [breakpoints and their scope](responsive.md#breakpoints), the
  [intrinsic grids](responsive.md#intrinsic-grids), what the kit adapts by itself and touch.
- Flex children with text: `min-width: 0` + ellipsis or `overflow-wrap: anywhere`.
- Sticky parts come from the kit: `Page.TopBar` (with all its groups), the
  DataTable head and `stickyFirstColumn`, the Gantt header and first column — each sticks inside its
  own scroller, and the top ones let go on screens lower than 480px. Never a `position: sticky` bar of your own.

## 10. Focus and motion

Never remove focus rings, never set `outline: none`. Kit components ship their motion (press, toggle,
selection glide, open/close, label morph, rolling counters) — never re-implement or override it. Motion
of your own elements — when to move at all, the tokens, the rules and recipes — is
[motion.md](motion.md).

## 11. State changes are continuous

Nothing on screen flips from one state to another, and nothing that loads unfolds. Kit controls
already move into their new state. Every region you build that changes what it shows — loading →
data → empty → error, one record → another — renders its content inside `<Crossfade state={status}>`.

- **Loading is a skeleton from the first paint.** While data loads the region shows the state
  `"loading"` (that exact key): a `<Skeleton>` in the data's geometry (same rows, gaps and line
  heights) rendered on the first render — never `null`, never an empty box that grows when the data
  comes. A `Spinner` only where there is no shape to hold.
- **The data replaces the skeleton in place.** Leaving `"loading"` (or entering it), Crossfade swaps
  with a short fade and the height settles in one frame — no glide, no reveal, no slide-in. A
  skeleton in the wrong geometry therefore shows as a jump: match the data.
- **Only settled states glide.** data ↔ empty ↔ error, another record, a period or a section: the old
  state fades out, the new one fades in, the height glides.
- **A region that mounts in its state is still.** Content already loaded (a cached tab, a page
  opened again) renders as it is, with no fade.

Data already on screen stays during a refresh (`aria-busy`), it does not go back to a skeleton.
