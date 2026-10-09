# Message

**Category:** messages
**Kind:** composite

> One chat message in its shell: a speech bubble, a picture or a circle, incoming or outgoing, the tail that ends a run, the time and delivery ticks in the corner, reactions, the menu, a group chat's author header, and every content kind of a messenger.

## When to use
- A message of any kind: text with formatting, a reply, a forwarded message, reactions, photos and albums (`Message.Media`, a `Gallery`), a round video message (`VideoNote` inside), a voice message (`VoicePlayer` inside), a file, a location, a contact, a link preview.
- The rows of a conversation in [Chat](../chat/COMPONENT.md) (`Chat.Messages`): the list, dates, search, selection and jumps live there; the message is one row.
- A message on its own: a quoted reply in a ticket, the last message in a card, a preview of what will be sent.
- «Печатает…» (`Message.Typing`) as the last row of a list.

## When not to use
- A whole conversation (a header, the list, search, the Composer) → [Chat](../chat/COMPONENT.md); a list of messages without the rest is `Chat.Root` with `Chat.Messages`.
- Dates, events of the chat and the unread band between messages → `Chat.Separator`, `Chat.Service`, `Chat.Unread`.
- A feed of events with a time axis (an order history, an audit log) → [Timeline](../timeline/COMPONENT.md).
- One system message on a page (saved, failed) → [Banner](../banner/COMPONENT.md) or a [Notification](../notification/COMPONENT.md).
- Photos outside a message → [Gallery](../gallery/COMPONENT.md); a recording outside a chat → [VoicePlayer](../voice-player/COMPONENT.md).

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
│  │                              Message.Location · Message.Contact · Message.LinkPreview · VideoNote
│  │                              (a voice message or a circle may open its transcript under it)
│  ├─ Message.Reactions           a row held closed in every message; chips closing a bubble
│  │                              (under a picture or a circle), the meta's spacer at its end
│  └─ meta                        «изменено» · time · ticks, in the bottom-end corner (a dark pill
│                                 over a picture or a circle)
├─ Message.Menu                   Dropdown.Content opened at the pointer (+ «Выбрать» in a chat with a selection)
└─ [reaction bar]                 floating toolbar above the bubble: long press, long hover, `R`

