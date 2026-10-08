/** Actions with an order raised from the bottom edge: a header names the order, a column of actions follows, and each action closes the sheet — `Sheet.Trigger`, `Sheet.Header`, `Sheet.Close`. */
import { Button, Icon, Sheet } from "prime-ui-kit";

import styles from "./examples.module.css";

const ACTIONS = [
  { label: "Повторить заказ", icon: "action.refresh" },
  { label: "Скачать счёт", icon: "action.download" },
  { label: "Скопировать ссылку", icon: "action.copy" },
] as const;

export default function SheetOverviewExample() {
  return (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Действия с заказом
        </Button.Root>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Заказ № 1042</Sheet.Title>
          <Sheet.Description>Анна Смирнова · 12 480 ₽</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div className={styles.actions}>
            {ACTIONS.map((action) => (
              <Sheet.Close key={action.label}>
                <Button.Root variant="ghost" tone="neutral" fullWidth>
                  <Button.Icon>
                    <Icon name={action.icon} />
                  </Button.Icon>
                  {action.label}
                </Button.Root>
              </Sheet.Close>
            ))}
            <Sheet.Close>
              <Button.Root variant="ghost" tone="danger" fullWidth>
                <Button.Icon>
                  <Icon name="action.delete" />
                </Button.Icon>
                Отменить заказ
              </Button.Root>
            </Sheet.Close>
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  );
}
