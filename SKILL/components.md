# Components

Index of every kit component, grouped like the playground menu. Each row links to the full reference
(`COMPONENT.md`: API, variants, states, a11y, mistakes) and to copyable scenarios (`examples/`).
Paths are relative to this folder in the kit repository; in a consumer project prefix them with
`node_modules/prime-ui-kit/` instead of `../`. Whole screens built from these components are in
[composition.md](composition.md) and [patterns/](patterns/).

## Actions (`actions`)

Explicit actions on click.

| Component | Purpose | Docs |
|---|---|---|
| Button | A button for explicit actions, with variants, tones, sizes and a built-in loading state. | [COMPONENT.md](../src/components/button/COMPONENT.md) · [examples](../src/components/button/examples/) |
| ButtonGroup | Joined buttons and toggle segments in one neutral bar. | [COMPONENT.md](../src/components/button-group/COMPONENT.md) · [examples](../src/components/button-group/examples/) |
| LinkButton | A real link styled as a text action, sized on the control tiers. | [COMPONENT.md](../src/components/link-button/COMPONENT.md) · [examples](../src/components/link-button/examples/) |

## Inputs (`inputs`)

Typing values and field anatomy: label, hint, error.

| Component | Purpose | Docs |
|---|---|---|
| Input | Single-line text field with label, hint, error and slots for icons, affixes, a clear button and a counter. | [COMPONENT.md](../src/components/input/COMPONENT.md) · [examples](../src/components/input/examples/) |
| Textarea | Multi-line text field with label, hint, error and a character counter; grows with its content by default. | [COMPONENT.md](../src/components/textarea/COMPONENT.md) · [examples](../src/components/textarea/examples/) |
| DigitInput | A row of square single-digit cells for a fixed-length code (OTP from SMS, PIN, pickup code), with the field label, hint and error. | [COMPONENT.md](../src/components/digit-input/COMPONENT.md) · [examples](../src/components/digit-input/examples/) |
| FileUpload | A file drop zone with the field label, hint and error, plus file rows for the selected files. | [COMPONENT.md](../src/components/file-upload/COMPONENT.md) · [examples](../src/components/file-upload/examples/) |
| Label | Field label (native `<label>`) with required and optional markers. | [COMPONENT.md](../src/components/label/COMPONENT.md) · [examples](../src/components/label/examples/) |
| Hint | Help text or a validation error under a field. | [COMPONENT.md](../src/components/hint/COMPONENT.md) · [examples](../src/components/hint/examples/) |

## Selection (`selection`)

Choosing from options: toggles, lists, ranges, dates, colors.

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
| SmartFilter | A filter bar for lists and tables: a filter button and a search with a panel of values, applied filters as removable tags, and a "show / hide" choice for every value. | [COMPONENT.md](../src/components/smart-filter/COMPONENT.md) · [examples](../src/components/smart-filter/examples/) |
| Datepicker | A calendar for picking a date or a date range: a field with a popover (`Datepicker.Root`) or an embedded panel (`Datepicker.Panel`). | [COMPONENT.md](../src/components/datepicker/COMPONENT.md) · [examples](../src/components/datepicker/examples/) |
| ColorPicker | Color selection: a full picker (hex field, area, channel sliders and fields, eyedropper, swatches) and `ColorPresets` for a quick color from a fixed palette. | [COMPONENT.md](../src/components/color-picker/COMPONENT.md) · [examples](../src/components/color-picker/examples/) |
| ColorSwatches | An inline color choice: preset swatches that wrap inside a form, without a popover. | [COMPONENT.md](../src/components/color-swatches/COMPONENT.md) · [examples](../src/components/color-swatches/examples/) |

## Data display (`data-display`)

Showing data and labels: badges, tags, avatars, cards, tables, feeds, code.

