# BottomNav

**Category:** navigation
**Kind:** layout

> Phone navigation: a bar of 2–6 main sections at the bottom of the screen, optionally with a round action beside it.

## When to use
- The main sections of an app on a phone, one tap away (Главная, Заказы, Клиенты, Ещё).
- Next to Sidebar in one app: Sidebar navigates on a wide screen, BottomNav on a phone (inside `AppShell.Footer` it leaves by itself while the Sidebar rail is on screen).

## When not to use
- More than six destinations or nested sections → use [Sidebar](../sidebar/COMPONENT.md) (off-canvas on a phone), put the rest under «Ещё».
- Switching views inside one page → use [Tabs](../../components/tabs/COMPONENT.md) or [SegmentedControl](../../components/segmented-control/COMPONENT.md).
- Several actions (create, filter, export) → use [Button](../../components/button/COMPONENT.md) in the page's top bar ([Page](../page/COMPONENT.md): `Page.Actions`); the bar holds at most one main action (`BottomNav.Action`).

## Import
```tsx
import { BottomNav } from "prime-ui-kit";
```

## Anatomy
```
BottomNav.Root                 <nav>, safe-area inset below; the bar is a switcher row
├─ BottomNav.Item              <button>, <a href> or the asChild element, in the bar
│  ├─ BottomNav.ItemIcon       the glyph above the label (aria-hidden)
│  ├─ BottomNav.ItemCount      Badge on the icon corner
│  └─ label                    one short word
└─ BottomNav.Action            Button shape="circle" beside the bar (aria-label)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### BottomNav.Root
`ref` → `HTMLElement`. The `<nav>`: the bar of items in equal columns — a switcher row that scrolls when they do not fit — and the actions beside it. Inside `AppShell.Footer` it shows only while no Sidebar rail is on screen.

| Prop | Type | Default | Description |
|---|---|---|---|
| `iconOnly` | `boolean` | `false` | Icons without visible labels; the labels stay in the DOM as visually hidden text and name the items. |
| `floating` | `boolean` | `false` | A glass capsule floating over the content at the bottom of its positioned container (`AppShell.Footer`), with a selection capsule gliding under the current item; the page scrolls under it. |
| `labels` | `Partial<BottomNavLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (2–6 `BottomNav.Item`, optional `BottomNav.Action` before or after them), `aria-label` (replaces `labels.nav`), `className` and the other attributes. |

### BottomNav.Item
`ref` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`: the icon (20) above a short label (10).

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `boolean` | `false` | Current section: `aria-current="page"`; the icon and the label turn primary (the others are muted) and the glyph sits on a soft pill; floating, the item is in the accent on the selection capsule (the others in full ink). |
| `disabled` | `boolean` | `false` | Not interactive: `disabled` / `aria-disabled`, `data-disabled`, out of the Tab order; an `href` link loses its `href`, an `asChild` child keeps its own and only its clicks are blocked. |
| `href` | `string` | — | Renders an `<a>` (with `target`, `rel`). |
| `target` | `string` | — | Where the `<a>` opens (`href` only). |
| `rel` | `string` | — | Relationship of the `<a>` (`href` only). |
| `asChild` | `boolean` | `false` | Renders the single child (e.g. a router `NavLink`) as the item; its children are the label and parts. |
| `children` | `ReactNode` | — | `BottomNav.ItemIcon`, an optional `BottomNav.ItemCount` and a short label (one word). |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `onClick`, `aria-*`, `className` and the other attributes. |

### BottomNav.ItemIcon
`ref` → `HTMLSpanElement`. The item glyph (`aria-hidden`, 20) above the label.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="nav.home" />`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### BottomNav.ItemCount
`ref` → `HTMLSpanElement` (the Badge). An `xs` Badge on the icon's top-end corner; read after the label («Заказы 12»).

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The number (or a short status such as «99+»). |
| `color` | `PaletteColor` | `"red"` | Badge hue: a count on a section asks for attention. |
| `variant` | `"solid" \| "soft" \| "outline"` | `"solid"` | Badge treatment. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children" \| "color">` | — | `className` and the other span attributes. |

### BottomNav.Action
`ref` → `HTMLButtonElement`. A Button `shape="circle"` (`l`, neutral; `solid` beside the flat bar, `glass` as tall as the floating capsule) for the screen's main action. At the start only as a direct child before the items; otherwise at the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | — (required) | The name of the action: the button has no visible text. |
| `children` | `ReactNode` | — (required) | The glyph, e.g. `<Icon name="action.add" />`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">` | — | `onClick`, `disabled`, `className` and the other button attributes. |

## Variants

Two item states only — current and not; no hover fill. Flat: current in the primary color with its glyph on a soft pill, the others muted. Floating (as iOS): current in the accent on the selection capsule, the others in full ink.

