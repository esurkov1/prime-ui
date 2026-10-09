# Message

**Category:** messages
**Kind:** composite

> Chat messages in speech bubbles: incoming and outgoing, runs of one author ending in a tail, one radius on every other corner, the time and delivery ticks in the bubble's corner, and every content kind of a messenger.

## When to use
- A conversation: support chat with a client, a team chat, comments in a thread shown as a chat.
- A message of any kind: text with formatting, a reply, a forwarded message, reactions, photos and albums, a round video message, a voice message (`VoicePlayer` inside), a file, a location, a contact, a link preview.
- Dates, events of the chat («Анна добавила Олега») and the unread band between messages.
- A full messenger: new messages that enter by themselves (rising a little from below, mine and theirs alike), the «к последним» button with a count, read receipts (`onRead`), «печатает…» (`Message.Typing`), pinned messages (`Message.Pinned`), a jump to the quoted message (`Message.Reply target`) and search (`highlight`, `current`).

## When not to use
- A feed of events with a time axis (an order history, an audit log) → [Timeline](../timeline/COMPONENT.md).
- One system message on a page (saved, failed) → [Banner](../banner/COMPONENT.md) or a [Notification](../notification/COMPONENT.md).
- Typing a message → [Composer](../composer/COMPONENT.md) under the list.
- A recording outside a chat (a call in a card) → [VoicePlayer](../voice-player/COMPONENT.md) on its own.

## Import
```tsx
import { Message, groupMessages, formatMessageDate } from "prime-ui-kit";
```

## Anatomy
```
Message.Group                     role="log" (a multiselectable listbox in selection mode), one tab stop
├─ Message.Separator              a date pill, sticky at the top of its day
├─ Message.Service                an event of the chat, centered pill
├─ Message.Unread                 «Непрочитанные сообщения» band
├─ Message.Root                   role="article" row «{author}, {time}» (an option in selection mode)
│  ├─ [check]                     Checkbox.Indicator at the row start in selection mode
│  ├─ Message.Avatar              gutter beside an incoming bubble (`Message.Group avatars`)
│  ├─ [retry Button]              beside a failed outgoing bubble (`onRetry`)
│  ├─ shell                       bubble · media · round, declared by the content parts (see Variants):
│  │  ├─ Message.Author           name in the author's hue (first of a run)
│  │  ├─ Message.Forwarded        «Переслано от …»
│  │  ├─ Message.Reply            quote of the answered message (button with onClick)
│  │  ├─ content                  Message.Text · Message.Media (+ caption Text) · VoicePlayer · Message.File ·
│  │  │                           Message.Location · Message.Contact · Message.LinkPreview · VideoNote
│  │  │                           (a voice message or a circle may open its transcript under it)
│  │  ├─ Message.Reactions        a row held closed in every message; chips closing a bubble
│  │  │                           (under a picture or a circle), the meta's spacer at its end
│  │  └─ meta                     «изменено» · time · ticks, in the bottom-end corner (a dark pill
│  │                              over a picture or a circle)
│  ├─ Message.Menu                Dropdown.Content opened at the pointer (+ «Выбрать»)
│  └─ [reaction bar]              floating toolbar above the bubble: long press, long hover, `R`
├─ Message.Typing                 «печатает…»: an incoming bubble of three dots, last in the list
├─ Message.SelectionBar           «Выбрано: N», your actions, «Отмена» — while selecting
└─ [«к последним» Button]         sticky round button + Badge count, in a ScrollContainer while away from the end

Message.Pinned                    above the ScrollContainer: rail · pin · title over one line · unpin
```
The part that ends a bubble closes its last line with the meta's spacer — an invisible copy of the meta that floats to the line's end — so the time sits on that line when it fits and on a line of its own when it does not; a picture or a circle carries the meta on a dark pill (`internal/mediaPill`). Every content part declares its kind once (`defineMessagePart` in `internal/messagePart`: its shell, how the meta stands with it, whether it is a picture, reaches the edges or sets the width), so the message decides the shell, the tail and the meta from what it holds, fragments opened. Nothing in a message is measured in JS: the bubble fits its content in CSS. A message added at the end enters by itself (see States); history loaded above and a message put back in the middle never do. The reaction bar is mounted only from its open to the end of its exit, one on the page at a time.

Content parts in short: `Message.Media` — rows of tiles whose aspect boxes are final before load (a video tile mounts its player near the view, with a play mark and a length pill), the shared transfer disk with its progress ring over a tile, the meta overlay; an album's gaps stand on the incoming surface in both directions. `VideoNote` and `VoicePlayer` are components of their own that declare themselves parts (the round shell, and a fill bubble). `Message.File` — a round format tile (or the preview) that is also its one action (download, cancel inside the progress ring, retry), the name, and the size line under it ending with the spacer. `Message.Location` — the map edge to edge with an accent pin (breathing when `live`), the place and the address ending with the spacer.

`groupMessages(items, { getAuthor, getDate, getKey?, isService?, groupWindow?, now?, formatDate? })` turns your array into rows: date entries (`label` from `formatMessageDate`) and message entries with `position`, `showAuthor` (first of a run) and `showAvatar` (last of a run). A run breaks on another author, another day, a service message or a pause longer than `groupWindow` minutes (5). `formatMessageTime(date)` gives «09:05».

### A messenger, end to end

```tsx partial
<Message.Pinned items={pinned} onSelect={setCurrent} onRemove={unpin} />
<ScrollContainer anchor="end" onReachStart={loadOlder}>
  <Message.Group
    aria-label="Переписка с Анной"
    onNewMessage={(value, { direction }) => direction === "incoming" && playSound()}
    onRead={(values) => socket.read(values)}
    highlight={query}
    current={current}
  >
    {rows}
    <Message.Typing active={peerTyping} />
  </Message.Group>
</ScrollContainer>
<Composer.Root onSend={send} onActivityChange={(activity) => socket.activity(activity)} />
```

