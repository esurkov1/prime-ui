# Select

**Category:** selection
**Kind:** field

> A field for choosing one value (or several with `multiple`) from a closed list.

## When to use
- One value from a closed list of 5+ options in forms, filters and settings: country, role, time zone.
- A long list where search helps (`Select.Content searchable`, `keywords`).
- A value out of thousands of records searched on the server (`search`, `onSearchChange`, `filter={false}`, `hasMore` + `onLoadMore`).
- A few values from a short list shown as comma-separated text (`multiple`).
- Options that need a picture, an avatar, a second line, a badge or a trailing value (rich options).

## When not to use
- 2–5 options that should all be visible → use [Radio](../radio/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md).
- The OS picker on a mobile-first form → use [NativeSelect](../native-select/COMPONENT.md).
- Many values shown as removable tags, or creating new values → use [TagSelect](../tag-select/COMPONENT.md).
- Free text → use [Input](../input/COMPONENT.md).
- A menu of actions (not a value) → use [Dropdown](../dropdown/COMPONENT.md).
- Global search / command palette → use [CommandMenu](../command-menu/COMPONENT.md).
- Dates → use [Datepicker](../datepicker/COMPONENT.md).

## Import
```tsx
import { Select } from "prime-ui-kit";
```

## Anatomy
```
Select.Root                       field frame: label · control · hint/error; value, open, search
├── Select.Trigger                <button role="combobox">: [icon] [value] [clear] [chevron]
│   ├── Select.TriggerIcon        optional leading glyph
│   └── Select.Value              picked label or placeholder (renderValue for a rich trigger)
└── Select.Content                portaled panel while open; closed, the items render hidden in place so the trigger knows their labels
    ├── search row                with `searchable`
    ├── role="listbox"
    │   ├── Select.Group          role="group", named by `label`
    │   │   └── Select.Item       role="option": [checkbox] [icon / Avatar / Thumbnail] [text] [meta / Badge] [check]
    │   │       ├── Select.ItemIcon · Avatar.Root · Thumbnail.Root
    │   │       ├── Select.ItemText · Select.ItemDescription
    │   │       └── Select.ItemMeta · Badge.Root
    │   ├── Select.Separator      full-bleed Divider
    │   └── skeleton rows         `loading` with no items, `loadingMore` at the end
    ├── empty state               compact EmptyPage
    └── load error                compact EmptyPage, role="alert", retry Button (`loadError`, `onRetry`)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Select.Root
`ref` → `HTMLDivElement`. The field frame (label row · control · support row) holding the value, the open state and the search query.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| string[]` | — | Controlled value; `string[]` with `multiple`. |
| `defaultValue` | `string \| string[]` | — | Initial value, uncontrolled. |
| `onValueChange` | `(value: string) => void \| (value: string[]) => void` | — | Called with the picked value (`""` after clearing), or the new list with `multiple`. |
| `multiple` | `boolean` | `false` | Several values: checkboxes in the list, the list stays open on a pick, labels joined in the trigger. |
| `open` | `boolean` | — | Controlled open state of the list. |
| `defaultOpen` | `boolean` | `false` | Initial open state, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, pick, Escape, an outside press. |
| `label` | `ReactNode` | — | Field label above; names the trigger. |
| `hint` | `ReactNode` | — | Support text under the field; linked by `aria-describedby`. |
| `error` | `ReactNode` | — | Error message; replaces the hint and implies `invalid`. |
| `required` | `boolean` | `false` | Red `*` after the label and `aria-required` on the trigger. |
| `optional` | `boolean` | — | Muted `labels.optional` after the label. |
| `invalid` | `boolean` | `false` | Danger inset ring and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Disabled field; the list never opens. |
| `search` | `string` | — | Controlled search query (`Select.Content searchable`); together with `onSearchChange`. Cleared when the list closes. |
| `defaultSearch` | `string` | `""` | Initial query, uncontrolled. |
| `onSearchChange` | `(search: string) => void` | — | Called with the new query: typing, and `""` when the list closes. Load the matching options here for a server search. |
| `filter` | `boolean` | `true` | The list filters its items by the query. `false` when the options come from a server: every item shows, the query is still marked in the labels. |
| `loading` | `boolean` | `false` | Options are loading: a Spinner instead of the chevron, `aria-busy`, skeleton rows in the list while no item matches; items already on screen stay. |
| `loadingMore` | `boolean` | `false` | More options are loading at the end: skeleton rows after the items. |
| `hasMore` | `boolean` | `false` | More options exist: reaching the end of the list calls `onLoadMore`. |
| `onLoadMore` | `() => void \| Promise<void>` | — | Called once per round with `hasMore` when the end of the list scrolls into view or the highlight reaches the last option; set `loadingMore` while it runs. |
| `loadError` | `ReactNode` | — | The options failed to load: the message replaces the list in `role="alert"`. Not the field `error` (validation). |
| `onRetry` | `() => void` | — | A retry button (`labels.retry`) under `loadError`; Enter in the open list runs it too. |
| `clearable` | `boolean` | `false` | A clear segment before the chevron while a value is set; `Delete` / `Backspace` on the trigger clear too. |
| `name` | `string` | — | Form field name: hidden inputs submit the value (`""` while empty; one input per value with `multiple`). |
| `placeholder` | `string` | — | Text in the trigger while nothing is picked. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Field tier: trigger height, padding, text; the list rows, the label and the hint follow it. |
| `focusRing` | `boolean` | `true` | `false` hides the visual focus ring (`data-focus-ring="false"`), never focus or the error ring. |
| `id` | `string` | — | Id of the trigger; generated when omitted. |
| `labels` | `Partial<SelectLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | Trigger and Content. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

### Select.Trigger
`ref` → `HTMLButtonElement`. `<button role="combobox">` with the value, the clear segment and the chevron (a Spinner while `loading`). + native button props (`onFocus`, `onBlur`, `onKeyDown`… reach the button).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `Select.TriggerIcon`, `Select.Value`, optionally a Badge after it. |

### Select.Value
`ref` → `HTMLSpanElement`. The picked label (labels joined with `multiple`) with an ellipsis, or the placeholder.

| Prop | Type | Default | Description |
|---|---|---|---|
| `renderValue` | `(item: { value: string; label: string }) => ReactNode` | — | Single mode: draws the picked option in the trigger with the same parts as the row — a leading Avatar or Thumbnail, ItemText, ItemDescription, and a trailing Badge or ItemMeta at the end before the chevron; not called while empty. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Select.TriggerIcon · Select.ItemIcon
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` with a leading glyph at the tier icon size: before the value / before the option label. + native `<span>` props.

