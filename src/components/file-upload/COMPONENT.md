# FileUpload

**Category:** inputs
**Kind:** field

> One component for every set of files a person adds: a document field, file cards, an **image gallery with a cover**, an attachment tray — `trigger` picks how files are added, `layout` how they lie, `cover` makes the first tile the cover; uploads go through a queue, the order and removals can be saved on a server.

**Four shapes, one component.** Pick the shape by the two props; everything else (queue, value, saving, validation) is the same:

| Shape | Props | For |
|---|---|---|
| Document field | `trigger="dropzone"` (default), `layout="list"` (default) | documents of a form, where the name matters |
| File cards | `trigger="tile"`, `layout="grid"` | mixed photos and documents whose order matters (a report) |
| Image gallery | `trigger="tile"`, `layout="grid"`, `cover`, `accept="image/*"` | the photos of a listing or a product; the first one is the cover |
| Attachment tray | `FileUpload.Root trigger="button"` + `FileUpload.Queue layout="strip"` | a paperclip and one scrolling row of tiles above a message (the Composer's) |

## When to use
- Attaching documents, images or media to a form or a request: the default drop zone with rows.
- An image gallery — the photos of a listing, a product, an object — with the first photo as the cover and the order set by drag: `trigger="tile"`, `layout="grid"`, `cover`.
- Cards of mixed files whose order matters (inspection photos and acts of a report): `trigger="tile"`, `layout="grid"`.
- A paperclip in a message composer or a toolbar with the attachments as a scrolling row: `trigger="button"` and `FileUpload.Queue layout="strip"`.
- Uploading the chosen files with progress, a reason for a failure, retry and remove per file: `useUploadQueue` + `queue`.
- A set of files kept on a server: `value` + `onValueChange`, a returned promise saves every reorder and removal and rolls a refusal back.
- A custom drop target around another element (a round zone around an Avatar).

## When not to use
- One picture of a person or an account → [Avatar](../avatar/COMPONENT.md) inside a custom zone (the avatar scenario), not a gallery of one.
- A read-only preview of a picture or a video → [Thumbnail](../thumbnail/COMPONENT.md); photos and files sent in a chat → [Message](../message/COMPONENT.md) parts.
- A reorderable list that is not files → [Dnd](../dnd/COMPONENT.md).
- Showing only progress without picking files → [ProgressBar](../progress-bar/COMPONENT.md).
- A «nothing uploaded yet» page state with a call to action → [EmptyPage](../empty-page/COMPONENT.md).
- A message field with attachments → [Composer](../composer/COMPONENT.md): its tray already is `FileUpload.Queue layout="strip"`.

## Import
```tsx
import { FileUpload, type FileUploadFile, formatFileSize, useUploadQueue } from "prime-ui-kit";
```

`formatFileSize(bytes)` writes a size the way the rows do («820 КБ», «1,2 МБ»): use it wherever a file size appears beside the kit's.

## Anatomy
```
FileUpload.Root                 field frame: label → trigger → files → hint | error
├─ <label> drop zone            trigger="dropzone": visually hidden <input type="file">; built-in body or children
│  └─ FileUpload.Body           custom body column
│     ├─ FileUpload.Icon        round tinted icon slot
│     ├─ FileUpload.Title       zone title (`<LinkButton asChild><button>` inside for an inline link)
│     └─ FileUpload.Description secondary line (the kit Hint)
├─ Button                       trigger="button": kit Button that opens the picker; children are its content
└─ files                        `value` then the uploads of `queue` (nothing while empty, unless an add tile)
   ├─ layout="list"             <ul> of rows drawn from the FileUpload.Item parts; the add tile as the last row
   └─ layout="grid" | "strip"   Dnd.Sortable <ul> of square tiles, the same slots on every kind:
      │                         format pill top start («Обложка» on the cover) · remove × top end ·
      │                         middle: picture, video frame + play mark or the file's sheet ·
      │                         band at the bottom: name (no extension) … size (a video: duration);
      │                         the upload disk over the middle
      └─ add tile               trigger="tile": «+», «Добавить», `count из max`; the whole row when empty

FileUpload.Queue                the same files with no trigger of their own (a tray whose paperclip lives elsewhere)

FileUpload.Item                 a file row the set does not draw (own actions, a server-side job)
├─ FileUpload.FormatBadge       square kit Badge with the extension
│  or FileUpload.ItemPreview    square kit Thumbnail of an image file
├─ FileUpload.ItemText          one line, truncated (the set passes the name without its extension when a format badge shows it)
├─ FileUpload.ItemDescription   size, progress or error
├─ FileUpload.ItemActions       buttons at the end of the row (kit Button)
└─ FileUpload.ItemProgress      the kit ProgressBar across the row
```
The built-in zone body (icon, `labels.title`, `labels.description` and a decorative soft Button) renders when there are no children; the built-in button content is the paperclip and `labels.browse`. The set draws its rows and tiles itself from `value` and `queue`; the `Item` parts are for a row it does not draw (a download button, a report being prepared).

**One set of files.** The files are application data: `value` (`{ id, name, size?, type?, src?, alt?, href? }`, controlled, or `defaultValue`) in its order, then every upload of `queue` that is not in it, in the queue's order. A file of `value` whose `id` is an upload's id shows that upload's state. `type` is the MIME type (without it the kind — picture, video, other — is read from the name's extension); `src` is a picture or a video; `alt` is spoken in place of the name and never drawn. `href` is the file's address: the row's name (a neutral `LinkButton`) or the whole tile under its chips becomes a link that opens the file in a new tab — the server's `Content-Disposition` decides open or download. Every change — a reorder by drag or Alt + ← / →, a removal, files added to the queue — goes through `onValueChange` with the whole new list, uploads included; the queue follows (a removed upload leaves it and stops, a moved one keeps its order through `queue.move`). Without `value` and `defaultValue` the set is the queue alone: an uncontrolled list of uploads that reorders through `queue.move`. Return a promise from `onValueChange` to save on a server: the touched files wait busy, a moved file or new files stand in their new places meanwhile, a removed file stays until the answer. Resolve and the change stands (a controlled owner applies `value` before resolving); reject and the set goes back and `labels.changeFailed` is announced.

