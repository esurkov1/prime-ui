# ScrollContainer

**Category:** layout
**Kind:** layout

> A scroll region with the kit's thin scrollbar that shrinks correctly inside flex and grid parents.

## When to use
- A list, feed or panel body with a fixed height that must scroll on its own.
- A horizontal strip of chips or filters that may overflow the row (`axis="horizontal"`).
- A row whose overflow must be hinted without a scrollbar (`fade`, `scrollbar="hidden"`): tab rows, segment rows, chip strips.
- A custom panel or page column that needs the same scrollbar and overscroll rules as the kit's own overlays.

## When not to use
- Modal / Drawer body, Select / Dropdown / Popover panels, CommandMenu list, DataTable viewport → they already scroll through ScrollContainer; do not wrap them again ([Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Popover](../popover/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)).
- The main page column inside the app shell → `AppShell.Main` is already a ScrollContainer ([AppShell](../../layout/app-shell/COMPONENT.md)).
- Content that should simply grow with the page → no scroll container at all.

## Import
```tsx
import { ScrollContainer } from "prime-ui-kit";
```

## Anatomy
```
ScrollContainer   <div> (or the `as` tag); thin scrollbar, optional edge fade
└─ children       the scrolling content
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ScrollContainer
`forwardRef` → `HTMLElement`. A scroll region with the kit's thin scrollbar that shrinks inside flex and grid parents; no padding of its own.

| Prop | Type | Default | Description |
|---|---|---|---|
| `axis` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Scroll axis; the other axis is clipped (except `both`). |
| `fade` | `boolean` | `false` | Fades the edge where more content is hidden (`--prime-space-8` mask): horizontal for `axis="horizontal"`, vertical otherwise. Follows scroll and size changes. |
| `scrollbar` | `"thin" \| "hidden"` | `"thin"` | `thin` — the kit's quiet scrollbar; `hidden` — no scrollbar, only together with `fade` so the overflow stays visible. |
| `overscrollBehavior` | `"auto" \| "contain" \| "none"` | `"contain"` | CSS `overscroll-behavior`; `contain` stops scroll chaining into the page. |
| `as` | `"div" \| "main" \| "aside" \| "section" \| "nav" \| "article"` | `"div"` | Root element; a landmark tag when the region is one. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children`, `className` (height, padding), `aria-label`, `tabIndex`, `role`, event handlers and the other attributes. |

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
| `none` | No chaining and no overscroll glow / bounce | Full-screen app regions | |

### scrollbar
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `thin` | quiet `fill-strong` thumb on a transparent track | most regions | yes |
| `hidden` | no scrollbar; content still scrolls by wheel, touch and keyboard focus | together with `fade`, where a scrollbar would cut a compact row | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fade` | the hidden edge dissolves into the surface; appears and disappears with the scroll position, without animation | strips and lists whose overflow must be hinted | off |

`scrollbar="hidden"` without `fade` makes the overflow invisible — avoid it. `as="main"` only for the one main column of a page.

## States
| State | Driven by | DOM |
|---|---|---|
| fade on | `fade` | `data-fade="vertical" \| "horizontal"` |
| content hidden before / after | scroll position (with `fade`) | `data-overflow-start="true"`, `data-overflow-end="true"` |

The scrollbar thumb uses `fill-strong`, darkening to `fill-strong-hover` on hover (WebKit). The fade mask follows the scroll at once: scrolling is high-frequency, so nothing animates.

## Layout & spacing
- Sets `min-width: 0` and `min-height: 0`, so it shrinks inside a flex or grid parent; give the parent (or the container) a height.
- Has **no padding of its own** (foundation §7): the host either pads the scrolling element by at least `--prime-focus-space` so focus rings are not clipped, or keeps content full-bleed and uses inset focus rings. Put side padding on the scrolling element itself (through `className`), never on an outer wrapper.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Renders a plain element; add `tabIndex={0}` and `aria-label` when the region has no focusable content but must scroll from the keyboard.
- Choose a semantic `as` (`main`, `nav`, `aside`) when the region is a landmark.
- `fade` is only a mask: content under it stays reachable and scrolls by wheel, touch and focus.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A feed that scrolls on its own inside a fixed-height card, with the kit's thin scrollbar. |
| [variants.tsx](examples/variants.tsx) | A strip that scrolls sideways and a wide schedule that scrolls both ways — `axis`. |
| [edge-fade.tsx](examples/edge-fade.tsx) | Edges fade where more content is hidden; the horizontal strip also hides its scrollbar — `fade`, `scrollbar`. |
| [overscroll.tsx](examples/overscroll.tsx) | At the end of the list the scroll passes on to the page instead of stopping — `overscrollBehavior`. |

## Mistakes
- `overflow: auto` on a plain `div` inside a flex column that never shrinks → use ScrollContainer (it sets `min-height: 0`).
- Padding on a wrapper around the scroller → put the padding on the ScrollContainer itself.
- A hand-made edge-fade mask or hidden scrollbar → `fade` and `scrollbar="hidden"`.
- Wrapping a Modal body or Dropdown panel in another ScrollContainer → they already scroll.

## Related
- **Built from:** —
- **See also:** [AppShell](../../layout/app-shell/COMPONENT.md), [Tabs](../tabs/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)
