# Thumbnail

**Category:** data-display
**Kind:** primitive

> A preview of an object — product, vehicle, file, cover, video — at a fixed aspect ratio, with a colored icon fallback; it can open the object or be selected.

## When to use
- An object next to its name in a table cell or list row (vehicle, product, document).
- Covers in a card grid or gallery (`fullWidth`).
- Any picture of a thing, with a fallback while it loads or when there is none.
- A video, a GIF-like clip or a video message in the same frame (`Thumbnail.Video`).
- A preview that opens a viewer or the object (`asChild` on a `<button>` / `<a>`).
- A tile of a media library that is picked (`checked` / `onCheckedChange`).

## When not to use
- A person or an organization's account → use [Avatar](../avatar/COMPONENT.md).
- An illustration in an empty state → use [EmptyPage](../empty-page/COMPONENT.md).
- A metric tile with an icon → use [Card](../card/COMPONENT.md).

## Import
```tsx
import { Thumbnail } from "prime-ui-kit";
```

## Anatomy
```
Thumbnail.Root          frame (a <div>; the child with asChild; a <button role="checkbox"> when selectable)
├─ Thumbnail.Image      <img>, covers the frame; fades in when loaded, hidden on error
│  or Thumbnail.Video   <video>, first frame or poster; play mark (the media disk) and duration (media shade)
├─ Thumbnail.Fallback   icon or short label on the fill, under the image
└─ check                Checkbox.Indicator in the start corner (selectable only)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Thumbnail.Root
`ref` → `HTMLDivElement` (the `<button>` of a selectable tile, the child with `asChild`). The frame: height of the tier, width from `ratio`, radius, palette fill; tracks the image load for the Fallback.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Height 24 · 32 · 40 · 48 · 64 px, radius 4 · 6 · 8 · 8 · 12; width follows `ratio`. Without it the tile takes the tier of its host, else `m`. |
| `ratio` | `"1:1" \| "4:3" \| "3:2" \| "16:9" \| "3:4"` | `"1:1"` | Aspect ratio, width ÷ height. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Fallback fill and icon hue; a color that means something (category, vehicle color). |
| `variant` | `"soft" \| "solid"` | `"soft"` | Fallback fill: a soft tint with a hue icon, or a solid hue with a contrasting icon. |
| `fullWidth` | `boolean` | `false` | Fills the container width (cards, galleries); the height follows `ratio`. |
| `ring` | `boolean` | `false` | A faint inner ring, for photos with a white background on a light surface. |
| `asChild` | `boolean` | `false` | Puts the frame, with hover, press and focus ring, on its one child — a `<button>` that opens a viewer or an `<a>` to the object. Name the child (`aria-label`) when the picture is all it shows. |
| `checked` | `boolean` | — | Selected (controlled). Any of the checked triad makes a selectable tile — a `<button role="checkbox">` with a check in the corner. Name it with `aria-label` or the image `alt`. |
| `defaultChecked` | `boolean` | — | Initially selected (uncontrolled); makes the tile selectable. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Selection changed by click, Space or Enter; makes the tile selectable. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "color" \| "defaultChecked" \| "onChange">` | — | `className`, `aria-label` + `role` for a fallback-only thumbnail, and the other attributes of the frame. |

### Thumbnail.Image
`ref` → `HTMLImageElement`. The picture; hidden while it loads and after an error, so the Fallback shows through. A new `src` fades in over the last one. Loads lazily and decodes off the main thread (`loading="lazy"`, `decoding="async"`; pass either to override).

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Image URL. |
| `alt` | `string` | `""` | Empty when the text next to the thumbnail names the object, otherwise a description. |
| `fit` | `"cover" \| "contain"` | `"cover"` | `cover` crops to fill; `contain` shows the whole image on the fallback fill (logos). |
| `…rest` | `Omit<ImgHTMLAttributes<HTMLImageElement>, "src" \| "alt">` | — | `className`, `onLoad`, `onError` and the other img attributes. |

