# Notification

## What it is

A toast system on context and portal: the provider holds a message queue, hooks show and dismiss cards, and `NotificationCard` can be rendered standalone for a static preview.

## When to use it

- **User account and payments** — confirm a saved card, a charge error, or successful payment without navigating to another screen.
- **Editors and collaboration** — someone left a comment, a document was sent for approval, a version was restored from history.
- **Logistics and tracking** — delivery status change, warehouse delay, a short message without blocking the order card.
- **Integrations and background jobs** — export ready, CRM sync finished, webhook returned an error with a “Retry” option.
- **Media and uploads** — file uploaded, conversion done, preview unavailable due to permissions — without a modal.
- **Incidents and session** — connection lost, upcoming maintenance, forced sign-out on another device.

## Use cases

Import from the `prime-ui-kit` package. The examples below cover different product areas and different parts of the API.

### Basic

Notification settings: after toggling a channel, show a short confirmation with auto-dismiss.

```tsx
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";
import * as React from "react";

function SaveChannelButton() {
  const { notify } = useNotifications();

  return (
    <Button.Root
      mode="filled"
      size="m"
      variant="primary"
      onClick={() =>
        notify({
          type: "success",
          title: "Channel updated",
          description: "Order emails will go to the new address.",
          position: "top-right",
          size: "m",
        })
      }
    >
      Save channel
    </Button.Root>
  );
}

export function PreferencesRoot() {
  return (
    <NotificationProvider position="top-right">
      <SaveChannelButton />
    </NotificationProvider>
  );
}
```

### Variants and sizes

Content moderation panel: a strong warning at large size and a compact info message — different `type` and `size`.

```tsx
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

export function ModerationToolbar() {
  const { notify } = useNotifications();

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button.Root
        mode="filled"
        size="m"
        variant="danger"
        onClick={() =>
          notify({
            type: "error",
            title: "Publication rejected",
            description: "The “Listings” section rules were violated.",
            size: "l",
            position: "top-center",
            duration: 8000,
          })
        }
      >
        Reject
      </Button.Root>
      <Button.Root
        mode="stroke"
        size="m"
        variant="neutral"
        onClick={() =>
          notify({
            type: "info",
            title: "Draft saved",
            description: "The item will stay in the queue for 7 days.",
            size: "s",
            position: "top-center",
            duration: 4000,
          })
        }
      >
        Save to drafts
      </Button.Root>
    </div>
  );
}

export function ModerationApp() {
  return (
    <NotificationProvider position="top-center" max={4}>
      <ModerationToolbar />
    </NotificationProvider>
  );
}
```

### In context (form / modal / sidebar / …)

Reports sidebar: toast with a “Download” action after generating an export; icon and row count via `badge`.

```tsx
import { Bell } from "lucide-react";
import { Button, NotificationProvider, useNotifications } from "prime-ui-kit";

export function ReportsSidebar() {
  const { notify } = useNotifications();

  const runExport = () => {
    notify({
      type: "success",
      title: "Quarterly report",
      description: "XLSX is ready to download.",
      position: "bottom-right",
      size: "m",
      icon: <Bell aria-hidden style={{ width: 20, height: 20 }} />,
      badge: "12 MB",
      action: {
        label: "Download",
        onClick: () => {
          window.location.assign("/exports/latest-quarter.xlsx");
        },
      },
    });
  };

  return (
    <aside>
      <Button.Root mode="filled" size="m" variant="primary" onClick={runExport}>
        Generate export
      </Button.Root>
    </aside>
  );
}

export function AnalyticsShell() {
  return (
    <NotificationProvider position="bottom-right">
      <ReportsSidebar />
    </NotificationProvider>
  );
}
```

### Controlled mode

Warehouse terminal: the operator adds toasts with an “Event” button, and the footer table reads `items` and can dismiss any toast via `dismiss(id)` without a close button on the card itself.

```tsx
import { Button, NotificationProvider, useNotificationStore } from "prime-ui-kit";

function WarehouseFooter() {
  const { items, notify, dismiss } = useNotificationStore();

  return (
    <footer>
      <Button.Root
        mode="filled"
        size="m"
        variant="primary"
        onClick={() =>
          notify({
            type: "warning",
            title: "Shipment delay",
            description: "The forklift is busy at gate 4.",
            position: "bottom-left",
            size: "m",
            persistent: true,
            badge: items.length + 1,
          })
        }
      >
        Log event
      </Button.Root>
      <p>Toasts on screen: {items.length}</p>
      <table>
        <tbody>
          {items.map((row) => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>
                <Button.Root mode="ghost" size="s" variant="neutral" onClick={() => dismiss(row.id)}>
                  Dismiss from screen
                </Button.Root>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </footer>
  );
}

export function WarehouseApp() {
  return (
    <NotificationProvider position="bottom-left" max={6}>
      <WarehouseFooter />
    </NotificationProvider>
  );
}
```

