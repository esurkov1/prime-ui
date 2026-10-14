# Chat

**Category:** messages
**Kind:** composite

> A conversation, assembled: the header with who it is with, search, pinned messages, the virtualized message list with dates, runs, selection and jumps, typing, and the Composer at the bottom.

## When to use
- A messenger screen: support chat with a client, a team chat, a deal's conversation — `Chat.Root` with the header, the messages and the footer.
- A list of messages without the rest (comments shown as a chat, a read-only history): `Chat.Root` with `Chat.Messages` alone — the same list, with its window, jumps and read receipts.
- Messages from application data: `Chat.Messages items` with `renderMessage` adds the dates, the runs, the unread band and every message's `value` and `position`, and renders again only what changed.

## When not to use
- One message on its own, or a bubble in a card → [Message](../message/COMPONENT.md).
- A feed of events with a time axis (an order history, an audit log) → [Timeline](../timeline/COMPONENT.md).
- Photos in a post or a comment outside a chat → [Gallery](../gallery/COMPONENT.md).
- The input alone → [Composer](../composer/COMPONENT.md).

## Import
```tsx
import { Chat, Composer, Message, groupMessages, formatMessageDate, hueOf } from "prime-ui-kit";
```

## Anatomy
```
Chat.Root                         <div> column, fills its host; owns selection, search, typing, jumps
├─ Chat.Header                    grid: lead · title over description · actions
│  ├─ [lead]                      every other child (a back button, an Avatar), side by side
│  ├─ Chat.Title                  <h2>, names the list (aria-labelledby)
│  ├─ Chat.Description            status line, cross-fades into «печатает…» while `typing`
│  └─ Chat.Actions                a call, a Dropdown of more
│     └─ Chat.SearchButton        ghost icon Button (aria-pressed) that opens / closes Chat.Search
├─ Chat.Search                    while the search is open: field · «2 из 5» · older · newer
├─ Chat.Pinned                    rail · pin · title over one line · unpin; a press jumps to the message
├─ Chat.Messages                  the scroller (anchor="end") and the list: role="log" (a listbox while selecting)
│  ├─ [first-load placeholders]   Skeleton bubbles on both sides in the list's place while `loading`
│  ├─ [older placeholder]         a Skeleton bubble above the first message while `hasOlder`
│  ├─ Chat.Separator              a date pill, sticky at the top of its day (from `items`, or yours)
│  ├─ Chat.Service                an event of the chat, centered pill
│  ├─ Chat.Unread                 «Непрочитанные сообщения» band (`unread`)
│  ├─ Message.Root                a message row (see Message)
│  ├─ Message.Typing              «печатает…» bubble at the end (from `Chat.Root typing`, or yours)
│  ├─ Chat.SelectionBar           «Выбрано: N», your actions, «Отмена» — while selecting
│  └─ [«к последним» Button]      sticky round button + Badge count while away from the end
└─ Chat.Footer                    the Composer
```
`Chat.Root` holds the state and hands it to its parts through context; the parts render where you put them. The list (`Chat.Messages`) is the kit's one message list: a list without the full chat is `Chat.Root` with `Chat.Messages` alone, so there is never a second list to keep in step. Without `items`, every top-level child of `Chat.Messages` is a row — a `Message.Root` (or a fragment with one; a component of your own standing for a message carries its `value` as `key` and may pass `direction`), `Chat.Separator`, `Chat.Service`, `Chat.Unread` — except `Message.Typing` and `Chat.SelectionBar`, which close the list; the typing bubble of `Chat.Root typing` closes it unless you put one. Messages talk to the list through `internal/messageList` (the selection store, the row registration, jumps, read receipts, the quick reaction), never by importing it. The search reads the text each message's content parts declare (`Message.Text`, a voice message's and a circle's transcript) from the rows' props — nothing is read from the DOM, so it finds messages the window does not render.

### A messenger, end to end

