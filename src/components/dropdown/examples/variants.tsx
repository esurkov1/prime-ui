import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Обычные пункты и `destructive` на `Dropdown.Item` — как в `playground/snippets/dropdown/variants.tsx`. */
export default function DropdownVariantsExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root type="button" variant="neutral" mode="lighter">
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