**The queue.** `useUploadQueue({ upload, concurrency })` owns the uploads: `upload(file, { id, signal, onProgress })` is yours and returns a Promise of the server's answer; run after-upload work (attach the file to a record, save the set) inside `upload` after the request resolves — `context.id` is the item, and a rejection of that work fails it; `concurrency` files (3 by default) go at once and the rest wait as `queued`. It returns `{ items, add, retry, remove, clear, move }`. An item is `{ id, file, status, progress, error?, result?, preview? }`: `status` is `queued | loading | done | failed` — the kit's transfer states (`TransferState` without `remote`), so an item maps onto a message part as `transfer={item.status}`; `progress` is 0…1; `error` the rejection's message; `result` what `upload` resolved with; `preview` a local object URL of an image or video file (by MIME type, else by the name's extension). `add(files)` returns the new items; `remove(id)` aborts an upload in flight and revokes its preview; `clear()` takes every file out; `move(id, beforeId)` puts a file in front of another (`null` = last) — the order FileUpload tiles and the Composer tray reorder. `queue` takes `useUploadQueue(…)` or any object of that shape (`items`, `retry`, `remove`, optional `add` and `move`). Hand it to the root and picked or dropped files go into it (only with `add`; `onFilesChange` is not called then) and enter the set at once as their local previews, their `id` the queue item's id:

```tsx
const queue = useUploadQueue({ upload: sendFile, concurrency: 2 });
<FileUpload.Root label="Документы" multiple queue={queue} />
```

An image gallery: files are added through an add tile and lie as tiles; `cover` makes the first one the cover, and dragging a photo to the first place makes it the new one:

```tsx
<FileUpload.Root
  label="Фотографии"
  trigger="tile"
  layout="grid"
  cover
  accept="image/*"
  multiple
  max={12}
  value={photos}
  onValueChange={setPhotos}
  queue={queue}
/>
```

