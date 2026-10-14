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
- Unsaved changes in a Modal, Drawer or Sheet form → `Modal.Guard` / `Drawer.Guard` / `Sheet.Guard` with `dirty` (it opens this dialog itself).
- A confirm that asks for input (a reason for a refusal, a comment) → [Modal](../modal/COMPONENT.md) `size="s"` with the field in `Modal.Body`, the action button in `Modal.Confirm`, and `Modal.Guard busy` while it is sent.

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
    ├── (reason)              a danger Banner with role="alert" after a failure: the rejection's message
    └── footer                Cancel (focused first) · the confirm (solid, loading while it runs)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ConfirmDialog.Root
No ref (state root). Renders its Trigger and a Modal `s` with `role="alertdialog"`: the question, the consequence, the reason after a failure, Cancel (focused first) and the confirm. While `onConfirm` runs nothing closes it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility; together with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | Initial visibility, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on open and close: the Trigger, Cancel, the close button, Escape, a resolved `onConfirm`. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the dialog, like Cancel. |
| `closeOnOutsideClick` | `boolean` | `false` | A click on the scrim (and on a phone a swipe down) closes the dialog. Off by default: a question about a weighty action is answered with a button, not by a stray click beside it. |
| `title` | `ReactNode` | — (required) | The question as a heading («Удалить проект?»); names the dialog. |
| `description` | `ReactNode` | — | What happens and what cannot be undone; describes the dialog. |
| `confirmLabel` | `ReactNode` | — (required) | The confirm button: the action as a verb («Удалить»), never «Да» or «ОК». |
| `tone` | `"danger" \| "accent"` | `"danger"` | `danger`: a destructive action, solid danger confirm. `accent`: a weighty but safe one (send, publish), solid accent confirm. |
| `onConfirm` | `() => unknown` | — (required) | The action. A pending Promise keeps the dialog busy (`loading`, nothing closes it). Resolve closes it; reject keeps it open with the reason: the `Error.message` or string, else `labels.error`. |
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

### Flags
| Flag | Effect | Default |
|---|---|---|
| `closeOnEscape` | Escape closes the dialog like Cancel (never while the action runs) | `true` |
| `closeOnOutsideClick` | a click on the scrim (on a phone also a swipe down) closes it; turn on only for a safe confirm | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| open / closed | `open` / `defaultOpen` / `onOpenChange` | `data-state` on the scrim and the dialog (closed while the exit motion plays) |
| running | `onConfirm` returned a pending Promise | the confirm `data-loading="true"` and `aria-busy="true"`; Cancel and the close button `disabled` in place; Escape ignored |
| failed | `onConfirm` rejected | a danger Banner with `role="alert"` drops in under the header with the rejection's `Error.message` (or string, else `labels.error`); the confirm is ready again; the next try or closing clears it, and the body closes up in place |

## Layout & spacing
- Modal `s`: 440 wide, the footer fills with two equal buttons; a bottom sheet on a phone, buttons stacked full width.
- The failure message is the dialog body (20 around it); without it the header meets the footer.
- Write the title as a question with the object («Удалить тег «VIP»?»), the description as the consequence in one or two sentences, the confirm as the verb.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` · `Shift+Tab` | Cycles focus inside the dialog; Cancel is focused first. |
| `Enter` | On a button presses it; from the dialog itself presses the confirm. |
| `Escape` | Closes the dialog (`closeOnEscape`) unless the action runs; focus returns to the trigger. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- `role="alertdialog"`, `aria-modal="true"`, named by `title`, described by `description`.
- Cancel takes focus first — the least destructive choice.
- While the action runs the confirm has `aria-busy="true"`; Cancel and the close button are disabled.
- The reason of a failure is `role="alert"`, read at once.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `cancel` | `"Отмена"` | The cancel button. |
| `close` | `"Закрыть"` | `aria-label` of the header close button. |
| `error` | `"Не получилось. Попробуйте ещё раз."` | The message after a rejected `onConfirm` without a reason of its own. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Deleting a project: the danger confirm runs the request with a spinner and nothing closes the dialog until it ends — `ConfirmDialog.Trigger`, `onConfirm`. |
| [variants.tsx](examples/variants.tsx) | A destructive action gets the danger confirm; a weighty but safe one, such as sending an invoice, the accent one — `tone`. |
| [failure.tsx](examples/failure.tsx) | The server refuses: the dialog stays open with the reason of the rejection under the text and the confirm ready to try again — `onConfirm`. |
| [dismiss.tsx](examples/dismiss.tsx) | A reminder to the client is weighty but safe: a click beside the dialog closes it like Cancel, and Escape does too — `closeOnOutsideClick`, `closeOnEscape`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | A menu item opens the confirm from code: the dialog has no trigger of its own and the parent owns its state — `open`, `onOpenChange`. |

## Mistakes
- A hand-built Modal with `closeOnOutsideClick={false}`, a loading flag and a disabled Cancel → ConfirmDialog does all of it.
- `onConfirm` that catches its own error and resolves → the dialog closes as if it worked; rethrow (or reject) to keep it open. Reject with an `Error` whose message a person can read («Тег используется в 12 сделках») — it is the text under the question.
- `closeOnOutsideClick` on a destructive confirm → a stray click beside it must not answer the question; keep it off for `danger`.
- «Да» / «ОК» on the confirm → the verb of the action («Удалить», «Отправить»).
- A success message inside the dialog → it closes on success; say «Удалено» with a Notification.
- `tone="accent"` for a delete → destructive is always `danger`.

## Related
- **Built from:** the dialog Modal stands on (`internal/overlay/ModalDialog` at `s`, the header, body and footer of `internal/overlay/DialogParts`), [ScrollContainer](../scroll-container/COMPONENT.md) (the body), [Avatar](../avatar/COMPONENT.md) and [Thumbnail](../thumbnail/COMPONENT.md) (pictures the shared icon slot recognises), [Button](../button/COMPONENT.md) (Cancel, the confirm with `loading`), [Banner](../banner/COMPONENT.md) (the failure message), `Icon` (`status.danger` in the Banner)
- **See also:** [Modal](../modal/COMPONENT.md), [Drawer](../drawer/COMPONENT.md), [Notification](../notification/COMPONENT.md)
