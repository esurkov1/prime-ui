import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Обычные пункты и акцент деструктивного действия через `destructive` у `Dropdown.Item`. */
export default function DropdownVariantsSnippet() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root size="m" variant="neutral" mode="lighter">
          Документ
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Переименовать</Dropdown.Item>
        <Dropdown.Item>Переместить…</Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive>Удалить безвозвратно</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
