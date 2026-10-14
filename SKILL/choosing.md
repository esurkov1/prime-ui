# Choosing a component

First pick the category by the task, then the component inside it, then check the pairs that are easy to
confuse. Links: [components.md](components.md). Whole screens: [composition.md](composition.md).

## 1. Category by task

| The user needs to… | Category |
|---|---|
| trigger an action (save, delete, go on) | Actions — Button, ButtonGroup, LinkButton |
| type a value (text, number, code, file, photos), group the fields of a form, edit a list of records of one shape | Inputs — Input, Textarea, DigitInput, FileUpload, Label, Hint, Fieldset, FieldList |
| pick from options, toggle, set a range, filter, a date or a color | Selection — Checkbox, Radio, Switch, SegmentedControl, Slider, Select, NativeSelect, TagSelect, SmartFilter, Datepicker, ColorField, ColorPicker, ColorSwatches |
| see data: status labels, people, objects, numbers and their trend, properties of a record, rows, a board, a schedule, events, code, disclosed sections | Data display — Badge, Avatar, Thumbnail, Kbd, Card, DescriptionList, DataTable, Kanban, Gantt, Timeline, CodeBlock, Accordion, Sparkline, ChartFrame |
| hold a conversation: pick a dialog, read and send chat messages of every kind | Messages — Chat, ChatList, Message, Gallery, VoicePlayer, VideoNote, Composer |
| learn what happened, how far along it is, or watch a region load and change state; say it to a screen reader | Status and loading — Banner, Notification, ProgressBar, ProgressCircle, Spinner, Skeleton, Crossfade, EmptyPage, VisuallyHidden |
| move between places: app sections, panels of a screen, the records of a list, the path, pages, steps | Navigation — Tabs, Breadcrumb, Pagination, List, Stepper, Sidebar, BottomNav |
| see something on top of the page, or a photo or video full screen | Overlays — Tooltip, Popover, Dropdown, Modal, ConfirmDialog, Drawer, Sheet, CommandMenu, MediaViewer |
| get the app frame and the structure of a page | Page — AppShell, AppHeader, PageContent, PageToolbar, Divider, ScrollContainer |
| drag things by hand | Interaction — Dnd (a status board: Kanban in Data display) |
| show a whole ready-made screen block (sign-in, sign-up, password reset, code) | Composition — LoginForm |
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
contacts, specs, prices by period) → FieldList: one row per record, the headings once.

**Selection.**

| Situation | Component |
|---|---|
| one independent yes/no that is submitted with a form | Checkbox |
| one setting that applies immediately | Switch |
| exactly one of 2–5 visible options in a form | Radio (`Radio.Group` with `label`) |
| exactly one of 2–5 modes that change the view right now | SegmentedControl |
| one of many (> 5) or a long list; icons, descriptions, search, groups | Select (`Select.Content searchable`) |
| one record out of thousands for a form field (a client, a contract), searched on the server | Select with `search` / `onSearchChange`, `filter={false}`, `loading`, `hasMore` + `onLoadMore` — never a read-only field that opens a CommandMenu |
| one value from a plain text list on a mobile-first form, posted with the form (`name`) | NativeSelect — the OS picker opens on phones |
| several of many, shown as tags, with search / creation | TagSelect (`Select.Root multiple` when tags are not needed) |
| narrowing a list or table by several fields, with search and show / hide | SmartFilter |
| an approximate number in a range | Slider (exact number → Input) |
| a date or a period | Datepicker |
| a color from a fixed palette in a form or dialog | ColorSwatches (inline grid, default choice) |
| a compact color next to a field or in a list row | ColorPresets (trigger + popover palette) |
| any color as a field of a form (swatch + hex, picker in a popover) | ColorField |
| any color in a panel of its own (hex, eyedropper, channels) | ColorPicker |

