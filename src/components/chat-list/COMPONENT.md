# ChatList

**Category:** messages
**Kind:** composite

> The conversation list of a messenger: the pane where the reader picks a dialog — avatar, name, time, the last message, counts, «печатает…» and drafts.

## When to use
- The left pane of a messenger, a support inbox, a sales inbox (Telegram, WhatsApp, Intercom): dialogs as data, the open one beside it in [Chat](../chat/COMPONENT.md).
- Any list of conversations with a last message: client chats in a CRM card, team channels, bot sessions.
- A long or growing inbox: hundreds of dialogs render only around the view, more load near the end (`hasMore`, `onLoadMore`).

## When not to use
- Records that are not conversations (tickets, letters, invoices) → use [List](../list/COMPONENT.md) — the same rows without the messenger parts.
- The messages of one conversation → use [Chat](../chat/COMPONENT.md) (`Chat.Messages`).
- App sections → use [Sidebar](../../layout/sidebar/COMPONENT.md); a choice of options → [Select](../select/COMPONENT.md).
- People compared by columns, sorted or selected in bulk → use [DataTable](../data-table/COMPONENT.md).

## Import
```tsx
import { ChatList, formatChatTime } from "prime-ui-kit";
```

## Anatomy
```
ChatList.Root                 <div> column filling its host (container `chat-list`); items, getKey, renderItem
├─ search field               Input type="search" — with search / defaultSearch / onSearchChange
├─ ScrollContainer            the list's own scroller; onReachEnd → onLoadMore while hasMore
│  └─ Crossfade               loading (placeholder List rows) ⇄ empty (EmptyPage compact) ⇄ the list
│     └─ List.Root <ul>       aria-label «Диалоги»; spacer <li aria-hidden> stand for rows out of view
│        └─ ChatList.Item     List.Item <li> + <button> | <a href>; current from value; one Tab stop
│           ├─ ChatList.ItemIcon         before the name: avatar slot (aria-hidden); after it: a glyph
│           ├─ ChatList.ItemText         the name; muted glyph after it
│           ├─ ChatList.ItemDescription  author · media word · text — cross-fades with draft and «печатает…»
│           ├─ (meta)                    delivery ticks · time
│           ├─ (badges)                  «@» · unread count · pin
│           └─ ChatList.ItemMenu         Dropdown.Content of the row, opened at the pointer
└─ VisuallyHidden live        «Загрузка диалогов», «Найдено: 4», «Ничего не найдено»
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ChatList.Root
`ref` → `HTMLDivElement`. The conversation list of a messenger: dialogs as data drawn by `renderItem`, the open one `value`, an optional search field, placeholders while loading, more on scroll. Draws no surface.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly T[]` | — (required) | Dialogs in the order to show: pinned first, then by the last message. Rows glide when it changes. |
| `getKey` | `(item: T) => string` | — (required) | A stable key of a dialog: the `value` of its row. |
| `renderItem` | `(item: T) => ReactElement` | — (required) | Renders a dialog as a `ChatList.Item` with its parts. |
| `value` | `string \| null` | — | The open dialog (controlled): the current fill and `aria-current`; `null` — none. |
| `defaultValue` | `string \| null` | `null` | The dialog open at first (uncontrolled). |
| `onValueChange` | `(value: string) => void` | — | The reader opened a dialog: a click, a tap, Enter or Space on its row. |
| `search` | `string` | — | The search query (controlled). Any of the triad shows the search field. |
| `defaultSearch` | `string` | — | The initial query (uncontrolled). |
| `onSearchChange` | `(search: string) => void` | — | The query changed: filter `items` by it; the rows mark the match in the name and the preview. |
| `loading` | `boolean` | `false` | The first load: placeholder rows in the rows' geometry (`aria-busy`), then a cross-fade into the dialogs. |
| `hasMore` | `boolean` | `false` | More dialogs exist: a placeholder row ends the list and `onLoadMore` runs near the end. |
| `onLoadMore` | `() => void \| Promise<void>` | — | The reader came near the end while `hasMore`: append the next dialogs. A promise is awaited before the next call. |
| `empty` | `ReactNode` | — | The empty state without a search (an `EmptyPage` with an action). Default: «Нет диалогов». |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Row tier: height, text, avatar, glyphs and the search field. |
| `now` | `Date` | — | «Now» for the times of the rows. Default: the moment of the render. |
| `formatTime` | `(date: Date, now: Date) => string` | `formatChatTime` | Display of a row's `Date` time: «14:32» today, «пн» this week, «12 мар», «12.03.2025». |
| `labels` | `Partial<ChatListLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other `div` attributes of the column. |

### ChatList.Item
`ref` → `HTMLElement` (the `<button>` or `<a>`, not the `<li>`). A dialog: a `List.Item` row with the avatar, the name and the time over the preview and the counts. Its key and `current` come from the root.

| Prop | Type | Default | Description |
|---|---|---|---|
| `time` | `Date \| string` | — | When the last message was sent: a `Date` shown with the root's `formatTime`, or the text to show. |
| `status` | `"sending" \| "sent" \| "read" \| "failed"` | — | Delivery of the reader's own last message: the clock, ✓, ✓✓ in the accent, or the failure mark — cross-fading. |
| `unread` | `number` | `0` | Unread messages: a solid count under the time (gray while `muted`); the number rolls. |
| `mention` | `boolean` | `false` | The reader is mentioned among the unread: an «@» beside the count. |
| `muted` | `boolean` | `false` | Notifications are off: a muted glyph beside the name and a gray count. |
| `pinned` | `boolean` | `false` | Pinned: a pin under the time while nothing is unread. Put pinned dialogs first in `items`. |
| `typing` | `boolean \| string` | `false` | The other side types: the preview cross-fades into «печатает…» in the accent; a name for a group («Анна печатает…»). |
| `draft` | `string` | — | The reader's unsent text: the preview shows «Черновик:» in danger and the text. |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Runs before the dialog opens; `preventDefault()` keeps it closed. |
| `href` | `string` | — | Renders an `<a>` instead of a `<button>` (a dialog with its own URL). |
| `target` | `string` | — | Where the `<a>` opens (`href` only). |
| `rel` | `string` | — | Relationship of the `<a>` (`href` only). |
| `children` | `ReactNode` | — | `ChatList.ItemIcon`, `ChatList.ItemText`, `ChatList.ItemDescription`, `ChatList.ItemMenu`. |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `className` and the native attributes of the row element. |

### ChatList.ItemIcon
`ref` → `HTMLSpanElement`. Before the name: the avatar slot (`aria-hidden`), an `Avatar.Root` sized by the row. After the name: a glyph beside it (verified, bot, group).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | An `Avatar.Root` (with `Avatar.Status`), or after the name an `Icon` with a `label`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other `span` attributes. |

### ChatList.ItemText
`ref` → `HTMLSpanElement`. The name of the dialog: one line, truncated, the glyphs after it kept whole; the search query is marked.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className`, `title` and the other `span` attributes. |

