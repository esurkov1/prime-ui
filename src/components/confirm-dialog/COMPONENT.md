# ConfirmDialog

**Category:** overlays
**Kind:** overlay

> The confirm of a destructive or weighty action in one piece: the question, the consequence, Cancel and an action that runs its own request.

## When to use
- Deleting, revoking, cancelling or overwriting something that cannot be undone («Удалить проект?»).
- A weighty but safe action that should not happen by accident (send an invoice, publish to everyone) — `tone="accent"`.
- Any confirm from a button, a Dropdown item or a table row action: the request, its pending state and its failure live inside.

## When not to use
- A form, a choice or more than one sentence of content → use [Modal](../modal/COMPONENT.md).
- An action that can be undone → do it at once and offer «Отменить» in a [Notification](../notification/COMPONENT.md).
- A hold-to-confirm right on the button (no dialog) → `holdToConfirm` on [Button](../button/COMPONENT.md).
- Unsaved changes in a Modal or Drawer form → `Modal.Guard` / `Drawer.Guard dirty` (it opens this dialog itself).

## Import
```tsx
import { ConfirmDialog } from "prime-ui-kit";
```

## Anatomy
```
ConfirmDialog.Root            state; renders the trigger and the dialog
├── ConfirmDialog.Trigger     clones its child; opens on click
└── (Modal s)                 portal + scrim + role="alertdialog"
    ├── header                title (names it) · description (describes it) · close button
    ├── (message)             a danger Banner with role="alert" after a failure
    └── footer                Cancel (focused first) · the confirm (solid, loading while it runs)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ConfirmDialog.Root
No ref (state root). Renders its Trigger and a Modal `s` with `role="alertdialog"`: the title, the description, an inline danger message after a failure, Cancel (focused first) and the confirm. A press outside never closes it; while `onConfirm` runs nothing closes it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on open and close: the Trigger, Cancel, the close button, Escape, a resolved `onConfirm`. |
| `title` | `ReactNode` | — (required) | The question as a heading («Удалить проект?»); names the dialog. |
| `description` | `ReactNode` | — | What happens and what cannot be undone; describes the dialog. |
| `confirmLabel` | `ReactNode` | — (required) | The confirm button: the action as a verb («Удалить»), never «Да» or «ОК». |
| `tone` | `"danger" \| "accent"` | `"danger"` | `danger`: a destructive action, solid danger confirm. `accent`: a weighty but safe one (send, publish), solid accent confirm. |
| `onConfirm` | `() => unknown` | — (required) | The action. A Promise keeps the dialog busy: the confirm shows `loading`, Cancel and the close button are disabled, Escape is ignored. Resolve closes the dialog; reject keeps it open with `error` (else `labels.error`). |
| `error` | `ReactNode` | — | Why the action failed, from the owner; shown under the text while set. |
| `labels` | `Partial<ConfirmDialogLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `ConfirmDialog.Trigger`; nothing when `open` comes from code. |

### ConfirmDialog.Trigger
No DOM: clones the single child and chains its `onClick` to open the dialog (unless the child's handler calls `preventDefault()`); focus returns to it on close.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element, usually a Button with `tone="danger"`. |

## Variants
The dialog is a Modal `s` with the floating surface, a header and a footer; there is no icon tile.

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `danger` | solid danger confirm | Delete, revoke, cancel for good | yes |
| `accent` | solid accent confirm | Send, publish, charge — weighty but safe | |

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the scrim and the dialog (closed while the exit motion plays) |
| running | `onConfirm` returned a pending Promise | the confirm `data-loading="true"` and `aria-busy="true"`; Cancel and the close button `disabled` in place; Escape ignored |
| failed | `onConfirm` rejected, or `error` set | a danger Banner with `role="alert"` drops in under the header; the confirm is ready again |

## Layout & spacing
- Modal `s`: 440 wide, the footer fills with two equal buttons; a bottom sheet below 640px of viewport, buttons stacked full width.
- The failure message is the dialog body (20 around it); without it the header meets the footer.
- Write the title as a question with the object («Удалить тег «VIP»?»), the description as the consequence in one or two sentences, the confirm as the verb.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` · `Shift+Tab` | Cycles focus inside the dialog; Cancel is focused first. |
| `Enter` | On a button presses it; from the dialog itself presses the confirm. |
| `Escape` | Closes the dialog unless the action runs; focus returns to the trigger. |

### ARIA
- `role="alertdialog"`, `aria-modal="true"`, named by `title`, described by `description`.
- Cancel takes focus first — the least destructive choice.
- While the action runs the confirm has `aria-busy="true"`; Cancel and the close button are disabled.
- The failure message is `role="alert"`, read at once.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `cancel` | `"Отмена"` | The cancel button. |
| `close` | `"Закрыть"` | `aria-label` of the header close button. |
| `error` | `"Не получилось. Попробуйте ещё раз."` | The message after a rejected `onConfirm` when there is no `error`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Deleting a project: the danger confirm runs the request with a spinner and nothing closes the dialog until it ends — `ConfirmDialog.Trigger`, `onConfirm`. |
| [variants.tsx](examples/variants.tsx) | A destructive action gets the danger confirm; a weighty but safe one, such as sending an invoice, the accent one — `tone`. |
| [failure.tsx](examples/failure.tsx) | The server refuses: the dialog stays open with the owner's reason under the text and the confirm ready to try again — `error`, `onConfirm`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | A menu item opens the confirm from code: the dialog has no trigger of its own and the parent owns its state — `open`, `onOpenChange`. |

## Mistakes
- A hand-built Modal with `closeOnOutsideClick={false}`, a loading flag and a disabled Cancel → ConfirmDialog does all of it.
- `onConfirm` that catches its own error and resolves → the dialog closes as if it worked; rethrow (or reject) to keep it open.
- «Да» / «ОК» on the confirm → the verb of the action («Удалить», «Отправить»).
- A success message inside the dialog → it closes on success; say «Удалено» with a Notification.
- `tone="accent"` for a delete → destructive is always `danger`.

## Related
- **Built from:** [Modal](../modal/COMPONENT.md) (`s`, the header and footer parts), [Button](../button/COMPONENT.md) (Cancel, the confirm with `loading`), [Banner](../banner/COMPONENT.md) (the failure message), `Icon` (`status.danger` in the Banner)
- **See also:** [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), [Notification](../notification/COMPONENT.md)
