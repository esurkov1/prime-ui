# prime-ui-kit

React 19 UI kit (npm package `prime-ui-kit`) for building product interfaces: admin panels, dashboards,
settings, forms, tables. Design language "Graphite": depth from fill, not lines; 4px grid; one size
axis `xs–xl` (default `m`); air as hierarchy. Styling is CSS Modules + semantic CSS variables
(`--prime-*`), behaviour and a11y partly on `react-aria-components`. TypeScript, ESM, light + dark themes.

Consumers install it from npm and build screens from its components. An agent skill (`SKILL/`) teaches
other agents to build UI with the kit the way its author would.

## Sources of truth (higher wins)

1. `docs/foundation.md` — design contract and API v1 (§10). Do not change it without an explicit request.
2. Code: `src/components/<dir>/*.tsx|*.module.css`, `src/layout/**`, `src/internal/**`, `src/hooks/**`,
   `src/icons/**`, `tokens/`.
3. `api.ts` per component — the one description of its API (must match the TypeScript types).
4. Examples: `src/components/<dir>/examples/*.tsx` (layout: `src/layout/<dir>/examples/`). The playground
   loads them directly — there is no separate snippet copy.
5. `playground/pageStandard.ts` — page kinds, the example slot vocabulary and slot order.
6. Docs derived from 1–5: `COMPONENT.md` per component (its API and Labels sections are generated),
   `SKILL/`, `README.md`.

Never document props, variants, tokens or scenarios that the code does not have.

## Commands

```bash
bun install
bun run playground:dev      # docs site
bun run typecheck
bun run check               # biome (check:fix to autofix)
bun run test                # vitest, incl. the docs contract
bun run docs:build          # COMPONENT.md API + Labels sections from api.ts
bun run tokens:build        # src/styles/*.css from tokens/
bun run build               # tokens + bundle + d.ts
bun run verify              # everything CI runs — must be green before a commit
bun run verify:tokens       # tokens:build shows no diff
bun run verify:docs         # docs:build shows no diff
```

## Conventions

- No backward compatibility: one name per concept, no aliases, no `@deprecated`, delete legacy and
  update every usage in the repo in the same change. Breaking API changes are allowed while v1 forms;
  behaviour, a11y, motion and visuals in both themes must not get worse.
- Code, identifiers, docs and comments in English; UI strings in Russian.
- Tokens: edit `tokens/*.ts` only, then `bun run tokens:build`; never edit `src/styles/{tokens,theme-*}.css`.
- Themes switch only via `data-theme`; components know semantic roles, never the theme.
- Styles: tokens only (no raw px/hex, no `--prime-ref-*`), state styled only from `data-*` and ARIA.
- Motion is part of the code (foundation §7): press, hover/focus fill, selection/toggle, open/close,
  enter/exit of parts, loading — or consciously still (high-frequency, keyboard). Tokens only,
  `transform`/`opacity` (+ color/fill/shadow for state), no `transition: all`, no `ease-in`, both
  directions, reduced motion honoured. One-shot appearance of parts uses `src/internal/enterMotion`.
- A11y minimum: every interactive component works from the keyboard, has explicit ARIA, a visible focus
  ring in both themes, never conveys meaning by color alone, and has keyboard tests.
- Shared internal classes are joined in TSX (`cx(fieldTierClass, styles.root)`), not chained through
  cross-file `composes`; the bundle builds with 0 CSS warnings.
- Scrolling: a component scrolls only its own scroller (`scrollTop` / `scrollLeft`); `scrollIntoView`
  only for a keyboard-moved highlight with `block: "nearest"` — it also scrolls the page.
- Biome formatting: 2 spaces, double quotes, line width 100.
- Visual taste: fills over borders, medium sizes, faint dividers; one component with modes via props
  rather than sibling components that are the same thing.

## 1. Component API

§10 of `docs/foundation.md` is the base (size, variant, tone, color, invalid/hint/error, value / checked /
open triads, dismiss, flags, focusRing, labels, structure, DOM state). These rules complete it.

