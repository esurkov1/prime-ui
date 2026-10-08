# Composition — how a screen is assembled

A screen made from the kit looks finished when every block sits on the same few rules: one skeleton,
one rhythm, one size, one primary action, fill instead of lines, and a state for every region. This
file is those rules; [patterns/](patterns/) are the same rules as working screens.

## Patterns

**Start from a pattern.** Each one is a complete page (React + one CSS module on tokens), copyable as
is, and is shown live with its code in the playground (category «Композиция»):

| Screen | Pattern | Shows |
|---|---|---|
| List / registry | [list-page.tsx](patterns/list-page.tsx) | header with one primary action, SmartFilter in the DataTable toolbar, statuses, row menu, pages, filtered empty state |
| One record | [detail-page.tsx](patterns/detail-page.tsx) | Breadcrumb + status in the header, actions by weight, main column + side column of Cards, Timeline |
| Settings | [settings-page.tsx](patterns/settings-page.tsx) | heading column + panel per section, form with its own save, Switches that apply at once, danger zone with a confirm |
| Create in a side panel | [form-drawer.tsx](patterns/form-drawer.tsx) | Drawer form: groups, errors on submit, focus on the first invalid field, loading, toast |
| Dashboard | [dashboard.tsx](patterns/dashboard.tsx) | period switch, KPI row that cross-fades to the new period, a Sparkline revenue trend, panels with progress and a split, short table + link to the list |
| Screen states | [screen-states.tsx](patterns/screen-states.tsx) | page error in a Banner with retry, region loading with a Skeleton, Crossfade between states, table error in place, first-run EmptyPage |

Pick the closest one, rename the domain, keep the skeleton. Change structure only when the task needs
it, and then by the rules below.

## 1. Page skeleton

```
AppShell.Root                      once per app (layouts.md#app-frame-once-per-app)
├─ AppShell.Nav → Sidebar          navigation rail, one layer above the page
├─ AppHeader.Root                  menu button / title or path / ⌘K search / app actions
└─ AppShell.Main                   gutters; the page renders here
   └─ PageContent.Section | Root   the page you deliver
      ├─ PageContent.Header
      │  ├─ Breadcrumb             only below a top-level section; first child → 8 above the title
      │  ├─ PageContent.Title      the one h1
      │  ├─ PageContent.Description one sentence of context (or a status Badge + the key fact)
      │  └─ PageContent.Actions    page buttons; wrap under the title on narrow screens
      └─ PageContent.Body          blocks 40 apart: Banner, KPI grid, table, sections, Cards
```

- A screen component renders only its page. Styles, `applyTheme`, `NotificationProvider` and
  `AppShell` live at the app root.
- `PageContent.Section` for app pages (full panel width); `PageContent.Root maxWidth="wide"` for
  settings, `maxWidth="readable"` for one narrow column of text or fields.
- No outer padding, no margins: `AppShell.Main` has the gutters, `PageContent` has header → body 32 and
  block → block 40. Your CSS lays out only the inside of a block.

```tsx
import { Button, Dropdown, Icon, PageContent } from "prime-ui-kit";

export function OrdersHeader() {
  return (
    <PageContent.Header>
      <PageContent.Title>Заказы</PageContent.Title>
      <PageContent.Description>Все заказы магазина за выбранный период.</PageContent.Description>
      <PageContent.Actions>
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral" aria-label="Другие действия">
              <Button.Icon>
                <Icon name="action.more" />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align="end">
            <Dropdown.Item>Настроить колонки</Dropdown.Item>
            <Dropdown.Item>Импорт из CSV</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
        <Button.Root variant="soft" tone="neutral">
          Экспорт
        </Button.Root>
        <Button.Root>Создать заказ</Button.Root>
      </PageContent.Actions>
    </PageContent.Header>
  );
}
```

## 2. Rhythm — the 4px grid

Every gap is a `--prime-space-N` token (N × 4px) set as `gap` on the parent. Closer means related.

