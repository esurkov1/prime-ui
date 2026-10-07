# Notification

**Category:** feedback (Обратная связь)

> Pop-up toast notifications: `NotificationProvider` at the app root and `notify()` from any screen.

## When to use
- A short reaction to a user action: saved, sent, copied, failed to save.
- A background event the user should notice without leaving the screen (new message, low stock).
- An error with a quick recovery action ("Повторить").

## When not to use
- A persistent message about a page or account state → use [Banner](../banner/COMPONENT.md).
- A field validation error → use the field `error` / [Hint](../hint/COMPONENT.md).
- A decision the user must make before continuing → use [Modal](../modal/COMPONENT.md).
- Progress of a long operation → use [ProgressBar](../progress-bar/COMPONENT.md) in the UI.

## Import
```tsx
import { NotificationCard, NotificationProvider, useNotifications } from "prime-ui-kit";
```
Public types: `NotificationOptions`, `NotificationRecord`, `NotificationPosition`, `NotificationAction`, `NotificationLabels`, `NotificationProviderProps`, `NotificationCardProps`.

## Anatomy
```
NotificationProvider                 store + portaled viewport (z-index toast)
└─ zone per position                 top/bottom × left/center/right
   └─ stack per tone                 <ol> named by labels.regions[position]; newest in front
      └─ NotificationCard            <article role="status|alert">
         ├─ icon                     tone icon or `icon`
         ├─ title + badge
         ├─ description
         ├─ action button            soft neutral, one tier below the card
         ├─ close button             when `closable`
         └─ countdown line           when not `persistent`
```

## API

### NotificationProvider
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The app. |
| `position` | `NotificationPosition` | `"top-right"` | Default position for `notify()` calls without one. |
| `max` | `number` | `5` | Max toasts per stack (position × tone); older ones are dropped. |
| `labels` | `{ close?: string; regions?: Partial<Record<NotificationPosition, string>> }` | see Accessibility | Built-in strings; `regions` merges per position. |

`NotificationPosition` = `"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"`.

### useNotifications()
Must be called inside `NotificationProvider` (throws otherwise). Returns:

| Field | Type | Description |
|---|---|---|
| `notify` | `(options: NotificationOptions) => string` | Shows a toast and returns its id. |
| `dismiss` | `(id: string) => void` | Closes one toast (plays the exit animation). |
| `dismissAll` | `() => void` | Closes all toasts. |
| `items` | `NotificationRecord[]` | Active toasts (without the ones playing their exit). |

### NotificationOptions (argument of `notify`)
| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — (required) | Title. |
| `description` | `string` | — | Text under the title. |
| `tone` | `"info" \| "success" \| "warning" \| "danger"` | `"info"` | Meaning, default icon, stack grouping; `warning` and `danger` are announced assertively. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Padding, icon and text of the card. |
| `position` | `NotificationPosition` | provider `position` | Screen corner or edge. |
| `duration` | `number` | `5000` | Auto-close timeout in ms. A value `<= 0` disables the timer. |
| `persistent` | `boolean` | `false` | No timer and no countdown line; closes only by the close button or `dismiss`. |
| `icon` | `ReactNode` | tone icon | Custom icon. |
| `badge` | `string \| number` | — | Counter next to the title. |
| `closable` | `boolean` | `true` | Close button. |
| `action` | `{ label: string; onClick: () => void }` | — | Secondary button in the card. Clicking it does not close the toast. |

### NotificationRecord
`NotificationOptions` with `id`, `createdAt` and resolved `tone`, `position`, `size`, `duration`, `persistent`, `closable` (all required). Used by `items` and by `NotificationCard`.

### NotificationCard
A single toast card without the store, for docs, mockups or custom hosts. No ref.

| Prop | Type | Default | Description |
|---|---|---|---|
| `item` | `NotificationRecord` | — (required) | What to render. |
| `paused` | `boolean` | — (required) | Pauses the countdown. Pass `true` for static cards. |
| `onDismiss` | `(id: string) => void` | — (required) | Called by the close button and when the countdown ends. |
| `className` | `string` | — | Class on the `<article>`. |
| `stackDepth` | `number` | `0` | Depth in a stack (`data-stack-depth`). |
| `stackExpanded` | `boolean` | `false` | Whether the stack is expanded (`data-stack-expanded`). |

## Variants

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `info` | Raised card, info icon (circle "i"), info countdown | Neutral events, messages | yes |
| `success` | Success check icon | Completed actions | |
| `warning` | Warning triangle icon | Something needs attention soon | |
| `danger` | Danger cross icon | Failed actions; pair with `action` to retry | |

The card itself is always a raised surface without a border; only the icon, the badge and the countdown take the tone. Each tone forms its own stack in a position.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Smallest padding and icon, `xs` text; action button `xs` | Very dense apps | |
| `s` | Compact; action button `xs` | Dense dashboards | |
| `m` | Padding 16, icon 16, title 14/20, description 13/20; action button `s` | Default | yes |
| `l` | Larger padding and text; action button `m` | Touch screens | |
| `xl` | Largest; action button `l` | Kiosk / large screens | |

