# Carousel

**Category:** data-display
**Kind:** primitive

> Photos and videos of one record in one box of a fixed ratio: a finger or a mouse drag swipes them, the dots, the arrows and the keys step.

## When to use
- The cover of a catalogue card with several photos of the object (a vehicle, a product, a listing).
- The photos of a record at the top of its page or its Drawer, with `arrows`.
- A short muted clip of the object among its photos (`type: "video"`, `autoPlay`).

## When not to use
- One picture of an object → use [Thumbnail](../thumbnail/COMPONENT.md).
- Photos and videos shown all at once as an album (a chat, a comment) → use [Gallery](../gallery/COMPONENT.md).
- Full-screen viewing with zoom → use [MediaViewer](../media-viewer/COMPONENT.md), opened from the carousel by `onItemOpen`.
- Slides of text or cards that turn by themselves (a promo banner) → not a kit pattern; show the content on the page.

## Import
```tsx
import { Carousel } from "prime-ui-kit";
```

## Anatomy
```
Carousel.Root          <section aria-roledescription="карусель">, the box of `ratio`
├─ slide × items       role="group" aria-roledescription="слайд", moved by the track
│  ├─ media            <img>, or <video> (first frame or poster under the play mark)
│  ├─ fade             the media shade under the bottom line (with the dots)
│  └─ corners          the slide's own Carousel.Overlay parts (`renderOverlay`) and a video's
│                      length and sound button: they travel with the slide
├─ corners             the carousel's Carousel.Overlay parts (children): they stand still
│  └─ dots             a <button> per slide, centred on the bottom line; the pill follows the track
└─ arrows              previous / next shade circle Buttons (`arrows`)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Carousel.Root
`ref` → `HTMLElement` (the `<section>`). Photos and videos of one record in a box of a fixed ratio, as wide as its container: a finger or a mouse drag swipes them, the dots, the arrows and the keys step, `scrub` lets a hovering mouse pick. The slides never turn by themselves.

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `readonly CarouselItem[]` | — (required) | `{ type?: "image" \| "video", src, alt?, poster?, duration?, autoPlay?, loop? }`. A video shows its first frame or `poster`; `autoPlay` plays it muted while current and in view, `loop` (default `true`). |
| `ratio` | `"1:1" \| "4:3" \| "3:2" \| "16:10" \| "16:9" \| "3:4"` | `"4:3"` | Aspect ratio of the box, width ÷ height; the photos cover it. |
| `loop` | `boolean` | `false` | Past the last slide comes the first, and back (with three slides or more); without it an end resists the finger and the arrow there leaves. |
| `index` | `number` | — | The current slide (controlled); together with `onIndexChange`. |
| `defaultIndex` | `number` | `0` | The slide shown first (uncontrolled). |
| `onIndexChange` | `(index: number) => void` | — | The slide changed: a swipe, the scrub, a dot, an arrow, a key — at once, while the track still glides. |
| `arrows` | `boolean` | `false` | Previous and next buttons (`Button shape="circle" variant="shade"`) at the sides: shown while the pointer is over the box or the focus is in it, always on a touch screen. |
| `dots` | `boolean` | `true` | A dot per slide centred on the bottom line, the current one a pill that follows the track; `false` leaves them and their fade out. Never for one slide. |
| `scrub` | `boolean` | `false` | A hovering mouse shows the slide of the zone under it (the width split in as many zones); leaving the box brings back the slide it found — a quick look along a catalogue. Starts a moment after mount. |
| `loading` | `boolean` | `false` | The record loads: a Skeleton fills the box; the slides replace it in place. |
| `onItemOpen` | `(index: number) => void` | — | A press on the slide (not after a swipe, not on a dot or an arrow), Enter or Space on the focused carousel: open the item — in `MediaViewer`, which opens out of the picture on screen. |
| `renderOverlay` | `(item: CarouselItem, index: number) => ReactNode` | — | The slide's own `Carousel.Overlay` parts («Царапина на крыле»): they travel with their slide and continue the row of the carousel's overlays in the corner. |
| `labels` | `Partial<CarouselLabels>` | — | Built-in strings, see Labels. |
| `aria-label` | `string` | — | The name of the carousel; default `labels.region`. |
| `children` | `ReactNode` | — | `Carousel.Overlay` parts of the carousel: they stand still while the slides change. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "defaultValue" \| "onChange">` | — | `className`, pointer and key handlers and the other attributes of the `<section>`. |

