# Banner

**Category:** feedback

> Full-width in-flow message for a page, section or card: status icon, title, description, actions and dismiss.

## When to use
- A persistent message about the current page or account: trial ending, failed payment, maintenance, a new feature.
- A message inside a card or a form section (`placement="inset"`).
- An edge-to-edge strip above a page or the app shell (`placement="page"`).

## When not to use
- A short-lived reaction to an action ("Сохранено") → use [Notification](../notification/COMPONENT.md).
- An error of one field → use the field `error` or [Hint](../hint/COMPONENT.md).
- A blocking question or confirmation → use [Modal](../modal/COMPONENT.md).
- An empty list or page → use [EmptyPage](../empty-page/COMPONENT.md).
- A small status label → use [Badge](../badge/COMPONENT.md).

## Import
```tsx
import { Banner } from "prime-ui-kit";
```

## Anatomy
```
Banner.Root                 tone fill, padding, container for the layout
├─ Banner.Content           grid: [icon] [title / description] [actions]
│  ├─ Banner.Icon           status icon on the first line
│  ├─ Banner.Title          medium title
│  ├─ Banner.Description    one step smaller text
│  └─ Banner.Actions        buttons/links (and the dismiss button when there are actions)
└─ Banner.CloseButton       optional custom close, top-right, centered on the first line
```

## API

### Banner.Root
`forwardRef` to `HTMLDivElement`. + native `<div>` props (`role`, `aria-label`, …). No role by default.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"soft" \| "solid" \| "outline"` | `"soft"` | Treatment, see Variants. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"info"` | Semantic color. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Padding, icon, title and description size. The built-in close/dismiss button takes it; pass it to action buttons yourself. |
| `placement` | `"inset" \| "page"` | `"inset"` | `inset`: rounded block in the flow or a card. `page`: edge-to-edge strip without radius, content aligned to the page content column. |
| `onDismiss` | `() => void` | — | Renders a close button (unless a `Banner.CloseButton` child exists) and calls this on click. With `Banner.Actions` the close becomes a square outline button at the end of the actions row. |
| `labels` | `Partial<BannerLabels>` | see Accessibility | Built-in strings. |
| `className` | `string` | — | Class on the root. |
| `children` | `ReactNode` | — | Usually `Banner.Content` (+ `Banner.CloseButton`). |

### Banner.Content
+ native `<div>` props. Layout of the message; below 36rem of the banner's own width (container query) actions move under the text.

### Banner.Icon
Polymorphic. + props of the `as` element.

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `ElementType` | `"div"` | Element or icon component to render, e.g. a lucide icon: `<Banner.Icon as={Info} aria-hidden />`. |
| `className` | `string` | — | Class. |
| `children` | `ReactNode` | — | Icon content when `as` is a plain element. |

### Banner.Title / Banner.Description
+ native `<span>` props. Title: tier text, medium. Description: one step smaller, secondary in `soft`/`outline`. Both are capped at the reading width.

### Banner.Actions
+ native `<div>` props. Wrapping row with `--prime-space-2` gap; centered on the text block on wide banners.

### Banner.CloseButton
`forwardRef` to `HTMLButtonElement`. + native `<button>` props except `size`; `type` defaults to `"button"`. Must be a direct child of `Banner.Root`. Without children it renders a close icon and `aria-label={labels.dismiss}` (an explicit `aria-label` wins).

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | Tone soft fill, primary title, secondary description, tone-colored icon | Most messages | yes |
| `solid` | Saturated tone fill, tone foreground text (neutral: inverse fill and text) | Urgent, must-see messages (payment failed, outage) | |
| `outline` | Card fill with a hairline ring of the tone text color, tone icon | Calm notices inside content where a fill is too loud | |

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `info` | Info soft fill / info icon (sky, distinct from accent) | Neutral information, maintenance | yes |
| `success` | Success soft fill / success icon | Completed operations | |
| `warning` | Warning soft fill / warning icon | Something needs attention soon (trial ending) | |
| `danger` | Danger soft fill / danger icon | Errors, failed payments, data loss risk | |
| `accent` | Accent soft fill / accent icon | Product news, promotions | |
| `neutral` | Muted fill, secondary icon; `solid` = inverse | Low-importance system notes | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Padding 8, icon 14, title 12/16, description 12/16, radius 8 | Inside dense panels and tables | |
| `s` | Padding 8 × 12, icon 16, title 13/20, description 12/16, radius 8 | Inside cards and side panels | |
| `m` | Padding 12 × 16, icon 16, title 14/20, description 13/20, radius 12 | Default | yes |
| `l` | Padding 16 × 20, icon 20, title 16/24, description 14/20, radius 12 | Page-level messages | |
| `xl` | Padding 20 × 24, icon 20, title 16/24, description 14/20, radius 16 | Hero / onboarding messages | |

