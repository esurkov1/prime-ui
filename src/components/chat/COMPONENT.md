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
Chat.Root                         <div> column, fills its host; owns selection, search, typing, jumps; `variant` pane | inline
├─ Chat.Header                    grid: lead · title over badges over description · actions; draws nothing of its own
│  ├─ [lead]                      every other child (a back button, an Avatar), side by side
│  ├─ Chat.Title                  <h2>, names the list (aria-labelledby); `number` muted after the name
│  ├─ Chat.Badges                 Badge.Group on the title's line, «+N»: the record's statuses (meaning by tone)
│  ├─ Chat.Description            status line, cross-fades into «печатает…» while `typing`
│  └─ Chat.Actions                frame tier: icon buttons, a Select / SegmentedControl, a ⋯ Dropdown
│     └─ Chat.SearchButton        ghost icon Button (aria-pressed) that opens / closes Chat.Search
├─ Chat.Search                    while open, or always (`persistent`): [your control] · field (its end, once typed: older · newer · «2/5» badge)
├─ Chat.Pinned                    rail · pin · title over one line · unpin; a press jumps to the message
├─ Chat.Messages                  the scroller (anchor="end") and the list: role="log" (a listbox while selecting)
│  ├─ [first-load placeholders]   Skeleton bubbles on both sides in the list's place while `loading`
│  ├─ [older placeholder]         a Skeleton bubble above the first message while `hasOlder`
│  ├─ Chat.Separator              a date pill, sticky at the top of its day (from `items`, or yours)
│  ├─ Chat.Service                an event of the chat, a centered pill; the time at its end
│  │  ├─ Chat.ServiceIcon         the glyph before the text (aria-hidden)
│  │  └─ Chat.ServiceChange       `from` › `to` (two Badge.Root), read as «с «Лид» на «Арендатор»»
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
- What happened to the conversation's record (an agent took the client, a stage changed, a manager joined) goes into the list as `Chat.Service` rows — the same items, marked by `isService`, at their time. Events in a row stand as one group; a new one at the end rises in like a message.
- Embedded in a padded host (a drawer tab, a `Card.Body`, a split pane with side padding): `Chat.Root variant="inline"` drops the chat's own insets so it stands on the host's content edges; the host gives it a height.
- Times in a profile's zone: `timeZone` (an IANA name) on `Chat.Messages` moves the date separators, the runs and every message's time to it; without it they follow the browser.

### Header recipes

The header draws nothing by itself; compose it from parts, leave out what you do not need.