| Component | Purpose | Docs |
|---|---|---|
| Badge | The kit's one chip: a static label for a status, category or count, a removable value or applied filter, and a pressable toggle with a hover action — in a palette color. | [COMPONENT.md](../src/components/badge/COMPONENT.md) · [examples](../src/components/badge/examples/) |
| Avatar | A round photo of a person or organization with an initials or icon fallback, a presence dot and overlapping groups. | [COMPONENT.md](../src/components/avatar/COMPONENT.md) · [examples](../src/components/avatar/examples/) |
| Thumbnail | A preview of an object — product, vehicle, file, cover — at a fixed aspect ratio, with a colored icon fallback. | [COMPONENT.md](../src/components/thumbnail/COMPONENT.md) · [examples](../src/components/thumbnail/examples/) |
| Kbd | A key cap for a keyboard key or a shortcut, rendered as a native `<kbd>`. | [COMPONENT.md](../src/components/kbd/COMPONENT.md) · [examples](../src/components/kbd/examples/) |
| Card | A filled surface block with structural templates for metrics, charts, lists, calls to action and covers. | [COMPONENT.md](../src/components/card/COMPONENT.md) · [examples](../src/components/card/examples/) |
| DataTable | A data table with sorting, pages or infinite scroll, row selection, nested rows and loading / empty / error states. | [COMPONENT.md](../src/components/data-table/COMPONENT.md) · [examples](../src/components/data-table/examples/) |
| Kanban | A board of status columns: cards move by drag, touch hold and Alt + arrows, with WIP limits, loading and empty columns. | [COMPONENT.md](../src/components/kanban/COMPONENT.md) · [examples](../src/components/kanban/examples/) |
| Timeline | An event feed: dots on a thin line, event title and date, an optional amount on the right, grouped under labels. | [COMPONENT.md](../src/components/timeline/COMPONENT.md) · [examples](../src/components/timeline/examples/) |
| CodeBlock | A static TypeScript / TSX snippet with syntax highlighting, on a sunken panel or bare inside a host. | [COMPONENT.md](../src/components/code-block/COMPONENT.md) · [examples](../src/components/code-block/examples/) |

## Feedback (`feedback`)

System messages, progress, loading placeholders and empty states.

| Component | Purpose | Docs |
|---|---|---|
| Banner | Full-width in-flow message for a page, section or card: status icon, title, description, actions and dismiss. | [COMPONENT.md](../src/components/banner/COMPONENT.md) · [examples](../src/components/banner/examples/) |
| Notification | Pop-up toast notifications: `NotificationProvider` at the app root and `notify()` from any screen. | [COMPONENT.md](../src/components/notification/COMPONENT.md) · [examples](../src/components/notification/examples/) |
| ProgressBar | Linear progress: one value on a native `<progress>`, or `segments` that split a whole (storage by type, task statuses), with a label, a percentage and status colors. | [COMPONENT.md](../src/components/progress-bar/COMPONENT.md) · [examples](../src/components/progress-bar/examples/) |
| ProgressCircle | Circular progress — the ring version of ProgressBar: one value or `segments` that split a whole, with status colors and optional content in the center. | [COMPONENT.md](../src/components/progress-circle/COMPONENT.md) · [examples](../src/components/progress-circle/examples/) |
| Spinner | An indeterminate loading indicator: a ring with a gap that turns while a request runs. | [COMPONENT.md](../src/components/spinner/COMPONENT.md) · [examples](../src/components/spinner/examples/) |
| Skeleton | A placeholder in the shape of the content that is loading — text lines, a control, an avatar, a block — so the layout is in place before the data arrives. | [COMPONENT.md](../src/components/skeleton/COMPONENT.md) · [examples](../src/components/skeleton/examples/) |
| EmptyPage | Empty state of a page, a block or a menu: icon, title, explanation and an action. | [COMPONENT.md](../src/components/empty-page/COMPONENT.md) · [examples](../src/components/empty-page/examples/) |
| Crossfade | A region that cross-fades between its states (loading → data → empty → error) and glides to the new height, so the page below does not jump. | [COMPONENT.md](../src/components/crossfade/COMPONENT.md) · [examples](../src/components/crossfade/examples/) |

## Navigation (`navigation`)

Moving between views, places and steps.

| Component | Purpose | Docs |
|---|---|---|
| Tabs | Tabs for navigating between content panels of one screen. | [COMPONENT.md](../src/components/tabs/COMPONENT.md) · [examples](../src/components/tabs/examples/) |
| Breadcrumb | Breadcrumbs: the path to the current page. | [COMPONENT.md](../src/components/breadcrumb/COMPONENT.md) · [examples](../src/components/breadcrumb/examples/) |
| Pagination | Page-by-page navigation: arrows, page numbers with ellipsis and a compact «3 / 12» view. | [COMPONENT.md](../src/components/pagination/COMPONENT.md) · [examples](../src/components/pagination/examples/) |
| Stepper | Steps of a multi-step process with pending, active, completed and danger statuses. | [COMPONENT.md](../src/components/stepper/COMPONENT.md) · [examples](../src/components/stepper/examples/) |

## Overlays (`overlays`)

Floating layers above the page, from tooltip to modal.

