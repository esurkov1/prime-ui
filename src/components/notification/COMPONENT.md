# Notification

**Category:** feedback
**Kind:** overlay

> Pop-up toast notifications: `NotificationProvider` at the app root and `notify()` from any screen.

## When to use
- A short reaction to a user action: saved, sent, copied, failed to save.
- A background event the user should notice without leaving the screen (new message, low stock).
- An error with a quick recovery action («Повторить»).

## When not to use
- A persistent message about a page or account state → use [Banner](../banner/COMPONENT.md).
- A field validation error → the field `error` / [Hint](../hint/COMPONENT.md).
- A decision the user must make before continuing → use [Modal](../modal/COMPONENT.md).
- Progress of a long operation → [ProgressBar](../progress-bar/COMPONENT.md) in the UI.

## Import
```tsx
import { NotificationCard, NotificationProvider, useNotifications } from "prime-ui-kit";
```

## Anatomy
```
NotificationProvider                 store + portaled viewport (z-index toast)
└─ zone per position                 top/bottom × left/center/right
   └─ stack per tone                 <ol> named by labels; newest in front
      └─ card                        <article role="status|alert">
         ├─ icon                     tone Icon or `icon`
         ├─ title + Badge            `badge` counter
         ├─ description
         ├─ action Button            soft neutral, one tier below the card
         ├─ close Button             ghost icon, when `closable`
         └─ countdown line           when not `persistent`
NotificationCard                     the same card, static, without a timer
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### NotificationProvider
No DOM of its own, no ref. Wraps the app once: keeps the toasts and renders their stacks in a portal (one stack per position × tone).

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `"top-right"` | Default position for `notify()` calls without one. |
| `max` | `number` | `5` | Max toasts per stack; older ones are dropped. |
| `labels` | `Partial<NotificationLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | The app. |

### useNotifications()
Must be called inside `NotificationProvider`; returns the store.

| Prop | Type | Default | Description |
|---|---|---|---|
| `notify` | `(options: NotificationOptions) => string` | — | Shows a toast and returns its id. |
| `dismiss` | `(id: string) => void` | — | Closes one toast with its exit animation. |
| `dismissAll` | `() => void` | — | Closes every toast. |
| `items` | `NotificationRecord[]` | — | Active toasts (without the ones playing their exit). |

### notify(options)
`NotificationOptions`: what the toast shows and how it closes.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` | Semantic color and tone icon; `danger` and `warning` are announced assertively. |
| `title` | `string` | — (required) | The message. |
| `description` | `string` | — | Secondary text under the title. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Padding, icon and text tier of the card. |
| `icon` | `ReactNode` | — | Replaces the tone icon. |
| `badge` | `string \| number` | — | A counter next to the title (a `Badge` in the tone hue). |
| `action` | `{ label: string; onClick: () => void }` | — | One soft button under the text, one tier below the card. |
| `position` | `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | — | Default: the provider's `position`. |
| `duration` | `number` | `5000` | Auto-close delay in ms; the timer pauses on hover, focus, swipe and in a hidden tab. |
| `persistent` | `boolean` | `false` | No timer and no countdown line. |
| `closable` | `boolean` | `true` | Shows the close button. |

### NotificationCard
`ref` → `HTMLElement`. A static `<article role="status|alert">` card without a timer: inline confirmations, docs, mockups.

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` | Semantic color and tone icon; `danger` and `warning` are announced assertively. |
| `title` | `string` | — (required) | The message. |
| `description` | `string` | — | Secondary text under the title. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Padding, icon and text tier of the card. |
| `icon` | `ReactNode` | — | Replaces the tone icon. |
| `badge` | `string \| number` | — | A counter next to the title (a `Badge` in the tone hue). |
| `action` | `{ label: string; onClick: () => void }` | — | One soft button under the text, one tier below the card. |
| `onDismiss` | `() => void` | — | Shows the close button and is called on its click. |
| `…rest` | `Omit<HTMLAttributes<HTMLElement>, "title" \| "children" \| "role">` | — | `className` and the other attributes of the `<article>`. |

## Variants

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `info` | raised card, info icon, info countdown | neutral events, messages | yes |
| `success` | success icon | completed actions | |
| `warning` | warning icon | something needs attention soon | |
| `danger` | danger icon | failed actions; pair with `action` to retry | |

The card is always a raised surface without a border; only the icon, the badge and the countdown take the tone. Each tone forms its own stack in a position.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` · `s` | compact padding and text; action `xs` | dense apps | |
| `m` | padding 16, title 14/20, description 13/20; action `s` | default | yes |
| `l` · `xl` | larger padding and text; action `m` / `l` | touch and large screens | |

