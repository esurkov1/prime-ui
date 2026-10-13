# MediaViewer

**Category:** overlays
**Kind:** overlay

> A full-screen viewer of photos and videos that behaves like a native one: pages follow the finger, pictures zoom and pan with momentum, a swipe closes it, and it opens out of the thumbnail it came from.

## When to use
- Photos of a record opened from their thumbnails: an acceptance, an inspection report of hundreds of photos, a damage claim, a listing.
- Scans of documents read closely: a contract, an invoice, a delivery note — zoom in to read the small print.
- Photos and videos of one place together: a site visit, a vehicle, a warehouse walkthrough.
- The viewer behind a grid of `Thumbnail` buttons; `Gallery` and `Message.Media` open it by themselves.

## When not to use
- A picture as part of a form or a card → use [Thumbnail](../thumbnail/COMPONENT.md) in place.
- An album of photos inside a message or a feed → use [Gallery](../gallery/COMPONENT.md); it opens MediaViewer from its tiles itself.
- A dialog with a picture and text or a form around it → use [Modal](../modal/COMPONENT.md).
- A video message or a voice message in a chat → use [VideoNote](../video-note/COMPONENT.md) / [VoicePlayer](../voice-player/COMPONENT.md).

## Import
```tsx
import { MediaViewer } from "prime-ui-kit";
```

## Anatomy
```
MediaViewer                        portal + role="dialog", a dark theme island over the page
├─ (backdrop)                      near-black stage (--prime-color-media-stage), fades with a swipe
├─ (stage)                         takes every gesture: page, pinch, pan, double tap, swipe away
│  └─ (page) × up to 5             role="group" slide: the current one and two on each side
│     ├─ (thumbnail)               blurred stand-in until the full picture has shown over it
│     ├─ (picture | video)         fitted to the stage; zooms and pans
│     ├─ (still)                   a video's frame from the thumbnail it opened from, until it has its own
│     ├─ (play disk)               a video standing still, after the flight
│     └─ (bottom bar)              caption; a video's play · time · seek Slider · length · sound
│        └─ (level)                upright Slider in a panel over the sound button
├─ (top bar)                       counter · renderActions · zoom · close
├─ (arrows)                        previous / next, on a hovering pointer only
└─ (filmstrip)                     nav of thumbnails: only those in view mounted, the current in the middle
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### MediaViewer
`ref` → `HTMLDivElement` (the `role="dialog"` element). A full-screen viewer of photos and videos: pages follow the finger, pictures zoom and pan, a swipe closes it, and it opens out of the thumbnail it came from and closes back into it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly MediaViewerItem[]` | — (required) | `{ type?: "image" \| "video", src, thumbnail?, poster?, alt?, caption?, width?, height? }`: `thumbnail` stands in while `src` loads, `width` / `height` give the picture its box before load. |
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: the close button, Escape, a swipe, a click on the stage past the media. |
| `index` | `number` | — | The item on screen (controlled); together with `onIndexChange`. |
| `defaultIndex` | `number` | `0` | The item shown first, uncontrolled. |
| `onIndexChange` | `(index: number) => void` | — | The page turned: a swipe, an arrow, a key, a thumbnail of the filmstrip. Fires once the page has settled, also after a slide to a far item. |
| `loop` | `boolean` | `false` | Past the last item comes the first, and back (with three items or more). |
| `maxZoom` | `number` | `4` | How far a picture zooms, times its fitted size. |
| `thumbnails` | `boolean` | `false` | A filmstrip of every item along the bottom: it follows the page, scrolls on its own at rest, and a press slides to that item. |
| `autoPlay` | `boolean` | `true` | A video starts once its page settles, muted where the browser refuses sound without a press. `false` — it waits for a press on its play disk. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the viewer. |
| `closeOnOutsideClick` | `boolean` | `true` | A vertical swipe, or a mouse click on the stage past the media, closes the viewer. |
| `getOrigin` | `(index: number) => Element \| null` | — | The element item `index` opens from and closes into (its thumbnail). Without it the viewer finds the picture showing the item's `thumbnail`, `src` or `poster`; with none on screen, it fades. |
| `renderActions` | `(item: MediaViewerItem, index: number) => ReactNode` | — | Actions for the item on screen in the top bar, before the zoom and close buttons: `Button shape="circle" variant="shade"`, a ⋯ Dropdown. |
| `labels` | `Partial<MediaViewerLabels>` | — | System strings, see Labels. |
| `aria-label` | `string` | — | The name of the dialog; default `labels.viewer`. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the `role="dialog"` element. |

