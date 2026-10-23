# Banner

**Category:** status
**Kind:** primitive

> Full-width in-flow message for a page, section or card: status icon, title, description, actions and dismiss.

## When to use
- A persistent message about the current page or account: trial ending, failed payment, maintenance, a new feature.
- A message inside a card or a form section (`placement="inset"`).
- An edge-to-edge strip above a page or the app shell (`placement="page"`).

## When not to use
- A short-lived reaction to an action («Сохранено») → use [Notification](../notification/COMPONENT.md).
- An error of one field → the field `error` or [Hint](../hint/COMPONENT.md).
- A blocking question or confirmation → use [Modal](../modal/COMPONENT.md).
- An empty list or page → use [EmptyPage](../empty-page/COMPONENT.md).
- A small status label → use [Badge](../badge/COMPONENT.md).

## Import
```tsx
import { Banner } from "prime-ui-kit";
```

## Anatomy
```
Banner.Root                 <div>; variant, tone, size, placement
├─ Banner.Content           header row: [icon] [title / description] [actions]
│  ├─ Banner.Icon           one Icon in the mark box (aria-hidden)
│  ├─ Banner.Title
│  ├─ Banner.Description
│  └─ Banner.Actions        buttons; with onDismiss the close button is last here
└─ close button             with onDismiss and no Actions: ghost icon Button (tone="inherit"), alone at the end of the row
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Banner.Root
`ref` → `HTMLDivElement`. The in-flow message block: fill of the tone, tier spacing; renders the close button with `onDismiss`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"solid" \| "soft" \| "outline"` | `"soft"` | `soft` tinted fill, `solid` saturated fill for urgent messages, `outline` card fill with a tone ring. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"info"` | Semantic color of the message. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | The surface frame of its tier (five steps): padding, radius, mark, title and description roles; the buttons take the same tier. Without it the tier of the host. |
| `placement` | `"inset" \| "page"` | `"inset"` | `inset` — rounded block in the flow or in a card; `page` — edge-to-edge strip above a page, content aligned to the page column. |
| `onDismiss` | `() => void` | — | Renders a close button (top-right, or last in `Banner.Actions`) and calls this on click; the parent unmounts the banner, which closes up in place; focus inside it moves to the next tab stop of the page. |
| `labels` | `Partial<BannerLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `className`, `role` (`alert`, `status`, `region`), `aria-label` and the other div attributes. |

### Banner.Content
`ref` → `HTMLDivElement`. A `<div>` header row: the mark, the title over the description, the actions at the end (under the text below 36rem); with `onDismiss` and no `Banner.Actions` the close button stands alone at the end.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children`, `className` and the other div attributes. |

### Banner.Icon
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` holding one `Icon` in the frame's mark box, in the tone color.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (`Icon`), `className` and the other span attributes. |

### Banner.Title · Banner.Description
`ref` → `HTMLSpanElement`. `<span>` elements: the title (one line, cut with an ellipsis) and the secondary text (wraps, capped at the reading width).

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Banner.Actions
`ref` → `HTMLDivElement`. A `<div>` row of buttons; with `onDismiss` the close button becomes its last square button.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (Buttons in the banner `size`), `className` and the other div attributes. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | tinted tone fill, primary text, tone icon | most messages | yes |
| `solid` | saturated tone fill, contrasting text | urgent: failed payment, outage | |
| `outline` | card fill with a hairline tone ring | calm notices on a busy surface | |

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `info` | info fill | maintenance, facts | yes |
| `success` | success fill | a finished long operation | |
| `warning` | warning fill | trial ending, quota | |
| `danger` | danger fill | failed payment, sync error | |
| `accent` | accent fill | a new feature | |
| `neutral` | muted fill | quiet notices | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | padding 12, mark 32, title 13/16, caption description | dense panels, side columns | |
| `s` | padding 16, mark 32, title 13/16, caption description | compact blocks | |
| `m` | padding 20, mark 40, title 14/20, body-s description | most pages | yes |
| `l` | padding 24, mark 48, title 16/24, body-m description | hero areas | |
| `xl` | padding 28, mark 56, title 18/24, body-m description | empty pages | |

