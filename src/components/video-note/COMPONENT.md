# VideoNote

**Category:** messages
**Kind:** control

> A round video message: a still first frame with the play disk that plays with sound on a press — the same player API as VoicePlayer.

## When to use
- A round video message in a chat — place it as the content of `Message.Root`: the circle is the message itself (no bubble), the time and status stand on a pill at its bottom-end corner, reactions under it.
- A short face-to-camera report outside a chat: a site visit on a task, a reply on a ticket.

## When not to use
- A video with controls, chapters or a full-screen view → `Thumbnail.Video` or a video in `Message.Media`.
- Audio only → [VoicePlayer](../voice-player/COMPONENT.md).
- Recording a video message → [Composer](../composer/COMPONENT.md) `onSendVideoNote`.

## Import
```tsx
import { VideoNote } from "prime-ui-kit";
```

## Anatomy
```
VideoNote              <div role="group">; data-playing · data-disabled · data-transfer
├─ circle              the square box, a perfect circle at every width (data-state, data-frame)
│  ├─ media            the round clip: Skeleton until the first frame, the <video preload="metadata">
│  ├─ ring             playback ring over the edge (internal/ring, `live`: --ring-value written per frame)
│  ├─ hit              the whole circle takes a press (a pointer aid, aria-hidden)
│  ├─ play disk        the shared play disk, centred (internal/mediaPlayer PlayDisk): Button shape="circle"
│  │                   variant="shade", play ⇄ pause, keyboard seek; fades while playing; with `transfer` the same
│  │                   button carries ×, retry or download and the share as its `progress` ring (internal/transferDisk)
│  ├─ duration         pill at the bottom-start corner, muted caption (internal/mediaPill)
│  ├─ transcript       Button soft xs at the top-end corner, outside the circle's edge (internal/mediaPlayer TranscriptButton)
│  └─ meta             in a message: its time and status on a pill at the bottom-end corner
└─ transcript text     <div data-transcript> (internal/Disclosure) under the circle, in the message's fill
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### VideoNote
`ref` → `HTMLDivElement` (the `role="group"` root). A round video message: a perfect circle at every width (the `--prime-message-video-note` token × 1.15, within the row), no shell. At rest it is the still first frame (or `poster`) with the shared play disk in its shade look in the middle and the duration on a pill — nothing plays or loops before a press. The disk (or a press anywhere on the circle) plays it with sound and a progress ring fills over the circle's edge, the disk fading out; again it pauses; at the end it rewinds to the still frame. The duration reads like a voice message's time row (the muted caption on the media pill). Inside `Message.Root` it is the message itself — no bubble, the meta on its pill at the bottom-end corner, reactions under it. Its props are VoicePlayer's (`MediaPlayerProps`) plus `poster`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Video URL, loaded with `preload="metadata"`: nothing plays before a press. |
| `duration` | `number` | — | Length in seconds, shown until the media reports its own. |
| `unplayed` | `boolean` | `false` | Nobody has played it yet: an accent dot after the duration and `labels.unplayed` for screen readers. Clear it when `onPlayingChange(true)` comes; the dot leaves with a fade. |
| `disabled` | `boolean` | `false` | Nothing can be played: the play disk and the keyboard seek, the transcript button and the transfer actions are off (native `disabled`). A disabled `Fieldset` around it disables it too. |
| `poster` | `string` | — | A still shown before the first frame; without it the first frame is drawn. Video only. |
| `playing` | `boolean` | — | Playing with sound (controlled): `true` plays it (from the start, or on from a pause), `false` pauses it. One sound plays at a time on the page: starting it pauses any other voice message, video message or video in `Message.Media`, and starting one of them pauses it. |
| `defaultPlaying` | `boolean` | `false` | Initial playing state (uncontrolled). |
| `onPlayingChange` | `(playing: boolean) => void` | — | Playback with sound started or stopped: the play disk, Enter / Space, another sound taking over, the end (then `onEnded` too); a seek from the keyboard does not count. |
| `onEnded` | `() => void` | — | Playback reached the end; the note is back at its still first frame. |
| `transcript` | `string` | — | The text of the recording, when it is known. With it or `onTranscribe` a «→A» transcript button shows at the top end of the circle's box, outside its edge (where the voice message has it, at the end of its top row), and the text opens in a block of the message's fill under the circle; it opens the text (selectable, marked by the chat search) and turns into a chevron that closes it. In a chat, open and close are one stroke of the message: the height and the width change together, the text fades in or out where it stands, and the player row above never moves. |
| `onTranscribe` | `() => Promise<string> \| void` | — | Asks for the text on the first open while `transcript` is not known. Return a Promise of the text: only the button spins and the area stays closed; on resolve the area opens with the text; a rejection closes the area (`onTranscriptExpandedChange(false)`) and announces `labels.transcribeFailed`, and the next open asks again. Returning nothing keeps the button spinning until you pass `transcript`. |
| `transcriptExpanded` | `boolean` | — | The transcript is open (controlled). Opening it without a text calls `onTranscribe`. |
| `defaultTranscriptExpanded` | `boolean` | `false` | Initially open (uncontrolled). Inside a chat's list (`Chat.Messages`) the open state and a resolved text outlive a windowed row: scrolled away and back, it is still open. |
| `onTranscriptExpandedChange` | `(expanded: boolean) => void` | — | The transcript button was pressed, or a rejected `onTranscribe` closed the transcript. |
| `transfer` | `"remote" \| "queued" \| "loading" \| "failed" \| "done"` | — | The transfer of the note, drawn on the play disk itself in the middle (the same disk in its shade look: the × or the arrow in the play glyph's place, the ring along its inner edge); the circle dims and does not play until it is done, either way (`TransferState`, the values of `UploadItem.status` plus `remote`): `queued` / `loading` — the cross, a circle Button whose `progress` ring shows `transferProgress` (described by the share); `failed` — the danger disk with the retry arrow; `remote` — not fetched yet, the download arrow; `done` — the ring fills, then the disk fades and shrinks away (`fast`). |
| `transferProgress` | `number` | — | Share transferred, 0…1 (`UploadItem.progress`): the ring along the disk's inner edge, gliding (`base`) while it turns. Without it a transfer in flight turns a quarter arc. |
| `transferDirection` | `"upload" \| "download"` | `"upload"` | Which way it goes: sending (`upload`) or receiving (`download`). Changes only the words — the names of the cross and the retry, the share and the failure — never the look. |
| `onCancel` | `() => void \| Promise<void>` | — | Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`. |
| `onRetry` | `() => void \| Promise<void>` | — | Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection). |
| `onDownload` | `() => void \| Promise<void>` | — | Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection). |
| `labels` | `Partial<VideoNoteLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "onPlay" \| "onPause" \| "onEnded" \| "onRateChange">` | — | `className`, `aria-label` (replaces `labels.player`), `data-*` and the other div attributes. |

