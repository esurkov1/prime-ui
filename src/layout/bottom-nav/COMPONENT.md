# BottomNav

**Category:** layout
**Kind:** layout

> Phone navigation: a bar of 3–5 main sections at the bottom of the screen.

## When to use
- The main sections of an app on a phone, one tap away (Главная, Заказы, Клиенты, Ещё).
- Next to Sidebar in one app: Sidebar navigates on a wide screen, BottomNav on a phone (inside `AppShell.Footer` it leaves by itself once the panel is 640px wide).

## When not to use
- More than five destinations or nested sections → use [Sidebar](../sidebar/COMPONENT.md) (off-canvas on a phone), put the rest under «Ещё».
- Switching views inside one page → use [Tabs](../../components/tabs/COMPONENT.md) or [SegmentedControl](../../components/segmented-control/COMPONENT.md).
- Actions (create, filter) → use [Button](../../components/button/COMPONENT.md); the bar only navigates.

## Import
```tsx
import { BottomNav } from "prime-ui-kit";
```

## Anatomy
```
BottomNav.Root                 <nav> bar, equal columns, safe-area inset below
└─ BottomNav.Item              <button>, <a href> or the asChild element
   ├─ BottomNav.ItemIcon       the glyph above the label (aria-hidden)
   ├─ BottomNav.ItemCount      Badge on the icon corner
   └─ label                    one short word
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### BottomNav.Root
`ref` → `HTMLElement`. The `<nav>` bar: equal columns, surface fill with a faint top divider, the bottom safe-area inset below the items. Inside `AppShell.Footer` it shows only while the panel is narrower than 640px.

| Prop | Type | Default | Description |
|---|---|---|---|
| `iconOnly` | `boolean` | `false` | Icons without visible labels; the labels stay in the DOM as visually hidden text and name the items. |
| `floating` | `boolean` | `false` | A glass capsule over the content: translucent `--prime-color-bg-glass` with a backdrop blur, a bright rim, inset `--prime-bottom-nav-floating-inset` from the edges and above the home indicator. Positions itself at the bottom of its positioned container (`AppShell.Footer`, which then takes no height), so the page scrolls under it; with `iconOnly` the capsule hugs its square items, centred. Opaque under `prefers-reduced-transparency`. |
| `labels` | `Partial<BottomNavLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLElement>` | — | `children` (3–5 `BottomNav.Item`), `aria-label` (replaces `labels.nav`), `className` and the other attributes. |

### BottomNav.Item
`ref` → the rendered element. `<button type="button">`, `<a>` with `href`, or the single child with `asChild`: the icon (24) above a short label (10).

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `boolean` | `false` | Current section: `aria-current="page"`; the icon and the label turn primary (the others are muted). |
| `disabled` | `boolean` | `false` | Not interactive: `disabled` / `aria-disabled`, `data-disabled`; a link loses its `href`. |
| `href` | `string` | — | Renders an `<a>` (with `target`, `rel`). |
| `asChild` | `boolean` | `false` | Renders the single child (e.g. a router `NavLink`) as the item; its children are the label and parts. |
| `children` | `ReactNode` | — | `BottomNav.ItemIcon`, an optional `BottomNav.ItemCount` and a short label (one word). |
| `…rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | `onClick`, `aria-*`, `className` and the other attributes. |

### BottomNav.ItemIcon
`ref` → `HTMLSpanElement`. The item glyph (`aria-hidden`, 24) above the label.

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

## Variants

Two item states only — current (primary color) and not (muted); no hover, no fill.

### Flags (Root)
| Flag | Looks like | Use when | Default |
|---|---|---|---|
| `floating` | a glass capsule over the content: translucent fill, backdrop blur, bright rim, inset from the edges | the app's look wants depth over the page, the iOS tab-bar feel | |
| `iconOnly` | icons alone; labels visually hidden, still the items' names | 3–4 sections with unmistakable icons | |

