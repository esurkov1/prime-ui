# Badge

**Category:** data-display
**Kind:** primitive

> The kit's one chip: a static label for a status, category or count, a removable value or applied filter, and a pressable toggle with a hover action — in a palette color.

## When to use
- Status of a row in a table or list («Оплачен», «Просрочен») — `tone`; a category («Бета», a team, a tag) — `color`.
- Counters inside buttons and fields («Входящие 12», «−25%»).
- A workflow state with a leading dot (`Badge.Dot`).
- A person on a record (an assignee, an author) — `Badge.Avatar`, a picker inside a `Dropdown.Trigger`.
- A selected value, keyword or applied filter the user can remove (`onRemove`).
- Values in a filter panel that toggle on press and hide with a hover action (the `pressed` triad, `Badge.Action`).
- A short code as a square tile (a file format «PDF») — `shape="square"`.
- Several badges as one value (the tags of a client, a record's labels) — `Badge.Group`: it wraps and keeps one gap.

## When not to use
- A multi-select field with chips → use [TagSelect](../tag-select/COMPONENT.md) (it renders badges itself).
- A keyboard key or shortcut → use [Kbd](../kbd/COMPONENT.md).
- A person's presence → `Avatar.Status` from [Avatar](../avatar/COMPONENT.md).
- A command (save, open, go somewhere) → use [Button](../button/COMPONENT.md); a pressable badge toggles a value.
- A message about the page or a section → use [Banner](../banner/COMPONENT.md).

## Import
```tsx
import { Badge } from "prime-ui-kit";
```

## Anatomy
```
Badge.Root          <span>: fill, tier dimensions
├─ Badge.Avatar     a person's chip: the Avatar.Root at the start, 2 px inside the height; the chip is a pill
├─ [start segment]  Badge.Icon or Badge.Dot at the start edge: full height, mark centred
├─ body             text, Badge.Dot, inline Badge.Icon
│                   (a toggle <button> with the pressed triad, or the opener inside a `Dropdown.Trigger`; a <span> with a trailing segment; none when read-only)
├─ Badge.Action     optional end segment revealed on hover / focus (always shown on touch screens)
└─ remove segment   with onRemove: full height, the whole end is the hit area (Icon action.close)

Badge.Group         <div>: a row of Badge.Root, one value; `size` sets every badge's tier
├─ Badge.Root …     one per value; with overflow="count" the ones that do not fit are hidden
└─ «+N» badge       overflow="count": a focusable Badge.Root in a Tooltip listing the hidden values
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Badge.Root
`ref` → `HTMLSpanElement`. The chip: a read-only badge is one `<span>`, the `pressed` triad makes the body a toggle `<button>`, `onRemove` adds a remove segment; inside a `Dropdown.Trigger` the body is the opener with a chevron.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` without `tone` | Palette hue: a category (a team, a tag); the text carries the meaning. Not together with `tone`. |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger" \| "info"` | — | A status in the role colors (paid, overdue, failed); `neutral` is the gray hue. Not together with `color`. |
| `variant` | `"solid" \| "soft" \| "outline"` | `"soft"` | Treatment. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | — | Badge tier, 16 · 20 · 24 · 28 · 32 px high. Without it the badge follows the surrounding control one tier down; outside a control it is `m`. |
| `shape` | `"chip" \| "square"` | `"chip"` | `square` — a tile as wide as it is tall, the text centred: a file format («PDF»), a short code. |
| `onRemove` | `() => void \| Promise<void>` | — | Adds the full-height remove segment at the end; called on its click. Return the request's promise: the badge waits with a spinner; take it out of your list before resolving; on reject it stays. |
| `loading` | `boolean` | `false` | The badge waits on a request (a value its owner is still creating): dimmed, `aria-busy`, a spinner in the remove segment, which takes no press. A promise from `onRemove` does the same on its own. |
| `pressed` | `boolean` | — | A toggle chip (a filter value): the body becomes a `<button>` over the whole badge with `aria-pressed`; on takes the selected look (accent soft). |
| `defaultPressed` | `boolean` | — | The initial state of an uncontrolled toggle chip; a press flips it. |
| `onPressedChange` | `(pressed: boolean) => void` | — | Fires with the new state when the toggle chip is pressed. |
| `disabled` | `boolean` | — | Muted look for every variant, `aria-disabled`; the body button, remove and action get native `disabled`. |
| `className` | `string` | — | Class on the badge. |
| `labels` | `Partial<BadgeLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Text, `Badge.Dot`, `Badge.Icon`, one `Badge.Avatar` (a person's chip), one `Badge.Action`. Only `Badge.Icon` children (no remove or action) make a square icon-only badge. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "onClick" \| "color">` | — | `aria-label` (an icon-only badge named by it is an image) and the other span attributes; no `onClick` — a pressable chip is the toggle. |

### Badge.Group
`ref` → `HTMLDivElement`. A row of badges as one value (the tags of a record): it wraps onto more lines, the badges a chip gap apart, or with `overflow` stays on one line behind a «+N» badge.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | the host tier, one step down | Tier of every badge in the group; a badge's own `size` wins. Small tiers stand closer. |
| `overflow` | `"wrap" \| "count"` | `"wrap"` | `wrap` — the row wraps onto more lines. `count` — one line (a table cell): the badges that fit the container, the rest behind a focusable «+N» badge whose tooltip lists them. |
| `labels` | `Partial<BadgeGroupLabels>` | — | Built-in strings of the «+N» badge, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the `Badge.Root`s, one per value), `className`, `aria-label` (a named group is `role="group"`) and the other div attributes. |

