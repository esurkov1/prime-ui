import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Недоступный пункт: `disabled` на `Dropdown.Item`, без закрытия меню при фокусе с клавиатуры. */
export default function DropdownStatesSnippet() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="neutral" mode="stroke">
          Доступ к отчёту
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Скачать PDF</Dropdown.Item>
        <Dropdown.Item disabled>Экспорт в Excel (нет прав)</Dropdown.Item>
        <Dropdown.Item>Отправить на почту</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