### Thumbnail.Video
`ref` → `HTMLVideoElement`. A video in the frame (`preload="metadata"`, `playsInline`); the Fallback shows until its first frame (with a `poster`, its metadata). Without `controls`: the duration pill and a play mark that fades while it plays.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Video URL. Without a `poster` the first frame is asked for (`#t=0.001` is added when the URL has no fragment). |
| `poster` | `string` | — | A still shown before playing; with it the video counts as loaded once its metadata is in. |
| `controls` | `boolean` | `false` | Native controls: a video message or a clip to watch in place; no play mark or duration of the kit. |
| `autoPlay` | `boolean` | `false` | A GIF-like clip: plays muted, in a loop, inline. Off under `prefers-reduced-motion` (read once): the first frame stands still with the play mark. |
| `fit` | `"cover" \| "contain"` | `"cover"` | `cover` crops to fill; `contain` letterboxes on the fallback fill. |
| `formatDuration` | `(seconds: number) => string` | `m:ss` (`h:mm:ss` from an hour) | Display of the duration badge. |
| `…rest` | `Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" \| "poster" \| "controls" \| "autoPlay" \| "muted" \| "loop" \| "children">` | — | `className`, `aria-label`, `onLoadedData`, `onError` and the other video attributes. |

### Thumbnail.Fallback
`ref` → `HTMLSpanElement`. A `<span>` with an icon (sized to the tier) or a short label on the fill; `aria-hidden` once the image has loaded.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | palette tint, hue icon | lists, tables | yes |
| `solid` | saturated hue, contrasting icon | the hue is the object's own color (a red bike) | |

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral fill | no meaningful color | yes |
| `blue` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | hue fill | category or object color | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 24px high, radius 4 | dense rows | |
| `s` | 32px high, radius 6 | compact lists | |
| `m` | 40px high, radius 8 | two-line table cells | yes |
| `l` | 48px high, radius 8 | list rows with more text | |
| `xl` | 64px high, radius 12 | detail headers | |

### ratio
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `1:1` | square | logos, product packshots | yes |
| `4:3` · `3:2` | photo | photos | |
| `16:9` | wide | vehicles, video covers | |
| `3:4` | portrait | documents, book covers | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | takes the container width, height from `ratio` | card covers, galleries | `false` |
| `ring` | faint inner ring | white-background photos on a light surface | `false` |
| `asChild` | the frame on a button or link: hover lift, press, focus ring | the preview opens a viewer or the object | `false` |
| `checked` triad | a checkbox tile: the check in the corner, an accent ring when selected | picking media in a library | — |
| `controls` (Video) | native video controls, no kit marks | a video message, a clip to watch in place | `false` |
| `autoPlay` (Video) | muted looping clip; still under reduced motion | GIF-like previews | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| no image | only Fallback | fill + icon or label |
| loading | `Thumbnail.Image` mounted | image `data-status="loading"` (transparent), Fallback visible |
| loaded | image `load` | `data-status="loaded"`, the image fades in; Fallback `aria-hidden` |
| error | image `error` | `data-status="error"`, image hidden, Fallback visible |
| frame | props | `data-size`, `data-ratio`, `data-color`, `data-variant`, `data-full-width`, `data-ring` |
| video loading | `Thumbnail.Video` mounted | `data-status="loading"` until the first frame (`loadeddata`) — with a `poster`, until its metadata (`loadedmetadata`) — then `loaded`; `error` falls back like an image |
| video still / playing | no `controls`, not looping | a play mark in the centre (from `m`): the still media disk (`internal/mediaDisk`) — the look and size of the shade circle Button over media (the control `l` height, a glyph of half of it, `--prime-color-media-disk` under `--prime-media-disk-blur`), at 60% of a lower frame's height; it fades and shrinks away while the video plays (`data-shown="false"`) and comes back on a pause. The duration at the end corner (from `l` and `fullWidth`) is the media pill (`internal/mediaPill`) |
| hover / press / focus | `asChild` or selectable | `data-interactive`: lift on `--prime-shadow-overlay` (`@media (hover: hover)`), the kit's press (`--prime-motion-press-scale`, `fast`), focus ring |
| selected | `checked` · `defaultChecked` | `aria-checked="true"`, `data-checked="true"`: an accent ring over the picture and a checked indicator; the indicator is always shown, never hover-only |