### Badge.Icon
`ref` → `HTMLSpanElement`. A `<span>` holding one icon at the tier icon size. At the first or last position it becomes a full-height edge segment.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon (`Icon`). |
| `className` | `string` | — | Class on the icon box. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | The other span attributes. |

### Badge.Avatar
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` leading a person's chip (an assignee): the `Avatar.Root` inside takes the chip tier's size, 2 px inside its height (`2xs` at `xs`/`s`, `xs` at `m`, `s` at `l`/`xl`); the chip becomes a pill, the name is its text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | An `Avatar.Root` (photo or initials), also inside your own component; no `size` — the slot sets it. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Badge.Dot
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` dot in the text color; at an edge it becomes a segment. Alone (a marker on an icon, before a label) it takes the host tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | — | A dot of its own hue (the solid step) instead of the text color: a project color, an attention mark. |
| `className` | `string` | — | Class on the dot. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "color">` | — | The other span attributes. |

### Badge.Action
`ref` → `HTMLButtonElement`. A `<button>` segment at the end, revealed on hover and focus (always shown on touch); the width never changes. One per badge, not together with `onRemove`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Accessible name and tooltip («Скрыть billing»). |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — (required) | Runs the action. |
| `persistent` | `boolean` | `false` | Keeps the action shown, not only on hover and focus (while the state it sets is on). |
| `pressed` | `boolean` | — | Toggle state of the action: `aria-pressed`; on, the segment stays shown with the pressed wash. |
| `disabled` | `boolean` | `false` | The action is unavailable. |
| `children` | `ReactNode` | — | A custom glyph at the tier icon size; a minus by default. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "onClick" \| "children">` | — | `className` and the other button attributes. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | light palette fill, hue text | statuses and categories — the normal case | yes |
| `solid` | saturated hue fill, contrasting text | one label per area that must stand out | |
| `outline` | transparent, 1px inset line in the hue text at 32% | a quiet secondary label next to soft badges | |

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | the gray hue | draft, archived, cancelled | |
| `success` | the success role colors | paid, published, done | |
| `warning` | the warning role colors | waiting, needs attention | |
| `danger` | the danger role colors | failed, overdue, rejected | |
| `info` | the info role colors | issued, in progress | |

