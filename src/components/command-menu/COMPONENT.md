# CommandMenu

**Category:** overlays

> A command palette in a dialog: a search field that filters a list of commands and pages (⌘K).

## When to use
- Global app search and navigation opened with ⌘K / Ctrl+K.
- Running one of many actions by typing its name.
- Picking one entry from a long list by typing (warehouse, city, file).

## When not to use
- A short menu of actions behind a button → use [Dropdown](../dropdown/COMPONENT.md).
- Choosing a form value that stays visible in a field → use [Select](../select/COMPONENT.md) (`searchable`) or [TagSelect](../tag-select/COMPONENT.md).
- A form or a confirmation in a dialog → use [Modal](../modal/COMPONENT.md).
- A search field that filters the page itself → use [Input](../input/COMPONENT.md).

## Import
```tsx
import { CommandMenu } from "prime-ui-kit";
```

## Anatomy
```
CommandMenu.Dialog                 Modal with the palette state (query, active item)
├── CommandMenu.DialogTitle        optional visible <h2>
├── CommandMenu.DialogDescription  optional visible <p>
├── CommandMenu.InputRow           search row: [leading icon] input [trailing]
│   └── CommandMenu.Input          role="combobox"
├── CommandMenu.TagSection         optional scope chips under the search row
│   ├── CommandMenu.TagSectionLabel
│   └── CommandMenu.TagRow
├── CommandMenu.List               role="listbox", scrolls
│   ├── CommandMenu.Empty          shown only when nothing matches
│   └── CommandMenu.Group          role="group", hidden when empty
│       └── CommandMenu.Item       role="option"
│           ├── CommandMenu.ItemIcon
│           ├── CommandMenu.ItemText      label + description line
│           └── CommandMenu.ItemShortcut
└── CommandMenu.Footer             key hints
    └── CommandMenu.FooterHint     keys + caption
        └── CommandMenu.FooterKeyBox
```

## API

### CommandMenu.Dialog
No ref. Built on Modal (scrim, focus trap, scroll lock). There is no Trigger part: open it with `open` / `defaultOpen`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility. |
| `defaultOpen` | `boolean` | — | Initial visibility, uncontrolled (Modal default `false`). |
| `onOpenChange` | `(open: boolean) => void` | — | Called on Escape and scrim click (not when `open` changes from the parent). |
| `closeOnEscape` | `boolean` | `true` | Escape closes the palette. |
| `closeOnOutsideClick` | `boolean` | `true` | A click on the scrim closes the palette. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Item height, text, icon and search row height. |
| `labels` | `Partial<CommandMenuLabels>` | see Accessibility | Built-in strings. |
| `aria-label` | `string` | — | Dialog name (required without a labelled title). |
| `aria-labelledby` | `string` | — | Id of a title (e.g. CommandMenu.DialogTitle). |
| `aria-describedby` | `string` | — | Id of a description. |
| `className` | `string` | — | Class on the palette panel. |
| `overlayClassName` | `string` | — | Class on the scrim. |
| `children` | `ReactNode` | — | Palette parts. |

### CommandMenu.DialogTitle · DialogDescription
No ref. Visible `<h2>` / `<p>` with Modal title / description styles, aligned to the palette inset. They are **not** wired to the dialog automatically: pass their `id` to `aria-labelledby` / `aria-describedby` on Dialog. + native heading / paragraph props.

### CommandMenu.InputRow
No ref. Sets `data-focus-ring="false"` (the caret is the focus indicator).

| Prop | Type | Default | Description |
|---|---|---|---|
| `leading` | `ReactNode` | search icon | Slot before the input; `null` removes the icon. |
| `trailing` | `ReactNode` | — | Slot after the input (Kbd, close button). |
| `children` | `ReactNode` | — | Usually CommandMenu.Input. |

+ native `<div>` props.