```tsx partial
<Chat.Root typing={peerTyping} selected={selected} onSelectedChange={setSelected}>
  <Chat.Header>
    <Avatar.Root color={hueOf(peer.id)}>…</Avatar.Root>
    <Chat.Title>{peer.name}</Chat.Title>
    <Chat.Description>в сети</Chat.Description>
    <Chat.Actions>
      <Chat.SearchButton />
    </Chat.Actions>
  </Chat.Header>
  <Chat.Search />
  <Chat.Pinned items={pinned} onRemove={unpin} />
  <Chat.Messages
    items={messages}
    getKey={(message) => message.id}
    getAuthor={(message) => message.authorId}
    getDate={(message) => message.sentAt}
    renderMessage={renderMessage}
    hasOlder={hasOlder}
    onLoadOlder={loadOlder}
    onRead={(values) => socket.read(values)}
  />
  <Chat.Footer>
    <Composer.Root onSend={send} />
  </Chat.Footer>
</Chat.Root>
```

- Send optimistically: add the message with `status="sending"` under a client id and return from `onSend`; patch the status as the server answers. Keep its key when the server id arrives — the row stays the same element, so it never enters twice and the ticks cross-fade.
- The list needs nothing to animate: it decides itself which message is new at the end, scrolls to your own message, keeps the end, or counts new ones on the «к последним» button.
- `renderMessage` may be an inline function: an item renders again only when it or its place changes, so whatever a row shows lives in its item (an edit, a reaction, a pin). Another message (a reply's original) comes from `entry.find(key)`.
- `onRead` reports an incoming message once at least half of it, or half the view, has been on screen while the page is visible (`IntersectionObserver`); batched per frame, each `value` once per mount.
- One sound at a time on the page: a `VoicePlayer`, a `VideoNote` and a video in `Message.Media` pause each other; nothing to wire.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Chat.Root
`ref` → `HTMLDivElement`. The chat frame: owns the selection, the search, the typing signal and jumps, and hands them to its parts. A column that fills its host's height; every part but `Chat.Messages` is optional.

| Prop | Type | Default | Description |
|---|---|---|---|
| `selected` | `readonly string[] \| null` | — | Selection mode (controlled): the `value`s of the selected messages, `null` while not selecting. Any of the triad adds «Выбрать» to every `Message.Menu`; without it the chat has no selection. |
| `defaultSelected` | `readonly string[] \| null` | `null` | Initial selection (uncontrolled). |
| `onSelectedChange` | `(selected: readonly string[] \| null) => void` | — | The selection changed: a message toggled, selection started from the menu (`[value]`) or ended (`null`). |
| `search` | `string \| null` | — | The search query (controlled); `null` — the search bar is closed. Matches in the messages' text and transcripts are marked; the newest is current. |
| `defaultSearch` | `string \| null` | `null` | The initial search (uncontrolled). |
| `onSearchChange` | `(search: string \| null) => void` | — | The search opened (`""`), changed its query or closed (`null`). |
| `jumpTo` | `string \| null` | `null` | A message to jump to (a link, a notification): on change the chat brings it to the middle and the message itself blinks. The focus stays where it is; while the search is open its current match takes this place. |
| `typing` | `boolean` | `false` | The other side is typing: `Chat.Description` cross-fades into «печатает…» and the list ends with the typing bubble (`Message.Typing`), which gives way at once to the reply that ends it. |
| `labels` | `Partial<ChatLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">` | — | `className` and the other attributes of the frame. |

### Chat.Header
`ref` → `HTMLDivElement`. The top of the chat: who it is with. The title over the description and the actions at the end; every other child (a back button, an `Avatar`) leads the row, side by side in the order written.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (a `PageContent.BackButton`, an `Avatar`, `Chat.Title`, `Chat.Description`, `Chat.Actions`), `className`. |

### Chat.Title
`ref` → `HTMLHeadingElement`. Who the chat is with, one line that ellipsizes; it also names the message list (`aria-labelledby`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"h2" \| "h3" \| "h4"` | `"h2"` | Heading level that fits the page outline (the look does not change). |
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children` (the name), `className`. |

### Chat.Description
`ref` → `HTMLDivElement`. The status line under the title («в сети», «3 участника»); while the other side types (`Chat.Root typing`) it cross-fades into «печатает…» in the accent, and back.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the status), `className`. |

### Chat.Actions
`ref` → `HTMLDivElement`. The buttons at the end of the header: `Chat.SearchButton`, a call, a `Dropdown` of more.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the buttons), `className`. |