A status takes `tone`; a category takes `color`. The two never go together (the type refuses it).

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral wash | a category without a hue of its own | yes (without `tone`) |
| `blue` · `green` · `orange` · `red` · `yellow` | palette hues | teams, projects, tags, file kinds | |
| `purple` | purple | roles, private categories | |
| `sky` · `pink` · `teal` | extra hues | more categories | |

### shape
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `chip` | as wide as its content | every badge | yes |
| `square` | a tile as wide as it is tall, the text centred and clipped | a file format, a short code | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 16px high, text 12, icon 12 | inside `xs` / `s` controls | |
| `s` | 20px high, text 12, icon 12 | inside `m` controls (inherited automatically) | |
| `m` | 24px high, text 12, icon 14 | standalone labels in tables and lists | yes (outside controls) |
| `l` | 28px high, text 13, icon 16 | next to section titles | |
| `xl` | 32px high, text 14, icon 16 | large headers | |
| — (omitted) | one tier below the surrounding control | inside Button, Input, Tabs | yes (inside controls) |

### overflow (Badge.Group)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `wrap` | the row wraps onto more lines | tags of a record in a card, a form, a detail pane | yes |
| `count` | one line: the badges that fit, then «+N» | a table cell, a list row — a set of values that must keep the row's height | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` | muted fill, disabled text, no outline, for every variant | the labelled item is inactive | `false` |
| `loading` | content dimmed, a spinner in the remove segment | the value waits on a request its owner runs (a tag being created); a promise from `onRemove` needs no flag | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| hue / treatment | `color` or `tone`, `variant` | `data-color` (a hue, or gray for `neutral`), `data-tone`, `data-variant` (always set); `data-shape="square"` for a tile |
| size | `size`, else the control, else `m` | `data-size`, `data-tier` (visual tier) |
| icon segments | edge `Badge.Icon` / `Badge.Dot`, icon-only | `data-icon-start`, `data-icon-end`, `data-icon-only` |
| plain text | read-only, text children only | `data-text-only`: the root is one block box that ellipsizes; otherwise each text run sits in its own block span |
| removable | `onRemove` | `data-removable`; the remove segment takes a `fill-subtle-active` wash on hover |
| removing | `onRemove` returned a pending promise, or `loading` | `data-pending`, `aria-busy`; the content quiets to 0.6 (`fast`, both ways), a `Spinner` stands in for the ×, the segment gets `aria-disabled` and takes no second press; rejected — the badge stays and `labels.removeFailed` is announced |
| leaving | the owner took the badge out (after its remove segment, or any change of the list) | a copy stays in place and closes up — fades, settles and shrinks to nothing with its gap (`fast`, `exit`, `internal/partPresence`) — so the badges after it glide in; off under reduced motion |
| toggle / pressed | the `pressed` / `defaultPressed` / `onPressedChange` triad | `data-pressable`, `aria-pressed` on the body; on adds `data-pressed` and the selected look (accent soft), gliding in and out (`fast`); hover washes a step of the badge's text color over its fill |
| action | `Badge.Action` | `data-action="reveal" \| "persistent"`; the text slides and the segment fades in over `fast` |
| disabled | `disabled` | `data-disabled`, `aria-disabled`; inner buttons disabled, no hover wash |
| person | a `Badge.Avatar` child | `data-avatar` on the root: a pill (`radius-full`), the avatar first whatever the order, its `data-size` the chip's (`chipAvatarSize`: `2xs` · `2xs` · `xs` · `s` · `s`); the avatar's box is `aria-hidden` |
| icon-only, named | only `Badge.Icon` children and `aria-label` | `role="img"` with that name |
| count | a number as the only child | the digits roll to the new value when the number changes |
| overflowed | `Badge.Group overflow="count"`, the badge does not fit the row | `data-overflowed` on the badge (out of the flow, `visibility: hidden`); the group's `data-overflow="count"`; re-measured on every resize of the row or a badge (`useResizeEffect`), the «+N» text from `labels.more` |

