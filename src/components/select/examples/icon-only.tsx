/** An icon picker as wide as its glyph: the trigger holds only the picked icon and the chevron, the value is still read aloud — `Select.TriggerIcon`. */
import { Icon, type IconName, Select } from "prime-ui-kit";
import * as React from "react";

const ICONS: { value: IconName; label: string }[] = [
  { value: "object.package", label: "Склад" },
  { value: "object.truck", label: "Доставка" },
  { value: "object.receipt", label: "Счета" },
  { value: "object.users", label: "Клиенты" },
];

export default function SelectIconOnlyExample() {
  const [icon, setIcon] = React.useState<IconName>("object.truck");

  return (
    <Select.Root
      label="Иконка раздела"
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
  );
}