- Send optimistically: add the message with `status="sending"` under a client id and return from `onSend`; patch the status as the server answers. Keep its `key` and `value` when the server id arrives — the row stays the same element, so it never enters twice and the ticks cross-fade.
- The group needs nothing to animate: it decides itself which message is new at the end. It reads the `ScrollContainer` around it to scroll to your own message, keep the end, or count new ones on the «к последним» button.
- One sound at a time on the page: a `VoicePlayer`, a `VideoNote` and a video played in `Message.Media` pause each other; nothing to wire.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Message.Root
`ref` → `HTMLElement` (`<article>`). One message: a `role="article"` row (an `option` in selection mode) with its parts in the shell its content parts declare — `bubble` (fill, padding: text, voice, file, contact, location, link preview, a picture with a caption), `media` (a picture or an album alone: the shape itself, clipped to the radius, no backing, the meta on a dark pill over it, reactions under it), `round` (`VideoNote`: no backing, the meta on its pill, reactions under it); fragments are opened and empty children ignored. The last bubble of a run of one author (`position` `single` or `last`) curls a tail out of its square bottom corner on the author's side when it is a bubble of fill (never a picture, with a caption or not, or a circle); every other corner keeps one radius. The bubble fits its content (up to the cap; a picture or a card sets its width and a caption wraps under it; a bubble of text hugs its widest laid-out line, measured once per text and row width and cached), the meta stands in the bottom-end corner over a spacer that ends the last line and drops to a line of its own only when that line is full. Every message holds a closed reactions row: the first reaction opens it and grows the message upward — its bottom corner, the meta and the tail stay, the meta moving onto the row's last line while the text gives its room back (a card keeps it, so nothing inside the card moves), the rows above gliding up as one block; the last one taken back closes it the same way. Every size change of a message (reactions, a transcript, an edit, an upload state) is laid out at once and played as one stroke: the bubble's box glides from the old size to the new one, width and height together, and its parts glide, fade in or fade out on the same clock (`--prime-message-morph-duration`); reduced motion makes it instant. Parts go in the order you write them; `Message.Avatar` goes to the gutter, `Message.Menu` to the menu.

