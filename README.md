# prime-ui-kit

[![npm version](https://img.shields.io/npm/v/prime-ui-kit.svg)](https://www.npmjs.com/package/prime-ui-kit)
[![License: MIT](https://img.shields.io/npm/l/prime-ui-kit.svg)](https://github.com/esurkov1/prime-ui/blob/main/LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**A calm, precise React 19 UI kit for product interfaces** — admin panels, dashboards, settings, forms
and data tables. 51 components on one design contract, one API vocabulary and one set of tokens, so
every screen you build looks like it was drawn by the same hand.

- **Graphite design language.** Depth from fill, not lines; a strict 4px grid; one size axis
  `xs · s · m · l · xl` where a Button, an Input and a Select of the same size line up to the pixel;
  air as hierarchy.
- **Light and dark as equals.** Full themes, WCAG AA text contrast, a focus ring that is never clipped.
- **One API everywhere.** `size`, `variant`, `tone`, `color`, `invalid/hint/error`,
  `value/onValueChange`, `checked/onCheckedChange`, `open/onOpenChange`, `labels` — the same names in
  every component, compound parts `X.Root` + `X.Part`, state in `data-*`.
- **Overlays that behave.** Modal, Drawer, Popover, Dropdown, Select, Tooltip and CommandMenu share
  one stack: one click or one Escape closes exactly the topmost layer, focus goes where it should.
- **Accessible by default.** Keyboard support, ARIA roles, Russian default strings for every system
  label, `prefers-reduced-motion` and `prefers-contrast` respected.
- **Docs for humans and agents.** Every component ships a full `COMPONENT.md` reference and copyable
  `examples/` inside the npm package; the repository adds an agent skill that teaches an AI to build
  screens the way the kit's author would.

**Links:** [npm](https://www.npmjs.com/package/prime-ui-kit) ·
[Repository & issues](https://github.com/esurkov1/prime-ui/issues) ·
[Design contract](https://github.com/esurkov1/prime-ui/blob/main/docs/foundation.md)

---

## Use with AI assistants

prime-ui-kit is built to be used by coding agents (Claude Code, Cursor, Codex, …) as well as people:

1. **Install the agent skill** — it teaches the agent the design rules, the API and page recipes:

   ```bash
   npx degit esurkov1/prime-ui/SKILL .claude/skills/prime-ui-kit
   ```

   Other agents: copy the same folder into their skills or rules directory
   ([details](#install-the-skill)).
2. **The docs are already on disk.** Every component ships `COMPONENT.md` (full API, variants, states,
   a11y, mistakes) and copyable `examples/*.tsx` in `node_modules/prime-ui-kit/src/components/<name>/`,
   matching the installed version.
3. **Ask for screens in plain words** — "build an orders list with filters and a table", "review this
   page against the design system". The skill makes the agent pick kit components, apply the spacing
   scale, wire every state and run a checklist before handing the screen over.

---

## What's new in 0.9.0

- **API v1.** One vocabulary across the kit: `size`, `variant`, `tone`, `color`, `invalid/hint/error`,
  `value/onValueChange`, `checked/onCheckedChange`, `open/onOpenChange`, `closeOnOutsideClick`,
  `closeOnEscape`, `labels`. No aliases, no deprecated props.
- **Graphite redesign.** Fill-based depth, borderless fields, lavender accent, soft badges and tags,
  full dark theme, never-clipped focus ring, one overlay stack with shared dismiss and motion rules.
- **Docs rewritten from the code.** Every component has a new `COMPONENT.md` (anatomy, every prop with
  its default, every variant, states, a11y, mistakes) and one-scenario-per-file `examples/` that the
  playground renders directly — one source for the playground, the npm package and the agent skill.
- **Agent skill rebuilt** (`SKILL/`): process, design rules, API cheat sheet, choosing guide,
  composition, page recipes, anti-slop rules and a review checklist — field-tested on real screens.
- **Docs contract test** keeps docs, examples and the playground from drifting apart.
- Kit fixes: `Popover.Trigger` keeps the child's `id` (field labels work for Datepicker and
  ColorPresets), `Card.Title` / `Card.SectionTitle` take `as` for the heading level, FileUpload `solid`
  keeps no outline on hover, more prop types exported.

## Install

```bash
npm install prime-ui-kit react react-dom react-aria-components date-fns
# or: pnpm add … · bun add …
```

| Peer dependency | Version |
|---|---|
| `react`, `react-dom` | ^19.0.0 |
| `react-aria-components` | ^1.16.0 |
| `date-fns` | ^4.0.0 |

`lucide-react` (icons) and `react-router-dom` come with the package.

## Set up styles and theme

```tsx
import "prime-ui-kit/styles.css"; // Golos Text + JetBrains Mono, reset, tokens, light and dark themes
import "prime-ui-kit/bundle.css"; // component styles
import { applyTheme } from "prime-ui-kit";

applyTheme("dark"); // sets data-theme on <html> without a transition flash
```

`data-theme="light" | "dark"` also works on any wrapper, so one page can show both themes.
Fine-grained alternatives: `prime-ui-kit/tokens.css`, `theme-light.css`, `theme-dark.css`.

## Quick start

```tsx
import { AppShell, Button, Input, PageContent, Sidebar } from "prime-ui-kit";

export function App() {
  return (
    <AppShell.Template
      fillViewport
      nav={
        <Sidebar.Root>
          <Sidebar.Content>
            <Sidebar.Item active>Clients</Sidebar.Item>
          </Sidebar.Content>
        </Sidebar.Root>
      }
    >
      <PageContent.Section>
        <PageContent.Header>
          <PageContent.Title>New client</PageContent.Title>
        </PageContent.Header>
        <PageContent.Body>
          <Input.Root label="Email" required hint="We will send an invitation">
            <Input.Wrapper>
              <Input.Field type="email" placeholder="name@company.ru" />
            </Input.Wrapper>
          </Input.Root>
          <Button.Root>Invite</Button.Root>
        </PageContent.Body>
      </PageContent.Section>
    </AppShell.Template>
  );
}
```

## Rules of use

Short rules that keep code correct — for people and for AI coding assistants:

1. Import everything from the package root: `import { Button, Input } from "prime-ui-kit"`.
2. Import styles once at the app root: `prime-ui-kit/styles.css` and `prime-ui-kit/bundle.css`.
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
| Fill, not lines | Canvas → card → field are three fills; controls have no visible outline. |
| Proximity | label → field 4–8 · field → field 20 · group → group 32 · section → section 40–48. |
| One size axis | `size` is `xs · s · m · l · xl` (28 · 32 · 36 · 40 · 48), default `m`. |
| Semantic vs decorative color | `tone` carries meaning (`danger` for destructive), `color` is a palette hue for badges, tags and avatars. |

The full contract lives in [`docs/foundation.md`](https://github.com/esurkov1/prime-ui/blob/main/docs/foundation.md).

## Components

Every link opens the full reference: anatomy, every prop with its default, every variant, states,
accessibility, examples and common mistakes.

### Actions (`actions`)

| Component | What it is for |
|---|---|
| [**Button**](https://github.com/esurkov1/prime-ui/blob/main/src/components/button/COMPONENT.md) | A button for explicit actions, with variants, tones, sizes and a built-in loading state. |
| [**ButtonGroup**](https://github.com/esurkov1/prime-ui/blob/main/src/components/button-group/COMPONENT.md) | Joined buttons and toggle segments in one neutral bar. |
| [**LinkButton**](https://github.com/esurkov1/prime-ui/blob/main/src/components/link-button/COMPONENT.md) | A real link styled as a text action, sized on the control tiers. |

### Inputs (`inputs`)

| Component | What it is for |
|---|---|
| [**Input**](https://github.com/esurkov1/prime-ui/blob/main/src/components/input/COMPONENT.md) | Single-line text field with label, hint, error and slots for icons, affixes, a badge, a clear button and a counter. |
| [**Textarea**](https://github.com/esurkov1/prime-ui/blob/main/src/components/textarea/COMPONENT.md) | Multi-line text field with label, hint, error and a character counter; grows with its content by default. |
| [**DigitInput**](https://github.com/esurkov1/prime-ui/blob/main/src/components/digit-input/COMPONENT.md) | A row of square single-digit cells for a fixed-length code (OTP from SMS, PIN, pickup code). |
| [**LoginForm**](https://github.com/esurkov1/prime-ui/blob/main/src/components/login-form/COMPONENT.md) | A sign-in card with a logo, title, provider buttons and a form; covers sign-in, sign-up, password reset and code confirmation. |
| [**FileUpload**](https://github.com/esurkov1/prime-ui/blob/main/src/components/file-upload/COMPONENT.md) | File picker zone with drag and drop, plus presentational parts for the list of selected files. |
| [**Label**](https://github.com/esurkov1/prime-ui/blob/main/src/components/label/COMPONENT.md) | Field label (native `<label>`) with required and optional markers. |
| [**Hint**](https://github.com/esurkov1/prime-ui/blob/main/src/components/hint/COMPONENT.md) | Help text or a validation error under a field. |

### Selection (`selection`)

| Component | What it is for |
|---|---|
| [**Checkbox**](https://github.com/esurkov1/prime-ui/blob/main/src/components/checkbox/COMPONENT.md) | A checkbox for an independent yes/no choice that submits with a form: checked, indeterminate, groups. |
| [**Radio**](https://github.com/esurkov1/prime-ui/blob/main/src/components/radio/COMPONENT.md) | Radio buttons for choosing exactly one option out of a small visible set. |
| [**Switch**](https://github.com/esurkov1/prime-ui/blob/main/src/components/switch/COMPONENT.md) | An on/off switch for a setting that takes effect immediately. |
| [**SegmentedControl**](https://github.com/esurkov1/prime-ui/blob/main/src/components/segmented-control/COMPONENT.md) | A switch between 2–5 mutually exclusive options or modes that takes effect immediately. |
| [**Slider**](https://github.com/esurkov1/prime-ui/blob/main/src/components/slider/COMPONENT.md) | A slider for picking an approximate numeric value within a range, with an optional label and value readout. |
| [**Select**](https://github.com/esurkov1/prime-ui/blob/main/src/components/select/COMPONENT.md) | A dropdown field for choosing one value (or several with `multiple`) from a closed list. |
| [**TagSelect**](https://github.com/esurkov1/prime-ui/blob/main/src/components/tag-select/COMPONENT.md) | A multi-select field that shows the chosen values as coloured tags, filters as you type and can create new tags. |
| [**SmartFilter**](https://github.com/esurkov1/prime-ui/blob/main/src/components/smart-filter/COMPONENT.md) | A filter bar for lists and tables: a filter button and search with a panel of values, applied filters as tags, and a show / hide choice for every value. |
| [**Datepicker**](https://github.com/esurkov1/prime-ui/blob/main/src/components/datepicker/COMPONENT.md) | A calendar for picking a date or a date range: a field with a popover (`Datepicker.Root`) or an embedded panel (`Datepicker.Panel`). |
| [**ColorPicker**](https://github.com/esurkov1/prime-ui/blob/main/src/components/color-picker/COMPONENT.md) | Color selection: a full picker (area, channel sliders, hex and channel fields, eyedropper, swatches) and `ColorPresets` for a quick color from a fixed palette. |

### Data display (`data-display`)

| Component | What it is for |
|---|---|
| [**Badge**](https://github.com/esurkov1/prime-ui/blob/main/src/components/badge/COMPONENT.md) | The kit's one chip: a status, category or count label, a removable value or applied filter, and a pressable toggle with a hover action, in a palette color. |
| [**Avatar**](https://github.com/esurkov1/prime-ui/blob/main/src/components/avatar/COMPONENT.md) | A round photo of a person or entity with an initials or icon fallback, presence dot and overlapping groups. |
| [**Kbd**](https://github.com/esurkov1/prime-ui/blob/main/src/components/kbd/COMPONENT.md) | A key cap for a keyboard key or a shortcut, rendered as a native `<kbd>`. |
| [**Card**](https://github.com/esurkov1/prime-ui/blob/main/src/components/card/COMPONENT.md) | A filled surface block with structural templates for metrics, charts, lists, calls to action and covers. |
| [**DataTable**](https://github.com/esurkov1/prime-ui/blob/main/src/components/data-table/COMPONENT.md) | A data table with sorting, pagination or infinite scroll, row selection, nested rows and loading / empty / error states. |
| [**Timeline**](https://github.com/esurkov1/prime-ui/blob/main/src/components/timeline/COMPONENT.md) | An event feed: dots on a thin line, event title and date, an optional amount on the right, grouped under labels. |
| [**CodeBlock**](https://github.com/esurkov1/prime-ui/blob/main/src/components/code-block/COMPONENT.md) | A static TypeScript / TSX snippet with syntax highlighting, on a sunken panel or bare inside a host. |

### Feedback (`feedback`)

| Component | What it is for |
|---|---|
| [**Banner**](https://github.com/esurkov1/prime-ui/blob/main/src/components/banner/COMPONENT.md) | Full-width in-flow message for a page, section or card: status icon, title, description, actions and dismiss. |
| [**Notification**](https://github.com/esurkov1/prime-ui/blob/main/src/components/notification/COMPONENT.md) | Pop-up toast notifications: `NotificationProvider` at the app root and `notify()` from any screen. |
| [**ProgressBar**](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-bar/COMPONENT.md) | Linear progress indicator on a native `<progress>` with a label, a percentage and a status color. |
| [**SegmentedProgressBar**](https://github.com/esurkov1/prime-ui/blob/main/src/components/segmented-progress-bar/COMPONENT.md) | One bar made of proportional segments: storage by type, task statuses, a funnel or quotas. |
| [**ProgressCircle**](https://github.com/esurkov1/prime-ui/blob/main/src/components/progress-circle/COMPONENT.md) | Circular progress indicator: a track, a rounded arc and optional content in the center. |
| [**EmptyPage**](https://github.com/esurkov1/prime-ui/blob/main/src/components/empty-page/COMPONENT.md) | Empty state of a page or a block: icon, title, explanation and an action. |

### Navigation (`navigation`)

| Component | What it is for |
|---|---|
| [**Tabs**](https://github.com/esurkov1/prime-ui/blob/main/src/components/tabs/COMPONENT.md) | Tabs for navigating between content panels of one screen. |
| [**Breadcrumb**](https://github.com/esurkov1/prime-ui/blob/main/src/components/breadcrumb/COMPONENT.md) | Breadcrumbs: the path to the current page. |
| [**Pagination**](https://github.com/esurkov1/prime-ui/blob/main/src/components/pagination/COMPONENT.md) | Page-by-page navigation: arrows, page numbers with ellipsis and a compact «3 / 12» view. |
| [**Stepper**](https://github.com/esurkov1/prime-ui/blob/main/src/components/stepper/COMPONENT.md) | Steps of a multi-step process with pending, active, completed and error statuses. |

### Overlays (`overlays`)

| Component | What it is for |
|---|---|
| [**Tooltip**](https://github.com/esurkov1/prime-ui/blob/main/src/components/tooltip/COMPONENT.md) | A short hint that appears next to an element on hover or keyboard focus. |
| [**Popover**](https://github.com/esurkov1/prime-ui/blob/main/src/components/popover/COMPONENT.md) | A non-modal floating panel anchored to a trigger: short forms, filters, confirmations, explanations. |
| [**Dropdown**](https://github.com/esurkov1/prime-ui/blob/main/src/components/dropdown/COMPONENT.md) | A menu of actions that opens from a trigger: groups, a profile header and destructive items. |
| [**Modal**](https://github.com/esurkov1/prime-ui/blob/main/src/components/modal/COMPONENT.md) | A dialog over the page for confirmations, short forms and important text. |
| [**Drawer**](https://github.com/esurkov1/prime-ui/blob/main/src/components/drawer/COMPONENT.md) | A modal side panel that slides in from the edge: filters, forms and record details. |
| [**CommandMenu**](https://github.com/esurkov1/prime-ui/blob/main/src/components/command-menu/COMPONENT.md) | A command palette in a dialog: a search field that filters a list of commands and pages (⌘K). |

### Layout (`layout`)

| Component | What it is for |
|---|---|
| [**AppShell**](https://github.com/esurkov1/prime-ui/blob/main/src/layout/app-shell/COMPONENT.md) | The app frame: a navigation rail on the canvas and a content panel on the surface. |
| [**Sidebar**](https://github.com/esurkov1/prime-ui/blob/main/src/layout/sidebar/COMPONENT.md) | App side navigation in three modes — expanded, compact, hidden — and an off-canvas panel on narrow screens. |
| [**PageContent**](https://github.com/esurkov1/prime-ui/blob/main/src/components/page-content/COMPONENT.md) | Page structure inside the main column: title, description, page actions and content sections. |
| [**Accordion**](https://github.com/esurkov1/prime-ui/blob/main/src/components/accordion/COMPONENT.md) | Collapsible sections: FAQ, settings groups, checkout steps. |
| [**Divider**](https://github.com/esurkov1/prime-ui/blob/main/src/components/divider/COMPONENT.md) | A hairline separator, horizontal or vertical, with or without a label. |
| [**ScrollContainer**](https://github.com/esurkov1/prime-ui/blob/main/src/components/scroll-container/COMPONENT.md) | A scroll region with the kit's thin scrollbar that shrinks correctly inside flex and grid parents. |
| [**Dnd**](https://github.com/esurkov1/prime-ui/blob/main/src/components/dnd/COMPONENT.md) | Pointer-driven drag and drop: reorderable lists, draggable items and drop zones, with touch and keyboard support. |

### Foundations (`foundations`)

| Component | What it is for |
|---|---|
| [**Typography**](https://github.com/esurkov1/prime-ui/blob/main/src/components/typography/COMPONENT.md) | Text roles of the Golos Text type scale applied to any text element, with reading-width guidance. |

### Infrastructure (`infrastructure`)

| Component | What it is for |
|---|---|
| [**ExampleFrame**](https://github.com/esurkov1/prime-ui/blob/main/src/components/example-frame/COMPONENT.md) | A documentation frame: live preview, source code and device width in one block. |

## Providers and helpers

| API | Purpose |
|---|---|
| `NotificationProvider` + `useNotifications()` | Toast queue: `notify`, `dismiss`, `dismissAll`. Place the provider once at the app root. |
| `ControlSizeProvider` | Default `size` for every control in a subtree (dense toolbars, compact forms). |
| `Tooltip.Provider` | Shared open delay for a group of tooltips. |
| `OverlayPortalLayerProvider` | Portal target for overlays rendered inside a custom layer. |
| `applyTheme(scheme, element?)` | Switch the theme without transition flashes. |
| `Icon`, `IconSearch`, `IconClose`, … | The kit icon set (built on lucide-react). |

## Docs inside the package

Each component folder ships with the package:

```
node_modules/prime-ui-kit/src/components/<name>/COMPONENT.md   full reference
node_modules/prime-ui-kit/src/components/<name>/examples/*.tsx one scenario per file, copyable
node_modules/prime-ui-kit/src/layout/{app-shell,sidebar}/…     AppShell and Sidebar
```

Examples import only from `"prime-ui-kit"` and style layout with a local `examples.module.css` on
`--prime-*` tokens, so a file works as-is in your project. The same files power the playground.

## Agent skill

[`SKILL/`](https://github.com/esurkov1/prime-ui/tree/main/SKILL) teaches an AI coding agent to build UI
with the kit the way its author would: the screen-building process, the design rules in "do this" form,
the API cheat sheet, how to choose between similar components, what to do when a component is missing,
page recipes (dashboard, list with table, settings, forms, detail page, empty state, auth), anti-patterns
and a review checklist. It links to each component's `COMPONENT.md` and `examples/` inside
`node_modules/prime-ui-kit/` instead of copying them, so the docs always match the installed version.

### Install the skill

Install the kit first (`npm install prime-ui-kit …`), then copy the skill folder from GitHub.

**Claude Code — for one project** (commit it so the whole team gets it):

```bash
npx degit esurkov1/prime-ui/SKILL .claude/skills/prime-ui-kit
```

**Claude Code — for all your projects:**

```bash
npx degit esurkov1/prime-ui/SKILL ~/.claude/skills/prime-ui-kit
```

**Other agents** (Cursor, Codex, …): copy the same folder into the agent's skills or rules directory,
or point the agent at `SKILL/SKILL.md`.

Without `degit`:

```bash
git clone --depth 1 https://github.com/esurkov1/prime-ui.git /tmp/prime-ui
cp -r /tmp/prime-ui/SKILL .claude/skills/prime-ui-kit
```

The agent picks the skill up automatically when you ask it to build or review a screen ("build a
settings page with prime-ui-kit", "check this screen against the design system"). To update it, run the same
command again with `--force` (degit) or re-copy the folder.

## Package exports

| Path | Purpose |
|---|---|
| `prime-ui-kit` | Main JS/TS API (includes global styles import). |
| `prime-ui-kit/components` | Components entry without layout extras. |
| `prime-ui-kit/styles.css` | Fonts, reset, tokens, both themes. |
| `prime-ui-kit/tokens.css`, `theme-light.css`, `theme-dark.css` | Individual layers. |
| `prime-ui-kit/bundle.css` | Component CSS for the main entry. |
| `prime-ui-kit/components.css` | Component CSS for the `components` entry. |

Type definitions ship with the package.

## Development

```bash
bun install
bun run playground:dev   # docs site with every component and scenario
bun run verify           # biome, typecheck, tests (incl. docs contract), build
```

Contributor rules: [`CLAUDE.md`](https://github.com/esurkov1/prime-ui/blob/main/CLAUDE.md). A change to a component updates
its code, tests, examples, playground section and `COMPONENT.md` together; the docs-contract test
keeps them in sync.

## FAQ

**What is prime-ui-kit?** A React 19 component library for product interfaces (admin panels, dashboards,
settings, forms, data tables) with its own design system "Graphite", built on CSS Modules and CSS
custom properties.

**Which React version does it need?** React 19 (`react` and `react-dom` ^19), plus the peer
dependencies `react-aria-components` ^1.16 and `date-fns` ^4.

**Does it use Tailwind?** No. Styles are CSS Modules compiled into `prime-ui-kit/bundle.css`; theming is
done with `--prime-*` CSS variables and `data-theme="light" | "dark"`.

**How do I switch to the dark theme?** Call `applyTheme("dark")` or set `data-theme="dark"` on `<html>`
or any wrapper.

**Where is the documentation for a component?** In the package: `node_modules/prime-ui-kit/src/components/<name>/COMPONENT.md`
and `…/examples/*.tsx`; on GitHub: the links in the [Components](#components) table.

**What language are the built-in strings in?** Russian. Every system string (aria labels, counters,
default texts) can be replaced through the component's `labels` prop.

**Can an AI agent build screens with it?** Yes — install the [agent skill](#install-the-skill); it
teaches the agent the design rules, the API and page recipes and points it to each component's docs.

## License

MIT — see [`LICENSE`](https://github.com/esurkov1/prime-ui/blob/main/LICENSE).
