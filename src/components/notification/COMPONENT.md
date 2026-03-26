# Notification

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Toast notifications: `NotificationProvider` keeps a queue, hooks expose `notify` / `dismiss` / `dismissAll`, and cards render in a portal with stacked groups per corner and semantic type.

- **Use** for short, non-blocking feedback after actions (save, send, background job finished) when you do not need to trap focus.
- **Use** when the message should appear above the page chrome and auto-dismiss or offer a single secondary action.
- **Use** `useNotificationStore` when the UI must read `items` (e.g. custom lists or bulk dismiss).
- **Use** `NotificationCard` alone only for static previews or fully custom wiring; live toasts go through the provider and `notify`.
- **Do not use** for errors that require a blocking decision, long forms, or primary workflow inside the toast—prefer [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), or [Banner](../banner/COMPONENT.md).
- **Do not use** multiple nested `NotificationProvider`s unless you intentionally want several portals and duplicate zones.

## Composition

- **`NotificationProvider`** — wraps the tree that calls hooks; provides context and mounts a **portal** with a fixed viewport. Each screen **position** gets a **zone**; inside a zone, notifications are split into **stacks by `type`** (`success`, `error`, `warning`, `info`).
- **`NotificationStack` / `NotificationStackItem`** (internal) — ordered list with Framer Motion; hovering expands the stack and sets **`paused`** on cards so countdown timers stop until collapse.
- **`NotificationCard`** — root is an `article` with a live region role, leading icon, title row (optional **badge**), optional description, optional **action** (`Button.Root`), optional close control, and a progress track unless **`persistent`**.

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

## Rules

- Call **`useNotifications`** or **`useNotificationStore`** only under **`NotificationProvider`**; both hooks throw if context is missing.
- **`notify`** returns a string **`id`**; pass it to **`dismiss`** or use **`dismissAll`** for every active toast.
- **`useNotificationStore`** exposes the same methods plus **`items`**: `NotificationRecord[]` of non-dismissing entries only (no internal closing-animation flag).
- Options passed to **`notify`** are merged with defaults: **`size`** `"m"`, **`position`** from the provider, **`duration`** `5000` ms, **`persistent`** `false`, **`closable`** `true`.
- With **`persistent`**, there is no auto-dismiss, no progress bar, and duration does not drive closing; users or **`dismiss`** / **`dismissAll`** must close the card.
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
