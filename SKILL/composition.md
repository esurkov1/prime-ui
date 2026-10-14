# Composition — how a screen is assembled

A screen made from the kit looks finished when every block sits on the same few rules: one skeleton,
one rhythm, one size, one primary action, fill instead of lines, and a state for every region. This
file is those rules; the [screens](#screens) are the same rules as working pages.

## Screens

**Start from a screen.** Each one is a complete page (React + one CSS module on tokens), copyable as
is: the `screen.tsx` example of the component it is built around (`examples/screen.tsx` next to
`examples/screen.module.css`), shown live with its code as the «Экран» example on that component's
playground page. What each screen teaches is in [Screen rules](#screen-rules) at the end.

| Screen | Main component | File | Shows |
|---|---|---|---|
| [List page](#list-page) | data-table | [screen.tsx](../src/components/data-table/examples/screen.tsx) | the title, a line of figures, SmartFilter search and filters, export and one primary action in the AppHeader; statuses, row menu, pages, filtered empty state |
| [Detail page](#detail-page) | description-list | [screen.tsx](../src/components/description-list/examples/screen.tsx) | a nested record: Breadcrumb, the title with status and due date and the record's actions by weight in the AppHeader; main column + side column of Cards, Timeline |
| [Settings page](#settings-page) | page-content | [screen.tsx](../src/components/page-content/examples/screen.tsx) | heading column + panel per section, form with its own save, Switches that apply at once, danger zone with a confirm |
| [Form in a Drawer](#form-in-a-drawer) | drawer | [screen.tsx](../src/components/drawer/examples/screen.tsx) | the title, counts, search and the Drawer trigger in the AppHeader; Drawer form: groups, errors on submit, focus on the first invalid field, loading, toast |
| [Record editor](#record-editor) | field-list | [screen.tsx](../src/components/field-list/examples/screen.tsx) | a document page (a long form): the title, a line of description and «Сохранить тариф» in `PageContent.Header`; a plan card edited in aside sections: name and description, specs in a `FieldList` (icon-only `Select` and `ColorPresets` in compact columns, pinned rows, reorder), the price and its changes by month in one list with the base row pinned, a setup fee in three currencies in one row under one heading, save with «Сохранено» on the button |
| [Dashboard](#dashboard) | card | [screen.tsx](../src/components/card/examples/screen.tsx) | title + a line of data in `AppHeader`, period switch and report in its `PageToolbar`; KPI row that cross-fades to the new period, a Sparkline revenue trend, invoiced vs paid in a ChartFrame, panels with progress and a split, short table + link to the list |
| [Screen states](#screen-states) | crossfade | [screen.tsx](../src/components/crossfade/examples/screen.tsx) | title + the statement date in `AppHeader`, page error in a Banner with retry, region loading with a Skeleton, Crossfade between states, table error in place, first-run EmptyPage |
| [Messenger](#messenger) | chat | [screen.tsx](../src/components/chat/examples/screen.tsx) | title + the unread count in `AppHeader`; a full-height PageContent.Split of a `ChatList` with its search (live last message, ticks, unread counts, «печатает…») and a `Chat`: `Chat.Header` with the back button, avatar, title, the status that turns into «печатает…» (`typing`) and the search button, `Chat.Search`, `Chat.Messages` from `items` + a stable `renderMessage` (dates, runs and the unread band from the data, history loaded above with `hasOlder` / `onLoadOlder`, a first load in skeletons), text, a photo, a file and sent voice, reply and edit from the menu through `Composer.Context value` (`replyTo` / `editOf`), the jump to the quoted message (`Message.Reply target`), optimistic sends whose messages rise from the composer while the client's answer slides in, «печатает…» both ways (`onActivityChange` → `Chat.Root typing`), unread counts from `onNewMessage` and `onRead`, the Composer with attachments in `Chat.Footer` |
| [Sales pipeline board](#sales-pipeline-board) | kanban | [screen.tsx](../src/components/kanban/examples/screen.tsx) | AppHeader titles the page (`h1` + a Description with the open deals and their sum) and carries a PageToolbar with SmartFilter search, a board / list SegmentedControl and the one primary action; Crossfade between a `plain` Kanban (stages without wells, deal cards on the page) and a DataTable of the same deals, column totals in `renderColumnMeta`, moves saved through an `onValueChange` promise that the server can refuse, the deal in a Drawer with a DescriptionList and stage actions, skeleton first load |
| [App frame](#app-frame) | app-shell | [screen.tsx](../src/layout/app-shell/examples/screen.tsx) | Sidebar rail on a wide screen, floating BottomNav in `AppShell.Footer` on a phone («Ещё» opens the Sidebar panel), AppHeader with the menu button and the page title (`h1`) with a line of data, counts on items, a home page that cross-fades between sections |
| [Media library](#media-library) | file-upload | [screen.tsx](../src/components/file-upload/examples/screen.tsx) | AppHeader titles the page (`h1` + a Description with the object) and carries a PageToolbar with sections and counts, search (`SmartFilter` with `fields={[]}`), order and «Загрузить»; uploads through `useUploadQueue` in `FileUpload` tiles (`trigger="tile"`, `layout="grid"`) with progress, a failure and retry, a done file moving into the library; a grid of `Thumbnail` / `Thumbnail.Video` tiles that open `MediaViewer` out of the tile (`getOrigin`, `thumbnails`, `renderActions`) or, in selection mode, are picked (`checked`) for bulk download and a `ConfirmDialog` delete; a Skeleton first load and a filtered `EmptyPage` in a `Crossfade` |
| [Resource schedule](#resource-schedule) | gantt | [screen.tsx](../src/components/gantt/examples/screen.tsx) | AppHeader titles the page (`h1` + a Description with the people shown) and carries a `PageToolbar` with search, role / client filters, team sections and «Назначить» over a full-height `Gantt` (`scrollHeight="fill"`); people with avatars, client hues, lanes for overlaps, locked absences and milestones; moves saved through an async `onBarChange` or refused and glided back, new work drawn with `onBarCreate` and named in a Modal (cancel fades the ghost), `onSelect` details in a Drawer with a `DescriptionList` and a confirmed removal, `loading` and filtered `empty` |

Pick the closest one, rename the domain, keep the skeleton. Change structure only when the task needs
it, and then by the rules below.

## 1. Page skeleton

**One title per page, and it lives in the page's header.** Every app page titles itself in the
app header: `AppHeader.Title` is the page's only `<h1>`, an `AppHeader.Description` under it
is one line that carries data («Среда, 14 октября · 3 задачи», «Отправлен · оплатить до 14 октября»),
and a nested record puts the path up (`Breadcrumb` + `AppHeader.Separator`) before it. The header row
belongs to the page: it holds only what the current page needs — its title, its own buttons in
`AppHeader.Actions`, and its tools as a `PageToolbar.Root` in `AppHeader.Tools` (the page's own
search and filters, sections, the view, the primary action). Main has no `PageContent.Header`.

**A document page** — settings, a long form, an article or help text — is the one exception: its big
title is `PageContent.Header` in main (`PageContent.Title` is the `<h1>`, one sentence of
`PageContent.Description`, the page's save action in `PageContent.Actions`), and the header carries
no title. Never two titles; never no `<h1>`.

```
AppShell.Root                      once per app (layouts.md#app-frame-once-per-app)
├─ AppShell.Nav → Sidebar          navigation rail, one layer above the page
├─ AppHeader.Root                  the page's header: only what this page needs
│  ├─ AppHeader.Start
│  │  ├─ AppHeader.MenuButton      opens the Sidebar below 768px
│  │  ├─ Breadcrumb + Separator    only on a nested record: the path up
│  │  └─ AppHeader.Title           the one h1 + AppHeader.Description: a line of data
│  ├─ AppHeader.Actions            the page's own buttons (export, a more menu)
│  └─ AppHeader.Tools              second row → PageToolbar.Root: search and filter, sections,
│                                  view, the primary action; Chips under them
└─ AppShell.Main                   gutters + top air (24, 32 from 1024px); the page renders here
   └─ PageContent.Page | Root      the page you deliver
      └─ PageContent.Body          blocks 24 apart, starting at main's top air
         ├─ PageContent.Grid       every tile of the screen, 16 on both axes
         │  └─ PageContent.Cell    span (of 12), rows; the tile fills it
         └─ PageContent.Section    a new topic: h2 label (+ Actions), 40 from its neighbours

Document page: the header without a title, and in main
   └─ PageContent.Root maxWidth="wide" | "readable"
      ├─ PageContent.Header        the one h1, a sentence of description, the page's save action; 24 above the body
      └─ PageContent.Body
```

- A screen component renders its page: its `AppHeader.Root` (through the shell's `header`) and its
  body. Styles, `applyTheme`, `NotificationProvider` and `AppShell` live at the app root.
- `PageContent.Page` for app pages (full panel width); `PageContent.Root maxWidth="wide"` for
  settings, `maxWidth="readable"` for one narrow column of text or fields.
- No outer padding, no margins: `AppShell.Main` has the gutters and the top air under the header,
  `PageContent` has block → block 24, section → section 40, tile → tile 16 (and header → body 24 on
  a document page). Your CSS lays out only the inside of a block.

```tsx
import {
  AppHeader,
  Button,
  Dropdown,
  Icon,
  PageToolbar,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
} from "prime-ui-kit";

type OrdersHeaderProps = {
  fields: SmartFilterField[];
  filter: SmartFilterValue;
  onFilterChange: (value: SmartFilterValue) => void;
  search: string;
  onSearchChange: (search: string) => void;
};

export function OrdersHeader({ fields, filter, onFilterChange, search, onSearchChange }: OrdersHeaderProps) {
  return (
    <AppHeader.Root>
      <AppHeader.Start>
        <AppHeader.Title>
          Заказы
          <AppHeader.Description>128 в работе · 6 ждут оплаты</AppHeader.Description>
        </AppHeader.Title>
      </AppHeader.Start>
      <AppHeader.Actions>
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral" aria-label="Другие действия">
              <Button.Icon>
                <Icon name="action.more" />
              </Button.Icon>
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item>Настроить колонки</Dropdown.Item>
            <Dropdown.Item>Импорт из CSV</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </AppHeader.Actions>
      <AppHeader.Tools>
        <SmartFilter.Root
          fields={fields}
          value={filter}
          onValueChange={onFilterChange}
          search={search}
          onSearchChange={onSearchChange}
        >
          <PageToolbar.Root aria-label="Заказы">
            <PageToolbar.Tools>
              <SmartFilter.Toolbar />
            </PageToolbar.Tools>
            <PageToolbar.Actions>
              <Button.Root>
                <Button.Icon>
                  <Icon name="action.add" />
                </Button.Icon>
                Создать заказ
              </Button.Root>
            </PageToolbar.Actions>
            <PageToolbar.Chips>
              <SmartFilter.Chips />
            </PageToolbar.Chips>
          </PageToolbar.Root>
        </SmartFilter.Root>
      </AppHeader.Tools>
    </AppHeader.Root>
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
| heading → its content (group, section) | 16 | `--prime-space-4` (`PageContent.Section` does it) |
| tile → tile, both axes (KPI, charts, panels) | 16 | `PageContent.Grid` |
| field → field, switch → switch | 20 | `--prime-space-5` |
| main column → side column | 24 | `--prime-space-6` |
| app header → the page's first block | 12 + 24, 12 + 32 from 1024px | the header's bottom air + `AppShell.Main` top air |
| page header → body (a document page) | 24 | `PageContent.Header` |
| block → block on a page | 24 | `PageContent.Body` |
| group → group in a form | 32 | `--prime-space-8` |
| section → section (a new topic with an `h2`) | 40 | `PageContent.Section` |

A screen with one gap everywhere reads as a list of unrelated things. Use at least three levels: inside
an item, between items, between blocks. The tiles of one screen are one board: put them all in one
`PageContent.Grid` (one gap on both axes), never a grid per row — and keep the large air for a new topic
with its own heading (`PageContent.Section`).

## 3. Hierarchy — air first, then type

Hierarchy comes from space and a handful of type roles, not from size jumps, color or weight tricks.

| Text | Use |
|---|---|
| page title | `AppHeader.Title` (the only `h1`); on a document page `PageContent.Title` (`heading-m`) instead |
| section heading without a card | `PageContent.Section label` (an `h2` in `title-m`) |
| card / panel title | `Card.Title as="h2"` (under the page title) |
| heading of a group of fields | `Fieldset label` (`title-s` in the `<legend>`) |
| other group heading inside a card | `Typography as="h3" variant="title-s"` |
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

- **One primary per area** (the page, card, dialog, form): `solid`, last in its row. Secondary:
  `soft` + `tone="neutral"`. Dismiss / revert: `ghost` + `neutral` in pages and cards, `outline` +
  `neutral` in Modal / Drawer footers. Rare actions: a `Dropdown` behind an `action.more` icon button —
  `soft` + `neutral` in a header row (it has a shape beside the other buttons), `ghost` size `s` in a
  table cell.
- Placement: the page's primary action in `PageToolbar.Actions` in `AppHeader.Tools`, its other buttons in `AppHeader.Actions` (a document page: `PageContent.Actions`); card actions in `Card.Footer`; dialog actions in
  `Modal.Footer` / `Drawer.Footer`; row actions in the last column; bulk actions in the table toolbar.
- An empty state's action replaces the header's primary, it does not duplicate it.
- Destructive: `tone="danger"`; a standalone trigger is `outline`, in a menu it is the last item, the
  confirm is a `ConfirmDialog` (its `onConfirm` returns the request's Promise).
- Going somewhere is a link (`LinkButton`, `Button.Root asChild` + `<a>`), doing something is a Button.
  One action — one label on the whole screen.

## 7. Forms

- Labels above every field (`label`), placeholder is an example value, help in `hint`, problems in
  `error` — after blur or on submit. Mark the minority (`required` or `optional`).
- Records of one shape that a person adds, edits and removes are a `FieldList`: one row per record,
  the column headings once above the rows, small attributes (an icon, a color) in `compact`
  columns. Never a label in every row, never numbered labels, never one record split over lines.
- One value in several units is one row of fields under one heading, each unit in its field's
  `Input.InlineAffix`; a base value with overrides is one `FieldList` with the base pinned first.
  The shape of the data decides the layout: [ux.md](ux.md#2-the-shape-of-the-data-decides-the-layout).
- Fields 20 apart; related short fields side by side in an `auto-fit` grid with `align-items: start`
  (`reserveSupportRow` on Input / Textarea keeps neighbours aligned); groups 32 apart, each a
  `Fieldset label` (its `title-s` heading 16 above the fields, no frame); no dividers between groups.
- Form column width: one column up to ~65ch; never stretch a form across a wide panel.
- Where: ≤ 4 fields → `Modal`; long create / edit → `Drawer` or a page; settings → a panel Card per
  section, the whole `Card.Root` inside `<form>`, buttons in `Card.Footer`.
- Submit: `noValidate`, validate all, set `error`s, focus the first invalid field, `loading` on the
  submit button and the fields disabled (one `Fieldset disabled` per group of fields), then the
  result: the form stays on screen → the button says «Сохранено»; the form goes away (closes,
  navigates) → a `Notification`; a failure → a `Notification` or the field's `error`.
- A footer button outside the form submits it with `form={formId}`.
- Choice controls: Checkbox when the value is submitted later, Switch when it applies at once (no Save
  in that section), `Radio.Group label` for one of 2–5 visible options.

## 8. Tables and lists

- A list page is `DataTable` with the filters in its `toolbar` — `SmartFilter.Toolbar` and
  `SmartFilter.Chips` inside `SmartFilter.Root` (or one SegmentedControl / Select for a single field).
- Where the filters go: tools of one table live in its `toolbar`; when the page itself carries
  sections with counts, a view switch (board / list, grid / list) or filters that drive more than one
  table — a board, a schedule, a media grid — the page gets `PageToolbar` and the table keeps only its
  own tools (`DataTable.ColumnsMenu`).
- Paging is built in: `paging="pages"` (default, Pagination and the «Показано 1–6 из 10» range in the
  footer), `paging="infinite"` for feeds, `paging="none"` for short lists on dashboards and details.
- When the server holds more than you load (a CRM list, a register): `source="server"` — `rows` is the
  page the server returned, `rowCount` its total; `sort` / `page` / the SmartFilter value make the
  request, a new search or filter sets `page` to 1, and the old rows stay with `loading` until the
  answer comes ([server.tsx](../src/components/data-table/examples/server.tsx)).
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
| the result of an action (sent, created, failed to save; saved when the form goes away) | `Notification` via `notify()` |
| a form saved and still on screen | the submit button's text: «Сохранено» |
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
| a short task that ends by itself: a pick, an action, a short note | `Sheet` |
| a small non-modal panel at a control | `Popover` |
| a list of actions | `Dropdown` |
| a value for a field | `Select` / `NativeSelect` / `TagSelect` / `Datepicker` |
| a name for an icon button | `Tooltip` |
| search across commands and pages (⌘K) | `CommandMenu` |

Every overlay takes `closeOnOutsideClick` / `closeOnEscape`. A destructive confirm is `ConfirmDialog`, which
turns them off itself; a form in a Modal or Drawer holds closing with `Modal.Guard` / `Drawer.Guard`
(`busy` while a request runs, `dirty` for unsaved changes).

## 11. Narrow screens

- Layouts are intrinsic: `repeat(auto-fit, minmax(min(100%, …), 1fr))` grids and flex-wrap with a large
  `flex-grow` on the main column — no breakpoints needed, and they work in any container. Media queries
  only for app-frame decisions (the phone menu header) at 640 · 768 · 1024 · 1280.
- From 320px: the page's tools wrap under the header title and the primary action takes its own row when the search would be squeezed (built in), side columns drop below the main one,
  pairs of fields stack, tables scroll inside themselves, dialogs stack their footers (built in).
- A page with search and filter, sections, a view switch and the primary action gets `PageToolbar`:
  search and filter first with the active filters under the top row, one row when wide, stacked rows
  12 apart when narrow; the primary action at the top row's end, on its own row on a phone.
- Rearrange, never hide: every function of the desktop screen is on the phone — in another place or a
  menu. App sections on phones: `BottomNav` in `AppShell.Footer`; a short task from the bottom
  edge: `Sheet`.
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

For a plain KPI row use `Card.Root variant="stat-trend"` (Label · Value · Delta), each in a
`PageContent.Cell span={3}` of the page's `PageContent.Grid` — see [the dashboard screen](../src/components/card/examples/screen.tsx). When the trend over days matters, put a
`Sparkline` in the `Card.Body` instead: it brings the value, the change and a line to scrub.

## Screen rules

What each screen in [the index](#screens) demonstrates — keep these when you start from it.

### List page

[data-table/examples/screen.tsx](../src/components/data-table/examples/screen.tsx)

- The page lives in the `AppHeader`: `AppHeader.Title` is the only heading, its `AppHeader.Description` is one line of figures («10 счетов · просрочено 2 на …»), not a sentence about the page; main has no `PageContent.Header`.
- The tools are `AppHeader.Tools` → `SmartFilter.Root` around a `PageToolbar.Root`: `SmartFilter.Toolbar` in `PageToolbar.Tools`, `SmartFilter.Chips` in `PageToolbar.Chips`, export (an icon-only `soft` + `neutral` button) and the one primary action (`solid`, last) in `PageToolbar.Actions`. The table itself has no `toolbar`.
- A status is a `Badge` with one color per meaning across the product (`STATUS` is one map); the text carries the meaning, the color repeats it.
- Numbers and dates are `numeric` columns with `headerAlign="end"` (tabular figures, values and heading on the end edge). On a phone the table scrolls inside itself and `stickyFirstColumn` keeps the number in place — the page never scrolls sideways.
- Row actions are a `Dropdown` behind an `action.more` icon of size `s`: controls in cells are one tier below the table. Delete is `tone="danger"` at the end of the menu.
- Empty after a filter is the table's `empty` with `EmptyPage size="s"` and a «Сбросить фильтры» action; the header and the filters stay in place.

### Detail page

[description-list/examples/screen.tsx](../src/components/description-list/examples/screen.tsx)

- A nested record titles itself in the `AppHeader`: `AppHeader.Start` holds the path up (`Breadcrumb` with the list, «Счета»), an `AppHeader.Separator` and `AppHeader.Title` with the record's name; main has no `PageContent.Header`. Top-level pages have no breadcrumb.
- The status is words next to the fact that matters now, in `AppHeader.Description` («Отправлен · оплатить до 14 октября»), not a separate plate.
- The record's actions are the header's tools row: `AppHeader.Tools` → `PageToolbar.Root` → `PageToolbar.Actions`, by weight: one primary (`solid`, last), the secondary `soft` + `tone="neutral"`, rare and destructive ones in a `Dropdown` behind an `action.more` icon (also `soft`, so the button has a shape beside its neighbours); voiding is `tone="danger"` at the bottom of the menu.
- Columns are a CSS module on flex-wrap without breakpoints: the main one grows, the side one holds ~18rem and drops below when the main one runs out of room.
- A section without a frame is `PageContent.Section label`: an h2 heading 16 px above the table; `Card variant="panel"` only for standalone blocks of the side column. A table is already a filled block — never put it in a card.
- «Label → value» pairs about the client are `DescriptionList.Root orientation="vertical"` with `DescriptionList.Item label`; amounts are tabular figures, the total is larger (`title-m`) and ends where the «Сумма» column ends (the table cell inset).
- History is a `Timeline`: events top-down from the latest, dates in `Timeline.Meta`; a row highlights on hover.

### Settings page

[page-content/examples/screen.tsx](../src/components/page-content/examples/screen.tsx)

- A section is `PageContent.Section layout="aside"`: a heading column (`label` + a line of `description`) and a `Card variant="panel"` panel; sections are 40 px apart; on a narrow screen the column moves above the panel by itself (flex-wrap, no breakpoints).
- The form wraps the whole `Card.Root` in `<form noValidate>`; the buttons are in `Card.Footer`: «Отменить изменения» `ghost` + `neutral`, then the primary «Сохранить». While the request runs — `loading` on the button, and one `Fieldset disabled` turns the fields off; the form stays on screen, so success is the button text «Сохранено» for two seconds, without a notification.
- Fields are 20 px apart; two short related fields side by side while there is width, with `align-items: start` and `reserveSupportRow`, so an error does not shift the neighbour.
- An error comes through the field's `error` after submit, not while typing; a format hint goes in `hint`.
- A `Switch` applies at once — its section has no «Сохранить» button; the explanation is in the switch's own `hint`.
- The danger zone is the last section: an `outline` + `tone="danger"` button in `ConfirmDialog.Trigger`; `onConfirm` returns the delete Promise — the dialog holds `loading` itself, disables cancel and does not close while the request runs.

### Form in a Drawer

[drawer/examples/screen.tsx](../src/components/drawer/examples/screen.tsx)

- The page lives in the `AppHeader`: `AppHeader.Title` with the counts in `AppHeader.Description`, the search (`SmartFilter` with `fields={[]}`) in `PageToolbar.Tools`; main has no `PageContent.Header`.
- The opening button is the page's primary action in `PageToolbar.Actions`; `Drawer.Trigger` wraps it as a slot.
- The form is tied to the footer button through `form={formId}`: `Drawer.Footer` is outside the `<form>`, and submitting still works, by Enter too.
- Groups are a `Fieldset` without a frame with a `title-s` heading 16 px above the fields; 32 px of air between groups, no dividers. `Fieldset disabled` turns all the fields off while the request runs.
- Validation on submit: errors in each field's `error`, focus on the first invalid field; mark the minority: required fields are the majority, so `optional` stands only on the optional ones.
- The client type is a `Radio.Group` with `label` (two visible options), the manager a `Select`, consent a `Checkbox` with `hint`: the value goes with the form, it does not apply at once.
- Footer: «Отмена» `outline` + `neutral`, the primary action last, in `loading` during the request; closing is held by `Drawer.Guard` (`busy` — while saving, neither Escape nor the close button closes; `dirty` — after an edit it asks whether to discard the changes).
- The result is a `Notification` and a new row in the table; the panel closes by itself.

### Record editor

[field-list/examples/screen.tsx](../src/components/field-list/examples/screen.tsx)

- A record editor is a document page — a long form read top to bottom in aside sections, like Settings — so its title stays in content: `PageContent.Header` with the title, one line of description and the primary action; the app header only says where you are and holds no second title.
- The shape of the data decides the layout: records a person adds and removes are a `FieldList`, one row per record; the column headings stand once above the rows, and the fields in the cells take them as their labels.
- No label in every row and no numbered one («Преимущество 1»): a one-column list has no headings at all — its section names it ([reorder.tsx](../src/components/field-list/examples/reorder.tsx)).
- Small attributes of a record go in compact columns of its row: the icon is a `Select` with only `Select.TriggerIcon`, the color `ColorPresets`; the first specs are pinned (`getLocked`) — the lock says so itself, without explanatory text.
- The base price and its changes are one list: the base row is pinned first and shows when it applies, the changes are rows with a month and a price; the ruble sign is in the field (`Input.InlineAffix`), not in every heading.
- One value in three currencies is three fields in one row under one group heading, each with its own name for screen readers and the currency inside the field.
- The lists live in the page state, the name and description fields in the `<form>` of the first section; the primary «Сохранить тариф» in the header is tied to it through `form={formId}` and saves everything. While the request runs the fields and the lists are off (`Fieldset disabled`, `disabled`), afterwards «Сохранено» on the button.

### Dashboard

[card/examples/screen.tsx](../src/components/card/examples/screen.tsx)

- The header carries the page: `AppHeader.Title` «Обзор» with an `AppHeader.Description` line of data (what and as of when), the page's tools in `AppHeader.Tools` as a `PageToolbar.Root`; main has no `PageContent.Header`, its body starts with the tiles.
- The period is a `SegmentedControl` in `PageToolbar.View`, the report a `soft` + `neutral` button in `PageToolbar.Actions`: the period changes the values on this same screen. Tabs (`Tabs`) are for different content, not for a period.
- Every tile of the screen is one `PageContent.Grid`: KPI `Card variant="stat-trend"` in `PageContent.Cell span={3}`, 16 px on both axes; `Card.Delta` with a `tone` by the meaning of the change: overdue growing is `danger`, its decline `success`.
- Another period — other values: each KPI tile is wrapped in `Crossfade state={period}` and flows instead of blinking.
- A trend over days is a `Sparkline` in a `Card` in a full-width cell: the last value, the change and a line you can scrub with a finger; a new series appears by itself.
- A chart with axes and several series is a `ChartFrame` in `PageContent.Cell span={8} rows={2}` beside two panels; `ChartFrame.Plot height="fill"` takes their height. A sized plot area (`renderPlot`), a legend that turns series off and a table for screen readers; series colors come from `series`, never your own.
- Panels are `Card variant="panel"` with `Card.Title as="h2"` in `Card.Header` and quiet context on the right after the title (`caption` + `muted`).
- Progress of one value is a `ProgressBar` with `label` and `showValue`; parts of a whole are `ProgressBar segments` with `legend` and `formatValue`: statuses are colored by `tone`, categories by `color`.
- Tiles of one screen are 16 px apart (`PageContent.Grid`), page blocks 24 px (`PageContent.Body`), a new topic with a heading 40 px (`PageContent.Section`): proximity shows what is related.
- A short list is a `DataTable paging="none"` in `PageContent.Section label` without a card; «Все счета» is a `LinkButton` in the section's `PageContent.Actions`: it is a way somewhere, not an action.

### Screen states

[crossfade/examples/screen.tsx](../src/components/crossfade/examples/screen.tsx)

- The header carries the page: `AppHeader.Title` with an `AppHeader.Description` line of data — the accounts and the date of the statement the screen stands on; main has no `PageContent.Header`.
- An error that concerns the whole page is a `Banner tone="danger"` as the first block of `PageContent.Body` with a «Повторить» action; the action's result is a `Notification`.
- A region's error is in the region's place: `error` on the `DataTable` (the table head stays), not a pop-up.
- Table loading is `loading` + `loadingRows` (a skeleton of rows); card loading is a `Skeleton` in the shape of its rows and `aria-busy` on the card, and the block's height does not change. The state change is smooth: the card's region is in `Crossfade state={status}`, the table body changes by itself.
- Stale data beats emptiness: the balances are shown as of the previous date, and that is said on the right in `Card.Header`.
- Empty on the first run is `EmptyPage size="s"` inside the panel: an icon with `tone="accent"`, what it is and why, one action. An empty filter result is the table's `empty`.
- No home-made spinners, shimmers, grey placeholders or error modals: the kit already has a component for every state.

### Messenger

[chat/examples/screen.tsx](../src/components/chat/examples/screen.tsx)

- A work screen: the title «Поддержка» is `AppHeader.Title` with the unread count in `AppHeader.Description`; main has no `PageContent.Header`.
- Layout: `PageContent.Split` in a `fill` page: the dialog list `ChatList` (last message, ticks, unread, «печатает…») and the conversation beside it; on a narrow panel one pane at a time with `PageContent.BackButton` in `Chat.Header`.
- Search over the dialogs is the field of `ChatList` itself: `search` and `onSearchChange`; you filter the list (by name and last message), and the list shows the match in rows, the number found and an empty result itself. Never put a field of your own above the list.
- The conversation is `Chat.Root` in the pane's card: the header, `Chat.Search`, `Chat.Messages` and `Chat.Footer` with the Composer. Never assemble your own header, `ScrollContainer` and feed — the chat links search, jumps, selection and «печатает…» itself.
- Messages are data: `items` with `getKey`, `getAuthor`, `getDate` (service events through `isService`), the first unread is `unread`; the feed computes dates, runs, tails and the avatar place. `renderMessage` in `useCallback`: only the changed message re-renders.
- History is `hasOlder` and `onLoadOlder` with a promise: while it runs, a bubble-shaped `Skeleton` placeholder stands on top, and the view does not jump.
- Each kind of message is its own part of `Message`: text with markup, photos and albums, a file, a `VoicePlayer`; the screen renders the kinds its domain has. The others (`VideoNote`, a location, a contact, a link preview, reactions, a forwarded header) are shown on the Message, VoicePlayer and VideoNote pages; pinned messages and selection on the Chat page.
- Sending is a `Composer` with `onSend` without waiting: the message is in the feed at once with a clock under a stable id, then one tick, then two. Your own message rises from the input, the client's answer slides in from the side — the feed animates new messages itself; history and status changes are not animated.
- Reply and edit from `Message.Menu` open `Composer.Context` with `value`: `onSend` gets `replyTo` / `editOf`, the plate closes itself after sending; ↑ in an empty field is `onEditLast`. A quote in a bubble is `Message.Reply target`: a scroll to the original with a flash.
- «Печатает…»: your own signal is `Composer onActivityChange` into the socket, the other side's is `Chat.Root typing`: the line in the header and the bubble at the end of the feed together.
- Unread: `onNewMessage` adds an incoming message to the dialog's count, `onRead` subtracts what the reader really saw. Scrolled up — the round «to the latest» button counts the new ones itself.
- Search in the conversation is `Chat.SearchButton` and `Chat.Search`; pinned messages, when the domain has them, are `Chat.Pinned` between them and the feed.

### Sales pipeline board

[kanban/examples/screen.tsx](../src/components/kanban/examples/screen.tsx)

- The page titles itself in the app header: `AppHeader.Title` with an `AppHeader.Description` that carries data («7 сделок в работе · 6 461 750 ₽», counted over the filtered deals); main has no `PageContent.Header`.
- Search, filters, the view switch and the one primary action «Новая сделка» are one `PageToolbar` inside `SmartFilter.Root`, in `AppHeader.Tools`.
- The board and the list are the same data: `Kanban` and `DataTable` replace each other through `Crossfade`, the filter is `matchesSmartFilter`.
- The board is the main area of the page, so its `variant` is the default, `plain`: stages without wells, headers and deal cards stand right on the page — one level of nesting, no frames of your own around the columns.
- The placement of deals is `value` as `{ [stage]: id[] }`; `onValueChange` returns the request's promise and applies `value` only after the answer; a server refusal returns the card to its place.
- Stage totals are in `renderColumnMeta` («2 сделки · 3 575 000 ₽»), the stage color is the column's `color`.
- A deal opens through `onItemClick` of `Kanban.Root` (click, Enter, Space; never after a drag) in a `Drawer` with a `DescriptionList`; no `onClick` / `onKeyDown` of your own on the card; a deal with its own page — `getItemHref`. The stage change is available in the panel too — dragging is not the only way; `Drawer.Guard busy` holds the panel while saving.
- The first load is `loading` on `Kanban` and `DataTable`: skeletons in the geometry of cards and rows.

### App frame

[app-shell/examples/screen.tsx](../src/layout/app-shell/examples/screen.tsx)

- The frame is `AppShell.Template` (or `AppShell.Root`): `nav` is `Sidebar.Root`, `header` is `AppHeader.Root`, `footer` is `BottomNav.Root`; the page is the children. `scrollResetKey` is the current section (in a router, the pathname), so a new page opens at the top.
- The kit decides the switch itself: below 768 px the `Sidebar` goes off the edge, `AppHeader.MenuButton` appears and `AppShell.Footer` shows the `BottomNav`; while the rail is on screen the footer is hidden. No media queries or `position: fixed` of your own.
- `BottomNav` holds 2–6 main sections, one word each; the rest lives in the `Sidebar`, and «Ещё» opens it as a panel (`aria-expanded`). `floating` is a glass capsule; `AppShell.Main` leaves room under it itself.
- Every page titles itself in the header: `AppHeader.Title` with the section's name and an `AppHeader.Description` that carries data («Среда, 14 октября · открытых задач: 3»); main has no `PageContent.Header`, its body starts with the page's blocks.
- Counts: `Sidebar.ItemCount` (a plain number for information, `color="red"` when it needs action) and `BottomNav.ItemCount` only for what needs attention; the number is the same in both navigations.
- Choosing a section in either navigation goes through one handler that also closes the Sidebar panel.
- A section change is a `Crossfade` by `state`: the page changes smoothly instead of jumping. Menu items in an app with a router are `asChild` + `NavLink`.

### Media library

[file-upload/examples/screen.tsx](../src/components/file-upload/examples/screen.tsx)

- A work screen titles itself in the app header: `AppHeader.Title` «Медиатека» with an `AppHeader.Description` naming the object; main has no `PageContent.Header`.
- Sections, search, order and «Загрузить» are one `PageToolbar` panel in `AppHeader.Tools`: search is a `SmartFilter.Toolbar` with `fields={[]}`, sections a `SegmentedControl` with `SegmentedControl.Count`.
- Uploads are `useUploadQueue` + `FileUpload.Root trigger="tile" layout="grid"`: progress, «В очереди», the failure reason and retry are built in, the add tile is also the drop zone; «Загрузить» opens the same picker (`picker.current?.open()`).
- A finished file leaves the queue for the library: its address is `item.result` of the server's answer, not the queue's `preview`.
- The library grid is a CSS grid of `Thumbnail` with `fullWidth` and one `ratio`; a video is `Thumbnail.Video`, which draws the duration and the play mark itself. `Gallery` does not fit here: it is an album of up to 10.
- A tile either opens or selects: when browsing it is `Thumbnail.Root asChild` with a button, when selecting — `checked` / `onCheckedChange`; «Выбрать» turns the mode on.
- Viewing is `MediaViewer` with `open` and `index` in two states and `getOrigin` by refs to the tiles, so a photo flies out of its tile and returns into it.
- Bulk delete is a `ConfirmDialog` with an `onConfirm` that returns a Promise; the result is a notification through `notify()`.
- The first load is a `Skeleton` in the geometry of the tiles, and a change of section, order or an empty result goes through `Crossfade`; an empty filter is `EmptyPage size="s"` with a reset.

### Resource schedule

[gantt/examples/screen.tsx](../src/components/gantt/examples/screen.tsx)

- The page titles itself in the app header: `AppHeader.Title` with an `AppHeader.Description` that carries data («Сотрудников: 9 из 9»); main has no `PageContent.Header`.
- A `fill` page: `Gantt scrollHeight="fill"` takes the free height — the header and the first column stick inside the chart, the page never scrolls sideways.
- The panel is a `PageToolbar` inside `SmartFilter.Root`, in `AppHeader.Tools`: search and the role and client filter first, teams a `SegmentedControl` with counts in `PageToolbar.Sections`, the primary action «Назначить» in `PageToolbar.Actions`, the active filters `SmartFilter.Chips` right under the search. Zoom and «Сегодня» are built into `Gantt` — never add your own.
- A row is a person: `renderRowAvatar` with an `Avatar`, `renderRow` with the name and role; on a narrow chart the column keeps only the avatar. Overlapping works lay themselves out in lanes, an absence is a `readOnly` bar, a milestone has `start` equal to `end`.
- `onBarChange` returns a promise and changes the data only after the service answers: while it runs the bar is busy; a refusal (work on an absence) is `notify` and `throw`, and the bar returns to its previous dates by itself.
- `onBarCreate`: a range drawn on an empty place holds a busy draft while a `Modal` with `Modal.Guard busy` asks for the name and the client; saving adds the bar and resolves the promise, cancel rejects it — the draft dissolves. Work over an absence is refused at once.
- The legend of client hues is a row of `Badge.Root color` with `Badge.Dot` in the chart's `toolbar`; `renderBarTooltip` names the client in the tooltip under the dates, so the client reads not only by color.
- `onSelect` opens a `Drawer` with a `DescriptionList` (the person, the client `Badge`, the period and duration, `ProgressBar`); removing a task is a `ConfirmDialog` with an async `onConfirm`.
- States are on the chart itself: `loading` draws `Skeleton` placeholder rows in its geometry, `empty` an `EmptyPage size="s"` with «Сбросить фильтры»; the panel stays in place.
