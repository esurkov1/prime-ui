# Thumbnail

**Category:** data-display

> A preview of an object — product, vehicle, file, cover — at a fixed aspect ratio, with a colored icon fallback.

## When to use
- An object next to its name in a table cell or list row (vehicle, product, document, property).
- Covers in a card grid or gallery (`fullWidth`).
- Any picture of a thing whose shape is a rectangle or a square, with a fallback while it loads or when there is none.

## When not to use
- A person or an organization's account → use [Avatar](../avatar/COMPONENT.md) (round, initials, presence, groups).
- A decorative illustration in an empty state → use [EmptyPage](../empty-page/COMPONENT.md) with its icon.
- A metric tile with an icon → use [Card](../card/COMPONENT.md) `IconBox`.

## Import
```tsx
import { Thumbnail } from "prime-ui-kit";
```

## Anatomy
```
Thumbnail.Root          frame: height of the tier, width from `ratio`, radius, palette fill (no outline; `ring` adds one)
├─ Thumbnail.Image      <img>, covers the frame; fades in when loaded, hidden on error
└─ Thumbnail.Fallback   palette fill + centered icon or short label; visible without an image, while loading, on error
```

## API

### Thumbnail.Root

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Height 24 · 32 · 40 · 48 · 64 (`--prime-thumbnail-<tier>-height`), radius 4 · 6 · 8 · 8 · 12; fallback icon 14 · 16 · 20 · 24 · 32. |
| `ratio` | `"1:1" \| "4:3" \| "3:2" \| "16:9" \| "3:4"` | `"1:1"` | Aspect ratio, width ÷ height; the width follows it. |
| `color` | `PaletteColor` | `"gray"` | Hue of the fallback fill and icon / label. |
| `variant` | `"soft" \| "solid"` | `"soft"` | `soft`: `palette-<hue>-soft` fill, `palette-<hue>-text` icon. `solid`: `palette-<hue>-solid` fill, `palette-<hue>-solid-fg` icon. |
| `fullWidth` | `boolean` | — | Width = container, height from `ratio` (card covers, galleries); fallback icon 32. |
| `ring` | `boolean` | `false` | A faint inner ring around the frame (`fill-subtle-active`), for photos with a white background on a light surface. No outline otherwise. |
| `className` | `string` | — | Extra class (placement only). |
| `children` | `ReactNode` | — | `Thumbnail.Image` and / or `Thumbnail.Fallback`. |

`forwardRef` to the `<div>`. + native `<div>` props.

### Thumbnail.Image

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | — (required) | Image URL; a new `src` restarts loading. |
| `alt` | `string` | `""` | Empty when the text next to it names the object; otherwise describe the picture. |
| `fit` | `"cover" \| "contain"` | `"cover"` | `cover` crops to fill the frame; `contain` shows the whole image on the fallback fill (logos, documents). |
| `className` | `string` | — | Extra class. |

`forwardRef` to the `<img>`. + native `<img>` props except `src` / `alt` (`loading`, `onLoad`, `onError`, …).

### Thumbnail.Fallback

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | An icon (sized to the tier) or a 2–4 letter label (`caption`, medium). |
| `className` | `string` | — | Extra class. |

No ref. + native `<span>` props. Exported types: `ThumbnailRootProps`, `ThumbnailImageProps`, `ThumbnailFallbackProps`, `ThumbnailRatio`, `ThumbnailImageStatus`.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Height 24, radius 4, icon 14 | Inline next to body text, dense `xs` / `s` tables | |
| `s` | Height 32, radius 6, icon 16 | One-line list rows, `s` tables | |
| `m` | Height 40, radius 8, icon 20 | Two-line table cells and list rows | yes |
| `l` | Height 48, radius 8, icon 24 | Spacious lists, `l` tables | |
| `xl` | Height 64, radius 12, icon 32 | Detail headers, pickers | |

### ratio
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `1:1` | Square | Product photos, app icons, logos | yes |
| `4:3` | Landscape photo | Generic photos, documents previews | |
| `3:2` | Camera photo | Photographs from cameras / phones | |
| `16:9` | Wide | Vehicles, video, banners, covers | |
| `3:4` | Portrait | Book / document covers, posters | |

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | Neutral soft fill, gray icon | No meaningful color | yes |
| `blue` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | Soft palette fill, icon in the hue's text color | The color carries meaning (vehicle color, category) | |

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | Light tint of the hue, icon in the hue's text color | Category or type placeholders, quiet lists | yes |
| `solid` | The hue itself, contrasting icon | The color is a property of the object (vehicle, product color) | |