### Chat.SearchButton
`ref` → `HTMLButtonElement`. Opens and closes the search bar: a ghost icon `Button`, pressed while the search is open, named `labels.search`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "aria-pressed">` | — | `onClick` (runs first; `preventDefault` keeps the search as it is), `className`. |

### Chat.Search
`ref` → `HTMLDivElement`. The search bar, shown while the search is open: the field (focused as it opens), the place of the current match («2 из 5») and the steps to the older and newer match.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other attributes. |

### Chat.Pinned
`ref` → `HTMLDivElement`. The pinned messages above the conversation: a rail of segments, the title over one line of the message and an optional unpin button. A press jumps to the message, then steps to the next older one.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly { value: string; text: string }[]` | — (required) | The pinned messages, oldest first: the `value` of each `Message.Root` and one line of it («Фото», «Голосовое сообщение» for media). |
| `value` | `string` | — | The pinned message shown (controlled). |
| `defaultValue` | `string` | the last item | The one shown first (uncontrolled): the newest. |
| `onValueChange` | `(value: string) => void` | — | The shown message changed: a press stepped to the next older one (the oldest wraps to the newest). |
| `onSelect` | `(value: string) => void` | — | A press on the bar, after the chat has jumped to the message: load it when it is not in the list yet. |
| `onRemove` | `(value: string) => void` | — | Unpin the shown message: a ghost close button at the end. Without it no button. |
| `labels` | `Partial<ChatPinnedLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "defaultValue" \| "onSelect">` | — | `className` and the other attributes. |