| Prop | Type | Default | Description |
|---|---|---|---|
| `direction` | `"incoming" \| "outgoing"` | `"incoming"` | `incoming` — on the start side, a surface one step off the chat; `outgoing` — on the end side, in the accent hue (`--prime-color-message-outgoing-*`), everything inside recolors with it. |
| `position` | `"single" \| "first" \| "middle" \| "last"` | `"single"` | The place in a run of one author's messages (`groupMessages` gives it): sets the small gap inside a run; `single` and `last` end a run, and a bubble of fill there gets the tail. |
| `time` | `Date \| string` | — | When it was sent: a `Date` shown with `formatTime` (and put in `<time dateTime>`), or the text to show. |
| `formatTime` | `(date: Date) => string` | `«09:05»` | Display of a `Date` time. |
| `edited` | `boolean` | `false` | The text was edited: `labels.edited` before the time. |
| `status` | `"sending" \| "sent" \| "read" \| "failed"` | — | Delivery of an outgoing message: a clock, one check, two checks (accent), or a danger mark; the glyphs cross-fade from one state to the next. Named for assistive tech by `labels`. |
| `onRetry` | `() => void \| Promise<void>` | — | Sends a failed message again: a ghost danger button beside the bubble. A returned promise shows `sending` until it settles; a rejection leaves it failed. |
| `onReactionToggle` | `(emoji: string) => void \| Promise<unknown>` | — | The reader puts or takes back a reaction: a chip of `Message.Reactions`, a double tap (the group's `quickReaction`), `L`, or the reaction bar (long press, long hover, `R`). The chip shows the new state at once; a returned promise keeps it (`aria-busy`) until it settles — update the reactions before it resolves; a rejection drops it back. Without it reactions are read-only and there is no bar. |
| `value` | `string` | — | The id of the message: selection (`Message.Group selected`), `onNewMessage`, `onRead`, `current`, `Message.Reply target`. Keep it when the server confirms a sent message. |
| `labels` | `Partial<MessageLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "role">` | — | `id`, `aria-label` to replace «{author}, {time}», `className` and the other attributes of the row. |

### Message.Group
`ref` → `HTMLDivElement`. The conversation: a `role="log"` of rows (new messages are announced politely) with one tab stop — arrows, Home and End move between messages. Every top-level child is a row — a `Message.Root` (or a fragment with one; an own component standing for a message carries its `value` as `key` and may pass `direction`), a date, a service line, the unread band — except `Message.Typing` and `Message.SelectionBar`, which close the list. Inside a `ScrollContainer anchor="end"` it renders only the rows around the view (in normal flow between two spacers, each measured once and cached by key, the sticky date kept), opens at the end, stays at the end while the reader is there, scrolls to your own new message, and otherwise shows a round «к последним» button with the count of messages that came meanwhile; history loaded above, rows measured on the way and a message that changes size in place keep the reader's place; jumps, search, Shift selection, the keyboard (`aria-posinset` / `aria-setsize`), a playing player and the focused message reach or keep rows it does not render. A message added at the end enters by itself, mine and theirs alike: it floats up a little from below into its place and fades in (`fast`); the first render, history, rows scrolled into view and a status change never animate. When the reply arrives with the end of `Message.Typing`, the typing goes at once. In selection mode a multiselectable `listbox`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `avatars` | `boolean` | `false` | Incoming messages keep a gutter for the author's avatar (a group chat); put `Message.Avatar` on the last message of a run. |
| `selected` | `readonly string[] \| null` | — | Selection mode (controlled): the `value`s of the selected messages, `null` while not selecting. Any of the triad adds «Выбрать» to every `Message.Menu`. While selecting: a check beside every message, the selected messages stay as they are and the others step back (dimmed, slightly desaturated) — no outline, no wash; a click toggles, Shift+click selects the range from the anchor, press-and-drag (or a finger slid from a check) paints the messages it passes with the first one's new state and scrolls the list at its edges — as DataTable rows; Escape leaves. |
| `defaultSelected` | `readonly string[] \| null` | `null` | Initial selection (uncontrolled). |
| `onSelectedChange` | `(selected: readonly string[] \| null) => void` | — | The selection changed: a message toggled, selection started from the menu (`[value]`) or ended (`null`). |
| `quickReaction` | `string \| false` | `«👍»` | The reaction of a double tap (and `L`) on a message: puts it or takes it back through `onReactionToggle`, announced politely. Not on a double click that selected text, nothing extra in selection mode. `false` — off. |
| `reactionOptions` | `readonly { emoji: string; label: string }[]` | `👍 🔥 🤣 👌 🤔 😢 😱, then 7 more` | The reactions of the reaction bar — a floating pill above the message on a long press (with the menu), after a long hover (pointer devices, ~500 ms, the bar alone) or `R`: the first seven in its row, «⌄» glides the rest open. `label` names each toggle button. |
| `reader` | `MessageUser` | — | The reader (`{ id, name: «Вы», src?, color? }`): a reaction they put shows them among the chip's avatars at once, before the data comes back; matched by `id`. |
| `onNewMessage` | `(value: string, details: { direction: "incoming" \| "outgoing" }) => void` | — | A message was added at the end after mount — sent or received: for a sound, a counter, a title badge. Never for the first render, history loaded above or a message put back in the middle. Keep a sent message's `key` and `value` when the server confirms it: a re-keyed row would be new again. |
| `onRead` | `(values: string[]) => void` | — | Incoming messages the reader has seen — at least half of each, or half the view, on screen while the page is visible (`IntersectionObserver`). Batched per frame; each `value` once per mount. Send read receipts from here. |
| `current` | `string \| null` | — | The current message of a search or a jump: when it changes, the group brings it to the middle of its ScrollContainer (a message the window does not render is rendered first and jumped to) and points at it: nothing is drawn on it, the other messages step back and come forward three times. While `highlight` is set (a search) they stay back while the message is current. Focus stays where it is. |
| `highlight` | `string` | `""` | A search query: every case-insensitive match in `Message.Text` is marked. |
| `labels` | `Partial<MessageGroupLabels>` | — | System strings of the list (announcements, the selection bar, the reaction bar), see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `aria-label` (name the chat), `className` and the other attributes. |

### Message.Avatar
`ref` → `HTMLDivElement`. The author's picture in the gutter beside an incoming bubble, aligned to its bottom; holds an `Avatar` (`m`). Decorative: the message is named by its author.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (an `Avatar.Root`), `className`. |

### Message.Author
`ref` → `HTMLDivElement`. The author's name at the top of the first bubble of a run, semibold in the author's hue; plain text here also names the message.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"blue"` | The author's hue: one per person in a chat. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "color">` | — | `children` (the name), `className`. |

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
| `target` | `string` | — | The `value` of the quoted message: a press brings the group to it (rendering it first in a window), the other messages blink back around it, and the focus moves to it. Makes the quote a button. |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | A press on the quote, after `target` is shown: load the original when it is not in the list yet. Makes the quote a button. |
| `labels` | `Partial<MessageReplyLabels>` | — | `reply` — the hidden prefix read before the quote. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "color" \| "onClick">` | — | `children` (the quoted text, one line), `className`. |

### Message.Text
`ref` → `HTMLDivElement`. The text: a string renders the Markdown subset the Composer writes (**bold**, _italic_, ~~strike~~, `code`, fenced code, Markdown links, bare URLs, `> ` quotes) as elements, never as HTML; links take only http(s), mailto and tel and open in a new tab. Wraps anywhere; the meta stands at the end of its last line. Marks the matches of `Message.Group highlight`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `plain` | `boolean` | `false` | Render a string as is, without its Markdown. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the text), `className`. |

### Message.Media
`ref` → `HTMLDivElement`. A photo, a video or an album of up to 10 as a tiled grid with thin gaps; every box is final before anything loads (rows from the items' ratios, nothing measured), pictures load lazily and decode async, a video mounts its first frame once it nears the view. Alone in a message it is the shell itself — rounded, no backing, the meta on a dark pill over it; with a caption (`Message.Text` after it) it sits edge to edge at the top of the bubble. The gaps of an album show the neutral surface of an incoming message in both directions. A video tile shows its first frame, a play mark and its length; a tile on its way, either way, dims under the shared transfer disk on the media shade in its middle with the progress ring along the disk's edge — pressing the disk cancels, once done it fades and shrinks away; a failed one's disk turns danger with a retry arrow; a `remote` one carries the download arrow.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `MessageMediaItem[]` | — (required) | `{ type?: "image" \| "video", src, poster?, alt?, width?, height?, duration?, transfer?, transferProgress?, transferDirection? }` — `width` / `height` give the ratio (default 4 : 3) and reserve the box before load; `duration` is a video's length before its metadata; `transfer`, `transferProgress` and `transferDirection` are the transfer of the tile, the same shape as every message part (`transfer={item.status}`, `transferProgress={item.progress}` of a `useUploadQueue` item; a share left out in flight turns an indeterminate arc; the direction changes only the words). Items after the 10th are not shown. |
| `onItemOpen` | `(index: number) => void` | — | A tile was activated: open your viewer. Makes the tiles buttons named «Открыть: {alt}». |
| `onCancel` | `(index: number) => void \| Promise<void>` | — | Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`. |
| `onRetry` | `(index: number) => void \| Promise<void>` | — | Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection). |
| `onDownload` | `(index: number) => void \| Promise<void>` | — | Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection). |
| `labels` | `Partial<MessageMediaLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.File
`ref` → `HTMLDivElement`. A document: a round tile with the format (from the name's extension, in its hue) or the file's picture, the name on one line and the size. The tile is the file's one action, in one spot: download (with `href`, a link; or `transfer="remote"` with `onDownload`, fetched in the app), cancel while it transfers, retry after a failure. A transfer either way is the shared transfer disk (`xl`) over the tile — the cross on the media shade with the progress ring along its edge, always shown, and «{done} из {total}» under the name; a failure turns it into the danger retry with the reason under the name. The name and the size line never move.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — (required) | The file name with its extension (the format tile reads it). |
| `fileSize` | `number` | — | Bytes, shown as «1,2 МБ». |
| `formatSize` | `(bytes: number) => string` | `Russian digits, Б · КБ · МБ · ГБ` | Display of `fileSize`. |
| `href` | `string` | — | Where to get it: the tile becomes the download link «Скачать {name}». |
| `preview` | `string` | — | A picture of the file (an image, the first page) in the tile in place of the format. |
| `transfer` | `"remote" \| "queued" \| "loading" \| "failed" \| "done"` | — | The transfer of the file — the transfer disk (`xl`) over its tile, the transferred share under the name, either way (`TransferState`, the values of `UploadItem.status` plus `remote`): `queued` / `loading` — the cross with the ring of `transferProgress` (`role="progressbar"`); `failed` — the danger disk with the retry arrow; `remote` — not fetched yet, the download arrow; `done` — the disk fades and shrinks away (`fast`). |
| `transferProgress` | `number` | — | Share transferred, 0…1 (`UploadItem.progress`): the ring along the disk's inner edge, gliding (`base`). Without it a transfer in flight turns an indeterminate arc. |
| `transferDirection` | `"upload" \| "download"` | `"upload"` | Which way it goes: sending (`upload`) or receiving (`download`). Changes only the words — the names of the cross, the retry, the ring and the failure — never the look. |
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
`ref` → `HTMLDivElement`. Reactions at the bottom of a bubble, under a picture or a circle: a `role="group"` of chips (`aria-pressed`) — the emoji, then the avatars of who reacted (`users`: up to 3; from 4 on, 2 and a «+N» circle) or the rolling count. Not the reader's: a neutral wash; the reader's own: the accent. A press goes to `Message.Root onReactionToggle` and shows at once, the reader (`Message.Group reader`) joining the stack. Every message holds the row closed; the first reaction opens it in place and the last one closes it, as the message's one stroke, while the rows below stay still and the rows above glide as one block. A reaction new on the message takes its room at once and fades and scales in from 0.9 where it stands as the bubble glides; a chip taken away fades out where it stood while the chips after it glide into its place; a count change rolls its digits only; nothing animates on mount. In a bubble the meta stands at the end of the row's last line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `reactions` | `MessageReaction[]` | — (required) | `{ emoji, count, selected?, users? }` — `count` is the total, `selected` the reader's own reaction, `users` (`{ id, name, src?, color? }[]`, in the order they put it) who put it; without `users` the chip shows the count. |
| `labels` | `Partial<MessageReactionsLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Menu
`ref` → `HTMLDivElement`. The context menu (a `Dropdown.Content`): `Dropdown.Item`s you write — Ответить, Скопировать, Закрепить, Переслать, Пожаловаться, Удалить (`tone="danger"`); the kit adds a separator and «Выбрать» when the group has a selection. It opens where the pointer is on right click, with the reaction bar on a long press, under the bubble from the keyboard (Enter, Shift+F10, the menu key); a bottom sheet on phones.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier of the menu. |
| `…rest` | `Omit<DropdownContentProps, "side" \| "align" \| "matchTriggerWidth">` | — | `children` (the items), `className`. |

