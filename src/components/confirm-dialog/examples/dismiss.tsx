/** A reminder to the client is weighty but safe: a click beside the dialog closes it like Cancel, and Escape does too — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, ConfirmDialog } from "prime-ui-kit";

/** Pretends to send the reminder. */
function sendReminder() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}

export default function ConfirmDialogDismissExample() {
  return (
    <ConfirmDialog.Root
      tone="accent"
      closeOnOutsideClick
      closeOnEscape
      title="Напомнить клиенту о счёте №318?"
      description="ООО «Гранит» получит письмо со ссылкой на оплату."
      confirmLabel="Напомнить"
      onConfirm={sendReminder}
    >
      <ConfirmDialog.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Напомнить об оплате
        </Button.Root>
      </ConfirmDialog.Trigger>
    </ConfirmDialog.Root>
  );
}