### Carousel.Overlay
`ref` → `HTMLDivElement`. Content on the media in a corner — a status Badge, a plate: a child of the root stands still, one from `renderOverlay` travels with its slide. A corner is one row, nearest the corner first, all the edge beside an empty one; what does not fit steps aside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `placement` | `"top-start" \| "top-end" \| "bottom-start" \| "bottom-end"` | `"top-start"` | The corner; the four stand the same inset from the edges, the bottom ones on the line of the dots. A video slide puts its length and sound button in its bottom-end corner. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other attributes. |

## Variants

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `ratio="4:3"` | A photo box | Catalogue cards, vehicles, products | ✓ |
| `ratio="1:1"` | A square | A tight grid, phone listings | |
| `ratio="3:2"` · `"16:10"` · `"16:9"` | A wide box | The top of a record's page, a wide card, a listing cover | |
| `ratio="3:4"` | A portrait box | Portrait photos (clothes, documents) | |

### Flags
| Flag | Effect |
|---|---|
| `loop` | Past the last slide comes the first (three slides or more); the arrows never leave. |
| `arrows` | Previous and next shade buttons at the sides, shown on hover and focus, always on touch. |
| `dots` | On by default: the dots and their fade; `false` leaves both out (the keys, the arrows, the swipe and the announcement stay). |
| `scrub` | A hovering mouse shows the slide of its zone; leaving brings back the slide it found. A quick look along a catalogue of cards; off on a record's own page. |

## States

| State | Driven by | DOM |
|---|---|---|
| Loading | `loading` | a Skeleton fills the box; `aria-busy="true"` |
| Empty | `items` is empty | the image tile, `role="img"` named `labels.empty` |
| One slide | one item | no dots, no arrows, no swipe, no scrub |
| No dots | `dots={false}` | no dot buttons and no fade; the bottom corners keep their inset |
| A slide loads | the media's load | a Skeleton under it until it is in; the picture fades in |
| A slide failed | the media's `error` | the image tile, `role="img"` named `labels.loadError` |
| Current slide | `index` / `defaultIndex` | the others `aria-hidden` and `inert`; the dot `aria-current` |
| Video still | a video without `autoPlay`, or under reduced motion or data saving | first frame or `poster`, the play mark, the length (`duration`, else from the file) |
| Video playing | `autoPlay` while current and at least half in view | muted; the play mark fades away, the sound button enters; it pauses once swiped, scrubbed or scrolled away |
| Video ended | `autoPlay` with `loop: false` | the last frame under the play mark; it starts again when it comes back |
| Opens | `onItemOpen` | `data-opens`; pointer cursor |
| Corner split | the overlays on an edge, the dots | `data-split="share"` on an edge: each corner as wide as its row, the whole edge beside an empty corner; `data-split="half"` with the dots or with both layers' overlays on the edge |

