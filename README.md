# prime-ui-kit

[![npm version](https://img.shields.io/npm/v/prime-ui-kit.svg)](https://www.npmjs.com/package/prime-ui-kit)
[![License: MIT](https://img.shields.io/npm/l/prime-ui-kit.svg)](https://github.com/esurkov1/prime-ui/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**A calm, precise React 19 UI kit for product interfaces** — admin panels, dashboards, settings, forms
and data tables. 80 components on one design contract, one API vocabulary and one set of tokens, so
every screen you build looks like it was drawn by the same hand.

- **Graphite design language.** Depth from fill, not lines — a surface ladder where every nested
  layer and every control is one lightness step off its host; a strict 4px grid; one size axis
  `xs · s · m · l · xl` where a Button, an Input and a Select of the same size line up to the pixel;
  air as hierarchy.
- **Light and dark as equals.** Full themes, WCAG AA text contrast, a focus ring that is never clipped.
- **One API everywhere.** `size`, `variant`, `tone`, `color`, `invalid/hint/error`,
  `value/onValueChange`, `checked/onCheckedChange`, `open/onOpenChange`, `labels` — the same names in
  every component, compound parts `X.Root` + `X.Part` for components with parts and a single export
  for leaves (`<Kbd>`, `<Divider>`), state in `data-*`.
- **Built from itself.** Components reuse the kit's own Button, Badge, Spinner, Icon, Checkbox,
  EmptyPage and ScrollContainer instead of private copies, so a fix in one place lands everywhere.
- **States flow, they never flip.** Controls move into their new state; a region that switches
  between loading, data, empty and error cross-fades and glides to its new height (`Crossfade`),
  and while it loads a `Skeleton` holds the shape of the coming content — so nothing on the page
  jumps.
- **Overlays that behave.** Modal, Drawer, Sheet, Popover, Dropdown, Select, Tooltip, CommandMenu and MediaViewer share
  one stack: one click or one Escape closes exactly the topmost layer, focus goes where it should.
- **Accessible by default.** Keyboard support, ARIA roles, Russian default strings for every system
  label, `prefers-reduced-motion` and `prefers-contrast` respected.
- **Docs for humans and agents.** Every component ships a full `COMPONENT.md` reference and copyable
  `examples/` inside the npm package, together with an agent skill that teaches an AI to build
  screens the way the kit's author would.

**Links:** [npm](https://www.npmjs.com/package/prime-ui-kit) ·
[Repository & issues](https://github.com/esurkov1/prime-ui/issues) ·
[Design contract](https://github.com/esurkov1/prime-ui/blob/main/docs/foundation.md)

---

## Use with AI assistants

prime-ui-kit is built to be used by coding agents (Claude Code, Cursor, Codex, …) as well as people:

1. **Install the agent skill** — it teaches the agent the design rules, the API and page recipes.
   It ships in the package: `npx prime-ui-kit skill` ([details](#install-the-skill)).
2. **The docs are already on disk.** Every component ships `COMPONENT.md` (full API, variants, states,
   a11y, mistakes) and copyable `examples/*.tsx` in `node_modules/prime-ui-kit/src/components/<name>/`,
   matching the installed version.
3. **Ask for screens in plain words** — "build an orders list with filters and a table", "review this
   page against the design system". The skill makes the agent pick kit components, apply the spacing
   scale, wire every state and run a checklist before handing the screen over.

---

## Install

```bash
npm install prime-ui-kit react react-dom date-fns
# using ColorPicker or ColorField: also react-aria-components
# or: pnpm add … · bun add …
```

| Peer dependency | Version |
|---|---|
| `react`, `react-dom` | ^19.0.0 |
| `date-fns` | ^4.0.0 |
| `react-aria-components` (optional, only for `prime-ui-kit/color-picker`) | ^1.16.0 |

The kit has no runtime dependencies, only the peers above: its icons are drawn in (from Lucide), and
`createIcon` wraps any SVG component you bring (a `lucide-react` glyph, an SVGR import). It has no
router dependency either: pass your router's
pathname to `AppShell.Template scrollResetKey` and use `asChild` for router links.

## Set up styles and theme

```tsx
import "prime-ui-kit/bundle.css"; // tokens, light and dark themes, component styles
import "prime-ui-kit/fonts.css"; // optional: Golos Text + JetBrains Mono from Google Fonts
import "prime-ui-kit/reset.css"; // optional: minimal document reset (skip if the app has its own)
import { applyTheme } from "prime-ui-kit";

applyTheme("dark"); // sets data-theme on <html> without a transition flash
```

`bundle.css` is everything the components need; it leaves the root font size to the browser.
`data-theme="light" | "dark"` also works on any wrapper, so one page can show both themes.

## Next.js (App Router)

Every JS file of the package starts with `"use client"`: importing the kit never pulls React state
into the server graph, and you need no re-export wrapper files. Import the CSS once in the root
layout and set the theme on `<html>` there; `applyTheme` is for switching it later from a client
component.

```tsx
// app/layout.tsx
import "prime-ui-kit/bundle.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
```

Build screens in your own `"use client"` files and render those from pages and layouts. A server
component itself can render only single-export components with serializable props
(`<Typography>`, `<Spinner>`, `<Skeleton>`): React does not allow dotting into a client module on the
server, so compound parts (`<Button.Root>`, `<Modal.Content>`) and any callback prop
(`onValueChange`, `renderX`) need a client file. The whole package is client code, helpers
included — call `groupMessages`, `formatMessageDate`, `applyTheme` and the hooks only from client
components.

## Quick start

```tsx
import { AppHeader, AppShell, Button, Input, PageContent, Sidebar } from "prime-ui-kit";

export function App() {
  return (
    <AppShell.Template
      fillViewport
      nav={
        <Sidebar.Root>
          <Sidebar.Content>
            <Sidebar.Item current>Clients</Sidebar.Item>
          </Sidebar.Content>
        </Sidebar.Root>
      }
      header={
        <AppHeader.Root>
          <AppHeader.Start>
            <AppHeader.Title>New client</AppHeader.Title>
          </AppHeader.Start>
        </AppHeader.Root>
      }
    >
      <PageContent.Root as="section">
        <PageContent.Body>
          <Input.Root label="Email" required hint="We will send an invitation">
            <Input.Wrapper>
              <Input.Field type="email" placeholder="name@company.ru" />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root>Invite</Button.Root>
        </PageContent.Body>
      </PageContent.Root>
    </AppShell.Template>
  );
}
```

## Rules of use

Short rules that keep code correct — for people and for AI coding assistants:

1. Import everything from the package root: `import { Button, Input } from "prime-ui-kit"`. The one
   exceptions are `import { ColorField, ColorPicker } from "prime-ui-kit/color-picker"` and the full glyph set,
   `import { BellIcon } from "prime-ui-kit/icons"`.
2. Import styles once at the app root: `prime-ui-kit/bundle.css` (plus the optional `fonts.css` and
   `reset.css`).
3. Compound components are used through parts: `<Button.Root>`, `<Modal.Root>` + `<Modal.Content>`.
   `<Button>` alone is not a component.
4. Default `size` is `m`; controls in one row share one size.
5. Style your own layout with CSS Modules and `--prime-*` tokens only — no raw px/hex, no inline styles,
   no overrides of kit classes.
6. Before using a component, read its `COMPONENT.md`; copy structure from its `examples/`.

## How the kit is designed

| Rule | In practice |
|---|---|
| Tokens only | Components read semantic variables `--prime-*` (`--prime-space-4`, `--prime-color-text-secondary`, `--prime-control-m-height`). Your own CSS uses the same tokens. |
| Fill, not lines | Surfaces stand on one ladder: the page and four nested layers, one OKLab lightness step apart, computed at build time. Light: gray page, white card, deeper layers alternate. Dark: a near-black page, every layer a step lighter. A field, chip or neutral button is one step off the layer it sits on, so nothing merges; controls have no visible outline. |
| Proximity | label → field 4–8 · tile → tile 16 · field → field 20 · block → block 24 · group → group 32 · section → section 40–48. |
| One size axis | `size` is `xs · s · m · l · xl` (28 · 32 · 36 · 40 · 48), default `m`. |
| Semantic vs decorative color | `tone` carries meaning (`danger` for destructive), `color` is a palette hue for badges, tags and avatars. |

The full contract lives in [`docs/foundation.md`](https://github.com/esurkov1/prime-ui/blob/main/docs/foundation.md).

## Components

Every link opens the full reference: anatomy, every prop with its default, every variant, states,
accessibility, examples and common mistakes.

<!-- components:start -->
### Foundations (`foundations`)

| Component | What it is for |
|---|---|
| [**Typography**](https://github.com/esurkov1/prime-ui/blob/main/src/components/typography/COMPONENT.md) | Text roles of the Golos Text type scale applied to any text element, with reading-width guidance. |

### Actions (`actions`)

| Component | What it is for |
|---|---|
| [**Button**](https://github.com/esurkov1/prime-ui/blob/main/src/components/button/COMPONENT.md) | A button for explicit actions, with variants, tones, sizes and a built-in loading state. |
| [**ButtonGroup**](https://github.com/esurkov1/prime-ui/blob/main/src/components/button-group/COMPONENT.md) | Joined buttons and toggle segments in one neutral bar. |
| [**LinkButton**](https://github.com/esurkov1/prime-ui/blob/main/src/components/link-button/COMPONENT.md) | A real link styled as a text action, sized on the control tiers. |

### Inputs (`inputs`)

| Component | What it is for |
|---|---|
| [**Input**](https://github.com/esurkov1/prime-ui/blob/main/src/components/input/COMPONENT.md) | Single-line text field with label, hint, error and slots for icons, affixes, a clear button and a counter. |
| [**Textarea**](https://github.com/esurkov1/prime-ui/blob/main/src/components/textarea/COMPONENT.md) | Multi-line text field with label, hint, error and a character counter; grows with its content by default. |
| [**DigitInput**](https://github.com/esurkov1/prime-ui/blob/main/src/components/digit-input/COMPONENT.md) | A row of square single-digit cells for a fixed-length code (OTP from SMS, PIN, pickup code), with the field label, hint and error. |
| [**FileUpload**](https://github.com/esurkov1/prime-ui/blob/main/src/components/file-upload/COMPONENT.md) | One component for every set of files a person adds: a document field, file cards, an **image gallery with a cover**, an attachment tray — `trigger` picks how files are added, `layout` how they lie, `cover` makes the first tile the cover; uploads go through a queue, the order and removals can be saved on a server. |
| [**Label**](https://github.com/esurkov1/prime-ui/blob/main/src/components/label/COMPONENT.md) | Field label (native `<label>`) with required and optional markers. |
| [**Hint**](https://github.com/esurkov1/prime-ui/blob/main/src/components/hint/COMPONENT.md) | Help text or a validation error under a field. |
| [**Fieldset**](https://github.com/esurkov1/prime-ui/blob/main/src/components/fieldset/COMPONENT.md) | A frameless group of related form fields: a native `<fieldset>` with a `title-s` legend, the form rhythm between its fields and one `disabled` for all of them. |
| [**FieldList**](https://github.com/esurkov1/prime-ui/blob/main/src/components/field-list/COMPONENT.md) | An editable list of records of one shape — invoice lines, specs, contacts, prices by period: one row per record, the column headings once above the rows, a remove button per row and an add button under them. |

### Selection (`selection`)

| Component | What it is for |
|---|---|
| [**Checkbox**](https://github.com/esurkov1/prime-ui/blob/main/src/components/checkbox/COMPONENT.md) | A checkbox for an independent yes/no choice that submits with a form: checked, indeterminate, with a hint or an error. |
| [**Radio**](https://github.com/esurkov1/prime-ui/blob/main/src/components/radio/COMPONENT.md) | Radio buttons for choosing exactly one option out of a small visible set. |
| [**Switch**](https://github.com/esurkov1/prime-ui/blob/main/src/components/switch/COMPONENT.md) | An on/off switch for a setting that takes effect immediately. |
| [**SegmentedControl**](https://github.com/esurkov1/prime-ui/blob/main/src/components/segmented-control/COMPONENT.md) | A switch between 2–5 mutually exclusive options or modes that takes effect immediately. |
| [**Slider**](https://github.com/esurkov1/prime-ui/blob/main/src/components/slider/COMPONENT.md) | A slider for picking an approximate numeric value within a range, with an optional label and value readout. |
| [**Select**](https://github.com/esurkov1/prime-ui/blob/main/src/components/select/COMPONENT.md) | A field for choosing one value (or several with `multiple`) from a closed list. |
| [**NativeSelect**](https://github.com/esurkov1/prime-ui/blob/main/src/components/native-select/COMPONENT.md) | The system `<select>` in the kit's field look: the operating system's picker opens on phones. |
| [**TagSelect**](https://github.com/esurkov1/prime-ui/blob/main/src/components/tag-select/COMPONENT.md) | A multi-value field that shows the picked values as coloured tags, filters as you type and can create new tags. |
| [**SmartFilter**](https://github.com/esurkov1/prime-ui/blob/main/src/components/smart-filter/COMPONENT.md) | The search and filter bar of lists and tables: the search first and a filter button with a panel of values and ranges, applied filters as removable tags, and a "show / hide" choice for every value. |
| [**Datepicker**](https://github.com/esurkov1/prime-ui/blob/main/src/components/datepicker/COMPONENT.md) | A calendar for picking a date or a date range: a field with a popover (`Datepicker.Root`) or an embedded panel (`Datepicker.Panel`). |
| [**ColorField**](https://github.com/esurkov1/prime-ui/blob/main/src/components/color-field/COMPONENT.md) | A form field for any color: the swatch and its hex in a field box that opens the ColorPicker in a popover. |
| [**ColorPicker**](https://github.com/esurkov1/prime-ui/blob/main/src/components/color-picker/COMPONENT.md) | Color selection: a full picker (hex field, area, channel sliders and fields, eyedropper, swatches) and `ColorPresets` for a quick color from a fixed palette. |
| [**ColorSwatches**](https://github.com/esurkov1/prime-ui/blob/main/src/components/color-swatches/COMPONENT.md) | An inline color choice: preset swatches that fill the width of a form or panel and wrap, without a popover. |

### Data display (`data-display`)

| Component | What it is for |
|---|---|
| [**Badge**](https://github.com/esurkov1/prime-ui/blob/main/src/components/badge/COMPONENT.md) | The kit's one chip: a static label for a status, category or count, a removable value or applied filter, and a pressable toggle with a hover action — in a palette color. |
| [**Avatar**](https://github.com/esurkov1/prime-ui/blob/main/src/components/avatar/COMPONENT.md) | A round photo of a person or organization with an initials or icon fallback, a presence dot and overlapping groups. |
| [**Thumbnail**](https://github.com/esurkov1/prime-ui/blob/main/src/components/thumbnail/COMPONENT.md) | A preview of an object — product, vehicle, file, cover, video — at a fixed aspect ratio, with a colored icon fallback; it can open the object or be selected. |
| [**Kbd**](https://github.com/esurkov1/prime-ui/blob/main/src/components/kbd/COMPONENT.md) | A key cap for a keyboard key or a shortcut, rendered as a native `<kbd>`. |
| [**Card**](https://github.com/esurkov1/prime-ui/blob/main/src/components/card/COMPONENT.md) | A filled surface block with structural templates for metrics, charts, lists, calls to action and covers. |
| [**DataTable**](https://github.com/esurkov1/prime-ui/blob/main/src/components/data-table/COMPONENT.md) | A data table with sorting, pages or infinite scroll, row selection, row groups, rows that open a record, a column chooser, nested rows and loading / empty / error states. |
| [**Kanban**](https://github.com/esurkov1/prime-ui/blob/main/src/components/kanban/COMPONENT.md) | A board of status columns: cards reorder within a column and move between columns by pointer, touch hold and keyboard, with announcements, WIP limits, loading and empty states and a layout that scrolls inside itself at any width. |
| [**Gantt**](https://github.com/esurkov1/prime-ui/blob/main/src/components/gantt/COMPONENT.md) | A resource or project schedule: rows of people, rooms, vehicles or tasks with bars on a day / week / month axis, edited by pointer and keyboard. |
| [**Timeline**](https://github.com/esurkov1/prime-ui/blob/main/src/components/timeline/COMPONENT.md) | An event feed: dots on a thin line, event title and date, an optional amount on the right, grouped under labels. |
| [**CodeBlock**](https://github.com/esurkov1/prime-ui/blob/main/src/components/code-block/COMPONENT.md) | A static TypeScript / TSX snippet with syntax highlighting, on a filled panel or bare inside a host. |
| [**Accordion**](https://github.com/esurkov1/prime-ui/blob/main/src/components/accordion/COMPONENT.md) | Collapsible sections: FAQ, settings groups, checkout steps. |
| [**Sparkline**](https://github.com/esurkov1/prime-ui/blob/main/src/components/sparkline/COMPONENT.md) | A small chart — a smooth line over a fading area, a bare line or bars — with its headline: the value at rest, its change and its date; any point can be scrubbed. |
| [**ChartFrame**](https://github.com/esurkov1/prime-ui/blob/main/src/components/chart-frame/COMPONENT.md) | A dashboard panel around any chart — Recharts, ECharts, visx, Chart.js or a hand-drawn SVG — with the title, a headline value, a measured plot area, a series legend, a tooltip body and a data table for screen readers. |
| [**DescriptionList**](https://github.com/esurkov1/prime-ui/blob/main/src/components/description-list/COMPONENT.md) | Read-only properties of a record: «label — value» pairs on a `<dl>` that stack by themselves where the room is narrow, with a muted dash for an empty value. |

### Messages (`messages`)

| Component | What it is for |
|---|---|
| [**Chat**](https://github.com/esurkov1/prime-ui/blob/main/src/components/chat/COMPONENT.md) | A conversation, assembled: the header with who it is with, search, pinned messages, the virtualized message list with dates, runs, selection and jumps, typing, and the Composer at the bottom. |
| [**Message**](https://github.com/esurkov1/prime-ui/blob/main/src/components/message/COMPONENT.md) | One chat message in its shell: a speech bubble, a picture or a circle, incoming or outgoing, the tail that ends a run, the time and delivery ticks in the corner, reactions, the menu, a group chat's author header, and every content kind of a messenger. |
| [**VoicePlayer**](https://github.com/esurkov1/prime-ui/blob/main/src/components/voice-player/COMPONENT.md) | A voice message player: a round play disk, a waveform that is the seek slider, and the time with the playback speed — the same player API as VideoNote. |
| [**VideoNote**](https://github.com/esurkov1/prime-ui/blob/main/src/components/video-note/COMPONENT.md) | A round video message: a still first frame with the play disk that plays with sound on a press — the same player API as VoicePlayer. |
| [**Composer**](https://github.com/esurkov1/prime-ui/blob/main/src/components/composer/COMPONENT.md) | The message input of a chat: a field that grows from one line, Enter to send, attachments, a reply / edit bar, Markdown formatting of a selection, and voice or round video messages from the same button. |
| [**Gallery**](https://github.com/esurkov1/prime-ui/blob/main/src/components/gallery/COMPONENT.md) | Photos and videos as a messenger album: one, or up to ten laid out from their aspect ratios alone, every box final before a byte loads; a tile opens the album in MediaViewer. |
| [**ChatList**](https://github.com/esurkov1/prime-ui/blob/main/src/components/chat-list/COMPONENT.md) | The conversation list of a messenger: the pane where the reader picks a dialog — avatar, name, time, the last message, counts, «печатает…» and drafts. |

### Status and loading (`status`)

| Component | What it is for |
|---|---|
| [**Banner**](https://github.com/esurkov1/prime-ui/blob/main/src/components/banner/COMPONENT.md) | Full-width in-flow message for a page, section or card: status icon, title, description, actions and dismiss. |
| [**Notification**](https://github.com/esurkov1/prime-ui/blob/main/src/components/notification/COMPONENT.md) | Pop-up toast notifications: `NotificationProvider` at the app root and `notify()` from any screen. |
| [**ProgressBar**](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-bar/COMPONENT.md) | Linear progress: one value on a native `<progress>`, `segments` that split a whole (storage by type, leads by source) with an optional legend, or a ranking of rows (top cities, a funnel). |
| [**ProgressCircle**](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-circle/COMPONENT.md) | Circular progress — the ring version of ProgressBar: one value or `segments` that split a whole, with status colors and optional content in the center. |
| [**Spinner**](https://github.com/esurkov1/prime-ui/blob/main/src/components/spinner/COMPONENT.md) | An indeterminate loading indicator: the kit ring with the share unknown — a quarter arc turning on a faint track while a request runs. |
| [**Skeleton**](https://github.com/esurkov1/prime-ui/blob/main/src/components/skeleton/COMPONENT.md) | A placeholder in the shape of the content that is loading — text lines, a control, an avatar, a block — so the layout is in place before the data arrives. |
| [**EmptyPage**](https://github.com/esurkov1/prime-ui/blob/main/src/components/empty-page/COMPONENT.md) | Empty or failed state of a page, a block or a menu: icon, title, explanation and an action — a retry for a failed load. |
| [**Crossfade**](https://github.com/esurkov1/prime-ui/blob/main/src/components/crossfade/COMPONENT.md) | A region that cross-fades between its states (loading → data → empty → error) and glides to the new height, so the page below does not jump. |
| [**VisuallyHidden**](https://github.com/esurkov1/prime-ui/blob/main/src/components/visually-hidden/COMPONENT.md) | Text that screen readers read and nobody sees: the words behind an icon, a badge or a change on the screen. |

### Navigation (`navigation`)

| Component | What it is for |
|---|---|
| [**Tabs**](https://github.com/esurkov1/prime-ui/blob/main/src/components/tabs/COMPONENT.md) | A tab bar of folder tabs for navigating between content panels of one screen: the active tab is the host's surface rising into the strip, the panel is the host's content with no frame or padding of its own. |
| [**Breadcrumb**](https://github.com/esurkov1/prime-ui/blob/main/src/components/breadcrumb/COMPONENT.md) | Breadcrumbs: the path to the current page. |
| [**Pagination**](https://github.com/esurkov1/prime-ui/blob/main/src/components/pagination/COMPONENT.md) | Page-by-page navigation: arrows, page numbers with ellipsis and a compact «3 / 12» view. |
| [**Stepper**](https://github.com/esurkov1/prime-ui/blob/main/src/components/stepper/COMPONENT.md) | Steps of a multi-step process with pending, current, completed and danger statuses. |
| [**Sidebar**](https://github.com/esurkov1/prime-ui/blob/main/src/layout/sidebar/COMPONENT.md) | App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens. |
| [**BottomNav**](https://github.com/esurkov1/prime-ui/blob/main/src/layout/bottom-nav/COMPONENT.md) | Phone navigation: a bar of 2–6 main sections at the bottom of the screen, optionally with a round action beside it. |
| [**List**](https://github.com/esurkov1/prime-ui/blob/main/src/components/list/COMPONENT.md) | A selectable navigation list of rows: the master half of a list + detail screen (conversations, tickets, mail, records). |

### Overlays (`overlays`)

| Component | What it is for |
|---|---|
| [**Tooltip**](https://github.com/esurkov1/prime-ui/blob/main/src/components/tooltip/COMPONENT.md) | A short hint that appears next to an element on hover or keyboard focus. |
| [**Popover**](https://github.com/esurkov1/prime-ui/blob/main/src/components/popover/COMPONENT.md) | A non-modal floating panel anchored to a trigger: short forms, filters, confirmations, explanations. |
| [**Dropdown**](https://github.com/esurkov1/prime-ui/blob/main/src/components/dropdown/COMPONENT.md) | A menu of actions that opens from a trigger: picking an item runs it and closes the menu. |
| [**Modal**](https://github.com/esurkov1/prime-ui/blob/main/src/components/modal/COMPONENT.md) | A dialog over the page for a short form or important text that must be finished or acknowledged before the page goes on. |
| [**ConfirmDialog**](https://github.com/esurkov1/prime-ui/blob/main/src/components/confirm-dialog/COMPONENT.md) | The confirm of a destructive or weighty action in one piece: the question, the consequence, Cancel and an action that runs its own request. |
| [**Drawer**](https://github.com/esurkov1/prime-ui/blob/main/src/components/drawer/COMPONENT.md) | A modal panel that slides in from the side: filters, forms and record details without leaving the page. |
| [**Command Menu**](https://github.com/esurkov1/prime-ui/blob/main/src/components/command-menu/COMPONENT.md) | A search palette over the page: the query filters commands and pages, Enter runs the active one. |
| [**Sheet**](https://github.com/esurkov1/prime-ui/blob/main/src/components/sheet/COMPONENT.md) | A panel raised from the bottom edge for a short task that ends by itself: pick a date, choose an action, leave a few words. |
| [**MediaViewer**](https://github.com/esurkov1/prime-ui/blob/main/src/components/media-viewer/COMPONENT.md) | A full-screen viewer of photos and videos that behaves like a native one: pages follow the finger, pictures zoom and pan with momentum, a swipe closes it, and it opens out of the thumbnail it came from. |

### Page (`page`)

| Component | What it is for |
|---|---|
| [**AppShell**](https://github.com/esurkov1/prime-ui/blob/main/src/layout/app-shell/COMPONENT.md) | The app frame: a content panel that is the page itself and a navigation rail one layer above it. |
| [**AppHeader**](https://github.com/esurkov1/prime-ui/blob/main/src/layout/app-header/COMPONENT.md) | The page's bar at the top of the app's content panel: the page title with a line of data, the page's tools and its own buttons — only what the current page needs. |
| [**PageContent**](https://github.com/esurkov1/prime-ui/blob/main/src/components/page-content/COMPONENT.md) | Page structure inside the main column: title, page actions and content blocks, titled sections and the tile grid of a dashboard; a page as high as the panel and the list + detail layout. |
| [**PageToolbar**](https://github.com/esurkov1/prime-ui/blob/main/src/components/page-toolbar/COMPONENT.md) | The panel at the top of a page — sections, filter and search, view options and the primary action — laid out from its own width: one row when wide, stacked rows when narrow, search and filter always first with the active filters under the top row. |
| [**Divider**](https://github.com/esurkov1/prime-ui/blob/main/src/components/divider/COMPONENT.md) | A hairline separator inside one surface, horizontal or vertical, with or without a label. |
| [**ScrollContainer**](https://github.com/esurkov1/prime-ui/blob/main/src/components/scroll-container/COMPONENT.md) | The kit's one scroll region: a thin scrollbar, soft edges wherever content is hidden, and correct shrinking inside flex and grid parents. |
| [**LoginForm**](https://github.com/esurkov1/prime-ui/blob/main/src/components/login-form/COMPONENT.md) | A sign-in card with a logo, title, provider buttons and a form; covers sign-in, sign-up, password reset and code confirmation. |

### Interaction (`interaction`)

| Component | What it is for |
|---|---|
| [**Dnd**](https://github.com/esurkov1/prime-ui/blob/main/src/components/dnd/COMPONENT.md) | Pointer-driven drag and drop: reorderable lists, draggable items and drop zones on one shared session, with a lifted clone, a gap where the item lands, auto-scroll, touch support and a keyboard path. |

### Infrastructure (`infrastructure`)

| Component | What it is for |
|---|---|
| [**ExampleFrame**](https://github.com/esurkov1/prime-ui/blob/main/src/components/example-frame/COMPONENT.md) | A documentation frame: live preview, source code and device width in one block. |
<!-- components:end -->

## Providers and helpers

| API | Purpose |
|---|---|
| `NotificationProvider` + `useNotifications()` | Toast queue: `notify`, `dismiss`, `dismissAll`. Place the provider once at the app root. |
| `ControlSizeProvider` | Default `size` for every control in a subtree (dense toolbars, compact forms). |
| `Tooltip.Provider` | Shared open delay for a group of tooltips. |
| `applyTheme(scheme, element?)` | Switch the theme without transition flashes. |
| `celebrate({ origin? })` | A short confetti burst for a rare milestone (a quarter closed, the first payment); draws nothing under reduced motion. |
| `getPasswordStrength(value)` | The kit's 0–4 password estimate behind `Input.Root strength`; replace it with `getStrength`. |
| `useUploadQueue({ upload, concurrency })` | The upload queue behind FileUpload `queue`: your `upload(file, { signal, onProgress })` runs a few at a time, with progress, abort on remove and retry. |
| `groupMessages`, `formatMessageDate`, `formatMessageTime`, `hueOf` | Chat data → dated runs of one author (`Chat.Messages items` runs it for you), the date and time labels, and a palette hue stable per person. |
| `formatChatTime(date, now)` | The time of a dialog's last message as `ChatList` shows it: «14:32» today, «пн» this week, «12 мар», «12.03.2025». |
| `getWaveform` | The 0…1 levels of a recorded voice message (a `Blob` or a URL) for `VoicePlayer waveform`, decoded with the Web Audio API. |
| `moveBefore(items, id, beforeId, getId)` | Applies a `Dnd` or DataTable `onReorder` to your array. |
| `matchesSmartFilter`, `resolveSmartFilterValues` | Apply a SmartFilter value to your rows. |
| `datepickerPresets`, `formatDatepickerValue` | Quick ranges and value display for `Datepicker`. |
| `chartColors` | The chart palette as CSS values for a chart library; follows the theme. |
| `useTokenValue(token)` | A length token in px for geometry CSS cannot take (SVG, canvas). |
| `<Icon name="…" />`, `createIcon(glyph)` | The kit icon set: Lucide drawings, each with a small gesture that plays when its host is hovered or pressed; `createIcon` turns any SVG icon component (a `lucide-react` glyph you install, an SVGR import) into a kit icon. |

## Docs inside the package

Each component folder ships with the package:

```
node_modules/prime-ui-kit/src/components/<name>/COMPONENT.md   full reference
node_modules/prime-ui-kit/src/components/<name>/examples/*.tsx one scenario per file, copyable
node_modules/prime-ui-kit/src/layout/<name>/…                  AppShell, AppHeader, Sidebar, BottomNav
node_modules/prime-ui-kit/dist/skill/SKILL.md                  the agent skill (see below)
```

Examples import only from `"prime-ui-kit"` and style layout with a local `examples.module.css` on
`--prime-*` tokens, so a file works as-is in your project. The same files power the playground.

## Agent skill

[`SKILL/`](https://github.com/esurkov1/prime-ui/tree/main/SKILL) teaches an AI coding agent to build UI
with the kit the way its author would: the screen-building process, the design rules in "do this" form,
the API cheat sheet, how to choose between similar components, what to do when a component is missing,
page recipes (dashboard, list with table, settings, forms, detail page, screen states, messenger, auth), anti-patterns
and a review checklist. The package ships it built as one self-contained folder,
`node_modules/prime-ui-kit/dist/skill/`: `SKILL.md`, the guides, and every component's `COMPONENT.md`
and `examples/` under `reference/` (whole screens included, as `examples/screen.tsx`), so it always
matches the installed version.

### Install the skill

After `npm install prime-ui-kit`, from the project root:

```bash
npx prime-ui-kit skill                                  # Claude Code, this project: .claude/skills/prime-ui-kit
npx prime-ui-kit skill ~/.claude/skills/prime-ui-kit    # Claude Code, all your projects
```

Commit `.claude/skills/prime-ui-kit` so the whole team gets it. The command only copies the folder
(Node built-ins, no network); a plain copy does the same:

```bash
rm -rf .claude/skills/prime-ui-kit && mkdir -p .claude/skills
cp -R node_modules/prime-ui-kit/dist/skill .claude/skills/prime-ui-kit
```

**Other agents** (Cursor, Codex, …): pass the agent's skills or rules directory
(`npx prime-ui-kit skill .cursor/skills/prime-ui-kit`), or point the agent at `SKILL.md` in the
package.

The agent picks the skill up automatically when you ask it to build or review a screen ("build a
settings page with prime-ui-kit", "check this screen against the design system"). After upgrading
the kit, run the command again: it replaces the folder with the skill of the new version.

## Package exports

| Path | Purpose |
|---|---|
| `prime-ui-kit` | The JS/TS API: every component, layout, icon, hook and helper (no CSS side effects). |
| `prime-ui-kit/color-picker` | `ColorPicker`, `ColorField` and `parseColor` — the only code on the optional peer `react-aria-components`. |
| `prime-ui-kit/icons` | The full animated glyph set as named components (`<BellIcon />`): Lucide drawings, one gesture each; only what you import is bundled. |
| `prime-ui-kit/bundle.css` | Tokens, both themes, base rules (focus ring, reduced motion) and every component's CSS. |
| `prime-ui-kit/fonts.css` | Optional: Golos Text and JetBrains Mono from Google Fonts. |
| `prime-ui-kit/reset.css` | Optional: minimal document reset. |
| `prime-ui-kit/tokens.css`, `theme-light.css`, `theme-dark.css` | The token layers alone (already inside `bundle.css`), for styling without components. |

Type definitions ship with the package.

## Development

```bash
bun install
bun run playground:dev   # docs site with every component and scenario
bun run verify           # biome, typecheck, tests (incl. docs contract), build (with the skill)
```

Contributor rules: [`CLAUDE.md`](https://github.com/esurkov1/prime-ui/blob/main/CLAUDE.md). A change to a component updates
its code, tests, examples, playground section and `COMPONENT.md` together; the docs-contract test
keeps them in sync.

## FAQ

**What is prime-ui-kit?** A React 19 component library for product interfaces (admin panels, dashboards,
settings, forms, data tables) with its own design system "Graphite", built on CSS Modules and CSS
custom properties.

**Which React version does it need?** React 19 (`react` and `react-dom` ^19) and the peer
dependency `date-fns` ^4. `react-aria-components` ^1.16 is an optional peer, needed only for
`prime-ui-kit/color-picker` (ColorPicker, ColorField).

**Does it use Tailwind?** No. Styles are CSS Modules compiled into `prime-ui-kit/bundle.css`; theming is
done with `--prime-*` CSS variables and `data-theme="light" | "dark"`.

**How do I switch to the dark theme?** Call `applyTheme("dark")` or set `data-theme="dark"` on `<html>`
or any wrapper.

**Where is the documentation for a component?** In the package: `node_modules/prime-ui-kit/src/components/<name>/COMPONENT.md`
and `…/examples/*.tsx`; on GitHub: the links in the [Components](#components) table.

**What language are the built-in strings in?** Russian. Every system string (aria labels, counters,
default texts) can be replaced through the component's `labels` prop.

**Can an AI agent build screens with it?** Yes — run `npx prime-ui-kit skill` to install the
[agent skill](#install-the-skill) shipped in the package; it teaches the agent the design rules, the
API and page recipes and points it to each component's docs.

**Does it work with Next.js App Router?** Yes — the package is marked `"use client"`; build screens
in client components and render them from server pages ([details](#nextjs-app-router)).

## License

MIT — see [`LICENSE`](https://github.com/esurkov1/prime-ui/blob/main/LICENSE). Icon drawings come from
[Lucide](https://lucide.dev) (ISC); their gestures are adapted from
[lucide-animated](https://lucide-animated.com) (MIT) — notices in
[`THIRD_PARTY_NOTICES`](https://github.com/esurkov1/prime-ui/blob/main/THIRD_PARTY_NOTICES).