Message.Typing                    «печатает…»: an incoming bubble of three dots, the last row of a list
```
The part that ends a bubble closes its last line with the meta's spacer — an invisible copy of the meta that floats to the line's end — so the time sits on that line when it fits and on a line of its own when it does not; a picture or a circle carries the meta on a dark pill (`internal/mediaPill`). Every content part declares its kind once (`defineMessagePart` in `internal/messagePart`: its shell, how the meta stands with it, whether it is a picture, reaches the edges or sets the width, its off-screen estimate and the text a chat's search looks in), so the message decides the shell, the tail and the meta from what it holds, fragments opened. Nothing in a message is measured in JS but the hug of a bubble of text (see Layout). The reaction bar is mounted only from its open to the end of its exit, one on the page at a time; the menu mounts on its first open.

In a list (`Chat.Messages`) a message reads the list through `internal/messageList`: its place in a run (`position`) and the chat's kind decide the author's header (first of a run in a group chat) and the avatar (last of a run); the list registers it for new-message entry and read receipts, selects it, jumps to it and holds its size changes still. On its own a message given an author or an avatar does the same by its `position`: the header on `single` / `first`, the avatar (and the gutter) on `single` / `last`.

Content parts in short: `Message.Media` — a [Gallery](../gallery/COMPONENT.md) the message shapes (the messenger album layout from the items' ratios, every box final before load, the shared transfer disk over a tile, the meta overlay; an album's gaps stand on the incoming surface in both directions). `VideoNote` and `VoicePlayer` are components of their own that declare themselves parts (the round shell, and a fill bubble) and carry the same transfer props as `Message.File`. `Message.File` — a round format tile (or the preview) that is also its one action (download, cancel inside the progress ring, retry), the name, and the size line under it ending with the spacer. `Message.Location` — the map edge to edge with an accent pin (breathing when `live`), the place and the address ending with the spacer.

`formatMessageTime(date)` gives «09:05», the default `formatTime`. `hueOf(id)` gives a palette hue stable per id for `Message.Author color` and the author's `Avatar`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Message.Root
`ref` → `HTMLElement` (`<article>`). One message: a `role="article"` row (an `option` in selection mode) with its parts in the shell its content parts declare — `bubble` (fill, padding: text, voice, file, contact, location, link preview, a picture with a caption), `media` (a picture or an album alone: the shape itself, clipped to the radius, no backing, the meta on a dark pill over it, reactions under it), `round` (`VideoNote`: no backing, the meta on its pill, reactions under it); fragments are opened and empty children ignored. The last bubble of a run of one author (`position` `single` or `last`) curls a tail out of its square bottom corner on the author's side when it is a bubble of fill (never a picture, with a caption or not, or a circle); every other corner keeps one radius. The bubble fits its content (up to the cap; a picture or a card sets its width and a caption wraps under it; a bubble of text hugs its widest laid-out line, measured once per text and row width and cached), the meta stands in the bottom-end corner over a spacer that ends the last line and drops to a line of its own only when that line is full. Every message holds a closed reactions row: the first reaction opens it and grows the message upward — its bottom corner, the meta and the tail stay, the meta moving onto the row's last line while the text gives its room back (a card keeps it, so nothing inside the card moves), the rows above gliding up as one block; the last one taken back closes it the same way. Every size change of a message (reactions, a transcript, an edit, an upload state) is laid out at once and played as one stroke: the bubble's box glides from the old size to the new one, width and height together, and its parts glide, fade in or fade out on the same clock (`--prime-message-morph-duration`); reduced motion makes it instant. Parts go in the order you write them; `Message.Author` heads the bubble (on a pill over a picture or a circle), `Message.Avatar` goes to the gutter, `Message.Menu` to the menu. In a group chat (`Chat.Messages type="group"`) the message shows the author's header only on the first of a run and the avatar only on the last; in a direct chat neither; on its own a message with an author or an avatar does the same by its `position`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `"incoming" \| "outgoing"` | `"incoming"` | `incoming` — on the start side, a surface one step off the chat; `outgoing` — on the end side, in the accent hue (`--prime-color-message-outgoing-*`), everything inside recolors with it. |
| `position` | `"single" \| "first" \| "middle" \| "last"` | `"single"` | The place in a run of one author's messages (`Chat.Messages items` sets it, `groupMessages` gives it): sets the small gap inside a run; `single` and `last` end a run — a bubble of fill there gets the tail, and in a group chat the avatar; `single` and `first` start one and show the author's header. |
| `time` | `Date \| string` | — | When it was sent: a `Date` shown with `formatTime` (and put in `<time dateTime>`), or the text to show. |
| `formatTime` | `(date: Date) => string` | `«09:05»` | Display of a `Date` time. |
| `edited` | `boolean` | `false` | The text was edited: `labels.edited` before the time. |
| `status` | `"sending" \| "sent" \| "read" \| "failed"` | — | Delivery of an outgoing message: a clock, one check, two checks (accent), or a danger mark; the glyphs cross-fade from one state to the next. Named for assistive tech by `labels`. |
| `onRetry` | `() => void \| Promise<void>` | — | Sends a failed message again: a ghost danger button beside the bubble. A returned promise shows `sending` until it settles; a rejection leaves it failed. |
| `onReactionToggle` | `(emoji: string) => void \| Promise<unknown>` | — | The reader puts or takes back a reaction: a chip of `Message.Reactions`, a double tap (the chat's `quickReaction`), `L`, or the reaction bar (long press, long hover, `R`). The chip shows the new state at once; a returned promise keeps it (`aria-busy`) until it settles — update the reactions before it resolves; a rejection drops it back. Without it reactions are read-only and there is no bar. |
| `value` | `string` | — | The id of the message: selection (`Chat.Root selected`), `onNewMessage`, `onRead`, `current`, search, `Chat.Pinned`, `Message.Reply target` (`Chat.Messages items` sets it to the item's key). Keep it when the server confirms a sent message. |
| `labels` | `Partial<MessageLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "role">` | — | `id`, `aria-label` to replace «{author}, {time}», `className` and the other attributes of the row. |

### Message.Avatar
`ref` → `HTMLDivElement`. The author's picture in the gutter beside an incoming bubble of a group chat, aligned to its bottom; holds an `Avatar` (`m`). Put it on every message: the message shows it on the last of a run and keeps the gutter empty on the others. Decorative: the message is named by its author.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (an `Avatar.Root`), `className`. |

### Message.Author
`ref` → `HTMLDivElement`. The author's header at the top of the first bubble of a run in a group chat: the name semibold in the author's hue, an optional `Message.AuthorIcon` after it and the `tag` muted after them — one line, the name ellipsizing first, then the tag. The bubble hugs the whole line, so a long name or tag widens it up to its cap. Over a picture or a circle without a caption the header stands on a pill at its top-start corner. Plain text here also names the message; the hue never carries meaning on its own.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `hueOf(name)` | The author's hue: one per person in a chat. By default a hue stable per name; pass `hueOf(user.id)` to keep it per person. |
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
| `target` | `string` | — | The `value` of the quoted message: a press brings the chat to it (rendering it first in a window), the other messages blink back around it, and the focus moves to it. Makes the quote a button. |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | A press on the quote, after `target` is shown: load the original when it is not in the list yet. Makes the quote a button. |
| `labels` | `Partial<MessageReplyLabels>` | — | `reply` — the hidden prefix read before the quote. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "color" \| "onClick">` | — | `children` (the quoted text, one line), `className`. |

### Message.Text
`ref` → `HTMLDivElement`. The text: a string renders the Markdown subset the Composer writes (**bold**, _italic_, ~~strike~~, `code`, fenced code, Markdown links, bare URLs, `> ` quotes) as elements, never as HTML; links take only http(s), mailto and tel and open in a new tab. Wraps anywhere; the meta stands at the end of its last line. Marks the matches of the chat's search (`Chat.Search`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `plain` | `boolean` | `false` | Render a string as is, without its Markdown. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the text), `className`. |