## Anatomy

- **`NotificationProvider`** — React Context with store value, child portal with a fixed viewport and zones per position; inside zones, stacks per `type`.
- **`NotificationStack` / `NotificationStackItem`** (internal) — list of cards; hover expands the stack and sets `paused` on timers.
- **`NotificationCard`** — `article` with `role` alert or status, icon, title, optional `badge`, description, row with `Button.Root` for `action`, close button, progress bar (unless `persistent`).

## API

### NotificationProvider

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | React.ReactNode | — | Yes | App wrapper (or subtree) where hooks are called. |
| position | NotificationPosition | `"top-right"` | No | Default zone if `notify` does not pass `position`. |
| max | number | `5` | No | Max cards in one stack (position + type). |

### notify(options)

| Field | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| type | `"success"` \| `"error"` \| `"warning"` \| `"info"` | — | Yes | Semantics, default icon, stack grouping. |
| title | string | — | Yes | Title. |
| description | string | — | No | Subtitle. |
| size | `"s"` \| `"m"` \| `"l"` | `"m"` | No | Card size. |
| position | NotificationPosition | from provider | No | Corner or edge center of the screen. |
| duration | number | `5000` | No | Ms until auto-dismiss; with `persistent`, not used for closing. |
| persistent | boolean | `false` | No | Do not close on timer; no progress bar. |
| icon | React.ReactNode | icon by type | No | Custom icon on the left. |
| badge | string \| number | — | No | Label next to the title. |
| closable | boolean | `true` | No | Show close button. |
| action | `{ label: string; onClick: () => void }` | — | No | Secondary action in the card body. |

Returns `string` — record `id` for `dismiss(id)`.

### NotificationRecord

Normalized store result: all fields from `NotificationOptions` with defaults filled in, plus `id` and `createdAt`.

### NotificationCard

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| item | NotificationRecord | — | Yes | Card data. |
| paused | boolean | — | Yes | Pause countdown (e.g. stack expanded). |
| onDismiss | `(id: string) => void` | — | Yes | Close via timer or button. |
| stackDepth | number | `0` | No | Stack index for styling. |
| stackExpanded | boolean | `false` | No | Whether the stack is expanded. |
| className | string | — | No | Extra class on root. |

### useNotifications()

| Field | Type | Description |
|------|------|-------------|
| notify | `(options: NotificationOptions) => string` | Show a notification. |
| dismiss | `(id: string) => void` | Close one. |
| dismissAll | `() => void` | Close all active. |

### useNotificationStore()

Same methods, plus `items: NotificationRecord[]` — active records without internal closing-animation state.

## Variants

- **`type`**: `success`, `error`, `warning`, `info` — palette, default icon, and live role (`error` and `warning` → `alert` + `aria-live="assertive"`, otherwise `status` + `polite`).
- **`size`**: `s`, `m`, `l` — height, typography, and icon area size from card tokens.

## States

- **Regular toast** — timer, progress bar, dismiss by time or close button.
- **Expanded stack** — on hover, cards spread out; timers paused (`paused`).
- **Persistent** — no auto-dismiss and no bottom bar; close only manually or via `dismiss` / `dismissAll`.
- **Closing** — card marked internally, exit animation plays, then the record is removed from the store.

## Accessibility (a11y)

- Live region: `role="alert"` or `status` and matching `aria-live`.
- Close button with `aria-label="Dismiss notification"`; inner icon with `aria-hidden`.
- Stack region labeled with `aria-label` including position.
- Body action is a regular `Button` with visible `label` text.

## Limitations and notes

- Nested `NotificationProvider`s create multiple portals with duplicate zones — usually one at the root is enough.
- Stacks are split by **position** and **type**: two `info` toasts in one corner share one stack; `info` and `success` in the same corner become two stack columns.
- `max` caps stack depth; on overflow, older items in that stack are dropped.
- `duration <= 0` disables timer animation in `useCountdown`; time-based closing must be handled separately.
- `NotificationCard` is not wired to the store by itself — for live toasts use the provider and `notify`.

## Related components

- **Button** — action button inside the card (`action`).
- **Banner** — persistent inline page message when a toast is not appropriate.
- **Modal / Drawer** — for errors that need focus and backdrop blocking; a toast does not replace them.