### Select.Content
`ref` → `HTMLDivElement` (the panel). Portal + the floating list panel, mounted while open and during its exit animation (closed, the items render hidden in place so the trigger knows their labels), shown with the overlay motion. Holds the search row, the `role="listbox"`, the empty state and the load states (skeleton rows, the load error), which cross-fade. Below 640px of viewport the panel is a bottom sheet: a scrim, a grab handle, swipe down to close, page scroll locked.

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchable` | `boolean` | `false` | A search field on top; items filter by label, description and `keywords` — or the owner loads them by the query (`search`, `filter={false}` on Root). |
| `children` | `ReactNode` | — (required) | Items, groups, separators. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "hidden" \| "onKeyDown" \| "onAnimationEnd">` | — | `className` and the other attributes of the panel. |

### Select.Item
`ref` → `HTMLDivElement`. `role="option"` with `aria-selected`; a check on the end (single) or a Checkbox.Indicator in front (`multiple`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Value of the option. |
| `label` | `string` | — | Text in the trigger and for typeahead; defaults to `Select.ItemText`, then the plain text. |
| `keywords` | `string` | — | Extra words for the search. |
| `disabled` | `boolean` | `false` | Muted, skipped by the keyboard, not selectable. |
| `children` | `ReactNode` | — (required) | Text, or `Select.ItemIcon`, `Avatar.Root`, `Thumbnail.Root`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta`, `Badge.Root` as direct children. |

### Select.ItemText · Select.ItemDescription · Select.ItemMeta
`ref` → `HTMLSpanElement`. Rich option parts: the title (its text is the label) / a muted second line (searchable; makes the row two-line) / a trailing muted value before the check. An `Avatar.Root` or `Thumbnail.Root` child is the leading media (a Thumbnail makes the row two-line), sized to the tier unless it sets `size`; a `Badge.Root` child trails the text one tier down. + native `<span>` props.

### Select.Group
`ref` → `HTMLDivElement`. `<div role="group">` named by its `label`; hidden while the search leaves none of its options. + native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading of the group (caption, muted); also its accessible name. |

### Select.Separator
`ref` → `HTMLDivElement`. A full-bleed Divider between groups; hidden while searching.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the divider. |

## Variants
No `variant` or `tone`. The trigger is the field look (fill, inset control border, tier radius); the panel is the shared floating surface with menu rows.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 trigger, 12/16 text, 24 rows | Dense table filters | |
| `s` | 32 trigger, 13/20 text, 28 rows | Compact toolbars and side panels | |
| `m` | 36 trigger, 14/20 text, 32 rows | Regular forms | yes |
| `l` | 40 trigger, 16/24 text, 36 rows | Spacious forms | |
| `xl` | 48 trigger, 16/24 text, 40 rows | Touch-first screens | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `multiple` | checkbox on the left of every row, the list stays open, labels joined in the trigger | A few values from a short list | `false` |
| `clearable` | × segment before the chevron while a value is set (full height, one hover wash) | The field is optional and can be reset | `false` |
| `loading` | spinner instead of the chevron; skeleton rows in the option geometry while no item is on screen | Options load asynchronously | `false` |
| `loadingMore` | skeleton rows after the items | The next page is loading (`hasMore` + `onLoadMore`) | `false` |
| `filter={false}` | every item shows whatever the query; the query is still marked in the labels | The owner searches on the server (`search`, `onSearchChange`) | `true` |
| `searchable` (Content) | search row with a faint hairline at the top of the list | More than ~10 options | `false` |
| rich options | `Thumbnail.Root` or `Select.ItemDescription` in an item: a two-line row; `Avatar.Root` before the text and `Badge.Root` after it keep one line; the trigger the same with `renderValue` | Products, people, delivery tariffs | |

**Combinations** — `renderValue` is single-mode only; with `multiple` the trigger shows the joined labels. `error` implies `invalid`; `loadError` is a different thing — the options failed to load — and never marks the field invalid. A status Badge can follow `Select.Value` inside the trigger; it takes the tier one step down by itself. An `Avatar.Root` or `Thumbnail.Root` in a row or `renderValue` takes the tier media size (`xs` · `xs` · `s` · `s` · `m` for `xs`–`xl`) unless it sets `size`. A server search: `searchable` + `search` / `onSearchChange` + `filter={false}` + `loading`; paging adds `hasMore`, `loadingMore`, `onLoadMore`; keep the selected option among the items (or draw it with `renderValue`) so the trigger knows its label.

## States
| State | Driven by | DOM |
|---|---|---|
| empty | no value | `data-placeholder="true"` on Value, placeholder color |
| open | `open` / click / arrows | trigger `data-state="open"`, `aria-expanded`; panel `data-state`, `data-side`; chevron turns 180° |
| invalid | `invalid` or `error` | `data-invalid="true"`, `aria-invalid` on the trigger; error text below; the control shakes once when an error arrives (`data-shake` on the frame) |
| disabled | `disabled` | native `disabled`, `data-disabled="true"` |
| loading | `loading` | `data-loading="true"`, `aria-busy` on the trigger and the list; with no item on screen, `aria-hidden` skeleton rows (`data-skeleton`) in the list; `labels.loading` in a polite live region |
| loading more | `loadingMore` | skeleton rows after the items; the end of the list is watched while `hasMore` (`onLoadMore` once per batch) |
| load error | `loadError` | the list is `hidden`; a compact EmptyPage with `role="alert"` and a retry Button (`onRetry`) |
| state swap | loading ↔ items ↔ load error | the new content fades in (`swapMotion`), the first render stays still |
| searching | typing in the search | panel `data-searching="true"`; groups without matches and separators hide; the match in an option's title, description and plain text is a `<mark>` in `accent-text` (not in the trigger); the query clears when the list closes (`onSearchChange("")`) |
| nothing to show | no option matches (and not loading) | a compact EmptyPage with `role="status"`: `labels.empty`, plus `labels.emptyHint` while a query is typed |
| sheet | viewport below 640px | a scrim and a full-width bottom sheet with an `aria-hidden` grab handle around the panel; the sheet carries `data-state`, the panel keeps its role and ref; page scroll locked; a swipe down from the handle closes it |
| option highlighted / selected / disabled | keyboard and pointer / value / `disabled` | `data-highlighted`, `data-selected` + `aria-selected`, `data-disabled` + `aria-disabled`; highlight is a fill only |

## Layout & spacing
- The trigger is 100% wide; set the width with the layout (grid column, max-width wrapper).
- Label → field: tier `label-gap`; field → hint: tier `hint-gap`; field → field in a form: `--prime-space-5`.
- Panel: at least the trigger width and `--prime-panel-min-width`, at most twice that; max height `--prime-panel-max-height` (scrolls); flips near the viewport edge.
- Long values truncate with an ellipsis in the trigger.
- A rich row and its trigger use the same parts in the same order: leading media (`Avatar.Root`,
  `Thumbnail.Root`) → `Select.ItemText` (+ `Select.ItemDescription`) → trailing `Badge.Root` /
  `Select.ItemMeta`. In a row the trailing part sits before the check; in the trigger, at the end
  before the chevron. Draw the trigger with `renderValue` returning the row's parts, so the picked
  person keeps their avatar and role badge when the list is closed:

```tsx
<Select.Root label="Ответственный" defaultValue="lebedeva">
  <Select.Trigger>
    <Select.Value
      renderValue={({ value, label }) => {
        const member = BY_VALUE.get(value);
        return (
          <>
            <Avatar.Root color={member?.color}>
              <Avatar.Fallback>{member?.initials}</Avatar.Fallback>
            </Avatar.Root>
            <Select.ItemText>{label}</Select.ItemText>
            {member?.role ? <Badge.Root color={member.color}>{member.role}</Badge.Root> : null}
          </>
        );
      }}
    />
  </Select.Trigger>
  <Select.Content>
    {TEAM.map((member) => (
      <Select.Item key={member.value} value={member.value}>
        <Avatar.Root color={member.color}>
          <Avatar.Fallback>{member.initials}</Avatar.Fallback>
        </Avatar.Root>
        <Select.ItemText>{member.name}</Select.ItemText>
        {member.role ? <Badge.Root color={member.color}>{member.role}</Badge.Root> : null}
      </Select.Item>
    ))}
  </Select.Content>
</Select.Root>
```

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` · `ArrowDown` · `ArrowUp` | On the trigger open the list; focus moves into the search or the list. |
| `ArrowDown` · `ArrowUp` · `Home` · `End` | In the list move the highlight over the enabled options, wrapping. |
| `Enter` · `Space` | Pick the highlighted option; a single pick closes the list and returns focus to the trigger. |
| `A–Я` | Typeahead: the highlight jumps to the option starting with the letter or the typed prefix. |
| `Delete` · `Backspace` | On the trigger with `clearable` clear the value. |
| `Enter` | With a load error in the open list, retries (`onRetry`). |
| `Escape` | Closes the list; focus returns to the trigger. |
| `Tab` | Returns focus to the trigger, closes the list and moves on from the trigger. |

### ARIA
- The trigger is `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`; `label` names it.
- The list is `role="listbox"` (`aria-multiselectable` with `multiple`); options are `role="option"` with `aria-selected`; the highlight goes through `aria-activedescendant`.
- The hint and the error are linked by `aria-describedby`; the error sets `aria-invalid`; loading sets `aria-busy`.
- While loading the list is `aria-busy` and `labels.loading` is announced politely; skeleton rows are hidden from screen readers; a load error is `role="alert"`.
- The highlight reaching the last option asks for the next batch the same way scrolling does.
- With `name`, hidden inputs carry the value into a native form submit; native trigger events (`onFocus`, `onBlur`, `onKeyDown`) reach the button.
- An outside press closes the list without moving focus back: focus follows the pointer (foundation §8).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `search` | `"Поиск"` | Placeholder and accessible name of the search field. |
| `empty` | `"Ничего не найдено"` | Empty state: no items or nothing matches. |
| `emptyHint` | `"Попробуйте изменить запрос"` | Second line of the empty state while searching; `""` hides it. |
| `loading` | `"Загрузка…"` | Announced while `loading` or `loadingMore`. |
| `retry` | `"Повторить"` | The retry button under `loadError` (`onRetry`). |
| `clear` | `"Очистить"` | Tooltip of the clear segment. |
| `optional` | `"необязательно"` | Muted marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled field with a placeholder; picking an option closes the list and shows its label — `label`, `placeholder`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the label, the list rows and the hint take the tier of the field — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to a disabled, a loading, an invalid one and a list with nothing in it — `disabled`, `loading`, `invalid`, `labels`. |
| [validation.tsx](examples/validation.tsx) | Live validation: unassigning the owner shakes the field and drops the error in, picking someone clears it; required and optional markers and a hint — `required`, `optional`, `hint`, `error`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading icon in the trigger and an icon before every option label — `Select.TriggerIcon`, `Select.ItemIcon`. |
| [multiple.tsx](examples/multiple.tsx) | Several values: checkboxes in the list, the list stays open on a pick, labels joined in the trigger — `multiple`. |
| [searchable.tsx](examples/searchable.tsx) | A long list with a search field: options match their label and keywords, groups and the separator hide while searching — `searchable`, `keywords`, `Select.Group`. |
| [server-search.tsx](examples/server-search.tsx) | A client out of thousands: the parent searches on the server as the query changes and loads the next page at the end of the list — `search`, `onSearchChange`, `filter`, `loading`, `hasMore`, `loadingMore`, `onLoadMore`. |
| [load-error.tsx](examples/load-error.tsx) | The options failed to load: the list says so in place and a retry loads them again — `loadError`, `onRetry`, `loading`. |
| [clearable.tsx](examples/clearable.tsx) | An optional field that can be reset: a clear segment before the chevron, Delete or Backspace on the trigger — `clearable`. |
| [rich-options.tsx](examples/rich-options.tsx) | Options with a picture, a second line and a price; the trigger draws the picked option with the same parts — `renderValue`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta`. |
| [people.tsx](examples/people.tsx) | People in the rows and the trigger: an avatar sized to the tier before the name, a role badge after it — `Avatar.Root`, `Badge.Root`, `renderValue`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the value: the plan drives the price under the field and a button resets it — `value`, `onValueChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the list: a button opens it from code, a pick or Escape closes it — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | Regional settings form: the required country is checked on submit, the error shakes the field and leaves once a country is picked, a calm note confirms the save — `required`, `error`, `hint`. |

## Mistakes
- A Label + `aria-labelledby` next to the field → pass `label`, `hint`, `error` to `Select.Root`.
- A function inside `Select.Value` → use `renderValue`.
- `Select.Group` with a separate heading element → pass the heading as `label`.
- Rich parts wrapped in your own `<div>` → put them as direct children of the item.
- A system select via a prop → use [NativeSelect](../native-select/COMPONENT.md).
- Mixing sizes in one form → keep every field of a form at one `size`.
- Results from a server passed as items with the kit filter still on → set `filter={false}`, or the kit hides results that do not contain the query literally.
- A spinner or «Загрузка…» item drawn by hand while options load → set `loading` (skeleton rows) and `loadingMore`.
- A failed load shown through the field `error` → use `loadError` + `onRetry`; `error` is for validation.
- An Avatar wrapped in `Select.ItemIcon` → put `Avatar.Root` as a direct child of the item; it takes the tier size.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (list), [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator` in `multiple`), [Spinner](../spinner/COMPONENT.md) (`loading` in the trigger), [Skeleton](../skeleton/COMPONENT.md) (loading rows), [EmptyPage](../empty-page/COMPONENT.md) (empty state, load error), [Button](../button/COMPONENT.md) (retry), [Divider](../divider/COMPONENT.md) (`Separator`), [Thumbnail](../thumbnail/COMPONENT.md) and [Avatar](../avatar/COMPONENT.md) (row media), [Badge](../badge/COMPONENT.md) (row badge), [VisuallyHidden](../visually-hidden/COMPONENT.md) (loading announcement), `Icon` (chevron, clear, check, search, retry), [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) (field frame)
- **See also:** [NativeSelect](../native-select/COMPONENT.md), [TagSelect](../tag-select/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Radio](../radio/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
