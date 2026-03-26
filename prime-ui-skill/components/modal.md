# Modal

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` у контролов (где есть ось размера), если явно не оговорено иное. У **`Modal`** фиксированный масштаб оболочки **`m`** — отдельного `size` на `Modal.Root` нет.

## What it is

A modal dialog over the page: a panel in a portal with a dimmed backdrop, scroll locking, and focus trapped inside the dialog until it closes.

## When to use it

- **Safety and irreversible actions** — explicit confirmation for deleting an account, resetting settings, or canceling a paid subscription without accidental clicks on the backdrop.
- **Checkout and payment** — a short step with the order total and payment method over the catalog, without leaving the purchase context.
- **Onboarding and tips** — first product launch, a tour of key controls, or a maintenance notice with a single clear “Got it” action.
- **Admin and reference data** — quick edit of one record (name, role, limit) in a popup form without navigating to a separate screen.
- **Media and object details** — enlarged preview, file caption, or release metadata in a layer over the gallery.
- **Legal and consent** — condensed offer text, cookie policy, or newsletter consent with a clear explicit user action.

## Use cases

Import from the `prime-ui-kit` package. Examples are grouped by screen intent and API combinations.

### Structure and short combinations

Recommended `Modal.Content` structure: required `Modal.Header` (fixed header layout: `title`, optional `description`, optional `icon`, optional `Modal.Close`), optional `Modal.Body` and `Modal.Footer`.

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function ModalStructureExamples() {
  return (
    <>
      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Header and footer only
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby="m-struct-header-footer-title">
              <Modal.Header
                titleId="m-struct-header-footer-title"
                title="Confirmation without body"
                description="Suits a short question with an explicit choice."
              >
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
              <Modal.Footer>
                <Modal.Close>
                  <Button.Root size="m" variant="neutral" mode="stroke">
                    Cancel
                  </Button.Root>
                </Modal.Close>
                <Button.Root size="m" variant="primary">
                  Confirm
                </Button.Root>
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Header and body without footer
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby="m-struct-header-body-title">
              <Modal.Header
                icon={<Icon name="nav.itemDot" />}
                titleId="m-struct-header-body-title"
                title="Information dialog"
              >
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
              <Modal.Body>
                <p style={{ margin: 0 }}>
                  A footer is optional when there is no separate action button row.
                </p>
              </Modal.Body>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>

      <Modal.Root>
        <Modal.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Header only (full block)
          </Button.Root>
        </Modal.Trigger>
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby="m-struct-header-only-title">
              <Modal.Header
                titleId="m-struct-header-only-title"
                title="Short notice"
                description="Full header block: title and description, no body or footer."
              >
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </>
  );
}
```

### Basic

Confirm deleting a draft: title, description, close control in the header.

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function DeleteDraftConfirm() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="error" mode="lighter">
          Delete draft
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="del-draft-title" aria-describedby="del-draft-desc">
            <Modal.Header
              icon={<Icon name="status.locked" />}
              titleId="del-draft-title"
              descriptionId="del-draft-desc"
              title="Delete draft?"
              description="This cannot be undone. Only this document will be affected."
            >
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
              <Modal.Close>
                <Button.Root size="m" variant="error">
                  Delete
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### Large announcement

