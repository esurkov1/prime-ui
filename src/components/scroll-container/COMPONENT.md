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

**Combinations** — `axis="horizontal"` with `overscrollBehavior="contain"` (default) for strips; `as="main"` only for the one main column of a page.

## States
No interactive states and no `data-*` attributes. The scrollbar thumb uses `fill-strong`, darkening to `fill-strong-hover` on hover (WebKit); the track is transparent.

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