- A messenger contact: `Avatar.Root` · `Chat.Title` · `Chat.Description` («в сети», cross-fades into «печатает…» with `typing`) · `Chat.Actions` with `Chat.SearchButton`.
- A phone pane under a list: `Page.BackButton` first in the lead, then the avatar.
- A record (a client, a deal, a ticket): two lines — `Chat.Title number="#4120"` with `Chat.Badges` after it on the same line, and a `Chat.Description` under them (a `StatusDot` first, then the owner); the stage is a `Select` in `Chat.Actions`, never a badge that opens a menu. At a phone's width the badges collapse into «+N» and the title ellipsizes; keep the actions few there (one ⋯ `Dropdown` holding the rest).
- Actions, in this order: one switcher for the whole chat (a `Select` of the channel, a `SegmentedControl`), ghost icon buttons each named and with a `Tooltip` (a call, an AI toggle with `pressed`, `Chat.SearchButton`), a ⋯ `Dropdown` last. They take the tier of the chat's frame.
- No search button: `Chat.Search persistent` keeps the field under the header; a channel `Select.Root` as its child stands before the field.
- No header at all (the host's own header names the record, as in a drawer tab): leave `Chat.Header` out and name the list with `aria-label` on `Chat.Messages`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Chat.Root
`ref` → `HTMLDivElement`. The chat frame: owns the selection, the search, the typing signal and jumps, and hands them to its parts. A column that fills its host's height; every part but `Chat.Messages` is optional.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"pane" \| "inline"` | `"pane"` | How the chat stands in its host: `pane` — inset from its own edges (a pane `Card` with no zones, a page pane); `inline` — flush with the content edges of a padded host (a `Drawer.Body`, a `Tabs.Panel`, a `Card.Body`). |
| `selected` | `readonly string[] \| null` | — | Selection mode (controlled): the `value`s of the selected messages, `null` while not selecting. Any of the triad adds «Выбрать» to every `Message.Menu`; without it the chat has no selection. |
| `defaultSelected` | `readonly string[] \| null` | `null` | Initial selection (uncontrolled). |
| `onSelectedChange` | `(selected: readonly string[] \| null) => void` | — | The selection changed: a message toggled, selection started from the menu (`[value]`) or ended (`null`). |
| `search` | `string \| null` | — | The search query (controlled); `null` — the search bar is closed. Matches in the messages' text and transcripts are marked; the newest is current. |
| `minSearchLength` | `number` | `2` | How many characters a query needs (trimmed) before it is searched: a shorter one marks, counts and steps nothing. |
| `defaultSearch` | `string \| null` | `null` | The initial search (uncontrolled). |
| `onSearchChange` | `(search: string \| null) => void` | — | The search opened (`""`), changed its query or closed (`null`). |
| `jumpTo` | `string \| null` | `null` | A message to jump to (a link, a notification): on change the chat brings it to the middle and the message itself blinks. The focus stays where it is; while the search is open its current match takes this place. |
| `typing` | `boolean` | `false` | The other side is typing: `Chat.Description` cross-fades into «печатает…» and the list ends with the typing bubble (`Message.Typing`), which gives way at once to the reply that ends it. |
| `labels` | `Partial<ChatLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">` | — | `className` and the other attributes of the frame. |

### Chat.Header
`ref` → `HTMLDivElement`. The top of the chat, the kit's header row: the title with its badges on one line, the description under it, the actions at the end; other children (a back button, an `Avatar`) lead the row. One line each, no line under it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (a `Page.BackButton`, an `Avatar`, `Chat.Title`, `Chat.Badges`, `Chat.Description`, `Chat.Actions`), `className`. |

### Chat.Title
`ref` → `HTMLHeadingElement`. Who the chat is with, one line that ellipsizes; it also names the message list (`aria-labelledby`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `number` | `ReactNode` | — | The record's number («#4120»), muted after the name and part of it: the name ellipsizes, the number never. |
| `as` | `"h2" \| "h3" \| "h4"` | `"h2"` | Heading level that fits the page outline (the look does not change). |
| `…rest` | `HTMLAttributes<HTMLHeadingElement>` | — | `children` (the name), `className`. |

### Chat.Badges
`ref` → `HTMLDivElement`. The record's badges on the title's line, 6 px after it, one `Badge.Group` (meaning by `tone` or `color`). The title gives way first, then the rest folds into «+N». A picker is a `Select` in `Chat.Actions`, not a badge.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (`Badge.Root`), `className`. |

### Chat.Description
`ref` → `HTMLDivElement`. The status line under the title («в сети», «3 участника») in one line cut with an ellipsis; a `StatusDot` first is allowed; while the other side types (`Chat.Root typing`) it cross-fades into «печатает…» in the accent, and back.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the status), `className`. |

### Chat.Actions
`ref` → `HTMLDivElement`. The controls at the end of the header, at the frame's tier: ghost icon buttons (`Chat.SearchButton`, a toggle with `pressed`), a `Select` or a `SegmentedControl`, a ⋯ `Dropdown` last.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the controls), `className`. |

### Chat.SearchButton
`ref` → `HTMLButtonElement`. Opens and closes the search bar: a ghost icon `Button`, pressed while the search is open, named `labels.search`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "aria-pressed">` | — | `onClick` (runs first; `preventDefault` keeps the search as it is), `className`. |

### Chat.Search
`ref` → `HTMLDivElement`. The search bar: your control and the field; once a query of `minSearchLength` is typed the field's end holds the steps to the older and newer match and the count («2/5»). Shown while open, or always with `persistent`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `persistent` | `boolean` | `false` | The bar is always there, with no `Chat.SearchButton`: the field shows from the start and never takes the focus by itself; an empty field is no search (`search` is `null`), Escape clears the query. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` — one control before the field at its tier (a channel `Select.Root`, its own width, at most half the row); `className` and the other attributes. |

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
| `group` | `boolean` | `false` | A group chat of many authors: the first message of a run shows the author's header, the last one the avatar, and incoming messages keep the avatar's gutter. Without it a conversation of two. |
| `authors` | `"none" \| "incoming" \| "outgoing" \| "all"` | `"none"` | Several writers, no avatars: the first message of a run on the named side (`incoming`, `outgoing`, `all`) shows the author's header; no avatar, no gutter. Ignored with `group`. |
| `items` | `readonly T[]` | — | Messages as application data, in time order: the list adds the dates, the runs and the unread band and sets each message's `value` and `position`. Without it, children are the rows. |
| `getKey` | `(item: T) => string` | — | A stable key of an item (with `items`): also its message's `value`. Keep it when the server confirms a sent message. |
| `getAuthor` | `(item: T) => string` | — | Who wrote an item (an id, with `items`): a change of author starts a new run. |
| `getDate` | `(item: T) => Date` | — | When an item was sent (with `items`): a new day gets a date. |
| `renderMessage` | `(item: T, entry: ChatMessageEntry<T>) => ReactElement` | — | Renders an item: a `Message.Root` or a `Chat.Service`; `entry` — `{ position, showAuthor, showAvatar, find }`, `find(key)` gives another item (a reply's original). Runs again only for an item whose data or place changed. |
| `isService` | `(item: T) => boolean` | — | An event of the chat, not a message: it stands alone and breaks the runs around it. |
| `unread` | `string` | — | The key of the first unread item: the «Непрочитанные сообщения» band stands above it. |
| `groupWindow` | `number` | `5` | Messages of one author further apart than this many minutes start a new run. |
| `now` | `Date` | today | «Today» for the dates. |
| `timeZone` | `string` | the browser's zone | The IANA zone of the date separators, the runs and every message time (`"Asia/Vladivostok"`): a profile's zone, not the browser's. |
| `formatDate` | `(date: Date, now: Date, timeZone?: string) => string` | `formatMessageDate` | The label of a date; gets the `timeZone`. |
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
`ref` → `HTMLDivElement`. A date between messages (`items` add them for you) («Сегодня», «12 марта» — `formatMessageDate`): a muted chip in the flow; a pill stuck at the top while a person scrolls its day, until the next date pushes it out; at rest it covers no row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the date), `className`. |

### Chat.Service
`ref` → `HTMLDivElement`. An event of the chat, not a message: a centered pill that wraps — `Chat.ServiceIcon`, the words, `Chat.ServiceChange`, the time. A row (for an `isService` item): the arrows, the selection and the search pass it by; events in a row stand as one group.

| Prop | Type | Default | Description |
|---|---|---|---|
| `time` | `Date \| string` | — | When it happened: a `Date` shown with `formatTime` (and put in `<time dateTime>`), or the text to show; muted, at the end of the pill. |
| `timeZone` | `string` | the list's `timeZone`, else the browser's zone | The zone `time` is read in. |
| `formatTime` | `(date: Date, timeZone?: string) => string` | «09:05» | Display of a `Date` time; gets the `timeZone` in force. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the event: words, `Chat.ServiceIcon`, `Chat.ServiceChange`, a link), `className`. |

