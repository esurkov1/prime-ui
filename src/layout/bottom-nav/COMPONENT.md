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
- Several actions (create, filter, export) → use [Button](../../components/button/COMPONENT.md) in the page header; the bar holds at most one main action (`BottomNav.Action`).

## Import
```tsx
import { BottomNav } from "prime-ui-kit";
```

## Anatomy
```
BottomNav.Root                 <nav>, safe-area inset below
├─ BottomNav.Item              <button>, <a href> or the asChild element, in the bar
│  ├─ BottomNav.ItemIcon       the glyph above the label (aria-hidden)
│  ├─ BottomNav.ItemCount      Badge on the icon corner
│  └─ label                    one short word
└─ BottomNav.Action            Button shape="circle" beside the bar (aria-label)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### BottomNav.Root
`ref` → `HTMLElement`. The `<nav>`: the bar of items (equal columns, surface fill with a faint top divider, the bottom safe-area inset below the items) and the actions beside it. Inside `AppShell.Footer` it shows only while the shell has no Sidebar rail on screen (no `AppShell.Nav`, or the Sidebar is off-canvas).

| Prop | Type | Default | Description |
|---|---|---|---|
| `iconOnly` | `boolean` | `false` | Icons without visible labels; the labels stay in the DOM as visually hidden text and name the items. |
| `floating` | `boolean` | `false` | A glass capsule over the content: the iOS 26 tab bar at three quarters its size: a dense `--prime-color-bg-glass` tint over a strong backdrop blur with a hairline rim of light, 46 high (40 with `iconOnly`), across the width left beside its actions; the items share it equally. A selection capsule glides under the current item, an 18 icon over a 9 semibold label. A `BottomNav.Action` becomes a glass disk as tall as the capsule. Inset `--prime-bottom-nav-floating-inset` from the edges and above the home indicator; positions itself at the bottom of its positioned container (`AppShell.Footer`, which then takes no height), so the page scrolls under it. Opaque under `prefers-reduced-transparency`. |
| `labels` | `Partial<BottomNavLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (2–6 `BottomNav.Item`, optional `BottomNav.Action` before or after them), `aria-label` (replaces `labels.nav`), `className` and the other attributes. |

### BottomNav.Item
`ref` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`: the icon (20) above a short label (10).

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `boolean` | `false` | Current section: `aria-current="page"`; the icon and the label turn primary (the others are muted); floating, the item is in the accent on the selection capsule (the others in full ink). |
| `disabled` | `boolean` | `false` | Not interactive: `disabled` / `aria-disabled`, `data-disabled`; a link loses its `href`. |
| `href` | `string` | — | Renders an `<a>` (with `target`, `rel`). |
| `asChild` | `boolean` | `false` | Renders the single child (e.g. a router `NavLink`) as the item; its children are the label and parts. |
| `children` | `ReactNode` | — | `BottomNav.ItemIcon`, an optional `BottomNav.ItemCount` and a short label (one word). |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `aria-*`, `className` and the other attributes. |

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
`ref` → `HTMLButtonElement`. A Button `shape="circle"` (`l`, neutral solid) beside the bar for the screen's main action (create, search, assistant): a muted disk at the edge of a flat bar, a glass disk as tall as the capsule when `floating`. Placed before the first item it stands at the start, otherwise at the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `aria-label` | `string` | — (required) | The name of the action: the button has no visible text. |
| `children` | `ReactNode` | — (required) | The glyph, e.g. `<Icon name="action.add" />`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">` | — | `onClick`, `disabled`, `className` and the other button attributes. |

## Variants

Two item states only — current and not; no hover fill. Flat: current in the primary color, the others muted. Floating (as iOS): current in the accent on the selection capsule, the others in full ink.

### Flags (Root)
| Flag | Looks like | Use when | Default |
|---|---|---|---|
| `floating` | a glass capsule over the content across the width: translucent fill, backdrop blur, glass rim, a selection capsule under the current item; an action becomes a glass disk beside it | the app's look wants depth over the page, the iOS tab-bar feel | |
| `iconOnly` | icons alone; labels visually hidden, still the items' names | sections with unmistakable icons | |

Without flags the bar is flat at the screen edge on the surface, with a faint top divider.

### Flags (Item)
| Flag | Part | Effect |
|---|---|---|
| `current` | Item | `aria-current="page"`, icon and label in the primary color (floating: the accent, on the selection capsule) |
| `disabled` | Item | not interactive, disabled text color |
| `asChild` | Item | the child element (router link) is the item |

## States
| State | Driven by | DOM |
|---|---|---|
| current | `current` or a router link setting `aria-current` | `aria-current="page"` on the item |
| focus | keyboard | focus ring inside the item edge |
| disabled | `disabled` | `disabled` / `aria-disabled`, `data-disabled` |
| hidden | inside `AppShell.Footer` while the Sidebar rail is on screen (`AppShell.Nav` without an off-canvas Sidebar) | `display: none` on the footer |
| floating / icon only | `floating` / `iconOnly` | `data-floating="true"` / `data-icon-only="true"` on the `<nav>` |
| selection | floating, an item with `aria-current` | the selection capsule `data-visible="true"`, `data-animate="true"` while it glides |
| less transparency | `prefers-reduced-transparency: reduce` | a floating capsule and action turn opaque (`--prime-color-layer-floating-bg`), no blur |