A rejection of `upload` fails the file with its message as the reason; retry queues it again; remove aborts it through the signal. Images and videos carry a local `preview` URL that the queue revokes when the file leaves or the queue unmounts. Read the answers (`item.result`) when the form is sent; wait while any item is `queued` or `loading`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### FileUpload.Root
`ref` → `HTMLDivElement` (the field frame). The field: label → trigger (a drop zone, a picker button or an add tile) → the files of `value` and `queue` as rows or tiles → hint | error. `className` and native attributes go to the frame, `id` to the file input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `trigger` | `"dropzone" \| "button" \| "tile"` | `"dropzone"` | `dropzone`: the drop area. `button`: a compact picker button, no zone and no drop (a composer paperclip). `tile`: an add tile as the last cell of the files. |
| `variant` | `"dashed" \| "solid"` | `"dashed"` | The look of the drop zone: `dashed` shows the drop line; `solid` keeps only the fill (cards, modals). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the zone padding, icon, title, button, label, hint and the rows. Without it the tier of its host (a form, a panel), else `m`. Tiles keep their own size. |
| `value` | `readonly FileUploadFile[]` | — | Files in their order (controlled): `{ id, name, size?, type?, src?, alt?, href? }` — on the server or uploads of `queue` by id. `src`: picture or video; `alt` spoken for the name; `href` links name or tile to the file. |
| `defaultValue` | `readonly FileUploadFile[]` | `[]` | Initial files (uncontrolled). |
| `onValueChange` | `(value: readonly FileUploadFile[]) => void \| Promise<void>` | — | The set changed (a reorder, a removal, files added to `queue`), with the whole new list. Return the save's promise: the touched files wait busy, a rejection puts the set back and is announced. |
| `queue` | `Pick<UploadQueue, "items" \| "retry" \| "remove"> & Partial<Pick<UploadQueue, "add" \| "move">>` | — | The uploads: `useUploadQueue(…)` or an object of that shape. Each file on its way shows its upload; removing a file aborts it. With `add`, picked and dropped files go into the queue. |
| `layout` | `"list" \| "grid" \| "strip"` | `"list"` | `list`: a row per file. `grid`: square tiles that wrap to the set's width and reorder. `strip`: one sideways-scrolling row of tiles (an attachment tray). |
| `cover` | `boolean` | `false` | Tiles only: the first file is the cover («Обложка», 2 × 2 in a `grid`). Reordering a file to the first place makes it the cover. |
| `formatSize` | `(bytes: number) => string` | Russian digits, Б · КБ · МБ · ГБ | Display of a file size («820 КБ», «1,2 МБ»). |
| `label` | `ReactNode` | — | Field label above the trigger; names the file input and the list of files. |
| `required` | `boolean` | — | Red `*` after the label and native `required` on the input. |
| `optional` | `boolean` | — | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the field. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message under the field (a rejected file, too few files); implies `invalid`. |
| `invalid` | `boolean` | — | Danger line and icon of the zone, `aria-invalid` on the input. A non-empty `error` implies it. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring of the drop zone and the add tile (`data-focus-ring="false"`); focus, keyboard and ARIA stay. The picker Button keeps its ring. |
| `disabled` | `boolean` | `false` | Blocks picking and drag-and-drop; the files are read-only: no add tile, no reorder, no remove. |
| `accept` | `string` | — | Native `accept` of the file input; dropped files outside it are not taken (MIME type, `type/*` or `.ext`; a file with no MIME type by its extension). |
| `multiple` | `boolean` | — | Allows several files at once in the picker. |
| `max` | `number` | — | Most files in the set: picked and dropped files are cut to the room left; the add tile counts `count из max` (the digits roll) and at the limit says «Лимит файлов» and takes nothing. |
| `name` | `string` | — | Name of the file input inside a form. |
| `onFilesChange` | `(files: File[]) => void` | — | Called with the picked or dropped files (of `accept`, cut to `max`); the input is reset, so the same file can be picked again. Not called when `queue.add` takes them. |
| `inputRef` | `Ref<HTMLInputElement>` | — | The hidden file input, e.g. to open the picker from a button. |
| `id` | `string` | — | Id of the file input (generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `labels` | `Partial<FileUploadLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | A zone: a custom body (`FileUpload.Body`) instead of the built-in one. `trigger="button"`: the button's content, `Button.Icon` and text (default: the paperclip and `labels.browse`). |
| `aria-label` | `string` | — | Name of the file input and the list of files when there is no `label`; with `trigger="button"` the name of the button (required for an icon-only one). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>`. The zone reads `--file-upload-padding` and `--file-upload-radius` from that class (a round zone around an avatar). |

### FileUpload.Body
`ref` → `HTMLDivElement`. A centered column for a custom zone body; nested buttons and links stay interactive (drag-over follows enter / leave depth, so crossing children never flickers it).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### FileUpload.Icon
`ref` → `HTMLSpanElement`. A round tinted icon slot (`aria-hidden`) that turns accent on drag-over and danger when invalid.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (the `Icon`), `className` and the other span attributes. |

### FileUpload.Title
`ref` → `HTMLParagraphElement`. The zone title `<p>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"default" \| "muted"` | `"default"` | `muted` — secondary color, regular weight (an instruction line in custom bodies). |
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### FileUpload.Description
`ref` → `HTMLParagraphElement`. The secondary zone line (formats, size limit), the kit Hint of the zone tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `className` and the other paragraph attributes. |

### FileUpload.Queue
`ref` → `HTMLUListElement`. The files of a set with no picker of its own — a tray whose paperclip lives elsewhere: the same rows or tiles `FileUpload.Root` draws, in a `<ul>` (nothing while empty).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `readonly FileUploadFile[]` | — | Files in their order (controlled): `{ id, name, size?, type?, src?, alt?, href? }` — on the server or uploads of `queue` by id. `src`: picture or video; `alt` spoken for the name; `href` links name or tile to the file. |
| `defaultValue` | `readonly FileUploadFile[]` | `[]` | Initial files (uncontrolled). |
| `onValueChange` | `(value: readonly FileUploadFile[]) => void \| Promise<void>` | — | The set changed (a reorder, a removal, files added to `queue`), with the whole new list. Return the save's promise: the touched files wait busy, a rejection puts the set back and is announced. |
| `queue` | `Pick<UploadQueue, "items" \| "retry" \| "remove"> & Partial<Pick<UploadQueue, "add" \| "move">>` | — | The uploads: `useUploadQueue(…)` or an object of that shape. Each file on its way shows its upload; removing a file aborts it. With `add`, picked and dropped files go into the queue. |
| `layout` | `"list" \| "grid" \| "strip"` | `"list"` | `list`: a row per file. `grid`: square tiles that wrap to the set's width and reorder. `strip`: one sideways-scrolling row of tiles (an attachment tray). |
| `cover` | `boolean` | `false` | Tiles only: the first file is the cover («Обложка», 2 × 2 in a `grid`). Reordering a file to the first place makes it the cover. |
| `formatSize` | `(bytes: number) => string` | Russian digits, Б · КБ · МБ · ГБ | Display of a file size («820 КБ», «1,2 МБ»). |
| `disabled` | `boolean` | `false` | Read-only files: no reorder, no remove. |
| `labels` | `Partial<FileUploadLabels>` | — | Row and tile strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLUListElement>, "children" \| "defaultValue">` | — | `className`, `aria-label` (name the list) and the other attributes of the `<ul>`. |

### FileUpload.Item
`ref` → `HTMLDivElement`. A file row: format badge · name over description · actions, then the progress bar; children are placed by their part.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the padding, text and the format badge. Without it the tier of its host, else `m`. |
| `invalid` | `boolean` | `false` | A failed upload: danger wash and ring, danger description. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the item parts), `className` and the other div attributes. |

### FileUpload.FormatBadge
`ref` → `HTMLSpanElement`. The file format as a square kit Badge of the row tier (`aria-hidden`: the row's name is trimmed of the extension and the accessible name carries it whole).

| Prop | Type | Default | Description |
|---|---|---|---|
| `format` | `string` | — (required) | File extension; shown upper-case, cut to 8 characters. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Palette hue of the badge. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children" \| "color">` | — | `className` and the other attributes of the badge. |

### FileUpload.ItemPreview
`ref` → `HTMLDivElement`. An image file's picture in place of the format badge: a square kit Thumbnail of the row tier (`aria-hidden`: the name names the file), the image icon while it loads or if it fails.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | The picture: a URL, or the local `preview` of a queued file. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "color">` | — | `className` and the other attributes of the thumbnail frame. |

### FileUpload.ItemText · FileUpload.ItemDescription · FileUpload.ItemActions
`ref` → `HTMLDivElement`. The file name (one line, truncated), its description (size, progress, error; danger in an invalid row) and the buttons at the end of the row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### FileUpload.ItemProgress
`ref` → `HTMLDivElement` (the wrapper). Upload progress across the row: the kit ProgressBar.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | Uploaded amount. |
| `max` | `number` | — | Total amount (ProgressBar default). |
| `tone` | `"accent" \| "neutral" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Fill color: `success` for a finished file, `danger` where a failed one stopped. |
| `aria-label` | `string` | `labels.upload` | Accessible name of the bar (not the wrapper); name the file. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the wrapper. |

### Types

#### `UploadQueueOptions<TResult>`
The argument of `useUploadQueue(options)`.

| Field | Type | Default | Description |
|---|---|---|---|
| `upload` | `(file: File, context: { id: string; signal: AbortSignal; onProgress: (progress: number) => void }) => Promise<TResult>` | — (required) | Sends one file: progress through `onProgress` (0…1), stop on `signal`, resolve with the answer (`result`), reject to fail. `id` is the item: after-upload work runs here once the request resolves. |
| `concurrency` | `number` | `3` | How many files upload at once; the rest wait as `queued`. |

### Functions

#### `useUploadQueue(options)`
`<TResult>(options: UploadQueueOptions<TResult>) => UploadQueue<TResult>`

The upload queue of FileUpload: `concurrency` files go at once through `upload`, the rest wait as `queued`; each has its progress, error and retry. Returns `{ items, add, retry, remove, clear, move }`.

## Variants

### trigger (FileUpload.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `dropzone` | the drop area with an icon, a title, a description and a decorative browse button, the files under it | a standalone upload field of a form; documents | yes |
| `button` | a kit Button of the tier, no zone and no drop: soft with the paperclip and text, ghost when its content is a `Button.Icon` alone | a composer's paperclip, an «attach» action in a toolbar or a dense form; pair it with `FileUpload.Queue` when the files live elsewhere | |
| `tile` | a dashed add tile — «+», «Добавить», `count из max` — as the last cell of the files; the whole row while empty; files drop anywhere on the set | file cards and the image gallery: files are added where they will lie | |

### variant (FileUpload.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `dashed` | field fill with a 1px dashed line; hover darkens fill and line | a standalone drop zone on a page — the dashed line is the «drop here» affordance | yes |
| `solid` | field fill only; the danger / accent line appears only when invalid / on drag-over | inside cards, modals and drawers; custom zones (avatar) | |

### layout (FileUpload.Root · FileUpload.Queue)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `list` | a row per file: badge or preview, name, size and status, a bar across the row while it uploads; no reorder | documents of a form, where the name matters most | yes |
| `grid` | square tiles that follow the set's width: 5 · 4 · 3 · 2 across; reorder by drag or Alt + arrows | file cards whose order matters (a report); with `cover` — the image gallery of a listing or a product | |
| `strip` | one row of `--prime-space-24` tiles that scrolls sideways with faded edges; reorder along the row | an attachment tray above a message field (Composer), where the height must not grow | |

### cover (FileUpload.Root · FileUpload.Queue)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | every tile carries its format pill | files with no main one | yes |
| `true` | the first tile is the cover: «Обложка» in place of its format pill, two columns by two rows in a `grid`; a tile reordered first takes it and the new cover is announced | an image gallery whose first photo is shown alone elsewhere (a catalogue card); tiles only — a `list` has no cover | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | zone padding 16, icon circle 28, browse 28, title 12/16; row badge 28 | compact attachment field in dense forms | |
| `s` | padding 20, icon 32, browse 32, title 13/20; badge 32 | side panels, small dialogs | |
| `m` | padding 24, icon 36, browse 36, title 14/20; badge 36 | regular forms | yes |
| `l` | padding 32, icon 40, browse 40, title 16/24; badge 40 | the main upload area of a page | |
| `xl` | padding 40, icon 48, browse 48, title 16/24; badge 48 | full-page or onboarding upload | |

**Sizes:** the rows of the root take its tier; a standalone `FileUpload.Item` takes `size` of its own. Tiles keep one size.

### tone (FileUpload.Title)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `default` | primary text, medium weight | the main line of the zone | yes |
| `muted` | secondary text, regular weight | an instruction sentence with an inline `LinkButton asChild` button | |

### tone (FileUpload.ItemProgress)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | accent fill | a file in flight | yes |
| `success` | success fill, full | the file is uploaded | |
| `danger` | danger fill where it stopped | the upload failed | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `max` | the add tile counts `count из max` (the digits roll); at the limit it says «Лимит файлов» and takes nothing | the set has a limit | — |
| `invalid` (Root) | danger line and icon | a rejected file without a message; otherwise pass `error` | — |
| `invalid` (Item) | danger soft fill, danger ring, danger description | an upload failed | `false` |
| `disabled` | disabled fill and text, drops ignored; the files read-only | uploading is unavailable, a published set | `false` |
| `focusRing` | `false`: the zone and the add tile draw no focus ring; focus, keys and ARIA stay | the zone sits in a host that marks focus itself | `true` |

**Combinations**
- Recommended: `variant="solid"` inside Card / Modal; `error` on Root explaining the rule; `queue` on the root with `useUploadQueue`; `trigger="tile"` + `layout="grid"` + `cover` for an image gallery; `trigger="button"` + `FileUpload.Queue layout="strip"` for a tray.
- Pointless: `labels` together with zone `children` (the built-in texts are ignored); `invalid` with `disabled`; `variant` with `trigger="button" | "tile"` (it is the zone's look); `cover` with `layout="list"` (rows do not reorder, so there is no cover).
- One upload field per form section; the submit action lives outside it.

## States
| State | Driven by | DOM |
|---|---|---|
| hover | — | zone fill and dashed line darken; a tile lifts on `--prime-shadow-overlay` and its remove button comes in |
| focus | keyboard focus on the hidden input | inset focus ring on the zone (danger when invalid) or a ring around the add tile; Enter / Space opens the dialog |
| drag-over | files dragged over the field | `data-state="active"` on the zone: accent line, accent soft fill, accent icon; with `trigger="tile"` `data-dropping` on the field and the add tile turns accent |
| invalid | `invalid` or a non-empty `error` | `data-invalid="true"` on the zone, `aria-invalid` on the input; `data-invalid="true"` on Item; the control shakes once when an error arrives (`data-shake` on the frame) |
| disabled | `disabled` | `data-disabled="true"`, disabled input, disabled fill and text, drops ignored; no add tile, actions or drag; a disabled button with `trigger="button"` |
| empty | no files, `trigger="tile"` | the add tile spans the row with «Нажмите или перетащите файлы» |
| cover | `cover`, the first tile | «Обложка» in place of the format pill, `data-cover` on the tiles wrapper (the first tile takes a 2 × 2 cell in a grid) |
| full | the set reaches `max` | `data-full` on the add tile: «Лимит файлов», faded; the file input is `aria-disabled` and opens no picker, so the field label stays undimmed |
| queued | queue item `status: "queued"` | a row reads «size · В очереди» over an empty bar; a tile (`data-upload="queued"`) dims under a 40px disk on the `media` shade (Button `shape="circle"` `variant="shade"`) whose ring turns at its least arc, described by «В очереди» |
| loading | `status: "loading"` | a row reads «size · Загрузка 40%» and its bar fills (`accent`); a tile's white arc grows clockwise from 12 o'clock with the share sent (the `progress` ring of a shade circle Button, one variable `--ring-value`, gliding `base` while it turns); the disk is the remove («Отменить загрузку: name», described by the state), the corner × is not drawn; the tile still reorders, its carried copy keeps the disk |
| done | `status: "done"` | a row reads «size» over a full `success` bar; a tile's ring fills, then its disk fades and shrinks to 0.9 (`fast`, `inert`), the picture returns to full or the sheet comes back |
| failed | `status: "failed"` | an invalid row, «size · reason», `danger` bar where it stopped, retry and remove; a tile's disk turns danger with a retry arrow («Повторить загрузку: name», described by the reason), a danger ring, the corner × is back |
| carried | a drag or Alt + arrows | Dnd: the tile lifts as a copy that takes the size of the cell it would land in, a dashed gap opens, neighbours glide; a file that becomes or stops being the cover moves to its new cell and fades in, and the new cover is announced («Обложка: name») |
| saving | `onValueChange` returned a pending promise | the touched files get `aria-busy` and `data-pending`: their content quiets to 0.6 (`fast`, both ways), the remove button is `loading` and stays shown, a tile does not drag; a move or new files stand in their new places, a removed file stays until the answer |
| refused | that promise rejected | the set goes back — a moved tile glides back, new files leave the queue — and `labels.changeFailed` is announced |
| leaving | a file left by its remove button | a row or a strip tile leaves a copy in place that closes up — fades, settles to 0.96 and shrinks to nothing with its gap (`fast`, `exit`) — so the files after it glide; off under reduced motion |

Also `data-size`, `data-variant` on the zone, `data-size` on Item, `data-status` on a row in the queue, `data-upload` and `data-kind` on a tile. A row of an upload keeps one height in every status: the bar stays, only its fill and the text change (the text morphs, `MorphText`); a new row enters (`enterMotion`), a tile that arrives after the first render enters too. A new cover's word fades in where its format pill stood.

## Layout & spacing
- The zone and Item are `width: 100%`; the parent sets the width. Label → trigger and the field → hint use the tier `label-gap` / `hint-gap`; trigger → files and row → row `--prime-space-2`.
- `trigger="button"` hugs its content; the hidden input sits beside the button.
- `ItemPreview` is a Thumbnail of the row tier (40 at `m`): the height of the name and description lines.
- A row shows a picture's preview, or the format badge beside the name without its extension, in the format's hue: pdf red, doc blue, xls green, ppt orange, archives yellow, video purple, audio pink, anything else gray.
- Tiles (`layout="grid" | "strip"`) reorder through Dnd: `FileUpload.Root` and `FileUpload.Queue` mount their own `Dnd.Root` unless one is already above them. A video tile mounts its first frame (`Thumbnail.Video`) once the tile nears the view.
- Tiles are the shared attachment tile (`src/internal/attachmentTile`, also the Composer tray). The tiles are a size container: 5 across from 36rem of its own width, 4 below, 3 below 32rem, 2 below 22rem; gap `--prime-space-3` (`--prime-space-2` from 3 across). With `cover` the first tile spans two columns and two rows at every width.
- A `strip` is a row of `--prime-space-24` squares, `--prime-space-2` apart, in a horizontal ScrollContainer (faded edges, `snap` to a tile, a vertical wheel scrolls it, hidden bar), padded by `--prime-space-1` so an edge tile's focus ring stays inside its clip; tiles do not lift on hover there.
- Every tile has the same slots whatever it holds: the format pill at the top start (`--prime-space-2` in, a caption-size tag; «Обложка» in its place on the cover), the remove × at the top end (a control `xs` square), and a band across the bottom — the name on the left (one line, ellipsis; the extension stands in the pill, the full name in `title` and the tile's accessible name) and the size, or a video's duration, on the right (tabular), caption type, padded `--prime-space-4` over it and `--prime-space-2` around. A file's band is lower (no gradient to carry), and its sheet glyph and upload disk stand in the middle of the area between the pill and the band, clear of both even on a small strip tile.
- Over a picture the picture is the ground: the pill, the remove button, the band's soft gradient (white name, muted meta) and the upload disk stand on `--prime-color-media-*`, the same in both themes. On a file the band is on the tile fill in the text roles and the pill is a kit Badge in the format's hue. The upload disk is the shared transfer disk (`internal/transferDisk`).
- The add tile is a dashed slot (`fill-strong`, no fill); it is always the last cell, so a drop past the last tile lands in front of it. In a `list` it is a row.
- A custom zone can hug its content (avatar zone: a root `className` with `width: fit-content`, `--file-upload-radius: var(--prime-radius-full)` and a small `--file-upload-padding`).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Focuses the hidden file input (the zone or the add tile shows the ring), then the files and their buttons. |
| `Enter` · `Space` | Opens the system file dialog (on the zone, the button or the add tile). |
| `Alt + ←` · `Alt + →` | On a tile (`layout="grid" \| "strip"`): moves the file one place; with `cover`, moving it first makes it the cover, and that is announced. |
| `Delete` · `Backspace` | On a tile: removes the file; focus moves to its neighbour. |
| `Escape` | Cancels a tile drag in flight. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The zone is a `<label>` around a visually hidden but focusable `<input type="file">`. With `label` the input is named by it (`aria-labelledby`) and described by the hint or error; without it the zone text names the input — give a custom body without text an `aria-label` on Root.
- `trigger="button"`: the kit Button takes the focus, named by the field label and its own text (or `aria-label`, required when it is an icon alone) and described by the hint or error; the input leaves the tab order.
- `trigger="tile"`: the frame is a group named by the label; the add tile is the label of a hidden input («Добавить файлы») with the hint, the error and `aria-invalid` wired to it.
- The files are a `<ul>` named by the field label (or `aria-label`). `FileUpload.Icon`, `FormatBadge` and `ItemPreview` are `aria-hidden`: the file name and description carry the meaning.
- Icon-only buttons in `ItemActions` need an `aria-label` with the file name; the set names its own («Убрать …», «Повторить загрузку: …»).
- A row in flight has its progress bar named by the file; a polite live region speaks a file that finished, the reason of one that failed, a removed file, the new cover after a reorder («Обложка: name», `labels.coverChanged`) and a refused change (`labels.changeFailed`); a file whose change is saved has `aria-busy`.
- Tiles are `<li>` of a Dnd.Sortable `<ul>`, named «Фото 2: склад.jpg · Загрузка 45%» («Видео …», «Файл …»; the file's `alt` in place of its name), with `aria-roledescription` and `aria-keyshortcuts`; the position and format on a tile are hidden (the name says them); the disk is a circle button («Отменить загрузку: …» described by the state, «В очереди» / «Загрузка 45%», `aria-busy`, its ring `aria-hidden`; on a failure «Повторить загрузку: …» described by the reason); without a remove handler the disk is no button but a `progressbar` (`aria-valuenow`) while the file is queued or uploading; Dnd's live region announces moves.
- A file with `href`: in a row its name is a link (`<a target="_blank">`, named by the name); a tile holds a link over its middle named «Открыть name» (`labels.open`), a Tab stop after the tile itself.
- Touch: a tile drag starts after a hold; the buttons on a tile are always shown, never hover-only.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `title` | `"Выберите файл или перетащите его сюда"` | Title of the built-in zone body. |
| `description` | `"JPEG, PNG, PDF, MP4 до 50 МБ"` | Description of the built-in body; an empty string hides it. |
| `browse` | `"Выбрать файл"` | Text of the browse button: decorative in the built-in zone body, the control itself with `trigger="button"`. |
| `optional` | `"необязательно"` | Marker after the label when `optional`. |
| `add` | `"Добавить"` | Text of the add tile (`trigger="tile"`). |
| `addLabel` | `"Добавить файлы"` | Accessible name of the add tile's file input. |
| `empty` | `"Нажмите или перетащите файлы"` | Text of the add tile of an empty set (it spans the row). |
| `emptyHint` | `"Можно несколько сразу"` | Second line of the empty add tile without `max` (with it the counter stands there). |
| `full` | `"Лимит файлов"` | Text of the add tile when `max` is reached. |
| `count` | `"{count} из {max}"` | Counter on the add tile (with `max`). |
| `cover` | `"Обложка"` | Pill of the first tile with `cover`. |
| `queued` | `"В очереди"` | A file waiting for a free slot (a row's status, a tile's name and its empty ring). |
| `uploading` | `"Загрузка {percent}%"` | A file in flight. |
| `failed` | `"Не удалось загрузить"` | A failed file whose upload gave no reason. |
| `progress` | `"Загрузка: {name}"` | Name of a row's progress bar. |
| `upload` | `"Загрузка файла"` | Name of a `FileUpload.ItemProgress` without an `aria-label` of its own. |
| `cancel` | `"Отменить загрузку: {name}"` | Name of the disk that cancels a tile's upload in flight. |
| `retry` | `"Повторить загрузку: {name}"` | Name of the retry button of a failed row (the retry disk of a failed tile). |
| `remove` | `"Убрать {name}"` | Name of the remove button of a file (it also stops an upload). |
| `open` | `"Открыть {name}"` | Name of a tile's link to the file (`href`); a row's link is named by the file name. |
| `removed` | `"{name}: убран"` | Live region: a file was removed. |
| `coverChanged` | `"Обложка: {name}"` | Live region: a reorder put another file first, the new cover (`cover`). |
| `changeFailed` | `"Не удалось сохранить изменение, файлы на прежних местах"` | Live region: the `onValueChange` promise of a change rejected and the set is as it was. |
| `uploaded` | `"{name}: загружен"` | Live region: a file finished uploading. |
| `uploadFailed` | `"{name}: {reason}"` | Live region: a file failed to upload; `{reason}` is its error or `failed`. |
| `tileImage` | `"Фото {position}: {name}{status}"` | Name of an image tile; `{name}` is the file's `alt` or name, `{status}` is ` · state` while it uploads. |
| `tileVideo` | `"Видео {position}: {name}{status}"` | Name of a video tile; the tokens of `tileImage`. |
| `tileFile` | `"Файл {position}: {name}{status}"` | Name of the tile of any other file. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Documents of a deal: a drop zone, the files already attached as rows whose names open them, and new files uploading through a queue with progress, a reason and a retry — `label`, `hint`, `multiple`, `defaultValue`, `href`, `queue`. |
| [variants.tsx](examples/variants.tsx) | How files are added: the dashed drop zone, the zone with only its fill for cards and modals, the compact picker button and the add tile that starts an empty set of tiles — `variant`, `trigger`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier of the zone and of its file rows: padding, icon, button, text and the format badge follow it — `size`. |
| [states.tsx](examples/states.tsx) | A default zone, a disabled one whose files are read-only and an invalid one without a message — `disabled`, `invalid`. |
| [validation.tsx](examples/validation.tsx) | A required scan checked as soon as it is picked: a wrong type or a large file shakes in an error that leaves when the file is removed; a hint and an optional zone — `required`, `hint`, `error`, `optional`. |
| [gallery.tsx](examples/gallery.tsx) | An image gallery of an office listing: the first photo is the cover on two tiles and a photo dragged first takes its place, new photos upload in their tiles, one fails and retries, and the add tile counts up to the limit and then says so — `trigger`, `layout`, `cover`, `max`, `value`, `queue`. |
| [file-cards.tsx](examples/file-cards.tsx) | Materials of a warehouse inspection as cards: photos and documents in one grid, each with its picture or format and the name with the size in megabytes as the report gives it; new files upload in their cards and the order is set by drag or Alt + arrows — `trigger`, `layout`, `defaultValue`, `queue`, `formatSize`. |
| [attachment-tray.tsx](examples/attachment-tray.tsx) | A reply to a client with a paperclip instead of a drop zone: the icon-only picker button, and the attachments as one scrolling row of tiles above the message — `trigger`, `aria-label`, `FileUpload.Queue`, `layout`. |
| [saving.tsx](examples/saving.tsx) | Published listing photos with no picker, every change saved on the server: a moved or removed photo waits busy, and a change the server refuses puts the set back — `FileUpload.Queue`, `onValueChange`, `value`, `cover`. |
| [custom-body.tsx](examples/custom-body.tsx) | A custom body: a muted title with a browse link and the formats line and source buttons instead of the built-in one — `FileUpload.Body`, `FileUpload.Title`, `FileUpload.Description`. |
| [avatar-upload.tsx](examples/avatar-upload.tsx) | A round zone around an Avatar that takes images and shows a preview; buttons open the same input — `inputRef`, `accept`, `className`. |
| [row-parts.tsx](examples/row-parts.tsx) | Rows the set does not draw, built from parts: order documents with a download button, a photo with its preview, a report still being prepared and one that failed with a retry — `FileUpload.Item`, `FileUpload.FormatBadge`, `FileUpload.ItemPreview`, `FileUpload.ItemActions`, `FileUpload.ItemProgress`, `invalid`, `tone`. |
| [controlled.tsx](examples/controlled.tsx) | Documents of a deal in one list: the files already on the server and new uploads after them, saved on every change, and a button brings back the saved set — `value`, `onValueChange`, `queue`. |
| [in-form.tsx](examples/in-form.tsx) | A contract upload form: submit checks the required scan, its error shakes in and leaves once a file is picked or removed — `required`, `error`, `name`, `value`. |
| [narrow.tsx](examples/narrow.tsx) | In a phone-width column the zone text wraps, a long file name truncates, and a gallery goes three across and then two, the cover keeping two columns and the remove buttons shown without hover. |
| [screen.tsx](examples/screen.tsx) | A media library of a catalog object as a work screen: the title, the object and a PageToolbar with sections, search, order and upload in the app header; uploads in FileUpload tiles through a queue; a grid of Thumbnails that open MediaViewer out of the tile or are picked for bulk download and delete; a Skeleton first load and a filtered empty state in a Crossfade — `trigger`, `layout`. |

## Mistakes
- A `Label` and a `Hint` placed around the zone by hand → pass `label`, `hint`, `error`.
- Nesting `FileUpload.Root` in another `<label>` → it already is one.
- A plain `<button>` in a custom body expecting it to open the picker → call `inputRef.current?.click()` in its `onClick`; an inline «browse» link is `<LinkButton asChild><button type="button" onClick={…}>`.
- `labels.hint` → the built-in secondary line is `labels.description`; `hint` is the field hint under the zone.
- A hand-written upload loop with its own progress, retry and abort per row → `useUploadQueue` + `queue`.
- A zone recolored into a button for a paperclip → `trigger="button"`.
- An image gallery — a grid of photos, an add tile, a cover and drag — written by hand, or looked for as a separate component → it is this one: `trigger="tile"`, `layout="grid"`, `cover`.
- A «make cover» button or menu next to each photo → the order is the control: the first tile is the cover, a photo dragged (or moved with Alt + ←) to the first place becomes it.
- `cover` on a `list` → rows do not reorder; use `layout="grid"` for a gallery.
- Rows of picked files drawn by hand from `onFilesChange` with `FileUpload.Item` → keep them in `value` (`onFilesChange` adds, `onValueChange` removes) and the set draws them; `Item` parts are for rows the set does not draw.
- A hand-made row of thumbnails above a message field → `trigger="button"` + `FileUpload.Queue layout="strip"`, or the Composer itself.
- Revoking a queue item's `preview` yourself → the queue revokes it when the item leaves; revoke only your own object URLs when a file leaves `value`.
- Saving the preview URLs of queued files → they are local to the page; save `item.result` of the queue.
- Deleting a file on the server with your own remove button next to the list → return the request's promise from `onValueChange`; the file waits and leaves only once the server agrees.
- Using the array index or the file name alone as `id` → ids must survive a reorder and two files may share a name.
- Sending the form while files are `queued` or `loading` → wait, or disable the submit until every item is `done`.
- Styling a tile from an ancestor (`.gallery li`) → the carried clone is portalled to `<body>` and loses it.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`, `Description`), [LinkButton](../link-button/COMPONENT.md) (a row's name with `href`), [Button](../button/COMPONENT.md) (browse button, `trigger="button"`, row and tile actions, the tile's upload disk `shape="circle"` `variant="shade"`), [Badge](../badge/COMPONENT.md) (`FormatBadge`), [Thumbnail](../thumbnail/COMPONENT.md) (`ItemPreview`, video tiles), [ProgressBar](../progress-bar/COMPONENT.md) (`ItemProgress`), [Dnd](../dnd/COMPONENT.md) and [ScrollContainer](../scroll-container/COMPONENT.md) (tiles), the shared attachment tile (`src/internal/attachmentTile`) and transfer disk (`src/internal/transferDisk`), `Icon`; the files of `queue` come from `useUploadQueue`, [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Composer](../composer/COMPONENT.md) (its attachment tray is `FileUpload.Queue layout="strip"`), [LinkButton](../link-button/COMPONENT.md) (an inline browse link in a custom body), [Avatar](../avatar/COMPONENT.md), [Thumbnail](../thumbnail/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md)
