# ScrollContainer

**Category:** page
**Kind:** layout

> The kit's one scroll region: a thin scrollbar, soft edges wherever content is hidden, and correct shrinking inside flex and grid parents.

## When to use
- Anything that scrolls: a list, feed or panel body with a fixed height, a strip of chips or tiles (`axis="horizontal"`), a wide canvas (`axis="both"`). Every scroll region of the kit is one.
- A strip whose overflow must be hinted without a scrollbar (`scrollbar="hidden"` with the default `edges="fade"`): tab rows, chip strips, attachment trays; add `snap` for tiles and cards.
- A region that is itself a filled surface (a floating panel, a code well): `edges="shadow"`.
- A list that must hold still for a while (an open review, a gesture that must not move it): `lock`.
- A chat or a live log that stays at its newest entry (`anchor="end"`) and loads history while scrolling back (`onReachStart`).
- A feed that loads the next page near its end (`onReachEnd`).

## When not to use
- Modal / Drawer / Sheet body, Select / Dropdown / Popover / TagSelect panels, CommandMenu list, Tabs and SegmentedControl rows, DataTable and Gantt viewports, Kanban, Sidebar, the Composer tray → they already scroll through ScrollContainer; do not wrap them again ([Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Popover](../popover/COMPONENT.md), [CommandMenu](../command-menu/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)).
- The main page column inside the app shell → `AppShell.Main` is already a ScrollContainer ([AppShell](../../layout/app-shell/COMPONENT.md)).
- Content that should simply grow with the page → no scroll container at all.
- A long list of thousands of rows → ScrollContainer scrolls it, the host renders only the rows in view (DataTable `paging="infinite"`, `Chat.Messages`, Gantt); ScrollContainer has no virtual mode of its own.

## Import
```tsx
import { ScrollContainer } from "prime-ui-kit";
```

## Anatomy
```
ScrollContainer   <div> (or the `as` tag); thin scrollbar, soft hidden edges
└─ children       the scrolling content
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ScrollContainer
`ref` → `HTMLElement`. The kit's one scroll region: thin scrollbar, soft edges where content is hidden, shrinks inside flex and grid parents; no padding of its own. Scroll it from code with the element's own `scrollTo` / `scrollBy`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `axis` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Scroll axis; the other axis is clipped (except `both`). On `horizontal` a vertical mouse wheel scrolls the strip sideways while it can move (a trackpad's own sideways swipe, Shift + wheel and a page scroll passing over stay native). |
| `edges` | `"fade" \| "shadow" \| "none"` | `"fade"` | Every edge of the scroll axes that hides content: `fade` dissolves it (an alpha mask, over any background; as deep as the hidden part, `--prime-space-8` at most, so it grows and melts with the scroll) and sets `scroll-padding` of that depth, so focus and `scrollIntoView` land clear of it; `shadow` — a soft shadow over the edge on the region's own fill `--prime-color-layer-current`, pure CSS (a region that is itself a surface: a floating panel, a code well); `none` — plain edges (a page column, a table that draws its own edge shadows). |
| `scrollbar` | `"thin" \| "hidden"` | `"thin"` | `thin` — the kit's quiet scrollbar; `hidden` — no scrollbar, keep `edges` on so the overflow stays visible. |
| `lock` | `boolean` | `false` | The person cannot scroll the region — wheel, touch, keys and a drag's edge auto-scroll; it keeps its position (code may still set it). For a list behind an open review or a drag that must not move it. Sets `data-lock`. |
| `snap` | `boolean` | `false` | Scrolling comes to rest on the start of a child (`scroll-snap-type: proximity` along the axis, `scroll-snap-align: start` on the children); a host aligns deeper items itself. For strips of tiles and cards; not with `anchor="end"`. |
| `anchor` | `"start" \| "end"` | `"start"` | `end` — a chat or a log: the region opens at the end and stays there while content arrives, as long as the person is at the end (within 4 px); scrolled away, what they look at stays put. Sets `data-anchor` and turns the browser's own scroll anchoring off. |
| `onReachStart` | `() => void \| Promise<void>` | — | The scroll position came within 120 px of the start: load older content. Fires once per approach (again after leaving the zone or when the content grows); a returned promise blocks repeat calls and sets `aria-busy` until it settles. Content added above keeps the view in place. |
| `onReachEnd` | `() => void \| Promise<void>` | — | The scroll position came within 120 px of the end: load the next page. Same once-per-approach and promise rules as `onReachStart`. |
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

### edges
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fade` | the content dissolves toward every edge that hides more, as deep as the hidden part (`--prime-space-8` at most): the fade grows and melts with the scroll, never switches; an alpha mask, so it works over any background | lists, strips, panel bodies — anything without a fill of its own | yes |
| `shadow` | a soft `bg.edgeShadow` shadow falls over an edge once content hides behind it; the region paints `--prime-color-layer-current` (pure CSS: covers scroll with the content over shadows fixed to the view) | the region is itself a filled surface (a floating panel, a code well) — a mask would dissolve its fill and shadow | |
| `none` | plain edges | the page column; a table or chart that draws its own edge shadows from its sticky parts; a chat with sticky date chips | |

