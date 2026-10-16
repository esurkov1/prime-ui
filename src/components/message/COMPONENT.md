# Message

**Category:** messages
**Kind:** composite

> One chat message in its shell: a speech bubble, a picture or a circle, incoming or outgoing, the tail that ends a run, the time and delivery ticks in the corner, reactions, the menu, a group chat's author header, and every content kind of a messenger.

## When to use
- A message of any kind: text with formatting, a reply, a forwarded message, reactions, photos and albums (`Message.Media`, a `Gallery`), a round video message (`VideoNote` inside), a voice message (`VoicePlayer` inside), a file, a location, a contact, a link preview.
- The rows of a conversation in [Chat](../chat/COMPONENT.md) (`Chat.Messages`): the list, dates, search, selection and jumps live there; the message is one row.
- A message on its own: a quoted reply in a ticket, the last message in a card, a preview of what will be sent (`preview` — a bot's welcome message on its settings page).
- A sticker (`Message.Sticker`): a webp or gif by `src`, or your own Lottie / video player as children.
- «Печатает…» (`Message.Typing`) as the last row of a list.

## When not to use
- A whole conversation (a header, the list, search, the Composer) → [Chat](../chat/COMPONENT.md); a list of messages without the rest is `Chat.Root` with `Chat.Messages`.
- Dates, events of the chat and the unread band between messages → `Chat.Separator`, `Chat.Service`, `Chat.Unread`.
- A feed of events with a time axis (an order history, an audit log) → [Timeline](../timeline/COMPONENT.md).
- One system message on a page (saved, failed) → [Banner](../banner/COMPONENT.md) or a [Notification](../notification/COMPONENT.md).
- Photos outside a message → [Gallery](../gallery/COMPONENT.md); a recording outside a chat → [VoicePlayer](../voice-player/COMPONENT.md).
- Formatted text outside a message, with no bubble → [RichText](../rich-text/COMPONENT.md).

## Import
```tsx
import { Message, formatMessageTime, hueOf } from "prime-ui-kit";
```

## Anatomy
```
Message.Root                      role="article" row «{author}, {time}» (an option in a chat's selection mode)
├─ [check]                        Checkbox.Indicator at the row start in selection mode
├─ Message.Avatar                 gutter beside an incoming bubble of a group chat (last of a run)
├─ [retry Button]                 beside a failed outgoing bubble (`onRetry`)
├─ shell                          bubble · media · round, declared by the content parts (see Variants):
│  ├─ Message.Author              header of a group chat (first of a run): name · Message.AuthorIcon · tag;
│  │                              on a pill at the top-start corner over a picture or a circle
│  ├─ Message.Forwarded           «Переслано от …»
│  ├─ Message.Reply               quote of the answered message (button with target / onClick)
│  ├─ content                     Message.Text · Message.Media (+ caption Text) · VoicePlayer · Message.File ·
│  │                              Message.Location · Message.Contact · Message.LinkPreview · VideoNote ·
│  │                              Message.Sticker
│  │                              (a voice message or a circle may open its transcript under it)
│  ├─ Message.Reactions           a row held closed in every message; chips closing a bubble
│  │                              (under a picture or a circle), the meta's spacer at its end
│  └─ meta                        «изменено» · time · ticks, in the bottom-end corner (a dark pill
│                                 over a picture or a circle)
├─ Message.Actions                a row of a bot's inline keyboard under the bubble (Button.Root children);
│                                 several make several rows
├─ Message.Menu                   Dropdown.Content anchored to the message (Dropdown.Anchor) at the pointer (+ «Выбрать» in a chat with a selection)
└─ [reaction bar]                 floating toolbar above the bubble: long press, long hover, `R`

Message.Typing                    «печатает…»: an incoming bubble of three dots, the last row of a list
```
The part that ends a bubble closes its last line with the meta's spacer — an invisible copy of the meta that floats to the line's end — so the time sits on that line when it fits and on a line of its own when it does not; a picture or a circle carries the meta on a dark pill (`internal/mediaPill`). Every content part declares its kind once (`defineMessagePart` in `internal/messagePart`: its shell, how the meta stands with it, whether it is a picture, reaches the edges or sets the width, its off-screen estimate and the text a chat's search looks in), so the message decides the shell, the tail and the meta from what it holds, fragments opened and empty children ignored. Parts render in the order you write them, except four that the message places itself: `Message.Author` heads the bubble (on a pill over a picture or a circle), `Message.Avatar` goes to the gutter, `Message.Menu` to the menu, and `Message.Actions` rows go under the bubble (and its reactions), in their own order. Nothing in a message is measured in JS but the hug of a bubble of text (see Layout) and the before / after boxes of a size change (`bubbleMorph`). The reaction bar is mounted only from its open to the end of its exit, one on the page at a time; the menu mounts on its first open.

In a list (`Chat.Messages`) a message reads the list through `internal/messageList`: its place in a run (`position`) and the chat's kind decide the author's header (first of a run in a group chat) and the avatar (last of a run); the list registers it for new-message entry and read receipts, selects it, jumps to it and holds its size changes still. On its own a message given an author or an avatar does the same by its `position`: the header on `single` / `first`, the avatar (and the gutter) on `single` / `last`.

Content parts in short: `Message.Media` — a [Gallery](../gallery/COMPONENT.md) the message shapes (the messenger album layout from the items' ratios, every box final before load, the shared transfer disk over a tile, the meta overlay; an album's gaps stand on the incoming surface in both directions). `VideoNote` and `VoicePlayer` are components of their own that declare themselves parts (the round shell, and a fill bubble) and carry the same transfer props as `Message.File`. `Message.File` — a round format tile (or the preview) that is also its one action (download, cancel inside the progress ring, retry), the name, and the size line under it ending with the spacer. `Message.Location` — the map edge to edge with an accent pin (breathing when `live`), the place and the address ending with the spacer. `Message.Sticker` — a square picture with no bubble (`media` shell, the meta on its pill): the kit draws a webp, gif or apng from `src`; a Lottie (.tgs) or video sticker is your player as children (the kit has no runtime dependencies), with `loading` while it prepares. `Message.Text` renders the Markdown subset the Composer writes — **bold**, _italic_, ~~strike~~, `code`, fenced code, Markdown links, bare URLs, `> ` quotes — as elements; links take only http(s), mailto and tel addresses (anything else stays text) and open in a new tab. `Message.Menu` holds the `Dropdown.Item`s you write (Ответить, Скопировать, Закрепить, Переслать, Пожаловаться, Удалить with `tone="danger"`); in a chat with a selection the kit appends a separator and «Выбрать».

`formatMessageTime(date, timeZone?)` gives «09:05», the default `formatTime`; the time is read in `timeZone`, else the list's (`Chat.Messages timeZone`), else the browser's zone. `hueOf(id)` gives a palette hue stable per id for `Message.Author color` and the author's `Avatar`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Message.Root
`ref` → `HTMLElement` (`<article>`). One chat message: a `role="article"` row whose content parts pick its shell — `bubble`, `media` or `round`; `direction` sets its side and fill, `position` its tail, header and avatar in a run.

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `"incoming" \| "outgoing"` | `"incoming"` | `incoming` — on the start side, a surface one step off the chat; `outgoing` — on the end side, in the accent hue (`--prime-color-message-outgoing-*`), everything inside recolors with it. |
| `position` | `"single" \| "first" \| "middle" \| "last"` | `"single"` | The place in a run of one author (`Chat.Messages items` sets it): `single` and `last` end a run with the tail (and a group chat's avatar); `single` and `first` show the author's header. |
| `time` | `Date \| string` | — | When it was sent: a `Date` shown with `formatTime` (and put in `<time dateTime>`), or the text to show. |
| `timeZone` | `string` | the list's `timeZone`, else the browser's zone | The IANA zone the time is read in (`"Asia/Vladivostok"`): a profile's zone, not the browser's. |
| `formatTime` | `(date: Date, timeZone?: string) => string` | «09:05» | Display of a `Date` time; gets the `timeZone` in force. |
| `edited` | `boolean` | `false` | The text was edited: `labels.edited` before the time. |
| `status` | `"sending" \| "sent" \| "read" \| "failed"` | — | Delivery of an outgoing message: a clock, one check, two checks (accent), or a danger mark; the glyphs cross-fade from one state to the next. Named for assistive tech by `labels`. |
| `preview` | `boolean` | `false` | A picture of the message outside a chat (a bot's settings): no menu, reactions, retry or row focus, `Message.Actions` inert; links and players still work. |
| `onRetry` | `() => void \| Promise<void>` | — | Sends a failed message again: a ghost danger button beside the bubble. A returned promise shows `sending` until it settles; a rejection leaves it failed. |
| `onReactionToggle` | `(emoji: string) => void \| Promise<unknown>` | — | Puts or takes back the reader's reaction (a chip, a double tap, `L`, the reaction bar). Shown at once; a returned promise keeps it pending, a rejection drops it back. Without it reactions are read-only. |
| `value` | `string` | — | The message id for selection, jumps, read receipts, search, pins and `Message.Reply target` (`Chat.Messages items` sets the item's key). Keep it when the server confirms a sent message. |
| `labels` | `Partial<MessageLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "role">` | — | `id`, `aria-label` to replace «{author}, {time}», `className` and the other attributes of the row. |

### Message.Avatar
`ref` → `HTMLDivElement` (`aria-hidden`). The author's `Avatar` (`m`) in the gutter of an incoming bubble in a group chat. Put it on every message: only the last of a run shows it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (an `Avatar.Root`), `className`. |

### Message.Author
`ref` → `HTMLDivElement`. A group chat's author header: the name in the author's hue, an optional `Message.AuthorIcon`, then the muted `tag`. Put it on every message: only the first of a run shows it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `hueOf(name)` | The author's hue: one per person in a chat. By default a hue stable per name (`"blue"` when the name is not plain text); pass `hueOf(user.id)` to keep it per person. |
| `tag` | `ReactNode` | — | The member's own title in this chat, muted after the name («Админ», «Бухгалтерия»). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "color">` | — | `children` (the name, then an optional `Message.AuthorIcon`), `className`. |

### Message.AuthorIcon
`ref` → `HTMLSpanElement` (`aria-hidden`). A small mark after the author's name — an `<Icon name="…" />`: a crown of the chat's owner, a check of a verified member. Decorative: say what it means in the `tag` when it matters.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (an `Icon`), `className`. |

### Message.Forwarded
`ref` → `HTMLDivElement`. «Переслано от {author}» over a forwarded message, the original author in bold, in the accent color.

| Prop | Type | Default | Description |
|---|---|---|---|
| `from` | `string` | — (required) | Who wrote the original. |
| `labels` | `Partial<MessageForwardedLabels>` | — | `forwarded` — the header template with `{author}`. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Reply
`ref` → `HTMLElement` (`HTMLButtonElement` with `target` or `onClick`). The quoted message this one answers: a wash with a bar in the author's hue, the name over one line of the text. In an outgoing bubble it takes the bubble's accent.

| Prop | Type | Default | Description |
|---|---|---|---|
| `author` | `ReactNode` | — (required) | Who wrote the quoted message. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | The author's hue (the same as their `Message.Author`). |
| `target` | `string` | — | The `value` of the quoted message: a press brings the chat to it (rendering it first in a window), the message blinks, and the focus moves to it. Makes the quote a button. |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | A press on the quote, after `target` is shown: load the original when it is not in the list yet. Makes the quote a button. |
| `labels` | `Partial<MessageReplyLabels>` | — | `reply` — the hidden prefix read before the quote. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "color" \| "onClick">` | — | `children` (the quoted text, one line), `className`. |

### Message.Text
`ref` → `HTMLDivElement`. The text: a string renders the Markdown subset the Composer writes as elements, never as HTML (`plain` shows it as is). Marks the matches of the chat's search.

| Prop | Type | Default | Description |
|---|---|---|---|
| `plain` | `boolean` | `false` | Render a string as is, without its Markdown. |
| `children` | `ReactNode` | — (required) | The text: a string renders its Markdown subset. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Media
`ref` → `HTMLDivElement`. A photo, a video or an album of up to 10: a `Gallery` the message shapes, with every gallery prop. Alone it is the `media` shell; with a `Message.Text` caption after it, it tops a bubble edge to edge.

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
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.File
`ref` → `HTMLDivElement`. A document: a round format tile (or `preview`), the name and the size. The tile is the file's one action — download (`href` or `onDownload`), cancel while it transfers, retry after a failure.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — (required) | The file name with its extension (the format tile reads it). |
| `fileSize` | `number` | — | Bytes, shown as «1,2 МБ». |
| `formatSize` | `(bytes: number) => string` | Russian digits, Б · КБ · МБ · ГБ | Display of `fileSize`. |
| `href` | `string` | — | Where to get it: the tile becomes the download link «Скачать {name}». |
| `preview` | `string` | — | A picture of the file (an image, the first page) in the tile in place of the format. |
| `transfer` | `"remote" \| "queued" \| "loading" \| "failed" \| "done"` | — | The transfer of the file, either way (`TransferState`): `queued` / `loading` — the cancel cross and the share ring; `failed` — retry; `remote` — download; `done` — the disk fades out. |
| `transferProgress` | `number` | — | Share transferred, 0…1 (`UploadItem.progress`): the ring along the disk's inner edge, gliding (`base`) while it turns. Without it a transfer in flight turns a quarter arc. |
| `transferDirection` | `"upload" \| "download"` | `"upload"` | Which way it goes: sending (`upload`) or receiving (`download`). Changes only the words — the names of the cross and the retry, the share and the failure — never the look. |
| `onCancel` | `() => void \| Promise<void>` | — | Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`. |
| `onRetry` | `() => void \| Promise<void>` | — | Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection). |
| `onDownload` | `() => void \| Promise<void>` | — | Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection). |
| `labels` | `Partial<MessageFileLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Location
`ref` → `HTMLDivElement`. A place in one card width: a 16 : 9 map picture edge to edge at the top of the bubble (its box is final before it loads) with an accent pin, the place and its address under it; `live` makes the pin breathe and adds a «Трансляция» badge.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | A map picture of the place from your map service (the kit ships no map). |
| `href` | `string` | — | Opens the place in a map, in a new tab. |
| `title` | `string` | — | The place. |
| `address` | `string` | — | Its address. |
| `live` | `boolean` | `false` | A location shared live (still under reduced motion). |
| `labels` | `Partial<MessageLocationLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Contact
`ref` → `HTMLDivElement`. A shared contact in one card width: an `Avatar` (`l`, photo or initials), the name and the phone; `children` are the actions in a row under them.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — (required) | The person. |
| `phone` | `string` | — | The phone, as written. |
| `src` | `string` | — | The person's photo; without it the initials. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | Hue of the initials. |
| `children` | `ReactNode` | — | `Button.Root` actions in a row under the person («Написать», «Добавить»). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "color">` | — | `className` and the other div attributes. |

### Message.LinkPreview
`ref` → `HTMLAnchorElement`. The card of a linked page across the bubble's full width (at least the card width): an accent wash with a bar, the site, title, description (3 lines) and a 16 : 9 picture; long words and URLs wrap; the whole card opens the page in a new tab.

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — (required) | The page. |
| `site` | `string` | — | The site's name, in the accent color. |
| `title` | `string` | — | The page title. |
| `description` | `string` | — | Its description, up to three lines. |
| `image` | `string` | — | The page's picture, full width under the text. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title">` | — | `className` and the other attributes of the link. |

### Message.Sticker
`ref` → `HTMLDivElement` (`role="img"`). A sticker: a square picture with no bubble, the meta on a pill over its corner; a `Skeleton` holds the box until it is ready.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | — (required) | The sticker's name («Стикер «Класс»», or its emoji); shown in its box when `src` fails. |
| `src` | `string` | — | A still or animated picture (webp, gif, apng), decoded before it shows. Without it the children are the sticker. |
| `loading` | `boolean` | `false` | Your player in the children is not ready yet: the `Skeleton` stays over the box. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "role" \| "aria-label">` | — | `children` — your player for a Lottie (.tgs) or a video sticker, sized to the box; `className`. |

### Message.Reactions
`ref` → `HTMLDivElement`. Reaction chips at the bottom of a bubble, or under a picture or a circle: a `role="group"` of toggle chips — the emoji, then who reacted (`users`) or the count. A press goes to `Message.Root onReactionToggle`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MessageReaction[]` | — (required) | `{ emoji, count, selected?, users? }` — `count` is the total, `selected` the reader's own reaction, `users` (`{ id, name, src?, color? }[]`, in the order they put it) who put it; without `users` the chip shows the count. |
| `closeOnOutsideClick` | `boolean` | `true` | A press outside closes the message's reaction bar. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the message's reaction bar. |
| `labels` | `Partial<MessageReactionsLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Actions
`ref` → `HTMLDivElement`. A bot's inline keyboard row under the bubble: `Button.Root` keys (`soft` `neutral` by default) share one line, long labels ellipsize. A link key gets a corner mark: ↗ out of the product, a window into it; a promise from `onClick` keeps a key loading.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` — the `Button.Root`s of the row (`asChild` for a link); `className`. |

### Message.Menu
`ref` → `HTMLDivElement`. The context menu: a `Dropdown.Content` of the `Dropdown.Item`s you write; the kit adds «Выбрать» when the chat has a selection. Opens on right click, long press and from the keyboard.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier of the menu. |
| `…rest` | `Omit<DropdownContentProps, "side" \| "align" \| "matchTriggerWidth">` | — | `children` (the items), `className`. |

### Message.Typing
`ref` → `HTMLDivElement` (`role="status"`). «Печатает…»: an incoming bubble of three dots at the end of the list while the other side types (`Chat.Root typing` puts it there). Keep it mounted and switch `open`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `true` | The bubble is open: the other side is typing. Keep the part mounted and switch this, so it folds open and closed. |
| `children` | `ReactNode` | — | `Message.Avatar` of who types, in a group chat (`Chat.Messages group`). |
| `labels` | `Partial<MessageTypingLabels>` | — | `typing` — the text read for assistive tech. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

## Variants

### shell
Decided by the content parts, not a prop (`data-shell` on the bubble): a circle makes `round`, a picture or an album alone makes `media`, anything else a `bubble`.

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `bubble` | fill (surface or accent), padding, the meta in the bottom-end corner over the last line's reserve | text, voice, file, contact, location, link preview, a picture **with** a caption | yes |
| `media` | the picture itself, clipped to the radius — no backing, no padding; the meta on a dark pill over its bottom-end corner; reactions in a row of their own **under** it, on the message's side (chips in their own fill); an album's gaps show the incoming surface in both directions, never the outgoing fill | a photo, a video or an album **without** a caption; a sticker | |
| `round` | `VideoNote`: a circle standing on the chat — no backing in either direction; the duration and the meta float on their own pills over its bottom; reactions under it as for `media` | a round video message | |

With a caption a picture sits at the top of a normal bubble, edge to edge, and its reactions stay inside it, under the caption. The row of reactions is held closed in every message and opens with the first reaction (see States).

### direction
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `incoming` | at the start; a surface one ladder step off the chat | messages from others | yes |
| `outgoing` | at the end; the accent hue (`--prime-color-message-outgoing-*`: pale cobalt with dark text in light, cobalt with white text in dark) | the reader's own messages | |

### position
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `single` | the message gap above; a bubble of fill gets the tail; in a group chat the author's header and the avatar | a message alone | yes |
| `first` | the message gap above; in a group chat the author's header | first of a run of one author | |
| `middle` | the small group gap above | inside a run | |
| `last` | the small group gap above; a bubble of fill gets the tail; in a group chat the avatar | last of a run | |

### status
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `sending` | clock | the request is on its way | |
| `sent` | one check | delivered to the server | |
| `read` | two checks in the accent | read by the recipient | |
| `failed` | a danger mark; a retry button beside the bubble with `onRetry` | the request failed | |

### reaction chip
Decided by the reaction, not a prop. A chip is the emoji, then who reacted or the count; its fill says whose it is.

| Value | Looks like | Use when | Default |
|---|---|---|---|
| not the reader's | a neutral wash with primary text: the context `fill-muted` on an incoming bubble and on the chat under a picture, `--prime-color-message-outgoing-chip` (a precomposed neutral wash, not tinted) on an outgoing bubble | someone else's reaction | yes |
| the reader's | `selected`: the accent fill with accent-fg text; the avatars ringed in the accent | the reader put it | |
| avatars | `users` with 1–3 reactors: their `xs` avatars, overlapping, ringed in the chip's fill (initials over an opaque fill) | a chat small enough to know who | |
| avatars + «+N» | `users` with 4 or more: the first two and a «+N» circle of the same size, in the chip's own colors | a busy reaction | |
| count | no `users` (or fewer than the circles need) | a channel, or no names to show | |

The fill moves between the two in a color transition (`fast`, both ways); the avatar ring follows it on every frame.

### Flags
| Prop | Effect |
|---|---|
| `edited` | «изменено» before the time |
| `preview` | a picture of the message outside a chat: no menu, reaction bar, reactions toggle, retry or row focus; `Message.Actions` rows `inert` (seen, never pressed); links, players and spoilers still work |
| `Message.Sticker loading` | the Skeleton stays over the sticker's box while your player prepares |
| `Message.Location live` | a breathing pin and a «Трансляция» badge |
| `Message.Text plain` | a string without Markdown |
| `Message.Typing open` | the typing bubble shows; off, it leaves closing its height |

The list-level settings a message reads — the group chat's author header and avatar gutter (`type`), the quick reaction, the reaction bar's options, the reader — are props of `Chat.Messages`.

## States
| State | Driven by | DOM |
|---|---|---|
| author header | `Message.Author` in a group chat (`Chat.Messages group`) on `single` / `first`; any message on its own | the header line at the top of the bubble; over a picture or a circle on the media pill at the top-start corner; hidden on `middle` / `last` and in a direct chat (the author still names the message) |
| avatar | `Message.Avatar` in a group chat on `single` / `last` | the avatar in the gutter at the bubble's bottom; the gutter stays empty on the others |
| new at the end | the chat's list decided it (`data-enter="incoming"` / `"outgoing"`) | the message column floats up `--prime-space-3` from below and fades in (`fast`, enter easing, `transform` + `opacity` only; the row box clips it); never on a first render, history or a status change. See Chat |
| pointed at / stepping back | the chat's jump, search or selection (`data-pointed`, `data-blink`, `data-selected` on the message; `data-pointing`, `data-selecting` on the list) | nothing is drawn on the message: it stays at full strength while the others — the bubble, picture or circle with its tail and reactions, the avatar, the retry — step back to `--prime-opacity-dim` with a slight desaturation (selection: `fast`, both ways; the current search match: while it is current); a jump instead blinks the message itself three times, `base` each, the others stay still. Reduced motion: no blink |
| search match | the chat's search query | every case-insensitive match in `Message.Text` and the transcripts under a soft accent wash (`<mark>`) |
| typing | `Message.Typing open` | an incoming bubble of three dots rising and fading in turn on the loading loop (reduced motion slows it); enters floating up while its height opens (`fast`), leaves closing its height (`fast`) — or at once when a reply arrives at the end of the list in the same update; its block axis clips, so a closed row leaves nothing under the list |
| status change | `status` | the ticks cross-fade and scale (`base`, `emphasized`), interruptible |
| retrying | `onRetry` returns a promise | `sending` ticks and a `loading` retry button until it settles |
| inline keyboard | `Message.Actions` children | `data-actions` on the message column: the rows under the bubble, the bubble at least as wide as them, no tail |
| failed | `status="failed"` | `data-failed` on the row; danger mark, retry button |
| preview | `preview` | `data-preview` on the row, no `tabindex`; `inert` on every `Message.Actions` row |
| sticker loading | `Message.Sticker` until its `src` is decoded, or while `loading` | `data-status="loading"`, `aria-busy`: a `Skeleton` covers the box, then fades out over the picture (`fade-base`); a `src` that fails shows the sticker's name, `data-status="error"` |
| reaction toggled | a chip, a double tap, `L`, the reaction bar | the chip changes in place (never remounts) in the same frame: the fill is a color transition (`fast`); a reactor who joins fades and scales in from 0.9 while the stack widens (its width follows its circles), one who leaves the reverse; a count that only changes value rolls its digits and the chip does not move — its width follows the number of digits (tabular) and moves (`fast`) only when that changes; the reader (`Chat.Messages reader`) joins or leaves the avatar stack; while a returned promise runs `aria-busy`, `data-pending` — update `items` before it resolves; a rejection drops it back. Without `onReactionToggle` the chips are read-only and there is no reaction bar |
| size change | a reaction row that opens or closes, a chip that comes or goes, a transcript, an edit, an upload state | one stroke (`bubbleMorph`, `--prime-message-morph-duration` 300 ms): the new layout is laid out at once, in the same frame, and the bubble's visible box glides from the old rectangle to the new one — width and height together, one `clip-path: inset(… round …)` animation on the compositor, the fill a layer under the content that reaches over both boxes. Every part that moved (the text, the meta, the cards, the chips, the tail, the retry) glides from where it was by a `transform` on the same clock; a part that came fades (a chip also scales from 0.9) in where it stands once the box has room for it; a part that went fades out where it stood, out of flow. A change mid-flight retargets from what is on screen; a commit that moves nothing touches nothing. The meta and the tail stay put on a reaction: the message grows upward, the chat scrolling by the change in the same frame while the rows above glide as one block on the same clock (the rows below never move). A disclosed block (a transcript) fades over the whole stroke while the box opens or closes over it. The text glides straight with the bubble's top-start corner, keeping its padding all the way. Nothing travels across text: a meta that stays while text passes through its place dips — it fades out at the same spot before the text reaches it and back once the text has left — and a meta that changes line (a transcript's last line ↔ the player row) cross-fades — out at its old place in the first 40 % of the stroke, in at its new place in the last 40 %. Easing `standard`. Reduced motion: instant (the scroll still keeps the view) |
| new reaction | an emoji not on the message yet (the reader's or anyone's) | part of the size change: its room is there at once and the chip fades and scales in from 0.9 where it stands, on the bubble's clock, once the parts moving away have left its place. Never on the first render of a message: opening a chat or loading history plays nothing |
| reaction removed | the last of an emoji taken back | part of the size change: the chip fades out where it stood (`data-morph-ghost`, out of flow) while the chips after it and the bubble glide into place — one stroke |
| own reaction | `selected` in `Message.Reactions items` | `aria-pressed`, `data-selected`: accent fill |
| reaction bar | long press (with the menu), long hover ~500 ms (pointer devices, the bar alone, a 300 ms grace to reach it), `R` | a floating toolbar above the bubble; it grows from the bubble, the emoji pop in a quarter-stagger apart, «⌄» glides the rest open, the hovered emoji lifts; the picked one swells while the bar leaves — the open played back on the same `base` clock, back to the bubble's corner, nothing reflows; mounted from its open until its exit ends, one on the page at a time |
| round video | `VideoNote` in the message | the round shell: no backing, the meta on its pill at the circle's bottom-end corner, reactions under it; the circle's own states are VideoNote's (a still first frame at rest, nothing plays before a press) |
| transcript | `transcript` / `onTranscribe` on `VoicePlayer` or `VideoNote`, `transcriptExpanded` | the same soft `xs` button at the player's top end (the end of the waveform; the top-end corner of the circle's box) opens the text: the text block is laid out at once under the player and the bubble glides open (the size change), the text fading in as the box reaches it and the meta moving to the end of its last line; under a circle the text stands in a block of the message's fill. Closing is the mirror image: the box closes over the text while it fades over the whole stroke, like a disclosure. The player row never moves; the rows after the message glide by the same height on the same clock while the view holds still. While `onTranscribe` is pending only the button spins and the area stays closed, then it opens with the text; a rejection closes the area and announces `transcribeFailed`. The open state and the text outlive the row leaving the window |
| transferring media / file, sent or received (one look both ways) | `transfer`, `transferProgress`, `transferDirection` (of an item for media) | media: the picture dims under the shared transfer disk in the middle — a 40px disk on the media shade (backdrop blur) with a white ×, the progress drawn as a ring along its inner edge (the disk is a Button `shape="circle"` `variant="shade"`; the ring is its `progress` ring — the kit ring at the line weight, 2px, a 32% white track, a white arc from 12 o'clock gliding `base`, always turning; the button is `aria-busy` and described by «Отправка {percent}%» / «Загрузка {percent}%» by the direction), the play mark of a video gives way; pressing the disk cancels; done — the ring fills, then the disk fades and shrinks to 0.9 (`fast`), the picture returns to full; failed — the disk turns danger with a retry arrow («Повторить отправку» / «Повторить загрузку», described by «Не отправилось» / «Не загрузилось»); `remote` — the download arrow on the same disk, no ring (`onDownload`). A file: the same disk at the tile's size (`xl`, 48px) covers its round tile, always shown — the ring along its edge, the × on the media shade; failed — the danger retry and the reason under the name; done — it fades away and the face (or the download link) is back. Voice and video messages draw the same transfer on their own play disk (VoicePlayer, VideoNote). Every one is the same disk (`internal/transferDisk`): one ring proportion, track, start, motion and cancel / retry / download. The size line shows «{done} из {total}». The name and the size line never move |
| transfer pending | `onCancel` / `onRetry` returned a promise | a `Spinner` in the disk's glyph place, `aria-busy`, no second press; a rejection leaves the transfer as it was and announces `cancelFailed` / `retryFailed` |
| selection mode | the chat's `selected` (not `null`) | an `option` with `aria-selected`; a check (`Checkbox.Indicator`, circle) at the row start; a press anywhere on the row toggles it — the parts inside take no presses meanwhile; `data-selecting`, `data-selected` on the article |
| menu open | right click, long press, Enter / Shift+F10 / the menu key | the menu against the message at the pointer (`anchorPoint`; below the bubble from the keyboard), focus returns to the message on close; a bottom sheet on a phone |
| focused | keyboard | the focus ring around the bubble |

## Layout & spacing
- A message is a row as wide as its host (a container): a bubble is at most `--prime-message-max-width` (30rem) and 85% of the row, so it follows the chat column down to the narrowest screen of the kit (foundation §9).
- Gap between runs `--prime-message-gap` (16), inside a run `--prime-message-group-gap` (8): a run reads as one block, the next author stands apart.
- **Growth in place:** a message that changes size grows from its anchored edge. A reaction row, an edit or an upload state grow it from its bottom: the bottom corner, the meta and the tail stay where they are; in a chat the list scrolls by the change in the same frame, so the rows below stay still, and the rows above glide up (or down) as one block on the message's clock. A transcript grows it from its top: the player stays and the rows below glide.
- Only text selects: every message is `user-select: none`, and the text-bearing parts (text and caption, author, forwarded-from, reply quote, file name, contact, place, link preview) opt back in. A double click reacts without selecting a word; a long press opens the bar and the menu, never the iOS callout.
- Bubble padding `--prime-message-padding-y` / `-x` (8 / 12), radius `--prime-message-radius` (14) on every corner; text `body-m`, wraps anywhere.
- **The tail** ends a run: the last bubble of one author (`single`, `last`) that is a bubble of fill — text, voice, file, contact, location, link preview, forwarded, a reply — squares its bottom corner on the author's side and a curl grows out of it (`--prime-message-tail-width` × `-height`, 8 × 16, the shape `--prime-message-tail-mask`), drawn in the bubble's own fill on its own surface depth, so it is seamless in both themes; it steps back with its bubble, sits outside the bubble's clip and rides its bottom edge when the size changes. A picture (with a caption or not), an album and a round video never have one. Every row reserves the tail's width on the author's side, so a run lines up.
- **The author's header** (a group chat, the first of a run): one line `body-s` — the name semibold in the author's hue, an `xs` icon, the tag muted after them; the name ellipsizes first, then the tag. The bubble hugs the whole line, so a long name or tag widens it up to its cap. Over a picture or a circle without a caption it stands on the media pill at `space-2` from the top-start corner, in the pill's colors.
- **A bubble hugs its text** (`bubbleHug`): a bubble of text — text, author, reply, forwarded, reactions — is as wide as its widest laid-out line plus the padding, never the width its lines wrapped in, and never wider than the cap; the meta's room counts on the last line only, where it sits, the reactions row as one line of chips with the meta after them, and the author's header at its full width (`data-message-fit="row"`, an ellipsized name counted whole). Quote and code blocks stretch to the bubble's width; long code lines wrap. Plain wrapping, never `pretty`. The width is measured once per text and row width — cleared, measured and written in one pass in the commit that changed the text, before paint, so a size change's morph runs to the hugged width — and cached by both: a row the window renders again takes its width with nothing measured. Row widths come from one shared `ResizeObserver`, batched per frame; hover, the menu, the reaction bar and selection never measure; a morph reads boxes only, never the hug width; fonts that finish loading measure once more. A bubble with any other part (a card, a player, a picture) keeps the width its parts give it.
- No minimum width beyond the corners: «Ок 10:16» is a compact pill — the text, the meta on the same line and the padding. With reactions the meta moves to the end of the row's last line and the text gives its room back.
- Fixed kinds stay one width: a file, a contact and a location are `--prime-message-card-width` (16rem, at most 75% of the chat), a voice message is the player's width, a round video is the VideoNote circle (268, at most the row), a sticker the square `--prime-message-sticker` (160, at most 85% of the row), a link preview the media width (360) or what the row allows.
- Embedded blocks (a link preview, a reply quote, a forwarded header, the cards) span the bubble's content width; long unbreakable text (URLs) wraps instead of widening the bubble.
- Pictures follow the album layout of their Gallery, at most `--prime-gallery-max-size` (360) wide and tall and within 85% of the row; a bubble with a picture or a card is exactly that part's width and a caption wraps under it.
- A file's name stands on one line without the extension its format tile shows; the full name is its tooltip and the download label. The tile downloads by an `href` link, or with `transfer="remote"` through `onDownload` in the app.
- `Message.Text` wraps anywhere; the meta stands at the end of its last line.
- Round controls (download, cancel, retry, play) are a Button `shape="circle"`: hover, press, focus ring and the touch area follow the circle. A file's action is its round tile (48): the transfer disk (`internal/transferDisk`, `xl`) with its ring, the retry or the download stand on it — never a separate button beside the name. Every transfer, either way (media, file, video note, voice), is that one disk.
- `Message.Typing` is the last row of a list; a chat puts it there itself (`Chat.Root typing`).
- **A bot's inline keyboard** (`Message.Actions`): each part is a row under the bubble, `--prime-space-1` below it and between rows and keys, on the chat's own surface (outside the bubble's fill). The keyboard is as wide as the message: the column takes the wider of the bubble and the keyboard (up to the bubble's cap) and the bubble widens to it, so their edges line up. A row is one line, as in Telegram: its keys share it equally (`flex: 1 1 0`, each key `fullWidth`), and a label longer than its share ellipsizes. Keys keep the control radius; the last row's outer bottom corners take the bubble's (`--prime-message-radius`), so the keyboard closes the message. A key is `Button.Root` `variant="soft" tone="neutral"` at the host tier unless it sets its own: Telegram's button `style` maps onto `tone` — `primary` → `accent`, `success`, `danger` (`variant="solid"` for a filled key). A custom emoji before the label is a `Button.Icon`. A link key (`asChild` around an element with `href`, or a router link's `to`) carries one mark (`xs`) at its top-end corner, out of the label's flow, chosen by where the address leads, as Telegram tells a url key from a web app key: `action.externalLink` when it leaves the product (another origin, or another scheme — `mailto:`, `tel:`, an app link — which opens another program), `action.openApp` when it opens a page of the product (a relative path, a hash, an absolute address on this origin; on the server, without `location`, every address that is not absolute). A callback key whose `onClick` returns a promise is `loading` until it settles: the spinner takes its leading icon's place or covers the label, the width never changes. A message with a keyboard has no tail: the keyboard closes it.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Shift+F10` · `ContextMenu` | Opens the menu of the focused message (`ContextMenu` is the menu key); in a chat's selection mode `Enter` / `Space` toggle it and Shift extends the range from the anchor |
| `R` | Opens the reaction bar (with `onReactionToggle`); arrows move between reactions, `Home` / `End` to the ends, `Enter` / `Space` pick, `Tab` closes it |
| `L` | Puts or takes back the quick reaction (as a double tap) |
| `Tab` | Moves to the buttons and links of a message: the reply quote, a file, the `Message.Actions` buttons in row order |
| `Escape` | Closes the menu, or the reaction bar unless `Message.Reactions closeOnEscape={false}` |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Every message is a `role="article"` named «{author}, {time}» (`labels.message`); an outgoing one is «Вы»; the author names every message of a run, its header shown or not. In a list it carries `aria-posinset` / `aria-setsize`; in a chat's selection mode it is an `option` with `aria-selected`.
- The delivery status is an image named «Отправляется», «Отправлено», «Прочитано» or «Не отправлено».
- A reply with `target` or `onClick` is a button; the hidden «Ответ на сообщение» explains it. Pressing it moves the focus to the original.
- `Message.Avatar` is `aria-hidden`: the message is named by its author.
- The author's header is text; the hue of the name means nothing on its own, `Message.AuthorIcon` is `aria-hidden` — say what it means in the `tag`.
- `Message.Typing` is a polite `status` with «Собеседник печатает» (`labels.typing`); its dots are decorative.
- Reactions are a group of buttons with `aria-pressed`; a chip is named «{emoji}: {count}», with `users` «{emoji} {count}: {users}» («❤️ 3: Анна, Пётр, Мария», «ещё N» when not everyone is listed); its avatars are `aria-hidden`; without `onReactionToggle` the chips are `disabled`. The reaction bar is a `toolbar` of toggle buttons named by the reaction («Нравится», «Огонь»…); its «⌄» is `aria-expanded`. The quick reaction is announced in the list's polite live region.
- `VideoNote` and `VoicePlayer` carry their own ARIA (see their pages); inside a message their transcript is a plain paragraph, selectable and marked by the chat's search.
- Media tiles are buttons «Открыть: {alt}» that open the album in MediaViewer, the focus returning to the tile on close; a transfer is the round cancel, retry or download button, the share its accessible description; a refused retry or cancel is announced politely; a done transfer's disk is `inert`.
- `Message.Actions` are plain buttons and links (`Button.Root`, `asChild`) with visible labels, in row order; the corner mark of a link key is decorative (`aria-hidden`), the link is named by its label; in a chat's selection mode they take no presses.
- Color is never the only signal: the status is named, the own reaction is `aria-pressed`, a selected message is `aria-selected` with a check, the author is text.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Message.Root

| Key | Default | Used for |
|---|---|---|
| `message` | `"{author}, {time}"` | The name of a message for assistive tech. |
| `you` | `"Вы"` | The author of an outgoing message. |
| `edited` | `"изменено"` | The mark of an edited message in its meta. |
| `spoiler` | `"Скрытый текст"` | `Message.Text`: the name of a `\|\|spoiler\|\|` while it is hidden. |
| `sending` | `"Отправляется"` | Name of the clock status. |
| `sent` | `"Отправлено"` | Name of the one-check status. |
| `read` | `"Прочитано"` | Name of the two-check status. |
| `failed` | `"Не отправлено"` | Name of the failed status. |
| `retry` | `"Повторить отправку"` | The retry button beside a failed message. |
| `select` | `"Выбрать"` | The menu item that starts selection mode with the message. |
| `reactionAdded` | `"Реакция {emoji} поставлена"` | Announced when the quick reaction (a double tap, `L`) is put. |
| `reactionRemoved` | `"Реакция {emoji} снята"` | Announced when the quick reaction is taken back. |
| `reactionBar` | `"Реакции"` | The name of the reaction bar. |
| `moreReactions` | `"Все реакции"` | The «⌄» of the reaction bar that shows every reaction. |

#### Message.Forwarded

| Key | Default | Used for |
|---|---|---|
| `forwarded` | `"Переслано от {author}"` | `Message.Forwarded`: the header; `{author}` — the original author. |

#### Message.Reply

| Key | Default | Used for |
|---|---|---|
| `reply` | `"Ответ на сообщение"` | `Message.Reply`: the hidden prefix read before the quote. |

#### Message.Media

| Key | Default | Used for |
|---|---|---|
| `open` | `"Открыть: {name}"` | `Message.Media`: the name of a tile that opens the viewer; `{name}` is `alt`, else `photo` / `video`. |
| `photo` | `"фото"` | `Message.Media`: `{name}` of a photo without `alt`. |
| `video` | `"видео"` | `Message.Media`: `{name}` of a video without `alt`. |
| `cancelUpload` | `"Отменить отправку"` | `Message.Media`: the cross while sending. |
| `cancelDownload` | `"Отменить загрузку"` | `Message.Media`: the cross while receiving. |
| `retryUpload` | `"Повторить отправку"` | `Message.Media`: the retry after a failed send. |
| `retryDownload` | `"Повторить загрузку"` | `Message.Media`: the retry after a failed receive. |
| `uploadProgress` | `"Отправка {percent}%"` | `Message.Media`: the share while sending — the description of the cross. |
| `downloadProgress` | `"Загрузка {percent}%"` | `Message.Media`: the share while receiving — the description of the cross. |
| `notSent` | `"Не отправилось"` | `Message.Media`: why a send failed — the retry's description. |
| `notReceived` | `"Не загрузилось"` | `Message.Media`: why a receive failed — the retry's description. |
| `download` | `"Скачать {name}"` | `Message.Media`: the download arrow of a `remote` tile; `{name}` is its `alt` or `photo` / `video`. |
| `cancelFailed` | `"Не удалось отменить"` | `Message.Media`: announced when `onCancel` rejected. |
| `retryFailed` | `"Не удалось повторить"` | `Message.Media`: announced when `onRetry` rejected. |
| `downloadFailed` | `"Не удалось скачать"` | `Message.Media`: announced when `onDownload` rejected. |

#### Message.File

| Key | Default | Used for |
|---|---|---|
| `transferred` | `"{done} из {total}"` | `Message.File`: the line under the name while it transfers. |
| `cancelUpload` | `"Отменить отправку"` | `Message.File`: the cross while sending. |
| `cancelDownload` | `"Отменить загрузку"` | `Message.File`: the cross while receiving. |
| `retryUpload` | `"Повторить отправку"` | `Message.File`: the retry after a failed send. |
| `retryDownload` | `"Повторить загрузку"` | `Message.File`: the retry after a failed receive. |
| `uploadProgress` | `"Отправка {percent}%"` | `Message.File`: the share while sending — the description of the cross. |
| `downloadProgress` | `"Загрузка {percent}%"` | `Message.File`: the share while receiving — the description of the cross. |
| `notSent` | `"Не отправилось"` | `Message.File`: why a send failed — the retry's description. |
| `notReceived` | `"Не загрузилось"` | `Message.File`: why a receive failed — the retry's description. |
| `download` | `"Скачать {name}"` | `Message.File`: the download arrow of a `remote` file and the `href` link; `{name}` is the file name. |
| `cancelFailed` | `"Не удалось отменить"` | `Message.File`: announced when `onCancel` rejected. |
| `retryFailed` | `"Не удалось повторить"` | `Message.File`: announced when `onRetry` rejected. |
| `downloadFailed` | `"Не удалось скачать"` | `Message.File`: announced when `onDownload` rejected. |

#### Message.Location

| Key | Default | Used for |
|---|---|---|
| `openMap` | `"Открыть на карте: {place}"` | `Message.Location`: the name of the map link. |
| `live` | `"Трансляция"` | `Message.Location`: the mark of a live location. |

#### Message.Reactions

| Key | Default | Used for |
|---|---|---|
| `reaction` | `"{emoji}: {count}"` | `Message.Reactions`: the name of a chip without `users`. |
| `reactionUsers` | `"{emoji} {count}: {users}"` | `Message.Reactions`: the name of a chip with `users`; `{users}` — their names. |
| `moreUsers` | `"ещё {count}"` | `Message.Reactions`: the last item of `{users}` when not everyone is listed. |
| `reactions` | `"Реакции"` | `Message.Reactions`: the name of the row. |

#### Message.Typing

| Key | Default | Used for |
|---|---|---|
| `typing` | `"Собеседник печатает"` | `Message.Typing`: the text read while the other side types. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A short exchange with a client: an incoming bubble and a run of two outgoing ones ending in the tail, the time and delivery ticks in the corner, a reply quote and a reaction you can toggle — `Message.Root`, `direction`, `position`, `time`, `status`, `Message.Text`, `Message.Reply`, `Message.Reactions`. |
| [structure.tsx](examples/structure.tsx) | Optional parts of a bubble in their order: the author, a forwarded header, a reply quote, the text and reactions — `Message.Author`, `Message.Forwarded`, `Message.Reply`, `Message.Reactions`. |
| [kinds.tsx](examples/kinds.tsx) | Every kind of message in its shell, both directions, single and in runs: text bubbles, pictures and circles as blocks, a caption bubble, voice, file, contact, place and link cards, reactions inside a bubble and under a picture — `Message.Media`, `VideoNote`, `Message.File`, `Message.Contact`, `Message.Location`, `Message.LinkPreview`, `VoicePlayer`. |
| [author.tsx](examples/author.tsx) | A group chat's run of one author: the first message opens with the name in the author's hue, a crown and the member's tag, the last one shows the avatar in the gutter; another author with initials only, a long name that ellipsizes before its tag, a header on a pill over a photo, and your own reply — `Message.Author`, `tag`, `Message.AuthorIcon`, `Message.Avatar`, `position`, `hueOf`. |
| [typing.tsx](examples/typing.tsx) | The typing signal: an incoming bubble of three dots that enters like a message and leaves closing its height; switch it, keep it mounted — `Message.Typing`, `open`. |
| [status.tsx](examples/status.tsx) | Delivery of outgoing messages: a clock while sending, one check when sent, two when read, and a failed one with a retry that resolves after a second; the time comes as a date and reads to the second — `status`, `onRetry`, `formatTime`. |
| [text-formatting.tsx](examples/text-formatting.tsx) | The Markdown the Composer writes, rendered safely: bold, italic, strike, code, a code block, links and a quote; long words and URLs wrap; a pasted error log stays as typed, its stars and underscores kept — `Message.Text`, `edited`, `plain`. |
| [reactions.tsx](examples/reactions.tsx) | Reactions under a message: each chip shows who reacted — up to three avatars, from four on two and «+N» — and a press on a chip, or a double tap on the message, puts or takes back your own at once while the request runs behind it — `Message.Reactions`, `users`, `onReactionToggle`. |
| [context-menu.tsx](examples/context-menu.tsx) | Long press: the reaction bar above the message and its menu below — a right click opens the menu, a long hover only the bar, `R` and Shift+F10 from the keyboard — `Message.Menu`, `onReactionToggle`. |
| [media.tsx](examples/media.tsx) | Captions under a photo, a tall portrait, an album and a video, each as wide as its media; an album with a video laid out as tiles, an outgoing album with neutral gaps and a photo still uploading with its ring and cancel; a tile opens the album in the viewer — `Message.Media`, `items`, `onCancel`. |
| [media-open.tsx](examples/media-open.tsx) | The album's viewer owned by the screen: a button opens the acceptance photos at the damaged pallet, and the page the viewer shows is kept for the next open — `Message.Media`, `open`, `onOpenChange`, `index`, `onIndexChange`. |
| [voice.tsx](examples/voice.tsx) | Voice messages on their bubbles: the player keeps room for the time in the corner; a new one carries the unplayed dot until it is played — `VoicePlayer`, `unplayed`. |
| [file.tsx](examples/file.tsx) | Documents in a chat: a download link, a file with a picture, a large file fetched from its tile, an upload in flight with its share and cancel, and a failed one with a retry whose size reads in whole kilobytes — `Message.File`, `href`, `preview`, `transfer`, `transferProgress`, `transferDirection`, `onDownload`, `formatSize`. |
| [location.tsx](examples/location.tsx) | A place on a map picture from your map service with a pin, the place and its address, and a live location of a courier on its way — `Message.Location`, `href`, `live`. |
| [contact.tsx](examples/contact.tsx) | A shared contact: initials or a photo, name and phone, with the actions to write or save — `Message.Contact`, `phone`. |
| [link-preview.tsx](examples/link-preview.tsx) | A message with a link and the card of the page under it: site, title, description and picture — `Message.LinkPreview`, `site`, `image`. |
| [bot-actions.tsx](examples/bot-actions.tsx) | A bot's message with an inline keyboard: one-line rows whose keys share the row equally, a coloured key with an icon that loads while its promise runs, links marked by where they lead: a page of the product or another site — `Message.Actions`, `tone`, `Button.Icon`, `asChild`. |
| [sticker.tsx](examples/sticker.tsx) | Stickers in a conversation: a picture by its address and a video sticker in your own player, no bubble, the time on a pill over the corner — `Message.Sticker`, `src`, `loading`. |
| [preview.tsx](examples/preview.tsx) | A bot's welcome message as its settings page shows it: the same bubble with its keyboard, nothing in it pressed or opened, the time in the zone of the profile — `preview`, `timeZone`. |
| [narrow.tsx](examples/narrow.tsx) | At phone width bubbles take up to 85% of the chat, long words and links wrap inside, an album keeps its rows — `Message.Root`, `Message.Media`. |

## Mistakes
- A bubble drawn in your CSS (a rounded div with a fill) → `Message.Root`; every content kind sits in its shell — a bubble, or a rounded block for a picture without a caption and a circle for a video message.
- Drawing your own tail or smaller joined corners → pass `position` (`Chat.Messages items` sets it): the last bubble of a run gets the kit's tail, every other corner keeps one radius.
- `Message.Author` or `Message.Avatar` shown or hidden by hand per message → put both on every message of a group chat: the message shows the header on the first of a run and the avatar on the last; a direct chat shows neither.
- An author's role written into the name («Олег (админ)») → `tag`; a crown or a badge drawn next to the name → `Message.AuthorIcon`.
- Colors of authors picked at random on every render → `hueOf(user.id)`: one hue per person, stable everywhere.
- Rendering message HTML (`dangerouslySetInnerHTML`) → pass the string to `Message.Text`; its Markdown subset renders as elements.
- A status that flips without a transition, or a custom ✓ glyph → `status`.
- Waiting for the server before showing a reaction → return the promise from `onReactionToggle`: the chip shows the new state at once and drops it back on a rejection.
- Avatars of reactors drawn next to the chip, or a count where names are known → pass `users` (in the order they reacted) and `Chat.Messages reader`.
- A reaction picker of your own (a popover of emoji) → the reaction bar opens itself on a long press, a long hover and `R`; configure it with `Chat.Messages reactionOptions`.
- A media grid of your own for an album → `Message.Media items` (a `Gallery`) lays out 2–10 tiles from their ratios.
- Media items without `width` / `height` → each tile falls back to 4 : 3; pass the natural size so the box is final before load.
- A rounded wrapper or a backing of your own around `Message.Media` → the message shell rounds and clips it.
- Measuring a bubble or animating its height yourself → the bubble fits its content in CSS and the kit owns every size change of a message.
- A context menu on a hover-only «…» button → `Message.Menu`: right click, long press and the keyboard open it.
- «печатает…» as a text row you add and remove → `<Message.Typing open={typing} />` kept mounted, or `Chat.Root typing`.
- Pausing other players by hand → one sound at a time is built into `VoicePlayer`, `VideoNote` and chat videos.
- A transcript as a separate `Message.Text`, or a height animation of your own around it → `transcript` / `onTranscribe` on `VoicePlayer` and `VideoNote`: the text opens inside the same message, in one stroke with its height.
- A list, dates, search or selection built around messages → [Chat](../chat/COMPONENT.md).
- A bot's buttons placed inside `Message.Text`, or a row of buttons of your own under a message → `Message.Actions` with `Button.Root` children: one row per part, at the message's width.
- An arrow icon of your own in a link key (`Button.Icon` with `action.externalLink`) → leave the label alone: `Message.Actions` draws the key's one corner mark itself, ↗ for another site and a window for a page of the product; a second arrow doubles it.

## Related
- **Built from:** [Dropdown](../dropdown/COMPONENT.md) (`Message.Menu`), [ScrollContainer](../scroll-container/COMPONENT.md) (the floating panel of the reaction bar), [Gallery](../gallery/COMPONENT.md) (`Message.Media`), [Avatar](../avatar/COMPONENT.md) (`Avatar.Group` + `Avatar.Overflow` in reaction chips), [Badge](../badge/COMPONENT.md) (the «Трансляция» mark of a live location), [Thumbnail](../thumbnail/COMPONENT.md) (the map, the link preview picture, a file's preview), [Button](../button/COMPONENT.md) (retry, the transfer disk, `shape="circle"`, the buttons of `Message.Actions`), [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator` in selection mode), [Spinner](../spinner/COMPONENT.md) (pending transfers and transcripts), [Skeleton](../skeleton/COMPONENT.md) (a sticker while it loads), Icon (status ticks, file glyphs, `action.forward`, `action.refresh`, `action.externalLink` and `action.openApp` — the marks of a link key); `internal/messagePart` (the contract of content parts), `internal/messageList` (the contract with a chat's list), `internal/palette` (`hueOf`), `internal/Disclosure` (the reactions row, transcripts), `bubbleMorph` (every size change as one stroke), `bubbleHug` (a bubble of text as wide as its widest line), `internal/transferDisk` (the transfer of a file), `internal/mediaPill` (the meta, the author's pill), `internal/HighlightMatch` (search marks), `internal/richText` (Markdown), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Chat](../chat/COMPONENT.md) — the conversation the messages stand in; [Gallery](../gallery/COMPONENT.md) — the album of `Message.Media`; [VideoNote](../video-note/COMPONENT.md) — the round video message; [VoicePlayer](../voice-player/COMPONENT.md) — the content of a voice message; [Composer](../composer/COMPONENT.md) — the input under the list; [RichText](../rich-text/COMPONENT.md) — the text of `Message.Text` outside a message; [Timeline](../timeline/COMPONENT.md)