### Chat.ServiceIcon
`ref` → `HTMLSpanElement`. The glyph before an event's text (who or what acted): an `Icon` at the caption's size, muted, `aria-hidden` — the words name it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (an `Icon`), `className`. |

### Chat.ServiceChange
`ref` → `HTMLSpanElement`. A value that changed inside an event: `from` › `to`, two `Badge.Root` with your colours as a rule. It wraps as one unit; assistive tech hears one phrase, «с «Лид» на «Арендатор»» (`labels.change`), the drawing is hidden.

| Prop | Type | Default | Description |
|---|---|---|---|
| `from` | `ReactNode` | — (required) | The value before (a `Badge.Root`); its text fills `{from}`. |
| `to` | `ReactNode` | — (required) | The value after; its text fills `{to}`. |
| `labels` | `Partial<ChatServiceChangeLabels>` | — | `change` — the phrase assistive tech hears. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes. |

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

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `pane` | the header, the search, the pinned bar and the footer inset from the chat's own edges | the chat is the whole content of a pane `Card` (a `Card.Root` with no zones) or a page pane | yes |
| `inline` | no insets of its own: the zones stand on the host's content edges, the messages reach 16 into its side padding | the chat sits in a padded host — a `Drawer.Body` or a `Tabs.Panel` of a dialog, a `Card.Body` | |