## Variants
MediaViewer has no `variant`, `size` or `tone`: the stage is always near black, in both themes (media reads truest on it), and the bars are the media shade. What changes is what it holds and shows:

| Value | Looks like | Use when | Default |
|---|---|---|---|
| images | pictures that zoom (pinch, double tap, wheel, `+` / `-`) up to `maxZoom` | photos, scans | yes |
| `type: "video"` items | the frame, a play disk, a bar with play, time, seek, length and the sound button with its upright level; no zoom; it pauses when its page leaves | a walkthrough, a recording among the photos | |
| one item | no counter, no arrows, no filmstrip | a single scan opened from a link | |

### Flags
- `thumbnails` — a filmstrip of every item along the bottom; it glides with the page on every frame, the emphasis flows from one thumbnail to the next, the current one stays in the middle; only the thumbnails in view are mounted. At rest it is a scroller of its own (wheel, trackpad, finger, mouse drag) and stays where it was left; the next page turn glides it back.
- `autoPlay` — a video starts once its page settles, muted where the browser refuses sound, and the sound button brings the sound back (default `true`); `false` waits for a press.
- `loop` — past the last item comes the first (with three items or more).
- `closeOnOutsideClick` — a vertical swipe or a mouse click past the media closes (default `true`).
- `closeOnEscape` — Escape closes (default `true`).

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the dialog; mounted until the picture has flown back into its thumbnail (or faded) |
| page | `index` / `defaultIndex` / `onIndexChange` | `data-current` on the page on screen; the pages around it are `aria-hidden` and `inert`; `onIndexChange` fires once the page has settled |
| far slide | a thumbnail, `Home` / `End` | the far item is mounted as the neighbour on its side and slides in; the real neighbour there is hidden meanwhile |
| zoomed | a pinch (also a trackpad pinch), a double tap, ⌘ / Ctrl + wheel, the zoom button, `+` / `-` / `0` — about the point, up to `maxZoom` | `data-zoomed` on the dialog; the zoom button turns «Уменьшить» |
| gesture | a finger or the mouse dragging | `data-gesture="page \| pan \| pinch \| dismiss"` on the dialog |
| chrome hidden | a tap, a pinch or a double tap (Tab brings it back); a playing video after 2.5 s without the pointer moving | `data-chrome="hidden"`: the bars fade and drift aside, take no presses; while a video plays the pointer hides too (`data-playing`). A video standing still always keeps its bar |
| flight | open and close | `data-phase="opening \| open \| closing"`: only the picture moves; the play disk and the bars come after it lands and go before it takes off |
| loading | the full picture is on its way or decoding | `data-status="loading"` on the page; a picture shows only once it is decoded, and the `thumbnail` stands in, blurred, until the picture has fully shown over it, so no frame is blank; without one a Spinner |
| error | the picture or the video failed | `data-status="error"`: a «Не удалось загрузить» panel with «Повторить» |
| sound | the sound button, its level panel (hover, focus, a tap), ↑ / ↓, M | one `volume` and mute for every video of the viewer; `data-open` on the sound control while the level shows; `autoPlay` refused with sound starts muted |

Motion: it opens out of the thumbnail it was opened from — the picture grows from the thumbnail's shape to its fit over `base` on the `emphasized` curve while the stage fades in — and closes back into the thumbnail of the item on screen (`getOrigin`; without it the opener for the item it opened at, and for any other item the picture on the page that shows its `thumbnail`, `src` or `poster`, nearest the opener — paging on in a grid still closes into the right tile); without one, or with less than a fifth of it in view, it rises from a slight shrink and fades. The shape is what the page shows of the thumbnail: its media box, cut by every clipping ancestor (a scroller, a rounded album, a bubble) and the viewport, and the radius of each corner taken from the frame whose corner it is — an album's inner tiles fly square, its corner tiles round only on the outer side, and the corners glide all the way, never snap. During the flight only the picture moves; a video flies as the frame of the thumbnail it opened from (drawn before the first paint), starts only after it lands (`autoPlay`) and pauses before it takes off. Released gestures settle with a spring: a page turns past half its width or on a flick, and any other item — a thumbnail far along the strip, `Home` / `End` — arrives by the same slide, never a cut or a fade; the filmstrip follows the track on every frame, so its glide and the emphasis of its thumbnails move with the finger and settle with the page; a zoomed picture coasts with iOS momentum (deceleration 0.998 / ms) and springs back from its edges, and at its edge a sideways drag turns the page; a pinch past its range resists like a rubber band and settles inside it, a swipe away shrinks the picture and thins the stage and closes past 12% of the height or on a flick. Under `prefers-reduced-motion` the open and close are instant and the springs land at once; the picture still follows the finger.