### Message.SelectionBar
`ref` → `HTMLDivElement`. The bar of selection mode, sticky at the bottom of the list while it is on: «Выбрано: N», your actions and «Отмена», which leaves selection (`role="toolbar"`). Renders nothing otherwise.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` — the actions (`Button.Root size="s"`: Переслать, Удалить), `className`. |

### Message.Separator
`ref` → `HTMLDivElement`. A date between messages («Сегодня», «12 марта» — `formatMessageDate`): a pill in the middle that stays at the top while its day scrolls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the date), `className`. |

### Message.Service
`ref` → `HTMLDivElement`. An event of the chat, not a message («Анна добавила Олега»): a centered pill that wraps.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the event), `className`. |

### Message.Unread
`ref` → `HTMLDivElement`. «Непрочитанные сообщения»: a band across the list above the first unread message.

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<MessageUnreadLabels>` | — | `unread` — the text of the band. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Typing
`ref` → `HTMLDivElement` (`role="status"`). «Печатает…»: an incoming bubble of three dots that rise and fade in turn (the loading loop: reduced motion slows it), at the end of the group while the other side types. Enters like an incoming message; leaves fading and closing its height. Its hidden text is read politely.

| Prop | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | `true` | The other side is typing. Keep the part mounted and switch this, so it can leave smoothly. |
| `children` | `ReactNode` | — | `Message.Avatar` of who types, in a group chat (`Message.Group avatars`). |
| `labels` | `Partial<MessageTypingLabels>` | — | `typing` — the text read for assistive tech. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Message.Pinned
`ref` → `HTMLDivElement`. The pinned messages above a conversation (outside its ScrollContainer): a rail of segments (which of several is shown, the current one in the accent), a pin, «Закреплённое сообщение» or «Закреплённое 2 из 3» over one line of the message, and an optional unpin button. The text area is one button: it shows the message (`onSelect`) and steps to the next older one; the line enters on each step. Renders nothing without items.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly { value: string; text: string }[]` | — (required) | The pinned messages, oldest first: the `value` of each `Message.Root` and one line of it («Фото», «Голосовое сообщение» for media). |
| `value` | `string` | — | The pinned message shown (controlled). |
| `defaultValue` | `string` | `the last item` | The one shown first (uncontrolled): the newest. |
| `onValueChange` | `(value: string) => void` | — | The shown message changed: a press stepped to the next older one (the oldest wraps to the newest). |
| `onSelect` | `(value: string) => void` | — | A press on the bar: show the message in the chat — set `Message.Group current` to it. |
| `onRemove` | `(value: string) => void` | — | Unpin the shown message: a ghost close button at the end. Without it no button. |
| `labels` | `Partial<MessagePinnedLabels>` | — | System strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "defaultValue" \| "onSelect">` | — | `className` and the other attributes. |

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
| `single` | the message gap above; a bubble of fill gets the tail | a message alone | yes |
| `first` | the message gap above | first of a run of one author | |
| `middle` | the small group gap above | inside a run | |
| `last` | the small group gap above; a bubble of fill gets the tail | last of a run | |

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
| `Message.Group avatars` | incoming rows keep a gutter for `Message.Avatar` |
| `Message.Location live` | a breathing pin and a «Трансляция» badge |
| `Message.Text plain` | a string without Markdown |
| `Message.Group quickReaction` | the emoji of a double tap and `L` (default «👍», `false` — off) |
| `Message.Group reactionOptions` | the reactions of the reaction bar, seven in its row, the rest behind «⌄» |
| `Message.Group reader` | the reader as a `MessageUser`: joins a chip's avatars at once when they put a reaction |