### scrollbar
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `thin` | quiet `fill-strong` thumb on a transparent track | most regions | yes |
| `hidden` | no scrollbar; content still scrolls by wheel, touch and keyboard focus | strips where a bar would cut a compact row; the edges show the overflow | |

### anchor
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | opens at the start; the browser keeps the view when content changes (with `onReachStart` the kit does) | lists, feeds, panels | yes |
| `end` | opens at the end and follows new content while the person is at the end; scrolled away, the view holds still | chats, live logs, comment threads | |

Only the reader scrolling back unpins the end: content that keeps growing (an animated height, a picture loading) stays followed. The visible entry is the first element under the top edge, found by a binary search over the children (a list of thousands reads a dozen boxes); a sticky element or a spacer of a virtual list (`data-scroll-skip`) is never it. The region also serves its content: `Chat.Messages` inside asks it to glide to the end — the kit's own glide, one position per frame toward the end as it is on that frame, so rows that render on the way never stop it short; from far away it lands one view before the end first, and the reader's wheel, touch or key stops it — to bring a replied or found message to its middle, to hold its anchoring while a message changes size in place (the message keeps the view itself: its bottom stays and the rows above glide, or a transcript grows past the edge instead of pushing the list; the hold's end records the place afresh), and follows whether the reader is at the end for its «к последним» button. The region scrolls only itself, never the page.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `lock` | nothing the person does scrolls the region (wheel, touch, keys, a drag's edge auto-scroll); the position stays | a list behind an open review, a gesture that must not move it | off |
| `snap` | a scroll comes to rest on the start of a child (proximity snapping) | strips of tiles or cards | off |

### Wheel and auto-scroll
- `axis="horizontal"`: a vertical mouse wheel scrolls the strip sideways while it can move, gliding to an accumulated target (instant under reduced motion). A trackpad's sideways swipe and Shift + wheel stay native; a wheel gesture that began outside the strip keeps scrolling the page; at the strip's edge the wheel chains to the page. There is no drag-to-scroll: a press-and-drag in a strip belongs to its items (reordering tiles, tabs); touch pans natively.
- A gesture held near an edge — a Dnd drag, a Gantt bar moved or drawn, a drag that paints a selection over table rows or messages — scrolls the region toward it, faster the closer the pointer (`src/internal/edgeAutoScroll`, one speed curve for the kit). A `lock`ed region or one whose content fits never moves.

### Edge events
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `onReachStart` | fires within 120 px of the start; content added above keeps the view in place | history in a chat, older log entries | — |
| `onReachEnd` | fires within 120 px of the end | the next page of a feed | — |

Each fires once per approach — again after the position leaves the zone or the content grows (a short first page asks again). A returned promise blocks repeat calls and sets `aria-busy` until it settles; the content shows its own loading (a `Skeleton` where the entries will appear).

`scrollbar="hidden"` with `edges="none"` makes the overflow invisible — avoid it. `as="main"` only for the one main column of a page.

## States
| State | Driven by | DOM |
|---|---|---|
| edge treatment | `edges` | `data-edges="fade" \| "shadow"` (none for `none`) |
| content hidden at an edge | scroll position (with `edges="fade"`), measured at most once per frame on scroll, on resize of the region or a child and when children are added; only the scroll axes; logical in RTL | `data-overflow-top`, `data-overflow-bottom`, `data-overflow-start`, `data-overflow-end` = `"true"`; `--edge-*` depths written only while they change (within the last `--prime-space-8` of an edge), on non-inherited properties |
| locked | `lock` | `data-lock`, `overflow: hidden` |
| snapping | `snap` | `data-snap`, `scroll-snap-type: <axis> proximity` |
| kit anchoring | `anchor="end"` or `onReachStart` | `data-anchor="end" \| "start"`, `overflow-anchor: none`: the kit keeps the visible entry in place (or the end, while pinned) before paint, the same in every browser |
| pinned to the end | `anchor="end"` and the position within 4 px of the end | content changes scroll to the new end at once (high-frequency: no animation) |
| loading at an edge | a pending promise from `onReachStart` / `onReachEnd` | `aria-busy="true"` |
| content fits | the content is no larger than the region along its axis (re-measured on resize of the region or a child, and when children change) | `data-fits`, `overflow: hidden`: a region that cannot scroll is no scroller, so the browser never composites a layer for a sub-pixel overflow; text or inline content straight inside keeps it a scroller |
| keyboard focus | `tabIndex={0}` on a region without focusable content | inset focus ring (`--prime-focus-offset-inset`) |