Public announcement on a kiosk: prominent title and body; use typography and buttons as needed (modal shell is fixed scale `m`).

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function KioskAnnouncement() {
  return (
    <Modal.Root defaultOpen>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="kiosk-title">
            <Modal.Header
              icon={<Icon name="nav.layoutGrid" />}
              titleId="kiosk-title"
              title="Short hours today"
              description="Cashiers close at 4:00 PM. Thanks for your understanding."
            >
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Body>
              <p style={{ margin: 0 }}>Planned equipment work will finish before we open tomorrow.</p>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="l" variant="primary">
                  Acknowledged
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### In context (form / modal / sidebar / …)

Support ticket: input in `Modal.Body`, label via kit `Input`, actions in the footer.

```tsx
import { Button, Icon, Input, Modal } from "prime-ui-kit";

export function SupportTicketModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Contact support
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="ticket-title">
            <Modal.Header
              icon={<Icon name="field.email" />}
              titleId="ticket-title"
              title="New request"
              description="Briefly describe the issue — we will reply to the email on your profile."
            >
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Body>
              <Input.Root label="Subject" size="m">
                <Input.Wrapper>
                  <Input.Field placeholder="Report export is not working" />
                </Input.Wrapper>
              </Input.Root>
            </Modal.Body>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
              <Modal.Close>
                <Button.Root size="m" variant="primary" onClick={() => console.log("ticket")}>
                  Send
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### Without icon

Simple confirmation with no header icon: title, description, and close button only.

```tsx
import { Button, Icon, Modal } from "prime-ui-kit";

export function SimpleConfirmModal() {
  return (
    <Modal.Root>
      <Modal.Trigger>
        <Button.Root size="m" variant="neutral" mode="stroke">
          Save changes
        </Button.Root>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content aria-labelledby="simple-title">
            <Modal.Header
              titleId="simple-title"
              title="Confirm action"
              description="Changes will apply to all selected items."
            >
              <Modal.Close>
                <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                  <Button.Icon>
                    <Icon name="action.close" tone="subtle" />
                  </Button.Icon>
                </Button.Root>
              </Modal.Close>
            </Modal.Header>
            <Modal.Footer>
              <Modal.Close>
                <Button.Root size="m" variant="neutral" mode="stroke">
                  Cancel
                </Button.Root>
              </Modal.Close>
              <Modal.Close>
                <Button.Root size="m" variant="primary">
                  Confirm
                </Button.Root>
              </Modal.Close>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
}
```

### Controlled mode

Two-step wizard: parent holds `open` and opens step two programmatically after validating data.

```tsx
import { useState } from "react";
import { Button, Icon, Modal } from "prime-ui-kit";

export function WizardStepModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <>
      <Button.Root
        size="m"
        variant="primary"
        onClick={() => {
          setStep(1);
          setOpen(true);
        }}
      >
        Continue setup
      </Button.Root>

      <Modal.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setStep(1);
        }}
      >
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content aria-labelledby={`wiz-${step}-title`}>
              <Modal.Header
                icon={<Icon name="action.copy" />}
                titleId={`wiz-${step}-title`}
                title={`Step ${step} of 2`}
                description={step === 1 ? "Verify your contact details." : "Confirm to finish."}
              >
                <Modal.Close>
                  <Button.Root variant="neutral" mode="ghost" aria-label="Close">
                    <Button.Icon>
                      <Icon name="action.close" tone="subtle" />
                    </Button.Icon>
                  </Button.Root>
                </Modal.Close>
              </Modal.Header>
              <Modal.Body>
                {step === 1 ? <p style={{ margin: 0 }}>Profile data looks good.</p> : <p style={{ margin: 0 }}>Settings will be saved.</p>}
              </Modal.Body>
              <Modal.Footer>
                {step === 1 ? (
                  <Button.Root size="m" variant="primary" onClick={() => setStep(2)}>
                    Next
                  </Button.Root>
                ) : (
                  <Modal.Close>
                    <Button.Root size="m" variant="primary" onClick={() => setOpen(false)}>
                      Done
                    </Button.Root>
                  </Modal.Close>
                )}
              </Modal.Footer>
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </>
  );
}
```

## Anatomy

Compound `Modal` API:

`Root` provides open state and close policy.

Typical markup:

`Root` → optional `Trigger` → `Portal` → `Overlay` → `Content`.

Inside `Content`:

- `Header` — fixed layout: `title` (`h2`), optional `description` (`p`), optional `icon`, optional `Close` with a button;
- `Body` — optional main content;
- `Footer` — optional action row.

`Portal` renders nothing while the modal is closed. `Overlay` is a full-viewport backdrop; `Content` is the `role="dialog"` panel with focus trap.

## API

### Modal.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | `boolean` | — | No | Controlled open state; use with `onOpenChange`. |
| `defaultOpen` | `boolean` | `false` | No | Initial state when not using `open`. |
| `onOpenChange` | `(open: boolean) => void` | — | No | Open state changes (trigger, dismiss, programmatic). |
| `closeOnEscape` | `boolean` | `true` | No | Close on Escape while the dialog is open. |
| `closeOnOverlayClick` | `boolean` | `true` | No | Close when the click target is the overlay itself. |
| `children` | `React.ReactNode` | — | No | Trigger, portal, and the rest of the tree. |

### Modal.Trigger

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: … }>` | — | Yes | Exactly one element; click opens the modal after any existing `onClick`. |

