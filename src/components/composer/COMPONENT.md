# Composer

**Category:** messages
**Kind:** composite

> The message input of a chat: a field that grows from one line, Enter to send, attachments, a reply / edit bar, Markdown formatting of a selection, and voice or round video messages from the same button.

## When to use
- The bottom of a conversation: support chat, comments on an order, a team thread, a chat with a bot.
- Short messages sent one after another, where Enter sends and Shift+Enter breaks the line.
- Replies to a message, edits of your own, files and voice notes in the same place.
- A messenger: `onSend` carries `replyTo` / `editOf`, `onActivityChange` feeds the other side's «печатает…», and `Chat.Messages` shows what was sent with the outgoing appearance motion; put the Composer in `Chat.Footer`.

## When not to use
- A form field for a long text saved with the form (a description, a comment in a form) → use [Textarea](../textarea/COMPONENT.md).
- One line of search or a command → use [Input](../input/COMPONENT.md) or [CommandMenu](../command-menu/COMPONENT.md).
- A rich document editor with headings and tables → a dedicated editor; the composer writes plain Markdown.
- Uploading documents to a record without a message → use [FileUpload](../file-upload/COMPONENT.md).

## Import
```tsx
import { Composer, type ComposerActivity, type ComposerMessage, useUploadQueue } from "prime-ui-kit";
```

## Anatomy
```
Composer.Root                  <form>: the column below, one tier for every part
├─ (video preview)             round camera preview (VideoNote geometry, Skeleton until the camera answers, progress ring to 60 s, `weight="band"`)
├─ (tray)                      Crossfade of `queue`: opens and closes with a fade and a height glide
│  ├─ (strip)                  FileUpload.Queue layout="strip": one row of tiles — photos, videos and
│  │                           files in tray order; format pill, remove ×, name · size band, upload disk + ring, reorder
│  └─ (as files)               Checkbox «Отправить как файлы, без сжатия» (with photos or videos)
├─ Composer.Context            reply / edit bar: glyph · accent rule · text · close Button
│  ├─ Composer.Title           «Ответ Анне», «Редактирование»
│  └─ Composer.Description     the quoted message, one line
├─ (recording error)           Hint, role="alert"
└─ (row)                       one grid row, always: auto · minmax(0, 1fr) · auto, bottom-aligned
   ├─ Composer.Attach          paperclip: FileUpload trigger="button", or a Dropdown of kinds
   │  └─ Composer.Item         a kind of attachment (accept), with Composer.ItemIcon
   ├─ (field)                  Textarea.Root rows={1} maxRows={8}, no focus ring (the caret shows focus)
   │  └─ (toolbar)             floating role="toolbar" over a selection: 7 ghost Buttons with Tooltip + Kbd
   ├─ (recording bar)          over the paperclip and the field cells: delete · pause Buttons · pulsing
   │                           dot (a pause glyph while paused) · timer · live waveform canvas (locked),
   │                           or dot · timer · «Влево — отмена» (held)
   └─ (action Button)          send ↔ record ↔ save; the glyphs turn into one another
      └─ (lock pill)           above it while a recording is held: slide up to lock
```
`Composer.Attach` may stand anywhere among the children, inside a fragment or a wrapper component: it renders itself into the start cell of the row (a portal), so the paperclip, the field and the button are always one row. Everything else stands above the row. Without it the row is field and button only.

Sending is an async event (`SKILL/api-contract.md`, Events):

```tsx
const queue = useUploadQueue({ upload: sendFile });
<Composer.Root
  queue={queue}
  onSend={({ text, albums, files }) =>
    api.post(chatId, {
      text,
      albums: albums.map((album) => album.map((item) => ({ type: item.type, id: item.result }))),
      files: files.map((item) => item.result),
    })
  }
  onSendVoice={({ blob, durationMs, waveform }) => api.voice(chatId, blob, durationMs, waveform)}
>
  <Composer.Attach />
</Composer.Root>
```