### placement
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `inset` | rounded block in the flow or inside a card | section messages | yes |
| `page` | edge-to-edge strip, no radius, content on the page column | account-wide notices above a page | |

## States
| State | Driven by | DOM |
|---|---|---|
| look | `variant`, `tone`, `size`, `placement` | `data-variant`, `data-tone`, `data-size`, `data-placement` |
| dismissible | `onDismiss` | a ghost Button (`tone="inherit"`) alone at the end of the row, or the last soft Button (`tone="inherit"`) in `Banner.Actions` |
| narrow | own width < 36rem (a banner with `Banner.Actions` is a size container) | actions move under the text, the close button stays last among them |

No `open` prop: the parent mounts and unmounts the banner. A banner that appears on a page already shown enters (a short fade and rise), one that mounts with its page stands still; an unmounted one closes up in place, so the content below glides up instead of jumping. To swap the banner for another block in the same spot (a «restore» button), wrap both in [Crossfade](../crossfade/COMPONENT.md).

## Layout & spacing
- `width: 100%`; text column capped at `--prime-layout-reading-max-width`.
- The surface frame of the banner's tier: padding (12 · 16 · 20 · 24 · 28), radius and the mark box (32 · 32 · 40 · 48 · 56); the title and the description take its roles. The title is one line cut with an ellipsis; the description is a message to read and wraps.
- Action buttons and the close button take the banner's own tier, as tall as the fields of the same surface.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Actions and the close button are regular buttons in Tab order. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The banner has no role of its own: give an error after an action `role="alert"`, a calm status `role="status"`, a page strip `role="region"` with `aria-label`.
- The icon is `aria-hidden`: the title carries the meaning, not the color.
- The close button is named by `labels.dismiss`. It leaves with the banner, and focus inside the banner moves to the next tab stop of the page (the previous one at its end); inside `Crossfade` it moves to the state that takes the banner's place (see `dismissible.tsx`).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `dismiss` | `"Закрыть"` | `aria-label` of the close button. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A maintenance notice: icon, title and description on a soft info fill — `Banner.Icon`, `Banner.Title`, `Banner.Description`. |
| [variants.tsx](examples/variants.tsx) | Every treatment on every tone: soft by default, solid for urgent, outline for calm — `variant`, `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier on its own frame step: padding, radius, mark and text roles grow with it — `size`. |
| [structure.tsx](examples/structure.tsx) | Optional parts: a one-line title, a title with a description, and actions where the close button joins the row — `Banner.Description`, `Banner.Actions`, `onDismiss`. |
| [dismissible.tsx](examples/dismissible.tsx) | The parent owns visibility: the close button calls back, the banner fades into the restore button and focus follows it; the button name comes from labels — `onDismiss`, `labels`. |
| [page-strip.tsx](examples/page-strip.tsx) | An edge-to-edge strip above a page and a rounded block inside a card — `placement`. |
| [narrow.tsx](examples/narrow.tsx) | Below 36rem of its own width the banner moves the actions under the text — `Banner.Actions`. |

## Mistakes
- A hand-made × next to the banner → pass `onDismiss`.
- A lucide icon passed as a component → put `<Icon name="status.*" />` inside `Banner.Icon`.
- A toast-like «Сохранено» in a banner → use Notification.
- Several `solid` banners on one screen → keep `solid` for the one urgent message.

## Related
- **Built from:** [Button](../button/COMPONENT.md) (actions, close button), [StatusDot](../status-dot/COMPONENT.md) (the header row's description line), Icon (`action.close`); `internal/headerRow` and `internal/surfaceFrame` (the row and the frame of its tier)
- **See also:** [Crossfade](../crossfade/COMPONENT.md), [Notification](../notification/COMPONENT.md), [Hint](../hint/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Badge](../badge/COMPONENT.md)