### Message.Media
`ref` → `HTMLDivElement`. A photo, a video or an album of up to 10 in a message: a `Gallery` the message shapes, with every prop of the gallery. Alone in a message it is the shell itself — rounded by the message, no backing, the meta on a dark pill over it (and a group chat's author header on a pill at the top); with a caption (`Message.Text` after it) it sits edge to edge at the top of the bubble. Its cap is the chat's media cap (`--prime-message-media-max-height`) within 85% of the row. The gaps of an album show the neutral surface of an incoming message in both directions.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `GalleryItem[]` | — (required) | `{ type?: "image" \| "video", src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }` — `width` / `height` give the ratio (default 4 : 3) that lays the album out and reserves every box before load; `duration` is a video's length before its metadata; `transfer`, `transferProgress` and `transferDirection` are the transfer of the tile, the same shape as every transferring part (`transfer={item.status}`, `transferProgress={item.progress}` of a `useUploadQueue` item; a share left out in flight turns an indeterminate arc; the direction changes only the words). Items after the 10th are not shown. |
| `viewer` | `boolean` | `true` | The album opens in the kit's `MediaViewer`: a tile (a press or Enter) opens it at that item with the whole album as its set — arrows and swipes page, a video plays inside, pictures zoom, Escape closes — growing out of the tile and closing back into it, the focus returning to the tile. `false` — no viewer of the kit: open your own from `onOpenChange` and `onIndexChange`. |
| `open` | `boolean` | — | The viewer is open (controlled). |
| `defaultOpen` | `boolean` | `false` | Initially open (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | — | A tile opened the viewer (`true`), or the viewer closed (`false`). |
| `index` | `number` | — | The item the viewer shows (controlled); a tile sets it to its own. |
| `defaultIndex` | `number` | `0` | The item shown first (uncontrolled). |
| `onIndexChange` | `(index: number) => void` | — | A tile was activated, or the viewer turned its page: the item now shown. |
| `onCancel` | `(index: number) => void \| Promise<void>` | — | Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`. |
| `onRetry` | `(index: number) => void \| Promise<void>` | — | Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection). |
| `onDownload` | `(index: number) => void \| Promise<void>` | — | Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection). |
| `labels` | `Partial<GalleryLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.File
`ref` → `HTMLDivElement`. A document: a round tile with the format (from the name's extension, in its hue) or the file's picture, the name on one line (without the extension the format tile shows; the full name stays in the tooltip and the download label) and the size. The tile is the file's one action, in one spot: download (with `href`, a link; or `transfer="remote"` with `onDownload`, fetched in the app), cancel while it transfers, retry after a failure. A transfer either way is the shared transfer disk (`xl`) over the tile — the cross on the media shade with the progress ring along its edge, always shown, and «{done} из {total}» under the name; a failure turns it into the danger retry with the reason under the name. The name and the size line never move.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — (required) | The file name with its extension (the format tile reads it). |
| `fileSize` | `number` | — | Bytes, shown as «1,2 МБ». |
| `formatSize` | `(bytes: number) => string` | `Russian digits, Б · КБ · МБ · ГБ` | Display of `fileSize`. |
| `href` | `string` | — | Where to get it: the tile becomes the download link «Скачать {name}». |
| `preview` | `string` | — | A picture of the file (an image, the first page) in the tile in place of the format. |
| `transfer` | `"remote" \| "queued" \| "loading" \| "failed" \| "done"` | — | The transfer of the file — the transfer disk (`xl`) over its tile, the transferred share under the name, either way (`TransferState`, the values of `UploadItem.status` plus `remote`): `queued` / `loading` — the cross, a circle Button whose `progress` ring shows `transferProgress` (described by the share); `failed` — the danger disk with the retry arrow; `remote` — not fetched yet, the download arrow; `done` — the ring fills, then the disk fades and shrinks away (`fast`). |
| `transferProgress` | `number` | — | Share transferred, 0…1 (`UploadItem.progress`): the ring along the disk's inner edge, gliding (`base`) while it turns. Without it a transfer in flight turns a quarter arc. |
| `transferDirection` | `"upload" \| "download"` | `"upload"` | Which way it goes: sending (`upload`) or receiving (`download`). Changes only the words — the names of the cross and the retry, the share and the failure — never the look. |
| `onCancel` | `() => void \| Promise<void>` | — | Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`. |
| `onRetry` | `() => void \| Promise<void>` | — | Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection). |
| `onDownload` | `() => void \| Promise<void>` | — | Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection). |
| `labels` | `Partial<MessageFileLabels>` | — | System strings, see Labels. |
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
| `labels` | `Partial<MessageLocationLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Contact
`ref` → `HTMLDivElement`. A shared contact in one card width: an `Avatar` (`l`, photo or initials), the name and the phone; `children` are the actions in a row under them.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — (required) | The person. |
| `phone` | `string` | — | The phone, as written. |
| `src` | `string` | — | The person's photo; without it the initials. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | Hue of the initials. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "color">` | — | `children` — `Button.Root` actions («Написать», «Добавить»); `className`. |

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

### Message.Reactions
`ref` → `HTMLDivElement`. Reactions at the bottom of a bubble, under a picture or a circle: a `role="group"` of chips (`aria-pressed`) — the emoji, then the avatars of who reacted (`users`: up to 3; from 4 on, 2 and a «+N» circle) or the rolling count. Not the reader's: a neutral wash; the reader's own: the accent. A press goes to `Message.Root onReactionToggle` and shows at once, the reader (`Chat.Messages reader`) joining the stack. Every message holds the row closed; the first reaction opens it in place and the last one closes it, as the message's one stroke, while the rows below stay still and the rows above glide as one block. A reaction new on the message takes its room at once and fades and scales in from 0.9 where it stands as the bubble glides; a chip taken away fades out where it stood while the chips after it glide into its place; a count change rolls its digits only; nothing animates on mount. In a bubble the meta stands at the end of the row's last line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MessageReaction[]` | — (required) | `{ emoji, count, selected?, users? }` — `count` is the total, `selected` the reader's own reaction, `users` (`{ id, name, src?, color? }[]`, in the order they put it) who put it; without `users` the chip shows the count. |
| `labels` | `Partial<MessageReactionsLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Menu
`ref` → `HTMLDivElement`. The context menu (a `Dropdown.Content`): `Dropdown.Item`s you write — Ответить, Скопировать, Закрепить, Переслать, Пожаловаться, Удалить (`tone="danger"`); the kit adds a separator and «Выбрать» when the chat has a selection (`Chat.Root selected`). It opens where the pointer is on right click, with the reaction bar on a long press, under the bubble from the keyboard (Enter, Shift+F10, the menu key); a bottom sheet on phones.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier of the menu. |
| `…rest` | `Omit<DropdownContentProps, "side" \| "align" \| "matchTriggerWidth">` | — | `children` (the items), `className`. |

### Message.Typing
`ref` → `HTMLDivElement` (`role="status"`). «Печатает…»: an incoming bubble of three dots that rise and fade in turn (the loading loop: reduced motion slows it), at the end of the list while the other side types (`Chat.Root typing` puts it there for you). Enters like an incoming message; leaves fading and closing its height. Its hidden text is read politely.

| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `true` | The other side is typing. Keep the part mounted and switch this, so it can leave smoothly. |
| `children` | `ReactNode` | — | `Message.Avatar` of who types, in a group chat (`Chat.Messages type="group"`). |
| `labels` | `Partial<MessageTypingLabels>` | — | `typing` — the text read for assistive tech. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

## Variants

### shell
Decided by the content parts, not a prop (`data-shell` on the bubble): a circle makes `round`, a picture or an album alone makes `media`, anything else a `bubble`.

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `bubble` | fill (surface or accent), padding, the meta in the bottom-end corner over the last line's reserve | text, voice, file, contact, location, link preview, a picture **with** a caption | yes |
| `media` | the picture itself, clipped to the radius — no backing, no padding; the meta on a dark pill over its bottom-end corner; reactions in a row of their own **under** it, on the message's side (chips in their own fill); an album's gaps show the incoming surface in both directions, never the outgoing fill | a photo, a video or an album **without** a caption | |
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
| `Message.Location live` | a breathing pin and a «Трансляция» badge |
| `Message.Text plain` | a string without Markdown |
| `Message.Typing active` | the typing bubble shows; off, it leaves closing its height |

The list-level settings a message reads — the group chat's author header and avatar gutter (`type`), the quick reaction, the reaction bar's options, the reader — are props of `Chat.Messages`.

## States
| State | Driven by | DOM |
|---|---|---|
| author header | `Message.Author` in a group chat (`Chat.Messages type="group"`) on `single` / `first`; any message on its own | the header line at the top of the bubble; over a picture or a circle on the media pill at the top-start corner; hidden on `middle` / `last` and in a direct chat (the author still names the message) |
| avatar | `Message.Avatar` in a group chat on `single` / `last` | the avatar in the gutter at the bubble's bottom; the gutter stays empty on the others |
| new at the end | the chat's list decided it (`data-enter="incoming"` / `"outgoing"`) | the message column floats up `--prime-space-3` from below and fades in (`fast`, enter easing, `transform` + `opacity` only; the row box clips it); never on a first render, history or a status change. See Chat |
| pointed at / stepping back | the chat's jump, search or selection (`data-pointed`, `data-selected` on the message; `data-pointing`, `data-selecting` on the list) | nothing is drawn on the message: it stays at full strength while the others — the bubble, picture or circle with its tail and reactions, the avatar, the retry — step back to `--prime-message-dim-opacity` with a slight desaturation (selection: `fast`, both ways; a jump: three blinks, `base` each; the current search match: while it is current). Reduced motion: no blink |
| search match | the chat's search query | every case-insensitive match in `Message.Text` and the transcripts under a soft accent wash (`<mark>`) |
| typing | `Message.Typing active` | an incoming bubble of three dots rising and fading in turn on the loading loop; enters floating up while its height opens (`fast`), leaves closing its height (`fast`) — or at once when a reply arrives at the end of the list in the same update; its block axis clips, so a closed row leaves nothing under the list |
| status change | `status` | the ticks cross-fade and scale (`base`, `emphasized`), interruptible |
| retrying | `onRetry` returns a promise | `sending` ticks and a `loading` retry button until it settles |
| failed | `status="failed"` | `data-failed` on the row; danger mark, retry button |
| reaction toggled | a chip, a double tap, `L`, the reaction bar | the chip changes in place (never remounts) in the same frame: the fill is a color transition (`fast`); a reactor who joins fades and scales in from 0.9 while the stack widens (its width follows its circles), one who leaves the reverse; a count that only changes value rolls its digits and the chip does not move — its width follows the number of digits (tabular) and moves (`fast`) only when that changes; while a returned promise runs `aria-busy`, `data-pending`; a rejection drops it back |
| size change | a reaction row that opens or closes, a chip that comes or goes, a transcript, an edit, an upload state | one stroke (`bubbleMorph`, `--prime-message-morph-duration` 300 ms, emphasized easing): the new layout is laid out at once, in the same frame, and the bubble's visible box glides from the old rectangle to the new one — width and height together, one `clip-path: inset(… round …)` animation on the compositor, the fill a layer under the content that reaches over both boxes. Every part that moved (the text, the meta, the cards, the chips, the tail, the retry) glides from where it was by a `transform` on the same clock; a part that came fades (a chip also scales from 0.9) in where it stands once the box has room for it; a part that went fades out where it stood, out of flow. A change mid-flight retargets from what is on screen; a commit that moves nothing touches nothing. The meta and the tail stay put on a reaction: the message grows upward, the chat scrolling by the change in the same frame while the rows above glide as one block on the same clock (the rows below never move). A disclosed block (a transcript) fades over the whole stroke while the box opens or closes over it. The text glides straight with the bubble's top-start corner, keeping its padding all the way. Nothing travels across text: a meta that stays while text passes through its place dips — it fades out at the same spot before the text reaches it and back once the text has left — and a meta that changes line (a transcript's last line ↔ the player row) cross-fades — out at its old place in the first 40 % of the stroke, in at its new place in the last 40 %. Easing `standard`. Reduced motion: instant (the scroll still keeps the view) |
| new reaction | an emoji not on the message yet (the reader's or anyone's) | part of the size change: its room is there at once and the chip fades and scales in from 0.9 where it stands, on the bubble's clock, once the parts moving away have left its place. Never on the first render of a message: opening a chat or loading history plays nothing |
| reaction removed | the last of an emoji taken back | part of the size change: the chip fades out where it stood (`data-morph-ghost`, out of flow) while the chips after it and the bubble glide into place — one stroke |
| own reaction | `selected` in `reactions` | `aria-pressed`, `data-selected`: accent fill |
| reaction bar | long press (with the menu), long hover ~500 ms (pointer devices, the bar alone, a 300 ms grace to reach it), `R` | a floating toolbar above the bubble; it grows from the bubble, the emoji pop in a quarter-stagger apart, «⌄» glides the rest open, the hovered emoji lifts; the picked one pops while the bar leaves — the open played back on the same `base` clock, back to the bubble's corner, nothing reflows; mounted from its open until its exit ends, one on the page at a time |
| round video | `VideoNote` in the message | the round shell: no backing, the meta on its pill at the circle's bottom-end corner, reactions under it; the circle's own states are VideoNote's (a still first frame at rest, nothing plays before a press) |
| transcript | `transcript` / `onTranscribe` on `VoicePlayer` or `VideoNote`, `transcriptExpanded` | the same soft `xs` button at the player's top end (the end of the waveform; the top-end corner of the circle's box) opens the text: the text block is laid out at once under the player and the bubble glides open (the size change), the text fading in as the box reaches it and the meta moving to the end of its last line; under a circle the text stands in a block of the message's fill. Closing is the mirror image: the box closes over the text while it fades over the whole stroke, like a disclosure. The player row never moves; the rows after the message glide by the same height on the same clock while the view holds still. While `onTranscribe` is pending only the button spins and the area stays closed, then it opens with the text; a rejection closes the area and announces `transcribeFailed`. The open state and the text outlive the row leaving the window |
| transferring media / file, sent or received (one look both ways) | `transfer`, `transferProgress`, `transferDirection` (of an item for media) | media: the picture dims under the shared transfer disk in the middle — a 40px disk on the media shade (backdrop blur) with a white ×, the progress drawn as a ring along its inner edge (the disk is a Button `shape="circle"` `variant="shade"`; the ring is its `progress` ring — the kit ring at the line weight, 2px, a 32% white track, a white arc from 12 o'clock gliding `base`, always turning; the button is `aria-busy` and described by «Отправка {percent}%» / «Загрузка {percent}%» by the direction), the play mark of a video gives way; pressing the disk cancels; done — the ring fills, then the disk fades and shrinks to 0.9 (`fast`), the picture returns to full; failed — the disk turns danger with a retry arrow («Повторить отправку» / «Повторить загрузку», described by «Не отправилось» / «Не загрузилось»); `remote` — the download arrow on the same disk, no ring (`onDownload`). A file: the same disk at the tile's size (`xl`, 48px) covers its round tile, always shown — the ring along its edge, the × on the media shade; failed — the danger retry and the reason under the name; done — it fades away and the face (or the download link) is back. Voice and video messages draw the same transfer on their own play disk (VoicePlayer, VideoNote). Every one is the same disk (`internal/transferDisk`): one ring proportion, track, start, motion and cancel / retry / download. The size line shows «{done} из {total}». The name and the size line never move |
| transfer pending | `onCancel` / `onRetry` returned a promise | a `Spinner` in the disk's glyph place, `aria-busy`, no second press; a rejection leaves the transfer as it was and announces `cancelFailed` / `retryFailed` |
| selection mode | the chat's `selected` (not `null`) | an `option` with `aria-selected`; a check (`Checkbox.Indicator`, circle) at the row start; a press anywhere on the row toggles it — the parts inside take no presses meanwhile; `data-selecting`, `data-selected` on the article |
| menu open | right click, long press, Enter / Shift+F10 / the menu key | the menu at the pointer (below the bubble from the keyboard); a bottom sheet below 640px |
| focused | keyboard | the focus ring around the bubble |

## Layout & spacing
- A message is a row as wide as its host (a container): a bubble is at most `--prime-message-max-width` (30rem) and 85% of the row, so it follows the chat column from 320px up.
- Gap between runs `--prime-message-gap` (16), inside a run `--prime-message-group-gap` (8): a run reads as one block, the next author stands apart.
- **Growth in place:** a message that changes size grows from its anchored edge. A reaction row, an edit or an upload state grow it from its bottom: the bottom corner, the meta and the tail stay where they are; in a chat the list scrolls by the change in the same frame, so the rows below stay still, and the rows above glide up (or down) as one block on the message's clock. A transcript grows it from its top: the player stays and the rows below glide.
- Only text selects: every message is `user-select: none`, and the text-bearing parts (text and caption, author, forwarded-from, reply quote, file name, contact, place, link preview) opt back in. A double click reacts without selecting a word; a long press opens the bar and the menu, never the iOS callout.
- Bubble padding `--prime-message-padding-y` / `-x` (8 / 12), radius `--prime-message-radius` (14) on every corner; text `body-m`, wraps anywhere.
- **The tail** ends a run: the last bubble of one author (`single`, `last`) that is a bubble of fill — text, voice, file, contact, location, link preview, forwarded, a reply — squares its bottom corner on the author's side and a curl grows out of it (`--prime-message-tail-width` × `-height`, 8 × 16, the shape `--prime-message-tail-mask`), drawn in the bubble's own fill on its own surface depth, so it is seamless in both themes; it steps back with its bubble, sits outside the bubble's clip and rides its bottom edge when the size changes. A picture (with a caption or not), an album and a round video never have one. Every row reserves the tail's width on the author's side, so a run lines up.
- **The author's header** (a group chat, the first of a run): one line `body-s` — the name semibold in the author's hue, an `xs` icon, the tag muted after them; the name ellipsizes first, then the tag. The bubble hugs the whole line, so a long name or tag widens it up to its cap. Over a picture or a circle without a caption it stands on the media pill at `space-2` from the top-start corner, in the pill's colors.
- **A bubble hugs its text** (`bubbleHug`): a bubble of text — text, author, reply, forwarded, reactions — is as wide as its widest laid-out line plus the padding, never the width its lines wrapped in, and never wider than the cap; the meta's room counts on the last line only, where it sits, the reactions row as one line of chips with the meta after them, and the author's header at its full width (`data-message-fit="row"`, an ellipsized name counted whole). Quote and code blocks stretch to the bubble's width; long code lines wrap. Plain wrapping, never `pretty`. The width is measured once per text and row width — cleared, measured and written in one pass in the commit that changed the text, before paint, so a size change's morph runs to the hugged width — and cached by both: a row the window renders again takes its width with nothing measured. Row widths come from one shared `ResizeObserver`, batched per frame; hover, the menu, the reaction bar, selection and morphs never measure; fonts that finish loading measure once more. A bubble with any other part (a card, a player, a picture) keeps the width its parts give it.
- No minimum width beyond the corners: «Ок 10:16» is a compact pill — the text, the meta on the same line and the padding. With reactions the meta moves to the end of the row's last line and the text gives its room back.
- Fixed kinds stay one width: a file, a contact and a location are `--prime-message-card-width` (16rem, at most 75% of the chat), a voice message is the player's width, a round video is `--prime-message-video-note` (232, at most 70% of the chat), a link preview the media width (360) or what the row allows.
- Embedded blocks (a link preview, a reply quote, a forwarded header, the cards) span the bubble's content width; long unbreakable text (URLs) wraps instead of widening the bubble.
- Pictures follow the album layout of their Gallery, at most `--prime-message-media-max-height` (360) wide and tall; a bubble with a picture or a card is exactly that part's width and a caption wraps under it.
- Round controls (download, cancel, retry, play) are a Button `shape="circle"`: hover, press, focus ring and the touch area follow the circle. A file's action is its round tile (48): the transfer disk (`internal/transferDisk`, `xl`) with its ring, the retry or the download stand on it — never a separate button beside the name. Every transfer, either way (media, file, video note, voice), is that one disk.
- `Message.Typing` is the last row of a list; a chat puts it there itself (`Chat.Root typing`).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Shift+F10` · `ContextMenu` | Opens the menu of the focused message (`ContextMenu` is the menu key); in a chat's selection mode Enter toggles it |
| `R` | Opens the reaction bar; arrows move between reactions, Enter picks |
| `L` | Puts or takes back the quick reaction (as a double tap) |
| `Escape` | Closes the menu or the reaction bar |

### ARIA
- Every message is a `role="article"` named «{author}, {time}» (`labels.message`); an outgoing one is «Вы»; the author names every message of a run, its header shown or not. In a chat's selection mode it is an `option` with `aria-selected`.
- The delivery status is an image named «Отправляется», «Отправлено», «Прочитано» or «Не отправлено».
- A reply with `target` or `onClick` is a button; the hidden «Ответ на сообщение» explains it. Pressing it moves the focus to the original.
- The author's header is text; the hue of the name means nothing on its own, `Message.AuthorIcon` is `aria-hidden` — say what it means in the `tag`.
- `Message.Typing` is a polite `status` with «Собеседник печатает» (`labels.typing`); its dots are decorative.
- Reactions are a group of buttons with `aria-pressed`; a chip is named «{emoji}: {count}», with `users` «{emoji} {count}: {users}» («❤️ 3: Анна, Пётр, Мария», «ещё N» when not everyone is listed); its avatars are `aria-hidden`. The reaction bar is a `toolbar` of toggle buttons named by the reaction («Нравится», «Огонь»…). The quick reaction is announced in the list's polite live region.
- `VideoNote` and `VoicePlayer` carry their own ARIA (see their pages); inside a message their transcript is a plain paragraph, selectable and marked by the chat's search.
- Media tiles are buttons «Открыть: {alt}» that open the album in MediaViewer, the focus returning to the tile on close; a transfer is the round cancel, retry or download button, the share its accessible description; a refused retry or cancel is announced politely; a done transfer's disk is `inert`.
- Color is never the only signal: the status is named, the own reaction is `aria-pressed`, a selected message is `aria-selected` with a check, the author is text.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `message` | `"{author}, {time}"` | The name of a message for assistive tech. |
| `you` | `"Вы"` | The author of an outgoing message. |
| `edited` | `"изменено"` | The mark of an edited message in its meta. |
| `sending` | `"Отправляется"` | Name of the clock status. |
| `sent` | `"Отправлено"` | Name of the one-check status. |
| `read` | `"Прочитано"` | Name of the two-check status. |
| `failed` | `"Не отправлено"` | Name of the failed status. |
| `retry` | `"Повторить отправку"` | The retry button beside a failed message. |
| `menu` | `"Действия с сообщением"` | The name of the context menu. |
| `select` | `"Выбрать"` | The menu item that starts selection mode with the message. |
| `reaction` | `"{emoji}: {count}"` | `Message.Reactions`: the name of a chip without `users`. |
| `reactionUsers` | `"{emoji} {count}: {users}"` | `Message.Reactions`: the name of a chip with `users`; `{users}` — their names. |
| `moreUsers` | `"ещё {count}"` | `Message.Reactions`: the last item of `{users}` when not everyone is listed. |
| `reactions` | `"Реакции"` | `Message.Reactions`: the name of the row. |
| `reactionAdded` | `"Реакция {emoji} поставлена"` | Announced when the quick reaction (a double tap, `L`) is put. |
| `reactionRemoved` | `"Реакция {emoji} снята"` | Announced when the quick reaction is taken back. |
| `reactionBar` | `"Реакции"` | The name of the reaction bar. |
| `moreReactions` | `"Все реакции"` | The «⌄» of the reaction bar that shows every reaction. |
| `typing` | `"Собеседник печатает"` | `Message.Typing`: the text read while the other side types. |
| `open` | `"Открыть: {name}"` | `Message.Media`: the name of a tile that opens the viewer; `{name}` is `alt`, else `photo` / `video`. |
| `photo` | `"фото"` | `Message.Media`: `{name}` of a photo without `alt`. |
| `video` | `"видео"` | `Message.Media`: `{name}` of a video without `alt`. |
| `cancelUpload` | `"Отменить отправку"` | `Message.Media` / `Message.File`: the cross while sending. |
| `cancelDownload` | `"Отменить загрузку"` | `Message.Media` / `Message.File`: the cross while receiving. |
| `retryUpload` | `"Повторить отправку"` | `Message.Media` / `Message.File`: the retry after a failed send. |
| `retryDownload` | `"Повторить загрузку"` | `Message.Media` / `Message.File`: the retry after a failed receive. |
| `uploadProgress` | `"Отправка {percent}%"` | `Message.Media` / `Message.File`: the share while sending — the description of the cross. |
| `downloadProgress` | `"Загрузка {percent}%"` | `Message.Media` / `Message.File`: the share while receiving — the description of the cross. |
| `notSent` | `"Не отправилось"` | `Message.Media` / `Message.File`: why a send failed — the retry's description. |
| `notReceived` | `"Не загрузилось"` | `Message.Media` / `Message.File`: why a receive failed — the retry's description. |
| `download` | `"Скачать {name}"` | `Message.Media` / `Message.File`: the download arrow of a `remote` tile or file, and a file's `href` link; `{name}` is the file name, a tile's `alt` or `photo` / `video`. |
| `cancelFailed` | `"Не удалось отменить"` | `Message.Media` / `Message.File`: announced when `onCancel` rejected. |
| `retryFailed` | `"Не удалось повторить"` | `Message.Media` / `Message.File`: announced when `onRetry` rejected. |
| `downloadFailed` | `"Не удалось скачать"` | `Message.Media` / `Message.File`: announced when `onDownload` rejected. |
| `transferred` | `"{done} из {total}"` | `Message.File`: the line under the name while it transfers. |
| `openMap` | `"Открыть на карте: {place}"` | `Message.Location`: the name of the map link. |
| `live` | `"Трансляция"` | `Message.Location`: the mark of a live location. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A short exchange with a client: an incoming bubble and a run of two outgoing ones ending in the tail, the time and delivery ticks in the corner, a reply quote and a reaction you can toggle — `Message.Root`, `direction`, `position`, `time`, `status`, `Message.Text`, `Message.Reply`, `Message.Reactions`. |
| [structure.tsx](examples/structure.tsx) | Optional parts of a bubble in their order: the author, a forwarded header, a reply quote, the text and reactions — `Message.Author`, `Message.Forwarded`, `Message.Reply`, `Message.Reactions`. |
| [kinds.tsx](examples/kinds.tsx) | Every kind of message in its shell, both directions, single and in runs: text bubbles, pictures and circles as blocks, a caption bubble, voice, file, contact, place and link cards, reactions inside a bubble and under a picture — `Message.Media`, `VideoNote`, `Message.File`, `Message.Contact`, `Message.Location`, `Message.LinkPreview`, `VoicePlayer`. |
| [author.tsx](examples/author.tsx) | A group chat's run of one author: the first message opens with the name in the author's hue, a crown and the member's tag, the last one shows the avatar in the gutter; another author with initials only, a long name that ellipsizes before its tag, a header on a pill over a photo, and your own reply — `Message.Author`, `tag`, `Message.AuthorIcon`, `Message.Avatar`, `position`, `hueOf`. |
| [typing.tsx](examples/typing.tsx) | The typing signal: an incoming bubble of three dots that enters like a message and leaves closing its height; switch it, keep it mounted — `Message.Typing`, `active`. |
| [status.tsx](examples/status.tsx) | Delivery of outgoing messages: a clock while sending, one check when sent, two when read, and a failed one with a retry that resolves after a second — `status`, `onRetry`. |
| [text-formatting.tsx](examples/text-formatting.tsx) | The Markdown the Composer writes, rendered safely: bold, italic, strike, code, a code block, links and a quote; long words and URLs wrap — `Message.Text`, `edited`. |
| [reactions.tsx](examples/reactions.tsx) | Reactions under a message: each chip shows who reacted — up to three avatars, from four on two and «+N» — and a press on a chip, or a double tap on the message, puts or takes back your own at once while the request runs behind it — `Message.Reactions`, `users`, `onReactionToggle`. |
| [context-menu.tsx](examples/context-menu.tsx) | Long press: the reaction bar above the message and its menu below — a right click opens the menu, a long hover only the bar, `R` and Shift+F10 from the keyboard — `Message.Menu`, `onReactionToggle`. |
| [media.tsx](examples/media.tsx) | Captions under a photo, a tall portrait, an album and a video, each as wide as its media; an album with a video laid out as tiles, an outgoing album with neutral gaps and a photo still uploading with its ring and cancel; a tile opens the album in the viewer — `Message.Media`, `items`, `onCancel`. |
| [voice.tsx](examples/voice.tsx) | Voice messages on their bubbles: the player keeps room for the time in the corner; a new one carries the unplayed dot until it is played — `VoicePlayer`, `unplayed`. |
| [file.tsx](examples/file.tsx) | Documents in a chat: a download link, a file with a picture, a large file fetched from its tile, an upload in flight with its share and cancel, and a failed one with a retry — `Message.File`, `href`, `preview`, `transfer`, `transferProgress`, `transferDirection`, `onDownload`. |
| [location.tsx](examples/location.tsx) | A place on a map picture from your map service with a pin, the place and its address, and a live location of a courier on its way — `Message.Location`, `href`, `live`. |
| [contact.tsx](examples/contact.tsx) | A shared contact: initials or a photo, name and phone, with the actions to write or save — `Message.Contact`, `phone`. |
| [link-preview.tsx](examples/link-preview.tsx) | A message with a link and the card of the page under it: site, title, description and picture — `Message.LinkPreview`, `site`, `image`. |
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
- «печатает…» as a text row you add and remove → `<Message.Typing active={typing} />` kept mounted, or `Chat.Root typing`.
- Pausing other players by hand → one sound at a time is built into `VoicePlayer`, `VideoNote` and chat videos.
- A transcript as a separate `Message.Text`, or a height animation of your own around it → `transcript` / `onTranscribe` on `VoicePlayer` and `VideoNote`: the text opens inside the same message, in one stroke with its height.
- A list, dates, search or selection built around messages → [Chat](../chat/COMPONENT.md).

## Related
- **Built from:** [Dropdown](../dropdown/COMPONENT.md) (`Message.Menu`), [Gallery](../gallery/COMPONENT.md) (`Message.Media`), [Avatar](../avatar/COMPONENT.md) (`Avatar.Group` + `Avatar.Overflow` in reaction chips), [Button](../button/COMPONENT.md) (retry, the transfer disk, `shape="circle"`), [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator` in selection mode), [Spinner](../spinner/COMPONENT.md) (pending transfers and transcripts), Icon (status ticks, file glyphs, `action.forward`, `action.refresh`); `internal/messagePart` (the contract of content parts), `internal/messageList` (the contract with a chat's list), `internal/palette` (`hueOf`), `internal/Disclosure` (the reactions row, transcripts), `bubbleMorph` (every size change as one stroke), `bubbleHug` (a bubble of text as wide as its widest line), `internal/transferDisk` (the transfer of a file), `internal/mediaPill` (the meta, the author's pill), `internal/HighlightMatch` (search marks), `internal/richText` (Markdown), `internal/transcript` (the transcript of a voice or video message)
- **See also:** [Chat](../chat/COMPONENT.md) — the conversation the messages stand in; [Gallery](../gallery/COMPONENT.md) — the album of `Message.Media`; [VideoNote](../video-note/COMPONENT.md) — the round video message; [VoicePlayer](../voice-player/COMPONENT.md) — the content of a voice message; [Composer](../composer/COMPONENT.md) — the input under the list; [Timeline](../timeline/COMPONENT.md)
