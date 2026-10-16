# prime-ui-kit

React 19 UI kit (npm package `prime-ui-kit`) for building product interfaces: admin panels, dashboards,
settings, forms, tables. Design language "Graphite": depth from fill, not lines; 4px grid; one size
axis `xs–xl` (default `m`); air as hierarchy. Styling is CSS Modules + semantic CSS variables
(`--prime-*`); behaviour and a11y are the kit's own (`react-aria-components` only behind
`prime-ui-kit/color-picker`). TypeScript, ESM, light + dark themes.

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
bun run docs:build          # from api.ts: COMPONENT.md API, Keyboard, ARIA, Labels; the aggregates
bun run skill:build         # installable skill in dist/skill (SKILL + every COMPONENT.md and examples)
bun run tokens:build        # src/styles/*.css from tokens/
bun run build               # tokens + bundle + d.ts + skill
bun run verify              # everything CI runs — must be green before a commit
bun run verify:tokens       # tokens:build shows no diff (generated API docs: the docs contract test)
```

## Conventions

- No backward compatibility: one name per concept, no aliases, no `@deprecated`, delete legacy and
  update every usage in the repo in the same change. Breaking API changes are allowed while v1 forms;
  behaviour, a11y, motion and visuals in both themes must not get worse.
- Code, identifiers, docs and comments in English; UI strings in Russian.
- Tokens: edit `tokens/*.ts` only, then `bun run tokens:build`; never edit `src/styles/{tokens,theme-*}.css`.
- Themes switch only via `data-theme`; components know semantic roles, never the theme.
- Surfaces stand on the ladder (`tokens/layers.ts`, foundation §4): a surface component sets
  `data-depth` from `src/internal/surfaceDepth.tsx` (`useNestedSurfaceDepth` + `SurfaceDepthProvider`,
  or `"floating"` for overlays) and paints `--prime-color-layer-current`; controls read the context
  variables (`--prime-color-field-bg`, `--prime-color-fill-muted`, `--prime-color-control-selected`).
  Never hard-code `--prime-color-layer-<n>-*` in a component.
- Styles: tokens only (no raw px/hex, no `--prime-ref-*`), state styled only from `data-*` and ARIA.
- Motion is part of the code (foundation §7): press, hover/focus fill, selection/toggle, open/close,
  enter/exit of parts, loading — or consciously still (high-frequency, keyboard). Tokens only,
  `transform`/`opacity` (+ color/fill/shadow for state), no `transition: all`, no `ease-in`, both
  directions, reduced motion honoured. One-shot appearance of parts uses `src/internal/enterMotion`.
- State changes are continuous — a foundation of the kit (foundation §1 rule 7). Nothing flips and
  nothing that loads unfolds: a control moves into its new state; whatever loads is a `Skeleton` in
  the data's geometry from the first paint, under the state `"loading"`, and the data replaces it in
  place (a short fade, no height glide); a region that changes between settled states (data / empty
  / error, another record) cross-fades and glides its height (`Crossfade`, or
  `src/internal/RegionSwap` inside a component); a region or part that mounts with its page is
  still — an enter plays only for what appears later. Every
  component with region states and every example (screens included) that loads follows this.
- A11y minimum: every interactive component works from the keyboard, has explicit ARIA, a visible focus
  ring in both themes, never conveys meaning by color alone, and has keyboard tests.
- Responsive is part of the code (foundation §9, `SKILL/responsive.md`): every component works from
  320px and adapts to its own container (container queries); viewport breakpoints 640 · 768 · 1024 ·
  1280 (`max-width: 639px` style) only in the scopes foundation §9 allows (the app shell, the
  overlay form); one height query: a sticky surface stops sticking under
  `@media (max-height: 479px)`, and it lives only in `src/internal/sticky` (`src/styles/sticky.test.ts`).
  `:hover` only inside `@media (hover: hover)` (a hover transform also under `(pointer: fine)`),
  nothing hover-only; small controls get the touch hit area (`src/internal/touchTarget`); editable
  text uses `fieldInputTextClass` (16px on touch). Switchers sit on `src/internal/SwitcherScroller`:
  they scroll, never wrap or truncate; indicators move only after a person's choice.
  `src/styles/touch.test.ts` guards the mechanical part.
- Shared internal classes are joined in TSX (`cx(fieldTierClass, styles.root)`), not chained through
  cross-file `composes`; the bundle builds with 0 CSS warnings.
- A host never overrides a donor's internals: no doubled-class selector, no private custom property
  of another module. It sets only the donors' public hooks — `--prime-icon-size`, `--ring-fill`,
  `--sticky-bg`, `--dnd-gap-*`, `--dnd-sortable-gap`, `--divider-bleed`, `--disclosure-*`,
  `--enter-*`, `--swatch-inline-size`, `--hairline-inset`, `--floating-width`, `--scroll-fade-depth`,
  `--avatar-ring`, `--label-dimmed` (`src/styles/donor-override.test.ts`). A mode the host needs is added to the donor (§2).
- Shared mechanics live in `src/internal` or `src/hooks`, never in a component folder: a component
  imports from another component folder only its PascalCase module or `types.ts`
  (`src/test/source-rules.test.ts`). Nothing is exported only for a test: a test reaches a module
  through its public surface (`src/test/unused-exports.test.ts`).
- Every mechanical rule of this file has a guard test (`src/test/**`, `src/styles/*.test.ts`); a rule
  only in prose is a defect. A guard asserts no offender at all. A deliberate exception is a named
  allowlist entry inside the guard with a one-line reason (the public hooks of
  `donor-override.test.ts`, `PAINTED_EXAMPLES`, `SHOWN_BY_CONTENT`…), kept minimal — never an
  entry added to get a change through; a list that can tell (`DOMAIN_GLYPHS`, `DOCUMENT_SCREENS`,
  `PAINTED_EXAMPLES`, `SHOWN_BY_CONTENT`) fails once an entry no longer applies.
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
- Part names: `Trigger` opens a layer or a disclosed region (see the slot rule under Props and
  callbacks for when it renders DOM); `Content` is the floating layer or the disclosed
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
  (`notify()`, `options`) carries `icon: ReactNode` — and `NotificationCard`, the static rendering
  of a `notify()` record (the same `NotificationContent`).

**Props and callbacks**
- The primary value is `value` / `defaultValue` / `onValueChange` (`checked`, `open` per §10). Any other
  stateful aspect uses the same triad: `x` / `defaultX` / `onXChange` (`sort`, `page`, `expanded`).
  The new value is always the first callback argument.
- Event names: `onSelect` activates a menu / command item; `onRemove` takes a value out of a selection;
  `onDelete` destroys an entity; `onDismiss` closes a message (Banner, Notification).
- Dismiss: foundation §10 is the rule and lists the overlays (every layer of the one stack; Tooltip
  and Notification are exempt). `docs-contract.test.ts` checks that every component that opens a
  layer takes `closeOnOutsideClick` and `closeOnEscape`.
- Selection mode: `multiple?: boolean` for one vs many (not `type`); `mode` only for structurally
  different values (Datepicker `single | range`). Mutually exclusive behaviours are one enum prop, not
  a set of booleans with impossible combinations (DataTable `paging: "pages" | "infinite" | "none"`).
  Status words: `selected` (choice), `current`
  (navigation location, `aria-current`), `pressed` (toggle button). Tone words for statuses
  (`danger`, never `error`). Flags keep §10 names (`fullWidth`, not `fillWidth`).
- Anchored layers position with `side` (`top | right | bottom | left`) and `align` (`auto | start | center | end`, default `auto` — the edge with more room); Tooltip centres on its trigger by default (foundation §8) and takes `auto` explicitly.
- `color` only on the components §10 lists.
- A visible text label is `label`; a name only for assistive tech is the native `aria-label`, never
  `label`.
- `asChild?: boolean` only on single interactive elements that may become a link or another element
  (Button.Root, LinkButton, Sidebar.Item, Sidebar.Brand, BottomNav.Item, Breadcrumb.Item, SegmentedControl.Item, List.Item, ChatList.Item, Timeline.Item, Card.Root, Dropdown.Item, Input.Action, Textarea.Action, Thumbnail.Root). `as` only picks a semantic tag for non-interactive elements.
- Slots: an opener or closer the consumer supplies (`Modal.Trigger`, `Popover.Trigger`,
  `Dropdown.Anchor`, `X.Close`, `X.Confirm`) is a slot — no DOM, it clones one element child, merges
  its `ref` and handlers and takes no `className`. An opener the kit draws (the combobox of
  `Select.Trigger`, the header button of `Accordion.Trigger`, `Sidebar.SubTrigger`) renders its own
  `<button>` and takes `className` and `ref` like any part.
- Functions: `formatX(value)` for display, `getX(item)` for data accessors, `renderX(item)` to render a
  data item. No function-as-children.
- Arrays vs parts: children / parts for a hand-written, static set with custom content (menus, tabs,
  select items); an array prop for application data (rows, options the component filters, creates or
  reorders, segments, presets).
- Size: `size` lives on the root only, and every sized root resolves it with
  `useHostTier(size)` (`src/internal/ControlSizeContext`): its own `size`, else the tier of the host
  around it, else `m` — and it provides the result to its parts, which set `data-size`. An overlay's
  `Content` takes its own `size` (foundation §10): the width of a dialog (Modal, Drawer), the tier of a
  floating panel (Popover, Dropdown, Tooltip). Every tier mapping is named in
  `src/internal/states.ts` — `stepDown(size)` for a control nested in another control's row,
  `compactTier(size)` for a mark inside a dense row — never a local lookup table.
- Every part that renders DOM accepts `className`, its native attributes and `ref` (React 19 ref as a
  prop); an internal ref is merged with the consumer's through `useMergedRefs(a, b)` only. A field root
  sends `className`, `ref` and native attributes to the frame and `id` to the control
  (`FieldRootDomProps` from `src/internal/FieldFrame` — the one exemption from «attributes on the
  part's own element»); a leaf without a field frame keeps `ref` on the control.
  `src/test/part-refs.test.tsx` checks the refs of every part listed in the generated
  `src/test/part-refs.generated.ts` (`bun run docs:build`); a part whose ref is merged or redirected
  also gets a runtime row there. Only slots and state-only roots
  (`Modal.Root`, `Popover.Root`…) have no ref. `displayName` is `X.Part`; behaviour never depends on
  `displayName` (compare element types).
- Support row: `hint` / `error` are props on every component that has one (not `Hint` / `Error` parts).
- `labels` holds system strings and default texts (aria labels, announcements, empty texts, counters,
  default placeholders) with Russian defaults; a per-instance visible text is a prop or children.
  Values inside a label string are `{token}` templates (`"{current} из {max} символов"`) — never
  functions.
- Optional UI is off by default: a component shows on its own only its core and its essential
  states (the empty state, an error, a required mark); helper and limit texts, counters, ranges,
  scroll hints, change badges, captions appear only when the consumer asks (a prop, `hint`). A
  control that can do nothing (an add button at `max`) leaves instead of staying disabled. Never a
  `labels` key whose empty string is the only way to hide a text.
- Autofill is off on every text field: a field takes `src/internal/autofill` (`useAutofill`,
  `AUTOFILL_OFF` — `autocomplete="off"` plus the password-manager opt-outs) unless the consumer
  passes an `autoComplete` token; only `LoginForm.Form` (`AutofillScope`) leaves it to the browser.

## 2. Building from the kit

The kit is built from itself. When a component needs an element the kit already has as a component,
part, icon or shared mechanic, it uses it — never its own copy. Before writing markup or CSS, check:

| Need | Use |
|---|---|
| a button (close, clear, nav arrow, retry, icon button) | `Button` (`variant="ghost"`, `Button.Icon`), `LinkButton` for links (`asChild` + `<button>` for an inline action in text) |
| a confirm of a destructive action, a «discard changes?» question | `ConfirmDialog` (async `onConfirm`); inside a Modal / Drawer form — `X.Guard` (`busy`, `dirty`) |
| a loading placeholder (rows, lines, avatar, field, block) | `Skeleton` (`shape`, `size` from the host tier, `lines`) — never a grey box with own keyframes |
| a loading indicator with no shape to hold | `Spinner` (Button / Select `loading` place it themselves) |
| a checkbox look inside an option or menu row | `Checkbox.Indicator` (no input; the row carries `aria-selected` / `aria-checked`) |
| an icon, chevron, check, sort arrow, status glyph | `<Icon name="…" />` from `src/icons` (a new glyph: `bun run icons:add <LucideName>`, one gesture from `src/icons/glyphMotion.module.css`, a registry entry; `drawn` for a glyph that draws in and out, like a check; `createIcon` makes a standalone icon) — never inline `<svg>` or direct `lucide-react` in components. A host sizes an icon only through `--prime-icon-size` (a raw `<svg>` child joins `iconSlotClass` from `src/internal/iconBox`), never an `svg` selector (`src/styles/icon-size.test.ts`) |
| an icon on a filled tile (a dialog header mark, a sign-in logo) | `.tile` of `src/internal/iconBox.module.css` with `data-tone` |
| a palette hue (`color` prop) | `src/internal/palette.module.css`: `.hue` on the element with `data-color`, CSS reads `--hue-soft` / `--hue-text` / `--hue-solid` / `--hue-solid-fg` — never a local `[data-color]` map |
| a field surface, tier or select-like trigger | `src/internal/fieldClasses.ts` (`fieldSurfaceClass`, `fieldTierClass`, `fieldTriggerClass`), joined in TSX with `cx`; hover fill token `--prime-color-field-bg-hover`; the per-tier label, hint and touch-safe input text `fieldLabelTextClass`, `fieldHintTextClass`, `fieldInputTextClass` (inside a `fieldTierClass` ancestor) — `fieldTier.module.css` is the only per-tier table |
| a chip tier, icon box, text tone or text role | `src/internal/chipTier` (`useChipTier`), `iconBox`, `textTone`, `textRole` CSS modules |
| a chip, tag, status, count | `Badge` (`Badge.Dot`, `Badge.Action`) |
| a key hint | `Kbd` |
| a separator | `Divider` |
| a scroll region (thin bar, soft hidden edges, hidden bar, snapping, lock) | `ScrollContainer` (`axis`, `edges`, `scrollbar="hidden"`, `snap`, `lock`) — every scroller; `src/styles/scroll.test.ts` fails on a raw `overflow: auto` |
| an empty result | `EmptyPage` (`layout="compact"` inside menus and lists) |
| a field label / support row / counter | `Label`, `Hint`, `src/internal/FieldFrame` (`useFieldFrame` — its `ids.required` and `ids.controlAria(…)` name a button-role control; `FieldSupport`, the support row that stays mounted as a polite live region; `counter`, `reserveSupportRow`, `group` for a labelled group; `FieldRootDomProps` — a field root's `ref` and native attributes go to the frame, `id` to the control; shared api rows in `src/internal/field.api.ts`) |
| a checkbox / radio / switch row (control + text + support) | `src/internal/ChoiceField` |
| a colour swatch (fill, checkerboard, check) or a grid of them | `src/internal/swatch` (`swatchTriggerClass`, `checkerboardClass`, `useSwatchGrid` for the arrow keys, `usePaletteOptions`) |
| menu / listbox rows, a floating panel | `src/internal/menu.module.css`, `floatingSurface.module.css`, `listbox.ts` (`useListboxRegistry`, `useListboxItem`, `handleListboxKeyDown`, typeahead) |
| the matched part of a label while searching | `src/internal/HighlightMatch` (`HighlightMatch`, `highlightChildren`) |
| a `{token}` label template | `src/internal/formatLabel` |
| records of one shape a person adds, edits and removes in a form (lines, contacts, specs, prices by period) | `FieldList` (headings once, a field per cell named by its column) — never a `.map()` of labelled fields |
| an icon picker or a small choice in a dense row | `Select` with only `Select.TriggerIcon` (icon-only trigger) |
| a bounded block in an example (panel, card) | `Card` (`Card.Root` + `Card.Body`) — never a hand-drawn card in CSS |
| a person / object picture | `Avatar` / `Thumbnail`; image load state via `src/hooks/useImageStatus` |
| a table, pagination, row selection | `DataTable`, `Pagination`, `Checkbox` |
| a list of conversations (the dialogs pane of a messenger or an inbox) | `ChatList` — never `List` with a hand-made count, preview or «печатает…» |
| a selectable list of records that are not conversations (tickets, letters, invoices — the list side of a list + detail) | `List` (`current`, `List.ItemIcon` / `ItemText` / `ItemDescription` / `ItemMeta` / `ItemCount`) — never ghost Buttons with a soft current |
| screen-reader-only text | `VisuallyHidden` (`src/components/visually-hidden/VisuallyHidden`, `visuallyHiddenClass`) |
| a one-shot appearance or exit of a part | `src/internal/enterMotion.module.css` (`.enter`, `.enterBase`, `.enterFade`, `.exit`, `.exitFade`; host hooks `--enter-shift`, `--enter-scale`, `--enter-duration`) |
| an optional part that comes and goes (a clear button, a chip row, an error zone) | `src/internal/partPresence` (`usePartPresence({ present, axis })` → `ref` + `className`: enters after the first render, closes up in place; `useEnterOnAppear` for a part that enters only when it appears on a page already shown, never with its page) |
| keyed rows that enter and leave a list | `src/internal/listPresence` (`useListPresence(keys)` in the host, `useListItemPresence` in each row) |
| a part that folds open and closed (an accordion item, a sub-list, a detail row) | `src/internal/Disclosure` (`<Disclosure open>`, or `useDisclosure` for a `<tr>` / `<li>` host; clocks `--disclosure-duration` / `--disclosure-close-duration`, the height alone `--disclosure-height-open` / `-close`) — never a `grid-template-rows` fold of your own |
| press feedback | `src/internal/press.module.css` (`.press`, `.pressCompact`; `.pressHost` + `.pressPart` when a part gives under the host's press) — never an own `:active` scale |
| a touch hit area for a small control | `src/internal/touchTarget` (`touchTargetClass`, `touchTargetBlockClass`, `touchTargetRowClass` for a row with its own min-height) |
| an edge cue for a scroll region (fade / shadow where content is hidden) | `ScrollContainer` `edges` (`fade` default, `shadow` on a filled surface), or `src/hooks/useEdgeOverflow` for a host that draws its own from sticky parts (DataTable, Gantt) |
| scrolling while a drag is held near an edge | `src/internal/edgeAutoScroll` (`createEdgeAutoScroll` — the frame loop, insets for a pinned column; Dnd, Gantt, `useRangeSelection`) |
| a long press, a drag that starts after a hold, the click that ends a drag | `src/internal/longPress` (`useLongPress`, `DRAG_HOLD_MS`, `PRESS_SLOP_PX`, `DRAG_THRESHOLD_PX`), `src/internal/swallowNextClick` |
| list items that glide to a new order | `src/internal/useFlipList` (Dnd, ChatList, Kanban) |
| a row or a card that opens as a whole while its controls stay theirs | `src/internal/rowLink` (`opensRow`, `rowLink.module.css` `.host`) |
| loading more at the end of a list's own scroller | `src/hooks/useLoadMore` |
| a page's top: title, tools (sections, filter + search, view), buttons, filter chips | `Page` (`Page.TopBar` with `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips`; `Page.Header` in the flow) |
| a swap between states of a region (loading / data / empty / error, another record) | `Crossfade` (public) or `src/internal/RegionSwap` inside a component (`<RegionSwap state>`; `useSwapIn(state)` where the states cannot be laid over each other: a table body, a button's text); loading state is a `Skeleton` |
| a row of tools (search, filter, switchers, buttons) and the chips line under it | `src/internal/ToolRow` (`ToolRow`, `ToolChips`, `ToolGroup` for a host's own items; `Page.Tools`, the DataTable `toolbar`, the Gantt toolbar) — never an own flex row of tools |
| a switcher row (Tabs, SegmentedControl, ButtonGroup, BottomNav) and its sliding indicator | `src/internal/SwitcherScroller` (the sideways scroller every switcher sits on) + `src/internal/selectionIndicator` (`placeIndicator`, `revealInScroller`) |
| an element's size as state, or a re-layout when it resizes | `src/hooks/useElementSize` (`useElementSize`, `useResizeEffect`) |
| what a ScrollContainer lets its content ask for (its scroller, holding the view through a motion) | `src/hooks/useScrollRegion` |
| an action on a coloured host (solid Banner) | `Button` `tone="inherit"` (ghost / soft / outline) — never a host CSS override |
| a navigation item that leaves the page (held by `Page.Guard`) | `src/internal/leaveGuard` (`leaveGuardCapture` as its `onClickCapture`: Sidebar, BottomNav, Breadcrumb) |
| overlay stack, dismiss, focus | `src/internal/overlay/layerStack.ts` (`useLayer`, `LayerProvider`; one stack, reasons `escape` / `outside` / `scrim`), `overlay/focus.ts` (`handoffFocus` when a focused part leaves, `tabStopBeside`, `captureOpener`); the open triad with `disabled` `overlay/useOpenState`; modal layers `useModalLayer` + `useInertSiblings` + `useScrollLock`; one z-index `--prime-z-overlay` |
| an anchored floating panel (Popover, Dropdown, Tooltip, Select) | `src/internal/overlay/useFloatingLayer` + `FloatingPanel` / `FloatingTrigger` (scroll containment `useContainScroll`, the name from the anchor `useAnchorName`); menu groups `src/internal/MenuGroup`; a tooltip-like chip `overlay/tooltipSurface.module.css` |
| overlay enter/exit, motion timing in JS | `overlayMotion.module.css`, `usePresence` (`prefersReducedMotion`); durations and timeouts from tokens `src/internal/motionTiming` (`motionDurationMs`, `exitTimeoutMs`, `readCssDurationMs`) — never a millisecond literal |
| anchored positioning, a CSS length in JS | `usePosition` (follows the anchor, 4 sides, `align`, arrow, flips only when the side has no room; `anchorPoint` — a point inside the anchor, the pointer over a chart), `readCssLengthPx("--prime-…", fallback)` — never import `tokens/` into components |
| a tooltip at a point of a chart (the pointer, the point the arrows reached) | `src/internal/ChartTooltip` (`anchorRef`, `point`; public as `ChartFrame.Tooltip point`) on `useFloatingLayer` + `anchorPoint` — never an own portal, own coordinates or a side picked by the middle of the plot |
| roving arrow-key focus | `src/internal/rovingFocus.ts` (`rovingIndex`, `gridIndex`) |
| selection of a list by click, Shift+click and drag-paint (rows, messages) | `src/internal/useRangeSelection` (DataTable, `Chat.Messages`) |
| a long list of rows of measured height rendered only in view | `src/hooks/useVirtualRows` (Gantt, Chat, and `rowGaps` spacers for rows in flow: DataTable body, TagSelect options) — never an own windowing |
| a surface that sticks to the start edge of its scroller | `src/internal/sticky` (`stickySurfaceClass`, `--sticky-bg`; Page.TopBar, DataTable head, Gantt) |
| a disabled group of controls (`Fieldset disabled`) | `src/internal/disabledContext` (`useInheritedDisabled`, `DisabledProvider`) — a control with a `disabled` prop reads it |
| a round icon button that is the disk itself (play, download, cancel / retry on media) | `Button` `shape="circle"` (`variant="shade"` over media; `asChild` for a link); its `progress` is the ring. A disk over media that is not a control (the play mark of a video frame) — `src/internal/mediaDisk` (`MediaPlayMark`, `mediaDiskClass`), the same look |
| a progress ring, an indeterminate turning arc | `ProgressCircle` (`value` / `null`, `spin`), `Spinner`, or the circle Button's `progress` — all drawn from `src/internal/ring` (`Ring`, `weight` `data` / `line`, `live` for a per-frame `--ring-value`); never an own ring, conic mask or turning keyframes |
| a glyph that changes in place (play ⇄ pause, × → retry, a chevron → a spinner) | `GlyphSwap` (`src/internal/glyphSwap`), the one glyph slot: `Button.Icon` and ProgressCircle children run through it by themselves — never a glyph ternary, two stacked icons or a `key` swap with own CSS (`src/test/glyph-swap.test.ts`) |
| a transfer either way (cancel, progress ring, retry, download, done out) | `src/internal/transfer` (`TransferState`, `TransferProps`, `TRANSFER_LABELS`, `transferDiskLabels`; api rows in `transfer.api.ts`) + `src/internal/transferDisk` (`useTransferDisk` — the logic: pending promise, names, description, announcements; `TransferDisk` with `look` `shade` / `solid` draws it as a circle Button with `progress`, `TransferOverlay` centred over a box) — never a bar, an own ring or an own cancel button |
| a media player (voice, round video) | `src/internal/mediaPlayer` (`MediaPlayerProps` — the one shared prop set, `useMediaPlayer`, `PlayDisk`, `TranscriptButton`, `seekByKey`; api rows in `mediaPlayer.api.ts`) — a new player extends it, never copies it |
| chat Markdown rendered as React (never HTML) | `RichText` (public), `src/internal/richText` inside a component that adds its own end or marks (`Message.Text`) |
| Markdown formatting of a text field (toolbar over a selection, hotkeys) | `src/internal/textFormatting` (`applyFormat`, `FORMAT_SHORTCUTS`) + `src/internal/textFormattingToolbar` (`useTextFormatting`; Composer, `Textarea formatting`) |
| a file size, a media clock, the first frame of a video | `src/internal/fileSize` (`formatFileSize`), `formatClock`, `mediaFrame` (`firstFrame`) |
| a dark pill or shade over media (a video's length, the time on a video circle, play / mute marks, a caption tag) | `src/internal/mediaPill.module.css` (`.shade`, `.pill`, `.tag`, `.ink`; Gallery, MediaViewer, Message, VideoNote, Thumbnail, attachment tiles) — the one home of the media shade |
| an image with a load state in a fixed box | `src/internal/imageSlot` (Avatar, Thumbnail); `useImageStatus` (`decode` settles after `img.decode()`) |
| a bottom sheet or a swipe to dismiss | `src/internal/sheet.module.css` (`.scrim`, `.surface`, `.handle`) + `src/hooks/useSwipeDismiss`; the sheet query `COMPACT_QUERY` in `src/hooks/breakpoints` (every media query the kit reads in TS lives there, read through `useMediaQuery`) |
| an element that renders as a button, a link or a slot | `src/internal/interactiveElement` (`InteractiveElement`) |
| an icon action beside a row (copy a value, open a link) | `src/internal/RowAction` |
| the faint zone line of a surface | `src/internal/hairline.module.css` (`.top`, `.bottom`; `--hairline-inset`) |
| `labels` defaults with overrides, a part's context, parts by type | `src/internal/labels` (`useLabels`), `src/internal/context` (`createComponentContext` — the error names the part), `src/internal/parts` (`isPart`, `splitParts`, `useTextParts`) |
| the pending state of a promise-returning handler | `src/internal/usePendingChanges` (`usePendingAction`, `usePendingKeys`, `isPromiseLike`, `AsyncHandler`) — never a local `.then` check |
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
  exports, examples by slots, `api.ts`, a section config with `category` and `nav`, COMPONENT.md
  (its `> ` purpose line becomes its row in the generated indexes), `SKILL/choosing.md` if the choice
  between components changes, and the component count in `README.md`, `llms.txt` and the
  `package.json` description. It replaces every copy it was made for.

## 4. Example files

One scenario per file in `examples/`, named by its slot (§5) or, for a component-specific scenario, in
kebab-case by meaning. The canon (reference: `button/`, `input/`, `modal/`, `spinner/` examples):

- Line 1: a one-line English JSDoc ending with a period, in the format
  `/** What it shows — \`prop\`, \`prop\`. */`. The backticked names are exactly the ones the page
  description of the example names, and the example renders each of them.
- Exactly one `export default function <Component><Scenario>Example()` (`ButtonOverviewExample`).
- Imports — exactly what `ALLOWED_IMPORTS` of the docs contract lets through: the kit from
  `"prime-ui-kit"` (`"prime-ui-kit/color-picker"` for ColorPicker / ColorField), `react` as
  `import * as React from "react"` (only this form), `react-dom`, `date-fns`, `lucide-react` only for
  a `DOMAIN_GLYPHS` glyph, and `react-router-dom` only in a router scenario (`router.tsx`, previewed in
  a `MemoryRouter`); then `./examples.module.css`, the only CSS an example may import. The one
  exception is the `screen` example (`examples/screen.tsx`, a whole page): it imports its own
  `./screen.module.css` instead — a page's layout is larger than `examples.module.css` should hold —
  which also leaves surfaces and text color to the kit (no `color` / `background`).
- The code is copied as is, so it carries no `biome-ignore`, no `toISOString().slice(` (Datepicker
  formats dates), no raw `<dl>` (DescriptionList) and no hand-written arrow-key `onKeyDown` (the
  kit's roving focus); a scenario obeys the kit's own rules (`example-content` in the docs contract).
- Icons from the kit first: `<Icon name="…" />` for any glyph the registry has (`src/icons`). A direct
  `lucide-react` import only for a domain glyph listed in `DOMAIN_GLYPHS` (docs contract) with a
  reason; a generic glyph goes into the registry instead. The contract fails otherwise.
- Data: module-level `UPPER_SNAKE_CASE` constants above the function; pure helpers allowed, no helper
  components — except one inner component for a provider-based API that must call its hook inside the
  provider (`useNotifications`). State is named by meaning: `[query, setQuery]`, `[open, setOpen]`.
- Domain: one realistic B2B / product-admin world (orders, invoices, projects, team), Russian text; no
  lorem, «Пункт 1/2/3», no emoji in text — the only emoji are reaction data (the `emoji` of
  `Message.Reactions` items), user content the contract lets through. Size `m` — omit `size`, never write `size="m"` — except in the `sizes` slot; another size only
  where the scenario itself needs it (a dialog width, a spinner for a whole region, a control paired
  one tier down per foundation §6), never for decoration.
- Show the component itself — the example is about it, not about its neighbours.
- Matrices — the comparison slots (`variants`, `sizes`, `states`, `with-icon`) of every kind — render
  rows of labelled cells and no CSS: every direct child is a row `<div>`, every cell a `<div>` with the
  specimen and a caption `<Typography as="span" variant="caption" tone="muted">` holding the prop
  value as written in code (`xs`, `solid · danger`, `disabled`). Components with their own visible
  label (fields, checkboxes) are labelled through that label instead. The `matrix` preview layout
  lines the cells up (up to 12 columns, cells 128–320 wide), `matrix-wide` does it for specimens as
  wide as their container (navigation, composites, page regions); matrix examples import no CSS
  (`matrix-css`, `matrix-cells`).
- `examples.module.css` only places things in a realistic scenario (form grid, toolbar spacer, a
  stage for a layout component): semantic tokens only, widths from the layout tokens
  (`--prime-layout-form-width-s` / `-m`, `--prime-layout-narrow-width`, `--prime-layout-tile-min-width`,
  `--prime-layout-reading-max-width`); never a surface or text (`background`, `box-shadow`, `border`,
  `outline`, `font*`, `letter-spacing`, `text-transform`, `text-align`, `white-space`, `list-style`),
  never a component's tier tokens (`--prime-card-padding-*`, `--prime-modal-*`, `--prime-drawer-*`),
  and the root of an example is never a pure flex column (`display`, `flex-direction: column`,
  `gap`, `align-items` alone) — the slot's preview layout stacks (`example-css`). A scenario that
  needs another preview takes `layout` in its section entry, one of its kind's layouts. A bounded
  block is `Card.Root` — CSS only places it. The one exception is a component that draws no item
  look and leaves it to the consumer's class (Dnd): its examples paint that class
  (`PAINTED_EXAMPLES` in `src/test/docs-contract.test.ts`).
- No inline `style={{}}`, no playground imports; the file copies into a consumer project unchanged.

### Examples vs screens — who shows what

- **A component example** shows one component, one scenario, with the least around it: no page
  heading, no shell, no neighbours that are not the point. Every capability of a component (every
  message kind, card kind, column option, state) is shown in that component's own examples — its page
  is complete on its own.
- **A screen** (the `screen` slot «Экран» of its main component: `examples/screen.tsx` +
  `examples/screen.module.css`, the last example on that page) is a whole page and answers «how to
  compose»: layout, toolbar, view switch, details in a Drawer, loading / empty / error, the phone. It
  never re-demos a component's capabilities; it uses them where the screen needs them. A screen that
  is one component plus a heading is an example, not a screen. Its rules for the skill live in
  `SKILL/composition.md` (the screens index and a section per screen).
- **Nothing is lost when moving**: before a capability leaves a screen, it is shown in the component's
  examples (add or extend one there in the same change).
- **The app is navigation and the page.** `AppShell` holds the Sidebar, `AppShell.Main` and the
  phone footer; there is no app-wide header and no global search — everything at the top belongs to
  the page. A screen renders one `Page.Root` with its own `Page.TopBar` and body (the app-shell
  screen renders the whole frame). `Page.Title` is the page's only `<h1>`, inside `Page.Heading`
  with a `Page.Description` that carries data and, on a nested record, a `Breadcrumb.Root` path
  that ends in the title on one line. Work screens (lists, boards, chats) and overviews put their groups in
  `Page.TopBar`: `Page.Heading`, `Page.Tools` (the page's own sections, view, a shared period;
  search and filter only on pages without a table), `Page.Actions` (every button of the page, each
  with an icon, the primary last) and `Page.Chips`; a filtered page wraps `Page.Root` in
  `SmartFilter.Root`. A DataTable's search, filter, «Колонки» and selection menu always sit in its
  own `toolbar` (chips in `toolbarChips`), even when the table is the whole page. Document pages (settings, long forms) put
  `Page.Header` (`Page.Heading` + `Page.Actions`) in the flow, optionally under a
  `Page.TopBar collapse` with a path; overviews (dashboards, analytics) title themselves in
  `Page.TopBar` like work screens, with their tools and buttons beside the heading. Never two titles; never no h1 —
  the docs contract checks one `Page.Title` and one h1 per screen.

## 5. Playground page

Every component page is the same: **title → description → examples by slots → API → Accessibility**
(keyboard, ARIA, labels — all three rendered from `api.ts`). A section file is data only: it exports a `ComponentPageConfig` named `page`;
`playgroundPages.tsx` collects every section by glob, builds routes, sidebar and search from `category`
(`playground/categories.ts`) and `nav`, and renders each through `ComponentPage`. Examples and their
sources load lazily by glob (`playground/exampleRegistry.ts`), no import pairs.

```tsx
import { api } from "@/components/button/api";
import type { ComponentPageConfig } from "../components/ComponentPage";
import { MousePointerClick } from "../icons";

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
};
```

- Page description: 1–2 sentences on purpose; keyboard and behaviour go to `api.accessibility`
  (§6).
- Example description: one Russian sentence «Что показывает — `prop`, `prop`.».
- **Kind** (the shape of the component, not its sidebar category): `primitive` · `control` · `field` ·
  `overlay` · `navigation` · `composite` · `layout` (primitive — Button, LinkButton, Badge, Avatar,
  Thumbnail, Kbd, Divider, Label, Hint, Fieldset, Typography, RichText, CodeBlock, ProgressBar, ProgressCircle, Spinner,
  Skeleton, Banner, Sparkline, VisuallyHidden, Gallery; control — Checkbox, Radio, Switch, Slider, SegmentedControl, ColorSwatches, ButtonGroup, VoicePlayer, VideoNote;
  field — Input, Textarea, DigitInput, Select, NativeSelect, TagSelect, Datepicker, ColorPicker,
  ColorField, FileUpload; overlay — Modal, ConfirmDialog, Drawer, Sheet, Popover, Dropdown, Tooltip, CommandMenu,
  Notification, MediaViewer; navigation — Tabs, Accordion, Stepper, Breadcrumb, Pagination, List; composite — DataTable, FieldList, Kanban,
  Gantt, Dnd, SmartFilter, Timeline, Card, DescriptionList, LoginForm, EmptyPage, Composer, Chat, ChatList, Message, ChartFrame; layout — AppShell, Page, Sidebar, BottomNav,
  ScrollContainer, ExampleFrame, Crossfade).
- **Slots** (`SLOTS` in `pageStandard.ts`, file = slot id): `overview` «Обзор» · `variants` «Варианты» ·
  `sizes` «Размеры» · `states` «Состояния» · `with-icon` «С иконкой» · `structure` «Структура» ·
  `group` «Группа» · `orientation` «Ориентация» · `placement` «Расположение» · `overflow`
  «Переполнение» · `validation` «Валидация» · `dismiss` «Закрытие» · `controlled` «Управляемое
  значение» · `controlled-open` «Управляемое открытие» · `in-form` «В форме» · `narrow` «Узкая ширина» ·
  `screen` «Экран».
  `overview` is always first: typical usage with defaults, what a consumer copies first. One scenario —
  one example; no `surfaces` example (the playground's surface switch checks contrast). `screen` is
  always last: a whole working page built around the component (field, overlay, navigation, composite
  and layout kinds), full width in an app-panel stage; a screen that fills the panel's height
  (`Page.Root fill`, `AppShell.Root fillViewport` at its top level) gets a viewport-high stage.
- `KIND_SLOTS` fixes which slots a kind allows, their order, the position of component-specific
  scenarios and each slot's preview layout. Required: `overview` everywhere; `states` for controls;
  `sizes`, `states`, `validation`, `in-form` for fields; `narrow` for composites. Prop-driven
  (`PROP_SLOTS`, from the first API part): `size` → `sizes`; `variant`/`tone`/`color` → `variants`;
  `disabled`/`readOnly`/`loading`/`invalid` → `states`; `closeOnOutsideClick` → `dismiss`; a triad
  on the root (`x` / `defaultX` / `onXChange`) → `controlled-open` for `open`, `controlled` for any
  other state (`requiredSlots`); the example of a prop-required slot names that prop in its JSDoc
  (`slot-prop`). A required slot the kind does not allow fails the contract — extend `KIND_SLOTS` or
  change the kind, never work around it in `api.ts`.
- Preview layout and surface are never set per page: the slot sets the layout (`layout` pages use
  `full`); a component-specific scenario may pick another layout of its kind, or `full` for
  page structure, with `layout` (`kindLayouts`); the surface is the playground-wide choice. Stack layouts centre their children in a
  column of at most 640, so container-typed components (Stepper, Breadcrumb) need no width hacks.
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

- `## API`, `### Keyboard`, `### ARIA` and `### Labels` are generated from `api.ts` by
  `bun run docs:build` — edit `api.ts`, never those sections. Every other section is written by hand,
  and states only what the code does (`component-md`): Built from names every kit component and
  internal block the sources import, the Anatomy names only exports, every boolean prop of the root has
  a Variants or States row.
