# FileUpload

**Category:** inputs (Поля ввода)

> File picker zone with drag and drop, plus presentational parts for the list of selected files.

## When to use
- Attaching documents, images or media to a form or a request.
- A drop target that also opens the system file dialog on click or Enter/Space.
- Showing selected files with size, upload progress, a remove action or a retry after an error.
- A custom drop target around another element (e.g. a round zone around an Avatar).

## When not to use
- Uploading is a single secondary action in a toolbar → use a [Button](../button/COMPONENT.md) that calls `inputRef.current?.click()` on a hidden zone, or a native input.
- Showing only progress without picking files → use [ProgressBar](../progress-bar/COMPONENT.md).
- A "nothing uploaded yet" page state with a call to action → use [EmptyPage](../empty-page/COMPONENT.md).

## Import
```tsx
import { FileUpload } from "prime-ui-kit";
```

## Anatomy
```
FileUpload.Root                     <label> with a visually hidden <input type="file">; drop target
└─ (built-in body from `labels`) or a custom body:
   FileUpload.DropBody              centered column, pointer-events: none
   ├─ FileUpload.Icon               icon circle (aria-hidden)
   ├─ FileUpload.Title              title line (tone default | muted)
   │  └─ FileUpload.BrowseLink      inline link-button inside a title
   ├─ FileUpload.Hint               formats / size limit (Hint of the zone tier)
   ├─ FileUpload.BrowseLabel        decorative "browse" button (the whole zone is the target)
   └─ FileUpload.ActionsRow         row of source chips
      └─ FileUpload.Chip            source button
         └─ FileUpload.ChipLabel    chip text

FileUpload.Item                     one file row (outside Root)
├─ FileUpload.ItemRow               horizontal row
│  ├─ FileUpload.FormatBadge        extension badge
│  ├─ FileUpload.ItemMain           text column
│  │  ├─ FileUpload.ItemName        file name (single line, ellipsis)
│  │  ├─ FileUpload.ItemMeta        size / status line
│  │  │  └─ FileUpload.ItemMetaSep  "∙" separator
│  │  └─ FileUpload.ItemStack       error column instead of name+meta
│  │     ├─ FileUpload.ItemTextGroup  name + meta without gap
│  │     └─ FileUpload.ItemTryAgain   retry link-button
│  └─ FileUpload.ItemActions        trailing buttons (remove…)
├─ FileUpload.ItemProgress          progress under the row (ProgressBar by default)
└─ FileUpload.ItemFooter            extra full-width area under the row
```
The component does not keep a file list or upload anything: it reports picked/dropped files through `onFilesChange`, the app renders `FileUpload.Item` rows from its own state.

## API

### FileUpload.Root
`forwardRef` to `HTMLLabelElement`. + native `<label>` props except `children` (`onDragOver`, `onDragLeave`, `onDrop` are taken by the zone).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Zone padding and radius, icon circle and browse button height, title and hint size. Provided to the body via the control-size context. |
| `variant` | `"dashed" \| "solid"` | `"dashed"` | Zone treatment, see Variants. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref to the hidden input, e.g. `inputRef.current?.click()` from a separate button. |
| `accept` | `string` | — | Native `accept` of the input. Not enforced on drop — validate dropped files yourself. |
| `multiple` | `boolean` | — | Allow several files. |
| `disabled` | `boolean` | `false` | Disables the input and ignores drops. |
| `invalid` | `boolean` | `false` | Danger line (or ring for `solid`), danger icon, `aria-invalid` on the input. |
| `name` | `string` | — | Name of the hidden input inside a form. |
| `onFilesChange` | `(files: File[]) => void` | — | Called after picking or dropping. The input value is reset afterwards, so the same file can be picked again. |
| `labels` | `Partial<FileUploadLabels>` | see Accessibility | Texts of the built-in body (used only without `children`). |
| `children` | `ReactNode` | — | Custom body; replaces the built-in icon, title, hint and browse button. |
| `className` | `string` | — | Class on the `<label>`. |

