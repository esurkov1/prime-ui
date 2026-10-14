/** A status badge, an avatar and an information icon explain themselves: the kit makes each a tab stop, so the tooltip opens from the keyboard too — `Tooltip.Trigger`. */
import { Avatar, Badge, Icon, Tooltip } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TooltipNonInteractiveTriggerExample() {
  return (
    <div className={styles.row}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Badge.Root tone="danger">Просрочен</Badge.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Счёт не оплачен 12 дней, срок был 1 октября</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Avatar.Root color="blue" aria-label="Анна Соколова">
            <Avatar.Fallback>АС</Avatar.Fallback>
          </Avatar.Root>
        </Tooltip.Trigger>
        <Tooltip.Content>Анна Соколова, ответственная по заказу</Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Icon name="status.locked" tone="muted" label="Системный статус" />
        </Tooltip.Trigger>
        <Tooltip.Content>Системный статус нельзя удалить или переименовать</Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}