### Flags (Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `floating` | a glass capsule over the content across the width: translucent fill, backdrop blur, glass rim, a selection capsule under the current item; an action becomes a Button `glass` disk beside it | the app's look wants depth over the page, the iOS tab-bar feel | `false` |
| `iconOnly` | icons alone; labels visually hidden, still the items' names | sections with unmistakable icons | `false` |

Without flags the bar is flat at the screen edge on the surface, with a faint top divider.

### Flags (Item)
| Flag | Part | Effect |
|---|---|---|
| `current` | Item | `aria-current="page"`, icon and label in the primary color, the glyph on a soft pill (floating: the accent, on the selection capsule) |
| `disabled` | Item | not interactive, disabled text color |
| `asChild` | Item | the child element (router link) is the item |

## States
| State | Driven by | DOM |
|---|---|---|
| current | `current` or a router link setting `aria-current` | `aria-current="page"` on the item; flat, its glyph on a `fill-muted` pill |
| held | a `Page.Guard` that is `busy` or `dirty` on the page | a press on an item stops before it navigates (a router link included); `dirty` asks first, then repeats it |
| pressed | pointer down | the glyph gives in by the compact press distance (`internal/press`), flat and floating |
| overflow | items wider than the bar | the items scroll inside the bar with faded edges; no label is cut |
| focus | keyboard | focus ring inside the item edge |
| disabled | `disabled` | `disabled` / `aria-disabled`, `data-disabled` |
| hidden | inside `AppShell.Footer` while the Sidebar rail is on screen (`AppShell.Nav` without an off-canvas Sidebar) | `display: none` on the footer |
| floating / icon only | `floating` / `iconOnly` | `data-floating="true"` / `data-icon-only="true"` on the `<nav>` |
| selection | floating, an item with `aria-current` | the selection capsule `data-visible="true"`, `data-animate="true"` while it glides |
| less transparency | `prefers-reduced-transparency: reduce` | a floating capsule and action turn opaque (`--prime-color-bg-glass-solid`), no blur |
| touch | a coarse pointer | floating items are rows at least the touch target high (`touchTargetRowClass`); the capsule and the action grow to hold them |

Motion: the color of the icon and the label and the flat pill change over `fast`. Floating, the selection capsule (the shared selection indicator) glides to the item that becomes current (`left` / `width` over `base`, emphasized easing — it follows `aria-current`, so a router link moves it too), snaps on a layout change (resize, fonts, new items) and fades when nothing is current; a pressed item's glyph and the action give under the finger (press scale). All instant under reduced motion.

