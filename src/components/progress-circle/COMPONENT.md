# ProgressCircle

**Category:** status
**Kind:** primitive

> Circular progress — the ring version of ProgressBar: one value or `segments` that split a whole, with status colors and optional content in the center.

## When to use
- Compact metrics and goals in cards and dashboards (84% of plan).
- Progress where horizontal space is short: table cells, list rows.
- A value on a custom scale shown as a ring («7/12»).
- A compact breakdown of a whole: tasks by status, storage by type (`segments`); categories in their chart colors (`color`) with a `legend` beside the ring.
- A named process whose share is not known yet (`value={null}`) or that turns while its share grows (`spin`), with an icon in the center that changes with its state.

## When not to use
- Progress with a label and width to spare (uploads, imports) → use [ProgressBar](../progress-bar/COMPONENT.md).
- A breakdown with many parts or long labels → [ProgressBar](../progress-bar/COMPONENT.md) with `segments`.
- An anonymous «busy» mark inside a control or a region (a button, a select, a list) → [Spinner](../spinner/COMPONENT.md): it sizes like an icon and is a `status`.
- A ring you can press (cancel, retry, download) → [Button](../button/COMPONENT.md) `shape="circle"` with `progress`; ProgressCircle is never interactive.

## Import
```tsx
import { ProgressCircle, type ProgressSegment } from "prime-ui-kit";
```

