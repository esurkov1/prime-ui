/** Optional parts of an account menu: a header with an avatar, a labelled group, item icons, key hints and separators — `Dropdown.Header`, `Dropdown.Group`, `Dropdown.ItemIcon`, `Dropdown.ItemShortcut`. */
import { BookOpen, LogOut, Settings, UserRound } from "lucide-react";
import { Avatar, Badge, Button, Dropdown } from "prime-ui-kit";

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
              <UserRound />
            </Dropdown.ItemIcon>
            Профиль
            <Dropdown.ItemShortcut>⌘P</Dropdown.ItemShortcut>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <Settings />
            </Dropdown.ItemIcon>
            Настройки
            <Dropdown.ItemShortcut>⌘,</Dropdown.ItemShortcut>
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon>
              <BookOpen />
            </Dropdown.ItemIcon>
            Руководство
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Item>
          <Dropdown.ItemIcon>
            <LogOut />
          </Dropdown.ItemIcon>
          Выйти
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
