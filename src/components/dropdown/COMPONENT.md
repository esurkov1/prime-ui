# Dropdown

**Category:** overlays
**Kind:** overlay

> A menu of actions that opens from a trigger: picking an item runs it and closes the menu.

## When to use
- Secondary actions of a card, row or document behind a «⋯» or labelled button.
- An account / user menu behind the Sidebar account row (`Sidebar.Account`).
- A short list of commands (export formats, move to project) where picking one runs an action.
- A long list to jump into behind one button (the chats of an assistant, recent projects): a fixed `width`, `maxRows`, a `Dropdown.Search` on top and a `Dropdown.ItemMeta` at the end of each row.

## When not to use
- Choosing and showing a value in a form → use [Select](../select/COMPONENT.md) (or [TagSelect](../tag-select/COMPONENT.md) for several).
- Searching across the commands of the whole app (⌘K) → use [CommandMenu](../command-menu/COMPONENT.md).
- Free content, forms or filters in a floating panel → use [Popover](../popover/COMPONENT.md).
- A hint on hover → use [Tooltip](../tooltip/COMPONENT.md).
- Two to four always-visible actions → show [Button](../button/COMPONENT.md)s or a [ButtonGroup](../button-group/COMPONENT.md).

## Import
```tsx
import { Dropdown } from "prime-ui-kit";
```

## Anatomy
```
Dropdown.Root                     state and dismiss policy (no DOM)
├── Dropdown.Trigger              clones its child; toggles the menu, opens it on the arrow keys
├── Dropdown.Anchor               instead of Trigger: the row or list a context menu opens at (anchorPoint)
└── Dropdown.Content              portaled role="menu" on the floating surface, scrolls
    ├── Dropdown.Search           first child: the search row; the panel then holds it, the role="menu" under it and the empty state
    ├── Dropdown.Header           non-interactive row: [avatar] [Title + Description] [badge]
    │   ├── Dropdown.Title
    │   └── Dropdown.Description
    ├── Dropdown.Separator        full-bleed Divider
    ├── Dropdown.Group            role="group", named by `label`
    │   └── Dropdown.Item         <button role="menuitem"> (or the asChild link)
    │       ├── Dropdown.ItemIcon         leading glyph (aria-hidden)
    │       ├── Dropdown.ItemDescription  muted second line; describes the item
    │       ├── Dropdown.ItemMeta         muted meta at the end of the label's line; describes the item
    │       └── Dropdown.ItemShortcut     Kbd at the end
    ├── Dropdown.CheckboxItem     <button role="menuitemcheckbox">: label + check mark at the end while checked; stays open
    └── Dropdown.Item
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Dropdown.Root
No DOM, no ref. Open state and dismiss policy.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, item pick, Escape, outside press, code. |
| `closeOnOutsideClick` | `boolean` | `true` | A pointerdown outside the menu and its trigger closes it; focus follows the pointer. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the menu and returns focus to the trigger. |
| `anchorPoint` | `{ x: number; y: number } \| null` | `null` | A point inside the trigger or `Dropdown.Anchor` (px from its top-left corner) the menu opens at: a context menu at the pointer. It moves with the element on scroll. |
| `labels` | `Partial<DropdownLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | Trigger (or Anchor) and Content. |

### Dropdown.Trigger · Dropdown.Anchor
No DOM: clone the single child and merge `ref`. Trigger toggles the menu on a click, opens it on the arrow keys and sets its ARIA; Anchor only places the menu (a context menu with `anchorPoint`, opened through `open`) and names it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element: usually a Button (Anchor: the row or list the context menu belongs to). |

