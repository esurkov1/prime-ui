# ScrollContainer

**Category:** layout

> A scroll region with the kit's thin scrollbar that shrinks correctly inside flex and grid parents.

## When to use
- A list, feed or panel body with a fixed height that must scroll on its own.
- A horizontal strip of chips or filters that may overflow the row (`axis="horizontal"`).
- A custom panel or page column that needs the same scrollbar and overscroll rules as the kit's own overlays.

## When not to use
- Modal / Drawer body, Select / Dropdown / Popover panels, CommandMenu list, DataTable viewport → they already scroll through ScrollContainer; do not wrap them again ([Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Popover](../popover/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)).
- The main page column inside the app shell → `AppShell.Main` is already a ScrollContainer ([AppShell](../../layout/app-shell/COMPONENT.md)).
- Content that should simply grow with the page → no scroll container at all.

## Import
```tsx
import { ScrollContainer } from "prime-ui-kit";
```

## API

### ScrollContainer
`forwardRef` to the root `HTMLElement`. No `asChild`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `"div" \| "main" \| "aside" \| "section" \| "nav" \| "article"` | `"div"` | Root element. |
| `axis` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Scroll axis; the other axis is hidden (except `both`). |
| `overscrollBehavior` | `"auto" \| "contain" \| "none"` | `"contain"` | CSS `overscroll-behavior`; `contain` stops scroll chaining into the page. |
| `fade` | `boolean` | `false` | Fades the edge where more content is hidden (`--prime-space-8` deep mask), along the horizontal axis for `axis="horizontal"`, along the vertical one otherwise. Tracks scroll and size changes. |
| `scrollbar` | `"thin" \| "hidden"` | `"thin"` | `thin`: the kit's quiet scrollbar. `hidden`: no scrollbar — only together with `fade` (tab rows, chip strips, rails), so overflow stays visible. |
| `className` | `string` | — | Extra class on the root (height, padding of the host). |

+ native `HTMLAttributes<HTMLElement>` (including `children`, `aria-*`, `tabIndex`, event handlers).

## Variants

### axis
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `vertical` | `overflow-y: auto`, `overflow-x: hidden`, thin vertical thumb | Lists, feeds, panel bodies | yes |
| `horizontal` | `overflow-x: auto`, `overflow-y: hidden`, thin horizontal thumb | Chip / filter strips, wide rows | |
| `both` | `overflow: auto` on both axes | Wide tables or canvases that also scroll vertically | |

### overscrollBehavior
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `contain` | Reaching the end does not scroll the page behind | Nested panels, lists inside a page | yes |
| `auto` | Browser default: scroll chains to the parent | The region is the page's main scroller and should hand off | |
| `none` | No chaining and no overscroll glow/bounce | Full-screen app regions | |

### fade · scrollbar
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fade` | The hidden edge dissolves into the surface; appears and disappears with the scroll position, without animation | Strips and lists whose overflow must be hinted (tab rows, segment rows, sidebar rail, chip strips) | off |
| `scrollbar="hidden"` | No scrollbar; content still scrolls by wheel, touch and keyboard focus | Together with `fade`, where a scrollbar would cut a compact row | `"thin"` |

**Combinations** — `axis="horizontal"` with `overscrollBehavior="contain"` (default) for strips; `axis="horizontal" fade scrollbar="hidden"` for tab and chip rows; `as="main"` only for the one main column of a page. Pointless: `scrollbar="hidden"` without `fade` (overflow becomes invisible).

## States
| State | Driven by | DOM |
|---|---|---|
| fade on | `fade` | `data-fade="vertical" \| "horizontal"` |
| content hidden before / after | scroll position (with `fade`) | `data-overflow-start="true"`, `data-overflow-end="true"` |

The scrollbar thumb uses `fill-strong`, darkening to `fill-strong-hover` on hover (WebKit); the track is transparent. The fade mask follows the scroll at once: scrolling is high-frequency, so nothing animates.

## Layout & spacing
- Sets `min-width: 0` and `min-height: 0`, so it shrinks inside a flex or grid parent; give the parent (or the container) a height.
- Has **no padding of its own** (foundation §7): the host either pads the scrolling element by at least `--prime-focus-space` so focus rings are not clipped, or keeps content full-bleed and uses inset focus rings. Put side padding on the scrolling element itself (e.g. through `className`), never on an outer wrapper.

## Accessibility
- Renders a plain element; add `aria-label` and `tabIndex={0}` when the region has no focusable content but must be scrollable from the keyboard.
- Choose a semantic `as` (`main`, `nav`, `aside`) when the region is a landmark.
- No `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [list.tsx](examples/list.tsx) | Vertical list in a fixed-height card and a horizontal badge strip | A region inside a card or panel scrolls on its own |
| [both-axes.tsx](examples/both-axes.tsx) | `axis="both"` wide grid with padding on the scroller; `overscrollBehavior="auto"` list | Wide canvases / schedules; handing scroll to the page |
| [edge-fade.tsx](examples/edge-fade.tsx) | `fade` on a vertical list and on a horizontal strip with `scrollbar="hidden"` | Hinting hidden overflow in rows and lists |

```tsx
import { ScrollContainer } from "prime-ui-kit";

export function Example() {
  return (
    <ScrollContainer aria-label="Журнал событий" className="eventLog">
      <p>Длинный текст…</p>
    </ScrollContainer>
  );
}
```

## Mistakes
- `overflow: auto` on a plain `div` inside a flex column that never shrinks → use ScrollContainer (it sets `min-height: 0`).
- Padding on a wrapper around the scroller → put the padding on the ScrollContainer itself.
- Wrapping a Modal body or Dropdown panel in another ScrollContainer → they already scroll.

## Related
[AppShell](../../layout/app-shell/COMPONENT.md) · [Modal](../modal/COMPONENT.md) · [DataTable](../data-table/COMPONENT.md)