### FileUpload.Icon
+ native `<span>` props. Renders `aria-hidden`. Children: usually an `Icon`.

### FileUpload.Title
+ native `<p>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"default" \| "muted"` | `"default"` | `default`: primary text, medium weight. `muted`: secondary text, regular weight (instruction line with a `BrowseLink`). |

### FileUpload.Hint
+ native `<p>` props; renders [Hint](../hint/COMPONENT.md) `Hint.Root` with the size of the enclosing zone (`m` outside a zone).

### FileUpload.BrowseLabel
+ native `<span>` props. A neutral filled "button" of the zone tier; decorative (`pointer-events: none`), the whole zone opens the picker.

### FileUpload.BrowseLink
`forwardRef` to `HTMLButtonElement`. + native `<button>` props; `type` defaults to `"button"`. Prevents the default and stops propagation, so it does not trigger the label: open the picker in `onClick` (`inputRef.current?.click()`).

### FileUpload.DropBody
+ native `<div>` props. Centered column with the zone stack spacing (xs 8 · s 12 · m 16 · l 20 · xl 24); `pointer-events: none` so the label receives clicks; links, chips and action rows inside opt back in.

### FileUpload.ActionsRow
+ native `<div>` props. Wrapping, centered row of chips (`pointer-events: auto`).

### FileUpload.Chip
`forwardRef` to `HTMLButtonElement`. + native `<button>` props; `type` defaults to `"button"`. Prevents the default and stops propagation — does not open the picker by itself; handle the source in `onClick`.

### FileUpload.ChipLabel
+ native `<span>` props. Chip text in secondary color.

### FileUpload.FormatBadge
| Prop | Type | Default | Description |
|---|---|---|---|
| `format` | `string` | — (required) | Extension text; trimmed, cut to 8 characters, uppercased. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Palette hue. |
| `className` | `string` | — | Class on the `<span>` (`aria-hidden`). |

### FileUpload.Item
+ native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Padding, gap, name/meta typography, badge size. Not inherited from a Root — set it explicitly. |
| `invalid` | `boolean` | `false` | Failed upload: danger soft fill, danger inset ring, danger meta text. |

### FileUpload.ItemRow / ItemMain / ItemStack / ItemTextGroup / ItemName / ItemMeta / ItemActions / ItemFooter
Each takes + native `<div>` props (`className`, `children`, …) and only adds layout and typography:
- `ItemRow` — centered row with the item gap.
- `ItemMain` — flexible text column, gap `--prime-space-1`.
- `ItemStack` — flexible column, start-aligned, gap `--prime-space-2` (error text + retry).
- `ItemTextGroup` — name + meta without gap.
- `ItemName` — medium primary text, one line with ellipsis.
- `ItemMeta` — muted hint-size line, tabular numbers; `<strong>` inside is medium primary; danger in an invalid item.
- `ItemActions` — non-shrinking trailing row, gap `--prime-space-1`.
- `ItemFooter` — full-width area.

### FileUpload.ItemMetaSep
+ native `<span>` props. Always renders `∙`, `aria-hidden` by default.

### FileUpload.ItemTryAgain
`forwardRef` to `HTMLButtonElement`. + native `<button>` props; `type` defaults to `"button"`. Underlined danger link-button in meta size.

### FileUpload.ItemProgress
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Renders `ProgressBar.Root` with this value when there are no `children`. |
| `max` | `number` | — | `max` of that ProgressBar. |
| `children` | `ReactNode` | — | Custom indicator instead of the ProgressBar. |
| `className` | `string` | — | Class on the wrapper. |

## Variants

### variant (FileUpload.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `dashed` | Field fill with a 1px dashed `border-default` line, radius 12 (m); hover darkens fill and line | Standalone drop zone on a page or canvas — the dashed line is the "drop here" affordance | yes |
| `solid` | Field fill only, transparent line; danger/accent line appears only for invalid / drag-over | Inside cards, modals and drawers where a dashed line is too loud; custom zones (avatar) | |