Motion: the color of the icon and the label changes over `fast`. Floating, the selection capsule glides to the item that becomes current (`left` / `width` over `base`, emphasized easing — it follows `aria-current`, so a router link moves it too), snaps on a layout change (resize, fonts, new items) and fades when nothing is current; a pressed item's glyph and the action give under the finger (press scale). All instant under reduced motion.

## Layout & spacing
- Bar `--prime-bottom-nav-height` (52) plus `env(safe-area-inset-bottom)`; side padding `--prime-bottom-nav-padding-x`. With `iconOnly` the bar is `--prime-bottom-nav-icon-only-height` (48).
- Items share the width equally; the icon (`--prime-bottom-nav-icon-size`, 20 — a light glyph, so the bar stays quiet next to the page) sits in a `--prime-bottom-nav-glyph-width` × `--prime-bottom-nav-glyph-height` box (28 × 20) that anchors the count; the label is `--prime-bottom-nav-label-size` (10, medium, line 12 — the iOS tab-bar size) 4 below it and truncates.
- Floating (the iOS 26 tab bar at three quarters its size): a full-radius capsule `--prime-bottom-nav-floating-height` (46; `--prime-bottom-nav-floating-icon-only-height`, 40, with `iconOnly`), items inset `--prime-bottom-nav-floating-padding` (4) with a `--prime-bottom-nav-floating-icon-size` (18) icon over a `--prime-bottom-nav-floating-label-size` (9, semibold) label, `--prime-bottom-nav-floating-item-gap` (2) apart. The capsule spans the width left beside its actions and the items share it equally. `--prime-bottom-nav-floating-inset` (12) from the sides and above `env(safe-area-inset-bottom)`. Glass: a dense `--prime-color-bg-glass` tint over a strong `blur(--prime-bottom-nav-blur)` (14) with `saturate(180%)`, so the page shows as soft shapes; the rim is a 1px ring of `--prime-color-bg-glass-edge` that catches at the top-start and bottom-end corners and fades along the sides (a masked gradient), with the overlay shadow. The selection capsule is ink at 12%, no rim. A `BottomNav.Action` is a glass disk as tall as the capsule with an 18 glyph, `--prime-bottom-nav-floating-gap` (8) beside it. Inside `AppShell.Footer` main gets extra bottom padding so the last line clears the capsule.
- Flat: a `BottomNav.Action` is a muted disk (Button `shape="circle"`, neutral solid) of the `l` control height at the bar's edge.
- Surface fill with a faint top divider; inside `AppShell.Footer` the bar sticks to the bottom of the panel.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` · `Shift+Tab` | Moves focus through the sections and the action; a disabled one is skipped. |
| `Enter` | Opens the section (a link or a button) or runs the action. |

### ARIA
- A `<nav>` landmark named by `labels.nav` («Основные разделы») or its own `aria-label`.
- The current section has `aria-current="page"`; visually it is the primary-color item among muted ones (a contrast step, not a hue); floating, it also sits on the selection capsule, so the accent is never the only cue.
- The icon is hidden from assistive tech; the item is named by its label, the count is read after it («Заказы 12»).
- `BottomNav.Action` is a button without text, named by its required `aria-label`; it sits inside the landmark after the items.
- A disabled item is a `disabled` button or an `aria-disabled` link without `href`.

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
| [router.tsx](examples/router.tsx) | A router link as the item: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. |
| [in-app-shell.tsx](examples/in-app-shell.tsx) | The app frame on a phone: the AppHeader, the page and the bar in the footer, which gives way to the Sidebar rail once one is on screen — `AppShell.Footer`. |

## Mistakes
- Seven or more items → keep 2–6; the rest goes to a «Ещё» section or Sidebar.
- Long labels («Управление заказами») → one word; the label truncates.
- `iconOnly` with icons that need a caption to be understood → keep the labels.
- A floating bar outside a positioned container → it sits at the bottom of the nearest positioned ancestor; put it in `AppShell.Footer`.
- An action as an item («Создать» among the sections) → items navigate; put the screen's one main action in `BottomNav.Action` beside the bar, the rest in the page header.
- `BottomNav.Action` without `aria-label` → the button has no name; it is required.
- The bar outside `AppShell.Footer` (in Main, Root or `position: fixed` on the page) → it never leaves and shows next to the Sidebar on a desktop; put it in `AppShell.Footer` (or the Template `footer` prop).
- Hiding the bar with your own media query → the shell already hides the footer while the Sidebar rail is on screen.

## Related
- **Built from:** [Badge](../../components/badge/COMPONENT.md), VisuallyHidden (internal), [Button](../../components/button/COMPONENT.md) (`shape="circle"`, the action disk)
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [Tabs](../../components/tabs/COMPONENT.md)