Without flags the bar is flat at the screen edge on the surface, with a faint top divider.

### Flags (Item)
| Flag | Part | Effect |
|---|---|---|
| `current` | Item | `aria-current="page"`, icon and label in the primary color |
| `disabled` | Item | not interactive, disabled text color |
| `asChild` | Item | the child element (router link) is the item |

## States
| State | Driven by | DOM |
|---|---|---|
| current | `current` or a router link setting `aria-current` | `aria-current="page"` on the item |
| focus | keyboard | focus ring inside the item edge |
| disabled | `disabled` | `disabled` / `aria-disabled`, `data-disabled` |
| hidden | inside `AppShell.Footer` 640px wide or more | `display: none` (container `prime-shell-footer`) |
| floating / icon only | `floating` / `iconOnly` | `data-floating="true"` / `data-icon-only="true"` on the `<nav>` |
| less transparency | `prefers-reduced-transparency: reduce` | a floating capsule turns opaque (`--prime-color-bg-raised`), no blur |

Motion: the color of the icon and the label changes over `fast`. No hover or press feedback: an item is either current or not.

## Layout & spacing
- Bar `--prime-bottom-nav-height` (56) plus `env(safe-area-inset-bottom)`; side padding `--prime-bottom-nav-padding-x`.
- Items share the width equally; the icon (`--prime-bottom-nav-icon-size`, 24) sits in a `--prime-bottom-nav-indicator-width` × `--prime-bottom-nav-indicator-height` box (32 × 24) that anchors the count; the label is `--prime-bottom-nav-label-size` (10, medium, line 12 — the iOS tab-bar size) 4 below it and truncates.
- Floating: `--prime-bottom-nav-floating-inset` (12) from the sides and above `env(safe-area-inset-bottom)`, a full radius, `--prime-color-bg-glass` with `blur(--prime-bottom-nav-blur)`, a `--prime-color-bg-glass-edge` rim and the overlay shadow. Inside `AppShell.Footer` main gets extra bottom padding so the last line clears the capsule.
- Surface fill with a faint top divider; inside `AppShell.Footer` the bar sticks to the bottom of the panel.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` · `Shift+Tab` | Moves focus through the sections; a disabled one is skipped. |
| `Enter` | Opens the section (a link or a button). |

### ARIA
- A `<nav>` landmark named by `labels.nav` («Основные разделы») or its own `aria-label`.
- The current section has `aria-current="page"`; visually it is the primary-color item among muted ones (a contrast step, not a hue).
- The icon is hidden from assistive tech; the item is named by its label, the count is read after it («Заказы 12»).
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
| [floating.tsx](examples/floating.tsx) | A glass capsule over the page: the client list scrolls under its blur, with labels or icons alone — `floating`, `iconOnly`. |
| [router.tsx](examples/router.tsx) | A router link as the item: the router sets `aria-current` and the item shows as current; render it inside a router — `asChild`. |
| [in-app-shell.tsx](examples/in-app-shell.tsx) | The app frame on a phone: a sticky header, the page and the bar in the footer, which leaves once the panel is 640px wide — `AppShell.Footer`. |

## Mistakes
- Six or more items → keep 3–5; the rest goes to a «Ещё» section or Sidebar.
- Long labels («Управление заказами») → one word; the label truncates.
- `iconOnly` with icons that need a caption to be understood → keep the labels.
- A floating bar outside a positioned container → it sits at the bottom of the nearest positioned ancestor; put it in `AppShell.Footer`.
- An action item («Создать») in the bar → the bar navigates; put the action in the page header.
- Hiding the bar with your own media query inside `AppShell.Footer` → the footer already hides it from 640px of panel width.

## Related
- **Built from:** Badge, VisuallyHidden (internal)
- **See also:** [AppShell](../app-shell/COMPONENT.md), [Sidebar](../sidebar/COMPONENT.md), [Tabs](../../components/tabs/COMPONENT.md)
