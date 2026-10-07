# CommandMenu

**Category:** overlays
**Kind:** overlay

> A search palette over the page: the query filters commands and pages, Enter runs the active one.

## When to use
- Global search of an app opened with ⌘K / Ctrl+K: pages, records, settings.
- Quick actions (create, invite, switch workspace) for keyboard users.
- Picking one entry from a long list by typing, when a Select would be too small.

## When not to use
- A few actions next to a button → use [Dropdown](../dropdown/COMPONENT.md).
- Choosing a form value → use [Select](../select/COMPONENT.md) (with `searchable`) or [TagSelect](../tag-select/COMPONENT.md).
- A dialog with a form or a confirmation → use [Modal](../modal/COMPONENT.md).

## Import
```tsx
import { CommandMenu } from "prime-ui-kit";
```

## Anatomy
```
CommandMenu.Root                 Modal + top-aligned palette panel, query state
├── CommandMenu.Title            optional <h2>, names the dialog
├── CommandMenu.Description      optional <p>
├── CommandMenu.Input            search icon + role="combobox" field, faint hairline below
├── CommandMenu.List             role="listbox", scrolls
│   ├── CommandMenu.Empty        compact EmptyPage while nothing matches
│   └── CommandMenu.Group        role="group", named by `label`
│       └── CommandMenu.Item     <button role="option">
│           ├── CommandMenu.ItemIcon
│           ├── CommandMenu.ItemText       title + description line
│           └── CommandMenu.ItemShortcut   Kbd at the end
└── CommandMenu.Footer           key hints, hairline above
    └── CommandMenu.FooterHint   Kbd per key + label
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### CommandMenu.Root
No ref. A Modal with a top-aligned palette panel; holds the query and the active item while open (a new opening starts empty, focus in the search field).

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: Escape, scrim click, code. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim closes the palette; focus returns to the opener. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the palette. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the rows and the search row: item height, text, icon. |
| `labels` | `Partial<CommandMenuLabels>` | — | Built-in strings, see Labels. |
| `aria-label · aria-labelledby · aria-describedby` | `string` | — | Name and description of the dialog when there is no `CommandMenu.Title` / `Description`. |
| `className` | `string` | — | Extra class on the dialog panel. |
| `children` | `ReactNode` | — (required) | Title, Description, Input, List, Footer. |

### CommandMenu.Title · CommandMenu.Description
No ref. `<h2>` / `<p>` above the search row; they name and describe the dialog. + native props except `id`.

### CommandMenu.Input
`ref` → `HTMLInputElement`. The search row: a search icon and `<input role="combobox">` controlling the list; no focus ring (the caret is the indicator). + native input props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled query; the list filters by it. |
| `onValueChange` | `(value: string) => void` | — | Called with the new query; native `onChange` still fires. |
| `placeholder` | `string` | `labels.search` | Placeholder; also the default accessible name comes from `labels.search`. |

### CommandMenu.List
`ref` → `HTMLElement`. The scrolling `role="listbox"` (a ScrollContainer) under the search row. + native props.

### CommandMenu.Group
No ref. `<div role="group">` named by its `label`; hidden while none of its items match. + native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading of the group (caption, muted); also its accessible name. |

### CommandMenu.Item
`ref` → `HTMLButtonElement`. `<button role="option">`; the active item has `aria-selected` and the highlight fill. + native button props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Text matched against the query together with `keywords`. |
| `keywords` | `string` | — | Extra words for the query (synonyms, English names). |
| `onSelect` | `() => void` | — | Runs the command: a click, or Enter while the item is active. |
| `disabled` | `boolean` | `false` | Never shows in the results. |

### CommandMenu.ItemIcon · CommandMenu.ItemShortcut
No ref. An `aria-hidden` `<span>` holding the leading glyph at the tier icon size / a `Kbd` one tier below, pushed to the end of the item — a hint, not a handler. + native props.

### CommandMenu.ItemText
No ref. A `<span>` column: the title with an ellipsis and an optional description line. + native `<span>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `description` | `ReactNode` | — | Second line (path, details): caption, muted. |

### CommandMenu.Empty
No ref. A compact EmptyPage with `role="status"`, shown only while nothing matches: `labels.empty`, `labels.emptyHint`, and `children` as an action under them.

### CommandMenu.Footer · CommandMenu.FooterHint
No ref. A bottom row of hints with a hairline above / one hint: every entry of `keys` in its own `Kbd`, then the label (`children`). + native props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `keys` | `ReactNode[]` | — (required) | FooterHint: the keys (text or icons). |

