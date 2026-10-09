/** A second line under an item: what an action does, and why a disabled one is unavailable, readable by everyone and read with the item — `Dropdown.ItemDescription`. */
import { Button, Dropdown, Icon } from "prime-ui-kit";

export default function DropdownItemDescriptionExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Проект
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.copy" />
          </Dropdown.ItemIcon>
          Дублировать
          <Dropdown.ItemDescription>Копия без задач и участников</Dropdown.ItemDescription>
        </Dropdown.Item>
        <Dropdown.Item disabled tone="danger">
          <Dropdown.ItemIcon>
            <Icon name="action.delete" />
          </Dropdown.ItemIcon>
          Удалить проект
          <Dropdown.ItemDescription>Доступно владельцу проекта</Dropdown.ItemDescription>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