### Modal.Close

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactElement<{ onClick?: …; className?: string; size?: ButtonSize }>` | — | Yes | One element; click closes the modal. Inside `Header`, `Button.Root` without `size` gets size **`m`**. |

### Modal.Portal

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `React.ReactNode` | — | No | Portal content; not mounted when the modal is closed. |
| `container` | `HTMLElement \| null` | `document.body` | No | DOM node for the portal. |

### Modal.Overlay

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Extra class on the backdrop. |
| `onClick` | `React.MouseEventHandler<HTMLDivElement>` | — | No | Runs before overlay-click close logic. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | `role="presentation"`; other root `div` attributes. |

### Modal.Content

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `aria-label` | `string` | — | No | Dialog name without a visible title (follow a11y guidance). |
| `aria-labelledby` | `string` | — | No | `id` of the title (`titleId` on `Modal.Header`). |
| `aria-describedby` | `string` | — | No | `id` of the description (`descriptionId` on `Modal.Header`). |
| `className` | `string` | — | No | Panel class. |
| `children` | `React.ReactNode` | — | No | Header, body, footer; wraps `ControlSizeProvider`. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | `role="dialog"`, `aria-modal`, `tabIndex={-1}`, focus trap, scroll lock, Escape via context. |

### Modal.Header

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `React.ReactNode` | — | Yes | Heading text (renders as `<h2>`). |
| `titleId` | `string` | auto (`useId`) | No | `id` on the `<h2>`; pass the same value as `aria-labelledby` on `Content` when labelling the dialog. |
| `description` | `React.ReactNode` | — | No | Secondary text (renders as `<p>`). |
| `descriptionId` | `string` | auto (`useId`) | No | `id` on the `<p>`; pass the same value as `aria-describedby` on `Content` when needed. |
| `icon` | `React.ReactNode` | — | No | Icon to the left of the text column. |
| `children` | `React.ReactNode` | — | No | Usually `Modal.Close` with a button. |
| `className` | `string` | — | No | Extra class on `<header>`. |
| … | `Omit<React.HTMLAttributes<HTMLElement>, "title">` | — | No | Root `<header>`. |

### Modal.Body

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Content area class. |
| `children` | `React.ReactNode` | — | No | Main content. |
| … | `React.HTMLAttributes<HTMLDivElement>` | — | No | Root `div`. |

### Modal.Footer

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | — | No | Footer class. |
| `children` | `React.ReactNode` | — | No | Action buttons. |
| … | `React.HTMLAttributes<HTMLElement>` | — | No | Renders `<footer>`. |

## Variants

There is no separate `variant` prop on the modal, and **no `size` on `Modal.Root`**: the shell is a single fixed scale (`m`) — panel width, backdrop padding, header layout, and default close button size in the header (when `Button` inside `Modal.Close` has no own `size`). Button semantics (primary, neutral, error) come from `Button` components inside the modal.

## States

- **Open / closed** — `open` / `defaultOpen` / `onOpenChange` on `Root`; when closed, `Portal` does not render children.
- **Escape to close** — `closeOnEscape` (default `true`); when `false`, exit only via explicit controls.
- **Overlay click to close** — `closeOnOverlayClick` (default `true`); only when the click lands on the overlay, not the panel.
- **Focus and backdrop** — while open, the page under the portal gets `inert` and `aria-hidden`; `Content` has tab trap and `tabIndex={-1}` for programmatic focus.

## Accessibility (a11y)

- Panel uses `role="dialog"` and `aria-modal="true"`. Set **`aria-labelledby`** to the **`titleId`** used on `Modal.Header` (or rely on auto-generated ids and avoid duplicate labelling), and **`aria-describedby`** to **`descriptionId`** when you expose description; if there is no visible title, use **`aria-label`** on `Content`.
- **Escape** closes the dialog unless `closeOnEscape` is disabled.
- Focus stays inside `Content` while the modal is open.
- The header close control needs an accessible name (`aria-label` or visible text).

## Limitations and notes

- **No built-in `asChild`:** `Trigger` and `Close` expect **exactly one** child React element and merge `onClick` via `cloneElement`.
- In **`Modal.Close`** inside **`Modal.Header`**, for a child with `displayName === "ButtonRoot"` without `size`, size **`m`** is applied; outside the header this injection does not happen.
- Long content: constrain **`Modal.Body`** height (or via class) and use **`overflow`** so scrolling happens inside the panel while the backdrop stays locked.
- The **`container`** prop on **`Modal.Portal`** sets the mount node instead of `document.body` (tests, special stacking contexts); the backdrop remains `position: fixed` to the viewport unless ancestors change positioning context.
- Full-width buttons in the panel — use **`fullWidth`** on **`Button.Root`** or footer layout; the modal has no dedicated prop for that.
- Nested modals in one tree need extra focus and portal ordering — the component targets one dialog per `Root`.

## Related components

- **Button** — trigger, dismiss, and footer actions.
- **LinkButton** — text link as open trigger (with `preventDefault` on `href="#"` in demos).
- **Input**, **Label**, **Hint** — fields inside `Modal.Body`.
- **Drawer** — side panel instead of a centered dialog when content is long or context is lists/filters.
- **Popover** — lightweight popover without full modal semantics or page lock.
