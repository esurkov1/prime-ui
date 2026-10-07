/** Users keep their own tag dictionary: the row «⋯» menu renames, recolors or deletes an option — `onOptionUpdate`, `onOptionDelete`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";
import * as React from "react";

const INITIAL_OPTIONS: TagSelectOption[] = [
  { value: "telegram", label: "Telegram", color: "blue" },
  { value: "whatsapp", label: "WhatsApp", color: "green" },
  { value: "email", label: "Почта", color: "purple" },
  { value: "phone", label: "Телефон", color: "orange" },
];

export default function TagSelectManageTagsExample() {
  const [options, setOptions] = React.useState(INITIAL_OPTIONS);

  return (
    <TagSelect
      label="Каналы связи"
      options={options}
      defaultValue={["telegram", "email"]}
      creatable
      onOptionUpdate={(value, updates) =>
        setOptions((prev) =>
          prev.some((option) => option.value === value)
            ? prev.map((option) => (option.value === value ? { ...option, ...updates } : option))
            : [...prev, { value, label: updates.label ?? value, color: updates.color }],
        )
      }
      onOptionDelete={(value) =>
        setOptions((prev) => prev.filter((option) => option.value !== value))
      }
      placeholder="Канал связи"
    />
  );
}