### size (FileUpload.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Padding 16, radius 8, icon circle 28, browse 28, title 12/16 | Compact attachment field in dense forms | |
| `s` | Padding 20, radius 8, icon circle 32, browse 32, title 13/20 | Side panels, small dialogs | |
| `m` | Padding 24, radius 12, icon circle 36, browse 36, title 14/20 | Regular forms | yes |
| `l` | Padding 32, radius 12, icon circle 40, browse 40, title 16/24 | Main upload area of a page | |
| `xl` | Padding 40, radius 16, icon circle 48, browse 48, title 16/24 | Full-page or onboarding upload | |

### size (FileUpload.Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Padding 8, radius 8, badge 28, name 12/16 | Dense lists | |
| `s` | Padding 8, radius 8, badge 32, name 13/20 | Compact lists | |
| `m` | Padding 12, radius 12, badge 36, name 14/20 | Regular lists | yes |
| `l` | Padding 16, radius 12, badge 40, name 16/24 | Spacious lists | |
| `xl` | Padding 16, gap 16, radius 16, badge 48, name 16/24 | Large upload pages | |

### tone (FileUpload.Title)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | Primary text, medium weight | The main line of the zone | yes |
| `muted` | Secondary text, regular weight | An instruction sentence with an inline `BrowseLink` | |

### color (FileUpload.FormatBadge)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | Secondary text on a `fill-strong` wash | Unknown or generic formats | yes |
| `red` | Red text on a translucent red wash | PDF | |
| `blue` | Blue text on a translucent blue wash | PNG, DOC | |
| `green` | Green text on a translucent green wash | JPG, XLS, CSV | |
| `orange` | Orange text on a translucent orange wash | PPT, archives | |
| `yellow` | Yellow text on a translucent yellow wash | Other format groups | |
| `purple` | Purple text on a translucent purple wash | Video (MP4) | |
| `sky` | Sky text on a translucent sky wash | Other format groups | |
| `pink` | Pink text on a translucent pink wash | Other format groups | |
| `teal` | Teal text on a translucent teal wash | Other format groups | |

### invalid (Root / Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Normal | — | yes |
| `true` | Root: danger line, danger icon. Item: danger soft fill, danger ring, danger meta | A file was rejected (type, size) / an upload failed | |

**Combinations**
- Recommended: `variant="solid"` inside Card/Modal; `invalid` Root + custom `labels.title`/`labels.hint` explaining the rule; `invalid` Item + `ItemStack` + `ItemTryAgain`.
- Allowed: the same `size` for the zone and the items below it.
- Pointless: `labels` together with `children` (labels are ignored); `invalid` with `disabled`.
- Forbidden: interactive elements in a custom body other than `BrowseLink`, `Chip`, buttons in `ActionsRow` — plain buttons inside the label would also open the picker.

**Hierarchy:** one drop zone per form section; the submit action lives outside the zone (in Card actions or the form footer).

## States
| State | Driven by | DOM |
|---|---|---|
| hover | — | zone fill darkens, dashed line darkens, browse button hover fill |
| focus | keyboard focus on the hidden input | inset focus ring on the zone (danger color when invalid); Enter/Space opens the dialog |
| drag-over | a file dragged over the zone | `data-state="active"` on Root: accent line, accent soft fill, accent icon |
| invalid | `invalid` | `data-invalid="true"` on Root, `aria-invalid` on the input; `data-invalid="true"` on Item |
| disabled | `disabled` | `data-disabled="true"`, disabled input, disabled fill and text, drops ignored |

Also `data-size`, `data-variant` on Root, `data-size` on Item, `data-color` on FormatBadge. Files are always "uncontrolled" in the component: keep the list in your state and update it in `onFilesChange`.