## Variants
One look: `bg-raised`, `--prime-modal-radius`, `shadow-modal`, `--prime-modal-width-l` wide, placed in the top part of the viewport so the search row never jumps while the list filters.

### size (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 24, text 12/16, search row 40 | Dense tools | |
| `s` | item 28, text 13/20, search row 40 | Compact apps | |
| `m` | item 32, text 14/20, search row 48 | Most apps | yes |
| `l` | item 36, text 16/24, search row 56 | Roomy layouts | |
| `xl` | item 40, text 16/24, search row 56 | Touch-first screens | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` (Item) | never in the results | The command is unavailable right now | `false` |
| `closeOnOutsideClick={false}` | the scrim does not close it | A required pick | |
| `closeOnEscape={false}` | Escape does nothing | A required pick that must not be skipped | |

**Combinations** — one palette per app; open it with ⌘K / Ctrl+K and a visible button. Add a Footer with key hints when keyboard use is not obvious.

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the scrim and the dialog (closed while the exit animation plays) |
| active item | arrows, Home, End, pointer move | `aria-selected="true"`, `data-highlighted="true"`: a fill only, no movement |
| filtered out | the query | `hidden` on items and on groups without matches |
| matched text | the query | the first match in the item's text children and in `ItemText` is wrapped in an underlined `<mark>` (same as SmartFilter) |
| nothing found | the query | `CommandMenu.Empty` with `role="status"` |
| size | `size` | `data-size` on the tier wrapper |

## Layout & spacing
- Width `--prime-modal-width-l`, max height 1.5 × `--prime-panel-max-height`; only the list scrolls.
- One content column: title, search icon, group labels and item icons start 16 from the edge.
- Search row and footer are separated from the list by hairlines; the search row hairline is faint.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowDown` · `ArrowUp` | Move the active item, wrapping; focus stays in the search field. |
| `Home` · `End` | First / last matching item. |
| `Enter` | Runs the active item. |
| `Escape` | Closes the palette (`closeOnEscape`); focus returns to the opener. |

### ARIA
- The palette is `role="dialog"` with `aria-modal`, named by `CommandMenu.Title` or `aria-label`.
- The field is `role="combobox"` with `aria-controls` on the list and `aria-activedescendant` on the active item; items are `role="option"`, the active one `aria-selected`.
- `CommandMenu.Group` is `role="group"` named by its `label`; the empty result is `role="status"`.
- The page behind is inert; after closing, focus returns to the opener.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `search` | `"Поиск"` | Default placeholder and accessible name of `CommandMenu.Input`. |
| `empty` | `"Ничего не найдено"` | `CommandMenu.Empty`: nothing matches the query. |
| `emptyHint` | `"Попробуйте изменить запрос"` | Second line of `CommandMenu.Empty`; `""` hides it. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A button or ⌘K opens the palette: the query filters the groups by value and keywords, Enter runs the active command — `CommandMenu.Item`, `keywords`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: a visible title and description, a description line and a key hint in items, and a footer with key hints — `CommandMenu.Title`, `CommandMenu.ItemText`, `CommandMenu.ItemShortcut`, `CommandMenu.Footer`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: rows, text, icons and the search row follow it; match the density of the app — `size`. |
| [states.tsx](examples/states.tsx) | A disabled item never shows in the results, and an empty result speaks in the words of the task — `disabled`, `labels`. |
| [dismiss.tsx](examples/dismiss.tsx) | A required pick during an import: a stray click on the scrim does not close the palette, only Escape or a choice — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the open state and the query: it reads the text and a command resets it or closes the palette — `open`, `onOpenChange`, `value`, `onValueChange`. |

## Mistakes
- An icon passed as a component (`as={Icon}`) → put the glyph inside `CommandMenu.ItemIcon`.
- A hand-written `<kbd>` in items or the footer → `CommandMenu.ItemShortcut` / `CommandMenu.FooterHint`.
- `CommandMenu.Group` with a separate heading element → pass the heading as `label`.
- Items that differ only by an icon → give them distinct `value` texts; the query matches text, not icons.
- No name for the dialog → add `CommandMenu.Title` (visually hidden if needed) or `aria-label`.

## Related
- **Built from:** [Modal](../modal/COMPONENT.md) (dialog, scrim, focus, Title / Description), [ScrollContainer](../scroll-container/COMPONENT.md) (`List`), [EmptyPage](../empty-page/COMPONENT.md) (`Empty`), [Kbd](../kbd/COMPONENT.md) (`ItemShortcut`, `FooterHint`)
- **See also:** [Dropdown](../dropdown/COMPONENT.md), [Select](../select/COMPONENT.md), [Modal](../modal/COMPONENT.md)