| Between | px | Token |
|---|---|---|
| label → field, field → hint | 4–8 | built into fields — never add |
| buttons, chips, filters in a row | 8 | `--prime-space-2` |
| text lines of one item (name over meta) | 0–4 | `--prime-space-1` |
| heading → its content (group, section without a card) | 16 | `--prime-space-4` |
| tile → tile in a grid (KPI, panels) | 16 | `--prime-space-4` |
| field → field, switch → switch | 20 | `--prime-space-5` |
| main column → side column | 24 | `--prime-space-6` |
| group → group in a form | 32 | `--prime-space-8` |
| page header → body | 32 | `PageContent` |
| block → block on a page | 40 | `PageContent.Body` |

A screen with one gap everywhere reads as a list of unrelated things. Use at least three levels: inside
an item, between items, between blocks.

## 3. Hierarchy — air first, then type

Hierarchy comes from space and a handful of type roles, not from size jumps, color or weight tricks.

| Text | Use |
|---|---|
| page title | `PageContent.Title` (`heading-m`, the only `h1`) |
| section heading without a card | `Typography as="h2" variant="title-m"` |
| card / panel title | `Card.Title as="h2"` (under the page title) |
| group heading inside a card or form | `Typography as="h3" variant="title-s"` |
| body text, cells | `body-m` |
| lead under a heading | `body-m` + `tone="secondary"` |
| meta: dates, ids, labels of values | `caption` + `tone="muted"` |
| the number that matters (KPI, total) | `Card.Value`, or `title-m` for a total row |

- Headings descend without skipping levels. One page title.
- Secondary text is a `tone`, never a custom color. Amounts and dates are tabular
  (`numeric` columns; `font-variant-numeric: tabular-nums` on your own totals).
- Emphasis by position and air: the total is larger and last; the status sits next to the fact it
  qualifies («Отправлен · Оплатить до 14 октября»).

## 4. Surfaces

- Inside the app the content panel is the page (layer 0 of the surface ladder); a `Card` on it is
  layer 1, and fields take the fill of the layer they sit on. The kit sets this by context — never set backgrounds.
- **Card when** the block stands alone and has its own title: a KPI tile, a settings panel, facts in a
  side column, a chart. **No card when** the block is the only thing in its region: a section heading
  and the content are enough.
- `DataTable` is already a filled block — never inside a Card. No card in a card. No borders around
  blocks; `Divider` only inside a block (list rows, a form and its footer).
- Floating layers (menus, popovers, dialogs) come only from kit overlays.

## 5. Density and size

- `m` everywhere by default — omit `size`. Change the tier for a whole region, never for one control:
  a dense back-office table may be `s` with its toolbar; a sign-in card may be `l`.
- One row = one size: everything in a toolbar or an actions row lines up.
- A control nested in another component's row is one tier down: buttons and menus in table cells `s`,
  a segmented switch in a card header `s`. Kit hosts (Popover, Banner, LoginForm, the DataTable toolbar)
  size their `Button.Root` / `Input.Root` children themselves.

## 6. Actions

- **One primary per area** (page header, card, dialog, form): `solid`, last in its row. Secondary:
  `soft` + `tone="neutral"`. Dismiss / revert: `ghost` + `neutral` in pages and cards, `outline` +
  `neutral` in Modal / Drawer footers. Rare actions: a `Dropdown` behind an `action.more` icon button —
  `soft` + `neutral` in a header row (it has a shape beside the other buttons), `ghost` size `s` in a
  table cell.
- Placement: page actions in `PageContent.Actions`; card actions in `Card.Footer`; dialog actions in
  `Modal.Footer` / `Drawer.Footer`; row actions in the last column; bulk actions in the table toolbar.
- An empty state's action replaces the header's primary, it does not duplicate it.
- Destructive: `tone="danger"`; a standalone trigger is `outline`, in a menu it is the last item, the
  confirm is a Modal with `closeOnOutsideClick={false}` and a `solid` danger button.
- Going somewhere is a link (`LinkButton`, `Button.Root asChild` + `<a>`), doing something is a Button.
  One action — one label on the whole screen.

## 7. Forms