### ChatList.ItemDescription
`ref` → `HTMLSpanElement`. The preview of the last message, one line: «{author}: », a media word, the text; the search query is marked in the text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `author` | `string` | — | Who wrote it: «Вы» for the reader, a member's name in a group. |
| `kind` | `"photo" \| "video" \| "voice" \| "videoNote" \| "file" \| "location" \| "contact"` | — | The message is not text: its word («Фото», «Голосовое сообщение») leads the preview in the accent. |
| `duration` | `number` | — | Length of a voice or video message in seconds: «Голосовое сообщение 0:42». |
| `children` | `ReactNode` | — | The text: the message, a caption, a file name. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other `span` attributes. |

### ChatList.ItemMenu
`ref` → `HTMLDivElement`. The menu of a dialog: your `Dropdown.Item`s. Opens where the pointer is on right click and a long press, from the keyboard on Shift+F10 and the menu key.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `Dropdown.Item`s: Закрепить, Без звука, Отметить прочитанным, Удалить (`tone="danger"`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | — | Item tier of the menu. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `className` and the other attributes of the menu panel. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | List `xs` rows, 20 avatar, caption preview, 14 glyphs | a narrow side panel next to a busy screen | |
| `s` | List `s` rows, 24 avatar, caption preview | a compact inbox inside a card | |
| `m` | List `m` rows, 32 avatar, body-s preview, 14 glyphs | default: a support or sales inbox | yes |
| `l` | List `l` rows, 40 avatar, 16 glyphs | a messenger feel, touch-first screens | |
| `xl` | List `xl` rows, 48 avatar, 20 glyphs | a phone-first messenger | |

The search field takes the tier too; counts are one tier down (the Badge's own rule).

### Row content
| Value | Looks like | Use when | Default |
|---|---|---|---|
| text preview | muted line, brighter while `unread` | the last message is text | yes |
| `author` | «Вы: », «Дмитрий: » before the text | the reader's own message, a member of a group | |
| `kind` (+ `duration`) | «Фото», «Голосовое сообщение 0:42» in the accent, then the caption | the last message is media, a file, a place, a contact | |
| `draft` | «Черновик:» in danger, then the text | the reader left unsent text in the dialog | |
| `typing` | «печатает…» / «Анна печатает…» in the accent | the other side types now | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `unread` | solid blue count under the time; the number rolls | unread messages | `0` |
| `muted` | a muted glyph after the name; the count soft gray | notifications are off | `false` |
| `mention` | a solid «@» before the count | the reader is mentioned | `false` |
| `pinned` | a pin under the time while nothing is unread | pinned by the reader — order pinned first in `items` | `false` |
| `status` | ✓ / ✓✓ in the accent / clock / failure mark before the time | the reader wrote the last message | — |

## States
| State | Driven by | DOM |
|---|---|---|
| open | `value` / `defaultValue` | `aria-current="true"` on the row button (`"page"` on a link); List's current fill |
| focus | keyboard | one row `tabindex="0"`, the rest `-1`; List's focus ring inside the row |
| hover · pressed | pointer | List's `fill-subtle` wash (hover only under `@media (hover: hover)`) |
| unread | `unread > 0` | `data-unread="true"` on the row; preview in `text-secondary` |
| muted | `muted` | `data-muted="true"`; the count `soft` gray |
| typing · draft | `typing`, `draft` | `data-shown="typing" \| "draft" \| "preview"` on the preview; the layers cross-fade (`opacity`, `--prime-motion-duration-fast`), the hidden ones `aria-hidden` |
| delivery | `status` | `data-status` on a `role="img"` mark; the four ticks share one box and cross-fade |
| loading | `loading` | six placeholder `List` rows (`inert`, `aria-hidden`), the scroller `aria-busy`; cross-fade into the list |
| empty | `items` empty | `EmptyPage layout="compact"` («Нет диалогов» or `empty`); with a query «Ничего не найдено» |
| more | `hasMore` | one placeholder row after the list; `onLoadMore` near the end (`aria-busy` while its promise runs) |
| menu | right click, long press, Shift+F10 | the row's `ChatList.ItemMenu` in a `Dropdown` anchored at the point; `data-menu="true"` rows take no callout or text selection |
| reorder | a new order of `items` | rows glide from their old places (`transform`, `--prime-motion-duration-base`); new rows rise in (`enterMotion`); rows removed with nothing else changed close up in place |

Root attribute: `data-size`. Every motion honours reduced motion (durations collapse, glides and ghosts are skipped).

## Layout & spacing
- The root is a flex column that fills its host's height: put it straight into a `Card.Root` or a `PageContent.List` pane with a height; the scroller takes the rest under the search field.
- One inset all round, the panel's 4px: the search field and the rows stand 4px from every edge of the host, so in a card (radius 12) their 8px corners follow the card's (nested radius = outer − padding). Rows stand 4px apart (a margin inside each `<li>`, so the virtual window measures rows with their space); the last row's margin is the inset below it.
- A row: avatar · name and preview · time over the counts. The name and the preview truncate; glyphs, the time and the counts never do.
- From 100 dialogs only the rows around the view render; spacers hold the rest of the height. The row with the Tab stop and the row with an open menu stay rendered.
- The root is the `chat-list` container: below 240px the preview line and the time step out, the names and counts stay. At 320px (a phone) everything shows.
- On a coarse pointer a row is at least the touch target (List).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Enters the list at one stop — the open dialog (or where the focus was last); the next Tab leaves the list. |
| `↑` · `↓` | Moves the focus to the previous or next dialog; ↑ on the first goes to the search field. |
| `Home` · `End` | Moves the focus to the first or last dialog. |
| `Enter` · `Space` | Opens the focused dialog; a link row takes Enter only. |
| `Shift + F10` · `ContextMenu` | Opens the dialog's menu under the row. |
| `Escape` | In the search field clears the query; in the menu closes it and returns the focus to the row. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The list is a `<ul>` named «Диалоги» (`labels.list`); each row an `<li>` with a button, or a link with `href`.
- The open dialog is `aria-current="true"` on a button, `"page"` on a link. Selection does not follow the focus: arrows only move it (a dialog may load a conversation); Enter, Space and a click open.
- The row is named by its content: the name, glyphs with a `label` («Без звука», a verified mark), the preview, the delivery mark («Прочитано»), the time, then «упоминание» and «непрочитанных: 3» instead of the bare badges; the avatar is `aria-hidden`.
- While the other side types, the preview is `aria-hidden` and «печатает…» is read; a draft reads «Черновик: …».
- A row with a menu has `aria-keyshortcuts="Shift+F10"`; the menu is a `Dropdown` (`menu` / `menuitem`).
- The search field is `type="search"` named «Поиск по диалогам»; after a search a polite status says «Найдено: 4» or «Ничего не найдено».
- While loading the scroller is `aria-busy` and «Загрузка диалогов» is announced; placeholder rows are `inert` and `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `list` | `"Диалоги"` | `aria-label` of the list. |
| `search` | `"Поиск по диалогам"` | `aria-label` of the search field. |
| `searchPlaceholder` | `"Поиск"` | Placeholder of the search field. |
| `loading` | `"Загрузка диалогов"` | Announced while `loading`. |
| `empty` | `"Нет диалогов"` | The empty state without a search. |
| `noResults` | `"Ничего не найдено"` | The empty state of a search; announced. |
| `results` | `"Найдено: {count}"` | Announced after a search changes the list; `{count}` — the dialogs found. |
| `typing` | `"печатает…"` | The preview while the other side types. |
| `typingName` | `"{name} печатает…"` | The preview while a member of a group types; `{name}` — who. |
| `draft` | `"Черновик:"` | Before an unsent draft in the preview. |
| `unread` | `"непрочитанных: {count}"` | Spoken for the unread count; `{count}` — the number. |
| `mention` | `"упоминание"` | Spoken for the «@» mark. |
| `muted` | `"Без звука"` | Name of the muted glyph. |
| `pinned` | `"Закреплён"` | Name of the pin glyph. |
| `sending` | `"Отправляется"` | Name of the delivery mark: on its way. |
| `sent` | `"Отправлено"` | Name of the delivery mark: sent. |
| `read` | `"Прочитано"` | Name of the delivery mark: read. |
| `failed` | `"Не отправлено"` | Name of the delivery mark: failed. |
| `photo` | `"Фото"` | Media word: `kind="photo"`. |
| `video` | `"Видео"` | Media word: `kind="video"`. |
| `voice` | `"Голосовое сообщение"` | Media word: `kind="voice"`. |
| `videoNote` | `"Видеосообщение"` | Media word: `kind="videoNote"`. |
| `file` | `"Файл"` | Media word: `kind="file"`. |
| `location` | `"Геопозиция"` | Media word: `kind="location"`. |
| `contact` | `"Контакт"` | Media word: `kind="contact"`. |
| `menu` | `"Действия с диалогом"` | `aria-label` of the point the row menu opens from. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A support inbox: pinned dialogs first, the search, unread and muted counts, the typing line, a draft, delivery ticks and a row menu that pins, mutes, marks read and deletes after a confirm — `ChatList.Root`, `items`, `renderItem`, `value`, `onSearchChange`, `ChatList.Item`, `ChatList.ItemMenu`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: row height, text, avatar, glyphs and the search field follow the tier — `size`. |
| [structure.tsx](examples/structure.tsx) | Every piece of a row: a photo or initials with presence, a glyph beside the name, the author of the last message, media words with a length, a member typing in a group, ticks from sending to failed — `ChatList.ItemIcon`, `ChatList.ItemDescription`, `author`, `kind`, `duration`, `typing`, `status`. |
| [search.tsx](examples/search.tsx) | The search field filters dialogs by name and by the last message, marks the match in both, says how many were found and shows a quiet state when none match — `defaultSearch`, `onSearchChange`. |
| [live.tsx](examples/live.tsx) | A live inbox: a client types, then writes — the preview turns into the typing line and back, the count rolls up and the dialog glides to the top; opening it clears the count — `typing`, `unread`, `items`. |
| [long-list.tsx](examples/long-list.tsx) | A sales inbox of a thousand dialogs: only the rows around the view render, arrows walk through all of them, and the next page loads as the end comes near — `hasMore`, `onLoadMore`. |
| [links.tsx](examples/links.tsx) | Dialogs with their own address: every row is a link the router opens, the time reads as how long ago, and the list is named for its queue — `href`, `formatTime`, `labels`. |
| [states.tsx](examples/states.tsx) | Loading and empty: placeholder rows in the rows' geometry cross-fade into the dialogs; a new workspace without dialogs shows its own empty state with an action — `loading`, `empty`. |
| [controlled.tsx](examples/controlled.tsx) | The open dialog lives in the screen: a row opens it beside the list, and a next-unread button opens the next one from outside — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | At phone width long names and previews truncate while the time and counts stay whole; a pane squeezed under 240px keeps only the names and the counts — `ChatList.Root`, `search`. |

## Mistakes
- A dialog list hand-built from `List.Item` with a `Badge` count and a home-made «печатает…» → `ChatList.Item` with `unread`, `typing`, `draft`.
- Filtering inside `renderItem` (returning `null`) → filter `items`: the list counts, announces and glides by `items`.
- Pinned dialogs mixed into the time order → put them first in `items`; `pinned` only draws the pin.
- `onValueChange` used to mark a dialog read on focus → arrows only move the focus; mark read when the conversation shows it (`Chat.Messages onRead`) or on open.
- An `Avatar.Root size="s"` to fit the row → leave `size` out; the slot sizes the avatar to the tier.
- A «⋯» button nested inside the row for the menu → `ChatList.ItemMenu`: it opens on right click, a long press and Shift+F10.
- Deleting from the menu without a question → open a `ConfirmDialog` from the menu item.

## Related
- **Built from:** [List](../list/COMPONENT.md) (rows, current fill, focus, touch height), [Input](../input/COMPONENT.md) (search), [ScrollContainer](../scroll-container/COMPONENT.md), [Crossfade](../crossfade/COMPONENT.md), [Skeleton](../skeleton/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Badge](../badge/COMPONENT.md) (counts), [Dropdown](../dropdown/COMPONENT.md) (row menu), [Dnd](../dnd/COMPONENT.md) (the glide of a new order)
- **See also:** [Chat](../chat/COMPONENT.md), [Message](../message/COMPONENT.md), [Avatar](../avatar/COMPONENT.md), [PageContent](../page-content/COMPONENT.md), [ConfirmDialog](../confirm-dialog/COMPONENT.md)
