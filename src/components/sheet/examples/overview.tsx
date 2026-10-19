/** Actions with an order raised from the bottom edge: a header names the order, a column of actions follows, and each action closes the sheet — `Sheet.Trigger`, `Sheet.Header`, `Sheet.Close`. */
import { Button, ConfirmDialog, Icon, Sheet } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ACTIONS = [
  { label: "Повторить заказ", icon: "action.refresh" },
  { label: "Скачать счёт", icon: "action.download" },
  { label: "Скопировать ссылку", icon: "action.copy" },
] as const;

/** Pretends to cancel the order on the server. */
function cancelOrder() {
  return new Promise((resolve) => setTimeout(resolve, 900));
}

export default function SheetOverviewExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Действия с заказом
        </Button.Root>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title number="№ 1042">Заказ</Sheet.Title>
          <Sheet.Description>Анна Смирнова · 12 480 ₽</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div className={styles.actions}>
            {ACTIONS.map((action) => (
              <Sheet.Close key={action.label}>
                <Button.Root variant="soft" tone="neutral" fullWidth>
                  <Button.Icon>
                    <Icon name={action.icon} />
                  </Button.Icon>
                  {action.label}
                </Button.Root>
              </Sheet.Close>
            ))}
            <ConfirmDialog.Root
              title="Отменить заказ № 1042?"
              description="Клиент получит уведомление, а оплата вернётся на карту."
              confirmLabel="Отменить заказ"
              onConfirm={() => cancelOrder().then(() => setOpen(false))}
            >
              <ConfirmDialog.Trigger>
                <Button.Root variant="soft" tone="danger" fullWidth>
                  <Button.Icon>
                    <Icon name="action.delete" />
                  </Button.Icon>
                  Отменить заказ
                </Button.Root>
              </ConfirmDialog.Trigger>
            </ConfirmDialog.Root>
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}