**Structure**
- A component with parts is compound: `X.Root` + `X.Part`. A leaf without parts is a **single export**
  (`<Kbd>`, `<Spinner>`, `<Typography>`), never `X.Root` alone (§10). `X.Root` therefore appears only
  next to real parts.
- `X.Root` is always the outermost element and owns the state. A container of several roots is `X.Group`
  (`Radio.Group`). One level of parts only — no `X.Group.Root`.
- Part names: `Trigger` opens a layer (a slot, no DOM); `Content` is the floating layer or the disclosed
  region; `Panel` is embedded content (`Tabs.Panel`, `Datepicker.Panel`); `Item` is a member of a
  collection (not `Trigger`/`Step`); `Header` / `Body` / `Footer` are zones of a surface, `Actions` is a
  row of buttons inside a zone; `Title` heads a surface, `Label` names a control or item, `Description`
  is the secondary text (never `Sub` for text); `Count` is a number badge, `Counter` a character counter;
  `Separator` divides items; `<Action>Button` is a button the kit renders (`CloseButton`, `ClearButton`),
  `Close` is a slot around the consumer's button. A group heading is the `label` prop of `X.Group`
  (never an `X.GroupLabel` part). Optional parts of a collection item are `X.ItemIcon`, `X.ItemCount`,
  `X.ItemShortcut`, `X.ItemText`; an `X.ItemIcon` after the label is a trailing icon; a row action
  beside an item is `X.ItemAction` (`label`, `onClick`), never nested inside the item element. A
  parent item with children is `X.Sub` + `X.SubTrigger` + `X.SubContent` (a submenu). A brand block is
  `X.Brand` + `X.BrandLogo` with `description`.
- A root that draws its own separators or indicators (Breadcrumb chevrons, Stepper lines, Accordion
  chevron) has no part for them.
- Choice controls (Checkbox, Radio, Switch): the root renders the `<label>` with the input; `X.Label` is
  only the text.
- Icons go in parts (`X.Icon`, `X.ItemIcon`, `X.TriggerIcon`) — never `icon` / `leading` / `trailing` /
  `leadingIcon` props or component-type props (`icon={Comp}`). Only data passed as arrays or options
  (`notify()`, `options`) carries `icon: ReactNode`.

**Props and callbacks**
- The primary value is `value` / `defaultValue` / `onValueChange` (`checked`, `open` per §10). Any other
  stateful aspect uses the same triad: `x` / `defaultX` / `onXChange` (`sort`, `page`, `expanded`).
  The new value is always the first callback argument.
- Event names: `onSelect` activates a menu / command item; `onRemove` takes a value out of a selection;
  `onDelete` destroys an entity; `onDismiss` closes a message (Banner, Notification).
- Dismiss: every overlay takes `closeOnOutsideClick` and `closeOnEscape` (default `true`, §10).
- Selection mode: `multiple?: boolean` for one vs many (not `type`); `mode` only for structurally
  different values (Datepicker `single | range`). Mutually exclusive behaviours are one enum prop, not
  a set of booleans with impossible combinations (DataTable `paging: "pages" | "infinite" | "none"`).
  Status words: `selected` (choice), `current`
  (navigation location, `aria-current`), `pressed` (toggle button). Tone words for statuses
  (`danger`, never `error`). Flags keep §10 names (`fullWidth`, not `fillWidth`).
- Anchored layers position with `side` (`top | right | bottom | left`) and `align` (`start | center | end`).
- `color` only on the components §10 lists.
- A visible text label is `label`; a name only for assistive tech is the native `aria-label`, never
  `label`.
- `asChild?: boolean` only on single interactive elements that may become a link or another element
  (Button.Root, LinkButton, Sidebar.Item, Sidebar.Brand, Timeline.Item). `Trigger`, `Close`,
  `Confirm`, `Anchor` are always slots that clone one child and take no `className`. `as` only picks a semantic tag for non-interactive elements.