## Layout & spacing
- The box is as wide as its container and as high as `ratio` makes it; the photos cover it (`object-fit: cover`). Radius `l`; inside `Card.Media` of a `cover` card the card's corners and its height cap shape it.
- The four corners stand `space-3` in from the edges. The dots are centred on the bottom line between the two bottom corners, on the same centre line as their badges.
- A corner's row takes what it needs of its edge: one whose opposite corner is empty runs across the whole edge (a long status in the top-start corner of a narrow card), two that do not fit give way evenly. The bottom edge keeps the dots' room in the middle (the two bottom corners take a half each beside them), and an edge where both the carousel's and a slide's own overlays stand splits in halves.
- A corner is one row a Badge.Group gap apart, nearest the corner first: the carousel's overlays, then the slide's own (`renderOverlay`), then — in the bottom-end corner — a video's length and sound button. One that does not fit beside the ones before it steps aside (hidden, `inert`); put the one that matters most first.
- A slide's overlays travel with it under the finger and the spring; a slide that arrives at once (a scrub) fades its overlays in. The carousel's overlays never move.
- The dots' pill follows the track every frame: on the way to the next slide it stretches to the next dot, then follows; with `loop` it jumps across the seam between the last and the first dot; under reduced motion it switches with the slide.
- The arrows sit centred on the sides, between the top and the bottom corners.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Focuses the carousel, then the arrows (`arrows`) and the current dot. |
| `ArrowLeft` · `ArrowRight` | On the carousel or a dot: the previous and the next slide (the focus follows to the new dot); at an end without `loop` the track nudges back. |
| `Home` · `End` | The first and the last slide. |
| `Enter` · `Space` | On the carousel: opens the current item (`onItemOpen`); on a dot or an arrow: presses it. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A `<section>` with `aria-roledescription="карусель"` named by `aria-label` or `labels.region`; every slide is a `role="group"` with `aria-roledescription="слайд"` named «Фото 2 из 5»; the slides out of view are `aria-hidden` and `inert` (WAI-ARIA APG carousel).
- A slide change by a key, a dot, an arrow or a swipe is read out by a polite live region («Фото 2 из 5»); the mouse scrub is not.
- A dot is a `<button>` named like its slide; the current one has `aria-current` and is wider, so the place is not told by color alone. Only the current dot is a Tab stop.
- Every gesture has a single-pointer alternative: the dots and the arrows step, the keys move (WCAG 2.5.1). The slides never turn by themselves (WCAG 2.2.2).
- A video's play mark is decorative and its length is text; name it with `alt`. An `autoPlay` clip plays muted and has its sound button (`labels.unmute` / `labels.mute`) while it plays; with sound it is the one sound of the page.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `region` | `"Фотографии"` | The name of the carousel when no `aria-label` is given. |
| `carousel` | `"карусель"` | What the carousel is to assistive tech (`aria-roledescription`). |
| `slide` | `"слайд"` | What a slide is to assistive tech (`aria-roledescription`). |
| `photo` | `"Фото {current} из {total}"` | The name of a photo slide and of its dot, read out when it becomes current; `{current}` and `{total}`. |
| `video` | `"Видео {current} из {total}"` | The name of a video slide and of its dot; `{current}` and `{total}`. |
| `previous` | `"Предыдущее фото"` | The arrow back (`arrows`). |
| `next` | `"Следующее фото"` | The arrow forward (`arrows`). |
| `mute` | `"Выключить звук"` | The sound button of a playing video while its sound is on. |
| `unmute` | `"Включить звук"` | The sound button of a playing video while it is muted. |
| `empty` | `"Нет фото"` | The name of the empty tile (no `items`). |
| `loadError` | `"Не удалось загрузить"` | The name of the tile of a photo or a video that failed to load. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Five photos of a scooter in one 4 : 3 box: swipe, the arrows on hover or a dot — `items`, `ratio`, `arrows`. |
| [states.tsx](examples/states.tsx) | The record still loading, a single photo (no dots), a photo that failed, no photos at all and the dots left out — `loading`, `items`, `dots`. |
| [card-cover.tsx](examples/card-cover.tsx) | A vehicle card with the photos as its cover: the car's badges stand still in the four corners, a photo's own note and a video's length travel with their slide, and a press opens the photo full-screen — `Carousel.Overlay`, `placement`, `renderOverlay`, `onItemOpen`. |
| [scrub.tsx](examples/scrub.tsx) | A catalogue of scooters: moving the mouse across a card's cover runs through its photos, leaving the card shows the first again — `scrub`. |
| [video.tsx](examples/video.tsx) | A bike with a short looping clip first, muted and playing while it is in view, and a walkaround video among the photos — `type`, `autoPlay`, `loop`, `poster`. |
| [controlled.tsx](examples/controlled.tsx) | The photo shown lives in the screen: the thumbnails under the carousel pick it, the caption follows every swipe, around the ends too — `index`, `onIndexChange`, `loop`. |
| [narrow.tsx](examples/narrow.tsx) | A listing card in a phone-wide column: the box follows the column, the dots and the corners stay clear of each other — `ratio`, `Carousel.Overlay`. |

## Mistakes
- An `<img>` with a hand-made swipe or `scroll-snap` row → `Carousel.Root` with `items`.
- A Badge positioned over the photo in CSS → `Carousel.Overlay` with `placement`.
- A click handler on the card that opens it after a swipe → the carousel swallows the click after a swipe; open the item from `onItemOpen`.
- Slides that turn on a timer → none; the person turns them.
- A video slide with sound playing by itself → `autoPlay` plays muted; the sound is the person's choice.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (the arrows and the sound button, `shape="circle" variant="shade"`), [Skeleton](../skeleton/COMPONENT.md) (loading), [VisuallyHidden](../visually-hidden/COMPONENT.md) (the announcement), `internal/physics` (the page physics shared with MediaViewer), `internal/enterMotion` (a slide's overlays fade in after a scrub), `internal/parts` (the overlays by type), `internal/mediaPill` (the fade and the length pill), `internal/mediaDisk` (the play mark), `internal/mediaFrame` (a video's first frame), `internal/mediaSession` (one sound at a time), `internal/swallowNextClick` (no click after a swipe), `internal/longPress` (the press slop and the hover settle), `internal/rowLink` (a press on a slide, not on a control), `internal/partPresence` (the arrows and the sound button come and go), `internal/RegionSwap` (loading → slides), `internal/touchTarget` (the dots' hit area), `internal/useNearView` (videos load near the view)
- **See also:** [Thumbnail](../thumbnail/COMPONENT.md), [Gallery](../gallery/COMPONENT.md), [MediaViewer](../media-viewer/COMPONENT.md), [Card](../card/COMPONENT.md)
