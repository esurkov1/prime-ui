/** A controlled field with creatable tags and the row «⋯» menu to rename, recolor or delete options. Use it when users maintain their own tag dictionary. */
import { TagSelect, type TagSelectOption } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const initialOptions: TagSelectOption[] = [
  { value: "telegram", label: "Telegram", color: "blue" },
  { value: "whatsapp", label: "WhatsApp", color: "green" },
  { value: "email", label: "Почта", color: "purple" },
  { value: "phone", label: "Телефон", color: "orange" },
  { value: "viber", label: "Viber", color: "pink" },
  { value: "sms", label: "SMS", color: "teal" },
];

export default function TagSelectManageTagsExample() {
  const [value, setValue] = React.useState<string[]>([
    "telegram",
    "whatsapp",
    "email",
    "phone",
    "viber",
  ]);
  const [options, setOptions] = React.useState<TagSelectOption[]>(initialOptions);

  return (
    <div className={styles.column}>
      <TagSelect.Root
        options={options}
        value={value}
        onValueChange={setValue}
        creatable
        labels={{ panelHint: "Выберите канал или создайте новый", edit: "Изменить метку {label}" }}
        onOptionUpdate={(tagValue, updates) => {
          setOptions((prev) =>
            prev.some((o) => o.value === tagValue)
              ? prev.map((o) => (o.value === tagValue ? { ...o, ...updates } : o))
              : [
                  ...prev,
                  { value: tagValue, label: updates.label ?? tagValue, color: updates.color },
                ],
          );
        }}
        onOptionDelete={(tagValue) => {
          setOptions((prev) => prev.filter((o) => o.value !== tagValue));
        }}
        label="Каналы связи"
        hint="Фокус раскрывает все теги; ⋯ у строки — переименовать, сменить цвет или удалить"
        placeholder="Канал связи"
      />
    </div>
  );
}
