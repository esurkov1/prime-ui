/** Optional parts: a panel with plain text only, and a panel with a title, a description and actions — `Popover.Header`, `Popover.Actions`. */
import { Button, Icon, Popover, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PopoverStructureExample() {
  return (
    <>
      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="ghost" tone="neutral">
            <Button.Icon>
              <Icon name="status.info" />
            </Button.Icon>
            Что такое НДС 0%?
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content className={styles.panel}>
          <Typography.Root variant="body-s" tone="secondary">
            Ставка для экспорта товаров. Нужны подтверждающие документы в течение 180 дней.
          </Typography.Root>
        </Popover.Content>
      </Popover.Root>

      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral">
            Сохранить фильтр
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content className={styles.panel}>
          <Popover.Header>
            <Popover.Title>Сохранить фильтр?</Popover.Title>
            <Popover.Description>Он появится в списке представлений слева.</Popover.Description>
          </Popover.Header>
          <Popover.Actions>
            <Popover.Close>
              <Button.Root variant="ghost" tone="neutral">
                Отмена
              </Button.Root>
            </Popover.Close>
            <Popover.Close>
              <Button.Root>Сохранить</Button.Root>
            </Popover.Close>
          </Popover.Actions>
        </Popover.Content>
      </Popover.Root>
    </>
  );
}
