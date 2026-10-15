# Checklist before handing over a screen

Answer every item yes or no. Any «no» is fixed before handing over. Each item links to the rule it
checks.

## Composition
- [ ] The screen starts from the closest working screen and keeps its skeleton ([screens](composition.md#screens)).
- [ ] One `Page.Title` per page, always an `<h1>`: a work screen titles itself in the `Page.Heading` of its `Page.TopBar`, a document page or an overview in a `Page.Header` in the flow ([page skeleton](composition.md#1-page-skeleton)).
- [ ] The top bar holds only this page's groups — `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — no app-wide header or global search ([the top bar](composition.md#the-top-bar)).
- [ ] A nested record's path ends in its title on one line inside `Page.Heading`; no title row under the path ([the top bar](composition.md#the-top-bar)).
- [ ] Every button of the page is in one `Page.Actions`, the primary last, each with a `Button.Icon` ([the top bar](composition.md#the-top-bar)).
- [ ] `SmartFilter.Root` wraps `Page.Root`; its toolbar is in `Page.Tools`, its chips in `Page.Chips` ([the top bar](composition.md#the-top-bar)).
- [ ] A Card only for a standalone titled block — never around a table, a single field or the page ([surfaces](composition.md#4-surfaces)).

## UX ([ux.md](ux.md))
- [ ] I wrote the five-line brief before the JSX ([brief](ux.md#1-brief-before-code)).
- [ ] Every entity is laid out by its shape: a record is one row or one block ([data shape](ux.md#2-the-shape-of-the-data-decides-the-layout)).
- [ ] Labels on a form of rows ≤ columns + the list label; none repeated, numbered or repeating its heading ([label economy](ux.md#3-label-economy)).
- [ ] No text explains the layout; every hint says what the person cannot see ([label economy](ux.md#3-label-economy)).
- [ ] Buttons say the verb and the object, errors say how to fix it, empty states offer the next step ([words](ux.md#4-words)).
- [ ] Money, numbers and dates go through `Intl` with `ru-RU`, in Russian typography ([words](ux.md#4-words)).
- [ ] The friction of every action matches the cost of a mistake ([friction](ux.md#5-friction-matches-the-cost-of-a-mistake)).
- [ ] A form in a dialog holds its dismiss with `Modal.Guard` / `Drawer.Guard`, a form that is the page with `Page.Guard` ([friction](ux.md#5-friction-matches-the-cost-of-a-mistake)).
- [ ] A disabled control says why when the reason is off screen; an action without permission is hidden ([nothing to guess](ux.md#6-nothing-to-guess)).
- [ ] A request a value starts — a simulated one too — is cancelled when the value changes again ([nothing to guess](ux.md#6-nothing-to-guess)).
- [ ] Tabs, filters, search, page and the open record are in the URL ([nothing to guess](ux.md#6-nothing-to-guess)).
- [ ] Defaults prefill what the system knows; each field has the control and `inputMode` of its data ([ask less](ux.md#7-ask-less)).
- [ ] I looked at the screen in a browser, filled badly ([the visual check](ux.md#9-look-at-it-before-handing-it-over)).

## Grid and spacing
- [ ] Every length in my CSS is a `--prime-*` token on the 4px grid ([grid](foundations.md#1-4px-grid)).
- [ ] Spacing is `gap` on the parent; no margins, no outer padding of my own ([rhythm](composition.md#2-rhythm--the-4px-grid)).
- [ ] The proximity scale holds: closer inside a group than between groups ([proximity](foundations.md#2-proximity-scale)).

## Sizes and alignment
- [ ] Default size `m`; a tier changes for a whole region, never for one control ([the host tier](api-contract.md#size-and-the-host-tier)).
- [ ] Every row of controls uses one size and its heights line up ([density](composition.md#5-density-and-size)).
- [ ] Controls in table cells are one tier below the table; no CSS sets row or cell heights ([size axis](foundations.md#3-size-axis)).
- [ ] Icon-only buttons are square (round only for media and transfers) and named ([icons](api-contract.md#icons)).

## Text
- [ ] Every text goes through a kit part or a `Typography` role ([typography](foundations.md#7-typography)).
- [ ] One page title, one `<h1>`; headings descend without skipping levels ([hierarchy](composition.md#3-hierarchy--air-first-then-type)).
- [ ] Text colour comes from `tone`; numbers in tables and prices are tabular ([text colour](foundations.md#text-colour)).
- [ ] No filler copy, no emoji, no text that restates the heading ([decoration](anti-slop.md#8-decoration-and-filler)).

## Tokens and surfaces
- [ ] No raw values, `--prime-ref-*`, inline `style` or overrides of kit internals ([styling](api-contract.md#styling-your-own-wrappers)).
- [ ] Every scroll region is a `ScrollContainer`; kit components are not wrapped in another one ([ready components](anti-slop.md#7-div-instead-of-a-ready-component)).
- [ ] Blocks are separated by fill and air; a card in a card only as a deliberate next layer ([card in a card](foundations.md#card-in-a-card)).
- [ ] My own bounded blocks are `Card`s or the plain nested tile ([your own block](foundations.md#your-own-bounded-block)).
- [ ] No hover merges with its neighbour, in both themes, on the page and in a card ([hover](anti-slop.md#3a-hover-that-merges-with-the-neighbour)).

## Reuse
- [ ] Every repeated-looking element is one component, not copies ([missing components](composition.md#14-when-the-kit-has-no-ready-component)).
- [ ] No `div` where a kit component exists ([ready components](anti-slop.md#7-div-instead-of-a-ready-component)).
- [ ] Every overlay is a kit component ([overlays](composition.md#10-overlays)).
- [ ] Record properties, uploads, a chat, an album and a schedule are the kit's components ([choosing](choosing.md#2-inside-a-category)).

## Hierarchy
- [ ] One primary action per area, last in its row; the rest `soft` / `ghost` / `outline` neutral ([actions](composition.md#6-actions)).
- [ ] The same action has the same label and variant everywhere on the screen ([secondary actions](api-contract.md#secondary-actions)).

## States
- [ ] Hover and focus-visible come from the kit, nothing removed ([focus](foundations.md#10-focus-and-motion)).
- [ ] Busy controls use `loading`, unavailable ones `disabled` — no hand-made spinners ([loading](api-contract.md#loading-without-datatable)).
- [ ] Fields show `hint` and `error`; only the minority is marked `required` or `optional` ([forms](api-contract.md#forms)).
- [ ] Every data block has its loading, empty and error states ([feedback](composition.md#9-feedback)).
- [ ] Every region swaps its states through `Crossfade`, loading is a `Skeleton` of the data ([continuity](foundations.md#11-state-changes-are-continuous)).
- [ ] A `Page.Description` that waits for data stays mounted with `loading`, so the title in the bar never jumps ([screen states](composition.md#screen-states)).
- [ ] A KPI tile that waits for its figure is `Card.Root loading`, its parts mounted ([inside a category](choosing.md#2-inside-a-category)).
- [ ] While a form saves, its submit is `loading` and its fields sit in a `Fieldset disabled` ([forms](api-contract.md#forms)).
- [ ] A save that stays says «Сохранено» on its button, one that goes away notifies, a failure always shows ([feedback](composition.md#9-feedback)).
- [ ] Overlays stay mounted and are driven by `open` only ([motion mistakes](motion.md#6-mistakes)).
- [ ] No hand-written animation on kit parts; my own motion uses the motion tokens ([your own motion](motion.md#4-rules-for-your-own-motion)).
- [ ] Every glyph comes from the kit, none animated by hand ([icons](api-contract.md#icons)).
- [ ] Every state change moves through the kit ([what the kit animates](motion.md#1-what-the-kit-already-animates--do-not-rebuild-it)).

## Themes and widths
- [ ] The screen passes the responsive checklist in both themes ([responsive](responsive.md#checklist-before-handing-a-screen-over)).
- [ ] On a phone the Sidebar opens from the menu button the top bar draws; the page title stays in the bar ([app frame](layouts.md#app-frame-once-per-app)).
- [ ] At every width the bar fits: tools on their own line, then icon-only buttons, then «⋯», the primary always on screen ([the page's top bar](responsive.md#the-pages-top-bar--pagetopbar)).

## Keyboard and a11y
- [ ] Every action is reachable by Tab in reading order and works with Enter / Space ([interaction](responsive.md#interaction-and-accessibility)).
- [ ] Every field has a label (visible, or `aria-label` for a toolbar search) ([forms](api-contract.md#forms)).
- [ ] Meaning is never colour alone ([tone and color](foundations.md#6-tone-and-color)).
- [ ] A toned hint says its status in words; a validation problem is `error`, never a `danger` hint ([forms](api-contract.md#forms)).
- [ ] A refused sign-in marks its fields `invalid` and says why in a hidden live region, with no Banner ([feedback](composition.md#9-feedback)).
- [ ] Custom `labels` replace the default Russian strings where they do not fit ([system strings](api-contract.md#shared-vocabulary-exported-types)).
