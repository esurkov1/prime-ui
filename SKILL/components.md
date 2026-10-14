# Components

Index of every kit component, grouped like the playground menu — by the task the user has (the same
categories as [choosing.md](choosing.md)). Each row links to the full reference
(`COMPONENT.md`: API, variants, states, a11y, mistakes) and to copyable scenarios (`examples/`).
Paths are relative to this folder in the kit repository; in a consumer project prefix them with
`node_modules/prime-ui-kit/` instead of `../`. Whole screens built from these components are the `screen.tsx` example of
their main component, indexed in [composition.md](composition.md#screens).

<!-- components:start -->
## Foundations (`foundations`)

Text roles and icons.

| Component | Purpose | Docs |
|---|---|---|
| Typography | Text roles of the Golos Text type scale applied to any text element, with reading-width guidance. | [COMPONENT.md](../src/components/typography/COMPONENT.md) · [examples](../src/components/typography/examples/) |
| Icon | Animated glyphs: the semantic `<Icon name>` set, the full set of about 500 in `prime-ui-kit/icons`, `createIcon` for the rest; each plays a gesture when its host is hovered or pressed. | [api-contract.md](api-contract.md#icons) · [full list](../src/icon-set.ts) |

## Actions (`actions`)

Trigger an action.

| Component | Purpose | Docs |
|---|---|---|
| Button | A button for explicit actions, with variants, tones, sizes and a built-in loading state. | [COMPONENT.md](../src/components/button/COMPONENT.md) · [examples](../src/components/button/examples/) |
| ButtonGroup | Joined buttons and toggle segments in one neutral bar. | [COMPONENT.md](../src/components/button-group/COMPONENT.md) · [examples](../src/components/button-group/examples/) |
| LinkButton | A real link styled as a text action, sized on the control tiers. | [COMPONENT.md](../src/components/link-button/COMPONENT.md) · [examples](../src/components/link-button/examples/) |

## Inputs (`inputs`)

Type a value, and the field anatomy: label, hint, error.

| Component | Purpose | Docs |
|---|---|---|
| Input | Single-line text field with label, hint, error and slots for icons, affixes, a clear button and a counter. | [COMPONENT.md](../src/components/input/COMPONENT.md) · [examples](../src/components/input/examples/) |
| Textarea | Multi-line text field with label, hint, error and a character counter; grows with its content by default. | [COMPONENT.md](../src/components/textarea/COMPONENT.md) · [examples](../src/components/textarea/examples/) |
| DigitInput | A row of square single-digit cells for a fixed-length code (OTP from SMS, PIN, pickup code), with the field label, hint and error. | [COMPONENT.md](../src/components/digit-input/COMPONENT.md) · [examples](../src/components/digit-input/examples/) |
| FileUpload | One component for every set of files a person adds: a document field, file cards, an **image gallery with a cover**, an attachment tray — `trigger` picks how files are added, `layout` how they lie, `cover` makes the first tile the cover; uploads go through a queue, the order and removals can be saved on a server. | [COMPONENT.md](../src/components/file-upload/COMPONENT.md) · [examples](../src/components/file-upload/examples/) |
| Label | Field label (native `<label>`) with required and optional markers. | [COMPONENT.md](../src/components/label/COMPONENT.md) · [examples](../src/components/label/examples/) |
| Hint | Help text or a validation error under a field. | [COMPONENT.md](../src/components/hint/COMPONENT.md) · [examples](../src/components/hint/examples/) |
| Fieldset | A frameless group of related form fields: a native `<fieldset>` with a `title-s` legend, the form rhythm between its fields and one `disabled` for all of them. | [COMPONENT.md](../src/components/fieldset/COMPONENT.md) · [examples](../src/components/fieldset/examples/) |
| FieldList | An editable list of records of one shape — invoice lines, specs, contacts, prices by period: one row per record, the column headings once above the rows, a remove button per row and an add button under them. | [COMPONENT.md](../src/components/field-list/COMPONENT.md) · [examples](../src/components/field-list/examples/) |

## Selection (`selection`)

Pick from options: toggles, lists, ranges, filters, dates, colors.

| Component | Purpose | Docs |
|---|---|---|
| Checkbox | A checkbox for an independent yes/no choice that submits with a form: checked, indeterminate, with a hint or an error. | [COMPONENT.md](../src/components/checkbox/COMPONENT.md) · [examples](../src/components/checkbox/examples/) |
| Radio | Radio buttons for choosing exactly one option out of a small visible set. | [COMPONENT.md](../src/components/radio/COMPONENT.md) · [examples](../src/components/radio/examples/) |
| Switch | An on/off switch for a setting that takes effect immediately. | [COMPONENT.md](../src/components/switch/COMPONENT.md) · [examples](../src/components/switch/examples/) |
| SegmentedControl | A switch between 2–5 mutually exclusive options or modes that takes effect immediately. | [COMPONENT.md](../src/components/segmented-control/COMPONENT.md) · [examples](../src/components/segmented-control/examples/) |
| Slider | A slider for picking an approximate numeric value within a range, with an optional label and value readout. | [COMPONENT.md](../src/components/slider/COMPONENT.md) · [examples](../src/components/slider/examples/) |
| Select | A field for choosing one value (or several with `multiple`) from a closed list. | [COMPONENT.md](../src/components/select/COMPONENT.md) · [examples](../src/components/select/examples/) |
| NativeSelect | The system `<select>` in the kit's field look: the operating system's picker opens on phones. | [COMPONENT.md](../src/components/native-select/COMPONENT.md) · [examples](../src/components/native-select/examples/) |
| TagSelect | A multi-value field that shows the picked values as coloured tags, filters as you type and can create new tags. | [COMPONENT.md](../src/components/tag-select/COMPONENT.md) · [examples](../src/components/tag-select/examples/) |
| SmartFilter | The search and filter bar of lists and tables: the search first and a filter button with a panel of values and ranges, applied filters as removable tags, and a "show / hide" choice for every value. | [COMPONENT.md](../src/components/smart-filter/COMPONENT.md) · [examples](../src/components/smart-filter/examples/) |
| Datepicker | A calendar for picking a date or a date range: a field with a popover (`Datepicker.Root`) or an embedded panel (`Datepicker.Panel`). | [COMPONENT.md](../src/components/datepicker/COMPONENT.md) · [examples](../src/components/datepicker/examples/) |
| ColorField | A form field for any color: the swatch and its hex in a field box that opens the ColorPicker in a popover. | [COMPONENT.md](../src/components/color-field/COMPONENT.md) · [examples](../src/components/color-field/examples/) |
| ColorPicker | Color selection: a full picker (hex field, area, channel sliders and fields, eyedropper, swatches) and `ColorPresets` for a quick color from a fixed palette. | [COMPONENT.md](../src/components/color-picker/COMPONENT.md) · [examples](../src/components/color-picker/examples/) |
| ColorSwatches | An inline color choice: preset swatches that fill the width of a form or panel and wrap, without a popover. | [COMPONENT.md](../src/components/color-swatches/COMPONENT.md) · [examples](../src/components/color-swatches/examples/) |

## Data display (`data-display`)

Show data: labels, people, objects, cards, tables, boards, feeds, code, disclosed sections.

| Component | Purpose | Docs |
|---|---|---|
| Badge | The kit's one chip: a static label for a status, category or count, a removable value or applied filter, and a pressable toggle with a hover action — in a palette color. | [COMPONENT.md](../src/components/badge/COMPONENT.md) · [examples](../src/components/badge/examples/) |
| Avatar | A round photo of a person or organization with an initials or icon fallback, a presence dot and overlapping groups. | [COMPONENT.md](../src/components/avatar/COMPONENT.md) · [examples](../src/components/avatar/examples/) |
| Thumbnail | A preview of an object — product, vehicle, file, cover, video — at a fixed aspect ratio, with a colored icon fallback; it can open the object or be selected. | [COMPONENT.md](../src/components/thumbnail/COMPONENT.md) · [examples](../src/components/thumbnail/examples/) |
| Kbd | A key cap for a keyboard key or a shortcut, rendered as a native `<kbd>`. | [COMPONENT.md](../src/components/kbd/COMPONENT.md) · [examples](../src/components/kbd/examples/) |
| Card | A filled surface block with structural templates for metrics, charts, lists, calls to action and covers. | [COMPONENT.md](../src/components/card/COMPONENT.md) · [examples](../src/components/card/examples/) |
| DataTable | A data table with sorting, pages or infinite scroll, row selection, row groups, rows that open a record, a column chooser, nested rows and loading / empty / error states. | [COMPONENT.md](../src/components/data-table/COMPONENT.md) · [examples](../src/components/data-table/examples/) |
| Kanban | A board of status columns: cards reorder within a column and move between columns by pointer, touch hold and keyboard, with announcements, WIP limits, loading and empty states and a layout that scrolls inside itself at any width. | [COMPONENT.md](../src/components/kanban/COMPONENT.md) · [examples](../src/components/kanban/examples/) |
| Gantt | A resource or project schedule: rows of people, rooms, vehicles or tasks with bars on a day / week / month axis, edited by pointer and keyboard. | [COMPONENT.md](../src/components/gantt/COMPONENT.md) · [examples](../src/components/gantt/examples/) |
| Timeline | An event feed: dots on a thin line, event title and date, an optional amount on the right, grouped under labels. | [COMPONENT.md](../src/components/timeline/COMPONENT.md) · [examples](../src/components/timeline/examples/) |
| CodeBlock | A static TypeScript / TSX snippet with syntax highlighting, on a filled panel or bare inside a host. | [COMPONENT.md](../src/components/code-block/COMPONENT.md) · [examples](../src/components/code-block/examples/) |
| Accordion | Collapsible sections: FAQ, settings groups, checkout steps. | [COMPONENT.md](../src/components/accordion/COMPONENT.md) · [examples](../src/components/accordion/examples/) |
| Sparkline | A small chart — a smooth line over a fading area, a bare line or bars — with its headline: the value at rest, its change and its date; any point can be scrubbed. | [COMPONENT.md](../src/components/sparkline/COMPONENT.md) · [examples](../src/components/sparkline/examples/) |
| ChartFrame | A dashboard panel around any chart — Recharts, ECharts, visx, Chart.js or a hand-drawn SVG — with the title, a headline value, a measured plot area, a series legend, a tooltip body and a data table for screen readers. | [COMPONENT.md](../src/components/chart-frame/COMPONENT.md) · [examples](../src/components/chart-frame/examples/) |
| DescriptionList | Read-only properties of a record: «label — value» pairs on a `<dl>` that stack by themselves where the room is narrow, with a muted dash for an empty value. | [COMPONENT.md](../src/components/description-list/COMPONENT.md) · [examples](../src/components/description-list/examples/) |

## Messages (`messages`)

A conversation: message bubbles of every kind and the composer.

| Component | Purpose | Docs |
|---|---|---|
| Chat | A conversation, assembled: the header with who it is with, search, pinned messages, the virtualized message list with dates, runs, selection and jumps, typing, and the Composer at the bottom. | [COMPONENT.md](../src/components/chat/COMPONENT.md) · [examples](../src/components/chat/examples/) |
| Message | One chat message in its shell: a speech bubble, a picture or a circle, incoming or outgoing, the tail that ends a run, the time and delivery ticks in the corner, reactions, the menu, a group chat's author header, and every content kind of a messenger. | [COMPONENT.md](../src/components/message/COMPONENT.md) · [examples](../src/components/message/examples/) |
| VoicePlayer | A voice message player: a round play disk, a waveform that is the seek slider, and the time with the playback speed — the same player API as VideoNote. | [COMPONENT.md](../src/components/voice-player/COMPONENT.md) · [examples](../src/components/voice-player/examples/) |
| VideoNote | A round video message: a still first frame with the play disk that plays with sound on a press — the same player API as VoicePlayer. | [COMPONENT.md](../src/components/video-note/COMPONENT.md) · [examples](../src/components/video-note/examples/) |
| Composer | The message input of a chat: a field that grows from one line, Enter to send, attachments, a reply / edit bar, Markdown formatting of a selection, and voice or round video messages from the same button. | [COMPONENT.md](../src/components/composer/COMPONENT.md) · [examples](../src/components/composer/examples/) |
| Gallery | Photos and videos as a messenger album: one, or up to ten laid out from their aspect ratios alone, every box final before a byte loads; a tile opens the album in MediaViewer. | [COMPONENT.md](../src/components/gallery/COMPONENT.md) · [examples](../src/components/gallery/examples/) |
| ChatList | The conversation list of a messenger: the pane where the reader picks a dialog — avatar, name, time, the last message, counts, «печатает…» and drafts. | [COMPONENT.md](../src/components/chat-list/COMPONENT.md) · [examples](../src/components/chat-list/examples/) |

## Status and loading (`status`)

Say what happens: system messages, progress, loading placeholders, state swaps, empty states.

| Component | Purpose | Docs |
|---|---|---|
| Banner | Full-width in-flow message for a page, section or card: status icon, title, description, actions and dismiss. | [COMPONENT.md](../src/components/banner/COMPONENT.md) · [examples](../src/components/banner/examples/) |
| Notification | Pop-up toast notifications: `NotificationProvider` at the app root and `notify()` from any screen. | [COMPONENT.md](../src/components/notification/COMPONENT.md) · [examples](../src/components/notification/examples/) |
| ProgressBar | Linear progress: one value on a native `<progress>`, `segments` that split a whole (storage by type, leads by source) with an optional legend, or a ranking of rows (top cities, a funnel). | [COMPONENT.md](../src/components/progress-bar/COMPONENT.md) · [examples](../src/components/progress-bar/examples/) |
| ProgressCircle | Circular progress — the ring version of ProgressBar: one value or `segments` that split a whole, with status colors and optional content in the center. | [COMPONENT.md](../src/components/progress-circle/COMPONENT.md) · [examples](../src/components/progress-circle/examples/) |
| Spinner | An indeterminate loading indicator: the kit ring with the share unknown — a quarter arc turning on a faint track while a request runs. | [COMPONENT.md](../src/components/spinner/COMPONENT.md) · [examples](../src/components/spinner/examples/) |
| Skeleton | A placeholder in the shape of the content that is loading — text lines, a control, an avatar, a block — so the layout is in place before the data arrives. | [COMPONENT.md](../src/components/skeleton/COMPONENT.md) · [examples](../src/components/skeleton/examples/) |
| EmptyPage | Empty or failed state of a page, a block or a menu: icon, title, explanation and an action — a retry for a failed load. | [COMPONENT.md](../src/components/empty-page/COMPONENT.md) · [examples](../src/components/empty-page/examples/) |
| Crossfade | A region that cross-fades between its states (loading → data → empty → error) and glides to the new height, so the page below does not jump. | [COMPONENT.md](../src/components/crossfade/COMPONENT.md) · [examples](../src/components/crossfade/examples/) |
| VisuallyHidden | Text that screen readers read and nobody sees: the words behind an icon, a badge or a change on the screen. | [COMPONENT.md](../src/components/visually-hidden/COMPONENT.md) · [examples](../src/components/visually-hidden/examples/) |

## Navigation (`navigation`)

Move between places: app navigation (side rail, bottom bar on phones), tabs, the records of a list, the path, pages, steps.

| Component | Purpose | Docs |
|---|---|---|
| Tabs | A tab bar of folder tabs for navigating between content panels of one screen: the active tab is the host's surface rising into the strip, the panel is the host's content with no frame or padding of its own. | [COMPONENT.md](../src/components/tabs/COMPONENT.md) · [examples](../src/components/tabs/examples/) |
| Breadcrumb | Breadcrumbs: the path to the current page. | [COMPONENT.md](../src/components/breadcrumb/COMPONENT.md) · [examples](../src/components/breadcrumb/examples/) |
| Pagination | Page-by-page navigation: arrows, page numbers with ellipsis and a compact «3 / 12» view. | [COMPONENT.md](../src/components/pagination/COMPONENT.md) · [examples](../src/components/pagination/examples/) |
| Stepper | Steps of a multi-step process with pending, current, completed and danger statuses. | [COMPONENT.md](../src/components/stepper/COMPONENT.md) · [examples](../src/components/stepper/examples/) |
| Sidebar | App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens. | [COMPONENT.md](../src/layout/sidebar/COMPONENT.md) · [examples](../src/layout/sidebar/examples/) |
| BottomNav | Phone navigation: a bar of 2–6 main sections at the bottom of the screen, optionally with a round action beside it. | [COMPONENT.md](../src/layout/bottom-nav/COMPONENT.md) · [examples](../src/layout/bottom-nav/examples/) |
| List | A selectable navigation list of rows: the master half of a list + detail screen (conversations, tickets, mail, records). | [COMPONENT.md](../src/components/list/COMPONENT.md) · [examples](../src/components/list/examples/) |

## Overlays (`overlays`)

Floating layers above the page, from tooltip to modal.

| Component | Purpose | Docs |
|---|---|---|
| Tooltip | A short hint that appears next to an element on hover or keyboard focus. | [COMPONENT.md](../src/components/tooltip/COMPONENT.md) · [examples](../src/components/tooltip/examples/) |
| Popover | A non-modal floating panel anchored to a trigger: short forms, filters, confirmations, explanations. | [COMPONENT.md](../src/components/popover/COMPONENT.md) · [examples](../src/components/popover/examples/) |
| Dropdown | A menu of actions that opens from a trigger: picking an item runs it and closes the menu. | [COMPONENT.md](../src/components/dropdown/COMPONENT.md) · [examples](../src/components/dropdown/examples/) |
| Modal | A dialog over the page for a short form or important text that must be finished or acknowledged before the page goes on. | [COMPONENT.md](../src/components/modal/COMPONENT.md) · [examples](../src/components/modal/examples/) |
| ConfirmDialog | The confirm of a destructive or weighty action in one piece: the question, the consequence, Cancel and an action that runs its own request. | [COMPONENT.md](../src/components/confirm-dialog/COMPONENT.md) · [examples](../src/components/confirm-dialog/examples/) |
| Drawer | A modal panel that slides in from the side: filters, forms and record details without leaving the page. | [COMPONENT.md](../src/components/drawer/COMPONENT.md) · [examples](../src/components/drawer/examples/) |
| Command Menu | A search palette over the page: the query filters commands and pages, Enter runs the active one. | [COMPONENT.md](../src/components/command-menu/COMPONENT.md) · [examples](../src/components/command-menu/examples/) |
| Sheet | A panel raised from the bottom edge for a short task that ends by itself: pick a date, choose an action, leave a few words. | [COMPONENT.md](../src/components/sheet/COMPONENT.md) · [examples](../src/components/sheet/examples/) |
| MediaViewer | A full-screen viewer of photos and videos that behaves like a native one: pages follow the finger, pictures zoom and pan with momentum, a swipe closes it, and it opens out of the thumbnail it came from. | [COMPONENT.md](../src/components/media-viewer/COMPONENT.md) · [examples](../src/components/media-viewer/examples/) |

## Page (`page`)

The frame and structure of a screen: app shell, app header, page column, page panel, separators, scroll regions, and ready-made screen blocks (sign-in).

| Component | Purpose | Docs |
|---|---|---|
| AppShell | The app frame: a content panel that is the page itself and a navigation rail one layer above it. | [COMPONENT.md](../src/layout/app-shell/COMPONENT.md) · [examples](../src/layout/app-shell/examples/) |
| AppHeader | The page's bar at the top of the app's content panel: the page title with a line of data, the page's tools and its own buttons — only what the current page needs. | [COMPONENT.md](../src/layout/app-header/COMPONENT.md) · [examples](../src/layout/app-header/examples/) |
| PageContent | Page structure inside the main column: title, page actions and content blocks, titled sections and the tile grid of a dashboard; a page as high as the panel and the list + detail layout. | [COMPONENT.md](../src/components/page-content/COMPONENT.md) · [examples](../src/components/page-content/examples/) |
| PageToolbar | The panel at the top of a page — sections, filter and search, view options and the primary action — laid out from its own width: one row when wide, stacked rows when narrow, search and filter always first with the active filters under the top row. | [COMPONENT.md](../src/components/page-toolbar/COMPONENT.md) · [examples](../src/components/page-toolbar/examples/) |
| Divider | A hairline separator inside one surface, horizontal or vertical, with or without a label. | [COMPONENT.md](../src/components/divider/COMPONENT.md) · [examples](../src/components/divider/examples/) |
| ScrollContainer | The kit's one scroll region: a thin scrollbar, soft edges wherever content is hidden, and correct shrinking inside flex and grid parents. | [COMPONENT.md](../src/components/scroll-container/COMPONENT.md) · [examples](../src/components/scroll-container/examples/) |
| LoginForm | A sign-in card with a logo, title, provider buttons and a form; covers sign-in, sign-up, password reset and code confirmation. | [COMPONENT.md](../src/components/login-form/COMPONENT.md) · [examples](../src/components/login-form/examples/) |

## Interaction (`interaction`)

Direct manipulation: drag and drop (Kanban builds a board on it).

| Component | Purpose | Docs |
|---|---|---|
| Dnd | Pointer-driven drag and drop: reorderable lists, draggable items and drop zones on one shared session, with a lifted clone, a gap where the item lands, auto-scroll, touch support and a keyboard path. | [COMPONENT.md](../src/components/dnd/COMPONENT.md) · [examples](../src/components/dnd/examples/) |

## Infrastructure (`infrastructure`)

Docs tooling, not product UI.

| Component | Purpose | Docs |
|---|---|---|
| ExampleFrame | A documentation frame: live preview, source code and device width in one block. | [COMPONENT.md](../src/components/example-frame/COMPONENT.md) · [examples](../src/components/example-frame/examples/) |
<!-- components:end -->