**Data.** Status, count, removable value or applied filter → Badge (`onRemove` to remove, `onPress` to
toggle). Person or organization → Avatar. Object (product, vehicle, file, cover) → Thumbnail with a
`ratio` — never a round Avatar for things. Keyboard shortcut → Kbd. One block of related
numbers/content → Card (pick the template; a whole tile that opens its details → `Card.Root asChild`
with a link). Read-only properties of one record («label — value») → DescriptionList, never a
hand-made grid of text pairs. Rows with columns, sorting, selection → DataTable.
Items that flow through statuses and are moved by hand → Kanban (a single list to reorder, or items
dropped onto folders or assignees → Dnd directly). Its look: `plain` (default) when the board is
the page's main region or sits in a Card / Drawer — headers and cards stand on the host, one level of
nesting; `variant="well"` when columns must read as bounded queues (WIP limits, many sparse or empty
columns, a dense board of narrow columns). Never your own box around a column.
Records with a start and an end compared across time — who is busy when, a project plan with
phases and milestones → Gantt (never a DataTable of dates or hand-drawn bars); moved and resized by
hand through `onBarChange`.
Chronological events → Timeline; a conversation between people (support, a team chat) → Message —
never a Timeline or a list of Cards styled as bubbles. Code → CodeBlock. A number with its trend over days or weeks (revenue, orders, sign-ups) → Sparkline: the latest value, its change and a line you can scrub; values with a sign by period → Sparkline `variant="bars"`; against a plan → `reference`; missing days → `value: null`; a chart with axes or several series → ChartFrame around a chart library or your own SVG (the panel, legend, tooltip, states and the screen-reader table come from the kit, the colors from `series` / `chartColors` — never status tones); values to read, sort or compare row by row → DataTable, not a chart.

**Messages.** A whole conversation → `Chat`: `Chat.Root` with `Chat.Header` (avatar, `Chat.Title`,
`Chat.Description`, `Chat.Actions` with `Chat.SearchButton`), `Chat.Search`, `Chat.Pinned`,
`Chat.Messages` (from `items` with `renderMessage`, or `Message.Root` children) and `Chat.Footer`
with the Composer — never a hand-built header, ScrollContainer and list. A list of messages without
the rest (comments as a chat, a read-only history) → `Chat.Root` with `Chat.Messages` alone; one
message on its own → `Message.Root`. The list of conversations beside the chat (the dialogs pane of a
messenger or an inbox) → `ChatList` (`items`, `renderItem` with `ChatList.Item`, `value`): unread
counts, «печатает…», drafts, ticks, a row menu and search come with it — never `List` with a hand-made
count and preview; `List` stays for records that are not conversations (tickets, letters, invoices). A group chat → `Chat.Messages type="group"`: `Message.Author`
(`tag`, `Message.AuthorIcon`) and `Message.Avatar` on every message, the list shows them on the
first and the last of a run. A voice message → `VoicePlayer` inside `Message.Root`; a call recording
outside a chat → `VoicePlayer` alone. A round video message → `VideoNote` inside `Message.Root`
(alone there it is the message: no bubble); a face-to-camera report outside a chat → `VideoNote`
alone. The two players take the same props (`src`, `duration`, `unplayed`, `disabled`, `playing`,
the transcript and the `transfer` set); only VoicePlayer has `waveform` and a rate, only VideoNote a
`poster`. Photos and videos in a message → `Message.Media`; the same album outside a chat (a post, a
comment, a report) → `Gallery`; one picture of an object → `Thumbnail`. A video with controls →
`Message.Media` or `Thumbnail.Video`, not VideoNote. «Печатает…» → `Chat.Root typing` (or
`Message.Typing`), never a text row; a jump to a message → `Message.Reply target`, `Chat.Pinned` or
`Chat.Root current`, never `scrollIntoView`; search inside a chat → `Chat.Search`. Files, photos,
places and contacts sent in a chat → the `Message` parts, not FileUpload rows or Cards.

**Status and loading.** See the pair below. Progress of a single task → ProgressBar `value`; parts of a whole →
ProgressBar `segments` (categories wear `color`, meanings wear `tone`; `legend` for color · name ·
value · share); a ranking «label · value · share — bar» (top cities, a funnel) → ProgressBar
`layout="rows"` with `scale`; compact goal / KPI ring or a ring breakdown → ProgressCircle (`value` or
`segments`). Loading with unknown progress → `loading` on the component that has it (Button, Select,
DataTable, ProgressBar, ProgressCircle, Sparkline, ChartFrame `state`); a region whose content has a shape (list, card,
form) → Skeleton of that shape; nothing to hold (a running job, a status line) → Spinner. Nothing to
show → EmptyPage; a region that failed to load → EmptyPage `tone="danger"` with
`EmptyPage.RetryButton` (async `onRetry`).

