# prime-ui-kit component catalog — responsive context

Full table of all 43 components mapped to responsive layout.

**Zone shorthand:** header, sidebar, content, footer, overlay, form, inline, navigation.

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` у компонентов с осью размера, если явно не оговорено иное.

## Accordion

| | |
|---|---|
| **Purpose** | A set of expandable sections: clicking a trigger reveals content with height animation. |
| **Responsive role** | Full width on narrow viewports; replaces vertical tabs on mobile. |
| **Zones** | content, sidebar, form |
| **Scenarios** | FAQ on a landing; account settings by group; order/shipping details; knowledge-base articles; plan descriptions; navigation in a narrow sidebar. |
| **Documentation** | `../src/components/accordion/COMPONENT.md` |

## Avatar

| | |
|---|---|
| **Purpose** | Composite circular avatar: photo, fallback initials, and stacked group. |
| **Responsive role** | Scales via `size`; on mobile, show fewer items in a group. |
| **Zones** | header, content, inline, navigation |
| **Scenarios** | Profile in the header; chat avatar; colleague card; audit table; team on a landing; meeting participants. |
| **Documentation** | `../src/components/avatar/COMPONENT.md` |

## Badge

| | |
|---|---|
| **Purpose** | Compact label for status, category, or count, with optional dot and icon. |
| **Responsive role** | Always inline; on mobile you can hide text and keep only the dot or number. |
| **Zones** | header, content, inline, form |
| **Scenarios** | Tab counter; delivery stage; role in a panel; presence status; topic label; “in stock” on a card. |
| **Documentation** | `../src/components/badge/COMPONENT.md` |

## Banner

| | |
|---|---|
| **Purpose** | Announcement strip with icon, title, description, actions, and dismiss button. |
| **Responsive role** | Full width; on mobile, actions stack vertically. |
| **Zones** | header, content, form |
| **Scenarios** | Order status; deadline; onboarding/release; checkout hint; global incident; unsaved-settings reminder. |
| **Documentation** | `../src/components/banner/COMPONENT.md` |

## Breadcrumb

| | |
|---|---|
| **Purpose** | Breadcrumbs with separators and ellipsis for long paths. |
| **Responsive role** | On mobile, automatically shortens the middle; keeps first and last items. |
| **Zones** | header, content, navigation |
| **Scenarios** | Catalog path; account: orders → detail; docs with collapse; report header; non-link level; home icon. |
| **Documentation** | `../src/components/breadcrumb/COMPONENT.md` |

## Button

| | |
|---|---|
| **Purpose** | Action button with icon and loading indicator, sizes aligned. |
| **Responsive role** | On mobile use `size="l"` for touch target ≥ 44 px; `fullWidth` for block CTAs. |
| **Zones** | header, footer, content, form, overlay, navigation |
| **Scenarios** | Save in a panel; pay and retry; empty state “Get started”; form submit; card actions; bulk operations. |
| **Documentation** | `../src/components/button/COMPONENT.md` |

## ButtonGroup

| | |
|---|---|
| **Purpose** | Multiple segment buttons in one outline with shared corner radius. |
| **Responsive role** | Switch to `vertical` on narrow viewports; reduce `size` when space is tight. |
| **Zones** | header, content, form, navigation |
| **Scenarios** | Date range in analytics; formatting toolbar; plan selection; stock filter; vertical variant in a narrow column; submit/reset. |
| **Documentation** | `../src/components/button-group/COMPONENT.md` |

## Checkbox

| | |
|---|---|
| **Purpose** | Checkbox with label, hint, error, and indeterminate state. |
| **Responsive role** | Fixed size; on mobile increase spacing for touch area. |
| **Zones** | form, content, sidebar |
| **Scenarios** | Consent before payment; “select all” in a table; notification channels; privacy; “archive / mine only” filter; document approval. |
| **Documentation** | `../src/components/checkbox/COMPONENT.md` |

## CodeBlock

| | |
|---|---|
| **Purpose** | Static code snippet with syntax highlighting and light/dark themes. |
| **Responsive role** | Horizontal scroll on overflow; width 100% of container. |
| **Zones** | content, inline |
| **Scenarios** | API docs; integration examples; log/config in support; JSON request body; light/dark comparison on a landing. |
| **Documentation** | `../src/components/code-block/COMPONENT.md` |

## ColorPicker

| | |
|---|---|
| **Purpose** | Color picker: area, sliders, presets, hex input, eyedropper. |
| **Responsive role** | **Product UI:** host the panel in `Popover` (or Modal/Drawer), not inline; on narrow viewports Drawer is fine; presets flex-wrap inside the overlay. |
| **Zones** | form, overlay |
| **Scenarios** | Brand/theme; chart series; variant color; editor tools — always from a trigger into Popover. |
| **Documentation** | `../src/components/color-picker/COMPONENT.md` |

## CommandMenu

| | |
|---|---|
| **Purpose** | Command palette: modal with search and action list, keyboard navigation. |
| **Responsive role** | On mobile, full width; trigger via button instead of hotkey. |
| **Zones** | overlay, navigation, header |
| **Scenarios** | Quick jump between sections; deal actions; editor commands; order search; support with article search; media library filters. |
| **Documentation** | `../src/components/command-menu/COMPONENT.md` |

## DataTable

| | |
|---|---|
| **Purpose** | Table with sorting, pagination, sticky header and first column. |
| **Responsive role** | Horizontal scroll with `overflow-x: auto`; sticky first column; on mobile — card layout or hide secondary columns. |
| **Zones** | content |
| **Scenarios** | Warehouse and shipments; invoices and payments; wide reports; tickets with custom cells; log with infinite scroll; compact table inside a card. |
| **Documentation** | `../src/components/data-table/COMPONENT.md` |

## DashboardCard

| | |
|---|---|
| **Purpose** | KPI mini/metric cards and a section shell for charts: composable slots, semantic tokens. |
| **Responsive role** | Lay out mini/metric cards in a CSS Grid (`auto-fill`, `minmax`); section variant spans columns for charts. |
| **Zones** | content, header (metrics row) |
| **Scenarios** | Dashboard top row; lab/vitals metrics with optional sparkline; wrapping charts and tables in a titled section. |
| **Documentation** | `../src/components/dashboard-card/COMPONENT.md` |

## Datepicker

| | |
|---|---|
| **Purpose** | Calendar for single date or range with presets, time, and label. |
| **Responsive role** | **Product UI:** put `Datepicker.Shell` inside `Popover.Content` (or Modal/Drawer); popup clamps to viewport on mobile. |
| **Zones** | form, overlay |
| **Scenarios** | Booking; report period; filters; profile dates — opened from field/button, not inline on the page. |
| **Documentation** | `../src/components/datepicker/COMPONENT.md` |

## DigitInput

| | |
|---|---|
| **Purpose** | One digit per field with navigation and paste from clipboard. |
| **Responsive role** | Larger `size` on mobile for thumb input; `inputMode="numeric"` for numeric keyboard. |
| **Zones** | form, overlay |
| **Scenarios** | SMS OTP; pickup code; content PIN; large cells on tablet; pairing code; email confirmation in a wizard. |
| **Documentation** | `../src/components/digit-input/COMPONENT.md` |

## Divider

| | |
|---|---|
| **Purpose** | Horizontal or vertical divider, optionally with text or icon. |
| **Responsive role** | Toggle `orientation` when the container’s flex-direction changes. |
| **Zones** | content, sidebar, form, inline |
| **Scenarios** | Order totals; product description sections; vertical rules in a toolbar; settings sections; article card; editor panel. |
| **Documentation** | `../src/components/divider/COMPONENT.md` |

## Drawer

| | |
|---|---|
| **Purpose** | Slide-out panel with overlay, scroll lock, and focus trap. |
| **Responsive role** | Primary mobile pattern: replaces modals, sidebars, and nested panels; `position="bottom"` for bottom sheet. |
| **Zones** | overlay |
| **Scenarios** | Catalog filters on mobile; receiving on tablet; metadata on the right; bottom sheet over a map; candidate notes; invoice line drill-down. |
| **Documentation** | `../src/components/drawer/COMPONENT.md` |

## Dropdown

| | |
|---|---|
| **Purpose** | Action menu on a trigger: groups, header, dividers in a portal. |
| **Responsive role** | Auto-positioned via portal; on mobile can switch to Drawer for long lists. |
| **Zones** | header, content, form, inline, navigation |
| **Scenarios** | Task card actions; table row menu; profile/logout in header; short trigger; externally controlled `open`; text trigger. |
| **Documentation** | `../src/components/dropdown/COMPONENT.md` |

## FileUpload

| | |
|---|---|
| **Purpose** | Drag-and-drop zone and uploaded list with format badge and progress. |
| **Responsive role** | Zone is full width; on mobile drag-and-drop is less relevant — emphasize pick-file button. |
| **Zones** | form, overlay, content |
| **Scenarios** | Resume and portfolio; product photos; medical images; avatar with external button; B2B application attachments; LMS submissions. |
| **Documentation** | `../src/components/file-upload/COMPONENT.md` |

## Hint

| | |
|---|---|
| **Purpose** | Helper text under a field: neutral, error, or disabled, optionally with icon. |
| **Responsive role** | Width follows the field; on mobile avoid clipping error text. |
| **Zones** | form, inline |
| **Scenarios** | Password rules; read-only with role explanation; numeric field limit; email invite; promo error; slider hint. |
| **Documentation** | `../src/components/hint/COMPONENT.md` |

## Input

| | |
|---|---|
| **Purpose** | Single-line field with label, border, icons, and affixes. |
| **Responsive role** | `fullWidth` by default in mobile forms; `size="l"` for touch target. |
| **Zones** | header, form, content, sidebar |
| **Scenarios** | Login/contacts; address and promo; SKU in table; catalog search; amounts with currency; landing lead form. |
| **Documentation** | `../src/components/input/COMPONENT.md` |

## Kbd

| | |
|---|---|
| **Purpose** | Styled key or shortcut label. |
| **Responsive role** | Hide on mobile (no keyboard); show only from `min-width: 1024px`. |
| **Zones** | content, form, inline, overlay |
| **Scenarios** | Editor menu hotkeys; shortcuts in settings; onboarding with keys; Enter next to modal button. |
| **Documentation** | `../src/components/kbd/COMPONENT.md` |

## Label

| | |
|---|---|
| **Purpose** | Form field label with icon, required asterisk, and subtitle. |
| **Responsive role** | Size inherits from context; `Sub` wraps to a new line on narrow viewports. |
| **Zones** | form |
| **Scenarios** | Profile fields with `htmlFor`; long forms with hints; compact report filters; modal with icon and format in `Sub`. |
| **Documentation** | `../src/components/label/COMPONENT.md` |

## LinkButton

| | |
|---|---|
| **Purpose** | Link with button typography, underline on hover/focus, and sizes. |
| **Responsive role** | Inline element; on mobile increase `size` for touch target. |
| **Zones** | header, footer, content, navigation, inline |
| **Scenarios** | Nav item in header; footer links; policy in copy; compact links in a panel; integration from a card. |
| **Documentation** | `../src/components/link-button/COMPONENT.md` |

## Modal

| | |
|---|---|
| **Purpose** | Modal with backdrop, scroll lock, and focus trap. |
| **Responsive role** | On mobile prefer Drawer (bottom) for UX; on desktop centered with max-width. |
| **Zones** | overlay |
| **Scenarios** | Delete confirmation; payment step; onboarding; quick record edit; media preview; terms and consents. |
| **Documentation** | `../src/components/modal/COMPONENT.md` |

## Notification

| | |
|---|---|
| **Purpose** | Toast system on provider and portal with message queue. |
| **Responsive role** | On mobile full width at bottom; on desktop fixed width in a corner. |
| **Zones** | overlay |
| **Scenarios** | Payment success/error; co-editing; delivery status; export ready; file upload; session lost. |
| **Documentation** | `../src/components/notification/COMPONENT.md` |

## Pagination

| | |
|---|---|
| **Purpose** | Page navigation with arrows, numbers, and ellipsis. |
| **Responsive role** | Compact on mobile: arrows and current page only; `size="s"`. |
| **Zones** | content, footer |
| **Scenarios** | Product catalog; audit log; media library; multi-page lesson; API logs; compact mobile view. |
| **Documentation** | `../src/components/pagination/COMPONENT.md` |

## Popover

| | |
|---|---|
| **Purpose** | Anchor and portal panel with arbitrary content; closes on Escape and outside click. |
| **Responsive role** | On mobile switches to Drawer for heavy content; simple popover can stay. |
| **Zones** | overlay, content, form, inline |
| **Scenarios** | Term footnote; promo terms; mini settings form; application comment; contextual hint. |
| **Documentation** | `../src/components/popover/COMPONENT.md` |

## ProgressBar

| | |
|---|---|
| **Purpose** | Horizontal progress with `value`/`max` and label. |
| **Responsive role** | Stretches to full container width; compact `size` on mobile. |
| **Zones** | content, form |
| **Scenarios** | File upload; survey steps; background report build; sync jobs; “building export” card; controlled value. |
| **Documentation** | `../src/components/progress-bar/COMPONENT.md` |

## SegmentedProgressBar

| | |
|---|---|
| **Purpose** | Horizontal stacked segments with proportional weights and semantic tones (status mix, survey breakdown). |
| **Responsive role** | Full width like ProgressBar; use compact `size` on narrow viewports. |
| **Zones** | content, form, inline |
| **Scenarios** | Batch job outcomes; CI/test split; storage by category; support ticket mix; legend + bar in dashboards. |
| **Documentation** | `../src/components/segmented-progress-bar/COMPONENT.md` |

## ProgressCircle

| | |
|---|---|
| **Purpose** | Circular fraction indicator with center content. |
| **Responsive role** | Fixed size; on mobile reduce via `size` to save space. |
| **Zones** | content, inline, form |
| **Scenarios** | Backup percent; license “month N of 12”; wizard step; groups in a panel; booking slot occupancy. |
| **Documentation** | `../src/components/progress-circle/COMPONENT.md` |

## Radio

| | |
|---|---|
| **Purpose** | Radio with label, hint, and error. |
| **Responsive role** | Group switches from horizontal to vertical layout on mobile. |
| **Zones** | form, content, sidebar |
| **Scenarios** | Onboarding goal; consent with error; payment method; plan selection; delivery window; access role. |
| **Documentation** | `../src/components/radio/COMPONENT.md` |

## SegmentedControl

| | |
|---|---|
| **Purpose** | Segment group with one selected value and floating indicator. |
| **Responsive role** | On mobile shrink to `size="s"` or replace with Select/Tabs when > 4 segments. |
| **Zones** | header, content, form, navigation |
| **Scenarios** | Chart period; catalog view (grid/list); theme/UI density; board stages; document mode; compact toggle. |
| **Documentation** | `../src/components/segmented-control/COMPONENT.md` |

## Select

| | |
|---|---|
| **Purpose** | Single choice: custom combobox (default) or native `<select>` with **`native`**. |
| **Responsive role** | On mobile menu opens over content; `fullWidth` in forms; `size="l"` for touch target. |
| **Zones** | form, header, content, sidebar |
| **Scenarios** | Role/country in a form; language and timezone; shipping/currency; dashboard filter; ticket priority; environment in ops. |
| **Documentation** | `../src/components/select/COMPONENT.md` |

## Sidebar

| | |
|---|---|
| **Purpose** | Side navigation: section column, grouped items, and footer. |
| **Responsive role** | On desktop fixed side column; on mobile collapses into Drawer or hides behind hamburger. |
| **Zones** | sidebar, navigation |
| **Scenarios** | Product switching; docs with TOC; fleet/warehouse logistics; settings sections; catalog with filters; routes on NavLink. |
| **Documentation** | `../src/layout/sidebar/COMPONENT.md` |

## Slider

| | |
|---|---|
| **Purpose** | Horizontal slider with label and sizes s–xl. |
| **Responsive role** | Stretches to full container width; larger thumb on mobile via `size="l"`. |
| **Zones** | form, content, sidebar |
| **Scenarios** | Player volume; IoT brightness/color temp; target stock; layer opacity; discrete survey scale; TTS speed. |
| **Documentation** | `../src/components/slider/COMPONENT.md` |

## Stepper

| | |
|---|---|
| **Purpose** | Multi-step flow: horizontal or vertical stepper. |
| **Responsive role** | Horizontal on desktop → vertical on mobile; step text can hide, leaving numbers. |
| **Zones** | content, form, header |
| **Scenarios** | Onboarding; checkout stages; approval with error; editorial pipeline; clickable steps; CI/CD on a card. |
| **Documentation** | `../src/components/stepper/COMPONENT.md` |

## Switch

| | |
|---|---|
| **Purpose** | On/off toggle with label, hint, and error. |
| **Responsive role** | Fixed size; on mobile adequate touch target out of the box. |
| **Zones** | form, content, sidebar |
| **Scenarios** | Notification channels; contactless delivery; processing rules; reminders; size showcase; mandatory consent with error. |
| **Documentation** | `../src/components/switch/COMPONENT.md` |

## Tabs

| | |
|---|---|
| **Purpose** | Tabs: switcher list and content panels, one active. |
| **Responsive role** | Horizontal tab scroll on mobile; on narrow viewports can replace with Accordion. |
| **Zones** | content, navigation, sidebar |
| **Scenarios** | Settings: profile/security/billing; dashboard; description/specs/reviews; vertical tabs; wizard steps; landing segments. |
| **Documentation** | `../src/components/tabs/COMPONENT.md` |

## Tag

| | |
|---|---|
| **Purpose** | Compact chip with text, icon, and remove button. |
| **Responsive role** | Inline; tag groups in flex-wrap; on mobile increase spacing. |
| **Zones** | content, form, inline, header |
| **Scenarios** | Active filters as removable chips; form keywords; list labels; card tags; grouping in header; disabled tag. |
| **Documentation** | `../src/components/tag/COMPONENT.md` |

## Textarea

| | |
|---|---|
| **Purpose** | Multiline field with character counter, hint, and error. |
| **Responsive role** | `fullWidth` in mobile forms; height via `rows` or auto-resize. |
| **Zones** | form, content |
| **Scenarios** | Note to courier; student long answer; ticket problem description; lead paragraph with limit; form validation. |
| **Documentation** | `../src/components/textarea/COMPONENT.md` |

## Tooltip

| | |
|---|---|
| **Purpose** | Tooltip: delay provider, trigger, and portal content. |
| **Responsive role** | On mobile prefer Popover (tooltip without hover is poor on touch). |
| **Zones** | overlay, form, content, inline |
| **Scenarios** | “Save” button explanation; favorite icon; term in a summary; metric in a table; promo terms; empty-state hint. |
| **Documentation** | `../src/components/tooltip/COMPONENT.md` |

## Typography

| | |
|---|---|
| **Purpose** | Styled text: size scale, weight, tracking, italic, and muted tone. |
| **Responsive role** | Text size scales via `variant`; use fluid typography or change `variant` by breakpoint. |
| **Zones** | content, header, footer, inline |
| **Scenarios** | Landing with emphasis; secondary copy in account; course body text; dashboard metric tiles; order summary with nested emphasis. |
| **Documentation** | `../src/components/typography/COMPONENT.md` |
