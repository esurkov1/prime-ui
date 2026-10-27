# Choosing a component

First pick the category by the task, then the component inside it, then check the pairs that are easy to
confuse. Links: [components.md](components.md). Whole screens: [composition.md](composition.md).

## 1. Category by task

| The user needs to… | Category |
|---|---|
| trigger an action (save, delete, go on) | Actions — Button, ButtonGroup, LinkButton |
| type a value (text, number, code, file, photos), group the fields of a form, edit a list of records of one shape | Inputs — Input, Textarea, DigitInput, FileUpload, Label, Hint, Fieldset, FieldList |
| pick from options, toggle, set a range, filter, a date or a color | Selection — Checkbox, Radio, Switch, SegmentedControl, Slider, Select, NativeSelect, TagSelect, SmartFilter, Datepicker, ColorField, ColorPicker, ColorSwatches |
| see data: status labels, people, objects and their photos, numbers and their trend, properties of a record, rows, a board, a schedule, events, code, disclosed sections | Data display — Badge, Avatar, Thumbnail, Carousel, Kbd, StatusDot, Card, DescriptionList, DataTable, Kanban, Gantt, Timeline, CodeBlock, RichText, Accordion, Sparkline, ChartFrame |
| hold a conversation: pick a dialog, read and send chat messages of every kind | Messages — Chat, ChatList, Message, Gallery, VoicePlayer, VideoNote, Composer |
| learn what happened, how far along it is, or watch a region load and change state; say it to a screen reader | Status and loading — Banner, Notification, ProgressBar, ProgressCircle, Spinner, Skeleton, Crossfade, EmptyPage, VisuallyHidden |
| move between places: app sections, panels of a screen, the records of a list, the path, pages, steps | Navigation — Tabs, Breadcrumb, Pagination, List, Stepper, Sidebar, BottomNav |
| see something on top of the page, or a photo or video full screen | Overlays — Tooltip, Popover, Dropdown, Modal, ConfirmDialog, Drawer, Sheet, CommandMenu, MediaViewer |
| get the app frame and the structure of a page, or a whole ready-made screen block (sign-in, sign-up, password reset, code) | Page — AppShell, Page, Divider, ScrollContainer, LoginForm |
| drag things by hand | Interaction — Dnd (a status board: Kanban in Data display) |
| style text | Foundations — Typography |

## 2. Inside a category

**Actions.** One command → `Button.Root`. Several joined commands or toggles in one bar (editor
toolbar, view switch with `pressed`) → `ButtonGroup`. Navigation to a URL that should look like text →
`LinkButton` (it is an `<a>`); a URL that should look like a button → `Button.Root asChild` with `<a>`.

**Text input.** One line → Input. Several lines → Textarea. The message input of a chat (Enter sends,
attachments, replies, voice) → Composer, never a Textarea with a send button. Fixed-length code (OTP, PIN) → DigitInput.
Files → FileUpload; an image gallery — photos of a listing or a product in order, the first the cover — is FileUpload too: `trigger="tile"` `layout="grid"` `cover` (no separate gallery component). A sign-in, sign-up, password-reset or code screen → LoginForm. Number with a unit →
Input with `Input.InlineAffix`. Search and filters above a list or table → SmartFilter, a search alone there too
(`fields={[]}`); a lone search
field outside a list (a picker, a settings section, a panel) → Input with `Input.Icon` + `type="search"`
and `aria-label`. Several fields of a form under one heading → Fieldset (`label`, `disabled` while the
form saves). Several records of the same fields that a person adds, edits and removes (invoice lines,
contacts, specs, prices by period) → FieldList: one row per record, the headings once; their sums
under them → its `renderTotals`.

**Selection.**

