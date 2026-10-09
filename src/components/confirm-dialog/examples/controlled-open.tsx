/** A menu item opens the confirm from code: the dialog has no trigger of its own and the parent owns its state — `open`, `onOpenChange`. */
import { Button, ConfirmDialog, Dropdown, Icon } from "prime-ui-kit";
import * as React from "react";

export default function ConfirmDialogControlledOpenExample() {
  const [confirming, setConfirming] = React.useState(false);

  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="ghost" tone="neutral" aria-label="Действия со счётом">
            <Button.Icon>
              <Icon name="action.more" />
            </Button.Icon>
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Скачать PDF</Dropdown.Item>
          <Dropdown.Item tone="danger" onSelect={() => setConfirming(true)}>
            Аннулировать счёт
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
      <ConfirmDialog.Root
        open={confirming}
        onOpenChange={setConfirming}
        title="Аннулировать счёт №318?"
        description="Клиент увидит счёт как недействительный; выставить его снова не получится."
        confirmLabel="Аннулировать"
        onConfirm={() => new Promise((resolve) => setTimeout(resolve, 900))}
      />
    </>
  );
}