- Labels above every field (`label`), placeholder is an example value, help in `hint`, problems in
  `error` — after blur or on submit. Mark the minority (`required` or `optional`).
- Fields 20 apart; related short fields side by side in an `auto-fit` grid with `align-items: start`
  (`reserveSupportRow` on Input / Textarea keeps neighbours aligned); groups 32 apart, each with a
  `title-s` heading 16 above its fields; no dividers between groups.
- Form column width: one column up to ~65ch; never stretch a form across a wide panel.
- Where: ≤ 4 fields → `Modal`; long create / edit → `Drawer` or a page; settings → a panel Card per
  section, the whole `Card.Root` inside `<form>`, buttons in `Card.Footer`.
- Submit: `noValidate`, validate all, set `error`s, focus the first invalid field, `loading` on the
  submit button and the fields disabled (each field's `disabled`, or one `<fieldset disabled>` around
  them), then a `Notification`.
- A footer button outside the form submits it with `form={formId}`.
- Choice controls: Checkbox when the value is submitted later, Switch when it applies at once (no Save
  in that section), `Radio.Group label` for one of 2–5 visible options.

## 8. Tables and lists

- A list page is `DataTable` with the filters in its `toolbar` — `SmartFilter.Toolbar` and
  `SmartFilter.Chips` inside `SmartFilter.Root` (or one SegmentedControl / Select for a single field).
- Paging is built in: `paging="pages"` (default, Pagination and the «Показано 1–6 из 10» range in the
  footer), `paging="infinite"` for feeds, `paging="none"` for short lists on dashboards and details.
- Columns: `numeric` for amounts, counts and dates (end-aligned, tabular; `headerAlign="end"` to line the
  head up); statuses as `Badge` from one status → color map; an avatar + two-line cell for people and
  companies; row menu last.
- States in place: `loading` (+ `loadingRows`) while there are no rows, `empty` for nothing found
  (string → compact EmptyPage, or your own `EmptyPage size="s"` with «Сбросить фильтры»), `error` for a
  failed load. The head and toolbar stay.
- Phones: the table scrolls inside itself, `stickyFirstColumn` keeps the key column; never let the page
  scroll sideways. Short lists of objects can be `Card variant="list"` instead of a table.

## 9. Feedback

| Situation | Component |
|---|---|
| the result of an action (saved, sent, failed to save) | `Notification` via `notify()` |
| a state of the page or a section that persists (sync failed, trial ends, read-only) | `Banner` as the first block of `PageContent.Body` (or inside the Card it concerns) |
| a problem with one field | the field's `error` |
| a region failed to load | the region shows it in place: DataTable `error`, `EmptyPage` with `EmptyPage.Icon tone="danger"` and «Повторить» |
| a region is loading | DataTable `loading`; otherwise a `Skeleton` in the geometry of the content + `aria-busy` on the region; `Spinner` only when there is no shape to hold |
| a region changes state (loading → data → empty → error, another record) | its content in `Crossfade state={status}` — always, so the change flows instead of flipping |
| nothing here yet (first run) | `EmptyPage` with one action (`tone="accent"` icon for a call to start) |
| nothing matches the filter | the table's `empty`, with a reset action |

Stale data beats an empty block: show the last known values and say when they are from.

State change is continuous across the kit: a region never jumps from one state
to the next. Give every region its states, render them inside `Crossfade`, and let the loading state
mirror the data's rows and gaps with `Skeleton`, so the swap moves nothing on the page.

## 10. Overlays

| Need | Use |
|---|---|
| a blocking decision or a short form | `Modal` (`size="s"` for confirms) |
| a long form, filters, record details beside the page | `Drawer` |
| a small non-modal panel at a control | `Popover` |
| a list of actions | `Dropdown` |
| a value for a field | `Select` / `NativeSelect` / `TagSelect` / `Datepicker` |
| a name for an icon button | `Tooltip` |
| search across commands and pages (⌘K) | `CommandMenu` |

Every overlay takes `closeOnOutsideClick` / `closeOnEscape`; turn them off for destructive confirms and
while a request runs.