- Functions: `formatX(value)` for display, `getX(item)` for data accessors, `renderX(item)` to render a
  data item. No function-as-children.
- Arrays vs parts: children / parts for a hand-written, static set with custom content (menus, tabs,
  select items); an array prop for application data (rows, options the component filters, creates or
  reorders, segments, presets).
- Size: `size` lives on the root only; the root provides `ControlSizeProvider`, parts read size from
  context and set `data-size`. Exception: an overlay's `Content` takes `size` for its width.
  `Button.Root`, `Input.Root`, `Icon` and `Checkbox.Indicator` without `size` take the host tier from
  context (`useControlSize`), so a sized host (LoginForm, Popover, Banner) sizes its kit children. A
  control nested inside another control's row (a checkbox look in a Select option) is one tier smaller:
  `stepDown(size)` from `src/internal/states.ts`, never a local lookup table.
- Every part that renders DOM accepts `className`, its native attributes and `ref` (React 19 ref as a
  prop); an internal ref is merged with the consumer's through `useMergedRefs(a, b)` only. A field root
  sends `className`, `ref` and native attributes to the frame and `id` to the control; a leaf without a
  field frame keeps `ref` on the control. `src/test/part-refs.test.tsx` checks refs by type; a part
  whose ref is merged or redirected also gets a runtime row there. Only slots and state-only roots
  (`Modal.Root`, `Popover.Root`…) have no ref. `displayName` is `X.Part`; behaviour never depends on
  `displayName` (compare element types).
- Support row: `hint` / `error` are props on every component that has one (not `Hint` / `Error` parts).
- `labels` holds system strings and default texts (aria labels, announcements, empty texts, counters,
  default placeholders) with Russian defaults; a per-instance visible text is a prop or children.
  Values inside a label string are `{token}` templates (`"{current} из {max} символов"`) — never
  functions.

## 2. Building from the kit

The kit is built from itself. When a component needs an element the kit already has as a component,
part, icon or shared mechanic, it uses it — never its own copy. Before writing markup or CSS, check:

| Need | Use |
|---|---|
| a button (close, clear, nav arrow, retry, icon button) | `Button` (`variant="ghost"`, `Button.Icon`), `LinkButton` for links (`asChild` + `<button>` for an inline action in text) |
| a loading indicator | `Spinner` (Button / Select `loading` place it themselves) |
| a checkbox look inside an option or menu row | `Checkbox.Indicator` (no input; the row carries `aria-selected` / `aria-checked`) |
| an icon, chevron, check, sort arrow, status glyph | `<Icon name="…" />` from `src/icons` (a new glyph goes into the registry; `createIcon` makes a standalone icon) — never inline `<svg>` or direct `lucide-react` in components |
| a palette hue (`color` prop) | `src/internal/palette.module.css`: `.hue` on the element with `data-color`, CSS reads `--hue-soft` / `--hue-text` / `--hue-solid` / `--hue-solid-fg` — never a local `[data-color]` map |
| a field surface, tier or select-like trigger | `src/internal/fieldClasses.ts` (`fieldSurfaceClass`, `fieldTierClass`, `fieldTriggerClass`), joined in TSX with `cx`; hover fill token `--prime-color-field-bg-hover`; leading / trailing icon split `iconLayout` |
| a chip tier, icon box, text tone or text role | `src/internal/chipTier`, `iconBox`, `textTone`, `textRole` CSS modules |
| a chip, tag, status, count | `Badge` (`Badge.Dot`, `Badge.Action`) |
| a key hint | `Kbd` |
| a separator | `Divider` |
| a scroll region (thin bar, edge fade, hidden bar) | `ScrollContainer` (`axis`, `fade`, `scrollbar="hidden"`) |
| an empty result | `EmptyPage` (`layout="compact"` inside menus and lists) |
| a field label / support row / counter | `Label`, `Hint`, `src/internal/FieldFrame` (`useFieldFrame`, `counter`, `reserveSupportRow`, `group` for a labelled group; `FieldRootDomProps` — a field root's `ref` and native attributes go to the frame, `id` to the control; shared api rows in `src/internal/field.api.ts`) |
| a checkbox / radio / switch row (control + text + support) | `src/internal/ChoiceField` |
| a colour swatch (fill, checkerboard, check) | `src/internal/swatch` |
| menu / listbox rows, a floating panel | `src/internal/menu.module.css`, `floatingSurface.module.css`, `listbox.ts` (listbox keyboard) |
| the matched part of a label while searching | `src/internal/HighlightMatch` (`HighlightMatch`, `highlightChildren`) |
| a `{token}` label template | `src/internal/formatLabel` |
| a bounded block in an example (panel, card) | `Card` (`Card.Root` + `Card.Body`) — never a hand-drawn card in CSS |
| a person / object picture | `Avatar` / `Thumbnail`; image load state via `src/hooks/useImageStatus` |
| a table, pagination, row selection | `DataTable`, `Pagination`, `Checkbox` |
| screen-reader-only text | `src/internal/VisuallyHidden` |
| appearance of a part | `src/internal/enterMotion.module.css` (`.enter`, `.enterBase`) |
| a swap between states of a region (loading / data / empty / error) | `Crossfade` (public) or `useStateSwap` + `src/internal/swapMotion.module.css` inside a component (DataTable) |
| an action on a coloured host (solid Banner) | `Button` `tone="inherit"` (ghost / soft / outline) — never a host CSS override |
| overlay stack, dismiss, focus | `src/internal/overlay/layerStack.ts` (`useLayer`, `LayerProvider`; one stack, reasons `escape` / `outside` / `scrim`), `overlay/focus.ts`; modal layers `useModalLayer` + `useInertSiblings` + `useScrollLock`; one z-index `--prime-z-overlay` |
| an anchored floating panel (Popover, Dropdown, Tooltip, Select) | `src/internal/overlay/useFloatingLayer` + `FloatingPanel` / `FloatingTrigger`; menu groups `src/internal/MenuGroup` |
| overlay enter/exit | `overlayMotion.module.css`, `usePresence` (`motionDurationMs`, `prefersReducedMotion`) |
| anchored positioning, a CSS length in JS | `usePosition` (follows the anchor, 4 sides, `align`, arrow), `readCssLengthPx("--prime-…", fallback)` — never import `tokens/` into components |
| roving arrow-key focus | `src/internal/rovingFocus.ts` (`rovingIndex`, `gridIndex`) |
| controlled / uncontrolled state, refs | `useControllableState`, `useMergedRefs`, `slot`, `cx`, `toDataAttributes` |

- If the donor lacks a mode you need, extend the donor (with its docs, tests and example) instead of
  copying it. A reuse that needs a donor change outside your scope is reported, not hand-rolled.
- Import a donor by its module path (`@/components/badge/Badge`), never through `"prime-ui-kit"` or an
  index; no circular imports between components (shared types go to a `types.ts`).
- Configure a donor only through its public API (`size`, `variant`, `tone`, `className` on its root,
  parts) — no deep selectors into its internals. Its size comes from the host tier.
- An own copy is allowed only when the donor is semantically wrong (an `option` is not a checkbox),
  impossible (a `<button>` inside a `<button>`), or would create a cycle — say why in a one-line comment.

## 3. New components

- Allowed without approval when they serve reuse or simplification: the same element is drawn in 2+
  places with no standalone block; a large component contains a part useful elsewhere; a mode prop
  really makes two different components. Not allowed: a duplicate of an existing component (check the
  catalog and `SKILL/components.md` first) or a new product feature unrelated to optimization.
- Needed only inside the kit → an internal block in `src/internal/` (or `src/hooks/`), with a test.
  Useful to consumers or as a standalone entity to 2+ components → a public component.
- A public component goes through the full checklist (§7) and follows §1, §4–§6: code, motion, tests,
  exports, examples by slots, `api.ts`, a section config with `category` and `nav`, COMPONENT.md,
  a line in `SKILL/components.md`, `SKILL/choosing.md` if the choice between components changes, and
  `README.md` (components table and count). It replaces every copy it was made for.

## 4. Example files

One scenario per file in `examples/`, named by its slot (§5) or, for a component-specific scenario, in
kebab-case by meaning. The canon (reference: `button/`, `input/`, `modal/`, `spinner/` examples):

- Line 1: a one-line English JSDoc ending with a period, in the format
  `/** What it shows — \`prop\`, \`prop\`. */`. The backticked names are exactly the ones the page
  description of the example names.
- Exactly one `export default function <Component><Scenario>Example()` (`ButtonOverviewExample`).
- Imports: kit only from `"prime-ui-kit"`, then `import * as React from "react"` (only this form) when
  hooks are needed, then `./examples.module.css` (the only CSS an example may import).
- Icons from the kit first: `<Icon name="…" />` for any glyph the registry has (`src/icons`). A direct
  `lucide-react` import only for a domain glyph listed in `DOMAIN_GLYPHS` (docs contract) with a
  reason; a generic glyph goes into the registry instead. The contract fails otherwise.
- Data: module-level `UPPER_SNAKE_CASE` constants above the function; pure helpers allowed, no helper
  components — except one inner component for a provider-based API that must call its hook inside the
  provider (`useNotifications`). State is named by meaning: `[query, setQuery]`, `[open, setOpen]`.
- Domain: one realistic B2B / product-admin world (orders, invoices, projects, team), Russian text; no
  lorem, emoji, «Пункт 1/2/3». Size `m` — omit `size`, never write `size="m"` — except in the `sizes` slot; another size only
  where the scenario itself needs it (a dialog width, a spinner for a whole region, a control paired
  one tier down per foundation §6), never for decoration.
- Show the component itself — the example is about it, not about its neighbours.
- Matrices (`variants`, `sizes`, `states`, `with-icon` of primitives and controls) render rows of
  labelled cells and no CSS: every direct child is a row `<div>`, every cell a `<div>` with the specimen
  and a caption `<Typography as="span" variant="caption" tone="muted">` holding the prop value as
  written in code (`xs`, `solid · danger`, `disabled`). Components with their own visible label
  (fields, checkboxes) are labelled through that label instead. The `matrix` preview layout lines the
  cells up (up to 12 columns, cells 128–320 wide); matrix examples import no CSS.
- `examples.module.css` only for the layout of realistic scenarios (form grid, toolbar spacer, a stage
  for a layout component): semantic tokens only, no typography, no rows / stacks / matrices (the
  slot's preview layout provides them). A bounded block is `Card.Root` — CSS only places it.
- No inline `style={{}}`, no playground imports; the file copies into a consumer project unchanged.

## 5. Playground page

Every component page is the same: **title → description → examples by slots → API → Accessibility**
(keyboard, ARIA, labels). A section file is data only: it exports a `ComponentPageConfig` named `page`;
`playgroundPages.tsx` collects every section by glob, builds routes, sidebar and search from `category`
(`playground/categories.ts`) and `nav`, and renders each through `ComponentPage`. Examples and their
sources load lazily by glob (`playground/exampleRegistry.ts`), no import pairs.

```tsx
import { MousePointerClick } from "lucide-react";
import { api } from "@/components/button/api";
import type { ComponentPageConfig } from "../components/ComponentPage";

export const page: ComponentPageConfig = {
  category: "actions",
  nav: { segment: "buttons", label: "Button", summary: "…", keywords: ["кнопка"], icon: MousePointerClick, order: 1 },
  dir: "button",
  title: "Button",
  kind: "primitive",
  description: "Кнопка для явных действий… `tone` задаёт смысл, `variant` — подачу.",
  examples: [
    { slot: "overview", description: "Главное действие и второстепенное рядом — `variant`, `tone`." },
    { scenario: "as-child", title: "Как ссылка", description: "… — `asChild`, `disabled`." },
  ],
  api,
  accessibility: { keyboard: [{ keys: "Enter · Space", action: "…" }], aria: ["…"] },
};
```

- Page description: 1–2 sentences on purpose; keyboard and behaviour go to `accessibility`.
- Example description: one Russian sentence «Что показывает — `prop`, `prop`.».
- **Kind** (the shape of the component, not its sidebar category): `primitive` · `control` · `field` ·
  `overlay` · `navigation` · `composite` · `layout` (primitive — Button, LinkButton, Badge, Avatar,
  Thumbnail, Kbd, Divider, Label, Hint, Typography, CodeBlock, ProgressBar, ProgressCircle, Spinner,
  Banner; control — Checkbox, Radio, Switch, Slider, SegmentedControl, ColorSwatches, ButtonGroup;
  field — Input, Textarea, DigitInput, Select, NativeSelect, TagSelect, Datepicker, ColorPicker,
  FileUpload; overlay — Modal, Drawer, Popover, Dropdown, Tooltip, CommandMenu,
  Notification; navigation — Tabs, Accordion, Stepper, Breadcrumb, Pagination; composite — DataTable,
  Dnd, SmartFilter, Timeline, Card, LoginForm, EmptyPage; layout — AppShell, Sidebar, PageContent,
  ScrollContainer, ExampleFrame, Crossfade).
- **Slots** (`SLOTS` in `pageStandard.ts`, file = slot id): `overview` «Обзор» · `variants` «Варианты» ·
  `sizes` «Размеры» · `states` «Состояния» · `with-icon` «С иконкой» · `structure` «Структура» ·
  `group` «Группа» · `orientation` «Ориентация» · `placement` «Расположение» · `overflow`
  «Переполнение» · `validation` «Валидация» · `dismiss` «Закрытие» · `controlled` «Управляемое
  значение» · `controlled-open` «Управляемое открытие» · `in-form` «В форме» · `narrow` «Узкая ширина».
  `overview` is always first: typical usage with defaults, what a consumer copies first. One scenario —
  one example; no `surfaces` example (the playground's surface switch checks contrast).
- `KIND_SLOTS` fixes which slots a kind allows, their order, the position of component-specific
  scenarios and each slot's preview layout. Required: `overview` everywhere; `states` for controls;
  `sizes`, `states`, `validation`, `in-form` for fields; `narrow` for composites. Prop-driven
  (`PROP_SLOTS`, from the first API part): `size` → `sizes`; `variant`/`tone`/`color` → `variants`;
  `disabled`/`readOnly`/`loading`/`invalid` → `states`; `onValueChange`/`defaultValue`/
  `onCheckedChange`/`defaultChecked` → `controlled`; `onOpenChange`/`defaultOpen` → `controlled-open`;
  `closeOnOutsideClick` → `dismiss`. A required slot the kind does not allow fails the contract — extend
  `KIND_SLOTS` or change the kind, never work around it in `api.ts`.
- Preview layout and surface are never set per page: the slot sets the layout (`layout` pages use
  `full`), the surface is the playground-wide choice. Stack layouts centre their children in a column of
  at most 640, so container-typed components (Stepper, Breadcrumb) need no width hacks.
- A new component needs only its section file: `category` is its sidebar group, `nav` its route and
  search entry. Nothing else to register.

## 6. COMPONENT.md

English, one template (reference: `button`, `input`, `modal`, `spinner`):

```
# X
**Category:** <section `category` id>
**Kind:** <page kind>
> One-sentence purpose.
## When to use · ## When not to use · ## Import · ## Anatomy (tree) · ## API (generated) · ## Variants
## States · ## Layout & spacing · ## Accessibility (### Keyboard · ### ARIA · ### Labels (generated))
## Examples · ## Mistakes · ## Related
```

- `## API` and `### Labels` are generated from `api.ts` by `bun run docs:build` — edit `api.ts`, never
  those sections. Every other section is written by hand.
- Variants: `| Value | Looks like | Use when | Default |` per prop; flags under `### Flags`.
- States: `| State | Driven by | DOM |`.
- Keyboard: `| Key | Action |` (keys in backticks joined by ` · `) or «No keyboard interaction.»; the
  keys match the page config.
- Examples: `| Example | Shows |`, one row per file in page order, Shows = the file's JSDoc verbatim.
- Related: `- **Built from:** …` (kit components it renders, or `—`) and `- **See also:** …`.

**`api.ts`** (`src/<base>/<dir>/api.ts`, shared parts in `*.api.ts`, schema in
`scripts/docs/componentApi.ts`): `export const api: ComponentApi = { parts, labels }`. Structure is
written once (`name`, `type`, `default`, `required`); every description is written twice side by side —
`en` for COMPONENT.md, `ru` for the playground — and both say the same thing. A part's `en` starts with
its ref / element line. The first part is the root (or the leaf). `labels` lists every `labels` key with
its Russian default. `api.ts` files are excluded from the published types.

## 7. One change touches everything

A component change is done only when all of these agree. Do them in the same change:

1. **Code** — `X.tsx`, `X.module.css`, tokens if needed; §1 API, §2 reuse, motion and a11y per
   Conventions.
2. **Tests** — `X.test.tsx` for behaviour, keyboard and a11y.
3. **Exports** — `src/components/index.ts` (or `src/layout/index.ts`) for new parts and types.
4. **`api.ts`** — every prop of every part, exact defaults, both languages; then `bun run docs:build`.
5. **Examples** — by slots and the canon (§4). A new prop or variant → an example shows it.
6. **Playground** — the section config (§5): every example listed in slot order, `api` from `api.ts`,
   accessibility notes, `category` and `nav`.
7. **COMPONENT.md** — the template (§6), Examples table in page order, Related with Built from.
8. **SKILL/** — holds no per-component content: `components.md` is a category tree of links to each
   `COMPONENT.md` and `examples/`. Touch it only when a component is added / removed / renamed (one
   line), when the choice between components changes (`choosing.md`), or when a shared rule changes
   (`api-contract.md`, `foundations.md`). No symlinks: npm drops them. Every ```tsx block in SKILL
   compiles against the kit (checked by `skill-docs.test.ts`) unless marked ```tsx partial.
   `cheatsheet.md` is the one-page «do X, not Y» entry (read first): update it when a shared rule or a
   cross-component decision changes. A new or changed screen pattern goes to `SKILL/patterns/` with an
   entry in `playground/composition/patterns.ts` and a row in `SKILL/composition.md`.
9. **README.md** — when the public surface changes (new component, export, count, install step).

Every page follows the standard; the docs contract has no exclusion list. Do not add one.

## 8. Definition of done

- `bun run verify` is green (biome, tsc, all tests incl. the docs contract, build).
- The docs contract passes for the component: kind declared in config and COMPONENT.md; every example
  listed once; slots allowed for the kind, in order, required ones present; descriptions name the same
  props as the JSDoc; example canon (JSDoc, function name, no inline style, no placeholder text);
  COMPONENT.md headings, Accessibility subsections, Related lines, keyboard keys and Examples table
  match; the API and Labels sections equal what `api.ts` renders.
- No copy of an existing kit block was added (§2); donors you extended are documented and tested.
- Behaviour, a11y, motion and visuals in both themes are not worse: check the page in the playground in
  light and dark.
- Commits stage explicit paths only, carry no AI attribution, and leave the tree clean.

## 9. Repository map

| Path | What |
|---|---|
| `tokens/` | `primitives.ts` → `semantic.ts` → `themes/{light,dark}.ts`; `bun run tokens:build` generates `src/styles/{tokens,theme-light,theme-dark}.css` (never edit those by hand) |
| `src/components/<dir>/` | one component: `X.tsx`, `X.module.css`, `X.test.tsx`, `api.ts`, `COMPONENT.md`, `examples/` |
| `src/layout/` | AppShell, Sidebar (same structure) |
| `src/internal/` | shared mechanics: `states.ts` (vocabulary types, `stepDown`), contexts (`ControlSizeContext`, `AnchorRectContext`), `overlay/` (`layerStack`, `useFloatingLayer`, `FloatingPanel`, `focus`), `MenuGroup`, `FieldFrame`, `ChoiceField`, `fieldClasses`, `iconLayout`, `swatch`, `HighlightMatch`, `formatLabel`, `listbox`, `rovingFocus`, `VisuallyHidden`, `slot`, `cx`, `data-attributes`; CSS: `overlayMotion`, `enterMotion`, `swapMotion`, `floatingSurface`, `menu`, `fieldSurface`, `fieldTier`, `fieldTrigger`, `palette`, `chipTier`, `iconBox`, `textTone`, `textRole` |
| `src/hooks/` | `useModalLayer`, `useInertSiblings`, `useScrollLock`, `usePresence`, `usePosition`, `useControllableState`, `useMergedRefs`, `useImageStatus`, `useStateSwap`, `useEnterConfirm` |
| `src/icons/` | public `<Icon name>` registry and `createIcon` on lucide-react — the only icon source for components |
| `src/index.ts`, `src/components/index.ts`, `src/layout/index.ts` | public exports |
| `playground/pageStandard.ts` | page kinds, slot vocabulary, `KIND_SLOTS`, `PROP_SLOTS` |
| `playground/components/ComponentPage.tsx` | the one page renderer and `ComponentPageConfig` |
| `playground/exampleRegistry.ts`, `sourceRegistry.ts` | glob loader of every example (lazy module + lazy raw source) |
| `playground/playgroundPages.tsx`, `categories.ts` | routes, sidebar, search — built from the section configs by glob |
| `playground/sections/<Name>Section.tsx` | one page per component: data only, `export const page: ComponentPageConfig` |
| `playground/foundation/` | token pages (Typography's component docs live here) |
| `scripts/` | `build-tokens.ts`, `bundle-lib.ts`, `build-docs.ts` + `docs/componentApi.ts` (api schema, markdown) |
| `src/test/docs-contract.test.ts` | docs / examples / playground / api contract for every component (shared helpers in `contract-utils.ts`) |
| `src/test/part-refs.test.tsx` | refs of every part: a typed check, runtime cases for merged or redirected refs |
| `SKILL/` | agent skill for consumer projects: `SKILL.md` (entry and workflow), `choosing`, `components` (index), `composition` (screen assembly guide), `layouts`, `api-contract`, `foundations`, `anti-slop`, `checklist` |
| `SKILL/patterns/` | composition patterns: one working screen per file (`<name>.tsx` + `<name>.module.css`, `export default function <Name>Pattern`); the one source for the skill and the playground «Композиция» pages |
| `playground/composition/` | composition pages: `patterns.ts` (page text per pattern), `PatternPage.tsx`, `CompositionPage.tsx` (principles), `patternRegistry.ts` (glob loader) |
| `src/test/patterns-contract.test.ts` | pattern canon, links from `SKILL/composition.md`, playground list, render smoke test |
| `src/test/skill-docs.test.ts` | SKILL tsx snippets typecheck against the kit (fragments: ```tsx partial); SKILL and `llms.txt` links resolve |
| `llms.txt` | entry point for LLMs (llms.txt convention): links to `SKILL/cheatsheet.md`, `SKILL.md`, components / choosing / composition, patterns, foundation |

## Release

`.github/workflows/ci.yml`: every push to `main` runs `bun run verify`; then, if the `package.json`
version is not on npm yet, publishes it. Bump `version` to release. `package.json` `files` ships `dist`,
styles, every `COMPONENT.md` and `examples/**`. One JS entry (`prime-ui-kit`) and `bundle.css`;
`fonts.css` and `reset.css` are opt-in. Runtime dependency: `lucide-react` only (react-router is a
playground dev dependency).