### CommandMenu.Input
`forwardRef` to `<input type="search">`. Focused automatically when the palette opens.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| number \| readonly string[]` | — | Controlled query; without it the query is internal. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | — | Native change handler. |
| `onValueChange` | `(value: string) => void` | — | Called with the new query. |
| `placeholder` | `string` | `labels.search` | Placeholder. |
| `aria-label` | `string` | `labels.search` (unless `aria-labelledby`) | Accessible name. |

+ native `<input>` props except `size` and `type`.

### CommandMenu.List
`forwardRef` to `<div role="listbox">` (a ScrollContainer). + native `<div>` props.

### CommandMenu.Group
No ref. `<div role="group">`, labelled by its heading, `hidden` when none of its items match.

| Prop | Type | Default | Description |
|---|---|---|---|
| `heading` | `ReactNode` | — | Group caption; a string or rich markup. |

+ native `<div>` props.

### CommandMenu.Item
`forwardRef` to `<button role="option" tabIndex={-1}>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Text matched against the query together with `keywords` (case-insensitive substring); with `""` the item shows only while the query is empty or when `keywords` match. |
| `keywords` | `string` | `""` | Extra words to match (e.g. English synonyms). |
| `onSelect` | `() => void` | — | Called on click or Enter on the active item. |
| `disabled` | `boolean` | — | The item is removed from results and cannot be chosen. |

+ native `<button>` props except `type` and `onSelect` (`onClick`, `onPointerMove` are chained).

### CommandMenu.ItemIcon
No ref. Polymorphic, `aria-hidden`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `"span"` | Icon component (e.g. a lucide icon). |
| `className` | `string` | — | Extra class. |

+ props of the `as` element.

### CommandMenu.ItemText
No ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Item label (one line, ellipsis). |
| `description` | `ReactNode` | — | Second line (path, hint), caption muted. |

+ native `<span>` props.

### CommandMenu.ItemShortcut
No ref. `<kbd>` at the end of the item; a hint only. + native `HTMLAttributes<HTMLElement>`.

### CommandMenu.Empty
No ref. `role="status"`; renders only when no item matches. Shows `labels.empty` and `labels.emptyHint`; `children` go below (e.g. a «Создать» button). + native `<div>` props.

### CommandMenu.TagSection · TagSectionLabel · TagRow · Footer
No ref. Layout `<div>`s. + native `<div>` props.

### CommandMenu.FooterHint
No ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `keys` | `ReactNode[]` | — (required) | Keys (strings or icons); each renders as a FooterKeyBox. |
| `children` | `ReactNode` | — | Caption («Навигация»). |

+ native `<span>` props.

### CommandMenu.FooterKeyBox
`forwardRef` to `<kbd>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"soft" \| "ghost"` | `"soft"` | Key cap on a soft fill, or text only. |

+ native `HTMLAttributes<HTMLElement>` except `color`.

## Variants
The palette: `bg-raised`, `--prime-modal-radius`, `shadow-modal`, width `--prime-modal-width-l`, top-aligned on the scrim. The search row is separated by a `border-faint` hairline; tag section and footer by `border-subtle`.

### size (Dialog)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | item 24, text 12/16, icon 14, search row 40 | Very dense tools | |
| `s` | item 28, text 13/20, icon 16, search row 40 | Dense apps | |
| `m` | item 32, text 14/20, icon 16, search row 48 | Most apps | yes |
| `l` | item 36, text 16/24, icon 20, search row 56 | Touch-friendly palettes | |
| `xl` | item 40, text 16/24, icon 20, search row 56 | Large screens, kiosks | |

The query text is always body-l.

### variant (FooterKeyBox)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | Badge-s key cap on `fill-muted`, secondary text | Key legend | yes |
| `ghost` | Text only, muted | Secondary hints | |

### Structure
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `InputRow leading` default / `null` / custom | Search icon / nothing / your node | Replace the icon with a scope or remove it | search icon |
| with DialogTitle / DialogDescription | Heading above the search row | The palette needs a visible title | |
| with TagSection | Chip row under the search row | Search scopes | |
| with Footer | Key hints at the bottom | Teach the keyboard | |