## Layout & spacing
- Inline-flex, `width: fit-content`, `max-width: 100%`; text never wraps and ends in an ellipsis.
- Segments are `mark + padding + gap` wide and full height; the mark sits with equal space to the edge and to the text.
- `Badge.Dot` is 6px, 8px from `l`; alone it takes the tier of the surrounding control; `color` paints it in the solid step of that hue.
- The root never clips: the text ellipsizes in its own box, so the segments' touch areas reach past the chip.
- `Badge.Action` room is reserved, so revealing it never changes the badge width.
- Several badges in a row: `Badge.Group` — it wraps, badges 8 apart (4 at the `xs` and `s` tiers).
- `overflow="count"` fits the container, not the viewport: a DataTable cell, a 320px column. At least the first badge stays; when it alone does not fit it ellipsizes.
- A person's chip (`Badge.Avatar`): the avatar keeps the same 2 px from the top, the bottom and the start (flush in the 16 tier), and as much again before the name.
- In a list row the badge is the trailing column; the title column gets `min-width: 0` and an ellipsis.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Focuses the body of a toggle chip, then its action or remove segment; in `Badge.Group` with `overflow` the «+N» badge, which opens its tooltip with the hidden values. |
| `Enter` · `Space` | Presses the focused body (the toggle flips), remove or action button. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A read-only badge is plain text in a `<span>`, no role.
- The `pressed` triad makes the body a `<button>` with `aria-pressed`; remove and `Badge.Action` are separate buttons with their own names.
- Give every remove button a unique name with `labels.remove`; after removing, move focus to a neighbouring badge or the source field.
- While a removal is saved the badge has `aria-busy` and the segment `aria-disabled`; once a removal waits, the badge mounts a polite live region that speaks `labels.removeFailed` if the promise rejects.
- `Badge.Dot` is `aria-hidden`; an icon-only badge needs `aria-label` and then is `role="img"`. Color never carries meaning alone, a `tone` neither.
- `overflow="count"`: the badges that did not fit are `visibility: hidden` (out of the tree and the Tab order); the «+N» badge is a tab stop read as `labels.moreCount`; its tooltip, open while it has focus, lists the hidden values as its description.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Badge.Root

| Key | Default | Used for |
|---|---|---|
| `remove` | `"Удалить"` | Accessible name of the remove segment; include the badge text («Убрать фильтр «Москва»»). |
| `removeFailed` | `"Не удалось удалить"` | Spoken when the `onRemove` promise rejects and the badge stays; name the badge («Фильтр «Москва» не убран»). |

#### Badge.Group