## Anatomy
```
ProgressCircle           <div>; size, tone (value mode), children in the center, aria-busy while loading
├─ svg                   the kit ring (internal/ring, data weight); role="progressbar" (value) or
│                        role="group" (segments); track + arcs
│                        (loading: a Skeleton ring of the same diameter and stroke)
├─ description           visually hidden distribution (segments with aria-label, no legend)
└─ inner                 children in the hole of the ring, a changed icon cross-fades
                         (not on xs, text not on s, not while loading)

with legend:             <div data-legend> — a row: the ring box + <ul> legend (swatch · name · value · share)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ProgressCircle
`ref` → `HTMLDivElement` (the root). Pass `value` (value mode: the svg is `role="progressbar"`, a track and one round-capped arc from the top) or `segments` (segments mode: the svg is `role="group"`, parts clockwise from the top), never both.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Diameter 24 · 32 · 40 · 48 · 64 px; the stroke is 1/12 of it. Without it the ring takes the tier of a sized host; in a mark slot (`Card.Icon`, a dialog's `Icon`) it is `m`, the 40 box of an avatar. |
| `children` | `ReactNode` | — | Content in the center (number, percent, `Icon`): an icon or a short text («18 д», «72%») from `s`, sized with the ring (a quarter of its diameter), nothing on `xs`. A string or number also becomes `aria-valuetext`. |
| `aria-label` | `string` | — | Accessible name of the ring (set on the svg). Always pass it. |
| `loading` | `boolean` | `false` | The data is on its way: a Skeleton ring of the same diameter and stroke (and legend lines) that cross-fades into the data; the inner content waits, the root is `aria-busy`. |
| `value` | `number \| null` | — | Value mode: the current value, clamped to `0…max`; it glides to a new value (`base`). `null` — under way, the share unknown: a quarter arc that always turns, no `aria-valuenow`. |
| `spin` | `boolean` | `false` | Value mode: the ring turns at any share (one turn = 3 × `--prime-motion-loop`; slower under reduced motion, never still) and the arc never drops under 8%: a sync whose share grows. `null` always turns. |
| `max` | `number` | `100` (value mode), the sum of the parts (segments mode) | Value mode: top of the scale. Segments mode: total capacity; the sum of the parts closes the ring, a larger `max` leaves the rest as track. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info" \| "inherit"` | `"accent"` | Value mode: arc color, telling the outcome. `inherit` — the arc in the host's text color over a 32% track of it, for a ring on a colored host or over media. |
| `color` | `PaletteColor` | — | Value mode: arc color by category or status word (booking yellow, rented blue), a palette hue in its chart color. Mutually exclusive with `tone`. |
| `track` | `"surface" \| "tinted"` | `"surface"` | Value mode: `tinted` — the track is a soft wash of the arc's color, so 0% reads as an empty ring of that color. Ignored with `tone="inherit"`. |
| `segments` | `ProgressSegment[]` | — | Segments mode: parts in order, `{ value, label?, tone? \| color? }`: `tone` names a meaning (default `accent`), `color` a category — its step of the chart palette. Each part's length is its share of `max`. |
| `segmentGap` | `"none" \| "hairline"` | `"none"` | Segments mode: `none` — one continuous ring; `hairline` — every part and the rest are separate round arcs. |
| `legend` | `boolean` | `false` | Segments mode: a legend beside the ring (below it when narrow), one row per part: color · name · value · share; with `aria-label` it becomes the group's description. The root turns into the row of ring and legend. |
| `formatValue` | `(value: number) => string` | Russian digit groups | Segments mode: display of a part's value in the legend («38 ГБ»). |
| `labels` | `Partial<ProgressCircleLabels>` | — | Segments mode: built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className`, `data-*` and the other div attributes on the root. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 24 diameter, no inner content | inline in text or table cells | |
| `s` | 32 diameter, an icon 16 or a short text 8 («18 д», «72%») in the center | list rows, compact cards | |
| `m` | 40 diameter, inner text 10, icon 20 | KPI tiles, the mark slot of a card or dialog header (`Card.Icon`) | the host tier, else `m` |
| `l` | 48 diameter, inner text 12, icon 24 | dashboard cards | |
| `xl` | 64 diameter, inner text 16, icon 32 | hero metrics, breakdowns | |

The stroke is always 1/12 of the diameter (the kit ring's `data` weight), the inner text 1/4 and the icon 1/2, so every tier is the same ring scaled. These diameters are the scale of an object's mark (the Thumbnail heights; a ring `m` is as large as an avatar `l` and the 40 icon tile), separate from the control heights of a circle Button.

### tone (value mode or each segment)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | accent arc on a `fill-strong` track | progress toward a goal, the main share | yes |
| `neutral` | `text-secondary` arc | quiet background work, «other» share | |
| `success` | success arc | goal reached, done share | |
| `warning` | warning arc | at risk, quota almost used | |
| `danger` | danger arc | failed, overdue share | |
| `info` | info arc | informational processes (sync, indexing) | |
| `inherit` (value mode) | the arc in the host's text color over a 32% track of it; the center text inherits it too | a ring on a colored host or over media | |

### color (value mode or each segment, instead of tone)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `blue` · `orange` · `teal` · `yellow` · `pink` · `green` · `purple` · `red` | the hue's step of the chart palette (`--prime-color-chart-1…8`) | categories: channels, sources, regions — the color they have in charts | |
| `gray` | `--prime-color-chart-other` | the «Прочее» share | |
| `sky` | the palette's sky solid (no chart step) | only when the category is sky elsewhere | |

### track (value mode)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `surface` | a `fill-strong` track | a neutral ring on a surface | yes |
| `tinted` | a soft wash of the arc's own color | a status ring whose 0% must read as an empty ring of that color (a booking at its start) | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `spin` (value mode) | the ring turns at any share, the arc never under 8% | a process whose share grows while it runs (a sync) | `false` |
| `legend` | swatch · name · value · share rows beside the ring, below it when narrow | a breakdown read in numbers | `false` |
| `loading` | a Skeleton ring (and legend lines) of the same geometry | the data is on its way | `false` |

### segmentGap
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | one continuous ring, flat joints; with free capacity the filled share has round caps | parts of a single process | yes |
| `hairline` | every part and the free rest are separate round arcs; no track | distinct categories | |

## States
| State | Driven by | DOM |
|---|---|---|
| size / tone | props | `data-size`, `data-tone` (value mode) on the root |
| empty | `value` 0, or `segments` empty / all 0 | arc hidden, track only |
| value | `value`, `max` | `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax`; `--ring-value` on the svg, the arc glides by `stroke-dashoffset` over `base` |
| share unknown | `value={null}` | no `aria-valuenow`; `data-spin` on the svg: a quarter arc turning (one turn = 3 × `--prime-motion-loop`); a share that arrives glides out of the quarter |
| spinning | `spin` | `data-spin` on the svg: the whole svg turns (a compositor transform) while the share glides on its own; the arc is at least 8% |
| icon change | a new icon in `children` (another `name`) | the old one shrinks to 0.6 and fades, the new one grows in (`fast`) and plays its gesture once; a changing number updates in place |
| segments | `segments`, `max`, `segmentGap` | `data-segment-gap` on the svg, `data-tone` or `data-color` on every arc and cap; arcs glide by dash, caps by `rotate` |
| legend | `legend` | `data-legend` on the root, which becomes a wrapping row of the ring and the `<ul>` |
| loading | `loading` | `aria-busy` on the root; a Skeleton ring (mask of the stroke) and legend lines; the data cross-fades in (`RegionSwap`) |
| reduced motion | `prefers-reduced-motion` | arcs and icons change instantly; a turning ring turns twice as slow and never stops |

Always controlled: pass the current `value` or `segments`.

## Layout & spacing
- `display: inline-flex`, never shrinks (with `legend` the root is a block `flex` row); a caption sits 12 beside it or 8 under it (a gap on their parent).
- Diameters sit on the 4px grid (`--prime-space-6…20`); the ring is placed in CSS (an svg without a viewBox), lengths along it are percent of the circle.
- Inner content sits in the hole (5/6 of the diameter, clipped), primary, medium weight, tabular numbers.
- With `legend` the root is a wrapping row: the ring and the legend `--prime-space-5` (20) apart; the legend takes the rest of the row (basis 192) and drops below the ring when that does not fit.
- `hairline` arcs are ¾ of the stroke apart; arcs start at 12 o'clock and run clockwise.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Value mode: the svg is `role="progressbar"` with `aria-valuenow` / `-min` / `-max`; a string or number child becomes `aria-valuetext`. With `value={null}` there is no `aria-valuenow` — the share is unknown.
- The turn never stops under reduced motion (twice as slow): it is the only sign the work goes on.
- Segments mode: the svg is `role="group"`; with `aria-label` it is named by it and the text in the centre («Хранилище, 72%») and described by the distribution («Видео: 38%, Документы: 21%») or by the legend, without it the distribution is its name.
- A category color always sits beside its name in the legend, so color is never the only cue.
- While `loading` the root is `aria-busy` and the Skeletons are `aria-hidden`.
- Always pass `aria-label`: a caption next to the ring is not linked to it.
- The inner text is `aria-hidden` when it is already the `aria-valuetext`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `empty` | `"Нет сегментов"` | Accessible text when `segments` is empty. |
| `allEmpty` | `"Все сегменты пусты"` | Accessible text when every segment is 0. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A plan ring with the percentage in the center, named for screen readers — `value`, `aria-label`. |
| [variants.tsx](examples/variants.tsx) | Every arc color; the tone tells the outcome, not the progress — `tone`, `color`, `track`. |
| [sizes.tsx](examples/sizes.tsx) | Diameters 24 to 64 px, the avatar scale; the center text is a quarter of the diameter and not rendered on `xs` — `size`. |
| [states.tsx](examples/states.tsx) | Loading is a Skeleton ring of the same diameter and stroke; the number in the centre waits for the data — `loading`. |
| [inner-content.tsx](examples/inner-content.tsx) | The center holds a percentage, a count on its own scale or an icon — `children`, `max`. |
| [under-way.tsx](examples/under-way.tsx) | An import whose share is not known yet turns a quarter arc, then fills and swaps its icon; a sync turns while its share grows — `value`, `spin`, `children`. |
| [segments.tsx](examples/segments.tsx) | Parts of a whole clockwise from the top: a closed ring, free capacity up to `max`, separate arcs and an empty list with its own spoken text — `segments`, `segmentGap`, `labels`. |
| [legend.tsx](examples/legend.tsx) | A ring of category shares with a legend beside it, in the categories' chart colors — `color`, `legend`, `formatValue`. |
| [on-color.tsx](examples/on-color.tsx) | A ring on a colored host takes the host's text color — `tone`. |

## Mistakes
- No `aria-label` (even with a visible caption) → screen readers get an unnamed progressbar.
- Text inside an `xs` / `s` ring → it is not rendered; show it outside (an icon shows from `s`).
- A fake indeterminate ring (`value={25}` plus a CSS rotation) → `value={null}`.
- `onClick` on the ring to cancel → a [Button](../button/COMPONENT.md) `shape="circle"` with `progress`.
- `value` and `segments` together → a type error; pick one mode.
- `tone` on the root with `segments` → set `tone` on each segment.
- Long text inside the ring → it is clipped to the inner circle.
- Categories painted with `tone` → use `color`; a hand-built legend beside the ring → `legend`.

## Related
- **Built from:** [Skeleton](../skeleton/COMPONENT.md), `internal/ring` (the ring drawing, shared with Spinner and the circle Button), `internal/glyphSwap` (the center cross-fade), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [ProgressBar](../progress-bar/COMPONENT.md), [Card](../card/COMPONENT.md), [Spinner](../spinner/COMPONENT.md), [Button](../button/COMPONENT.md)
