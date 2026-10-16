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
| [List page](#list-page) | data-table | [screen.tsx](../src/components/data-table/examples/screen.tsx) | the title, a line of figures, export and one primary action in the page's top bar; the table's SmartFilter search and filters in its own `toolbar`, the chips under it, the column chooser over the row menu; statuses, pages, filtered empty state |
| [Detail page](#detail-page) | description-list | [screen.tsx](../src/components/description-list/examples/screen.tsx) | a nested record: the path ending in the title, status and due date and the record's actions by weight in the top bar; main column + side column of Cards, Timeline |
| [Settings page](#settings-page) | page | [screen.tsx](../src/layout/page/examples/screen.tsx) | the path in a collapsing top bar, the large title in the flow, a card with its own header per section, form with its own save, Switches that apply at once, danger zone with a confirm |
| [Form in a Drawer](#form-in-a-drawer) | drawer | [screen.tsx](../src/components/drawer/examples/screen.tsx) | the title, counts and the Drawer trigger in the top bar, the search in the table's toolbar; Drawer form: groups, errors on submit, focus on the first invalid field, loading, toast |
| [Record editor](#record-editor) | field-list | [screen.tsx](../src/components/field-list/examples/screen.tsx) | a document page (a long form): the title and a line of description in `Page.Heading`, «Сохранить тариф» in `Page.Actions`, both in a `Page.Header` in the flow; a plan card edited in card sections: name and description, specs in a `FieldList` (icon-only `Select` and `ColorPresets` in compact columns, pinned rows, reorder), the price and its changes by month in one list with the base row pinned, a setup fee in three currencies in one row under one heading, save with «Сохранено» on the button |
| [Dashboard](#dashboard) | card | [screen.tsx](../src/components/card/examples/screen.tsx) | the large title + a line of data in the flow, period switch and report in a collapsing `Page.TopBar`; KPI row that cross-fades to the new period, a Sparkline revenue trend, invoiced vs paid in a ChartFrame, panels with progress and a split, short table + link to the list |
| [Screen states](#screen-states) | crossfade | [screen.tsx](../src/components/crossfade/examples/screen.tsx) | title + the statement date in `Page.TopBar`, page error in a Banner with retry, region loading with a Skeleton, Crossfade between states, table error in place, first-run EmptyPage |
| [Messenger](#messenger) | chat | [screen.tsx](../src/components/chat/examples/screen.tsx) | title + the unread count in `Page.TopBar`; a full-height Page.Split of a `ChatList` with its search (live last message, ticks, unread counts, «печатает…») and a `Chat`: `Chat.Header` with the back button, avatar, title, the status that turns into «печатает…» (`typing`) and the search button, `Chat.Search`, `Chat.Messages` from `items` + `renderMessage` (dates, runs and the unread band from the data, history loaded above with `hasOlder` / `onLoadOlder`, a first load in skeletons), text, a photo, a file and sent voice, reply and edit from the menu through `Composer.Context messageId` (`replyTo` / `editOf`), the jump to the quoted message (`Message.Reply target`), optimistic sends whose messages rise from the composer while the client's answer slides in, «печатает…» both ways (`onActivityChange` → `Chat.Root typing`), unread counts from `onNewMessage` and `onRead`, the Composer with attachments in `Chat.Footer` |
| [Sales pipeline board](#sales-pipeline-board) | kanban | [screen.tsx](../src/components/kanban/examples/screen.tsx) | `Page.TopBar` titles the page (`h1` + a Description with the open deals and their sum) with SmartFilter search and a board / list SegmentedControl in `Page.Tools` and the one primary action in `Page.Actions`; Crossfade between a `plain` Kanban (stages without wells, deal cards on the page) and a DataTable of the same deals, column totals in `renderColumnMeta`, moves saved through an `onValueChange` promise that the server can refuse, the deal in a Drawer with a DescriptionList and stage actions, skeleton first load |
| [App frame](#app-frame) | app-shell | [screen.tsx](../src/layout/app-shell/examples/screen.tsx) | Sidebar rail on a wide screen, floating BottomNav in `AppShell.Footer` on a phone («Ещё» opens the Sidebar panel), a `Page.TopBar` with the menu button and the page title (`h1`) with a line of data, counts on items, a home page that cross-fades between sections |
| [Media library](#media-library) | file-upload | [screen.tsx](../src/components/file-upload/examples/screen.tsx) | `Page.TopBar` titles the page (`h1` + a Description with the object) with sections and counts, search (`SmartFilter` with `fields={[]}`) and order in `Page.Tools` and «Загрузить» in `Page.Actions`; uploads through `useUploadQueue` in `FileUpload` tiles (`trigger="tile"`, `layout="grid"`) with progress, a failure and retry, a done file moving into the library; a grid of `Thumbnail` / `Thumbnail.Video` tiles that open `MediaViewer` out of the tile (`getOrigin`, `thumbnails`, `renderActions`) or, in selection mode, are picked (`checked`) for bulk download and a `ConfirmDialog` delete; a Skeleton first load and a filtered `EmptyPage` in a `Crossfade` |
| [Resource schedule](#resource-schedule) | gantt | [screen.tsx](../src/components/gantt/examples/screen.tsx) | `Page.TopBar` titles the page (`h1` + a Description with the people shown) with search, role / client filters and team sections in `Page.Tools` and «Назначить» in `Page.Actions` over a full-height `Gantt` (`scrollHeight="fill"`); people with avatars, client hues, lanes for overlaps, locked absences and milestones; moves saved through an async `onBarChange` or refused and glided back, new work drawn with `onBarCreate` and named in a Modal (cancel fades the ghost), `onItemOpen` details in a Drawer with a `DescriptionList` and a confirmed removal, `loading` and filtered `empty` |

Pick the closest one, rename the domain, keep the skeleton. Change structure only when the task needs
it, and then by the rules below.

## 1. Page skeleton

**The app is navigation and the page.** `AppShell` holds the Sidebar and `AppShell.Main`; there is no
app-wide header and no global search. Everything at the top belongs to the page: one `Page.Root` with
its `Page.TopBar` (sticky) and its `Page.Body`, plus a `Page.Header` in the flow on a document page.

**One title per page.** `Page.Title` is the page's only `<h1>`, a `Page.Description` with it is one
line that carries data («Среда, 14 октября · 3 задачи», «Отправлен · оплатить до 14 октября»), and a
nested record puts the path up (a `Breadcrumb.Root` before the title) — all three inside
`Page.Heading`, the title group. Where the heading stands follows the kind of page; its size follows
the place:

- **Work screens** — a list, a board, a chat, a schedule, a record: `Page.Heading` stands in
  `Page.TopBar` beside the page's tools and buttons ([the top bar](#the-top-bar)); there is no header
  in the flow.
- **Document pages** — settings, a long form, an article or help text: `Page.Header` in the flow
  holds `Page.Heading` (the large title with one sentence of `Page.Description`) and the page's save
  action in `Page.Actions`; optionally a `Page.TopBar collapse` with only the path in its
  `Page.Heading`, which repeats the title once it scrolls away.
- **Overviews** — dashboards: a `Page.TopBar collapse` with the page's tools (the period) in
  `Page.Tools` and its buttons (a report) in `Page.Actions`, and the titled `Page.Header` in the flow.

Never two titles; never no `<h1>`. A bar whose page shows no title still holds a `Page.Title` — inside
`VisuallyHidden` — unless a flow `Page.Header` has one.

```
AppShell.Root                      once per app (layouts.md#app-frame-once-per-app)
├─ AppShell.Nav → Sidebar          navigation rail, one layer above the page
└─ AppShell.Main                   gutters, top air (24, 32 from 1024px), bottom air 64; the page renders here
   └─ SmartFilter.Root             a filtered page only: the filter's state, no DOM, around the page
      └─ Page.Root                 the page you deliver
         ├─ Page.Guard             a page that edits a record: holds leaving it (busy, dirty); no DOM
         ├─ Page.TopBar            sticky; led by the menu button while the Sidebar is off-canvas
         │  ├─ Page.Heading        the path › the title on one line, the line of data under it
         │  │  ├─ Breadcrumb.Root  only on a nested record: the levels above this page
         │  │  ├─ Page.Title       the one h1, the path's last level
         │  │  └─ Page.Description a line of data
         │  ├─ Page.Tools          what acts on the whole page — sections, a period, view; a filter over several views
         │  ├─ Page.Actions        every button of the page, each with an icon; the primary last
         │  └─ Page.Chips          SmartFilter.Chips: a line under everything, gone while empty
         └─ Page.Body              blocks 24 apart, the first 24 under the bar's controls
            ├─ Page.Grid           every tile of the screen, 16 on both axes
            │  └─ Page.Cell        span (of 12), rows; the tile fills it
            └─ Page.Section        a new topic: h2 label (+ Page.Actions), 40 from its neighbours

Document page or overview: the title in the flow
   └─ Page.Root maxWidth="wide" | "readable"
      ├─ Page.TopBar collapse      the path (an overview: its tools and buttons); repeats the title once it scrolls away
      ├─ Page.Header               Page.Heading (the one h1, a sentence of description) + Page.Actions; 24 above the body
      └─ Page.Body
```

- A screen renders its page: one `Page.Root` with its top bar and its body. Styles, `applyTheme`,
  `NotificationProvider` and `AppShell` live at the app root.
- `Page.Root` for app pages (full panel width); `Page.Root maxWidth="wide"` for settings,
  `maxWidth="readable"` for one narrow column of text or fields.
- No outer padding, no margins: `AppShell.Main` hands the page its gutters and its top and bottom air, `Page` has
  block → block 24, section → section 40, tile → tile 16 (and header → body 24). Your CSS lays out
  only the inside of a block.

### The top bar

`Page.TopBar` holds up to four groups and nothing else. Write them in reading order; the DOM and Tab
order is Heading, Tools, Actions, Chips whatever the JSX order.

- **`Page.Heading`** — the path ends in the title: `Breadcrumb.Root` with the levels above this page,
  then `Page.Title` with its name, on one line (the heading draws the chevron between them), and
  `Page.Description` under the whole line. The title is never a row of its own under the path, and
  the path never repeats the title as its last item.
- **`Page.Tools`** — what acts on the whole page, as kit controls in the order a person reads them:
  sections (a `SegmentedControl` with counts), the view, a period that drives several blocks; a
  search and filter (`SmartFilter.Toolbar`) only when it governs more than one table — a board and
  its list, a media grid ([where the filters go](#where-the-filters-go)). Named with `aria-label`;
  no buttons and no wrappers inside.
- **`Page.Actions`** — the one place for the page's buttons: secondary ones (`soft` + `neutral`)
  first, the primary (`solid`) last. Every Button carries a `Button.Icon` beside its label: the bar
  shows it as the icon alone when the line runs short.
- **`Page.Chips`** — `SmartFilter.Chips`: the active filters.
- `SmartFilter.Root` draws nothing and its toolbar and chips stand in two groups, so it wraps
  `Page.Root` (or whatever holds both) — never a group of the bar.
- The bar gives the title its natural size and decides the rest by width:
  [the page's top bar](responsive.md#the-pages-top-bar--pagetopbar). The classic mistakes, bad →
  good: [anti-slop.md](anti-slop.md#7b-a-top-bar-out-of-its-groups).

```tsx
import {
  Breadcrumb,
  Button,
  Icon,
  Page,
  SegmentedControl,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
} from "prime-ui-kit";
import type { ReactNode } from "react";

type DealsPageProps = {
  fields: SmartFilterField[];
  filter: SmartFilterValue;
  onFilterChange: (value: SmartFilterValue) => void;
  view: string;
  onViewChange: (view: string) => void;
  children: ReactNode;
};

export function DealsPage({ fields, filter, onFilterChange, view, onViewChange, children }: DealsPageProps) {
  return (
    <SmartFilter.Root fields={fields} value={filter} onValueChange={onFilterChange}>
      <Page.Root>
        <Page.TopBar>
          <Page.Heading>
            <Breadcrumb.Root>
              <Breadcrumb.Item href="/clients">Клиенты</Breadcrumb.Item>
              <Breadcrumb.Item href="/clients/north">ООО «Север»</Breadcrumb.Item>
            </Breadcrumb.Root>
            <Page.Title>Сделки</Page.Title>
            <Page.Description>7 в работе · 6,5 млн ₽</Page.Description>
          </Page.Heading>
          <Page.Tools aria-label="Сделки">
            <SmartFilter.Toolbar />
            <SegmentedControl.Root value={view} onValueChange={onViewChange} aria-label="Вид">
              <SegmentedControl.Item value="board">Доска</SegmentedControl.Item>
              <SegmentedControl.Item value="list">Список</SegmentedControl.Item>
            </SegmentedControl.Root>
          </Page.Tools>
          <Page.Actions>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
              Экспорт
            </Button.Root>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Новая сделка
            </Button.Root>
          </Page.Actions>
          <Page.Chips>
            <SmartFilter.Chips />
          </Page.Chips>
        </Page.TopBar>
        <Page.Body>{children}</Page.Body>
      </Page.Root>
    </SmartFilter.Root>
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
| heading → its content (group, section) | 16 | `--prime-space-4` (`Page.Section` does it) |
| tile → tile, both axes (KPI, charts, panels) | 16 | `Page.Grid` |
| field → field, switch → switch | 20 | `--prime-space-5` |
| main column → side column | 24 | `--prime-space-6` |
| top bar → the page's first block | 24 under the bar's controls | the rhythm's header → body; the bar's own bottom padding is part of it |
| flow header → body (a document page) | 24 | `Page.Header` |
| block → block on a page | 24 | `Page.Body` |
| group → group in a form | 32 | `--prime-space-8` |
| section → section (a new topic with an `h2`) | 40 | `Page.Section` |
| the page's last block → the panel's bottom edge | 64; a `Page.Root fill` page the side gutter | `AppShell.Main` (beside the Sidebar rail too) |

A screen with one gap everywhere reads as a list of unrelated things. Use at least three levels: inside
an item, between items, between blocks. The tiles of one screen are one board: put them all in one
`Page.Grid` (one gap on both axes), never a grid per row — and keep the large air for a new topic
with its own heading (`Page.Section`).

## 3. Hierarchy — air first, then type

Hierarchy comes from space and a handful of type roles, not from size jumps, color or weight tricks.

| Text | Use |
|---|---|
| page title | `Page.Title` (the only `h1`): `title-m` in the top bar, `heading-m` in the flow |
| section heading without a card | `Page.Section label` (an `h2` in `title-m`) |
| card / panel title | `Card.Title as="h2"` (under the page title) |
| heading of a group of fields | `Fieldset label` (`title-s` in the `<legend>`) |
| section heading inside a Drawer or a Modal | `Drawer.Section label` / `Modal.Section label` (an `h3` in `title-s`, `Drawer.Actions` at its end) |
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
  layer 1, and fields take the fill of the layer they sit on. The kit sets this by context — never
  set backgrounds ([the one exception](foundations.md#your-own-bounded-block)).
- **Card when** the block stands alone and has its own title: a KPI tile, a settings panel, facts in a
  side column, a chart. **No card when** the block is the only thing in its region: a section heading
  and the content are enough.
- **A titled block stands in the flow, its heading inside it.** A panel with a title and a line of
  description (a settings section, a group of a long form) is a `Card.Root` whose `Card.Header`
  holds `Card.Title as="h2"` and `Card.Description`; the cards stack 24 apart. Never a heading column
  beside its panel: it takes a third of the width from the fields and breaks the reading line.

```tsx partial
// bad — the heading in a column on the left, the panel on the right
<div className={styles.headingColumnAndPanel}>
  <div>
    <Typography as="h2" variant="title-m">Компания</Typography>
    <Typography tone="secondary">Попадают в счета и акты.</Typography>
  </div>
  <Card.Root variant="panel">…</Card.Root>
</div>
```

```tsx good
// good — the card carries its own heading, stacked in the flow
<Card.Root variant="panel">
  <Card.Header>
    <Card.Title as="h2">Компания</Card.Title>
    <Card.Description>Попадают в счета и акты.</Card.Description>
  </Card.Header>
  <Card.Body>
    <Input.Root label="Название">
      <Input.Wrapper>
        <Input.Field name="name" />
      </Input.Wrapper>
    </Input.Root>
  </Card.Body>
</Card.Root>
```

- `DataTable` is already a filled block — never inside a Card; a card in a card only as
  [the next layer, sparingly](foundations.md#card-in-a-card). No borders around blocks; `Divider`
  only inside a block (list rows, a form and its footer).
- Floating layers (menus, popovers, dialogs) come only from kit overlays.

## 5. Density and size

- `m` everywhere by default — omit `size`. Change the tier for a whole region, never for one control:
  a dense back-office table may be `s` with its toolbar; a sign-in card may be `l`.
- One row = one size: everything in a toolbar or an actions row lines up.
- A control nested in another component's row is one tier down: buttons and menus in table cells `s`,
  a segmented switch in a card header `s`. A sized kit host ([the host tier](api-contract.md#size-and-the-host-tier))
  sizes the kit controls inside it itself.

## 6. Actions

- **One primary per area** (the page, card, dialog, form): `solid`, last in its row. Secondary:
  `soft` + `tone="neutral"`. Dismiss / revert: `ghost` + `neutral` in pages and cards, `outline` +
  `neutral` in Modal / Drawer footers.
- Placement: every button of the page in one `Page.Actions` — of `Page.TopBar` on a work screen, of the flow `Page.Header` on a document page — the primary last; card actions in `Card.Footer`; dialog actions in
  `Modal.Footer` / `Drawer.Footer`; row actions in the last column; actions on the selected rows of a
  table in its selection menu ([controls of a table](#controls-of-a-table)).
- A dialog footer is the dialog's answer: Cancel and the primary. Deleting the record the dialog
  edits is not a third footer button: it stands in `Modal.Actions` / `Drawer.Actions` of the header
  by the menu threshold below, confirmed by a `ConfirmDialog`.
- An empty state's action replaces the header's primary, it does not duplicate it.
- Destructive: `tone="danger"`; a standalone trigger is `outline`, in a menu it is the last item, the
  confirm is a `ConfirmDialog` (its `onConfirm` returns the request's Promise).
- Going somewhere is a link (`LinkButton`, `Button.Root asChild` + `<a>`), doing something is a Button.
  One action — one label on the whole screen.

### A menu from two actions

An action that is alone stays in sight; a «⋯» only gathers. Count the secondary actions of one
place — a page or dialog header, a table row, a card, a list row:

| Actions | Shape |
|---|---|
| one | an icon-only `Button.Root` (`aria-label`) in a `Tooltip.Trigger` (`ghost` in a dialog header), or a labelled button where its row has room |
| two or more | one `Dropdown` behind an `action.more` icon button — `soft` + `neutral` in a page header (a shape beside its neighbours), `ghost` in a dialog header, `ghost` size `s` in a table cell; destructive last, `tone="danger"` |

A ⋯ with one item hides the only action behind a second press and a guess. Nothing else decides:
not the density of the row, not the number of its columns, not the room left for later actions. A
row of a `FieldList` follows the same count ([forms](#7-forms)).

```tsx partial
// bad — a menu for the one thing this header can do
<Drawer.Actions>
  <Dropdown.Root>
    <Dropdown.Trigger>
      <Button.Root variant="ghost" tone="neutral" aria-label="Другие действия">…</Button.Root>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item tone="danger">Удалить приглашение</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
</Drawer.Actions>
```

```tsx good
// good — one action in sight, named by its tooltip
<Drawer.Actions>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button.Root variant="ghost" tone="danger" aria-label="Удалить приглашение">
        <Button.Icon>
          <Icon name="action.delete" />
        </Button.Icon>
      </Button.Root>
    </Tooltip.Trigger>
    <Tooltip.Content>Удалить приглашение</Tooltip.Content>
  </Tooltip.Root>
</Drawer.Actions>
```

## 7. Forms

- Labels above every field (`label`), placeholder is an example value, help in `hint`, problems in
  `error` — after blur or on submit. Mark the minority (`required` or `optional`).
- Records of one shape that a person adds, edits and removes are a `FieldList`: one row per record,
  the column headings once above the rows, small attributes (an icon, then its color) in `compact`
  columns. Never a label in every row, never numbered labels, never one record split over lines.
  FieldList draws every row's actions itself — the remove «×» and the handle after it, a pinned
  row's remove off with its reason (`labels.lockedReason`) — so never add your own.
- The row's actions (`rowActions`) follow [the menu threshold](#a-menu-from-two-actions): a row
  that only removes shows its «×» (the default `"buttons"`, and the grip after it with
  `reorderable`), however many columns it has; `"menu"` — one «⋯» with «Выше», «Ниже», «Удалить» —
  only for a `reorderable` list on a touch-first screen, where moving by the menu replaces a drag.
- The look (`variant`): `"plain"` (default) when the list is the content of its card or section;
  `"surface"` when the list stands among other fields of a form or card, so its rows read as one
  block apart from the fields around it.
- One value in several units is one row of fields under one heading, each unit in its field's
  `Input.InlineAffix`; a base value with overrides is one `FieldList` with the base pinned first.
  The shape of the data decides the layout: [ux.md](ux.md#2-the-shape-of-the-data-decides-the-layout).
- Rows that add up (shares of a bonus, hours, amounts) carry their sums under them in the same list:
  `FieldList renderTotals`, a short number in a `width: "xs"` column. A number with its unit
  (`inputMode="decimal"` and an end `Input.InlineAffix`) ends at the field's end, and its column's
  total follows it there by itself. Return the save's promise from
  its `onValueChange` when each edit saves at once.
- Fields 20 apart; related short fields side by side in an
  [intrinsic grid](responsive.md#intrinsic-grids) with `align-items: start`
  (`reserveSupportRow` on Input / Textarea keeps neighbours aligned); groups 32 apart, each a
  `Fieldset label` (its `title-s` heading 16 above the fields, no frame); no dividers between groups.
- Form column width: one column up to ~65ch; never stretch a form across a wide panel.
- Where: ≤ 4 fields → `Modal`; long create / edit → `Drawer` or a page; settings → a panel Card per
  section, the whole `Card.Root` inside `<form>`, buttons in `Card.Footer`.
- Submit: `noValidate`, validate all, set `error`s, focus the first invalid field, `loading` on the
  submit button and the fields disabled (one `Fieldset disabled` per group of fields), then the
  result: the save button stays on screen → it says «Сохранено»; the button goes away (the dialog
  closes, the page navigates, the button shows only while dirty) → a `Notification`; a failure → a `Notification` or the field's `error`.
- A footer button outside the form submits it with `form={formId}`.
- Choice controls are picked by what the value means, not by when it saves:
  [choosing.md](choosing.md#a-flag-a-level-a-set).

## 8. Tables and lists

### Where the filters go

A control stands with what it changes. Ask of each one: what does it narrow or switch?

- **One table** — its search and filter fields, their chips, its column chooser and the actions on
  its selected rows belong to the `DataTable`, on every page: the page that is only this table, a
  page with KPI cards above it, a page whose sections switch between tables. `SmartFilter.Root`
  wraps the `DataTable`; `SmartFilter.Toolbar` goes in its `toolbar` (with a `DataTableColumnsMenu`
  when the table has no row-actions column to carry `columnsMenu`), `SmartFilter.Chips` in its
  `toolbarChips`, the selection menu comes from `renderSelectionActions`
  ([server.tsx](../src/components/data-table/examples/server.tsx), [the list page](#list-page)).
  The tools then stay put when the page grows a block or another section, and every table of the
  app reads the same.
- **The whole page** — `Page.TopBar`: the heading with its line of data, the page's sections (a
  `SegmentedControl`; of links, `SegmentedControl.Item asChild`, when each section is a route of its
  own — «Сотрудники» / «Роли»), a view switch, a period that drives several blocks, the page's
  buttons.
- **Several views of one set** — a search and filter that narrows a board and its list alike, a
  media grid, a schedule without a tools row of its own: `SmartFilter.Root` wraps `Page.Root`,
  `SmartFilter.Toolbar` in `Page.Tools`, `SmartFilter.Chips` in `Page.Chips`
  ([the board](#sales-pipeline-board)).
- **A table section filters by its categories.** Every column with a closed set of values (a role, a
  status, a type, an owner, a city) is an `options` field of the table's `SmartFilter`, a date
  column a `date-range` field (its `calendar` with the presets of the domain), free text the
  search. A search alone (`fields={[]}`) only for records with no such column. The value lives in
  the URL ([nothing to guess](ux.md#6-nothing-to-guess)).
- Both rows are one tool row of the kit: written in reading order, a search takes the free room,
  switchers and buttons keep their width at the end, and a short row wraps by itself — pass the
  controls as they are, never inside a flex wrapper of your own.

```tsx partial
// bad — the table's search, filter, chips and chooser in the bar, away from the rows they filter
<SmartFilter.Root fields={FIELDS}>
  <Page.Root>
    <Page.TopBar>
      <Page.Heading>
        <Page.Title>Модели</Page.Title>
      </Page.Heading>
      <Page.Tools aria-label="Модели">
        <SmartFilter.Toolbar />
        <DataTableColumnsMenu columns={COLUMNS} hiddenColumns={hidden} onHiddenColumnsChange={setHidden} />
      </Page.Tools>
      <Page.Chips>
        <SmartFilter.Chips />
      </Page.Chips>
    </Page.TopBar>
    <Page.Body>
      <Page.Grid>{/* four KPI cards */}</Page.Grid>
      <DataTable columns={COLUMNS} rows={models} hiddenColumns={hidden} />
    </Page.Body>
  </Page.Root>
</SmartFilter.Root>
```

```tsx good
// good — the bar keeps the title, the period that drives the cards and the table, the primary
// action; the table's search, filter, chips and chooser stand in the table's own tools row
// declare: const FIELDS: Parameters<typeof SmartFilter.Root>[0]["fields"]
// declare: const models: { id: string; name: string; rides: number }[]
// declare: const kpis: { label: string; value: string }[]
// declare: const hidden: string[]
// declare: const setHidden: (hidden: string[]) => void
<Page.Root>
  <Page.TopBar>
    <Page.Heading>
      <Page.Title>Модели</Page.Title>
    </Page.Heading>
    <Page.Tools aria-label="Модели">
      <Datepicker.Root mode="range" aria-label="Период" />
    </Page.Tools>
    <Page.Actions>
      <Button.Root>
        <Button.Icon>
          <Icon name="action.add" />
        </Button.Icon>
        Добавить модель
      </Button.Root>
    </Page.Actions>
  </Page.TopBar>
  <Page.Body>
    <Page.Grid>
      {kpis.map((kpi) => (
        <Page.Cell key={kpi.label} span={3}>
          <Card.Root variant="stat-trend">
            <Card.Label>{kpi.label}</Card.Label>
            <Card.Value>{kpi.value}</Card.Value>
          </Card.Root>
        </Page.Cell>
      ))}
    </Page.Grid>
    <SmartFilter.Root fields={FIELDS}>
      <DataTable
        columns={[
          { id: "name", header: "Модель", accessor: "name", hideable: false },
          { id: "rides", header: "Поездки", accessor: "rides", numeric: true },
        ]}
        rows={models}
        getRowKey={(row) => row.id}
        hiddenColumns={hidden}
        toolbar={
          <>
            <SmartFilter.Toolbar />
            <DataTableColumnsMenu
              columns={[
                { id: "name", header: "Модель", accessor: "name", hideable: false },
                { id: "rides", header: "Поездки", accessor: "rides", numeric: true },
              ]}
              hiddenColumns={hidden}
              onHiddenColumnsChange={setHidden}
            />
          </>
        }
        toolbarChips={<SmartFilter.Chips />}
      />
    </SmartFilter.Root>
  </Page.Body>
</Page.Root>
```

### Controls of a table

- The column chooser has one place per table. Over the row actions: `columnsMenu` puts the icon
  trigger in the head cell of the row-actions column (the last column, `hideHeader`), and it sticks
  with `stickyLastColumn`. A table without row actions gets no chooser cell in its header: the
  chooser is `<DataTableColumnsMenu>` beside the table's search ([where the filters go](#where-the-filters-go)),
  bound to the same `hiddenColumns` / `columnOrder` state the table reads. Give the key column and
  the actions column `hideable: false`.
- The DataTable `toolbar` holds the table's own controls — its search and filter, the chooser, a
  table / cards view — as they are, in reading order; its chips go to `toolbarChips`. A search
  heads the row; a button never does: a lone «Экспорт» or «Создать» is the page's
  (`Page.Actions`), a lone chooser goes over the row actions, a count or a total of the list is data
  in `Page.Description`.
- **Actions on selected rows are one menu, added to the row.** `renderSelectionActions` returns the
  `Dropdown.Item`s; while rows are selected the table puts a «Действия · N» menu button last in its
  tools row — the search, filter and chooser stay where they were, and the button leaves when the
  selection empties. Never a row of «Выбрано: N» and buttons that replaces the tools, never one
  button per bulk action in the row. A destructive item asks with a `ConfirmDialog` that names the
  count ([friction](ux.md#5-friction-matches-the-cost-of-a-mistake)).

```tsx partial
// bad — the selection swaps the tools row for a bar of buttons; search and filter vanish
<DataTable
  selectable
  selected={selected}
  onSelectedChange={setSelected}
  toolbar={selected.length > 0 ? <SelectionBar count={selected.length} /> : <SmartFilter.Toolbar />}
/>
```

```tsx good
// good — the tools stay, the actions on the selection are one menu that enters last
// declare: const FIELDS: Parameters<typeof SmartFilter.Root>[0]["fields"]
// declare: const members: { id: string; name: string }[]
// declare: const selected: string[]
// declare: const setSelected: (keys: string[]) => void
<SmartFilter.Root fields={FIELDS}>
  <DataTable
    columns={[{ id: "name", header: "Сотрудник", accessor: "name" }]}
    rows={members}
    getRowKey={(row) => row.id}
    selectable
    selected={selected}
    onSelectedChange={(keys) => setSelected(keys.map(String))}
    toolbar={<SmartFilter.Toolbar />}
    toolbarChips={<SmartFilter.Chips />}
    renderSelectionActions={() => (
      <>
        <Dropdown.Item>Сменить роль</Dropdown.Item>
        <Dropdown.Item tone="danger">Отключить доступ</Dropdown.Item>
      </>
    )}
  />
</SmartFilter.Root>
```

### Tables

- Paging is built in: `paging="pages"` (default, Pagination and the «Показано 1–6 из 10» range in the
  footer), `paging="infinite"` for feeds, `paging="none"` for short lists on dashboards and details.
- When the server holds more than you load (a CRM list, a register): `source="server"` — `rows` is the
  page the server returned, `rowCount` its total; `sort` / `page` / the SmartFilter value make the
  request, a new search or filter sets `page` to 1, and the old rows stay with `loading` until the
  answer comes ([server.tsx](../src/components/data-table/examples/server.tsx)).
- Columns: `numeric` for amounts, counts and dates (end-aligned, tabular; `headerAlign="end"` to line the
  head up); statuses as `Badge` from one status → tone map; an avatar + two-line cell for people and
  companies; row menu last.
- States in place: `loading` (+ `loadingRows`) while there are no rows, `empty` for nothing found
  (string → compact EmptyPage, or your own `EmptyPage size="s"` with «Сбросить фильтры»), `loadError`
  for a failed load. The head and toolbar stay.
- Phones: the table scrolls inside itself, `stickyFirstColumn` keeps the key column; never let the page
  scroll sideways. Short lists of objects can be `Card variant="list"` instead of a table.

### List rows

- A row's own controls stand beside its element in `List.ItemActions`, one tier below the row.
- A plain settings row reads label first and ends with its toggle (the platform convention).
- A row people reorder leads with its toggle — `<List.ItemActions side="start">`, or the Switch as the
  first child of a `Dnd.SortableItem` — so the on / off state reads first, like a checkbox, and the
  grip keeps the end edge ([reorder.tsx](../src/components/list/examples/reorder.tsx)).
- Never a toggle between the label and the grip: «Почта … [Switch] [grip]» reads as two handles.

## 9. Feedback

| Situation | Component |
|---|---|
| the result of an action (sent, created, failed to save; saved when the form or its save button goes away) | `Notification` via `notify()` |
| a form saved whose save button stays on screen | the submit button's text: «Сохранено» |
| a state of the page or a section that persists (sync failed, trial ends, read-only) | `Banner` as the first block of `Page.Body` (or inside the Card it concerns) |
| a problem with one field | the field's `error` |
| a refused sign-in | `invalid` on the e-mail and the reason in words as the password's `error` — no Banner ([field outcomes](api-contract.md#field-outcomes-a-mark-for-success-words-for-a-problem)) |
| a region failed to load | the region shows it in place: DataTable `loadError`, or `EmptyPage tone="danger"` with `EmptyPage.RetryButton` |
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

Every overlay closes on Escape and on a press outside unless you turn it off
([the Dismiss row](api-contract.md#shared-vocabulary-exported-types)); a form in a Modal or Drawer holds
closing with `Modal.Guard` / `Drawer.Guard` (`busy` while a request runs, `dirty` for unsaved
changes) instead.

A toast is no layer of that stack: `notify()` from inside a Drawer leaves it open, and a press on
the toast closes nothing below it. Titled groups of a dialog's body (a client's contacts, its deals)
are `Drawer.Section` / `Modal.Section` with their own `Drawer.Actions` / `Modal.Actions`, not a
hand-made heading row; a footer's `Drawer.Meta` / `Modal.Meta` goes above the buttons by itself when
the footer runs short.

### A record in a drawer

A record opened beside the page — a person, a role, a deal — is one drawer per entity, the same
wherever it opens:

- **One entity, one drawer.** One component opens the record from every place — the person's own
  account in the Sidebar, a row of the team table, a mention — by its id. Who looks decides what it
  shows: a field the viewer may not change is `readOnly` (`disabled` when the reason is said beside
  it), a tab the viewer may not see is not rendered, an action the viewer may not take is hidden. A
  second drawer for the same entity («Мой аккаунт» beside «Сотрудник») drifts apart from the first
  with every change.
- **One record header** — the same in a Drawer, a Modal and a Sheet. `Drawer.Icon` leads: a
  glyph gets a 40px tone tile, the record's `Avatar.Root` or `Thumbnail.Root` (even inside a wrapper
  of your own) stands at 40 with no tile. Line 1 is `Drawer.Title`, the name (`loading` while it
  comes). Line 2 is `Drawer.Description`: the status `Badge.Root`s first — the header sizes them, no
  `size` — then the line of data. `Drawer.Actions` hold only buttons that act on this record: ghost
  icon Buttons, each in a `Tooltip.Trigger`, counted by [the menu threshold](#a-menu-from-two-actions);
  they are centred on line 1, before the ×. A Badge in `Drawer.Actions` is a status in the wrong place; a way to
  another place (a section, a list) is no header action — a link in the body beside the data it leads
  to, or nothing.
- **One form, one save.** Every editable field of every tab is one form, and its submit is the one
  «Сохранить» of `Drawer.Footer`, shown while the form is dirty, with `Drawer.Guard` (`dirty`,
  `busy`). No save per section or tab, no «Есть несохранённые изменения» in `Drawer.Meta`: the save
  button and the guard already say it. Actions that work at once — turn sign-in on, send a link,
  end the other sessions — are buttons beside what they change and never wait for the save. After
  the save the button leaves, so the success is a `Notification`.
- **Tabs are topics.** Each tab holds one topic, and a record's history (its log) is always a tab of
  its own. Tabs that outgrow the width never merge: the strip scrolls ([switchers](responsive.md#switchers)).
- **Data at the drawer's level.** The drawer loads the record and the data of its tabs; a tab never
  fetches on mount, so coming back to it shows what it showed instead of a skeleton that collapses
  it. A tab that keeps a draft or its scroll keeps its panel with `Tabs.Panel keepMounted`. The
  opening itself — the header and the tabs at once, the body as a Skeleton in the form's geometry —
  is in [Drawer](../src/components/drawer/COMPONENT.md).

```tsx partial
// bad — a way out in the header, a save per section, a status line in the footer
<Drawer.Actions>
  <Button.Root variant="ghost" tone="neutral">Команда и роли</Button.Root>
</Drawer.Actions>
<Drawer.Section label="Профиль">… <Button.Root>Сохранить</Button.Root></Drawer.Section>
<Drawer.Section label="Доступ">… <Button.Root>Сохранить</Button.Root></Drawer.Section>
<Drawer.Footer>
  <Drawer.Meta>Есть несохранённые изменения</Drawer.Meta>
</Drawer.Footer>
```

```tsx good
// good — one form over the tabs, one save while it is dirty, the guard holds the rest
// declare: const dirty: boolean
// declare: const saving: boolean
<Drawer.Content>
  <Drawer.Guard dirty={dirty} busy={saving} />
  <Drawer.Header>
    <Drawer.Title>Анна Соколова</Drawer.Title>
  </Drawer.Header>
  <Drawer.Body>
    <form id="member-form" noValidate>
      …
    </form>
  </Drawer.Body>
  <Drawer.Footer>
    {dirty ? (
      <Button.Root type="submit" form="member-form" loading={saving}>
        Сохранить
      </Button.Root>
    ) : null}
  </Drawer.Footer>
</Drawer.Content>
```

## 11. Narrow screens

- Layouts are [intrinsic](responsive.md#intrinsic-grids) — no breakpoints needed, and they work in
  any container; a media query only in [the breakpoints' scope](responsive.md#breakpoints).
- From 320px: the page's tools take a line under the page title ([the page's top bar](responsive.md#the-pages-top-bar--pagetopbar)), side columns drop below the main one,
  pairs of fields stack, tables scroll inside themselves, dialogs stack their footers (built in).
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
- Styled with a CSS Module on `--prime-*` tokens. Bounded block:
  [a `Card`, or the plain tile](foundations.md#your-own-bounded-block). Never override kit internals
  or reach into their class names.
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
`Page.Cell span={3}` of the page's `Page.Grid` — see [the dashboard screen](../src/components/card/examples/screen.tsx). When the trend over days matters, put a
`Sparkline` in the `Card.Body` instead: it brings the value, the change and a line to scrub.

## Screen rules

What each screen in [the index](#screens) demonstrates — keep these when you start from it.

### List page

[data-table/examples/screen.tsx](../src/components/data-table/examples/screen.tsx)

- A work screen titles itself in its `Page.TopBar`: `Page.Title` is the only heading, its `Page.Description` is one line of figures («10 счетов · просрочено 2 на …»), not a sentence about the page; there is no second header in the flow.
- The search and filters narrow the table, so they are the table's: `SmartFilter.Toolbar` in its `toolbar`, `SmartFilter.Chips` in its `toolbarChips`, the column chooser over the row menu (`columnsMenu`); the bar keeps the heading, export (`soft` + `neutral`, an icon beside its label) and the one primary action (`solid`, last) in `Page.Actions`. A KPI row added above changes nothing in the table's tools.
- A status is a `Badge` with one `tone` per meaning across the product (`STATUS` is one map); the text carries the meaning, the tone repeats it.
- Numbers and dates are `numeric` columns with `headerAlign="end"` (tabular figures, values and heading on the end edge). On a phone the table scrolls inside itself and `stickyFirstColumn` keeps the number in place — the page never scrolls sideways.
- Row actions are a `Dropdown` behind an `action.more` icon of size `s` in the last column (`hideHeader`), pinned to the end edge with `stickyLastColumn` so they stay in reach while the columns scroll: controls in cells are one tier below the table. Delete is `tone="danger"` at the end of the menu.
- Empty after a filter is the table's `empty` with `EmptyPage size="s"` and a «Сбросить фильтры» action; the header and the filters stay in place.

### Detail page

[description-list/examples/screen.tsx](../src/components/description-list/examples/screen.tsx)

- A nested record titles itself in its `Page.TopBar`: `Page.Heading` holds the path up (`Breadcrumb.Root` with the list, «Счета») ending in `Page.Title` with the record's name on the same line; there is no second header in the flow. Top-level pages have no breadcrumb.
- The status is words next to the fact that matters now, in `Page.Description` («Отправлен · оплатить до 14 октября»), not a separate plate.
- The record's actions are the bar's `Page.Actions`, by weight: one primary (`solid`, last), the secondary `soft` + `tone="neutral"`, each with an icon beside its label. Rare and destructive ones live in a `Dropdown` behind an `action.more` icon (also `soft`, so the button has a shape beside its neighbours); voiding is `tone="danger"` at the bottom of the menu.
- Columns are a CSS module on flex-wrap without breakpoints: the main one grows, the side one holds ~18rem and drops below when the main one runs out of room.
- A section without a frame is `Page.Section label`: an h2 heading 16 px above the table; `Card variant="panel"` only for standalone blocks of the side column. A table is already a filled block — never put it in a card.
- «Label → value» pairs about the client are `DescriptionList.Root orientation="vertical"` with `DescriptionList.Item label`; amounts are tabular figures, the total is larger (`title-m`) and ends where the «Сумма» column ends (the table cell inset).
- History is a `Timeline`: events top-down from the latest, dates in `Timeline.ItemMeta`; a row highlights on hover.

### Settings page

[page/examples/screen.tsx](../src/layout/page/examples/screen.tsx)

- A document page: `Page.Root maxWidth="wide"`, the large `Page.Title` with a sentence of `Page.Description` in the `Page.Heading` of a `Page.Header` in the flow, and a `Page.TopBar collapse` whose `Page.Heading` holds only the path and repeats the title once it scrolls away.
- A section is a `Card variant="panel"` with its own `Card.Header` (`Card.Title as="h2"` + a line of `Card.Description`), the cards stacked in the flow ([a titled block](#4-surfaces)).
- The form wraps the whole `Card.Root` in `<form noValidate>`; the buttons are in `Card.Footer`: «Отменить изменения» `ghost` + `neutral`, then the primary «Сохранить». While the request runs — `loading` on the button, and one `Fieldset disabled` turns the fields off; the form stays on screen, so success is the button text «Сохранено» for two seconds, without a notification.
- Fields are 20 px apart; two short related fields side by side while there is width, with `align-items: start` and `reserveSupportRow`, so an error does not shift the neighbour.
- An error comes through the field's `error` after submit, not while typing; a format hint goes in `hint`.
- A `Switch` applies at once — its section has no «Сохранить» button; the explanation is in the switch's own `hint`.
- The danger zone is the last section: an `outline` + `tone="danger"` button in `ConfirmDialog.Trigger`; `onConfirm` returns the delete Promise — the dialog holds `loading` itself, disables cancel and does not close while the request runs.

### Form in a Drawer

[drawer/examples/screen.tsx](../src/components/drawer/examples/screen.tsx)

- A work screen titles itself in its `Page.TopBar`: `Page.Title` with the counts in `Page.Description`; the search (`SmartFilter` with `fields={[]}`) narrows the table, so it is the table's `toolbar`; there is no second header in the flow.
- The opening button is the page's primary action in `Page.Actions`; `Drawer.Trigger` wraps it as a slot.
- The form is tied to the footer button through `form={formId}`: `Drawer.Footer` is outside the `<form>`, and submitting still works, by Enter too.
- Groups are a `Fieldset` without a frame with a `title-s` heading 16 px above the fields; 32 px of air between groups, no dividers. `Fieldset disabled` turns all the fields off while the request runs.
- Validation on submit: errors in each field's `error`, focus on the first invalid field; mark the minority: required fields are the majority, so `optional` stands only on the optional ones.
- The client type is a `Radio.Group` with `label` (two visible options), the manager a `Select`, consent a `Checkbox` with `hint`: the value goes with the form, it does not apply at once.
- Footer: «Отмена» `outline` + `neutral`, the primary action last, in `loading` during the request; closing is held by `Drawer.Guard` (`busy` — while saving, neither Escape nor the close button closes; `dirty` — after an edit it asks whether to discard the changes).
- The result is a `Notification` and a new row in the table; the panel closes by itself.

### Record editor

[field-list/examples/screen.tsx](../src/components/field-list/examples/screen.tsx)

- A record editor is a document page — a long form read top to bottom in card sections, like Settings — so its title stands in the flow: `Page.Header` with the title and one line of description in `Page.Heading` and the primary action in `Page.Actions`; no second title anywhere.
- The shape of the data decides the layout: records a person adds and removes are a `FieldList`, one row per record; the column headings stand once above the rows, and the fields in the cells take them as their labels.
- No label in every row and no numbered one («Преимущество 1»): a one-column list has no headings at all — its section names it ([reorder.tsx](../src/components/field-list/examples/reorder.tsx)).
- Small attributes of a record go in compact columns of its row, the color right after the icon it paints: the icon is a `Select` with only `Select.TriggerIcon`, the color `ColorPresets`; the first specs are pinned (`getLocked`) — the lock and the remove that is off say so themselves, without explanatory text.
- The base price and its changes are one list: the base row is pinned first and shows when it applies, the changes are rows with a month and a price; the ruble sign is in the field (`Input.InlineAffix`), not in every heading.
- One value in three currencies is three fields in one row under one group heading, each with its own name for screen readers and the currency inside the field.
- The lists live in the page state, the name and description fields in the `<form>` of the first section; the primary «Сохранить тариф» in `Page.Actions` is tied to it through `form={formId}` and saves everything. While the request runs the fields and the lists are off (`Fieldset disabled`, `disabled`), afterwards «Сохранено» on the button.

### Dashboard

[card/examples/screen.tsx](../src/components/card/examples/screen.tsx)

- An overview: the large `Page.Title` «Обзор» with a `Page.Description` line of data (what and as of when) in a `Page.Header` in the flow; a `Page.TopBar collapse` above it keeps the page's tools and buttons in reach and repeats the title once it scrolls away; the body starts with the tiles.
- The period is a `SegmentedControl` in the bar's `Page.Tools` and the report a `soft` + `neutral` button with an icon in its `Page.Actions`: the period changes the values on this same screen. Tabs (`Tabs`) are for different content, not for a period.
- Every tile of the screen is one `Page.Grid`: KPI `Card variant="stat-trend"` in `Page.Cell span={3}`, 16 px on both axes; `Card.Delta` with a `tone` by the meaning of the change: overdue growing is `danger`, its decline `success`.
- Another period — other values: each KPI tile is wrapped in `Crossfade state={period}` and flows instead of blinking; a Crossfade right in a `Page.Cell` fills it, so the tiles of a row keep one height.
- A trend over days is a `Sparkline` in a `Card` in a full-width cell: the last value, the change and a line you can scrub with a finger; a new series appears by itself.
- A chart with axes and several series is a `ChartFrame` in `Page.Cell span={8} rows={2}` beside two panels; `ChartFrame.Plot height="fill"` takes their height. A sized plot area (`renderPlot`), a legend that turns series off and a table for screen readers; series colors come from `series`, never your own.
- Panels are `Card variant="panel"` with `Card.Title as="h2"` in `Card.Header` and quiet context on the right after the title (`caption` + `muted`).
- Progress of one value is a `ProgressBar` with `label` and `showValue`; parts of a whole are `ProgressBar segments` with `legend` and `formatValue`: statuses are colored by `tone`, categories by `color`.
- Tiles of one screen are 16 px apart (`Page.Grid`), page blocks 24 px (`Page.Body`), a new topic with a heading 40 px (`Page.Section`): proximity shows what is related.
- A short list is a `DataTable paging="none"` in `Page.Section label` without a card; «Все счета» is a `LinkButton` in the section's `Page.Actions`: it is a way somewhere, not an action.

### Screen states

[crossfade/examples/screen.tsx](../src/components/crossfade/examples/screen.tsx)

- The top bar carries the page: `Page.Title` with a `Page.Description` line of data — the accounts and the date of the statement the screen stands on; there is no second header in the flow.
- An error that concerns the whole page is a `Banner tone="danger"` as the first block of `Page.Body` with a «Повторить» action; the action's result is a `Notification`.
- A region's error is in the region's place: `loadError` on the `DataTable` (the table head stays), not a pop-up.
- The page's line of data that waits for a load (`Page.Description` with counts or sums) stays mounted with `loading` — mounting it after the load moves the title in the bar.
- Table loading is `loading` + `loadingRows` (a skeleton of rows); card loading is a `Skeleton` in the shape of its rows and `aria-busy` on the card, and the block's height does not change. The state change is smooth: the card's region is in `Crossfade state={status}`, the table body changes by itself.
- Stale data beats emptiness: the balances are shown as of the previous date, and that is said on the right in `Card.Header`.
- Empty on the first run is `EmptyPage size="s"` inside the panel: an icon with `tone="accent"`, what it is and why, one action. An empty filter result is the table's `empty`.
- No home-made spinners, shimmers, grey placeholders or error modals: the kit already has a component for every state.

### Messenger

[chat/examples/screen.tsx](../src/components/chat/examples/screen.tsx)

- A work screen: the title «Поддержка» is `Page.Title` in `Page.TopBar` with the unread count in `Page.Description`.
- Layout: `Page.Split` (`Page.List`, `Page.Detail`) in a `fill` page: the dialog list `ChatList` (last message, ticks, unread, «печатает…») and the conversation beside it; on a narrow panel one pane at a time with `Page.BackButton` in `Chat.Header`.
- Search over the dialogs is the field of `ChatList` itself: `search` and `onSearchChange`; you filter the list (by name and last message), and the list shows the match in rows, the number found and an empty result itself. Never put a field of your own above the list.
- The conversation is `Chat.Root` in the pane's card: the header, `Chat.Search`, `Chat.Messages` and `Chat.Footer` with the Composer. Never assemble your own header, `ScrollContainer` and feed — the chat links search, jumps, selection and «печатает…» itself.
- Messages are data: `items` with `getKey`, `getAuthor`, `getDate` (service events through `isService`), the first unread is `unread`; the feed computes dates, runs, tails and the avatar place. `renderMessage` may be inline: only a message whose item or place changed renders again, so whatever a row shows lives in its item, and a reply's original comes from `entry.find(key)`.
- History is `hasOlder` and `onLoadOlder` with a promise: while it runs, a bubble-shaped `Skeleton` placeholder stands on top, and the view does not jump.
- Each kind of message is its own part of `Message`: text with markup, photos and albums, a file, a `VoicePlayer`; the screen renders the kinds its domain has. The others (`VideoNote`, a location, a contact, a link preview, reactions, a forwarded header) are shown on the Message, VoicePlayer and VideoNote pages; pinned messages and selection on the Chat page.
- Sending is a `Composer` with `onSend` without waiting: the message is in the feed at once with a clock under a stable id, then one tick, then two. Your own message rises from the input, the client's answer slides in from the side — the feed animates new messages itself; history and status changes are not animated.
- Reply and edit from `Message.Menu` open `Composer.Context` with `messageId`: `onSend` gets `replyTo` / `editOf`, the plate closes itself after sending; ↑ in an empty field is `onEditLast`. A quote in a bubble is `Message.Reply target`: a scroll to the original with a flash.
- «Печатает…»: your own signal is `Composer onActivityChange` into the socket, the other side's is `Chat.Root typing`: the line in the header and the bubble at the end of the feed together.
- Unread: `onNewMessage` adds an incoming message to the dialog's count, `onRead` subtracts what the reader really saw. Scrolled up — the round «to the latest» button counts the new ones itself.
- Search in the conversation is `Chat.SearchButton` and `Chat.Search`; pinned messages, when the domain has them, are `Chat.Pinned` between them and the feed.

### Sales pipeline board

[kanban/examples/screen.tsx](../src/components/kanban/examples/screen.tsx)

- The page titles itself in its top bar: `Page.Title` with a `Page.Description` that carries data («7 сделок в работе · 6 461 750 ₽», counted over the filtered deals).
- Search, filters and the view switch are the bar's `Page.Tools`, the one primary action «Новая сделка» its `Page.Actions`, the active filters its `Page.Chips`; `SmartFilter.Root` wraps the page.
- The board and the list are the same data: `Kanban` and `DataTable` replace each other through `Crossfade`, the filter is `matchesSmartFilter`.
- The board is the main area of the page, so its `variant` is the default, `plain`: stages without wells, headers and deal cards stand right on the page — one level of nesting, no frames of your own around the columns.
- The placement of deals is `value` as `{ [stage]: id[] }`; `onValueChange` returns the request's promise and applies `value` only after the answer; a server refusal returns the card to its place.
- Stage totals are in `renderColumnMeta` («2 сделки · 3 575 000 ₽»), the stage color is the column's `color`.
- A deal opens through `onItemOpen` of `Kanban.Root` (click, Enter, Space; never after a drag) in a `Drawer` with a `DescriptionList`; no `onClick` / `onKeyDown` of your own on the card; a deal with its own page — `getItemHref`. The stage change is available in the panel too — dragging is not the only way; `Drawer.Guard busy` holds the panel while saving.
- The first load is `loading` on `Kanban` and `DataTable`: skeletons in the geometry of cards and rows. Stages that come from the server too: `loading` with empty `columns` draws `loadingColumns` placeholder columns — never a board skeleton of your own beside the `Kanban`.

### App frame

[app-shell/examples/screen.tsx](../src/layout/app-shell/examples/screen.tsx)

- The frame is `AppShell.Template` (or `AppShell.Root`): `nav` is `Sidebar.Root`, `footer` is `BottomNav.Root`; the page is the children, and everything at the top belongs to it. There is no app-wide header. `scrollResetKey` is the current section (in a router, the pathname), so a new page opens at the top.
- The kit decides the switch itself: below 768 px the `Sidebar` goes off the edge, the page's `Page.TopBar` draws its menu button and `AppShell.Footer` shows the `BottomNav`; while the rail is on screen the footer is hidden. No media queries, menu state or `position: fixed` of your own.
- `BottomNav` holds 2–6 main sections, one word each; the rest lives in the `Sidebar`, and «Ещё» opens it as a panel through `useAppShellNav()` (`aria-expanded`, `aria-controls`, `setOpen`). `floating` is a glass capsule; `AppShell.Main` leaves room under it itself.
- Every page titles itself in its `Page.TopBar`: `Page.Title` with the section's name and a `Page.Description` that carries data («Среда, 14 октября · открытых задач: 3»); its body starts with the page's blocks.
- Counts: `Sidebar.ItemCount` (a plain number for information, `color="red"` when it needs action) and `BottomNav.ItemCount` only for what needs attention; the number is the same in both navigations.
- Choosing a section in either navigation goes through one handler; an activated Sidebar item closes the off-canvas panel by itself.
- A section change is a `Crossfade` by `state`: the page changes smoothly instead of jumping. Menu items in an app with a router are `asChild` + `NavLink`.

### Media library

[file-upload/examples/screen.tsx](../src/components/file-upload/examples/screen.tsx)

- A work screen titles itself in its top bar: `Page.Title` «Медиатека» with a `Page.Description` naming the object.
- Sections, search and order are the bar's `Page.Tools`, «Загрузить» its `Page.Actions`: search is a `SmartFilter.Toolbar` with `fields={[]}`, sections a `SegmentedControl` with `SegmentedControl.Count`.
- Uploads are `useUploadQueue` + `FileUpload.Root trigger="tile" layout="grid"`: progress, «В очереди», the failure reason and retry are built in, the add tile is also the drop zone; «Загрузить» opens the same picker (`picker.current?.open()`).
- A finished file leaves the queue for the library: its address is `item.result` of the server's answer, not the queue's `preview`.
- The library grid is a CSS grid of `Thumbnail` with `fullWidth` and one `ratio`; a video is `Thumbnail.Video`, which draws the duration and the play mark itself. `Gallery` does not fit here: it is an album of up to 10.
- A tile either opens or selects: when browsing it is `Thumbnail.Root asChild` with a button, when selecting — `checked` / `onCheckedChange`; «Выбрать» turns the mode on.
- Viewing is `MediaViewer` with `open` and `index` in two states and `getOrigin` by refs to the tiles, so a photo flies out of its tile and returns into it.
- Bulk delete is a `ConfirmDialog` with an `onConfirm` that returns a Promise; the result is a notification through `notify()`.
- The first load is a `Skeleton` in the geometry of the tiles, and a change of section, order or an empty result goes through `Crossfade`; an empty filter is `EmptyPage size="s"` with a reset.

### Resource schedule

[gantt/examples/screen.tsx](../src/components/gantt/examples/screen.tsx)

- The page titles itself in its top bar: `Page.Title` with a `Page.Description` that carries data («Сотрудников: 9 из 9»).
- A `fill` page: `Gantt scrollHeight="fill"` takes the free height — the header and the first column stick inside the chart, the page never scrolls sideways.
- `SmartFilter.Root` wraps the page: search with the role and client filter and teams (a `SegmentedControl` with counts) in `Page.Tools`, the primary action «Назначить» in `Page.Actions`, the active filters `SmartFilter.Chips` in `Page.Chips`. Zoom and «Сегодня» are built into `Gantt` — never add your own.
- A row is a person: `renderRowAvatar` with an `Avatar`, `renderRow` with the name and role; on a narrow chart the column keeps only the avatar. Overlapping works lay themselves out in lanes, an absence is a `readOnly` bar, a milestone has `start` equal to `end`.
- `onBarChange` returns a promise and changes the data only after the service answers: while it runs the bar is busy; a refusal (work on an absence) is `notify` and `throw`, and the bar returns to its previous dates by itself.
- `onBarCreate`: a range drawn on an empty place holds a busy draft while a `Modal` with `Modal.Guard busy` asks for the name and the client; saving adds the bar and resolves the promise, cancel rejects it — the draft dissolves. Work over an absence is refused at once.
- The legend of client hues is a row of `Badge.Root color` with `Badge.Dot` in the chart's `toolbar`; `renderBarTooltip` names the client in the tooltip under the dates, so the client reads not only by color.
- `onItemOpen` opens a `Drawer` with a `DescriptionList` (the person, the client `Badge`, the period and duration, `ProgressBar`); removing a task is a `ConfirmDialog` with an async `onConfirm`.
- States are on the chart itself: `loading` draws `Skeleton` placeholder rows in its geometry, `empty` an `EmptyPage size="s"` with «Сбросить фильтры»; the panel stays in place.