### Chat.Messages
`ref` → `HTMLDivElement` (the log). The message list in its own scroller, rendering only the rows near the view. Rows come from `items` (dates, runs and the unread band added for you) or from children; it keeps the end and the reader's place itself.

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `"direct" \| "group"` | `"direct"` | `direct` — a conversation of two; `group` — many authors, with the author's header and avatar on each run. |
| `items` | `readonly T[]` | — | Messages as application data, in time order: the list adds the dates, the runs and the unread band and sets each message's `value` and `position`. Without it, children are the rows. |
| `getKey` | `(item: T) => string` | — | A stable key of an item (with `items`): also its message's `value`. Keep it when the server confirms a sent message. |
| `getAuthor` | `(item: T) => string` | — | Who wrote an item (an id, with `items`): a change of author starts a new run. |
| `getDate` | `(item: T) => Date` | — | When an item was sent (with `items`): a new day gets a date. |
| `renderMessage` | `(item: T, entry: ChatMessageEntry<T>) => ReactElement` | — | Renders an item: a `Message.Root` or a `Chat.Service`; `entry` — `{ position, showAuthor, showAvatar, find }`, `find(key)` gives another item (a reply's original). Runs again only for an item whose data or place changed. |
| `isService` | `(item: T) => boolean` | — | An event of the chat, not a message: it stands alone and breaks the runs around it. |
| `unread` | `string` | — | The key of the first unread item: the «Непрочитанные сообщения» band stands above it. |
| `groupWindow` | `number` | `5` | Messages of one author further apart than this many minutes start a new run. |
| `now` | `Date` | today | «Today» for the dates. |
| `formatDate` | `(date: Date, now: Date) => string` | `formatMessageDate` | The label of a date. |
| `loading` | `boolean` | `false` | The first load: bubble-shaped `Skeleton`s on both sides stand in the list's place (`aria-busy`, `labels.loading` announced), then cross-fade into the messages; none of them counts as new. |
| `hasOlder` | `boolean` | `false` | Older history exists: a bubble-shaped placeholder stands above the first message and `onLoadOlder` runs when the reader reaches the top. |
| `onLoadOlder` | `() => void \| Promise<void>` | — | Load older messages and prepend them (while `hasOlder`); the reader's place is kept. |
| `quickReaction` | `string \| false` | `"👍"` | The reaction of a double tap (and `L`) on a message: puts it or takes it back through `onReactionToggle`. `false` — off. |
| `reactionOptions` | `readonly { emoji: string; label: string }[]` | 👍 🔥 🤣 👌 🤔 😢 😱, then 7 more | The reactions of the bar above a message (long press, long hover or `R`): the first seven in a row, «⌄» opens the rest. `label` names each toggle button. |
| `reader` | `MessageUser` | — | The reader (`{ id, name: «Вы», src?, color? }`): a reaction they put shows them among the chip's avatars at once, before the data comes back; matched by `id`. |
| `onNewMessage` | `(value: string, details: { direction: "incoming" \| "outgoing" }) => void` | — | A message was added at the end after mount, sent or received: for a sound, a counter, a title badge. Not called for the first render, history or a message put back in the middle. |
| `onRead` | `(values: string[]) => void` | — | Incoming messages the reader has seen (at least half on screen while the page is visible); batched per frame, each `value` once per mount. Send read receipts from here. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `aria-label` (the list's name when the header has no `Chat.Title`, default `labels.messages`), `className` and the other attributes of the log; `children` — rows, `Chat.SelectionBar`, `Message.Typing`. |

### Chat.SelectionBar
`ref` → `HTMLDivElement`. The bar of selection mode (`role="toolbar"`), a child of `Chat.Messages` sticky at its bottom: «Выбрано: N», your actions and «Отмена». Renders nothing outside selection.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` — the actions (`Button.Root size="s"`: Переслать, Удалить), `className`. |

### Chat.Separator
`ref` → `HTMLDivElement`. A date between messages (`items` add them for you) («Сегодня», «12 марта» — `formatMessageDate`): a pill in the middle that stays at the top while its day scrolls.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the date), `className`. |

### Chat.Service
`ref` → `HTMLDivElement`. An event of the chat, not a message («Анна добавила Олега»): a centered pill that wraps; a row, never a message (with `items`, render it for an `isService` item).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the event), `className`. |

### Chat.Unread
`ref` → `HTMLDivElement`. «Непрочитанные сообщения»: a band across the list above the first unread message (`unread` of `Chat.Messages items` puts it there).

| Prop | Type | Default | Description |
|---|---|---|---|
| `labels` | `Partial<ChatUnreadLabels>` | — | `unread` — the text of the band. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes. |

### Chat.Footer
`ref` → `HTMLDivElement`. The bottom of the chat, under the messages: the `Composer`, padded to the chat's edges.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (a `Composer.Root`), `className`. |

## Variants

### type
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `direct` | no author header, no avatar gutter | a conversation of two | yes |
| `group` | the first message of a run opens with `Message.Author` (name in the author's hue, `Message.AuthorIcon`, `tag`), the last one shows `Message.Avatar`; incoming rows keep the avatar's gutter | many authors | |

### Flags
| Prop | Effect |
|---|---|
| `Chat.Root typing` | the description turns into «печатает…» and the list ends with the typing bubble |
| `Chat.Messages loading` | the first load: bubble-shaped placeholders in the list's place, cross-fading into the messages |
| `Chat.Messages hasOlder` | a placeholder above the first message; `onLoadOlder` at the top |
| `Chat.Messages quickReaction` | the emoji of a double tap and `L` (default «👍», `false` — off); a double click that selected text puts none, and selection mode adds nothing |
| `Chat.Messages reactionOptions` | the reactions of the reaction bar, seven in its row, the rest glide open behind «⌄»; the bar floats above the message on a long press (with the menu), after a long hover on pointer devices (~500 ms, the bar alone) or on `R` |
| `Chat.Messages reader` | the reader as a `MessageUser`: joins a chip's avatars at once when they put a reaction |

## States
| State | Driven by | DOM |
|---|---|---|
| new, mine | an outgoing message added at the end after the list mounted (decided from the data, never from a row that mounts) | `data-enter="outgoing"` on the article for one play: the message column floats up `--prime-space-3` from below into its place and fades in (`fast`, enter easing, `transform` + `opacity` only; the row box clips it). Nothing else moves; scrolled away, the scroller glides to the end |
| new, theirs | an incoming message added at the end | `data-enter="incoming"`: the same float-up and fade; scrolled away, the «к последним» button counts it. Arriving with the end of the typing, it takes the typing's place — the typing goes at once |
| not new | the first render, history prepended, a message put back in the middle, a row the window renders as it scrolls into view, a status or text change | nothing moves. Reduced motion makes every enter instant |
| away from the end | the reader scrolled up | a round soft «к последним» button at the bottom-end, rising in (`fast`); a `Badge` counts incoming messages that came meanwhile; a press glides to the end — from far away it lands one view before the end first — and stops when the reader scrolls; at the end it leaves and the count resets |
| first load | `Chat.Messages loading` | the messages' region is `aria-busy`: six `Skeleton` bubbles in the message geometry (the bubble's radius, one or two lines of body text in its padding, widths within its cap), on alternating sides at the end of the list, a group chat's incoming ones beside a circle in the avatar's gutter; `labels.loading` is announced politely. When it ends they cross-fade into the list (`Crossfade`: the new state in `base`, the placeholders out in `fast`); the list mounts then, so what it shows is its first render — nothing enters, nothing is reported new |
| older history | `hasOlder` | a bubble-shaped `Skeleton` above the first message; reaching it calls `onLoadOlder`; the rows that arrive above keep the reader's place |
| jumped to | `Message.Reply target`, `Chat.Pinned`, `jumpTo` | the list brings the message to the middle (a near one glides, a far one lands at once — rendering it first — and settles once its neighbours have laid out); the message itself steps back and comes forward three times, the others stay still (opacity 1 → `--prime-message-dim-opacity` → 1, `base` each) — `data-pointing="a"` / `"b"` on the list, flipped on every jump so a repeated jump restarts it, and `data-pointed` on the message; a reply's target also takes the focus, a `jumpTo` change leaves it where it is. While the search is open its current match takes the place of `jumpTo`. Reduced motion: no blink, the others stand back for a moment |
| search | `search` (the bar open) | every case-insensitive match in the messages' text and transcripts under a soft accent wash (`<mark>`); the newest match is current: brought into view while the others stay back (`data-pointing="current"`); Enter and the older / newer buttons move the full strength to the older or newer match in one step; «2 из 5» or «Нет совпадений» beside the field |
| typing | `typing` | the description cross-fades into «печатает…» in the accent (`Crossfade`); the typing bubble enters at the end of the list like an incoming message and leaves closing its height |
| pinned | `Chat.Pinned items` | the rail's current segment in the accent; a press jumps to the message and steps the bar to the older one (the oldest wraps to the newest), its line entering; without items the bar renders nothing |
| selection mode | `selected` (not `null`); any of `selected` / `defaultSelected` / `onSelectedChange` adds «Выбрать» to every `Message.Menu` | listbox / options with `aria-selected`; a check at the row start; a click toggles, Shift+click selects the range from the anchor, press-and-drag (or a finger slid from a check) paints the messages it passes with the first one's new state and scrolls the list at its edges; the unselected messages step back to `--prime-message-dim-opacity` with a slight desaturation (`fast`, both ways; `data-selecting` on the list, `data-selected` on the message); `Chat.SelectionBar` — the «к последним» button rises above it first (its height in `--message-bottom-bar` on the list, `fast`), then the bar fades in, so the two never overlap; outside selection the bar renders nothing |

## Layout & spacing
- `Chat.Root` is a column that fills its host's height (`block-size: 100%`, a flex item that grows): give the host a height — a `Card` sized by the page, a page pane, the viewport. Only `Chat.Messages` grows and scrolls; the header, the search, the pinned bar and the footer keep their height.
- The header sorts its children by type: `Chat.Title`, `Chat.Description` and `Chat.Actions` take their places, every other child (fragments opened) goes into the lead, a row centred with `space-2` between its items — a back button and an avatar stand side by side; without them the text starts the row.
- The header: `space-3` top and end, `space-2` bottom, `space-4` start; `space-3` between its columns; the title `title-s` on one line that ellipsizes, the description a muted caption; the actions keep their width, so at 320px the title gives way.
- The search bar and the pinned bar stand under the header with `space-3` side padding; the footer pads the Composer by `space-2` / `space-3`.
- The list pads its own sides (`space-2`), so the focus rings of the bubbles fit; every row is a container: a bubble is at most `--prime-message-max-width` and 85% of the chat.
- Gaps between runs `--prime-message-gap` (16), inside a run `--prime-message-group-gap` (8).
- The window: only the rows around the view render, in normal flow between two spacers whose nodes stay while the window moves (sticky dates keep working; the date of the day in view stays rendered). Each row is measured once (one shared `ResizeObserver`) and cached by key; until then it stands at an estimate its message gives from its props (a picture from its aspect, a text from its length). The scroller keeps the first element in view still when anything above it changes (history loaded, rows measured, a message that grows in place) — one correction before paint — never moves a row with a transform, and the window pins rows it must keep: a jump target, the focused message, a playing player.
- The «к последним» button is a zero-height sticky row at the end of the list: it floats over the last messages at `space-3` from the bottom-end and takes no room.
- Only text selects: the list and every message are `user-select: none`, the text-bearing parts opt back in.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Enters the list on the last (or last focused) message, then its buttons and links |
| `↑` · `↓` | Moves to the previous / next message |
| `Home` · `End` | Moves to the first / last message |
| `Space` · `Shift+Space` | In selection mode toggles the focused message; with Shift the range from the last toggled |
| `Enter` | In the search field goes to the older match; on a message opens its menu; in selection mode toggles the message (`Shift+Enter` — the range) |
| `L` · `R` | On a focused message: the quick reaction / the reaction bar (see Message) |
| `ContextMenu` · `Shift+F10` | Opens the focused message's menu |
| `Escape` | In the search field closes the search and returns the focus to `Chat.SearchButton`; in the list leaves selection mode |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The list is `role="log"`: new messages are announced politely; its name is `Chat.Title` (`aria-labelledby`), else `labels.messages`, or your `aria-label`. It is one tab stop; the messages carry `aria-posinset` / `aria-setsize`, so the keyboard reaches rows the window does not render. In selection mode it is a `listbox` with `aria-multiselectable`, the messages `option`s with `aria-selected`.
- `Chat.SearchButton` is a toggle (`aria-pressed`); the search field takes the focus as it opens and keeps it while the chat steps through matches; the place of the match («2 из 5», «Нет совпадений») is announced politely.
- `Chat.Pinned` is a button named by its content, the title and the line («Закреплённое 2 из 3» + the text); the rail is decorative; «Открепить» is a separate button.
- The «к последним» button is named «К последним сообщениям», with the count «Новых сообщений: N. …»; the badge is `aria-hidden`.
- `Chat.SelectionBar` is a `toolbar` named by the count «Выбрано: N», which is announced politely as it changes.
- The quick reaction (double tap, `L`) is announced politely.
- One sound at a time on the page: a voice message, a video note and a chat video pause each other.
- «Печатает…» in the header is visible text; in the list the typing bubble is a polite `status` «Собеседник печатает».
- While `loading` the messages' region is `aria-busy`, the placeholders are `aria-hidden`, and «Загрузка сообщений» (`labels.loading`) is announced politely.
- A message reached by a jump or the current search match is not announced as such: a reply's target takes the focus, a search keeps it in its field; the others stepping back is visual only.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### Chat.Root

| Key | Default | Used for |
|---|---|---|
| `selectedCount` | `"Выбрано: {count}"` | The count of the selection bar. |
| `cancel` | `"Отмена"` | The selection bar's button that leaves selection. |
| `scrollToEnd` | `"К последним сообщениям"` | The name of the round button that goes to the newest message. |
| `newMessages` | `"Новых сообщений: {count}. К последним сообщениям"` | The name of that button while new messages wait below. |
| `typing` | `"печатает…"` | The status line of the header while the other side types. |
| `search` | `"Поиск по переписке"` | The search button and the name of the search field. |
| `searchPlaceholder` | `"Поиск по сообщениям"` | The placeholder of the search field. |
| `matches` | `"{index} из {count}"` | The place of the current match, counted from the newest. |
| `noMatches` | `"Нет совпадений"` | The search found nothing. |
| `previousMatch` | `"Предыдущее совпадение"` | The button that goes to the older match. |
| `nextMatch` | `"Следующее совпадение"` | The button that goes to the newer match. |
| `messages` | `"Переписка"` | The name of the list when the header has no `Chat.Title`. |
| `unread` | `"Непрочитанные сообщения"` | The text of the «unread» band: `Chat.Root labels` for rows from `items`, `Chat.Unread labels` for a hand-placed band. |
| `loading` | `"Загрузка сообщений"` | Announced politely while the conversation loads for the first time (`Chat.Messages loading`). |

#### Chat.Pinned

| Key | Default | Used for |
|---|---|---|
| `pinned` | `"Закреплённое сообщение"` | `Chat.Pinned labels`: the title with one pinned message. |
| `pinnedOf` | `"Закреплённое {index} из {count}"` | `Chat.Pinned labels`: the title with several, the newest last. |
| `unpin` | `"Открепить"` | `Chat.Pinned labels`: the name of the unpin button. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A complete team messenger over two thousand messages: the header whose status turns into typing, search with highlight, pinned messages, history that loads above, author headers with tags in a group chat, every kind of message, transcripts, reactions, the menu with reply, edit, pin and select, jumps, the new-messages button and the Composer whose messages rise into the list — `Chat.Root`, `Chat.Header`, `Chat.Search`, `Chat.Pinned`, `Chat.Messages`, `type`, `items`, `renderMessage`, `typing`, `selected`, `Chat.Footer`. |
| [structure.tsx](examples/structure.tsx) | The list alone, written as parts: `Chat.Root` with only `Chat.Messages`, a date that stays on top while its day scrolls, an event of the chat and the unread band — `Chat.Messages`, `Chat.Separator`, `Chat.Service`, `Chat.Unread`. |
| [group-chat.tsx](examples/group-chat.tsx) | A team chat from data: the first message of an author's run opens with the name in the author's hue, a crown for the owner and the member's tag; the avatar — a photo, or initials — closes the run, which holds messages up to a quarter of an hour apart; the dates carry the weekday — `type`, `items`, `renderMessage`, `groupWindow`, `formatDate`, `Message.Author`, `tag`, `Message.AuthorIcon`, `hueOf`. |
| [reactions.tsx](examples/reactions.tsx) | A team's own reactions for approvals: a double tap or `L` puts the approval mark, a long press or `R` opens the team's set, and a chip toggles them back — `quickReaction`, `reactionOptions`, `onReactionToggle`. |
| [live.tsx](examples/live.tsx) | A live support chat: the client types — the header and the end of the list say so — then answers; new messages enter at the end, read receipts come from what is on screen, and scrolled up the round button counts what arrived — `typing`, `onNewMessage`, `onRead`. |
| [search.tsx](examples/search.tsx) | Search and pinned messages: the search bar marks every match in the texts and transcripts, counts them and steps between them while the others step back; a pinned message's press jumps to it and blinks it — `Chat.SearchButton`, `Chat.Search`, `defaultSearch`, `Chat.Pinned`. |
| [states.tsx](examples/states.tsx) | The first load of a conversation: bubble-shaped placeholders on both sides stand in the list's place, then cross-fade into the messages — `loading`. |
| [controlled.tsx](examples/controlled.tsx) | Selection mode owned by the screen: the Select item of a message's menu starts it, a check stands beside every message, a press toggles one while the others step back, the bar counts and acts, Escape leaves — `selected`, `onSelectedChange`, `Chat.SelectionBar`. |
| [narrow.tsx](examples/narrow.tsx) | At phone width the header keeps its actions and lets the title ellipsize, bubbles take up to 85% of the chat, long links wrap and an album keeps its layout — `Chat.Root`, `Chat.Header`, `Chat.Messages`, `Chat.Footer`. |
| [screen.tsx](examples/screen.tsx) | A support messenger as a work screen: the title and the unread count in the app header, the dialogs with a search over them beside the conversation (one pane at a time on a phone), history that loads above as you scroll up, the unread band, reply and edit from the menu, the typing signal both ways, unread counts from what was seen, and the Composer whose messages rise into the list while the client answers — `items`, `renderMessage`, `hasOlder`, `onLoadOlder`, `typing`. |

## Mistakes
- A header, a search bar and a scroller of your own around the messages → `Chat.Header`, `Chat.Search`, `Chat.Messages`: the chat wires typing, search, jumps and selection between them.
- A spinner or grey boxes of your own while a dialog loads → `Chat.Messages loading`: bubbles in the messages' geometry that cross-fade into the list.
- A `ScrollContainer` or a virtualizing list of your own around messages → `Chat.Messages` scrolls itself and renders a window, keeping the reader's place.
- Dates, runs and the unread band built by hand → `Chat.Messages items` with `getKey`, `getAuthor`, `getDate`; `groupMessages` if you build rows yourself.
- A row that shows state kept outside its item (an edit, a pin held in a separate set) → put it into the item: rows render again only when their item or place changes.
- A ref mirror of the messages to find a reply's original → `entry.find(key)`.
- `Message.Author` and `Message.Avatar` only on some messages → put them on every message of a group chat: the message shows the header on the first of a run and the avatar on the last.
- An enter animation of your own, or `scrollTop = scrollHeight` after a send → the list enters new messages and keeps the end itself; a hand-made one also plays on history loads.
- A new key for a message when the server confirms it → keep the client id: a re-keyed row is a new message, enters again and calls `onNewMessage` again.
- Marking messages read on arrival → `onRead` reports what was really on screen while the page was visible.
- «печатает…» as a text you swap in the header and a row you add to the list → `Chat.Root typing`: both move together, smoothly.
- Search results computed and scrolled to by hand → `Chat.Search`: it finds, counts, marks and brings matches into view, the focus staying in the field.
- `scrollIntoView` to show a pinned or quoted message → `Chat.Pinned` and `Message.Reply target` jump in the chat's own scroller and point at the message.
- Checkboxes and selection handling of your own → `Chat.Root selected` with `Chat.SelectionBar`: click, Shift range and drag like DataTable rows.

## Related
- **Built from:** [Message](../message/COMPONENT.md) (`Message.Typing`, the rows), [ScrollContainer](../scroll-container/COMPONENT.md) (the scroller, `anchor="end"`), [Input](../input/COMPONENT.md) (the search field), [Button](../button/COMPONENT.md) (search, steps, unpin, «к последним», the selection bar), [Badge](../badge/COMPONENT.md), [Crossfade](../crossfade/COMPONENT.md) (the status line, the first load), [Skeleton](../skeleton/COMPONENT.md) (the first load, older history), [VisuallyHidden](../visually-hidden/COMPONENT.md) (the loading announcement), Icon (`action.search`, `nav.chevronUp`, `nav.chevronDown`, `action.pin`, `action.close`); `useVirtualRows` (the window), `internal/messageList` (the contract between the list and its messages), `internal/readReceipts`, `internal/useRangeSelection` (selection by click, Shift and drag), `internal/messagePart` (the search query its texts mark)
- **See also:** [Message](../message/COMPONENT.md) — one message and every content part; [Composer](../composer/COMPONENT.md) — the input in `Chat.Footer`; [Gallery](../gallery/COMPONENT.md), [VoicePlayer](../voice-player/COMPONENT.md), [VideoNote](../video-note/COMPONENT.md), [Timeline](../timeline/COMPONENT.md)
