# Cheatsheet — the decisions agents get wrong

One line per decision: **do** this, **not** that. Every name here exists in the kit; the full
reference is each component's `COMPONENT.md` ([components.md](components.md)), the reasons are in
[composition.md](composition.md) and [api-contract.md](api-contract.md).

## Setup

- Import the styles once at the app root: `import "prime-ui-kit/bundle.css"` (tokens, themes, components), plus the opt-in `prime-ui-kit/fonts.css` and `prime-ui-kit/reset.css` when the app has no fonts or reset of its own — not per page, not a copied token file.
- Switch the theme with `applyTheme("light" | "dark")` — not a class or `style` on `<html>`.
- Put `NotificationProvider` and `AppShell.Root` in the app root once — not inside a page component.
- Import everything from `"prime-ui-kit"` — not from `prime-ui-kit/src/...` or `lucide-react` for a glyph the kit has. Two subpaths: `import { ColorField, ColorPicker, parseColor } from "prime-ui-kit/color-picker"` (needs the optional peer `react-aria-components`; `ColorPresets` and `ColorSwatches` come from the root), and `import { BellIcon } from "prime-ui-kit/icons"` for a glyph outside the `<Icon name>` set.

## Size

- Omit `size` for the default `m` — never write `size="m"`.
- Set `size` on the root (`Input.Root size="s"`, `Select.Root size="s"`) — not on `Input.Field` or `Select.Trigger`.
- One tier for a whole region: `<ControlSizeProvider value="s">` around a dense toolbar — not `size="s"` on one control to make it fit.
- Inside a sized host (Popover, Banner, LoginForm, the DataTable `toolbar`) leave the kit controls without `size` — the host passes its tier ([the host tier](api-contract.md#size-and-the-host-tier)).
- Marks in one row match by diameter: an `Avatar` is one size name above a `ProgressCircle` or a `Thumbnail` (`<Avatar.Root size="l">` beside a default ring, both 40) ([marks side by side](foundations.md#marks-side-by-side)).
- A control in a table cell is one tier down: `<Button.Root size="s" variant="soft" tone="neutral">` (an icon-only one `variant="ghost"` among text, `soft` beside a soft button); the controls of a surface's header and footer (Card, Modal, Drawer) take the surface's own letter, as tall as the fields of a form in it.

## Structure

- Components with parts render through `.Root` + parts: `<Button.Root>`, `<Modal.Root>` — `<Button>` and `<Modal>` are not components.
- Leaves are single exports with no `.Root` (`<Typography>`, `<Skeleton />`, `<DataTable>`, `<Sparkline>`… — [the list](api-contract.md)) — not `<Typography.Root>`.
- Data-driven components take data as props: `DataTable columns rows`, `SmartFilter.Root fields`, `TagSelect options`, `ProgressBar segments` — not mapped child parts.

## Fields

- Frame a field with props on the root: `<Input.Root label="Почта" hint="…" error="…" required>` — not a separate `Label` / `Hint` next to it.
- Mark the minority, never both everywhere ([the rule](api-contract.md#forms)).
- Placeholder is an example value (`name@company.ru`) — never the label.
- Checkbox, Switch, Radio: the text is the part `<Checkbox.Label>`, `hint` / `error` sit on `Checkbox.Root` — and a radio choice's on `Radio.Group` ([choice controls](api-contract.md#choice-controls)) — not a `label` prop.
- Show `error` after blur or on submit; `<form noValidate onSubmit>` + `<Button.Root type="submit" loading>` — not validation on every keystroke.
- Groups of fields: `<Fieldset label="Контакты" disabled={saving}>` with the submit `<Button.Root loading>` outside it — not a hand-reset `<fieldset>` with a `Typography` heading, not `disabled` on every field while saving. One choice with a heading (`Radio.Group label`) needs no Fieldset.
- Uploads: `const queue = useUploadQueue({ upload })` → `<FileUpload.Root queue={queue} />` (`FileUpload.Queue` when the picker lives elsewhere) — progress, «В очереди», the reason of a failure, retry and remove come with it (three at once by default, `concurrency`); not a hand-kept list of files with own progress bars. A photo appears at once from its local preview.
- After-upload work (attach the file to a record) runs inside `upload` after the request resolves — `context.id` is the item; a file the user can open is `FileUploadFile.href`, not your own download button beside the row.
- A choice in a form (SegmentedControl, ButtonGroup) is a field too: `label`, `hint`, `error` on its root — not a `Label` wired by hand.
- A record card that saves each field: `<Input.Root onCommit={save}>` (save returns a Promise) — not hand-written blur / Enter / Escape handlers or a field disabled while saving.
- Markdown text outside a chat (an announcement, a task description) is written in `<Textarea.Root formatting>`: the Composer's toolbar, hotkeys and subset (`**`, `_`, `~~`, `` ` ``, `||spoiler||`, links, `> `) — not a hand-made toolbar over a textarea. Turn it on only where the text is shown with its Markdown, and show it with `<RichText>{text}</RichText>` — not `dangerouslySetInnerHTML` or a Markdown library.
- Free text the team often repeats (a city, a place): `<Input.Root suggestions={CITIES}>` — any text stays allowed; not a `<datalist>` or a Select. A time of day: `<Input.Field type="time" />` — not a Datepicker or two Selects.
- A status of the value under a field («Осталось 12 дней»): `hint` with `hintTone="warning"`, the words carrying the status — not a coloured text of your own, and never `hintTone="danger"` for a validation error (that is `error`).
- A unit or a prefix stands in the field's affix (`Input.InlineAffix`, `Input.Affix`) — not in its `label` too: the affix is read with the field.
- Copy or call next to a value: `Input.CopyButton`, `Input.Action` inside `Input.Wrapper` — not a Button beside the field; a password: `Input.RevealButton`.
- A permission or a setting that is on or off: `<Switch.Root>` with its `Switch.Label`, in a saved form too; a `Checkbox` only picks items out of a set, takes a consent or an option of the action sent. A level per entity (access per section): a `FieldList` of `Select`s, not a stack of `SegmentedControl`s; a stored preference (the theme): a `Select` field ([a flag, a level, a set](choosing.md#a-flag-a-level-a-set)).
- Records of one shape a person adds and removes (invoice lines, contacts, specs, prices by period): `<FieldList columns={[{ label: "Услуга" }, { label: "Цена", width: "m" }]} value onValueChange getId createItem addLabel renderItem={(item, row) => <>…fields without label…</>} />` — the headings stand once, every field takes its column heading as its label; not a `.map()` of fields with a `label` in every row, not «Позиция 1», «Позиция 2».
- Small attributes in a row of fields: an icon-only `Select` (`<Select.Trigger><Select.TriggerIcon>…</Select.TriggerIcon></Select.Trigger>`, no `Select.Value`) and a `ColorPresets` swatch in `width: "compact"` columns — not a full-width Select and a ColorField on a line of their own.
- FieldList row actions: the default trash (and the grip with `reorderable`) in sight on every row, however many columns; `rowActions="menu"` only for a `reorderable` list on a touch-first screen — not a «⋯» that holds one «Удалить» ([a menu from two actions](composition.md#a-menu-from-two-actions)); `variant="surface"` when the list sits among other fields, `plain` when it is the card's content — not a Card around the list.
- A base value with overrides (a price and its changes by month): one `FieldList`, the base as the first row pinned by `getLocked` — not a separate field above a list in another geometry.
- Rows that add up: `FieldList renderTotals={(items) => <>…one node per column…</>}` draws «Итого» under the rows on the same tracks — not a line of text typed under the list, not a DataTable of fields.
- One value in several units (a deposit in ₽, $, ฿): the fields side by side in one row under one heading, each unit in `Input.InlineAffix` — not a label per field, not the unit in the label and in the field.

## State

- Uncontrolled by default: `defaultValue`, `defaultChecked`, `defaultOpen`.
- Controlled triads, same names everywhere: `value` / `onValueChange`, `checked` / `onCheckedChange`, `open` / `onOpenChange` — not `onChange(event)` (except the native `Input.Field` / Textarea `onChange`), `isOpen`, `onToggle`.
- Selection count is `multiple` (`Select.Root multiple`) — not `type="multiple"`.
- A slow or risky action is an async event: return the request's Promise from `onConfirm`, `onCommit`, `onReorder`, `onBarChange`, `onSend`, a Switch's `onCheckedChange`, a Slider's `onCommit`, a DigitInput's `onComplete`, a Kanban or FileUpload change, a Badge `onRemove`, TagSelect `onCreate`… — the component shows pending, keeps the change on resolve and undoes it on reject (each component's COMPONENT.md says how); not `true` / `false`, not your own pending flag, no `onBeforeX`.
- A Select that saves on pick: return the save's Promise from `onValueChange` — the value shows at once with a Spinner on the trigger and a rejection rolls it back (`labels.changeFailed`); never reset the value by hand. A «Новый клиент» row in the list is `Select.Action` (`onSelect`), never a fake `Select.Item` with a sentinel value or a button under the field.
- An option reads its parts by element type: put `Avatar.Root`, `Thumbnail.Root`, `Badge.Root` and `Select.Item*` straight in the item and call your helper as a function (`{clientAvatar(c)}`), not as `<ClientAvatar />`; anything else trailing goes in `Select.ItemMeta`.
- Create from a search: one `persistent` `CommandMenu.Item` at the end («Создать клиента «{query}»», while the query is not empty) — it stays when a namesake matches; `CommandMenu.Empty` holds only the text.
- A value that settles at the end of a gesture saves in its own event: Slider `onCommit` — not a request on every `onValueChange` step.

## Text: labels vs children

- Visible text goes in children or content props: `<Button.Root>Сохранить</Button.Root>`, `<Modal.Title>`.
- System strings (aria names, counters, default texts) go through `labels`: `<Modal.Root labels={{ close: "Закрыть окно" }}>` — not a `closeLabel` prop. Defaults are Russian; override only what differs.

## Icons

- Every glyph from the kit, in this order: a semantic `<Icon name="action.add" />` ([names](api-contract.md#icons)); else the full animated set `import { ArchiveIcon } from "prime-ui-kit/icons"` → `<ArchiveIcon />` (Lucide name + `Icon`); only a glyph neither has → `const IconTractor = createIcon(Tractor)` once, then `<IconTractor />` — not `import { Plus } from "lucide-react"` in JSX, another icon library or an inline `<svg>`.
- Kit icons animate by themselves: the gesture plays when their button, link, tab, menu item or row is hovered or pressed — not your own hover rotate or spin on an icon. `animated={false}` only for a glyph repeated in every row of a long list.
- Put icons into the part: `<Button.Icon>`, `<Input.Icon side="start">`, `<Sidebar.ItemIcon>`, `<Dropdown.ItemIcon>`, `<EmptyPage.Icon>` — not an `icon` prop (only data arrays such as `notify()` take `icon`).
- Icon-only button: `<Button.Root variant="ghost" tone="neutral" aria-label="Удалить">` with a `Tooltip` — not an unnamed icon; `ghost` only where its neighbours have no fill (a dialog header, a table cell), `variant="soft"` at their height beside fields and soft buttons ([icon button fill](composition.md#an-icon-button-takes-its-neighbours-fill)).
- `lucide-react` only through `createIcon`, for a glyph missing from both `<Icon name>` and `prime-ui-kit/icons` — not for `Plus`, `Search`, `Bell`, `Settings`…

## Buttons and actions

- One primary per area (page header, card, dialog): the default `solid` accent, last in the row. Every other button with text — cancel, close and dismiss too — `variant="soft" tone="neutral"`: a labelled button always has a fill; `ghost` is only for icon-only buttons; no `outline` buttons ([actions](composition.md#6-actions)).
- One secondary action is in sight — an icon `Button.Root` with a `Tooltip` — and a «⋯» `Dropdown` only gathers two or more ([a menu from two actions](composition.md#a-menu-from-two-actions)); a record's dialog header is the exception: up to five icon buttons with Tooltips before the ×, «⋯» only beyond ([actions of a record](composition.md#actions-of-a-record)).
- Destructive is `tone="danger"` — never `tone="error"`; which variant where and how it is confirmed: [api-contract.md](api-contract.md#destructive-actions) and [choosing.md](choosing.md).
- Going somewhere is a link: `<LinkButton href>` or `<Button.Root asChild><a href>…</a></Button.Root>` — not `onClick={() => location.assign(url)}`.
- Busy action: `<Button.Root loading>` — not a hand-made spinner or «Загрузка…» text.
- An action on a coloured host (a solid Banner, an accent strip): `<Button.Root variant="ghost" tone="inherit">` — it takes the host's text colour; never recolour a Button with a CSS override.

## Page title and header

- The app is navigation and the page: everything at the top belongs to the page's `<Page.Root>` — not an app-wide header, a global search or notifications above every page.
- A work screen (a list, a board, a chat, a record) titles itself in `<Page.TopBar>`: `<Page.Heading>` with `<Page.Title>` + `<Page.Description>` carrying a line of data («128 в работе · 6 ждут оплаты») — not a sentence about the page.
- The bar holds only its four groups: `<Page.Heading>`, `<Page.Tools aria-label>` (sections, the view, a shared period; `<SmartFilter.Toolbar />` only when it filters several views — in reading order), `<Page.Actions>`, `<Page.Chips>` (`<SmartFilter.Chips />`) — not a hand-made flex row of title, tabs, search and buttons ([the top bar](composition.md#the-top-bar)).
- A nested record: `<Breadcrumb.Root>` first in `<Page.Heading>`, then `<Page.Title>` with the record's name — the path ends in the title on one line; not a title row under the path, not a breadcrumb in the body. With a router each crumb is `<Breadcrumb.Item asChild>` around its `Link`.
- A line of data that loads after the page opens: `<Page.Description loading={!summary}>` from the first render (`Drawer.Description` / `Modal.Description` alike) — not a Description mounted when the data arrives, which moves the title, nor a `Skeleton` placed in it by hand.
- A page that edits a record: `<Page.Guard dirty={changed} busy={saving} />` inside `Page.Root` — the Sidebar, BottomNav and path links ask before the changes are lost; not your own `beforeunload` or a confirm wired to each link.
- Every button of the page goes into one `<Page.Actions>`, secondary first, the primary last, each with a `<Button.Icon>` beside its label — not buttons split between two places, not a button with only text.
- A filtered page: `<SmartFilter.Root>` wraps `<Page.Root>` — it draws nothing; not `SmartFilter.Root` inside the bar.
- No size knob on the title: the bar sizes the heading and gives way by width itself ([the five steps](responsive.md#the-pages-top-bar--pagetopbar)).
- Sign-in, sign-up, an invite and a password reset are modes of one `/login` screen, one `LoginForm` with the action's icon in `LoginForm.Logo` and the default `align` — not a page per mode, not a centred brand mark ([auth](layouts.md#auth-sign-in-code)).
- A dashboard, analytics or statistics page titles itself in `<Page.TopBar>` like a list — not a bar of tools over a large title in the flow. Only a document page (settings, a long form, help) puts `<Page.Header>` with its `<Page.Heading>` in the flow, with an optional `<Page.TopBar collapse>` above it whose heading holds the path. One `<Page.Title>` per page — never two titles, never no `<h1>`.

## Cards and surfaces

- A KPI tile is `<Kpi.Root>` — it is the card, never inside a `Card.Root` ([Kpi / Card](choosing.md#3-pairs-that-are-easy-to-confuse)).
- `Card.Root` only for a bounded block with its own title: a settings panel (`Card.Header` + `Card.Body`), side facts — not around a whole section, a form field or a page. The zones lay the card out, parted by air: no `variant`, no `flat`, no `divider` ([Card](../src/components/card/COMPONENT.md)).
- Never a `DataTable` inside a Card — the table is already a filled block; a card in a card only sparingly ([the rule](foundations.md#card-in-a-card)).
- A titled panel (a settings section, a group of a long form) is `<Card.Root>` with `<Card.Header>` (`<Card.Title as="h2">`, `<Card.Description>`) stacked in the flow — never a heading column beside its panel ([a titled block](composition.md#4-surfaces)).
- Section without a card: `<Page.Section label="…">` + the content (a link or button beside the heading in `Page.Actions`) — not a hand-made `<section>` + `Typography as="h2"` + own gap.
- The tiles of a screen (KPI cards, charts, panels): one `<Page.Grid>` with a `<Page.Cell span>` per tile — not a grid per row (the rows would stand 24 apart instead of 16). A chart beside a panel is an 8 and a 4 written next to each other — the grid pairs them at mid widths; not 6 + 6 to dodge a hole.
- A KPI tile whose figure loads: `<Kpi.Root loading>` with its parts mounted — not Skeletons placed in `Kpi.Value` by hand.
- A KPI card: the period once (`Kpi.Period` under the value, or once in the page's bar for a row that shares it), `Kpi.Meta` only new data, the unit in `Kpi.Unit`, one size per row — not «к сентябрю» in the note or the period in the title ([KPI cards on a screen](composition.md#kpi-cards-on-a-screen)).
- A record's facts in words or with a judgement (due, paid): `<DescriptionList.Item tone>` pairs — not Kpi cards. A tile that opens something: `Card.Link` in `Card.Title` (or `Kpi.Root asChild` around the link) — never an arrow of your own ([tiles and cards of a record](composition.md#tiles-and-cards-of-a-record)).
- A card's header: badges after the title in `Card.Badges`, only «Ещё» and a value picker beside a footer, never the accent button; the accent button is the last in `Card.Footer`; a record row opens as a whole, no pencil on it; a photo is `Card.Media` with a `Carousel` ([cards](ux.md#a-cards-header-body-and-footer)).
- Several tags or labels as one value (a client's tags): `<Badge.Group>` of `Badge.Root` — not a flex row with its own gap.
- Depth from fill, not lines: no borders around blocks; `<Divider />` only inside a block.
- Every scroll region is a `ScrollContainer` — never `overflow: auto` on a `div`: its hidden edges fade by themselves (`edges="shadow"` on a filled surface, `"none"` only for a page column), `scrollbar="hidden"` on strips, `snap` on strips of cards (it settles once the scroll ends; never `scroll-snap-type`), `lock` to hold a list still, `anchor="end"` for a log. Kit components already scroll through it; do not wrap them again.
- Tabs are a bar, not a container: `Tabs.Root` stands in the host's padding and the panel content goes straight into `Tabs.Panel` — never a Card or a padded `div` around the tabs or inside a panel. In a Modal / Drawer, `Tabs.Root` wraps `X.Header` + `X.Body` and `Tabs.List` goes last into the header — not a tab strip at the top of the body.

## Tables

- A section page (mainly one set of records: a table, a board, a calendar) puts its search, «Фильтр» and «Вид» in `Page.Tools` and the chips in `Page.Chips` — `<SmartFilter.Root>` around `Page.Root`, the table without a `toolbar`, selection actions still `renderSelectionActions`; a table block among other blocks (a drawer, a dashboard) keeps its tools in its own `toolbar` / `toolbarChips` ([where the filters go](composition.md#where-the-filters-go)).
- A table section filters by its categorical columns (role, status, type, owner): an `options` field each, a `date-range` field per date column — not a search alone.
- Actions on selected rows: `renderSelectionActions` returns `Dropdown.Item`s — the table adds «Действия · N» last in its tools row; not a bar that replaces the search, not a button per action ([controls of a table](composition.md#controls-of-a-table)).
- The column chooser is `<DataTable columnsMenu>` over the row actions, else `<DataTableColumnsMenu>` («Вид») beside the search — in `Page.Tools` on a section page, in the table's `toolbar` on a table block; `toolbar` takes the table's controls as they are, a search first — no wrapper ([controls of a table](composition.md#controls-of-a-table)) — never a toolbar for one button.
- Search over a table or a list page is always SmartFilter, even with no filter fields yet (`fields={[]}` is a plain search that grows into filters). A search `Input` only outside a filtered list: inside a picker, a settings section, a panel.
- Paging is built in: `paging="pages"` (default) with `pageSize`, `paging="infinite"` for feeds, `paging="none"` for short lists — not a separate `<Pagination>` under a DataTable.
- Long lists are virtualized inside the kit: pass the whole array to `DataTable` (with `scrollHeight` or `paging="infinite"`; over 100 rows — grouped, `onReorder` and `renderExpanded` bodies render every row, keep those short or paged), `TagSelect options`, `Chat.Messages items`, `Gantt rows`, `Kanban items` (every column) — never slice it by hand, never wrap a kit list in react-window / react-virtual or your own windowing. Big remote data is still paged or loaded on scroll by the server (`source="server"`, `onLoadMore`).
- Data the server sorts and pages (thousands of records): `source="server"` + `rowCount`, controlled `sort` / `page` as the request, `page` back to 1 on a new search or filter, old rows kept with `loading` while the next page loads — not a server page passed to the default client mode, and not `rows={[]}` between pages.
- A judgement (paid, needs attention, failed) gets `tone`; an identity (a lifecycle stage, a phase, a category, a tag, a person) gets a palette `color` — never several stages as one `tone="info"`, never a category in a tone ([tone or color](foundations.md#tone-or-color)).
- Every status's label and colour come from one map of the app (`const DEAL_STAGE = { … } satisfies Record<DealStage, { label: string; color: PaletteColor }>`) that the badge, the bar segment, the Timeline dot and the chart series all read — never a hue picked inline on a screen ([one status map](foundations.md#one-status-map)).
- Colour sits on marks (badge, dot, bar, ring, series), never on a row, a card or a border; a colour a person picks is stored as a palette name, never a hex ([marks, not surfaces](foundations.md#marks-not-surfaces)).
- A chart with axes or several series: `<ChartFrame.Root series rows state>` around the library (or your SVG) with `ChartFrame.Plot renderPlot` and `Legend`; `rows` is the data table screen readers get — not a hand-made Card with a grey box while loading and a legend of colored dots.
- A tooltip on your own SVG chart: `<ChartFrame.Tooltip point={{ x, y }} items>` with the pointer in plot coordinates — not a `foreignObject` or a div placed and clamped by hand; it flips only when out of room.
- Amounts, counts and dates are `numeric` columns; statuses are a `Badge.Root` from the status map.
- A column header that needs a word more («Маржа»): the column's `description` (an info glyph with a tooltip) — not the explanation squeezed into the header, not your own icon and Tooltip in `header`.
- A list row with controls of its own (a Switch, a ⋯ menu): `List.ItemActions` inside `List.Item`, a stage colour as `Badge.Dot color` in `List.ItemIcon` — not a control inside the row's button, not a row rebuilt as a `div`.
- Rows people order by hand: `onReorder(id, beforeId)` (apply it with `moveBefore`, return the save's Promise) — not a Dnd list rebuilt next to the table.
- A DataTable's grip stays at the end of the row (`reorderHandle` default); `start` or `row` only by the rule ([choosing](choosing.md#3-pairs-that-are-easy-to-confuse)) — never a grip column of your own.
- Columns people arrange: `columnOrder` + `onColumnOrderChange` next to `hiddenColumns` and the column chooser, both saved by the app — not up / down buttons, a settings dialog or a header drag of your own.
- A short list of records people order by hand (stages, priorities) is `<List.Root onReorder>` with `List.Item value` — not up / down buttons or a hand-made `Dnd.Sortable`.
- A switch always ends its row; reordering is a «Изменить порядок» / «Готово» mode where the switches leave and the grips take their place ([list rows](composition.md#list-rows)) — never a switch leading a row or beside a grip.
- The grip ends its row: a `Dnd.Handle` is the last child of its item, after the row's own controls, and a locked row's lock takes the same place (List, FieldList and Kanban place theirs there) — not before the row's text.
- Groups that fold: pass `defaultCollapsedGroups={[]}` (or the controlled `collapsedGroups` + `onCollapsedGroupsChange`) — not your own button in `renderGroupHeader` or filtering `rows`. One heatmap over several columns: the same `scale: { min, max }` on each.
- A trend in a table row is `<Sparkline layout="compact">` in the column's `cell` (a column `width`, series built once, not inline, the same `min` / `max` on every row when rows compare by size); the number itself goes in its own column. A missing day is `value: null`, never `0`.
- Properties of one record: `<DescriptionList.Root>` of `DescriptionList.Item` — not a hand-made grid of label / value text, not a one-row DataTable.
- Who is busy when, a plan with dates: `Gantt` with `onBarChange` / `onBarCreate` — not bars drawn by hand or a DataTable of start and end dates. Statuses moved by hand: `Kanban` — `plain` (default, a header plate) or `line` (a header over a line) for a board that is the page's main region, `variant="well"` only when columns must read as bounded queues (WIP limits, sparse columns); never a Card or a filled box around a column.
- A rich board card is built from the card's parts: `Kanban.ItemSection` zones, `Kanban.ItemTitle number`, `Kanban.ItemResource`, `Kanban.ItemFact`, a `Badge fullWidth` next step; the card fields a person hides are `KanbanFieldsMenu` beside the filter ([sales pipeline board](composition.md#sales-pipeline-board)).
- A stage's figures go in `renderColumnMeta` (an array is a line per entry: «12 сделок · 4,8 млн ₽», «Средний чек 400 000 ₽») — not in the column `title`.
- Open a board card with `Kanban.Root onItemOpen` (click, Enter, Space, never after a drag) or `getItemHref`; a Gantt row with `onRowClick` / `getRowHref` (the DataTable contract), a bar with `onItemOpen`; more facts in a bar tooltip with `renderBarTooltip` (it adds lines under the dates). A legend of hues is a row of `Badge.Root color` + `Badge.Dot` in the host's `toolbar`, the category also in text. Hour slots (bookings, appointments) are not Gantt — its unit is a calendar day.

## Chat

- A conversation is `Chat`: `<Chat.Root typing selected search>` with `Chat.Header` (avatar, `Chat.Title`, `Chat.Description`, `Chat.Actions` + `Chat.SearchButton`), `Chat.Search`, `Chat.Pinned`, `<Chat.Messages items getKey getAuthor getDate renderMessage>` and `<Chat.Footer><Composer.Root /></Chat.Footer>` — not a header, a ScrollContainer and a list of your own, not Cards or a Timeline styled as bubbles, not a Textarea with a send button. A list without the rest is `Chat.Root` with `Chat.Messages` alone; one message on its own is `Message.Root`.
- The list of conversations is `ChatList` — not a `List` or Cards with your own preview, unread counts and «печатает…». Back button and avatar in the chat header are plain children of `Chat.Header`: it lays them out side by side. A dialog with its own route is `<ChatList.Item asChild>` around the router `Link`.
- Times in the operator's zone, not the browser's: `timeZone="Europe/Moscow"` on `Chat.Messages`, `ChatList.Root` and a lone `Message.Root` — not dates shifted by hand.
- A sticker is `Message.Sticker` (your Lottie or video player inside it); a message shown outside a chat (a bot's welcome message in its settings) is `<Message.Root preview>` — not a screenshot or a bubble drawn again.
- A dialog loading is `<Chat.Messages loading>` (bubble skeletons that cross-fade into the list) — not a Spinner or grey boxes. A bot's buttons under a message are `Message.Actions` rows of `Button.Root variant="soft" tone="neutral"` (`asChild` for links, which get the kit's corner mark), never buttons inside `Message.Text` or an arrow glyph of your own; a reply keyboard is `Composer.Keyboard`.
- `renderMessage` returns a `Message.Root` (its `value` and `position` are set for you) or a `Chat.Service`; an inline function is fine: an item renders again only when it or its place changes, so a row shows what its item holds, and another message (a reply's original) comes from `entry.find(key)`. Dates, runs and the unread band (`unread={key}`) come from the list.
- A group chat is `<Chat.Messages group>`: put `Message.Author` (`color={hueOf(user.id)}`, `tag`, `Message.AuthorIcon` for a crown) and `Message.Avatar` on every message — the list shows the header on the first of a run and the avatar on the last; a direct chat shows neither.
- A client's chat answered by an operator, the owner and an AI agent: `<Chat.Messages authors="outgoing">` (`incoming`, `all` for the other sides) names the writer at the head of each run, no avatars — not `group`, not a name typed into the text. A chat in a drawer tab or a `Card.Body`: `<Chat.Root variant="inline">`.
- A chat about a record heads itself like a record's dialog: `<Chat.Title number="#4120">` with `<Chat.Badges>` on its line, the stage and the assignee `Select`s in `Chat.Actions`; an always-open search is `<Chat.Search persistent>` with at most one control of yours before the field ([messages](choosing.md#2-inside-a-category)).
- A voice message is `VoicePlayer` inside `Message.Root`; a round video is `VideoNote` inside `Message.Root`; photos, files, places and contacts are `Message` parts — not FileUpload rows or Cards. The same album outside a chat is `Gallery`. The two players share one API: learn one, use both.
- A transfer either way is one prop set on every message content (VoicePlayer, VideoNote, `Message.File`, `Message.Media` / `Gallery` items): `transfer` (`remote` · `queued` · `loading` · `failed` · `done`), `transferProgress`, `transferDirection` (`upload` / `download` — the words only), `onCancel` / `onRetry` / `onDownload` (a Promise keeps the disk pending, a rejection is announced; on `Message.Media` / `Gallery` they sit on the root and get the item's index). A `useUploadQueue` item maps as is: `transfer={item.status} transferProgress={item.progress}`. Never your own spinner, bar or ring over media.
- Send optimistically: `onSend` adds the message with `status="sending"` under a client id and returns; patch `status` to `sent` / `read` / `failed` as the server answers. Keep the row's `key` and `value` when the server id arrives — a re-keyed row enters a second time. Give `Message.Root` `onRetry` for `failed`.
- A reply or an edit: `<Composer.Context messageId={id}>` — `onSend` gets `replyTo` / `editOf` and the bar closes itself after the send; never read the replied message from a closure. ↑ in an empty field is `onEditLast`.
- «печатает…» on the other side: `Composer onActivityChange` (`typing` / `voice` / `video` / `null`, on a change only) → your socket; on the receiving side `<Chat.Root typing={activity === "typing"}>` (the header's status and the list's typing bubble together). Never send it from `onValueChange`.
- Appearance: messages that are new at the end enter by themselves — mine and theirs float up a little from below and fade in; the first render, history loaded above and rows scrolled into view never animate. Do not add your own enter animation or `scrollTop = scrollHeight`.
- `Chat.Messages` scrolls to my message, stays at the end for theirs while the reader is there, and otherwise shows the «N новых» button; `onNewMessage(value, { direction })` is for a sound or a counter, `onRead(values)` for read receipts (only what was really seen). The first unread is `unread={key}`; older history is `hasOlder` + `onLoadOlder`.
- Jump to a message: `Message.Reply target={id}`, a press on `Chat.Pinned`, or `Chat.Root jumpTo={id}` (the chat scrolls to it and the message blinks); search: `Chat.SearchButton` + `Chat.Search` mark, count and step through the matches in texts and transcripts, keeping the others stepped back. Never an outline or a wash of your own on the target or on selected messages. Never `scrollIntoView` or your own transforms on rows.
- A long history (thousands of messages): nothing to switch on — `Chat.Messages` renders only the rows around the view and keeps the reader's place. With children, every top-level child is one row (a `Message.Root`, or a fragment / your own row component keyed by the message `value`); give pictures their `width` / `height` so a row's size is final before load; jumps, search, selection and the keyboard still reach every message. Not a hand-rolled window, `content-visibility` on rows or a measured bubble.
- A message's layout is CSS: the bubble fits its content and the time sits at the end of the last line (or of the reactions row). Every size change of a message (reactions, a transcript, an edit, an upload) plays as one built-in stroke, width and height together; a reaction grows the message upward with the time still, the rows above gliding as one block. Never size, measure or animate a bubble yourself; an own content part declares itself with the kit's part contract instead of a wrapper.
- One sound at a time is built in: a voice message, a video message and a chat video pause each other; `playing` / `onPlayingChange` on `VoicePlayer` or `VideoNote` when the app needs to know. A round video never plays or loops before a press. A recorded voice message without levels gets them from `getWaveform(blob)` once, stored with the message.
- Transcripts: `transcript="…"` on `VoicePlayer` or `VideoNote` when the text is known, or `onTranscribe={() => api.transcribe(id)}` returning a Promise of the text; the button and its pending state, the bubble's one-stroke growth and the rollback on a rejection are built in. Store the resolved text with the message. Not a `Message.Text` under the voice message, not a disclosure of your own.

## Overlays

- Blocking decision or ≤ 4 fields → `Modal` (`<Modal.Content size="s">` for a confirm); long form, filters, details → `Drawer`; a short task that ends by itself (a date, an action, a note) → `Sheet`; small panel at a control → `Popover`; list of actions → `Dropdown`; a field value → `Select`; a name for an icon button → `Tooltip`; ⌘K → `CommandMenu`; a photo, a scan or a video full screen from its thumbnail → `MediaViewer` (an album in a grid is `Gallery`, which opens it for you; a standalone viewer keeps `open` and `index` in two states) — not a Modal with an `<img>`.
- Head a record's dialog with `Drawer.Title number`, with `Drawer.Badges` on its line, then one line of `Drawer.Description`; the status and the assignee are value `Select`s in `Drawer.Actions`, «Ещё» last ([a record in a drawer](composition.md#a-record-in-a-drawer)); what the list row already knows shows at once, a line not known yet takes `loading` on its part — not a header skeleton of your own. A confirm that asks for input (a reason) is a `Modal size="s"` with the field, `Modal.Confirm` and `Modal.Guard busy` — `ConfirmDialog` is a question only.
- A record opened beside the page is one drawer component per entity, opened from everywhere: permissions make fields `readOnly` and hide tabs and actions; one form over all tabs with one «Сохранить» in `Drawer.Footer` while dirty and `Drawer.Guard`; data loaded by the drawer, not by each tab; the history its own tab; `Drawer.Actions` act on the record, never lead elsewhere ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- A titled group in a dialog's body (contacts, deals, history): `<Drawer.Section label="Контакты">` (`Modal.Section`), its button in `Drawer.Actions` inside it — not a `Typography as="h3"` row with buttons of your own.
- Never a hand-made `div` backdrop, dialog, menu or tooltip.
- Every Modal and Drawer has its `Header` (title, ×); `Body` (content, scrolls) and `Footer` (actions) are there when it has content and actions. The footer never repeats the ×: no «Закрыть» there — read-only details have no footer, or only the record's main action; a create form: «Отмена» + «Создать»; a record: nothing until a change, then «Отменить изменения» (back to the saved values, the drawer stays) + «Сохранить» (`{dirty ? <>…</> : null}` — an empty footer is not drawn) ([the footer](composition.md#6-actions)) — not Save at the bottom of the body. A `Sheet` (from the bottom edge) is the opposite: no footer by default — a pick or a swipe ends it — and its header is optional: keep it when the content needs a title, drop it (× and hairline go too) when the content speaks for itself, with `aria-label` on `Sheet.Content`. Never `Drawer.Content side="bottom"`.
- Content inside a Drawer, a Sheet or a Card is the host's own: a calendar is `Datepicker.Panel` straight in the body, across its width — no card, no padded box around it.
- A destructive confirm is `<ConfirmDialog.Root title description confirmLabel onConfirm={remove}>` with a `ConfirmDialog.Trigger` — not a Modal assembled as a confirm with your own pending state; a reversible delete offers «Отменить» in the notification instead.
- Overlays close smoothly only if they stay mounted: render the `Root` always and drive visibility with `open` alone — never `{open && <Drawer.Root>}`, never a changing `key` on the Root. The kit keeps the last content on screen while the exit plays.
- Placement of a menu, popover, select or picker: leave the defaults — `side="bottom"`, `align="auto"`: it opens below the trigger, lines up with the trigger edge that has the room (a «⋯» at the end of a row grows toward the start) and flips to the top by itself. Never write `side` or `align` to restate that; set `align` only when the panel must line up with one edge of a block whatever room there is. A Popover under a wide anchor that must never be narrower than it: `<Popover.Content width="min-trigger">`.
- While a request runs: `<Modal.Guard busy={saving} />` inside the content (`Drawer.Guard`, `Sheet.Guard` alike) — Escape, a press outside, × and `Close` are held, × and `Close` disabled; add `dirty` to ask before unsaved changes are lost; both also hold the browser's tab close. Not `closeOnEscape={false}` or `showClose={false}` by hand, not your own `beforeunload`.

## Motion — it comes with the components

- Changed button text is new children: `<Button.Root>{saved ? "Сохранено" : "Сохранить"}</Button.Root>` flows in by letters — not two buttons swapped with a condition.
- Saving a form, one rule: the save button stays on screen after saving (a settings card) → it says «Сохранено», no notification; the button goes away (a Drawer or Modal closes, the page navigates, a record drawer's save that shows only while dirty) → a notification. A failure is always a notification (or the field's `error`), never only the button.
- A long job from a button: `<Button.Root progress={0.42}>Экспорт 42%</Button.Root>` — not a ProgressBar next to it.
- A round icon action (play, download, cancel or retry a transfer): `<Button.Root shape="circle" aria-label="Отменить отправку" progress={share}>` — its ring is the progress, it stays pressable; over a picture or video `variant="shade"`. Not a `border-radius: 50%` button of your own, not a ProgressCircle with `onClick`.
- One ring in the kit: a share → `ProgressCircle value` (`null` while unknown, `spin` while it grows); an anonymous busy mark → `Spinner`; a ring you press → circle Button `progress`. Never your own `@keyframes` ring or conic gradient.
- A single destructive action that is easy to redo by hand (clear a draft, revoke a token), no list and no dialog: `<Button.Root tone="danger" variant="soft" holdToConfirm onConfirm={remove}>` — the action in `onConfirm`, not `onClick`. A row in a list: delete at once and offer «Отменить» in the notification.
- Counts: a number child of `Badge` rolls its digits — not a string you re-render with your own fade.
- New password: `<Input.Root strength minStrength={3} hint="…requirement…">` (the policy stops the submit; the server checks it too), a repeat that matches: `valid` — a check, not a «Пароли совпадают» hint ([field outcomes](api-contract.md#field-outcomes-a-mark-for-success-words-for-a-problem)); steps of a whole: `<ProgressBar label="Шаги настройки" variant="steps" value={2} max={5} />`; a score or a share that heads a card: `<ProgressBar variant="ticks" … />`; a trend tile: `useSparkline({ data, formatValue })` for the card's value, change and date, `<Sparkline {...reading.plot} label />` for the line.
- A rare milestone only: `celebrate({ origin: event.currentTarget })` — never for a saved form.
- No motion on keyboard-driven or high-frequency actions; tokens only, no bounce. Full guide: [motion.md](motion.md).

## Empty, loading, error — states flow, they never flip

State change is continuous in the whole kit: every region that changes what it shows cross-fades, and loading holds the shape of what is coming.

- Every region with loading / data / empty / error (or one record at a time): its content in `<Crossfade state={status} aria-busy={status === "loading"}>` — not `{loading ? <A /> : <B />}` that flips and makes the page jump. DataTable does this itself.
- Region loading: the state `"loading"`, rendered from the first paint (never `null`), a `<Skeleton>` in the geometry of the data — same rows, same gaps (`<Skeleton />` for a text line, `shape="circle"` for an avatar, `shape="control"` for a field, `shape="block"` for an image or chart) — not a spinner in an empty card, not a grey box or shimmer you draw.
- `Spinner` only where there is no shape to hold (a running job, a status line); a busy button is `<Button.Root loading>`.
- Refreshing data already on screen: keep it, set `aria-busy` — not back to a skeleton on every refetch.
- Table states in place: `loading` (+ `loadingRows`), `empty`, `loadError` on `DataTable` — the head and toolbar stay.
- First run of a page or region: `EmptyPage.Root` + `EmptyPage.Icon` + `EmptyPage.Title` + `EmptyPage.Description` + `EmptyPage.Actions` with one action — not «Здесь пока ничего нет».
- Page-level persistent problem: `<Banner.Root tone="danger">` first in `Page.Body`; the result of an action: `useNotifications().notify({ tone, title })` — a toast never closes the Drawer or Modal it was raised from.
- A refused sign-in: `invalid` on the e-mail and `error="Неверная почта или пароль"` on the password — not a Banner in a `LoginForm`, not red rings and a shake with no words.

## Sidebar

- Brand header: `Sidebar.Header` > `Sidebar.Brand href description` (with `Sidebar.BrandLogo`) + `<Sidebar.Toggle variant="header" />` — not a Toggle in the footer when the rail has a brand.
- Off-canvas: `offCanvas="auto"` (default, below 768px), `"always"` for navigation behind a menu at any width, `"never"` for a rail that always stays; the page's `Page.TopBar` draws the menu button that opens it — no menu state of your own; another trigger reads `useAppShellNav()`.
- Every item is a link (`href` or `asChild` with the router `NavLink`; `current` marks the page), with a `Sidebar.ItemIcon` on the [top-level items and sub-list parents](layouts.md#sidebar-icons).
- The signed-in user: `Sidebar.Account` inside `Dropdown.Trigger` at the end of `Sidebar.Footer`.
- Structure: everyday places on top without a label, categories as `Sidebar.Group label collapsible` (one short word, 3–7 items), views of one section as `Sidebar.Sub` (one level, the parent only discloses) — not every group folded, not a sub-list inside a sub-list.
- Counts: plain `Sidebar.ItemCount` for information; `color` only when it needs action — it becomes a dot on the rail and on folded parents.
- Remember the rail and folded groups with `persistKey` on `Sidebar.Root` — not your own `localStorage` code.

## Narrow screens and touch

Full rules: [responsive.md](responsive.md).

- Rearrange, never hide: every desktop function is on the phone, in another place or a menu — not `display: none` below a breakpoint.
- Breakpoints only in [their scope](responsive.md#breakpoints); inside a page — [intrinsic grids](responsive.md#intrinsic-grids) and container queries.
- A wide table scrolls inside itself; offer the column chooser (`columnsMenu` or `DataTableColumnsMenu`) — never drop columns by breakpoint, never hand-build the chooser.
- A row that opens a record page is `getRowHref` (a real link: ⌘-click, new tab), a row that opens a drawer is `onRowClick` — never `navigate()` in `onRowClick`, never your own `event.target` checks for buttons in the row.
- A list + detail screen is `Page.Split` (`Page.List`, `Page.Detail`) in a `Page.Root fill` page, its records a `List` (`current` on the open one) — never ghost Buttons with a soft current; a full-height table is `scrollHeight="fill"` — never a height computed from `100vh`.
- App sections on phones: `BottomNav` in `AppShell.Footer` — not in Main, not `position: fixed`, no own media query: the shell hides the footer while the Sidebar rail is on screen; a short task from the bottom edge: `Sheet` — Select, Dropdown, Popover and Modal become sheets below 640 by themselves.
- Your hover styles inside `@media (hover: hover)`; nothing hover-only. Do not wrap kit fields to raise their text for iOS — they keep 16px on touch already.
- A long form saves through the panel action with a count («Сохранить 3 изменения») — not a sticky bar at the bottom of a phone.
- Sticky comes from the kit (`Page.TopBar`, the DataTable head, `stickyFirstColumn`, the Gantt header) — not your own `position: sticky` bar.

## Spacing and values

- Gaps are `gap` on the parent with `--prime-space-N` (N × 4px): 8 in a row of buttons, 16 tile → tile, 20 field → field, 32 group → group; `Page` already spaces blocks 24 and sections 40 — not margins, not outer padding.
- Tokens only: `var(--prime-space-4)`, `var(--prime-color-text-secondary)`, `var(--prime-radius-m)` — never raw `px` / `rem` / hex, never `--prime-ref-*`, never inline `style`.
- Text through `Typography` roles (`title-m`, `title-s`, `body-m`, `caption`) and its `tone` — not `font-size` or `color` in CSS ([text colour](foundations.md#text-colour)).

## UX — what goes on the screen

- Five lines of brief before the JSX: who and what for, the data and its shape, the main action, the states, the narrow screen ([ux.md](ux.md)) — not a layout picked by habit.
- The shape of the data picks the layout: one record → a form or a `DescriptionList`; records a person edits → `FieldList`; records a person reads → `DataTable` ([the table](ux.md#2-the-shape-of-the-data-decides-the-layout)).
- Every label carries something new: once per column, never numbered, never repeating its heading; no hint that explains what the layout shows (a lock already says «закреплено»).
- A button's icon is its verb, so its text is the object («+ Оплата», «⬇ Отчёт CSV»; a bare verb goes icon-only with `aria-label` + `Tooltip`), while its name and tooltip say the whole action (`aria-label="Новая оплата"`); a button without an icon says the verb and the object («Выставить счёт»); errors say how to fix it («Формат: +7 912 404-18-20»), empty states offer the next step — not «+ Добавить оплату», «ОК», «Ошибка», «Нет данных».
- Money, numbers and dates through `Intl` (`ru-RU`); «ёлочки», `…`, a non-breaking space before a unit — not `toFixed` and string glue.
- Friction matches the cost of a mistake ([the ladder](ux.md#5-friction-matches-the-cost-of-a-mistake)) — not «Вы уверены?» on every delete.
- A disabled control says why when the reason is not on screen; an action without permission is hidden.
- Tabs, filters, search, page and the open record live in the URL.
- Changing a screen that exists: audit it against [ux.md](ux.md), [checklist.md](checklist.md) and [anti-slop.md](anti-slop.md) first, fix the shape, then make the change.
- Before handing over, look at it in a browser ([the visual check](ux.md#9-look-at-it-before-handing-it-over)).

## Anti-slop

The whole list, bad → good: [anti-slop.md](anti-slop.md). Before handing over: [checklist.md](checklist.md).

## Snippets to copy

App root, once — the styles and the theme:

```tsx
import "prime-ui-kit/bundle.css";
import { applyTheme } from "prime-ui-kit";

applyTheme("light");
```

The frame itself (providers, `AppShell` with the `Sidebar`) is built once too: copy it from
[layouts.md](layouts.md#app-frame-once-per-app).

A document page (a form) — its large title stands in the flow:

```tsx
import { Button, Icon, Input, Page } from "prime-ui-kit";
import styles from "./ProfilePage.module.css"; // .form { display: grid; gap: var(--prime-space-5); }

export function ProfilePage() {
  return (
    <Page.Root maxWidth="readable">
      <Page.Header>
        <Page.Heading>
          <Page.Title>Профиль</Page.Title>
        </Page.Heading>
      </Page.Header>
      <Page.Body>
        <form className={styles.form} noValidate onSubmit={(event) => event.preventDefault()}>
          <Input.Root label="Рабочая почта" hint="На неё придут счета" required>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="field.email" />
              </Input.Icon>
              <Input.Field type="email" placeholder="name@company.ru" />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root type="submit">Сохранить</Button.Root>
        </form>
      </Page.Body>
    </Page.Root>
  );
}
```

A region with all its states — loading, data, empty, error — that flow into each other. Copy this
shape for every block that fetches data (a table uses DataTable `loading` / `empty` / `loadError` instead):

```tsx
import { Card, Crossfade, EmptyPage, Icon, Skeleton, Typography } from "prime-ui-kit";
import styles from "./InvoicesCard.module.css";
// .rows { display: grid; gap: var(--prime-space-3); margin: 0; padding: 0; list-style: none; }
// .row { display: flex; align-items: center; justify-content: space-between; gap: var(--prime-space-4); }
// .client { width: 55%; }  .amount { width: 20%; }

type Invoice = { id: string; client: string; amount: string };

type InvoicesCardProps = {
  status: "loading" | "ready" | "error";
  invoices: Invoice[];
  /** Loads the invoices again; the retry button stays busy until the Promise settles. */
  onRetry: () => Promise<void>;
};

const PLACEHOLDER_ROWS = ["a", "b", "c"];

export function InvoicesCard({ status, invoices, onRetry }: InvoicesCardProps) {
  // One key per state: "loading" hands over to the data in place; settled states glide the height.
  const state = status === "ready" && invoices.length === 0 ? "empty" : status;

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title as="h2">Неоплаченные счета</Card.Title>
      </Card.Header>
      <Card.Body>
        <Crossfade state={state} aria-busy={state === "loading"}>
          {state === "loading" ? (
            // Loading: Skeleton rows in the geometry of the data rows — not a Spinner.
            <ul className={styles.rows}>
              {PLACEHOLDER_ROWS.map((key) => (
                <li key={key} className={styles.row}>
                  <Skeleton className={styles.client} />
                  <Skeleton className={styles.amount} />
                </li>
              ))}
            </ul>
          ) : null}
          {state === "ready" ? (
            <ul className={styles.rows}>
              {invoices.map((invoice) => (
                <li key={invoice.id} className={styles.row}>
                  <Typography as="span" variant="body-m">
                    {invoice.client}
                  </Typography>
                  <Typography as="span" variant="body-m">
                    {invoice.amount}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : null}
          {state === "empty" ? (
            <EmptyPage.Root size="s" aria-labelledby="invoices-empty">
              <EmptyPage.Icon>
                <Icon name="status.success" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="h3" id="invoices-empty">
                Все счета оплачены
              </EmptyPage.Title>
              <EmptyPage.Description>Новые счета появятся здесь после выставления.</EmptyPage.Description>
            </EmptyPage.Root>
          ) : null}
          {state === "error" ? (
            // tone="danger": the danger tile, and the region announces itself (role="alert").
            <EmptyPage.Root size="s" tone="danger" aria-labelledby="invoices-error">
              <EmptyPage.Icon>
                <Icon name="status.danger" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="h3" id="invoices-error">
                Счета не загрузились
              </EmptyPage.Title>
              <EmptyPage.Description>Сервер не ответил. Данные не потеряны.</EmptyPage.Description>
              <EmptyPage.Actions>
                <EmptyPage.RetryButton onRetry={onRetry} />
              </EmptyPage.Actions>
            </EmptyPage.Root>
          ) : null}
        </Crossfade>
      </Card.Body>
    </Card.Root>
  );
}
```

A refetch of data already on screen keeps `status="ready"` and the rows (set `aria-busy` on the
card) — it does not go back to the skeleton.
