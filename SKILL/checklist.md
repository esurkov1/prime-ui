# Checklist before handing over a screen

Answer every item yes or no. Any «no» is fixed before handing over.

## Composition
- [ ] The screen starts from the closest screen in [composition.md](composition.md#screens) (list, detail,
      settings, form in a Drawer, dashboard, states, messenger) and keeps its skeleton.
- [ ] The page titles itself in its `AppHeader`: `AppHeader.Title`, a line of data in
      `AppHeader.Description`, the page's tools in `AppHeader.Tools` (`PageToolbar`); main has no
      `PageContent.Header`. Only a document page (settings, a long form, help) has `PageContent.Header`
      and no title in the header. Blocks in `PageContent.Body`.
- [ ] The header row holds only what this page needs: no global search, no app-wide buttons.
- [ ] Cards only for standalone blocks; no card around a table, a single field or the whole page.

## UX ([ux.md](ux.md))
- [ ] I wrote the brief first: who and what for, the data and its shape, the main action, the states, the narrow screen.
- [ ] Every entity is laid out by its shape: one record is one row or one block, never split over lines;
      records a person edits are a `FieldList`, records a person reads a `DataTable`.
- [ ] Labels on a form of rows ≤ columns + the list label: no label repeated per row, none numbered
      («Пункт 1»), none repeating its heading; a unit in one place (the field's affix).
- [ ] No text that explains the layout; every hint says what the person cannot see.
- [ ] Buttons say the verb and the object; errors say how to fix it; empty states offer the next step.
- [ ] Money, numbers and dates through `Intl` with `ru-RU`; «ёлочки», `…`, a non-breaking space before units.
- [ ] Friction matches the cost: reversible → do it and offer «Отменить»; irreversible → `ConfirmDialog`
      naming the thing and the loss; bulk → the count.
- [ ] A disabled control says why when the reason is off screen; an action without permission is hidden.
- [ ] Defaults prefill what the system knows; each field has the control and `inputMode` its data needs;
      rare settings sit behind a disclosure.
- [ ] Tabs, filters, search, page and the open record are in the URL.
- [ ] I looked at the screen in a browser: both themes, 1280 and 375 px, the longest real values, an
      empty list, an error on every field.

## Grid and spacing
- [ ] Every spacing, size and gap in my CSS is a `--prime-space-*` (or another `--prime-*`) token on the 4px grid.
- [ ] Spacing is `gap` on the parent; no margins on children; no outer padding duplicating `AppShell.Main` / `PageContent.Body`.
- [ ] Proximity holds: inline controls 8, tile→tile 16 (one `PageContent.Grid`), field→field 20, block→block 24, group→group 32, section→section 40 (`PageContent.Section`).
- [ ] Inside a group things are visibly closer than between groups.

## Sizes and alignment
- [ ] Default size `m`, unless the whole region is deliberately dense (`s`) or prominent (`l`).
- [ ] Every row of controls uses one size; their heights line up.
- [ ] Icon-only buttons are square (round `shape="circle"` only for media and transfer actions) and have
      `aria-label`.
- [ ] Controls inside table cells are one tier below the table; no CSS sets table row or cell heights.

## Text
- [ ] Every text goes through a kit component or `Typography` with a role; no custom font sizes/weights.
- [ ] One page title, one `<h1>` (`AppHeader.Title`, or `PageContent.Title` on a document page);
      headings descend without skipping levels (`Card.Title as="h2"` directly under the page title).
- [ ] Secondary text uses `tone="secondary"`/`"muted"`; numbers in tables and prices are tabular.
- [ ] No filler copy, no emoji, no text that restates the heading.

## Tokens and surfaces
- [ ] No raw px/rem/hex, no `--prime-ref-*`, no inline `style`, no overrides of kit internals
      (allowed: `@media` conditions and length props a COMPONENT.md documents, like DataTable column `width`).
- [ ] Every scroll region is a `ScrollContainer` (no `overflow: auto` of my own); kit components are not
      wrapped in another one.
- [ ] Blocks are separated by fill and air, not borders; no card inside a card without reason.
- [ ] My own bounded blocks are `Card`s (or plain tiles on `--prime-color-layer-nested` +
      `--prime-card-radius`); no hard-coded `--prime-color-layer-<n>-*`.
- [ ] Hover never merges: a whole clickable card lifts (`--prime-shadow-overlay`) instead of a wash;
      a part touching its surface's edge hovers with `--prime-color-fill-muted-hover`;
      `--prime-color-fill-subtle` only on transparent, padded rows and ghost controls. Checked in both
      themes, on the page and inside a card.

## Reuse
- [ ] Every repeated-looking element is one component (kit or `shared/ui`), not copies.
- [ ] No `div` where a kit component exists (Divider, Kbd, Badge, Card, LinkButton, Typography).
- [ ] Every overlay (Modal, ConfirmDialog, Drawer, Sheet, Popover, Dropdown, Tooltip, CommandMenu, Select, MediaViewer) is a kit component.
- [ ] Properties of one record are a `DescriptionList`, uploads go through `useUploadQueue`, a chat is
      `Chat` (`Chat.Messages` of `Message.Root`, `Chat.Footer` with `Composer.Root`), an album is `Gallery`,
      a schedule is `Gantt` — no hand-made copies of them.

## Hierarchy
- [ ] One primary action per area (an empty state's action replaces the header's, not duplicates it);
      others `soft`/`ghost`/`outline` neutral; destructive is `tone="danger"`.
- [ ] The same action has the same label everywhere on the screen.
- [ ] Primary action is last in action rows (forms, modals).

## States
- [ ] Hover / focus-visible come from the kit (nothing removed).
- [ ] Disabled controls use `disabled`; async actions use `loading` (no hand-made spinners).
- [ ] Fields show `hint` and `error` (a non-empty `error` is already invalid); only the minority is marked `required` or `optional`.
- [ ] Data blocks have loading, empty and error states (DataTable `loading` / `empty` / `error`, EmptyPage).
- [ ] Every region swaps its states through `Crossfade` (nothing flips, the page below does not jump);
      loading is a `Skeleton` in the data's geometry, a `Spinner` only where there is no shape to hold.
- [ ] While a form saves, its submit button is `loading` and its fields are disabled by `Fieldset
      disabled` (the submit button outside the Fieldset).
- [ ] Destructive irreversible actions confirm in a `ConfirmDialog` (async `onConfirm`), reversible ones
      offer «Отменить» instead; a form that stays on screen after saving says
      «Сохранено» on its button, a form that goes away (closes, navigates) shows a Notification; failures
      always show a Notification or a field `error` (instant toggles show one only on failure).
- [ ] Overlays are always mounted and driven by `open` only (no `{open && …}`, no changing `key`), so they
      close smoothly.
- [ ] No hand-written animation on kit parts; custom motion uses motion tokens, `transform`/`opacity` only.
- [ ] Every glyph comes from the kit — `<Icon name>`, else `prime-ui-kit/icons`, `createIcon` only for one
      neither has; no raw `lucide-react` in JSX, no other icon library, no inline `<svg>`, no icon
      animated by hand.
- [ ] Every state change moves through the kit ([motion.md](motion.md)): a changed button label is new
      children (it morphs), a long action is `progress`, a counter is a number (it rolls), a new password
      has `strength`, an accepted code is `success`; nothing moves on frequent or keyboard actions.

## Themes and widths
- [ ] Screen checked with `data-theme="dark"`: no hard-coded colors, everything readable.
- [ ] Screen works at 320px: no horizontal page scroll, grids collapse, toolbars rearrange (`PageToolbar`) and switchers scroll, long text truncates or wraps.
- [ ] The responsive checklist in [responsive.md](responsive.md#checklist-before-handing-a-screen-over) passes: widths 320 · 390 · 768 · 1024 · 1280 · 1920, the primary action in the top row, one height per row, no hover-only functions, zoom 400%.
- [ ] Below 768px `AppHeader.MenuButton` opens the Sidebar; the page title stays in the header on every width, the page's tools wrap under it.

## Keyboard and a11y
- [ ] Every action is reachable by Tab in a logical order and works with Enter/Space.
- [ ] Every field has a label (visible, or `aria-label` for toolbar search); icons are `aria-hidden` or labelled.
- [ ] Meaning is never color-only (status badges have text, errors have a message).
- [ ] Custom `labels` are passed where default Russian strings do not fit the context.
