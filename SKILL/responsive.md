# Responsive — every screen from 320px to 2560px

A screen built on the kit works at any width from 320 to 2560px and at 400% zoom without losing a
single function. Most of it is built into the components; this file says what the kit already does
(do not rebuild it) and what is left to you.

## Principles

1. **Narrow first.** Design from 320px and add layout as room appears; never cut a desktop down.
2. **Break by content, not by device.** A breakpoint goes where the layout starts to look wrong: a line
   longer than ~80 characters, buttons that no longer fit, empty space.
3. **Rearrange, never hide.** Every function available on desktop is available on a phone — in another
   place or in a menu.
4. **Fluid by default.** `%`, `fr`, `minmax`, `flex-wrap`, `auto-fill` instead of fixed widths. A fixed
   width is an exception you can explain.
5. **A component answers for itself.** Kit components adapt to the width of their own container
   (container queries), not the window — a card behaves the same in a sidebar, a modal and a grid.
6. **Nothing jumps.** Room for loading data, hover controls and counters is reserved in advance
   (`Skeleton` + `Crossfade`, [motion.md](motion.md)).
7. **Input is not screen size.** A wide screen can be touch, a narrow one can have a mouse. Hover and
   target size follow `(hover)` / `(pointer)`, never the width.

## Breakpoints

The kit has one set: **640 · 768 · 1024 · 1280**. Use them only in media queries of the app frame and
of an overlay's form (a panel that becomes a bottom sheet on a phone) — the kit's own scope;
everything inside a page breaks by its container.

| Width | Typical | What changes |
|---|---|---|
| < 640 | phone | one column; floating layers become bottom sheets; Modal is a bottom sheet; Drawer full width; `BottomNav` in `AppShell.Footer` |
| 640–767 | small tablet | gutters 24; intrinsic grids reach two columns; the Sidebar is still off-canvas, so BottomNav stays |
| 768–1023 | tablet | Sidebar on-canvas (`offCanvas="auto"`) |
| 1024–1279 | laptop | gutters 32 |
| ≥ 1280 | desktop | extra columns or a side panel; tables and dashboards use every pixel |

- Write "below 640" as `@media (max-width: 639px)`, "from 640" as `@media (min-width: 640px)`.
- CSS custom properties cannot be used inside media / container conditions: write the number.
- Inside your own blocks prefer container queries: `container-type: inline-size` on the block,
  `@container (min-width: 30rem)` inside it.
- The app takes the full width; cap only text (`Page.Root maxWidth="readable"`).
- Required minimum: `<meta name="viewport" content="width=device-width, initial-scale=1">`, no
  `user-scalable=no`, no horizontal page scroll at 320px.

## Intrinsic grids

A layout inside a page needs no breakpoint: it takes its columns from the room it has.

- The tiles of a page (KPI cards, charts, panels) are one `Page.Grid` with a
  `Page.Cell span` per tile: it folds by its own width (below 30rem every tile takes the row,
  then small tiles pair up, from 64rem each its span).
- A grid inside one block (thumbnails, short fields of one record) is the block's own
  `grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--prime-layout-tile-min-width)), 1fr))`
  — `auto-fill`, so a lone item keeps its column width instead of stretching across the row.
- A main column with a side column: flex-wrap with a large `flex-grow` on the main one; the side one
  drops below when the main one runs out of room.

## What the kit already does

Use these as they are; never wrap them in your own breakpoints.

