# Choosing a component

First pick the category by the task, then the component inside it, then check the pairs that are easy to
confuse. Links: [components.md](components.md). Whole screens: [composition.md](composition.md).

## 1. Category by task

| The user needs to… | Category |
|---|---|
| trigger an action (save, delete, go on) | Actions — Button, ButtonGroup, LinkButton |
| type a value (text, number, code, file) | Inputs — Input, Textarea, DigitInput, FileUpload, Label, Hint |
| pick from options, toggle, set a range, filter, a date or a color | Selection — Checkbox, Radio, Switch, SegmentedControl, Slider, Select, NativeSelect, TagSelect, SmartFilter, Datepicker, ColorPicker, ColorSwatches |
| see data: status labels, people, objects, numbers and their trend, rows, a board, events, code, disclosed sections | Data display — Badge, Avatar, Thumbnail, Kbd, Card, DataTable, Kanban, Timeline, CodeBlock, Accordion, Sparkline |
| learn what happened, how far along it is, or watch a region load and change state | Status and loading — Banner, Notification, ProgressBar, ProgressCircle, Spinner, Skeleton, Crossfade, EmptyPage |
| move between places: app sections, panels of a screen, the path, pages, steps | Navigation — Tabs, Breadcrumb, Pagination, Stepper, Sidebar, BottomNav |
| see something on top of the page | Overlays — Tooltip, Popover, Dropdown, Modal, Drawer, CommandMenu |
| get the app frame and the structure of a page | Page — AppShell, AppHeader, PageContent, PageToolbar, Divider, ScrollContainer |
| drag things by hand | Interaction — Dnd (a status board: Kanban in Data display) |
| show a whole ready-made screen block (sign-in, sign-up, password reset, code) | Composition — LoginForm |
| style text | Foundations — Typography |

## 2. Inside a category

**Actions.** One command → `Button.Root`. Several joined commands or toggles in one bar (editor
toolbar, view switch with `pressed`) → `ButtonGroup`. Navigation to a URL that should look like text →
`LinkButton` (it is an `<a>`); a URL that should look like a button → `Button.Root asChild` with `<a>`.

**Text input.** One line → Input. Several lines → Textarea. Fixed-length code (OTP, PIN) → DigitInput.
Files → FileUpload. A sign-in, sign-up, password-reset or code screen → LoginForm. Number with a unit →
Input with `Input.InlineAffix`. Search and filters above a list or table → SmartFilter; a lone search
field in a toolbar → Input with `Input.Icon` + `type="search"` and `aria-label`.

**Selection.**

| Situation | Component |
|---|---|
| one independent yes/no that is submitted with a form | Checkbox |
| one setting that applies immediately | Switch |
| exactly one of 2–5 visible options in a form | Radio (`Radio.Group` with `label`) |
| exactly one of 2–5 modes that change the view right now | SegmentedControl |
| one of many (> 5) or a long list; icons, descriptions, search, groups | Select (`Select.Content searchable`) |
| one value from a plain text list on a mobile-first form, posted with the form (`name`) | NativeSelect — the OS picker opens on phones |
| several of many, shown as tags, with search / creation | TagSelect (`Select.Root multiple` when tags are not needed) |
| narrowing a list or table by several fields, with search and show / hide | SmartFilter |
| an approximate number in a range | Slider (exact number → Input) |
| a date or a period | Datepicker |
| a color from a fixed palette in a form or dialog | ColorSwatches (inline grid, default choice) |
| a compact color next to a field or in a list row | ColorPresets (trigger + popover palette) |
| any color (hex, eyedropper, channels) | ColorPicker |

**Data.** Status, count, removable value or applied filter → Badge (`onRemove` to remove, `onPress` to
toggle). Person or organization → Avatar. Object (product, vehicle, file, cover) → Thumbnail with a
`ratio` — never a round Avatar for things. Keyboard shortcut → Kbd. One block of related
numbers/content → Card (pick the template). Rows with columns, sorting, selection → DataTable.
Items that flow through statuses and are moved by hand → Kanban (a single list to reorder, or items
dropped onto folders or assignees → Dnd directly).
Chronological events → Timeline. Code → CodeBlock. A number with its trend over days or weeks (revenue, orders, sign-ups) → Sparkline: the latest value, its change and a line you can scrub; exact values on axes or several series need a chart library.

**Status and loading.** See the pair below. Progress of a single task → ProgressBar `value`; parts of a whole →
ProgressBar `segments`; compact goal / KPI ring or a ring breakdown → ProgressCircle (`value` or
`segments`). Loading with unknown progress → `loading` on the component that has it (Button, Select,
DataTable); a region whose content has a shape (list, card, form) → Skeleton of that shape; nothing
to hold (a running job, a status line) → Spinner. Nothing to show → EmptyPage.