## 11. Narrow screens

- Layouts are intrinsic: `repeat(auto-fit, minmax(min(100%, …), 1fr))` grids and flex-wrap with a large
  `flex-grow` on the main column — no breakpoints needed, and they work in any container. Media queries
  only for app-frame decisions (the phone menu header) at 640 · 768 · 1024 · 1280.
- From 320px: header actions wrap under the title (built in), side columns drop below the main one,
  pairs of fields stack, tables scroll inside themselves, dialogs stack their footers (built in).
- A page with sections, filter and search, a view switch and the primary action gets `PageToolbar`:
  one row when wide, exactly two rows when narrow, the primary action always top right.
- Rearrange, never hide: every function of the desktop screen is on the phone — in another place or a
  menu. App sections on phones: `BottomNav` in `AppShell.Footer`; app-level sheets:
  `Drawer.Content side="bottom"`.
- Text in flex rows gets `min-width: 0`; long names wrap or truncate, never widen the page.
- The full rules and the narrow-screen checklist: [responsive.md](responsive.md).

## 12. Motion

Kit components already move: press, hover, selection, open/close, enter/exit, label morph, rolling
counters, progress and hold fills. Add nothing on top of them. When to move your own elements at all,
the tokens and the recipes: [motion.md](motion.md).

## 13. Screen-level anti-slop

What makes a screen look generated, with bad → good code: [anti-slop.md](anti-slop.md).

## 14. When the kit has no ready component

Go down this ladder and stop at the first step that works.

1. **Find it in the kit.** Search [components.md](components.md), then the Variants and Anatomy of the
   closest component: Card has 7 templates, Input has icons / affixes / a clear button / a counter / a strength meter,
   Select has rich items and search, Dropdown has a profile header, DataTable has a toolbar slot, nested
   rows and a detail row (`renderExpanded`), Sparkline is a small trend chart, Kanban a status board.
2. **Compose kit parts.** Put existing components together on a layout wrapper (CSS Module, `gap` on
   tokens). Most "missing components" are a Card + Typography + Button arrangement.
3. **Last resort: a new element on tokens.** Only when 1–2 cannot express it (a chart with axes and
   several series, a map).

Rules for your own component:

- Lives in the consumer project (`shared/ui/<name>/` or the project's equivalent), not inside
  `node_modules`.
- Follows API v1 ([api-contract.md](api-contract.md)): `size` (default `m`), `tone`/`color`, `X.Root` +
  `X.Part` when it has parts (a single export when it has none), `hint` / `error` props, `labels` for
  system strings, `data-*` for state.
- Styled with a CSS Module on `--prime-*` tokens. Bounded block: a `Card`, or a plain tile on
  `--prime-color-layer-nested` + `--prime-card-radius`. Never override kit internals or reach into their class names.
- **Threshold:** a pattern used twice becomes a component. Two things that look the same are one
  component with a variant, never two components or two hand-written copies.

### Worked example: a metric panel with a period switch

The kit has the metric templates; the switch is a composition: `Card.Root variant="panel"` + a
SegmentedControl right after `Card.Title` in `Card.Header`, one tier down because it sits in the card's
header row.

```tsx
import { Card, SegmentedControl } from "prime-ui-kit";

export function RevenuePanel() {
  return (
    <Card.Root variant="panel">
      <Card.Header>
        <Card.Title as="h2">Выручка</Card.Title>
        <SegmentedControl.Root size="s" defaultValue="month" aria-label="Период">
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Card.Header>
      <Card.Body>
        <Card.Value>4,2 млн ₽</Card.Value>
        <Card.Delta tone="success">+18% к прошлому месяцу</Card.Delta>
      </Card.Body>
    </Card.Root>
  );
}
```

For a plain KPI row use `Card.Root variant="stat-trend"` (Label · Value · Delta) in an `auto-fit` grid —
see [patterns/dashboard.tsx](patterns/dashboard.tsx). When the trend over days matters, put a
`Sparkline` in the `Card.Body` instead: it brings the value, the change and a line to scrub.