**State changes (a foundation of the kit).** A region never flips between states: any region switching between
loading, data, empty and error, or showing one record at a time → its content in
`Crossfade state={status}`, with a Skeleton as the loading state (DataTable's body does both by itself).

**Overlays.** See the pairs below. Global search over commands and pages (⌘K) → CommandMenu. A short
task that ends by itself (a date, an action on a record, a short note) raised from the bottom edge →
Sheet. Menus, selects, pickers and Modal turn into bottom sheets below 640px by themselves — never
build your own. A photo, a scan or a video opened full screen from its thumbnail (a Gallery tile, a
Thumbnail button) → MediaViewer, never a Modal with an `<img>`.

**Phone navigation.** App navigation is Sidebar on a wide screen and `BottomNav` in `AppShell.Footer`
on a phone for 2–6 main sections (the shell hides it by itself while the Sidebar rail is on screen;
only inside `AppShell.Footer`, never your own media query) — not Tabs, not a
Drawer menu.

**App frame.** Sidebar collapse control: `Sidebar.Toggle variant="header"` next to `Sidebar.Brand` in
`Sidebar.Header` — at the header's end while expanded, a small round button on the rail's edge while
compact (the default for a branded rail); `Sidebar.Toggle` (`variant="item"`) in `Sidebar.Footer` when
the rail has no brand header. On phones neither replaces `AppHeader.MenuButton` that
opens the off-canvas Sidebar (`open` / `onOpenChange`). The bar at the top of the panel (where you are,
⌘K search, a few app actions) is `AppHeader`; the page's own heading and actions are `PageContent`, its
data tools `PageToolbar`. Use `PageToolbar` when a page has several tools above its data — sections,
search and filters, a view switch, an action — and they must rearrange on a phone; one search or one
filter above a single table goes into the DataTable `toolbar` instead. A page that gives all its
height to the work (a board, a chat) may let `AppHeader` carry the page instead: `AppHeader.Title
as="h1"` and the PageToolbar in `AppHeader.Tools` — then main has no `PageContent.Header`. A record
opened from a table: its own page → DataTable `getRowHref`; in place → `onRowClick` + Drawer; a list
worked through record by record (mail, chat, tickets) → `PageContent.Split` with a `List` of the records
(`current` on the open one). Sections of a long rail → `Sidebar.Group
collapsible`; a section with sub-pages → `Sidebar.Sub`; the signed-in user → `Sidebar.Account` in a
`Dropdown.Trigger` at the bottom of `Sidebar.Footer`.

## 3. Pairs that are easy to confuse

| Pair | Rule |
|---|---|
| List / Sidebar / Tabs / Card list / DataTable | List: the records of a list + detail screen (dialogs, tickets, mail), one open at a time (`current`), each row a button or a link with a text line, a preview, meta and a count. Sidebar: the sections of the **app**. Tabs: panels of **one screen**. `Card.List` (`variant="list"`): static facts in a card, nothing opens. DataTable: many records compared by columns, sorted, filtered, selected in bulk. |
| FieldList / DataTable / Fieldset / TagSelect | FieldList: records of one shape a person **edits** in a form, a row of fields each, added and removed by hand, up to four short fields per row. DataTable: records a person **reads**, sorts, filters and selects; edits open a Drawer. Fieldset: **one** record's fields under a heading. TagSelect: values **picked** from options, shown as tags. One value in several units is none of them — fields in one row under one heading. |
| Tabs / SegmentedControl | Tabs switch **panels of content** (navigation inside a screen). SegmentedControl switches a **value or mode** of the same content (period, view mode, filter). |
| Modal / Drawer / Sheet / Popover / Tooltip | Modal: blocking decision or a short form (≤ 4 fields) that needs full attention. Drawer: long form, filters, record details beside the page, while keeping page context. Sheet: a short task that ends by itself — a pick, an action, a short note — raised from the bottom edge. Popover: small non-modal panel anchored to a control (quick edit, explanation with a link). Tooltip: a few words naming or explaining a control, no interactive content. |
| Select / NativeSelect | Select: the kit's floating list — icons, descriptions, groups, search, `multiple`, `clearable`. NativeSelect: a plain text list where the OS picker is better (phones) or the value must post with a form by `name`. |
| Select / Dropdown / CommandMenu / TagSelect | Select picks a **value** for a field (form data). Dropdown runs **actions** (Edit, Duplicate, Delete). CommandMenu searches commands and pages across the app (locally or on the server) — it is not a field. TagSelect picks **several values** as tags. |
| SmartFilter / Select in a toolbar | One field with a few options → SegmentedControl or Select in the table toolbar. Several fields, search, include / exclude → SmartFilter. |
| Badge / Button | A badge labels or holds a value (status, filter, keyword): `onRemove` drops it, `onPress` toggles it. A command (save, open, go) is always a Button. |
| Banner / Notification / Hint | Banner: persistent message in the page flow about a page/section state (sync failed, trial ends). Notification: transient toast about the result of an action (saved, failed). Hint / `error`: help or validation text under one field. |
| ProgressBar / ProgressCircle / Spinner | ProgressBar: a share with width to spare and words beside it (an upload row, an import, a quota line). ProgressCircle: a share on the data scale (24–80) where width is short or a ring reads better (a KPI goal, a ring breakdown, a named import card); `value={null}` while the share is unknown, `spin` while a share grows, an icon in the centre. Spinner: an anonymous «busy» on the icon scale inside a control or a status line, no share, no name of its own. A ring you can press (cancel, retry, download a transfer) → Button `shape="circle"` with `progress`, not any of the three. |
| Button / LinkButton | Button does something (submit, open, delete). LinkButton goes somewhere (a URL, «Подробнее», «Все заказы»). |
| Checkbox / Switch / Radio | Checkbox: choice submitted later with a button, can be multiple. Switch: on/off that applies at once (no Save button). Radio: one of several, submitted later. A privacy toggle inside a create form that is submitted → Checkbox. |
| Gallery / MediaViewer / Thumbnail | Thumbnail: one picture or video of an object in a list, card or picker (selectable with `checked`). Gallery: an album of 1–10 photos and videos laid out by their ratios; it opens MediaViewer itself. MediaViewer: the full-screen viewer on its own, opened from your own thumbnails or a button (`getOrigin` for the zoom out of the tile). A grid of many images to browse → a CSS grid of Thumbnails, not a Gallery. |
| Sparkline / ChartFrame | Sparkline: one series as a headline number with its change and a small line or bars you can scrub (`variant="bars"` for signed values). ChartFrame: a panel around a real chart (axes, several series, legend, tooltip, states) drawn by a library or your SVG. Rows to compare → DataTable. |
| VoicePlayer / VideoNote | The same player props (`src`, `duration`, `playing`, transcript, `transfer`). VoicePlayer: audio, a waveform seek slider and a playback rate. VideoNote: a round face-to-camera video with a `poster`; alone in `Message.Root` it is the message. A video with controls → `Thumbnail.Video` / `Message.Media`. |
| Card / plain section / Grid | Card for a bounded block of related content that stands out (metric, settings panel, side facts). A page section that is the only thing in its region needs no card: `PageContent.Section label` and the content. Several tiles of one screen → one `PageContent.Grid` with a `PageContent.Cell span` each; a grid inside one block (thumbnails, fields) is the block's own CSS. Never wrap a single field, a DataTable or a whole page in a Card. |
| EmptyPage / empty DataTable | Empty table (no rows yet or nothing matches the filter): the DataTable `empty` prop — headers and toolbar stay. Whole page or region with no data at all (first run): EmptyPage with one action. |
| Accordion / Tabs | Accordion when the user may need several sections open or reads them in order (FAQ, settings groups). Tabs when sections are alternatives viewed one at a time. |
| Divider / gap | Divider inside a block between rows or a form and its footer. Between blocks and groups use air (`gap`), not lines. |
| Breadcrumb / back button | Breadcrumb on pages below a top-level section (Счета → № 2026-0418) and deeper; not on top-level pages. A single “Back” without hierarchy → `LinkButton` or `Button.Root variant="ghost"`. |
| Pagination / infinite scroll | Pages for tables people return to or reference: DataTable `paging="pages"` (default, Pagination in the footer). `paging="infinite"` for feeds. Standalone Pagination only for lists that are not a DataTable. |
| Stepper / Tabs | Stepper for a sequential process with completion status; Tabs for non-sequential views. |
| Gantt / Timeline / Kanban / DataTable | Gantt: records with a start and an end compared across time (who is busy when, a plan with phases and milestones), moved, stretched and drawn by hand (`onBarChange`, `onBarCreate`). Timeline: a history of events at points in time, read top to bottom. Kanban: work items moved between statuses, time does not matter. DataTable: many records compared by many attributes, sorted, filtered and selected — dates are only columns. |
| DescriptionList / DataTable / Card | DescriptionList: the properties of **one** record as «label — value» pairs (requisites, deal terms, a summary before a confirm). DataTable: **many** records with the same properties. Card: the bounded block they sit in, or one headline number (`mini`, `stat-trend`) — a DescriptionList inside a `Card.Body`, never a Card per property. |
| ConfirmDialog / Modal / `holdToConfirm` / undo | A row or item in a list that can be restored → delete at once and offer «Отменить» in the Notification. One standalone destructive action that is easy to redo by hand, no list (clear a draft, revoke a token) → `Button.Root holdToConfirm` with the action in `onConfirm`. Irreversible loss of work or a weighty action (delete a project, send an invoice) → ConfirmDialog (`onConfirm` returns the request; pending, failure and dismiss rules are built in). Unsaved changes in a Modal or Drawer form → `Modal.Guard` / `Drawer.Guard dirty`. A form, a choice or more than a sentence of content → Modal; never a Modal hand-built as a confirm. |
| Composer / Textarea | Composer: the message input of a conversation — Enter sends, attachments, a reply or edit bar, voice and round video. Textarea: long text saved with a form (a description, a comment field) by its submit button. |
| Chat / Message / Gallery | Chat: a conversation — the header, search, pinned, the one message list (dates, runs, selection, jumps, read receipts, typing) and the Composer in its footer; a list without the rest is `Chat.Root` with `Chat.Messages`. Message: one message and its content parts — a row of that list, or a bubble on its own (a quoted reply in a ticket). Gallery: an album of photos and videos laid out by their ratios — `Message.Media` in a message, `Gallery` anywhere else (a post, a comment, a report). |
| Message / Timeline / Notification | Message: what people say to each other in a conversation, in bubbles. Timeline: what happened to a record (status changes, an audit log). Notification: the result of the user's own action, for a few seconds. A chat event («Анна добавила Олега») is `Chat.Service`, not a Notification. |
| FileUpload list / grid / gallery / strip | One component, four shapes. **List** (`layout="list"`, the default, with the drop zone): documents of a form, where the name matters; rows do not reorder. **Cards** (`trigger="tile"` `layout="grid"`): mixed photos and documents whose order matters (an inspection report). **Gallery** (`trigger="tile"` `layout="grid"` `cover` `accept="image/*"`): the photos of one object (a listing, a product); the first is the cover and dragging a photo first makes it the cover — no «make cover» button. **Strip** (`trigger="button"` + `FileUpload.Queue layout="strip"`): a paperclip and one scrolling row of tiles above a message field; the Composer already is this. Files on a server are `value` + `onValueChange` (return a promise to save); uploads are `queue` from `useUploadQueue`. One picture of a person is the avatar zone, not a gallery. |
| Fieldset / a labelled group control | Fieldset: several **fields** under one heading (`title-s` legend), with one `disabled` for all of them while the form saves. One **choice** with a heading (`Radio.Group label`, SegmentedControl or ButtonGroup `label`, ColorSwatches `label`) is a single field — its own label names the group, no Fieldset around it. |
| ColorField / ColorPicker / ColorSwatches | ColorField: any color as a form field (swatch + hex, the picker in a popover, `presets`). ColorPicker: the picker panel is the screen itself (a design tool, an inline editor). ColorSwatches: a short fixed palette visible at once. All but ColorSwatches come from `prime-ui-kit/color-picker`. |
