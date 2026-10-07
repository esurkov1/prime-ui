/** A regular, a disabled and a destructive item; arrow keys skip the disabled one — `disabled`, `tone`. */
import { Button, Dropdown, Icon } from "prime-ui-kit";

export default function DropdownStatesExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Документ
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.copy" />
          </Dropdown.ItemIcon>
          Дублировать
        </Dropdown.Item>
        <Dropdown.Item disabled>
          <Dropdown.ItemIcon>
            <Icon name="status.locked" />
          </Dropdown.ItemIcon>
          Архивировать — нет прав
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item tone="danger">
          <Dropdown.ItemIcon>
            <Icon name="action.delete" />
          </Dropdown.ItemIcon>
          Удалить
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