`text` arrives trimmed. While the Promise runs the button is busy and the field read-only; resolve clears the field and the queue and closes the reply / edit bar (its `onDismiss`), reject leaves the text for another try.

Every attachment is a tile of one strip, in the order attached and then reordered by the person. Photos and videos arrive as `albums` in that order, a new album every ten (the most a `Gallery` lays out) — send each as one `Message.Media` message, the text as the caption of the first — and the other files as `files` in that order, a `Message.File` each. Clearing the queue revokes its previews, so a sent album shows from `result` (the server's URL) or from your own `URL.createObjectURL(item.file)` — revoke it when its message is deleted or the chat unmounts.

In an optimistic chat the send returns at once: add the message to the list with `status="sending"` under a client id, then patch its status as the server answers — the row keeps its key, so it never enters twice. Give the reply / edit bar the message id (`Composer.Context messageId`) and the send says what it answers or edits:

```tsx partial
<Composer.Root
  onSend={({ text, replyTo, editOf }) => (editOf ? chat.edit(editOf, text) : chat.post({ text, replyTo }))}
  onActivityChange={(activity) => chat.signal(activity)}
>
  {replyTo ? (
    <Composer.Context messageId={replyTo.id} onDismiss={() => setReplyTo(null)}>
      <Composer.Title>Ответ Анне</Composer.Title>
      <Composer.Description>{replyTo.text}</Composer.Description>
    </Composer.Context>
  ) : null}
</Composer.Root>
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Composer.Root
`ref` → `HTMLFormElement`. A `<form>` named by `labels.region`: attachments, the reply / edit bar and one row — paperclip · auto-growing field · send / record button. Owns the text, the send, the recording and the formatting; passes its tier to every part.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | The text of the message (controlled). |
| `defaultValue` | `string` | `""` | Initial text, uncontrolled (a saved draft). |
| `onValueChange` | `(value: string) => void` | — | Every change of the text: typing, formatting, the field cleared after a send. |
| `onSend` | `(message: { text: string; albums: readonly (readonly (UploadItem & { type: "image" \| "video" })[])[]; files: readonly UploadItem[]; replyTo?: string; editOf?: string }) => void \| Promise<unknown>` | — | Sends the message (Enter, Mod+Enter, the button): trimmed `text`, photos and videos as `albums` of up to 10, `files`, `replyTo` / `editOf`. A Promise keeps the text until it resolves; reject changes nothing. |
| `onActivityChange` | `(activity: "typing" \| "voice" \| "video" \| null) => void` | — | What the person is doing changed, for the other side's «печатает…»: `typing`, `voice` / `video` while recording, or `null`. Fires on a change only. |
| `onSendVoice` | `(recording: { blob: Blob; durationMs: number; waveform: number[] }) => void \| Promise<unknown>` | — | A voice message was recorded: the `MediaRecorder` blob, its length and 48 loudness values 0…1 for its waveform. With it an empty field shows the record button (where the browser can record). |
| `onSendVideoNote` | `(recording: { blob: Blob; durationMs: number; waveform: number[] }) => void \| Promise<unknown>` | — | A round video message was recorded (front camera and microphone), at most 60 s. With both record handlers a double click or tap on the record button (or ↑ / ↓ on it) switches voice and video. |
| `onEditLast` | `() => void` | — | ↑ in an empty field: open your last message for editing (show a `Composer.Context mode="edit"` and put its text into `value`). |
| `recordMode` | `"voice" \| "video"` | — | What the record button records (controlled); `video` needs `onSendVideoNote`. |
| `defaultRecordMode` | `"voice" \| "video"` | `"voice"` | Initial record mode, uncontrolled. |
| `onRecordModeChange` | `(mode: "voice" \| "video") => void` | — | A double click / double tap on the record button (or ↑ / ↓ on it) switched voice and video. |
| `queue` | `Pick<UploadQueue, "items" \| "add" \| "retry" \| "remove" \| "clear" \| "move">` | — | Attachments, usually `useUploadQueue(…)`: the paperclip, a paste and a drop add to it, and a tray above the row shows them as one reorderable strip of tiles. Without `queue` paste and drop of files do nothing. |
| `formatting` | `boolean` | `true` | Selecting text shows a floating toolbar of seven Markdown tools and enables their hotkeys; a tool wraps the selection, a second press unwraps it. `false` turns both off. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the field, the buttons and the bar text. Without it the tier of its host, else `m`. |
| `disabled` | `boolean` | `false` | A closed conversation: the field, the paperclip and the button are disabled; nothing is pasted or dropped. A disabled `Fieldset` around it sets it too (`data-disabled` included). |
| `inputRef` | `Ref<HTMLTextAreaElement>` | — | The message `<textarea>`: focus it after «Ответить» in a message menu. |
| `labels` | `Partial<ComposerLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `Composer.Attach` (placed at the start of the row) and `Composer.Context` (above the field). |
| `…rest` | `Omit<FormHTMLAttributes<HTMLFormElement>, "children" \| "defaultValue" \| "onSubmit">` | — | `className`, `aria-*`, `onKeyDown` and the other attributes of the `<form>`. |

### Composer.Context
`ref` → `HTMLDivElement`. The bar above the field: a reply or edit glyph, `Composer.Title` over `Composer.Description` behind an accent rule, and a close button; it describes the field; when it appears, the caret moves to the field.

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"reply" \| "edit"` | `"reply"` | `reply` — a reply to a message; `edit` — your message is being edited: the send button turns into «Сохранить» and the record button is not offered. |
| `messageId` | `string` | — | The id of the message answered or edited: `onSend` receives it as `replyTo` (`reply`) or `editOf` (`edit`). |
| `onDismiss` | `() => void` | — | Stop replying or editing: the close button, Escape in the field, and a send that went through. Without it the bar has no close button. |
| `children` | `ReactNode` | — | `Composer.Title` and `Composer.Description`. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className` and the other div attributes. |

### Composer.Title · Composer.Description
`ref` → `HTMLDivElement`. The first line of the bar in the accent text color, medium weight («Ответ Анне», «Редактирование») / the quoted message in the secondary color; both one line, cut with an ellipsis.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Composer.Attach
`ref` → `HTMLDivElement`. The paperclip at the start of the row. Alone it opens the file picker (FileUpload `trigger="button"`); with `Composer.Item` children it opens a menu where every item picks its own file types. Files go to the root's `queue`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `accept` | `string` | — | File types of the picker without a menu. |
| `aria-label` | `string` | — | Name of the button. Default `labels.attach`. |
| `children` | `ReactNode` | — | `Composer.Item` kinds of attachment. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other div attributes. |

### Composer.Item
`ref` → `HTMLButtonElement`. A kind of attachment in the paperclip menu, a `Dropdown.Item` (`role="menuitem"`): `Composer.ItemIcon` and the label. + native button props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `accept` | `string` | — | File types this item picks (`"image/*,video/*"`; `""` for any file). Without it the item only runs `onSelect`. |
| `onSelect` | `() => void` | — | The item's own action (a poll, a location); runs after the picker opens when `accept` is set. |
| `disabled` | `boolean` | `false` | Muted and skipped by the arrow keys. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect" \| "type">` | — | `children`, `className` and the other button attributes. |

### Composer.ItemIcon
`ref` → `HTMLSpanElement`. The leading glyph of a menu item (`Dropdown.ItemIcon`, `aria-hidden`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (the `Icon`), `className` and the other span attributes. |

## Variants
Composer has no `variant`; what the row shows follows its state.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 px row, 12/16 text | a dense side panel | |
| `s` | 32 px row, 13/20 text | comments in a card | |
| `m` | 36 px row, 14/20 text | a chat screen | yes |
| `l` | 40 px row, 16/24 text | a chat as the main screen on a large display | |
| `xl` | 48 px row, 16/24 text | a kiosk or a chat-first product | |

### Context mode
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `reply` | reply glyph, «Ответ …» over the quoted message | answering a message | yes |
| `edit` | pencil glyph, «Редактирование»; the button saves (check glyph) | editing your own message | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `formatting` | a floating toolbar over a selection (bold, italic, strikethrough, code, spoiler, link, quote); Mod-hotkeys | always, unless the chat shows plain text only | `true` |
| `disabled` | the field, paperclip and button disabled | a closed conversation, no permission to write | `false` |
| `queue` | the tray above the field: one strip of tiles — photos, videos and files; paste and drop take files | the chat accepts files | — |
| `onSendVoice` / `onSendVideoNote` | an empty field offers the record button | the chat takes voice / video messages | — |

## States
| State | Driven by | DOM |
|---|---|---|
| empty | no text, no attachments | with a record handler the button is the quiet ghost microphone (or camera), else a disabled send |
| typing | text | the button turns into the accent send; the glyph cross-fades into the plane (`Button.Icon`) |
| attachments | `queue.items` | the tray above the row: one strip of tiles in the order attached — photos and videos (MIME type, else the name's extension) as the local preview or first frame, other files as the sheet glyph, each with the format pill and a name · size (duration) band; while a file goes up a disk with the progress ring along its edge stands in the middle of a picture (dimmed under it) or in place of a file's sheet (name and size stay readable) (pressing it cancels, a failure turns it into a danger retry, done fades it away), remove ×, reorder by drag or `Alt + ←` / `→`; send is disabled while any is `queued` / `uploading` |
| as files | the «Отправить как файлы, без сжатия» checkbox (shown with photos or videos) | the view stays the same (the strip); `onSend` gets every file in `files` and `albums` empty; reset after a send |
| sending | `onSend` returned a Promise | button `loading` (`aria-busy`), textarea `readonly`, text kept |
| sent | the Promise resolved (or nothing returned) | field and queue cleared (the previews revoked, the tray fades and glides closed), the reply / edit bar's `onDismiss` called, focus stays in the field; `onActivityChange(null)` |
| reply / edit | `Composer.Context` | bar above the field (enters with `enterMotion`); `mode="edit"` turns send into save; its `messageId` goes to `onSend` as `replyTo` / `editOf` |
| activity | typing, recording | `onActivityChange`: `typing` from the first keystroke until the text is sent, emptied or rests for 3 s; `voice` / `video` while the recording bar shows; `null` after, and on unmount while active. It fires on a change only: a server that expires the signal wants it repeated on your side while the value is not `null` |
| selection | a non-empty selection while the field has focus | the floating toolbar fades in from below (`overlayMotion` floating, `data-side="top"`); a tool wraps the selection in its Markdown, a second press removes it |
| files over | a file drag over the composer (with `queue`) | `data-dropping="true"`: an accent ring over the field; a drop adds the files to the queue. A pasted file with no type (a screenshot from some apps) takes its clipboard item's type. Without `queue` paste and drop of files do nothing |
| recording, held | `data-recording="hold"` (a finger on the button; with voice and video both offered, from 200 ms of holding) | recording bar over the paperclip and the field with «Влево — отмена» sliding and fading with the finger — a slide of `--prime-space-24` throws the recording away; lock pill above the button (a floating surface, `data-depth="floating"`) rises in, a lift of `--prime-space-12` locks and it snaps away; release sends |
| recording, locked | `data-recording="locked"` (a mouse click, Enter / Space, a tap shorter than 200 ms, or a slide up) | delete button · pause button · dot · timer · live waveform over the full free width; the button and Enter send; a video message sends itself at 60 s of recorded time |
| recording, paused | Space or the pause button during a hands-free recording (`MediaRecorder.pause()`) | `data-paused` on the bar: the dot cross-fades into a still pause glyph (`GlyphSwap`), the timer and the waveform stand, the video ring stops; Space or «Продолжить запись» resumes; a send hands over what was recorded, without the pause |
| double-click window | with voice and video both offered, the 300 ms after a click or a tap | no `data-recording` yet: the button keeps its glyph and nothing is announced; with a granted microphone voice already records. A second press inside it discards that recording unseen and switches the mode (glyph swap, «Голосовое сообщение» / «Видеосообщение» announced); otherwise the bar rises in over the field with the timer counting from the first press; when the recording ends it closes up in place |
| starting | the press is answered, the device is not granted yet | already the recording bar with a running timer (it counts from the press) while the device is asked for in parallel; the waveform is a calm line of dots |
| too short | a recording under 0.7 s | dropped: nothing is sent |
| record error | the browser refused / found no device | the bar cross-fades back to the field; `Hint` with `role="alert"` above the row, cleared by typing or the next attempt |
| disabled | `disabled` | `data-disabled`, disabled controls |

Motion: the tray opens and closes as a Crossfade (fade and height glide, the row below stays still); tiles enter with `enterMotion`, a dragged or Alt-moved tile glides (Dnd), a removed tile closes up in place (`leaveInPlace`), an upload disk's ring fills along its edge and the disk fades out when done; the action glyphs cross-fade and turn (`fast` opacity, `base` emphasized transform) while the button's fill changes with the shared color transition — the button never changes its shape; the recording bar and the field cross-fade (`swapMotion`, both directions) inside the row's own height; the toolbar, the waveform and the delete button enter (`fast`); the recording dot breathes (`slow`, a status loop like a spinner); the lock pill rises in, its arrow follows the finger and it snaps away on lock (`fast`); the video preview scales in (`base` emphasized) and out (`fast`). The timer, the waveform and the video ring are painted per animation frame outside React: the waveform scrolls smoothly between samples. Under `prefers-reduced-motion` the loops stand still and the waveform steps sample by sample, still showing the level.

## Layout & spacing
- The row stands on its bottom edge with `--prime-space-2` gaps: the paperclip and the button stay by the last line as the field grows. Field → bar / attachments above: `--prime-space-2`.
- The tray is never in the row: the strip (`--prime-space-24` square tiles, one row scrolling sideways with faded edges, so its height is one tile at any count) and the «как файлы» checkbox stack with `--prime-space-2` gaps above it.
- The field grows from one line to eight and then scrolls inside; its padding centres one line exactly like an Input of the tier.
- The composer takes its container's width and works on the narrowest phone (320 px); it is a size container, the round video preview is `--prime-message-video-note` wide, at most 70% of its width, and needs that room above the composer (a chat history gives it).
- The recording bar covers the paperclip and the field, so entering and leaving a recording never changes the row height; its waveform takes all the width between the timer and the send button, as tall as the button minus `--prime-space-2`, in VoicePlayer's bar geometry.
- On touch the editable text is at least 16 px (no iOS zoom) and every button has the 44 px hit area.
- The formatting toolbar floats above the field's start edge on the floating layer, over whatever is above the composer.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` | In the field sends the message; on a touch screen breaks the line. |
| `Shift + Enter` | Breaks the line. |
| `Mod + Enter` | Always sends, on a touch screen too. |
| `↑` | In an empty field opens your last message for editing (`onEditLast`). |
| `Escape` | Clears a selection with the toolbar, then cancels the reply or edit; while recording throws the recording away and stops there, so an enclosing Modal or Drawer stays open. |
| `Mod + B` · `Mod + I` · `Mod + Shift + X` · `Mod + E` · `Mod + Shift + H` · `Mod + K` · `Mod + Shift + 9` | Bold, italic, strikethrough, code, spoiler, link and quote for the selection; the physical key counts, so any layout works. |
| `Enter` · `Space` | On the record button: record hands-free at once. During a hands-free recording, wherever the focus is in the composer: Enter sends the recording (a paused one too), Space pauses and resumes it — the timer and the waveform stand, the dot turns into a pause glyph. |
| `↑` · `↓` | On the record button, with voice and video both offered: switches voice and video (`aria-keyshortcuts`, named in the button's description). |
| `←` · `→` | Move between the formatting buttons. |
| `Home` · `End` | Jump to the first / last formatting button. |
| `Alt + ←` · `Alt + →` | On a tile of the tray: moves the attachment one place. |
| `Delete` · `Backspace` | On a tile of the tray: removes the attachment; focus moves to its neighbour. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The composer is a `<form>` named «Новое сообщение»; the field is a `<textarea>` named «Сообщение» with `enterkeyhint="send"` (`enter` on touch).
- A reply / edit bar describes the field (`aria-describedby`); when it appears after the first render the caret moves to the field. Its close button is «Отменить ответ» / «Отменить редактирование». A send that went through closes it.
- The formatting toolbar is `role="toolbar"` with one Tab stop and arrow keys; every button has `aria-keyshortcuts` and a tooltip with its keys (`⌘B` on Apple systems, `Ctrl+B` elsewhere).
- The action button is named by what it does — «Отправить», «Сохранить», «Записать голосовое», «Записать видеосообщение», «Отправить запись» — and described by how to record. While sending it is `aria-busy` and the field is read-only.
- A live region (`role="status"`) announces a recording started, locked, deleted and sent, and the record mode after a switch («Голосовое сообщение» / «Видеосообщение»); a refused microphone is a `role="alert"` message that also describes the field, never a thrown error.
- While recording the paperclip and the field are `inert` under the bar; the bar's buttons are «Удалить запись» and «Приостановить запись» / «Продолжить запись» (`aria-keyshortcuts="Space"`), the action button «Отправить запись». Deleting brings the focus back to the action button. Pause and resume are announced. The timer and the waveform are decorative. While a finger holds a recording only `Escape` works (it throws the recording away); the delete and pause buttons keep their own Enter and Space.
- The attachments are one `<ul>` named «Вложения» (FileUpload.Queue `layout="strip"`): every tile is «Фото N: name» / «Видео N: name» / «Файл N: name» with its upload state, `aria-keyshortcuts` for `Alt + ←` / `→` and `Delete`, a remove button «Убрать name»; the upload disk is a `progressbar` while the file goes up. Moves are announced by Dnd's live region, finished and failed files by the queue's. «Отправить как файлы, без сжатия» is a labelled Checkbox.
- Touch: the buttons get a 44 px hit area; Enter breaks the line, the button sends.
- Voice and video together: a single press records without holding, a double press (within 300 ms) switches the mode. The first press records silently until the window ends, so a double press shows no recording and sends nothing.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `region` | `"Новое сообщение"` | Accessible name of the composer form. |
| `placeholder` | `"Сообщение"` | Placeholder and accessible name of the field. |
| `send` | `"Отправить"` | Name of the send button. |
| `save` | `"Сохранить"` | Name of the send button while a message is edited. |
| `recordVoice` | `"Записать голосовое"` | Name of the record button in voice mode. |
| `recordVideo` | `"Записать видеосообщение"` | Name of the record button in video mode. |
| `recordHint` | `"Удерживайте, чтобы записать; нажмите, чтобы записывать без удержания"` | Description of the record button: how to record. |
| `recordSwitchHint` | `"Нажмите или удерживайте, чтобы записать; двойное нажатие или стрелки вверх и вниз переключают голос и видео"` | Description of the record button when it also switches voice and video. |
| `recordModeVoice` | `"Голосовое сообщение"` | Announced when the record button switches to voice messages. |
| `recordModeVideo` | `"Видеосообщение"` | Announced when the record button switches to video messages. |
| `sendRecording` | `"Отправить запись"` | Name of the button while recording. |
| `cancelRecording` | `"Удалить запись"` | Name of the button that throws a recording away. |
| `pauseRecording` | `"Приостановить запись"` | Name of the button that pauses a hands-free recording. |
| `resumeRecording` | `"Продолжить запись"` | Name of the button that resumes a paused recording. |
| `slideToCancel` | `"Влево — отмена"` | Hint while a recording is held. |
| `recordingStarted` | `"Идёт запись"` | Announced when a recording starts. |
| `recordingLocked` | `"Запись продолжается без удержания"` | Announced when a held recording is locked and goes on hands-free. |
| `recordingCanceled` | `"Запись удалена"` | Announced when a recording is thrown away. |
| `recordingPaused` | `"Запись приостановлена"` | Announced when a recording is paused. |
| `recordingResumed` | `"Запись продолжена"` | Announced when a paused recording goes on. |
| `recordingSent` | `"Запись отправлена"` | Announced when a recording is handed over. |
| `recordDenied` | `"Нет доступа к микрофону или камере — разрешите его в настройках браузера"` | Error when the browser refuses the microphone or the camera. |
| `recordMissing` | `"Микрофон или камера не найдены"` | Error when there is no device. |
| `recordFailed` | `"Не удалось начать запись"` | Error when a recording fails to start for another reason. |
| `attach` | `"Прикрепить"` | Name of the paperclip. |
| `attachments` | `"Вложения"` | Accessible name of the strip of attachments. |
| `sendAsFiles` | `"Отправить как файлы, без сжатия"` | The option that sends the attached photos and videos as files. |
| `formatting` | `"Форматирование"` | Accessible name of the formatting toolbar. |
| `bold` | `"Жирный"` | Bold tool. |
| `italic` | `"Курсив"` | Italic tool. |
| `strikethrough` | `"Зачёркнутый"` | Strikethrough tool. |
| `code` | `"Моноширинный"` | Code tool. |
| `spoiler` | `"Скрытый текст"` | Spoiler tool (`\|\|…\|\|`). |
| `link` | `"Ссылка"` | Link tool. |
| `quote` | `"Цитата"` | Quote tool. |
| `cancelReply` | `"Отменить ответ"` | Name of the close button of a reply bar. |
| `cancelEdit` | `"Отменить редактирование"` | Name of the close button of an edit bar. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A reply to a client in a support chat: Enter sends, Shift+Enter breaks the line, the paperclip attaches files and an empty field records a voice message — `onSend`, `onSendVoice`, `queue`, `Composer.Attach`. |
| [sizes.tsx](examples/sizes.tsx) | One composer in every tier: field, buttons and the paperclip follow it — `size`. |
| [attachments.tsx](examples/attachments.tsx) | Warehouse photos and documents for a client go through an upload queue: the paperclip opens the file picker for photos, videos and office documents, a paste or a drop adds files too, every attachment is a tile of one strip that drags into its order, and send waits until the uploads finish — `queue`, `Composer.Attach`, `accept`, `useUploadQueue`. |
| [attach-menu.tsx](examples/attach-menu.tsx) | The paperclip as a menu of attachment kinds: photos and videos, documents, any file, and an invoice from the system that puts its link into the message and returns the focus to the field — `Composer.Item`, `Composer.ItemIcon`, `accept`, `onSelect`, `inputRef`. |
| [reply-edit.tsx](examples/reply-edit.tsx) | Answering a client's message and correcting your own: the bar above the field quotes the message, Escape or the cross cancels, ↑ in an empty field opens your last message, send becomes save and hands over the message id — `Composer.Context`, `mode`, `messageId`, `onDismiss`, `onEditLast`. |
| [typing.tsx](examples/typing.tsx) | The other side's status line follows what you do: typing, recording a voice or a video message, then nothing — `onActivityChange`. |
| [formatting.tsx](examples/formatting.tsx) | Selected text gets a toolbar of bold, italic, strikethrough, code, spoiler, link and quote, each with its shortcut, written as Markdown around the selection — `formatting`. |
| [voice.tsx](examples/voice.tsx) | Voice and round video messages: hold the button to record and release to send, slide left to cancel, slide up or tap to record hands-free; a double tap or double click switches voice and video — `onSendVoice`, `onSendVideoNote`, `recordMode`. |
| [states.tsx](examples/states.tsx) | A closed conversation is disabled, a slow send keeps the text with a busy button until the server answers — `disabled`, `onSend`. |
| [controlled.tsx](examples/controlled.tsx) | Every conversation keeps its own draft: switching the chat swaps the text, a template button fills it from outside — `value`, `onValueChange`. |
| [narrow.tsx](examples/narrow.tsx) | On a phone-width chat the row keeps the paperclip, the field and the button; Enter makes a new line on touch screens and the button sends — `Composer.Attach`, `onSend`. |

## Mistakes
- A `<Textarea>` with a hand-made send button and an Enter handler → `Composer.Root`: Enter / Shift+Enter / touch, the async send, the clearing and the focus are built in.
- Clearing the field in `onSend` before the server answers → return the Promise; the composer clears on resolve and keeps the text on reject.
- Rendering the attachment rows yourself → pass `queue`; the tray, paste and drop come with it.
- Sending photos as file messages → send each of `albums` as one `Message.Media` message (its order is the tray's), `files` as `Message.File`.
- Cutting `media` into albums of ten by hand → `albums` comes split.
- Showing a sent photo from `item.preview` → the queue revokes it after the send; use `result` or your own object URL of `item.file`, revoked with its message.
- Expecting HTML from the formatting → the text is Markdown (`**…**`, `_…_`, `~~…~~`, `` `…` ``, `||…||`, Markdown links, `> `); render it with the message component, never as HTML.
- Hiding the reply bar by CSS → unmount `Composer.Context` in `onDismiss`; Escape and a sent message call the same handler.
- Keeping the replied message in a closure of `onSend` → give the bar its `value`; `onSend` gets `replyTo` / `editOf`.
- Sending «печатает» from `onValueChange` on every keystroke → use `onActivityChange`: it fires on a change only and ends the signal on rest, send and clear.
- Showing the record button without checking the browser → it is feature-detected: without `MediaRecorder` it is not offered, and a refused permission shows a message.
- Expecting a single tap to switch voice and video → a single click or tap records; the switch is a double click / double tap or ↑ ↓ on the button. A slow double click (past 300 ms) is a click on the send button of a recording that is too short and is dropped.
- An `aria-label` on the root to rename the field → use `labels.placeholder` (the field) and `labels.region` (the form).

## Related
- **Built from:** [Textarea](../textarea/COMPONENT.md), [Button](../button/COMPONENT.md), [FileUpload](../file-upload/COMPONENT.md) (the paperclip and the picker of the menu; `FileUpload.Queue layout="strip"`, the tray), [Gallery](../gallery/COMPONENT.md) (`GALLERY_MAX`, the size of an album in `albums`), [Crossfade](../crossfade/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md), [Kbd](../kbd/COMPONENT.md), [Hint](../hint/COMPONENT.md), [Skeleton](../skeleton/COMPONENT.md), Icon (`action.*`, `format.*`, `nav.chevronLeft`, `nav.chevronUp`, `status.locked`), `useUploadQueue` (the `queue`), `internal/ring` (the video preview's ring), `internal/textFormatting` + `internal/textFormattingToolbar` (the formatting shared with Textarea `formatting`), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Message](../message/COMPONENT.md) — the bubbles the composer writes into; [VoicePlayer](../voice-player/COMPONENT.md) — plays a sent voice message; [Textarea](../textarea/COMPONENT.md), [Input](../input/COMPONENT.md)
