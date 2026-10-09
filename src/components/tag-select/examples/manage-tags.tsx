/** Users keep their own tag dictionary on the server: the row «⋯» menu renames, recolors or deletes an option, and «⋯» spins while a change is saved — `onOptionUpdate`, `onOptionDelete`. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";
import * as React from "react";

const INITIAL_OPTIONS: TagSelectOption[] = [
  { value: "chat", label: "Чат на сайте", color: "blue" },
  { value: "whatsapp", label: "WhatsApp", color: "green" },
  { value: "email", label: "Почта", color: "purple" },
  { value: "phone", label: "Телефон", color: "orange" },
];

/** The server saving a change of the dictionary, a beat later. */
const saveDictionary = () => new Promise<void>((resolve) => setTimeout(resolve, 600));

export default function TagSelectManageTagsExample() {
  const [options, setOptions] = React.useState(INITIAL_OPTIONS);

  return (
    <TagSelect
      label="Каналы связи"
      options={options}
      defaultValue={["chat", "email"]}
      creatable
      onOptionUpdate={async (value, updates) => {
        await saveDictionary();
        setOptions((prev) =>
          prev.some((option) => option.value === value)
            ? prev.map((option) => (option.value === value ? { ...option, ...updates } : option))
            : [...prev, { value, label: updates.label ?? value, color: updates.color }],
        );
      }}
      onOptionDelete={(value) =>
        setOptions((prev) => prev.filter((option) => option.value !== value))
      }
      placeholder="Канал связи"
    />
  );
}