## Layout & spacing
- Root and Item are `width: 100%`; the parent sets the width.
- Zone → first file row and row → row: `--prime-space-3`.
- In a card put the zone and the list in `Card.Body`, actions in `Card.Actions`.
- A custom zone can be shrunk around its content (avatar zone: `width: auto`).
- Documented `className` exception: the round avatar zone ([avatar-upload.tsx](examples/avatar-upload.tsx)) is the one case where `className` on `FileUpload.Root` sets `padding: var(--prime-space-1)` and `border-radius: var(--prime-radius-full)` (plus `width: auto; flex-shrink: 0`). Everywhere else `className` is for placement only.
- **Field frame.** FileUpload has no `label` / `hint` / `error` props, and `FileUpload.Root` is itself a `<label>` — do not nest it in another label. Put `Label.Root` as a sibling above the zone and `Hint.Root` below it (`invalid` for errors, together with `invalid` on the Root), in a grid with `gap: var(--prime-control-<size>-label-gap)` between label and zone and `var(--prime-control-<size>-hint-gap)` between zone and hint, using the zone's `size`.

## Accessibility
- The zone is a `<label>` around a visually hidden but focusable `<input type="file">`: Tab focuses it, Enter/Space opens the dialog, the label text is its name. Give a custom body without text an `aria-label` on Root.
- `FileUpload.Icon`, `FormatBadge`, `ItemMetaSep` are `aria-hidden`: the file name and meta carry the meaning.
- Icon-only remove buttons in `ItemActions` need an `aria-label` with the file name.

| `labels` key | Default | Used for |
|---|---|---|
| `title` | `"Выберите файл или перетащите его сюда"` | Title of the built-in body |
| `hint` | `"JPEG, PNG, PDF, MP4 до 50 МБ"` | Hint under the title; an empty string hides it |
| `browse` | `"Выбрать файл"` | Text of the decorative browse button |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | Zone and file row on `xs`…`xl` | Picking a size |
| [variants.tsx](examples/variants.tsx) | `dashed` vs `solid` on different surfaces | Zone on a page vs inside a card |
| [states.tsx](examples/states.tsx) | Default, disabled, invalid zone; uploading, uploaded and failed rows | Upload feedback |
| [file-list.tsx](examples/file-list.tsx) | `multiple` + `accept`, appending files to state, removing rows | Keeping selected files before sending |
| [in-card.tsx](examples/in-card.tsx) | `solid` zone in a card with `DropBody`, muted `Title`, `BrowseLink`, `Chip`s and file rows | Document attachments in a request form |
| [avatar-upload.tsx](examples/avatar-upload.tsx) | Round zone around an Avatar with preview and `inputRef` buttons | Profile photo |

```tsx
import { FileUpload } from "prime-ui-kit";

export function AttachDocuments() {
  return (
    <FileUpload.Root
      multiple
      accept=".pdf,.png,.jpg"
      labels={{ hint: "PDF, PNG или JPG до 20 МБ" }}
      onFilesChange={(files) => console.log(files)}
    />
  );
}
```

## Mistakes
- `<FileUpload.Root label="Документы" error="…">` → there are no such props; render `Label.Root` above and `Hint.Root invalid` below as siblings (see Field frame).
- Wrapping `FileUpload.Root` in `<label>` or `Label.Root` → it is already a `<label>`; keep the Label a sibling.
- Restyling the zone through `className` (padding, radius, fill) → use `size` / `variant`; the round avatar zone is the only documented exception.
- Expecting the component to keep or upload files → keep `File[]` in state from `onFilesChange` and render `FileUpload.Item` rows.
- A plain `<button>` inside the zone → use `FileUpload.Chip` / `FileUpload.BrowseLink`, they stop the click from reaching the label.
- `FileUpload.BrowseLink` without `onClick` → it does not open the picker by itself; call `inputRef.current?.click()`.
- Relying on `accept` for dropped files → check the type/size of dropped files and set `invalid` when rejected.
- `size` on Root expected to size the Items → pass `size` to each `FileUpload.Item`.
- `dashed` zone inside a card → use `variant="solid"`.

## Related
- [ProgressBar](../progress-bar/COMPONENT.md) — rendered by `ItemProgress`.
- [Hint](../hint/COMPONENT.md) — rendered by `FileUpload.Hint`.
- [Avatar](../avatar/COMPONENT.md), [Button](../button/COMPONENT.md), [Card](../card/COMPONENT.md) — used in the examples.