## Variants
One look. The circle is the video; the play disk and the pills stand on the media shade, the same in both themes; the transcript block under it takes the message's fill (standalone, the next surface). The play disk is VoicePlayer's in its `shade` look.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `unplayed` | an accent dot after the duration | nobody has watched it yet | |
| `disabled` | the circle and its duration dim, the disk in the Button's disabled look | it cannot be played (deleted, expired) | |

## States
| State | Driven by | DOM |
|---|---|---|
| loading | the first frame not drawn yet | `data-frame="loading"` on the circle: a Skeleton fills it, the video fades in (`base`) once loaded |
| at rest | idle | the still first frame (or `poster`) with the play disk and the duration; nothing plays, loops or decodes past the metadata and the first frame — a long chat costs nothing until a press |
| playing | the disk (or a press on the circle), `playing` / `defaultPlaying` | `data-playing="true"` on the root, `data-state="playing"`; sound from the start, the ring fills over the edge every frame (one CSS variable on the ring), the duration counts down, the disk's glyph turns to pause and the disk fades out (it stays while it has the keyboard focus); `onPlayingChange(true)`; any other sound pauses |
| paused | the disk or the circle again, another sound starting, `playing={false}` | `data-state="paused"`, the disk with the play glyph comes back, the ring stays; `onPlayingChange(false)` |
| sought | an arrow, PageUp / PageDown, Home / End on the disk | the position moves (5 s, a tenth, the edges), the ring and the description follow; from rest it stops there, paused |
| ended | the media ends | rewound, the ring empties, the still first frame and the play disk; `onPlayingChange(false)`, `onEnded` |
| unplayed | `unplayed` | the accent dot and `labels.unplayed` in the description |
| disabled | `disabled`, or a disabled `Fieldset` around it | `data-disabled="true"`; the circle and its duration dim to 0.6, the disk, the transcript button and the transfer disk are natively `disabled`; nothing plays by a press, a key or `playing` |
| transferring | `transfer` `queued` / `loading`, `transferProgress` | `data-transfer="true"`; the circle dims to 0.6 and the play disk itself becomes the transfer in the same place and look (the play glyph cross-fades into a white ×; the share is the Button's `progress` ring along its inner edge — the kit ring at the line weight, a 32% track, gliding `base`, always turning; a quarter arc without a share); the button is `aria-busy`, described by `uploadProgress` / `downloadProgress` |
| transfer failed | `transfer="failed"` | the disk turns danger with a retry arrow (`retryUpload` / `retryDownload`, described by `notSent` / `notReceived`); `onRetry` |
| remote | `transfer="remote"` | not fetched yet: the disk with the download arrow (`labels.download`), no ring, the video is not preloaded; `onDownload` |
| transferred | `transfer="done"` | the ring fades where it is (`fast`), the × cross-fades back into play and the circle returns to full |
| transcript open | the transcript button, `transcriptExpanded` / `defaultTranscriptExpanded` | the button's glyph cross-fades into a chevron up, `aria-expanded="true"`; the text opens under the circle at once; in a chat the view is held still and the message grows downward |
| transcript pending | an open with no text while `onTranscribe`'s Promise is in flight | only the button spins (`loading`, `aria-busy`); the area stays closed and opens with the text |

## Layout & spacing
- The circle is one square box: `min(--prime-message-video-note × 1.15, 100cqi)` wide with `aspect-ratio: 1`; everything in it fills it, so it stays a perfect circle at every width from 320px.
- The duration pill stands at the bottom-start corner, the message's meta pill at the bottom-end corner, the transcript button at the top-end corner of the square — where the circle leaves room — the place a voice message has it, at the end of its top row.
- The duration and the meta read like a voice message's time row: the caption size and regular weight in the muted tone of the media pill (`--prime-color-media-pill-fg` on `--prime-color-media-pill`), AA over a white frame.
- The transcript opens under the circle in a block of the message's fill (`--prime-message-padding-*`, `--prime-message-radius`).
- The play disk is the control `l` disk centred on the circle — the same element, size, glyphs and motion as VoicePlayer's, on the media shade with a blur.
- One sound at a time on the page: starting it pauses whatever else plays with sound — a voice message, another circle, a video in `Message.Media`.
- Symmetric with VoicePlayer: the same shared props (`MediaPlayerProps`), labels keys, `data-*` and keys. Its own prop is `poster`; it has no `waveform` (a face, not levels) and no rate (a face is watched at its own pace), and it seeks from its disk, having no slider.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus: the play disk (or the transfer disk), the transcript button. |
| `Enter` · `Space` | On the disk: play with sound or pause; on the transcript button: open or close the text; on the transfer disk: cancel, retry or download. |
| `ArrowRight` · `ArrowUp` | On the disk: 5 seconds forward. |
| `ArrowLeft` · `ArrowDown` | On the disk: 5 seconds back. |
| `PageUp` · `PageDown` | On the disk: 10 % of the note forward or back. |
| `Home` · `End` | On the disk: to the start or the end. |

### ARIA
- The root is `role="group"` named by `labels.player` (or your `aria-label`).
- The play disk is a button named `labels.play` / `labels.pause`, described by the duration (`labels.duration`) or the position (`labels.position`) and `labels.unplayed`; the pills are `aria-hidden`, and the press area over the whole circle is a pointer aid only (`aria-hidden`).
- While the note is on its way, failed or not fetched, the play button itself is the transfer, named by the direction (`cancelUpload` / `cancelDownload` described by `uploadProgress` / `downloadProgress`, `retryUpload` / `retryDownload` described by `notSent` / `notReceived`, `download`); its ring is `aria-hidden`; a refused action is announced (`role="status"`).
- The transcript button is named `labels.transcribe` / `labels.hideTranscript`, with `aria-expanded` and `aria-controls`; a failed request is announced with `labels.transcribeFailed`.
- `disabled` (own or a `Fieldset`'s) disables the disk, the transcript button and the transfer actions natively.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `player` | `"Видеосообщение"` | Name of the player group. |
| `play` | `"Воспроизвести видеосообщение"` | Name of the play disk while it does not play. |
| `pause` | `"Пауза"` | Name of the play disk while it plays. |
| `position` | `"{current} из {duration}"` | The position: `{current}` and `{duration}` as m:ss. |
| `unplayed` | `"Не просмотрено"` | Visually hidden text read while `unplayed`. |
| `duration` | `"Длительность {duration}"` | The play disk's description before playback (during it, `position`). |
| `transcribe` | `"Расшифровать"` | Name of the transcript button while the text is closed. |
| `hideTranscript` | `"Скрыть расшифровку"` | Name of the transcript button while the text is open. |
| `transcribeFailed` | `"Не удалось расшифровать сообщение"` | Announced when `onTranscribe` rejects. |
| `cancelUpload` | `"Отменить отправку"` | The transfer of the note: the cross while sending. |
| `cancelDownload` | `"Отменить загрузку"` | The transfer of the note: the cross while receiving. |
| `retryUpload` | `"Повторить отправку"` | The transfer of the note: the retry after a failed send. |
| `retryDownload` | `"Повторить загрузку"` | The transfer of the note: the retry after a failed receive. |
| `uploadProgress` | `"Отправка {percent}%"` | The transfer of the note: the share while sending — the description of the cross. |
| `downloadProgress` | `"Загрузка {percent}%"` | The transfer of the note: the share while receiving — the description of the cross. |
| `notSent` | `"Не отправилось"` | The transfer of the note: why a send failed — the retry's description. |
| `notReceived` | `"Не загрузилось"` | The transfer of the note: why a receive failed — the retry's description. |
| `download` | `"Скачать"` | The transfer of the note: the download arrow of a `remote` content. |
| `cancelFailed` | `"Не удалось отменить"` | The transfer of the note: announced when `onCancel` rejected. |
| `retryFailed` | `"Не удалось повторить"` | The transfer of the note: announced when `onRetry` rejected. |
| `downloadFailed` | `"Не удалось скачать"` | The transfer of the note: announced when `onDownload` rejected. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A foreman's round video report: its still first frame with the play disk and the duration, played with sound on a press — `src`, `duration`. |
| [states.tsx](examples/states.tsx) | Every state side by side, each labelled by its prop: the transfer is drawn on the play disk itself — in flight with the cross and the ring, failed with the retry, not fetched with the download arrow — `unplayed`, `transfer`, `transferProgress`, `disabled`. |
| [in-message.tsx](examples/in-message.tsx) | Round video messages in a field crew chat: the circle is the message itself, the time stands on its pill and the reply follows as text — `Message.Root`, `time`, `status`. |
| [transcript.tsx](examples/transcript.tsx) | Round video messages with a transcript: the button stands at the circle's top end like a voice message's, one text is known and one is asked for on the first open — `transcript`, `onTranscribe`. |
| [transfer.tsx](examples/transfer.tsx) | One look for a round video on its way in either direction: the foreman's report waits to be fetched and then arrives, the engineer's answer is being sent — the disk in the middle with the ring of the share, the cross cancels, a dropped connection offers a retry, the circle plays once it is through — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`. |
| [controlled.tsx](examples/controlled.tsx) | The parent knows what plays and marks the report as watched on the first play — `playing`, `onPlayingChange`, `unplayed`. |

## Mistakes
- A `<video>` cropped round by hand in a bubble → use `VideoNote`: it plays one sound at a time, draws the transfer on its disk and keeps the meta on its pill.
- An autoplaying muted loop of your own around it → the circle stays still until a press; a long chat must not decode video on its own.
- A `VideoNote` inside a `Card` or a bubble of text → put it alone in `Message.Root`: the round shell is the message.
- `unplayed` never cleared → clear it when `onPlayingChange(true)` comes.
- A transfer drawn with your own spinner or ProgressCircle over the circle → pass `transfer`, `transferProgress` and the handlers.
- `transferDirection` used to restyle → it changes only the words; the look is one both ways.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (the play disk, `shape="circle"` `variant="shade"`; the transcript button), [Skeleton](../skeleton/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), Icon (`action.play`, `action.pause`, `action.close`, `action.refresh`, `action.download`, `action.transcribe`); `internal/mediaPlayer` (the shared props, the play disk, the transcript button, the keyboard seek, the playing triad, the transfer — with VoicePlayer), `internal/disabledContext` (a disabled `Fieldset`), `internal/mediaSession` (one sound at a time), `internal/transferDisk` (the transfer's logic), `internal/ring` (the playback ring), `internal/mediaPill` (pills and marks), `internal/transcript` + `internal/Disclosure` (the transcript), `internal/messagePart` (the round part of a message)
- **See also:** [VoicePlayer](../voice-player/COMPONENT.md) — the voice message, the same player contract; [Message](../message/COMPONENT.md) — the chat it sits in; [Composer](../composer/COMPONENT.md) — records the video message
