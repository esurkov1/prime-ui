import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Недоступный пункт через `disabled` — как в `playground/snippets/dropdown/states.tsx`. */
export default function DropdownStatesExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root type="button" variant="neutral" mode="stroke">
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