- Variants: `| Value | Looks like | Use when | Default |` per prop; flags under `### Flags`.
- States: `| State | Driven by | DOM |`.
- Keyboard (generated): `| Key | Action |`, keys in backticks joined by ` · `, or «No keyboard
  interaction.». Every key a row names is pressed in the component's tests with a real key event
  (`keyboard-tests`; a key the browser handles — a native `<button>`, the Tab order — is a
  `native: true` row), and a test never fakes an activation with `keyDown` + `click` (`keydown-click`).
- Examples: `| Example | Shows |`, one row per file in page order, Shows = the file's JSDoc verbatim.
- Related: `- **Built from:** …` (kit components it renders, or `—`) and `- **See also:** …`.

**`api.ts`** (`src/<base>/<dir>/api.ts`, shared parts in `*.api.ts`, schema in
`scripts/docs/componentApi.ts`): `export const api: ComponentApi = { parts, types?, functions?,
labels, accessibility }` — the one prose source of the component's API; the code is the source of its
structure. `src/test/api-types.test.ts` checks every part and prop against the exported TypeScript
types (names, `required`, literal unions, a `…rest` row exactly when native attributes are forwarded),
and every label key and default against the runtime `X_LABELS`. Every description is written twice
side by side — `en` for COMPONENT.md, `ru` for the playground — and both name the same backticked
tokens. A part's `en` starts with its ref / element line. The first part is the root (or the leaf).
`default` is a code literal; a default that is not one (the host tier) is a `defaultNote`. `labels`
is `labelRows(X_LABELS, { key: { en, ru, part? } })`, so TypeScript asks for every key and the default
text comes from the code. `accessibility` holds the keyboard rows and ARIA lines the page and
COMPONENT.md render. `bun run build` writes the `en` text of every prop into the published `.d.ts`,
so a documented prop carries no JSDoc of its own in the TSX (`api-jsdoc`). `api.ts` files are
excluded from the published types.