**Combinations** — global search: `size="m"`, groups with headings, `ItemShortcut`s and a Footer legend. Long single-list picker: one Group, custom `labels.empty` / `labels.emptyHint`.

## States
- Open / closed: as Modal (`data-state` on the scrim and panel).
- Active item: the first matching item is active; `data-selected="true"` and `aria-selected="true"` on it, highlighted with `fill-subtle-active`; pointer move activates the hovered item; the active item scrolls into view.
- Filtered out: items and groups get `hidden`.
- Disabled item: excluded from results (never shown dimmed).
- Empty: CommandMenu.Empty appears when nothing matches.
- Query: uncontrolled by default, reset when the palette opens; controlled with Input `value`.
- Dialog tier: `data-size` on the tier wrapper; FooterKeyBox `data-variant`.

## Layout & spacing
- One inset column (`--prime-space-2` list padding + item padding 8): title, search icon, chips, group headings and item icons all start 16 from the edge.
- List padding `--prime-space-2`, gap `--prime-space-1` between groups; icon → label gap `--prime-space-3`.
- Max height 1.5 × `--prime-panel-max-height` (or the viewport); only the list scrolls, the search row never moves.

## Accessibility
- Dialog: `role="dialog"`, `aria-modal`; give it `aria-label` or `aria-labelledby` (DialogTitle is not linked automatically).
- Input: `role="combobox"`, `aria-expanded="true"`, `aria-controls` → list, `aria-activedescendant` → active option. Focus stays in the input: Arrow Down / Up move the active item (wrapping), Home / End jump, Enter runs `onSelect` of the active item, Escape closes.
- List `role="listbox"`, items `role="option"`, groups `role="group"` labelled by their heading; Empty is `role="status"`.
- Focus returns to the opener on close.
- `labels`:

| Key | Default | Used for |
|---|---|---|
| `search` | `"Поиск"` | Default placeholder and accessible name of the input |
| `empty` | `"Ничего не найдено"` | Empty state text |
| `emptyHint` | `"Попробуйте изменить запрос"` | Second line of the empty state (empty string hides it) |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [keyboard-search.tsx](examples/keyboard-search.tsx) | ⌘K app palette with groups, keywords, descriptions, shortcuts, empty state and key legend | Global app search |
| [sizes.tsx](examples/sizes.tsx) | Dialog `size` xs → xl | Matching the app density |
| [states.tsx](examples/states.tsx) | Long scrolling list, disabled item, custom empty texts | Picking from a long list |
| [composition.tsx](examples/composition.tsx) | DialogTitle / Description, trailing Kbd and close, scope tags, footer hints and a `ghost` FooterKeyBox | Palettes with a heading or scopes |
| [controlled.tsx](examples/controlled.tsx) | Controlled `open` and controlled query | Parent reads / resets the query |

```tsx
import { CommandMenu } from "prime-ui-kit";

export function Example() {
  return (
    <CommandMenu.Dialog defaultOpen aria-label="Команды">
      <CommandMenu.InputRow>
        <CommandMenu.Input />
      </CommandMenu.InputRow>
      <CommandMenu.List>
        <CommandMenu.Empty />
        <CommandMenu.Group heading="Страницы">
          <CommandMenu.Item value="дашборд">Дашборд</CommandMenu.Item>
        </CommandMenu.Group>
      </CommandMenu.List>
    </CommandMenu.Dialog>
  );
}
```

## Mistakes
- No `aria-label` / `aria-labelledby` on Dialog → the dialog has no name.
- Expecting DialogTitle to name the dialog by itself → pass its `id` to `aria-labelledby`.
- Using `onClick` for the action → use `onSelect` so Enter works too.
- Showing unavailable commands with `disabled` expecting a dimmed row → disabled items are hidden; omit or explain them.
- Putting a Select-like form value into a CommandMenu → use Select.

## Related
[Modal](../modal/COMPONENT.md) · [Dropdown](../dropdown/COMPONENT.md) · [Select](../select/COMPONENT.md) · [Kbd](../kbd/COMPONENT.md) · [Tag](../tag/COMPONENT.md)
