/** Item kinds: with icon and shortcut, disabled, `tone="danger"`, plus groups with labels and separators. Use as the reference for a document actions menu. */
import { Archive, Copy, FolderInput, Link2, Pencil, Trash2 } from "lucide-react";
import { Button, Dropdown } from "prime-ui-kit";

export default function DropdownVariantsExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Документ
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.GroupLabel>Правка</Dropdown.GroupLabel>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Pencil} />
            Переименовать
            <Dropdown.ItemShortcut>F2</Dropdown.ItemShortcut>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Copy} />
            Дублировать
            <Dropdown.ItemShortcut>⌘D</Dropdown.ItemShortcut>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={Link2} />
            Скопировать ссылку
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.GroupLabel>Хранение</Dropdown.GroupLabel>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={FolderInput} />
            Переместить…
          </Dropdown.Item>
          <Dropdown.Item disabled>
            <Dropdown.ItemIcon as={Archive} />
            Архивировать — нет прав
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Item tone="danger">
          <Dropdown.ItemIcon as={Trash2} />
          Удалить
          <Dropdown.ItemShortcut>⌫</Dropdown.ItemShortcut>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
