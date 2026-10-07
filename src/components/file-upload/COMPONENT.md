# FileUpload

**Category:** inputs
**Kind:** composite

> A file drop zone with the field label, hint and error, plus file rows for the selected files.

## When to use
- Attaching documents, images or media to a form or a request.
- A drop target that also opens the system file dialog on click or Enter / Space.
- Showing selected files with size, upload progress, a remove action or a retry after an error.
- A custom drop target around another element (e.g. a round zone around an Avatar).

## When not to use
- Uploading is a single secondary action in a toolbar → use a [Button](../button/COMPONENT.md) that calls `inputRef.current?.click()` on a hidden zone, or a native input.
- Showing only progress without picking files → use [ProgressBar](../progress-bar/COMPONENT.md).
- A «nothing uploaded yet» page state with a call to action → use [EmptyPage](../empty-page/COMPONENT.md).

## Import
```tsx
import { FileUpload } from "prime-ui-kit";
```

## Anatomy
```
FileUpload.Root                 field frame: label → drop zone → hint | error
└─ <label> drop zone            visually hidden <input type="file">; built-in body or children
   └─ FileUpload.Body           custom body column
      ├─ FileUpload.Icon        round tinted icon slot
      ├─ FileUpload.Title       zone title (BrowseLink inside for an inline link)
      └─ FileUpload.Description secondary line (the kit Hint)

FileUpload.Item                 file row
├─ FileUpload.FormatBadge       square kit Badge with the extension
├─ FileUpload.ItemName          one line, truncated
├─ FileUpload.ItemDescription   size, progress or error
├─ FileUpload.ItemActions       remove / retry buttons (kit Button)
└─ FileUpload.ItemProgress      the kit ProgressBar across the row
```
The built-in body (icon, `labels.title`, `labels.description` and a decorative soft Button) renders when there are no children.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### FileUpload.Root
`forwardRef` → `HTMLLabelElement` (the drop zone). The field frame (label → zone → hint | error) around a `<label>` drop zone with a visually hidden file input; native label props go to the zone.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"dashed" \| "solid"` | `"dashed"` | `dashed` shows the drop line; `solid` keeps only the fill (cards, modals). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the zone padding, icon, title, button, label and hint. |
| `label` | `ReactNode` | — | Field label above the zone; names the file input. |
| `required` | `boolean` | — | Red `*` after the label and native `required` on the input. |
| `optional` | `boolean` | — | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the zone. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message under the zone (a rejected file); implies `invalid`. |
| `invalid` | `boolean` | — | Danger line and icon, `aria-invalid` on the input. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | Blocks picking and drag-and-drop. |
| `accept` | `string` | — | Native `accept` of the file input. |
| `multiple` | `boolean` | — | Allows several files at once. |
| `name` | `string` | — | Name of the file input inside a form. |
| `onFilesChange` | `(files: File[]) => void` | — | Called with the picked or dropped files; the input is reset, so the same file can be picked again. |
| `inputRef` | `Ref<HTMLInputElement>` | — | The hidden file input, e.g. to open the picker from a button. |
| `id` | `string` | — | Id of the file input; hint id is `<id>-hint`, error id is `<id>-error`. |
| `labels` | `Partial<FileUploadLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Custom body (`FileUpload.Body`); replaces the built-in icon, title, description and button. |
| `className` | `string` | — | Class on the drop zone `<label>` (e.g. a round avatar zone). |

### FileUpload.Body
No ref. A centered column for a custom zone body; it takes no pointer events (no drag flicker), nested buttons and links opt back in. Native `<div>` props.

### FileUpload.Icon
No ref. A round tinted icon slot (`aria-hidden`) that turns accent on drag-over and danger when invalid. Native `<span>` props.

### FileUpload.Title
No ref. The zone title `<p>`. Native `<p>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"default" \| "muted"` | `"default"` | `muted` — secondary color, regular weight (an instruction line in custom bodies). |

### FileUpload.Description
No ref. The secondary zone line (formats, size limit), the kit Hint of the zone tier. Native `<p>` props.

### FileUpload.BrowseLink
`forwardRef` → `HTMLButtonElement`. An inline link-styled button inside a custom title; it does not activate the zone, so pass `onClick` (e.g. `inputRef.current?.click()`).

### FileUpload.Item
No ref. A file row: format badge · name over description · actions, then the progress bar; children are placed by their part. Native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the padding, text and the format badge. |
| `invalid` | `boolean` | `false` | A failed upload: danger wash and ring, danger description. |

### FileUpload.FormatBadge
No ref. The file format as a square kit Badge of the row tier (`aria-hidden`: the name carries the extension).

| Prop | Type | Default | Description |
|---|---|---|---|
| `format` | `string` | — (required) | File extension; shown upper-case, cut to 8 characters. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Palette hue of the badge. |
| `className` | `string` | — | Class on the badge. |

### FileUpload.ItemName · FileUpload.ItemDescription · FileUpload.ItemActions
No ref. The file name (one line, truncated), its description (size, progress, error; danger in an invalid row) and the buttons at the end of the row. Native `<div>` props.

### FileUpload.ItemProgress
No ref. Upload progress across the row: the kit ProgressBar.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | Uploaded amount. |
| `max` | `number` | — | Total amount (ProgressBar default). |
| `className` | `string` | — | Class on the wrapper. |

## Variants

