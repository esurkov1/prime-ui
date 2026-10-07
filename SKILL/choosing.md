# Choosing a component

First pick the category by the task, then the component inside it, then check the pairs that are easy to
confuse. Links: [components.md](components.md). Whole screens: [composition.md](composition.md).

## 1. Category by task

| The user needs to… | Category |
|---|---|
| trigger an action (save, delete, go on) | Actions — Button, ButtonGroup, LinkButton |
| type a value (text, number, code, file) | Inputs — Input, Textarea, DigitInput, FileUpload, LoginForm (sign-in screens) |
| pick from options, toggle, set a range, date or color | Selection — Checkbox, Radio, Switch, SegmentedControl, Slider, Select, NativeSelect, TagSelect, SmartFilter, Datepicker, ColorPicker, ColorSwatches |
| see data: status, labels, people, objects, numbers, rows, events | Data display — Badge, Avatar, Thumbnail, Kbd, Card, DataTable, Timeline, CodeBlock |
| learn what happened or how far along it is | Feedback — Banner, Notification, ProgressBar, ProgressCircle, Spinner, EmptyPage |
| move between views, places, steps | Navigation — Tabs, Breadcrumb, Pagination, Stepper |
| see something on top of the page | Overlays — Tooltip, Popover, Dropdown, Modal, Drawer, CommandMenu |
| get the app frame and page structure | Layout — AppShell, Sidebar, PageContent, Accordion, Divider, ScrollContainer, Dnd |
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
| several of many, shown as tags, with search / creation | TagSelect (`Select multiple` when tags are not needed) |
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
Chronological events → Timeline. Code → CodeBlock.

**Feedback.** See the pair below. Progress of a single task → ProgressBar `value`; parts of a whole →
ProgressBar `segments`; compact goal / KPI ring or a ring breakdown → ProgressCircle (`value` or
`segments`). Loading with unknown progress → `loading` on the component that has it (Button, Select,
DataTable), otherwise Spinner. Nothing to show → EmptyPage.

**Overlays.** See the pairs below. Global search over commands and pages (⌘K) → CommandMenu.

**App frame.** Sidebar collapse control: `Sidebar.Toggle` (`variant="item"`) in `Sidebar.Footer` when the
rail has a footer row anyway; `Sidebar.Toggle variant="edge"` in `Sidebar.Header` for a quiet round
toggle on the rail's edge. On phones neither replaces the menu button in `AppShell.Header` that opens
the off-canvas Sidebar (`open` / `onOpenChange`).

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
| Breadcrumb / back button | Breadcrumb on pages below a top-level section (Счета → № 2026-0418) and deeper; not on top-level pages. A single “Back” without hierarchy → `LinkButton` or `Button variant="ghost"`. |
| Pagination / infinite scroll | Pages for tables people return to or reference: DataTable `paging="pages"` (default, Pagination in the footer). `paging="infinite"` for feeds. Standalone Pagination only for lists that are not a DataTable. |
| Stepper / Tabs | Stepper for a sequential process with completion status; Tabs for non-sequential views. |
| Modal confirm / undo toast | Irreversible destructive action → Modal with a `tone="danger"` confirm and `closeOnOutsideClick={false}`. Reversible action → do it, show a Notification with an undo action. |