| Component | Purpose | Docs |
|---|---|---|
| Tooltip | A short hint that appears next to an element on hover or keyboard focus. | [COMPONENT.md](../src/components/tooltip/COMPONENT.md) · [examples](../src/components/tooltip/examples/) |
| Popover | A non-modal floating panel anchored to a trigger: short forms, filters, confirmations, explanations. | [COMPONENT.md](../src/components/popover/COMPONENT.md) · [examples](../src/components/popover/examples/) |
| Dropdown | A menu of actions that opens from a trigger: picking an item runs it and closes the menu. | [COMPONENT.md](../src/components/dropdown/COMPONENT.md) · [examples](../src/components/dropdown/examples/) |
| Modal | A dialog over the page for confirmations, short forms and important text. | [COMPONENT.md](../src/components/modal/COMPONENT.md) · [examples](../src/components/modal/examples/) |
| Drawer | A modal side panel that slides in from the edge: filters, forms and record details. | [COMPONENT.md](../src/components/drawer/COMPONENT.md) · [examples](../src/components/drawer/examples/) |
| CommandMenu | A search palette over the page: the query filters commands and pages, Enter runs the active one. | [COMPONENT.md](../src/components/command-menu/COMPONENT.md) · [examples](../src/components/command-menu/examples/) |

## Layout (`layout`)

App frame, page regions, disclosure, separators, scrolling, drag and drop.

| Component | Purpose | Docs |
|---|---|---|
| AppShell | The app frame: a navigation rail on the canvas and a content panel on the surface. | [COMPONENT.md](../src/layout/app-shell/COMPONENT.md) · [examples](../src/layout/app-shell/examples/) |
| Sidebar | App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens. | [COMPONENT.md](../src/layout/sidebar/COMPONENT.md) · [examples](../src/layout/sidebar/examples/) |
| BottomNav | Phone navigation: 3–5 sections at the bottom, flat or a floating glass capsule, icons with or without labels. | [COMPONENT.md](../src/layout/bottom-nav/COMPONENT.md) · [examples](../src/layout/bottom-nav/examples/) |
| PageContent | Page structure inside the main column: title, description, page actions and content sections. | [COMPONENT.md](../src/components/page-content/COMPONENT.md) · [examples](../src/components/page-content/examples/) |
| PageToolbar | The panel at the top of a page — sections, filter and search, view options and the primary action — laid out from its own width: one row when wide, exactly two rows when narrow, every slot in a fixed place. | [COMPONENT.md](../src/components/page-toolbar/COMPONENT.md) · [examples](../src/components/page-toolbar/examples/) |
| Accordion | Collapsible sections: FAQ, settings groups, checkout steps. | [COMPONENT.md](../src/components/accordion/COMPONENT.md) · [examples](../src/components/accordion/examples/) |
| Divider | A hairline separator inside one surface, horizontal or vertical, with or without a label. | [COMPONENT.md](../src/components/divider/COMPONENT.md) · [examples](../src/components/divider/examples/) |
| ScrollContainer | A scroll region with the kit's thin scrollbar that shrinks correctly inside flex and grid parents. | [COMPONENT.md](../src/components/scroll-container/COMPONENT.md) · [examples](../src/components/scroll-container/examples/) |
| Dnd | Pointer-driven drag and drop: reorderable lists, draggable items and drop zones, with touch and keyboard support. | [COMPONENT.md](../src/components/dnd/COMPONENT.md) · [examples](../src/components/dnd/examples/) |

## Composition (`composition`)

Ready-made screen blocks; whole screens are in [composition.md](composition.md) and [patterns/](patterns/).

| Component | Purpose | Docs |
|---|---|---|
| LoginForm | A sign-in card with a logo, title, provider buttons and a form; covers sign-in, sign-up, password reset and code confirmation. | [COMPONENT.md](../src/components/login-form/COMPONENT.md) · [examples](../src/components/login-form/examples/) |

## Foundations (`foundations`)

Text roles.

| Component | Purpose | Docs |
|---|---|---|
| Typography | Text roles of the Golos Text type scale applied to any text element, with reading-width guidance. | [COMPONENT.md](../src/components/typography/COMPONENT.md) · [examples](../src/components/typography/examples/) |

## Infrastructure (`infrastructure`)

Docs tooling, not product UI.

| Component | Purpose | Docs |
|---|---|---|
| ExampleFrame | A documentation frame: live preview, source code and device width in one block. | [COMPONENT.md](../src/components/example-frame/COMPONENT.md) · [examples](../src/components/example-frame/examples/) |
