/** In a narrow column the panel takes the exact width of a full-width trigger and its text wraps; a table of limits takes the width it needs — `width`. */
import { Button, DescriptionList, Popover, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const LIMITS = [
  { term: "Пользователи", value: "до 10 на рабочее пространство" },
  { term: "Хранилище", value: "50 ГБ на команду, файлы до 2 ГБ" },
  { term: "Поддержка", value: "приоритетная, ответ в течение 4 часов" },
];

export default function PopoverWidthExample() {
  return (
    <div className={styles.narrowColumn}>
      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="soft" tone="neutral" fullWidth>
            Условия тарифа
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content width="trigger">
          <Typography variant="body-s" tone="secondary">
            До 10 пользователей, 50 ГБ хранилища и приоритетная поддержка.
          </Typography>
        </Popover.Content>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger>
          <Button.Root variant="ghost" tone="neutral" fullWidth>
            Все лимиты
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content width="content">
          <DescriptionList.Root>
            {LIMITS.map((limit) => (
              <DescriptionList.Item key={limit.term} label={limit.term}>
                {limit.value}
              </DescriptionList.Item>
            ))}
          </DescriptionList.Root>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