### authors
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | no author header | one writer per side | yes |
| `incoming` | the first incoming message of a run shows `Message.Author`; no avatar, no gutter | several people write from the other side (a client's group) | |
| `outgoing` | the first outgoing message of a run shows `Message.Author` | your side has several writers (an operator, an AI agent) | |
| `all` | both sides head their runs | several writers on both sides | |

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
| `Chat.Search persistent` | the search bar is always there, with no `Chat.SearchButton`; an empty field is no search, Escape clears it |

## States
| State | Driven by | DOM |
|---|---|---|
| new, mine | an outgoing message added at the end after the list mounted (decided from the data, never from a row that mounts) | `data-enter="outgoing"` on the article for one play: the message column floats up `--prime-space-3` from below into its place and fades in (`fast`, enter easing, `transform` + `opacity` only; the row box clips it). Nothing else moves; scrolled away, the scroller glides to the end |
| new, theirs | an incoming message added at the end | `data-enter="incoming"`: the same float-up and fade; scrolled away, the «к последним» button counts it. Arriving with the end of the typing, it takes the typing's place — the typing goes at once |
| not new | the first render, history prepended, a message put back in the middle, a row the window renders as it scrolls into view, a status or text change | nothing moves. Reduced motion makes every enter instant |
| away from the end | the reader scrolled up | a round soft «к последним» button at the bottom-end, rising in (`fast`); a `Badge` counts incoming messages that came meanwhile; a press glides to the end — from far away it lands one view before the end first — and stops when the reader scrolls; at the end it leaves and the count resets |
| first load | `Chat.Messages loading` | the messages' region is `aria-busy`: six `Skeleton` bubbles in the message geometry (the bubble's radius, one or two lines of body text in its padding, widths within its cap), on alternating sides at the end of the list, a group chat's incoming ones beside a circle in the avatar's gutter; `labels.loading` is announced politely. When it ends they cross-fade into the list (`Crossfade`: the new state in `base`, the placeholders out in `fast`); the list mounts then, so what it shows is its first render — nothing enters, nothing is reported new |
| older history | `hasOlder` | a bubble-shaped `Skeleton` above the first message; reaching it calls `onLoadOlder`; the rows that arrive above keep the reader's place |
| jumped to | `Message.Reply target`, `Chat.Pinned`, `jumpTo` | the list brings the message to the middle (a near one glides, a far one lands at once — rendering it first — and settles once its neighbours have laid out); the message itself steps back and comes forward three times, the others stay still (opacity 1 → the dimmed opacity of `Message` → 1, `base` each) — `data-pointing="a"` / `"b"` on the list, flipped on every jump so a repeated jump restarts it, and `data-pointed` with the same `data-blink` on the message; a reply's target also takes the focus, a `jumpTo` change leaves it where it is. While the search is open its current match takes the place of `jumpTo`. Reduced motion: no blink, the others stand back for a moment |
| query typed | `search` at least `minSearchLength` (2) characters, trimmed; a shorter one marks, counts and shows nothing | the field's end gets, in one order in every state, the two steps (`Input.Action`, `aria-disabled` under two matches) and last the count badge (`Badge.Root`: blue «2/5», gray «0/0» when none — the live region says «Нет совпадений»; each number rolls on its own (`RollingNumber`) as the reader steps; its slot is as wide as «12/48», so the steps never move); they rise in (`partPresence`) and close up in place when the query is cleared or falls under the minimum |
| search | `search` (the bar open) | every case-insensitive match in the messages' text and transcripts under a soft accent wash (`<mark>`); the newest match is current: brought into view while the others stay back (`data-pointing="current"`); Enter and the older / newer buttons move the full strength to the older or newer match in one step; «2 из 5» or «Нет совпадений» beside the field |
| new event | a `Chat.Service` (or a `Chat.Unread`) added at the end after the list mounted, decided from the row keys as messages are | its row floats up `--prime-space-1` and fades in once (`enterMotion.enter`, `fast`; reduced motion keeps the fade). Not on the first render, history or a row the window renders as it scrolls into view |
| date stuck | a `Chat.Separator` held at the top of the scroller by `position: sticky` while its day scrolls under it (read from the layout boxes once per scroll frame or resize, never from painted ones, so a row gliding by changes nothing) | `data-stuck` on the separator: its pill turns into a surface one step above the bubbles and lifts with the overlay shadow (`fast`, both ways); in the flow among the messages it is a caption chip on `--prime-color-fill-muted`, like an event's, with no shadow. Stuck, the row reaches back over the scroller's top padding, so it meets the scroller's edge and no strip of a message shows above the pill. As the next day's date reaches it, the stuck pill is pushed up and out by how far the two rows overlap (`translate` on the pill) |
| date shown while scrolling | a person scrolls the conversation (a wheel, touch, pointer or key, then the scroll it makes) until the view has stood still a moment; a scroll the kit makes (opening at the end, a jump) is none | `data-scroll` on the list: `"moving"` shows the stuck pill (`fast`), `"settled"` lets it linger `slow` and fade (`base`); without it, a stuck pill is not shown. At rest a stuck date covers nothing — not the first row of its day (an event, a message) when a short conversation opens a little scrolled. The dates in the flow are always shown |
| hidden pane | the list's pane hidden (`display: none`, an inactive tab of the app) and shown again, or the browser tab left and come back to | nothing moves: a hidden list has no layout, so no row, date or glide is measured or played; shown again, every row and date stands where the layout puts it |
| events in a row | consecutive `Chat.Service` rows | one group: `--prime-message-group-gap` between them, the row's `space-3` only around the group |
| typing | `typing` | the description cross-fades into «печатает…» in the accent (`Crossfade`); the typing bubble enters at the end of the list like an incoming message and leaves closing its height |
| pinned | `Chat.Pinned items` | the rail's current segment in the accent; a press jumps to the message and steps the bar to the older one (the oldest wraps to the newest), its line entering; without items the bar renders nothing |
| selection mode | `selected` (not `null`); any of `selected` / `defaultSelected` / `onSelectedChange` adds «Выбрать» to every `Message.Menu` | listbox / options with `aria-selected`; a check at the row start; a click toggles, Shift+click selects the range from the anchor, press-and-drag (or a finger slid from a check) paints the messages it passes with the first one's new state and scrolls the list at its edges; the unselected messages step back to the dimmed opacity of `Message` with a slight desaturation (`fast`, both ways; `data-selecting` on the list, `data-selected` on the message); `Chat.SelectionBar` — the «к последним» button rises above it first (its height upward in `--message-bottom-lift` on the list, `fast`), then the bar fades in, so the two never overlap; outside selection the bar renders nothing |