| Need | Built in |
|---|---|
| app frame | `AppShell.Main` hands the page its gutters 16 → 24 → 32 and top air 24 → 32; `Page.TopBar` un-sticks on screens lower than 480px and respects the top safe area; in the bar the title and its line of data truncate |
| app navigation | Sidebar: on-canvas from 768px, an off-canvas panel below (`offCanvas="auto"`) opened by the menu button `Page.TopBar` draws by itself while the Sidebar is off-canvas; `BottomNav` in `AppShell.Footer` for 2–6 app sections on phones — flat or a floating glass capsule (`floating`) with an optional round `BottomNav.Action`, icons with or without labels (`iconOnly`); the shell hides it by itself while the Sidebar rail is on screen (from 768px with `offCanvas="auto"`) |
| page top bar | `Page.TopBar` lays out its groups from their natural widths: one line while they fit, then the tools on a line of their own, then icon-only buttons, then «⋯», and the heading truncates last ([below](#the-pages-top-bar--pagetopbar)). `Page.Header` in the flow: actions wrap under the title |
| switchers | [Switchers](#switchers) never wrap or truncate: they scroll inside themselves |
| tables | DataTable scrolls inside itself, edge shadows show hidden columns, `stickyFirstColumn`, `DataTable.ColumnsMenu` for a column chooser, the toolbar stacks below a 30rem table, sticky head off on short screens |
| floating layers | Popover (opened from a Trigger), Dropdown, Select (and Datepicker, ColorPresets) never wider than the viewport − 16, 8 from the edges, flip when out of room; below 640 they open as a bottom sheet — scrim, grab handle, swipe down to close, page scroll locked; Tooltip and TagSelect stay anchored |
| dialogs | Modal is a bottom sheet with a handle below 640 (swipe down closes it while `closeOnOutsideClick` allows); footer actions stack on phones and in a dialog narrower than 360px; `Sheet` is a bottom sheet for a short task at every width (centred at 560 on a tablet or desktop) and closes with a swipe down from its handle or header; a Drawer has no swipe — buttons, Escape and the scrim close it |
| date picking | Datepicker shows two months and side presets only when they fit; otherwise one month and presets above |
| system messages | Banner actions move under the text in a narrow container; Notification stays within the viewport with safe-area insets |
| chat | `Message` bubbles fit their content in CSS and cap at 30rem and 85% of the chat column, file / contact / location cards at 16rem and 75%, a round video at its size token × 1.15 and the row width (the Composer's recording preview at 70%), so a chat works from 320px; the message menu is a bottom sheet below 640, the reaction bar opens on a long press; `Composer` takes its container's width, keeps 16px text and 44px hit areas on touch, and the recording bar covers the field without changing the row height; `VoicePlayer` shrinks its waveform to fit; `Chat` fills its pane, a chat beside its dialogs is `Page.Split` (one pane at a time when narrow); `Chat.Header` keeps the avatar, a title that truncates and icon-only actions, `Chat.Search` puts its counter and arrows after a shrinking field, `Chat.Pinned` truncates its line, the «к последним» button floats inside the thread at its bottom-end, and the Composer stays one row (paperclip · field · button) from 320px with its bars above it |
| schedules and boards | `Gantt` scrolls inside itself with the header and the first column pinned; the first column narrows (12 → 10 → 6rem by the chart's width, or only the avatar); a long press on touch creates a one-unit bar; rows and days are virtualized. `Kanban` columns are 18rem from 40rem of board width, below that 85% of it with snapping so the next column peeks; the strip scrolls sideways inside the board |
| cards and properties | Card templates stack and wrap in a narrow container; `DescriptionList` stacks label over value below 24rem of its width; FileUpload `layout="grid"` shows 5 · 4 · 3 · 2 tiles across by its own width |
| fields | text ≥ 16px under a coarse pointer (no iOS zoom on focus); labels above fields; affixes in the field row |
| codes | DigitInput cells 36–64px, `fullWidth` cells share a phone column |
| touch | hover effects only under `(hover: hover)`; under `(pointer: coarse)` small controls get a 44px hit area; nothing is hover-only |

## The page's top bar — `Page.TopBar`

The bar holds up to four groups ([what goes in each](composition.md#the-top-bar)) and lays them out
by one plan chosen from their natural widths. As the width runs out it gives way in five steps, always
in this order, and nothing ever overflows:

1. **One line** — `Page.Heading`, `Page.Tools` and `Page.Actions` side by side while they fit.
2. **Tools below** — the tools take a line of their own under the first one and fill its width: a
   search (`SmartFilter.Toolbar`, `Input.Root`) grows first, the switchers share the rest and wrap
   when one line is not enough. The actions stay on the first line beside the heading at every width.
3. **Icons** — every Button with an icon shows only the icon, the secondary ones first, then the
   primary; its label stays its accessible name and becomes its tooltip.
4. **«⋯»** — the secondary Buttons fold into a menu (`labels.more`); the primary always stays.
5. **The heading truncates** — only after every button step: the path levels first, then the title.

`Page.Chips` is always a line of its own under everything, gone while no filter is set. The heading
keeps its natural width: the bar sizes the title, so there is nothing to tune.

```tsx
import {
  Button,
  Icon,
  Page,
  SegmentedControl,
  Select,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
} from "prime-ui-kit";
import { useState } from "react";

const FIELDS: SmartFilterField[] = [
  { key: "city", label: "Город", options: [{ value: "msk", label: "Москва" }] },
];

export function OrdersPage() {
  const [section, setSection] = useState("all");
  const [period, setPeriod] = useState("30d");
  const [filter, setFilter] = useState<SmartFilterValue>({});
  const [search, setSearch] = useState("");

  return (
    <SmartFilter.Root
      fields={FIELDS}
      value={filter}
      onValueChange={setFilter}
      search={search}
      onSearchChange={setSearch}
    >
      <Page.Root>
        <Page.TopBar>
          <Page.Heading>
            <Page.Title>Заказы</Page.Title>
            <Page.Description>128 в работе · 6 ждут оплаты</Page.Description>
          </Page.Heading>
          <Page.Tools aria-label="Заказы">
            <SegmentedControl.Root value={section} onValueChange={setSection} aria-label="Раздел">
              <SegmentedControl.Item value="all">
                Все<SegmentedControl.Count>128</SegmentedControl.Count>
              </SegmentedControl.Item>
              <SegmentedControl.Item value="active">
                В работе<SegmentedControl.Count>12</SegmentedControl.Count>
              </SegmentedControl.Item>
            </SegmentedControl.Root>
            <SmartFilter.Toolbar />
            <Select.Root value={period} onValueChange={setPeriod}>
              <Select.Trigger aria-label="Период">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="7d">7 дней</Select.Item>
                <Select.Item value="30d">30 дней</Select.Item>
              </Select.Content>
            </Select.Root>
          </Page.Tools>
          <Page.Actions>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
              Экспорт
            </Button.Root>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Новый заказ
            </Button.Root>
          </Page.Actions>
          <Page.Chips>
            <SmartFilter.Chips />
          </Page.Chips>
        </Page.TopBar>
        <Page.Body>{/* the orders table */}</Page.Body>
      </Page.Root>
    </SmartFilter.Root>
  );
}
```

- One tier for the whole bar (default `m`): never `size` on one control inside — wrapped lines must
  stay level. A denser page wraps the bar in `<ControlSizeProvider value="s">`; every kit control
  inside takes that tier.
- A Button without an icon keeps its label at every step and leaves the bar less room before it
  folds: give each one a `Button.Icon`.
- A SegmentedControl in `Page.Tools` needs no `fullWidth`: the bar sets it.
- The primary action is on screen at every width — as its icon at the narrowest; it never folds and
  never disappears.
- Section totals go into `SegmentedControl.Count`, not into stat cards above the table.
- A long form saves through the bar's primary action with a count («Сохранить 3 изменения»), never a
  sticky bar at the bottom of a phone screen.
- Do not duplicate search: if the bar has one, the list below filters by it.

## Switchers

- **Three width modes:** by content (`fullWidth` off), full width (`fullWidth`), full width only on
  a line of its own (a SegmentedControl in `Page.Tools` — the bar decides).
- Sections of a page → SegmentedControl in `Page.Tools`; panels inside a card or a section →
  Tabs (the folder look belongs to its panel).
- Every switcher — Tabs, SegmentedControl, a horizontal ButtonGroup and BottomNav — scrolls inside
  itself when its items do not fit: never a second line, never a truncated item. Its hidden edges
  fade, a vertical mouse wheel scrolls it sideways, touch pans it, the current item is scrolled into
  view, and the indicator moves only after a person's choice. A SegmentedControl whose items all have
  icons collapses to icons (each named by its tooltip) before it scrolls.
- Your duty as its host: give the switcher a bounded width. A flex or grid child that holds one sets
  `min-width: 0`, otherwise the switcher grows the row instead of scrolling
  ([foundation §9](../docs/foundation.md#9-layout-and-responsiveness)).
- A long page split into sections (settings, dashboard): the switcher scrolls to the section and marks
  the current one.

## List + details, side panels

- A list people work through record by record (mail, a messenger, tickets) is `Page.Split`:
  the list (`Page.List`) in a 16–20rem column with the details (`Page.Detail`) beside it from 48rem
  of the split's own width, one pane at a time with `Page.BackButton` below it. Details opened now and then from a table
  open in a Drawer.
- A side panel of details becomes full-screen on a phone (`Drawer.Content` is full width below 640).
- Its period / view controls stay visible on every tab of the panel.

## Components on narrow widths — what you still decide

**Tables.** Let DataTable scroll inside itself; offer a column chooser (`DataTable.ColumnsMenu` in
`toolbar`; the key column `hideable: false`); `stickyFirstColumn` for the name. On phones a table / cards switch in `Page.Tools` is fine — silently dropping columns
by breakpoint is not. Never ask to rotate the phone.

**Card grids.** [Intrinsic grids](#intrinsic-grids), never a breakpoint. Tiles of a row share one
height; a card with a list shows 6–8 rows and scrolls inside (`ScrollContainer`).

**Forms.** One column on phones. Pairs («от / до», two buttons) wrap with
`flex: 1 1 calc(var(--prime-space-24) * 2)` instead of shrinking. Labels above fields (the kit's
`label` prop), never inside next to the value. Right `type`, `inputMode` and `autoComplete` on every
`Input.Field`.

**Charts.** A trend is `Sparkline` — it takes its container's width and is scrubbed by touch. A chart of
your own does the same: container width, the legend wraps under it, axis labels thin out.

**Media.** `width` + `height` or `aspect-ratio` on every image and video, `max-width: 100%`; raster
images with `srcset` + `sizes` (Thumbnail and Avatar already reserve their box).

## Interaction and accessibility

| Rule | Number |
|---|---|
| minimum touch target (WCAG 2.5.8 AA) | 24 × 24px or a free 24px circle |
| recommended target for primary actions and `(pointer: coarse)` | 44 × 44px |
| reflow without horizontal scroll (WCAG 1.4.10) | 320px wide = 1280px at 400% zoom |
| text contrast | 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) 3:1 |

- Nothing important only on hover: whatever hover shows is reachable by focus and visible (or a tap
  away) under `(hover: none)`. Your own hover styles go inside `@media (hover: hover)`.
- Bigger under a coarse pointer: `@media (pointer: coarse)` raises your own row and button heights;
  the dense layout stays for the mouse.
- Real elements: `<button>`, `<a href>`, `<input>` with a label; an icon-only button has `aria-label`.
- Zoom stays allowed and the font size is never locked: the kit's tokens follow the browser text-size
  setting.
- Selected is never colour alone (the kit's selected states add fill, weight or a check).
- No theme flash: `applyTheme` before the first paint.

## Layout stability and speed

Target CLS ≤ 0.1: nothing moves while loading or when a filter changes.

- Loading holds the shape of the content: `Skeleton` in the data's geometry inside `Crossfade` (a table:
  DataTable `loading`). A spinner instead of a skeleton jumps when the data arrives.
- A refetch keeps the previous data on screen (`aria-busy`) — a new filter or period does not flash
  the page.
- Room for dynamic parts is reserved: banners, the chips row, hover controls never push neighbours.
- Fonts: `font-display: swap` with a matched fallback (the kit's `fonts.css` does it).

## Checklist before handing a screen over

Drag the window through 320, 390, 768, 1024, 1280 and 1920px — continuously, not only at these points.

- [ ] No horizontal page scroll at any width (tables and switchers scroll inside themselves).
- [ ] The primary action is on screen at every width — never hidden ([the page's top bar](#the-pages-top-bar--pagetopbar)).
- [ ] Every item alone in its row stretches; items of stretched switchers are equal.
- [ ] All controls in a row share one height; no «staircase» after a wrap.
- [ ] Text never overlaps and is cut only at its own block's edge; cut text has a tooltip or `title`.
- [ ] Popovers and pickers fit at 320px; below 640 they open as sheets.
- [ ] A filter, period or tab change does not shake the page; loading shows a skeleton of the same shape.
- [ ] 200% and 400% zoom at 1280px: everything reachable without two-dimensional scrolling.
- [ ] Keyboard: focus visible, Tab order follows the reading order.
- [ ] Touch: no hover-only functions, targets ≥ 24 × 24px (44 for primary actions).
- [ ] Phone landscape (height < 480px): sticky parts do not eat the screen.
- [ ] Both themes and reduced motion.

Automate the cheap part: a screenshot test of key pages at three widths and a check that
`document.documentElement.scrollWidth <= innerWidth`.
