# VoicePlayer

**Category:** messages
**Kind:** control

> A voice message player: a round play disk, a waveform that is the seek slider, and the time with the playback speed — the same player API as VideoNote.

## When to use
- A voice message in a chat bubble — place it as the content of `Message.Root`: the player sits on the bubble fill (the bubble's colors), and the bubble's time and status stand in its bottom-end corner over the meta's spacer at the end of the time row.
- A short recording outside a chat: a call recording on a deal card, a voice note attached to a task.
- Any audio of up to a few minutes where the person listens in place and may scrub.

## When not to use
- Music or long media with volume, playlists or chapters → a full media player.
- A progress of a job, not a recording → [ProgressBar](../progress-bar/COMPONENT.md).
- Picking a number on a range → [Slider](../slider/COMPONENT.md).

## Import
```tsx
import { VoicePlayer, getWaveform } from "prime-ui-kit";
```

`getWaveform(source, bars = 48)` takes a `Blob` or a URL of a recording that has no stored levels, decodes it with the Web Audio API and resolves to the same 0…1 array `Composer` hands to `onSendVoice` (the peak of each slice, the loudest at 1) — pass it to `waveform`. It rejects when the audio cannot be fetched or decoded; keep the flat row then. Decode once and store the result with the message.

## Anatomy
```
VoicePlayer            <div role="group">; state in data-*
├─ audio               hidden <audio preload="metadata">
├─ row
│  ├─ disk             the shared play disk (internal/mediaPlayer PlayDisk: one Button shape="circle", solid accent):
│  │                   play ⇄ pause glyphs; with `transfer` the same button carries the ×, the retry or the download
│  │                   arrow (internal/transferDisk logic) and the share as its `progress` ring along the inner edge
│  └─ body
│     ├─ wave line
│     │  ├─ waveform   <div role="slider">: bars centred on the line + the played layer clipped
│     │  │             by `--vp-progress`
│     │  └─ transcript Button soft xs, icon-only «→A» ⇄ chevron (with `transcript` / `onTranscribe`)
│     └─ time row      m:ss · unplayed dot · rate chip · the message meta's spacer (last part)
└─ transcript          <div data-transcript> (internal/Disclosure): opens once the text is known —
                       <p> text ending with the meta's spacer (while open)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### VoicePlayer
`ref` → `HTMLDivElement` (the `role="group"` root). A voice message: the play disk, the waveform as the seek slider and the time row with the playback speed. Its props are VideoNote's (`MediaPlayerProps`) plus `waveform` and the rate triad.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Audio URL, loaded with `preload="metadata"`: nothing plays before a press. |
| `duration` | `number` | — | Length in seconds, shown until the media reports its own. |
| `unplayed` | `boolean` | `false` | Nobody has played it yet: an accent dot after the time and `labels.unplayed` for screen readers. Clear it when `onPlayingChange(true)` comes; the dot fades out and the row closes up in place. |
| `disabled` | `boolean` | `false` | Nothing can be played: the play disk, the waveform slider and the rate chip, the transcript button and the transfer actions are off (native `disabled`). A disabled `Fieldset` around it disables it too. |
| `waveform` | `readonly number[]` | — | Levels 0…1 from data, resampled to the bars that fit the width. Without it: a calm flat row. Voice only: a circle shows a face, not levels. |
| `rate` | `1 \| 1.5 \| 2` | — | Playback speed (controlled). Voice only: speech is listened to faster; a face is watched at its own pace. |
| `defaultRate` | `1 \| 1.5 \| 2` | `1` | Initial playback speed (uncontrolled). |
| `onRateChange` | `(rate: 1 \| 1.5 \| 2) => void` | — | The rate chip was pressed: 1× → 1.5× → 2× → 1×. |
| `playing` | `boolean` | — | Playing with sound (controlled): `true` plays it (from the start or on from a pause), `false` pauses it. One sound plays on the page at a time. |
| `defaultPlaying` | `boolean` | `false` | Initial playing state (uncontrolled). |
| `onPlayingChange` | `(playing: boolean) => void` | — | Playback with sound started or stopped: the play disk, Enter / Space, another sound taking over, the end (then `onEnded` too); a drag on the waveform that pauses for the seek does not count. |
| `onEnded` | `() => void` | — | Playback reached the end; the player is back at the start, paused. |
| `transcript` | `string` | — | The text of the recording, when it is known. With it or `onTranscribe` a «→A» button opens and closes the text: the button ends the waveform, the text opens under the player. |
| `onTranscribe` | `() => Promise<string> \| void` | — | Asks for the text on the first open while `transcript` is not known; return a Promise of the text. The button spins, then the text opens; a rejection announces `labels.transcribeFailed`. |
| `transcriptExpanded` | `boolean` | — | The transcript is open (controlled). Opening it without a text calls `onTranscribe`. |
| `defaultTranscriptExpanded` | `boolean` | `false` | Initially open (uncontrolled). In `Chat.Messages` the open state and a resolved text survive a row scrolled away and back. |
| `onTranscriptExpandedChange` | `(expanded: boolean) => void` | — | The transcript button was pressed, or a rejected `onTranscribe` closed the transcript. |
| `transfer` | `"remote" \| "queued" \| "loading" \| "failed" \| "done"` | — | The transfer of the recording, drawn on the play disk itself, either way (`TransferState`): `queued` / `loading` — the cancel cross and the share ring; `failed` — retry; `remote` — download; `done` — the disk fades out. |
| `transferProgress` | `number` | — | Share transferred, 0…1 (`UploadItem.progress`): the ring along the disk's inner edge, gliding (`base`) while it turns. Without it a transfer in flight turns a quarter arc. |
| `transferDirection` | `"upload" \| "download"` | `"upload"` | Which way it goes: sending (`upload`) or receiving (`download`). Changes only the words — the names of the cross and the retry, the share and the failure — never the look. |
| `onCancel` | `() => void \| Promise<void>` | — | Cancel the transfer in flight: the disk's cross. A returned promise keeps the disk pending (a spinner, `aria-busy`, no second press); a rejection leaves the transfer as it was and announces `cancelFailed`. |
| `onRetry` | `() => void \| Promise<void>` | — | Transfer it again after a failure: the danger disk's retry; a promise works the same (`retryFailed` on a rejection). |
| `onDownload` | `() => void \| Promise<void>` | — | Fetch a `remote` content: the download arrow; set `transfer` to `loading` with `transferDirection="download"` as it starts. A promise works the same (`downloadFailed` on a rejection). |
| `labels` | `Partial<VoicePlayerLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "onPlay" \| "onPause" \| "onEnded" \| "onRateChange">` | — | `className`, `aria-label` (replaces `labels.player`), `data-*` and the other div attributes. |

### Functions

#### `getWaveform(source, bars)`
`(source: Blob \| string, bars?: number) => Promise<number[]>`

The 0…1 peaks of a `Blob` or URL with no stored levels, for `waveform`; `bars` defaults to 48. Rejects when the audio cannot be fetched or decoded.

## Variants
One look. Colors are semantic roles only (`accent-default`, `accent-fg`, `fill-strong`, `text-muted`), so an outgoing chat bubble restyles the player by overriding them for its subtree.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `unplayed` | an accent dot after the time; it rises in, and fades as the row closes up in place when it clears | the recipient has not listened yet | |
| `disabled` | muted disk, no played bars, disabled time | the recording cannot be played (deleted, expired) | |

## States
| State | Driven by | DOM |
|---|---|---|
| paused | initial, pause, end, another sound starting | the elapsed time (the total at the start); `data-state="idle"` / `"paused"` on the disk; `aria-label` of the disk is `labels.play`; `onPlayingChange(false)` |
| playing | the disk, `playing` / `defaultPlaying` | `data-playing="true"`, the play glyph cross-fades and scales into pause, the played bars follow every frame, the time counts up; `onPlayingChange(true)` |
| seeking | a pointer drag on the waveform | `data-seeking="true"`; playback pauses during the drag and resumes after |
| sought | a click or a key on the waveform | the elapsed time; the played bars glide to the new position |
| ended | the media ends | a full reset: stopped, back at the start, the played bars glide empty, the total time and the play glyph return, the one-sound session is released; `onPlayingChange(false)`, `onEnded` |
| rate | the rate chip, `rate` / `defaultRate` | `1×` → `1,5×` → `2×` → `1×`; the chip's text flows into the new speed; `onRateChange` |
| unplayed | `unplayed` | the accent dot and visually hidden `labels.unplayed` |
| disabled | `disabled`, or a disabled `Fieldset` around it | `data-disabled="true"`, disabled disk, chip, transcript button and transfer disk, slider `aria-disabled`, `tabindex="-1"`; nothing plays by a press, a key or `playing` |
| transferring | `transfer` `queued` / `loading`, `transferProgress` — the recording is sent or received (one look both ways, `transferDirection` changes only the words) | `data-transfer="true"`; the play disk itself turns into the transfer — the same button, size and fill (the accent disk, the light disk in an outgoing bubble), the same in a bubble and outside it: the play glyph cross-fades into a × in the glyph's colour, and the share is the Button's `progress` ring along the inner edge (the kit ring at the line weight, 2px; a 32% track, the arc from 12 o'clock gliding `base`, always turning; a quarter arc without a share); the button is `aria-busy` and described by `uploadProgress` / `downloadProgress`; the × is `onCancel`; no played bars, slider `aria-disabled` with `tabindex="-1"`, rate chip disabled |
| transfer failed | `transfer="failed"` | the disk turns danger with a retry arrow (`retryUpload` / `retryDownload`, described by `notSent` / `notReceived`); `onRetry` |
| remote | `transfer="remote"` | not fetched yet: the download arrow on the same disk (`labels.download`), no ring; `onDownload` — then `loading` with `transferDirection="download"` |
| transferred | `transfer="done"` | the ring fades where it is (`fast`) and the × cross-fades back into the play glyph on the same disk |
| transcript open | the transcript button, `transcriptExpanded` / `defaultTranscriptExpanded` | the button's glyph cross-fades into a chevron up, `aria-expanded="true"`, `aria-controls` → the text area; the always-present collapsed disclosure opens at once, the height and the text in one layout; in a chat the view is held still first (`holdPosition`), so the bubble grows downward and the player row never moves; the meta goes to the text's last line; `onTranscriptExpandedChange(true)` |
| transcript pending | an open with no text while `onTranscribe`'s Promise is in flight | only the button spins (`loading`, `aria-busy`, `aria-expanded="false"`); the area stays closed — no placeholder — and opens with the text once it arrives; when `onTranscribe` returns nothing, the button spins until `transcript` comes |
| transcript failed | `onTranscribe` rejects | the area closes (the mirror of the open), `onTranscriptExpandedChange(false)`, `labels.transcribeFailed` announced; the next open asks again |
| transcript closed | the button again, `transcriptExpanded={false}` | the mirror of the open: at once, in one layout, the view held still; the meta goes back to the time row; the text stays mounted and turns `visibility: hidden` |

## Layout & spacing
- One row: the disk (`l` tier, 40px) and a column of the waveform (20px high) over the caption-size time row (time, unplayed dot, rate chip); gap `--prime-space-3`.
- Inside `Message.Root` the player sits on the bubble fill with the meta in its corner: the time row ends with the meta's spacer (the transcript's last line while it is open), so the bubble's time and status never overlap the time or the chip.
- Width: the content's own (the waveform column is 192px, the transcript button included) and never wider than the container; the column shrinks to 64px on 320px screens. Give the root `width: 100%` to fill a card — the waveform grows with it and draws more bars.
- Bars have a fixed width and gap; the waveform data is resampled to the number that fits.
- With `transcript` or `onTranscribe` the waveform line ends with a soft `xs` icon button (gap `--prime-space-2`); the transcript opens `--prime-space-2` under the row, `body-m` text as wide as the player — it never widens the player or the bubble.
- In a chat, opening and closing the transcript is one motion of the message: the height and the width change together and the text fades in or out where it stands. The text is selectable, and the chat search marks its matches in it.
- An uncontrolled transcript keeps its open state and resolved text while the message is rendered. Keep `transcript` with your message data (store what `onTranscribe` returns) so it survives a reload too.
- Bars have the geometry of the Composer's live wave (`--prime-space-1 × 0.75` wide, `--prime-space-1 / 2` apart, centred on the line); their count follows the waveform's observed width. While playing, one CSS variable on the played layer is the only per-frame write; the clock re-renders once a second.
- One sound at a time on the page: starting a voice message pauses whatever else plays with sound — another voice message, a `VideoNote`, a video in `Message.Media` — and starting any of them pauses the player. Muted previews never count.
- Symmetric with [VideoNote](../video-note/COMPONENT.md): the same shared props (`MediaPlayerProps`: `src`, `duration`, `unplayed`, `disabled`, the playing triad, `onEnded`, the transcript and the transfer), labels keys, `data-*` and keys. Its own props are `waveform` and the rate triad — speech is listened to faster, a face is watched at its own pace; it seeks on its waveform slider where the circle seeks from its disk.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus: the disk (or the transfer disk), the waveform slider, the rate chip, the transcript button. |
| `Enter` · `Space` | On the disk: play or pause; on the chip: the next speed; on the transcript button: open or close the text. |
| `ArrowRight` · `ArrowUp` | On the waveform: 5 seconds forward. |
| `ArrowLeft` · `ArrowDown` | On the waveform: 5 seconds back. |
| `PageUp` · `PageDown` | On the waveform: 10 % of the recording forward or back. |
| `Home` · `End` | On the waveform: to the start or the end. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The root is `role="group"` named by `labels.player` (or your `aria-label`).
- The disk is named `labels.play` while paused and `labels.pause` while playing. While the recording is sent, received or not fetched the same button is the transfer, named by the direction — `cancelUpload` / `cancelDownload` described by `uploadProgress` / `downloadProgress` (`aria-busy`), after a failure `retryUpload` / `retryDownload` described by `notSent` / `notReceived`, `download` for a remote one; its ring is `aria-hidden`; a refused cancel, retry or download is announced (`role="status"`).
- The waveform is `role="slider"` with `aria-valuemin`, `aria-valuemax` (seconds), `aria-valuenow` and `aria-valuetext` from `labels.position`.
- The rate chip is named `labels.rate`; while `unplayed`, `labels.unplayed` is read after the time — the dot is never the only cue.
- One sound at a time: starting a player pauses any other voice message or chat video, which reports `onPlayingChange(false)`.
- The transcript button is named `labels.transcribe` / `labels.hideTranscript`, with `aria-expanded` and `aria-controls` on the text area; while asked, the button is `aria-busy` and the area stays closed. The text is a plain paragraph, read and selected as normal text; a failed request is announced with `labels.transcribeFailed` (`role="status"`).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `player` | `"Голосовое сообщение"` | Name of the player group. |
| `play` | `"Воспроизвести голосовое сообщение"` | Name of the play disk while it does not play. |
| `unplayed` | `"Не прослушано"` | Visually hidden text read while `unplayed`. |
| `seek` | `"Перемотка"` | Name of the waveform slider (its `aria-valuetext` is `position`). |
| `rate` | `"Скорость воспроизведения: {rate}"` | Name of the rate chip; `{rate}` as shown on it. |
| `pause` | `"Пауза"` | Name of the play disk while it plays. |
| `position` | `"{current} из {duration}"` | The position: `{current}` and `{duration}` as m:ss. |
| `transcribe` | `"Расшифровать"` | Name of the transcript button while the text is closed. |
| `hideTranscript` | `"Скрыть расшифровку"` | Name of the transcript button while the text is open. |
| `transcribeFailed` | `"Не удалось расшифровать сообщение"` | Announced when `onTranscribe` rejects. |
| `cancelUpload` | `"Отменить отправку"` | The transfer of the recording: the cross while sending. |
| `cancelDownload` | `"Отменить загрузку"` | The transfer of the recording: the cross while receiving. |
| `retryUpload` | `"Повторить отправку"` | The transfer of the recording: the retry after a failed send. |
| `retryDownload` | `"Повторить загрузку"` | The transfer of the recording: the retry after a failed receive. |
| `uploadProgress` | `"Отправка {percent}%"` | The transfer of the recording: the share while sending — the description of the cross. |
| `downloadProgress` | `"Загрузка {percent}%"` | The transfer of the recording: the share while receiving — the description of the cross. |
| `notSent` | `"Не отправилось"` | The transfer of the recording: why a send failed — the retry's description. |
| `notReceived` | `"Не загрузилось"` | The transfer of the recording: why a receive failed — the retry's description. |
| `download` | `"Скачать"` | The transfer of the recording: the download arrow of a `remote` content. |
| `cancelFailed` | `"Не удалось отменить"` | The transfer of the recording: announced when `onCancel` rejected. |
| `retryFailed` | `"Не удалось повторить"` | The transfer of the recording: announced when `onRetry` rejected. |
| `downloadFailed` | `"Не удалось скачать"` | The transfer of the recording: announced when `onDownload` rejected. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A client's voice message to support, ready to play — `src`, `waveform`, `duration`. |
| [states.tsx](examples/states.tsx) | Every state side by side, each labelled by its prop: the transfer is drawn on the play disk itself — in flight with the cross and the ring, failed with the retry, not fetched with the download arrow — `unplayed`, `transfer`, `transferProgress`, `disabled`. |
| [call-recording.tsx](examples/call-recording.tsx) | A sales call recording on a deal card: the telephony stores no levels, so the waveform is read from the audio itself and the calm flat row fills in once it is ready; the player takes the card's width — `getWaveform`, `waveform`, `className`. |
| [in-message.tsx](examples/in-message.tsx) | Voice messages in a support chat: the player sits on the bubble fill and the bubble's time stands in its corner — `Message.Root`, `time`, `status`. |
| [transcript.tsx](examples/transcript.tsx) | Voice messages with a transcript: one known, one asked for on the first open — `transcript`, `onTranscribe`. |
| [transfer.tsx](examples/transfer.tsx) | One look for a recording on its way in either direction: the client's voice message waits to be fetched and then arrives, the reply is being sent — the play disk itself carries the cross and the ring of the share, a dropped connection offers a retry, and the play glyph comes back once it is through — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`. |
| [controlled.tsx](examples/controlled.tsx) | The parent knows what plays, marks the message as listened on the first play and as heard to the end when it ends, keeps the speed and keeps the transcript open — `playing`, `onPlayingChange`, `unplayed`, `onEnded`, `rate`, `onRateChange`, `transcriptExpanded`, `onTranscriptExpandedChange`. |

## Mistakes
- A hand-made `<audio controls>` in a bubble → use `VoicePlayer`: it matches the bubble's colors and keeps room for the time.
- `unplayed` never cleared → clear it when `onPlayingChange(true)` comes.
- Decoding the audio for its waveform on every render → call `getWaveform` once and store the levels with the message.
- Hard-coded colors on the player inside a bubble → the bubble overrides the semantic roles; style nothing.
- Pausing other players or chat videos by hand → the kit keeps one sound at a time itself.
- A transcript as a `Message.Text` under the voice message → pass `transcript` / `onTranscribe`: the text opens on demand inside the same bubble.
- `onTranscribe` that resolves `undefined` or returns `true` → resolve the text itself, or return nothing and pass `transcript` when it comes.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (the play disk, `shape="circle"`; the transcript button; the rate chip, soft neutral `density="inline"`), [Spinner](../spinner/COMPONENT.md), Icon (`action.play`, `action.pause`, `action.transcribe`, `nav.chevronUp`); `internal/disabledContext` (a disabled `Fieldset`), `internal/mediaPlayer` (the playing triad, the transcript button and the transfer shared with VideoNote), `internal/transferDisk` (the transfer's logic on the play disk: `useTransferDisk`), `internal/transcript` + `internal/Disclosure` (the transcript), `internal/mediaSession` (one sound at a time), `internal/audio` (`getWaveform`'s decoding and peaks, shared with the Composer's recorder), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [VideoNote](../video-note/COMPONENT.md) — the round video message, the same player contract; [Message](../message/COMPONENT.md) — the bubble a voice message sits in; [Composer](../composer/COMPONENT.md) — records the voice message; [Slider](../slider/COMPONENT.md), [ProgressBar](../progress-bar/COMPONENT.md)
