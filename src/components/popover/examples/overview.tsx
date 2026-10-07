/** A button opens a filter panel with a header and actions; buttons in `Popover.Close` close it — `Popover.Trigger`, `Popover.Close`. */
import { Button, Checkbox, Icon, Popover } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function PopoverOverviewExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Icon name="action.filter" />
          </Button.Icon>
          Фильтры
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className={styles.panel}>
        <Popover.Header>
          <Popover.Title>Фильтры отчёта</Popover.Title>
          <Popover.Description>Применяются ко всем графикам на странице.</Popover.Description>
        </Popover.Header>
        <div className={styles.stack}>
          <Checkbox.Root defaultChecked>
            <Checkbox.Label>Только активные клиенты</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root>
            <Checkbox.Label>Скрыть нулевые строки</Checkbox.Label>
          </Checkbox.Root>
        </div>
        <Popover.Actions>
          <Popover.Close>
            <Button.Root variant="ghost" tone="neutral">
              Сбросить
            </Button.Root>
          </Popover.Close>
          <Popover.Close>
            <Button.Root>Применить</Button.Root>
          </Popover.Close>
        </Popover.Actions>
      </Popover.Content>
    </Popover.Root>
  );
}
