import { Copy, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

/** Меню действий над сущностью: безопасные операции и отдельный деструктивный блок. */
export default function DropdownActionsMenuExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root
          type="button"
          variant="neutral"
          mode="stroke"
          size="m"
          aria-label="Действия с документом"
        >
          ⋯
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Item>
          <Dropdown.ItemIcon as={Pencil} strokeWidth={2} />
          Редактировать
        </Dropdown.Item>
        <Dropdown.Item>
          <Dropdown.ItemIcon as={Copy} strokeWidth={2} />
          Дублировать
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item destructive>
          <Dropdown.ItemIcon as={Trash2} strokeWidth={2} />
          Удалить
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