### placement
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `inset` | Rounded block | In content flow or inside a card | yes |
| `page` | No radius, edge to edge, text aligned to the page content column | Account-wide notices above the page / app shell | |

**Combinations**
- Recommended: `soft` + any tone for regular messages; `solid` + `danger`/`warning` for urgent ones; `outline` + `info`/`accent` inside cards.
- Allowed but rare: `solid` + `accent` for a single promo strip.
- Pointless: `solid` with `outline`-style action buttons of a different tone — keep actions neutral or matching.
- Avoid: several `solid` banners on one screen; `placement="page"` inside a card.

**Hierarchy:** at most one page-level banner at a time; one primary action per banner (solid button), the rest outline/ghost.

## States
| State | Driven by | DOM |
|---|---|---|
| variant / tone / size / placement | props | `data-variant`, `data-tone`, `data-size`, `data-placement` on Root |
| dismissible | `onDismiss` or `Banner.CloseButton` | close button rendered |
| hidden | parent state | the banner has no `open` prop: mount/unmount it |

## Layout & spacing
- `width: 100%`; spacing lives in item paddings, so missing parts leave no gaps.
- Icon → text: tier gap (`--prime-space-2`…`--prime-space-4`); title → description: `--prime-space-1`; text → actions: `--prime-space-3`…`--prime-space-6`.
- Narrow (< 36rem own width): actions move under the text with `--prime-space-3` above. Works from 320px.
- Place a page banner as the first child above page content; an inset banner at the top of the section it refers to, separated by the section gap.

## Accessibility
- No role is set: add `role="status"` for polite updates, `role="alert"` for urgent errors, or `role="region"` + `aria-label` for a persistent announcement.
- Mark the icon `aria-hidden`; the title must carry the meaning.
- The close button has an accessible name from `labels.dismiss` or its own `aria-label`.

| `labels` key | Default | Used for |
|---|---|---|
| `dismiss` | `"Закрыть"` | `aria-label` of the built-in close / dismiss button |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [placement.tsx](examples/placement.tsx) | `placement="page"` above a page, `inset` in a card, narrow width with actions under the text | Choosing placement |
| [variants.tsx](examples/variants.tsx) | `soft`, `solid`, `outline` × all six tones | Choosing variant and tone |
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` with actions and `onDismiss` | Matching density |
| [dismiss.tsx](examples/dismiss.tsx) | `onDismiss` vs a custom `Banner.CloseButton`, parent-controlled visibility | Dismissible notices |

```tsx
import { Banner } from "prime-ui-kit";

export function MaintenanceBanner() {
  return (
    <Banner.Root tone="info" role="status">
      <Banner.Content>
        <Banner.Title>Плановые работы в ночь на субботу</Banner.Title>
        <Banner.Description>С 02:00 до 04:00 отчёты доступны только для чтения.</Banner.Description>
      </Banner.Content>
    </Banner.Root>
  );
}
```

## Mistakes
- `<Banner.Root open={false}>` → there is no `open`; render it conditionally.
- `tone="error"` → use `tone="danger"`.
- `variant="ghost"` → not supported; use `outline`.
- Action buttons without `size` in a non-`m` banner → pass the banner's `size` to them.
- `Banner.CloseButton` inside `Banner.Content` → make it a direct child of Root.
- A Banner for "Сохранено" after a click → use a Notification.

## Related
- [Notification](../notification/COMPONENT.md) — transient toasts.
- [EmptyPage](../empty-page/COMPONENT.md) — empty states.
- [Button](../button/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md) — actions.
