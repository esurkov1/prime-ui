# Notification

**Default `size`:** use **`m`** for the notification card size unless the surface explicitly needs **`s`** or **`l`**.

## Canonical

- **`NotificationProvider`** — wraps the tree that calls hooks; mounts a **portal** with fixed **zones** per viewport corner/edge. Each **`notify`** item is grouped by **`position`** and **`type`** into separate stacks (**`max`** per stack, default **`5`**).
- **`useNotifications`** — **`notify`**, **`dismiss`**, **`dismissAll`** only; throws outside the provider.
- **`useNotificationStore`** — same methods plus **`items`** (**`NotificationRecord[]`**, active only, no exit-animation rows).
- **`NotificationCard`** — **`article`** with live region semantics, icon, title, optional badge/description/**`action`** (neutral stroke **`Button.Root`**), optional close, progress track unless **`persistent`**.
- **Stacks** — Framer Motion list; hover expands stack and **pauses** countdowns until collapse. **`error`** / **`warning`** → **`role="alert"`**, **`aria-live="assertive"`**; **`success`** / **`info`** → **`status`**, **`polite`**.

## Extended

### About

Toast notifications for short, non-blocking feedback after actions (save, send, job finished) when focus must not be trapped.

- **When to use** — confirmations or lightweight errors that do not need a blocking dialog.
- **When to use** — one optional secondary **`action`** (e.g. undo, open detail) alongside auto-dismiss.
- **When to use** — **`useNotificationStore`** when the UI must reflect **`items`** (counters, bulk dismiss, custom chrome).
- **When not to use** — blocking decisions, long forms, or primary workflow inside the toast; prefer [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), or [Banner](../banner/COMPONENT.md).
- **When not to use** — multiple nested **`NotificationProvider`**s unless you intentionally want several portals.

### Composition

- **`NotificationProvider`** → context + **`NotificationToaster`** (portal, zones, **`NotificationStack`** per **`position`** + **`type`**).
- **`NotificationStack` / `NotificationStackItem`** (internal) — ordered list; peek/collapse behavior and **`paused`** passed to **`NotificationCard`**.
- **`NotificationCard`** — public for static previews or fully custom wiring; live toasts should use **`notify`**.

### Scenarios (see `examples/`)

| Scenario | Approach |
|----------|----------|
| Toast queue / stack cap | Same **`position`** + **`type`** share one stack; **`max`** drops oldest; stagger **`notify`** with timeouts. Hover expands stack and pauses timers. → [`examples/toast-queue.tsx`](examples/toast-queue.tsx) |
| Positions | Set **`NotificationProvider`** default **`position`** or pass **`position`** per **`notify`**. Six anchors: **`top-*`** / **`bottom-*`** × **`left` \| `center` \| `right`**. → [`examples/positions.tsx`](examples/positions.tsx) |
| Action button | **`action: { label, onClick }`** — rendered as kit **`Button.Root`** (neutral stroke). → [`examples/action-toast.tsx`](examples/action-toast.tsx) |
| Error / success semantics | **`type: "error"`** / **`"warning"`** vs **`"success"`** / **`"info"`** — icons, grouping, and live-region assertiveness differ. → [`examples/error-success.tsx`](examples/error-success.tsx) |
| Reading the store | **`useNotificationStore`** — **`items`**, **`notify`**, **`dismiss`**, **`dismissAll`** for UI tied to queue length. → [`examples/notification-store.tsx`](examples/notification-store.tsx) |

### Minimal example

```tsx
import { NotificationProvider, useNotifications } from "prime-ui-kit";

export function Example() {
  return (
    <NotificationProvider>
      <Notifier />
    </NotificationProvider>
  );
}

function Notifier() {
  const { notify } = useNotifications();
  return (
    <button type="button" onClick={() => notify({ type: "info", title: "Hello" })}>
      Notify
    </button>
  );
}
```

### Rules

- Call **`useNotifications`** or **`useNotificationStore`** only under **`NotificationProvider`**; both hooks throw if context is missing.
- **`notify`** returns a string **`id`**; pass it to **`dismiss`** or use **`dismissAll`** for every active toast.
- **`useNotificationStore`** exposes the same methods plus **`items`**: **`NotificationRecord[]`** of non-dismissing entries only (no internal closing-animation flag).
- Options passed to **`notify`** are merged with defaults: **`size`** `"m"`, **`position`** from the provider, **`duration`** `5000` ms, **`persistent`** `false`, **`closable`** `true`.
- With **`persistent`**, there is no auto-dismiss, no progress bar, and duration does not drive closing; users or **`dismiss`** / **`dismissAll`** must close the card. Visually, **`persistent`** also turns on the accent-tinted **border** and (unless **`prefers-reduced-motion`**) the **`notification-glow`** shadow pulse — default **`notify()`** uses **`persistent: false`**, so live toasts look flatter unless you opt in.
- If **`duration <= 0`**, the countdown effect does not run—time-based auto-dismiss does not occur; close via **`dismiss`** or the close button when **`closable`**.
- Stacks are keyed by **`position`** and **`type`**; **`max`** (default `5`) caps depth per stack—older items in that stack are dropped when exceeded.
- **`type`** `error` and **`warning`** use **`role="alert"`** and **`aria-live="assertive"`**; other types use **`role="status"`** and **`aria-live="polite"`**.
- Close control uses **`aria-label="Dismiss notification"`**; default type icons are **`aria-hidden`** inside the icon wrapper.
- Each stack list has **`aria-label`** `Notifications at <position>`.
- Nested **`NotificationProvider`** instances each render their own portal and zones—usually one root provider is enough.
- **`NotificationCard`** is not connected to the store by itself; supply **`item`**, **`paused`**, and **`onDismiss`** and keep **`item`** fields consistent with **`NotificationRecord`**.

## API

### NotificationProvider

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Subtree where notification hooks are used |
| position | `NotificationPosition` | `"top-right"` | No | Default **`position`** for **`notify`** when omitted in options |
| max | `number` | `5` | No | Maximum items per stack (same **`position`** + **`type`**) |

### NotificationOptions (`notify` payload)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"success" \| "error" \| "warning" \| "info"` | — | Yes | Semantics, default icon, and stack grouping |
| title | `string` | — | Yes | Primary heading |
| description | `string` | — | No | Secondary text |
| size | `"s" \| "m" \| "l"` | `"m"` | No | Card scale |
| position | `NotificationPosition` | provider default | No | Corner or edge anchor |
| duration | `number` | `5000` | No | Auto-dismiss delay in ms (ignored for closing when **`persistent`**; see Rules when `<= 0`) |
| persistent | `boolean` | `false` | No | Disable timer and progress UI |
| icon | `React.ReactNode` | type default | No | Custom leading icon |
| badge | `string \| number` | — | No | Label next to the title |
| closable | `boolean` | `true` | No | Show dismiss button |
| action | `{ label: string; onClick: () => void }` | — | No | Secondary action rendered as neutral stroke **`Button.Root`** |

`notify` returns the new record’s **`id`** (`string`).

### NotificationRecord

All **`NotificationOptions`** fields plus required **`id`**, **`position`**, **`size`**, **`duration`**, **`persistent`**, **`closable`**, and **`createdAt`** (`number`, ms). Defaults are filled when the record is created inside **`notify`**.

### NotificationCard

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| item | `NotificationRecord` | — | Yes | Card data |
| paused | `boolean` | — | Yes | Pause countdown (e.g. expanded stack) |
| onDismiss | `(id: string) => void` | — | Yes | Called to remove the toast (timer or UI) |
| stackDepth | `number` | `0` | No | Stack index for layout / `data-*` |
| stackExpanded | `boolean` | `false` | No | Whether the parent stack is expanded |
| className | `string` | — | No | Extra class on the root `article` |

### useNotifications()

| Field | Type | Description |
|------|------|-------------|
| notify | `(options: NotificationOptions) => string` | Enqueue a notification |
| dismiss | `(id: string) => void` | Dismiss one by id |
| dismissAll | `() => void` | Dismiss all active |

### useNotificationStore()

Same **`notify`**, **`dismiss`**, and **`dismissAll`** as above, plus **`items`**: `NotificationRecord[]` (active only, excluding items in the exit-animation phase).

## Related

- [Banner](../banner/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [Drawer](../drawer/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)

## LLM note

- Imports: **`NotificationProvider`**, **`useNotifications`**, **`useNotificationStore`**, **`NotificationCard`**, types **`NotificationOptions`**, **`NotificationRecord`**, **`NotificationPosition`**, **`NotificationType`**, **`NotificationSize`**, **`NotificationAction`** from **`"prime-ui-kit"`**.
- **`notify`** requires **`type`** and **`title`**; optional **`description`**, **`size`**, **`position`**, **`duration`**, **`persistent`**, **`icon`**, **`badge`**, **`closable`**, **`action`**.
- **`action`** is not a React node — it is **`{ label: string; onClick: () => void }`**; the kit renders **`Button.Root`** (neutral stroke) inside the card.
- Stack key = **`position` + `type`**; **`max`** applies per stack, not globally.
- **`persistent: true`** removes the progress bar and auto-dismiss; closing is manual or via **`dismiss`** / **`dismissAll`**.
- **`duration <= 0`** disables timer-based dismissal (still closable if **`closable`**).
- Do not nest **`NotificationProvider`** without a reason; one app root is typical.
- For static **`NotificationCard`**, build a full **`NotificationRecord`** (including **`id`**, **`position`**, **`size`**, **`duration`**, **`persistent`**, **`closable`**, **`createdAt`**) and wire **`onDismiss`** yourself.