## Layout & spacing
- Bar `--prime-bottom-nav-height` (52) plus the bottom safe-area inset `--prime-safe-area-bottom`; side padding `--prime-bottom-nav-padding-x` plus the side safe-area insets (`--prime-safe-area-left` / `-right`), so the fill runs to the screen edges and the items stay clear of a landscape notch. With `iconOnly` the bar is `--prime-bottom-nav-icon-only-height` (48).
- Items share the width equally, each at least as wide as its label; the bar is a switcher (foundation §9), so items that do not fit scroll inside it — a label is never cut. The icon (`--prime-bottom-nav-icon-size`, 20 — a light glyph, so the bar stays quiet next to the page) sits in a `--prime-bottom-nav-glyph-width` × `--prime-bottom-nav-glyph-height` box (28 × 20) that anchors the count and is the current item's pill; the label is `--prime-bottom-nav-label-size` (10, medium, line 12 — the iOS tab-bar size) 4 below it.
- Floating (the iOS 26 tab bar at three quarters its size): a full-radius capsule `--prime-bottom-nav-floating-height` (46; `--prime-bottom-nav-floating-icon-only-height`, 40, with `iconOnly`), items inset `--prime-bottom-nav-floating-padding` (4) with a `--prime-bottom-nav-floating-icon-size` (18) icon over a `--prime-bottom-nav-floating-label-size` (9, semibold) label, `--prime-bottom-nav-floating-item-gap` (2) apart. The capsule spans the width left beside its actions and the items share it equally. `--prime-bottom-nav-floating-inset` (12) inside the side safe areas and above `--prime-safe-area-bottom`. Glass: a dense `--prime-color-bg-glass` tint over a strong `blur(--prime-bottom-nav-blur)` (14) with `saturate(var(--prime-glass-saturation))`, so the page shows as soft shapes; the rim is a 1px ring of `--prime-color-bg-glass-edge` that catches at the top-start and bottom-end corners and fades along the sides (a masked gradient), with the overlay shadow. The selection capsule is ink at 12%, no rim. A `BottomNav.Action` is a Button `glass` disk as tall as the capsule (the root sets `--prime-control-height`) with an 18 glyph, `--prime-bottom-nav-floating-gap` (8) beside it. The floating bar positions itself at the bottom of its positioned container. In `AppShell.Footer` that is the bottom edge of the app frame — fixed to the viewport by the top-level `AppShell.Root`, never the document — so the capsule keeps one place on every page and never rides a document scroll; the footer takes no height, the page scrolls under the capsule, and main keeps exactly its room (inset, capsule, bottom safe area and a page gutter) so the last block clears it. With the on-screen keyboard open the bar stays at the frame's bottom, behind the keyboard, as a native tab bar does.
- Flat: a `BottomNav.Action` is a muted disk (Button `shape="circle"`, neutral solid) of the `l` control height at the bar's edge.
- Surface fill with a faint top divider; inside `AppShell.Footer` the bar sticks to the bottom of the panel.
- An «Ещё» item that opens the shell's off-canvas navigation (the Sidebar) reads `useAppShellNav()` from inside `AppShell.Root`: `aria-expanded={nav?.open}`, `aria-controls={nav?.navId}`, `onClick={() => nav?.setOpen(true)}` — the AppShell screen example has it.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` · `Shift+Tab` | Moves focus through the sections and the action; a disabled one is skipped. |
| `Enter` | Opens the section (a link or a button) or runs the action. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A `<nav>` landmark named by `labels.nav` («Основные разделы») or its own `aria-label`.
- The current section has `aria-current="page"`; visually it is the primary-color item among muted ones with its glyph on a pill, floating it sits on the selection capsule — colour is never the only cue.
- The icon is hidden from assistive tech; the item is named by its label, the count is read after it («Заказы 12»).
- `BottomNav.Action` is a button without text, named by its required `aria-label`; it sits inside the landmark, before or after the items (where it is placed).
- A disabled item is a `disabled` button, an `aria-disabled` link without `href`, or an `aria-disabled` `asChild` child out of the Tab order (`tabIndex={-1}`).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `nav` | `"Основные разделы"` | `aria-label` of the `<nav>` landmark. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Four sections of the app, the current one in the primary color and a tap moves it — `current`, `BottomNav.ItemIcon`. |
| [structure.tsx](examples/structure.tsx) | Counts on the icons and a section that is not available yet — `BottomNav.ItemCount`, `disabled`. |
| [icon-only.tsx](examples/icon-only.tsx) | Icons alone: the labels are hidden but still name the sections for screen readers — `iconOnly`. |
| [floating.tsx](examples/floating.tsx) | A glass capsule over the page across the width: the client list scrolls under its blur, the selection glides to a tapped section, with labels or icons alone — `floating`, `iconOnly`. |
| [floating-action.tsx](examples/floating-action.tsx) | A round action beside the glass capsule for the screen's main action, with labels or icons alone — `BottomNav.Action`, `floating`. |
| [router.tsx](examples/router.tsx) | A router link as the item: the router marks the open section and the item shows it as current; render it inside a router — `asChild`. |
| [in-app-shell.tsx](examples/in-app-shell.tsx) | The app frame on a phone: the page with its top bar and the bar in the footer, which gives way to the Sidebar rail once one is on screen — `AppShell.Footer`. |

## Mistakes
- Seven or more items → keep 2–6; the rest goes to a «Ещё» section or Sidebar.
- Long labels («Управление заказами») → one word; a long label widens its column and the bar scrolls.
- `iconOnly` with icons that need a caption to be understood → keep the labels.
- A floating bar outside a positioned container → it sits at the bottom of the nearest positioned ancestor; put it in `AppShell.Footer`.
- An action as an item («Создать» among the sections) → items navigate; put the screen's one main action in `BottomNav.Action` beside the bar, the rest in the page's top bar.
- `BottomNav.Action` without `aria-label` → the button has no name; it is required.
- A `BottomNav.Action` inside a component of your own placed before the items → it stands at the end; an action at the start is a direct child of `BottomNav.Root`.
- The bar outside `AppShell.Footer` (in Main, Root or `position: fixed` on the page) → it never leaves and shows next to the Sidebar on a desktop; put it in `AppShell.Footer` (or the Template `footer` prop).
- Hiding the bar with your own media query → the shell already hides the footer while the Sidebar rail is on screen.

## Related
- **Built from:** [ScrollContainer](../../components/scroll-container/COMPONENT.md) (`internal/SwitcherScroller`, the items), [Badge](../../components/badge/COMPONENT.md), [VisuallyHidden](../../components/visually-hidden/COMPONENT.md), [Button](../../components/button/COMPONENT.md) (`shape="circle"`, the action disk; `glass` when floating); `internal/selectionIndicator` (the selection capsule), `internal/press`, `internal/touchTarget`
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [Tabs](../../components/tabs/COMPONENT.md)