### fullWidth
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Height from `size`, width from `ratio` | Rows, cells, inline | yes |
| `true` | Width = container, height from `ratio` | Card covers, galleries | |

**Combinations**
- Recommended: `ratio="16:9"` for vehicles and covers; `ratio="1:1"` for products; one ratio for a whole list; `variant="solid"` + `color` from the object's own color; `soft` + `gray` when the color means nothing.
- Avoid: `solid` with a meaningless color (a wall of saturated tiles); mixing `soft` and `solid` in one list.
- Allowed but rare: `fit="contain"` with `1:1` for logos and documents.
- Avoid: mixing ratios in one list (rows look ragged); `fullWidth` inside a table cell; a Thumbnail for a person (use Avatar).

**Sizes**
The thumbnail sits next to text: `m` (40) matches a two-line cell (body-m + caption) in an `m` table; use `s` (32) next to one line, `xs` next to body-s text.

**Hierarchy**
The thumbnail leads the row; the object's name next to it is the main text. Do not put a second image or an icon box next to it.

## States
| State | Driven by | DOM |
|---|---|---|
| no image | no `Thumbnail.Image` | Fallback visible |
| loading | `Thumbnail.Image` mounted | `data-status="loading"` on the img (transparent), Fallback visible |
| loaded | image `load` | `data-status="loaded"`, image fades in over the Fallback; Fallback `aria-hidden` |
| error | image `error` | `data-status="error"`, img hidden, Fallback visible |

Root data attributes: `data-size`, `data-ratio`, `data-color`, `data-variant`, `data-full-width`, `data-ring`. Image: `data-status`, `data-fit`.

## Layout & spacing
- Thumbnail + text in a row: flex, `align-items: center`, gap `--prime-space-3`; the text column `min-width: 0` with `truncate`.
- In a table the row grows to fit the thumbnail (row height is a minimum) — never shrink the thumbnail to the row.
- Card covers: `fullWidth` inside the card body; gap `--prime-space-3` to the title.
- No outline by default: the fill separates the preview. Add `ring` only for photos with a white background on a light surface, where the edge would vanish.

## Accessibility
- Decorative next to a name: keep `alt=""` (default) and mark fallback icons `aria-hidden`.
- Alone (no text name nearby): give `Thumbnail.Image` a descriptive `alt`, or `aria-label` + `role="img"` on Root for a fallback-only thumbnail.
- No interactive behaviour of its own: wrap it in a link or button when the thumbnail opens the object.
- No `labels`: the component has no system strings.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [in-table.tsx](examples/in-table.tsx) | 16:9 thumbnail + two-line cell in a DataTable, photo or `solid` fallback in the vehicle color | Object lists in tables |
| [ratios.tsx](examples/ratios.tsx) | All five ratios at one height | Choosing a ratio |
| [sizes.tsx](examples/sizes.tsx) | Five tiers, 24–64 | Matching the row |
| [fallback.tsx](examples/fallback.tsx) | Icon, label and a failing image | Missing or broken pictures |
| [ring.tsx](examples/ring.tsx) | Default without an outline vs `ring` on a white-background photo | Photos that would vanish on a light surface |
| [card-grid.tsx](examples/card-grid.tsx) | `fullWidth` 16:9 covers in a card grid | Catalogs, galleries |

```tsx
import { Bike } from "lucide-react";
import { Thumbnail } from "prime-ui-kit";

export function BikeThumbnail({ photo }: { photo?: string }) {
  return (
    <Thumbnail.Root ratio="16:9" color="red" variant="solid">
      {photo ? <Thumbnail.Image src={photo} /> : null}
      <Thumbnail.Fallback>
        <Bike aria-hidden />
      </Thumbnail.Fallback>
    </Thumbnail.Root>
  );
}
```

## Mistakes
- `Avatar` for a product or vehicle → a circle crops the object; use `Thumbnail`.
- A `div` with a background image and fixed `width` / `height` → use `Thumbnail.Root` with `ratio` and `size`.
- Setting width or height in CSS → change `size`, `ratio` or `fullWidth`.
- No `Thumbnail.Fallback` → a missing or broken image leaves an empty gray box; always add an icon.

## Related
- [Avatar](../avatar/COMPONENT.md) — people
- [Card](../card/COMPONENT.md) — `Cover` and `Media` templates
- [DataTable](../data-table/COMPONENT.md) — cells with thumbnails