## Layout & spacing
- `Chat.Root` is a column that fills its host's height (`block-size: 100%`, a flex item that grows): give the host a height — a pane `Card` sized by the page, a page pane, the viewport. Only `Chat.Messages` grows and scrolls; the header, the search, the pinned bar and the footer keep their height.
- The header sorts its children by type: `Chat.Title`, `Chat.Description` and `Chat.Actions` take their places, every other child (fragments opened) goes into the lead, a row centred with `space-2` between its items — a back button and an avatar stand side by side; without them the text starts the row.
- The header is the kit's header row at the frame of the chat's host tier (padding 12 · 16 · 20 · 24 · 28, no line under it): the lead (back button, avatar) is the mark; the title in the frame's title role on one line whose name ellipsizes while its `number` keeps its width, the badges 6 px after it on the same line, the description under them in the frame's description role, one line; the actions keep their width, so at 320px the title gives way. Messages dissolve at their top edge while scrolled (the edge cue).
- The search bar and the pinned bar stand under the header with `space-3` side padding, `space-2` under the header's line; the count and the steps are the field's own end parts, so the bar has no spacing of its own beyond its gap; it never overflows: the field gives way first down to `space-20` × 2, then a control before it ellipsizes (between `space-16` and half the row), and in a chat under 20rem the control takes its own line above the field; the footer pads the Composer by `space-2` / `space-3`.
- `variant="inline"`: the header has no padding but `space-3` under it, the search bar and the pinned bar no side padding, the footer only `space-2` above; the messages' region reaches `space-4` into the host's side padding (the room of the scroller and the rows, so a focused row's wash and the rings of the controls inside fit), so a bubble's tail stands on the host's content edge under the header's text. The host needs at least `space-4` side padding and a height.
- A conversation shorter than the pane hugs the end: the empty space is above it and the last message stands right above the footer; a longer one is pinned to the end and scrolls up for history.
- The list pads its own sides (`space-2`), so a focused message's row wash and the rings of the controls inside fit; every row is a container: a bubble is at most `--prime-message-max-width` and 85% of the chat.
- Gaps between runs `--prime-message-gap` (16), inside a run `--prime-message-group-gap` (8).
- A date and an event stand in `space-3` above and below; their pill is a caption on `--prime-color-fill-muted`, `space-1` / `space-3` padding, never wider than a bubble. An event's content is inline and wraps as text: each part (`Chat.ServiceIcon`, `Chat.ServiceChange`, the time) is a box one caption line high; the change wraps as one unit and, wider than the pill, breaks around its arrow. Its content takes the compact tier (`compactTier`), so a change's badges are `xs` and the pill keeps one line's height.
- The window: only the rows around the view render, in normal flow between two spacers whose nodes stay while the window moves (sticky dates keep working; the date of the day in view stays rendered). Each row is measured once (one shared `ResizeObserver`) and cached by key; until then it stands at an estimate its message gives from its props (a picture from its aspect, a text from its length). The scroller keeps the first element in view still when anything above it changes (history loaded, rows measured, a message that grows in place) — one correction before paint — never moves a row with a transform, and the window pins rows it must keep: a jump target, the focused message, a playing player. A row that changes its height has one motion, whatever changed it: the scroller anchors the view (a message keeps its bottom — or its top for a transcript — on screen), then everything around it that moved on screen glides once from where it was seen, on the message clock, as one block — in a long list and in a short one pushed to the end of its pane alike. A reaction, an edit or a transcript plays it through the message's morph; a picture that loads or any other change in place through the list (`rowGlide`). A date stuck at the top never moves; the changed row itself stands at its new size.
- The «к последним» button is a zero-height sticky row at the end of the list: it floats over the last messages at `space-3` from the bottom-end and takes no room.
- Only text selects: the list and every message are `user-select: none`, the text-bearing parts opt back in.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Enters the list on the last (or last focused) message, then its buttons and links |
| `↑` · `↓` | Moves to the previous / next message; in the search field, with matches, goes to the older / newer match |
| `Home` · `End` | Moves to the first / last message |
| `Space` · `Shift+Space` | In selection mode toggles the focused message; with Shift the range from the last toggled |
| `Enter` | In the search field goes to the older match (`Shift+Enter` — the newer); on a message opens its menu; in selection mode toggles the message (`Shift+Enter` — the range) |
| `L` · `R` | On a focused message: the quick reaction / the reaction bar (see Message) |
| `ContextMenu` · `Shift+F10` | Opens the focused message's menu |
| `Escape` | In the search field closes the search and returns the focus to `Chat.SearchButton` (`persistent`: clears the query); in the list leaves selection mode |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The list is `role="log"`: new messages are announced politely; its name is `Chat.Title` (`aria-labelledby`), else `labels.messages`, or your `aria-label`. It is one tab stop; the messages carry `aria-posinset` / `aria-setsize`, so the keyboard reaches rows the window does not render. In selection mode it is a `listbox` with `aria-multiselectable`, the messages `option`s with `aria-selected`.
- `Chat.SearchButton` is a toggle (`aria-pressed`); the search field takes the focus as it opens and keeps it while the chat steps through matches; the place of the match («2 из 5», «Нет совпадений») is announced politely from a live region mounted with the bar, the visible count is `aria-hidden`.
- `Chat.Pinned` is a button named by its content, the title and the line («Закреплённое 2 из 3» + the text); the rail is decorative; «Открепить» is a separate button.
- The «к последним» button is named «К последним сообщениям», with the count «Новых сообщений: N. …»; the badge is `aria-hidden`.
- `Chat.SelectionBar` is a `toolbar` named by the count «Выбрано: N», which is announced politely as it changes.
- `Chat.Service` is a row of the log, not a message: no `article`, no place in the arrows' order or the selection; its text (with the change's phrase) is what the log announces when an event arrives.
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
| `searchPlaceholder` | `"Поиск"` | The placeholder of the search field. |
| `matches` | `"{index} из {count}"` | The place of the current match, counted from the newest. |
| `matchCount` | `"{index}/{count}"` | The count badge at the field's end, each number rolling; no match shows «0/0». |
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