## 7. One change touches everything

A component change is done only when all of these agree. Do them in the same change:

1. **Code** — `X.tsx`, `X.module.css`, tokens if needed; §1 API, §2 reuse, motion and a11y per
   Conventions.
2. **Tests** — `X.test.tsx` for behaviour, keyboard and a11y.
3. **Exports** — `src/components/index.ts` (or `src/layout/index.ts`) for new parts and types.
4. **`api.ts`** — every prop of every part, exact defaults, both languages; then `bun run docs:build`.
5. **Examples** — by slots and the canon (§4). A new prop or variant → an example shows it.
6. **Playground** — the section config (§5): every example listed in slot order, `api` from `api.ts`
   (its `accessibility` included), `category` and `nav`.
7. **COMPONENT.md** — the template (§6), Examples table in page order, Related with Built from.
8. **SKILL/** — holds no per-component content: a fact about one component lives in its
   `COMPONENT.md` and SKILL links it. Generated, never typed by hand (`bun run docs:build`): the
   category tree of `components.md`, the icon list and the triad rows of `api-contract.md`. Touch SKILL
   when the choice between components changes (`choosing.md`) or a shared rule changes. Every rule has
   one home — `ux.md` (what goes on a screen, friction), `choosing.md` (which component),
   `composition.md` (the page tree and the screens), `responsive.md` (widths, grids, breakpoints, the
   page panel), `api-contract.md` (the API vocabulary), `foundations.md` (grid, surfaces, type, colour),
   `motion.md`, `layouts.md` (the app frame), `SKILL.md` (the workflow and paths); every other file
   links to it, and no sentence repeats across files (`skill-duplicates`). `cheatsheet.md` (read first)
   and `checklist.md` are one-line imperatives; every checklist item links to the heading of the rule
   it checks. SKILL prose names only documented parts and props (`skill-api-names`). No symlinks: npm
   drops them. SKILL links component docs as `../src/<base>/<dir>/…`; `bun run skill:build` (the last
   step of `build`) copies them into the installable skill `dist/skill/` under `reference/` and fails
   on any broken link. The skill ships in the npm package; consumers install it with
   `npx prime-ui-kit skill` (`bin/prime-ui-kit.js`), never by copying `SKILL/`. Every ```tsx block in
   SKILL and README compiles against the kit (`skill-docs.test.ts`); a fragment is ```tsx partial,
   and the good half of a bad → good pair is its own ```tsx good block (JSX in the kit's scope, its
   placeholders declared with `// declare: …` lines). A UX bug seen in a screen built with the skill
   becomes three things in one change: a rule with bad → good in `ux.md` or `anti-slop.md`, a line in
   `checklist.md`, and a case in `evals/prime-ui-kit/evals.json` (run with the skill-creator evals;
   the starting screens in `evals/prime-ui-kit/files/` compile). A new or changed screen is the `screen`
   example of its main component (section entry, COMPONENT.md row) with a row in the screens index of
   `SKILL/composition.md` (checked against every `examples/screen.tsx`) and its section of rules there.
9. **README.md** — when the public surface changes (export, install step). Its components table is
   generated; the component count in README, `llms.txt` and the `package.json` description is checked
   against the component dirs.

Every page follows the standard; the docs contract has no exclusion list. Do not add one.

## 8. Definition of done

- `bun run verify` is green (biome, tsc, all tests incl. the docs contract, build).
- The docs contract passes for the component: kind declared in config and COMPONENT.md; every example
  listed once; slots allowed for the kind, in order, required ones present; descriptions name the same
  props as the JSDoc; example canon (JSDoc, function name, no inline style, no placeholder text);
  COMPONENT.md headings, Related lines and Examples table match; the API, Keyboard, ARIA and Labels
  sections equal what `api.ts` renders.
- Every guard finds no offender; no allowlist entry was added to get the change through.
- No copy of an existing kit block was added (§2); donors you extended are documented and tested.
- Behaviour, a11y, motion and visuals in both themes are not worse: check the page in the playground in
  light and dark.
- Commits stage explicit paths only, carry no AI attribution, and leave the tree clean.

## 9. Repository map

| Path | What |
|---|---|
| `tokens/` | `primitives.ts` → `semantic.ts` (the light theme) → `themes/dark.ts` (the dark overrides); `layers.ts` (the surface ladder), `hues.ts` (the palette hues), `naming.ts`; `bun run tokens:build` generates `src/styles/{tokens,theme-light,theme-dark}.css` and `src/internal/tokenDefaults.ts` (never edit those by hand) |
| `src/components/<dir>/` | one component: `X.tsx`, `X.module.css`, `X.test.tsx`, `api.ts`, `COMPONENT.md`, `examples/` |
| `src/layout/` | AppShell, Sidebar, BottomNav, Page (same structure) |
| `src/internal/` | shared mechanics: `states.ts` (vocabulary types, `stepDown`, `compactTier`, the named tier mappings), contexts (`ControlSizeContext` with `useHostTier`, `AnchorRectContext`, `disabledContext` — a disabled `Fieldset`), `context` (`createComponentContext`), `parts` (parts by element type, text parts), `Portal`, `polymorphic` (the ref type of an `as` element), `overlay/` (`layerStack`, `useFloatingLayer`, `FloatingPanel`, `focus`, `useOpenState`, `useAnchorName`, `useContainScroll`, `tooltipSurface`), `MenuGroup`, `FieldFrame`, `fieldCell` (a FieldList cell names the field inside by its column heading), `FieldCommit`, `FieldAction`, `ChoiceField`, `fieldClasses`, `iconLayout` (the leading / trailing icon split of Button and ButtonGroup), `barPlan` (the width plan of the page's top bar: `planBar`), `swatch`, `textFormatting` + `textFormattingToolbar` (Markdown formatting of a text field: Composer, Textarea), `HighlightMatch`, `formatLabel`, `listbox` (the listbox registry, keyboard and typeahead: Select, TagSelect, CommandMenu), `rovingFocus`, `useRangeSelection` (click / Shift / drag-paint selection of a list: DataTable rows, chat messages), `edgeAutoScroll` (scrolling near an edge during a drag: `createEdgeAutoScroll`), `scrollAncestors` (the scrollable boxes around an element), `useFlipList` (list items glide to a new order: Dnd, ChatList, Kanban), `swallowNextClick` (the click that ends a drag is no press), `longPress` (`useLongPress` and the touch gesture thresholds), `rowLink` (a row or a card that opens as a whole: its controls stay theirs), `nodeText` (the plain text of a node tree), `messageList` (the contract between `Chat.Messages` and its messages: selection store, row kinds, jumps), `messagePart` (the contract between a message and its content parts), `palette` (`hueOf`, a hue stable per id), `sticky` (`stickySurfaceClass` for a block-start sticky surface, which lets go on a short screen), `selectionIndicator` (the sliding indicator of a switcher, `revealInScroller`), `SwitcherScroller` (the one row of every switcher), `ToolRow` (the one row of tools and its chips line: `Page.Tools`, the DataTable `toolbar`, the Gantt toolbar), `richText` (the Markdown subset of a chat as React elements), `mediaPlayer` (the shared API and parts of VoicePlayer and VideoNote), `transfer` + `transferDisk` (the transfer of content, either way), `ring` (the one ring drawing: ProgressCircle, Spinner, the circle Button), `mediaDisk` (the still disk over media: a video's play mark), `glyphSwap` (a glyph cross-fade), `mediaPill` (the pill over media), `mediaSession` (one sound at a time), `audio` (Web Audio constructor, waveform length and peak scaling: the recorder, `getWaveform`), `transcript` (the transcript of a voice / video message), `readReceipts`, `usePendingChanges` (the pending state of a promise-returning handler), `leaveInPlace`, `leaveGuard` (`Page.Guard` holding a press on the navigation items, and `beforeunload`), `partPresence` (an optional part enters and closes up in place), `listPresence` (keyed rows enter and close up: ChatList, List), `RegionSwap` (the region swap: Crossfade, swapping regions inside components), `motionTiming` (motion tokens for JS: durations, timeouts, WAAPI timing), `progressSegments` + `ProgressLegend` (ProgressBar / ProgressCircle segments), `fileFormat`, `fileName`, `mediaKind`, `attachmentTile` + `useNearView` (FileUpload / Gallery tiles), `Disclosure` + `disclosure` (a part that folds open and closed), `CheckMark`, `surfaceDepth` (the depth ladder), `blockStack` (a dialog body tells a tab panel inside it to stack its blocks a section step apart), `autofill` (`useAutofill`, `AUTOFILL_OFF`, `AutofillScope`: a text field's autofill and password-manager opt-outs), `mediaSlot` (a leading media slot: Avatar / Thumbnail report themselves, the host drops its tile and sets their size), `imageSlot`, `fileSize` (`formatFileSize`), `formatClock`, `mediaFrame` (`firstFrame`), `MorphText`, `RollingNumber`, `ChartTooltip` (the chart tooltip: ChartFrame, Sparkline), `RowAction` (the icon action beside a row: DescriptionList, Sidebar), `slot`, `cx`, `data-attributes`, `interactiveElement` (one element that renders as a button, a link or a slot), `labels` (`useLabels`: `labels` defaults with overrides), `hasContent` (whether a node draws something), `namedRole` (the role of a generic element the consumer names), `formatNumber` (the default number display), `controlValue` (`setControlValue`: write a value into a native control as typing does), `highlightTsx` (the TS / TSX tokenizer of CodeBlock), `tokenDefaults` (generated token values in JS, the defaults of `readCssLengthPx`); CSS: `overlayMotion`, `enterMotion`, `press` (press feedback), `chartTooltip`, `swapMotion`, `floatingSurface`, `sheet`, `menu`, `fieldSurface`, `fieldTier`, `fieldTrigger`, `palette`, `chipTier`, `iconBox`, `textTone`, `textRole`, `touchTarget`, `sticky`, `hairline` (the faint zone line of a surface), `statusLoop` (status loops — recording, live, typing — and the blink of a pointed element) |
| `src/hooks/` | `useModalLayer`, `useInertSiblings`, `useScrollLock`, `usePresence`, `usePosition`, `useControllableState`, `useMergedRefs`, `useImageStatus`, `useEnterConfirm`, `useEdgeOverflow`, `useElementSize` (an element's size as state, `useResizeEffect` for a host's own re-layout), `useScrollRegion` (what a ScrollContainer lets its content ask for), `useMediaQuery`, `useSwipeDismiss`, `useVirtualRows` (rows of measured height rendered only in view: Gantt, Chat, DataTable, TagSelect), `useLoadMore` (load more at the end of a list's own scroller), `useTokenValue` (public), `useUploadQueue` (public: the upload queue of FileUpload), `useStableValue` (a value that keeps its identity while its content is equal), `useDraft` (the draft text of an input bound to a value, committed by the host), `breakpoints` (the media queries the kit reads in TypeScript), `floatingPosition` (the placement geometry of `usePosition`: side, align, flip) |
| `src/icons/` | public `<Icon name>` registry and `createIcon`; `glyphs/` (Lucide drawings, one gesture each), `glyph.tsx` (`defineGlyph`), `glyphMotion.module.css` (gesture vocabulary), `iconPlay.ts` (when gestures play) — the only icon source for components; notices in `THIRD_PARTY_NOTICES` |
| `src/index.ts`, `src/components/index.ts`, `src/layout/index.ts` | public exports |
| `playground/pageStandard.ts` | page kinds, slot vocabulary, `KIND_SLOTS`, `PROP_SLOTS` |
| `playground/components/ComponentPage.tsx` | the one page renderer and `ComponentPageConfig` |
| `playground/exampleRegistry.ts` | glob loader of every example (lazy module + lazy raw source) |
| `playground/playgroundPages.tsx`, `categories.ts` | routes, sidebar, search — built from the section configs by glob |
| `playground/sections/<Name>Section.tsx` | one page per component: data only, `export const page: ComponentPageConfig` |
| `playground/foundation/` | token pages (Typography's component docs live here); `snippets/` holds the playground's code snippets as compiled modules, imported with `?raw` |
| `scripts/` | `build-tokens.ts`, `bundle-lib.ts` (writes the `api.ts` prose into the `.d.ts`), `build-skill.ts`, `build-docs.ts` + `scripts/docs/` (`componentApi.ts` — the api schema and markdown; `aggregates.ts` — the README / SKILL indexes, the icon list, the triad rows; `apiTypes.ts` — the TypeScript side of the api contract; `links.ts` — the one link checker; `vocabulary.ts` — the API vocabulary as data) |
| `src/test/docs-contract.test.ts` | docs / examples / playground / api contract for every component, incl. the render smoke test of every screen (shared helpers in `contract-utils.ts`) |
| `src/test/*.test.ts(x)`, `src/styles/*.test.ts` | the guards of the mechanical rules: `api-types` (api.ts against the types), `a11y-examples` (every example rendered: named roles, IDREFs, accessible names), `overlayConformance` and `field-conformance` (shared behaviour suites), `refs` (paths, `§` and `bun run` references, this map), `source-rules`, `unused-exports`, `internal-coverage` (every runtime internal has a test), `glyph-swap`, `test-hygiene`; CSS: `literals`, `tokens`, `donor-override`, `touch`, `motion-perf`, `state-motion`, `sticky`, `text-role`, `shared-css`, `a11y-css`, `icon-size`, `css-modules`, `scroll` |
| `src/test/part-refs.test.tsx` | refs of every part listed in the generated `part-refs.generated.ts`: a typed check, runtime cases for merged or redirected refs |
| `SKILL/` | agent skill for consumer projects: `SKILL.md` (entry and workflow), `cheatsheet` (read first), `ux` (what goes on a screen: brief, data shape → layout, label economy, copy, friction), `choosing`, `components` (generated index), `composition` (screen assembly guide and the screens index), `layouts` (the app frame), `responsive` (narrow screens, touch, the page's top bar), `api-contract`, `foundations`, `motion`, `anti-slop`, `checklist` |
| `evals/prime-ui-kit/` | skill evals (skill-creator `evals.json`): prompts with checkable expectations for the UX bugs the skill must not repeat; `files/` holds the screens the «change an existing screen» cases start from. Not shipped |
| `src/<base>/<dir>/examples/screen.tsx` | whole screens: the `screen` example of a component (+ `screen.module.css`), indexed with their rules in `SKILL/composition.md`; the playground shows them in `playground/components/ScreenStage.tsx` |
| `playground/composition/CompositionPage.tsx` | the «Принципы» guidance page (in the foundations group): how a screen is assembled, links to every screen |
| `src/test/skill-docs.test.ts` | SKILL and README tsx snippets typecheck against the kit (fragments: ```tsx partial, good halves: ```tsx good); the eval files compile; SKILL and `llms.txt` links resolve; SKILL names only documented parts and props, every checklist item links to its rule, no rule is written twice; the component counts and the screens index |
| `llms.txt` | entry point for LLMs (llms.txt convention): links to `SKILL/cheatsheet.md`, `SKILL.md`, components / choosing / composition (with the screens index), foundation |

## Release

Before every push the repo is in its production state: no screenshots, images, logs, probes,
temporary examples or configs, backups, empty folders or files nothing references (a script, doc,
example, glyph, playground module); `git status` shows only the change being pushed (plus the
untracked `kit-gaps.md` / `kit-done.md`). Check with `git ls-files` and `git status --ignored`; keep
working files in the session scratchpad, never in the tree.

`.github/workflows/ci.yml`: every push to `main` runs `bun run verify`; then, if the `package.json`
version is not on npm yet, publishes it. Bump `version` to release (`npm publish` runs `prepublishOnly`: clean + build). `package.json`
`files` ships `dist` (with the built skill in `dist/skill/`), `bin/` (`prime-ui-kit skill [dir]`,
Node built-ins only), styles, every `COMPONENT.md` and `examples/**`. Every JS file in `dist/` starts
with `"use client"` (an esbuild banner, checked by `bundle-lib.ts`), so the package works from
Next.js App Router server components. JS entries: `prime-ui-kit` (`src/index.ts`),
`prime-ui-kit/color-picker` (`src/color-picker.ts`, the only code on `react-aria-components`, an
optional peer) and `prime-ui-kit/icons` (`src/icon-set.ts`, every glyph as `<Name>Icon`, generated by
`bun run icons:add`); shared code is split into `dist/chunks/`. Nothing in the main entry may import
react-aria. One `bundle.css` holds every component's styles; `fonts.css` and `reset.css` are opt-in.
No runtime dependencies: `react` / `react-dom` / `date-fns` are peers, `react-aria-components` an
optional peer; `lucide-react` is a dev dependency only (glyph source for `icons:add`, tests, playground)
and `createIcon` takes any SVG component (`react-router-dom` is a dev dependency of the playground and
the router examples).
