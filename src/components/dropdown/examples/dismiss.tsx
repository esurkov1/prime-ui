/** An onboarding step keeps the menu open on an outside press and on Escape until an item is picked — `closeOnOutsideClick`, `closeOnEscape`. */
import { Button, Dropdown } from "prime-ui-kit";

export default function DropdownDismissExample() {
  return (
    <Dropdown.Root closeOnOutsideClick={false} closeOnEscape={false}>
      <Dropdown.Trigger>
        <Button.Root>Выберите роль в команде</Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Руководитель</Dropdown.Item>
        <Dropdown.Item>Менеджер проектов</Dropdown.Item>
        <Dropdown.Item>Бухгалтер</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
