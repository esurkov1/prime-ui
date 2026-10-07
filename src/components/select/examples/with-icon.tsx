/** A leading icon in the trigger and an icon before every option label — `Select.TriggerIcon`, `Select.ItemIcon`. */
import { Icon, Select } from "prime-ui-kit";
import * as React from "react";

const ACCESS = [
  { value: "public", label: "Виден в поиске", icon: "action.search" },
  { value: "invite", label: "Только по приглашению", icon: "field.email" },
  { value: "private", label: "Только участники", icon: "status.locked" },
] as const;

export default function SelectWithIconExample() {
  const [access, setAccess] = React.useState<string>("invite");
  const selected = ACCESS.find((option) => option.value === access) ?? ACCESS[1];

  return (
    <Select.Root label="Доступ к проекту" value={access} onValueChange={setAccess}>
      <Select.Trigger>
        <Select.TriggerIcon>
          <Icon name={selected.icon} />
        </Select.TriggerIcon>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {ACCESS.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            <Select.ItemIcon>
              <Icon name={option.icon} />
            </Select.ItemIcon>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
