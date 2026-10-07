# Choosing a component

First pick the category by the task, then the component inside it, then check the pairs that are easy to
confuse. Links: [components.md](components.md).

## 1. Category by task

| The user needs to… | Category |
|---|---|
| trigger an action (save, delete, go on) | Actions — Button, ButtonGroup, LinkButton |
| type a value (text, number, code, file) | Inputs — Input, Textarea, DigitInput, FileUpload, LoginForm (sign-in screens) |
| pick from options, toggle, set a range, date or color | Selection — Checkbox, Radio, Switch, SegmentedControl, Slider, Select, TagSelect, Datepicker, ColorPicker |
| see data: status, labels, people, numbers, rows, events | Data display — Badge, Tag, Avatar, Kbd, Card, DataTable, Timeline, CodeBlock |
| learn what happened or how far along it is | Feedback — Banner, Notification, ProgressBar, SegmentedProgressBar, ProgressCircle, EmptyPage |
| move between views, places, steps | Navigation — Tabs, Breadcrumb, Pagination, Stepper |
| see something on top of the page | Overlays — Tooltip, Popover, Dropdown, Modal, Drawer, CommandMenu |
| get the app frame and page structure | Layout — AppShell, Sidebar, PageContent, Accordion, Divider, ScrollContainer, Dnd |
| style text | Foundations — Typography |

## 2. Inside a category

**Actions.** One command → `Button.Root`. Several joined commands or toggles in one bar (editor
toolbar, view switch with `pressed`) → `ButtonGroup`. Navigation to a URL that should look like text →
`LinkButton.Root` (it is an `<a>`); a URL that should look like a button → `Button.Root asChild` with `<a>`.

**Text input.** One line → Input. Several lines → Textarea. Fixed-length code (OTP, PIN) → DigitInput.
Files → FileUpload. A sign-in, sign-up or password-reset screen → LoginForm. Number with unit → Input with `Input.InlineAffix`. Search in a toolbar → Input
with `Input.Icon` + `type="search"`.

**Selection.**

| Situation | Component |
|---|---|
| one independent yes/no that is submitted with a form | Checkbox |
| one setting that applies immediately | Switch |
| exactly one of 2–5 visible options in a form | Radio |
| exactly one of 2–5 modes that change the view right now | SegmentedControl |
| one of many (> 5) or a long list | Select |
| several of many, shown as tags, with search / creation | TagSelect (`Select multiple` when tags are not needed) |
| an approximate number in a range | Slider (exact number → Input) |
| a date or a period | Datepicker |
| a color | ColorPicker (free color) / ColorPresets (fixed palette) |

**Data.** Static status or count → Badge. Removable value or applied filter → Tag. Person → Avatar.
Keyboard shortcut → Kbd. One block of related numbers/content → Card (pick the template). Rows with
columns, sorting, selection → DataTable. Chronological events → Timeline. Code → CodeBlock.

**Feedback.** See the pair below. Progress of a single task → ProgressBar; parts of a whole →
SegmentedProgressBar; compact goal / KPI ring → ProgressCircle. Nothing to show → EmptyPage.

**Overlays.** See the pair below. Global search / commands (⌘K) → CommandMenu.

## 3. Pairs that are easy to confuse

| Pair | Rule |
|---|---|
| Tabs / SegmentedControl | Tabs switch **panels of content** (navigation inside a screen, underline). SegmentedControl switches a **value or mode** of the same content (period, view mode, filter). |
| Modal / Drawer / Popover / Tooltip | Modal: blocking decision or a short form that needs full attention. Drawer: long form, filters, record details while keeping page context; side panel. Popover: small non-modal panel anchored to a control (quick edit, filter, explanation with a link). Tooltip: a few words naming or explaining a control, no interactive content. |
| Select / Dropdown / CommandMenu / TagSelect | Select picks a **value** for a field (form data). Dropdown runs **actions** (Edit, Duplicate, Delete). CommandMenu searches commands and pages across the app. TagSelect picks **several values** as tags. |
| Badge / Tag | Badge is a read-only label (status, count). Tag is a value the user added or can remove (filter, keyword, selected option). |
| Banner / Notification / Hint | Banner: persistent message in the page flow about a page/section state (trial ends, maintenance). Notification: transient toast about the result of an action (saved, failed). Hint: help or validation text under one field. |
| Button / LinkButton | Button does something (submit, open, delete). LinkButton goes somewhere (a URL, «Подробнее», «Все заказы»). |
| Checkbox / Switch / Radio | Checkbox: choice submitted later with a button, can be multiple. Switch: on/off that applies at once (no Save button). Radio: one of several, submitted later. A privacy toggle inside a create form that is submitted → Checkbox. |
| Card / plain section | Card for a bounded block of related content that stands out on the canvas (metric, panel, list). A page section with a heading inside `PageContent.Body` needs no card when it is the only thing in its region. Never wrap a single field or a whole page in a Card. |
| EmptyPage / empty DataTable | Empty table (no rows yet or nothing matches the filter): use the DataTable `empty` prop — keep headers and toolbar. Whole page / region with no data at all (first run): EmptyPage with an action. |
| Accordion / Tabs | Accordion when the user may need several sections open or reads them in order (FAQ, settings groups). Tabs when sections are alternatives viewed one at a time. |
| Divider / gap | Divider inside a block between rows or a form and its footer. Between blocks use air (`gap`), not lines. |
| Breadcrumb / back button | Breadcrumb on pages below a top-level section (Orders → order #48213) and deeper; not on top-level pages. A single “Back” without hierarchy → `LinkButton` or `Button variant="ghost"`. |
| Pagination / infinite scroll | Pagination for tables people return to or reference; `DataTable` `infiniteScroll` for feeds. |
| Stepper / Tabs | Stepper for a sequential process with completion status; Tabs for non-sequential views. |
| Modal confirm / undo toast | Irreversible destructive action → Modal with `tone="danger"` confirm and `closeOnOutsideClick={false}`. Reversible action → do it, show a Notification with an undo action. |