## Layout & spacing
- Full screen, always: the stage is the viewport, the picture is fitted into all of it (`object-fit: contain`); the bars float over it on the media shade, `--prime-media-viewer-inset` from the edges plus the safe areas.
- Pages are `--prime-media-viewer-page-gap` apart while one slides into the next.
- An item (`MediaViewerItem`): `type` (`"image"` by default, or `"video"`), `src`, `thumbnail` (a small copy), `poster` (a still of a video), `alt` (the picture's text, the name of its page and of its filmstrip thumbnail), `caption` (a line or two under the picture), `width` / `height` (the natural size; without them 4 : 3 until the file reports its own).
- Give each item `width` and `height`: the picture takes its final box before it loads, and the open from the thumbnail lands exactly. Give `thumbnail` (the small copy the grid already shows): it stands in at once while the full picture loads and is what the filmstrip shows.
- Hundreds of items are fine: only five pages and the thumbnails in view are mounted; pass the whole list as `items`.
- Actions from `renderActions` are shade circle buttons like the built-in ones: `Button shape="circle" variant="shade"`.

```tsx
<MediaViewer
  items={photos}
  open={open}
  onOpenChange={setOpen}
  index={index}
  onIndexChange={setIndex}
  renderActions={(item) => (
    <Button.Root shape="circle" variant="shade" aria-label="Скачать фото" asChild>
      <a href={item.src} download>
        <Button.Icon>
          <Icon name="action.download" />
        </Button.Icon>
      </a>
    </Button.Root>
  )}
/>
```

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowLeft` · `ArrowRight` | Turn the page (mirrored in RTL); at an end without `loop` the track nudges back. |
| `Home` · `End` | Slide to the first and the last item. |
| `+` · `-` | Zoom the picture in (`=` too) and out a step; `0` brings it back to the fit. |
| `Space` · `K` | Video: play and pause. |
| `Shift+ArrowLeft` · `Shift+ArrowRight` | Video: seek 5 seconds back and forward. |
| `ArrowUp` · `ArrowDown` | Video: raise and lower the sound. |
| `M` | Video: mute and unmute. |
| `Escape` | Closes the viewer (`closeOnEscape`); focus returns to the element that opened it. |
| `Tab` · `Shift+Tab` | Cycle focus inside the viewer and bring the bars back. |

### ARIA
- `role="dialog"`, `aria-modal="true"`, named by `aria-label` or `labels.viewer`.
- Every page is a `role="group"` with `aria-roledescription="слайд"` and a name like «3 из 12»; the neighbours are `aria-hidden` and `inert`.
- A page change is read out by a polite live region: «{alt}, 3 из 12».
- Every gesture has a single-pointer alternative: arrows and keys turn pages, the zoom button and keys zoom, the close button closes (WCAG 2.5.1, 2.5.7).
- With `autoPlay` a video starts once its page settles; pause, sound and its level are always on the bar (WCAG 1.4.2), and `autoPlay={false}` leaves the start to the person. The seek slider names the time in `aria-valuetext`, the level slider the percent.
- A video's bar stays while it stands still; while it plays it steps aside after 2.5 s without the pointer moving and comes back on any move, key or touch — never while the pointer rests on it, focus is in it or the level is open.
- The level is an upright Slider in a panel over the sound button: it opens on hover, on focus (Tab) and on a tap; Escape closes the panel, not the viewer. A mouse click on the button mutes; a click on the video plays and pauses it.
- The page under the viewer is `inert`, scroll is locked; on close focus returns to the opener.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `viewer` | `"Просмотр медиа"` | The name of the dialog when no `aria-label` is given. |
| `close` | `"Закрыть"` | The close button. |
| `previous` | `"Предыдущее"` | The arrow back. |
| `next` | `"Следующее"` | The arrow forward. |
| `zoomIn` | `"Увеличить"` | The zoom button at the fit. |
| `zoomOut` | `"Уменьшить"` | The zoom button while zoomed: back to the fit. |
| `counter` | `"{current} из {total}"` | The counter in the top bar and the name of a page. |
| `slide` | `"слайд"` | What a page is to assistive tech (`aria-roledescription`). |
| `photo` | `"Фото"` | `{name}` of a picture without `alt`. |
| `video` | `"Видео"` | `{name}` of a video without `alt`. |
| `thumbnails` | `"Миниатюры"` | The filmstrip. |
| `show` | `"Показать: {name}"` | A thumbnail of the filmstrip; `{name}` is the item's `alt`, else `photo` / `video`. |
| `announcement` | `"{name}, {current} из {total}"` | Read out when the page changes. |
| `loadError` | `"Не удалось загрузить"` | A picture or a video that failed to load. |
| `retry` | `"Повторить"` | Loads it again. |
| `play` | `"Воспроизвести"` | The play disk and the play button of a video while it stands still. |
| `pause` | `"Пауза"` | The play button of a video while it plays. |
| `mute` | `"Выключить звук"` | The sound button while the sound is on. |
| `unmute` | `"Включить звук"` | The sound button while the sound is off. |
| `volume` | `"Громкость"` | The sound level slider of a video. |
| `volumeValue` | `"{value} %"` | The value of the level slider: `{value}` in percent. |
| `seek` | `"Перемотка"` | The seek slider of a video. |
| `position` | `"{current} из {duration}"` | The value of the seek slider: `{current}` and `{duration}` as m:ss. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Photos of an acceptance open full-screen from their thumbnails, at the one that was pressed — `items`, `open`, `index`. |
| [thumbnails.tsx](examples/thumbnails.tsx) | A warehouse inspection of 120 photos with a filmstrip and captions: only the thumbnails in view are mounted — `thumbnails`, `caption`. |
| [video.tsx](examples/video.tsx) | A video among the photos of a site visit starts once its page settles; its bar has play, time, seek, the sound button and its level, and it has no zoom — `type`, `autoPlay`. |
| [actions.tsx](examples/actions.tsx) | Photos of a listing with actions for the one on screen: download it or make it the cover — `renderActions`. |
| [origin.tsx](examples/origin.tsx) | Every photo flies back into its own thumbnail, also after paging, and the last one leads to the first — `getOrigin`, `loop`. |
| [dismiss.tsx](examples/dismiss.tsx) | Contract scans read closely: a stray swipe or click past the page never closes them, only Escape and the close button — `closeOnOutsideClick`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the page: a finding opens its photo, and paging in the viewer moves the mark along the list — `index`, `onIndexChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent opens a single scan from a link in the text: no counter and no arrows for one item — `open`, `onOpenChange`. |

## Mistakes
- `index` cleared together with `open` (`index={opened ?? 0}`) → keep `open` and `index` in two states; the closing picture flies back into the thumbnail of the item still on screen.
- A Modal with an `<img>` inside as a photo viewer → use MediaViewer: gestures, zoom, paging and the flight from the thumbnail come with it.
- Items without `width` / `height` → the picture starts at 4 : 3 and refits on load; pass the natural size when you have it.
- A full-size `src` in the grid of thumbnails → give the grid small copies and pass them as `thumbnail`: the viewer shows them at once while the full picture loads.
- Ghost buttons in `renderActions` → they vanish over a bright photo; use `Button shape="circle" variant="shade"`.
- `closeOnOutsideClick={false}` and `closeOnEscape={false}` together → only the close button is left; keep at least Escape.
- Paging a long report by cutting the list into chunks of 10 → pass every item; the viewer mounts five pages and the filmstrip only what is in view.
- `autoPlay` left on for videos people need to read beside (a recording next to a form) → `autoPlay={false}`; the play disk starts it.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (bars, arrows, play disk, video controls), [Slider](../slider/COMPONENT.md) (video seek; the sound level, `orientation="vertical"`), [Thumbnail](../thumbnail/COMPONENT.md) (filmstrip), [ScrollContainer](../scroll-container/COMPONENT.md) (filmstrip), [Spinner](../spinner/COMPONENT.md) (loading without a thumbnail), `Icon`
- **See also:** [Gallery](../gallery/COMPONENT.md) and [Message](../message/COMPONENT.md) (`Message.Media`): their albums open MediaViewer by themselves, [Thumbnail](../thumbnail/COMPONENT.md) (a pressable thumbnail), [Modal](../modal/COMPONENT.md), [VideoNote](../video-note/COMPONENT.md)