### position
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `top-right` | top-right corner, grows down | desktop apps | yes |
| `top-center` · `top-left` | top edge | global events; right panels occupy the right | |
| `bottom-right` · `bottom-center` · `bottom-left` | bottom edge, grows up | chat-like or mobile-like layouts | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `persistent` | no countdown line, no auto-close | errors the user must read or act on | `false` |
| `closable` | close button | turn off for very short confirmations | `true` |

## States
| State | Driven by | DOM |
|---|---|---|
| tone / size | options | `data-tone`, `data-size` on the card |
| persistent | `persistent` (always on a static card) | `data-persistent="true"` |
| stack position | store | `data-stack-depth`, `data-stack-expanded` on the card; `data-stack-index`, `data-hidden`, `data-state` on the item; `data-expanded` on the stack |
| paused | hover or focus in the stack, a swipe, a hidden tab | the countdown stops and resumes where it stopped |
| swipe | pointer drag | `data-swipe="drag" \| "return" \| "out"`, `data-swipe-axis` on the motion wrapper |

Collapsed stacks show up to 3 cards peeking behind each other. Hover or keyboard focus expands the stack. Toasts enter from their edge and leave toward it, faster than they came; a swipe toward the edge dismisses (past `--prime-space-12` or a quick flick). Under `prefers-reduced-motion` toasts are removed without an exit animation.

## Layout & spacing
- A fixed, portaled viewport; zones are `--prime-space-5` from the edge (`--prime-space-3` below 640px), at most 24rem wide.
- Cards in an expanded stack are `--prime-space-2` apart.
- The viewport takes pointer events only over the cards.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focuses the action and the close button; focus inside a stack expands it and pauses the timers. |
| `Enter` · `Space` | Presses the action or the close button. |

### ARIA
- Each stack is an `<ol>` named by the region label of its position; each card is an `<article>`: `role="status"` + `aria-live="polite"`, or `role="alert"` + `aria-live="assertive"` for `warning` / `danger`.
- The icon and the countdown are `aria-hidden`; the close button is named by `labels.close`.
- Do not keep the only copy of important information in a toast with a timer — use `persistent` or a Banner.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `close` | `"Закрыть уведомление"` | `aria-label` of the close button. |
| `regionTopLeft` | `"Уведомления сверху слева"` | Name of the top-left toast list. |
| `regionTopCenter` | `"Уведомления сверху по центру"` | Name of the top-center toast list. |
| `regionTopRight` | `"Уведомления сверху справа"` | Name of the top-right toast list. |
| `regionBottomLeft` | `"Уведомления снизу слева"` | Name of the bottom-left toast list. |
| `regionBottomCenter` | `"Уведомления снизу по центру"` | Name of the bottom-center toast list. |
| `regionBottomRight` | `"Уведомления снизу справа"` | Name of the bottom-right toast list. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A provider at the app root and a success toast from any screen — `NotificationProvider`, `notify`. |
| [structure.tsx](examples/structure.tsx) | Optional parts on static cards: a custom icon, a counter, an action and a close button, or a title alone — `icon`, `badge`, `action`, `onDismiss`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier changes padding, icon and text of the card — `size`. |
| [placement.tsx](examples/placement.tsx) | Toasts in each corner or centered at the top or bottom edge — `position`. |
| [tones.tsx](examples/tones.tsx) | The four tones: the icon carries the meaning; danger and warning are announced at once — `tone`. |
| [stacking.tsx](examples/stacking.tsx) | Toasts of one position and tone stack; hover expands the stack and pauses the timers — `max`, `items`, `dismissAll`. |
| [dismiss.tsx](examples/dismiss.tsx) | A short timer, a toast that stays until closed, and one without a close button — `duration`, `persistent`, `closable`. |
| [in-form.tsx](examples/in-form.tsx) | Saving a form: the button shows loading, then a success toast or an error toast with a retry action — `notify`, `action`. |

## Mistakes
- Calling `useNotifications()` outside `NotificationProvider` → it throws; wrap the app root once.
- Several providers in one app → one provider at the root.
- `tone: "error"` → use `tone: "danger"`.
- Expecting `action` to close the toast → call `dismiss(id)` in `onClick` if it should.
- A toast for a permanent state («пробный период закончится через 3 дня») → use a Banner.

## Related
- **Built from:** Button, Badge, Icon
- **See also:** [Banner](../banner/COMPONENT.md), [Button](../button/COMPONENT.md), [Modal](../modal/COMPONENT.md)
