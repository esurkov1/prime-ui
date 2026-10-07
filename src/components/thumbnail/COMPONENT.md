# Thumbnail

**Category:** data-display
**Kind:** primitive

> A preview of an object — product, vehicle, file, cover — at a fixed aspect ratio, with a colored icon fallback.

## When to use
- An object next to its name in a table cell or list row (vehicle, product, document).
- Covers in a card grid or gallery (`fullWidth`).
- Any picture of a thing, with a fallback while it loads or when there is none.

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
Thumbnail.Root          frame: tier height, width from ratio, radius, palette fill; image load state
├─ Thumbnail.Image      <img>, covers the frame; fades in when loaded, hidden on error
└─ Thumbnail.Fallback   icon or short label on the fill, under the image
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Thumbnail.Root
`ref` → `HTMLDivElement`. The frame: height of the tier, width from `ratio`, radius, palette fill; tracks the image load for the Fallback.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Height 24 · 32 · 40 · 48 · 64 px, radius 4 · 6 · 8 · 8 · 12; width follows `ratio`. |
| `ratio` | `"1:1" \| "4:3" \| "3:2" \| "16:9" \| "3:4"` | `"1:1"` | Aspect ratio, width ÷ height. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Fallback fill and icon hue; a color that means something (category, vehicle color). |
| `variant` | `"soft" \| "solid"` | `"soft"` | Fallback fill: a soft tint with a hue icon, or a solid hue with a contrasting icon. |
| `fullWidth` | `boolean` | `false` | Fills the container width (cards, galleries); the height follows `ratio`. |
| `ring` | `boolean` | `false` | A faint inner ring, for photos with a white background on a light surface. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `aria-label` + `role` for a fallback-only thumbnail, and the other div attributes. |

### Thumbnail.Image
`ref` → `HTMLImageElement`. The picture; hidden while it loads and after an error, so the Fallback shows through. A new `src` starts again.

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Image URL. |
| `alt` | `string` | `""` | Empty when the text next to the thumbnail names the object, otherwise a description. |
| `fit` | `"cover" \| "contain"` | `"cover"` | `cover` crops to fill; `contain` shows the whole image on the fallback fill (logos). |
| `…rest` | `Omit<ImgHTMLAttributes<HTMLImageElement>, "src" \| "alt">` | — | `className`, `onLoad`, `onError` and the other img attributes. |

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

## States
| State | Driven by | DOM |
|---|---|---|
| no image | only Fallback | fill + icon or label |
| loading | `Thumbnail.Image` mounted | image `data-status="loading"` (transparent), Fallback visible |
| loaded | image `load` | `data-status="loaded"`, the image fades in; Fallback `aria-hidden` |
| error | image `error` | `data-status="error"`, image hidden, Fallback visible |
| frame | props | `data-size`, `data-ratio`, `data-color`, `data-variant`, `data-full-width`, `data-ring` |

## Layout & spacing
- Thumbnail + text in a row: flex, `align-items: center`, gap `--prime-space-3`; the text column `min-width: 0` with `truncate`.
- In a table the row grows to the thumbnail; never shrink the thumbnail to the row.
- Card covers: `fullWidth` inside the card body, gap `--prime-space-3` to the title.
- No outline by default: the fill separates the preview.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Next to a name the thumbnail is decorative: keep `alt=""` (default) and mark fallback icons `aria-hidden`.
- Alone: give `Thumbnail.Image` a descriptive `alt`, or `role="img"` + `aria-label` on Root for a fallback-only thumbnail.
- No behaviour of its own: wrap it in a link or button when it opens the object.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A vehicle next to its name: the photo with an icon fallback underneath — `Thumbnail.Image`, `Thumbnail.Fallback`, `ratio`. |
| [variants.tsx](examples/variants.tsx) | The fallback fill: a soft tint or a solid hue, in a color that means something — `variant`, `color`. |
| [sizes.tsx](examples/sizes.tsx) | Every height tier, 24 to 64 px; `m` fits a two-line table cell — `size`. |
| [states.tsx](examples/states.tsx) | No image (an icon or a short label on the fill) and an image that fails and falls back by itself. |
| [ratios.tsx](examples/ratios.tsx) | Every aspect ratio at the same height; keep one ratio per list — `ratio`. |
| [ring.tsx](examples/ring.tsx) | A faint inner ring for a white-background photo on a light surface, where the edge would vanish — `ring`. |
| [full-width.tsx](examples/full-width.tsx) | Covers in a card grid take the card width and keep 16:9, so every cover has one height — `fullWidth`. |

## Mistakes
- `Avatar` for a product or vehicle → a circle crops the object; use `Thumbnail`.
- A `div` with a background image and fixed sizes → use `Thumbnail.Root` with `ratio` and `size`.
- Width or height in CSS → change `size`, `ratio` or `fullWidth`.
- No `Thumbnail.Fallback` → a broken image leaves an empty box; always add an icon.

## Related
- **Built from:** —
- **See also:** [Avatar](../avatar/COMPONENT.md), [Card](../card/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Select](../select/COMPONENT.md)