## Layout & spacing
- Thumbnail + text in a row: flex, `align-items: center`, the row's gap; the text column `min-width: 0` with `truncate`.
- In a table the row grows to the thumbnail; never shrink the thumbnail to the row.
- Card covers: `fullWidth` inside the card body, the body's gap to the title.
- No outline by default: the fill separates the preview.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Focuses a pressable (`asChild`) or selectable tile; a plain thumbnail takes no focus. |
| `Enter` · `Space` | Opens the object (`asChild`) or toggles a selectable tile. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Next to a name the thumbnail is decorative: keep `alt=""` (default) and mark fallback icons `aria-hidden`.
- Alone: give `Thumbnail.Image` a descriptive `alt`, or `role="img"` + `aria-label` on Root for a fallback-only thumbnail.
- A preview that opens the object is `asChild` on a `<button>` or `<a>`; name it (`aria-label`) when the picture is all it shows.
- A selectable tile is a `<button role="checkbox">` with `aria-checked`, named by `aria-label` or the image `alt`; its indicator is `aria-hidden`, and the state is not only color (the check).
- Name a `Thumbnail.Video` with `aria-label`; the play mark is decorative, the duration is text. Under `prefers-reduced-motion` an `autoPlay` clip stands still.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A vehicle next to its name: the photo with an icon fallback underneath — `Thumbnail.Image`, `Thumbnail.Fallback`, `ratio`. |
| [variants.tsx](examples/variants.tsx) | The fallback fill: a soft tint or a solid hue, in a color that means something — `variant`, `color`. |
| [sizes.tsx](examples/sizes.tsx) | Every height tier, 24 to 64 px; `m` fits a two-line table cell — `size`. |
| [states.tsx](examples/states.tsx) | No image (an icon or a short label on the fill) and an image that fails and falls back by itself — `Thumbnail.Fallback`, `Thumbnail.Image`. |
| [ratios.tsx](examples/ratios.tsx) | Every aspect ratio at the same height; keep one ratio per list — `ratio`. |
| [fit.tsx](examples/fit.tsx) | A supplier's wide banner in a square frame: cropped to fill or shown whole on the fill — `fit`. |
| [ring.tsx](examples/ring.tsx) | A faint inner ring for a white-background photo on a light surface, where the edge would vanish — `ring`. |
| [full-width.tsx](examples/full-width.tsx) | Covers in a card grid take the card width and keep 16:9, so every cover has one height — `fullWidth`. |
| [video.tsx](examples/video.tsx) | Videos in the frame: a walkthrough without a poster shows its first frame, a play mark and the duration; a briefing shows its poster and its own duration format; a short clip loops muted like a GIF; a video message plays in place with its controls — `Thumbnail.Video`, `poster`, `formatDuration`, `autoPlay`, `controls`. |
| [pressable.tsx](examples/pressable.tsx) | Photos of a delivery that open a viewer: the frame is put on a button, so it lifts on hover, presses and takes the focus ring — `asChild`. |
| [controlled.tsx](examples/controlled.tsx) | A media library picks photos for a listing: each tile is a checkbox with its check in the corner, the selection lives in the parent and a button clears it — `checked`, `onCheckedChange`. |

## Mistakes
- `Avatar` for a product or vehicle → a circle crops the object; use `Thumbnail`.
- A `div` with a background image and fixed sizes → use `Thumbnail.Root` with `ratio` and `size`.
- Width or height in CSS → change `size`, `ratio` or `fullWidth`.
- No `Thumbnail.Fallback` → a broken image leaves an empty box; always add an icon.
- A `<button>` wrapped around a Thumbnail by hand → `asChild` on the root with the button as its child.
- A `<label>` with a checkbox laid over a tile → the checked triad on the root.
- A bare `<video>` sized in CSS next to thumbnails → `Thumbnail.Video` in the same frame.

## Related
- **Built from:** [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator` of a selectable tile), `internal/mediaDisk` (the play mark, one look with the shade circle Button), `internal/mediaPill` (the duration), `internal/imageSlot` (the picture and its fallback; a new picture cross-fades over the last), `internal/press` (the press of a pressable tile)
- **See also:** [Avatar](../avatar/COMPONENT.md), [Card](../card/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Select](../select/COMPONENT.md), [FileUpload](../file-upload/COMPONENT.md) (`FileUpload.ItemPreview` is a Thumbnail; its tiles draw videos with `Thumbnail.Video`)
