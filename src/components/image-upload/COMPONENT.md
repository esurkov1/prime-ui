# ImageUpload

**Category:** inputs
**Kind:** composite

> A set of pictures as square tiles that follow the field's width, the last tile adds more: reorder by drag, touch hold or keyboard, remove from the corner, and with `cover` the first picture is the cover.

## When to use
- Photos of an object that are shown in order: a listing, a product card, a vehicle, a property.
- The first photo matters (the cover in a catalogue) and people should choose it.
- A short set (up to a few dozen) arranged by hand, with adding and removing in place.

## When not to use
- Documents, attachments or any file that is not a picture → use [FileUpload](../file-upload/COMPONENT.md).
- One picture of a person or an account → use [Avatar](../avatar/COMPONENT.md) with the FileUpload avatar pattern.
- A read-only preview of an object → use [Thumbnail](../thumbnail/COMPONENT.md).
- A reorderable list that is not pictures → use [Dnd](../dnd/COMPONENT.md).

## Import
```tsx
import { ImageUpload, type ImageUploadItem } from "prime-ui-kit";
```

## Anatomy
```
ImageUpload                      field frame: label → tiles → hint | error
└─ <ul> (Dnd.Sortable, grid)     5 · 4 · 3 · 2 across by its own width; files drop anywhere on it
   ├─ <li> tile × value          square photo (`object-fit: cover`), radius `l`
   │  ├─ badge                   the position (or «Обложка» on the first with `cover`), top start
   │  ├─ delete Button           top end, the same `xs` square as the badge
   │  └─ «Сделать обложкой»      a light plate across the bottom (`cover`, every photo but the first)
   └─ <li> add tile              label + hidden file input: «+», «Добавить», `count из max`; the whole row when empty
```
Pictures are application data (`value`: `{ id, src, alt? }`). The component never uploads: it hands the picked or dropped files to `onFilesAdd`, and the owner adds items to `value`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ImageUpload
`ref` → `HTMLDivElement` (the field frame). The field frame (label → tiles → hint | error) around a `ul` of square picture tiles (`Dnd.Sortable`, `axis="grid"`) whose last cell adds more. The grid follows its own width: 5 · 4 · 3 · 2 across. Mounts its own `Dnd.Root` unless one is already above it. Sets `data-variant`, `data-dropping` while files are over it, `data-disabled`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `readonly ImageUploadItem[]` | — | Pictures in their order (controlled): `{ id, src, alt? }`. `alt` is spoken with the position, never drawn. |
| `defaultValue` | `readonly ImageUploadItem[]` | `[]` | Initial pictures (uncontrolled). |
| `onValueChange` | `(value: readonly ImageUploadItem[]) => void` | — | The set changed: reordered by drag or Alt + ← / →, a picture removed, or one made the cover. |
| `onFilesAdd` | `(files: File[]) => void` | — | Files picked in the add tile or dropped anywhere on the set: images only, cut to the room left under `max`. Turn them into items (an upload, or `URL.createObjectURL`) and add them to `value`. Without it there is no add tile: the set is only arranged. |
| `variant` | `"grid" \| "cover"` | `"grid"` | `grid`: equal tiles in rows, each numbered. `cover`: the first picture is the cover — two columns and two rows, badge «Обложка» — and every other picture offers «Сделать обложкой». |
| `max` | `number` | — | Most pictures: the add tile counts `count из max` (the digits roll) and at the limit says «Лимит фото» and takes nothing. |
| `accept` | `string` | `"image/*"` | File types of the picker. |
| `label` | `ReactNode` | — | Label above the tiles; names the list (`aria-labelledby`). |
| `required` | `boolean` | — | Red `*` after the label. |
| `optional` | `boolean` | — | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the tiles (formats, size). Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | — | `aria-invalid` on the file input and the danger support row. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | Read-only set: no add tile, no drag, no delete or cover actions. |
| `id` | `string` | — | Id of the file input; hint id is `<id>-hint`, error id is `<id>-error`. |
| `labels` | `Partial<ImageUploadLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `grid` | equal square tiles, each with its number | a set where every photo is equal (a gallery, inspection photos) | yes |
| `cover` | the first photo spans two columns and two rows with the badge «Обложка»; every other photo has «Сделать обложкой» | the first photo is shown alone elsewhere (a catalogue card) | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `max` | the add tile counts `count из max` (the digits roll); at the limit it says «Лимит фото» and takes nothing | the set has a limit | — |
| `disabled` | no add tile, no actions, nothing drags | a published or locked set | `false` |
| `invalid` / `error` | the danger support row, `aria-invalid` on the file input | too few photos, a rejected file | — |

## States
| State | Driven by | DOM |
|---|---|---|
| idle | — | tiles show their number; on a pointer device the delete button and the cover plate are hidden |
| hover / focus | `:hover`, `:focus-within` | the tile lifts on `--prime-shadow-overlay`; the delete button and the cover plate come in |
| touch | `@media (hover: none)` | the delete button and the cover plate are always shown |
| carried | a drag | Dnd: the photo lifts as a copy that takes the size of the cell it would land in, a dashed gap takes that cell, tiles glide and their numbers roll as it moves; a photo that becomes or stops being the cover moves to its new cell and fades in, never stretched; actions hide |
| files over | native file drag | `data-dropping` on the set: the add tile turns accent |
| empty | `value` is empty | the add tile spans the row with «Нажмите или перетащите фото» |
| full | `value.length` reaches `max` | `data-full` on the add tile: «Лимит фото», faded, the file input disabled |
| disabled | `disabled` | `data-disabled`; no add tile, actions or drag |

Motion: the hover lift and the actions coming in (`fast`, `standard`); a photo that arrives after the first render enters (`enterMotion`); drag motion is Dnd's (lift, gap, glide, landing). Under `prefers-reduced-motion` all of it is off.

## Layout & spacing
- The set takes the width of its container and is a size container: 5 tiles across from 36rem of its own width, 4 below, 3 below 32rem, 2 below 22rem. Tile gap `--prime-space-3` (`--prime-space-2` from 3 across).
- With `cover` the first photo spans two columns and two rows at every width; with 2 across it is the whole first row.
- Over a photo the picture is the ground: the badge, the delete button and the plate stand on `--prime-color-media-*`, the same in both themes. The badge and the delete button are one control `xs` square.
- A position that changes rolls to its new number (the kit's odometer, `RollingNumber`) once the photo settles; a new cover's badge fades its word in.
- The add tile is a dashed slot (`fill-strong`, no fill); it is always the last cell, so a drop past the last photo lands in front of it.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves through the photos, their buttons and the add tile. |
| `Alt + ←` · `Alt + →` | Moves the photo one place; with `cover`, moving it first makes it the cover. |
| `Delete` · `Backspace` | Removes the focused photo; focus moves to its neighbour. |
| `Enter` · `Space` | On the add tile opens the file picker. |
| `Escape` | Cancels a drag in flight. |

### ARIA
- The set is a `<ul>` named by the field label; every photo is an `<li>` named «Фото N: alt», with `aria-roledescription` and `aria-keyshortcuts`.
- The number on a photo is hidden from assistive tech (the position is in the tile's name); the delete button names the photo's number.
- A live region (`role="status"`) announces grabbed, «position N of M», removed and made the cover.
- The add tile is the label of a hidden `input type="file"`; the hint, the error and `aria-invalid` are wired to it.
- Touch: a drag starts after a hold; the buttons on a photo are always shown, never hover-only.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `add` | `"Добавить"` | Text of the add tile. |
| `addLabel` | `"Добавить фото"` | Accessible name of the add tile's file input. |
| `empty` | `"Нажмите или перетащите фото"` | Text of the add tile of an empty set (it spans the row). |
| `emptyHint` | `"Можно несколько сразу"` | Second line of the empty add tile without `max` (with it the counter stands there). |
| `full` | `"Лимит фото"` | Text of the add tile when `max` is reached. |
| `cover` | `"Обложка"` | Badge of the first picture with `cover`. |
| `makeCover` | `"Сделать обложкой"` | Action that puts a picture first (`cover`). |
| `item` | `"Фото {position}{alt}"` | Accessible name of a tile; `{alt}` is `: alt` when the item has one. |
| `remove` | `"Удалить фото {position}"` | Accessible name of the delete button. |
| `count` | `"{count} из {max}"` | Counter on the add tile (with `max`). |
| `removed` | `"Фото {position} удалено"` | Live region: a picture was removed. |
| `coverChanged` | `"Фото {position} стало обложкой"` | Live region: a picture became the cover (`{position}` is its place before). |
| `optional` | `"необязательно"` | Muted marker after the label (`optional`). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Photos of a rental scooter: numbered tiles in their order, the last tile adds more; drag to reorder, the corner button removes — `label`, `hint`, `max`, `onFilesAdd`, `onValueChange`. |
| [variants.tsx](examples/variants.tsx) | The same photos in both looks: equal numbered tiles, and the cover two rows tall with a make-cover plate on every other photo — `variant`. |
| [states.tsx](examples/states.tsx) | An empty set is one wide drop tile, a missing minimum shows the error, a published listing is read-only — `error`, `disabled`. |
| [controlled.tsx](examples/controlled.tsx) | The listing editor keeps the photos: the cover and the order are saved on every change, and a button brings back the published set — `value`, `onValueChange`, `variant`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone-width screen the tiles go three across and then two, the cover keeps two columns, and the actions stay on the photos without hover. |

## Mistakes
- Expecting the component to upload → it only hands files to `onFilesAdd`; add the items to `value` yourself (an object URL until the upload answers).
- Using the array index or the file name alone as `id` → ids must survive a reorder and two files may share a name.
- No `onFilesAdd` and wondering where the add tile is → without it the set is only arranged.
- Forgetting `URL.revokeObjectURL` for removed local previews → revoke them when an item leaves `value`.
- Styling a tile from an ancestor (`.gallery li`) → the carried clone is portalled to `<body>` and loses it.

## Related
- **Built from:** [Dnd](../dnd/COMPONENT.md), [Button](../button/COMPONENT.md), [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md)
- **See also:** [FileUpload](../file-upload/COMPONENT.md), [Thumbnail](../thumbnail/COMPONENT.md), [Avatar](../avatar/COMPONENT.md)
