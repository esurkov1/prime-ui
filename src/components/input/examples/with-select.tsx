/** A menu section's icon and name as one field: an icon-only Select is the box's start segment — `Input.Wrapper`, `Select.Root`, `aria-label`. */
import { Icon, type IconName, Input, Select } from "prime-ui-kit";
import * as React from "react";

const ICONS: { value: IconName; label: string }[] = [
  { value: "object.package", label: "Склад" },
  { value: "object.truck", label: "Доставка" },
  { value: "object.receipt", label: "Счета" },
  { value: "object.users", label: "Клиенты" },
];

export default function InputWithSelectExample() {
  const [icon, setIcon] = React.useState<IconName>("object.truck");
  const [name, setName] = React.useState("Отгрузки");

  return (
    <Input.Root label="Раздел в меню" hint="Иконка и название видны в боковой панели">
      <Input.Wrapper>
        <Select.Root
          aria-label="Иконка раздела"
          value={icon}
          onValueChange={(next) => setIcon(next as IconName)}
        >
          <Select.Trigger>
            <Select.TriggerIcon>
              <Icon name={icon} />
            </Select.TriggerIcon>
          </Select.Trigger>
          <Select.Content>
            {ICONS.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemIcon>
                  <Icon name={option.value} />
                </Select.ItemIcon>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Input.Field value={name} onValueChange={setName} />
      </Input.Wrapper>
    </Input.Root>
  );
}
