# Gallery

**Category:** messages
**Kind:** primitive

> Photos and videos as a messenger album: one, or up to ten laid out from their aspect ratios alone, every box final before a byte loads; a tile opens the album in MediaViewer.

## When to use
- The media of a chat message — `Message.Media` is a Gallery its message shapes.
- Photos and videos attached anywhere else: a post in a feed, a comment, a report on a task, the attachments of a ticket.
- Media on its way, either way: an upload with its share and cancel, a failed one with a retry, a received one waiting to be fetched.

## When not to use
- One picture of an object in a list or a card (a product, a document) → [Thumbnail](../thumbnail/COMPONENT.md).
- Picking and ordering files before they are sent → [FileUpload](../file-upload/COMPONENT.md) (its `grid` gallery) or the Composer's tray.
- A full-screen viewer on its own (a product's photos from a button) → [MediaViewer](../media-viewer/COMPONENT.md); the gallery opens it for you.
- A grid of many images to browse (a media library) → a CSS grid of `Thumbnail`s.

## Import
```tsx
import { Gallery, type GalleryItem } from "prime-ui-kit";
```

## Anatomy
```
Gallery                      <div>, aspect-ratio from the layout; data-count, data-max-size with `maxSize`
├─ tile × 1–10               a box at fractions of the gallery, inset by half a gap at inner edges
│  ├─ Thumbnail              the picture (lazy, async decode) or a video's first frame (near the view)
│  ├─ play mark · length     the media disk and a pill over a video tile (aria-hidden)
│  ├─ open button            over the whole tile («Открыть: {alt}», aria-haspopup="dialog")
│  └─ transfer disk          the shared disk in the middle while the tile is on its way (internal/transferDisk)
├─ children                  laid over every tile (a message's meta pill)
└─ MediaViewer               the album full-screen (`viewer`), opened by a tile, closing back into it
```
The layout is a pure function of the items' ratios (`layout.ts`, `layoutGallery`): each item's ratio is kept between a tall portrait and a wide panorama (0.5…2 in an album, 0.6…1.8 alone), its orientation is read (wide, narrow, about square), and the shape is picked as a messenger does — two wide ones of one shape stacked, two alike side by side, two different ones sharing one height by their ratios; three with a tall first one as that one beside a column of two, otherwise a wide one over two; four the same with three; five to ten in rows, the partition (up to four rows of up to four) that comes closest to a square, penalised for very short rows and for more items above fewer. Nothing is measured: the tiles stand absolutely at fractions of the gallery's box, which keeps its aspect ratio.

An item (`GalleryItem`) is `type` (`"image"` by default, or `"video"`), `src`, an optional `poster` and `alt`, its natural `width` / `height` (the ratio that lays the album out and reserves every box before load), a video's `duration` before its metadata loads, and its transfer — `transfer`, `transferProgress`, `transferDirection`, the same shape as every transferring part.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Gallery
`ref` → `HTMLDivElement`. Photos and videos as a messenger album: one, or 2–10 laid out from their aspect ratios alone, every box final before anything loads. A tile opens the album in `MediaViewer`; a tile on its way shows the shared transfer disk.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `GalleryItem[]` | — (required) | `{ type?, src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }`; `width` / `height` give the ratio (default 4 : 3). The first 10 are shown. |
| `maxSize` | `string` | — | Caps the width at this CSS length instead of the host's width (`85cqi` of a chat row); the gallery then draws no radius — the host shapes and clips it. |
| `viewer` | `boolean` | `true` | A tile (a press, Enter or Space) opens the album in the kit's `MediaViewer` at that item. `false` — no viewer of the kit: open your own from `onOpenChange` and `onIndexChange`. |
| `open` | `boolean` | — | The viewer is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Initially open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | A tile opened the viewer (`true`), or the viewer closed (`false`). |
| `index` | `number` | — | The item the viewer shows (controlled); a tile sets it to its own. |
| `defaultIndex` | `number` | `0` | The item shown first (uncontrolled). |
| `onIndexChange` | `(index: number) => void` | — | A tile was activated, or the viewer turned its page: the item now shown. |
| `onCancel` | `(index: number) => void \| Promise<void>` | — | Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`. |
| `onRetry` | `(index: number) => void \| Promise<void>` | — | Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection). |
| `onDownload` | `(index: number) => void \| Promise<void>` | — | Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection). |
| `labels` | `Partial<GalleryLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Laid over the gallery, above every tile (a caption pill, a message's time). |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes. |

## Variants

### layout
Decided by the items, not a prop: the number of items and their ratios.

| Value | Looks like | Use when | Default |
|---|---|---|---|
| one | the item at its own ratio; a portrait narrower than the cap, its height reaching it | a single photo or video | |
| two | side by side at one height, or stacked when both are wide and alike | a pair | |
| three · four | a tall first one beside a column, or a wide first one over a row | a small album | |
| five–ten | rows, fewer items above more, close to a square | a large album | |

### Flags
| Prop | Effect |
|---|---|
| `viewer` | the album opens in `MediaViewer` (default) with the whole album as its set: arrows and swipes page, a video plays inside, pictures zoom, Escape closes; `false` — your own viewer from `onOpenChange` / `onIndexChange` |

## States
| State | Driven by | DOM |
|---|---|---|
| loading | an image that has not loaded | the Thumbnail's own placeholder in the tile's final box; nothing moves when it loads |
| video near the view | a video tile entering the view | the `<video preload="metadata">` mounts and shows its first frame; the length comes from the item's `duration` first, then from the metadata |
| pressed | a press on a tile (pointer, or Enter / Space held) | the whole album gives in a little (`:active` on the root, `--prime-motion-press-scale`, `fast`); inside a message the bubble presses instead |
| on its way | an item's `transfer` before `done` | the picture dims under the transfer disk; a video's play mark fades out of the middle and back once the transfer is done |
| open | `open` · `defaultOpen` · a tile | `MediaViewer` shows the album at `index`, flying out of the tile and back into it on close |
| transferring | `transfer` `queued` / `loading` on an item | the picture dims to 0.6 under the shared transfer disk with its progress ring (an indeterminate arc while `transferProgress` is left out; `transferDirection` changes only the words); pressing the disk cancels; the play mark gives way (`fast`) |
| failed | `transfer="failed"` | the disk turns danger with a retry arrow, described by the reason |
| remote | `transfer="remote"` | the download arrow on the disk; the picture dims under it |
| done | `transfer="done"` | the disk fades and shrinks away (`fast`), the picture returns to full |
| viewing | a tile pressed, Enter on it, or `open` | `MediaViewer` grows out of the tile at that item (`getOrigin`), the whole album its set; it closes back into the tile showing the item on screen, and the focus returns to the tile |

## Layout & spacing
- The gallery is as wide as its host allows, up to `--prime-gallery-max-size` (22.5rem); a lone portrait is narrower, its height reaching the cap. Its height is its width over the layout's ratio.
- Tiles are `--prime-gallery-gap` (2px) apart; the gaps are the gallery's own background, transparent by default (a host may paint it: a message paints the incoming surface).
- The outer corners are rounded (`--prime-radius-l`). A host that shapes and clips it itself (a message) passes `maxSize`: the gallery takes that length as its cap instead of its host's width and draws no radius of its own.
- At any width the album keeps its layout: tiles scale with the gallery, never rearrange.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the tiles that open the viewer and the transfer disks |
| `Enter` · `Space` | Opens the album in the viewer at this tile, or presses a transfer disk; in the viewer `←` `→` page and `Escape` closes, the focus returning to the tile |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A tile is a button «Открыть: {alt}» (`labels.open`; without `alt` — «фото» or «видео») with `aria-haspopup="dialog"`; its picture is then decorative. The viewer is MediaViewer's dialog with its own names; on close the focus returns to the tile.
- With `viewer={false}` and no open handlers a picture is an image with its own `alt`; the play mark and the length of a video are `aria-hidden`.
- A transfer disk is the cancel, retry or download button; the share is its accessible description («Отправка 42%»), the reason of a failure the retry's description; a refused cancel, retry or download is announced politely.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `open` | `"Открыть: {name}"` | Gallery: the name of a tile that opens the viewer; `{name}` is `alt`, else `photo` / `video`. |
| `photo` | `"фото"` | Gallery: `{name}` of a photo without `alt`. |
| `video` | `"видео"` | Gallery: `{name}` of a video without `alt`. |
| `cancelUpload` | `"Отменить отправку"` | Gallery: the cross while sending. |
| `cancelDownload` | `"Отменить загрузку"` | Gallery: the cross while receiving. |
| `retryUpload` | `"Повторить отправку"` | Gallery: the retry after a failed send. |
| `retryDownload` | `"Повторить загрузку"` | Gallery: the retry after a failed receive. |
| `uploadProgress` | `"Отправка {percent}%"` | Gallery: the share while sending — the description of the cross. |
| `downloadProgress` | `"Загрузка {percent}%"` | Gallery: the share while receiving — the description of the cross. |
| `notSent` | `"Не отправилось"` | Gallery: why a send failed — the retry's description. |
| `notReceived` | `"Не загрузилось"` | Gallery: why a receive failed — the retry's description. |
| `download` | `"Скачать {name}"` | Gallery: the download arrow of a `remote` tile; `{name}` is its `alt` or `photo` / `video`. |
| `cancelFailed` | `"Не удалось отменить"` | Gallery: announced when `onCancel` rejected. |
| `retryFailed` | `"Не удалось повторить"` | Gallery: announced when `onRetry` rejected. |
| `downloadFailed` | `"Не удалось скачать"` | Gallery: announced when `onDownload` rejected. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | An album of photos of different shapes and a video, laid out by their ratios before anything loads; a tile opens the album in the viewer — `items`, `width`, `height`, `type`. |
| [album-sizes.tsx](examples/album-sizes.tsx) | One album re-laid out for every count from one to ten: the switcher picks how many items the gallery holds and the layout cross-fades into the next — `items`. |
| [transfer.tsx](examples/transfer.tsx) | Items on their way, one look both ways: an upload with its ring and cancel, a failed one with a retry, a received one waiting to be fetched — the picture dims under the disk until it is done — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`. |
| [controlled.tsx](examples/controlled.tsx) | The album with a viewer of the screen's own: a tile reports its item, and the inspection card beside it shows which photo is open — `viewer`, `index`, `onIndexChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The viewer owned by the screen: a button opens the album at its third item, the page the viewer shows is kept, and closing returns the focus to where it came from — `open`, `onOpenChange`, `index`, `onIndexChange`. |

## Mistakes
- A CSS grid of your own for an album → `Gallery items`: the messenger layout from the ratios, every box final before load.
- Items without `width` / `height` → each tile falls back to 4 : 3 and the layout guesses; pass the natural size so the album is laid out right and never shifts.
- Measuring images to lay them out → nothing to measure: the layout is computed from the data.
- A rounded wrapper with `overflow: hidden` around it → the gallery rounds its own corners.
- A video that autoplays in a tile → the tile shows its first frame; it plays in the viewer.
- A lightbox of your own around the gallery → the gallery opens `MediaViewer` itself; control it with `open` / `index`, or `viewer={false}` for a viewer of your own.
- A progress bar or a spinner of your own over an uploading picture → `transfer` and `transferProgress` on the item (`transfer={item.status}`, `transferProgress={item.progress}` of a `useUploadQueue` item): the shared transfer disk.
- More than ten items in one gallery → items after the tenth are not shown; split them into several albums of up to ten.

## Related
- **Built from:** [Thumbnail](../thumbnail/COMPONENT.md) (`Thumbnail.Image`, `Thumbnail.Video`), [MediaViewer](../media-viewer/COMPONENT.md) (the album full-screen), [Button](../button/COMPONENT.md) (the transfer disk), [Spinner](../spinner/COMPONENT.md) (a pending transfer disk), [ScrollContainer](../scroll-container/COMPONENT.md) (its scroller is the view a video waits for), Icon (`action.play`, `action.video`, `object.image`); `internal/transferDisk` (the transfer of a tile), `internal/mediaDisk` (the play mark), `internal/mediaPill` (the length), `internal/useNearView` (a video mounts near the view), `internal/press` (the album's press), `internal/formatClock`, `internal/messagePart` (the press goes to the message)
- **See also:** [Message](../message/COMPONENT.md) — `Message.Media` is a Gallery in a message; [MediaViewer](../media-viewer/COMPONENT.md) — the viewer on its own; [Thumbnail](../thumbnail/COMPONENT.md), [FileUpload](../file-upload/COMPONENT.md), [VideoNote](../video-note/COMPONENT.md)
