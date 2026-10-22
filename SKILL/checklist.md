# Checklist before handing over a screen

Answer every item yes or no. Any «no» is fixed before handing over. Each item links to the rule it
checks.

## Composition
- [ ] The screen starts from the closest working screen and keeps its skeleton ([screens](composition.md#screens)).
- [ ] One `Page.Title` per page, always an `<h1>`: every screen of data — dashboards and analytics too — titles itself in the `Page.Heading` of its `Page.TopBar`, only a document page in a `Page.Header` in the flow; no `collapse` bar without a heading ([page skeleton](composition.md#1-page-skeleton)).
- [ ] The top bar holds only this page's groups — `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips` — no app-wide header or global search ([the top bar](composition.md#the-top-bar)).
- [ ] A nested record's path ends in its title on one line inside `Page.Heading`; no title row under the path ([the top bar](composition.md#the-top-bar)).
- [ ] Every button of the page is in one `Page.Actions`, the primary last, each with a `Button.Icon` ([the top bar](composition.md#the-top-bar)).
- [ ] `SmartFilter.Root` wraps `Page.Root`; its toolbar is in `Page.Tools`, its chips in `Page.Chips` ([the top bar](composition.md#the-top-bar)).
- [ ] A section's sub-pages are route links (`SegmentedControl.Item asChild`) in its `Page.Tools`; the title stays the section and its Sidebar item stays current on every sub-route — no second Sidebar level, no tab strip in the body ([a section with sub-pages](composition.md#a-section-with-sub-pages)).
- [ ] The sub-page switch stands in the heading row at the end edge, before the page's buttons — not on a line of its own under the title on a wide screen ([a section with sub-pages](composition.md#a-section-with-sub-pages)).
- [ ] A pane people pick from (dialogs, threads) reads search → create → list: the create button is `ChatList.Actions` at the top, never under the list; only a FieldList adds under its rows ([where the create button goes](composition.md#where-the-create-button-goes)).
- [ ] A section page's search, «Фильтр» and «Вид» are in `Page.Tools` and its chips in `Page.Chips`, the table without a `toolbar`; only a table block among other blocks keeps its own `toolbar` / `toolbarChips` ([where the filters go](composition.md#where-the-filters-go)).
- [ ] A table section has an `options` filter field for each categorical column and a `date-range` field per date column, its value in the URL ([where the filters go](composition.md#where-the-filters-go)).
- [ ] Actions on selected rows are `renderSelectionActions` — one «Действия · N» menu added to the tools row, which stays ([controls of a table](composition.md#controls-of-a-table)).
- [ ] Creating one of several kinds whose forms differ is a button with a `Dropdown` of kinds (grouped by family), a pick opens that kind's form; no choosing step and «Далее» inside a dialog ([a kind that leads to its own form](choosing.md#a-kind-that-leads-to-its-own-form)).
- [ ] A Card only for a standalone titled block — never around a table, a single field or the page ([surfaces](composition.md#4-surfaces)).
- [ ] A titled panel carries its heading in its `Card.Header` and stacks in the flow; no heading column beside a panel ([surfaces](composition.md#4-surfaces)).
- [ ] A DataTable's row grip and column order follow the rule: grip at the end, columns by `columnOrder` saved with `hiddenColumns` ([choosing](choosing.md#3-pairs-that-are-easy-to-confuse)).
- [ ] The column chooser is `columnsMenu` only over a row-actions column, else `DataTableColumnsMenu` beside the table's search; a DataTable `toolbar` holds the table's controls unwrapped, never a lone button ([controls of a table](composition.md#controls-of-a-table)).
- [ ] A rich board card is made of the Kanban card parts (zones, title with number, resources, facts, a `fullWidth` next step), its hideable fields a `KanbanFieldsMenu` beside the filter, every card in `items` ([sales pipeline board](composition.md#sales-pipeline-board)).

## UX ([ux.md](ux.md))
- [ ] I wrote the five-line brief before the JSX ([brief](ux.md#1-brief-before-code)).
- [ ] Every entity is laid out by its shape: a record is one row or one block ([data shape](ux.md#2-the-shape-of-the-data-decides-the-layout)).
- [ ] A FieldList row shows its trash in sight whatever its columns; `rowActions="menu"` only on a reorderable touch-first list; `variant` by the rule ([forms](composition.md#7-forms)).
- [ ] A section named after a set of records shows the records, with an action per row ([data shape](ux.md#2-the-shape-of-the-data-decides-the-layout)).
- [ ] Records of one kind are one list in their real order; rows the system fixes are `locked` in it, never a second section ([data shape](ux.md#2-the-shape-of-the-data-decides-the-layout)).
- [ ] Every heading names what nothing else names: no section over a block with its own title, no first block repeating its tab ([label economy](ux.md#3-label-economy)).
- [ ] Every hint, limit, counter and range line serves the task; none is on because the prop exists, and a `max` worth knowing is in `hint` ([label economy](ux.md#3-label-economy)).
- [ ] Labels on a form of rows ≤ columns + the list label; none repeated, numbered or repeating its heading ([label economy](ux.md#3-label-economy)).
- [ ] No text explains the layout; every hint is two to five words the label and the control leave out, never the obvious outcome ([label economy](ux.md#3-label-economy)).
- [ ] Every setting sits with what it governs, as a field beside its neighbours; a stored choice is a `Select`, no section holds one setting ([where a setting lives](ux.md#10-where-a-setting-lives)).
- [ ] No button text repeats its icon's verb («+ Оплата», never «+ Добавить оплату»); a bare verb is icon-only with `aria-label` and a `Tooltip`; the name and the tooltip say the whole action («Новая оплата»); a button without an icon says the verb and the object ([words](ux.md#4-words)).
- [ ] Errors say how to fix it, empty states offer the next step ([words](ux.md#4-words)).
- [ ] Money, numbers and dates go through `Intl` with `ru-RU`, in Russian typography ([words](ux.md#4-words)).
- [ ] The friction of every action matches the cost of a mistake ([friction](ux.md#5-friction-matches-the-cost-of-a-mistake)).
- [ ] A form in a dialog holds its dismiss with `Modal.Guard` / `Drawer.Guard`, a form that is the page with `Page.Guard` ([friction](ux.md#5-friction-matches-the-cost-of-a-mistake)).
- [ ] A reversible action from a button that stays in place gets a `countdown` undo window (an outward one `countdownMode="delay"`, the action in `onConfirm`), not a hand-made timer or a second undo toast ([friction](ux.md#5-friction-matches-the-cost-of-a-mistake)).
- [ ] A disabled control says why when the reason is off screen; an action without permission is hidden ([nothing to guess](ux.md#6-nothing-to-guess)).
- [ ] A request a value starts — a simulated one too — is cancelled when the value changes again ([nothing to guess](ux.md#6-nothing-to-guess)).
- [ ] Tabs, filters, search, page and the open record are in the URL ([nothing to guess](ux.md#6-nothing-to-guess)).
- [ ] Defaults prefill what the system knows; each field has the control and `inputMode` of its data ([ask less](ux.md#7-ask-less)).
- [ ] `autoComplete` tokens only on sign-in and sign-up fields (`LoginForm.Form`, a password change); no token on a search or a record field ([ask less](ux.md#7-ask-less)).
- [ ] No search, filter or record field (other than a record's e-mail) says «username», «login», «email», «логин», «почта» in its placeholder, label, `name` or `id` — Safari offers saved logins there ([ask less](ux.md#7-ask-less)).
- [ ] I looked at the screen in a browser, filled badly ([the visual check](ux.md#9-look-at-it-before-handing-it-over)).

## Grid and spacing
- [ ] Every length in my CSS is a `--prime-*` token on the 4px grid ([grid](foundations.md#1-4px-grid)).
- [ ] Spacing is `gap` on the parent; no margins, no outer padding of my own ([rhythm](composition.md#2-rhythm--the-4px-grid)).
- [ ] The proximity scale holds: closer inside a group than between groups ([proximity](foundations.md#2-proximity-scale)).

## Sizes and alignment
- [ ] Default size `m`; a tier changes for a whole region, never for one control ([the host tier](api-contract.md#size-and-the-host-tier)).
- [ ] Every row of controls uses one size and its heights line up ([density](composition.md#5-density-and-size)).
- [ ] A reorderable row's toggle leads it and the grip ends it; a plain settings row ends with its toggle ([list rows](composition.md#list-rows)).
- [ ] Controls in table cells are one tier below the table; no CSS sets row or cell heights ([size axis](foundations.md#3-size-axis)).
- [ ] A chip in one row with controls is two sizes up (`l` beside `xs`, `xl` beside `s`); beside `m` and larger the whole row is fields ([chips beside fields](foundations.md#chips-beside-fields)).
- [ ] Icon-only buttons are square (round only for media and transfers) and named ([icons](api-contract.md#icons)).

## Text
- [ ] Every text goes through a kit part or a `Typography` role ([typography](foundations.md#7-typography)).
- [ ] One page title, one `<h1>`; headings descend without skipping levels ([hierarchy](composition.md#3-hierarchy--air-first-then-type)).
- [ ] Text colour comes from `tone`; numbers in tables and prices are tabular ([text colour](foundations.md#text-colour)).
- [ ] No filler copy, no emoji, no text that restates the heading ([decoration](anti-slop.md#8-decoration-and-filler)).

## Colour
- [ ] Every hue answers «what is this» or «what state is it in»; none decorates ([tone and color](foundations.md#6-tone-and-color)).
- [ ] Judgements wear `tone`, stages and categories wear `color`; no two stages share one tone ([tone or color](foundations.md#tone-or-color)).
- [ ] Each status's label and colour come from one map of the app, read by every badge, segment, dot and series ([one status map](foundations.md#one-status-map)).
- [ ] A hue keeps its meaning across the product; derived states refine their base hue; a history event wears the state it led to ([hue meanings](foundations.md#hue-meanings)).
- [ ] Category hues are unique within their set, stable per id, and never a status hue in the same view ([categories](foundations.md#categories)).
- [ ] A colour a person picks is a stored palette name, an unknown one gray ([colours people choose](foundations.md#colours-people-choose)).
- [ ] No tinted row, card or panel and no coloured border for a status ([marks, not surfaces](foundations.md#marks-not-surfaces)).

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
- [ ] A card of fields under a section heading (`Drawer.Section`, `Page.Section`) has no `Card.Header` — one heading per block ([surfaces](composition.md#4-surfaces)).
- [ ] Search and filter take the shape the screen needs: `combined` in a daily list's toolbar, the split button where it must be found, the button alone or the search alone by the data ([where the filters go](composition.md#where-the-filters-go)).
- [ ] One primary action per area, last in its row; every other button with text is `soft` neutral, `ghost` only icon-only, no `outline` button ([actions](composition.md#6-actions)).
- [ ] An icon-only button beside fields or `soft` buttons is `soft` neutral at their height; `ghost` only among unfilled neighbours: a dialog header, a table cell, a chat header ([icon button fill](composition.md#an-icon-button-takes-its-neighbours-fill)).
- [ ] An empty list of cards is `EmptyPage size="s"` in a `Card.Root` in the list's place, the add button under it ([an empty list of cards](composition.md#an-empty-list-of-cards)).
- [ ] A dialog footer holds Cancel and the primary only, never a «Закрыть» beside the header ×; read-only details have no footer; deleting the edited record stands in the header's actions ([actions](composition.md#6-actions)).
- [ ] One secondary action is an icon button with a Tooltip; a «⋯» menu holds two or more ([a menu from two actions](composition.md#a-menu-from-two-actions)).
- [ ] A record's dialog header shows up to five actions as icon buttons with Tooltips, «⋯» only beyond; a destructive one asks or holds ([actions of a record](composition.md#actions-of-a-record)).
- [ ] A record's footer appears with a change: «Отменить изменения» + «Сохранить»; a create form: «Отмена» + «Создать» ([actions](composition.md#6-actions)).
- [ ] An entity has one drawer opened from everywhere; permissions lock fields and hide tabs and actions; header actions act on the record, never lead elsewhere ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- [ ] A record's dialog header is three lines in this order: `Title` with its `number`, one line of `Description` text, `Badges` (the status and assignee pickers first, «Назначить» when nobody is) over the body; no badge or number in the description, no status in `Actions` ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- [ ] A record drawer is one form with one «Сохранить» in its footer while dirty and `Drawer.Guard`; no save per section, no unsaved-status text ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- [ ] A control that changes the whole open tab (a language, a period) is one control in the header's `Drawer.Actions` before the buttons, only on the tabs it applies to ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- [ ] A drawer loads its tabs' data itself, the history has its own tab, and returning to a tab never shows a skeleton again ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- [ ] A record dialog opens with its header and tabs at once: what the list row knows shows, only the unknown lines hold `loading` ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- [ ] An action apart from a dialog's answer («Выйти» on a profile) is `Drawer.Actions` / `Modal.Actions` inside the footer, at its start ([a record in a drawer](composition.md#a-record-in-a-drawer)).
- [ ] A chat about a record heads itself in two lines — `Chat.Title number` over `Chat.Badges` — and an always-open search is `Chat.Search persistent` ([messages](choosing.md#2-inside-a-category)).
- [ ] A tile that is a link shows the kit's arrow, never one of mine; a value in words is `stat-text` ([KPI tiles](composition.md#worked-example-a-metric-panel-with-a-period-switch)).
- [ ] A task card with an assignee names the person once: the picker first in `Card.Description`, the facts after it, the term in `Card.Title` ([tiles and cards of a record](composition.md#tiles-and-cards-of-a-record)).
- [ ] An object of a record (a video, an account, a session) is a card of one `Card.Header`: picture, title, one line of data, one action — two lines, never three ([tiles and cards of a record](composition.md#tiles-and-cards-of-a-record)).
- [ ] A record's fact tiles are `stat-text` at the default value size in every dialog of the app (`valueSize="l"` only for a lone total tile), no Typography inside `Card.Value`; a record card with a total ends in `Card.Footer divider="fill"` with `Card.Total` ([tiles and cards of a record](composition.md#tiles-and-cards-of-a-record)).
- [ ] An on/off permission or setting is a `Switch`, a level per entity a `FieldList` of `Select`s, a set of values in a table cell `Badge.Group overflow="count"` ([a flag, a level, a set](choosing.md#a-flag-a-level-a-set)).
- [ ] The same action has the same label and variant everywhere on the screen ([secondary actions](api-contract.md#secondary-actions)).

## States
- [ ] Hover and focus-visible come from the kit, nothing removed ([focus](foundations.md#10-focus-and-motion)).
- [ ] Busy controls use `loading`, unavailable ones `disabled` — no hand-made spinners ([loading](api-contract.md#loading-without-datatable)).
- [ ] Fields show `hint` and `error`; only the minority is marked `required` or `optional` ([forms](api-contract.md#forms)).
- [ ] Every data block has its loading, empty and error states ([feedback](composition.md#9-feedback)).
- [ ] Every region swaps its states through `Crossfade`, loading is a `Skeleton` of the data ([continuity](foundations.md#11-state-changes-are-continuous)).
- [ ] Whatever loads shows its skeleton on the first render under the state `"loading"`, and the data takes its place without unfolding, sliding or growing from zero ([continuity](foundations.md#11-state-changes-are-continuous)).
- [ ] A `Page.Description` that waits for data stays mounted with `loading`, so the title in the bar never jumps ([screen states](composition.md#screen-states)).
- [ ] A KPI tile that waits for its figure is `Card.Root loading`, its parts mounted ([inside a category](choosing.md#2-inside-a-category)).
- [ ] While a form saves, its submit is `loading` and its fields sit in a `Fieldset disabled` ([forms](api-contract.md#forms)).
- [ ] A save that stays says «Сохранено» on its button, one that goes away notifies, a failure always shows ([feedback](composition.md#9-feedback)).
- [ ] Overlays stay mounted and are driven by `open` only ([motion mistakes](motion.md#6-mistakes)).
- [ ] No hand-written animation on kit parts; my own motion uses the motion tokens ([your own motion](motion.md#4-rules-for-your-own-motion)).
- [ ] Every glyph comes from the kit, none animated by hand ([icons](api-contract.md#icons)).
- [ ] Every state change moves through the kit ([what the kit animates](motion.md#1-what-the-kit-already-animates--do-not-rebuild-it)).
- [ ] No animated wrapper of mine around content; nothing moves on first mount, only what appears later enters ([who moves what](motion.md#who-moves-what)).

## Themes and widths
- [ ] The screen passes the responsive checklist in both themes ([responsive](responsive.md#checklist-before-handing-a-screen-over)).
- [ ] On a phone the Sidebar opens from the menu button the top bar draws; the page title stays in the bar ([app frame](layouts.md#app-frame-once-per-app)).
- [ ] Tabs that outgrow the width scroll; no two topics merged into one tab ([switchers](responsive.md#switchers)).
- [ ] At every width the bar fits: tools on their own line, then icon-only buttons, then «⋯», the primary always on screen ([the page's top bar](responsive.md#the-pages-top-bar--pagetopbar)).

## Keyboard and a11y
- [ ] Every action is reachable by Tab in reading order and works with Enter / Space ([interaction](responsive.md#interaction-and-accessibility)).
- [ ] Every field has a label (visible, or `aria-label` for a toolbar search) ([forms](api-contract.md#forms)).
- [ ] Meaning is never colour alone ([tone and color](foundations.md#6-tone-and-color)).
- [ ] A toned hint says its status in words; a validation problem is `error`, never a `danger` hint ([forms](api-contract.md#forms)).
- [ ] A refused sign-in marks the e-mail `invalid` and says why as the password's `error`, with no Banner ([field outcomes](api-contract.md#field-outcomes-a-mark-for-success-words-for-a-problem)).
- [ ] A confirmed value is `valid` (a check, no text); a new password has `minStrength` and its requirement in the hint ([field outcomes](api-contract.md#field-outcomes-a-mark-for-success-words-for-a-problem)).
- [ ] Sign-in, sign-up, invite and reset are modes of one auth screen whose head names the action, `align` left at `start` ([auth](layouts.md#auth-sign-in-code)).
- [ ] Custom `labels` replace the default Russian strings where they do not fit ([system strings](api-contract.md#shared-vocabulary-exported-types)).
