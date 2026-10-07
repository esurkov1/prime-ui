/** Optional parts of an account menu: a header with an avatar, a labelled group, item icons, key hints and separators — `Dropdown.Header`, `Dropdown.Group`, `Dropdown.ItemIcon`, `Dropdown.ItemShortcut`. */
import { Avatar, Badge, Button, Dropdown, Icon } from "prime-ui-kit";

export default function DropdownStructureExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Анна Петрова
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align="end">
        <Dropdown.Header>
          <Avatar.Root size="l">
            <Avatar.Fallback>АП</Avatar.Fallback>
          </Avatar.Root>
          <Dropdown.Title>Анна Петрова</Dropdown.Title>
          <Dropdown.Description>anna.petrova@example.com</Dropdown.Description>
          <Badge.Root color="purple" size="s">
            PRO
          </Badge.Root>
        </Dropdown.Header>
        <Dropdown.Separator />
        <Dropdown.Group label="Аккаунт">
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <Icon name="object.user" />
            </Dropdown.ItemIcon>
            Профиль
            <Dropdown.ItemShortcut>⌘P</Dropdown.ItemShortcut>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <Icon name="action.settings" />
            </Dropdown.ItemIcon>
            Настройки
            <Dropdown.ItemShortcut>⌘,</Dropdown.ItemShortcut>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <Icon name="object.book" />
            </Dropdown.ItemIcon>
            Руководство
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <Icon name="action.logout" />
          </Dropdown.ItemIcon>
          Выйти
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
