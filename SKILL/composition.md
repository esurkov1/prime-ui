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
| [List page](#list-page) | data-table | [screen.tsx](../src/components/data-table/examples/screen.tsx) | the title, a line of figures, export and one primary action in the page's top bar; its SmartFilter search and filters and «Вид» in `Page.Tools`, the chips in `Page.Chips`, the table without a toolbar; statuses, pages, filtered empty state |
| [Detail page](#detail-page) | description-list | [screen.tsx](../src/components/description-list/examples/screen.tsx) | a nested record: the path ending in the title, status and due date and the record's actions by weight in the top bar; main column + side column of Cards, Timeline |
| [Settings page](#settings-page) | page | [screen.tsx](../src/layout/page/examples/screen.tsx) | the path in a collapsing top bar, the large title in the flow, a card with its own header per section, form with its own save, Switches that apply at once, danger zone with a confirm |
| [Form in a Drawer](#form-in-a-drawer) | drawer | [screen.tsx](../src/components/drawer/examples/screen.tsx) | the title, counts and the Drawer trigger in the top bar, the search in `Page.Tools`; Drawer form: groups, errors on submit, focus on the first invalid field, loading, toast |
| [Record editor](#record-editor) | field-list | [screen.tsx](../src/components/field-list/examples/screen.tsx) | a document page (a long form): the title and a line of description in `Page.Heading`, «Сохранить тариф» in `Page.Actions`, both in a `Page.Header` in the flow; a plan card edited in card sections: name and description, specs in a `FieldList` (icon-only `Select` and `ColorPresets` in compact columns, pinned rows, reorder), the price and its changes by month in one list with the base row pinned, a setup fee in three currencies in one row under one heading, save with «Сохранено» on the button |
| [Dashboard](#dashboard) | card | [screen.tsx](../src/components/card/examples/screen.tsx) | an overview titled in its `Page.TopBar`: the title + a line of data, the period switch and the report; KPI row that cross-fades to the new period, a Sparkline revenue trend, invoiced vs paid in a ChartFrame, panels with progress and a split, short table + link to the list |
| [Screen states](#screen-states) | crossfade | [screen.tsx](../src/components/crossfade/examples/screen.tsx) | title + the statement date in `Page.TopBar`, page error in a Banner with retry, region loading with a Skeleton, Crossfade between states, table error in place, first-run EmptyPage |
| [Messenger](#messenger) | chat | [screen.tsx](../src/components/chat/examples/screen.tsx) | title + the unread count in `Page.TopBar`; a full-height Page.Split of a `ChatList` with its search (live last message, ticks, unread counts, «печатает…») and a `Chat`: `Chat.Header` with the back button, avatar, title, the status that turns into «печатает…» (`typing`) and the search button, `Chat.Search`, `Chat.Messages` from `items` + `renderMessage` (dates, runs and the unread band from the data, history loaded above with `hasOlder` / `onLoadOlder`, a first load in skeletons), text, a photo, a file and sent voice, reply and edit from the menu through `Composer.Context messageId` (`replyTo` / `editOf`), the jump to the quoted message (`Message.Reply target`), optimistic sends whose messages rise from the composer while the client's answer slides in, «печатает…» both ways (`onActivityChange` → `Chat.Root typing`), unread counts from `onNewMessage` and `onRead`, the Composer with attachments in `Chat.Footer` |
| [Sales pipeline board](#sales-pipeline-board) | kanban | [screen.tsx](../src/components/kanban/examples/screen.tsx) | `Page.TopBar` titles the page (`h1` + a Description with the open deals and their sum) with SmartFilter search and a board / list SegmentedControl in `Page.Tools` and the one primary action in `Page.Actions`; Crossfade between a `plain` Kanban (stages without wells, deal cards on the page) and a DataTable of the same deals, column totals in `renderColumnMeta`, moves saved through an `onValueChange` promise that the server can refuse, the deal in a Drawer with a DescriptionList and stage actions, skeleton first load |
| [App frame](#app-frame) | app-shell | [screen.tsx](../src/layout/app-shell/examples/screen.tsx) | Sidebar rail on a wide screen, floating BottomNav in `AppShell.Footer` on a phone («Ещё» opens the Sidebar panel), a `Page.TopBar` with the menu button and the page title (`h1`) with a line of data, counts on items, a home page that cross-fades between sections |
| [Media library](#media-library) | file-upload | [screen.tsx](../src/components/file-upload/examples/screen.tsx) | `Page.TopBar` titles the page (`h1` + a Description with the object) with sections and counts, search (`SmartFilter` with `fields={[]}`) and order in `Page.Tools` and «⬆ Файлы» in `Page.Actions`; uploads through `useUploadQueue` in `FileUpload` tiles (`trigger="tile"`, `layout="grid"`) with progress, a failure and retry, a done file moving into the library; a grid of `Thumbnail` / `Thumbnail.Video` tiles that open `MediaViewer` out of the tile (`getOrigin`, `thumbnails`, `renderActions`) or, in selection mode, are picked (`checked`) for bulk download and a `ConfirmDialog` delete (icon-only buttons with tooltips); a Skeleton first load and a filtered `EmptyPage` in a `Crossfade` |
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
`Page.Heading`, the title group. Where the heading stands follows what the body is; its size follows
the place:

- **Every screen of data** — a list, a board, a chat, a schedule, a record, and every overview
  (a dashboard, analytics, statistics, finances, a builder): `Page.Heading` stands in
  `Page.TopBar` beside the page's tools and buttons ([the top bar](#the-top-bar)); there is no header
  in the flow, and the body starts with the first block.
- **Document pages** — settings, a long form, an article or help text, read top to bottom in one
  column with no page tools (no period, view or sections): `Page.Header` in the flow holds
  `Page.Heading` (the large title with one sentence of `Page.Description`) and the page's save
  action in `Page.Actions`; optionally a `Page.TopBar collapse` with only the path in its
  `Page.Heading`, which repeats the title once it scrolls away.

The test: a page with tools (a period, a view, sections), tiles or charts is a screen of data, and its
title stands in the bar. `collapse` belongs only to a bar that holds a `Page.Heading` (the path of a
document page); a bar of tools alone over a large title in the flow is two headers for one page.
Never two titles; never no `<h1>`. A bar whose page shows no title still holds a `Page.Title` — inside
`VisuallyHidden` — unless a flow `Page.Header` has one.

```tsx partial
// bad — an overview split in two: the bar holds only the period, the title stands in the flow
<Page.Root>
  <Page.TopBar collapse>
    <Page.Tools aria-label="Аналитика">…</Page.Tools>
  </Page.TopBar>
  <Page.Header>
    <Page.Heading>
      <Page.Title>Аналитика</Page.Title>
      <Page.Description>Продажи · на 8 октября, 9:40</Page.Description>
    </Page.Heading>
  </Page.Header>
  <Page.Body>…</Page.Body>
</Page.Root>
```

```tsx good
// good — the overview titles itself in its bar, like every screen of data
<Page.Root>
  <Page.TopBar>
    <Page.Heading>
      <Page.Title>Аналитика</Page.Title>
      <Page.Description>Продажи · на 8 октября, 9:40</Page.Description>
    </Page.Heading>
    <Page.Tools aria-label="Аналитика">
      <Datepicker.Root mode="range" aria-label="Период" />
    </Page.Tools>
  </Page.TopBar>
  <Page.Body>…</Page.Body>
</Page.Root>
```

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

Document page: the title in the flow
   └─ Page.Root maxWidth="wide" | "readable"
      ├─ Page.TopBar collapse      only the path in its Page.Heading; repeats the title once it scrolls away
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
  sections (a `SegmentedControl` with counts; of route links for
  [a section with sub-pages](#a-section-with-sub-pages)), the view, a period that drives several blocks; a
  search and filter (`SmartFilter.Toolbar`) only when it governs more than one table — a board and
  its list, a media grid ([where the filters go](#where-the-filters-go)). Named with `aria-label`;
  no buttons and no wrappers inside. While they fit, the tools stand in the heading row at the end
  edge, right before `Page.Actions` — a switch of sub-page links like any other.
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
              Сделка
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

### A section with sub-pages

One place of the app, several facets of it: «Мессенджеры» with «Каналы» and «Статистика», a client
with «Сделки» and «Документы». Each facet is a route of its own (`/messengers/channels`,
`/messengers/stats`), and the section stays one page:

- **The title is the section.** `Page.Title` reads «Мессенджеры» on every sub-route; the facet is
  the current link of the switch, never a second title or a title that names the facet.
- **The switch is links in `Page.Tools`**: a `SegmentedControl` whose items are router links
  (`SegmentedControl.Item asChild`), `value` = the current path. It is a navigation (Tab moves
  through the links, the current one is `aria-current="page"`). It stands in the heading row at the
  end edge, before the sub-page's buttons — tools, then actions, the primary last, as a view switch
  does — never on a line of its own under the title on a wide screen; the bar moves it under the
  title only when the row runs out of room. A sub-page with buttons of its own shifts the switch by
  their width; that is the accepted cost of one heading row.
- **The body is the sub-page**, swapped in a `Crossfade` keyed by the path (`Routes` given the
  `location`, so the leaving sub-page stays on its route while it fades).
- **The Sidebar stays on the section.** Its item is current on every sub-route: a `NavLink` to
  `/messengers` without `end`, or `current={pathname.startsWith("/messengers")}`.
- Never a second Sidebar level for facets, never a `Tabs` strip inside `Page.Body` for sub-pages.
  `Sidebar.Sub` is for views of one set of objects people open straight from the rail («Сделки» →
  «Новые», «В работе»); `Tabs` switch panels that are not routes.

Live: [router.tsx](../src/layout/page/examples/router.tsx).

```tsx
import { Page, SegmentedControl } from "prime-ui-kit";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

const MESSENGER_PAGES = [
  { to: "/messengers/channels", label: "Каналы" },
  { to: "/messengers/stats", label: "Статистика" },
];

export function MessengersPage({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <Page.Root>
      <Page.TopBar>
        <Page.Heading>
          <Page.Title>Мессенджеры</Page.Title>
        </Page.Heading>
        <Page.Tools aria-label="Мессенджеры">
          <SegmentedControl.Root value={pathname} aria-label="Подразделы">
            {MESSENGER_PAGES.map((page) => (
              <SegmentedControl.Item key={page.to} value={page.to} asChild>
                <Link to={page.to}>{page.label}</Link>
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </Page.Tools>
      </Page.TopBar>
      <Page.Body>{children}</Page.Body>
    </Page.Root>
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
| the number that matters (KPI, total) | `Kpi.Value`, or `Card.Total` for a record's total |

- Headings descend without skipping levels. One page title.
- Secondary text is a `tone`, never a custom color. Amounts and dates are tabular
  (`numeric` columns; `font-variant-numeric: tabular-nums` on your own totals).
- Emphasis by position and air: the total is larger and last; the status sits next to the fact it
  qualifies («Отправлен · Оплатить до 14 октября»).

## 4. Surfaces

- Inside the app the content panel is the page (layer 0 of the surface ladder); a `Card` on it is
  layer 1, and fields take the fill of the layer they sit on. The kit sets this by context — never
  set backgrounds ([the one exception](foundations.md#your-own-bounded-block)).
- **Card when** the block stands alone and has its own title: a settings panel, facts in a
  side column (a KPI tile is a `Kpi`, the card itself). **No card when** the block is the only thing in its region: a section heading
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
  <Card.Root>…</Card.Root>
</div>
```

```tsx good
// good — the card carries its own heading, stacked in the flow
<Card.Root>
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

- **One heading per block.** Under a heading that already names it — a `Drawer.Section` /
  `Modal.Section` label, a `Page.Section` — the card of fields has no `Card.Header`: its fields go in
  one `Card.Body`. A `Card.Header` with a title (and an icon, a description) only when nothing above
  the card names it. Two headings for one block say the same thing twice.

```tsx partial
// bad — the section names it, the card names it again
<Drawer.Section label="Смена пароля" description="Пароль от 8 символов">
  <Card.Root>
    <Card.Header>
      <Card.Title>Смена пароля</Card.Title>
      <Card.Description>Пароль от 8 символов</Card.Description>
    </Card.Header>
    <Card.Body>…</Card.Body>
  </Card.Root>
</Drawer.Section>
```

```tsx good
// good — the section heading names it; the card holds only the fields
<Drawer.Section label="Смена пароля" description="Пароль от 8 символов">
  <Card.Root>
    <Card.Body>
      <Input.Root label="Новый пароль">
        <Input.Wrapper>
          <Input.Field type="password" name="password" />
        </Input.Wrapper>
      </Input.Root>
    </Card.Body>
  </Card.Root>
</Drawer.Section>
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

- **One primary per area** (the page, card, dialog, form): `solid`, last in its row.
- **A button with text always has a fill.** Every other labelled button — secondary, «Отмена»,
  revert, «+ Транспорт» under a list — is `soft` + `tone="neutral"` (`tone="danger"` for a
  destructive one), wherever it stands: a page header, a card, a dialog footer, under a list. A
  button without fill is an icon-only `ghost` (`aria-label` + `Tooltip`) among neighbours without a
  fill ([below](#an-icon-button-takes-its-neighbours-fill)). Buttons have no outline: `variant="outline"` is not for product screens.
  A text with no fill reads as a caption, an outline as a disabled field — the fill is what says
  «press me», and its strength says how much.

```tsx partial
// bad — text without a fill, a cancel drawn as an outline
<Button.Root variant="ghost" tone="neutral">
  <Button.Icon>
    <Icon name="action.add" />
  </Button.Icon>
  Транспорт
</Button.Root>
<Drawer.Footer>
  <Drawer.Close>
    <Button.Root variant="outline" tone="neutral">Отмена</Button.Root>
  </Drawer.Close>
</Drawer.Footer>
```

```tsx good
// good — every labelled secondary is soft neutral; ghost only for an icon in the header
<Button.Root variant="soft" tone="neutral">
  <Button.Icon>
    <Icon name="action.add" />
  </Button.Icon>
  Транспорт
</Button.Root>
<Drawer.Footer>
  <Drawer.Close>
    <Button.Root variant="soft" tone="neutral">Отмена</Button.Root>
  </Drawer.Close>
</Drawer.Footer>
```

- Placement: every button of the page in one `Page.Actions` — of `Page.TopBar` on a screen of data, of the flow `Page.Header` on a document page — the primary last; card actions in `Card.Footer`, or in `Card.Actions` at the end of a `Card.Header` or a record row — nowhere else in a card; dialog actions in
  `Modal.Footer` / `Drawer.Footer`; row actions in the last column; actions on the selected rows of a
  table in its selection menu ([controls of a table](#controls-of-a-table)).
- A dialog footer is the dialog's answer, and it has one shape for every kind of dialog:
  | Dialog | Footer |
  |---|---|
  | a record, nothing changed | none — the kit draws no `X.Footer` while it is empty |
  | a record with changes | «Отменить изменения» (puts the form back to the saved values, the dialog stays open) + «Сохранить» |
  | a create form | «Отмена» (closes) + «Создать» |
  | a record's one action (read-only) | that action alone |

  It never repeats the header ×: no «Закрыть» in a footer. Deleting the record the dialog edits is
  not a third footer button: it stands in `Modal.Actions` / `Drawer.Actions` of the header
  ([actions of a record](#actions-of-a-record)), confirmed by a `ConfirmDialog`.

```tsx partial
// bad — while editing, the only way back is to close the drawer
<Drawer.Footer>{dirty ? <Button.Root type="submit">Сохранить</Button.Root> : null}</Drawer.Footer>
```

```tsx good
// declare: const dirty: boolean
// declare: const revert: () => void
// good — a change brings its answer: revert in place or save; no changes, no footer
<Drawer.Footer>
  {dirty ? (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={revert}>
        Отменить изменения
      </Button.Root>
      <Button.Root type="submit">Сохранить</Button.Root>
    </>
  ) : null}
</Drawer.Footer>
```

- An empty state's action replaces the header's primary, it does not duplicate it.
- Destructive: `tone="danger"`; a standalone trigger is `soft`, in a menu it is the last item, the
  confirm is a `ConfirmDialog` (its `onConfirm` returns the request's Promise).
- Going somewhere is a link (`LinkButton`, `Button.Root asChild` + `<a>`), doing something is a Button.
  One action — one label on the whole screen.

### An icon button takes its neighbours' fill

An icon-only button that ends or sits inside a row of filled things — fields, `soft` buttons, a
filled segment — is `variant="soft" tone="neutral"` at their height (the host tier gives it: no
`size` beside fields of the same tier), so the row starts and ends on a filled edge and reads as
one block. A `ghost` icon there leaves its glyph floating in air: the row seems to end at the last
field, and its end no longer mirrors its start against the card's padding. A remove that deletes is
the trash (`action.delete`) in `soft` + `danger`: the neighbours' neutral fill with a red glyph, the
red wash on hover, grey when disabled — never a «×», which reads as «close» or «clear». `ghost` stays where the neighbours have no
fill: a dialog header's actions beside the ×, a table cell among text, a chat header, a toolbar of
ghost tools, a button inline in text; over media it is `shade`. A `FieldList` draws its row trash and
«⋯» this way itself.

```tsx partial
// bad — the edit icon floats after a filled «Вернуть»; a hand-made line ends on a bare glyph
<Card.Header>
  <Card.Title>300 $</Card.Title>
  <Card.Actions>
    <Button.Root variant="soft" tone="neutral">Вернуть</Button.Root>
    <Button.Root variant="ghost" tone="neutral" aria-label="Исправить депозит">
      <Button.Icon>
        <Icon name="action.edit" />
      </Button.Icon>
    </Button.Root>
  </Card.Actions>
</Card.Header>
<div className={styles.line}>
  <Input.Root label="Сумма">…</Input.Root>
  <Button.Root variant="ghost" tone="neutral" aria-label="Удалить позицию">
    <Button.Icon>
      <Icon name="action.close" />
    </Button.Icon>
  </Button.Root>
</div>
```

```tsx good
// declare: const lines: { id: string; price: string }[]
// declare: const setLines: (lines: { id: string; price: string }[]) => void
// good — the edit icon takes the fill of «Вернуть»; the lines are a FieldList, whose trash is soft danger
<>
  <Card.Header>
    <Card.Title>300 $</Card.Title>
    <Card.Actions>
      <Button.Root variant="soft" tone="neutral">Вернуть</Button.Root>
      <Button.Root variant="soft" tone="neutral" aria-label="Исправить депозит">
        <Button.Icon>
          <Icon name="action.edit" />
        </Button.Icon>
      </Button.Root>
    </Card.Actions>
  </Card.Header>
  <FieldList
    aria-label="Позиции счёта"
    columns={[{ label: "Сумма" }]}
    value={lines}
    onValueChange={setLines}
    getId={(line) => line.id}
    renderItem={(line, row) => (
      <Input.Root>
        <Input.Wrapper>
          <Input.Field
            value={line.price}
            onChange={(event) => row.update({ price: event.target.value })}
          />
        </Input.Wrapper>
      </Input.Root>
    )}
  />
</>
```

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

### Actions of a record

The header of a record's dialog is the exception to the count above: the record's actions are what
the person opened it for, so each stays in sight. Up to five — spam, not a target, copy, delete — are
icon-only ghost `Button.Root`s, each in a `Tooltip.Trigger`, in `Drawer.Actions` / `Modal.Actions`
before the ×; a «⋯» `Dropdown` only gathers the sixth and later. On a phone the kit moves them under
the title by itself — never fold them into a «⋯» for the width. A destructive one either asks
(`ConfirmDialog.Trigger` around it) or, when it is easy to redo by hand, holds
(`holdToConfirm` with the action in `onConfirm`) — never a delete that runs on a plain press.

```tsx partial
// bad — three actions of the record behind a guess
<Drawer.Actions>
  <Dropdown.Root>
    <Dropdown.Trigger>
      <Button.Root variant="ghost" tone="neutral" aria-label="Другие действия">…</Button.Root>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item>Спам</Dropdown.Item>
      <Dropdown.Item>Нецелевое</Dropdown.Item>
      <Dropdown.Item tone="danger">Удалить</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
</Drawer.Actions>
```

```tsx good
// declare: const remove: () => Promise<void>
// good — each action in sight, named by its tooltip; the delete asks
<Drawer.Actions>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button.Root variant="ghost" tone="neutral" aria-label="Отметить как спам">…</Button.Root>
    </Tooltip.Trigger>
    <Tooltip.Content>Отметить как спам</Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <Button.Root variant="ghost" tone="neutral" aria-label="Нецелевое обращение">…</Button.Root>
    </Tooltip.Trigger>
    <Tooltip.Content>Нецелевое обращение</Tooltip.Content>
  </Tooltip.Root>
  <ConfirmDialog.Root title="Удалить сделку?" confirmLabel="Удалить" onConfirm={remove}>
    <Tooltip.Root>
      <ConfirmDialog.Trigger>
        <Tooltip.Trigger>
          <Button.Root variant="ghost" tone="danger" aria-label="Удалить сделку">…</Button.Root>
        </Tooltip.Trigger>
      </ConfirmDialog.Trigger>
      <Tooltip.Content>Удалить сделку</Tooltip.Content>
    </Tooltip.Root>
  </ConfirmDialog.Root>
</Drawer.Actions>
```

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
  FieldList draws every row's actions itself — the remove trash and the handle after it, a pinned
  row's remove off with its reason (`labels.lockedReason`) — so never add your own. Its add button
  under the rows is the place for records filled in place; a list people pick from creates at its
  top ([where the create button goes](#where-the-create-button-goes)).
- The row's actions (`rowActions`) follow [the menu threshold](#a-menu-from-two-actions): a row
  that only removes shows its trash (the default `"buttons"`, and the grip after it with
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

A control stands with what it changes. Ask of each one: what does it narrow or switch? (In a
drawer, the open tab is a «what» too: [a control for the whole tab](#a-record-in-a-drawer).)

- **A section page** — a page that is mainly one set of records (clients, deals, the fleet), shown
  as a table, a board or a calendar: its search, «Фильтр» and «Вид» stand in the page's top bar,
  `Page.Tools` (`SmartFilter.Root` wraps `Page.Root`, `SmartFilter.Toolbar` and the view's menu —
  `DataTableColumnsMenu`, `KanbanFieldsMenu`, `GanttCategoriesMenu` — in `Page.Tools`), the filter
  chips in `Page.Chips`, and the table has no `toolbar` of its own. The tools then stand in the same
  place on every section page and in every view of the set, and never jump when the view switches.
  The actions on selected rows stay with the table (`renderSelectionActions`).
- **A table block among other blocks** — a table inside a drawer, on a dashboard, a section of a
  record page: its tools belong to the `DataTable` (`toolbar`, `toolbarChips`), so they stay with
  the block they filter.
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
- **The shape of the search and the filter** (`SmartFilter.Toolbar`):

  | Shape | Written as | Use when |
  |---|---|---|
  | One field: search with the filter section at its end | `layout="combined"` | a list's or a table's own toolbar used every day, 1–4 filter fields: a separate button would only repeat what the field says |
  | Search and a «Фильтр» button beside it | the default (`layout="split"`) | the filter must be found at a glance: a page opened now and then or for the first time, many filter fields, a `Page.Tools` row where it lines up with other tool buttons |
  | The filter button alone | `searchable={false}` | the page already has its search elsewhere, or the data has no text search |
  | The search alone | `fields={[]}` | records with no column of a closed set yet; it grows filters without a rebuild |

  Search and filters work together: Enter pins the typed query as the first chip («Поиск: Евгений»),
  the field empties for the next filter, and the rows stay when they contain `search` AND pass
  `matchesSmartFilter` for every field — never a «search» chip of your own, never the field's text
  read from the DOM.
  On a phone every shape goes compact by itself — the button and the section keep only the icon
  and the count — so the search keeps its row; never an icon-only filter of your own beside it.
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
        Модель
      </Button.Root>
    </Page.Actions>
  </Page.TopBar>
  <Page.Body>
    <Page.Grid>
      {kpis.map((kpi) => (
        <Page.Cell key={kpi.label} span={3}>
          <Kpi.Root>
            <Kpi.Title>{kpi.label}</Kpi.Title>
            <Kpi.Value>{kpi.value}</Kpi.Value>
          </Kpi.Root>
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

- Paging is built in: `paging="pages"` (default, Pagination in the footer once there is a second
  page), `paging="infinite"` for feeds (its footer shows only while the next rows load),
  `paging="none"` for short lists on dashboards and details. The «Показано 1–6 из 10» range is
  `showRange`, only where the count matters to the task ([helper text is opt-in](ux.md#3-label-economy)).
- When the server holds more than you load (a CRM list, a register): `source="server"` — `rows` is the
  page the server returned, `rowCount` its total; `sort` / `page` / the SmartFilter value make the
  request, a new search or filter sets `page` to 1, and the old rows stay with `loading` until the
  answer comes ([server.tsx](../src/components/data-table/examples/server.tsx)).
- Columns: `numeric` for amounts, counts and dates (end-aligned, tabular; `headerAlign="end"` to line the
  head up); statuses as `Badge` from the app's [one status map](foundations.md#one-status-map); an avatar + two-line cell for people and
  companies; row menu last.
- States in place: `loading` (+ `loadingRows`) while there are no rows, `empty` for nothing found
  (string → compact EmptyPage, or your own `EmptyPage size="s"` with «Сбросить фильтры»), `loadError`
  for a failed load. The head and toolbar stay.
- Phones: the table scrolls inside itself, `stickyFirstColumn` keeps the key column; never let the page
  scroll sideways. Short lists of objects can be a `Card.List` instead of a table.

### Where the create button goes

Creating stands where a person reaches for it, and that depends on what the list is for.

- **A page of records** («+ Сделка», «+ Заказ») — the page's `Page.Actions`, the primary
  last ([the top bar](#the-top-bar)).
- **A pane people pick from** — the conversations of a messenger, the threads of an assistant —
  reads search → create → list: the create button stands at the top
  of the pane, under its search and over the rows, never under the list, where a long list pushes
  it out of view. In a `ChatList` it is `ChatList.Actions` (a `fullWidth` Button fits a narrow
  pane); the search stays the ChatList's own field ([messenger](#messenger)).
- **Records of a form** a person adds and fills in place (invoice lines, contacts) — the add button
  of `FieldList` under the rows: the new row appears right where the button was. This is FieldList's
  own placement for editing in place, never a model for a list people pick from.

Bad → good: [anti-slop.md](anti-slop.md#7c-a-create-button-out-of-reach).

### List rows

- A row's own controls stand beside its element in `List.ItemActions`, one tier below the row.
- A plain settings row reads label first and ends with its toggle (the platform convention).
- A row people reorder leads with its toggle — `<List.ItemActions side="start">`, or the Switch as the
  first child of a `Dnd.SortableItem` — so the on / off state reads first, like a checkbox, and the
  grip keeps the end edge ([reorder.tsx](../src/components/list/examples/reorder.tsx)).
- Never a toggle between the label and the grip: «Почта … [Switch] [grip]» reads as two handles.
- Rows that cannot move stay in the same list with `List.Item locked` — the lock takes the grip's
  place, so every row keeps one grid ([one kind, one list](ux.md#2-the-shape-of-the-data-decides-the-layout)).

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
| a list of cards with nothing in it yet (the vehicles of a deal, the contacts of a client) | `EmptyPage size="s"` inside a `Card.Root` in the list's place, the add button under it ([an empty list of cards](#an-empty-list-of-cards)) |

Stale data beats an empty block: show the last known values and say when they are from.

### An empty list of cards

A list of cards that is empty keeps the shape of the list: one `Card.Root` in its place holds an
`EmptyPage size="s"` — what goes here and why it matters — and the list's add button stays where it
is with cards, under the list. Not a line of text (it reads as a caption of something missing), not a
card drawn «like a record» with the button inside it (it reads as a record).

```tsx partial
// bad — a line of text where the cards go
<Typography tone="muted">Транспорт не добавлен</Typography>
<Button.Root variant="ghost">+ Добавить транспорт</Button.Root>
```

```tsx good
// good — the empty state in a card in the list's place, the add button under it
<Card.Root>
  <Card.Body>
    <EmptyPage.Root size="s" aria-labelledby="deal-vehicles-empty">
      <EmptyPage.Icon>
        <Icon name="object.package" />
      </EmptyPage.Icon>
      <EmptyPage.Title as="h3" id="deal-vehicles-empty">
        Транспорта нет
      </EmptyPage.Title>
      <EmptyPage.Description>Добавьте машины, которые клиент берёт по сделке.</EmptyPage.Description>
    </EmptyPage.Root>
  </Card.Body>
</Card.Root>
<Button.Root variant="soft" tone="neutral">
  <Button.Icon>
    <Icon name="action.add" />
  </Button.Icon>
  Транспорт
</Button.Root>
```

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
hand-made heading row — and only where the heading names what the blocks do not
([label economy](ux.md#3-label-economy)); a footer's `Drawer.Meta` / `Modal.Meta` goes above the buttons by itself when
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
- **One record header** — the same in a Drawer, a Modal and a Sheet, three lines in this order.
  Line 1 is `Drawer.Title`: the name, then the record's number as `number` («#678»), muted beside
  it; the name ellipsizes, the number never does (`loading` while the name comes). Line 2 is
  `Drawer.Description`, tight under the title: the record's context as one line of text
  («ООО «Северный ветер» · 1 240 000 ₽», «Аренда байка Пхукет · заявка 19 сент, 06:37»), cut with an
  ellipsis — never a badge, never the number. Line 3 is `Drawer.Badges`, the record's working
  controls right over the body or the tabs: first the pickers — the status, then the assignee —
  each a `Badge.Root` inside a `Dropdown.Trigger`; the assignee is a person's chip (`Badge.Avatar`
  with the initials, then the name), and nobody assigned is
  `<Badge.Root variant="outline">Назначить</Badge.Root>` in the same place; then the plain statuses
  (the channel, «Ждёт человека», «VIP»). The header sizes the badges (no `size`) and keeps them on
  one row, the rest behind «+N». The header places the lines in this order whatever the order in
  code; write them in it anyway. `Drawer.Actions` hold only buttons that act on this
  record: ghost icon Buttons, each in a `Tooltip.Trigger`, up to five in sight
  ([actions of a record](#actions-of-a-record)), centred on line 1 before the ×; on a phone the kit
  moves them under the title. A Badge in `Drawer.Actions` is a
  status in the wrong place; a way to another place (a section, a list) is no header action — a
  link in the body beside the data it leads to, or nothing. `Drawer.Icon` (a tone tile, or the
  record's picture at 40) is optional and a record header goes without it: the name leads.
- **One form, one save.** Every editable field of every tab is one form, and its submit is the one
  «Сохранить» of `Drawer.Footer`, shown while the form is dirty beside «Отменить изменения» (the
  form goes back to the saved values, the drawer stays open), with `Drawer.Guard` (`dirty`,
  `busy`). No save per section or tab, no «Есть несохранённые изменения» in `Drawer.Meta`: the save
  button and the guard already say it. Actions that work at once — turn sign-in on, send a link,
  end the other sessions — are buttons beside what they change and never wait for the save. After
  the save the button leaves, so the success is a `Notification`. An action apart from that answer
  («Выйти» on the person's own account) is the footer's start group: `Drawer.Actions`
  inside `Drawer.Footer`, never a third button beside «Сохранить» or text in `Drawer.Meta`.
- **Tabs are topics.** Each tab holds one topic, and a record's history (its log) is always a tab of
  its own. Tabs that outgrow the width never merge: the strip scrolls ([switchers](responsive.md#switchers)).
- **A control for the whole tab stands in the header.** A switch that changes every block of the
  open tab — the language of its texts, the period of its figures — is one control in
  `Drawer.Actions`, before the buttons, rendered only while a tab it applies to is open
  ([tab-switcher.tsx](../src/components/drawer/examples/tab-switcher.tsx)). It is the same rule as
  [where the filters go](#where-the-filters-go): what it changes is the tab, and the tab's place is
  the header. A control that changes one block stays in that block. A period starts from the
  period of the page the drawer opened from, so the drawer's figures match the row it came from.
- **Data at the drawer's level.** The drawer loads the record and the data of its tabs; a tab never
  fetches on mount, so coming back to it shows what it showed instead of a skeleton that collapses
  it. A tab that keeps a draft or its scroll keeps its panel with `Tabs.Panel keepMounted`.
- **It opens at once.** The header and the tabs come with the press, the body as a Skeleton in the
  data's geometry. Opened from a list row, the drawer shows what the row already knows (the name,
  the status) and holds only the rest (`Drawer.Description loading`); opened by a link it knows
  only the id, so `Drawer.Title loading` and `Drawer.Badges loading` hold those lines too — never a
  skeleton of your own in the header ([Drawer](../src/components/drawer/COMPONENT.md)).
- **A tab spaces its own blocks.** A `Tabs.Panel` in the body stands sections and self-titled
  blocks apart by itself; a `Drawer.Section` heading only where it names what the blocks do not
  ([label economy](ux.md#3-label-economy)).

```tsx good
// good — the record header: name and number, one line of data, the badges with the two pickers first
// declare: const setStatus: (status: string) => void
// declare: const setAssignee: (id: string | null) => void
<Drawer.Header>
  <Drawer.Title number="#678">Александра</Drawer.Title>
  <Drawer.Description>Аренда байка Пхукет · заявка 19 сент, 06:37</Drawer.Description>
  <Drawer.Badges>
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Badge.Root tone="info" aria-label="Статус: Новая">
          Новая
        </Badge.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={() => setStatus("progress")}>В работе</Dropdown.Item>
        <Dropdown.Item onSelect={() => setStatus("closed")}>Закрыта</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Badge.Root aria-label="Ответственный: Анна Котова">
          <Badge.Avatar>
            <Avatar.Root color="purple">
              <Avatar.Fallback>АК</Avatar.Fallback>
            </Avatar.Root>
          </Badge.Avatar>
          Анна Котова
        </Badge.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onSelect={() => setAssignee("sokolov")}>Илья Соколов</Dropdown.Item>
        <Dropdown.Item onSelect={() => setAssignee(null)}>Снять ответственного</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
    <Badge.Root color="sky">Telegram</Badge.Root>
    <Badge.Root tone="warning">Ждёт человека</Badge.Root>
  </Drawer.Badges>
  <Drawer.Actions>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button.Root variant="ghost" tone="neutral" aria-label="Диалог">
          <Button.Icon>
            <Icon name="object.message" />
          </Button.Icon>
        </Button.Root>
      </Tooltip.Trigger>
      <Tooltip.Content>Диалог</Tooltip.Content>
    </Tooltip.Root>
  </Drawer.Actions>
</Drawer.Header>
```

```tsx partial
// bad — the statuses above the text, the number and a status in the description, a status beside
// the buttons
<Drawer.Header>
  <Drawer.Title>Александра</Drawer.Title>
  <Drawer.Badges>
    <Badge.Root tone="warning">Ждёт человека</Badge.Root>
  </Drawer.Badges>
  <Drawer.Description>
    Заявка #678 · Аренда байка Пхукет
    <Badge.Root tone="info">Новая</Badge.Root>
  </Drawer.Description>
  <Drawer.Actions>
    <Badge.Root color="sky">Telegram</Badge.Root>
  </Drawer.Actions>
</Drawer.Header>
```

```tsx good
// good — the number by the name, one line of text under it, the statuses last, over the body
<Drawer.Header>
  <Drawer.Title number="#678">Александра</Drawer.Title>
  <Drawer.Description>Аренда байка Пхукет</Drawer.Description>
  <Drawer.Badges>
    <Badge.Root tone="info">Новая</Badge.Root>
    <Badge.Root color="sky">Telegram</Badge.Root>
    <Badge.Root tone="warning">Ждёт человека</Badge.Root>
  </Drawer.Badges>
</Drawer.Header>
```

```tsx partial
// bad — the assignee as an avatar and a name of your own, «Сменить» buttons for status and assignee
<Drawer.Badges>
  <Badge.Root tone="info">Новая</Badge.Root>
  <span className={styles.owner}>
    <Avatar.Root size="xs">…</Avatar.Root> Анна Котова
  </span>
</Drawer.Badges>
<Drawer.Actions>
  <Button.Root variant="ghost" tone="neutral">Сменить статус</Button.Root>
  <Button.Root variant="ghost" tone="neutral">Сменить ответственного</Button.Root>
</Drawer.Actions>
```

```tsx good
// good — each badge is its own picker; nobody assigned is an outline «Назначить» in the same place
// declare: const setAssignee: (id: string) => void
<Drawer.Badges>
  <Dropdown.Root>
    <Dropdown.Trigger>
      <Badge.Root variant="outline">Назначить</Badge.Root>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item onSelect={() => setAssignee("kotova")}>Анна Котова</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
</Drawer.Badges>
```

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

```tsx partial
// bad — the tab's language switch repeated in the heading of every section
<Tabs.Panel value="description">
  <Drawer.Section label="Название">
    <Drawer.Actions>
      <SegmentedControl.Root aria-label="Язык" defaultValue="ru">…</SegmentedControl.Root>
    </Drawer.Actions>
    …
  </Drawer.Section>
  <Drawer.Section label="Описание">
    <Drawer.Actions>
      <SegmentedControl.Root aria-label="Язык" defaultValue="ru">…</SegmentedControl.Root>
    </Drawer.Actions>
    …
  </Drawer.Section>
</Tabs.Panel>
```

```tsx good
// good — one switch for the open tab, in the header before ⋯, only on the tab it applies to
// declare: const tab: string
<Drawer.Header>
  <Drawer.Title>Кресло «Орион»</Drawer.Title>
  <Drawer.Actions>
    {tab === "description" ? (
      <SegmentedControl.Root aria-label="Язык текстов" defaultValue="ru">
        <SegmentedControl.Item value="ru">RU</SegmentedControl.Item>
        <SegmentedControl.Item value="en">EN</SegmentedControl.Item>
      </SegmentedControl.Root>
    ) : null}
    <Button.Root variant="ghost" tone="neutral" aria-label="Действия с моделью">
      <Button.Icon>
        <Icon name="action.more" />
      </Button.Icon>
    </Button.Root>
  </Drawer.Actions>
</Drawer.Header>
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
   closest component: Card has zones, a cover, record rows and a total, Kpi a figure with its change, period, chart and actions, Input has icons / affixes / a clear button / a counter / a strength meter,
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

The figure is a `Kpi`, and the switch is one of its parts: a SegmentedControl in `Kpi.Actions` at
the end of the title row, one tier down because it shares the row with the title; the period it
picks reads in `Kpi.Period` under the title.

```tsx
import { Kpi, SegmentedControl } from "prime-ui-kit";

export function RevenuePanel() {
  return (
    <Kpi.Root>
      <Kpi.Title>Выручка</Kpi.Title>
      <Kpi.Period>Октябрь</Kpi.Period>
      <Kpi.Actions>
        <SegmentedControl.Root size="s" defaultValue="month" aria-label="Период">
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Kpi.Actions>
      <Kpi.Value>4,2 млн ₽</Kpi.Value>
      <Kpi.Delta value={18} tone="success">
        +18%
      </Kpi.Delta>
      <Kpi.Meta>к сентябрю</Kpi.Meta>
    </Kpi.Root>
  );
}
```

For a plain KPI row put a `Kpi.Root` (Title · Value · Delta · Meta) in each `Page.Cell span={3}` of
the page's `Page.Grid` — see [the dashboard screen](../src/components/card/examples/screen.tsx). When the trend over days matters, add a
`Sparkline` in `Kpi.Media`: `useSparkline` gives its value, change and `Kpi.Period`, `{...reading.plot}` the line to scrub.
A tile whose value is words, not a number («Выдать PCX 160», «Заявка в Mini App») →
`Kpi.Root valueSize="s"`, its buttons in `Kpi.Actions`; a value with a meaning («к оплате» due, a
payment made) → `Kpi.Value tone` (and `DescriptionList.Item tone` in a pair). A tile that leads somewhere is a link (`Kpi.Root asChild`
around the link, or `Card.Link` inside it when the tile holds its own buttons or a Sparkline): the kit draws its arrow — never
an arrow of your own in the label.

### Tiles and cards of a record

The facts of a record (in its dialog, its page, its card in a list) read the same everywhere in an
app: one look per kind of block, never a weight per screen.

- **Fact tiles** — «К оплате», «Депозиты у нас», «Ближайшая задача», «LTV», «t.me/…», «Последний
  вход 20 окт, 07:44»: a row of `Kpi.Root valueSize="s"` tiles with `Kpi.Title`, `Kpi.Value`
  (`tone` by its meaning) and an optional `Kpi.Meta`. The value is body-m
  medium, a number, a phrase and a link alike, in every tile of the row and in every dialog of the
  app: a larger value breaks the drawer's structure as soon as a fact is a phrase. `valueSize="m"`
  only for a single total tile that stands alone, never for a row of facts. Never a `Typography`
  inside `Kpi.Value` to change its size: the loading Skeleton then has the wrong height.
- **Type of the blocks of a record.** Two families, each with one set of sizes everywhere in the
  app — the kit sets them, so never a `Typography` variant of your own inside these parts:

  | Block | Part | Role (size / line, weight) |
  |---|---|---|
  | Fact tiles at the top (`Kpi.Root valueSize="s"`) | `Kpi.Title` · `Kpi.Value` · `Kpi.Meta` | title-s 14/20 semibold · body-m 14/20 medium · body-s 13/20 muted |
  | KPI numbers at the top (`Kpi.Root valueSize="m"`) | `Kpi.Title` · `Kpi.Value` · `Kpi.Delta` | title-s 14/20 semibold · heading-m 24/32 semibold · a Badge `s` |
  | Every other card (status, object, deposit, bill) | `Card.Title` · `Card.Description` | title-s 14/20 semibold · body-s 13/20 secondary |
  | Line items in a card | `DescriptionList` / `FieldList` rows | field label 13/20 · field text 14/20 |
  | A card's total | `Card.Total` (its `label` over the amount) | body-s 13/20 muted · title-m 16/24 semibold |

  The top row reads first and stands a step above the cards under it; the cards share one title
  and one secondary line, so a drawer of five cards reads as one list.
- **KPIs of a record** (counts and amounts with a change, in a dialog): `Kpi.Root` with
  `valueSize="m"`, so a row of two and a row of four in one drawer keep one size — never a layout
  bent to make the widths match. The default `l` is for a dashboard grid.
- **An object of the record** (the video at hand-over, a connected channel account, a session, the
  current term): a card of one `Card.Header` — its picture first (`Card.Icon` with a `Thumbnail`,
  an `Avatar`, a `ProgressCircle` or an icon tile), then two lines: `Card.Title` names the object,
  `Card.Description` gives one line of data («20 окт, 09:21 · Евгений Сурков»), and its one action
  in `Card.Actions` at the end. Two lines, never a third: a label above the title repeats the section heading. The
  kit pads a header with nothing under it evenly, so no padding of your own.
- **A task of the record with its assignee** (a return, a delivery, a call back): a card of one
  `Card.Header`. `Card.Title` is the task with its term («Вернуть 10 дек · через 50 дн.»);
  `Card.Description` starts with the assignee picker — a `Badge.Root` with `Badge.Avatar` in a
  `Dropdown.Trigger`, as in the Card example [actions](../src/components/card/examples/actions.tsx)
  — and then the facts («выдан 21 окт, 15:43»). The person is named once: «Выдан 21 окт · Евгений
  Сурков · [Евгений Сурков ▾]» repeats the name and leaves a dangling «·»; the picker first and the
  facts after it say the same in one line. The actions stand in `Card.Actions` at the header's end,
  the primary last: one secondary action is a labelled `soft` button («Отменить»), two or more
  gather behind `action.more` (both in the same example) —
  [a menu from two actions](#a-menu-from-two-actions).
- **A record card with a total** (a vehicle of a deal, a payment, an invoice): the head is a
  `Card.Header` — its mark first (`Card.Icon` with the record's picture or a `ProgressCircle` term
  ring), `Card.Title` with `Card.Link` when the card opens the record (the kit centres its arrow on
  the head), the statuses in `Card.Description`; the line items are a
  `DescriptionList.Root align="end"` in `Card.Body divider="full"`; the footer is
  `Card.Footer divider="fill"`: the action first, then `Card.Description` with a `Badge.Dot` and
  the task, then `Card.Total` at the end edge (the amount, its state in `label` with a `tone`,
  «к оплате 6 400 ฿»). See [record-totals](../src/components/card/examples/record-totals.tsx).

```tsx partial
// bad — the value restyled by hand, a weight of its own per drawer
<Kpi.Root>
  <Kpi.Title>К оплате</Kpi.Title>
  <Kpi.Value>
    <Typography as="span" variant="title-m">21 000 ₽</Typography>
  </Kpi.Value>
</Kpi.Root>
```

```tsx good
// good — the kit's value: the same in every tile, the Skeleton in its height
<Kpi.Root valueSize="s">
  <Kpi.Title>К оплате</Kpi.Title>
  <Kpi.Value tone="warning">21 000 ₽</Kpi.Value>
</Kpi.Root>
```

## Screen rules

What each screen in [the index](#screens) demonstrates — keep these when you start from it.

### List page

[data-table/examples/screen.tsx](../src/components/data-table/examples/screen.tsx)

- A work screen titles itself in its `Page.TopBar`: `Page.Title` is the only heading, its `Page.Description` is one line of figures («10 счетов · просрочено 2 на …»), not a sentence about the page; there is no second header in the flow.
- It is a section page, so its search, «Фильтр» and «Вид» stand in `Page.Tools` (`SmartFilter.Root` around `Page.Root`), the chips in `Page.Chips`, and the table has no `toolbar` — the same place as on every other section; the bar also keeps the heading, export (`soft` + `neutral`, an icon beside its label) and the one primary action (`solid`, last) in `Page.Actions`. A KPI row added above changes nothing in the table's tools.
- A status is a `Badge` read from one map of the app (`STATUS`); an invoice's statuses are judgements, so each wears a `tone` — the text carries the meaning, the tone repeats it ([one status map](foundations.md#one-status-map)).
- Numbers and dates are `numeric` columns with `headerAlign="end"` (tabular figures, values and heading on the end edge). On a phone the table scrolls inside itself and `stickyFirstColumn` keeps the number in place — the page never scrolls sideways.
- Row actions are a `Dropdown` behind an `action.more` icon of size `s` in the last column (`hideHeader`), pinned to the end edge with `stickyLastColumn` so they stay in reach while the columns scroll: controls in cells are one tier below the table. Delete is `tone="danger"` at the end of the menu.
- Empty after a filter is the table's `empty` with `EmptyPage size="s"` and a «Сбросить фильтры» action; the header and the filters stay in place.

### Detail page

[description-list/examples/screen.tsx](../src/components/description-list/examples/screen.tsx)

- A nested record titles itself in its `Page.TopBar`: `Page.Heading` holds the path up (`Breadcrumb.Root` with the list, «Счета») ending in `Page.Title` with the record's name on the same line; there is no second header in the flow. Top-level pages have no breadcrumb.
- The status is words next to the fact that matters now, in `Page.Description` («Отправлен · оплатить до 14 октября»), not a separate plate.
- The record's actions are the bar's `Page.Actions`, by weight: one primary (`solid`, last), the secondary `soft` + `tone="neutral"`, each with an icon beside its label. Rare and destructive ones live in a `Dropdown` behind an `action.more` icon (also `soft`, so the button has a shape beside its neighbours); voiding is `tone="danger"` at the bottom of the menu.
- Columns are a CSS module on flex-wrap without breakpoints: the main one grows, the side one holds ~18rem and drops below when the main one runs out of room.
- A section without a frame is `Page.Section label`: an h2 heading 16 px above the table; a `Card` with its `Card.Header` only for standalone blocks of the side column. A table is already a filled block — never put it in a card.
- «Label → value» pairs about the client are `DescriptionList.Root orientation="vertical"` with `DescriptionList.Item label`; amounts are tabular figures, the total is larger (`title-m`) and ends where the «Сумма» column ends (the table cell inset).
- History is a `Timeline`: events top-down from the latest, dates in `Timeline.ItemMeta`; a row highlights on hover.

### Settings page

[page/examples/screen.tsx](../src/layout/page/examples/screen.tsx)

- A document page: `Page.Root maxWidth="wide"`, the large `Page.Title` with a sentence of `Page.Description` in the `Page.Heading` of a `Page.Header` in the flow, and a `Page.TopBar collapse` whose `Page.Heading` holds only the path and repeats the title once it scrolls away.
- A section is a `Card` with its own `Card.Header` (`Card.Title as="h2"` + a line of `Card.Description`), the cards stacked in the flow ([a titled block](#4-surfaces)).
- The form wraps the whole `Card.Root` in `<form noValidate>`; the buttons are in `Card.Footer`: «Отменить изменения» `soft` + `neutral`, then the primary «Сохранить». While the request runs — `loading` on the button, and one `Fieldset disabled` turns the fields off; the form stays on screen, so success is the button text «Сохранено» for two seconds, without a notification.
- Fields are 20 px apart; two short related fields side by side while there is width, with `align-items: start` and `reserveSupportRow`, so an error does not shift the neighbour.
- An error comes through the field's `error` after submit, not while typing; a format hint goes in `hint`.
- A `Switch` applies at once — its section has no «Сохранить» button; the explanation is in the switch's own `hint`.
- The danger zone is the last section: a `soft` + `tone="danger"` button in `ConfirmDialog.Trigger`; `onConfirm` returns the delete Promise — the dialog holds `loading` itself, disables cancel and does not close while the request runs.

### Form in a Drawer

[drawer/examples/screen.tsx](../src/components/drawer/examples/screen.tsx)

- A work screen titles itself in its `Page.TopBar`: `Page.Title` with the counts in `Page.Description`; the search (`SmartFilter` with `fields={[]}`) narrows the table, so it is the table's `toolbar`; there is no second header in the flow.
- The opening button is the page's primary action in `Page.Actions`; `Drawer.Trigger` wraps it as a slot.
- The form is tied to the footer button through `form={formId}`: `Drawer.Footer` is outside the `<form>`, and submitting still works, by Enter too.
- Groups are a `Fieldset` without a frame with a `title-s` heading 16 px above the fields; 32 px of air between groups, no dividers. `Fieldset disabled` turns all the fields off while the request runs.
- Validation on submit: errors in each field's `error`, focus on the first invalid field; mark the minority: required fields are the majority, so `optional` stands only on the optional ones.
- The client type is a `Radio.Group` with `label` (two visible options), the manager a `Select`, consent a `Checkbox` with `hint`: the value goes with the form, it does not apply at once.
- Footer: «Отмена» `soft` + `neutral`, the primary action last, in `loading` during the request; closing is held by `Drawer.Guard` (`busy` — while saving, neither Escape nor the close button closes; `dirty` — after an edit it asks whether to discard the changes).
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

- An overview titles itself in its `Page.TopBar` like any screen of data: `Page.Title` «Обзор» with a `Page.Description` line of data (what and as of when) in `Page.Heading`, beside the page's tools and buttons; no header in the flow, the body starts with the tiles.
- The period is a `SegmentedControl` in the bar's `Page.Tools` and the report a `soft` + `neutral` button with an icon in its `Page.Actions`: the period changes the values on this same screen. Tabs (`Tabs`) are for different content, not for a period.
- Every tile of the screen is one `Page.Grid`: a `Kpi.Root` tile each in `Page.Cell span={3}`, 16 px on both axes; `Kpi.Delta` with a `tone` by the meaning of the change: overdue growing is `danger`, its decline `success`.
- Another period — other values: each KPI tile is wrapped in `Crossfade state={period}` and flows instead of blinking; a Crossfade right in a `Page.Cell` fills it, so the tiles of a row keep one height.
- A trend over days is a `Sparkline` in the `Kpi.Media` of a full-width `Kpi` tile: the tile shows the period's sum from `useSparkline` (`summary`) over a line you can scrub with a finger; a new series appears by itself.
- A chart with axes and several series is a `ChartFrame` in `Page.Cell span={8} rows={2}` beside two panels; `ChartFrame.Plot height="fill"` takes their height. A sized plot area (`renderPlot`), a legend that turns series off and a table for screen readers; series colors come from `series`, never your own.
- Panels are a `Card` with `Card.Title as="h2"` in `Card.Header` and quiet context on the right after the title, in `Card.Actions` (`caption` + `muted`).
- Progress of one value is a `ProgressBar` with `label` and `showValue`; parts of a whole are `ProgressBar segments` with `legend` and `formatValue`: judgements wear `tone`, stages and categories `color` ([tone or color](foundations.md#tone-or-color)).
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
- Creating a dialog or a thread («+ Чат») is `ChatList.Actions`: under the search, over the rows — search → create → list, never a button under the list ([where the create button goes](#where-the-create-button-goes)).
- Search over the dialogs is the field of `ChatList` itself: `search` and `onSearchChange`; you filter the list (by name and last message), and the list shows the match in rows, the number found and an empty result itself. Never put a field of your own above the list.
- The conversation is `Chat.Root` in the pane's card: the header, `Chat.Search`, `Chat.Messages` and `Chat.Footer` with the Composer. Never assemble your own header, `ScrollContainer` and feed — the chat links search, jumps, selection and «печатает…» itself.
- Messages are data: `items` with `getKey`, `getAuthor`, `getDate` (events of the record — an agent took the client, a status moved — through `isService`, drawn as `Chat.Service` with `Chat.ServiceIcon` and `Chat.ServiceChange`), the first unread is `unread`; the feed computes dates, runs, tails and the avatar place. `renderMessage` may be inline: only a message whose item or place changed renders again, so whatever a row shows lives in its item, and a reply's original comes from `entry.find(key)`.
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
- Search, filters and the view switch are the bar's `Page.Tools`, the one primary action «+ Сделка» its `Page.Actions`, the active filters its `Page.Chips`; `SmartFilter.Root` wraps the page.
- The board and the list are the same data: `Kanban` and `DataTable` replace each other through `Crossfade`, the filter is `matchesSmartFilter`.
- The board is the main area of the page, so its `variant` is the default, `plain`: stages without wells, headers and deal cards stand right on the page — one level of nesting, no frames of your own around the columns.
- The placement of deals is `value` as `{ [stage]: id[] }`; `onValueChange` returns the request's promise and applies `value` only after the answer; a server refusal returns the card to its place.
- Stage totals are in `renderColumnMeta` («2 сделки · 3 575 000 ₽»), the stage color is the column's `color`.
- A deal opens through `onItemOpen` of `Kanban.Root` (click, Enter, Space; never after a drag) in a `Drawer` with a `DescriptionList`; no `onClick` / `onKeyDown` of your own on the card; a deal with its own page — `getItemHref`. The stage change is available in the panel too — dragging is not the only way; `Drawer.Guard busy` holds the panel while saving.
- A record's card, when it carries more than a title: zones of parts in `Kanban.ItemSection` (the kit draws the faint line between zones and drops an empty zone) — the name row `Kanban.ItemTitle number` with the owner `Avatar.Root` inside it; the units it holds `Kanban.ItemResource` (a `ProgressCircle` of the term with a short text, «18 д»); the one next step a `Badge fullWidth` first in its zone; facts `Kanban.ItemFact` (an `Icon` and a caption, a toned `Typography` span for a debt); the source and its date `Kanban.ItemFooter`. No `Divider`, gaps or truncation of your own — [Kanban](../src/components/kanban/COMPONENT.md), example `deal-cards`.
- What a view shows is one «Вид» in `Page.Tools` beside the search, the same button for every view of the data — `KanbanFieldsMenu` with the board (the page renders each part by `hiddenFields`), `DataTableColumnsMenu` with the table, `GanttCategoriesMenu` with a schedule (`categories` colour the bars and `hiddenCategories` hide them; a legend row only with `legend`, when the bars' words don't explain their colours); never a hand-made Dropdown or a renamed `labels` workaround.
- Every deal goes to `items` and `value`, however many: the columns draw only the cards in view — never slice a column by hand.
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
- Sections, search and order are the bar's `Page.Tools`, «⬆ Файлы» its `Page.Actions`: search is a `SmartFilter.Toolbar` with `fields={[]}`, sections a `SegmentedControl` with `SegmentedControl.Count`.
- Uploads are `useUploadQueue` + `FileUpload.Root trigger="tile" layout="grid"`: progress, «В очереди», the failure reason and retry are built in, the add tile is also the drop zone; «⬆ Файлы» opens the same picker (`picker.current?.open()`).
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
- A row is a person: `renderRowAvatar` with an `Avatar`, `renderRow` with the name and role; on a narrow chart the column keeps only the avatar. Overlapping works lay themselves out in lanes, an absence is a bar with `edit: "none"`, work already under way (an issued rental) `edit: "end"` — only its end moves; never a move refused in `onBarChange` to fake a fixed start; a milestone has `start` equal to `end`.
- `onBarChange` returns a promise and changes the data only after the service answers: while it runs the bar is busy; a refusal (work on an absence) is `notify` and `throw`, and the bar returns to its previous dates by itself.
- `onBarCreate`: a range drawn on an empty place holds a busy draft while a `Modal` with `Modal.Guard busy` asks for the name and the client; saving adds the bar and resolves the promise, cancel rejects it — the draft dissolves. Work over an absence is refused at once.
- The legend of client hues is a row of `Badge.Root color` with `Badge.Dot` in the chart's `toolbar`; `renderBarTooltip` names the client in the tooltip under the dates, so the client reads not only by color.
- `onItemOpen` opens a `Drawer` with a `DescriptionList` (the person, the client `Badge`, the period and duration, `ProgressBar`); removing a task is a `ConfirmDialog` with an async `onConfirm`.
- States are on the chart itself: `loading` draws `Skeleton` placeholder rows in its geometry, `empty` an `EmptyPage size="s"` with «Сбросить фильтры»; the panel stays in place.