### position
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `top-right` | Stack in the top-right corner, grows down | Desktop apps | yes |
| `top-center` | Centered at the top | Global system events | |
| `top-left` | Top-left corner | Right-side panels occupy the right | |
| `bottom-right` | Bottom-right corner, grows up | Chat-like or editor apps | |
| `bottom-center` | Centered at the bottom | Mobile-like layouts | |
| `bottom-left` | Bottom-left corner | Apps with right-bottom controls | |

### Flags
| Flag | Looks like | Use when | Default |
|---|---|---|---|
| `persistent` | No countdown line, no auto-close | Errors the user must read or act on | `false` |
| `closable: false` | No close button | Very short confirmations ("Ссылка скопирована") | `true` |
| `badge` | Small counter after the title | Grouped events ("3 ответа") | — |

**Combinations**
- Recommended: `danger` + `persistent` + `action: Повторить`; `success` with a short title only.
- Pointless: `persistent` + `closable: false` (the toast can only be closed by code); `duration` together with `persistent`.
- Avoid: several positions in one app; long descriptions — keep one or two lines.

## States
| State | Driven by | DOM |
|---|---|---|
| tone / size | options | `data-tone`, `data-size` on the card |
| persistent | `persistent` | `data-persistent="true"` |
| stack position | store | `data-stack-depth`, `data-stack-expanded` on the card; `data-stack-index`, `data-hidden`, `data-state="open" \| "closed"` on the stack item; `data-expanded` on the stack |
| paused | hover over the stack | countdown stops while the stack is expanded |

Collapsed stacks show up to 3 cards peeking behind each other; hover expands the stack and pauses the timers. Under `prefers-reduced-motion` toasts are removed without an exit animation.

## Layout & spacing
- Toasts render in a fixed, portaled viewport; zones are `--prime-space-5` from the viewport edge (`--prime-space-3` below 640px) and at most 24rem wide.
- Cards in an expanded stack are `--prime-space-2` apart.
- The viewport does not take pointer events except over the cards.

## Accessibility
- Each card is an `<article>`: `role="status"` + `aria-live="polite"` for `info`/`success`, `role="alert"` + `aria-live="assertive"` for `warning`/`danger`.
- Each stack is an `<ol>` with an accessible name from `labels.regions[position]`.
- The icon and countdown line are `aria-hidden`; the close button has `labels.close`.
- Do not put the only copy of important information in a toast with a timer — use `persistent` or a Banner.

| `labels` key | Default | Used for |
|---|---|---|
| `close` | `"Закрыть уведомление"` | `aria-label` of the close button |
| `regions["top-left"]` | `"Уведомления сверху слева"` | Name of the top-left stack |
| `regions["top-center"]` | `"Уведомления сверху по центру"` | Name of the top-center stack |
| `regions["top-right"]` | `"Уведомления сверху справа"` | Name of the top-right stack |
| `regions["bottom-left"]` | `"Уведомления снизу слева"` | Name of the bottom-left stack |
| `regions["bottom-center"]` | `"Уведомления снизу по центру"` | Name of the bottom-center stack |
| `regions["bottom-right"]` | `"Уведомления снизу справа"` | Name of the bottom-right stack |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [save-form.tsx](examples/save-form.tsx) | Button `loading`, then a success toast or a danger toast with "Повторить" | Async save feedback |
| [live.tsx](examples/live.tsx) | `notify()` per tone with a position picker, `persistent`, `items.length`, `dismissAll` | Positions, stacking, timers |
| [tones.tsx](examples/tones.tsx) | Static `NotificationCard` per tone | Docs and mockups |
| [sizes.tsx](examples/sizes.tsx) | Static cards `xs`…`xl` | Picking a size |
| [features.tsx](examples/features.tsx) | `icon`, `badge`, `action`, title-only with `closable: false` | Digests and quick confirmations |

```tsx
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

function CopyLink() {
  const { notify } = useNotifications();
  return (
    <Button.Root onClick={() => notify({ tone: "success", title: "Ссылка скопирована" })}>
      Копировать ссылку
    </Button.Root>
  );
}

export function App() {
  return (
    <NotificationProvider>
      <CopyLink />
    </NotificationProvider>
  );
}
```

## Mistakes
- Calling `useNotifications()` outside `NotificationProvider` → it throws; wrap the app root once.
- Several providers in one app → one provider at the root; nested ones create separate toasters.
- `tone: "error"` → use `tone: "danger"`.
- Expecting `action` to close the toast → call `dismiss(id)` in `onClick` if it should.
- Using a toast for a permanent state ("trial ends in 3 days") → use a Banner.

## Related
- [Banner](../banner/COMPONENT.md) — persistent in-flow messages.
- [Button](../button/COMPONENT.md) — `loading` before the result toast.
- [Modal](../modal/COMPONENT.md) — blocking confirmations.
