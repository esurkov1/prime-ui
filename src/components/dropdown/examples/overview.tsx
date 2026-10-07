/** An icon-only button opens the row actions; picking an item runs it and closes the menu — `Dropdown.Item`, `onSelect`. */
import { Button, Dropdown, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

export default function DropdownOverviewExample() {
  const [status, setStatus] = React.useState("Счёт № 4821 · черновик");

  return (
    <>
      <Typography as="span" variant="body-m">
        {status}
      </Typography>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="ghost" tone="neutral" aria-label="Действия со счётом">
            <Button.Icon>
              <Icon name="action.more" />
            </Button.Icon>
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="end">
          <Dropdown.Item onSelect={() => setStatus("Счёт № 4821 · отправлен")}>
            Отправить клиенту
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => setStatus("Счёт № 4822 · копия")}>
            Дублировать
          </Dropdown.Item>
          <Dropdown.Item onSelect={() => setStatus("Счёт № 4821 · скачан")}>
            Скачать PDF
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item tone="danger" onSelect={() => setStatus("Счёт № 4821 · удалён")}>
            Удалить счёт
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