### Dropdown.Content
`ref` → `HTMLDivElement`. Portal + `role="menu"` floating panel that scrolls inside, named by the control it opened from; focus moves to the first enabled item (or to a `Dropdown.Search`, the menu then under it). Below 640px of viewport it is a bottom sheet.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Preferred side; flips to the opposite side when there is no room. |
| `align` | `"auto" \| "start" \| "center" \| "end"` | `"auto"` | Alignment along the trigger. `auto` lines the menu up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix the edge. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier: item height, text and icon; key hints one tier down. The menu's own: it does not follow the trigger's size. |
| `width` | `"auto" \| "s" \| "m" \| "l"` | `"auto"` | `auto`: the content's width between `--prime-panel-min-width` and twice that. `s`, `m`, `l`: a fixed 1.5, 2 or 2.5 panel minimums within the viewport, labels truncate (threads, projects). |
| `maxRows` | `number` | — | The height of about this many item rows (a search row on top), then the list scrolls; without it `--prime-panel-max-height`. Never more than the room at the trigger; a bottom sheet uses its own. |
| `matchTriggerWidth` | `boolean` | `false` | The menu is at least as wide as the trigger (with `width`, too). |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "role">` | — | `className`, `onKeyDown` (runs before the arrow-key navigation) and the other attributes of the menu (with a search: of the panel). |

### Dropdown.Search
`ref` → `HTMLInputElement`. The search row, first in `Dropdown.Content`: `<input type="search">` controlling the menu. Focus stays in it while the arrows move the highlight; items filter by label, description and `keywords`, empty groups hide; the query clears on opening.

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `labels.search` | Placeholder; the default accessible name comes from `labels.search` too. |
| `…rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "size" \| "type" \| "role" \| "value" \| "defaultValue">` | — | `className`, `onChange`, `onKeyDown` (runs before the highlight moves) and the other input attributes except `value` / `defaultValue`. |

### Dropdown.Item
`ref` → `HTMLButtonElement` (or the `asChild` element). A `<button role="menuitem">`, no tab stop of its own (`tabIndex -1`, the arrow keys move between items); a click, Enter or Space runs `onSelect` and closes the menu.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSelect` | `() => void` | — | The action of the item. |
| `selected` | `boolean` | — | A choice of one (a person, a status): the item becomes `role="menuitemradio"` with `aria-checked`, the chosen one gets a check at the end. Set it on every item of the choice. |
| `disabled` | `boolean` | `false` | Muted and `disabled` (a link item: `aria-disabled`), skipped by the arrow keys; no handler runs, the item's own `onClick` included. |
| `tone` | `"neutral" \| "danger"` | `"neutral"` | `danger`: destructive action — danger text, icon and hover fill. |
| `asChild` | `boolean` | `false` | The item is its single child link (`<a href>`, a router `Link`), so Cmd / Ctrl-click and «open in a new tab» work; the pick still closes the menu. |
| `keywords` | `string` | — | With `Dropdown.Search`: extra words the query also matches (a client's name, an English title). |
| `persistent` | `boolean` | `false` | With `Dropdown.Search`: shown whatever the query and never counted as a match (the empty state still shows) — an action above the list («Новый чат»). The highlight goes to it only when nothing matches. |
| `children` | `ReactNode` | — | `Dropdown.ItemIcon`, the label, `Dropdown.ItemDescription`, `Dropdown.ItemMeta`, `Dropdown.ItemShortcut`; with `asChild` one link element holding them. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "role" \| "onSelect">` | — | `className`, `onClick` (runs before `onSelect`; `preventDefault()` keeps the menu open) and the other attributes of the item. |

### Dropdown.CheckboxItem
`ref` → `HTMLButtonElement`. A `<button role="menuitemcheckbox">` with `aria-checked` and a check mark at the end while checked; a click, Enter or Space toggles it and the menu stays open.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Checked state (controlled). |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled). |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the new state. |
| `disabled` | `boolean` | `false` | Muted and `disabled`, skipped by the arrow keys; no handler runs, the item's own `onClick` included. |
| `keywords` | `string` | — | With `Dropdown.Search`: extra words the query also matches (a client's name, an English title). |
| `persistent` | `boolean` | `false` | With `Dropdown.Search`: shown whatever the query and never counted as a match (the empty state still shows) — an action above the list («Новый чат»). The highlight goes to it only when nothing matches. |
| `children` | `ReactNode` | — | The label (optionally after a `Dropdown.ItemIcon`). |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "role" \| "onSelect" \| "onChange" \| "defaultChecked">` | — | `className`, `onClick` (runs before the toggle; `preventDefault()` skips it) and the other attributes of the item. |

### Dropdown.ItemDescription
`ref` → `HTMLSpanElement`. A muted second line under the item label: what the action does, or why a disabled item is unavailable. Describes the item for assistive tech.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The sentence; it wraps inside the menu's width. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "id">` | — | `className` and the other attributes except `id` (the item points at it). |

### Dropdown.ItemIcon
`ref` → `HTMLSpanElement`. The `aria-hidden` leading glyph of an item at the menu icon size.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className`, `children` (the glyph) and the other attributes. |

### Dropdown.ItemMeta
`ref` → `HTMLSpanElement`. A muted meta at the end of the item, on the label's line (the time of a thread, a count): one line that never shrinks — the label truncates first. Describes the item for assistive tech; the label alone names it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The meta («14:32», «вчера»). |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the `<span>`. |

### Dropdown.ItemShortcut
`ref` → `HTMLElement` (the `<kbd>`). A `Kbd` key hint at the end of the item, one tier below the menu — a hint, not a handler.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The keys («⌘D»). |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "children">` | — | `className` and the other attributes of the `<kbd>`. |

### Dropdown.Group
`ref` → `HTMLDivElement`. `<div role="group">` named by its visible `label`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading of the group (caption, muted); also its accessible name. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` (the items) and the other attributes of the group. |

### Dropdown.Separator
`ref` → `HTMLDivElement`. A full-bleed Divider between items or groups.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the divider. |

### Dropdown.Header · Dropdown.Title · Dropdown.Description
`ref` → `HTMLDivElement`. A non-interactive row at the top (who is signed in, the plan): an avatar, Title + Description in one column, a trailing badge or button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `children` and the other attributes of the `<div>`. |

## Variants
The panel is the shared floating surface: the floating layer of the ladder (`data-depth="floating"`), `--prime-panel-radius` (12), padding 4, `shadow-overlay`; rows have radius 8 and the tier item height.

### size (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 24, text 12/16, icon 14 | Dense toolbars | |
| `s` | item 28, text 13/20, icon 16 | Table rows, compact headers | |
| `m` | item 32, text 14/20, icon 16 | Most menus | yes |
| `l` | item 36, text 16/24, icon 20 | Roomy layouts | |
| `xl` | item 40, text 16/24, icon 20 | Touch-first screens | |

### width (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `auto` | As wide as the content, between `--prime-panel-min-width` and twice that | Short action menus | yes |
| `s` | 1.5 panel minimums, labels truncate | A list of medium names | |
| `m` | 2 panel minimums | Threads, projects, documents with a meta | |
| `l` | 2.5 panel minimums | Long titles that must read whole | |

### tone (Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | primary text, muted icon, subtle fill on hover | Regular actions | yes |
| `danger` | danger text and icon, danger-soft fill on hover | Delete, revoke, leave | |

### side / align (Content)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `side="bottom"` | Below the trigger | Default | yes |
| `side="top"` | Above the trigger | Triggers near the bottom of the screen | |
| `side="left"` / `"right"` | Beside the trigger, aligned along its height | Triggers in a side rail (account menu at the bottom of a sidebar) | |
| `align="auto"` | Lined up with the trigger edge that has more room: near the end of the screen the end edges meet and the menu grows toward the start, near the start the other way; below the trigger, flipping to the top without room | Default — triggers anywhere | yes |
| `align="end"` | End edges aligned: the menu grows toward the start | The menu must line up with the end of a block whatever room there is | |
| `align="center"` | Centred on the trigger | Small triggers | |
| `align="start"` | Start edges aligned: the menu grows toward the end | The menu must line up with the start of a block whatever room there is | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` (Item) | Disabled text, skipped by arrows | Not allowed right now (say why in `Dropdown.ItemDescription`) | `false` |
| `matchTriggerWidth` | Menu at least as wide as the trigger (with `width`, too) | Full-width buttons | `false` |
| `maxRows` (Content) | The height of about that many item rows, then the list scrolls | A long list that should show more (or fewer) than the default height | — |
| `persistent` (Item, CheckboxItem) | Shown whatever the query, not counted as a match | An action above a searched list («Новый чат») | `false` |
| `closeOnOutsideClick={false}` · `closeOnEscape={false}` | Stays open until an item is picked | A required choice in an onboarding step | |
| `anchorPoint` (Root) | The menu opens at a point inside the trigger or `Dropdown.Anchor` | A context menu at the pointer over a row or a list | `null` |

**Combinations** — `size` is the menu's own, set on `Dropdown.Content`; match it to the trigger by hand when they stand together. Destructive items go last, after a separator. Key hints only for shortcuts the app really handles. A context menu: `Dropdown.Anchor` around the row, `anchorPoint` from the `contextmenu` event, `open` driven by it.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the menu (closed while the exit animation plays) and on the trigger, `aria-expanded` on the trigger |
| dismiss | `closeOnEscape`, `closeOnOutsideClick` (both default `true`) | Escape and a press outside close the menu; `false` turns that way off |
| side | `side` and the room next to the trigger | `data-side` (resolved) |
| size | `size` on Content | `data-size` |
| chosen | `selected` on every item of a choice of one | `role="menuitemradio"`, `aria-checked`, `data-checked` and the `action.check` mark at the end of the chosen item; an `Avatar.Root` / `Thumbnail.Root` child leads the row at the row's media size, `aria-hidden` |
| item hover / focus | a hovering pointer, arrow keys | subtle fill (danger-soft for `danger`), no movement; a tap leaves no hover fill |
| item disabled | `disabled` | native `disabled` (a link item `aria-disabled="true"`), `data-disabled="true"`; no handler runs |
| item tone | `tone` | `data-tone` |
| searching | the query in `Dropdown.Search` | items that do not match (by label, description and `keywords`) and groups left without one are `hidden`, separators step aside, the match is a `<mark>`; the highlighted item carries `data-highlighted="true"` and is the field's `aria-activedescendant`; nothing matches → a compact EmptyPage (`role="status"`, `labels.empty`) |
| item checked | `checked` / `defaultChecked` / `onCheckedChange` on `Dropdown.CheckboxItem` | `aria-checked`; an accent check mark at the end while checked, nothing while not |
| sheet | a phone viewport | a scrim and a full-width bottom sheet around the menu; the sheet carries `data-state`, the menu `data-sheet` and keeps its role and ref; page scroll locked; with `closeOnOutsideClick` an `aria-hidden` grab handle, and a swipe down from it closes the sheet |

Motion (`overlayMotion`): the menu grows out of the side that faces its trigger and fades, in and out over `fast`; as a sheet it slides up over `slow` and down over `base`. Content stays mounted until the exit ends; under `prefers-reduced-motion` it unmounts at once.

## Layout & spacing
- Width follows `width`: by default `max-content` between `--prime-panel-min-width` and twice that; `s` / `m` / `l` fix it at 1.5 / 2 / 2.5 minimums within the viewport. Item labels never wrap: they truncate first, a `Dropdown.ItemMeta` and a key hint stay whole; a `Dropdown.ItemDescription` wraps inside the width.
- Max height = min(`--prime-panel-max-height`, the room on the resolved side); with `maxRows` the height of that many item rows instead (plus the search row); the menu scrolls inside. A bottom sheet uses its own height and stays clear of the safe-area insets.
- `Dropdown.Search` is a row of the tier item height across the panel padding with a faint hairline under it; it stays while the list under it scrolls.
- `Dropdown.ItemMeta` takes the tier's description text, muted, figures in columns, pushed to the end of the label's line.
- A checkbox item keeps the label (and an `ItemIcon`) on the left like any item; the check mark sits at the end.
- `Dropdown.ItemIcon` holds the glyph at the menu icon size (a kit `Icon` follows it); `Dropdown.ItemShortcut` is a `Kbd` one tier below the menu, pushed to the end of the item.
- `Dropdown.Header` lays out its children in the written order; `Dropdown.Title` is the medium heading line, `Dropdown.Description` the muted line under it; both truncate.
- Separators run edge to edge across the panel padding; group labels take `--prime-panel-group-label-height`.
- Kept `--prime-space-2` from viewport edges; follows the trigger on scroll and resize.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | On the trigger opens the menu (focus on the first item); on an item runs it and returns focus to the trigger; on a checkbox item toggles it and the menu stays open. |
| `ArrowDown` · `ArrowUp` | On the trigger open the menu at its first item; in the menu move focus to the next / previous enabled item, wrapping. |
| `Home` · `End` | First / last enabled item. |
| `ArrowDown` · `ArrowUp` · `Enter` | In `Dropdown.Search` the arrows move the highlight over the shown enabled items, wrapping, while focus stays in the field; Enter runs the highlighted item. Space, Home and End edit the query. |
| `Escape` | Closes the menu (`closeOnEscape`); focus returns to the trigger. |
| `Tab` · `Shift+Tab` | Closes the menu; focus returns to the trigger (Tab then goes on to the next stop). |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The menu is `role="menu"` named by the control it opened from (the trigger, or the control inside `Dropdown.Anchor`), read from the page; items are `role="menuitem"`, checkbox items `role="menuitemcheckbox"` with `aria-checked`, disabled ones `disabled`. Items are no tab stops: one Tab leaves the menu.
- The trigger gets `aria-haspopup="menu"`, `aria-expanded`, `data-state` and, while open, `aria-controls`; the child's own `id` wins. Other props given to `Dropdown.Trigger` (handlers, ARIA, `ref`) reach the child, so a wrapping `Tooltip.Trigger` keeps working.
- With a `Dropdown.ItemDescription` or a `Dropdown.ItemMeta` the label names the item (`aria-labelledby`) and they describe it (`aria-describedby`).
- An `asChild` item merges its props onto the link; the link's children are the item content. A disabled link item gets `aria-disabled` and its click is stopped.
- With `Dropdown.Search` the field is `<input type="search">` named by `labels.search`, with `aria-controls` pointing at the menu and `aria-activedescendant` at the highlighted item; items that do not match are `hidden`; the empty state is `role="status"`.
- `Dropdown.Group` is `role="group"` named by its `label`.
- `Dropdown.ItemIcon` is hidden from screen readers; a key hint is text only — the app handles the shortcut.
- An outside press closes the menu without moving focus back to the trigger: focus follows the pointer (foundation §8).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Dropdown.Search

| Key | Default | Used for |
|---|---|---|
| `search` | `"Поиск"` | Default placeholder and accessible name of `Dropdown.Search`. |
| `empty` | `"Ничего не найдено"` | Shown under the search while no item matches the query (a compact EmptyPage). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An icon-only button opens the row actions; picking an item runs it and closes the menu — `Dropdown.Item`, `onSelect`. |
| [structure.tsx](examples/structure.tsx) | Optional parts of an account menu: a header with an avatar, a labelled group, item icons, key hints and separators — `Dropdown.Header`, `Dropdown.Group`, `Dropdown.ItemIcon`, `Dropdown.ItemShortcut`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier with icons, key hints and a destructive item; the tier is the menu's own, set on `Dropdown.Content`, not taken from its trigger — `size`. |
| [placement.tsx](examples/placement.tsx) | Every side and alignment relative to the trigger; near the viewport edge the menu flips and shifts — `side`, `align`. |
| [states.tsx](examples/states.tsx) | A regular, a disabled and a destructive item; arrow keys skip the disabled one — `disabled`, `tone`. |
| [item-description.tsx](examples/item-description.tsx) | A second line under an item: what an action does, and why a disabled one is unavailable, readable by everyone and read with the item — `Dropdown.ItemDescription`. |
| [link-items.tsx](examples/link-items.tsx) | Items that navigate are real links: Cmd-click or the context menu opens them in a new tab, a plain pick closes the menu — `asChild`. |
| [context-menu.tsx](examples/context-menu.tsx) | A right-click on a deal opens its menu at the pointer, and Escape or a pick returns focus to that row — `anchorPoint`, `Dropdown.Anchor`. |
| [match-trigger-width.tsx](examples/match-trigger-width.tsx) | Under a full-width button the menu is at least as wide as the trigger — `matchTriggerWidth`. |
| [checkbox-items.tsx](examples/checkbox-items.tsx) | A column chooser: toggles in the menu keep it open, the key column cannot be hidden — `Dropdown.CheckboxItem`, `checked`, `onCheckedChange`. |
| [person-choice.tsx](examples/person-choice.tsx) | The assignee of a deal picked from the team: each row leads with the person's avatar at the row's size, and the chosen one carries a check — `selected`, `Avatar.Root`. |
| [long-list.tsx](examples/long-list.tsx) | More projects than fit: the grouped list scrolls inside the panel, capped by the room next to the trigger — `Dropdown.Group`. |
| [search.tsx](examples/search.tsx) | Chats of the assistant: a new-chat action above a long list of threads with their time, a search over them, a fixed width and a height of twelve rows — `Dropdown.Search`, `Dropdown.ItemMeta`, `persistent`, `width`, `maxRows`. |
| [dismiss.tsx](examples/dismiss.tsx) | An onboarding step keeps the menu open on an outside press and on Escape until an item is picked — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state and opens the menu from another button; the picked step updates the trigger — `open`, `onOpenChange`. |

## Mistakes
- Using Dropdown to pick a form value → Select shows the value and works with forms.
- An icon passed as a component (`as={Icon}`) → put the glyph inside `Dropdown.ItemIcon`.
- A hand-written shortcut `<kbd>` → `Dropdown.ItemShortcut` (a Kbd at the end of the item).
- `Dropdown.Group` with a separate heading element → pass the heading as `label`.
- A destructive item without `tone="danger"`, or in the middle of the list → mark it and put it last.
- A Tooltip on a disabled item to say why → keyboard and touch users never see it; put the reason in `Dropdown.ItemDescription`.
- `onSelect={() => navigate(url)}` for an item that opens a page → `asChild` with a link, so Cmd-click and a new tab work.
- A hidden button placed at the pointer to anchor a context menu → `Dropdown.Anchor` around the row and `anchorPoint` from the `contextmenu` event.
- Expecting the menu to take the trigger's `size` → it has its own; set `size` on `Dropdown.Content`.
- A hand-made row of a label and a muted time (`Typography truncate` + a caption) with a `className` width → `Dropdown.ItemMeta` in the item and `width` on `Dropdown.Content`.
- An `Input` placed at the top of the menu to filter it → `Dropdown.Search`: focus stays in it, the arrows move the highlight, groups and the empty state follow.
- An action above a searched list that disappears while typing → mark it `persistent`.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (the menu), [Avatar](../avatar/COMPONENT.md) and [Thumbnail](../thumbnail/COMPONENT.md) (sized as an item's picture), [Kbd](../kbd/COMPONENT.md) (`ItemShortcut`), [Divider](../divider/COMPONENT.md) (`Separator`), [EmptyPage](../empty-page/COMPONENT.md) (the empty state of `Search`), `Icon` (`action.check` of `CheckboxItem` and a `selected` item, `action.search` of `Search`)
- **See also:** [Select](../select/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Button](../button/COMPONENT.md)