#### Chat.ServiceChange

| Key | Default | Used for |
|---|---|---|
| `change` | `"с «{from}» на «{to}»"` | `Chat.ServiceChange labels`: the change as assistive tech hears it; `{from}`, `{to}` — the text of each value. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A complete team messenger over two thousand messages: the header whose status turns into typing, search with highlight, pinned messages, history that loads above, author headers with tags in a group chat, every kind of message, transcripts, reactions, the menu with reply, edit, pin and select, jumps, the new-messages button and the Composer whose messages rise into the list — `Chat.Root`, `Chat.Header`, `Chat.Search`, `Chat.Pinned`, `Chat.Messages`, `group`, `items`, `renderMessage`, `typing`, `selected`, `Chat.Footer`. |
| [variants.tsx](examples/variants.tsx) | The same conversation as a card's whole content, inset from its own edges, and as the content of a padded card body, flush with its edges — `variant`. |
| [structure.tsx](examples/structure.tsx) | The list alone, written as parts: `Chat.Root` with only `Chat.Messages`, a date that stays on top while its day scrolls, an event of the chat and the unread band — `Chat.Messages`, `Chat.Separator`, `Chat.Service`, `Chat.Unread`. |
| [events.tsx](examples/events.tsx) | What happened to the client, right in the dialog: who took it, a stage it moved to, a manager who joined; events in a row stand as one group, a new one rises in at the end — `isService`, `Chat.Service`, `Chat.ServiceIcon`, `Chat.ServiceChange`, `time`. |
| [group-chat.tsx](examples/group-chat.tsx) | A team chat from data: the first message of an author's run opens with the name in the author's hue, a crown for the owner and the member's tag; the avatar — a photo, or initials — closes the run, which holds messages up to a quarter of an hour apart; the dates carry the weekday — `group`, `items`, `renderMessage`, `groupWindow`, `formatDate`, `Message.Author`, `tag`, `Message.AuthorIcon`, `hueOf`. |
| [authors.tsx](examples/authors.tsx) | A client's group in a messenger, one conversation with several writers on both sides: two people of the client and, on yours, an operator and an AI agent; the first message of every run names its author, with no avatars — `authors`, `items`, `renderMessage`, `Message.Author`, `tag`. |
| [reactions.tsx](examples/reactions.tsx) | A team's own reactions for approvals: a double tap or `L` puts the approval mark, a long press or `R` opens the team's set, and a chip toggles them back — `quickReaction`, `reactionOptions`, `onReactionToggle`. |
| [live.tsx](examples/live.tsx) | A live support chat: the client types — the header and the end of the list say so — then answers; new messages enter at the end, read receipts come from what is on screen, and scrolled up the round button counts what arrived — `typing`, `onNewMessage`, `onRead`. |
| [search.tsx](examples/search.tsx) | Search and pinned messages: the search bar marks every match in the texts and transcripts, counts them and steps between them while the others step back; a pinned message's press jumps to it and blinks it — `Chat.SearchButton`, `Chat.Search`, `defaultSearch`, `Chat.Pinned`. |
| [persistent-search.tsx](examples/persistent-search.tsx) | Search with no button in the header: the field is there from the start, and the count and the steps between matches appear only once a query is typed — `persistent`, `Chat.Search`. |
| [channel-search.tsx](examples/channel-search.tsx) | A channel picker in the search bar: one control of the field's height stands before it and filters the conversation, the search finds within what it shows — `Chat.Search`, `Select.Root`. |
| [header.tsx](examples/header.tsx) | A conversation with a client as a record header of two lines: the avatar, the name with its number and a badge on one line, the AI's state and the owner under it, and at the end the stage picker, the AI switch, search and ⋯ — `Chat.Title`, `number`, `Chat.Badges`, `Chat.Description`, `Chat.Actions`. |
| [inline.tsx](examples/inline.tsx) | The dialog tab of a deal card: the chat stands flush with the edges of the panel's body, with no insets of its own, and takes its whole height under the panel's own record header — `variant`, `Chat.Root`, `Drawer.Body`, `Tabs.Panel`. |
| [time-zone.tsx](examples/time-zone.tsx) | The conversation in the zone of the manager's profile, not the browser's: the date separators, the runs and every time follow it — `timeZone`, `items`, `renderMessage`. |
| [states.tsx](examples/states.tsx) | The first load of a conversation: bubble-shaped placeholders on both sides stand in the list's place, then cross-fade into the messages — `loading`. |
| [controlled.tsx](examples/controlled.tsx) | Selection mode owned by the screen: the Select item of a message's menu starts it, a check stands beside every message, a press toggles one while the others step back, the bar counts and acts, Escape leaves — `selected`, `onSelectedChange`, `Chat.SelectionBar`. |
| [narrow.tsx](examples/narrow.tsx) | At phone width the header keeps its actions and lets the title ellipsize, bubbles take up to 85% of the chat, long links wrap and an album keeps its layout — `Chat.Root`, `Chat.Header`, `Chat.Messages`, `Chat.Footer`. |
| [screen.tsx](examples/screen.tsx) | A support messenger as a work screen: the title and the unread count in its top bar, the dialogs with a search over them beside the conversation (one pane at a time on a phone), history that loads above as you scroll up, the unread band, reply and edit from the menu, the typing signal both ways, the request's events (an agent took it, its status moved, you joined) between the messages, unread counts from what was seen, and the Composer whose messages rise into the list while the client answers — `items`, `renderMessage`, `isService`, `hasOlder`, `onLoadOlder`, `typing`. |

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
- A chat in a drawer tab or a `Card.Body` with its own insets doubling the host's padding, or a `className` that zeroes them → `Chat.Root variant="inline"`.
- A search field of your own above the chat, or `defaultSearch=""` to hold the bar open → `Chat.Search persistent`; a channel picker as a row of its own above it → the picker as the child of `Chat.Search`.
- A picker of a stage or an assignee as a badge that opens a menu → a `Select` in `Chat.Actions`; the description stays one line of data.
- Search results computed and scrolled to by hand → `Chat.Search`: it finds, counts, marks and brings matches into view, the focus staying in the field.
- A chat event as a `Message.Root` from «system», or a `Notification` → `Chat.Service`: a row of the list, outside the arrows, the selection and the search.
- A change written as «Лид → Арендатор» in the text → `Chat.ServiceChange from to`: the values keep their colours and assistive tech hears «с «Лид» на «Арендатор»».
- `scrollIntoView` to show a pinned or quoted message → `Chat.Pinned` and `Message.Reply target` jump in the chat's own scroller and point at the message.
- Checkboxes and selection handling of your own → `Chat.Root selected` with `Chat.SelectionBar`: click, Shift range and drag like DataTable rows.