| Key | Default | Used for |
|---|---|---|
| `more` | `"+{count}"` | Visible text of the badge for the badges that did not fit; `{count}` — how many. |
| `moreCount` | `"Ещё {count}"` | What assistive tech reads for that badge instead of its visible text; `{count}` — how many. The values themselves come in its tooltip. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Invoice statuses: soft badges where the text carries the meaning and the tone repeats it — `tone`. |
| [variants.tsx](examples/variants.tsx) | Every palette hue in every treatment; the text must read without the color — `variant`, `color`. |
| [sizes.tsx](examples/sizes.tsx) | Every badge tier, 16 to 32 px high — `size`. |
| [states.tsx](examples/states.tsx) | An inactive badge, a toggle chip off and on, a removable one and one that waits on a request — `disabled`, `pressed`, `onRemove`, `loading`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading dot in the text color or its own hue, a leading or trailing icon and an icon-only square with a name — `Badge.Dot`, `color`, `Badge.Icon`, `aria-label`. |
| [in-controls.tsx](examples/in-controls.tsx) | Inside a button or a field the badge takes the tier one step down by itself — `Badge.Root`. |
| [applied-filters.tsx](examples/applied-filters.tsx) | Applied filters: each badge drops its filter and names it for screen readers — `onRemove`, `labels`. |
| [server-tags.tsx](examples/server-tags.tsx) | Order tags removed on the server: a badge waits dimmed with a spinner, leaves once the server agrees and stays with an announcement when it refuses — `onRemove`, `labels`. |
| [filter-values.tsx](examples/filter-values.tsx) | Filter values as toggles with a hide action that slides in without changing the width — `pressed`, `onPressedChange`, `Badge.Action`, `persistent`. |
| [trigger.tsx](examples/trigger.tsx) | The stage of a deal as a badge that opens the stage picker: the chevron turns while the menu is open, the badge takes the picked stage's color — `Badge.Root`, `Dropdown.Trigger`, `color`. |
| [assignee.tsx](examples/assignee.tsx) | The assignee of a task as a person's chip that opens the team: the avatar leads the name, and with nobody assigned an outline call to assign stands in its place — `Badge.Avatar`, `Dropdown.Trigger`, `variant`. |
| [square.tsx](examples/square.tsx) | File formats as square tiles of text, large enough for three letters; the hue sorts them by kind — `shape`, `size`, `color`. |
| [tag-row.tsx](examples/tag-row.tsx) | The tags of a client as one value: the row wraps in a narrow column and keeps one gap between badges — `Badge.Group`, `size`. |
| [overflow-count.tsx](examples/overflow-count.tsx) | The sections of each role in one line of a narrow cell: what does not fit waits behind «+N» with the full list in its tooltip — `Badge.Group`, `overflow`. |
| [controlled.tsx](examples/controlled.tsx) | Delivery cities as toggle chips whose state the screen owns: the summary counts the chosen ones — `pressed`, `onPressedChange`. |

## Mistakes
- `<Badge.Root onClick={…}>` → the type refuses it: a toggle chip is the `pressed` triad, a command is a `Button`.
- A status in a palette hue (`color="red"` for «Просрочен») → `tone="danger"`; `color` is for categories.
- A toggle drawn by switching `color` → the `pressed` triad: the selected look comes with `aria-pressed`.
- A square format tile styled by a host class → `shape="square"`.
- A custom × or hover button next to a badge → use `onRemove` or `Badge.Action`.
- Several removable badges with the default «Удалить» → pass `labels.remove` with the badge text.
- A colored badge with no text → keep a word; color alone is not a signal.
- An explicit `size` inside a control → drop it; the badge takes the tier one step down.
- A row of badges in a hand-made flex wrapper with its own gap → `Badge.Group`.
- A set of values in a table cell that wraps and grows the row, or a hand-made «+N» → `Badge.Group overflow="count"`.
- `onRemove` together with `Badge.Action` → one end segment per badge.
- An `Avatar.Root` with its own `size` inside a badge, or in a `Badge.Icon` → put it in `Badge.Avatar` without `size`: the chip sizes it.
- Removing the badge from your list first and putting it back when the request fails → return the request's promise and remove it after it succeeds; the badge waits meanwhile.

## Related
- **Built from:** `Icon` (remove ×, `Badge.Action` −), [Spinner](../spinner/COMPONENT.md) (removing), `internal/chipTier` (tiers), `internal/glyphSwap` (× ⇄ spinner), `internal/partPresence` (leaving), [VisuallyHidden](../visually-hidden/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md) (the «+N» list), `useResizeEffect` (fitting the row), `internal/formatLabel` (`labels`), `internal/mediaSlot` (`Badge.Avatar` sizes the Avatar inside)
- **See also:** [TagSelect](../tag-select/COMPONENT.md), [Select](../select/COMPONENT.md) (row badges), [SegmentedControl](../segmented-control/COMPONENT.md) (`Count`, color dots), [SmartFilter](../smart-filter/COMPONENT.md), [Kbd](../kbd/COMPONENT.md), [Avatar](../avatar/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)