| Situation | Component |
|---|---|
| a capability or a setting that is on or off, in a form or applied at once | Switch ([a flag, a level, a set](#a-flag-a-level-a-set)) |
| items picked out of a set, a consent, an option of the action being sent | Checkbox |
| exactly one of 2–5 visible options, a value of the one form whose other fields stay the same | Radio (`Radio.Group` with `label`); a choice that leads to a different form is a menu, not a field ([a kind that leads to its own form](#a-kind-that-leads-to-its-own-form)) |
| exactly one of 2–5 modes that change the view right now — never a stored setting | SegmentedControl |
| one of many (> 5) or a long list; icons, descriptions, search, groups | Select (`Select.Content searchable`) |
| one record out of thousands for a form field (a client, a contract), searched on the server | Select with `search` / `onSearchChange`, `filter={false}`, `loading`, `hasMore` + `onLoadMore` — never a read-only field that opens a CommandMenu |
| one value from a plain text list on a mobile-first form, posted with the form (`name`) | NativeSelect — the OS picker opens on phones |
| free text the team often repeats (a place, a city), any other text allowed | Input with `suggestions` — never a `<datalist>`, never a Select |
| a pick that belongs to a text (an icon before a name) | Select with only `Select.TriggerIcon` inside `Input.Wrapper`, named by `aria-label` |
| an amount and its currency as one field | Select after `Input.Field` inside `Input.Wrapper`: the trigger shows the symbol (`renderValue`), each row the symbol in `Select.ItemIcon` and the name ([amount-currency.tsx](../src/components/input/examples/amount-currency.tsx)) |
| several of many, shown as tags, with search / creation | TagSelect (`Select.Root multiple` when tags are not needed) |
| narrowing a list or table by several fields, with search and show / hide | SmartFilter |
| an approximate number in a range | Slider (exact number → Input) |
| a date or a period | Datepicker; among select-like fields (a bill line) without `Datepicker.TriggerIcon`, its range written by `labels.rangeValue` («{from} → {to}») |
| a time of day without a date | Input with `Input.Field type="time"` (a date with a time → Datepicker `withTime`) |
| a color from a fixed palette in a form or dialog | ColorSwatches (inline grid, default choice) |
| a compact color next to a field or in a list row | ColorPresets (trigger + popover palette; `allowCustom` when any hex is valid too) |
| any color as a field of a form (swatch + hex, picker in a popover) | ColorField |
| any color in a panel of its own (hex, eyedropper, channels) | ColorPicker |

**Data.** Status, count, removable value or applied filter → Badge (`tone` for a judgement, `color` for a
stage or a category — [tone or color](foundations.md#tone-or-color), `onRemove` to remove, `pressed` / `onPressedChange` to toggle); several badges as one value
(a client's tags) → `Badge.Group`, on one line with «+N» in a table cell. Person or organization → Avatar. Object (product, vehicle, file, cover) → Thumbnail with a
`ratio` — never a round Avatar for things. A state inside a line of text («● Работает · каждые 15 минут») → StatusDot, a chip → Badge. Keyboard shortcut → Kbd. A titled block of related
content → Card (its zones lay it out; a tile that opens its details → `Card.Link` in `Card.Title`,
a tile a person chooses → `Card.Root asChild selected` with `Card.Indicator`). One figure and what it means (a KPI) → Kpi, which is the card itself
([Kpi / Card](#3-pairs-that-are-easy-to-confuse)). Read-only properties of one record («label — value») → DescriptionList, never a
hand-made grid of text pairs. Rows with columns, sorting, selection → DataTable (a header that
needs explaining → the column's `description`). A KPI tile waiting for its figure →
`Kpi.Root loading`, never Skeletons inside its parts.
Items that flow through statuses and are moved by hand → Kanban (a single list to reorder, or items
dropped onto folders or assignees → Dnd directly). Its look: `plain` (default; `line` for a quieter header over a line) when the board is
the page's main region or sits in a Card / Drawer — headers and cards stand on the host, one level of
nesting; `variant="well"` when columns must read as bounded queues (WIP limits, many sparse or empty
columns, a dense board of narrow columns). Never your own box around a column.
Records with a start and an end compared across time — who is busy when, a project plan with
phases and milestones → Gantt (never a DataTable of dates or hand-drawn bars); moved and resized by
hand through `onBarChange`.
Chronological events → Timeline (two facts under an event → two `Timeline.ItemMeta`, they stack); a conversation between people (support, a team chat) → Message —
never a Timeline or a list of Cards styled as bubbles. Code → CodeBlock. A number with its trend over days or weeks (revenue, orders, sign-ups) → Sparkline, a line you can scrub, with `useSparkline` for the value, change and date a Kpi lays out (`Kpi.Value`, `Kpi.Delta`, `Kpi.Period`, the plot in `Kpi.Media`); its change against the previous period → `compareTo` (`change` for a point-to-point change while scrubbing, off by default); a metric whose growth is bad (response time, costs, refusals) → `better="lower"`; a share or a conversion in percent → `changeUnit="points"` («+0,5 п. п.», never a percent of a percent); a period figure that is neither the sum nor the mean of the points (a median, unique clients) → `value`; values with a sign by period → Sparkline `variant="bars"`; against a plan → `reference`; missing days → `value: null` in `data`; raw days over any range → `{ date, value }` in `data` with `grain` (a card's step switcher from `grains` / `setGrain`); against last year or a plan that changes by period → Sparkline `series` (each line its `color` and `variant`: `dotted` for the past, `dashed` for a plan); a chart with axes or series of equal weight a person turns on and off → ChartFrame around a chart library or your own SVG (the panel, legend, tooltip, states and the screen-reader table come from the kit, the colors from `series` / `chartColors` — never status tones); values to read, sort or compare row by row → DataTable, not a chart.

**Messages.** A whole conversation → `Chat`: `Chat.Root` with `Chat.Header` (avatar, `Chat.Title`,
`Chat.Description`, `Chat.Actions` with `Chat.SearchButton`), `Chat.Search`, `Chat.Pinned`,
`Chat.Messages` (from `items` with `renderMessage`, or `Message.Root` children) and `Chat.Footer`
with the Composer — never a hand-built header, ScrollContainer and list. A list of messages without
the rest (comments as a chat, a read-only history) → `Chat.Root` with `Chat.Messages` alone; one
message on its own → `Message.Root`. The list of conversations beside the chat (the dialogs pane of a
messenger or an inbox) → `ChatList` (`items`, `renderItem` with `ChatList.Item`, `value`): unread
counts, «печатает…», drafts, ticks, a row menu and search come with it — never `List` with a hand-made
count and preview; `List` stays for records that are not conversations (tickets, letters, invoices). A group chat → `Chat.Messages group`: `Message.Author`
(`tag`, `Message.AuthorIcon`) and `Message.Avatar` on every message, the list shows them on the
first and the last of a run. A one-to-one chat with several writers and no avatars → `Chat.Messages
authors`: `outgoing` when your side has several (an operator, the account owner, an AI agent),
`incoming` when the client's has, `all` for both — the author heads each run of that side. A chat
inside a drawer tab or a `Card.Body` → `Chat.Root variant="inline"`. A record's state under the preview in a dialog
row (a deal stage, «ждёт человека») → `ChatList.ItemBadges` with a `Badge.Root` per fact. A voice message → `VoicePlayer` inside `Message.Root`; a call recording
outside a chat → `VoicePlayer` alone. A round video message → `VideoNote` inside `Message.Root`
(alone there it is the message: no bubble); a face-to-camera report outside a chat → `VideoNote`
alone. The two players take the same props (`src`, `duration`, `unplayed`, `disabled`, `playing`,
the transcript and the `transfer` set); only VoicePlayer has `waveform` and a rate, only VideoNote a
`poster`. Photos and videos in a message → `Message.Media`; the same album outside a chat (a post, a
comment, a report) → `Gallery`; one picture of an object → `Thumbnail`. A video with controls →
`Message.Media` or `Thumbnail.Video`, not VideoNote. «Печатает…» → `Chat.Root typing` (or
`Message.Typing`), never a text row; a jump to a message → `Message.Reply target`, `Chat.Pinned` or
`Chat.Root jumpTo`, never `scrollIntoView`; search inside a chat → `Chat.Search`, always open
without a search button → `Chat.Search persistent` (one control of yours, a channel `Select`, before
the field; the «2/5» count sits inside the field and a query counts from `minSearchLength`, 2 by
default). A chat about a record (a client, a deal) heads itself in two lines: the avatar, then
`Chat.Title number` with `Chat.Badges` (the statuses) on its line over a `Chat.Description` (a
`StatusDot` first, then the owner); the stage and the assignee are `Select`s in `Chat.Actions` at
the end. An event of the record in
the feed (an agent took the client, a stage moved) → `Chat.Service` with `Chat.ServiceIcon` and
`Chat.ServiceChange`, never a message from a fake author. A bot's inline keys under a message →
`Message.Actions` (a link key gets the kit's corner mark — ↗ out of the product, a window into it —
never an arrow of your own); its
reply keyboard → `Composer.Keyboard`. Files, photos,
places and contacts sent in a chat → the `Message` parts, not FileUpload rows or Cards; a sticker →
`Message.Sticker` (a Lottie or video sticker is your player inside it). A message shown outside a
chat (a bot's welcome message in its settings) → `Message.Root preview`; its formatted text alone →
`RichText`, never `dangerouslySetInnerHTML`. An assistant's Markdown goes to `Message.Text` as
written — `# ` headings, `- ` / `1. ` lists and relative links `/path` render as they are; route those
links with `onLinkClick` (`event.preventDefault()`), never rewrite headings to bold, bullets to «•»
or paths to absolute URLs. A long list behind one button (chats, projects) →
`Dropdown.Content width="m" maxRows={12}` with `Dropdown.Search` first and `Dropdown.ItemMeta` for a
row's time; an action above the list («Новый чат») is `persistent`. Times and date separators in a profile's zone →
`timeZone` on `Chat.Messages`, `ChatList.Root` and a lone `Message.Root`.

**Status and loading.** See the pair below. Progress of a single task → ProgressBar `value`; parts of a whole →
ProgressBar `segments` (categories wear `color`, meanings wear `tone`; `legend` for color · name ·
value · share); a ranking «label · value · share — bar» (top cities, a funnel) → ProgressBar
`layout="rows"` with `scale` (`own` when each row has its own whole: a load per model, a quota per seat); compact goal / KPI ring or a ring breakdown → ProgressCircle (`value` or
`segments`). Either draws its scale as `variant` `steps` (a level out of a few) or `ticks` (a
score or a breakdown that heads a card) — never a row of hand-drawn cells. Loading with unknown progress → `loading` on the component that has it (Button, Select,
DataTable, ProgressBar, ProgressCircle, Sparkline, ChartFrame `state`); a region whose content has a shape (list, card,
form) → Skeleton of that shape; nothing to hold (a running job, a status line) → Spinner. Nothing to
show → EmptyPage; a region that failed to load → EmptyPage `tone="danger"` with
`EmptyPage.RetryButton` (async `onRetry`).

**State changes (a foundation of the kit).** A region never flips between states: any region switching between
loading, data, empty and error, or showing one record at a time → its content in
`Crossfade state={status}`, with a Skeleton as the loading state (DataTable's body does both by itself).

**Overlays.** See the pairs below. Global search over commands and pages (⌘K) → CommandMenu. Menus,
selects, pickers and Modal turn into bottom sheets below 640px by themselves — never build your own.
A photo, a scan or a video opened full screen from its thumbnail (a Gallery tile, a Thumbnail button)
→ MediaViewer, never a Modal with an `<img>`. A titled block inside a Drawer or a Modal (a client's
contacts, its deals) → `Drawer.Section` / `Modal.Section`.

**Phone navigation.** App navigation is Sidebar on a wide screen and `BottomNav` in `AppShell.Footer`
on a phone for 2–6 main sections (the shell hides it by itself while the Sidebar rail is on screen;
only inside `AppShell.Footer`, never your own media query) — not Tabs, not a
Drawer menu.

**App frame.** Sidebar collapse control: `Sidebar.Toggle variant="header"` next to `Sidebar.Brand` in
`Sidebar.Header` — at the header's end while expanded, a small round button on the rail's edge while
compact (the default for a branded rail); `Sidebar.Toggle` (`variant="item"`) in `Sidebar.Footer` when
the rail has no brand header. On phones the off-canvas Sidebar opens from the menu button the
page's `Page.TopBar` draws by itself; a trigger of your own reads `useAppShellNav()`. There is no
app-wide header: the bar at the top of the panel is the page's `Page.TopBar` — on a work screen the
title group (`Page.Heading`), the page's tools (`Page.Tools`), its buttons (`Page.Actions`) and the
active filters (`Page.Chips`) — [the top bar](composition.md#the-top-bar), on a dashboard as on a
list. Only a document page (settings, a long form, help) has its large title in the flow (`Page.Header`
outside the bar), with an optional `Page.TopBar collapse` that repeats it once it scrolls away. A record opened from a table: its own page → DataTable `getRowHref`; in place →
`onRowClick` + Drawer; a list worked through record by record → `Page.Split` with a `List` of
the records (tickets, letters, invoices; `current` on the open one; a row's own Switch or menu in
`List.ItemActions`) or a `ChatList` of the conversations. A record edited on a page of its own →
`Page.Guard` holds leaving it with unsaved changes. Sections of a long rail → `Sidebar.Group collapsible`; views of one set of objects
opened straight from the rail → `Sidebar.Sub`; the facets of one section («Каналы» / «Статистика»)
→ route links in its `Page.Tools` ([a section with sub-pages](composition.md#a-section-with-sub-pages)); the signed-in user → `Sidebar.Account` in a `Dropdown.Trigger` at the bottom of
`Sidebar.Footer`.

### A flag, a level, a set

Pick the control by what the value is, never by when it saves or by what fits in the row.

| The value | Control |
|---|---|
| a capability or a setting that is on or off (a permission, «Звук», «Вход по ссылке») | `Switch` with its label: inside a form it saves with the form, outside one it applies at once and its section has no save |
| several on/off settings applied at once, each with its icon or a line of explanation | rows of a `List` in a `Card.Body`, the Switch ending each row (the row toggles it) — never a `Card` per setting |
| items picked out of a set (rows, recipients, «Выбрать все»), a consent, a one-off option of the action being sent («Отправить копию себе») | `Checkbox` |
| one level for each of several entities (access per section, a frequency per channel) | one row per entity, its level and scope as `Select`s in columns: a `FieldList` from five entities or whenever most entities have no level — an absent row is «no access», «+ Раздел» adds one; up to four entities that every record has may stand as one labelled `Select` each |
| a stored preference with options (the theme, the language, the start page) | a `Select` field beside the related fields (`Radio.Group` for 2–3 options that each need a line of description) |
| a mode of what this screen shows now (a period, board / list, a section) | `SegmentedControl` — it switches the view and is never a stored value |
| several values of one record in a table cell (roles, tags, access) | `Badge.Group overflow="count"`: one line, the rest behind a «+N» that lists them — never a string joined by «·» with a «+5» typed by hand |

A stack of captioned `SegmentedControl`s, one per entity, makes a person read every caption to find
the few entities that matter, and fails at 320px; a list of rows names each entity once, in its
column, and shows only the ones that have a level.

```tsx partial
// bad — thirteen sections, each a caption, a description and a level switch
<SegmentedControl.Root label="Сделки" hint="Карточки сделок и воронка" defaultValue="none">
  <SegmentedControl.Item value="none">Нет</SegmentedControl.Item>
  <SegmentedControl.Item value="view">Просмотр</SegmentedControl.Item>
  <SegmentedControl.Item value="edit">Изменение</SegmentedControl.Item>
  <SegmentedControl.Item value="full">Полный</SegmentedControl.Item>
</SegmentedControl.Root>
<SegmentedControl.Root label="Клиенты" …>…</SegmentedControl.Root>
<Checkbox.Root><Checkbox.Label>Экспорт данных</Checkbox.Label></Checkbox.Root>
```

```tsx good
// good — a row per section that has access, the level in a column; a permission flag is a Switch
// declare: type Grant = { id: string; section: string; level: string }
// declare: const grants: Grant[]
// declare: const setGrants: (grants: Grant[]) => void
<>
  <FieldList
    label="Доступ к разделам"
    columns={[{ label: "Раздел" }, { label: "Уровень", width: "m" }]}
    value={grants}
    onValueChange={setGrants}
    getId={(grant) => grant.id}
    createItem={() => ({ id: crypto.randomUUID(), section: "", level: "view" })}
    addLabel="Раздел"
    renderItem={(grant, row) => (
      <>
        <Select.Root value={grant.section} onValueChange={(section) => row.update({ section })}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="deals">Сделки</Select.Item>
            <Select.Item value="clients">Клиенты</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root value={grant.level} onValueChange={(level) => row.update({ level })}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="view">Просмотр</Select.Item>
            <Select.Item value="edit">Изменение</Select.Item>
            <Select.Item value="full">Полный</Select.Item>
          </Select.Content>
        </Select.Root>
      </>
    )}
  />
  <Switch.Root name="export">
    <Switch.Label>Экспорт данных</Switch.Label>
  </Switch.Root>
</>
```

### A kind that leads to its own form

Creating or connecting one of several kinds of record whose forms differ (a Telegram bot or a
Telegram account, a VK community or a VK account; an invoice or an act) is a fork before the form,
not a field of it. Ask of the choice: do the fields after it stay the same?

| The choice | Shape |
|---|---|
| the fields stay the same; the choice is one more value of the record (a client type, a currency) | a field of the form: `Radio.Group` for 2–5, `Select` for more |
| each option has its own fields, its own steps or its own service to connect | the action button opens a `Dropdown`: one `Dropdown.Item` per kind (`Dropdown.ItemIcon` with its glyph), in a `Dropdown.Group label` per family when the kinds group (by messenger, by document type); a pick opens that kind's form straight away, titled by the kind («Подключить Telegram-бота»); in ⌘K, one `CommandMenu.Item` per kind |

Never a dialog whose first step is the choice and a «Далее»: the person already said what they
want by pressing the item, and a dialog that changes its fields under a choice cannot say what it
will create. One kind only → the button opens its form directly, no menu.

```tsx partial
// bad — the kind is a first step inside the dialog: two choices and «Далее» before any field
<Modal.Body>
  <SegmentedControl.Root label="Мессенджер" defaultValue="telegram">…</SegmentedControl.Root>
  <Radio.Group label="Что подключить" defaultValue="bot">…</Radio.Group>
</Modal.Body>
<Modal.Footer>
  <Button.Root>Далее</Button.Root>
</Modal.Footer>
```

```tsx good
// good — the button is a menu of kinds grouped by messenger; a pick opens that kind's form
// declare: const openConnect: (kind: "telegram-bot" | "telegram-account" | "vk-group" | "vk-account") => void
<Dropdown.Root>
  <Dropdown.Trigger>
    <Button.Root>
      <Button.Icon>
        <Icon name="action.add" />
      </Button.Icon>
      Подключить
    </Button.Root>
  </Dropdown.Trigger>
  <Dropdown.Content>
    <Dropdown.Group label="Telegram">
      <Dropdown.Item onSelect={() => openConnect("telegram-bot")}>
        <Dropdown.ItemIcon>
          <Icon name="brand.telegram" />
        </Dropdown.ItemIcon>
        Бот
      </Dropdown.Item>
      <Dropdown.Item onSelect={() => openConnect("telegram-account")}>
        <Dropdown.ItemIcon>
          <Icon name="brand.telegram" />
        </Dropdown.ItemIcon>
        Аккаунт
      </Dropdown.Item>
    </Dropdown.Group>
    <Dropdown.Group label="ВКонтакте">
      <Dropdown.Item onSelect={() => openConnect("vk-group")}>
        <Dropdown.ItemIcon>
          <Icon name="brand.vk" />
        </Dropdown.ItemIcon>
        Сообщество
      </Dropdown.Item>
      <Dropdown.Item onSelect={() => openConnect("vk-account")}>
        <Dropdown.ItemIcon>
          <Icon name="brand.vk" />
        </Dropdown.ItemIcon>
        Аккаунт
      </Dropdown.Item>
    </Dropdown.Group>
  </Dropdown.Content>
</Dropdown.Root>
```

### A figure: Kpi and its size

The size of a `Kpi.Root` follows how many figures share its row, and the whole row takes that one
size — never a larger card for the figure you like best:

| Row | Size | The card holds |
|---|---|---|
| a strip of 6–8 figures over a table, a side panel | `s` | the title and the period on one line, the value with its change |
| the default row of 4–5 | `m` (omit `size`) | + one badge or menu, the period and a note under the value, a chart or a progress, a legend |
| a row of 3, a figure that needs explaining | `l` | + the icon, the description, a button, a note or two totals |
| the lead figure of a screen, one or two to a row | `xl` | + four totals, a breakdown, the ring beside its legend |

A part the size does not hold renders nothing — a `Kpi.Description` or a `Kpi.Icon` on M is
dropped — so pick the size from the row first, then the parts
([Kpi → Variants](../src/components/kpi/COMPONENT.md#variants)). Inside a dialog the card takes
the dialog's tier by itself.

## 3. Pairs that are easy to confuse

| Pair | Rule |
|---|---|
| List / ChatList / Sidebar / Tabs / DataTable | List: the records of a list + detail screen that are not conversations (tickets, letters, invoices), one open at a time (`current`), each row a button or a link with a text line, a preview, meta and a count. ChatList: the conversations of a messenger or an inbox. Sidebar: the sections of the **app**. Tabs: panels of **one screen**. Static facts in a card, nothing opens → `DescriptionList align="end"` in `Card.Body`; a list of records inside a card is this `List` (a `Card.Root` holding only it is a pane). DataTable: many records compared by columns, sorted, filtered, selected in bulk. |
| FieldList / DataTable / Fieldset / TagSelect | FieldList: records of one shape a person **edits** in a form, a row of fields each, added and removed by hand, up to four short fields per row. DataTable: records a person **reads**, sorts, filters and selects; edits open a Drawer. Fieldset: **one** record's fields under a heading. TagSelect: values **picked** from options, shown as tags. One value in several units is none of them — fields in one row under one heading. |
| Tabs / SegmentedControl | Tabs switch **panels of content** (navigation inside a screen). SegmentedControl switches a **mode** of the same content (period, view mode, filter) — never a stored setting, which is a `Select` field. |
| Modal / Drawer / Sheet / Popover / Tooltip | Modal: blocking decision or a short form (≤ 4 fields) that needs full attention. Drawer: long form, filters, record details beside the page, while keeping page context. Sheet: a short task that ends by itself — a pick, an action, a short note — raised from the bottom edge. Popover: small non-modal panel anchored to a control (quick edit, explanation with a link). Tooltip: a few words naming or explaining a control, no interactive content; a hint on hover that holds a link or a button (a person or record card by a name) → Popover `openOn="hover"`. |
| Select / NativeSelect | Select: the kit's floating list — icons, descriptions, groups, search, `multiple`, `clearable`. NativeSelect: a plain text list where the OS picker is better (phones) or the value must post with a form by `name`. |
| Select / Dropdown / CommandMenu / TagSelect | Select picks a **value** for a field (form data). Dropdown runs **actions** (Edit, Duplicate, Delete). CommandMenu searches commands and pages across the app (locally or on the server) — it is not a field. TagSelect picks **several values** as tags. |
| SmartFilter / SegmentedControl / Select | Search and filters over a list → SmartFilter (`fields={[]}` for a search alone), even with one field. A switch of what the same data shows (sections with counts, a period, a view) → SegmentedControl, or a Select when the options are many. |
| Badge / Button | A badge labels or holds a value (status, filter, keyword): `onRemove` drops it, `pressed` toggles it. A command (save, open, go) is always a Button. |
| Banner / Notification / Hint | Banner: persistent message in the page flow about a page/section state (sync failed, trial ends). Notification: transient toast about the result of an action (saved, failed). Hint / `error`: help or validation text under one field; a status of its value (a deadline that nears) → `hintTone` on the field, `tone` on a lone Hint. |
| ProgressBar / ProgressCircle / Spinner | ProgressBar: a share with width to spare and words beside it (an upload row, an import, a quota line). ProgressCircle: a share on the data scale (24–80) where width is short or a ring reads better (a KPI goal, a ring breakdown, a named import card); `value={null}` while the share is unknown, `spin` while a share grows, an icon in the centre. Spinner: an anonymous «busy» on the icon scale inside a control or a status line, no share, no name of its own. A ring you can press (cancel, retry, download a transfer) → Button `shape="circle"` with `progress`, not any of the three. |
| Button / LinkButton | Button does something (submit, open, delete). LinkButton goes somewhere (a URL, «Подробнее», «Все заказы»). |
| Checkbox / Switch / Radio | Switch: a capability or a setting that is on or off — a permission, a privacy toggle — whether it saves with a form or at once. Checkbox: items picked out of a set, a consent, a one-off option of the action being sent. Radio: one of several, submitted later ([a flag, a level, a set](#a-flag-a-level-a-set)). |
| Gallery / MediaViewer / Thumbnail / Carousel | Thumbnail: one picture or video of an object in a list, card or picker (selectable with `checked`). Carousel: several photos of one object in one box (a catalogue card's cover, the top of a record) — swiped, scrubbed by hover, stepped by dots; `onItemOpen` opens MediaViewer. Gallery: an album of 1–10 photos and videos laid out by their ratios; it opens MediaViewer itself. MediaViewer: the full-screen viewer on its own, opened from your own thumbnails or a button (`getOrigin` for the zoom out of the tile). A grid of many images to browse → a CSS grid of Thumbnails, not a Gallery. |
| Sparkline / ChartFrame | Sparkline: a small line or bars you can scrub for one main series, its reading (value, change, date) from `useSparkline` laid out by a Kpi (`variant="bars"` for signed values), comparison lines beside it (`series`). ChartFrame: a panel around a real chart (axes, several series, legend, tooltip, states) drawn by a library or your SVG. Rows to compare → DataTable. |
| VoicePlayer / VideoNote | The same player props (`src`, `duration`, `playing`, transcript, `transfer`). VoicePlayer: audio, a waveform seek slider and a playback rate. VideoNote: a round face-to-camera video with a `poster`; alone in `Message.Root` it is the message. A video with controls → `Thumbnail.Video` / `Message.Media`. |
| Card / plain section / Grid | Card for a bounded block of related content that stands out (settings panel, side facts). A page section that is the only thing in its region needs no card: `Page.Section label` and the content. Several tiles of one screen → one `Page.Grid` with a `Page.Cell span` each; a grid inside one block (thumbnails, fields) is the block's own CSS. Never wrap a single field, a DataTable or a whole page in a Card. |
| Kpi / Card / List / DescriptionList / ChartFrame / Kanban card | **Kpi**: a card about one figure — its value, change and period, optionally a chart or a progress (`Kpi.Media`), its parts and totals (`Kpi.Footer`) and one action; `Kpi.Root` is the card, never wrapped in a `Card.Root`. **Card**: a block whose subject is not one figure — a form, a record with its facts and actions, a list, a cover tile, a tile a person selects. **DescriptionList**: a record's facts as label–value pairs, a phrase or a link among them («Ближайшая задача», «t.me/…») — never Kpi cards of text. **ChartFrame**: a chart with axes, a legend and series, a panel of its own. A figure inside a record card is a `DescriptionList` or `Card.Total`, never a nested Kpi. **List**: the records of a card when they open as a whole. **Kanban card**: Kanban's own item, never a `Card` — a card does not drag; reordering is a screen mode on `Dnd`. Several KPIs: a `Kpi.Root` each in `Page.Grid`, one size per row ([a figure: Kpi and its size](#a-figure-kpi-and-its-size)). |
| EmptyPage / empty DataTable | Empty table (no rows yet or nothing matches the filter): the DataTable `empty` prop — headers and toolbar stay. Whole page or region with no data at all (first run): EmptyPage with one action. |
| Accordion / Tabs | Accordion when the user may need several sections open or reads them in order (FAQ, settings groups). Tabs when sections are alternatives viewed one at a time. |
| Divider / gap | Divider inside a block between rows or a form and its footer. Between blocks and groups use air (`gap`), not lines. |
| Breadcrumb / back button | Breadcrumb on pages below a top-level section (Счета → № 2026-0418) and deeper; not on top-level pages. A single “Back” without hierarchy → `LinkButton`. |
| DataTable grip `end` / `start` / `row`, column order | Rows whose order is data (stages, a price list): `onReorder` with the grip at the end of the row (`reorderHandle="end"`, the default — after the row actions); `start` only when the order is the list's main point and nothing is selected; `row` (the whole row carries) only for short rows with nothing to select, copy or follow as a link. Sorted by a column, rows do not reorder — say so, never hide the grip. Columns people arrange for themselves: `columnOrder` with `hiddenColumns` and the column chooser — a header drag (the header moves alone), Alt + ← / → and the chooser's grips; the key column `reorderable: false` (or pinned), the actions column `hideHeader`; the app saves both lists. |
| Pagination / infinite scroll | Pages for tables people return to or reference: DataTable `paging="pages"` (default, Pagination in the footer). `paging="infinite"` for feeds. Standalone Pagination only for lists that are not a DataTable. |
| Stepper / Tabs | Stepper for a sequential process with completion status; Tabs for non-sequential views. |
| Gantt / Timeline / Kanban / DataTable | Gantt: records with a start and an end compared across time (who is busy when, a plan with phases and milestones), moved, stretched and drawn by hand (`onBarChange`, `onBarCreate`). Timeline: a history of events at points in time, read top to bottom. Kanban: work items moved between statuses, time does not matter. DataTable: many records compared by many attributes, sorted, filtered and selected — dates are only columns. |
| DescriptionList / DataTable / Card | DescriptionList: the properties of **one** record as «label — value» pairs (requisites, deal terms, a summary before a confirm). DataTable: **many** records with the same properties. Card: the bounded block they sit in — a DescriptionList inside a `Card.Body`, never a Card per property; one headline number is a `Kpi`. |
| ConfirmDialog / Modal / `holdToConfirm` / undo | Which of them an action deserves is its cost: [ux.md → friction](ux.md#5-friction-matches-the-cost-of-a-mistake). ConfirmDialog only asks a question (`onConfirm` returns the request; pending, failure and dismiss rules are built in); a form, a choice or more than a sentence of content → Modal; never a Modal hand-built as a confirm. |
| Composer / Textarea / RichText | Composer: the message input of a conversation — Enter sends, attachments, a reply or edit bar, voice and round video. Textarea: long text saved with a form (a description, a comment field) by its submit button; `formatting` when the text keeps the chat's Markdown. RichText: that Markdown shown, read-only, outside a message (a template, a bot's welcome text). |
| Chat / Message / Gallery | Chat: a conversation — the header, search, pinned, the one message list (dates, runs, selection, jumps, read receipts, typing) and the Composer in its footer; a list without the rest is `Chat.Root` with `Chat.Messages`. Message: one message and its content parts — a row of that list, or a bubble on its own (a quoted reply in a ticket). Gallery: an album of photos and videos laid out by their ratios — `Message.Media` in a message, `Gallery` anywhere else (a post, a comment, a report). |
| Message / Timeline / Notification | Message: what people say to each other in a conversation, in bubbles. Timeline: what happened to a record (status changes, an audit log). Notification: the result of the user's own action, for a few seconds. A chat event («Анна добавила Олега») is `Chat.Service`, not a Notification. |
| FileUpload list / grid / gallery / strip / button | One component, five shapes. **Button** (`trigger="button"`, no `multiple`): one service file in a settings card — a firmware image, a certificate, a backup; the drop zone is for document forms and media libraries, where files are the content. **List** (`layout="list"`, the default, with the drop zone): documents of a form, where the name matters; rows do not reorder. **Cards** (`trigger="tile"` `layout="grid"`): mixed photos and documents whose order matters (an inspection report). **Gallery** (`trigger="tile"` `layout="grid"` `cover` `accept="image/*"`): the photos of one object (a listing, a product); the first is the cover and dragging a photo first makes it the cover — no «make cover» button. **Strip** (`trigger="button"` + `FileUpload.Queue layout="strip"`): a paperclip and one scrolling row of tiles above a message field; the Composer already is this. Files on a server are `value` + `onValueChange` (return a promise to save); uploads are `queue` from `useUploadQueue`. One picture of a person is the avatar zone, not a gallery. |
| Fieldset / a labelled group control | Fieldset: several **fields** under one heading (`title-s` legend), with one `disabled` for all of them while the form saves. One **choice** with a heading (`Radio.Group label`, SegmentedControl or ButtonGroup `label`, ColorSwatches `label`) is a single field — its own label names the group, no Fieldset around it. |
| ColorField / ColorPicker / ColorSwatches | ColorField: any color as a form field (swatch + hex, the picker in a popover, `presets`). ColorPicker: the picker panel is the screen itself (a design tool, an inline editor). ColorSwatches: a short fixed palette visible at once. ColorField and ColorPicker come from `prime-ui-kit/color-picker` and bring `react-aria-components`; a build on a budget ([embedded UI](SKILL.md#setup-once-per-app)) takes neither: ColorSwatches `mode="color"` with `presets` of the device's colours plus the current one, or `ColorPresets.Root allowCustom` when any hex is valid — both from the root. |