## Related
- **Built from:** [Message](../message/COMPONENT.md) (`Message.Typing`, the rows), [ScrollContainer](../scroll-container/COMPONENT.md) (the scroller, `anchor="end"`), [Input](../input/COMPONENT.md) (the search field; its end: `Input.Action` the steps), [StatusDot](../status-dot/COMPONENT.md) (the description's state), [Badge](../badge/COMPONENT.md) (`Chat.Badges` is a `Badge.Group`; the search count), [Button](../button/COMPONENT.md) (search, unpin, «к последним», the selection bar), [Crossfade](../crossfade/COMPONENT.md) (the status line, the first load), [Skeleton](../skeleton/COMPONENT.md) (the first load, older history), [VisuallyHidden](../visually-hidden/COMPONENT.md) (the loading announcement, the phrase of a change), Icon (`action.search`, `nav.chevronUp`, `nav.chevronDown`, `nav.chevronRight`, `action.pin`, `action.close`); `useVirtualRows` (the window), `internal/messageList` (the contract between the list and its messages), `internal/readReceipts`, `internal/useRangeSelection` (selection by click, Shift and drag), `internal/messagePart` (the search query its texts mark), `internal/partPresence` (the count and the steps), `internal/RollingNumber` (the count's numbers), `internal/fieldClasses` + `ControlSizeContext` (the actions' tier), `internal/headerRow` (the header row), `internal/surfaceFrame` (the frame metrics and roles), StatusDot (the description's state)
- **See also:** [Message](../message/COMPONENT.md) — one message and every content part; [Composer](../composer/COMPONENT.md) — the input in `Chat.Footer`; [Gallery](../gallery/COMPONENT.md), [VoicePlayer](../voice-player/COMPONENT.md), [VideoNote](../video-note/COMPONENT.md), [Timeline](../timeline/COMPONENT.md)