### variant (FileUpload.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `dashed` | field fill with a 1px dashed line; hover darkens fill and line | a standalone drop zone on a page — the dashed line is the «drop here» affordance | yes |
| `solid` | field fill only; the danger / accent line appears only when invalid / on drag-over | inside cards, modals and drawers; custom zones (avatar) | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | zone padding 16, icon circle 28, browse 28, title 12/16; row badge 28 | compact attachment field in dense forms | |
| `s` | padding 20, icon 32, browse 32, title 13/20; badge 32 | side panels, small dialogs | |
| `m` | padding 24, icon 36, browse 36, title 14/20; badge 36 | regular forms | yes |
| `l` | padding 32, icon 40, browse 40, title 16/24; badge 40 | the main upload area of a page | |
| `xl` | padding 40, icon 48, browse 48, title 16/24; badge 48 | full-page or onboarding upload | |

**Sizes:** `size` on Root and on Item are separate; use the same tier for a zone and its rows.

### tone (FileUpload.Title)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | primary text, medium weight | the main line of the zone | yes |
| `muted` | secondary text, regular weight | an instruction sentence with an inline `BrowseLink` | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `invalid` (Root) | danger line and icon | a rejected file without a message; otherwise pass `error` | — |
| `invalid` (Item) | danger soft fill, danger ring, danger description | an upload failed | `false` |
| `disabled` | disabled fill and text, drops ignored | uploading is unavailable | `false` |

**Combinations**
- Recommended: `variant="solid"` inside Card / Modal; `error` on Root explaining the rule; an invalid Item with a retry Button in `ItemActions`.
- Pointless: `labels` together with `children` (the built-in texts are ignored); `invalid` with `disabled`.
- One drop zone per form section; the submit action lives outside the zone.

## States
| State | Driven by | DOM |
|---|---|---|
| hover | — | zone fill and dashed line darken |
| focus | keyboard focus on the hidden input | inset focus ring on the zone (danger when invalid); Enter / Space opens the dialog |
| drag-over | a file dragged over the zone | `data-state="active"` on the zone: accent line, accent soft fill, accent icon |
| invalid | `invalid` or a non-empty `error` | `data-invalid="true"` on the zone, `aria-invalid` on the input; `data-invalid="true"` on Item |
| disabled | `disabled` | `data-disabled="true"`, disabled input, disabled fill and text, drops ignored |

Also `data-size`, `data-variant` on the zone and `data-size` on Item. Files are not kept by the component: keep the list in your state and update it in `onFilesChange`.

## Layout & spacing
- The zone and Item are `width: 100%`; the parent sets the width. Label → zone and zone → hint use the tier `label-gap` / `hint-gap`.
- Zone → first file row and row → row: `--prime-space-2`.
- A custom zone can hug its content (avatar zone: `className` with `width: auto`, round radius, small padding).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focuses the hidden file input (the zone shows the ring), then the buttons of the file rows. |
| `Enter` · `Space` | Opens the system file dialog. |

### ARIA
- The zone is a `<label>` around a visually hidden but focusable `<input type="file">`. With `label` the input is named by it (`aria-labelledby`) and described by the hint or error; without it the zone text names the input — give a custom body without text an `aria-label` on Root.
- `FileUpload.Icon` and `FormatBadge` are `aria-hidden`: the file name and description carry the meaning.
- Icon-only remove buttons in `ItemActions` need an `aria-label` with the file name.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `title` | `"Выберите файл или перетащите его сюда"` | Title of the built-in zone body. |
| `description` | `"JPEG, PNG, PDF, MP4 до 50 МБ"` | Description of the built-in body; an empty string hides it. |
| `browse` | `"Выбрать файл"` | Text of the decorative browse button of the built-in body. |
| `optional` | `"необязательно"` | Marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Attachments of a request: a labelled drop zone and the chosen files as rows with a remove button — `label`, `hint`, `multiple`, `onFilesChange`, `FileUpload.Item`. |
| [variants.tsx](examples/variants.tsx) | The dashed drop line next to a zone with only the fill, for cards and modals — `variant`. |
| [sizes.tsx](examples/sizes.tsx) | Every size of the zone and of a file row: padding, icon, button and text follow the tier — `size`. |
| [structure.tsx](examples/structure.tsx) | A custom body: a muted title with a browse link and source buttons instead of the built-in one — `FileUpload.Body`, `FileUpload.Title`, `FileUpload.BrowseLink`. |
| [upload-progress.tsx](examples/upload-progress.tsx) | File rows while uploading, uploaded and failed with a retry — `FileUpload.ItemProgress`, `invalid`, `FileUpload.ItemActions`. |
| [avatar-upload.tsx](examples/avatar-upload.tsx) | A round zone around an Avatar that takes images and shows a preview; buttons open the same input — `inputRef`, `accept`, `className`. |
| [states.tsx](examples/states.tsx) | A default zone next to a disabled one and one with an error under it — `disabled`, `error`. |
| [narrow.tsx](examples/narrow.tsx) | In a phone-width column the zone text wraps and a long file name truncates. |

## Mistakes
- A `Label` and a `Hint` placed around the zone by hand → pass `label`, `hint`, `error`.
- Nesting `FileUpload.Root` in another `<label>` → it already is one.
- A plain `<button>` in a custom body expecting it to open the picker → call `inputRef.current?.click()` in its `onClick`.
- `labels.hint` → the built-in secondary line is `labels.description`; `hint` is the field hint under the zone.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`, `Description`), [Button](../button/COMPONENT.md) (built-in browse button), [Badge](../badge/COMPONENT.md) (`FormatBadge`), [ProgressBar](../progress-bar/COMPONENT.md) (`ItemProgress`), `Icon`
- **See also:** [Avatar](../avatar/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md)
