# Checklist before handing over a screen

Answer every item yes or no. Any «no» is fixed before handing over.

## Grid and spacing
- [ ] Every spacing, size and gap in my CSS is a `--prime-space-*` (or another `--prime-*`) token on the 4px grid.
- [ ] Spacing is `gap` on the parent; no margins on children; no outer padding duplicating `AppShell.Main` / `PageContent.Body`.
- [ ] Proximity holds: field→field 20, inline controls 8, group→group 32, section→section 40–48.
- [ ] Inside a group things are visibly closer than between groups.

## Sizes and alignment
- [ ] Default size `m`, unless the whole region is deliberately dense (`s`) or prominent (`l`).
- [ ] Every row of controls uses one size; their heights line up.
- [ ] Icon-only buttons are square and have `aria-label`.
- [ ] Controls inside table cells are one tier below the table; no CSS sets table row or cell heights.

## Text
- [ ] Every text goes through a kit component or `Typography.Root` with a role; no custom font sizes/weights.
- [ ] One page title (`PageContent.Title`, `<h1>`); headings descend without skipping levels
      (`Card.SectionTitle as="h2"` directly under the page title).
- [ ] Secondary text uses `tone="secondary"`/`"muted"`; numbers in tables and prices are tabular.
- [ ] No filler copy, no emoji, no text that restates the heading.

## Tokens and surfaces
- [ ] No raw px/rem/hex, no `--prime-ref-*`, no inline `style`, no overrides of kit internals
      (allowed: `@media` conditions and length props a COMPONENT.md documents, like DataTable column `width`).
- [ ] Blocks are separated by fill and air, not borders; no card inside a card without reason.
- [ ] My own bounded blocks use `--prime-color-card-bg` and `--prime-card-radius`.

## Reuse
- [ ] Every repeated-looking element is one component (kit or `shared/ui`), not copies.
- [ ] No `div` where a kit component exists (Divider, Kbd, Badge, Card, LinkButton, Typography).
- [ ] Every overlay (Modal, Drawer, Popover, Dropdown, Tooltip, Select) is a kit component.

## Hierarchy
- [ ] One primary action per area (an empty state's action replaces the header's, not duplicates it);
      others `soft`/`ghost`/`outline` neutral; destructive is `tone="danger"`.
- [ ] The same action has the same label everywhere on the screen.
- [ ] Primary action is last in action rows (forms, modals).

## States
- [ ] Hover / focus-visible come from the kit (nothing removed).
- [ ] Disabled controls use `disabled`; async actions use `loading` (no hand-made spinners).
- [ ] Fields show `hint` and `error` (with `invalid`), `required` / `optional` marked.
- [ ] Data blocks have loading, empty and error states (DataTable `loading` / `empty` / `error`, EmptyPage).
- [ ] Destructive irreversible actions confirm in a Modal; results of submitted actions show a Notification
      (instant toggles show one only on failure).
- [ ] No hand-written animation on kit parts; custom motion uses motion tokens, `transform`/`opacity` only.

## Themes and widths
- [ ] Screen checked with `data-theme="dark"`: no hard-coded colors, everything readable.
- [ ] Screen works at 320px: no horizontal page scroll, grids collapse, toolbars wrap, long text truncates or wraps.
- [ ] Below 768px a menu button in `AppShell.Header` opens the Sidebar; no empty header bar on desktop.

## Keyboard and a11y
- [ ] Every action is reachable by Tab in a logical order and works with Enter/Space.
- [ ] Every field has a label (visible, or `aria-label` for toolbar search); icons are `aria-hidden` or labelled.
- [ ] Meaning is never color-only (status badges have text, errors have a message).
- [ ] Custom `labels` are passed where default Russian strings do not fit the context.