**State changes (a foundation of the kit).** A region never flips between states: any region switching between
loading, data, empty and error, or showing one record at a time → its content in
`Crossfade state={status}`, with a Skeleton as the loading state (DataTable's body does both by itself).

**Overlays.** See the pairs below. Global search over commands and pages (⌘K) → CommandMenu. A short
task on a phone (a date, an action, two fields) → `Drawer.Content side="bottom"`. Menus, selects and
pickers turn into bottom sheets below 640px by themselves — never build your own.

**Phone navigation.** App navigation is Sidebar on a wide screen and `BottomNav` in `AppShell.Footer`
on a phone for 3–5 main sections (it leaves by itself once the footer is 640px wide) — not Tabs, not a
Drawer menu.

**App frame.** Sidebar collapse control: `Sidebar.Toggle variant="header"` next to `Sidebar.Brand` in
`Sidebar.Header` — at the header's end while expanded, a small round button on the rail's edge while
compact (the default for a branded rail); `Sidebar.Toggle` (`variant="item"`) in `Sidebar.Footer` when
the rail has no brand header. On phones neither replaces `AppHeader.MenuButton` that
opens the off-canvas Sidebar (`open` / `onOpenChange`). The bar at the top of the panel (where you are,
⌘K search, a few app actions) is `AppHeader`; the page's own heading and actions are `PageContent`, its
data tools `PageToolbar`. Use `PageToolbar` when a page has several tools above its data — sections,
search and filters, a view switch, an action — and they must rearrange on a phone; one search or one
filter above a single table goes into the DataTable `toolbar` instead. Sections of a long rail → `Sidebar.Group
collapsible`; a section with sub-pages → `Sidebar.Sub`; the signed-in user → `Sidebar.Account` in a
`Dropdown.Trigger` at the bottom of `Sidebar.Footer`.

## 3. Pairs that are easy to confuse

| Pair | Rule |
|---|---|
| Tabs / SegmentedControl | Tabs switch **panels of content** (navigation inside a screen). SegmentedControl switches a **value or mode** of the same content (period, view mode, filter). |
| Modal / Drawer / Popover / Tooltip | Modal: blocking decision or a short form (≤ 4 fields) that needs full attention. Drawer: long form, filters, record details while keeping page context. Popover: small non-modal panel anchored to a control (quick edit, explanation with a link). Tooltip: a few words naming or explaining a control, no interactive content. |
| Select / NativeSelect | Select: the kit's floating list — icons, descriptions, groups, search, `multiple`, `clearable`. NativeSelect: a plain text list where the OS picker is better (phones) or the value must post with a form by `name`. |
| Select / Dropdown / CommandMenu / TagSelect | Select picks a **value** for a field (form data). Dropdown runs **actions** (Edit, Duplicate, Delete). CommandMenu searches commands and pages across the app — it is not a field. TagSelect picks **several values** as tags. |
| SmartFilter / Select in a toolbar | One field with a few options → SegmentedControl or Select in the table toolbar. Several fields, search, include / exclude → SmartFilter. |
| Badge / Button | A badge labels or holds a value (status, filter, keyword): `onRemove` drops it, `onPress` toggles it. A command (save, open, go) is always a Button. |
| Banner / Notification / Hint | Banner: persistent message in the page flow about a page/section state (sync failed, trial ends). Notification: transient toast about the result of an action (saved, failed). Hint / `error`: help or validation text under one field. |
| Button / LinkButton | Button does something (submit, open, delete). LinkButton goes somewhere (a URL, «Подробнее», «Все заказы»). |
| Checkbox / Switch / Radio | Checkbox: choice submitted later with a button, can be multiple. Switch: on/off that applies at once (no Save button). Radio: one of several, submitted later. A privacy toggle inside a create form that is submitted → Checkbox. |
| Card / plain section | Card for a bounded block of related content that stands out (metric, settings panel, side facts). A page section that is the only thing in its region needs no card: a `title-m` heading and the content. Never wrap a single field, a DataTable or a whole page in a Card. |
| EmptyPage / empty DataTable | Empty table (no rows yet or nothing matches the filter): the DataTable `empty` prop — headers and toolbar stay. Whole page or region with no data at all (first run): EmptyPage with one action. |
| Accordion / Tabs | Accordion when the user may need several sections open or reads them in order (FAQ, settings groups). Tabs when sections are alternatives viewed one at a time. |
| Divider / gap | Divider inside a block between rows or a form and its footer. Between blocks and groups use air (`gap`), not lines. |
| Breadcrumb / back button | Breadcrumb on pages below a top-level section (Счета → № 2026-0418) and deeper; not on top-level pages. A single “Back” without hierarchy → `LinkButton` or `Button.Root variant="ghost"`. |
| Pagination / infinite scroll | Pages for tables people return to or reference: DataTable `paging="pages"` (default, Pagination in the footer). `paging="infinite"` for feeds. Standalone Pagination only for lists that are not a DataTable. |
| Stepper / Tabs | Stepper for a sequential process with completion status; Tabs for non-sequential views. |
| Confirming a destructive action | Irreversible loss of work (delete a project, cancel an order) → Modal with a `tone="danger"` confirm and `closeOnOutsideClick={false}`. A row or item in a list that can be restored → delete at once, show a Notification with «Отменить». One destructive action without a list that is easy to redo by hand (clear a draft, revoke a token) → `Button.Root holdToConfirm` with the action in `onConfirm`. |
