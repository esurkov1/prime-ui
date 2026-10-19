/** A destructive action gets the danger confirm; a weighty but safe one, such as sending an invoice, the accent one — `tone`. */
import { Button, ConfirmDialog, Typography } from "prime-ui-kit";

export default function ConfirmDialogVariantsExample() {
  return (
    <div>
      <div>
        <ConfirmDialog.Root
          title="Отозвать доступ Анны Соколовой?"
          description="Она потеряет доступ к проектам команды сразу."
          confirmLabel="Отозвать"
          onConfirm={() => {}}
        >
          <ConfirmDialog.Trigger>
            <Button.Root variant="soft" tone="danger">
              Отозвать доступ
            </Button.Root>
          </ConfirmDialog.Trigger>
        </ConfirmDialog.Root>
        <Typography as="span" variant="caption" tone="muted">
          danger
        </Typography>
      </div>
      <div>
        <ConfirmDialog.Root
          tone="accent"
          title="Отправить счёт №318 клиенту?"
          description="Счёт на 480 000 ₽ уйдёт на office@nwind.ru."
          confirmLabel="Отправить"
          onConfirm={() => {}}
        >
          <ConfirmDialog.Trigger>
            <Button.Root variant="soft" tone="neutral">
              Отправить счёт
            </Button.Root>
          </ConfirmDialog.Trigger>
        </ConfirmDialog.Root>
        <Typography as="span" variant="caption" tone="muted">
          accent
        </Typography>
      </div>
    </div>
  );
}