## States
| State | Driven by | DOM |
|---|---|---|
| new, mine | an outgoing message added at the end after the group mounted (decided from the data, never from a row that mounts) | `data-enter="outgoing"` for one play: the message column floats up `--prime-space-3` from below into its place and fades in (`fast`, enter easing, `transform` + `opacity` only; the row box clips it, so it adds no scrollable overflow). Nothing else moves: the list is pushed by layout and a region pinned to the end stays pinned in the same frame; scrolled away, the region glides to the end |
| new, theirs | an incoming message added at the end | `data-enter="incoming"`: the same float-up and fade (`fast`); scrolled away, the «к последним» button counts it. Arriving with the end of `Message.Typing`, it takes the typing's place — the typing goes at once |
| not new | the first render, history prepended, a message put back in the middle, a row the window renders as it scrolls into view, a status or text change | nothing moves; the ticks cross-fade as usual. Reduced motion makes every enter instant |
| away from the end | a `ScrollContainer anchor="end"` the reader scrolled up | a round soft «к последним» button at the bottom-end, rising in (`fast`); a `Badge` counts incoming messages that came meanwhile; a press glides to the end — from far away it lands one view before the end first — following the end as rows render on the way, and stops when the reader scrolls; at the end it leaves and the count resets |
| jumped to | `Message.Reply target`, `current`, `Message.Pinned` | the region brings the message to its middle (a near one glides, a far one lands at once — rendering it first — and settles once its neighbours have laid out); nothing is drawn on it: it stays at full strength while every other message steps back and comes forward three times (opacity 1 → `--prime-message-dim-opacity` → 1, `base` each, standard easing) — `data-pointing="a"` / `"b"` on the group, flipped on every jump so a jump to the same message restarts it, and `data-pointed` on the message; a reply's target also takes the focus. Reduced motion: the others stand back for a moment, no blink |
| search | `highlight`, `current` | every match in `Message.Text` under a soft accent wash (`<mark>`); while a match is current the other messages stay stepped back (`data-pointing="current"`), and stepping to the next match moves the full strength to it in one step |
| typing | `Message.Typing active` | an incoming bubble of three dots rising and fading in turn on the loading loop; enters floating up while its height opens (`fast`), leaves closing its height (`fast`) — or at once when the reply arrives in the same update; its block axis clips, so a closed row leaves nothing under the list |
| pinned | `Message.Pinned items` | the rail's current segment in the accent; a press steps to the older one and its line enters |
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
| transferring media / file, sent or received (one look both ways) | `transfer`, `transferProgress`, `transferDirection` (of an item for media) | media: the picture dims under the shared transfer disk in the middle — a 40px disk on the media shade (backdrop blur) with a white ×, the progress drawn as a ring along its inner edge (7.5% of the disk: 3px, a 32% white track, a solid white arc from 12 o'clock, one variable gliding `base`; `role="progressbar"`, «Отправка {percent}%» / «Загрузка {percent}%» by the direction), the play mark of a video gives way; pressing the disk cancels; done — the disk and ring fade and shrink to 0.9 (`fast`), the picture returns to full; failed — the disk turns danger with a retry arrow («Повторить отправку» / «Повторить загрузку», described by «Не отправилось» / «Не загрузилось»); `remote` — the download arrow on the same disk, no ring (`onDownload`). A file: the same disk at the tile's size (`xl`, 48px) covers its round tile, always shown — the ring along its edge, the × on the media shade; failed — the danger retry and the reason under the name; done — it fades away and the face (or the download link) is back. Voice and video messages draw the same transfer on their own play disk (VoicePlayer, VideoNote). Every one is the same disk (`internal/transferDisk`): one ring proportion, track, start, motion and cancel / retry / download. The size line shows «{done} из {total}». The name and the size line never move |
| transfer pending | `onCancel` / `onRetry` returned a promise | a `Spinner` in the round button, `aria-busy`, no second press; a rejection leaves the transfer as it was and announces `cancelFailed` / `retryFailed` |
| selection mode | `Message.Group selected` (not `null`) | listbox / options with `aria-selected`; a check at the row start; the selected messages stay as they are and the unselected ones step back — the bubble, picture or circle with its tail and reactions, the avatar — to `--prime-message-dim-opacity` with a slight desaturation (`fast`, both ways; `data-selecting` on the group, `data-selected` on the message); no outline, no wash; `Message.SelectionBar` — the «к последним» button rises above it first (`fast`, its height in `--message-bottom-bar` on the group), then the bar fades in, so the two never overlap |
| menu open | right click, long press, Enter / Shift+F10 / the menu key | the menu at the pointer (below the bubble from the keyboard); a bottom sheet below 640px |
| focused | keyboard | the focus ring around the bubble |

## Layout & spacing
- The list fills its host; every row is a container: a bubble is at most `--prime-message-max-width` (30rem) and 85% of the chat, so it follows the chat column from 320px up.
- Gap between runs `--prime-message-gap` (16), inside a run `--prime-message-group-gap` (8): a run reads as one block, the next author stands apart.
- **Growth in place:** a message that changes size grows from its anchored edge. A reaction row, an edit or an upload state grow it from its bottom: the bottom corner, the meta and the tail stay where they are; the chat scrolls by the change in the same frame, so the rows below stay still, and the rows above glide up (or down) as one block on the message's clock. A transcript grows it from its top: the player stays and the rows below glide. A message above the view changes with the view still; one below it needs nothing. The gaps stay 8 inside a run and 16 between runs.
- Only text selects: the chat and every message are `user-select: none`, and the text-bearing parts (text and caption, author, forwarded-from, reply quote, file name, contact, place, link preview) opt back in. Copying across messages gives their text only; time, ticks, durations, chips, buttons, media and separators never select. A double click reacts without selecting a word; a long press opens the bar and the menu, never the iOS callout.
- Bubble padding `--prime-message-padding-y` / `-x` (8 / 12), radius `--prime-message-radius` (14) on every corner; text `body-m`, wraps anywhere.
- **The tail** ends a run: the last bubble of one author (`single`, `last`) that is a bubble of fill — text, voice, file, contact, location, link preview, forwarded, a reply — squares its bottom corner on the author's side (bottom-start incoming, bottom-end outgoing) and a curl grows out of it (`--prime-message-tail-width` × `-height`, 8 × 16, the shape `--prime-message-tail-mask`), drawn in the bubble's own fill on the bubble's own surface depth, so it is seamless in both themes; it steps back with its bubble (one layer, so no seam), sits outside the bubble's clip and rides its bottom edge when the size changes. A picture (with a caption or not), an album and a round video never have one. Every row reserves the tail's width on the author's side, so a run lines up.
- **A bubble hugs its text** (`bubbleHug`): a bubble of text — text, author, reply, forwarded, reactions — is as wide as its widest laid-out line plus the padding, never the width its lines wrapped in, and never wider than the cap; the meta's room counts on the last line only, where it sits, and the reactions row as one line of chips with the meta after them. Quote and code blocks stretch to the bubble's width; their lines count, they never set it beyond them; long code lines wrap. Plain wrapping, never `pretty` (its breaks follow the last line's room, so the meta leaving that line would break the paragraph anew). The width is measured once per text and row width — cleared, measured and written in one pass in the commit that changed the text, before paint, so a size change's morph runs to the hugged width — and cached by both: a row the window renders again takes its width with nothing measured. Row widths come from one shared `ResizeObserver`, batched per frame; hover, the menu, the reaction bar, selection and morphs never measure; fonts that finish loading measure once more. A bubble with any other part (a card, a player, a picture) keeps the width its parts give it.
- No minimum width beyond the corners: «Ок 10:16» or «+ 09:29 ✓✓» is a compact pill — the text, the meta on the same line and the padding. The meta sits in the last line's spacer when it fits and drops to its own line when it does not; with reactions it moves to the end of the row's last line and the text gives its room back, so nothing is left empty after the text. An author name or a reply quote may widen the bubble to their own width.
- Fixed kinds stay one width: a file, a contact and a location are `--prime-message-card-width` (16rem, at most 75% of the chat), a voice message is the player's width, a round video is `--prime-message-video-note` (232, at most 70% of the chat), a link preview the media width (360) or what the row allows.
- Embedded blocks (a link preview, a reply quote, a forwarded header, the cards) span the bubble's content width; long unbreakable text (URLs) wraps instead of widening the bubble.
- Pictures follow their own aspect ratio, at most `--prime-message-media-max-height` (360) wide and tall; a bubble with a picture or a card is exactly that part's width and a caption wraps under it.
- Round controls (download, cancel, retry, play) are the disk itself (`internal/roundButton`): hover, press, focus ring and the touch area follow the circle. A file's action is its round tile (48): the transfer disk (`internal/transferDisk`, `xl`) with its ring, the retry or the download stand on it — never a separate button beside the name. Every transfer, either way (media, file, video note, voice), is that one disk.
- Put the group in a `ScrollContainer anchor="end"` with `onReachStart` for history, and the Composer under it — see the chat pattern (`SKILL/patterns/chat.tsx`). `Message.Pinned` stands above the ScrollContainer, `Message.Typing` last inside the group.
- The «к последним» button is a zero-height sticky row at the end of the group: it floats over the last messages at `--prime-space-3` from the bottom-end and takes no room.
- In a `ScrollContainer` the group always renders a window: only the rows around the view, in normal flow between two spacers whose nodes stay while the window moves (sticky dates keep working; the date of the day in view stays rendered). Every top-level child is a row; `Message.Typing` and `Message.SelectionBar` stay at the end. Each row is measured once (one shared `ResizeObserver`) and cached by key; until then it stands at an estimate its parts give from their props (a picture from its aspect, a text from its length). The scroller keeps the first element in view still when anything above it changes (history loaded, rows rendered or measured, a message that grows in place) — one correction before paint, the browser's own anchoring off — never moves a row with a transform, and the window pins rows it must keep: a jump target, the focused message, a playing player. Without a scroller every row renders.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Enters the list on the last (or last focused) message, then its buttons and links |
| `↑` · `↓` | Moves to the previous / next message |
| `Home` · `End` | Moves to the first / last message |
| `Enter` · `Shift+F10` · `ContextMenu` | Opens the menu of the focused message (`ContextMenu` is the menu key); in selection mode Enter toggles it |
| `R` | Opens the reaction bar; arrows move between reactions, Enter picks |
| `L` | Puts or takes back the quick reaction (as a double tap) |
| `Space` · `Shift+Space` | In selection mode toggles the focused message; with Shift the range from the last toggled |
| `Escape` | Closes the menu or the bar and leaves selection mode |

### ARIA
- The list is `role="log"`: new messages are announced politely; name it with `aria-label`. In selection mode it is a `listbox` with `aria-multiselectable`, the messages `option`s with `aria-selected`.
- Every message is a `role="article"` named «{author}, {time}» (`labels.message`); an outgoing one is «Вы».
- The delivery status is an image named «Отправляется», «Отправлено», «Прочитано» or «Не отправлено».
- A reply with `target` or `onClick` is a button; the hidden «Ответ на сообщение» explains it. Pressing it moves the focus to the original.
- `Message.Typing` is a polite `status` with «Собеседник печатает» (`labels.typing`); its dots are decorative.
- `Message.Pinned` is a button named by its title and line («Закреплённое 2 из 3, …»); the rail is decorative; «Открепить» is a separate button.
- The «к последним» button is named «К последним сообщениям», with the count «Новых сообщений: N. …»; the badge is `aria-hidden`.
- A search keeps the focus in its field: `current` scrolls and marks the message, never moves the focus.
- A refused retry or cancel of a transfer is announced in a polite live region.
- Reactions are a group of buttons with `aria-pressed`; a chip is named «{emoji}: {count}», with `users` «{emoji} {count}: {users}» («❤️ 3: Анна, Пётр, Мария», «ещё N» when not everyone is listed); its avatars are `aria-hidden`. The reaction bar is a `toolbar` of toggle buttons named by the reaction («Нравится», «Огонь»…). The quick reaction is announced in a polite live region.
- `VideoNote` and `VoicePlayer` carry their own ARIA (see their pages); inside a message their transcript is a plain paragraph, selectable and marked by the search.
- `Message.SelectionBar` is a `toolbar` named by the count «Выбрано: N», which is announced politely as it changes.
- Media tiles with `onItemOpen` are buttons «Открыть: {alt}»; an upload is a `role="progressbar"` ring «Загрузка {percent}%» around a round cancel button (a retry button after a failure, described by the reason); a done upload's disk is `inert`.
- Color is never the only signal: the status is named, the own reaction is `aria-pressed`, a selected message is `aria-selected` with a check (the others stepping back is only a cue), the unread band is text.
- A message pointed at by a jump or the current search match is not announced as such: a reply's target takes the focus, a search keeps it in its field; the others stepping back is visual only.

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
| `reactionAdded` | `"Реакция {emoji} поставлена"` | `Message.Group`: announced when the quick reaction is put. |
| `reactionRemoved` | `"Реакция {emoji} снята"` | `Message.Group`: announced when the quick reaction is taken back. |
| `selectedCount` | `"Выбрано: {count}"` | `Message.Group`: the count of the selection bar. |
| `cancel` | `"Отмена"` | `Message.Group`: the selection bar's button that leaves selection. |
| `reactionBar` | `"Реакции"` | `Message.Group`: the name of the reaction bar. |
| `moreReactions` | `"Все реакции"` | `Message.Group`: the «⌄» of the reaction bar. |
| `scrollToEnd` | `"К последним сообщениям"` | `Message.Group`: the name of the round button that goes to the newest message. |
| `newMessages` | `"Новых сообщений: {count}. К последним сообщениям"` | `Message.Group`: the name of that button while new messages wait below. |
| `typing` | `"Собеседник печатает"` | `Message.Typing`: the text read while the other side types. |
| `pinned` | `"Закреплённое сообщение"` | `Message.Pinned`: the title with one pinned message. |
| `pinnedOf` | `"Закреплённое {index} из {count}"` | `Message.Pinned`: the title with several, the newest last. |
| `unpin` | `"Открепить"` | `Message.Pinned`: the name of the unpin button. |
| `open` | `"Открыть: {name}"` | `Message.Media`: the name of a tile that opens the viewer; `{name}` is `alt`, else `photo` / `video`. |
| `photo` | `"фото"` | `Message.Media`: `{name}` of a photo without `alt`. |
| `video` | `"видео"` | `Message.Media`: `{name}` of a video without `alt`. |
| `cancelUpload` | `"Отменить отправку"` | `Message.Media` / `Message.File`: the cross while sending. |
| `cancelDownload` | `"Отменить загрузку"` | `Message.Media` / `Message.File`: the cross while receiving. |
| `retryUpload` | `"Повторить отправку"` | `Message.Media` / `Message.File`: the retry after a failed send. |
| `retryDownload` | `"Повторить загрузку"` | `Message.Media` / `Message.File`: the retry after a failed receive. |
| `uploadProgress` | `"Отправка {percent}%"` | `Message.Media` / `Message.File`: the name of the ring while sending. |
| `downloadProgress` | `"Загрузка {percent}%"` | `Message.Media` / `Message.File`: the name of the ring while receiving. |
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
| [overview.tsx](examples/overview.tsx) | A complete messenger over two thousand messages: a header with the status that turns into typing, search with highlight and stepping through matches, pinned messages, history that loads above, every kind of message, the transcript of a voice message and a video circle, reactions, the menu with reply, edit, pin and select, jump to the quoted message, the new-messages button, typing, and the Composer whose sent messages rise into the list while the reply arrives — `Message.Group`, `Message.Root`, `groupMessages`, `onReactionToggle`, `selected`, `highlight`, `current`, `transcript`, `onTranscribe`, `Message.Typing`, `Message.Pinned`, `Message.Reply`. |
| [structure.tsx](examples/structure.tsx) | Optional parts of a bubble in their order: the author, a forwarded header, a reply quote, the text and reactions — `Message.Author`, `Message.Forwarded`, `Message.Reply`, `Message.Reactions`. |
| [kinds.tsx](examples/kinds.tsx) | Every kind of message in its shell, both directions, single and in runs: text bubbles, pictures and circles as blocks, a caption bubble, voice, file, contact, place and link cards, reactions inside a bubble and under a picture — `Message.Media`, `VideoNote`, `Message.File`, `Message.Contact`, `Message.Location`, `Message.LinkPreview`, `VoicePlayer`. |
| [live.tsx](examples/live.tsx) | A live support chat: the client types, then answers; new messages enter at the end, read receipts come from what is on screen, and scrolled up the round button counts what arrived — `onNewMessage`, `onRead`, `Message.Typing`, `ScrollContainer`. |
| [group-chat.tsx](examples/group-chat.tsx) | A team chat built from data: `groupMessages` adds the dates and runs, the author's name opens a run and the avatar closes it — `avatars`, `groupMessages`, `Message.Avatar`, `Message.Author`. |
| [status.tsx](examples/status.tsx) | Delivery of outgoing messages: a clock while sending, one check when sent, two when read, and a failed one with a retry that resolves after a second — `status`, `onRetry`. |
| [text-formatting.tsx](examples/text-formatting.tsx) | The Markdown the Composer writes, rendered safely: bold, italic, strike, code, a code block, links and a quote; long words and URLs wrap — `Message.Text`, `edited`. |
| [reactions.tsx](examples/reactions.tsx) | Reactions under a message: each chip shows who reacted — up to three avatars, from four on two and «+N» — and a press on a chip, or a double tap on the message, puts or takes back your own with your avatar at once while the request runs behind it — `Message.Reactions`, `users`, `reader`, `onReactionToggle`. |
| [context-menu.tsx](examples/context-menu.tsx) | Long press: the reaction bar above the message and its menu below — a right click opens the menu, a long hover only the bar, `R` and Shift+F10 from the keyboard; the Select item starts selection — `Message.Menu`, `onReactionToggle`, `onSelectedChange`. |
| [media.tsx](examples/media.tsx) | A photo with a caption, an album with a video laid out as tiles, an outgoing album with neutral gaps and a photo still uploading with its ring and cancel; a tile opens your viewer — `Message.Media`, `items`, `onItemOpen`, `onCancel`. |
| [voice.tsx](examples/voice.tsx) | Voice messages on their bubbles: the player keeps room for the time in the corner; a new one carries the unplayed dot until it is played — `VoicePlayer`, `unplayed`. |
| [file.tsx](examples/file.tsx) | Documents in a chat: a download link, a file with a picture, a large file fetched from its tile, an upload in flight with its share and cancel, and a failed one with a retry — `Message.File`, `href`, `preview`, `transfer`, `transferProgress`, `transferDirection`, `onDownload`. |
| [location.tsx](examples/location.tsx) | A place on a map picture from your map service with a pin, the place and its address, and a live location of a courier on its way — `Message.Location`, `href`, `live`. |
| [contact.tsx](examples/contact.tsx) | A shared contact: initials or a photo, name and phone, with the actions to write or save — `Message.Contact`, `phone`. |
| [link-preview.tsx](examples/link-preview.tsx) | A message with a link and the card of the page under it: site, title, description and picture — `Message.LinkPreview`, `site`, `image`. |
| [service.tsx](examples/service.tsx) | Lines between messages: a date that stays on top while its day scrolls, an event of the chat and the unread band — `Message.Separator`, `Message.Service`, `Message.Unread`. |
| [controlled.tsx](examples/controlled.tsx) | Selection mode owned by the screen: the Select item of a message's menu starts it, a check stands beside every message, a press toggles one and marks the bubble itself, the bar counts and acts, Escape leaves — `selected`, `onSelectedChange`, `Message.SelectionBar`. |
| [narrow.tsx](examples/narrow.tsx) | At phone width bubbles take up to 85% of the chat, long words and links wrap inside, an album keeps its rows — `Message.Root`, `Message.Media`. |

## Mistakes
- A bubble drawn in your CSS (a rounded div with a fill) → `Message.Root`; every content kind sits in its shell — a bubble, or a rounded block for a picture without a caption and a circle for a video message.
- Drawing your own tail or smaller joined corners → pass `position` (`groupMessages` gives it): the last bubble of a run gets the kit's tail, every other corner keeps one radius, and a run reads as one block through its smaller gap.
- Positions computed by hand → `groupMessages` gives `position`, `showAuthor`, `showAvatar` and the dates.
- An avatar on every message of a run → only on the last (`showAvatar`); the others keep the gutter empty.
- `Message.Author` on outgoing messages or in a one-to-one chat → the author is obvious; name the message with `aria-label` if needed.
- Rendering message HTML (`dangerouslySetInnerHTML`) → pass the string to `Message.Text`; its Markdown subset renders as elements.
- A status that flips without a transition, or a custom ✓ glyph → `status`.
- Waiting for the server before showing a reaction → return the promise from `onReactionToggle`: the chip shows the new state at once and drops it back on a rejection; update the reactions before the promise resolves.
- Avatars of reactors drawn next to the chip, or a count where names are known → pass `users` (in the order they reacted) and `Message.Group reader`: the chip stacks them, folds to «+N» and names them for assistive tech.
- A reaction picker of your own (a popover of emoji) → the reaction bar opens itself on a long press, a long hover and `R`; configure it with `reactionOptions`.
- A media grid of your own for an album → `Message.Media items` lays out 2–10 tiles.
- Media items without `width` / `height` → each tile falls back to 4 : 3 and crops; pass the natural size so the box is final before load (and the list never shifts).
- A rounded wrapper or a backing of your own around `Message.Media` → the message shell rounds and clips it.
- A video in a tile that autoplays, or your own `<video>` in a bubble → video tiles open your viewer (`onItemOpen`); one sound at a time is built in.
- Measuring a bubble or animating its height yourself → the bubble fits its content in CSS and the kit owns every size change of a message.
- A virtualizing list of your own around messages → put `Message.Group` in a `ScrollContainer anchor="end"`: it renders a window itself and keeps the reader's place.
- A context menu on a hover-only «…» button → `Message.Menu`: right click, long press and the keyboard open it.
- Checkboxes and selection handling of your own → `Message.Group selected` with `Message.SelectionBar`: click, Shift range and drag like DataTable rows.
- An enter animation of your own, or `scrollTop = scrollHeight` after a send → the group enters new messages and keeps the end itself; a hand-made one also plays on history loads.
- A new `key` for a message when the server confirms it → keep the client id as `key` and `value`; a re-keyed row is a new message and enters again.
- Marking messages read on arrival → `onRead` reports what was really on screen while the page was visible.
- «печатает…» as a text row you add and remove → `<Message.Typing active={typing} />` kept mounted: it enters and leaves smoothly.
- `scrollIntoView` to show a replied or found message → `Message.Reply target`, `current`: they scroll only the chat's own scroller and mark the message.
- Pausing other players by hand → one sound at a time is built into `VoicePlayer`, `VideoNote` and chat videos.
- A transcript as a separate `Message.Text`, or a height animation of your own around it → `transcript` / `onTranscribe` on `VoicePlayer` and `VideoNote`: the text opens inside the same message, in one stroke with its height.

## Related
- **Built from:** [Dropdown](../dropdown/COMPONENT.md) (`Message.Menu`), [Thumbnail](../thumbnail/COMPONENT.md), [Avatar](../avatar/COMPONENT.md) (`Avatar.Group` + `Avatar.Overflow` in reaction chips), [Button](../button/COMPONENT.md) (retry, selection bar, «к последним»), [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator` in selection mode), [Badge](../badge/COMPONENT.md), [Spinner](../spinner/COMPONENT.md) (pending transfers and transcripts), Icon (status ticks, file and media glyphs, pin, chevron, `action.transcribe`); `useVirtualRows` (the window), `internal/messagePart` (the contract of content parts), `internal/Disclosure` (the reactions row, transcripts), `bubbleMorph` (every size change as one stroke), `bubbleHug` (a bubble of text as wide as its widest line), `internal/transferDisk` (the transfer of media and a file), `internal/mediaPill` (the meta and duration pills), `internal/HighlightMatch` (search), `internal/mediaSession` (one sound at a time), `internal/transcript` (the transcript of a voice or video message)
- **See also:** [VideoNote](../video-note/COMPONENT.md) — the round video message; [VoicePlayer](../voice-player/COMPONENT.md) — the content of a voice message; [Composer](../composer/COMPONENT.md) — the input under the list; [ScrollContainer](../scroll-container/COMPONENT.md), [PageContent](../page-content/COMPONENT.md), [Timeline](../timeline/COMPONENT.md)