The scrollbar thumb uses `fill-strong`, darkening to `fill-strong-hover` on hover (WebKit). The fade and the shadow follow the scroll at once: scrolling is high-frequency, so nothing animates. A fade region sets `scroll-padding` of the fade depth on its scroll axes, so focus, `scrollIntoView` and a snapped child land clear of the fade.

## Layout & spacing
- Sets `min-width: 0` and `min-height: 0`, so it shrinks inside a flex or grid parent; give the parent (or the container) a height.
- Has **no padding of its own** (foundation §7): the host either pads the scrolling element by at least `--prime-focus-space` so focus rings are not clipped, or keeps content full-bleed and uses inset focus rings. Put side padding on the scrolling element itself (through `className`), never on an outer wrapper.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `↑` · `↓` · `←` · `→` | Scroll the focused region (with `tabIndex={0}`) by a step |
| `PageUp` · `PageDown` · `Space` | Scroll by a screen |
| `Home` · `End` | To the start and to the end |

### ARIA
- Renders a plain element; add `tabIndex={0}` and `aria-label` when the region has no focusable content but must scroll from the keyboard (the browser scrolls it; the ring is inset).
- Choose a semantic `as` (`main`, `nav`, `aside`) when the region is a landmark.
- `edges` is only decoration: content under a fade or a shadow stays reachable and scrolls by wheel, touch and focus; focus and `scrollIntoView` stop clear of a fade.
- `lock` keeps the content in the focus order: a locked region does not scroll, its items stay reachable.
- While an edge load is pending the region is `aria-busy`; announcing new entries is the feed's job (a polite status or `aria-live` on a counter), so a busy chat does not read every message aloud.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A feed that scrolls on its own inside a fixed-height card, with the kit's thin scrollbar. |
| [variants.tsx](examples/variants.tsx) | A strip that scrolls sideways and a wide schedule that scrolls both ways — `axis`. |
| [edges.tsx](examples/edges.tsx) | Hidden edges fade over any background, take a soft shadow on a filled surface, or stay plain — `edges`. |
| [scrollbar.tsx](examples/scrollbar.tsx) | The kit's quiet thin bar on a list and no bar on a strip of chips, where the faded edges show the overflow — `scrollbar`. |
| [snap.tsx](examples/snap.tsx) | A strip of warehouse cards that comes to rest on a card's start, scrolled by touch, a trackpad or the mouse wheel — `snap`, `axis`. |
| [lock.tsx](examples/lock.tsx) | While an order is opened for review, the queue behind it holds still: no wheel, touch, key or drag moves it — `lock`. |
| [auto-scroll.tsx](examples/auto-scroll.tsx) | A task dragged to the top or bottom edge of a scrolling list scrolls it, faster the closer it comes — `ScrollContainer`, `Dnd.Sortable`. |
| [overscroll.tsx](examples/overscroll.tsx) | At the end of the list the scroll passes on to the page instead of stopping — `overscrollBehavior`. |
| [chat.tsx](examples/chat.tsx) | A support chat pinned to its last message: a sent message keeps it at the end, scrolling up loads older ones without moving what is on screen — `anchor`, `onReachStart`. |

## Mistakes
- `overflow: auto` on a plain `div` inside a flex column that never shrinks → use ScrollContainer (it sets `min-height: 0`).
- Padding on a wrapper around the scroller → put the padding on the ScrollContainer itself.
- `overflow: auto` anywhere in a kit component → a ScrollContainer (`src/styles/scroll.test.ts` fails on a raw scroller).
- A hand-made edge-fade mask, edge shadow or hidden scrollbar → `edges` and `scrollbar="hidden"`.
- `edges="fade"` on a region that paints its own fill or shadow → the mask dissolves them; use `edges="shadow"`.
- A hand-made edge auto-scroll loop for a drag → `autoScrollStep` / `edgeSpeed` from `src/internal/edgeAutoScroll`.
- `snap` together with `anchor="end"` → snapping fights the pin to the end.
- Wrapping a Modal body or Dropdown panel in another ScrollContainer → they already scroll.
- `scrollTop = scrollHeight` in an effect after every message → `anchor="end"` (it also leaves a reader who scrolled up alone).
- `flex-direction: column-reverse` to keep a chat at the bottom → it reverses the reading and Tab order; use `anchor="end"`.
- An IntersectionObserver sentinel for history or the next page → `onReachStart` / `onReachEnd`, which also keep the view in place and stop repeat calls.

## Related
- **Built from:** —
- **See also:** [AppShell](../../layout/app-shell/COMPONENT.md), [Tabs](../tabs/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [DataTable](../data-table/COMPONENT.md), [Dnd](../dnd/COMPONENT.md) — edge auto-scroll, [Chat](../chat/COMPONENT.md) — a chat list in `anchor="end"`
