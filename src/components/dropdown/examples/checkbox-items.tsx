/** A column chooser: toggles in the menu keep it open, the key column cannot be hidden — `Dropdown.CheckboxItem`, `checked`, `onCheckedChange`. */
import { Button, Dropdown, Icon } from "prime-ui-kit";
import * as React from "react";

const COLUMNS = [
  { id: "number", label: "Номер", locked: true },
  { id: "client", label: "Клиент", locked: false },
  { id: "status", label: "Статус", locked: false },
  { id: "amount", label: "Сумма", locked: false },
  { id: "due", label: "Срок оплаты", locked: false },
];

export default function DropdownCheckboxItemsExample() {
  const [hidden, setHidden] = React.useState<string[]>(["due"]);
  const shown = COLUMNS.length - hidden.length;

  const toggle = (id: string, visible: boolean) =>
    setHidden((list) => (visible ? list.filter((item) => item !== id) : [...list, id]));

  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <Icon name="action.settings" />
          </Button.Icon>
          Колонки: {shown} из {COLUMNS.length}
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group label="Показывать">
          {COLUMNS.map((column) => (
            <Dropdown.CheckboxItem
              key={column.id}
              checked={!hidden.includes(column.id)}
              disabled={column.locked}
              onCheckedChange={(visible) => toggle(column.id, visible)}
            >
              {column.label}
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Item onSelect={() => setHidden([])}>Показать все</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
